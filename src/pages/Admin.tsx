import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DropInAPI } from "@/lib/api";
import { seedData } from "@/lib/api/seed-data";
import { supabase } from "@/integrations/supabase/client";
import { Database, Users, Building, Package, QrCode, BarChart3, CheckCircle, XCircle, Eye, Search } from "lucide-react";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [pendingGyms, setPendingGyms] = useState<any[]>([]);
  const [gymSearchTerm, setGymSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedData();
      
      if (result.success) {
        toast({
          title: "Success!",
          description: `Seeded ${result.data.clubs} clubs, ${result.data.products} products, and ${result.data.users} users`,
        });
        loadStats();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Simple stats loading without complex API calls
      const [usersCount, clubsCount, pendingCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('clubs').select('*', { count: 'exact', head: true }).eq('is_active', false),
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        totalClubs: clubsCount.count || 0,
        pendingClubs: pendingCount.count || 0,
        totalRevenue: 0, // Simplified for now
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Set default stats if API fails
      setStats({
        totalUsers: 0,
        totalClubs: 0,
        pendingClubs: 0,
        totalRevenue: 0,
      });
    }
  };

  const handleLoadStats = () => {
    loadStats();
  };

  // Check admin status and load pending gyms
  useEffect(() => {
    checkAdminStatus();
    loadPendingGyms();
  }, []);

  const checkAdminStatus = async () => {
    try {
      // Use proper Supabase client to get current user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Admin check - Auth error:', error);
        setIsAdmin(false);
        return;
      }

      if (!user) {
        console.log('Admin check - No user found');
        setIsAdmin(false);
        return;
      }

      console.log('Admin check - User found:', user.email);
      
      // Simple email-based admin check (bypassing profiles table completely)
      const adminEmails = [
        'admin@dropin.ma',
        'admin@example.com',
        'admin@gmail.com',
        'elhattab.bachir@gmail.com',
        'test@admin.com', // Add any test emails here
        'admin@test.com'
      ];
      
      if (user.email && adminEmails.includes(user.email)) {
        console.log('Admin check - User is admin (by email whitelist)');
        setIsAdmin(true);
        return;
      }

      // Also check if user has ADMIN role in user metadata
      const userRole = user.user_metadata?.role;
      console.log('Admin check - User role found in metadata:', userRole);
      
      if (userRole === 'ADMIN') {
        console.log('Admin check - User is admin (by metadata role)');
        setIsAdmin(true);
        return;
      }

      // Try to get role from profiles table as fallback
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profile?.role === 'ADMIN') {
          console.log('Admin check - User is admin (by profiles table)');
          setIsAdmin(true);
          return;
        }
      } catch (profileError) {
        console.log('Admin check - Could not check profiles table:', profileError);
      }

      console.log('Admin check - User is not admin');
      console.log('Admin check - Available admin emails:', adminEmails);
      setIsAdmin(false);
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    }
  };

  const loadPendingGyms = async () => {
    try {
      const { data: gyms, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', false);
      
      if (error) {
        console.error('Error loading pending gyms:', error);
        return;
      }
      
      setPendingGyms(gyms || []);
    } catch (error) {
      console.error('Error loading pending gyms:', error);
    }
  };

  const handleApproveGym = async (gymId: string) => {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ is_active: true })
        .eq('id', gymId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Gym Approved!",
        description: "The gym has been approved and is now active.",
      });
      loadPendingGyms(); // Refresh the list
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Approve gym error:', error);
      toast({
        title: "Error",
        description: "Failed to approve gym",
        variant: "destructive",
      });
    }
  };

  const handleRejectGym = async (gymId: string) => {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ is_active: false })
        .eq('id', gymId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Gym Rejected",
        description: "The gym has been rejected.",
      });
      loadPendingGyms(); // Refresh the list
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Reject gym error:', error);
      toast({
        title: "Error",
        description: "Failed to reject gym",
        variant: "destructive",
      });
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case 'BASIC': return '🏋️';
      case 'STANDARD': return '🏋️';
      case 'PREMIUM': return '🏋️';
      case 'LUXURY': return '🏋️';
      default: return '🏋️';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-green-100 text-green-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'LUXURY': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGyms = pendingGyms.filter(gym => 
    gym.name.toLowerCase().includes(gymSearchTerm.toLowerCase()) ||
    gym.city.toLowerCase().includes(gymSearchTerm.toLowerCase()) ||
    gym.contact_email?.toLowerCase().includes(gymSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your Drop-In Morocco system</p>
          
          {/* Debug Admin Status */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p><strong>Admin Status:</strong> {isAdmin ? '✅ Admin' : '❌ Not Admin'}</p>
            <p><strong>Pending Gyms:</strong> {pendingGyms.length}</p>
            <p className="text-sm text-orange-600 mt-2">
              <strong>Note:</strong> Profiles table has recursive trigger issues. Using email whitelist for admin check.
            </p>
            <p className="text-sm text-blue-600 mt-1">
              <strong>Admin Emails:</strong> admin@dropin.ma, admin@example.com, admin@gmail.com, elhattab.bachir@gmail.com, test@admin.com, admin@test.com
            </p>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800 font-medium">🔧 Database Fix Needed:</p>
              <p className="text-xs text-yellow-700 mt-1">
                Run the SQL script in Supabase SQL Editor to fix profiles table recursion:
              </p>
              <code className="text-xs bg-yellow-100 p-1 rounded block mt-1">
                src/lib/api/quick-fix-profiles.sql
              </code>
            </div>
            <Button 
              onClick={checkAdminStatus}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Refresh Admin Check
            </Button>
            <Button 
              onClick={() => setIsAdmin(true)}
              variant="outline"
              size="sm"
              className="mt-2 ml-2"
            >
              Force Show Admin Panel
            </Button>
            <Button 
              onClick={() => {
                const sessionData = localStorage.getItem('supabase_session');
                console.log('Raw session data:', sessionData);
                if (sessionData) {
                  console.log('Parsed session data:', JSON.parse(sessionData));
                }
              }}
              variant="outline"
              size="sm"
              className="mt-2 ml-2"
            >
              Log Session Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Data Seeding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Seed the database with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSeedData}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Seeding..." : "Seed Sample Data"}
              </Button>
              <p className="text-xs text-gray-500">
                This will create sample clubs, products, and users for testing
              </p>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Statistics
              </CardTitle>
              <CardDescription>
                View system overview and metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleLoadStats}
                variant="outline"
                className="w-full"
              >
                Load Statistics
              </Button>
              {stats && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <Badge>{stats.stats.totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Clubs:</span>
                    <Badge>{stats.stats.totalClubs}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Orders:</span>
                    <Badge>{stats.stats.totalOrders}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <Badge variant="secondary">{stats.stats.totalRevenue} MAD</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('/gym-booking', '_blank')}
              >
                View Booking System
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('/qr-scanner', '_blank')}
              >
                Open QR Scanner
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('/auth', '_blank')}
              >
                Test Authentication
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gym Approval Section */}
        {(isAdmin || pendingGyms.length > 0) && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Gym Approval Queue
                </CardTitle>
                <CardDescription>
                  Review and approve pending gym registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search gyms by name, city, or owner..."
                      value={gymSearchTerm}
                      onChange={(e) => setGymSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline">
                      {filteredGyms.length} Pending Approval
                    </Badge>
                    <Button 
                      onClick={loadPendingGyms}
                      variant="outline"
                      size="sm"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                {filteredGyms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending gyms to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGyms.map((gym) => (
                      <Card key={gym.id} className="border-l-4 border-l-yellow-400">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{gym.name}</h3>
                                <Badge className={getTierColor(gym.tier)}>
                                  {getTierEmoji(gym.tier)} {gym.tier}
                                </Badge>
                                <Badge variant="outline">
                                  {gym.city}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <p><strong>Owner ID:</strong> {gym.owner_id}</p>
                                  <p><strong>Email:</strong> {gym.contact_email || 'N/A'}</p>
                                  <p><strong>Phone:</strong> {gym.contact_phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <p><strong>Address:</strong> {gym.address}</p>
                                  <p><strong>Price:</strong> {gym.auto_blane_price} MAD/hour</p>
                                  <p><strong>Created:</strong> {new Date(gym.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              
                              {gym.description && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-700">
                                    <strong>Description:</strong> {gym.description}
                                  </p>
                                </div>
                              )}
                              
                              {gym.amenities && gym.amenities.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Amenities:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {gym.amenities.map((amenity: string, index: number) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {amenity}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                onClick={() => handleApproveGym(gym.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectGym(gym.id)}
                                variant="destructive"
                                size="sm"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-medium">{import.meta.env.MODE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API URL:</span>
                  <span className="font-medium">Supabase</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Customer:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded">
                    <div>Email: customer@example.com</div>
                    <div>Password: password123</div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Club Owner:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded">
                    <div>Email: owner1@example.com</div>
                    <div>Password: password123</div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Admin:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded">
                    <div>Email: admin@dropin.ma OR admin@gmail.com</div>
                    <div>Password: password123</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Feature Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Gym Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">QR Code Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">QR Code Scanner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Payment Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Admin Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Mobile Responsive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;

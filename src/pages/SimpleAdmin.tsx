import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building, CheckCircle, XCircle, Eye, Search, Users, BarChart3 } from "lucide-react";

const SimpleAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [pendingGyms, setPendingGyms] = useState<any[]>([]);
  const [gymSearchTerm, setGymSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check admin status
  useEffect(() => {
    checkAdminStatus();
    loadPendingGyms();
  }, []);

  const checkAdminStatus = async () => {
    try {
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

      setUser(user);
      console.log('Admin check - User found:', user.email);
      
      // Simple email-based admin check
      const adminEmails = [
        'admin@dropin.ma',
        'admin@example.com',
        'admin@gmail.com',
        'elhattab.bachir@gmail.com',
        'test@admin.com',
        'admin@test.com'
      ];
      
      if (user.email && adminEmails.includes(user.email)) {
        console.log('Admin check - User is admin (by email whitelist)');
        setIsAdmin(true);
        return;
      }

      console.log('Admin check - User is not admin');
      setIsAdmin(false);
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    }
  };

  const loadPendingGyms = async () => {
    try {
      console.log('Loading pending gyms...');
      const { data: gyms, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', false);
      
      if (error) {
        console.error('Error loading pending gyms:', error);
        toast({
          title: "Error",
          description: `Failed to load gyms: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Loaded pending gyms:', gyms?.length || 0);
      setPendingGyms(gyms || []);
    } catch (error) {
      console.error('Error loading pending gyms:', error);
      toast({
        title: "Error",
        description: "Failed to load gyms",
        variant: "destructive",
      });
    }
  };

  const handleApproveGym = async (gymId: string) => {
    try {
      setLoading(true);
      console.log('Approving gym:', gymId);
      
      const { error } = await supabase
        .from('clubs')
        .update({ is_active: true })
        .eq('id', gymId);
      
      if (error) {
        console.error('Approve gym error:', error);
        throw error;
      }
      
      toast({
        title: "Gym Approved!",
        description: "The gym has been approved and is now active.",
      });
      
      // Refresh the list
      await loadPendingGyms();
    } catch (error) {
      console.error('Approve gym error:', error);
      toast({
        title: "Error",
        description: "Failed to approve gym",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectGym = async (gymId: string) => {
    try {
      setLoading(true);
      console.log('Rejecting gym:', gymId);
      
      const { error } = await supabase
        .from('clubs')
        .update({ is_active: false })
        .eq('id', gymId);
      
      if (error) {
        console.error('Reject gym error:', error);
        throw error;
      }
      
      toast({
        title: "Gym Rejected",
        description: "The gym has been rejected.",
      });
      
      // Refresh the list
      await loadPendingGyms();
    } catch (error) {
      console.error('Reject gym error:', error);
      toast({
        title: "Error",
        description: "Failed to reject gym",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case 'BASIC': return '🏋️';
      case 'STANDARD': return '🏋️‍♂️';
      case 'PREMIUM': return '💪';
      case 'LUXURY': return '👑';
      default: return '🏋️';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-blue-100 text-blue-800';
      case 'STANDARD': return 'bg-green-100 text-green-800';
      case 'PREMIUM': return 'bg-orange-100 text-orange-800';
      case 'LUXURY': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGyms = pendingGyms.filter(gym =>
    gym.name?.toLowerCase().includes(gymSearchTerm.toLowerCase()) ||
    gym.address?.toLowerCase().includes(gymSearchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-6 h-6" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                You need admin privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Current User:</h3>
                  <p className="text-sm text-gray-600">
                    {user ? user.email : 'Not logged in'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Admin Emails:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• admin@dropin.ma</li>
                    <li>• admin@example.com</li>
                    <li>• admin@gmail.com</li>
                    <li>• elhattab.bachir@gmail.com</li>
                    <li>• test@admin.com</li>
                    <li>• admin@test.com</li>
                  </ul>
                </div>
                
                <Button onClick={checkAdminStatus} className="mt-4">
                  Check Admin Status Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage gym approvals and system settings
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Logged in as: {user?.email}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gyms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingGyms.length}</div>
              <p className="text-xs text-muted-foreground">
                Pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                System users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Total revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Gyms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Pending Gym Approvals
            </CardTitle>
            <CardDescription>
              Review and approve new gym applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <Label htmlFor="search">Search Gyms</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or address..."
                  value={gymSearchTerm}
                  onChange={(e) => setGymSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Gyms List */}
            <div className="space-y-4">
              {filteredGyms.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No pending gyms
                  </h3>
                  <p className="text-gray-600">
                    {gymSearchTerm ? 'No gyms match your search.' : 'All gyms have been reviewed.'}
                  </p>
                </div>
              ) : (
                filteredGyms.map((gym) => (
                  <div key={gym.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {getTierEmoji(gym.tier)} {gym.name}
                          </h3>
                          <Badge className={getTierColor(gym.tier)}>
                            {gym.tier}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">📍 Address:</span>
                            <span>{gym.address || 'No address provided'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium">💰 Price:</span>
                            <span>{gym.auto_blane_price || gym.price_per_hour || 'Not set'} MAD/hour</span>
                          </div>
                          
                          {gym.description && (
                            <div className="flex items-start gap-2">
                              <span className="font-medium">📝 Description:</span>
                              <span className="flex-1">{gym.description}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium">📅 Created:</span>
                            <span>{new Date(gym.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col gap-2">
                        <Button
                          onClick={() => handleApproveGym(gym.id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        
                        <Button
                          onClick={() => handleRejectGym(gym.id)}
                          disabled={loading}
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleAdmin;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DropInAPI } from "@/lib/api";
import { seedData } from "@/lib/api/seed-data";
import { Database, Users, Building, Package, QrCode, BarChart3 } from "lucide-react";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
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
      const dashboardData = await DropInAPI.getAdminDashboard();
      setStats(dashboardData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLoadStats = () => {
    loadStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your Drop-In Morocco system</p>
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
                    <div>Email: admin@dropin.ma</div>
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

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const RoleManager = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState<'CUSTOMER' | 'CLUB_OWNER' | 'ADMIN'>('CUSTOMER');
  const { toast } = useToast();

  const updateUserRole = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Updating user role to:', newRole);
      
      // Update both profiles table and user metadata
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (profileError) {
        console.error('❌ Profiles table update error:', profileError);
        toast({
          title: "Error",
          description: `Profiles table error: ${profileError.message}`,
          variant: "destructive",
        });
        return;
      }

      // Also update user metadata as backup
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          role: newRole,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
        }
      });

      if (metadataError) {
        console.error('❌ Metadata update error:', metadataError);
        // Don't fail completely, profiles table update succeeded
      }

      console.log('✅ Role updated successfully');
      toast({
        title: "Success!",
        description: `Role updated to ${newRole}. Please refresh the page.`,
      });
      
      // Force a page reload to update the auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Role update exception:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestOwner = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'owner@test.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test Owner',
            phone: '+212600000000',
            role: 'CLUB_OWNER',
            gym_name: 'Test Gym'
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Test owner created! Check email for confirmation.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create test owner",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Role Manager</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current User Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
              <p><strong>Current Role:</strong> {userRole || 'No role set'}</p>
              <p><strong>Full Name:</strong> {user?.user_metadata?.full_name || 'Not set'}</p>
              <p><strong>Phone:</strong> {user?.user_metadata?.phone || 'Not set'}</p>
            </div>
            <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto mt-4">
              {user ? JSON.stringify(user.user_metadata, null, 2) : 'No user data'}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Update Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="role">Select New Role</Label>
              <Select value={newRole} onValueChange={(value: 'CUSTOMER' | 'CLUB_OWNER' | 'ADMIN') => setNewRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">👤 Customer</SelectItem>
                  <SelectItem value="CLUB_OWNER">🏢 Gym Owner</SelectItem>
                  <SelectItem value="ADMIN">👑 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={updateUserRole} 
              disabled={loading || !user}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={createTestOwner} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Create Test Owner Account
            </Button>
            
            <div className="text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>If you're logged in as a customer, select "Gym Owner" and click "Update Role"</li>
                <li>Or create a new test owner account</li>
                <li>After updating, refresh the page to see changes</li>
                <li>Check the header - should show "Dashboard" link for owners</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleManager;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { DropInAPI } from '@/lib/api';

const AdminTest = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingGyms, setPendingGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUserAndAdminStatus();
    loadPendingGyms();
  }, []);

  const checkUserAndAdminStatus = async () => {
    try {
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth error:', error);
        return;
      }

      setUser(user);

      if (!user) {
        setIsAdmin(false);
        return;
      }

      console.log('Current user:', user.email);

      // Check admin status using the same logic as Admin.tsx
      const adminEmails = [
        'admin@dropin.ma',
        'admin@example.com',
        'admin@gmail.com',
        'elhattab.bachir@gmail.com',
        'test@admin.com',
        'admin@test.com'
      ];
      
      if (user.email && adminEmails.includes(user.email)) {
        setIsAdmin(true);
        return;
      }

      // Check user metadata role
      const userRole = user.user_metadata?.role;
      if (userRole === 'ADMIN') {
        setIsAdmin(true);
        return;
      }

      // Check profiles table
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profile?.role === 'ADMIN') {
          setIsAdmin(true);
          return;
        }
      } catch (profileError) {
        console.log('Could not check profiles table:', profileError);
      }

      setIsAdmin(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
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
    setLoading(true);
    try {
      await DropInAPI.admin.updateClubStatus(gymId, true);
      alert('Gym approved successfully!');
      loadPendingGyms(); // Refresh the list
    } catch (error) {
      console.error('Error approving gym:', error);
      alert('Failed to approve gym');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectGym = async (gymId: string) => {
    setLoading(true);
    try {
      await DropInAPI.admin.updateClubStatus(gymId, false);
      alert('Gym rejected successfully!');
      loadPendingGyms(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting gym:', error);
      alert('Failed to reject gym');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Test Page</h1>
          <p className="text-lg text-gray-600">Test admin functionality and gym management</p>
        </div>

        {/* User Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current User Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Role in metadata:</strong> {user.user_metadata?.role || 'None'}</p>
                <Badge variant={isAdmin ? "default" : "destructive"}>
                  {isAdmin ? '✅ Admin' : '❌ Not Admin'}
                </Badge>
              </div>
            ) : (
              <p>No user logged in</p>
            )}
          </CardContent>
        </Card>

        {/* Admin Actions */}
        {isAdmin ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={checkUserAndAdminStatus} variant="outline">
                  Refresh Admin Status
                </Button>
                <Button onClick={loadPendingGyms} variant="outline">
                  Refresh Pending Gyms
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">
                You need admin privileges to access this functionality.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 font-medium">Admin Emails:</p>
                <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                  <li>admin@dropin.ma</li>
                  <li>admin@example.com</li>
                  <li>admin@gmail.com</li>
                  <li>elhattab.bachir@gmail.com</li>
                  <li>test@admin.com</li>
                  <li>admin@test.com</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Gyms */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Gyms ({pendingGyms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingGyms.length === 0 ? (
                <p>No pending gyms to review.</p>
              ) : (
                <div className="space-y-4">
                  {pendingGyms.map((gym) => (
                    <div key={gym.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{gym.name}</h3>
                      <p className="text-sm text-gray-600">{gym.address}</p>
                      <p className="text-sm text-gray-600">Tier: {gym.tier}</p>
                      <div className="mt-3 space-x-2">
                        <Button
                          onClick={() => handleApproveGym(gym.id)}
                          disabled={loading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectGym(gym.id)}
                          disabled={loading}
                          size="sm"
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminTest;

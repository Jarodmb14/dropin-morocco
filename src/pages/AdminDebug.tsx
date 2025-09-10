import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDebug() {
  const { user, userRole, isAdmin } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkProfile();
    }
  }, [user]);

  const checkProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile query result:', { data, error });
      setProfileData({ data, error });
    } catch (err) {
      console.error('Profile check error:', err);
      setProfileData({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_role: 'ADMIN' })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        alert('Error updating role: ' + error.message);
      } else {
        alert('Role updated successfully! Please refresh the page.');
        window.location.reload();
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle>Admin Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">User Information:</h3>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>AuthContext Role:</strong> {userRole}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? 'YES' : 'NO'}</p>
            </div>

            <div>
              <h3 className="font-semibold">Database Profile:</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <p><strong>Profile Data:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(profileData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={checkProfile} variant="outline">
                Refresh Profile Data
              </Button>
              <Button onClick={updateUserRole} className="bg-red-500 hover:bg-red-600">
                Set Role to ADMIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SimpleAdminDebug() {
  const { user, userRole, isAdmin } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      checkProfile();
      loadAllProfiles();
    }
  }, [user, refreshKey]);

  const checkProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Checking profile for user ID:', user.id);
      
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

  const loadAllProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);

      console.log('All profiles:', { data, error });
      setAllProfiles(data || []);
    } catch (err) {
      console.error('Error loading profiles:', err);
    }
  };

  const updateUserRole = async () => {
    if (!user) return;
    
    try {
      console.log('Updating role for user:', user.id);
      
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

  const createProfile = async () => {
    if (!user) return;
    
    try {
      console.log('Creating profile for user:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          user_role: 'ADMIN',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating profile:', error);
        alert('Error creating profile: ' + error.message);
      } else {
        alert('Profile created successfully! Please refresh the page.');
        window.location.reload();
      }
    } catch (err) {
      console.error('Create error:', err);
      alert('Error: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle>Simple Admin Debug</CardTitle>
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
              <h3 className="font-semibold">Your Profile Data:</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
                    {JSON.stringify(profileData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold">All Profiles (first 10):</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(allProfiles, null, 2)}
              </pre>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button onClick={checkProfile} variant="outline">
                Refresh Profile Data
              </Button>
              <Button onClick={loadAllProfiles} variant="outline">
                Load All Profiles
              </Button>
              <Button onClick={() => setRefreshKey(prev => prev + 1)} variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white">
                Refresh AuthContext
              </Button>
              <Button onClick={updateUserRole} className="bg-red-500 hover:bg-red-600">
                Set Role to ADMIN
              </Button>
              <Button onClick={createProfile} className="bg-green-500 hover:bg-green-600">
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
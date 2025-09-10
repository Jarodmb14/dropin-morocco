import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QuickRoleTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRoleQuery = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setResult({ error: 'No user found' });
        return;
      }

      console.log('Testing role query for user:', user.id);

      // Query profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Role test result:', { data, error });

      setResult({
        userId: user.id,
        email: user.email,
        profileData: data,
        error: error,
        userRole: data?.user_role,
        isAdmin: data?.user_role === 'ADMIN'
      });

    } catch (err) {
      console.error('Role test error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const forceAdminRole = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setResult({ error: 'No user found' });
        return;
      }

      // Update role to ADMIN
      const { error } = await supabase
        .from('profiles')
        .update({ user_role: 'ADMIN' })
        .eq('id', user.id);

      if (error) {
        setResult({ error: error.message });
      } else {
        setResult({ success: 'Role updated to ADMIN successfully!' });
        // Test again
        setTimeout(() => testRoleQuery(), 1000);
      }

    } catch (err) {
      console.error('Force admin error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle>Quick Role Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testRoleQuery} disabled={loading}>
                {loading ? 'Testing...' : 'Test Role Query'}
              </Button>
              <Button onClick={forceAdminRole} disabled={loading} className="bg-red-500 hover:bg-red-600">
                {loading ? 'Updating...' : 'Force ADMIN Role'}
              </Button>
            </div>

            {result && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

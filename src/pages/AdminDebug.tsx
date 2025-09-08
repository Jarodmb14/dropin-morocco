import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const AdminDebug = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    checkAuthStatus();
    loadLocalStorageData();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('User check result:', { user, userError });
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check result:', { session, sessionError });

      setUser(user);
      setSession(session);

      // Check admin status
      if (user) {
        const adminEmails = [
          'admin@dropin.ma',
          'admin@example.com',
          'admin@gmail.com',
          'elhattab.bachir@gmail.com',
          'test@admin.com',
          'admin@test.com'
        ];
        
        let adminStatus = false;
        let adminMethod = '';

        // Method 1: Email whitelist
        if (user.email && adminEmails.includes(user.email)) {
          adminStatus = true;
          adminMethod = 'Email whitelist';
        }

        // Method 2: User metadata role
        if (!adminStatus && user.user_metadata?.role === 'ADMIN') {
          adminStatus = true;
          adminMethod = 'User metadata role';
        }

        // Method 3: Profiles table
        if (!adminStatus) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();
            
            if (!profileError && profile?.role === 'ADMIN') {
              adminStatus = true;
              adminMethod = 'Profiles table';
            }
          } catch (profileError) {
            console.log('Profiles table check failed:', profileError);
          }
        }

        setIsAdmin(adminStatus);
        setDebugInfo({
          userEmail: user.email,
          userId: user.id,
          userMetadata: user.user_metadata,
          adminMethod,
          adminEmails,
          sessionExists: !!session,
          sessionUser: session?.user?.email
        });
      } else {
        setIsAdmin(false);
        setDebugInfo({
          error: 'No user found',
          userError: userError?.message,
          sessionError: sessionError?.message
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setDebugInfo({ error: error.message });
    }
  };

  const loadLocalStorageData = () => {
    const keys = Object.keys(localStorage);
    const data: any = {};
    
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    });
    
    setLocalStorageData(data);
  };

  const signInAsTestAdmin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@test.com',
        password: 'password123' // You'll need to set this password
      });
      
      if (error) {
        alert(`Sign in failed: ${error.message}`);
      } else {
        alert('Signed in successfully!');
        checkAuthStatus();
      }
    } catch (error) {
      alert(`Sign in error: ${error}`);
    }
  };

  const createTestAdmin = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@test.com',
        password: 'password123',
        options: {
          data: {
            role: 'ADMIN'
          }
        }
      });
      
      if (error) {
        alert(`Sign up failed: ${error.message}`);
      } else {
        alert('Test admin user created! Check your email for confirmation.');
      }
    } catch (error) {
      alert(`Sign up error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Debug Page</h1>
          <p className="text-lg text-gray-600">Debug admin authentication issues</p>
        </div>

        {/* Current Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
              <p><strong>Session:</strong> {session ? 'Active' : 'No session'}</p>
              <Badge variant={isAdmin ? "default" : "destructive"}>
                {isAdmin ? '✅ Admin Access' : '❌ No Admin Access'}
              </Badge>
              {debugInfo.adminMethod && (
                <p><strong>Admin Method:</strong> {debugInfo.adminMethod}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Local Storage Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Local Storage Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
              <Button onClick={checkAuthStatus} variant="outline">
                Refresh Status
              </Button>
              <Button onClick={loadLocalStorageData} variant="outline">
                Refresh Local Storage
              </Button>
              <Button onClick={createTestAdmin} variant="outline">
                Create Test Admin
              </Button>
              <Button onClick={signInAsTestAdmin} variant="outline">
                Sign In as Test Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Emails */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Email Whitelist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              <li>admin@dropin.ma</li>
              <li>admin@example.com</li>
              <li>admin@gmail.com</li>
              <li>elhattab.bachir@gmail.com</li>
              <li>test@admin.com</li>
              <li>admin@test.com</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              If you're logged in with any of these emails, you should have admin access.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDebug;

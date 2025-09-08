import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const SimpleAdminDebug = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string>('');
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    checkBasicAuth();
    loadLocalStorageData();
  }, []);

  const checkBasicAuth = async () => {
    try {
      setError('');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setError(`User error: ${userError.message}`);
        return;
      }

      setUser(user);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setError(`Session error: ${sessionError.message}`);
        return;
      }

      setSession(session);

      // Simple admin check based on email whitelist
      if (user?.email) {
        const adminEmails = [
          'admin@dropin.ma',
          'admin@example.com',
          'admin@gmail.com',
          'elhattab.bachir@gmail.com',
          'test@admin.com',
          'admin@test.com'
        ];
        
        setIsAdmin(adminEmails.includes(user.email));
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setError(`Auth check error: ${err}`);
    }
  };

  const loadLocalStorageData = () => {
    const keys = Object.keys(localStorage);
    const data: any = {};
    
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = JSON.parse(value);
          }
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    });
    
    setLocalStorageData(data);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setError('');
      loadLocalStorageData();
    } catch (err) {
      setError(`Sign out error: ${err}`);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      setError('');
      
      // Simple test query
      const { data, error } = await supabase
        .from('clubs')
        .select('id, name')
        .limit(1);
      
      if (error) {
        setError(`Database error: ${error.message}`);
      } else {
        setError(`Database OK - Found ${data?.length || 0} clubs`);
      }
    } catch (err) {
      setError(`Database test error: ${err}`);
    }
  };

  const createTestAdmin = async () => {
    try {
      setError('');
      
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
        setError(`Sign up error: ${error.message}`);
      } else {
        setError('Test admin created! Check email for confirmation.');
      }
    } catch (err) {
      setError(`Sign up error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Simple Admin Debug</h1>
          <p className="text-lg text-gray-600">Basic admin authentication debug</p>
        </div>

        {/* Status */}
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
              {error && (
                <p className="text-red-600"><strong>Error:</strong> {error}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4 space-y-2">
              <Button onClick={checkBasicAuth} variant="outline">
                Refresh Status
              </Button>
              <Button onClick={testDatabaseConnection} variant="outline">
                Test Database
              </Button>
              <Button onClick={createTestAdmin} variant="outline">
                Create Test Admin
              </Button>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Emails */}
        <Card className="mb-6">
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

        {/* Local Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Local Storage Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleAdminDebug;

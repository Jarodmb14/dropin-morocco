import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AuthDebug = () => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = () => {
    // Try multiple session storage keys
    let session = localStorage.getItem('supabase_session');
    if (!session) {
      session = localStorage.getItem('sb-obqhxrqpxoaiublaoidv-auth-token');
    }
    if (!session) {
      session = localStorage.getItem('supabase.auth.token');
    }
    
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setSessionData(parsed);
        
        const email = parsed.user?.email || 
                     parsed.current_user?.email || 
                     parsed.user_metadata?.email || 
                     parsed.email ||
                     parsed.user?.user_metadata?.email;
        setUserEmail(email || 'No email found');
        
        // Check if admin
        const adminEmails = [
          'admin@dropin.ma',
          'admin@example.com',
          'admin@gmail.com',
          'elhattab.bachir@gmail.com',
          'test@admin.com',
          'admin@test.com'
        ];
        
        const userRole = parsed.user?.user_metadata?.role || parsed.user_metadata?.role || parsed.user?.role;
        
        if (email && adminEmails.includes(email)) {
          setIsAdmin(true);
        } else if (userRole === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        setSessionData(null);
        setUserEmail('Error parsing session');
        setIsAdmin(false);
      }
    } else {
      setSessionData(null);
      setUserEmail('No session data');
      setIsAdmin(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('sb-obqhxrqpxoaiublaoidv-auth-token');
    localStorage.removeItem('supabase.auth.token');
    setSessionData(null);
    setUserEmail('');
    setIsAdmin(false);
  };

  const createTestSession = () => {
    const testSession = {
      user: {
        id: 'test-admin-id',
        email: 'admin@gmail.com',
        user_metadata: {
          role: 'ADMIN'
        }
      },
      access_token: 'test-token',
      refresh_token: 'test-refresh'
    };
    
    localStorage.setItem('supabase_session', JSON.stringify(testSession));
    loadSessionData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>User Email:</strong> {userEmail}
                </div>
                <div>
                  <strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}
                </div>
                <div>
                  <strong>Session Exists:</strong> {sessionData ? '✅ Yes' : '❌ No'}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={loadSessionData} variant="outline">
                    Refresh Session
                  </Button>
                  <Button onClick={clearSession} variant="destructive">
                    Clear Session
                  </Button>
                  <Button onClick={createTestSession} variant="default">
                    Create Test Admin Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Session Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {sessionData ? JSON.stringify(sessionData, null, 2) : 'No session data'}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>If you're logged in as admin, you should see:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li>User Email: admin@gmail.com (or another admin email)</li>
                  <li>Is Admin: ✅ Yes</li>
                  <li>Session Exists: ✅ Yes</li>
                </ul>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800 font-medium">🚀 Quick Fix:</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Click "Create Test Admin Session" to simulate being logged in as admin@gmail.com
                  </p>
                </div>
                
                <div className="mt-4">
                  <Button 
                    onClick={() => window.location.href = '/admin'}
                    disabled={!isAdmin}
                    className="w-full"
                  >
                    {isAdmin ? 'Go to Admin Dashboard' : 'Login as Admin First'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;

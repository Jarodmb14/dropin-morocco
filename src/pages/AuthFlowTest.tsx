import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthFlowTest = () => {
  const { user, userRole, signOut, signIn } = useAuth();
  const [email, setEmail] = useState('testuser@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      addResult('Starting login test...');
      const { error } = await signIn(email, password);
      
      if (error) {
        addResult(`Login failed: ${error.message}`);
        addResult('Try creating a new user first or check credentials');
      } else {
        addResult('Login successful!');
      }
    } catch (error) {
      addResult(`Login error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      addResult('Starting sign up test...');
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: 'CUSTOMER'
          }
        }
      });
      
      if (error) {
        addResult(`Sign up failed: ${error.message}`);
      } else {
        addResult('Sign up successful! Check your email for confirmation.');
      }
    } catch (error) {
      addResult(`Sign up error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignOut = async () => {
    setLoading(true);
    try {
      addResult('Starting sign out test...');
      await signOut();
      addResult('Sign out completed!');
    } catch (error) {
      addResult(`Sign out error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSessionPersistence = () => {
    addResult('Testing session persistence...');
    addResult('Refresh the page now to test persistence');
  };

  const checkAuthState = () => {
    addResult(`Current user: ${user ? user.email : 'None'}`);
    addResult(`Current role: ${userRole || 'None'}`);
    addResult(`localStorage keys: ${Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-')).length}`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  useEffect(() => {
    addResult('AuthFlowTest component loaded');
    checkAuthState();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Flow Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
                <p><strong>Role:</strong> {userRole || 'No role'}</p>
                <p><strong>User ID:</strong> {user ? user.id : 'N/A'}</p>
                <p><strong>Session:</strong> {user ? 'Active' : 'None'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Quick Test Credentials:</strong></p>
                <button 
                  onClick={() => { setEmail('testuser@gmail.com'); setPassword('password123'); }}
                  className="text-blue-600 hover:underline"
                >
                  testuser@gmail.com / password123
                </button>
                <br />
                <button 
                  onClick={() => { setEmail('admin@gmail.com'); setPassword('password123'); }}
                  className="text-blue-600 hover:underline"
                >
                  admin@gmail.com / password123
                </button>
              </div>
              
              <Button 
                onClick={testSignUp} 
                disabled={loading || !!user}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Signing up...' : 'Test Sign Up'}
              </Button>
              
              <Button 
                onClick={testLogin} 
                disabled={loading || !!user}
                className="w-full"
              >
                {loading ? 'Logging in...' : 'Test Login'}
              </Button>
              
              <Button 
                onClick={testSignOut} 
                disabled={loading || !user}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Signing out...' : 'Test Sign Out'}
              </Button>
              
              <Button 
                onClick={testSessionPersistence} 
                variant="outline"
                className="w-full"
              >
                Test Session Persistence
              </Button>
              
              <Button 
                onClick={checkAuthState} 
                variant="outline"
                className="w-full"
              >
                Check Auth State
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {testResults.length > 0 ? (
                  testResults.map((result, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {result}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No test results yet</div>
                )}
              </div>
              <Button 
                onClick={clearResults} 
                variant="outline" 
                size="sm" 
                className="mt-4"
              >
                Clear Results
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1. Test Sign Up:</strong> Create a new user first (if none exist)</p>
              <p><strong>2. Test Login:</strong> Use existing credentials to login</p>
              <p><strong>3. Test Session Persistence:</strong> After login, refresh the page - should stay logged in</p>
              <p><strong>4. Test Sign Out:</strong> Click "Test Sign Out" - should log out completely</p>
              <p><strong>5. Check Auth State:</strong> Use this to debug what's happening</p>
              <p><strong>6. Watch Console:</strong> Open browser console to see detailed logs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthFlowTest;

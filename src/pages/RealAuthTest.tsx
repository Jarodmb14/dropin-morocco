import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const RealAuthTest = () => {
  const { user, userRole, signOut, signIn, loading } = useAuth();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('password123');
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testLogin = async () => {
    try {
      addResult('Testing login with AuthContext...');
      const { error } = await signIn(email, password);
      
      if (error) {
        addResult(`❌ Login failed: ${error.message}`);
      } else {
        addResult('✅ Login successful!');
      }
    } catch (error) {
      addResult(`❌ Login error: ${error}`);
    }
  };

  const testSignOut = async () => {
    try {
      addResult('Testing sign out with AuthContext...');
      await signOut();
      addResult('✅ Sign out completed!');
    } catch (error) {
      addResult(`❌ Sign out error: ${error}`);
    }
  };

  const testSessionPersistence = () => {
    addResult('Testing session persistence...');
    addResult('Refresh the page now to test if session persists');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Real AuthContext Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Auth State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
                <p><strong>Role:</strong> {userRole || 'No role'}</p>
                <p><strong>Loading:</strong> {loading ? 'True' : 'False'}</p>
                <p><strong>User ID:</strong> {user ? user.id : 'N/A'}</p>
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
              
              <Button 
                onClick={testLogin} 
                disabled={loading || !!user}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Test Login'}
              </Button>
              
              <Button 
                onClick={testSignOut} 
                disabled={loading || !user}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Loading...' : 'Test Sign Out'}
              </Button>
              
              <Button 
                onClick={testSessionPersistence} 
                variant="outline"
                className="w-full"
              >
                Test Session Persistence
              </Button>
              
              <Button 
                onClick={clearResults} 
                variant="secondary"
                className="w-full"
              >
                Clear Results
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
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1. Test Login:</strong> Try logging in with admin@gmail.com / password123</p>
              <p><strong>2. Test Session Persistence:</strong> After login, refresh the page - should stay logged in</p>
              <p><strong>3. Test Sign Out:</strong> Click "Test Sign Out" - should log out completely</p>
              <p><strong>4. Check Console:</strong> Open browser console to see detailed logs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealAuthTest;

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionRefresh } from '@/hooks/useSessionRefresh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SimpleHeader from '@/components/SimpleHeader';

const SessionTest = () => {
  const { user, loading, session, validateSession } = useAuth();
  const { refreshSession, isSessionValid } = useSessionRefresh();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `[${timestamp}] ${result}`]);
  };

  useEffect(() => {
    addTestResult(`Auth loading: ${loading}`);
    addTestResult(`User exists: ${!!user}`);
    addTestResult(`Session exists: ${!!session}`);
    addTestResult(`Session valid: ${isSessionValid}`);
  }, [loading, user, session, isSessionValid]);

  const testSessionValidation = async () => {
    addTestResult('Testing session validation...');
    try {
      const isValid = await validateSession();
      addTestResult(`Session validation result: ${isValid ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      addTestResult(`Session validation error: ${error}`);
    }
  };

  const testRefreshSession = async () => {
    addTestResult('Testing session refresh...');
    try {
      const isValid = await refreshSession();
      addTestResult(`Session refresh result: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      addTestResult(`Session refresh error: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Session Persistence Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Current State:</h3>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
                <p>User: {user ? user.email : 'None'}</p>
                <p>Session: {session ? 'Active' : 'None'}</p>
                <p>Valid: {isSessionValid ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Actions:</h3>
                <div className="space-y-2">
                  <Button onClick={testSessionValidation} variant="outline" size="sm">
                    Test Session Validation
                  </Button>
                  <Button onClick={testRefreshSession} variant="outline" size="sm">
                    Test Session Refresh
                  </Button>
                  <Button onClick={clearResults} variant="outline" size="sm">
                    Clear Results
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500">No test results yet</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono mb-1">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Make sure you're logged in</li>
                <li>2. Refresh this page (F5 or Ctrl+R)</li>
                <li>3. Check if the session persists without needing to log in again</li>
                <li>4. Try navigating to /venues and back</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionTest;

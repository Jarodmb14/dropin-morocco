import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SimpleHeader from '@/components/SimpleHeader';

const AuthDebugSimple = () => {
  const { user: authContextUser, loading: authLoading, session: authSession } = useAuth();
  const { isInitialized, user: persistentUser, isAuthenticated, session: persistentSession } = useAuthPersistence();
  const [directSession, setDirectSession] = useState<any>(null);
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    // Check direct Supabase session
    const checkDirectSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setDirectSession(session);
    };

    // Check localStorage
    const storageKey = 'sb-obqhxrqpxoaiublaoidv-auth-token';
    const stored = localStorage.getItem(storageKey);
    try {
      setLocalStorageData(stored ? JSON.parse(stored) : null);
    } catch {
      setLocalStorageData(null);
    }

    checkDirectSession();
  }, []);

  const refreshData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setDirectSession(session);
    
    const storageKey = 'sb-obqhxrqpxoaiublaoidv-auth-token';
    const stored = localStorage.getItem(storageKey);
    try {
      setLocalStorageData(stored ? JSON.parse(stored) : null);
    } catch {
      setLocalStorageData(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AuthContext</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
                  <p><strong>User:</strong> {authContextUser ? authContextUser.email : 'None'}</p>
                  <p><strong>Session:</strong> {authSession ? 'Active' : 'None'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">useAuthPersistence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Initialized:</strong> {isInitialized ? 'Yes' : 'No'}</p>
                  <p><strong>User:</strong> {persistentUser ? persistentUser.email : 'None'}</p>
                  <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                  <p><strong>Session:</strong> {persistentSession ? 'Active' : 'None'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Direct Supabase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Session:</strong> {directSession ? 'Active' : 'None'}</p>
                  <p><strong>User:</strong> {directSession?.user ? directSession.user.email : 'None'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">localStorage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Data:</strong> {localStorageData ? 'Present' : 'None'}</p>
                  <p><strong>User:</strong> {localStorageData?.user ? localStorageData.user.email : 'None'}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={refreshData} variant="outline">
                Refresh Data
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Summary:</h4>
              <p className="text-sm text-blue-700">
                This page shows the authentication state from all sources. 
                If you're logged in, at least one of these should show your user information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDebugSimple;

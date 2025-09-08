import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

const SessionPersistenceTest = () => {
  const [session, setSession] = useState<any>(null);
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  const [authEvents, setAuthEvents] = useState<string[]>([]);

  useEffect(() => {
    console.log('SessionPersistenceTest: Component mounted');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('SessionPersistenceTest: Initial session:', session);
      console.log('SessionPersistenceTest: Session error:', error);
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('SessionPersistenceTest: Auth state change:', event, session);
      const eventLog = `${new Date().toLocaleTimeString()}: ${event} - ${session ? 'Session exists' : 'No session'}`;
      setAuthEvents(prev => [...prev, eventLog]);
      setSession(session);
    });

    // Get localStorage keys
    const keys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-') || key.includes('auth')
    );
    setLocalStorageKeys(keys);

    return () => {
      console.log('SessionPersistenceTest: Component unmounting');
      subscription.unsubscribe();
    };
  }, []);

  const testLogin = async () => {
    try {
      console.log('SessionPersistenceTest: Starting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@gmail.com',
        password: 'password123',
      });

      if (error) {
        console.error('SessionPersistenceTest: Login error:', error);
        alert('Login failed: ' + error.message);
      } else {
        console.log('SessionPersistenceTest: Login success:', data);
        setSession(data.session);
        
        // Update localStorage keys
        const keys = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('sb-') || key.includes('auth')
        );
        setLocalStorageKeys(keys);
        
        alert('Login successful!');
      }
    } catch (error) {
      console.error('SessionPersistenceTest: Login error:', error);
      alert('Login error: ' + error);
    }
  };

  const refreshPage = () => {
    console.log('SessionPersistenceTest: Refreshing page...');
    window.location.reload();
  };

  const checkSession = () => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('SessionPersistenceTest: Current session:', session);
      console.log('SessionPersistenceTest: Session error:', error);
      setSession(session);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Session Persistence Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Session:</strong> {session ? 'Exists' : 'None'}</p>
                <p><strong>User:</strong> {session?.user?.email || 'N/A'}</p>
                <p><strong>Access Token:</strong> {session?.access_token ? 'Present' : 'Missing'}</p>
              </div>
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto mt-4">
                {session ? JSON.stringify(session, null, 2) : 'No session'}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>localStorage Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {localStorageKeys.length > 0 ? (
                  localStorageKeys.map(key => (
                    <div key={key} className="text-sm">
                      <strong>{key}:</strong> {localStorage.getItem(key)?.substring(0, 50)}...
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No auth-related keys found</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auth Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {authEvents.length > 0 ? (
                  authEvents.map((event, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {event}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No auth events yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={testLogin} className="w-full">
                Test Login
              </Button>
              <Button onClick={checkSession} variant="outline" className="w-full">
                Check Session
              </Button>
              <Button onClick={refreshPage} variant="secondary" className="w-full">
                Refresh Page (Test Persistence)
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Click "Test Login" to log in</p>
              <p><strong>2.</strong> Check that session exists and localStorage has keys</p>
              <p><strong>3.</strong> Click "Refresh Page" to test persistence</p>
              <p><strong>4.</strong> After refresh, check if session still exists</p>
              <p><strong>5.</strong> Watch console logs for auth events</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionPersistenceTest;

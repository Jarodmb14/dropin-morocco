import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

const SupabaseConfigTest = () => {
  const [config, setConfig] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);

  useEffect(() => {
    // Get Supabase client configuration
    const clientConfig = {
      url: supabase.supabaseUrl,
      key: supabase.supabaseKey,
      auth: {
        storage: supabase.auth.storage,
        persistSession: supabase.auth.options?.persistSession,
        autoRefreshToken: supabase.auth.options?.autoRefreshToken,
      }
    };
    setConfig(clientConfig);

    // Get current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
      } else {
        setSession(session);
      }
    });

    // Get localStorage keys
    const keys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-') || key.includes('auth')
    );
    setLocalStorageKeys(keys);

  }, []);

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@gmail.com',
        password: 'password123',
      });

      if (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      } else {
        console.log('Login success:', data);
        alert('Login successful!');
        
        // Update session and localStorage keys
        setSession(data.session);
        const keys = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('sb-') || key.includes('auth')
        );
        setLocalStorageKeys(keys);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + error);
    }
  };

  const testLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setSession(null);
      const keys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('sb-') || key.includes('auth')
      );
      setLocalStorageKeys(keys);
      
      alert('Logged out!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAllStorage = () => {
    localStorage.clear();
    setLocalStorageKeys([]);
    alert('All localStorage cleared!');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Configuration Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Client Config</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
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
                      <strong>{key}:</strong> {localStorage.getItem(key)?.substring(0, 100)}...
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
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={testLogin} className="w-full">
                Test Login (admin@gmail.com)
              </Button>
              <Button onClick={testLogout} variant="outline" className="w-full">
                Test Logout
              </Button>
              <Button onClick={clearAllStorage} variant="destructive" className="w-full">
                Clear All Storage
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
              <p><strong>1.</strong> Check if persistSession is true in config</p>
              <p><strong>2.</strong> Click "Test Login" - should create session</p>
              <p><strong>3.</strong> Check localStorage keys - should see session data</p>
              <p><strong>4.</strong> Click "Refresh Page" - session should persist</p>
              <p><strong>5.</strong> If session disappears, there's a config issue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseConfigTest;

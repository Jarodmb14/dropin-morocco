import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

const DirectSupabaseTest = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      addResult('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase.from('clubs').select('count').limit(1);
      
      if (error) {
        addResult(`Connection error: ${error.message}`);
      } else {
        addResult('✅ Supabase connection successful');
      }
    } catch (error) {
      addResult(`Connection exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      addResult('Testing direct sign up...');
      
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            role: 'CUSTOMER'
          }
        }
      });
      
      if (error) {
        addResult(`Sign up error: ${error.message}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Sign up successful');
        addResult(`User ID: ${data.user?.id}`);
        addResult(`Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      addResult(`Sign up exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      addResult('Testing direct sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (error) {
        addResult(`Sign in error: ${error.message}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Sign in successful');
        addResult(`User: ${data.user?.email}`);
        addResult(`Session exists: ${data.session ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      addResult(`Sign in exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSession = async () => {
    setLoading(true);
    try {
      addResult('Testing session retrieval...');
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult(`Session error: ${error.message}`);
      } else {
        addResult(`Session exists: ${data.session ? 'Yes' : 'No'}`);
        if (data.session) {
          addResult(`User: ${data.session.user.email}`);
          addResult(`Expires: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);
        }
      }
    } catch (error) {
      addResult(`Session exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignOut = async () => {
    setLoading(true);
    try {
      addResult('Testing direct sign out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        addResult(`Sign out error: ${error.message}`);
      } else {
        addResult('✅ Sign out successful');
      }
    } catch (error) {
      addResult(`Sign out exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Direct Supabase Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Supabase Direct Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={testSupabaseConnection} 
                disabled={loading}
                variant="outline"
              >
                Test Connection
              </Button>
              
              <Button 
                onClick={testSignUp} 
                disabled={loading}
                variant="outline"
              >
                Test Sign Up
              </Button>
              
              <Button 
                onClick={testSignIn} 
                disabled={loading}
                variant="outline"
              >
                Test Sign In
              </Button>
              
              <Button 
                onClick={testSession} 
                disabled={loading}
                variant="outline"
              >
                Test Session
              </Button>
              
              <Button 
                onClick={testSignOut} 
                disabled={loading}
                variant="destructive"
              >
                Test Sign Out
              </Button>
              
              <Button 
                onClick={clearResults} 
                disabled={loading}
                variant="secondary"
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 font-mono">
                    {result}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No test results yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
              <p><strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
              <p><strong>localStorage keys:</strong> {Object.keys(localStorage).filter(k => k.includes('supabase')).join(', ') || 'None'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectSupabaseTest;

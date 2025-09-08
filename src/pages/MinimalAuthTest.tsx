import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MinimalAuthTest = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testDirectAuth = async () => {
    setLoading(true);
    try {
      addResult('Testing direct auth API call...');
      
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        },
        body: JSON.stringify({
          email: 'testuser@gmail.com',
          password: 'password123'
        })
      });
      
      addResult(`Response status: ${response.status}`);
      
      const responseText = await response.text();
      addResult(`Response body: ${responseText}`);
      
      if (response.ok) {
        addResult('✅ Direct auth API call successful');
      } else {
        addResult(`❌ Direct auth API call failed: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Direct auth API error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleSupabase = async () => {
    setLoading(true);
    try {
      addResult('Testing simple Supabase client...');
      
      // Create a minimal Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        'https://obqhxrqpxoaiublaoidv.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );
      
      addResult('✅ Simple Supabase client created');
      
      addResult('Testing auth signup...');
      const { data, error } = await supabase.auth.signUp({
        email: 'testuser@gmail.com',
        password: 'password123'
      });
      
      if (error) {
        addResult(`❌ Auth signup error: ${error.message}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Auth signup successful');
        addResult(`User ID: ${data.user?.id}`);
        addResult(`Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      addResult(`❌ Simple Supabase error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      addResult('Testing login...');
      
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        'https://obqhxrqpxoaiublaoidv.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'testuser@gmail.com',
        password: 'password123'
      });
      
      if (error) {
        addResult(`❌ Login error: ${error.message}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Login successful');
        addResult(`User: ${data.user?.email}`);
        addResult(`Session exists: ${data.session ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      addResult(`❌ Login error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testExistingUser = async () => {
    setLoading(true);
    try {
      addResult('Testing with existing user (admin@gmail.com)...');
      
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        'https://obqhxrqpxoaiublaoidv.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@gmail.com',
        password: 'password123'
      });
      
      if (error) {
        addResult(`❌ Admin login error: ${error.message}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Admin login successful');
        addResult(`User: ${data.user?.email}`);
        addResult(`Session exists: ${data.session ? 'Yes' : 'No'}`);
        addResult(`User metadata: ${JSON.stringify(data.user?.user_metadata)}`);
      }
    } catch (error) {
      addResult(`❌ Admin login error: ${error}`);
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
        <h1 className="text-3xl font-bold mb-6">Minimal Auth Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Minimal Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={testDirectAuth} 
                disabled={loading}
                variant="outline"
              >
                Test Direct Auth API
              </Button>
              
              <Button 
                onClick={testSimpleSupabase} 
                disabled={loading}
                variant="outline"
              >
                Test Simple Supabase Client
              </Button>
              
              <Button 
                onClick={testLogin} 
                disabled={loading}
                variant="outline"
              >
                Test Login (testuser@gmail.com)
              </Button>
              
              <Button 
                onClick={testExistingUser} 
                disabled={loading}
                variant="outline"
              >
                Test Admin Login
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
            <CardTitle>What This Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Direct Auth API:</strong> Tests raw HTTP calls to Supabase auth endpoints</p>
              <p><strong>Simple Supabase Client:</strong> Tests minimal client without complex config</p>
              <p><strong>Login:</strong> Tests if user can login after signup</p>
              <p><strong>Purpose:</strong> Isolate the issue between network, client, and auth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimalAuthTest;

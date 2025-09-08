import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SimpleConnectionTest = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    try {
      addResult('Testing basic fetch to Supabase...');
      
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        }
      });
      
      addResult(`Response status: ${response.status}`);
      addResult(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
      
      if (response.ok) {
        addResult('✅ Basic connection successful');
      } else {
        addResult(`❌ Connection failed: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Connection error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseClient = async () => {
    setLoading(true);
    try {
      addResult('Testing Supabase client import...');
      
      // Dynamic import to catch any import errors
      const { supabase } = await import('@/integrations/supabase/client');
      addResult('✅ Supabase client imported successfully');
      
      addResult('Testing client connection...');
      const { data, error } = await supabase.from('clubs').select('count').limit(1);
      
      if (error) {
        addResult(`❌ Client error: ${error.message}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Supabase client connection successful');
      }
    } catch (error) {
      addResult(`❌ Client import/connection error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      addResult('Testing Supabase auth...');
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      addResult('Testing auth sign up...');
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (error) {
        addResult(`❌ Auth sign up error: ${error.message}`);
        addResult(`Error code: ${error.status}`);
        addResult(`Error details: ${JSON.stringify(error)}`);
      } else {
        addResult('✅ Auth sign up successful');
        addResult(`User ID: ${data.user?.id}`);
        addResult(`Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      addResult(`❌ Auth error: ${error}`);
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
        <h1 className="text-3xl font-bold mb-6">Simple Connection Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={testBasicConnection} 
                disabled={loading}
                variant="outline"
              >
                Test Basic Fetch
              </Button>
              
              <Button 
                onClick={testSupabaseClient} 
                disabled={loading}
                variant="outline"
              >
                Test Supabase Client
              </Button>
              
              <Button 
                onClick={testAuth} 
                disabled={loading}
                variant="outline"
              >
                Test Auth Sign Up
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
              <p><strong>Supabase URL:</strong> https://obqhxrqpxoaiublaoidv.supabase.co</p>
              <p><strong>API Key:</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE</p>
              <p><strong>localStorage keys:</strong> {Object.keys(localStorage).filter(k => k.includes('supabase')).join(', ') || 'None'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleConnectionTest;

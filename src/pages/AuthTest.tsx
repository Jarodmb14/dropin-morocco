import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load user session on mount
  useEffect(() => {
    console.log('🔍 Loading user session...');
    const sessionData = localStorage.getItem('supabase_session');
    console.log('🔍 Session data:', sessionData);
    
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        console.log('🔍 Parsed session:', parsed);
        if (parsed.user) {
          setUser(parsed.user);
          console.log('✅ User loaded:', parsed.user.email);
          setMessage(`Logged in as: ${parsed.user.email}`);
        } else {
          console.log('⚠️ No user in session data');
          setMessage('No user found in session');
        }
      } catch (error) {
        console.error('❌ Error parsing session:', error);
        setMessage('Error parsing session data');
      }
    } else {
      console.log('⚠️ No session data found');
      setMessage('No session data found');
    }
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (response.ok) {
        setMessage('✅ Signup successful! Please check your email for verification.');
        // Store session data
        localStorage.setItem('supabase_session', JSON.stringify(data));
        setUser(data.user);
      } else {
        setMessage(`❌ Signup failed: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(`❌ Signup error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      console.log('Signin response:', data);

      if (response.ok) {
        setMessage('✅ Signin successful!');
        // Store session data
        localStorage.setItem('supabase_session', JSON.stringify(data));
        setUser(data.user);
      } else {
        setMessage(`❌ Signin failed: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Signin error:', error);
      setMessage(`❌ Signin error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('supabase_session');
    setUser(null);
    setMessage('Signed out successfully');
  };

  const debugSession = () => {
    console.log('🔍 Current localStorage keys:', Object.keys(localStorage));
    console.log('🔍 Session data:', localStorage.getItem('supabase_session'));
    setMessage('Check console for debug info');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-900 text-white">
            <CardTitle className="font-space-grotesk font-medium text-lg">
              🔐 Authentication Test
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-space-grotesk font-medium">
                    ✅ Logged in as: {user.email}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    User ID: {user.id}
                  </p>
                </div>
                <Button 
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-space-grotesk font-medium"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-space-grotesk font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="font-space-grotesk"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-space-grotesk font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="font-space-grotesk"
                  />
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={handleSignUp}
                    disabled={isLoading || !email || !password}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-space-grotesk font-medium"
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                  <Button 
                    onClick={handleSignIn}
                    disabled={isLoading || !email || !password}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-space-grotesk font-medium"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </div>
            )}
            
            {message && (
              <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg">
                <p className="text-gray-800 font-space-grotesk text-sm">{message}</p>
              </div>
            )}
            
            <Button 
              onClick={debugSession}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-space-grotesk font-medium"
            >
              Debug Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const LoginTest = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive",
        });
        console.error('Login error:', error);
      } else {
        toast({
          title: "Login Success!",
          description: "You are now logged in",
        });
        console.log('Login success:', data);
        setSessionInfo(data);
        
        // Check what's actually stored in localStorage
        setTimeout(() => {
          console.log('All localStorage keys:', Object.keys(localStorage));
          Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase') || key.includes('sb-')) {
              console.log(`${key}:`, localStorage.getItem(key));
            }
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'ADMIN',
            full_name: 'Admin User'
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Error",
          description: error.message,
          variant: "destructive",
        });
        console.error('Signup error:', error);
      } else {
        toast({
          title: "Signup Success!",
          description: data.user?.email_confirmed_at ? "Account created and confirmed" : "Account created - check email for confirmation",
        });
        console.log('Signup success:', data);
        setSessionInfo(data);
      }
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = () => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
      } else {
        console.log('Current session:', session);
        setSessionInfo({ session });
      }
    });
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear session info
      setSessionInfo(null);
      
      // Clear localStorage manually
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('sb-obqhxrqpxoaiublaoidv-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out",
      });
      
      console.log('Successfully logged out and cleared storage');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the state
      setSessionInfo(null);
      localStorage.clear();
      toast({
        title: "Logged Out",
        description: "You have been logged out (with errors)",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button onClick={handleSignup} disabled={loading} variant="outline">
                {loading ? "Signing up..." : "Signup"}
              </Button>
              <Button onClick={checkSession} variant="outline">
                Check Session
              </Button>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {sessionInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Try logging in with admin@gmail.com / password123</p>
              <p><strong>2.</strong> Check browser console for localStorage keys</p>
              <p><strong>3.</strong> If login fails, try signup first</p>
              <p><strong>4.</strong> Check if email confirmation is required</p>
              <p><strong>5.</strong> After successful login, refresh the page to test persistence</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginTest;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DropInAPI } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

const AuthTest = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    addLog("Testing Supabase connection (querying clubs)...");
    try {
      const { data, error } = await supabase.from('clubs').select('id, name').limit(1);
      
      if (error) {
        addLog(`Supabase error: ${error.message}`);
        toast({
          title: "Supabase Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        addLog(`Supabase connection successful. Sample: ${data && data.length ? data[0].name : 'no rows'}`);
        toast({
          title: "Success!",
          description: "Supabase connection working",
        });
      }
    } catch (error) {
      addLog(`Supabase connection error: ${error}`);
      toast({
        title: "Error",
        description: "Supabase connection failed",
        variant: "destructive",
      });
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    addLog("Testing sign up...");
    try {
      const result = await DropInAPI.auth.register({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        role: "CUSTOMER",
      });
      
      addLog(`Sign up result: ${JSON.stringify(result)}`);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "User registered successfully",
        });
        setUser(result.user);
      } else {
        toast({
          title: "Error",
          description: result.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      addLog(`Sign up error: ${error}`);
      toast({
        title: "Error",
        description: "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    addLog("Testing login...");
    try {
      const result = await DropInAPI.auth.login(email, password);
      
      addLog(`Login result: ${JSON.stringify(result)}`);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "User logged in successfully",
        });
        setUser(result.user);
      } else {
        toast({
          title: "Error",
          description: result.error || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      addLog(`Login error: ${error}`);
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetCurrentUser = async () => {
    addLog("Testing get current user...");
    try {
      const user = await DropInAPI.auth.getCurrentUser();
      addLog(`Current user: ${JSON.stringify(user)}`);
      
      if (user) {
        toast({
          title: "Success!",
          description: `User: ${user.email} (${user.role})`,
        });
        setUser(user);
      } else {
        toast({
          title: "No User",
          description: "No user is currently logged in",
        });
      }
    } catch (error) {
      addLog(`Get current user error: ${error}`);
      toast({
        title: "Error",
        description: "Failed to get current user",
        variant: "destructive",
      });
    }
  };

  const testSignOut = async () => {
    addLog("Testing sign out...");
    try {
      await DropInAPI.auth.signOut();
      setUser(null);
      addLog("Sign out successful");
      toast({
        title: "Success!",
        description: "User signed out successfully",
      });
    } catch (error) {
      addLog(`Sign out error: ${error}`);
      toast({
        title: "Error",
        description: "Sign out failed",
        variant: "destructive",
      });
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Authentication Test</h1>
          <p className="text-lg text-gray-600">Debug authentication issues</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Controls */}
          <div className="space-y-6">
            {/* Connection Test */}
            <Card>
              <CardHeader>
                <CardTitle>Database Connection</CardTitle>
                <CardDescription>Test Supabase connection</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testSupabaseConnection} className="w-full">
                  Test Supabase Connection
                </Button>
              </CardContent>
            </Card>

            {/* Registration Test */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Test</CardTitle>
                <CardDescription>Test user registration</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testSignUp} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Registering..." : "Register Test User"}
                </Button>
              </CardContent>
            </Card>

            {/* Login Test */}
            <Card>
              <CardHeader>
                <CardTitle>Login Test</CardTitle>
                <CardDescription>Test user login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
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
                <Button 
                  onClick={testLogin} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </CardContent>
            </Card>

            {/* Current User Test */}
            <Card>
              <CardHeader>
                <CardTitle>Current User</CardTitle>
                <CardDescription>Get current user info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={testGetCurrentUser} className="w-full">
                  Get Current User
                </Button>
                <Button onClick={testSignOut} className="w-full" variant="outline">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Debug Information */}
          <div className="space-y-6">
            {/* User Info Display */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle>Current User Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Debug Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Debug Logs
                  <Button onClick={clearLogs} variant="outline" size="sm">
                    Clear Logs
                  </Button>
                </CardTitle>
                <CardDescription>Real-time debugging information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-auto">
                  {logs.length === 0 ? (
                    <p className="text-gray-500 text-sm">No logs yet. Start testing to see debug information.</p>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div key={index} className="text-xs font-mono text_gray-700">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Testing Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>1. <strong>Test Database Connection</strong> - Verify Supabase is working</p>
                  <p>2. <strong>Register Test User</strong> - Create a new user account</p>
                  <p>3. <strong>Login</strong> - Test authentication with the created account</p>
                  <p>4. <strong>Get Current User</strong> - Verify user session is maintained</p>
                  <p>5. <strong>Check Debug Logs</strong> - Look for detailed error messages</p>
                  <p>6. <strong>Check Browser Console</strong> - Press F12 for additional errors</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;

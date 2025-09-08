import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const SignOutTest = () => {
  const { user, userRole, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      console.log('🧪 SignOutTest: Starting sign out test...');
      await signOut();
      console.log('🧪 SignOutTest: Sign out completed');
      alert('Successfully signed out!');
    } catch (error) {
      console.error('🧪 SignOutTest: Sign out error:', error);
      alert('Sign out error: ' + error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const checkAuthState = () => {
    console.log('🧪 SignOutTest: Current auth state:');
    console.log('🧪 SignOutTest: User:', user);
    console.log('🧪 SignOutTest: UserRole:', userRole);
    console.log('🧪 SignOutTest: localStorage keys:', Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-') || key.includes('auth')
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sign Out Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
              <p><strong>Role:</strong> {userRole || 'No role'}</p>
              <p><strong>User ID:</strong> {user ? user.id : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSignOut} 
              disabled={isSigningOut || !user}
              className="w-full"
              variant="destructive"
            >
              {isSigningOut ? 'Signing Out...' : 'Test Sign Out'}
            </Button>
            
            <Button 
              onClick={checkAuthState} 
              variant="outline"
              className="w-full"
            >
              Check Auth State (Console)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Make sure you're logged in first</p>
              <p><strong>2.</strong> Click "Check Auth State" to see current state in console</p>
              <p><strong>3.</strong> Click "Test Sign Out" and watch console logs</p>
              <p><strong>4.</strong> After sign out, check if user becomes null</p>
              <p><strong>5.</strong> Refresh page to test persistence</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignOutTest;
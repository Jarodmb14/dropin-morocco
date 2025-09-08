import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ForceSignOutTest = () => {
  const { user, userRole, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleNormalSignOut = async () => {
    setIsSigningOut(true);
    try {
      console.log('🧪 ForceSignOutTest: Starting normal sign out...');
      await signOut();
      console.log('🧪 ForceSignOutTest: Normal sign out completed');
      alert('Normal sign out completed!');
    } catch (error) {
      console.error('🧪 ForceSignOutTest: Normal sign out error:', error);
      alert('Normal sign out error: ' + error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleForceSignOut = async () => {
    setIsSigningOut(true);
    try {
      console.log('🧪 ForceSignOutTest: Starting FORCE sign out...');
      
      // Step 1: Clear all localStorage immediately
      console.log('🧪 ForceSignOutTest: Clearing localStorage...');
      localStorage.clear();
      
      // Step 2: Try Supabase sign out
      console.log('🧪 ForceSignOutTest: Calling Supabase sign out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🧪 ForceSignOutTest: Supabase sign out error:', error);
      } else {
        console.log('🧪 ForceSignOutTest: Supabase sign out successful');
      }
      
      // Step 3: Force page reload to clear all state
      console.log('🧪 ForceSignOutTest: Force reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('🧪 ForceSignOutTest: Force sign out error:', error);
      // Even if there's an error, force reload
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const checkAuthState = () => {
    console.log('🧪 ForceSignOutTest: Current auth state:');
    console.log('🧪 ForceSignOutTest: User:', user);
    console.log('🧪 ForceSignOutTest: UserRole:', userRole);
    console.log('🧪 ForceSignOutTest: localStorage keys:', Object.keys(localStorage));
    console.log('🧪 ForceSignOutTest: Supabase session:', supabase.auth.getSession());
  };

  const clearAllStorage = () => {
    console.log('🧪 ForceSignOutTest: Clearing all storage...');
    localStorage.clear();
    sessionStorage.clear();
    console.log('🧪 ForceSignOutTest: All storage cleared');
    alert('All storage cleared!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Force Sign Out Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
              <p><strong>Role:</strong> {userRole || 'No role'}</p>
              <p><strong>User ID:</strong> {user ? user.id : 'N/A'}</p>
              <p><strong>localStorage Keys:</strong> {Object.keys(localStorage).length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sign Out Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleNormalSignOut} 
              disabled={isSigningOut || !user}
              className="w-full"
              variant="outline"
            >
              {isSigningOut ? 'Signing Out...' : 'Normal Sign Out'}
            </Button>
            
            <Button 
              onClick={handleForceSignOut} 
              disabled={isSigningOut || !user}
              className="w-full"
              variant="destructive"
            >
              {isSigningOut ? 'Force Signing Out...' : 'FORCE Sign Out (Reload)'}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debug Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkAuthState} 
              variant="outline"
              className="w-full"
            >
              Check Auth State (Console)
            </Button>
            
            <Button 
              onClick={clearAllStorage} 
              variant="outline"
              className="w-full"
            >
              Clear All Storage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Try "Normal Sign Out" first</p>
              <p><strong>2.</strong> If that doesn't work, try "FORCE Sign Out"</p>
              <p><strong>3.</strong> FORCE sign out will clear everything and reload the page</p>
              <p><strong>4.</strong> Use "Check Auth State" to debug what's happening</p>
              <p><strong>5.</strong> Use "Clear All Storage" as a last resort</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForceSignOutTest;

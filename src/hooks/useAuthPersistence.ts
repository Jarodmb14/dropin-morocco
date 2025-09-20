import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to handle authentication persistence across page refreshes
 */
export const useAuthPersistence = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 useAuthPersistence: Initializing...');
        
        // First check localStorage for session data
        const storageKey = 'sb-obqhxrqpxoaiublaoidv-auth-token';
        const storedSession = localStorage.getItem(storageKey);
        console.log('🔄 useAuthPersistence: Stored session exists:', !!storedSession);
        
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔄 useAuthPersistence: Supabase session:', session ? 'Valid' : 'None');
        console.log('🔄 useAuthPersistence: Session error:', error);
        
        if (error) {
          console.error('🔄 useAuthPersistence: Session error:', error);
          // Clear any corrupted data
          if (error.message.includes('Invalid JWT') || error.message.includes('expired')) {
            console.log('🔄 useAuthPersistence: Clearing corrupted session');
            await supabase.auth.signOut();
          }
          setSessionData(null);
        } else if (session?.user) {
          console.log('🔄 useAuthPersistence: Valid session found for user:', session.user.email);
          setSessionData(session);
        } else if (storedSession) {
          // Try to parse stored session as fallback
          try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession?.user) {
              console.log('🔄 useAuthPersistence: Using stored session for user:', parsedSession.user.email);
              setSessionData(parsedSession);
            } else {
              console.log('🔄 useAuthPersistence: No user in stored session');
              setSessionData(null);
            }
          } catch (parseError) {
            console.error('🔄 useAuthPersistence: Error parsing stored session:', parseError);
            setSessionData(null);
          }
        } else {
          console.log('🔄 useAuthPersistence: No session found');
          setSessionData(null);
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error('🔄 useAuthPersistence: Initialization error:', err);
        setSessionData(null);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 useAuthPersistence: Auth state change:', event, session ? 'Session exists' : 'No session');
      if (session?.user) {
        console.log('🔄 useAuthPersistence: Auth state change user:', session.user.email);
      }
      setSessionData(session);
    });

    return () => {
      console.log('🔄 useAuthPersistence: Cleaning up...');
      subscription.unsubscribe();
    };
  }, []);

  return {
    isInitialized,
    session: sessionData,
    user: sessionData?.user || null,
    isAuthenticated: !!sessionData?.user
  };
};

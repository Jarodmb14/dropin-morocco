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
        
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔄 useAuthPersistence: Session error:', error);
          // Clear any corrupted data
          if (error.message.includes('Invalid JWT') || error.message.includes('expired')) {
            console.log('🔄 useAuthPersistence: Clearing corrupted session');
            await supabase.auth.signOut();
          }
          setSessionData(null);
        } else {
          console.log('🔄 useAuthPersistence: Session found:', session ? 'Valid' : 'None');
          setSessionData(session);
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

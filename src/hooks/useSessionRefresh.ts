import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to automatically refresh session and handle authentication issues
 */
export const useSessionRefresh = () => {
  const { validateSession, user, loading } = useAuth();

  const refreshSession = useCallback(async () => {
    if (!user && !loading) {
      console.log('🔄 useSessionRefresh: No user found, skipping refresh');
      return false;
    }

    try {
      console.log('🔄 useSessionRefresh: Validating session...');
      const isValid = await validateSession();
      
      if (!isValid) {
        console.log('🔄 useSessionRefresh: Session invalid, user may need to re-authenticate');
        return false;
      }
      
      console.log('🔄 useSessionRefresh: Session is valid');
      return true;
    } catch (error) {
      console.error('🔄 useSessionRefresh: Error validating session:', error);
      return false;
    }
  }, [validateSession, user, loading]);

  // Auto-refresh session every 5 minutes
  useEffect(() => {
    if (!user || loading) return;

    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshSession, user, loading]);

  // Refresh session on window focus (user comes back to tab)
  useEffect(() => {
    if (!user || loading) return;

    const handleFocus = () => {
      console.log('🔄 useSessionRefresh: Window focused, refreshing session');
      refreshSession();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshSession, user, loading]);

  return {
    refreshSession,
    isSessionValid: !!user && !loading
  };
};

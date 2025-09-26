import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'CUSTOMER' | 'CLUB_OWNER' | 'ADMIN';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    phone: string;
    role: UserRole;
    gym_name?: string;
  }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendVerification: (email: string) => Promise<{ error: AuthError | null }>;
  isOwner: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  userRole: UserRole | null;
  refreshUserRole: () => Promise<void>;
  validateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    console.log('🔐 AuthContext: Initializing...');
    
    // Get initial session with better error handling
    const initializeAuth = async () => {
      try {
        console.log('🔐 AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔐 AuthContext: Initial session:', session ? 'Found' : 'None');
        
        if (error) {
          console.error('🔐 AuthContext: Session error:', error);
          // Clear any corrupted session data
          if (error.message.includes('Invalid JWT') || error.message.includes('expired')) {
            console.log('🔐 AuthContext: Clearing corrupted session data');
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setUserRole(null);
          }
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔐 AuthContext: User found, fetching role...');
          await fetchUserRole(session.user.id, session.user);
        } else {
          console.log('🔐 AuthContext: No user in session');
          setLoading(false);
        }
      } catch (err) {
        console.error('🔐 AuthContext: Initialization error:', err);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with better handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 AuthContext: Auth state change:', event, session ? 'Session exists' : 'No session');
      
      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('🔐 AuthContext: User signed in');
          break;
        case 'SIGNED_OUT':
          console.log('🔐 AuthContext: User signed out');
          setUserRole(null);
          setLoading(false);
          break;
        case 'TOKEN_REFRESHED':
          console.log('🔐 AuthContext: Token refreshed');
          break;
        case 'USER_UPDATED':
          console.log('🔐 AuthContext: User updated');
          break;
        default:
          console.log('🔐 AuthContext: Unknown event:', event);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id, session.user);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🔐 AuthContext: Cleaning up...');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string, currentUser?: User | null) => {
    if (!userId) {
      console.log('🔐 AuthContext: No user ID provided, skipping role fetch');
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 AuthContext: Fetching user role for:', userId);
      
      // Try to get role from profiles table first with timeout
      console.log('🔐 AuthContext: Querying profiles table for user_id:', userId);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile query timeout')), 5000); // 5 second timeout
      });
      
      const profileQuery = supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      // Race between the query and timeout
      const { data: profileData, error: profileError } = await Promise.race([
        profileQuery,
        timeoutPromise
      ]) as any;

      console.log('🔐 AuthContext: Profile query result:', { profileData, profileError });
      console.log('🔐 AuthContext: Profile data role:', profileData?.role);
      console.log('🔐 AuthContext: Profile error details:', profileError);

      if (!profileError && profileData?.role) {
        console.log('🔐 AuthContext: ✅ Using database role:', profileData.role);
        setUserRole(profileData.role as UserRole);
      } else {
        console.log('🔐 AuthContext: ❌ Database query failed or no role found');
        console.log('🔐 AuthContext: Error details:', profileError);
        console.log('🔐 AuthContext: Profile data:', profileData);
        console.log('🔐 AuthContext: Trying metadata fallback...');
        
        // Fallback to user metadata
        const metadataRole = currentUser?.user_metadata?.role;
        console.log('🔐 AuthContext: Metadata role:', metadataRole);
        if (metadataRole) {
          console.log('🔐 AuthContext: Using metadata role:', metadataRole);
          setUserRole(metadataRole as UserRole);
        } else {
          console.log('🔐 AuthContext: No role found, defaulting to CUSTOMER');
          setUserRole('CUSTOMER');
        }
      }
    } catch (error) {
      console.error('🔐 AuthContext: Exception fetching role:', error);
      
      // Check if it's a timeout error
      if (error instanceof Error && error.message === 'Profile query timeout') {
        console.log('🔐 AuthContext: ⏰ Profile query timed out, using fallback');
      }
      
      // Fallback to metadata or default
      const metadataRole = currentUser?.user_metadata?.role;
      if (metadataRole) {
        console.log('🔐 AuthContext: Using metadata role as fallback:', metadataRole);
        setUserRole(metadataRole as UserRole);
      } else {
        console.log('🔐 AuthContext: Using default CUSTOMER role');
        setUserRole('CUSTOMER');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    full_name: string;
    phone: string;
    role: UserRole;
    gym_name?: string;
  }) => {
    try {
      console.log('🔐 AuthContext: Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role,
            gym_name: userData.gym_name,
          }
        }
      });

      if (error) {
        console.error('🔐 AuthContext: Signup error:', error);
        return { error };
      }

      console.log('🔐 AuthContext: Signup successful');
      return { error: null };
    } catch (error) {
      console.error('🔐 AuthContext: Signup exception:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Signing in user:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('🔐 AuthContext: Signin error:', error);
      } else {
        console.log('🔐 AuthContext: Signin successful');
      }
      
      return { error };
    } catch (error) {
      console.error('🔐 AuthContext: Signin exception:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 AuthContext: Starting sign out...');
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      // Clear localStorage immediately
      localStorage.clear();
      console.log('🔐 AuthContext: Cleared localStorage');
      
      // Try Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🔐 AuthContext: Supabase sign out error:', error);
      } else {
        console.log('🔐 AuthContext: Supabase sign out successful');
      }
      
      console.log('🔐 AuthContext: Sign out completed');
      
    } catch (error) {
      console.error('🔐 AuthContext: Sign out exception:', error);
      // Even if there's an error, ensure local state is cleared
      setUser(null);
      setSession(null);
      setUserRole(null);
      localStorage.clear();
    }
  };

  // Session validation function
  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('🔐 AuthContext: Session validation error:', error);
        return false;
      }
      
      if (!session) {
        console.log('🔐 AuthContext: No valid session found');
        return false;
      }
      
      // Check if session is expired
      if (session.expires_at && new Date(session.expires_at * 1000) <= new Date()) {
        console.log('🔐 AuthContext: Session expired');
        return false;
      }
      
      console.log('🔐 AuthContext: Session is valid');
      return true;
    } catch (err) {
      console.error('🔐 AuthContext: Session validation exception:', err);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 AuthContext: Requesting password reset for:', email);
      console.log('🔄 AuthContext: Redirect URL:', `${window.location.origin}/auth/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      console.log('🔄 AuthContext: Reset password response:', { error });
      
      if (error) {
        console.error('❌ AuthContext: Password reset error:', error);
      } else {
        console.log('✅ AuthContext: Password reset email sent successfully');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ AuthContext: Password reset exception:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      console.log('🔄 AuthContext: Starting password update...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<{ error: AuthError }>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Password update timeout after 30 seconds'));
        }, 30000);
      });

      const updatePromise = supabase.auth.updateUser({
        password: password
      });

      const result = await Promise.race([updatePromise, timeoutPromise]);
      
      console.log('🔄 AuthContext: Password update result:', result);
      
      if (result.error) {
        console.error('❌ AuthContext: Password update error:', result.error);
      } else {
        console.log('✅ AuthContext: Password updated successfully');
      }
      
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Password update exception:', error);
      return { error: error as AuthError };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const refreshUserRole = async () => {
    if (user) {
      console.log('🔐 AuthContext: Manual role refresh triggered');
      await fetchUserRole(user.id, user);
    }
  };

  // Role checking using the fetched role from profiles table
  const isOwner = userRole === 'CLUB_OWNER';
  const isCustomer = userRole === 'CUSTOMER';
  const isAdmin = userRole === 'ADMIN';
  const isEmailVerified = user?.email_confirmed_at !== null;

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendVerification,
    isOwner,
    isCustomer,
    isAdmin,
    isEmailVerified,
    userRole, // Expose the role for debugging
    refreshUserRole, // Expose manual refresh function
    validateSession, // Expose session validation function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

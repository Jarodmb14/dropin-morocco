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
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔐 AuthContext: Initial session:', session ? 'Found' : 'None');
      if (error) {
        console.error('🔐 AuthContext: Session error:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id, session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 AuthContext: Auth state change:', event, session ? 'Session exists' : 'No session');
      
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
      
      // Try to get role from profiles table first
      console.log('🔐 AuthContext: Querying profiles table for user_id:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', userId)
        .single();

      console.log('🔐 AuthContext: Profile query result:', { profileData, profileError });

      if (!profileError && profileData?.user_role) {
        console.log('🔐 AuthContext: Using database role:', profileData.user_role);
        setUserRole(profileData.user_role as UserRole);
      } else {
        console.log('🔐 AuthContext: Database query failed or no role found, trying metadata...');
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
      // Fallback to metadata or default
      const metadataRole = currentUser?.user_metadata?.role;
      if (metadataRole) {
        setUserRole(metadataRole as UserRole);
      } else {
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

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      return { error };
    } catch (error) {
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

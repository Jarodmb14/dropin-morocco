import { supabase } from '../../integrations/supabase/client';

// Types for enhanced user profiles
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: 'CUSTOMER' | 'CLUB_OWNER' | 'ADMIN';
  country: string | null;
  
  // Customer-specific fields
  date_of_birth?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  emergency_contact?: any;
  fitness_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | null;
  preferred_activities?: string[] | null;
  membership_status?: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | null;
  total_credits?: number | null;
  used_credits?: number | null;
  
  // Gym owner-specific fields
  business_name?: string | null;
  business_registration?: string | null;
  business_address?: string | null;
  business_phone?: string | null;
  business_email?: string | null;
  bank_account_info?: any;
  verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
  
  // Common fields
  profile_picture_url?: string | null;
  bio?: string | null;
  preferred_language?: 'en' | 'fr' | 'ar' | 'es' | null;
  notification_preferences?: any;
  last_login_at?: string | null;
  is_active?: boolean | null;
  terms_accepted_at?: string | null;
  privacy_accepted_at?: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface CustomerDashboard {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  total_credits: number | null;
  used_credits: number | null;
  available_credits: number;
  membership_status: string | null;
  fitness_level: string | null;
  preferred_activities: string[] | null;
  last_login_at: string | null;
  total_bookings: number;
  completed_bookings: number;
  total_reviews: number;
}

export interface GymOwnerDashboard {
  owner_id: string;
  owner_name: string | null;
  owner_email: string | null;
  business_name: string | null;
  verification_status: string | null;
  total_clubs: number;
  active_clubs: number;
  total_bookings: number;
  completed_bookings: number;
  total_revenue: number;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  country?: string;
  date_of_birth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  emergency_contact?: any;
  fitness_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  preferred_activities?: string[];
  business_name?: string;
  business_registration?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  bank_account_info?: any;
  profile_picture_url?: string;
  bio?: string;
  preferred_language?: 'en' | 'fr' | 'ar' | 'es';
  notification_preferences?: any;
}

export interface CreditTransaction {
  user_id: string;
  amount: number;
  operation: 'ADD' | 'SUBTRACT';
  reason: string;
  reference_id?: string;
}

export class UsersAPI {
  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: UpdateProfileData): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return null;
    }
  }

  /**
   * Get customer dashboard data
   */
  static async getCustomerDashboard(userId: string): Promise<CustomerDashboard | null> {
    try {
      const { data, error } = await supabase
        .from('customer_dashboard')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer dashboard:', error);
        return null;
      }

      return data as CustomerDashboard;
    } catch (error) {
      console.error('Error in getCustomerDashboard:', error);
      return null;
    }
  }

  /**
   * Get gym owner dashboard data
   */
  static async getGymOwnerDashboard(ownerId: string): Promise<GymOwnerDashboard | null> {
    try {
      const { data, error } = await supabase
        .from('gym_owner_dashboard')
        .select('*')
        .eq('owner_id', ownerId)
        .single();

      if (error) {
        console.error('Error fetching gym owner dashboard:', error);
        return null;
      }

      return data as GymOwnerDashboard;
    } catch (error) {
      console.error('Error in getGymOwnerDashboard:', error);
      return null;
    }
  }

  /**
   * Update user credits
   */
  static async updateCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('update_user_credits', {
        user_id: transaction.user_id,
        credit_change: transaction.amount,
        operation: transaction.operation
      });

      if (error) {
        console.error('Error updating credits:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in updateCredits:', error);
      return false;
    }
  }

  /**
   * Get user credits
   */
  static async getUserCredits(userId: string): Promise<{ total: number; used: number; available: number } | null> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return null;

      return {
        total: profile.total_credits || 0,
        used: profile.used_credits || 0,
        available: (profile.total_credits || 0) - (profile.used_credits || 0)
      };
    } catch (error) {
      console.error('Error in getUserCredits:', error);
      return null;
    }
  }

  /**
   * Get gym owner with their clubs
   */
  static async getGymOwnerWithClubs(ownerId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_gym_owner_with_clubs', {
        input_owner_id: ownerId
      });

      if (error) {
        console.error('Error fetching gym owner with clubs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getGymOwnerWithClubs:', error);
      return [];
    }
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Error updating last login:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateLastLogin:', error);
      return false;
    }
  }

  /**
   * Get all customers (for admin)
   */
  static async getAllCustomers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'CUSTOMER')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        return [];
      }

      return data as UserProfile[];
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      return [];
    }
  }

  /**
   * Get all gym owners (for admin)
   */
  static async getAllGymOwners(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'CLUB_OWNER')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gym owners:', error);
        return [];
      }

      return data as UserProfile[];
    } catch (error) {
      console.error('Error in getAllGymOwners:', error);
      return [];
    }
  }

  /**
   * Update user membership status
   */
  static async updateMembershipStatus(
    userId: string, 
    status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          membership_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating membership status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateMembershipStatus:', error);
      return false;
    }
  }

  /**
   * Update gym owner verification status
   */
  static async updateVerificationStatus(
    ownerId: string, 
    status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verification_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', ownerId)
        .eq('role', 'CLUB_OWNER');

      if (error) {
        console.error('Error updating verification status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateVerificationStatus:', error);
      return false;
    }
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(query: string, role?: 'CUSTOMER' | 'CLUB_OWNER' | 'ADMIN'): Promise<UserProfile[]> {
    try {
      let supabaseQuery = supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .eq('is_active', true);

      if (role) {
        supabaseQuery = supabaseQuery.eq('role', role);
      }

      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching users:', error);
        return [];
      }

      return data as UserProfile[];
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return [];
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<{
    total_customers: number;
    total_gym_owners: number;
    active_customers: number;
    verified_gym_owners: number;
    total_credits_distributed: number;
  }> {
    try {
      const [customers, gymOwners, activeCustomers, verifiedOwners, totalCredits] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'CUSTOMER').eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'CLUB_OWNER').eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'CUSTOMER').eq('membership_status', 'ACTIVE'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'CLUB_OWNER').eq('verification_status', 'VERIFIED'),
        supabase.from('profiles').select('total_credits').eq('role', 'CUSTOMER')
      ]);

      const totalCreditsSum = totalCredits.data?.reduce((sum, user) => sum + (user.total_credits || 0), 0) || 0;

      return {
        total_customers: customers.count || 0,
        total_gym_owners: gymOwners.count || 0,
        active_customers: activeCustomers.count || 0,
        verified_gym_owners: verifiedOwners.count || 0,
        total_credits_distributed: totalCreditsSum
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        total_customers: 0,
        total_gym_owners: 0,
        active_customers: 0,
        verified_gym_owners: 0,
        total_credits_distributed: 0
      };
    }
  }
}

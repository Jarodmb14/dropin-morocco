import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ClubTier = Database['public']['Enums']['club_tier'];
type ClubRow = Database['public']['Tables']['clubs']['Row'];
type ClubInsert = Database['public']['Tables']['clubs']['Insert'];
type ClubUpdate = Database['public']['Tables']['clubs']['Update'];

export interface Club extends ClubRow {
  // Add computed properties if needed
  distance?: number; // For location-based searches
}

export interface ClubFilters {
  city?: string;
  tier?: ClubTier[];
  amenities?: string[];
  location?: {
    latitude: number;
    longitude: number;
    radius?: number; // in km
  };
  search?: string;
}

export class ClubsAPI {
  /**
   * Get all clubs with optional filters
   */
  static async getClubs(filters?: ClubFilters): Promise<Club[]> {
    try {
      let query = supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters?.tier && filters.tier.length > 0) {
        query = query.in('tier', filters.tier);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;

      let clubs = data as Club[];

      // Apply location-based filtering if coordinates provided
      if (filters?.location) {
        clubs = this.filterByLocation(clubs, filters.location);
      }

      return clubs;
    } catch (error) {
      console.error('Get clubs error:', error);
      throw error;
    }
  }

  /**
   * Get club by ID
   */
  static async getClubById(id: string): Promise<Club | null> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get club by ID error:', error);
      throw error;
    }
  }

  /**
   * Get clubs by tier
   */
  static async getClubsByTier(tier: ClubTier): Promise<Club[]> {
    return this.getClubs({ tier: [tier] });
  }

  /**
   * Get nearby clubs based on user location
   */
  static async getNearbyClubs(
    latitude: number, 
    longitude: number, 
    radius: number = 10
  ): Promise<Club[]> {
    return this.getClubs({
      location: { latitude, longitude, radius }
    });
  }

  /**
   * Create new club (Club Owner only)
   */
  static async createClub(clubData: Omit<ClubInsert, 'id' | 'created_at' | 'owner_id'>): Promise<Club> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('clubs')
        .insert({
          ...clubData,
          owner_id: user.id,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create club error:', error);
      throw error;
    }
  }

  /**
   * Update club (Owner only)
   */
  static async updateClub(id: string, updates: ClubUpdate): Promise<Club> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update club error:', error);
      throw error;
    }
  }

  /**
   * Delete club (Owner/Admin only)
   */
  static async deleteClub(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete club error:', error);
      throw error;
    }
  }

  /**
   * Get clubs owned by current user
   */
  static async getMyClubs(): Promise<Club[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get my clubs error:', error);
      throw error;
    }
  }

  /**
   * Get club capacity for a specific date
   */
  static async getClubCapacity(clubId: string, date: string) {
    try {
      const { data, error } = await supabase
        .from('club_capacity')
        .select('*')
        .eq('club_id', clubId)
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get club capacity error:', error);
      throw error;
    }
  }

  /**
   * Update club capacity
   */
  static async updateClubCapacity(
    clubId: string, 
    date: string, 
    maxCapacity: number, 
    currentOccupancy: number = 0
  ) {
    try {
      const { data, error } = await supabase
        .from('club_capacity')
        .upsert({
          club_id: clubId,
          date,
          max_capacity: maxCapacity,
          current_occupancy: currentOccupancy,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update club capacity error:', error);
      throw error;
    }
  }

  /**
   * Check if club has availability
   */
  static async checkAvailability(clubId: string, date: string): Promise<boolean> {
    try {
      const capacity = await this.getClubCapacity(clubId, date);
      
      if (!capacity) return true; // No capacity limits set
      
      return capacity.current_occupancy < capacity.max_capacity;
    } catch (error) {
      console.error('Check availability error:', error);
      return false;
    }
  }

  /**
   * Filter clubs by location (client-side calculation)
   */
  private static filterByLocation(
    clubs: Club[], 
    location: { latitude: number; longitude: number; radius?: number }
  ): Club[] {
    const { latitude: userLat, longitude: userLng, radius = 10 } = location;

    return clubs
      .map(club => ({
        ...club,
        distance: this.calculateDistance(
          userLat, 
          userLng, 
          club.latitude, 
          club.longitude
        ),
      }))
      .filter(club => club.distance! <= radius)
      .sort((a, b) => a.distance! - b.distance!);
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Get club pricing tiers
   */
  static getClubTierPricing(): Record<ClubTier, number> {
    return {
      BASIC: 50,
      STANDARD: 90,
      PREMIUM: 150,
      ULTRA_LUXE: 320,
    };
  }

  /**
   * Get club tier details
   */
  static getClubTierDetails(): Record<ClubTier, {
    name: string;
    price: number;
    description: string;
    features: string[];
    emoji: string;
  }> {
    return {
      BASIC: {
        name: 'Basic',
        price: 50,
        description: 'Local gyms & fitness centers',
        features: ['🏋️ Basic facilities', '⚙️ Standard equipment', '💬 Basic support', '📍 1-2 locations/city'],
        emoji: '🏃',
      },
      STANDARD: {
        name: 'Standard',
        price: 90,
        description: 'Premium gyms with extras',
        features: ['✅ All Basic features', '🔥 Premium equipment', '👥 Group classes', '⭐ Priority support', '📍 3-5 locations/city'],
        emoji: '💪',
      },
      PREMIUM: {
        name: 'Premium',
        price: 150,
        description: 'Luxury gyms & spas',
        features: ['✅ All Standard features', '✨ Luxury amenities', '👨‍💼 Personal training', '🧖‍♀️ Spa access', '🏆 Premium locations'],
        emoji: '🥇',
      },
      ULTRA_LUXE: {
        name: 'Ultra Luxury',
        price: 320,
        description: 'Exclusive resorts & venues',
        features: ['✅ All Premium features', '🏖️ Exclusive venues', '🤵 Concierge service', '♾️ Unlimited access', '⭐⭐⭐⭐⭐ 5-star experiences'],
        emoji: '💎',
      },
    };
  }
}

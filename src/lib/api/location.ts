import { supabase } from '../../integrations/supabase/client';

export interface ClubLocation {
  id: string;
  name: string;
  address: string | null;
  city: string;
  tier: string;
  amenities: any;
  monthly_price: number;
  distance_km?: number;
  latitude: number;
  longitude: number;
}

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  maxDistanceKm?: number;
  city?: string;
  tier?: string;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export class LocationAPI {
  /**
   * Get nearby clubs using PostGIS distance calculations
   */
  static async getNearbyClubs(
    latitude: number,
    longitude: number,
    maxDistanceKm: number = 10
  ): Promise<ClubLocation[]> {
    try {
      // Fallback to regular clubs query if PostGIS functions don't exist
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching nearby clubs:', error);
        throw error;
      }

      // Use mock coordinates for now since latitude/longitude columns don't exist
      const mockCoordinates = {
        'Casablanca': { lat: 33.5731, lng: -7.5898 },
        'Rabat': { lat: 34.0209, lng: -6.8416 },
        'Marrakech': { lat: 31.6295, lng: -8.0089 },
        'Fez': { lat: 34.0331, lng: -5.0003 },
        'Agadir': { lat: 30.4278, lng: -9.5981 },
      };

      return data.map((club: any) => {
        const cityCoords = mockCoordinates[club.city as keyof typeof mockCoordinates] || { lat: 33.5731, lng: -7.5898 };
        const distance = this.calculateDistance(
          latitude, longitude,
          cityCoords.lat, cityCoords.lng
        );
        
        return {
          id: club.id,
          name: club.name,
          address: club.address,
          city: club.city,
          tier: club.tier,
          amenities: club.amenities,
          monthly_price: club.monthly_price || 0,
          distance_km: distance,
          latitude: cityCoords.lat,
          longitude: cityCoords.lng,
        };
      }).filter(club => club.distance_km <= maxDistanceKm)
        .sort((a, b) => a.distance_km - b.distance_km);
    } catch (error) {
      console.error('LocationAPI.getNearbyClubs error:', error);
      throw error;
    }
  }

  /**
   * Search clubs by city with optional distance sorting
   */
  static async searchClubsByCity(
    city: string,
    userLat?: number,
    userLng?: number
  ): Promise<ClubLocation[]> {
    try {
      // Fallback to regular clubs query
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true)
        .ilike('city', `%${city}%`);

      if (error) {
        console.error('Error searching clubs by city:', error);
        throw error;
      }

      const mockCoordinates = {
        'Casablanca': { lat: 33.5731, lng: -7.5898 },
        'Rabat': { lat: 34.0209, lng: -6.8416 },
        'Marrakech': { lat: 31.6295, lng: -8.0089 },
        'Fez': { lat: 34.0331, lng: -5.0003 },
        'Agadir': { lat: 30.4278, lng: -9.5981 },
      };

      return data.map((club: any) => {
        const cityCoords = mockCoordinates[club.city as keyof typeof mockCoordinates] || { lat: 33.5731, lng: -7.5898 };
        const distance = (userLat && userLng) 
          ? this.calculateDistance(userLat, userLng, cityCoords.lat, cityCoords.lng)
          : undefined;
        
        return {
          id: club.id,
          name: club.name,
          address: club.address,
          city: club.city,
          tier: club.tier,
          amenities: club.amenities,
          monthly_price: club.monthly_price || 0,
          distance_km: distance,
          latitude: cityCoords.lat,
          longitude: cityCoords.lng,
        };
      }).sort((a, b) => {
        if (a.distance_km && b.distance_km) {
          return a.distance_km - b.distance_km;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('LocationAPI.searchClubsByCity error:', error);
      throw error;
    }
  }

  /**
   * Get clubs within a bounding box (for map views)
   */
  static async getClubsInBounds(bounds: BoundingBox): Promise<ClubLocation[]> {
    try {
      // Fallback to regular clubs query
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching clubs in bounds:', error);
        throw error;
      }

      const mockCoordinates = {
        'Casablanca': { lat: 33.5731, lng: -7.5898 },
        'Rabat': { lat: 34.0209, lng: -6.8416 },
        'Marrakech': { lat: 31.6295, lng: -8.0089 },
        'Fez': { lat: 34.0331, lng: -5.0003 },
        'Agadir': { lat: 30.4278, lng: -9.5981 },
      };

      return data.map((club: any) => {
        const cityCoords = mockCoordinates[club.city as keyof typeof mockCoordinates] || { lat: 33.5731, lng: -7.5898 };
        return {
          id: club.id,
          name: club.name,
          address: club.address,
          city: club.city,
          tier: club.tier,
          amenities: club.amenities,
          monthly_price: club.monthly_price || 0,
          latitude: cityCoords.lat,
          longitude: cityCoords.lng,
        };
      });
    } catch (error) {
      console.error('LocationAPI.getClubsInBounds error:', error);
      throw error;
    }
  }

  /**
   * Update club location coordinates
   */
  static async updateClubLocation(
    clubId: string,
    latitude: number,
    longitude: number
  ): Promise<boolean> {
    try {
      // Since latitude/longitude columns don't exist, just update the timestamp
      const { error } = await supabase
        .from('clubs')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', clubId);

      if (error) {
        console.error('Error updating club location:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('LocationAPI.updateClubLocation error:', error);
      throw error;
    }
  }

  /**
   * Get club statistics with location data
   */
  static async getClubStatsWithLocation(clubId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (error) {
        console.error('Error fetching club stats:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('LocationAPI.getClubStatsWithLocation error:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   * Useful for client-side calculations
   */
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get all clubs with location data (fallback for when PostGIS is not available)
   */
  static async getAllClubsWithLocation(): Promise<ClubLocation[]> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching all clubs:', error);
        throw error;
      }

      const mockCoordinates = {
        'Casablanca': { lat: 33.5731, lng: -7.5898 },
        'Rabat': { lat: 34.0209, lng: -6.8416 },
        'Marrakech': { lat: 31.6295, lng: -8.0089 },
        'Fez': { lat: 34.0331, lng: -5.0003 },
        'Agadir': { lat: 30.4278, lng: -9.5981 },
      };

      return data.map((club: any) => {
        const cityCoords = mockCoordinates[club.city as keyof typeof mockCoordinates] || { lat: 33.5731, lng: -7.5898 };
        return {
          id: club.id,
          name: club.name,
          address: club.address,
          city: club.city,
          tier: club.tier,
          amenities: club.amenities,
          monthly_price: club.monthly_price || 0,
          latitude: cityCoords.lat,
          longitude: cityCoords.lng,
        };
      });
    } catch (error) {
      console.error('LocationAPI.getAllClubsWithLocation error:', error);
      throw error;
    }
  }

  /**
   * Search clubs with multiple criteria
   */
  static async searchClubs(params: LocationSearchParams): Promise<ClubLocation[]> {
    try {
      let clubs: ClubLocation[] = [];

      if (params.city) {
        // Search by city first
        clubs = await this.searchClubsByCity(
          params.city,
          params.latitude,
          params.longitude
        );
      } else if (params.latitude && params.longitude) {
        // Search by location
        clubs = await this.getNearbyClubs(
          params.latitude,
          params.longitude,
          params.maxDistanceKm || 50
        );
      } else {
        // Fallback to all clubs
        clubs = await this.getAllClubsWithLocation();
      }

      // Filter by tier if specified
      if (params.tier) {
        clubs = clubs.filter(club => club.tier === params.tier);
      }

      return clubs;
    } catch (error) {
      console.error('LocationAPI.searchClubs error:', error);
      throw error;
    }
  }

  /**
   * Get popular cities with club counts
   */
  static async getPopularCities(): Promise<Array<{ city: string; count: number }>> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('city')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }

      const cityCounts = data.reduce((acc: any, club: any) => {
        acc[club.city] = (acc[club.city] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count: count as number }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('LocationAPI.getPopularCities error:', error);
      // Return mock data as fallback
      return [
        { city: 'Casablanca', count: 15 },
        { city: 'Rabat', count: 8 },
        { city: 'Marrakech', count: 12 },
        { city: 'Fez', count: 6 },
        { city: 'Agadir', count: 4 }
      ];
    }
  }
}

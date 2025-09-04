import { supabase } from '@/integrations/supabase/client';

export class DataSeeder {
  /**
   * Seed products if none exist
   */
  static async seedProducts() {
    try {
      // Check if products exist
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      if (existingProducts && existingProducts.length > 0) {
        console.log('Products already exist, skipping seed');
        return;
      }

      const products = [
        // Single entries
        {
          name: 'Blane Basic',
          type: 'SINGLE',
          price_mad: 50,
          credits: 1,
          tier_scope: ['BASIC'],
          is_active: true,
        },
        {
          name: 'Blane Standard',
          type: 'SINGLE',
          price_mad: 90,
          credits: 1,
          tier_scope: ['STANDARD'],
          is_active: true,
        },
        {
          name: 'Blane Premium',
          type: 'SINGLE',
          price_mad: 150,
          credits: 1,
          tier_scope: ['PREMIUM'],
          is_active: true,
        },
        {
          name: 'Blane Ultra Luxury',
          type: 'SINGLE',
          price_mad: 320,
          credits: 1,
          tier_scope: ['ULTRA_LUXE'],
          is_active: true,
        },
        // Pack 5
        {
          name: 'Blane Pack 5 - Multi Access',
          type: 'PACK5',
          price_mad: 450,
          credits: 5,
          tier_scope: ['BASIC', 'STANDARD', 'PREMIUM'],
          is_active: true,
        },
        // Pack 10
        {
          name: 'Blane Pack 10 - All Access',
          type: 'PACK10',
          price_mad: 800,
          credits: 10,
          tier_scope: ['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA_LUXE'],
          is_active: true,
        },
        // Passes
        {
          name: 'Blane Pass Standard',
          type: 'PASS_STANDARD',
          price_mad: 1200,
          credits: 999,
          tier_scope: ['BASIC', 'STANDARD'],
          is_active: true,
        },
        {
          name: 'Blane Pass Premium',
          type: 'PASS_PREMIUM',
          price_mad: 2000,
          credits: 999,
          tier_scope: ['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA_LUXE'],
          is_active: true,
        },
      ];

      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (error) throw error;

      console.log(`✅ Seeded ${data.length} products`);
      return data;
    } catch (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  }

  /**
   * Seed clubs if none exist
   */
  static async seedClubs() {
    try {
      // Check if clubs exist
      const { data: existingClubs } = await supabase
        .from('clubs')
        .select('id')
        .limit(1);

      if (existingClubs && existingClubs.length > 0) {
        console.log('Clubs already exist, skipping seed');
        return;
      }

      const clubs = [
        {
          name: 'FitZone Casablanca',
          description: 'Modern fitness center in the heart of Casablanca',
          tier: 'STANDARD',
          city: 'Casablanca',
          address: 'Boulevard Mohammed V, Casablanca',
          latitude: 33.5731,
          longitude: -7.5898,
          amenities: ['cardio', 'weights', 'group_classes'],
          contact_phone: '+212522123456',
          contact_email: 'info@fitzone-casa.ma',
          is_active: true,
        },
        {
          name: 'Premium Gym Casa',
          description: 'Luxury fitness experience with personal trainers',
          tier: 'PREMIUM',
          city: 'Casablanca',
          address: 'Maarif, Casablanca',
          latitude: 33.5792,
          longitude: -7.6187,
          amenities: ['cardio', 'weights', 'spa', 'personal_training', 'pool'],
          contact_phone: '+212522234567',
          contact_email: 'contact@premiumgym.ma',
          is_active: true,
        },
        {
          name: 'Basic Fitness Center',
          description: 'Affordable gym with essential equipment',
          tier: 'BASIC',
          city: 'Casablanca',
          address: 'Derb Ghallef, Casablanca',
          latitude: 33.5650,
          longitude: -7.6034,
          amenities: ['cardio', 'weights'],
          contact_phone: '+212522345678',
          contact_email: 'info@basicfitness.ma',
          is_active: true,
        },
        {
          name: 'Royal Fitness Rabat',
          description: 'Premium fitness center in Morocco\'s capital',
          tier: 'PREMIUM',
          city: 'Rabat',
          address: 'Agdal, Rabat',
          latitude: 34.0209,
          longitude: -6.8417,
          amenities: ['cardio', 'weights', 'pool', 'group_classes'],
          contact_phone: '+212537123456',
          contact_email: 'info@royalfitness.ma',
          is_active: true,
        },
        {
          name: 'Atlas Fitness Marrakech',
          description: 'Modern gym with mountain views',
          tier: 'STANDARD',
          city: 'Marrakech',
          address: 'Gueliz, Marrakech',
          latitude: 31.6348,
          longitude: -8.0099,
          amenities: ['cardio', 'weights', 'group_classes'],
          contact_phone: '+212524234567',
          contact_email: 'info@atlasfitness.ma',
          is_active: true,
        },
      ];

      const { data, error } = await supabase
        .from('clubs')
        .insert(clubs)
        .select();

      if (error) throw error;

      console.log(`✅ Seeded ${data.length} clubs`);
      return data;
    } catch (error) {
      console.error('Error seeding clubs:', error);
      throw error;
    }
  }

  /**
   * Seed club capacity for current date
   */
  static async seedClubCapacity() {
    try {
      const { data: clubs } = await supabase
        .from('clubs')
        .select('id, tier')
        .eq('is_active', true);

      if (!clubs || clubs.length === 0) {
        console.log('No clubs found to seed capacity');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const capacityData = clubs.map(club => ({
        club_id: club.id,
        date: today,
        max_capacity: this.getMaxCapacityByTier(club.tier),
        current_occupancy: Math.floor(Math.random() * 20), // Random for demo
      }));

      const { data, error } = await supabase
        .from('club_capacity')
        .upsert(capacityData, { onConflict: 'club_id, date' })
        .select();

      if (error) throw error;

      console.log(`✅ Seeded capacity for ${data.length} clubs`);
      return data;
    } catch (error) {
      console.error('Error seeding club capacity:', error);
      throw error;
    }
  }

  /**
   * Run all seed operations
   */
  static async seedAll() {
    try {
      console.log('🌱 Starting data seeding...');
      
      await this.seedProducts();
      await this.seedClubs();
      await this.seedClubCapacity();
      
      console.log('🎉 Data seeding completed successfully!');
      
      return {
        success: true,
        message: 'Database seeded with test data',
      };
    } catch (error) {
      console.error('Seeding failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clear all test data (use with caution!)
   */
  static async clearTestData() {
    try {
      console.log('🗑️ Clearing test data...');
      
      // Clear in reverse order of dependencies
      await supabase.from('club_capacity').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('clubs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ Test data cleared');
      return { success: true };
    } catch (error) {
      console.error('Error clearing test data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get max capacity based on club tier
   */
  private static getMaxCapacityByTier(tier: string): number {
    switch (tier) {
      case 'BASIC': return 50;
      case 'STANDARD': return 80;
      case 'PREMIUM': return 120;
      case 'ULTRA_LUXE': return 200;
      default: return 50;
    }
  }

  /**
   * Check database status
   */
  static async getDatabaseStatus() {
    try {
      const [products, clubs, capacity] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('clubs').select('id', { count: 'exact', head: true }),
        supabase.from('club_capacity').select('id', { count: 'exact', head: true }),
      ]);

      return {
        products: products.count || 0,
        clubs: clubs.count || 0,
        capacity_records: capacity.count || 0,
        ready_for_testing: (products.count || 0) > 0 && (clubs.count || 0) > 0,
      };
    } catch (error) {
      console.error('Error checking database status:', error);
      return {
        products: 0,
        clubs: 0,
        capacity_records: 0,
        ready_for_testing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProductType = Database['public']['Enums']['product_type'];
type ClubTier = Database['public']['Enums']['club_tier'];
type ProductRow = Database['public']['Tables']['products']['Row'];

export interface Product extends ProductRow {
  // Add computed properties
  discountPercentage?: number;
}

export interface ProductFilters {
  type?: ProductType[];
  tier_scope?: ClubTier[];
  is_active?: boolean;
}

export class ProductsAPI {
  /**
   * Get all products with optional filters
   */
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*');

      // Apply filters
      if (filters?.type && filters.type.length > 0) {
        query = query.in('type', filters.type);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query.order('type');

      if (error) throw error;

      let products = data as Product[];

      // Filter by tier scope if provided
      if (filters?.tier_scope && filters.tier_scope.length > 0) {
        products = products.filter(product => 
          filters.tier_scope!.some(tier => product.tier_scope.includes(tier))
        );
      }

      // Add discount percentages for packs
      products = products.map(product => ({
        ...product,
        discountPercentage: this.calculateDiscountPercentage(product),
      }));

      return products;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return {
        ...data,
        discountPercentage: this.calculateDiscountPercentage(data),
      };
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }

  /**
   * Get products by type
   */
  static async getProductsByType(type: ProductType): Promise<Product[]> {
    return this.getProducts({ type: [type], is_active: true });
  }

  /**
   * Get all single entry products (Blane)
   */
  static async getSingleEntryProducts(): Promise<Product[]> {
    return this.getProductsByType('SINGLE');
  }

  /**
   * Get all pack products (Blane Pack)
   */
  static async getPackProducts(): Promise<Product[]> {
    const pack5 = await this.getProductsByType('PACK5');
    const pack10 = await this.getProductsByType('PACK10');
    return [...pack5, ...pack10];
  }

  /**
   * Get all pass products (Blane Pass)
   */
  static async getPassProducts(): Promise<Product[]> {
    const standard = await this.getProductsByType('PASS_STANDARD');
    const premium = await this.getProductsByType('PASS_PREMIUM');
    return [...standard, ...premium];
  }

  /**
   * Get products for specific club tier
   */
  static async getProductsForTier(tier: ClubTier): Promise<Product[]> {
    return this.getProducts({ 
      tier_scope: [tier], 
      is_active: true 
    });
  }

  /**
   * Calculate price for specific tier
   */
  static calculatePriceForTier(product: Product, tier: ClubTier): number {
    if (!product.tier_scope.includes(tier)) {
      throw new Error(`Product ${product.name} not available for tier ${tier}`);
    }

    // Base tier prices from club tiers
    const tierPrices: Record<ClubTier, number> = {
      BASIC: 50,
      STANDARD: 90,
      PREMIUM: 150,
      ULTRA_LUXE: 320,
    };

    const basePrice = tierPrices[tier];

    // Apply product multipliers based on type
    switch (product.type) {
      case 'SINGLE':
        return basePrice;
      
      case 'PACK5':
        return Math.round(basePrice * 5 * 0.9); // 10% discount
      
      case 'PACK10':
        return Math.round(basePrice * 10 * 0.8); // 20% discount
      
      case 'PASS_STANDARD':
        return 1200; // Fixed price for standard pass
      
      case 'PASS_PREMIUM':
        return 2000; // Fixed price for premium pass
      
      default:
        return basePrice;
    }
  }

  /**
   * Calculate discount percentage for pack products
   */
  private static calculateDiscountPercentage(product: Product): number {
    switch (product.type) {
      case 'PACK5':
        return 10;
      case 'PACK10':
        return 20;
      default:
        return 0;
    }
  }

  /**
   * Get product details with descriptions and features
   */
  static getProductDetails(): Record<ProductType, {
    name: string;
    subtitle: string;
    description: string;
    cta: string;
    badge: string;
    emoji: string;
    features: string[];
  }> {
    return {
      SINGLE: {
        name: 'Blane',
        subtitle: 'Single Entry',
        description: 'Perfect for trying new places',
        cta: '🎯 Book Now',
        badge: 'Try Once',
        emoji: '⚡',
        features: ['Single gym access', 'Valid for 24 hours', 'Any tier level', 'Instant QR code'],
      },
      PACK5: {
        name: 'Blane Pack 5',
        subtitle: '5 Entries',
        description: 'Great for regular fitness',
        cta: '📦 Get Pack',
        badge: '10% Off',
        emoji: '📦',
        features: ['5 gym entries', '10% discount', 'Valid for 3 months', 'Multi-club access'],
      },
      PACK10: {
        name: 'Blane Pack 10',
        subtitle: '10 Entries',
        description: 'Best value for fitness enthusiasts',
        cta: '🎉 Best Deal',
        badge: '20% Off',
        emoji: '🎁',
        features: ['10 gym entries', '20% discount', 'Valid for 3 months', 'Multi-club access'],
      },
      PASS_STANDARD: {
        name: 'Blane Pass Standard',
        subtitle: 'Monthly Access',
        description: 'Unlimited access to Standard+ gyms',
        cta: '🔓 Unlock All',
        badge: 'Most Popular',
        emoji: '🔓',
        features: ['Unlimited entries', 'Standard & Premium gyms', 'Monthly billing', 'Priority booking'],
      },
      PASS_PREMIUM: {
        name: 'Blane Pass Premium',
        subtitle: 'Premium Monthly',
        description: 'Full access to all luxury venues',
        cta: '👑 Go Premium',
        badge: 'Luxury',
        emoji: '👑',
        features: ['All tier access', 'Luxury amenities', 'Concierge support', 'Priority everything'],
      },
    };
  }

  /**
   * Validate product availability for club tier
   */
  static isProductAvailableForTier(product: Product, tier: ClubTier): boolean {
    return product.tier_scope.includes(tier);
  }

  /**
   * Get credits remaining for product
   */
  static getCreditsRemaining(product: Product): number {
    return product.credits;
  }

  /**
   * Check if product is a pack (multi-entry)
   */
  static isPack(product: Product): boolean {
    return ['PACK5', 'PACK10'].includes(product.type);
  }

  /**
   * Check if product is a pass (unlimited)
   */
  static isPass(product: Product): boolean {
    return ['PASS_STANDARD', 'PASS_PREMIUM'].includes(product.type);
  }

  /**
   * Check if product is single entry
   */
  static isSingleEntry(product: Product): boolean {
    return product.type === 'SINGLE';
  }

  /**
   * Get recommended products based on user activity
   */
  static async getRecommendedProducts(userId?: string): Promise<Product[]> {
    // For now, return popular products
    // In the future, this could be based on user preferences and activity
    try {
      const products = await this.getProducts({ is_active: true });
      
      // Sort by popularity (packs first, then passes, then singles)
      return products.sort((a, b) => {
        const order = ['PACK10', 'PACK5', 'PASS_STANDARD', 'PASS_PREMIUM', 'SINGLE'];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
    } catch (error) {
      console.error('Get recommended products error:', error);
      return [];
    }
  }
}

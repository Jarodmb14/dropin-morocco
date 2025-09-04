import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type OrderStatus = Database['public']['Enums']['order_status'];
type ClubTier = Database['public']['Enums']['club_tier'];
type ProductType = Database['public']['Enums']['product_type'];

/**
 * Drop-In Morocco Business Rules Implementation
 * Based on the comprehensive business requirements
 */
export class BusinessRules {
  
  // 1. USER ACCESS RULES
  
  /**
   * 1.1 Check if user can purchase passes
   */
  static async canUserPurchase(userId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      return !!user; // Only authenticated users can purchase
    } catch (error) {
      return false;
    }
  }

  /**
   * 1.2 Check if user can view/manage specific booking
   */
  static async canUserAccessBooking(userId: string, bookingId: string): Promise<boolean> {
    try {
      const { data: booking } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .single();
      
      return !!booking;
    } catch (error) {
      return false;
    }
  }

  /**
   * 1.3 Check if partner can access venue data
   */
  static async canPartnerAccessVenue(userId: string, venueId: string): Promise<boolean> {
    try {
      const { data: venue } = await supabase
        .from('clubs')
        .select('owner_id')
        .eq('id', venueId)
        .eq('owner_id', userId)
        .single();
      
      return !!venue;
    } catch (error) {
      return false;
    }
  }

  /**
   * 1.4 Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .eq('role', 'ADMIN')
        .single();
      
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // 2. VENUE & PRODUCT RULES

  /**
   * 2.2 Calculate automatic Blane pricing based on monthly subscription price (primary) and venue tier (fallback)
   */
  static calculateBlanePricing(venueTier: ClubTier, monthlyPrice?: number): number {
    // Primary logic: use monthly price if provided
    if (monthlyPrice) {
      if (monthlyPrice < 400) return 50;   // Standard gyms or monthly < 400 DHS
      if (monthlyPrice <= 800) return 120; // Premium gyms/hotels 4★ or monthly 400–800 DHS  
      return 350;                          // Luxury gyms/hotels 5★ or monthly > 800 DHS
    }
    
    // Fallback: use venue tier if no monthly price
    switch (venueTier) {
      case 'BASIC':
      case 'STANDARD':
        return 50; // Standard gyms
      case 'PREMIUM':
        return 120; // Premium gyms/hotels 4★
      case 'ULTRA_LUXE':
        return 350; // Luxury gyms/hotels 5★
      default:
        return 50; // Default to standard
    }
  }

  /**
   * 2.3 Validate that venue has at least one active Blane product
   */
  static async validateVenueHasBlaneProduct(venueId: string): Promise<boolean> {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('type', 'SINGLE')
        .eq('is_active', true)
        // Note: Need to add venue_id relationship to products table
        .limit(1);
      
      return products && products.length > 0;
    } catch (error) {
      return false;
    }
  }

  // 3. BOOKINGS & PAYMENTS

  /**
   * 3.1 Create booking with PENDING status
   */
  static async createPendingBooking(
    userId: string, 
    productId: string, 
    venueId: string,
    grossAmount: number
  ): Promise<string> {
    const commission = this.calculateCommission(grossAmount);
    const netPartnerAmount = grossAmount - commission;

    const { data: booking, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: grossAmount,
        status: 'PENDING',
        // Add business rule fields
        gross_amount: grossAmount,
        commission_amount: commission,
        net_partner_amount: netPartnerAmount,
      })
      .select('id')
      .single();

    if (error) throw error;
    return booking.id;
  }

  /**
   * 3.2 Update booking to PAID after payment confirmation
   */
  static async confirmPayment(bookingId: string, stripePaymentId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'PAID',
        // Add payment confirmation timestamp
        paid_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('status', 'PENDING'); // Only update if still pending

    if (error) throw error;

    // Generate QR code after payment confirmation
    await this.generateBookingQRCode(bookingId);
  }

  /**
   * 3.3 Generate signed QR code for booking
   */
  static async generateBookingQRCode(bookingId: string): Promise<string> {
    try {
      const { data: booking } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          order_items(
            product_id,
            products(type)
          )
        `)
        .eq('id', bookingId)
        .single();

      if (!booking) throw new Error('Booking not found');

      const product = booking.order_items[0]?.products;
      const validityPeriod = this.getProductValidityPeriod(product?.type as ProductType);
      
      const qrData = {
        bookingId: booking.id,
        userId: booking.user_id,
        productKind: product?.type,
        validFrom: new Date().toISOString(),
        validTo: validityPeriod.validTo,
        nonce: this.generateNonce(),
      };

      // Sign the QR code data
      const signature = await this.signQRCode(qrData);
      const qrCode = `${JSON.stringify(qrData)}.${signature}`;

      // Store QR code in database
      await supabase
        .from('qr_codes')
        .insert({
          code: qrCode,
          order_id: bookingId,
          product_id: booking.order_items[0].product_id,
          status: 'ACTIVE',
          expires_at: validityPeriod.validTo,
        });

      return qrCode;
    } catch (error) {
      console.error('QR generation error:', error);
      throw error;
    }
  }

  /**
   * 3.5 Verify and use QR code at venue check-in
   */
  static async verifyAndUseQRCode(qrCode: string, venueId: string): Promise<{
    success: boolean;
    message: string;
    bookingId?: string;
  }> {
    try {
      // Parse and verify QR code signature
      const [dataStr, signature] = qrCode.split('.');
      const qrData = JSON.parse(dataStr);
      
      const isValidSignature = await this.verifyQRCodeSignature(qrData, signature);
      if (!isValidSignature) {
        return { success: false, message: 'Invalid QR code signature' };
      }

      // Check if QR code is still valid
      if (new Date() > new Date(qrData.validTo)) {
        return { success: false, message: 'QR code has expired' };
      }

      // Check if already used
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('id')
        .eq('qr_code', qrCode)
        .single();

      if (existingCheckin) {
        return { success: false, message: 'QR code already used' };
      }

      // Create check-in record
      await supabase
        .from('checkins')
        .insert({
          user_id: qrData.userId,
          club_id: venueId,
          qr_code: qrCode,
          checked_at: new Date().toISOString(),
        });

      // Update booking status to USED
      await supabase
        .from('orders')
        .update({ status: 'PAID' }) // Keep as PAID, track usage via checkins
        .eq('id', qrData.bookingId);

      // Update QR code status
      await supabase
        .from('qr_codes')
        .update({ status: 'USED' })
        .eq('code', qrCode);

      return { 
        success: true, 
        message: 'Check-in successful',
        bookingId: qrData.bookingId 
      };
    } catch (error) {
      console.error('QR verification error:', error);
      return { success: false, message: 'QR code verification failed' };
    }
  }

  // 4. COMMISSION & REVENUE SHARING

  /**
   * 4.1 & 4.2 Calculate 25% commission
   */
  static calculateCommission(grossAmount: number): number {
    return Math.round(grossAmount * 0.25);
  }

  /**
   * 4.4 Calculate partner payout for period
   */
  static async calculatePartnerPayout(
    partnerId: string, 
    fromDate: string, 
    toDate: string
  ): Promise<number> {
    const { data: bookings } = await supabase
      .from('orders')
      .select('net_partner_amount')
      .eq('partner_id', partnerId) // Need to add this relationship
      .in('status', ['PAID'])
      .gte('created_at', fromDate)
      .lte('created_at', toDate);

    return bookings?.reduce((sum, booking) => sum + (booking.net_partner_amount || 0), 0) || 0;
  }

  // 5. REFUNDS & CANCELLATIONS

  /**
   * 5.1 & 5.3 Process cancellation and refund
   */
  static async processCancellationRefund(bookingId: string): Promise<void> {
    // Check if booking can be cancelled
    const { data: booking } = await supabase
      .from('orders')
      .select('status, total_amount')
      .eq('id', bookingId)
      .single();

    if (!booking || booking.status !== 'PAID') {
      throw new Error('Booking cannot be cancelled');
    }

    // Update booking status
    await supabase
      .from('orders')
      .update({ 
        status: 'CANCELLED',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    // Cancel QR codes
    await supabase
      .from('qr_codes')
      .update({ status: 'CANCELLED' })
      .eq('order_id', bookingId);

    // Process Stripe refund (implement based on your payment integration)
    // await this.processStripeRefund(booking.stripe_payment_id, booking.total_amount);
  }

  // 6. VALIDITY & EXPIRATION

  /**
   * 6.1-6.3 Get product validity period
   */
  static getProductValidityPeriod(productType: ProductType): {
    validTo: string;
    durationDays: number;
  } {
    const now = new Date();
    
    switch (productType) {
      case 'SINGLE':
        // Expires end of day
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        return {
          validTo: endOfDay.toISOString(),
          durationDays: 1
        };
        
      case 'PACK5':
      case 'PACK10':
        // Expires after 3 months
        const threeMonthsLater = new Date(now);
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        return {
          validTo: threeMonthsLater.toISOString(),
          durationDays: 90
        };
        
      case 'PASS_STANDARD':
      case 'PASS_PREMIUM':
        // Expires after 30 days
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        return {
          validTo: oneMonthLater.toISOString(),
          durationDays: 30
        };
        
      default:
        // Default to same day expiry
        const defaultEndOfDay = new Date(now);
        defaultEndOfDay.setHours(23, 59, 59, 999);
        return {
          validTo: defaultEndOfDay.toISOString(),
          durationDays: 1
        };
    }
  }

  /**
   * 6.4 Mark expired bookings (for cron job)
   */
  static async markExpiredBookings(): Promise<number> {
    const now = new Date().toISOString();
    
    const { data: expiredBookings, error } = await supabase
      .from('qr_codes')
      .update({ status: 'EXPIRED' })
      .lt('expires_at', now)
      .eq('status', 'ACTIVE')
      .select('id');

    if (error) throw error;
    return expiredBookings?.length || 0;
  }

  // 7. REVIEWS & RATINGS

  /**
   * 7.1 Check if user can leave review (must have USED booking)
   */
  static async canUserReview(userId: string, venueId: string): Promise<boolean> {
    try {
      const { data: checkin } = await supabase
        .from('checkins')
        .select('id')
        .eq('user_id', userId)
        .eq('club_id', venueId)
        .limit(1)
        .single();
      
      return !!checkin;
    } catch (error) {
      return false;
    }
  }

  // 8. SECURITY & DATA INTEGRITY

  /**
   * 8.3 Sign QR code data
   */
  private static async signQRCode(qrData: any): Promise<string> {
    // Implement HMAC signing with server secret
    const dataString = JSON.stringify(qrData);
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    
    // In production, use a proper server secret
    const secret = 'DROP_IN_MOROCCO_QR_SECRET';
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, data);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  /**
   * Verify QR code signature
   */
  private static async verifyQRCodeSignature(qrData: any, signature: string): Promise<boolean> {
    try {
      const expectedSignature = await this.signQRCode(qrData);
      return signature === expectedSignature;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate secure nonce
   */
  private static generateNonce(): string {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  }

  // 9. REPORTS

  /**
   * 9.1 Get admin revenue report
   */
  static async getAdminRevenueReport(fromDate: string, toDate: string): Promise<{
    totalGrossRevenue: number;
    totalCommission: number;
    totalNetPayouts: number;
    bookingCount: number;
  }> {
    const { data: bookings } = await supabase
      .from('orders')
      .select('gross_amount, commission_amount, net_partner_amount')
      .eq('status', 'PAID')
      .gte('created_at', fromDate)
      .lte('created_at', toDate);

    const totalGrossRevenue = bookings?.reduce((sum, b) => sum + (b.gross_amount || 0), 0) || 0;
    const totalCommission = bookings?.reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0;
    const totalNetPayouts = bookings?.reduce((sum, b) => sum + (b.net_partner_amount || 0), 0) || 0;

    return {
      totalGrossRevenue,
      totalCommission,
      totalNetPayouts,
      bookingCount: bookings?.length || 0,
    };
  }

  /**
   * 9.2 Get partner revenue report
   */
  static async getPartnerRevenueReport(
    partnerId: string, 
    fromDate: string, 
    toDate: string
  ): Promise<{
    netRevenue: number;
    bookings: any[];
    commissionDeducted: number;
  }> {
    const { data: bookings } = await supabase
      .from('orders')
      .select(`
        id,
        gross_amount,
        commission_amount,
        net_partner_amount,
        created_at,
        order_items(
          products(name, type)
        )
      `)
      .eq('partner_id', partnerId) // Need to add this relationship
      .eq('status', 'PAID')
      .gte('created_at', fromDate)
      .lte('created_at', toDate);

    const netRevenue = bookings?.reduce((sum, b) => sum + (b.net_partner_amount || 0), 0) || 0;
    const commissionDeducted = bookings?.reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0;

    return {
      netRevenue,
      bookings: bookings || [],
      commissionDeducted,
    };
  }
}

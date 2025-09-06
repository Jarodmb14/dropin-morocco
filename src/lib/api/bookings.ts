// Bookings API for Drop-In Morocco
// Handles all booking-related operations

import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  user_id: string;
  club_id: string;
  booking_type: 'SINGLE_SESSION' | 'DAILY_PASS' | 'WEEKLY_PASS' | 'MONTHLY_PASS';
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'EXPIRED';
  booked_at: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  credits_required: number;
  credits_deducted: number;
  price_per_credit: number;
  total_amount: number;
  qr_code?: string;
  qr_code_generated_at?: string;
  qr_code_expires_at?: string;
  access_granted_at?: string;
  notes?: string;
  special_requests?: string;
  equipment_reserved?: string[];
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_method?: string;
  payment_reference?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
}

export interface CreateBookingData {
  club_id: string;
  booking_type: 'SINGLE_SESSION' | 'DAILY_PASS' | 'WEEKLY_PASS' | 'MONTHLY_PASS';
  scheduled_start: string;
  scheduled_end: string;
  credits_required: number;
  price_per_credit: number;
  notes?: string;
  special_requests?: string;
  equipment_reserved?: string[];
}

export interface BookingWithDetails extends Booking {
  club_name: string;
  club_tier: string;
  user_name: string;
  user_email: string;
}

export class BookingsAPI {
  /**
   * Create a new booking
   */
  static async createBooking(data: CreateBookingData): Promise<Booking | null> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          club_id: data.club_id,
          booking_type: data.booking_type,
          scheduled_start: data.scheduled_start,
          scheduled_end: data.scheduled_end,
          credits_required: data.credits_required,
          price_per_credit: data.price_per_credit,
          total_amount: data.credits_required * data.price_per_credit,
          notes: data.notes,
          special_requests: data.special_requests,
          equipment_reserved: data.equipment_reserved,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        return null;
      }

      return booking;
    } catch (error) {
      console.error('Error in createBooking:', error);
      return null;
    }
  }

  /**
   * Get user's bookings
   */
  static async getUserBookings(userId: string, limit: number = 50): Promise<BookingWithDetails[]> {
    try {
      const { data, error } = await supabase.rpc('get_user_bookings', {
        input_user_id: userId,
        limit_count: limit
      });

      if (error) {
        console.error('Error fetching user bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserBookings:', error);
      return [];
    }
  }

  /**
   * Get club's bookings
   */
  static async getClubBookings(clubId: string, limit: number = 50): Promise<BookingWithDetails[]> {
    try {
      const { data, error } = await supabase.rpc('get_club_bookings', {
        input_club_id: clubId,
        limit_count: limit
      });

      if (error) {
        console.error('Error fetching club bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getClubBookings:', error);
      return [];
    }
  }

  /**
   * Generate QR code for booking
   */
  static async generateQRCode(bookingId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('generate_booking_qr_code', {
        booking_id: bookingId
      });

      if (error) {
        console.error('Error generating QR code:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in generateQRCode:', error);
      return null;
    }
  }

  /**
   * Validate QR code
   */
  static async validateQRCode(qrCode: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('validate_booking_qr_code', {
        qr_code_input: qrCode
      });

      if (error) {
        console.error('Error validating QR code:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in validateQRCode:', error);
      return null;
    }
  }

  /**
   * Process booking (deduct credits and confirm)
   */
  static async processBooking(bookingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('process_booking', {
        booking_id: bookingId
      });

      if (error) {
        console.error('Error processing booking:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in processBooking:', error);
      return false;
    }
  }

  /**
   * Start gym session
   */
  static async startGymSession(bookingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('start_gym_session', {
        booking_id: bookingId
      });

      if (error) {
        console.error('Error starting gym session:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in startGymSession:', error);
      return false;
    }
  }

  /**
   * End gym session
   */
  static async endGymSession(bookingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('end_gym_session', {
        booking_id: bookingId
      });

      if (error) {
        console.error('Error ending gym session:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in endGymSession:', error);
      return false;
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(
    bookingId: string, 
    cancelledByUserId: string, 
    reason?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('cancel_booking', {
        booking_id: bookingId,
        cancelled_by_user_id: cancelledByUserId,
        reason: reason
      });

      if (error) {
        console.error('Error cancelling booking:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in cancelBooking:', error);
      return false;
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) {
        console.error('Error fetching booking:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getBookingById:', error);
      return null;
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateBooking:', error);
      return null;
    }
  }

  /**
   * Get booking analytics
   */
  static async getBookingAnalytics(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('booking_analytics')
        .select('*')
        .order('booking_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching booking analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBookingAnalytics:', error);
      return [];
    }
  }

  /**
   * Check if user can book (has enough credits)
   */
  static async canUserBook(userId: string, creditsRequired: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_credits, used_credits')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking user credits:', error);
        return false;
      }

      const availableCredits = data.total_credits - data.used_credits;
      return availableCredits >= creditsRequired;
    } catch (error) {
      console.error('Error in canUserBook:', error);
      return false;
    }
  }

  /**
   * Get upcoming bookings for user
   */
  static async getUpcomingBookings(userId: string): Promise<BookingWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clubs!inner(name, tier),
          profiles!inner(full_name, email)
        `)
        .eq('user_id', userId)
        .gte('scheduled_start', new Date().toISOString())
        .in('status', ['PENDING', 'CONFIRMED'])
        .order('scheduled_start', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming bookings:', error);
        return [];
      }

      return data?.map(booking => ({
        ...booking,
        club_name: booking.clubs.name,
        club_tier: booking.clubs.tier,
        user_name: booking.profiles.full_name,
        user_email: booking.profiles.email,
      })) || [];
    } catch (error) {
      console.error('Error in getUpcomingBookings:', error);
      return [];
    }
  }
}

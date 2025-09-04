import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PaymentRow = Database['public']['Tables']['payments']['Row'];

export interface PaymentMethod {
  id: string;
  type: 'card' | 'payzone' | 'bank_transfer';
  display_name: string;
  last_four?: string;
  brand?: string;
  is_default: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  client_secret?: string;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
}

export class PaymentsAPI {
  private static stripeConfig: StripeConfig = {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  };

  /**
   * Initialize Stripe (client-side)
   */
  static async initializeStripe() {
    if (typeof window === 'undefined') return null;
    
    try {
      // Only load Stripe if we have a publishable key
      if (!this.stripeConfig.publishableKey) {
        console.warn('Stripe publishable key not found. Set REACT_APP_STRIPE_PUBLISHABLE_KEY environment variable.');
        return null;
      }
      
      const { loadStripe } = await import('@stripe/stripe-js');
      return await loadStripe(this.stripeConfig.publishableKey);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      return null;
    }
  }

  /**
   * Create payment intent for order
   */
  static async createPaymentIntent(orderId: string): Promise<PaymentIntent> {
    try {
      // In a real implementation, this would call your backend endpoint
      // that creates a Stripe payment intent
      const { data: order } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', orderId)
        .single();

      if (!order) throw new Error('Order not found');

      // Mock payment intent - replace with actual Stripe API call
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        amount: order.total_amount * 100, // Stripe uses cents
        currency: 'mad',
        status: 'pending',
        client_secret: `pi_${Date.now()}_secret_`,
      };

      return paymentIntent;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  }

  /**
   * Process card payment with Stripe
   */
  static async processCardPayment(
    orderId: string,
    paymentMethodId: string,
    savePaymentMethod: boolean = false
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      const paymentIntent = await this.createPaymentIntent(orderId);

      // In a real implementation, you would:
      // 1. Confirm the payment intent with Stripe
      // 2. Handle 3D Secure if required
      // 3. Update your database based on the result

      // Mock successful payment
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount: paymentIntent.amount / 100,
          method: 'card',
          status: 'completed',
          transaction_id: paymentIntent.id,
          details: {
            payment_method_id: paymentMethodId,
            save_payment_method: savePaymentMethod,
          },
        })
        .select('*')
        .single();

      if (error) throw error;

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'PAID' })
        .eq('id', orderId);

      return {
        success: true,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error('Process card payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Process Payzone payment (Morocco-specific)
   */
  static async processPayzonePayment(
    orderId: string,
    phoneNumber: string
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Mock Payzone payment integration
      // In reality, you'd integrate with Payzone's API
      
      const { data: order } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', orderId)
        .single();

      if (!order) throw new Error('Order not found');

      // Mock Payzone payment
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount: order.total_amount,
          method: 'payzone',
          status: 'completed',
          transaction_id: `pz_${Date.now()}`,
          details: {
            phone_number: phoneNumber,
            provider: 'payzone',
          },
        })
        .select('*')
        .single();

      if (error) throw error;

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'PAID' })
        .eq('id', orderId);

      return {
        success: true,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error('Process Payzone payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Process bank transfer payment
   */
  static async processBankTransferPayment(
    orderId: string,
    bankDetails: {
      accountNumber: string;
      routingNumber: string;
      accountHolderName: string;
    }
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      const { data: order } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', orderId)
        .single();

      if (!order) throw new Error('Order not found');

      // Create pending payment for bank transfer
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount: order.total_amount,
          method: 'bank_transfer',
          status: 'pending', // Bank transfers need manual verification
          transaction_id: `bt_${Date.now()}`,
          details: bankDetails,
        })
        .select('*')
        .single();

      if (error) throw error;

      return {
        success: true,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error('Process bank transfer payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(paymentId: string): Promise<PaymentRow | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get payment by ID error:', error);
      throw error;
    }
  }

  /**
   * Get payments for order
   */
  static async getOrderPayments(orderId: string): Promise<PaymentRow[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get order payments error:', error);
      throw error;
    }
  }

  /**
   * Refund payment
   */
  static async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) throw new Error('Payment not found');

      const refundAmount = amount || payment.amount;

      // In a real implementation, you'd call Stripe's refund API
      const refundId = `re_${Date.now()}`;

      // Create refund record
      await supabase.from('payments').insert({
        order_id: payment.order_id,
        amount: -refundAmount,
        method: payment.method,
        status: 'completed',
        transaction_id: refundId,
        details: {
          refund_for: paymentId,
          reason: reason || 'Customer refund',
        },
      });

      // Update original order status if full refund
      if (refundAmount >= payment.amount) {
        await supabase
          .from('orders')
          .update({ status: 'REFUNDED' })
          .eq('id', payment.order_id);
      }

      return {
        success: true,
        refundId,
      };
    } catch (error) {
      console.error('Refund payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }

  /**
   * Get user payment methods
   */
  static async getUserPaymentMethods(userId?: string): Promise<PaymentMethod[]> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Authentication required');
        targetUserId = user.id;
      }

      // In a real implementation, you'd fetch from Stripe Customer
      // For now, return mock payment methods
      return [
        {
          id: 'pm_1',
          type: 'card',
          display_name: 'Visa ending in 4242',
          last_four: '4242',
          brand: 'visa',
          is_default: true,
        },
        {
          id: 'pm_2',
          type: 'payzone',
          display_name: 'Payzone (+212 6XX XXX XXX)',
          is_default: false,
        },
      ];
    } catch (error) {
      console.error('Get user payment methods error:', error);
      return [];
    }
  }

  /**
   * Save payment method for future use
   */
  static async savePaymentMethod(
    paymentMethodId: string,
    setAsDefault: boolean = false
  ): Promise<boolean> {
    try {
      // In a real implementation, you'd save to Stripe Customer
      // and update your database
      
      console.log('Saving payment method:', paymentMethodId, setAsDefault);
      return true;
    } catch (error) {
      console.error('Save payment method error:', error);
      return false;
    }
  }

  /**
   * Calculate platform commission
   */
  static calculateCommission(amount: number): { 
    clubAmount: number; 
    platformAmount: number; 
  } {
    try {
      // Use the database function for commission calculation
      return supabase.rpc('split_commission', { p_amount: amount }) as any;
    } catch (error) {
      // Fallback calculation: 25% platform commission
      const platformAmount = Math.round(amount * 0.25);
      const clubAmount = amount - platformAmount;
      
      return {
        clubAmount,
        platformAmount,
      };
    }
  }

  /**
   * Get payment analytics for admin
   */
  static async getPaymentAnalytics(dateRange?: { from: string; to: string }) {
    try {
      let query = supabase
        .from('payments')
        .select('*');

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data, error } = await query;
      if (error) throw error;

      const totalPayments = data.length;
      const totalRevenue = data
        .filter(payment => payment.amount > 0 && payment.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0);

      const paymentsByMethod = data.reduce((acc, payment) => {
        acc[payment.method] = (acc[payment.method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const paymentsByStatus = data.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commission = this.calculateCommission(totalRevenue);

      return {
        totalPayments,
        totalRevenue,
        platformRevenue: commission.platformAmount,
        clubRevenue: commission.clubAmount,
        paymentsByMethod,
        paymentsByStatus,
        averageOrderValue: totalPayments > 0 ? totalRevenue / totalPayments : 0,
      };
    } catch (error) {
      console.error('Get payment analytics error:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature (for Stripe webhooks)
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      // In a real implementation, you'd use Stripe's webhook verification
      // For now, return true for development
      return true;
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }

  /**
   * Handle webhook events
   */
  static async handleWebhookEvent(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        
        default:
          console.log(`Unhandled webhook event: ${event.type}`);
      }
    } catch (error) {
      console.error('Handle webhook event error:', error);
      throw error;
    }
  }

  private static async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    // Update payment status and generate QR codes
    console.log('Payment succeeded:', paymentIntent.id);
  }

  private static async handlePaymentFailed(paymentIntent: any): Promise<void> {
    // Update payment status and notify user
    console.log('Payment failed:', paymentIntent.id);
  }
}

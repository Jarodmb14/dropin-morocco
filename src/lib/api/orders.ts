import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type PaymentRow = Database['public']['Tables']['payments']['Row'];

export interface Order extends OrderRow {
  order_items: OrderItemRow[];
  payment?: PaymentRow;
}

export interface CreateOrderData {
  productId: string;
  quantity: number;
  clubTier?: Database['public']['Enums']['club_tier'];
}

export interface OrderSummary {
  subtotal: number;
  platformFee: number;
  total: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

export class OrdersAPI {
  /**
   * Create new order
   */
  static async createOrder(orderData: CreateOrderData[]): Promise<Order> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      // Calculate order total
      const summary = await this.calculateOrderSummary(orderData);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: summary.total,
          status: 'PENDING',
        })
        .select('*')
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = await Promise.all(
        orderData.map(async (item) => {
          const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', item.productId)
            .single();

          if (!product) throw new Error(`Product ${item.productId} not found`);

          const price = item.clubTier 
            ? this.calculatePriceForTier(product, item.clubTier)
            : product.price_mad;

          const { data: orderItem, error } = await supabase
            .from('order_items')
            .insert({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: price,
            })
            .select('*')
            .single();

          if (error) throw error;
          return orderItem;
        })
      );

      return {
        ...order,
        order_items: orderItems,
      };
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          payments(*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) {
        if (orderError.code === 'PGRST116') return null;
        throw orderError;
      }

      return {
        ...order,
        order_items: order.order_items || [],
        payment: order.payments?.[0] || undefined,
      };
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId?: string): Promise<Order[]> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Authentication required');
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          payments(*)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(order => ({
        ...order,
        order_items: order.order_items || [],
        payment: order.payments?.[0] || undefined,
      }));
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select(`
          *,
          order_items(*),
          payments(*)
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        order_items: data.order_items || [],
        payment: data.payments?.[0] || undefined,
      };
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string): Promise<Order> {
    try {
      // Check if order can be cancelled
      const order = await this.getOrderById(orderId);
      if (!order) throw new Error('Order not found');

      if (order.status !== 'PENDING') {
        throw new Error('Only pending orders can be cancelled');
      }

      return this.updateOrderStatus(orderId, 'CANCELLED');
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  /**
   * Process payment for order
   */
  static async processPayment(
    orderId: string, 
    paymentMethod: string,
    paymentDetails?: Record<string, any>
  ): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) throw new Error('Order not found');

      if (order.status !== 'PENDING') {
        throw new Error('Order is not pending payment');
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount: order.total_amount,
          method: paymentMethod,
          status: 'completed', // In real implementation, this would be 'pending' until confirmed
          transaction_id: `txn_${Date.now()}`, // Generate real transaction ID
          details: paymentDetails || {},
        })
        .select('*')
        .single();

      if (paymentError) throw paymentError;

      // Update order status to PAID
      const updatedOrder = await this.updateOrderStatus(orderId, 'PAID');

      // Generate QR codes for the order
      await this.generateQRCodesForOrder(orderId);

      return {
        ...updatedOrder,
        payment,
      };
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  /**
   * Generate QR codes for paid order
   */
  static async generateQRCodesForOrder(orderId: string): Promise<void> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) throw new Error('Order not found');

      for (const item of order.order_items) {
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.product_id)
          .single();

        if (!product) continue;

        // Generate QR codes based on product type and quantity
        const qrCount = this.getQRCodeCount(product, item.quantity);

        for (let i = 0; i < qrCount; i++) {
          const qrCode = this.generateUniqueQRCode();
          
          await supabase.from('qr_codes').insert({
            code: qrCode,
            order_id: orderId,
            product_id: item.product_id,
            status: 'ACTIVE',
            expires_at: this.calculateExpirationDate(product),
          });
        }
      }
    } catch (error) {
      console.error('Generate QR codes error:', error);
      throw error;
    }
  }

  /**
   * Calculate order summary
   */
  static async calculateOrderSummary(orderData: CreateOrderData[]): Promise<OrderSummary> {
    try {
      const items = await Promise.all(
        orderData.map(async (item) => {
          const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', item.productId)
            .single();

          if (!product) throw new Error(`Product ${item.productId} not found`);

          const price = item.clubTier 
            ? this.calculatePriceForTier(product, item.clubTier)
            : product.price_mad;

          return {
            productId: item.productId,
            productName: product.name,
            quantity: item.quantity,
            price,
            total: price * item.quantity,
          };
        })
      );

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const platformFee = Math.round(subtotal * 0.25); // 25% platform commission
      const total = subtotal + platformFee;

      return {
        subtotal,
        platformFee,
        total,
        items,
      };
    } catch (error) {
      console.error('Calculate order summary error:', error);
      throw error;
    }
  }

  /**
   * Get order analytics for admin
   */
  static async getOrderAnalytics(dateRange?: { from: string; to: string }) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          payments(*)
        `);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate analytics
      const totalOrders = data.length;
      const totalRevenue = data
        .filter(order => order.status === 'PAID')
        .reduce((sum, order) => sum + order.total_amount, 0);
      
      const ordersByStatus = data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<OrderStatus, number>);

      return {
        totalOrders,
        totalRevenue,
        ordersByStatus,
        recentOrders: data.slice(0, 10),
      };
    } catch (error) {
      console.error('Get order analytics error:', error);
      throw error;
    }
  }

  /**
   * Helper methods
   */
  private static calculatePriceForTier(
    product: any, 
    tier: Database['public']['Enums']['club_tier']
  ): number {
    const tierPrices = {
      BASIC: 50,
      STANDARD: 90,
      PREMIUM: 150,
      ULTRA_LUXE: 320,
    };

    return tierPrices[tier];
  }

  private static getQRCodeCount(product: any, quantity: number): number {
    switch (product.type) {
      case 'SINGLE':
        return quantity;
      case 'PACK5':
        return 5 * quantity;
      case 'PACK10':
        return 10 * quantity;
      case 'PASS_STANDARD':
      case 'PASS_PREMIUM':
        return 1; // Passes get one QR code that's reusable
      default:
        return quantity;
    }
  }

  private static generateUniqueQRCode(): string {
    return `DIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  }

  private static calculateExpirationDate(product: any): string {
    const now = new Date();
    
    switch (product.type) {
      case 'SINGLE':
        // Single entries expire in 24 hours
        now.setHours(now.getHours() + 24);
        break;
      case 'PACK5':
      case 'PACK10':
        // Packs expire in 3 months
        now.setMonth(now.getMonth() + 3);
        break;
      case 'PASS_STANDARD':
      case 'PASS_PREMIUM':
        // Passes expire in 1 month (renewable)
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        // Default to 3 months
        now.setMonth(now.getMonth() + 3);
    }

    return now.toISOString();
  }
}

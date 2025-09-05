import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AdminActionRow = Database['public']['Tables']['admin_actions']['Row'];
type AdminActionInsert = Database['public']['Tables']['admin_actions']['Insert'];

export interface DashboardStats {
  totalUsers: number;
  totalClubs: number;
  totalOrders: number;
  totalRevenue: number;
  activeQRCodes: number;
  monthlyGrowth: {
    users: number;
    revenue: number;
    orders: number;
  };
}

export interface AdminAction extends AdminActionRow {
  admin?: {
    full_name: string;
    email: string;
  };
}

export class AdminAPI {
  /**
   * Check if current user is admin
   */
  static async isAdmin(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Check admin status error:', error);
      return false;
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total counts
      const [usersCount, clubsCount, ordersCount, qrCodesCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('qr_codes').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
      ]);

      // Get total revenue (match schema: amount_total, paid_at)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount_total')
        .not('paid_at', 'is', null)
        .gt('amount_total', 0);

      const totalRevenue = payments?.reduce((sum, p) => sum + (p as any).amount_total, 0) || 0;

      // Get monthly growth data
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const [lastMonthUsers, lastMonthOrders, lastMonthRevenue] = await Promise.all([
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', lastMonth.toISOString()),
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', lastMonth.toISOString()),
        supabase
          .from('payments')
          .select('amount_total, paid_at')
          .not('paid_at', 'is', null)
          .gt('amount_total', 0)
          .gte('paid_at', lastMonth.toISOString()),
      ]);

      const lastMonthRevenueTotal = lastMonthRevenue.data?.reduce((sum, p: any) => sum + p.amount_total, 0) || 0;

      return {
        totalUsers: usersCount.count || 0,
        totalClubs: clubsCount.count || 0,
        totalOrders: ordersCount.count || 0,
        totalRevenue,
        activeQRCodes: qrCodesCount.count || 0,
        monthlyGrowth: {
          users: lastMonthUsers.count || 0,
          revenue: lastMonthRevenueTotal,
          orders: lastMonthOrders.count || 0,
        },
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  static async getUsers(page: number = 1, limit: number = 50) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        users: data,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  /**
   * Get all clubs with pagination
   */
  static async getClubs(page: number = 1, limit: number = 50) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('clubs')
        .select(`
          *,
          owner:profiles(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        clubs: data,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Get clubs error:', error);
      throw error;
    }
  }

  /**
   * Get all orders with pagination
   */
  static async getOrders(page: number = 1, limit: number = 50) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(full_name, email),
          order_items(*),
          payments(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        orders: data,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(
    userId: string,
    role: Database['public']['Enums']['user_role']
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      await this.logAdminAction({
        action: 'UPDATE_USER_ROLE',
        entity: 'USER',
        entity_id: userId,
        details: { new_role: role },
      });
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  }

  /**
   * Approve/reject club
   */
  static async updateClubStatus(clubId: string, isActive: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ is_active: isActive })
        .eq('id', clubId);

      if (error) throw error;

      await this.logAdminAction({
        action: isActive ? 'APPROVE_CLUB' : 'REJECT_CLUB',
        entity: 'CLUB',
        entity_id: clubId,
        details: { is_active: isActive },
      });
    } catch (error) {
      console.error('Update club status error:', error);
      throw error;
    }
  }

  /**
   * Refund order
   */
  static async refundOrder(orderId: string, reason: string): Promise<void> {
    try {
      // Get order payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .eq('status', 'completed')
        .gt('amount', 0);

      if (!payments || payments.length === 0) {
        throw new Error('No completed payments found for this order');
      }

      // Process refunds for all payments
      for (const payment of payments) {
        await supabase.from('payments').insert({
          order_id: orderId,
          amount: -payment.amount,
          method: payment.method,
          status: 'completed',
          transaction_id: `refund_${payment.transaction_id}`,
          details: {
            refund_for: payment.id,
            reason,
            admin_refund: true,
          },
        });
      }

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'REFUNDED' })
        .eq('id', orderId);

      // Cancel related QR codes
      await supabase
        .from('qr_codes')
        .update({ status: 'CANCELLED' })
        .eq('order_id', orderId);

      await this.logAdminAction({
        action: 'REFUND_ORDER',
        entity: 'ORDER',
        entity_id: orderId,
        details: { reason },
      });
    } catch (error) {
      console.error('Refund order error:', error);
      throw error;
    }
  }

  /**
   * Ban/unban user
   */
  static async banUser(userId: string, banned: boolean, reason?: string): Promise<void> {
    try {
      // In a real implementation, you'd update a 'banned' field
      // For now, we'll use admin actions to track this
      
      await this.logAdminAction({
        action: banned ? 'BAN_USER' : 'UNBAN_USER',
        entity: 'USER',
        entity_id: userId,
        details: { banned, reason },
      });

      // You could also disable auth for the user here
      // await supabase.auth.admin.updateUserById(userId, { banned })
    } catch (error) {
      console.error('Ban user error:', error);
      throw error;
    }
  }

  /**
   * Get admin actions log
   */
  static async getAdminActions(page: number = 1, limit: number = 50): Promise<{
    actions: AdminAction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('admin_actions')
        .select(`
          *,
          admin:profiles!admin_id(full_name, email)
        `, { count: 'exact' })
        .order('at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        actions: data.map(action => ({
          ...action,
          admin: action.admin || undefined,
        })),
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Get admin actions error:', error);
      throw error;
    }
  }

  /**
   * Log admin action
   */
  static async logAdminAction(actionData: Omit<AdminActionInsert, 'admin_id' | 'at'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { error } = await supabase
        .from('admin_actions')
        .insert({
          ...actionData,
          admin_id: user.id,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Log admin action error:', error);
      throw error;
    }
  }

  /**
   * Get revenue analytics
   */
  static async getRevenueAnalytics(dateRange?: { from: string; to: string }) {
    try {
      let query = supabase
        .from('payments')
        .select('amount, created_at, method')
        .eq('status', 'completed')
        .gt('amount', 0);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data, error } = await query.order('created_at');
      if (error) throw error;

      // Calculate daily revenue
      const dailyRevenue = data.reduce((acc, payment) => {
        const date = new Date(payment.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + payment.amount;
        return acc;
      }, {} as Record<string, number>);

      // Calculate revenue by payment method
      const revenueByMethod = data.reduce((acc, payment) => {
        acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
        return acc;
      }, {} as Record<string, number>);

      const totalRevenue = data.reduce((sum, payment) => sum + payment.amount, 0);
      const platformRevenue = Math.round(totalRevenue * 0.25); // 25% commission
      const clubRevenue = totalRevenue - platformRevenue;

      return {
        totalRevenue,
        platformRevenue,
        clubRevenue,
        dailyRevenue,
        revenueByMethod,
        transactionCount: data.length,
      };
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      throw error;
    }
  }

  /**
   * Get user analytics
   */
  static async getUserAnalytics(dateRange?: { from: string; to: string }) {
    try {
      let query = supabase
        .from('profiles')
        .select('created_at, role, country');

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate daily signups
      const dailySignups = data.reduce((acc, user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate users by role
      const usersByRole = data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate users by country
      const usersByCountry = data.reduce((acc, user) => {
        const country = user.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalUsers: data.length,
        dailySignups,
        usersByRole,
        usersByCountry,
      };
    } catch (error) {
      console.error('Get user analytics error:', error);
      throw error;
    }
  }

  /**
   * Get club analytics
   */
  static async getClubAnalytics() {
    try {
      const { data: clubs, error } = await supabase
        .from('clubs')
        .select('tier, city, created_at, is_active');

      if (error) throw error;

      // Calculate clubs by tier
      const clubsByTier = clubs.reduce((acc, club) => {
        acc[club.tier] = (acc[club.tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate clubs by city
      const clubsByCity = clubs.reduce((acc, club) => {
        acc[club.city] = (acc[club.city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate active vs inactive
      const activeClubs = clubs.filter(club => club.is_active).length;
      const inactiveClubs = clubs.length - activeClubs;

      return {
        totalClubs: clubs.length,
        activeClubs,
        inactiveClubs,
        clubsByTier,
        clubsByCity,
      };
    } catch (error) {
      console.error('Get club analytics error:', error);
      throw error;
    }
  }

  /**
   * Export data for reports
   */
  static async exportData(
    table: 'users' | 'clubs' | 'orders' | 'payments',
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    try {
      let data: any[] = [];

      switch (table) {
        case 'users':
          const { data: users } = await supabase.from('profiles').select('*');
          data = users || [];
          break;
        case 'clubs':
          const { data: clubs } = await supabase.from('clubs').select('*');
          data = clubs || [];
          break;
        case 'orders':
          const { data: orders } = await supabase.from('orders').select('*');
          data = orders || [];
          break;
        case 'payments':
          const { data: payments } = await supabase.from('payments').select('*');
          data = payments || [];
          break;
      }

      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      }

      // Convert to CSV
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(',')
        )
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }
}

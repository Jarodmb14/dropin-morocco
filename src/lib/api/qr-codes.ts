import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type QRStatus = Database['public']['Enums']['qr_status'];
type QRCodeRow = Database['public']['Tables']['qr_codes']['Row'];

export interface QRCode extends QRCodeRow {
  product?: Database['public']['Tables']['products']['Row'];
  order?: Database['public']['Tables']['orders']['Row'];
}

export interface QRScanResult {
  success: boolean;
  message: string;
  checkinId?: string;
  clubName?: string;
}

export class QRCodesAPI {
  /**
   * Get user's QR codes
   */
  static async getUserQRCodes(userId?: string): Promise<QRCode[]> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Authentication required');
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          products(*),
          orders(*)
        `)
        .eq('orders.user_id', targetUserId)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(qr => ({
        ...qr,
        product: qr.products || undefined,
        order: qr.orders || undefined,
      }));
    } catch (error) {
      console.error('Get user QR codes error:', error);
      throw error;
    }
  }

  /**
   * Get QR code by code string
   */
  static async getQRCodeByCode(code: string): Promise<QRCode | null> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          products(*),
          orders(*)
        `)
        .eq('code', code)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return {
        ...data,
        product: data.products || undefined,
        order: data.orders || undefined,
      };
    } catch (error) {
      console.error('Get QR code by code error:', error);
      throw error;
    }
  }

  /**
   * Scan QR code at club (Club Owner functionality)
   */
  static async scanQRCode(qrCode: string, clubId: string): Promise<QRScanResult> {
    try {
      // Use the database function for QR scanning and check-in
      const { data, error } = await supabase
        .rpc('use_qr_and_checkin', {
          p_qr_code: qrCode,
          p_club_id: clubId,
        });

      if (error) {
        if (error.message.includes('QR code not found')) {
          return {
            success: false,
            message: '❌ QR code not found or invalid',
          };
        }
        
        if (error.message.includes('QR code already used')) {
          return {
            success: false,
            message: '❌ QR code has already been used',
          };
        }
        
        if (error.message.includes('QR code expired')) {
          return {
            success: false,
            message: '❌ QR code has expired',
          };
        }
        
        throw error;
      }

      // Get club name for success message
      const { data: club } = await supabase
        .from('clubs')
        .select('name')
        .eq('id', clubId)
        .single();

      return {
        success: true,
        message: `✅ Welcome! Entry successful at ${club?.name || 'this club'}`,
        checkinId: data,
        clubName: club?.name,
      };
    } catch (error) {
      console.error('Scan QR code error:', error);
      return {
        success: false,
        message: '❌ Error processing QR code. Please try again.',
      };
    }
  }

  /**
   * Validate QR code (check if valid without using it)
   */
  static async validateQRCode(qrCode: string): Promise<{
    valid: boolean;
    reason?: string;
    qrData?: QRCode;
  }> {
    try {
      const qrData = await this.getQRCodeByCode(qrCode);
      
      if (!qrData) {
        return {
          valid: false,
          reason: 'QR code not found',
        };
      }

      if (qrData.status !== 'ACTIVE') {
        return {
          valid: false,
          reason: `QR code is ${qrData.status.toLowerCase()}`,
        };
      }

      if (qrData.expires_at && new Date(qrData.expires_at) < new Date()) {
        return {
          valid: false,
          reason: 'QR code has expired',
        };
      }

      return {
        valid: true,
        qrData,
      };
    } catch (error) {
      console.error('Validate QR code error:', error);
      return {
        valid: false,
        reason: 'Error validating QR code',
      };
    }
  }

  /**
   * Cancel QR code
   */
  static async cancelQRCode(qrCodeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .update({ status: 'CANCELLED' })
        .eq('id', qrCodeId);

      if (error) throw error;
    } catch (error) {
      console.error('Cancel QR code error:', error);
      throw error;
    }
  }

  /**
   * Get QR code usage history for a user
   */
  static async getQRCodeUsageHistory(userId?: string) {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Authentication required');
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('checkins')
        .select(`
          *,
          clubs(name, tier),
          qr_codes(code, products(name, type))
        `)
        .eq('qr_codes.orders.user_id', targetUserId)
        .order('checked_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get QR code usage history error:', error);
      throw error;
    }
  }

  /**
   * Get club check-ins for club owner
   */
  static async getClubCheckins(clubId: string, dateRange?: { from: string; to: string }) {
    try {
      let query = supabase
        .from('checkins')
        .select(`
          *,
          qr_codes(
            code,
            products(name, type),
            orders(users:profiles(full_name, email))
          )
        `)
        .eq('club_id', clubId);

      if (dateRange) {
        query = query
          .gte('checked_at', dateRange.from)
          .lte('checked_at', dateRange.to);
      }

      const { data, error } = await query.order('checked_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get club checkins error:', error);
      throw error;
    }
  }

  /**
   * Generate QR code data URL for display
   */
  static generateQRCodeDataURL(code: string): string {
    // In a real implementation, you'd use a QR code library like 'qrcode'
    // For now, return a placeholder data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = 200;
    canvas.height = 200;
    
    // Draw placeholder QR code pattern
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(code, 100, 100);
    
    return canvas.toDataURL();
  }

  /**
   * Check QR code expiration
   */
  static isQRCodeExpired(qrCode: QRCode): boolean {
    if (!qrCode.expires_at) return false;
    return new Date(qrCode.expires_at) < new Date();
  }

  /**
   * Get days until QR code expires
   */
  static getDaysUntilExpiration(qrCode: QRCode): number {
    if (!qrCode.expires_at) return Infinity;
    
    const expiryDate = new Date(qrCode.expires_at);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  /**
   * Get QR codes expiring soon (within 7 days)
   */
  static async getExpiringSoonQRCodes(userId?: string): Promise<QRCode[]> {
    try {
      const qrCodes = await this.getUserQRCodes(userId);
      
      return qrCodes.filter(qr => {
        const daysUntilExpiry = this.getDaysUntilExpiration(qr);
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      });
    } catch (error) {
      console.error('Get expiring soon QR codes error:', error);
      return [];
    }
  }

  /**
   * Get QR code analytics for admin
   */
  static async getQRCodeAnalytics(dateRange?: { from: string; to: string }) {
    try {
      let query = supabase.from('qr_codes').select(`
        *,
        checkins(*),
        products(type)
      `);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data, error } = await query;
      if (error) throw error;

      const totalQRCodes = data.length;
      const usedQRCodes = data.filter(qr => qr.status === 'USED').length;
      const expiredQRCodes = data.filter(qr => qr.status === 'EXPIRED').length;
      const activeQRCodes = data.filter(qr => qr.status === 'ACTIVE').length;
      
      const usageRate = totalQRCodes > 0 ? (usedQRCodes / totalQRCodes) * 100 : 0;

      const qrCodesByProduct = data.reduce((acc, qr) => {
        const productType = qr.products?.type || 'unknown';
        acc[productType] = (acc[productType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalQRCodes,
        usedQRCodes,
        expiredQRCodes,
        activeQRCodes,
        usageRate,
        qrCodesByProduct,
      };
    } catch (error) {
      console.error('Get QR code analytics error:', error);
      throw error;
    }
  }
}

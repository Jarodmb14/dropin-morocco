// Main API exports for Drop-In Morocco Backend
export { AuthAPI } from './auth';
export { ClubsAPI } from './clubs';
export { ProductsAPI } from './products';
export { OrdersAPI } from './orders';
export { QRCodesAPI } from './qr-codes';
export { PaymentsAPI } from './payments';
export { AdminAPI } from './admin';

// Re-export types
export type { AuthUser } from './auth';
export type { Club, ClubFilters } from './clubs';
export type { Product, ProductFilters } from './products';
export type { Order, CreateOrderData, OrderSummary } from './orders';
export type { QRCode, QRScanResult } from './qr-codes';
export type { PaymentMethod, PaymentIntent } from './payments';
export type { DashboardStats, AdminAction } from './admin';

// API Client class for easier usage
export class DropInAPI {
  static auth = AuthAPI;
  static clubs = ClubsAPI;
  static products = ProductsAPI;
  static orders = OrdersAPI;
  static qrCodes = QRCodesAPI;
  static payments = PaymentsAPI;
  static admin = AdminAPI;

  /**
   * Initialize the API client
   */
  static async init() {
    // Any initialization logic can go here
    console.log('Drop-In Morocco API initialized');
  }

  /**
   * Get current user and their permissions
   */
  static async getCurrentUserWithPermissions() {
    const user = await AuthAPI.getCurrentUser();
    if (!user) return null;

    return {
      ...user,
      permissions: {
        isAdmin: user.role === 'ADMIN',
        isClubOwner: user.role === 'CLUB_OWNER',
        isCustomer: user.role === 'CUSTOMER',
        canManageClubs: user.role === 'CLUB_OWNER' || user.role === 'ADMIN',
        canAccessAdmin: user.role === 'ADMIN',
      },
    };
  }

  /**
   * Complete customer flow: Browse → Purchase → Get QR
   */
  static async customerPurchaseFlow(productId: string, clubTier?: any) {
    try {
      // 1. Create order
      const order = await OrdersAPI.createOrder([{
        productId,
        quantity: 1,
        clubTier,
      }]);

      // 2. Process payment (mock for demo)
      const paymentResult = await PaymentsAPI.processCardPayment(
        order.id,
        'pm_mock_visa'
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // 3. Get QR codes
      const qrCodes = await QRCodesAPI.getUserQRCodes();
      const newQRCodes = qrCodes.filter(qr => qr.order_id === order.id);

      return {
        success: true,
        order,
        qrCodes: newQRCodes,
        message: '🎉 Purchase successful! Your QR codes are ready.',
      };
    } catch (error) {
      console.error('Customer purchase flow error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
      };
    }
  }

  /**
   * Club owner flow: Scan QR → Check capacity → Allow entry
   */
  static async clubOwnerScanFlow(qrCode: string, clubId: string) {
    try {
      // 1. Validate QR code
      const validation = await QRCodesAPI.validateQRCode(qrCode);
      if (!validation.valid) {
        return {
          success: false,
          message: `❌ ${validation.reason}`,
        };
      }

      // 2. Check club capacity
      const today = new Date().toISOString().split('T')[0];
      const hasCapacity = await ClubsAPI.checkAvailability(clubId, today);
      
      if (!hasCapacity) {
        return {
          success: false,
          message: '❌ Club is at full capacity',
        };
      }

      // 3. Process entry
      const scanResult = await QRCodesAPI.scanQRCode(qrCode, clubId);
      
      return scanResult;
    } catch (error) {
      console.error('Club owner scan flow error:', error);
      return {
        success: false,
        message: '❌ Error processing entry',
      };
    }
  }

  /**
   * Get comprehensive analytics for admin dashboard
   */
  static async getAdminDashboard() {
    try {
      const [
        dashboardStats,
        revenueAnalytics,
        userAnalytics,
        clubAnalytics,
        recentActions,
      ] = await Promise.all([
        AdminAPI.getDashboardStats(),
        AdminAPI.getRevenueAnalytics(),
        AdminAPI.getUserAnalytics(),
        AdminAPI.getClubAnalytics(),
        AdminAPI.getAdminActions(1, 10),
      ]);

      return {
        stats: dashboardStats,
        revenue: revenueAnalytics,
        users: userAnalytics,
        clubs: clubAnalytics,
        recentActions: recentActions.actions,
      };
    } catch (error) {
      console.error('Get admin dashboard error:', error);
      throw error;
    }
  }
}

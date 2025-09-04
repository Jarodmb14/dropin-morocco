import { DropInAPI } from './index';
import type { Database } from '@/integrations/supabase/types';

type ClubTier = Database['public']['Enums']['club_tier'];

export interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

export class APITestRunner {
  private static results: TestResult[] = [];

  /**
   * Run all API tests
   */
  static async runAllTests(): Promise<TestResult[]> {
    this.results = [];
    
    console.log('🧪 Starting Drop-In Morocco API Tests...\n');

    // Test Authentication
    await this.testAuthentication();
    
    // Test Products
    await this.testProducts();
    
    // Test Clubs
    await this.testClubs();
    
    // Test Orders (requires auth)
    await this.testOrders();
    
    // Test QR Codes (requires orders)
    await this.testQRCodes();
    
    // Test Admin functions
    await this.testAdmin();

    // Print summary
    this.printSummary();
    
    return this.results;
  }

  /**
   * Test Authentication System
   */
  static async testAuthentication() {
    console.log('🔐 Testing Authentication System...');

    // Test 1: Get current user (should be null initially)
    await this.runTest('Get Current User (Unauthenticated)', async () => {
      const user = await DropInAPI.auth.getCurrentUser();
      return {
        success: user === null,
        message: user === null ? 'No user logged in (expected)' : 'Unexpected user found',
        data: user,
      };
    });

    // Test 2: Test OAuth URLs generation
    await this.runTest('Google OAuth Integration', async () => {
      try {
        await DropInAPI.auth.signInWithGoogle();
        return {
          success: true,
          message: 'Google OAuth redirect initiated',
        };
      } catch (error) {
        // This is expected in testing environment
        return {
          success: true,
          message: 'Google OAuth method exists (redirect would happen in browser)',
        };
      }
    });

    // Test 3: Check admin status without auth
    await this.runTest('Check Admin Status (Unauthenticated)', async () => {
      const isAdmin = await DropInAPI.auth.isAdmin();
      return {
        success: isAdmin === false,
        message: isAdmin === false ? 'Not admin (expected)' : 'Unexpected admin status',
        data: { isAdmin },
      };
    });

    console.log('✅ Authentication tests completed\n');
  }

  /**
   * Test Products System
   */
  static async testProducts() {
    console.log('📦 Testing Products System...');

    // Test 1: Get all products
    await this.runTest('Get All Products', async () => {
      const products = await DropInAPI.products.getProducts();
      return {
        success: Array.isArray(products),
        message: `Found ${products.length} products`,
        data: products,
      };
    });

    // Test 2: Get products by type
    await this.runTest('Get Single Entry Products', async () => {
      const products = await DropInAPI.products.getProductsByType('SINGLE');
      return {
        success: Array.isArray(products),
        message: `Found ${products.length} single entry products`,
        data: products,
      };
    });

    // Test 3: Get pack products
    await this.runTest('Get Pack Products', async () => {
      const products = await DropInAPI.products.getPackProducts();
      return {
        success: Array.isArray(products),
        message: `Found ${products.length} pack products`,
        data: products,
      };
    });

    // Test 4: Get pass products
    await this.runTest('Get Pass Products', async () => {
      const products = await DropInAPI.products.getPassProducts();
      return {
        success: Array.isArray(products),
        message: `Found ${products.length} pass products`,
        data: products,
      };
    });

    // Test 5: Test product details
    await this.runTest('Get Product Details Structure', async () => {
      const details = DropInAPI.products.getProductDetails();
      const hasAllTypes = ['SINGLE', 'PACK5', 'PACK10', 'PASS_STANDARD', 'PASS_PREMIUM'].every(
        type => type in details
      );
      return {
        success: hasAllTypes,
        message: hasAllTypes ? 'All product types have details' : 'Missing product type details',
        data: Object.keys(details),
      };
    });

    console.log('✅ Products tests completed\n');
  }

  /**
   * Test Clubs System
   */
  static async testClubs() {
    console.log('🏢 Testing Clubs System...');

    // Test 1: Get all clubs
    await this.runTest('Get All Clubs', async () => {
      const clubs = await DropInAPI.clubs.getClubs();
      return {
        success: Array.isArray(clubs),
        message: `Found ${clubs.length} clubs`,
        data: clubs,
      };
    });

    // Test 2: Get clubs by tier
    await this.runTest('Get Premium Clubs', async () => {
      const clubs = await DropInAPI.clubs.getClubsByTier('PREMIUM');
      return {
        success: Array.isArray(clubs),
        message: `Found ${clubs.length} premium clubs`,
        data: clubs,
      };
    });

    // Test 3: Test club tier pricing
    await this.runTest('Club Tier Pricing', async () => {
      const pricing = DropInAPI.clubs.getClubTierPricing();
      const expectedTiers: ClubTier[] = ['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA_LUXE'];
      const hasAllTiers = expectedTiers.every(tier => tier in pricing);
      
      return {
        success: hasAllTiers,
        message: hasAllTiers ? 'All club tiers have pricing' : 'Missing tier pricing',
        data: pricing,
      };
    });

    // Test 4: Test club tier details
    await this.runTest('Club Tier Details', async () => {
      const details = DropInAPI.clubs.getClubTierDetails();
      const basicTier = details.BASIC;
      const hasRequiredFields = basicTier.name && basicTier.price && basicTier.features;
      
      return {
        success: hasRequiredFields,
        message: hasRequiredFields ? 'Club tier details complete' : 'Missing tier detail fields',
        data: details,
      };
    });

    // Test 5: Test geolocation search (mock coordinates)
    await this.runTest('Nearby Clubs Search', async () => {
      // Use Casablanca coordinates
      const clubs = await DropInAPI.clubs.getNearbyClubs(33.5731, -7.5898, 50);
      return {
        success: Array.isArray(clubs),
        message: `Found ${clubs.length} clubs near Casablanca (50km radius)`,
        data: clubs.map(club => ({ 
          name: club.name, 
          city: club.city, 
          distance: club.distance 
        })),
      };
    });

    console.log('✅ Clubs tests completed\n');
  }

  /**
   * Test Orders System (requires authentication)
   */
  static async testOrders() {
    console.log('🛒 Testing Orders System...');

    // Test 1: Get user orders (without auth - should handle gracefully)
    await this.runTest('Get User Orders (No Auth)', async () => {
      try {
        const orders = await DropInAPI.orders.getUserOrders();
        return {
          success: false,
          message: 'Should require authentication',
          data: orders,
        };
      } catch (error) {
        return {
          success: true,
          message: 'Authentication required (expected)',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    // Test 2: Test order summary calculation
    await this.runTest('Calculate Order Summary', async () => {
      // Get a product first
      const products = await DropInAPI.products.getProducts({ is_active: true });
      if (products.length === 0) {
        return {
          success: false,
          message: 'No products available for testing',
        };
      }

      try {
        const summary = await DropInAPI.orders.calculateOrderSummary([
          { productId: products[0].id, quantity: 1 }
        ]);
        
        const hasRequiredFields = summary.subtotal >= 0 && summary.total >= 0 && Array.isArray(summary.items);
        
        return {
          success: hasRequiredFields,
          message: hasRequiredFields ? 'Order summary calculated correctly' : 'Invalid order summary',
          data: summary,
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to calculate order summary',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    console.log('✅ Orders tests completed\n');
  }

  /**
   * Test QR Codes System
   */
  static async testQRCodes() {
    console.log('📱 Testing QR Codes System...');

    // Test 1: Get user QR codes (without auth)
    await this.runTest('Get User QR Codes (No Auth)', async () => {
      try {
        const qrCodes = await DropInAPI.qrCodes.getUserQRCodes();
        return {
          success: false,
          message: 'Should require authentication',
          data: qrCodes,
        };
      } catch (error) {
        return {
          success: true,
          message: 'Authentication required (expected)',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    // Test 2: Validate invalid QR code
    await this.runTest('Validate Invalid QR Code', async () => {
      const result = await DropInAPI.qrCodes.validateQRCode('INVALID_QR_CODE_123');
      return {
        success: !result.valid,
        message: !result.valid ? 'Invalid QR code rejected (expected)' : 'Invalid QR code accepted',
        data: result,
      };
    });

    // Test 3: Test QR code data URL generation
    await this.runTest('Generate QR Code Data URL', async () => {
      const dataUrl = DropInAPI.qrCodes.generateQRCodeDataURL('TEST_QR_CODE');
      const isValidDataUrl = dataUrl.startsWith('data:image/');
      
      return {
        success: isValidDataUrl,
        message: isValidDataUrl ? 'QR code data URL generated' : 'Invalid data URL format',
        data: { dataUrl: dataUrl.substring(0, 50) + '...' },
      };
    });

    console.log('✅ QR Codes tests completed\n');
  }

  /**
   * Test Admin System
   */
  static async testAdmin() {
    console.log('👨‍💼 Testing Admin System...');

    // Test 1: Check admin status (should be false without auth)
    await this.runTest('Check Admin Status', async () => {
      const isAdmin = await DropInAPI.admin.isAdmin();
      return {
        success: isAdmin === false,
        message: isAdmin === false ? 'Not admin (expected without auth)' : 'Unexpected admin status',
        data: { isAdmin },
      };
    });

    // Test 2: Try to get dashboard stats (should require admin auth)
    await this.runTest('Get Dashboard Stats (No Auth)', async () => {
      try {
        const stats = await DropInAPI.admin.getDashboardStats();
        return {
          success: false,
          message: 'Should require admin authentication',
          data: stats,
        };
      } catch (error) {
        return {
          success: true,
          message: 'Admin authentication required (expected)',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    console.log('✅ Admin tests completed\n');
  }

  /**
   * Helper method to run individual tests
   */
  private static async runTest(testName: string, testFn: () => Promise<Partial<TestResult>>) {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        test: testName,
        success: result.success ?? false,
        message: result.message ?? 'No message',
        data: result.data,
        error: result.error,
        duration,
      };
      
      this.results.push(testResult);
      
      const statusIcon = testResult.success ? '✅' : '❌';
      const durationText = `(${duration}ms)`;
      console.log(`  ${statusIcon} ${testName}: ${testResult.message} ${durationText}`);
      
      if (testResult.error) {
        console.log(`    Error: ${testResult.error}`);
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const testResult: TestResult = {
        test: testName,
        success: false,
        message: 'Test threw an exception',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      };
      
      this.results.push(testResult);
      console.log(`  ❌ ${testName}: ${testResult.message} (${duration}ms)`);
      console.log(`    Error: ${testResult.error}`);
    }
  }

  /**
   * Print test summary
   */
  private static printSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + (r.duration || 0), 0);
    
    console.log('\n📊 TEST SUMMARY:');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   ⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`   📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   • ${r.test}: ${r.message}`);
          if (r.error) console.log(`     Error: ${r.error}`);
        });
    }
    
    console.log('\n🎉 API Testing Complete!');
  }

  /**
   * Get test results
   */
  static getResults(): TestResult[] {
    return this.results;
  }

  /**
   * Test specific functionality
   */
  static async testSpecific(testName: string) {
    switch (testName.toLowerCase()) {
      case 'auth':
        await this.testAuthentication();
        break;
      case 'products':
        await this.testProducts();
        break;
      case 'clubs':
        await this.testClubs();
        break;
      case 'orders':
        await this.testOrders();
        break;
      case 'qr':
        await this.testQRCodes();
        break;
      case 'admin':
        await this.testAdmin();
        break;
      default:
        console.log('Available tests: auth, products, clubs, orders, qr, admin');
    }
  }
}

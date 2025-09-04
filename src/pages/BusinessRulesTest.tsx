import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BusinessRules } from '@/lib/api/business-rules';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

const BusinessRulesTest = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Test 1: Automatic Pricing Calculation
  const testAutomaticPricing = async () => {
    setIsLoading(true);
    try {
      console.log('Testing automatic pricing calculation...');

      const testCases = [
        { tier: 'BASIC', expected: 50 },
        { tier: 'STANDARD', expected: 50 },
        { tier: 'PREMIUM', expected: 120 },
        { tier: 'ULTRA_LUXE', expected: 350 },
      ];

      let allPassed = true;
      const results = [];

      for (const testCase of testCases) {
        const price = BusinessRules.calculateBlanePricing(testCase.tier as any);
        const passed = price === testCase.expected;
        if (!passed) allPassed = false;
        
        results.push({
          tier: testCase.tier,
          calculated: price,
          expected: testCase.expected,
          passed
        });
      }

      addResult({
        test: 'Automatic Pricing Calculation',
        success: allPassed,
        message: allPassed ? '✅ All pricing tiers calculated correctly' : '❌ Some pricing calculations failed',
        data: results
      });

    } catch (error) {
      addResult({
        test: 'Automatic Pricing Calculation',
        success: false,
        message: '❌ Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test 2: Commission Calculation
  const testCommissionCalculation = async () => {
    setIsLoading(true);
    try {
      console.log('Testing commission calculation...');

      const testAmounts = [50, 120, 350, 1000];
      const results = [];
      let allPassed = true;

      for (const amount of testAmounts) {
        const commission = BusinessRules.calculateCommission(amount);
        const expectedCommission = Math.round(amount * 0.25);
        const passed = commission === expectedCommission;
        if (!passed) allPassed = false;

        results.push({
          grossAmount: amount,
          commission,
          expectedCommission,
          partnerAmount: amount - commission,
          passed
        });
      }

      addResult({
        test: 'Commission Calculation (25%)',
        success: allPassed,
        message: allPassed ? '✅ All commission calculations correct' : '❌ Commission calculation errors',
        data: results
      });

    } catch (error) {
      addResult({
        test: 'Commission Calculation',
        success: false,
        message: '❌ Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test 3: Product Validity Periods
  const testValidityPeriods = async () => {
    setIsLoading(true);
    try {
      console.log('Testing product validity periods...');

      const testCases = [
        { type: 'SINGLE', expectedDays: 1 },
        { type: 'PACK5', expectedDays: 90 },
        { type: 'PACK10', expectedDays: 90 },
        { type: 'PASS_STANDARD', expectedDays: 30 },
        { type: 'PASS_PREMIUM', expectedDays: 30 },
      ];

      const results = [];
      let allPassed = true;

      for (const testCase of testCases) {
        const validity = BusinessRules.getProductValidityPeriod(testCase.type as any);
        const passed = validity.durationDays === testCase.expectedDays;
        if (!passed) allPassed = false;

        results.push({
          productType: testCase.type,
          durationDays: validity.durationDays,
          expectedDays: testCase.expectedDays,
          validTo: validity.validTo,
          passed
        });
      }

      addResult({
        test: 'Product Validity Periods',
        success: allPassed,
        message: allPassed ? '✅ All validity periods correct' : '❌ Validity period errors',
        data: results
      });

    } catch (error) {
      addResult({
        test: 'Product Validity Periods',
        success: false,
        message: '❌ Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test 4: Database Schema Verification
  const testDatabaseSchema = async () => {
    setIsLoading(true);
    try {
      console.log('Testing database schema...');

      const tests = [];

      // Test if new columns exist in orders table
      try {
        const { data: orderSample } = await supabase
          .from('orders')
          .select('gross_amount, commission_amount, net_partner_amount, paid_at, cancelled_at')
          .limit(1);
        
        tests.push({
          table: 'orders',
          columns: ['gross_amount', 'commission_amount', 'net_partner_amount', 'paid_at', 'cancelled_at'],
          exists: true
        });
      } catch (error) {
        tests.push({
          table: 'orders',
          columns: ['gross_amount', 'commission_amount', 'net_partner_amount', 'paid_at', 'cancelled_at'],
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test if new columns exist in clubs table
      try {
        const { data: clubSample } = await supabase
          .from('clubs')
          .select('monthly_price, auto_blane_price')
          .limit(1);
        
        tests.push({
          table: 'clubs',
          columns: ['monthly_price', 'auto_blane_price'],
          exists: true
        });
      } catch (error) {
        tests.push({
          table: 'clubs',
          columns: ['monthly_price', 'auto_blane_price'],
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test if reviews table exists
      try {
        const { data: reviewSample } = await supabase
          .from('reviews')
          .select('id, user_id, venue_id, rating')
          .limit(1);
        
        tests.push({
          table: 'reviews',
          columns: ['id', 'user_id', 'venue_id', 'rating'],
          exists: true
        });
      } catch (error) {
        tests.push({
          table: 'reviews',
          columns: ['id', 'user_id', 'venue_id', 'rating'],
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      const allPassed = tests.every(test => test.exists);

      addResult({
        test: 'Database Schema Verification',
        success: allPassed,
        message: allPassed ? '✅ All required schema updates applied' : '❌ Some schema updates missing',
        data: tests
      });

    } catch (error) {
      addResult({
        test: 'Database Schema Verification',
        success: false,
        message: '❌ Schema test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test 5: Create Test Venue with Auto Pricing
  const testCreateVenueWithAutoPricing = async () => {
    setIsLoading(true);
    try {
      console.log('Testing venue creation with auto pricing...');

      const testVenue = {
        name: 'Test Fitness Center',
        description: 'Test venue for business rules',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Test Address',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['cardio', 'weights'],
        contact_phone: '+212522000000',
        contact_email: 'test@example.com',
        is_active: true,
        monthly_price: 600, // Should result in 120 DHS Blane price
      };

      const { data: venue, error } = await supabase
        .from('clubs')
        .insert(testVenue)
        .select('id, name, tier, monthly_price, auto_blane_price')
        .single();

      if (error) throw error;

      const expectedPrice = BusinessRules.calculateBlanePricing('PREMIUM', 600);
      const priceCorrect = venue.auto_blane_price === expectedPrice;

      addResult({
        test: 'Venue Auto Pricing',
        success: priceCorrect,
        message: priceCorrect ? '✅ Auto pricing calculated correctly' : '❌ Auto pricing failed',
        data: {
          venue: venue.name,
          tier: venue.tier,
          monthlyPrice: venue.monthly_price,
          autoBLanePrice: venue.auto_blane_price,
          expectedPrice,
          priceCorrect
        }
      });

      // Clean up test venue
      await supabase
        .from('clubs')
        .delete()
        .eq('id', venue.id);

    } catch (error) {
      addResult({
        test: 'Venue Auto Pricing',
        success: false,
        message: '❌ Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    clearResults();
    await testDatabaseSchema();
    await testAutomaticPricing();
    await testCommissionCalculation();
    await testValidityPeriods();
    await testCreateVenueWithAutoPricing();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          🔐 Drop-In Morocco Business Rules Test
        </h1>
        <p className="text-center text-muted-foreground">
          Test the comprehensive business logic implementation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Button onClick={testDatabaseSchema} disabled={isLoading} className="h-12">
          🗄️ Test Database Schema
        </Button>
        <Button onClick={testAutomaticPricing} disabled={isLoading} className="h-12">
          💰 Test Auto Pricing
        </Button>
        <Button onClick={testCommissionCalculation} disabled={isLoading} className="h-12">
          📊 Test Commission (25%)
        </Button>
        <Button onClick={testValidityPeriods} disabled={isLoading} className="h-12">
          ⏰ Test Validity Periods
        </Button>
        <Button onClick={testCreateVenueWithAutoPricing} disabled={isLoading} className="h-12">
          🏢 Test Venue Creation
        </Button>
        <Button onClick={runAllTests} disabled={isLoading} className="h-12 bg-gradient-to-r from-blue-600 to-purple-600">
          🚀 Run All Tests
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Results</h2>
        <Button onClick={clearResults} variant="outline" size="sm">
          Clear Results
        </Button>
      </div>

      <div className="space-y-4">
        {results.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Click any test button to verify business rules implementation
              </p>
            </CardContent>
          </Card>
        )}

        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{result.test}</span>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "PASS" : "FAIL"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{result.message}</p>
              
              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {result.error}
                  </p>
                </div>
              )}

              {result.data && (
                <>
                  <Separator className="my-3" />
                  <div className="bg-gray-50 rounded p-3">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Running business rules tests...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessRulesTest;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const APITestSimple = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Test basic Supabase connection
      console.log('Testing Supabase connection...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      if (error) {
        console.error('Products query error:', error);
        setResults([{
          test: 'Supabase Connection',
          success: false,
          message: '❌ Connection failed',
          error: `${error.message} (Code: ${error.code})`
        }]);
      } else {
        console.log('Products query successful:', data);
        
        // Test clubs table too
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .limit(5);
          
        if (clubsError) {
          console.error('Clubs query error:', clubsError);
          setResults([{
            test: 'Supabase Connection',
            success: false,
            message: '❌ Clubs table access failed',
            error: `${clubsError.message} (Code: ${clubsError.code})`
          }]);
          return;
        }
        
        setResults([{
          test: 'Supabase Connection',
          success: true,
          message: `✅ Connected! Found ${data.length} products, ${clubsData.length} clubs`,
          data: { products: data, clubs: clubsData }
        }]);
        
        // Get database status
        const [products, clubs] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('clubs').select('id', { count: 'exact', head: true })
        ]);
        
        setDbStatus({
          products: products.count || 0,
          clubs: clubs.count || 0,
          ready: (products.count || 0) > 0 && (clubs.count || 0) > 0
        });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setResults([{
        test: 'Supabase Connection',
        success: false,
        message: '❌ Connection error',
        error: error instanceof Error ? error.message : JSON.stringify(error)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSchema = async () => {
    setIsLoading(true);
    try {
      console.log('Checking database schema...');
      
      // Check if we can access the information schema
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_table_info'); // This might not work, let's try a different approach
      
      if (tablesError) {
        console.log('RPC failed, trying direct table access...');
        
        // Try to get column information by attempting inserts
        const testResults = [];
        
        // Test products table structure
        try {
          const { error: productTestError } = await supabase
            .from('products')
            .insert([{ name: 'SCHEMA_TEST_DELETE_ME' }])
            .select();
          
          if (productTestError) {
            testResults.push({
              table: 'products',
              error: productTestError.message,
              code: productTestError.code
            });
          } else {
            testResults.push({
              table: 'products',
              status: 'Insert test passed (will clean up)',
            });
            
            // Clean up test record
            await supabase
              .from('products')
              .delete()
              .eq('name', 'SCHEMA_TEST_DELETE_ME');
          }
        } catch (err) {
          testResults.push({
            table: 'products',
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
        
        // Test clubs table structure
        try {
          const { error: clubTestError } = await supabase
            .from('clubs')
            .insert([{ name: 'SCHEMA_TEST_DELETE_ME' }])
            .select();
          
          if (clubTestError) {
            testResults.push({
              table: 'clubs',
              error: clubTestError.message,
              code: clubTestError.code
            });
          } else {
            testResults.push({
              table: 'clubs',
              status: 'Insert test passed (will clean up)',
            });
            
            // Clean up test record
            await supabase
              .from('clubs')
              .delete()
              .eq('name', 'SCHEMA_TEST_DELETE_ME');
          }
        } catch (err) {
          testResults.push({
            table: 'clubs',
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
        
        setResults([{
          test: 'Schema Check',
          success: true,
          message: `✅ Schema check completed`,
          data: testResults
        }]);
      }
      
    } catch (error) {
      console.error('Schema check error:', error);
      setResults([{
        test: 'Schema Check',
        success: false,
        message: '❌ Schema check failed',
        error: error instanceof Error ? error.message : JSON.stringify(error)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    setIsLoading(true);
    try {
      console.log('Starting database seeding...');
      
      // Try inserting one product first with all required fields
      const testProduct = {
        name: 'Test Product Simple',
        type: 'SINGLE',
        price_mad: 50,
        credits: 1,
        tier_scope: ['BASIC'], // This field is required!
        is_active: true,
      };

      console.log('Inserting test product:', testProduct);
      const { data: testProductData, error: testProductError } = await supabase
        .from('products')
        .insert([testProduct])
        .select();

      if (testProductError) {
        console.error('Test product insert error:', testProductError);
        throw new Error(`Product insert failed: ${testProductError.message} (Code: ${testProductError.code})`);
      }

      console.log('Test product inserted successfully:', testProductData);

      // If that works, try more products with proper tier_scope
      const products = [
        {
          name: 'Blane Standard',
          type: 'SINGLE',
          price_mad: 90,
          credits: 1,
          tier_scope: ['STANDARD'], // Required field
          is_active: true,
        },
        {
          name: 'Blane Pack 5',
          type: 'PACK5',
          price_mad: 450,
          credits: 5,
          tier_scope: ['BASIC', 'STANDARD', 'PREMIUM'], // Required field
          is_active: true,
        }
      ];

      console.log('Inserting additional products:', products);
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (productError) {
        console.error('Additional products insert error:', productError);
        // Don't throw here, we got at least one product in
      }

      // Try inserting a club with all potential required fields
      const testClub = {
        name: 'FitZone Casablanca Test',
        description: 'Modern fitness center in Casablanca',
        tier: 'STANDARD',
        city: 'Casablanca',
        address: 'Boulevard Mohammed V, Casablanca',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['cardio', 'weights', 'group_classes'],
        contact_phone: '+212522123456',
        contact_email: 'info@fitzone-casa.ma',
        is_active: true,
        // Add potential missing fields that might be required
        owner_id: null, // This might need to be set, but for testing we'll try null first
      };

      console.log('Inserting test club:', testClub);
      const { data: testClubData, error: testClubError } = await supabase
        .from('clubs')
        .insert([testClub])
        .select();

      if (testClubError) {
        console.error('Test club insert error:', testClubError);
        // Don't throw, we might still have products
      }

      const allProducts = [...(testProductData || []), ...(productData || [])];
      const allClubs = testClubData || [];

      setResults([{
        test: 'Database Seeding',
        success: true,
        message: `✅ Seeded ${allProducts.length} products and ${allClubs.length} clubs`,
        data: { products: allProducts, clubs: allClubs }
      }]);

      // Update status
      setDbStatus({
        products: allProducts.length,
        clubs: allClubs.length,
        ready: allProducts.length > 0
      });

    } catch (error) {
      console.error('Seeding error details:', error);
      setResults([{
        test: 'Database Seeding',
        success: false,
        message: '❌ Seeding failed',
        error: error instanceof Error ? error.message : JSON.stringify(error)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🧪 Drop-In Morocco API Test Suite</h1>
          <p className="text-gray-600">
            Test your Supabase database connection and API functionality
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎮 Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Button 
                onClick={testConnection}
                disabled={isLoading}
                variant="outline"
              >
                🔌 Test Connection
              </Button>
              <Button 
                onClick={checkSchema}
                disabled={isLoading}
                variant="outline"
              >
                🔍 Check Schema
              </Button>
              <Button 
                onClick={seedDatabase}
                disabled={isLoading}
                variant="outline"
              >
                🌱 Seed Database
              </Button>
            </div>
            
            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 font-medium">Running test...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Status */}
        {dbStatus && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>🗄️ Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dbStatus.products}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dbStatus.clubs}</div>
                  <div className="text-sm text-gray-600">Clubs</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dbStatus.ready ? 'text-green-600' : 'text-red-600'}`}>
                    {dbStatus.ready ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-600">Ready</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {results.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📊 Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results.map((result, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${result.success ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.success ? '✅ PASS' : '❌ FAIL'}
                    </Badge>
                    <h3 className="font-semibold">{result.test}</h3>
                  </div>
                  <p className="text-gray-600 mb-2">{result.message}</p>
                  {result.error && (
                    <div className="bg-red-100 p-3 rounded text-sm text-red-700">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                        View Data
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>📋 What Should Be Here</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🔌 Connection Testing</h3>
                <p className="text-gray-600">Test your Supabase database connection and verify API endpoints are responding.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🌱 Database Seeding</h3>
                <p className="text-gray-600">Populate your database with test data including products, clubs, and capacity records.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🧪 Comprehensive Testing</h3>
                <p className="text-gray-600">Run tests for authentication, products, clubs, orders, QR codes, and admin functions.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📊 Results Dashboard</h3>
                <p className="text-gray-600">View detailed test results, success rates, performance metrics, and error logs.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APITestSimple;

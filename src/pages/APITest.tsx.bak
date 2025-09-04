import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APITestRunner, type TestResult } from '@/lib/api/test-runner';
import { DropInAPI } from '@/lib/api';
import { DataSeeder } from '@/lib/api/data-seeder';

const APITest = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [dbStatus, setDbStatus] = useState<any>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setCurrentTest('Running all tests...');
    try {
      const testResults = await APITestRunner.runAllTests();
      setResults(testResults);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runSpecificTest = async (testName: string) => {
    setIsRunning(true);
    setCurrentTest(`Running ${testName} tests...`);
    try {
      await APITestRunner.testSpecific(testName);
      const testResults = APITestRunner.getResults();
      setResults(testResults);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const testConnection = async () => {
    setIsRunning(true);
    setCurrentTest('Testing Supabase connection...');
    try {
      const products = await DropInAPI.products.getProducts();
      const status = await DataSeeder.getDatabaseStatus();
      setDbStatus(status);
      
      setResults([{
        test: 'Supabase Connection',
        success: true,
        message: `✅ Connected! Found ${products.length} products in database`,
        data: { products: products.slice(0, 3), dbStatus: status },
        duration: 0
      }]);
    } catch (error) {
      setResults([{
        test: 'Supabase Connection',
        success: false,
        message: '❌ Connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: 0
      }]);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const seedDatabase = async () => {
    setIsRunning(true);
    setCurrentTest('Seeding database with test data...');
    try {
      const result = await DataSeeder.seedAll();
      const status = await DataSeeder.getDatabaseStatus();
      setDbStatus(status);
      
      setResults([{
        test: 'Database Seeding',
        success: result.success,
        message: result.success ? '✅ Database seeded successfully!' : '❌ Seeding failed',
        data: status,
        error: result.error,
        duration: 0
      }]);
    } catch (error) {
      setResults([{
        test: 'Database Seeding',
        success: false,
        message: '❌ Seeding failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: 0
      }]);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🧪 Drop-In Morocco API Test Suite</h1>
          <p className="text-gray-600">
            Test your Supabase database connection and API functionality
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎮 Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Button 
                onClick={testConnection}
                disabled={isRunning}
                variant="outline"
              >
                🔌 Test Connection
              </Button>
              <Button 
                onClick={seedDatabase}
                disabled={isRunning}
                variant="outline"
              >
                🌱 Seed Database
              </Button>
              <Button 
                onClick={runAllTests}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                🚀 Run All Tests
              </Button>
              <Button 
                onClick={() => runSpecificTest('products')}
                disabled={isRunning}
                variant="outline"
              >
                📦 Test Products
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => runSpecificTest('clubs')}
                disabled={isRunning}
                variant="outline"
              >
                🏢 Test Clubs
              </Button>
              <Button 
                onClick={() => runSpecificTest('auth')}
                disabled={isRunning}
                variant="outline"
              >
                🔐 Test Auth
              </Button>
              <Button 
                onClick={() => runSpecificTest('orders')}
                disabled={isRunning}
                variant="outline"
              >
                🛒 Test Orders
              </Button>
              <Button 
                onClick={() => runSpecificTest('qr')}
                disabled={isRunning}
                variant="outline"
              >
                📱 Test QR Codes
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => runSpecificTest('admin')}
                disabled={isRunning}
                variant="outline"
              >
                👨‍💼 Test Admin
              </Button>
            </div>

            {isRunning && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 font-medium">{currentTest}</span>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dbStatus.products}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dbStatus.clubs}</div>
                  <div className="text-sm text-gray-600">Clubs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{dbStatus.capacity_records}</div>
                  <div className="text-sm text-gray-600">Capacity Records</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${dbStatus.ready_for_testing ? 'text-green-600' : 'text-red-600'}`}>
                    {dbStatus.ready_for_testing ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-600">Ready for Testing</div>
                </div>
              </div>
              {!dbStatus.ready_for_testing && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    <strong>💡 Tip:</strong> Click "Seed Database" to populate your database with test data before running tests.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📊 Test Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{totalTests - passedTests}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        {results.length > 0 && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="passed" className="text-green-600">
                ✅ Passed ({passedTests})
              </TabsTrigger>
              <TabsTrigger value="failed" className="text-red-600">
                ❌ Failed ({totalTests - passedTests})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-3">
                {results.map((result, index) => (
                  <TestResultCard key={index} result={result} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="passed">
              <div className="space-y-3">
                {results.filter(r => r.success).map((result, index) => (
                  <TestResultCard key={index} result={result} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="failed">
              <div className="space-y-3">
                {results.filter(r => !r.success).map((result, index) => (
                  <TestResultCard key={index} result={result} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Instructions */}
        {results.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>🚀 Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Test Database Connection</h3>
                  <p className="text-gray-600">Start by clicking "Test Connection" to verify your Supabase database is accessible.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Run Individual Tests</h3>
                  <p className="text-gray-600">Test specific API modules like Products, Clubs, Authentication, etc.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Full Test Suite</h3>
                  <p className="text-gray-600">Click "Run All Tests" to execute the complete test suite and verify everything works.</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> Some tests require authentication and will show expected failures when not logged in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const TestResultCard = ({ result }: { result: TestResult }) => {
  return (
    <Card className={`border-l-4 ${result.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={result.success ? 'default' : 'destructive'}>
                {result.success ? '✅ PASS' : '❌ FAIL'}
              </Badge>
              <h3 className="font-semibold">{result.test}</h3>
              {result.duration && (
                <span className="text-xs text-gray-500">({result.duration}ms)</span>
              )}
            </div>
            <p className="text-gray-600 mb-2">{result.message}</p>
            {result.error && (
              <div className="bg-red-50 p-3 rounded text-sm text-red-700">
                <strong>Error:</strong> {result.error}
              </div>
            )}
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  View Data
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APITest;

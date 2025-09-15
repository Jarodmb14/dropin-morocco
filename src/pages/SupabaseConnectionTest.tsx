import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";

const SupabaseConnectionTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔄 Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data: health, error: healthError } = await supabase
        .from('clubs')
        .select('count')
        .limit(1);
      
      if (healthError) {
        throw new Error(`Health check failed: ${healthError.message}`);
      }
      
      console.log('✅ Supabase connection test passed');
      setResult('✅ Supabase connection is working');
      
      // Test 2: Auth service
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('⚠️ Session check warning:', sessionError.message);
        setResult(prev => prev + '\n⚠️ Session check: ' + sessionError.message);
      } else {
        console.log('✅ Auth service is working');
        setResult(prev => prev + '\n✅ Auth service is working');
      }
      
    } catch (err) {
      console.error('❌ Supabase connection test failed:', err);
      setError(`Connection test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testPasswordUpdate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔄 Testing password update functionality...');
      
      // Test with a dummy password update (this will fail but show us the error)
      const { error } = await supabase.auth.updateUser({
        password: 'test123456'
      });
      
      if (error) {
        console.log('🔄 Password update test result:', error.message);
        if (error.message.includes('session') || error.message.includes('authenticated')) {
          setResult('✅ Password update function is working (requires authentication)');
        } else {
          setResult(`⚠️ Password update test: ${error.message}`);
        }
      } else {
        setResult('✅ Password update test passed (unexpected success)');
      }
      
    } catch (err) {
      console.error('❌ Password update test failed:', err);
      setError(`Password update test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Supabase Test
            </h2>
            <p className="text-gray-600 text-center mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Test Supabase connection and password update functionality
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 font-bold text-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {loading ? "TESTING..." : "TEST CONNECTION"}
            </button>

            <button
              onClick={testPasswordUpdate}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 px-6 font-bold text-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {loading ? "TESTING..." : "TEST PASSWORD UPDATE"}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 font-medium whitespace-pre-line" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {result}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Check browser console for detailed logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;

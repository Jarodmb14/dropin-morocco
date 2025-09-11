import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';

const DebugVenues = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log('🔍 Testing Supabase connection...');
        
        // Test 1: Basic connection
        const { data: testData, error: testError } = await supabase
          .from('clubs')
          .select('count')
          .limit(1);

        console.log('Test 1 - Count query:', { testData, testError });

        // Test 2: Get actual data
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .limit(5);

        console.log('Test 2 - Clubs data:', { clubsData, clubsError });

        // Test 3: Check if table exists
        const { data: tablesData, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');

        console.log('Test 3 - Tables:', { tablesData, tablesError });

        setDebugInfo({
          test1: { data: testData, error: testError },
          test2: { data: clubsData, error: clubsError },
          test3: { data: tablesData, error: tablesError }
        });

      } catch (error) {
        console.error('❌ Debug error:', error);
        setDebugInfo({ error: error.message });
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Venues</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default DebugVenues;

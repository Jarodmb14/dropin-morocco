import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [details, setDetails] = useState<any>(null);

  const testSupabase = async () => {
    setStatus('Testing Supabase connection...');
    
    try {
      // Test 1: Basic connection
      console.log('🔍 Test 1: Basic connection...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth test:', { user, authError });
      
      // Test 2: Simple table query (no filters)
      console.log('🔍 Test 2: Simple table query...');
      const { data, error, count } = await supabase
        .from('clubs')
        .select('*', { count: 'exact' });
      
      console.log('Clubs query:', { data, error, count });
      
      // Test 3: Check if RLS is the issue
      console.log('🔍 Test 3: Testing RLS...');
      const { data: rlsData, error: rlsError } = await supabase
        .from('clubs')
        .select('id, name')
        .limit(1);
      
      console.log('RLS test:', { rlsData, rlsError });
      
      setStatus('✅ Connection successful!');
      setDetails({
        auth: { user: !!user, error: authError },
        clubs: { count, error },
        rls: { data: rlsData, error: rlsError }
      });
      
    } catch (err) {
      console.error('❌ Connection failed:', err);
      setStatus(`❌ Connection failed: ${err}`);
      setDetails({ error: err });
    }
  };

  useEffect(() => {
    testSupabase();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Supabase Connection Test</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: status.includes('✅') ? '#d4edda' : '#f8d7da',
        color: status.includes('✅') ? '#155724' : '#721c24',
        border: `1px solid ${status.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <strong>Status:</strong> {status}
      </div>

      {details && (
        <div>
          <h2>Test Details</h2>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={testSupabase}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry Test
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Supabase URL:</strong> https://obqhxrqpxoaiublaoidv.supabase.co</p>
        <p><strong>Check browser console (F12) for detailed logs</strong></p>
      </div>
    </div>
  );
};

export default SupabaseTest;

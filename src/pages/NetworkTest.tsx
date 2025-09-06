import React, { useState, useEffect } from 'react';

const NetworkTest: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);

  const runTests = async () => {
    const results = [];
    
    // Test 1: Basic fetch to Supabase
    try {
      console.log('🌐 Test 1: Basic fetch to Supabase...');
      const start = Date.now();
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
          'Content-Type': 'application/json'
        }
      });
      const duration = Date.now() - start;
      
      results.push({
        test: 'Supabase REST API',
        status: response.ok ? '✅ Success' : '❌ Failed',
        duration: `${duration}ms`,
        statusCode: response.status,
        details: response.ok ? 'Connection successful' : `HTTP ${response.status}`
      });
    } catch (error) {
      results.push({
        test: 'Supabase REST API',
        status: '❌ Error',
        duration: 'N/A',
        details: error.message
      });
    }

    // Test 2: Basic internet connectivity
    try {
      console.log('🌐 Test 2: Basic internet connectivity...');
      const start = Date.now();
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      const duration = Date.now() - start;
      
      results.push({
        test: 'Internet Connectivity',
        status: response.ok ? '✅ Success' : '❌ Failed',
        duration: `${duration}ms`,
        statusCode: response.status,
        details: response.ok ? 'Internet connection working' : `HTTP ${response.status}`
      });
    } catch (error) {
      results.push({
        test: 'Internet Connectivity',
        status: '❌ Error',
        duration: 'N/A',
        details: error.message
      });
    }

    // Test 3: DNS resolution
    try {
      console.log('🌐 Test 3: DNS resolution...');
      const start = Date.now();
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co', {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000)
      });
      const duration = Date.now() - start;
      
      results.push({
        test: 'Supabase DNS Resolution',
        status: '✅ Success',
        duration: `${duration}ms`,
        statusCode: response.status,
        details: 'DNS resolution successful'
      });
    } catch (error) {
      results.push({
        test: 'Supabase DNS Resolution',
        status: '❌ Error',
        duration: 'N/A',
        details: error.message
      });
    }

    setTests(results);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Network Connectivity Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTests}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Run Tests Again
        </button>
      </div>

      <div>
        <h2>Test Results</h2>
        {tests.length === 0 ? (
          <p>Running tests...</p>
        ) : (
          <div>
            {tests.map((test, index) => (
              <div key={index} style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                marginBottom: '10px',
                borderRadius: '5px',
                backgroundColor: test.status.includes('✅') ? '#f8f9fa' : '#fff5f5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{test.test}</strong>
                  <span style={{ 
                    color: test.status.includes('✅') ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {test.status}
                  </span>
                </div>
                <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                  <div>Duration: {test.duration}</div>
                  {test.statusCode && <div>Status Code: {test.statusCode}</div>}
                  <div>Details: {test.details}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Supabase URL:</strong> https://obqhxrqpxoaiublaoidv.supabase.co</p>
        <p><strong>Check browser console (F12) for detailed logs</strong></p>
      </div>
    </div>
  );
};

export default NetworkTest;

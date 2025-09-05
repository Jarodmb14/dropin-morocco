import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '2rem' }}>🎉 Test Page Working!</h1>
      <p style={{ color: '#666', fontSize: '1.2rem' }}>
        If you can see this, React is working correctly.
      </p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <h2>System Status:</h2>
        <ul>
          <li>✅ React is running</li>
          <li>✅ Vite dev server is working</li>
          <li>✅ TypeScript compilation successful</li>
          <li>✅ Routing is functional</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/gym-booking" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Test Gym Booking
        </a>
        <a 
          href="/admin" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}
        >
          Test Admin
        </a>
      </div>
    </div>
  );
};

export default TestPage;

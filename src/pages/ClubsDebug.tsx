import React, { useState, useEffect } from 'react';

const ClubsDebug: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebug('🚀 Component mounted');
    
    // Set mock clubs immediately
    addDebug('📝 Setting mock clubs...');
    const mockClubs = [
      { id: '1', name: 'Test Gym 1', tier: 'STANDARD', city: 'Test City' },
      { id: '2', name: 'Test Gym 2', tier: 'PREMIUM', city: 'Test City' },
      { id: '3', name: 'Test Gym 3', tier: 'ULTRA_LUXE', city: 'Test City' }
    ];
    
    setClubs(mockClubs);
    addDebug(`✅ Mock clubs set: ${mockClubs.length} clubs`);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Clubs Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Debug Info:</h2>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Clubs State:</h2>
        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <strong>Clubs count:</strong> {clubs.length}
          <br />
          <strong>Clubs data:</strong> {JSON.stringify(clubs, null, 2)}
        </div>
      </div>

      <div>
        <h2>Clubs List:</h2>
        {clubs.length === 0 ? (
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            ❌ NO CLUBS FOUND - This should not happen!
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {clubs.map((club) => (
              <li key={club.id} style={{ 
                padding: '10px', 
                border: '1px solid #ddd', 
                marginBottom: '10px',
                borderRadius: '5px',
                backgroundColor: '#fff'
              }}>
                <strong>{club.name}</strong> - {club.tier} ({club.city})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => {
            addDebug('🔄 Manual refresh clicked');
            const newClubs = [
              { id: '4', name: 'Manual Gym 1', tier: 'STANDARD', city: 'Manual City' },
              { id: '5', name: 'Manual Gym 2', tier: 'PREMIUM', city: 'Manual City' }
            ];
            setClubs(newClubs);
            addDebug(`✅ Manual clubs set: ${newClubs.length} clubs`);
          }}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Manual Refresh
        </button>
      </div>
    </div>
  );
};

export default ClubsDebug;

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SimpleClubsTest: React.FC = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadClubs = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Starting club load...');
      
      // Set mock data immediately first
      console.log('📝 Setting mock data first...');
      setClubs([
        { id: 'mock-1', name: 'Mock Gym 1', tier: 'STANDARD', city: 'Test City' },
        { id: 'mock-2', name: 'Mock Gym 2', tier: 'PREMIUM', city: 'Test City' },
        { id: 'mock-3', name: 'Mock Gym 3', tier: 'ULTRA_LUXE', city: 'Test City' }
      ]);
      
      // Then try Supabase with timeout
      console.log('🌐 Trying Supabase query with timeout...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase query timeout after 5 seconds')), 5000)
      );
      
      const supabasePromise = supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true);
      
      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;
      
      console.log('📊 Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        setError(`Database error: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log('✅ Real clubs loaded:', data);
        setClubs(data);
      } else {
        console.log('ℹ️ No real clubs found, keeping mock data');
      }
    } catch (err) {
      console.error('💥 Catch error:', err);
      setError(`JavaScript error: ${err}`);
      console.log('🔄 Keeping mock data due to error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Component mounted, loading clubs...');
    loadClubs();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Clubs Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={loadClubs}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Refresh Clubs'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div>
        <h2>Clubs ({clubs.length})</h2>
        {clubs.length === 0 ? (
          <p style={{ color: '#666' }}>No clubs found</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {clubs.map((club) => (
              <li key={club.id} style={{ 
                padding: '10px', 
                border: '1px solid #ddd', 
                marginBottom: '10px',
                borderRadius: '5px'
              }}>
                <strong>{club.name}</strong> - {club.tier} ({club.city})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Check browser console (F12) for detailed logs</p>
      </div>
    </div>
  );
};

export default SimpleClubsTest;

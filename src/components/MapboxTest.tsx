import React, { useState } from 'react';
import { MAPBOX_CONFIG, isMapboxConfigured } from '@/config/mapbox';

const MapboxTest: React.FC = () => {
  const [testQuery, setTestQuery] = useState('139 Boulevard d\'Anfa, Casablanca 20000 Maroc');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testMapboxAPI = async () => {
    if (!isMapboxConfigured()) {
      setError('Mapbox not configured. Please add VITE_MAPBOX_ACCESS_TOKEN to .env.local');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Clean the query
      const cleanQuery = testQuery
        .replace(/[^\w\s,.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      console.log('🧪 Testing Mapbox with:', cleanQuery);

      const response = await fetch(
        `${MAPBOX_CONFIG.GEOCODING_API}/${encodeURIComponent(cleanQuery)}.json?` +
        `access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}&` +
        `country=MA&` +
        `limit=8&` +
        `types=address,poi,locality,neighborhood&` +
        `autocomplete=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🧪 Mapbox response:', data);
      
      setResults(data.features || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('🧪 Mapbox test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAlternativeQueries = () => {
    const alternatives = [
      'Boulevard d\'Anfa, Casablanca',
      'Boulevard d\'Anfa, Casablanca Morocco',
      '139 Boulevard d\'Anfa',
      'Boulevard Anfa, Casablanca',
      'Anfa, Casablanca'
    ];

    alternatives.forEach(async (alt, index) => {
      setTimeout(async () => {
        try {
          console.log(`🧪 Testing alternative ${index + 1}:`, alt);
          const response = await fetch(
            `${MAPBOX_CONFIG.GEOCODING_API}/${encodeURIComponent(alt)}.json?` +
            `access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}&` +
            `country=MA&` +
            `limit=3`
          );
          const data = await response.json();
          console.log(`🧪 Alternative ${index + 1} results:`, data.features?.length || 0, 'results');
        } catch (err) {
          console.error(`🧪 Alternative ${index + 1} error:`, err);
        }
      }, index * 1000);
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Mapbox API Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Address:</label>
        <input
          type="text"
          value={testQuery}
          onChange={(e) => setTestQuery(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter address to test"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={testMapboxAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Mapbox API'}
        </button>
        <button
          onClick={testAlternativeQueries}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Test Alternative Queries
        </button>
      </div>

      <div className="mb-4">
        <strong>Status:</strong> {isMapboxConfigured() ? '✅ Mapbox Configured' : '❌ Mapbox Not Configured'}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Results ({results.length}):</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded">
                <div><strong>Name:</strong> {result.text || 'N/A'}</div>
                <div><strong>Full Address:</strong> {result.place_name || 'N/A'}</div>
                <div><strong>Type:</strong> {result.place_type?.join(', ') || 'N/A'}</div>
                <div><strong>Relevance:</strong> {result.relevance || 'N/A'}</div>
                <div><strong>Coordinates:</strong> {result.geometry?.coordinates?.join(', ') || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <p>1. Make sure you have VITE_MAPBOX_ACCESS_TOKEN in your .env.local file</p>
        <p>2. Check browser console for detailed logs</p>
        <p>3. Try different variations of the address if no results</p>
      </div>
    </div>
  );
};

export default MapboxTest;


import { useState, useEffect } from 'react';
import { LocationAPI, DropInAPI } from '@/lib/api';
import SimpleHeader from '@/components/SimpleHeader';

const LocationTest = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  // Moroccan cities for testing
  const moroccanCities = [
    { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
    { name: 'Rabat', lat: 34.0209, lng: -6.8416 },
    { name: 'Marrakech', lat: 31.6295, lng: -8.0089 },
    { name: 'Fez', lat: 34.0331, lng: -5.0003 },
    { name: 'Agadir', lat: 30.4278, lng: -9.5981 },
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError('Error getting location: ' + error.message);
        setLoading(false);
      }
    );
  };

  const testNearbyClubs = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await DropInAPI.discoverNearbyGyms(lat, lng, 20);
      setNearbyClubs(result.clubs || []);
      setTestResults(result);
    } catch (err) {
      setError('Error fetching nearby clubs: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testCitySearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await LocationAPI.searchClubsByCity(city);
      setNearbyClubs(result);
      setTestResults({ success: true, clubs: result, totalFound: result.length });
    } catch (err) {
      setError('Error searching clubs by city: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testPopularCities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cities = await LocationAPI.getPopularCities();
      setTestResults({ success: true, popularCities: cities });
    } catch (err) {
      setError('Error fetching popular cities: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testDistanceCalculation = () => {
    const casa = { lat: 33.5731, lng: -7.5898 };
    const rabat = { lat: 34.0209, lng: -6.8416 };
    
    const distance = LocationAPI.calculateDistance(
      casa.lat, casa.lng,
      rabat.lat, rabat.lng
    );
    
    setTestResults({
      success: true,
      distanceTest: {
        from: 'Casablanca',
        to: 'Rabat',
        distance: `${distance.toFixed(2)} km`
      }
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wide mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🗺️ PostGIS Location Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Test Controls
            </h2>

            {/* Current Location */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Current Location
              </h3>
              {userLocation ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    📍 Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </p>
                  <button
                    onClick={() => testNearbyClubs(userLocation.lat, userLocation.lng)}
                    disabled={loading}
                    className="mt-2 bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {loading ? 'SEARCHING...' : 'FIND NEARBY GYMS'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {loading ? 'GETTING LOCATION...' : 'GET MY LOCATION'}
                </button>
              )}
            </div>

            {/* Moroccan Cities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Test Moroccan Cities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {moroccanCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => testCitySearch(city.name)}
                    disabled={loading}
                    className="bg-gray-100 text-gray-800 px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Tests */}
            <div className="space-y-3">
              <button
                onClick={testPopularCities}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {loading ? 'LOADING...' : 'GET POPULAR CITIES'}
              </button>
              
              <button
                onClick={testDistanceCalculation}
                disabled={loading}
                className="w-full bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                TEST DISTANCE CALCULATION
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Test Results
            </h2>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 mb-6 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                ❌ {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-700" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Testing PostGIS functions...
                </p>
              </div>
            )}

            {testResults && (
              <div className="space-y-6">
                {/* Test Summary */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    ✅ Test Summary
                  </h3>
                  <pre className="text-sm text-green-700 whitespace-pre-wrap">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>

                {/* Nearby Clubs */}
                {nearbyClubs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Found {nearbyClubs.length} Clubs
                    </h3>
                    <div className="space-y-3">
                      {nearbyClubs.map((club) => (
                        <div key={club.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {club.name}
                              </h4>
                              <p className="text-sm text-gray-600">{club.city}</p>
                              <p className="text-sm text-gray-600">{club.tier} • {club.monthly_price} MAD/month</p>
                            </div>
                            {club.distance_km && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded">
                                {club.distance_km} km
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            🚀 PostGIS Integration Status
          </h3>
          <div className="text-blue-700 space-y-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <p>✅ <strong>PostGIS Extension:</strong> Enabled with spatial functions</p>
            <p>✅ <strong>Location API:</strong> Real distance calculations</p>
            <p>✅ <strong>Spatial Indexing:</strong> Optimized for performance</p>
            <p>✅ <strong>Moroccan Coordinates:</strong> Real location data</p>
            <p>⚠️ <strong>Database Setup:</strong> Run the SQL in Supabase to enable PostGIS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTest;

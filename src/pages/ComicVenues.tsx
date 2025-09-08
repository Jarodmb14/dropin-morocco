import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimpleHeader from "@/components/SimpleHeader";
import { MapView } from "@/components/MapView";
import { LocationSearch } from "@/components/LocationSearch";
import { supabase } from '@/integrations/supabase/client';

const ComicVenues = () => {
  const navigate = useNavigate();
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km radius
  const [showAllGyms, setShowAllGyms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Fetch gyms from database
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        console.log('🏋️ Fetching gyms from database...');
        
        const { data, error } = await supabase
          .from('clubs')
          .select('*');

        if (error) {
          console.error('❌ Error fetching gyms:', error);
          return;
        }

        console.log('✅ Fetched gyms:', data?.length || 0);
        
        // Transform the data to match our venue structure
        const transformedGyms = data?.map((club: any) => ({
          id: club.id,
          name: club.name,
          tier: club.tier || 'BASIC',
          price_per_hour: club.auto_blane_price || 50,
          rating: 4.5, // Default rating since we don't have reviews yet
          review_count: 0,
          address: club.address || `${club.city}, Morocco`,
          distance: "0 km", // Will be calculated based on user location
          tierColor: getTierColor(club.tier || 'BASIC'),
          latitude: club.latitude || 33.5731, // Default to Casablanca
          longitude: club.longitude || -7.5898,
          description: club.description,
          amenities: club.amenities || []
        })) || [];

        setAllVenues(transformedGyms);
        setFilteredGyms(transformedGyms);
        console.log('✅ Set gyms:', transformedGyms.length);
        
      } catch (error) {
        console.error('❌ Exception fetching gyms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return '#6BAA75';
      case 'STANDARD': return '#4A90E2';
      case 'PREMIUM': return '#9B59B6';
      case 'LUXURY': return '#F39C12';
      default: return '#6BAA75';
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle location search from LocationSearch component
  const handleLocationSelect = (location: any) => {
    const locationData = {
      lat: location.latitude,
      lng: location.longitude
    };
    handleLocationSearch(locationData);
  };

  // Handle location search
  const handleLocationSearch = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location);
    setShowAllGyms(false);
    
    const nearbyGyms = allVenues.filter(venue => {
      const distance = calculateDistance(location.lat, location.lng, venue.latitude, venue.longitude);
      return distance <= searchRadius; // Use selected radius
    });
    
    setFilteredGyms(nearbyGyms);
  };

  // Handle radius change
  const handleRadiusChange = (radius: number) => {
    setSearchRadius(radius);
    
    if (currentLocation) {
      const nearbyGyms = allVenues.filter(venue => {
        const distance = calculateDistance(currentLocation.lat, currentLocation.lng, venue.latitude, venue.longitude);
        return distance <= radius;
      });
      setFilteredGyms(nearbyGyms);
    }
  };

  // Handle GPS location
  const handleGPSLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCurrentLocation(location);
            setShowAllGyms(false);
            
            const nearbyGyms = allVenues.filter(venue => {
              const distance = calculateDistance(location.lat, location.lng, venue.latitude, venue.longitude);
              return distance <= searchRadius;
            });
            
            setFilteredGyms(nearbyGyms);
          },
          (error) => {
            console.error('GPS location error:', error);
            alert('Unable to get your location. Please search manually.');
          }
        );
      } else {
        alert('GPS is not supported by this browser.');
      }
    } catch (error) {
      console.error('GPS location exception:', error);
    }
  };

  // Show all gyms
  const handleShowAllGyms = () => {
    setShowAllGyms(true);
    setFilteredGyms(allVenues);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Comic-style energy bursts */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full animate-pulse opacity-30" style={{ 
          background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
          filter: 'blur(20px)'
        }} />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full animate-pulse delay-1000 opacity-30" style={{ 
          background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)',
          filter: 'blur(15px)'
        }} />
        <div className="absolute bottom-32 left-1/4 w-24 h-24 rounded-full animate-pulse delay-2000 opacity-30" style={{ 
          background: 'radial-gradient(circle, #6F42C1 0%, transparent 70%)',
          filter: 'blur(10px)'
        }} />
        
        {/* Moroccan pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #FF6B35 0px, #FF6B35 2px, transparent 2px, transparent 20px)`,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Comic-style action lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #FF6B35 2px, #FF6B35 4px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative z-10">
        <SimpleHeader />
        
        {/* Main Content Section */}
        <section className="py-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 uppercase mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              🏋️‍♂️ Find Your Perfect Gym
            </h1>
            <p className="text-xl text-gray-600 font-space-grotesk mb-6 max-w-3xl mx-auto">
              Discover premium fitness venues across Morocco. From basic gyms to luxury wellness centers.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-green-600">📍</span>
              <span className="text-sm font-space-grotesk text-green-700">
                Search by location to find nearby gyms
              </span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              
              {/* Left Column - Search Controls */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-space-grotesk font-semibold text-gray-900 mb-2">
                      🔍 Search Gyms by Location
                    </h2>
                    <p className="text-gray-600 font-space-grotesk">
                      Enter a city or address to find nearby fitness venues
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <LocationSearch 
                      onLocationSelect={handleLocationSelect}
                      onGPSLocation={handleGPSLocation}
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-space-grotesk font-medium text-gray-700">
                          Search Radius:
                        </label>
                        <select
                          value={searchRadius}
                          onChange={(e) => handleRadiusChange(Number(e.target.value))}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-space-grotesk"
                        >
                          <option value={5}>5 km</option>
                          <option value={10}>10 km</option>
                          <option value={25}>25 km</option>
                          <option value={50}>50 km</option>
                        </select>
                      </div>

                      <button
                        onClick={handleShowAllGyms}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-space-grotesk font-medium hover:bg-blue-700 transition-colors"
                      >
                        Show All Gyms
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 font-space-grotesk">
                        {loading 
                          ? '🔄 Loading gyms...' 
                          : showAllGyms 
                            ? `Showing all ${allVenues.length} gyms` 
                            : currentLocation 
                              ? `Found ${filteredGyms.length} gyms within ${searchRadius}km` 
                              : `Found ${allVenues.length} gyms - enter a location to search nearby`
                        }
                      </p>
                      {currentLocation && !loading && (
                        <p className="text-sm text-gray-500 font-space-grotesk mt-2">
                          💡 Click "Show All Gyms" above to see all gyms regardless of distance
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-space-grotesk font-semibold text-gray-900">
                        {viewMode === 'map' ? '🗺️ Interactive Map' : '📋 Gym List'}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => setViewMode('map')}
                            className={`px-3 py-1 text-sm font-space-grotesk font-medium transition-colors ${
                              viewMode === 'map' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            🗺️ Map
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 text-sm font-space-grotesk font-medium transition-colors ${
                              viewMode === 'list' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            📋 List
                          </button>
                        </div>
                        <div className="text-sm text-gray-600 font-space-grotesk">
                          {loading ? '🔄 Loading...' : `${filteredGyms.length} gyms shown`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[700px] relative">
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🔄</div>
                          <p className="text-gray-600 font-space-grotesk">Loading gyms...</p>
                        </div>
                      </div>
                    ) : viewMode === 'map' ? (
                      <MapView 
                        gyms={filteredGyms || []}
                        userLocation={currentLocation ? [currentLocation.lat, currentLocation.lng] : undefined}
                      />
                    ) : (
                      <div className="h-full overflow-y-auto p-4">
                        <div className="space-y-4">
                          {filteredGyms.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="text-4xl mb-4">🏋️‍♂️</div>
                              <h3 className="text-lg font-space-grotesk font-semibold text-gray-900 mb-2">
                                No gyms found
                              </h3>
                              <p className="text-gray-600 font-space-grotesk">
                                Try adjusting your search radius or location
                              </p>
                            </div>
                          ) : (
                            filteredGyms.map((gym) => (
                              <div key={gym.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-lg font-space-grotesk font-semibold text-gray-900">
                                        {gym.name}
                                      </h3>
                                      <span className={`px-2 py-1 rounded-full text-xs font-space-grotesk font-medium ${gym.tierColor}`}>
                                        {gym.tier}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600 font-space-grotesk mb-3">
                                      <div className="flex items-center gap-1">
                                        <span>📍</span>
                                        <span>{gym.address}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>⭐</span>
                                        <span>{gym.rating} ({gym.review_count} reviews)</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>💰</span>
                                        <span>{gym.price_per_hour} MAD/hour</span>
                                      </div>
                                    </div>
                                    
                                    {gym.description && (
                                      <p className="text-sm text-gray-600 font-space-grotesk mb-3 line-clamp-2">
                                        {gym.description}
                                      </p>
                                    )}
                                    
                                    {gym.amenities && gym.amenities.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        {gym.amenities.slice(0, 4).map((amenity: string, index: number) => (
                                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-space-grotesk">
                                            {amenity}
                                          </span>
                                        ))}
                                        {gym.amenities.length > 4 && (
                                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-space-grotesk">
                                            +{gym.amenities.length - 4} more
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="ml-4 flex flex-col items-end gap-2">
                                    <button
                                      onClick={() => navigate(`/gym/${gym.id}`)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-space-grotesk font-medium hover:bg-blue-700 transition-colors"
                                    >
                                      View Details
                                    </button>
                                    <div className="text-sm text-gray-500 font-space-grotesk">
                                      {gym.distance}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default ComicVenues;

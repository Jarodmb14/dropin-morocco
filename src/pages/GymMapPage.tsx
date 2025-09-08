import React, { useState, useEffect } from 'react';
import { MapView } from '@/components/MapView';
import { LocationSearch } from '@/components/LocationSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, Filter, Star, Clock, Users } from 'lucide-react';

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  price_per_hour: number;
  description?: string;
  amenities?: string[];
  rating?: number;
  review_count?: number;
}

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'district' | 'landmark' | 'address';
}

export const GymMapPage: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Filters
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Calculate distance between two coordinates (in kilometers)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Load gyms from the database
  const loadGyms = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🏋️ Loaded gyms:', data?.length || 0);
        
        // Transform the data to match our Gym interface
        const transformedGyms: Gym[] = data.map((club: any) => ({
          id: club.id,
          name: club.name,
          address: club.address || 'Address not available',
          latitude: club.latitude || 33.5731, // Default to Casablanca if no coordinates
          longitude: club.longitude || -7.5898,
          tier: club.tier || 'BASIC',
          price_per_hour: club.price_per_hour || 50,
          description: club.description,
          amenities: club.amenities || [],
          rating: club.rating || 4.0,
          review_count: club.review_count || 0
        }));
        
        setGyms(transformedGyms);
        setFilteredGyms(transformedGyms);
      } else {
        throw new Error(`Failed to load gyms: ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading gyms:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gyms');
      
      // Fallback to sample data if API fails
      const sampleGyms: Gym[] = [
        {
          id: 'sample-1',
          name: 'FitZone Casablanca',
          address: 'Maarif, Casablanca, Morocco',
          latitude: 33.5731,
          longitude: -7.5898,
          tier: 'PREMIUM',
          price_per_hour: 80,
          description: 'Modern gym with state-of-the-art equipment',
          amenities: ['Cardio', 'Weights', 'Pool', 'Sauna'],
          rating: 4.5,
          review_count: 120
        },
        {
          id: 'sample-2',
          name: 'PowerGym Rabat',
          address: 'Agdal, Rabat, Morocco',
          latitude: 34.0209,
          longitude: -6.8416,
          tier: 'STANDARD',
          price_per_hour: 60,
          description: 'Community-focused gym with friendly atmosphere',
          amenities: ['Cardio', 'Weights', 'Classes'],
          rating: 4.2,
          review_count: 85
        },
        {
          id: 'sample-3',
          name: 'Elite Fitness Marrakech',
          address: 'Gueliz, Marrakech, Morocco',
          latitude: 31.6295,
          longitude: -7.9811,
          tier: 'LUXURY',
          price_per_hour: 120,
          description: 'Luxury fitness center with premium amenities',
          amenities: ['Cardio', 'Weights', 'Pool', 'Sauna', 'Spa', 'Personal Training'],
          rating: 4.8,
          review_count: 200
        }
      ];
      
      setGyms(sampleGyms);
      setFilteredGyms(sampleGyms);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    console.log('🗺️ Location selected in GymMapPage:', location);
    setCurrentLocation(location);
    
    // Filter gyms near the selected location
    const nearbyGyms = gyms.filter(gym => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        gym.latitude,
        gym.longitude
      );
      return distance <= 10; // Within 10km
    });
    
    console.log('📍 Filtering gyms near location:', nearbyGyms.length, 'gyms found');
    setFilteredGyms(nearbyGyms);
    
    // Show success message
    alert(`Location set to: ${location.name}\nFound ${nearbyGyms.length} gyms within 10km`);
  };

  // Handle GPS location
  const handleGPSLocation = async () => {
    try {
      console.log('🌍 Starting GPS location detection...');
      
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }
      
      console.log('🌍 Requesting GPS permission...');
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('🌍 GPS position received:', position.coords);
            resolve(position);
          },
          (error) => {
            console.error('🌍 GPS error:', error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          }
        );
      });
      
      const location: Location = {
        id: 'gps-location',
        name: 'Your Location',
        address: `GPS Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        type: 'address'
      };
      
      console.log('🌍 Setting current location:', location);
      setCurrentLocation(location);
      
      // Show success message
      alert(`Location detected! Latitude: ${position.coords.latitude.toFixed(4)}, Longitude: ${position.coords.longitude.toFixed(4)}`);
      
    } catch (err) {
      console.error('🌍 GPS location error:', err);
      
      let errorMessage = 'Unable to get your location. ';
      
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
      } else {
        errorMessage += err instanceof Error ? err.message : 'Unknown error occurred.';
      }
      
      alert(errorMessage);
    }
  };

  // Handle gym selection
  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...gyms];
    
    // Filter by tier
    if (selectedTier !== 'ALL') {
      filtered = filtered.filter(gym => gym.tier === selectedTier);
    }
    
    // Filter by price
    filtered = filtered.filter(gym => gym.price_per_hour <= maxPrice);
    
    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(gym => (gym.rating || 0) >= minRating);
    }
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(gym => 
        selectedAmenities.every(amenity => 
          gym.amenities && (
            Array.isArray(gym.amenities) 
              ? gym.amenities.includes(amenity)
              : Object.keys(gym.amenities).includes(amenity)
          )
        )
      );
    }
    
    setFilteredGyms(filtered);
  };

  // Apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [selectedTier, maxPrice, minRating, selectedAmenities, gyms]);

  // Load gyms on component mount
  useEffect(() => {
    loadGyms();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      BASIC: 'bg-green-100 text-green-800',
      STANDARD: 'bg-blue-100 text-blue-800',
      PREMIUM: 'bg-orange-100 text-orange-800',
      LUXURY: 'bg-red-100 text-red-800'
    };
    return colors[tier as keyof typeof colors] || colors.BASIC;
  };

  const allAmenities = Array.from(new Set(gyms.flatMap(gym => 
    gym.amenities 
      ? (Array.isArray(gym.amenities) ? gym.amenities : Object.keys(gym.amenities))
      : []
  )));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Gyms Near You
          </h1>
          <p className="text-gray-600">
            Discover gyms and fitness centers across Morocco
          </p>
        </div>

        {/* Location Search - Testing Step 2 */}
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          onGPSLocation={handleGPSLocation}
          currentLocation={currentLocation}
        />
        
        {/* Simple Location Search - Backup */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Search (Testing Mode)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter city, district, or landmark..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <Button
                  onClick={handleGPSLocation}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  GPS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Gyms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tier Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tier</label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Tiers</SelectItem>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Price: {formatPrice(maxPrice)}
                </label>
                <Slider
                  value={[maxPrice]}
                  onValueChange={(value) => setMaxPrice(value[0])}
                  max={500}
                  min={20}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Min Rating: {minRating.toFixed(1)} ⭐
                </label>
                <Slider
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Amenities Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Amenities</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity]);
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {filteredGyms.length} of {gyms.length} gyms
            </p>
            {currentLocation && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentLocation.name}
              </Badge>
            )}
          </div>
          
          <Button
            onClick={loadGyms}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Map View - Testing Step 1 */}
        <MapView
          gyms={filteredGyms}
          onGymSelect={handleGymSelect}
          center={currentLocation ? [currentLocation.latitude, currentLocation.longitude] : [33.5731, -7.5898]}
          zoom={currentLocation ? 15 : 13}
          height="600px"
        />
        
        {/* Map Placeholder - Backup */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Map View (Testing Mode)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Map temporarily disabled for testing</p>
                <p className="text-sm text-gray-500 mt-2">
                  {filteredGyms.length} gyms found in the area
                </p>
                <Button 
                  onClick={() => alert('Map will be enabled once Leaflet issues are resolved')}
                  className="mt-4"
                >
                  Enable Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Gym List */}
        {filteredGyms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Gyms ({filteredGyms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGyms.map((gym) => (
                  <Card
                    key={gym.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedGym?.id === gym.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleGymSelect(gym)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{gym.name}</h3>
                        <Badge className={getTierColor(gym.tier)}>
                          {gym.tier}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{gym.address}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-lg text-green-600">
                          {formatPrice(gym.price_per_hour)}
                        </span>
                        <span className="text-sm text-gray-500">/hour</span>
                      </div>
                      
                      {gym.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{gym.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({gym.review_count || 0})</span>
                        </div>
                      )}
                      
                      {gym.amenities && (Array.isArray(gym.amenities) ? gym.amenities.length > 0 : Object.keys(gym.amenities).length > 0) && (
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(gym.amenities) ? gym.amenities : Object.keys(gym.amenities)).slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {(Array.isArray(gym.amenities) ? gym.amenities.length : Object.keys(gym.amenities).length) > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(Array.isArray(gym.amenities) ? gym.amenities.length : Object.keys(gym.amenities).length) - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

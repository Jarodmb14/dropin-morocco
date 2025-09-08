import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Search, Filter } from 'lucide-react';

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

export const SimpleGymMapPage: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

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
        }
      ];
      
      setGyms(sampleGyms);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle GPS location
  const handleGPSLocation = async () => {
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });
        
        const location: Location = {
          id: 'gps-location',
          name: 'Your Location',
          address: 'GPS Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          type: 'address'
        };
        
        setCurrentLocation(location);
      } else {
        throw new Error('Geolocation is not supported by this browser');
      }
    } catch (err) {
      console.error('GPS location error:', err);
      alert('Unable to get your location. Please enter an address manually.');
    }
  };

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

        {/* Location Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Gyms Near You
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
                  <Navigation className="h-4 w-4" />
                  GPS
                </Button>
              </div>
              
              {/* Current Location Display */}
              {currentLocation && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Current Location: {currentLocation.name}
                    </p>
                    <p className="text-xs text-blue-700">{currentLocation.address}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {gyms.length} gyms
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

        {/* Simple Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Map View (Coming Soon)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  {gyms.length} gyms found in the area
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gym List */}
        {gyms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Gyms ({gyms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gyms.map((gym) => (
                  <Card key={gym.id} className="cursor-pointer transition-all hover:shadow-lg">
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
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{gym.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({gym.review_count || 0})</span>
                        </div>
                      )}
                      
                      {gym.amenities && gym.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {gym.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {gym.amenities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{gym.amenities.length - 3}
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

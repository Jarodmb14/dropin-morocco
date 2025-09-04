import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Navigation, Filter, List, Map, Star, Dumbbell, Clock } from 'lucide-react';
import { BusinessRules } from '@/lib/api/business-rules';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Venue {
  id: string;
  name: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ULTRA_LUXE';
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  is_active: boolean;
  monthly_price?: number;
  distance?: number;
}

const VenueMap = () => {
  const navigate = useNavigate();
  const { location: userLocation, error: locationError, getCurrentLocation } = useGeolocation();
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [loading, setLoading] = useState(true);

  // Load sample venues with real Moroccan locations
  useEffect(() => {
    loadVenuesWithLocations();
  }, []);

  // Filter venues and calculate distances
  useEffect(() => {
    let filtered = [...venues];

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map(venue => ({
        ...venue,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.latitude,
          venue.longitude
        )
      }));
    }

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(venue => venue.city === selectedCity);
    }

    if (selectedTier) {
      filtered = filtered.filter(venue => venue.tier === selectedTier);
    }

    if (maxDistance && userLocation) {
      const maxDist = parseInt(maxDistance);
      filtered = filtered.filter(venue => venue.distance && venue.distance <= maxDist);
    }

    // Sort by distance if available
    if (userLocation) {
      filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    setFilteredVenues(filtered);
  }, [venues, searchTerm, selectedCity, selectedTier, maxDistance, userLocation]);

  const loadVenuesWithLocations = () => {
    // Sample venues with real Moroccan coordinates
    const sampleVenues: Venue[] = [
      {
        id: '1',
        name: 'FitZone Casablanca Center',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Boulevard Mohammed V, Centre Ville',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['cardio', 'weights', 'group_classes', 'pool'],
        is_active: true,
        monthly_price: 600,
      },
      {
        id: '2',
        name: 'Basic Gym Maarif',
        tier: 'BASIC',
        city: 'Casablanca',
        address: 'Quartier Maarif, Casablanca',
        latitude: 33.5650,
        longitude: -7.6109,
        amenities: ['cardio', 'weights'],
        is_active: true,
        monthly_price: 300,
      },
      {
        id: '3',
        name: 'Luxury Spa Hivernage',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Hivernage, Marrakech',
        latitude: 31.6295,
        longitude: -8.0089,
        amenities: ['spa', 'pool', 'sauna', 'massage', 'yoga'],
        is_active: true,
        monthly_price: 1200,
      },
      {
        id: '4',
        name: 'Ocean Fitness Corniche',
        tier: 'PREMIUM',
        city: 'Rabat',
        address: 'Corniche, Rabat',
        latitude: 34.0209,
        longitude: -6.8416,
        amenities: ['cardio', 'weights', 'group_classes', 'ocean_view'],
        is_active: true,
        monthly_price: 550,
      },
      {
        id: '5',
        name: 'Agdal Sports Club',
        tier: 'STANDARD',
        city: 'Rabat',
        address: 'Agdal, Rabat',
        latitude: 33.9716,
        longitude: -6.8498,
        amenities: ['cardio', 'weights', 'tennis'],
        is_active: true,
        monthly_price: 450,
      },
      {
        id: '6',
        name: 'Marina Bay Fitness',
        tier: 'PREMIUM',
        city: 'Tangier',
        address: 'Marina Bay, Tangier',
        latitude: 35.7595,
        longitude: -5.8340,
        amenities: ['cardio', 'weights', 'pool', 'marina_view'],
        is_active: true,
        monthly_price: 650,
      },
    ];
    
    setVenues(sampleVenues);
    setLoading(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return Math.round(d * 10) / 10; // Round to 1 decimal place
  };

  const getBlanePricing = (venue: Venue): number => {
    return BusinessRules.calculateBlanePricing(venue.tier, venue.monthly_price);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-gray-100 text-gray-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ULTRA_LUXE': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmenity = (amenity: string) => {
    return amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const cities = [...new Set(venues.map(v => v.city))];

  // Simple map placeholder (in production, you'd use Google Maps, Mapbox, or OpenStreetMap)
  const MapView = () => (
    <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-blue-300 relative overflow-hidden">
      {/* Morocco Map Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl opacity-20">🗺️</div>
      </div>
      
      {/* User Location */}
      {userLocation && (
        <div 
          className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"
          style={{
            left: `${((userLocation.longitude + 10) / 15) * 100}%`,
            top: `${((-userLocation.latitude + 36) / 10) * 100}%`,
          }}
          title="Your Location"
        />
      )}

      {/* Venue Markers */}
      {filteredVenues.map((venue) => (
        <div
          key={venue.id}
          className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125 ${
            selectedVenue?.id === venue.id ? 'bg-orange-600 scale-125' : 
            venue.tier === 'ULTRA_LUXE' ? 'bg-yellow-500' :
            venue.tier === 'PREMIUM' ? 'bg-purple-500' :
            venue.tier === 'STANDARD' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
          style={{
            left: `${((venue.longitude + 10) / 15) * 100}%`,
            top: `${((-venue.latitude + 36) / 10) * 100}%`,
          }}
          onClick={() => setSelectedVenue(venue)}
          title={`${venue.name} - ${getBlanePricing(venue)} DHS`}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Venue Types</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Basic (50 DHS)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Standard (50 DHS)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Premium (120 DHS)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Ultra Luxury (350 DHS)</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2 pt-1 border-t">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Venue Info */}
      {selectedVenue && (
        <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-xs">
          <h3 className="font-semibold mb-1">{selectedVenue.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedVenue.address}</p>
          <div className="flex items-center justify-between">
            <Badge className={getTierColor(selectedVenue.tier)}>
              {selectedVenue.tier}
            </Badge>
            <div className="text-orange-600 font-bold">
              {getBlanePricing(selectedVenue)} DHS
            </div>
          </div>
          {selectedVenue.distance && (
            <p className="text-xs text-gray-500 mt-1">
              📍 {selectedVenue.distance} km away
            </p>
          )}
          <Button 
            size="sm" 
            className="w-full mt-3 bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate(`/booking/${selectedVenue.id}?type=single`)}
          >
            Book Now
          </Button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🗺️ Find Nearby Gyms
              </h1>
              <p className="text-gray-600 mt-1">Discover fitness venues near you in Morocco</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Location Access */}
        {!userLocation && !locationError && (
          <Alert className="mb-6">
            <Navigation className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Enable location access to find gyms near you and see distances</span>
                <Button size="sm" onClick={getCurrentLocation} className="ml-4">
                  📍 Get My Location
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {locationError && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>
              Location access denied. You can still browse all venues, but distances won't be shown.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-600" />
                Search & Filter
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-orange-600' : 'border-orange-200 text-orange-600'}
                >
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-orange-600' : 'border-orange-200 text-orange-600'}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Search venues</label>
                <Input
                  placeholder="Name, city, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tier</label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="All tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All tiers</SelectItem>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="ULTRA_LUXE">Ultra Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userLocation && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Distance</label>
                  <Select value={maxDistance} onValueChange={setMaxDistance}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Any distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any distance</SelectItem>
                      <SelectItem value="5">Within 5 km</SelectItem>
                      <SelectItem value="10">Within 10 km</SelectItem>
                      <SelectItem value="25">Within 25 km</SelectItem>
                      <SelectItem value="50">Within 50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                    setSelectedTier('');
                    setMaxDistance('');
                  }}
                  variant="outline"
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-orange-600">{filteredVenues.length}</span> venues
            {userLocation && filteredVenues.length > 0 && (
              <span> • Sorted by distance from your location</span>
            )}
          </p>
        </div>

        {/* Map or List View */}
        {viewMode === 'map' ? (
          <MapView />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <Card key={venue.id} className="hover:shadow-lg transition-shadow border-orange-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {venue.city}
                        {venue.distance && (
                          <span className="text-orange-600 font-medium">
                            • {venue.distance} km
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge className={getTierColor(venue.tier)}>
                      {venue.tier.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {getBlanePricing(venue)} DHS
                      </div>
                      <div className="text-sm text-gray-600">Single Entry (Blane)</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          {formatAmenity(amenity)}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    onClick={() => navigate(`/booking/${venue.id}?type=single`)}
                  >
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No venues found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setSelectedTier('');
                setMaxDistance('');
              }}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueMap;

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Navigation, Clock, Star, 
  Crosshair, Search, Check, ChevronRight,
  Wifi, Car, Coffee, Waves, Dumbbell2,
  Shield, Users, Zap, ArrowLeft
} from 'lucide-react';
import { BusinessRules } from '@/lib/api/business-rules';
import { useNavigate } from 'react-router-dom';

interface Venue {
  id: string;
  name: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ULTRA_LUXE';
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  monthly_price?: number;
  rating: number;
  reviews: number;
  phone?: string;
  email?: string;
  openHours: string;
  description: string;
  distance?: number;
  image: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  type: 'hotel' | 'landmark' | 'district' | 'beach' | 'business' | 'transport';
  icon: string;
  description: string;
}

const VenueMapProfessional = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [addressInput, setAddressInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Premium location database
  const locationDatabase: LocationSuggestion[] = [
    { id: 'casa-1', name: 'Four Seasons Hotel Casablanca', address: 'Anfa Place, Casablanca', latitude: 33.5920, longitude: -7.6266, city: 'Casablanca', type: 'hotel', icon: '🏨', description: 'Luxury oceanfront hotel' },
    { id: 'casa-2', name: 'Twin Center', address: 'Boulevard Zerktouni, Casablanca', latitude: 33.5731, longitude: -7.5898, city: 'Casablanca', type: 'business', icon: '🏢', description: 'Premier business district' },
    { id: 'casa-3', name: 'Hassan II Mosque', address: 'Boulevard de la Corniche, Casablanca', latitude: 33.6084, longitude: -7.6326, city: 'Casablanca', type: 'landmark', icon: '🕌', description: 'Iconic architectural masterpiece' },
    { id: 'marr-1', name: 'La Mamounia', address: 'Avenue Bab Jdid, Marrakech', latitude: 31.6225, longitude: -7.9898, city: 'Marrakech', type: 'hotel', icon: '🏨', description: 'Legendary palace hotel' },
    { id: 'marr-2', name: 'Jemaa el-Fnaa', address: 'Medina, Marrakech', latitude: 31.6260, longitude: -7.9890, city: 'Marrakech', type: 'landmark', icon: '🕌', description: 'UNESCO World Heritage square' },
    { id: 'raba-1', name: 'Agdal District', address: 'Avenue des Nations Unies, Rabat', latitude: 33.9716, longitude: -6.8498, city: 'Rabat', type: 'district', icon: '🏘️', description: 'Diplomatic & residential quarter' },
  ];

  useEffect(() => {
    loadVenuesWithDetails();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const venuesWithDistance = venues.map(venue => ({
        ...venue,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.latitude,
          venue.longitude
        )
      }));
      
      venuesWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      setVenues(venuesWithDistance);
    }
  }, [userLocation]);

  const loadVenuesWithDetails = () => {
    const venuesWithDetails: Venue[] = [
      {
        id: '1',
        name: 'FitZone Premium',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Twin Center, Boulevard Zerktouni',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['cardio', 'weights', 'pool', 'sauna', 'personal_training', 'parking'],
        monthly_price: 600,
        rating: 4.8,
        reviews: 245,
        phone: '+212 522 123 456',
        email: 'info@fitzone-casa.ma',
        openHours: '6:00 AM - 11:00 PM',
        description: 'State-of-the-art fitness center in the heart of Casablanca\'s business district.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      },
      {
        id: '2',
        name: 'Ocean Fitness Club',
        tier: 'STANDARD',
        city: 'Casablanca',
        address: 'Boulevard Ghandi, Maarif',
        latitude: 33.5650,
        longitude: -7.6109,
        amenities: ['cardio', 'weights', 'group_classes', 'wifi'],
        monthly_price: 400,
        rating: 4.2,
        reviews: 128,
        phone: '+212 522 987 654',
        email: 'contact@oceanfitness.ma',
        openHours: '7:00 AM - 10:00 PM',
        description: 'Modern fitness center with ocean-inspired design and community atmosphere.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      },
      {
        id: '3',
        name: 'Atlas Wellness Spa',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Hivernage District, Avenue Mohammed VI',
        latitude: 31.6295,
        longitude: -8.0089,
        amenities: ['spa', 'pool', 'sauna', 'massage', 'yoga', 'wellness', 'valet'],
        monthly_price: 1200,
        rating: 4.9,
        reviews: 89,
        phone: '+212 524 456 789',
        email: 'reservation@atlasspa.ma',
        openHours: '6:00 AM - 12:00 AM',
        description: 'Exclusive wellness sanctuary combining Moroccan traditions with luxury amenities.',
        image: 'https://images.unsplash.com/photo-1544651664-8e43c4e97bc6?w=400&h=300&fit=crop',
      },
    ];
    
    setVenues(venuesWithDetails);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  const getUserLocation = async () => {
    setIsGettingLocation(true);
    setLocationError('');

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        });
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        name: 'Your Current Location',
        address: 'GPS Location'
      });

    } catch (error) {
      setLocationError('Unable to access location. Please enter your address.');
      console.error('Geolocation error:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setUserLocation({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      name: suggestion.name,
      address: suggestion.address
    });
    setAddressInput('');
    setShowSuggestions(false);
  };

  const handleAddressInputChange = (value: string) => {
    setAddressInput(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const filteredSuggestions = useMemo(() => {
    if (!addressInput.trim()) return [];
    
    const query = addressInput.toLowerCase();
    return locationDatabase
      .filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [addressInput]);

  const getBlanePricing = (venue: Venue): number => {
    return BusinessRules.calculateBlanePricing(venue.tier, venue.monthly_price);
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'from-slate-500 to-slate-600';
      case 'STANDARD': return 'from-blue-500 to-blue-600';
      case 'PREMIUM': return 'from-purple-500 to-purple-600';
      case 'ULTRA_LUXE': return 'from-amber-500 to-orange-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      cardio: '💓',
      weights: '🏋️',
      pool: '🏊',
      sauna: '🧖',
      spa: '✨',
      yoga: '🧘',
      personal_training: '👨‍💼',
      parking: '🚗',
      wifi: '📶',
      group_classes: '👥',
      massage: '💆',
      wellness: '🌿',
      valet: '🎩',
    };
    return icons[amenity] || '⭐';
  };

  const getStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Professional Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Discover Gyms
                </h1>
                <p className="text-sm text-slate-600">Find premium fitness venues near you</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-500">🇲🇦 Morocco</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Location Input Section */}
        {!userLocation && (
          <div className="mb-8">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Set Your Location</h2>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Share your location or search for a specific address to discover nearby fitness venues
                  </p>
                </div>

                {/* GPS Button */}
                <div className="text-center mb-8">
                  <Button 
                    onClick={getUserLocation}
                    disabled={isGettingLocation}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    {isGettingLocation ? (
                      <>
                        <Crosshair className="w-5 h-5 mr-3 animate-spin" />
                        Locating you...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5 mr-3" />
                        Use Current Location
                      </>
                    )}
                  </Button>
                  {locationError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {locationError}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center mb-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300"></div>
                  <span className="px-4 text-slate-500 text-sm font-medium">or search manually</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300"></div>
                </div>

                {/* Address Search */}
                <div className="relative max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search hotels, landmarks, or addresses..."
                      value={addressInput}
                      onChange={(e) => handleAddressInputChange(e.target.value)}
                      className="pl-12 pr-4 py-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white shadow-sm text-base"
                      onFocus={() => setShowSuggestions(addressInput.trim().length > 0)}
                    />
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 mt-2 overflow-hidden">
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          className="w-full text-left p-4 hover:bg-slate-50 transition-colors duration-150 flex items-center space-x-3 border-b border-slate-100 last:border-b-0"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          <div className="text-2xl">{suggestion.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{suggestion.name}</div>
                            <div className="text-sm text-slate-600">{suggestion.description}</div>
                            <div className="text-xs text-slate-500">{suggestion.address}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Location Display */}
        {userLocation && (
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{userLocation.name}</h3>
                      <p className="text-slate-600">{userLocation.address}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setUserLocation(null)}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-white"
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Venues Grid */}
        {userLocation && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Nearby Fitness Venues
                <span className="block text-sm font-normal text-slate-600 mt-1">
                  {venues.length} venues found • Sorted by distance
                </span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <Card 
                  key={venue.id} 
                  className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden bg-white"
                  onClick={() => setSelectedVenue(venue)}
                >
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className={`bg-gradient-to-r ${getTierGradient(venue.tier)} text-white border-0 shadow-lg`}>
                          {venue.tier}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                          <div className="text-lg font-bold text-slate-900">
                            {getBlanePricing(venue)} DH
                          </div>
                        </div>
                      </div>
                      {venue.distance && (
                        <div className="absolute bottom-4 left-4 z-20">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                            <div className="text-sm font-semibold text-slate-900">
                              {venue.distance} km away
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                        🏋️‍♂️
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                          {venue.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {getStars(venue.rating)}
                          </div>
                          <span className="text-sm text-slate-600">({venue.reviews})</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {venue.description}
                      </p>

                      <div className="flex items-center text-slate-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {venue.address}
                      </div>

                      <div className="flex items-center text-slate-500 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {venue.openHours}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {venue.amenities.slice(0, 4).map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-1 bg-slate-100 rounded-lg px-2 py-1">
                            <span className="text-sm">{getAmenityIcon(amenity)}</span>
                          </div>
                        ))}
                        {venue.amenities.length > 4 && (
                          <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1">
                            <span className="text-xs text-slate-600">+{venue.amenities.length - 4} more</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/booking/${venue.id}`);
                        }}
                      >
                        Book Session • {getBlanePricing(venue)} DH
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueMapProfessional;

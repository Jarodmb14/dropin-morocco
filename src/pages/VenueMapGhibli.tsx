import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Navigation, Clock, Star, 
  Crosshair, Search, Check, ArrowLeft,
  Sparkles, Wind, Leaf
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

const VenueMapGhibli = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [addressInput, setAddressInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Elegant location database with Moroccan charm
  const locationDatabase: LocationSuggestion[] = [
    { id: 'casa-1', name: 'Four Seasons Casablanca', address: 'Anfa, Casablanca', latitude: 33.5920, longitude: -7.6266, city: 'Casablanca', type: 'hotel', icon: '🏛️', description: 'Oceanfront luxury' },
    { id: 'casa-2', name: 'Twin Center', address: 'Maarif, Casablanca', latitude: 33.5731, longitude: -7.5898, city: 'Casablanca', type: 'business', icon: '🌟', description: 'Business heart' },
    { id: 'casa-3', name: 'Hassan II Mosque', address: 'Casablanca Corniche', latitude: 33.6084, longitude: -7.6326, city: 'Casablanca', type: 'landmark', icon: '🕌', description: 'Architectural wonder' },
    { id: 'marr-1', name: 'La Mamounia', address: 'Hivernage, Marrakech', latitude: 31.6225, longitude: -7.9898, city: 'Marrakech', type: 'hotel', icon: '🏛️', description: 'Palace of dreams' },
    { id: 'marr-2', name: 'Jemaa el-Fnaa', address: 'Medina, Marrakech', latitude: 31.6260, longitude: -7.9890, city: 'Marrakech', type: 'landmark', icon: '✨', description: 'Storyteller\'s square' },
    { id: 'raba-1', name: 'Kasbah des Oudayas', address: 'Rabat Medina', latitude: 34.0142, longitude: -6.8325, city: 'Rabat', type: 'landmark', icon: '🏰', description: 'Ancient fortress' },
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
        name: 'Oasis Wellness',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Twin Center, Maarif',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['wellness', 'pool', 'sauna', 'garden', 'meditation', 'spa'],
        monthly_price: 600,
        rating: 4.8,
        reviews: 245,
        phone: '+212 522 123 456',
        email: 'hello@oasiswellness.ma',
        openHours: 'Dawn to dusk',
        description: 'A serene wellness sanctuary where ancient traditions meet modern mindfulness.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      },
      {
        id: '2',
        name: 'Atlas Movement',
        tier: 'STANDARD',
        city: 'Casablanca',
        address: 'Maarif Gardens',
        latitude: 33.5650,
        longitude: -7.6109,
        amenities: ['movement', 'dance', 'yoga', 'community', 'music'],
        monthly_price: 400,
        rating: 4.2,
        reviews: 128,
        phone: '+212 522 987 654',
        email: 'flow@atlasmovement.ma',
        openHours: 'Sunrise to sunset',
        description: 'Where movement becomes poetry and every step tells a story.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      },
      {
        id: '3',
        name: 'Riad Serenity Spa',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Palmeraie Gardens',
        latitude: 31.6295,
        longitude: -8.0089,
        amenities: ['hammam', 'massage', 'aromatherapy', 'gardens', 'meditation', 'tea'],
        monthly_price: 1200,
        rating: 4.9,
        reviews: 89,
        phone: '+212 524 456 789',
        email: 'peace@riadserenity.ma',
        openHours: 'Always welcoming',
        description: 'Where time slows down and your soul finds its rhythm among whispering palms.',
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
      setLocationError('Unable to sense your location. Please share your whereabouts.');
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

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'from-stone-400 to-stone-500 text-white';
      case 'STANDARD': return 'from-sky-400 to-blue-500 text-white';
      case 'PREMIUM': return 'from-amber-400 to-orange-500 text-white';
      case 'ULTRA_LUXE': return 'from-rose-400 to-pink-500 text-white';
      default: return 'from-stone-400 to-stone-500 text-white';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, string> = {
      wellness: '🌸',
      pool: '💧',
      sauna: '🔥',
      garden: '🌿',
      meditation: '🕯️',
      spa: '✨',
      movement: '🌊',
      dance: '💃',
      yoga: '🧘',
      community: '🤝',
      music: '🎵',
      hammam: '🛁',
      massage: '🙏',
      aromatherapy: '🌺',
      tea: '🍵',
      valet: '🌟',
    };
    return icons[amenity] || '💫';
  };

  const getStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-300 text-amber-300' : 'text-stone-200'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Ghibli-inspired floating patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-sky-200/20 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Subtle Moroccan geometric pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Elegant header with Moroccan-inspired design */}
      <div className="relative z-10 bg-white/70 backdrop-blur-md border-b border-amber-100/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-stone-600 hover:text-stone-900 hover:bg-amber-50/50 rounded-full p-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Wellness Journey
                </h1>
                <p className="text-sm text-stone-600 font-medium">Discover your perfect sanctuary</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-stone-500 font-medium">Morocco</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Ghibli-inspired location selection */}
        {!userLocation && (
          <div className="mb-8">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden relative">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }} />
              
              <CardContent className="p-10 relative">
                <div className="text-center mb-10">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Wind className="w-6 h-6 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-stone-800 mb-3">Where shall we begin?</h2>
                  <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
                    Let us sense where you are, or whisper the name of a place that calls to your heart
                  </p>
                </div>

                {/* Dreamy GPS button */}
                <div className="text-center mb-10">
                  <Button 
                    onClick={getUserLocation}
                    disabled={isGettingLocation}
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white px-10 py-6 h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                    {isGettingLocation ? (
                      <>
                        <Crosshair className="w-6 h-6 mr-3 animate-spin" />
                        Sensing your presence...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-6 h-6 mr-3" />
                        Feel My Location
                      </>
                    )}
                  </Button>
                  {locationError && (
                    <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                      {locationError}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center mb-10">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                  <div className="px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                    <span className="text-stone-600 text-sm font-medium flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      or share a place
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-stone-300 to-transparent"></div>
                </div>

                {/* Whimsical address search */}
                <div className="relative max-w-lg mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input
                      placeholder="Whisper a place... hotel, landmark, or address"
                      value={addressInput}
                      onChange={(e) => handleAddressInputChange(e.target.value)}
                      className="pl-12 pr-4 py-4 rounded-2xl border-stone-200 focus:border-amber-400 focus:ring-amber-400/30 bg-white/90 shadow-sm text-base backdrop-blur-sm"
                      onFocus={() => setShowSuggestions(addressInput.trim().length > 0)}
                    />
                  </div>
                  
                  {/* Magical suggestions */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-2xl z-50 mt-3 overflow-hidden">
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 flex items-center space-x-4 border-b border-stone-100 last:border-b-0"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          <div className="text-2xl">{suggestion.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-stone-800">{suggestion.name}</div>
                            <div className="text-sm text-amber-600 font-medium">{suggestion.description}</div>
                            <div className="text-xs text-stone-500">{suggestion.address}</div>
                          </div>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enchanted location display */}
        {userLocation && (
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 overflow-hidden relative">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15s6.716 15 15 15 15-6.716 15-15S23.284 0 15 0z' fill='%2310b981' fill-opacity='0.1'/%3E%3C/svg%3E")`,
                backgroundSize: '15px 15px'
              }} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-800 text-lg">{userLocation.name}</h3>
                      <p className="text-stone-600">{userLocation.address}</p>
                      <p className="text-emerald-600 text-sm font-medium flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" />
                        Your journey begins here
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setUserLocation(null)}
                    variant="outline"
                    size="sm"
                    className="border-stone-300 hover:bg-white/80 rounded-xl"
                  >
                    Change Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Magical venues grid */}
        {userLocation && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-stone-700 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Sanctuaries Near You
              </h2>
              <p className="text-stone-600 font-medium">
                {venues.length} wellness havens await • Sorted by whispered distance
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <Card 
                  key={venue.id} 
                  className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden bg-white/90 backdrop-blur-sm relative"
                  onClick={() => setSelectedVenue(venue)}
                >
                  {/* Subtle magic shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-amber-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-stone-200 via-amber-100 to-orange-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
                      
                      {/* Floating tier badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className={`bg-gradient-to-r ${getTierStyle(venue.tier)} border-0 shadow-lg rounded-full px-3 py-1`}>
                          {venue.tier.replace('_', ' ').toLowerCase()}
                        </Badge>
                      </div>
                      
                      {/* Dreamy price display */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
                          <div className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {getBlanePricing(venue)} DH
                          </div>
                        </div>
                      </div>
                      
                      {/* Distance with gentle styling */}
                      {venue.distance && (
                        <div className="absolute bottom-4 left-4 z-20">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-white/50">
                            <div className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                              <Wind className="w-3 h-3" />
                              {venue.distance} km away
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Peaceful illustration placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                        🌸
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl text-stone-800 group-hover:text-amber-600 transition-colors duration-300">
                        {venue.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          {getStars(venue.rating)}
                        </div>
                        <span className="text-sm text-stone-500">({venue.reviews} souls)</span>
                      </div>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed font-medium">
                      {venue.description}
                    </p>

                    <div className="flex items-center text-stone-500 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                      {venue.address}
                    </div>

                    <div className="flex items-center text-stone-500 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-amber-500" />
                      {venue.openHours}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-full px-3 py-1">
                          <span className="text-sm">{getAmenityIcon(amenity)}</span>
                        </div>
                      ))}
                      {venue.amenities.length > 4 && (
                        <div className="flex items-center bg-stone-100 rounded-full px-3 py-1">
                          <span className="text-xs text-stone-600">+{venue.amenities.length - 4} more</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3 font-medium relative overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/booking/${venue.id}`);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
                      Begin Journey • {getBlanePricing(venue)} DH
                    </Button>
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

export default VenueMapGhibli;

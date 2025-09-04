import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, Navigation, Hotel, Dumbbell, Clock, Star, Users, 
  Zap, Heart, Waves, Mountain, Phone, Mail, Navigation2,
  Crosshair, Search, Check
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
  type: 'hotel' | 'landmark' | 'district' | 'beach' | 'business' | 'transport' | 'shopping' | 'restaurant';
  icon: string;
  description: string;
}

const VenueMapAutocomplete = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [addressInput, setAddressInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Comprehensive Morocco locations database for autocomplete
  const locationDatabase: LocationSuggestion[] = [
    // Casablanca - Hotels
    { id: 'casa-1', name: 'Four Seasons Hotel Casablanca', address: 'Anfa Place, Casablanca', latitude: 33.5920, longitude: -7.6266, city: 'Casablanca', type: 'hotel', icon: '🏨', description: 'Luxury hotel in Anfa district' },
    { id: 'casa-2', name: 'Hyatt Regency Casablanca', address: 'Place des Nations Unies, Casablanca', latitude: 33.5731, longitude: -7.5898, city: 'Casablanca', type: 'hotel', icon: '🏨', description: 'Business hotel in city center' },
    { id: 'casa-3', name: 'Hotel Sofitel Casablanca', address: 'Tour Blanche, Casablanca', latitude: 33.5850, longitude: -7.6050, city: 'Casablanca', type: 'hotel', icon: '🏨', description: 'Premium hotel with ocean view' },
    
    // Casablanca - Landmarks & Districts
    { id: 'casa-4', name: 'Hassan II Mosque', address: 'Boulevard de la Corniche, Casablanca', latitude: 33.6084, longitude: -7.6326, city: 'Casablanca', type: 'landmark', icon: '🕌', description: 'Famous mosque by the ocean' },
    { id: 'casa-5', name: 'Twin Center', address: 'Boulevard Zerktouni, Casablanca', latitude: 33.5731, longitude: -7.5898, city: 'Casablanca', type: 'business', icon: '🏢', description: 'Major business district' },
    { id: 'casa-6', name: 'Maarif District', address: 'Boulevard Ghandi, Casablanca', latitude: 33.5650, longitude: -7.6109, city: 'Casablanca', type: 'district', icon: '🏘️', description: 'Residential and shopping area' },
    { id: 'casa-7', name: 'Ain Diab Corniche', address: 'Corniche Ain Diab, Casablanca', latitude: 33.5889, longitude: -7.6114, city: 'Casablanca', type: 'beach', icon: '🏖️', description: 'Beach promenade with cafes' },
    { id: 'casa-8', name: 'Morocco Mall', address: 'Boulevard de l\'Océan Atlantique, Casablanca', latitude: 33.5650, longitude: -7.6709, city: 'Casablanca', type: 'shopping', icon: '🛍️', description: 'Largest shopping mall in Africa' },
    { id: 'casa-9', name: 'Casa Port Train Station', address: 'Boulevard Mohamed V, Casablanca', latitude: 33.5970, longitude: -7.6158, city: 'Casablanca', type: 'transport', icon: '🚂', description: 'Main train station' },
    { id: 'casa-10', name: 'Old Medina Casablanca', address: 'Medina, Casablanca', latitude: 33.5889, longitude: -7.6114, city: 'Casablanca', type: 'landmark', icon: '🏛️', description: 'Historic old city' },

    // Marrakech - Hotels
    { id: 'marr-1', name: 'La Mamounia', address: 'Avenue Bab Jdid, Marrakech', latitude: 31.6225, longitude: -7.9898, city: 'Marrakech', type: 'hotel', icon: '🏨', description: 'Legendary palace hotel' },
    { id: 'marr-2', name: 'Hotel Selman Marrakech', address: 'Rue du Temple, Marrakech', latitude: 31.6295, longitude: -8.0089, city: 'Marrakech', type: 'hotel', icon: '🏨', description: 'Luxury resort with Arabian horses' },
    { id: 'marr-3', name: 'Riad Yasmine', address: 'Medina, Marrakech', latitude: 31.6260, longitude: -7.9890, city: 'Marrakech', type: 'hotel', icon: '🏛️', description: 'Traditional riad in medina' },
    
    // Marrakech - Landmarks & Districts
    { id: 'marr-4', name: 'Jemaa el-Fnaa', address: 'Medina, Marrakech', latitude: 31.6260, longitude: -7.9890, city: 'Marrakech', type: 'landmark', icon: '🕌', description: 'Famous main square' },
    { id: 'marr-5', name: 'Gueliz District', address: 'Avenue Mohammed V, Marrakech', latitude: 31.6340, longitude: -7.9998, city: 'Marrakech', type: 'district', icon: '🏘️', description: 'Modern commercial district' },
    { id: 'marr-6', name: 'Hivernage', address: 'Avenue Mohammed VI, Marrakech', latitude: 31.6295, longitude: -8.0089, city: 'Marrakech', type: 'district', icon: '🏘️', description: 'Upscale hotel zone' },
    { id: 'marr-7', name: 'Majorelle Garden', address: 'Rue Yves Saint Laurent, Marrakech', latitude: 31.6418, longitude: -8.0034, city: 'Marrakech', type: 'landmark', icon: '🌺', description: 'Beautiful botanical garden' },
    { id: 'marr-8', name: 'Marrakech Airport', address: 'Menara Airport, Marrakech', latitude: 31.6069, longitude: -8.0363, city: 'Marrakech', type: 'transport', icon: '✈️', description: 'International airport' },

    // Rabat - Hotels & Landmarks
    { id: 'raba-1', name: 'Sofitel Rabat Jardin des Roses', address: 'Souissi, Rabat', latitude: 34.0209, longitude: -6.8416, city: 'Rabat', type: 'hotel', icon: '🏨', description: 'Luxury hotel in diplomatic area' },
    { id: 'raba-2', name: 'Hotel La Tour Hassan', address: 'Avenue Chellah, Rabat', latitude: 34.0142, longitude: -6.8325, city: 'Rabat', type: 'hotel', icon: '🏨', description: 'Historic palace hotel' },
    { id: 'raba-3', name: 'Kasbah des Oudayas', address: 'Old Medina, Rabat', latitude: 34.0142, longitude: -6.8325, city: 'Rabat', type: 'landmark', icon: '🏛️', description: 'UNESCO World Heritage site' },
    { id: 'raba-4', name: 'Agdal District', address: 'Avenue des Nations Unies, Rabat', latitude: 33.9716, longitude: -6.8498, city: 'Rabat', type: 'district', icon: '🏘️', description: 'Modern residential area' },
    { id: 'raba-5', name: 'Rabat Ville Train Station', address: 'Avenue Mohamed V, Rabat', latitude: 34.0181, longitude: -6.8341, city: 'Rabat', type: 'transport', icon: '🚂', description: 'Main train station' },

    // Tangier - Hotels & Landmarks
    { id: 'tang-1', name: 'Hilton Garden Inn Tanger', address: 'City Center, Tangier', latitude: 35.7392, longitude: -5.9009, city: 'Tangier', type: 'hotel', icon: '🏨', description: 'Modern business hotel' },
    { id: 'tang-2', name: 'Hotel Continental', address: 'Dar Baroud, Old Medina, Tangier', latitude: 35.7595, longitude: -5.8340, city: 'Tangier', type: 'hotel', icon: '🏨', description: 'Historic hotel in medina' },
    { id: 'tang-3', name: 'Medina Tangier', address: 'Rue de la Liberté, Tangier', latitude: 35.7595, longitude: -5.8340, city: 'Tangier', type: 'landmark', icon: '🏛️', description: 'Historic quarter' },
    { id: 'tang-4', name: 'Malabata Beach', address: 'Malabata, Tangier', latitude: 35.7450, longitude: -5.8200, city: 'Tangier', type: 'beach', icon: '🏖️', description: 'Popular beach area' },
    { id: 'tang-5', name: 'Tangier Ibn Battouta Airport', address: 'Boukhalef, Tangier', latitude: 35.7269, longitude: -5.9170, city: 'Tangier', type: 'transport', icon: '✈️', description: 'International airport' },

    // Popular Chains & Common Locations
    { id: 'chain-1', name: 'Ibis Hotels Morocco', address: 'Multiple locations', latitude: 33.5731, longitude: -7.5898, city: 'Multiple', type: 'hotel', icon: '🏨', description: 'Budget hotel chain' },
    { id: 'chain-2', name: 'Accor Hotels Morocco', address: 'Multiple locations', latitude: 33.5731, longitude: -7.5898, city: 'Multiple', type: 'hotel', icon: '🏨', description: 'International hotel group' },
    { id: 'chain-3', name: 'McDonald\'s Morocco', address: 'Multiple locations', latitude: 33.5731, longitude: -7.5898, city: 'Multiple', type: 'restaurant', icon: '🍔', description: 'Fast food chain' },
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
        name: 'FitZone Casablanca Premium',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Twin Center, Boulevard Zerktouni',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['cardio', 'weights', 'group_classes', 'pool', 'sauna', 'personal_training'],
        monthly_price: 600,
        rating: 4.8,
        reviews: 245,
        phone: '+212 522 123 456',
        email: 'info@fitzone-casa.ma',
        openHours: '6:00 AM - 11:00 PM',
        description: 'Modern fitness center in the heart of Casablanca with state-of-the-art equipment.',
      },
      {
        id: '2',
        name: 'Ocean Fitness Maarif',
        tier: 'STANDARD',
        city: 'Casablanca',
        address: 'Boulevard Ghandi, Maarif',
        latitude: 33.5650,
        longitude: -7.6109,
        amenities: ['cardio', 'weights', 'group_classes'],
        monthly_price: 400,
        rating: 4.2,
        reviews: 128,
        phone: '+212 522 987 654',
        email: 'contact@oceanfitness.ma',
        openHours: '7:00 AM - 10:00 PM',
        description: 'Affordable fitness center with friendly atmosphere and modern equipment.',
      },
      {
        id: '3',
        name: 'Atlas Luxury Spa & Fitness',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Hivernage District, Avenue Mohammed VI',
        latitude: 31.6295,
        longitude: -8.0089,
        amenities: ['spa', 'pool', 'sauna', 'massage', 'yoga', 'wellness', 'hammam'],
        monthly_price: 1200,
        rating: 4.9,
        reviews: 89,
        phone: '+212 524 456 789',
        email: 'reservation@atlasspa.ma',
        openHours: '6:00 AM - 12:00 AM',
        description: 'Exclusive wellness center combining traditional Moroccan spa treatments with modern fitness.',
      },
      {
        id: '4',
        name: 'Royal Fitness Agdal',
        tier: 'PREMIUM',
        city: 'Rabat',
        address: 'Avenue des Nations Unies, Agdal',
        latitude: 33.9716,
        longitude: -6.8498,
        amenities: ['cardio', 'weights', 'pool', 'tennis', 'squash'],
        monthly_price: 550,
        rating: 4.6,
        reviews: 156,
        phone: '+212 537 654 321',
        email: 'info@royalfitness.ma',
        openHours: '6:30 AM - 10:30 PM',
        description: 'Premium fitness club with tennis and squash courts, popular among professionals.',
      },
      {
        id: '5',
        name: 'Medina Basic Gym',
        tier: 'BASIC',
        city: 'Tangier',
        address: 'Rue de la Liberté, Medina',
        latitude: 35.7595,
        longitude: -5.8340,
        amenities: ['cardio', 'weights'],
        monthly_price: 250,
        rating: 4.0,
        reviews: 67,
        phone: '+212 539 123 789',
        email: 'medina.gym@email.ma',
        openHours: '8:00 AM - 9:00 PM',
        description: 'Simple, no-frills gym in the historic medina with basic equipment.',
      },
      {
        id: '6',
        name: 'Marina Bay Fitness Club',
        tier: 'PREMIUM',
        city: 'Tangier',
        address: 'Marina Bay, New Town',
        latitude: 35.7392,
        longitude: -5.9009,
        amenities: ['cardio', 'weights', 'pool', 'marina_view', 'cafe'],
        monthly_price: 650,
        rating: 4.7,
        reviews: 198,
        phone: '+212 539 876 543',
        email: 'info@marinabay.ma',
        openHours: '6:00 AM - 11:00 PM',
        description: 'Stunning fitness club with panoramic marina views and rooftop pool.',
      },
    ];
    
    setVenues(venuesWithDetails);
  };

  // Smart address autocomplete filtering
  const filteredSuggestions = useMemo(() => {
    if (!addressInput.trim()) return [];
    
    const query = addressInput.toLowerCase();
    return locationDatabase
      .filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query)
      )
      .slice(0, 8) // Limit to 8 suggestions
      .sort((a, b) => {
        // Prioritize exact name matches, then address matches
        const aNameMatch = a.name.toLowerCase().startsWith(query);
        const bNameMatch = b.name.toLowerCase().startsWith(query);
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });
  }, [addressInput]);

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
      setLocationError('Unable to get your location. Please enter your address manually.');
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

  const handleCustomAddress = () => {
    if (!addressInput.trim()) return;
    
    // Use the first suggestion if available, or create a generic location
    const suggestion = filteredSuggestions[0];
    if (suggestion) {
      selectSuggestion(suggestion);
    } else {
      // Fallback to a default coordinate
      setUserLocation({
        latitude: 33.5731,
        longitude: -7.5898,
        name: addressInput,
        address: addressInput
      });
      setAddressInput('');
      setShowSuggestions(false);
    }
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

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      cardio: Heart,
      weights: Dumbbell,
      pool: Waves,
      group_classes: Users,
      sauna: Zap,
      spa: Star,
      yoga: Mountain,
      tennis: '🎾',
      squash: '🏓',
      massage: '💆',
      hammam: '🛁',
      personal_training: '👨‍💼',
      wellness: '🧘',
      marina_view: '🌊',
      cafe: '☕',
    };
    const IconComponent = icons[amenity];
    return IconComponent && typeof IconComponent !== 'string' ? 
      <IconComponent className="w-4 h-4" /> : 
      <span>{IconComponent || '✨'}</span>;
  };

  const formatAmenity = (amenity: string) => {
    return amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '✨' : '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🗺️ Find Gyms Near You
              </h1>
              <p className="text-gray-600 mt-1">Smart address autocomplete to find nearby gyms</p>
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
        {/* Location Input with Autocomplete */}
        {!userLocation && (
          <Card className="mb-6 border-orange-200">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Set Your Location</h3>
                <p className="text-gray-600">
                  Use GPS or type your address with smart autocomplete
                </p>
              </div>

              {/* GPS Button */}
              <div className="text-center mb-6">
                <Button 
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  size="lg"
                >
                  {isGettingLocation ? (
                    <>
                      <Crosshair className="w-5 h-5 mr-2 animate-spin" />
                      Getting Your Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 mr-2" />
                      Use My Current Location
                    </>
                  )}
                </Button>
                {locationError && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {locationError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="text-center text-gray-500 mb-6">OR</div>

              {/* Smart Address Input with Autocomplete */}
              <div className="space-y-4 relative">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    🔍 Smart Address Search
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type hotel, landmark, or address in Morocco..."
                        value={addressInput}
                        onChange={(e) => handleAddressInputChange(e.target.value)}
                        className="border-orange-200"
                        onKeyPress={(e) => e.key === 'Enter' && handleCustomAddress()}
                        onFocus={() => setShowSuggestions(addressInput.trim().length > 0)}
                      />
                      
                      {/* Autocomplete Suggestions */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-orange-200 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
                          {filteredSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              className="w-full text-left p-3 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                              onClick={() => selectSuggestion(suggestion)}
                            >
                              <span className="text-xl">{suggestion.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{suggestion.name}</div>
                                <div className="text-sm text-gray-600">{suggestion.address}</div>
                                <div className="text-xs text-orange-600">{suggestion.description}</div>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {suggestion.city}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleCustomAddress}
                      disabled={!addressInput.trim()}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {addressInput.trim() && filteredSuggestions.length === 0 && (
                    <div className="text-sm text-gray-500 mt-2">
                      💡 Try typing: "Four Seasons", "Jemaa el-Fnaa", "Twin Center", "Marrakech Airport"
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Location Display */}
        {userLocation && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                      {userLocation.name}
                      <Check className="w-4 h-4 text-green-600" />
                    </h3>
                    <p className="text-sm text-orange-700">{userLocation.address}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setUserLocation(null)}
                  className="border-orange-200 text-orange-600"
                >
                  Change Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map and Venues */}
        {userLocation && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[500px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-blue-300 relative overflow-hidden">
                    {/* Morocco Background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl opacity-10">🇲🇦</div>
                    </div>
                    
                    {/* User Location Marker */}
                    <div 
                      className="absolute w-10 h-10 bg-orange-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold animate-pulse"
                      style={{
                        left: `${((userLocation.longitude + 10) / 15) * 100}%`,
                        top: `${((-userLocation.latitude + 36) / 10) * 100}%`,
                      }}
                      title={userLocation.name}
                    >
                      📍
                    </div>

                    {/* Venue Markers */}
                    {venues.slice(0, 10).map((venue) => (
                      <div
                        key={venue.id}
                        className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                        style={{
                          left: `${((venue.longitude + 10) / 15) * 100}%`,
                          top: `${((-venue.latitude + 36) / 10) * 100}%`,
                        }}
                        onClick={() => setSelectedVenue(venue)}
                      >
                        {/* Price Card */}
                        <div className={`bg-white rounded-full px-3 py-1 shadow-lg border-2 border-white hover:shadow-xl transition-shadow ${
                          selectedVenue?.id === venue.id ? 'ring-2 ring-orange-400 bg-orange-50' : ''
                        }`}>
                          <div className="text-sm font-bold text-gray-800">
                            {getBlanePricing(venue)} DH
                          </div>
                        </div>
                        
                        {/* Distance indicator */}
                        {venue.distance && (
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                            {venue.distance}km
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Venue List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800">Nearby Gyms</h2>
              {venues.slice(0, 10).map((venue) => (
                <Card 
                  key={venue.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedVenue?.id === venue.id ? 'ring-2 ring-orange-400 bg-orange-50' : ''
                  }`}
                  onClick={() => setSelectedVenue(venue)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{venue.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span>{getStars(venue.rating)}</span>
                          <span>({venue.reviews})</span>
                        </div>
                      </div>
                      <Badge className={getTierColor(venue.tier)} style={{ fontSize: '10px' }}>
                        {venue.tier}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {getBlanePricing(venue)} DH
                        </div>
                        <div className="text-xs text-gray-500">per visit</div>
                      </div>
                      {venue.distance && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">
                            {venue.distance} km
                          </div>
                          <div className="text-xs text-gray-500">away</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected Venue Details */}
        {selectedVenue && userLocation && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-orange-600" />
                {selectedVenue.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4" />
                      {selectedVenue.address}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{getStars(selectedVenue.rating)}</span>
                      <span className="text-sm text-gray-600">({selectedVenue.reviews} reviews)</span>
                    </div>
                    {selectedVenue.distance && (
                      <p className="text-orange-600 font-medium">
                        📍 {selectedVenue.distance} km from {userLocation.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {getBlanePricing(selectedVenue)} DHS
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-orange-600 to-red-600"
                      onClick={() => navigate(`/booking/${selectedVenue.id}`)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700">{selectedVenue.description}</p>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedVenue.amenities.slice(0, 6).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {getAmenityIcon(amenity)}
                        {formatAmenity(amenity)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedVenue.phone}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {selectedVenue.openHours}
                    </div>
                  </div>
                </div>

                {/* Distance Alert */}
                {selectedVenue.distance && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Navigation2 className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      <strong>{selectedVenue.distance} km</strong> from {userLocation.name}
                      {selectedVenue.distance < 2 && ' - Walking distance!'} 
                      {selectedVenue.distance >= 2 && selectedVenue.distance < 5 && ' - Short drive or bike ride'} 
                      {selectedVenue.distance >= 5 && ' - Best to drive or take transport'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VenueMapAutocomplete;

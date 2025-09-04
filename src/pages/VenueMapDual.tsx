import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, Navigation, Hotel, Dumbbell, Clock, Star, Users, 
  Zap, Heart, Waves, Mountain, Phone, Mail, Navigation2,
  MapPinIcon, Crosshair, Globe, Plane
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
  type: 'gps' | 'accommodation';
}

interface Accommodation {
  name: string;
  type: 'hotel' | 'hostel' | 'riad' | 'apartment' | 'airbnb';
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

const VenueMapDual = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [userType, setUserType] = useState<'local' | 'tourist' | null>(null);
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [accommodationSearch, setAccommodationSearch] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Popular accommodations for tourists
  const popularAccommodations: Record<string, Accommodation[]> = {
    'Casablanca': [
      { name: 'Four Seasons Hotel Casablanca', type: 'hotel', latitude: 33.5920, longitude: -7.6266, address: 'Anfa Place', city: 'Casablanca' },
      { name: 'Hyatt Regency Casablanca', type: 'hotel', latitude: 33.5731, longitude: -7.5898, address: 'Place des Nations Unies', city: 'Casablanca' },
      { name: 'Youth Hostel Casablanca', type: 'hostel', latitude: 33.5650, longitude: -7.6109, address: 'Maarif District', city: 'Casablanca' },
      { name: 'Casablanca Airbnb - Marina', type: 'airbnb', latitude: 33.5889, longitude: -7.6114, address: 'Ain Diab Corniche', city: 'Casablanca' },
      { name: 'Riad Casa Hassan', type: 'riad', latitude: 33.5850, longitude: -7.6050, address: 'Old Medina', city: 'Casablanca' },
    ],
    'Marrakech': [
      { name: 'La Mamounia', type: 'hotel', latitude: 31.6225, longitude: -7.9898, address: 'Avenue Bab Jdid', city: 'Marrakech' },
      { name: 'Riad Yasmine', type: 'riad', latitude: 31.6295, longitude: -8.0089, address: 'Medina', city: 'Marrakech' },
      { name: 'Equity Point Marrakech', type: 'hostel', latitude: 31.6340, longitude: -7.9998, address: 'Gueliz', city: 'Marrakech' },
      { name: 'Airbnb Jemaa el-Fnaa View', type: 'airbnb', latitude: 31.6260, longitude: -7.9890, address: 'Near Jemaa el-Fnaa', city: 'Marrakech' },
    ],
    'Rabat': [
      { name: 'Sofitel Rabat Jardin des Roses', type: 'hotel', latitude: 34.0209, longitude: -6.8416, address: 'Souissi', city: 'Rabat' },
      { name: 'Riad Kalaa', type: 'riad', latitude: 34.0142, longitude: -6.8325, address: 'Kasbah des Oudayas', city: 'Rabat' },
      { name: 'Hostel Rabat Center', type: 'hostel', latitude: 33.9716, longitude: -6.8498, address: 'Agdal', city: 'Rabat' },
      { name: 'Modern Airbnb Agdal', type: 'airbnb', latitude: 33.9750, longitude: -6.8480, address: 'Agdal District', city: 'Rabat' },
    ],
    'Tangier': [
      { name: 'Hotel Continental', type: 'hotel', latitude: 35.7595, longitude: -5.8340, address: 'Old Medina', city: 'Tangier' },
      { name: 'Hilton Garden Inn Tanger', type: 'hotel', latitude: 35.7392, longitude: -5.9009, address: 'City Center', city: 'Tangier' },
      { name: 'Tingis Hostel', type: 'hostel', latitude: 35.7667, longitude: -5.8000, address: 'Kasbah', city: 'Tangier' },
      { name: 'Beachfront Airbnb', type: 'airbnb', latitude: 35.7450, longitude: -5.8200, address: 'Malabata Beach', city: 'Tangier' },
    ],
  };

  useEffect(() => {
    loadVenuesWithDetails();
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Calculate distances when user location is set
      const venuesWithDistance = venues.map(venue => ({
        ...venue,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.latitude,
          venue.longitude
        )
      }));
      
      // Sort by distance
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
        type: 'gps'
      });

    } catch (error) {
      setLocationError('Unable to get your location. Please try again or select your city manually.');
      console.error('Geolocation error:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const selectAccommodation = (accommodation: Accommodation) => {
    setUserLocation({
      latitude: accommodation.latitude,
      longitude: accommodation.longitude,
      name: accommodation.name,
      type: 'accommodation'
    });
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

  const getAccommodationIcon = (type: string) => {
    const icons = {
      hotel: '🏨',
      hostel: '🏠',
      riad: '🏛️',
      apartment: '🏢',
      airbnb: '🏡',
    };
    return icons[type as keyof typeof icons] || '📍';
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

  const filteredVenues = venues.filter(venue => {
    if (!userLocation) return true;
    // Show venues from all cities but prioritize those in the same city as user
    return true;
  });

  // User Type Selection Screen
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto m-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              🏋️‍♂️ Find Your Perfect Gym
            </CardTitle>
            <p className="text-gray-600">Choose how you'd like to find gyms near you</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Local User Option */}
            <Card 
              className="cursor-pointer border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all p-6"
              onClick={() => setUserType('local')}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">📍</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-orange-600" />
                    I'm a Local
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Use GPS to find gyms near my current location
                  </p>
                  <div className="text-sm text-orange-600 mt-2 font-medium">
                    ✨ Perfect for Moroccans looking for nearby gyms
                  </div>
                </div>
                <Navigation className="w-6 h-6 text-orange-600" />
              </div>
            </Card>

            {/* Tourist Option */}
            <Card 
              className="cursor-pointer border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all p-6"
              onClick={() => setUserType('tourist')}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏨</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-orange-600" />
                    I'm a Tourist
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Plan ahead - find gyms near my hotel, hostel, or Airbnb
                  </p>
                  <div className="text-sm text-orange-600 mt-2 font-medium">
                    ✨ Perfect for travelers planning their stay in Morocco
                  </div>
                </div>
                <Hotel className="w-6 h-6 text-orange-600" />
              </div>
            </Card>

            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-orange-200 text-orange-600"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
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
                {userType === 'local' ? '📍 Nearby Gyms' : '🏨 Gyms Near Your Stay'}
              </h1>
              <p className="text-gray-600 mt-1">
                {userType === 'local' ? 'Find gyms near your current location' : 'Find gyms near your accommodation in Morocco'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setUserType(null)}
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600"
              >
                Change Mode
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                ← Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Location Setup */}
        {!userLocation && (
          <Card className="mb-6 border-orange-200">
            <CardContent className="p-6">
              {userType === 'local' ? (
                // GPS Location for Locals
                <div className="text-center">
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Your Location</h3>
                  <p className="text-gray-600 mb-4">
                    We'll use GPS to find gyms near you
                  </p>
                  <Button 
                    onClick={getUserLocation}
                    disabled={isGettingLocation}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    {isGettingLocation ? (
                      <>
                        <Crosshair className="w-4 h-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
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
              ) : (
                // Accommodation Selection for Tourists
                <div>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">🏨</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Where are you staying?</h3>
                    <p className="text-gray-600">
                      Select your accommodation to find nearby gyms
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* City Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="border-orange-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casablanca">🏙️ Casablanca</SelectItem>
                          <SelectItem value="Marrakech">🕌 Marrakech</SelectItem>
                          <SelectItem value="Rabat">🏛️ Rabat</SelectItem>
                          <SelectItem value="Tangier">⛵ Tangier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Popular Accommodations */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Popular accommodations in {selectedCity}
                      </label>
                      <div className="grid gap-2 max-h-60 overflow-y-auto">
                        {popularAccommodations[selectedCity]?.map((accommodation, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start h-auto p-3 text-left border-orange-200 hover:bg-orange-50"
                            onClick={() => selectAccommodation(accommodation)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{getAccommodationIcon(accommodation.type)}</span>
                              <div>
                                <div className="font-medium">{accommodation.name}</div>
                                <div className="text-xs text-gray-500">{accommodation.address}</div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Accommodation */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Or enter your accommodation name
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Hotel/hostel/Airbnb name..."
                          value={accommodationSearch}
                          onChange={(e) => setAccommodationSearch(e.target.value)}
                          className="border-orange-200"
                        />
                        <Button 
                          disabled={!accommodationSearch}
                          onClick={() => {
                            // Use first accommodation as template with custom name
                            const template = popularAccommodations[selectedCity]?.[0];
                            if (template) {
                              selectAccommodation({
                                ...template,
                                name: accommodationSearch,
                              });
                              setAccommodationSearch('');
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Set
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Location Display */}
        {userLocation && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {userLocation.type === 'gps' ? '📍' : '🏨'}
                  </span>
                  <div>
                    <h3 className="font-semibold text-orange-800">{userLocation.name}</h3>
                    <p className="text-sm text-orange-700">
                      {userLocation.type === 'gps' ? 'Your current location' : 'Your accommodation'}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setUserLocation(null)}
                  className="border-orange-200 text-orange-600"
                >
                  Change
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
                      {userLocation.type === 'gps' ? '📍' : '🏨'}
                    </div>

                    {/* Venue Markers with Airbnb-style Pricing */}
                    {filteredVenues.slice(0, 10).map((venue) => (
                      <div
                        key={venue.id}
                        className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                        style={{
                          left: `${((venue.longitude + 10) / 15) * 100}%`,
                          top: `${((-venue.latitude + 36) / 10) * 100}%`,
                        }}
                        onClick={() => setSelectedVenue(venue)}
                      >
                        {/* Airbnb-style Price Card */}
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
              <h2 className="text-lg font-semibold text-gray-800">
                {userLocation.type === 'gps' ? 'Nearby Gyms' : 'Gyms Near Your Stay'}
              </h2>
              {filteredVenues.slice(0, 10).map((venue) => (
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
                          <div className="text-xs text-gray-500">
                            {userLocation.type === 'gps' ? 'from you' : 'from your stay'}
                          </div>
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
                        📍 {selectedVenue.distance} km {userLocation.type === 'gps' ? 'from your location' : `from ${userLocation.name}`}
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
                      <strong>{selectedVenue.distance} km</strong> {userLocation.type === 'gps' ? 'from your current location' : `from ${userLocation.name}`} 
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

export default VenueMapDual;

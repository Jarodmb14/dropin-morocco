import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, Navigation, Hotel, Dumbbell, Clock, Star, Users, 
  Zap, Heart, Waves, Mountain, X, Navigation2, Phone, Mail
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
  images: string[];
  distance?: number;
}

interface Accommodation {
  name: string;
  type: 'hotel' | 'hostel' | 'riad' | 'apartment';
  latitude: number;
  longitude: number;
  address: string;
}

const VenueMapAirbnb = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userAccommodation, setUserAccommodation] = useState<Accommodation | null>(null);
  const [showAccommodationPicker, setShowAccommodationPicker] = useState(false);
  const [customAccommodation, setCustomAccommodation] = useState('');
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [priceFilter, setPriceFilter] = useState('');

  // Popular accommodations in Morocco for tourists
  const popularAccommodations: Record<string, Accommodation[]> = {
    'Casablanca': [
      { name: 'Four Seasons Hotel Casablanca', type: 'hotel', latitude: 33.5920, longitude: -7.6266, address: 'Anfa Place' },
      { name: 'Hyatt Regency Casablanca', type: 'hotel', latitude: 33.5731, longitude: -7.5898, address: 'Place des Nations Unies' },
      { name: 'Youth Hostel Casablanca', type: 'hostel', latitude: 33.5650, longitude: -7.6109, address: 'Maarif District' },
      { name: 'Riad Casablanca', type: 'riad', latitude: 33.5889, longitude: -7.6114, address: 'Old Medina' },
    ],
    'Marrakech': [
      { name: 'La Mamounia', type: 'hotel', latitude: 31.6225, longitude: -7.9898, address: 'Avenue Bab Jdid' },
      { name: 'Riad Yasmine', type: 'riad', latitude: 31.6295, longitude: -8.0089, address: 'Medina' },
      { name: 'Equity Point Marrakech', type: 'hostel', latitude: 31.6340, longitude: -7.9998, address: 'Gueliz' },
    ],
    'Rabat': [
      { name: 'Sofitel Rabat Jardin des Roses', type: 'hotel', latitude: 34.0209, longitude: -6.8416, address: 'Souissi' },
      { name: 'Riad Kalaa', type: 'riad', latitude: 34.0142, longitude: -6.8325, address: 'Kasbah des Oudayas' },
      { name: 'Hostel Rabat Center', type: 'hostel', latitude: 33.9716, longitude: -6.8498, address: 'Agdal' },
    ],
    'Tangier': [
      { name: 'Hotel Continental', type: 'hotel', latitude: 35.7595, longitude: -5.8340, address: 'Old Medina' },
      { name: 'Hilton Garden Inn Tanger', type: 'hotel', latitude: 35.7392, longitude: -5.9009, address: 'City Center' },
      { name: 'Tingis Hostel', type: 'hostel', latitude: 35.7667, longitude: -5.8000, address: 'Kasbah' },
    ],
  };

  useEffect(() => {
    loadVenuesWithDetails();
  }, []);

  useEffect(() => {
    if (userAccommodation) {
      // Calculate distances when accommodation is set
      const venuesWithDistance = venues.map(venue => ({
        ...venue,
        distance: calculateDistance(
          userAccommodation.latitude,
          userAccommodation.longitude,
          venue.latitude,
          venue.longitude
        )
      }));
      
      // Sort by distance
      venuesWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      setVenues(venuesWithDistance);
    }
  }, [userAccommodation]);

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
        description: 'Modern fitness center in the heart of Casablanca with state-of-the-art equipment and professional trainers.',
        images: ['gym1.jpg', 'gym2.jpg', 'pool.jpg'],
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
        images: ['gym3.jpg'],
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
        description: 'Exclusive wellness center combining traditional Moroccan spa treatments with modern fitness facilities.',
        images: ['spa1.jpg', 'spa2.jpg'],
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
        description: 'Premium fitness club with tennis and squash courts, popular among diplomats and professionals.',
        images: ['royal1.jpg'],
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
        description: 'Simple, no-frills gym in the historic medina with basic equipment and affordable prices.',
        images: ['basic1.jpg'],
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
        images: ['marina1.jpg', 'marina2.jpg'],
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

  const getAccommodationIcon = (type: string) => {
    const icons = {
      hotel: '🏨',
      hostel: '🏠',
      riad: '🏛️',
      apartment: '🏢',
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const formatAmenity = (amenity: string) => {
    return amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '✨' : '');
  };

  const filteredVenues = venues.filter(venue => {
    if (selectedCity && venue.city !== selectedCity) return false;
    if (priceFilter) {
      const price = getBlanePricing(venue);
      switch (priceFilter) {
        case 'budget': return price <= 50;
        case 'standard': return price > 50 && price <= 120;
        case 'premium': return price > 120;
        default: return true;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🗺️ Find Gyms Near Your Stay
              </h1>
              <p className="text-gray-600 mt-1">Perfect for tourists and travelers in Morocco</p>
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
        {/* Accommodation Picker */}
        {!userAccommodation && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Hotel className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-orange-800">
                  <strong>Visiting Morocco?</strong> Set your hotel/hostel location to find nearby gyms with distances and directions.
                </span>
                <Button 
                  size="sm" 
                  onClick={() => setShowAccommodationPicker(true)}
                  className="ml-4 bg-orange-600 hover:bg-orange-700"
                >
                  🏨 Set Your Location
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {userAccommodation && (
          <Card className="mb-6 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getAccommodationIcon(userAccommodation.type)}</span>
                  <div>
                    <h3 className="font-semibold text-orange-800">{userAccommodation.name}</h3>
                    <p className="text-sm text-gray-600">{userAccommodation.address}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowAccommodationPicker(true)}
                  className="border-orange-200 text-orange-600"
                >
                  Change Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casablanca">Casablanca</SelectItem>
                    <SelectItem value="Marrakech">Marrakech</SelectItem>
                    <SelectItem value="Rabat">Rabat</SelectItem>
                    <SelectItem value="Tangier">Tangier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All prices</SelectItem>
                    <SelectItem value="budget">Budget (≤50 DHS)</SelectItem>
                    <SelectItem value="standard">Standard (51-120 DHS)</SelectItem>
                    <SelectItem value="premium">Premium (120+ DHS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSelectedCity('');
                    setPriceFilter('');
                  }}
                  variant="outline"
                  className="w-full border-orange-200 text-orange-600"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Airbnb-style Map */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="h-[600px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-blue-300 relative overflow-hidden">
                  {/* Morocco Background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-10">🇲🇦</div>
                  </div>
                  
                  {/* User Accommodation */}
                  {userAccommodation && (
                    <div 
                      className="absolute w-8 h-8 bg-orange-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold animate-pulse"
                      style={{
                        left: `${((userAccommodation.longitude + 10) / 15) * 100}%`,
                        top: `${((-userAccommodation.latitude + 36) / 10) * 100}%`,
                      }}
                      title={userAccommodation.name}
                    >
                      🏨
                    </div>
                  )}

                  {/* Venue Markers with Pricing */}
                  {filteredVenues.map((venue) => (
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
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredVenues.map((venue) => (
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
                        <div className="text-xs text-gray-500">from your stay</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Accommodation Picker Dialog */}
      <Dialog open={showAccommodationPicker} onOpenChange={setShowAccommodationPicker}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-orange-600" />
              Where are you staying?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* City Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select your city</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casablanca">Casablanca</SelectItem>
                  <SelectItem value="Marrakech">Marrakech</SelectItem>
                  <SelectItem value="Rabat">Rabat</SelectItem>
                  <SelectItem value="Tangier">Tangier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Popular Accommodations */}
            <div>
              <label className="text-sm font-medium mb-2 block">Popular hotels & hostels in {selectedCity}</label>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {popularAccommodations[selectedCity]?.map((accommodation, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => {
                      setUserAccommodation(accommodation);
                      setShowAccommodationPicker(false);
                    }}
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

            {/* Custom Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Or enter your accommodation name</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Hotel/hostel name or address..."
                  value={customAccommodation}
                  onChange={(e) => setCustomAccommodation(e.target.value)}
                />
                <Button 
                  disabled={!customAccommodation}
                  onClick={() => {
                    // For demo, use the first accommodation in the city
                    const defaultAccommodation = popularAccommodations[selectedCity]?.[0];
                    if (defaultAccommodation) {
                      setUserAccommodation({
                        ...defaultAccommodation,
                        name: customAccommodation,
                      });
                      setShowAccommodationPicker(false);
                      setCustomAccommodation('');
                    }
                  }}
                >
                  Set
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Venue Details Popup (Airbnb-style) */}
      <Dialog open={!!selectedVenue} onOpenChange={() => setSelectedVenue(null)}>
        <DialogContent className="max-w-3xl">
          {selectedVenue && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-600" />
                    {selectedVenue.name}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVenue(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Rating and Basic Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getStars(selectedVenue.rating)}</span>
                      <span className="text-sm text-gray-600">({selectedVenue.reviews} reviews)</span>
                    </div>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedVenue.address}
                      {selectedVenue.distance && (
                        <span className="text-orange-600 font-medium ml-2">
                          • {selectedVenue.distance} km from your stay
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge className={getTierColor(selectedVenue.tier)}>
                    {selectedVenue.tier.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-700">{selectedVenue.description}</p>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {getBlanePricing(selectedVenue)} DHS
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Single Entry (Blane)</div>
                    <div className="text-xs text-gray-500">
                      Monthly membership: {selectedVenue.monthly_price} DHS
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium mb-3">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVenue.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {getAmenityIcon(amenity)}
                        {formatAmenity(amenity)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Contact</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedVenue.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {selectedVenue.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Hours</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {selectedVenue.openHours}
                    </div>
                  </div>
                </div>

                {/* Booking Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    onClick={() => {
                      setSelectedVenue(null);
                      navigate(`/booking/${selectedVenue.id}?type=single`);
                    }}
                  >
                    Book Single Entry - {getBlanePricing(selectedVenue)} DHS
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-orange-200 text-orange-600"
                    onClick={() => {
                      setSelectedVenue(null);
                      navigate(`/booking/${selectedVenue.id}?type=pack`);
                    }}
                  >
                    View Packages
                  </Button>
                </div>

                {userAccommodation && selectedVenue.distance && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Navigation2 className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      <strong>{selectedVenue.distance} km</strong> from {userAccommodation.name} 
                      - approximately {Math.round(selectedVenue.distance * 2)} minutes walk
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenueMapAirbnb;

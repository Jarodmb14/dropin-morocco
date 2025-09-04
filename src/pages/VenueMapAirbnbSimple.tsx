import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Hotel, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Venue {
  id: string;
  name: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ULTRA_LUXE';
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  rating: number;
  distance?: number;
}

const VenueMapAirbnbSimple = () => {
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  const venues: Venue[] = [
    {
      id: '1',
      name: 'FitZone Casablanca Premium',
      tier: 'PREMIUM',
      city: 'Casablanca',
      address: 'Twin Center, Boulevard Zerktouni',
      latitude: 33.5731,
      longitude: -7.5898,
      price: 120,
      rating: 4.8,
      distance: 2.1,
    },
    {
      id: '2',
      name: 'Ocean Fitness Maarif',
      tier: 'STANDARD',
      city: 'Casablanca',
      address: 'Boulevard Ghandi, Maarif',
      latitude: 33.5650,
      longitude: -7.6109,
      price: 50,
      rating: 4.2,
      distance: 3.5,
    },
    {
      id: '3',
      name: 'Atlas Luxury Spa',
      tier: 'ULTRA_LUXE',
      city: 'Marrakech',
      address: 'Hivernage District',
      latitude: 31.6295,
      longitude: -8.0089,
      price: 350,
      rating: 4.9,
      distance: 1.8,
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-gray-100 text-gray-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ULTRA_LUXE': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <p className="text-gray-600 mt-1">Airbnb-style map for tourists in Morocco</p>
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
        {/* Tourist Location Alert */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Hotel className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">🏨 Four Seasons Hotel Casablanca</h3>
                <p className="text-sm text-orange-700">Your accommodation location is set</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map and Venues */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Airbnb-style Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="h-[500px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-blue-300 relative overflow-hidden">
                  {/* Morocco Background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-10">🇲🇦</div>
                  </div>
                  
                  {/* Hotel Location */}
                  <div 
                    className="absolute w-8 h-8 bg-orange-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold animate-pulse"
                    style={{ left: '25%', top: '30%' }}
                    title="Your Hotel"
                  >
                    🏨
                  </div>

                  {/* Gym Markers with Airbnb-style Pricing */}
                  {venues.map((venue, index) => (
                    <div
                      key={venue.id}
                      className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${40 + index * 10}%`,
                      }}
                      onClick={() => setSelectedVenue(venue)}
                    >
                      {/* Airbnb-style Price Card */}
                      <div className={`bg-white rounded-full px-3 py-1 shadow-lg border-2 border-white hover:shadow-xl transition-shadow ${
                        selectedVenue?.id === venue.id ? 'ring-2 ring-orange-400 bg-orange-50' : ''
                      }`}>
                        <div className="text-sm font-bold text-gray-800">
                          {venue.price} DH
                        </div>
                      </div>
                      
                      {/* Distance */}
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Nearby Gyms</h2>
            {venues.map((venue) => (
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
                        <span>⭐ {venue.rating}</span>
                      </div>
                    </div>
                    <Badge className={getTierColor(venue.tier)} style={{ fontSize: '10px' }}>
                      {venue.tier}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {venue.price} DH
                      </div>
                      <div className="text-xs text-gray-500">per visit</div>
                    </div>
                    {venue.distance && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {venue.distance} km
                        </div>
                        <div className="text-xs text-gray-500">from hotel</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Venue Details */}
        {selectedVenue && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-orange-600" />
                {selectedVenue.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" />
                    {selectedVenue.address}
                  </p>
                  <p className="text-orange-600 font-medium">
                    📍 {selectedVenue.distance} km from your hotel
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {selectedVenue.price} DHS
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-orange-600 to-red-600"
                    onClick={() => navigate(`/booking/${selectedVenue.id}`)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VenueMapAirbnbSimple;

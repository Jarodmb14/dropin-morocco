import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';
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
  monthly_price?: number;
}

const VenueMapSimple = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    // Load sample venues
    const sampleVenues: Venue[] = [
      {
        id: '1',
        name: 'FitZone Casablanca',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Boulevard Mohammed V',
        latitude: 33.5731,
        longitude: -7.5898,
        monthly_price: 600,
      },
      {
        id: '2',
        name: 'Basic Gym Rabat',
        tier: 'BASIC',
        city: 'Rabat',
        address: 'Avenue Hassan II',
        latitude: 34.0209,
        longitude: -6.8416,
        monthly_price: 300,
      },
      {
        id: '3',
        name: 'Luxury Spa Marrakech',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Hivernage District',
        latitude: 31.6295,
        longitude: -8.0089,
        monthly_price: 1200,
      },
    ];
    setVenues(sampleVenues);
  }, []);

  const getBlanePricing = (venue: Venue): number => {
    return BusinessRules.calculateBlanePricing(venue.tier, venue.monthly_price);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-gray-100 text-gray-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ULTRA_LUXE': return 'bg-yellow-100 text-orange-800';
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
              <h1 className="text-3xl font-bold text-orange-600">
                🗺️ Gym Map (Simple)
              </h1>
              <p className="text-gray-600">Find gyms near you</p>
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
        {/* Simple Map Visualization */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Area */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Morocco Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-blue-300 relative">
                  {/* Morocco Map Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-20">🇲🇦</div>
                  </div>
                  
                  {/* Venue Markers */}
                  {venues.map((venue, index) => (
                    <div
                      key={venue.id}
                      className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125 flex items-center justify-center text-white font-bold text-sm ${
                        selectedVenue?.id === venue.id ? 'scale-125 ring-2 ring-orange-400' : ''
                      } ${
                        venue.tier === 'ULTRA_LUXE' ? 'bg-yellow-500' :
                        venue.tier === 'PREMIUM' ? 'bg-purple-500' :
                        venue.tier === 'STANDARD' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                      style={{
                        left: `${20 + index * 25}%`,
                        top: `${30 + index * 20}%`,
                      }}
                      onClick={() => setSelectedVenue(venue)}
                      title={venue.name}
                    >
                      {index + 1}
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="text-xs font-medium mb-2">Pricing</div>
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Venue List */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Venues</CardTitle>
                <p className="text-sm text-gray-600">Click a venue to see it on the map</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venues.map((venue) => (
                    <div
                      key={venue.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedVenue?.id === venue.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedVenue(venue)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{venue.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {venue.city}
                          </p>
                        </div>
                        <Badge className={getTierColor(venue.tier)}>
                          {venue.tier}
                        </Badge>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 mb-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-orange-600">
                            {getBlanePricing(venue)} DHS
                          </div>
                          <div className="text-xs text-gray-600">Single Entry</div>
                        </div>
                      </div>

                      <Button 
                        size="sm"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/booking/${venue.id}?type=single`);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Venue Details */}
        {selectedVenue && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                {selectedVenue.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Location</h4>
                  <p className="text-sm">{selectedVenue.address}</p>
                  <p className="text-sm text-gray-600">{selectedVenue.city}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Pricing</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {getBlanePricing(selectedVenue)} DHS
                  </p>
                  <p className="text-sm text-gray-600">Single Entry (Blane)</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Tier</h4>
                  <Badge className={getTierColor(selectedVenue.tier)}>
                    {selectedVenue.tier.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Monthly: {selectedVenue.monthly_price} DHS
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  onClick={() => navigate(`/booking/${selectedVenue.id}?type=single`)}
                >
                  Book {selectedVenue.name} Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VenueMapSimple;

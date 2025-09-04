import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Users, Clock, Dumbbell, Heart, Zap } from 'lucide-react';
import { BusinessRules } from '@/lib/api/business-rules';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Venue {
  id: string;
  name: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ULTRA_LUXE';
  city: string;
  address?: string;
  amenities: string[];
  is_active: boolean;
  monthly_price?: number;
  auto_blane_price?: number;
}

const VenueBrowsing = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();

  // Fetch venues from database
  useEffect(() => {
    fetchVenues();
  }, []);

  // Filter venues based on search criteria
  useEffect(() => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(venue => venue.city === selectedCity);
    }

    if (selectedTier) {
      filtered = filtered.filter(venue => venue.tier === selectedTier);
    }

    if (priceRange) {
      filtered = filtered.filter(venue => {
        const price = getBlanePricing(venue);
        switch (priceRange) {
          case 'budget': return price <= 50;
          case 'standard': return price > 50 && price <= 120;
          case 'premium': return price > 120;
          default: return true;
        }
      });
    }

    setFilteredVenues(filtered);
  }, [venues, searchTerm, selectedCity, selectedTier, priceRange]);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Load sample data for demo
      loadSampleVenues();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleVenues = () => {
    const sampleVenues: Venue[] = [
      {
        id: '1',
        name: 'FitZone Casablanca',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Boulevard Mohammed V, Casablanca',
        amenities: ['cardio', 'weights', 'group_classes', 'pool'],
        is_active: true,
        monthly_price: 600,
      },
      {
        id: '2',
        name: 'Basic Gym Rabat',
        tier: 'BASIC',
        city: 'Rabat',
        address: 'Avenue Hassan II, Rabat',
        amenities: ['cardio', 'weights'],
        is_active: true,
        monthly_price: 300,
      },
      {
        id: '3',
        name: 'Luxury Spa Marrakech',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Hivernage, Marrakech',
        amenities: ['spa', 'pool', 'sauna', 'massage', 'yoga'],
        is_active: true,
        monthly_price: 1200,
      },
      {
        id: '4',
        name: 'Standard Fitness Center',
        tier: 'STANDARD',
        city: 'Tangier',
        address: 'Corniche, Tangier',
        amenities: ['cardio', 'weights', 'group_classes'],
        is_active: true,
        monthly_price: 450,
      },
    ];
    setVenues(sampleVenues);
  };

  const getBlanePricing = (venue: Venue): number => {
    // Use auto_blane_price if available, otherwise calculate
    if (venue.auto_blane_price) {
      return venue.auto_blane_price;
    }
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
    switch (amenity) {
      case 'cardio': return <Heart className="w-4 h-4" />;
      case 'weights': return <Dumbbell className="w-4 h-4" />;
      case 'pool': return <Zap className="w-4 h-4" />;
      case 'group_classes': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const formatAmenity = (amenity: string) => {
    return amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const cities = [...new Set(venues.map(v => v.city))];

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
                🏋️ Discover Venues
              </h1>
              <p className="text-gray-600 mt-1">Find the perfect gym, spa, or fitness center in Morocco</p>
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
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search venues</label>
                <Input
                  placeholder="Venue name or city..."
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

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
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
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-orange-600">{filteredVenues.length}</span> venues
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow border-orange-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {venue.city}
                    </p>
                  </div>
                  <Badge className={getTierColor(venue.tier)}>
                    {venue.tier.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Pricing Display */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {getBlanePricing(venue)} DHS
                    </div>
                    <div className="text-sm text-gray-600">Single Entry (Blane)</div>
                    {venue.monthly_price && (
                      <div className="text-xs text-gray-500 mt-1">
                        Monthly: {venue.monthly_price} DHS
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.slice(0, 4).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2 py-1">
                        {getAmenityIcon(amenity)}
                        {formatAmenity(amenity)}
                      </div>
                    ))}
                    {venue.amenities.length > 4 && (
                      <div className="text-xs text-gray-500">
                        +{venue.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Booking Options */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    onClick={() => navigate(`/booking/${venue.id}?type=single`)}
                  >
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Book Single Entry
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => navigate(`/booking/${venue.id}?type=pack`)}
                    >
                      🎯 Pack (5-10)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => navigate(`/booking/${venue.id}?type=pass`)}
                    >
                      ⭐ Monthly Pass
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No venues found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setSelectedTier('');
                setPriceRange('');
              }}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueBrowsing;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BusinessRules } from '@/lib/api/business-rules';

const VenueBrowsingSimple = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Simple test data
  const venues = [
    {
      id: '1',
      name: 'FitZone Casablanca',
      tier: 'PREMIUM' as const,
      city: 'Casablanca',
      monthly_price: 600,
    },
    {
      id: '2',
      name: 'Basic Gym Rabat',
      tier: 'BASIC' as const,
      city: 'Rabat',
      monthly_price: 300,
    }
  ];

  const getBlanePricing = (venue: any): number => {
    return BusinessRules.calculateBlanePricing(venue.tier, venue.monthly_price);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">
                🏋️ Browse Venues (Simple)
              </h1>
              <p className="text-gray-600">Find gyms and fitness centers</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {venues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <p className="text-sm text-gray-600">{venue.city}</p>
              </CardHeader>
              
              <CardContent>
                {/* Pricing Display */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {getBlanePricing(venue)} DHS
                    </div>
                    <div className="text-sm text-gray-600">Single Entry (Blane)</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Monthly: {venue.monthly_price} DHS
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                  onClick={() => navigate(`/booking/${venue.id}?type=single`)}
                >
                  Book Single Entry
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueBrowsingSimple;

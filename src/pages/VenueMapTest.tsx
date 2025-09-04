import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VenueMapTest = () => {
  const navigate = useNavigate();
  const [addressInput, setAddressInput] = useState('');
  const [userLocation, setUserLocation] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🗺️ Find Gyms Near You - TEST
              </h1>
              <p className="text-gray-600 mt-1">Simple test page</p>
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
        {/* Location Input */}
        <Card className="mb-6 border-orange-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Set Your Location</h3>
              <p className="text-gray-600">Test page working!</p>
            </div>

            {/* GPS Button */}
            <div className="text-center mb-6">
              <Button 
                onClick={() => setUserLocation('GPS Location Set')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                size="lg"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Use My Current Location
              </Button>
            </div>

            <div className="text-center text-gray-500 mb-6">OR</div>

            {/* Address Input */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Enter Your Address</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Hotel name, address, or landmark..."
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="border-orange-200"
                  />
                  <Button 
                    onClick={() => setUserLocation(addressInput || 'Address Set')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Display */}
        {userLocation && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-green-800">✅ Location Set!</h3>
                <p className="text-green-700">{userLocation}</p>
                <Button 
                  onClick={() => setUserLocation('')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simple Map */}
        <Card>
          <CardContent className="p-0">
            <div className="h-[400px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-blue-300 relative flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🇲🇦</div>
                <div className="text-xl font-semibold text-gray-700">
                  Map with gyms will appear here
                </div>
                {userLocation && (
                  <div className="mt-4 text-lg text-green-600">
                    📍 Your location: {userLocation}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueMapTest;

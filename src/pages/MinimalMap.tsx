import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  price_per_hour: number;
  description?: string;
  amenities?: string[];
  rating?: number;
  review_count?: number;
}

export const MinimalMap: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load gyms from the database
  const loadGyms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkj_3v_X9U_SzAWOW5i2voE',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🏋️ Gyms loaded:', data?.length || 0);
        setGyms(data || []);
      } else {
        console.error('Failed to load gyms:', response.status);
      }
    } catch (error) {
      console.error('Error loading gyms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGyms();
  }, []);

  // Handle gym selection
  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
    console.log('Selected gym:', gym.name);
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-gray-100 text-gray-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'LUXURY': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Create gym icon
  const createGymIcon = (tier: string) => {
    const color = tier === 'LUXURY' ? '#f59e0b' : 
                  tier === 'PREMIUM' ? '#8b5cf6' : 
                  tier === 'STANDARD' ? '#3b82f6' : '#6b7280';
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gyms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Find Gyms</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{gyms.length} gyms available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Simple Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-4">Nearby Gyms</h3>
          
          {/* Selected Gym Details */}
          {selectedGym && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2">{selectedGym.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedGym.address}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg text-green-600">
                  {formatPrice(selectedGym.price_per_hour)}/hour
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(selectedGym.tier)}`}>
                  {selectedGym.tier}
                </span>
              </div>

              {selectedGym.rating && (
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{selectedGym.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({selectedGym.review_count || 0} reviews)</span>
                </div>
              )}

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Book Now
              </button>
            </div>
          )}

          {/* Gym List */}
          <div className="space-y-4">
            {gyms.slice(0, 10).map((gym) => (
              <div
                key={gym.id}
                onClick={() => handleGymSelect(gym)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedGym?.id === gym.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{gym.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(gym.tier)}`}>
                    {gym.tier}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{gym.address}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600">
                    {formatPrice(gym.price_per_hour)}/hour
                  </span>
                  {gym.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm">{gym.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[33.5731, -7.5898]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {gyms.map((gym) => (
              <Marker
                key={gym.id}
                position={[gym.latitude, gym.longitude]}
                icon={createGymIcon(gym.tier)}
                eventHandlers={{
                  click: () => handleGymSelect(gym)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-3 bg-white rounded-lg shadow-lg min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-base text-gray-900">{gym.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(gym.tier)}`}>
                        {gym.tier}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{gym.address}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg text-green-600">
                          {formatPrice(gym.price_per_hour)}
                        </span>
                        <span className="text-sm text-gray-500">/hour</span>
                      </div>
                      
                      {gym.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{gym.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleGymSelect(gym)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

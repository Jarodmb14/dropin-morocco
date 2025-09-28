import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Search, Filter } from 'lucide-react';
import { MAPBOX_CONFIG, isMapboxConfigured, getMapboxAttribution } from '@/config/mapbox';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet - moved to useEffect

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

interface MapViewProps {
  gyms: Gym[];
  onGymSelect?: (gym: Gym) => void;
  onGymBook?: (gym: Gym) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  radius?: number;
  userLocation?: [number, number];
}

// Component to handle map center updates
const MapCenterUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Custom gym marker icon with 🏋️ emoji based on tier
const createGymIcon = (tier: string) => {
  const colors = {
    BASIC: '#10B981',      // Green
    STANDARD: '#3B82F6',   // Blue
    PREMIUM: '#F59E0B',    // Orange
    LUXURY: '#EF4444'      // Red
  };
  
  return L.divIcon({
    className: 'custom-gym-marker',
    html: `
      <div style="
        background-color: ${colors[tier as keyof typeof colors] || colors.BASIC};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s ease;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        🏋️
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// Custom user location marker with 🕵️ emoji
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        background-color: #8B5CF6;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        animation: pulse 2s infinite;
      ">
        🕵️
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
  });
};

export const MapView: React.FC<MapViewProps> = ({
  gyms,
  onGymSelect,
  onGymBook,
  center = [33.5731, -7.5898], // Default to Casablanca, Morocco
  zoom = 13,
  height = '500px',
  radius = 10,
  userLocation
}) => {
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState<[number, number]>(center || [33.5731, -7.5898]); // Default to Casablanca
  const [mapZoom, setMapZoom] = useState(zoom || 10);

  // Fix for default markers in react-leaflet
  useEffect(() => {
    if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
      const defaultIcon = L.Icon.Default.prototype as any;
      delete defaultIcon._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);


  const handleGymClick = (gym: Gym) => {
    setMapCenter([gym.latitude, gym.longitude]);
    setMapZoom(16);
    onGymSelect?.(gym);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      BASIC: 'bg-green-100 text-green-800',
      STANDARD: 'bg-blue-100 text-blue-800',
      PREMIUM: 'bg-orange-100 text-orange-800',
      LUXURY: 'bg-red-100 text-red-800'
    };
    return colors[tier as keyof typeof colors] || colors.BASIC;
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="bg-gray-900 text-white">
          <CardTitle className="flex items-center gap-3 font-space-grotesk font-medium text-lg">
            <div className="p-2 bg-white/20 rounded-full">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-space-grotesk">Find Gyms Near You</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height }} className="relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
              
              {/* High-quality map tiles - Mapbox (primary) or CartoDB (fallback) */}
              {isMapboxConfigured() ? (
                <TileLayer
                  attribution={getMapboxAttribution()}
                  url={`${MAPBOX_CONFIG.TILES_API}/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}`}
                />
              ) : (
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>, &copy; OpenStreetMap contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  subdomains={['a', 'b', 'c', 'd']}
                />
              )}
              
              {/* Dynamic radius circle around center - only show if center is valid */}
              {mapCenter && mapCenter[0] && mapCenter[1] && (
                <Circle
                  center={mapCenter}
                  radius={radius * 1000} // Convert km to meters
                  pathOptions={{
                    color: '#8b5cf6',
                    fillColor: '#a855f7',
                    fillOpacity: 0.15,
                    weight: 3,
                    opacity: 0.8
                  }}
                />
              )}
              
              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={createUserLocationIcon()}
                >
                  <Popup className="custom-popup" maxWidth={200}>
                    <div className="p-3 bg-purple-50 rounded-lg shadow-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🕵️</span>
                        <div>
                          <h4 className="font-space-grotesk font-semibold text-purple-900">Your Location</h4>
                          <p className="text-sm text-purple-700">Current position</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {gyms && gyms.length > 0 && gyms.map((gym) => (
                <Marker
                  key={gym.id}
                  position={[gym.latitude, gym.longitude]}
                  icon={createGymIcon(gym.tier)}
                  eventHandlers={{
                    click: () => handleGymClick(gym)
                  }}
                >
                  <Popup className="custom-popup" maxWidth={400} minWidth={350}>
                    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 relative overflow-hidden">
                      {/* Gym Wall Texture Effect for Popup */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
                        {/* Subtle gym equipment silhouettes */}
                        <div className="absolute top-2 left-2 text-gray-600" style={{fontSize: '16px', opacity: 0.05}}>
                          💪
                        </div>
                        <div className="absolute top-6 right-3 text-gray-600" style={{fontSize: '14px', opacity: 0.03}}>
                          🏋️
                        </div>
                        <div className="absolute bottom-4 left-4 text-gray-600" style={{fontSize: '12px', opacity: 0.04}}>
                          🏃
                        </div>
                        
                        {/* Wall texture pattern */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 30% 30%, rgba(0,0,0,0.01) 1px, transparent 1px),
                              radial-gradient(circle at 70% 70%, rgba(0,0,0,0.01) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px, 60px 60px'
                          }}
                        />
                        
                        {/* Motivational text elements */}
                        <div className="absolute top-8 right-8 text-gray-400 opacity-[0.015] font-space-grotesk font-bold text-xs rotate-12">
                          POWER
                        </div>
                        <div className="absolute bottom-6 left-6 text-gray-400 opacity-[0.01] font-space-grotesk font-bold text-xs -rotate-6">
                          STRONG
                        </div>
                      </div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-space-grotesk font-semibold text-lg text-gray-900 leading-tight">{gym.name}</h3>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getTierColor(gym.tier)} border-2 border-white shadow-sm`}>
                          {gym.tier}
                        </span>
                      </div>
                      
                      {/* Address */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 leading-relaxed font-inter">📍 {gym.address}</p>
                      </div>
                      
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <span className="font-space-grotesk font-semibold text-xl text-green-600">
                            {formatPrice(gym.price_per_hour)}
                          </span>
                          <span className="text-sm text-gray-500 font-inter">/hour</span>
                        </div>
                        
                        {gym.rating && (
                          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                            <span className="text-yellow-500 text-lg">⭐</span>
                            <span className="text-sm font-space-grotesk font-medium text-yellow-800">{gym.rating.toFixed(1)}</span>
                            <span className="text-xs text-yellow-700 font-inter">({gym.review_count || 0})</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Description */}
                      {gym.description && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 font-inter">
                            {gym.description}
                          </p>
                        </div>
                      )}
                      
                      {/* Amenities */}
                      {gym.amenities && (Array.isArray(gym.amenities) ? gym.amenities.length > 0 : Object.keys(gym.amenities).length > 0) && (
                        <div className="mb-3">
                          <p className="text-xs font-space-grotesk font-medium text-gray-600 mb-2">Amenities:</p>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(gym.amenities) ? gym.amenities : Object.keys(gym.amenities)).slice(0, 3).map((amenity, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-space-grotesk font-medium border border-gray-200">
                                {amenity}
                              </span>
                            ))}
                            {(Array.isArray(gym.amenities) ? gym.amenities.length : Object.keys(gym.amenities).length) > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-space-grotesk font-medium border border-gray-200">
                                +{(Array.isArray(gym.amenities) ? gym.amenities.length : Object.keys(gym.amenities).length) - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <button
                        onClick={() => navigate(`/gym/${gym.id}`)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-space-grotesk font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        🎯 View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
      

      {/* Map Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
        <h4 className="font-space-grotesk font-semibold text-gray-900 mb-2 text-sm">
          Legend
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-500 border border-white shadow-sm flex items-center justify-center text-xs">
              🏋️
            </div>
            <span className="text-gray-700">Basic</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 border border-white shadow-sm flex items-center justify-center text-xs">
              🏋️
            </div>
            <span className="text-gray-700">Standard</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-orange-500 border border-white shadow-sm flex items-center justify-center text-xs">
              🏋️
            </div>
            <span className="text-gray-700">Premium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-500 border border-white shadow-sm flex items-center justify-center text-xs">
              🏋️
            </div>
            <span className="text-gray-700">Luxury</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200">
          <div className="w-4 h-4 rounded-full bg-purple-500 border border-white shadow-sm flex items-center justify-center text-xs animate-pulse">
            🕵️
          </div>
          <span className="text-gray-700 text-xs">Your Location</span>
        </div>
      </div>
    </div>
  );
};

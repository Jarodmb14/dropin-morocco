import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Component to handle map center updates
const MapCenterUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  gyms,
  onGymSelect,
  center = [33.5731, -7.5898], // Default to Casablanca, Morocco
  zoom = 13,
  height = '500px'
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);

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

  // Update map center when center prop changes
  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  // Update map zoom when zoom prop changes
  useEffect(() => {
    setMapZoom(zoom);
  }, [zoom]);

  const handleGymClick = (gym: Gym) => {
    setMapCenter([gym.latitude, gym.longitude]);
    setMapZoom(16);
    if (onGymSelect) {
      onGymSelect(gym);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-200" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 10km radius circle */}
        <Circle
          center={mapCenter}
          radius={10000}
          pathOptions={{
            color: '#8b5cf6',
            fillColor: '#a855f7',
            fillOpacity: 0.1,
            weight: 2
          }}
        />

        {/* Gym markers */}
        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            position={[gym.latitude, gym.longitude]}
            eventHandlers={{
              click: () => handleGymClick(gym)
            }}
          >
            <Popup maxWidth={320} minWidth={280} className="custom-popup">
              <div className="p-4 bg-white rounded-xl shadow-xl border-2 border-purple-200">
                <div className="font-space-grotesk">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{gym.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="ml-1 font-bold text-xl">{gym.rating}</span>
                      <span className="ml-2 text-gray-600">({gym.review_count} reviews)</span>
                    </div>
                    <div className="font-bold text-xl text-purple-600">
                      {gym.price_per_hour} DH
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                    {gym.description || `${gym.tier} tier gym with premium facilities`}
                  </p>
                  
                  {gym.amenities && gym.amenities.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {gym.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-inter"
                          >
                            {amenity}
                          </span>
                        ))}
                        {gym.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{gym.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleGymClick(gym)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    Book This Gym
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;

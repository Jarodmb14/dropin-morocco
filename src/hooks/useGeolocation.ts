import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const getCurrentLocation = async () => {
    if (!Capacitor.isNativePlatform() && !navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await Geolocation.getCurrentPosition();
      
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        loading: false,
        error: null,
      });
    } catch (error) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get location',
      }));
    }
  };

  return {
    ...location,
    getCurrentLocation,
  };
};
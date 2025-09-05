import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

interface GeolocationState {
  position: GeolocationPosition | null;
  loading: boolean;
  error: string | null;
  permission: PermissionStatus | null;
  watchId: string | null;
  isWatching: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export const useEnhancedGeolocation = (options: GeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 600000, // 10 minutes
    watch = false
  } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: false,
    error: null,
    permission: null,
    watchId: null,
    isWatching: false,
  });

  // Check permissions on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Auto-watch if requested
  useEffect(() => {
    if (watch && state.permission?.location === 'granted') {
      startWatching();
    }
    
    return () => {
      if (state.watchId) {
        stopWatching();
      }
    };
  }, [watch, state.permission]);

  const checkPermission = useCallback(async () => {
    try {
      const permission = await Geolocation.checkPermissions();
      setState(prev => ({ ...prev, permission }));
      return permission;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to check location permissions' 
      }));
      return null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      setState(prev => ({ ...prev, permission }));
      return permission;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to request location permissions' 
      }));
      return null;
    }
  }, []);

  const getCurrentPosition = useCallback(async (forceRequest = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check permissions first
      let permission = state.permission;
      if (!permission || forceRequest) {
        permission = await checkPermission();
      }

      if (permission?.location !== 'granted') {
        permission = await requestPermission();
      }

      if (permission?.location !== 'granted') {
        throw new Error('Location permission denied');
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy,
        timeout,
        maximumAge,
      });

      const enhancedPosition: GeolocationPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };

      setState(prev => ({
        ...prev,
        position: enhancedPosition,
        loading: false,
        error: null,
      }));

      return enhancedPosition;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [state.permission, enableHighAccuracy, timeout, maximumAge, checkPermission, requestPermission]);

  const startWatching = useCallback(async () => {
    if (state.isWatching) {
      return;
    }

    try {
      // Check permissions first
      let permission = state.permission;
      if (!permission) {
        permission = await checkPermission();
      }

      if (permission?.location !== 'granted') {
        permission = await requestPermission();
      }

      if (permission?.location !== 'granted') {
        throw new Error('Location permission denied');
      }

      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        },
        (position) => {
          if (position) {
            const enhancedPosition: GeolocationPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
              timestamp: position.timestamp,
            };

            setState(prev => ({
              ...prev,
              position: enhancedPosition,
              loading: false,
              error: null,
            }));
          }
        }
      );

      setState(prev => ({
        ...prev,
        watchId,
        isWatching: true,
        loading: false,
      }));

      return watchId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start watching location';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      throw error;
    }
  }, [state.permission, state.isWatching, enableHighAccuracy, timeout, maximumAge, checkPermission, requestPermission]);

  const stopWatching = useCallback(async () => {
    if (state.watchId) {
      try {
        await Geolocation.clearWatch({ id: state.watchId });
        setState(prev => ({
          ...prev,
          watchId: null,
          isWatching: false,
        }));
      } catch (error) {
        console.error('Error stopping location watch:', error);
      }
    }
  }, [state.watchId]);

  const getDistanceTo = useCallback((targetLat: number, targetLng: number) => {
    if (!state.position) {
      return null;
    }

    // Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = (targetLat - state.position.latitude) * (Math.PI / 180);
    const dLng = (targetLng - state.position.longitude) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(state.position.latitude * (Math.PI / 180)) * 
      Math.cos(targetLat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return {
      kilometers: distance,
      meters: distance * 1000,
      miles: distance * 0.621371,
    };
  }, [state.position]);

  const isLocationStale = useCallback((maxAge = 300000) => { // 5 minutes default
    if (!state.position) {
      return true;
    }
    return (Date.now() - state.position.timestamp) > maxAge;
  }, [state.position]);

  return {
    position: state.position,
    loading: state.loading,
    error: state.error,
    permission: state.permission,
    isWatching: state.isWatching,
    isLocationStale,
    getCurrentPosition,
    startWatching,
    stopWatching,
    checkPermission,
    requestPermission,
    getDistanceTo,
    // Convenience getters
    latitude: state.position?.latitude ?? null,
    longitude: state.position?.longitude ?? null,
    accuracy: state.position?.accuracy ?? null,
    speed: state.position?.speed ?? null,
    heading: state.position?.heading ?? null,
  };
};

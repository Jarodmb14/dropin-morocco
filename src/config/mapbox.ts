// Mapbox configuration for better maps and geocoding
export const MAPBOX_CONFIG = {
  // Get your free Mapbox access token from: https://account.mapbox.com/access-tokens/
  ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
  
  // Map styles
  STYLES: {
    STREETS: 'mapbox://styles/mapbox/streets-v12',
    OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
    LIGHT: 'mapbox://styles/mapbox/light-v11',
    DARK: 'mapbox://styles/mapbox/dark-v11',
    SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v12'
  },
  
  // Geocoding endpoints
  GEOCODING_API: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  
  // Map tile endpoints
  TILES_API: 'https://api.mapbox.com/styles/v1/mapbox'
};

// Check if Mapbox is properly configured
export const isMapboxConfigured = () => {
  const token = MAPBOX_CONFIG.ACCESS_TOKEN;
  return token && token !== 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
};

// Get Mapbox attribution
export const getMapboxAttribution = () => {
  return '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';
};


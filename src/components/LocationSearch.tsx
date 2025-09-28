import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Navigation, X } from 'lucide-react';
import { MAPBOX_CONFIG, isMapboxConfigured } from '@/config/mapbox';

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'district' | 'landmark' | 'address';
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  onGPSLocation: () => void;
  currentLocation?: Location;
  className?: string;
}

// Moroccan cities and districts data
const MOROCCAN_LOCATIONS: Location[] = [
  // Major Cities
  { id: 'casablanca', name: 'Casablanca', address: 'Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'city' },
  { id: 'rabat', name: 'Rabat', address: 'Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'city' },
  { id: 'marrakech', name: 'Marrakech', address: 'Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'city' },
  { id: 'fes', name: 'Fes', address: 'Fes, Morocco', latitude: 34.0181, longitude: -5.0078, type: 'city' },
  { id: 'agadir', name: 'Agadir', address: 'Agadir, Morocco', latitude: 30.4278, longitude: -9.5981, type: 'city' },
  { id: 'tangier', name: 'Tangier', address: 'Tangier, Morocco', latitude: 35.7595, longitude: -5.8340, type: 'city' },
  { id: 'meknes', name: 'Meknes', address: 'Meknes, Morocco', latitude: 33.8935, longitude: -5.5473, type: 'city' },
  { id: 'oujda', name: 'Oujda', address: 'Oujda, Morocco', latitude: 34.6814, longitude: -1.9086, type: 'city' },
  { id: 'kenitra', name: 'Kenitra', address: 'Kenitra, Morocco', latitude: 34.2611, longitude: -6.5802, type: 'city' },
  { id: 'tetouan', name: 'Tetouan', address: 'Tetouan, Morocco', latitude: 35.5889, longitude: -5.3626, type: 'city' },
  
  // Casablanca Districts & Areas
  { id: 'casablanca-maarif', name: 'Maarif', address: 'Maarif, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-ain-diab', name: 'Ain Diab', address: 'Ain Diab, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-hay-mohammadi', name: 'Hay Mohammadi', address: 'Hay Mohammadi, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-ain-sebaa', name: 'Ain Sebaa', address: 'Ain Sebaa, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-medina', name: 'Medina Casablanca', address: 'Medina, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-derb-sultan', name: 'Derb Sultan', address: 'Derb Sultan, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-bournazel', name: 'Bournazel', address: 'Bournazel, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  { id: 'casablanca-racine', name: 'Racine', address: 'Racine, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'district' },
  
  // Rabat Districts & Areas
  { id: 'rabat-agdal', name: 'Agdal', address: 'Agdal, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'district' },
  { id: 'rabat-hay-riyad', name: 'Hay Riyad', address: 'Hay Riyad, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'district' },
  { id: 'rabat-medina', name: 'Medina Rabat', address: 'Medina, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'district' },
  { id: 'rabat-hassan', name: 'Hassan', address: 'Hassan, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'district' },
  { id: 'rabat-akkar', name: 'Akkar', address: 'Akkar, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'district' },
  { id: 'rabat-touarga', name: 'Touarga', address: 'Touarga, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'district' },
  
  // Marrakech Districts & Areas
  { id: 'marrakech-medina', name: 'Medina Marrakech', address: 'Medina, Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'district' },
  { id: 'marrakech-gueliz', name: 'Gueliz', address: 'Gueliz, Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'district' },
  { id: 'marrakech-hivernage', name: 'Hivernage', address: 'Hivernage, Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'district' },
  { id: 'marrakech-agdal', name: 'Agdal Marrakech', address: 'Agdal, Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'district' },
  { id: 'marrakech-sidi-ghessem', name: 'Sidi Ghessem', address: 'Sidi Ghessem, Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'district' },
  
  // Fes Districts & Areas
  { id: 'fes-medina', name: 'Medina Fes', address: 'Medina, Fes, Morocco', latitude: 34.0181, longitude: -5.0078, type: 'district' },
  { id: 'fes-jnan-el-ward', name: 'Jnan El Ward', address: 'Jnan El Ward, Fes, Morocco', latitude: 34.0181, longitude: -5.0078, type: 'district' },
  { id: 'fes-agdal', name: 'Agdal Fes', address: 'Agdal, Fes, Morocco', latitude: 34.0181, longitude: -5.0078, type: 'district' },
  { id: 'fes-hay-riad', name: 'Hay Riad Fes', address: 'Hay Riad, Fes, Morocco', latitude: 34.0181, longitude: -5.0078, type: 'district' },
  
  // Agadir Districts & Areas
  { id: 'agadir-medina', name: 'Medina Agadir', address: 'Medina, Agadir, Morocco', latitude: 30.4278, longitude: -9.5981, type: 'district' },
  { id: 'agadir-hay-mohammadi', name: 'Hay Mohammadi Agadir', address: 'Hay Mohammadi, Agadir, Morocco', latitude: 30.4278, longitude: -9.5981, type: 'district' },
  { id: 'agadir-tilila', name: 'Tilila', address: 'Tilila, Agadir, Morocco', latitude: 30.4278, longitude: -9.5981, type: 'district' },
  
  // Tangier Districts & Areas
  { id: 'tangier-medina', name: 'Medina Tangier', address: 'Medina, Tangier, Morocco', latitude: 35.7595, longitude: -5.8340, type: 'district' },
  { id: 'tangier-malabata', name: 'Malabata', address: 'Malabata, Tangier, Morocco', latitude: 35.7595, longitude: -5.8340, type: 'district' },
  { id: 'tangier-beni-makada', name: 'Beni Makada', address: 'Beni Makada, Tangier, Morocco', latitude: 35.7595, longitude: -5.8340, type: 'district' },
  
  // Popular Landmarks & Tourist Areas
  { id: 'hassan-ii-mosque', name: 'Hassan II Mosque', address: 'Hassan II Mosque, Casablanca, Morocco', latitude: 33.6089, longitude: -7.6328, type: 'landmark' },
  { id: 'jemaa-elfnaa', name: 'Jemaa el-Fnaa', address: 'Jemaa el-Fnaa, Marrakech, Morocco', latitude: 31.6258, longitude: -7.9891, type: 'landmark' },
  { id: 'chefchaouen', name: 'Chefchaouen', address: 'Chefchaouen, Morocco', latitude: 35.1714, longitude: -5.2697, type: 'landmark' },
  { id: 'essaouira', name: 'Essaouira', address: 'Essaouira, Morocco', latitude: 31.5085, longitude: -9.7595, type: 'landmark' },
  { id: 'ouarzazate', name: 'Ouarzazate', address: 'Ouarzazate, Morocco', latitude: 30.9333, longitude: -6.9167, type: 'landmark' },
  { id: 'merzouga', name: 'Merzouga', address: 'Merzouga, Morocco', latitude: 31.0833, longitude: -4.0167, type: 'landmark' },
  { id: 'volubilis', name: 'Volubilis', address: 'Volubilis, Morocco', latitude: 34.0744, longitude: -5.5553, type: 'landmark' },
  
  // Universities & Educational Areas
  { id: 'casablanca-university', name: 'Casablanca University', address: 'University of Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'landmark' },
  { id: 'rabat-university', name: 'Rabat University', address: 'University of Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'landmark' },
  { id: 'marrakech-university', name: 'Marrakech University', address: 'University of Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'landmark' },
  
  // Business Districts
  { id: 'casablanca-finance-city', name: 'Casablanca Finance City', address: 'Casablanca Finance City, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'landmark' },
  { id: 'rabat-business-district', name: 'Rabat Business District', address: 'Business District, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'landmark' },
  
  // Famous Streets and Addresses in Morocco
  { id: 'boulevard-anfa', name: 'Boulevard d\'Anfa', address: 'Boulevard d\'Anfa, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'street' },
  { id: 'rue-mohammed-v', name: 'Rue Mohammed V', address: 'Rue Mohammed V, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'street' },
  { id: 'avenue-hassan-ii', name: 'Avenue Hassan II', address: 'Avenue Hassan II, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'street' },
  { id: 'place-jemaa-el-fna', name: 'Place Jemaa el-Fnaa', address: 'Place Jemaa el-Fnaa, Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, type: 'landmark' },
  { id: 'rue-de-la-liberte', name: 'Rue de la Liberté', address: 'Rue de la Liberté, Rabat, Morocco', latitude: 34.0209, longitude: -6.8416, type: 'street' },
  { id: 'boulevard-anfa-139', name: '139 Boulevard d\'Anfa', address: '139 Boulevard d\'Anfa, Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, type: 'address' },
];

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  onGPSLocation,
  currentLocation,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced geocoding with multiple FREE strategies
  const geocodeAddress = async (query: string): Promise<Location[]> => {
    if (!query.trim() || query.length < 3) return [];
    
    try {
      // Use enhanced OpenStreetMap with multiple strategies (100% free)
      const osmResults = await geocodeWithOSM(query);
      console.log('🗺️ Using enhanced OSM results:', osmResults.length);
      return osmResults;
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  };

  // Google Geocoding API (most accurate, $200/month free)
  const geocodeWithGoogle = async (query: string): Promise<Location[]> => {
    const googleApiKey = import.meta.env.VITE_GOOGLE_GEOCODING_API_KEY;
    
    if (!googleApiKey) {
      console.log('🗺️ Google API key not configured, skipping');
      return [];
    }
    
    try {
      console.log('🗺️ Google searching for:', query);
      
      // Clean the query
      const cleanQuery = query
        .replace(/[^\w\s,.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Add Morocco if not present
      const searchQuery = cleanQuery.toLowerCase().includes('morocco') || cleanQuery.toLowerCase().includes('maroc') 
        ? cleanQuery 
        : cleanQuery + ', Morocco';
        
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?` +
        `address=${encodeURIComponent(searchQuery)}&` +
        `key=${googleApiKey}&` +
        `region=ma&` +
        `language=en`
      );
      
      if (!response.ok) {
        console.warn('Google API error:', response.status);
        return [];
      }
      
      const data = await response.json();
      console.log('🗺️ Google response:', data);
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.warn('Google API status:', data.status);
        return [];
      }
      
      return data.results
        .filter((result: any) => result.geometry && result.geometry.location)
        .map((result: any, index: number) => ({
          id: `google_${result.place_id}`,
          name: getGoogleDisplayName(result),
          address: result.formatted_address,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          type: getGoogleLocationType(result),
          relevance: result.geometry.location_type === 'ROOFTOP' ? 10 : 8 - index
        }))
        .sort((a: any, b: any) => (b.relevance || 0) - (a.relevance || 0))
        .slice(0, 8);
    } catch (error) {
      console.error('Google geocoding error:', error);
      return [];
    }
  };

  // Helper function to get clean display name from Google
  const getGoogleDisplayName = (result: any): string => {
    const components = result.address_components || [];
    
    // Try to get street number + route
    const streetNumber = components.find((c: any) => c.types.includes('street_number'))?.long_name || '';
    const route = components.find((c: any) => c.types.includes('route'))?.long_name || '';
    
    if (streetNumber && route) {
      return `${streetNumber} ${route}`;
    }
    
    // Fallback to first part of formatted address
    return result.formatted_address.split(',')[0];
  };

  // Helper function to determine location type from Google
  const getGoogleLocationType = (result: any): string => {
    const types = result.types || [];
    
    if (types.includes('street_address')) return 'address';
    if (types.includes('route')) return 'street';
    if (types.includes('neighborhood')) return 'district';
    if (types.includes('locality')) return 'city';
    if (types.includes('point_of_interest')) return 'landmark';
    return 'address';
  };

  // Mapbox Geocoding API (most accurate for addresses) - DISABLED
  const geocodeWithMapbox = async (query: string): Promise<Location[]> => {
    try {
      console.log('🗺️ Mapbox searching for:', query);
      
      // Clean and format the query
      const cleanQuery = query
        .replace(/[^\w\s,.-]/g, ' ') // Remove special characters except basic punctuation
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      // Don't add ", Morocco" if the query already contains Morocco/Maroc
      const searchQuery = cleanQuery.toLowerCase().includes('morocco') || cleanQuery.toLowerCase().includes('maroc') 
        ? cleanQuery 
        : cleanQuery + ', Morocco';
        
      console.log('🗺️ Cleaned query:', searchQuery);
        
      const response = await fetch(
        `${MAPBOX_CONFIG.GEOCODING_API}/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}&` +
        `country=MA&` +
        `limit=8&` +
        `types=address,poi,locality,neighborhood&` +
        `autocomplete=true`
      );
      
      if (!response.ok) {
        console.warn('Mapbox API error:', response.status);
        return [];
      }
      
      const data = await response.json();
      console.log('🗺️ Mapbox raw response:', data);
      console.log('🗺️ Mapbox found', data.features?.length || 0, 'results');
      
      return data.features
        .filter((feature: any) => feature.geometry && feature.geometry.coordinates)
        .map((feature: any, index: number) => ({
          id: `mapbox_${feature.id}`,
          name: getMapboxDisplayName(feature),
          address: feature.place_name,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          type: getMapboxLocationType(feature),
          relevance: feature.relevance || (10 - index)
        }))
        .sort((a: any, b: any) => (b.relevance || 0) - (a.relevance || 0))
        .slice(0, 8);
    } catch (error) {
      console.error('Mapbox geocoding error:', error);
      return [];
    }
  };

  // Helper function to get clean display name from Mapbox
  const getMapboxDisplayName = (feature: any): string => {
    const context = feature.context || [];
    const placeName = feature.text || feature.place_name;
    
    // Try to get the most specific part
    if (context.length > 0) {
      const locality = context.find((c: any) => c.id.startsWith('locality'));
      const neighborhood = context.find((c: any) => c.id.startsWith('neighborhood'));
      
      if (neighborhood) return `${feature.text}, ${neighborhood.text}`;
      if (locality) return `${feature.text}, ${locality.text}`;
    }
    
    return placeName.split(',')[0] || placeName;
  };

  // Helper function to determine location type from Mapbox
  const getMapboxLocationType = (feature: any): string => {
    const placeType = feature.place_type?.[0] || 'address';
    
    switch (placeType) {
      case 'address': return 'address';
      case 'poi': return 'landmark';
      case 'neighborhood': return 'district';
      case 'locality': return 'city';
      case 'place': return 'city';
      default: return 'address';
    }
  };

  // Enhanced OpenStreetMap geocoding with multiple search strategies
  const geocodeWithOSM = async (query: string): Promise<Location[]> => {
    try {
      console.log('🗺️ OSM searching for:', query);
      
      // Clean the query
      const cleanQuery = query
        .replace(/[^\w\s,.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Don't add ", Morocco" if already contains Morocco/Maroc
      const searchQuery = cleanQuery.toLowerCase().includes('morocco') || cleanQuery.toLowerCase().includes('maroc') 
        ? cleanQuery 
        : cleanQuery + ', Morocco';
        
      console.log('🗺️ OSM cleaned query:', searchQuery);
      
      // Try multiple search strategies for maximum accuracy
      const strategies = [
        // Strategy 1: Full address with Morocco
        searchQuery,
        // Strategy 2: Without Morocco (in case it's already in the query)
        cleanQuery,
        // Strategy 3: Remove house number (for "139 Boulevard d'Anfa" -> "Boulevard d'Anfa")
        cleanQuery.replace(/^\d+\s+/, ''),
        // Strategy 4: City + street only
        cleanQuery.split(',').slice(0, 2).join(','),
        // Strategy 5: Just street name (for "Boulevard d'Anfa, Casablanca" -> "Boulevard d'Anfa")
        cleanQuery.split(',')[0].replace(/^\d+\s+/, ''),
        // Strategy 6: Street name with city (no Morocco)
        cleanQuery.split(',').slice(0, 2).join(',').replace(/,?\s*morocco$/i, ''),
        // Strategy 7: French version (Boulevard d'Anfa -> Boulevard Anfa)
        cleanQuery.replace(/\b(d'|de\s+|du\s+|des\s+)/gi, ' ').replace(/\s+/g, ' ').trim(),
        // Strategy 8: Arabic transliteration friendly
        cleanQuery.replace(/boulevard/gi, 'Boulevard').replace(/avenue/gi, 'Avenue').replace(/rue/gi, 'Rue')
      ];
      
      let allResults: any[] = [];
      
      // Try each strategy
      for (const strategy of strategies) {
        if (strategy.length < 3) continue;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `format=json&` +
            `q=${encodeURIComponent(strategy)}&` +
            `countrycodes=ma&` +
            `limit=5&` +
            `addressdetails=1&` +
            `extratags=1&` +
            `dedupe=1&` +
            `polygon_geojson=1&` +
            `email=contact@dropinmorocco.com&` +
            `user_agent=DropInMorocco/1.0`
          );
          
          if (response.ok) {
            const data = await response.json();
            allResults = allResults.concat(data);
            console.log(`🗺️ OSM strategy "${strategy}" found:`, data.length, 'results');
          }
        } catch (err) {
          console.warn('OSM strategy failed:', strategy, err);
        }
      }
      
      // Remove duplicates and filter valid results
      const uniqueResults = allResults
        .filter((item: any, index: number, arr: any[]) => 
          item.lat && item.lon && 
          arr.findIndex(other => other.place_id === item.place_id) === index
        )
        .map((item: any, index: number) => ({
          id: `osm_${item.place_id}`,
          name: getDisplayName(item),
          address: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          type: getLocationType(item),
          relevance: item.importance || (10 - index)
        }))
        .sort((a: any, b: any) => (b.relevance || 0) - (a.relevance || 0))
        .slice(0, 8);
        
      console.log('🗺️ OSM total unique results:', uniqueResults.length);
      return uniqueResults;
    } catch (error) {
      console.error('OSM geocoding error:', error);
      return [];
    }
  };

  // Helper function to get a clean display name
  const getDisplayName = (item: any): string => {
    if (item.address) {
      // Try to get the most specific part of the address
      const parts = item.display_name.split(',');
      if (parts.length > 2) {
        return parts.slice(0, 2).join(', '); // First two parts
      }
    }
    return item.display_name.split(',')[0] || item.display_name;
  };

  // Helper function to determine location type
  const getLocationType = (item: any): string => {
    if (item.type === 'house' || item.type === 'building') return 'address';
    if (item.type === 'street') return 'street';
    if (item.type === 'suburb' || item.type === 'neighbourhood') return 'district';
    if (item.type === 'city' || item.type === 'town') return 'city';
    return item.type || 'address';
  };

  // Filter locations based on search query (fallback to local data)
  const filterLocations = (query: string): Location[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return MOROCCAN_LOCATIONS.filter(location =>
      location.name.toLowerCase().includes(lowerQuery) ||
      location.address.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 suggestions
  };

  // Non-blocking search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    if (query.length < 3) {
      return;
    }

    // Don't set loading state - keep it non-blocking
    try {
      // Try geocoding for precise addresses (background operation)
      const geocodedResults = await geocodeAddress(query);
      console.log('🌍 Geocoded results:', geocodedResults);
      
      if (geocodedResults.length > 0) {
        // Only update if we have better results than local data
        setSuggestions(geocodedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Don't update suggestions on error - keep local results
    }
  };

  // Handle search input change with non-blocking debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // For very short queries, show local results immediately (non-blocking)
    if (query.length < 3) {
      const filtered = filterLocations(query);
      setSuggestions(filtered);
      setShowSuggestions(query.trim().length > 0);
      return;
    }
    
    // Show local results immediately (non-blocking)
    const localResults = filterLocations(query);
    setSuggestions(localResults);
    setShowSuggestions(true);
    
    // Debounce API calls for 800ms (longer delay to reduce API calls)
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 800);
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    console.log('🎯 Location selected:', location);
    setSearchQuery(location.name);
    setSuggestions([]);
    setShowSuggestions(false);
    console.log('📞 Calling onLocationSelect with:', location);
    onLocationSelect(location);
  };

  // Handle GPS location
  const handleGPSLocation = async () => {
    setIsLoading(true);
    try {
      await onGPSLocation();
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Update search query when current location changes
  useEffect(() => {
    if (currentLocation) {
      setSearchQuery(currentLocation.name);
    }
  }, [currentLocation]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'city': return '🏙️';
      case 'district': return '🏘️';
      case 'landmark': return '🏛️';
      case 'street': return '🛣️';
      case 'house': return '🏠';
      case 'building': return '🏢';
      case 'address': return '📍';
      default: return '📍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-900 text-white">
          <CardTitle className="flex items-center gap-3 font-space-grotesk font-medium text-lg">
            <div className="p-2 bg-white/20 rounded-full">
              <Search className="h-5 w-5" />
            </div>
            <span className="font-space-grotesk">Find Gyms Near You</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type precise address, street name, or neighborhood..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pr-10"
                  />
                  {searchQuery && (
                    <Button
                      onClick={clearSearch}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <Button
                  onClick={handleGPSLocation}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white border-0 font-space-grotesk font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Navigation className="h-4 w-4" />
                  {isLoading ? 'Locating...' : '🌍 GPS'}
                </Button>
              </div>
              
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-purple-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                >
                  {console.log('🎯 Rendering suggestions:', suggestions.length, 'items')}
                  {suggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors duration-200"
                    >
                      <span className="text-lg">{getLocationIcon(location.type)}</span>
                      <div className="flex-1">
                        <div className="font-space-grotesk font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-500 font-inter">{location.address}</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-space-grotesk font-medium">
                        {location.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            
            {/* Current Location Display */}
            {currentLocation && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Current Location: {currentLocation.name}
                  </p>
                  <p className="text-xs text-blue-700">{currentLocation.address}</p>
                </div>
              </div>
            )}
            
            {/* Quick Location Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Popular Locations:</p>
              <div className="flex flex-wrap gap-2">
                {MOROCCAN_LOCATIONS.slice(0, 6).map((location) => (
                  <Button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {getLocationIcon(location.type)} {location.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

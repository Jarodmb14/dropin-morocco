import { useEffect, useMemo, useRef, useState } from "react";
import MoroccanBackground from "@/components/MoroccanBackground";
import SimpleHeader from "@/components/SimpleHeader";
import PriceMap, { type PriceVenue } from "@/components/PriceMap";

// Import tier images
import BasicImage from "@/assets/Basic.png";
import StandardImage from "@/assets/Standard.png";
import PremiumImage from "@/assets/Premium.png";
import LuxuryImage from "@/assets/luxury.png";

// Mock venues with proper tier classifications
const mockVenues = [
  { id: "1", name: "Atlas Power Gym", city: "Marrakech", tier: "basic", distanceKm: 1.2, price: 50, amenities: ["weights", "classes"], cover: BasicImage },
  { id: "2", name: "Casablanca Pro Fitness", city: "Casablanca", tier: "standard", distanceKm: 2.7, price: 90, amenities: ["cardio", "sauna"], cover: StandardImage },
  { id: "3", name: "Rabat Champion Club", city: "Rabat", tier: "premium", distanceKm: 3.4, price: 150, amenities: ["pool", "trainer"], cover: PremiumImage },
  { id: "4", name: "Legend Spa & Strength", city: "Tangier", tier: "luxury", distanceKm: 4.1, price: 320, amenities: ["spa", "concierge"], cover: LuxuryImage },
];

// Static demo coordinates for major cities
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Marrakech: { lat: 31.6295, lng: -7.9811 },
  Casablanca: { lat: 33.5731, lng: -7.5898 },
  Rabat: { lat: 34.0209, lng: -6.8416 },
  Tangier: { lat: 35.7595, lng: -5.8340 },
};

const suggestions = [
  "Casablanca • Maarif",
  "Casablanca • Twin Center",
  "Rabat • Agdal",
  "Marrakech • Gueliz",
  "Marrakech • Jemaa el-Fnaa",
  "Tangier • Malabata",
  "Hassan II Mosque",
  "Ain Diab Corniche",
  "La Mamounia Marrakech",
  "Four Seasons Casablanca",
];

const UnifiedLocation = () => {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [picked, setPicked] = useState<string>("");

  // Autocomplete state
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string>("");
  const [autoList, setAutoList] = useState<Array<{ label: string; lat: number; lon: number }>>([]);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (picked) setAddress(picked);
  }, [picked]);

  // Debounced Nominatim autocomplete (Morocco-optimized)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!address || address.trim().length < 3) {
      setAutoList([]);
      setAutoError("");
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        setAutoLoading(true);
        setAutoError("");
        const q = encodeURIComponent(address);
        // Prefer Morocco, with language hints and optional viewbox bias if GPS present
        let url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&limit=7&countrycodes=ma&accept-language=fr,en,ar&namedetails=1`;
        if (coords) {
          const lat = coords.lat;
          const lon = coords.lng;
          const dLat = 0.5; // ~55km
          const dLon = 0.5; // ~50km
          const left = (lon - dLon).toFixed(4);
          const right = (lon + dLon).toFixed(4);
          const top = (lat + dLat).toFixed(4);
          const bottom = (lat - dLat).toFixed(4);
          url += `&viewbox=${left},${top},${right},${bottom}&bounded=1`;
        }
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const data: Array<any> = await res.json();
        const mapped = data.map((d) => ({ label: d.display_name as string, lat: parseFloat(d.lat), lon: parseFloat(d.lon) }));
        setAutoList(mapped);
      } catch (e: any) {
        setAutoError("Autocomplete unavailable. Try again.");
      } finally {
        setAutoLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [address, coords]);

  const shown = useMemo(() => {
    return mockVenues.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [coords, address]);

  const center = useMemo(() => {
    if (coords) return coords;
    const match = Object.keys(CITY_COORDS).find((c) => address.toLowerCase().includes(c.toLowerCase()));
    if (match) return CITY_COORDS[match];
    return { lat: 33.5731, lng: -7.5898 }; // Casablanca default
  }, [coords, address]);

  const priceVenues: PriceVenue[] = shown.map((v, idx) => {
    const cityCenter = CITY_COORDS[v.city as keyof typeof CITY_COORDS] || center;
    const offsetLat = cityCenter.lat + (idx * 0.01 - 0.02);
    const offsetLng = cityCenter.lng + (idx * 0.01 - 0.02);
    return {
      id: v.id,
      name: v.name,
      price: v.price,
      lat: offsetLat,
      lng: offsetLng,
      address: `${v.city}, Morocco`,
      distanceKm: v.distanceKm,
    };
  });

  const useGPS = () => {
    setStatus("Requesting location…");
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("Location set ✅");
        setAutoList([]);
      },
      (err) => {
        setStatus(err.message || "Could not get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const pickSuggestion = (s: { label: string; lat: number; lon: number }) => {
    setAddress(s.label);
    setCoords({ lat: s.lat, lng: s.lon });
    setStatus("Location set ✅");
    setAutoList([]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />

      <section className="py-10">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Find Gyms Near You
            </h1>
            <p className="text-gray-600 font-medium mt-4 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Enter an address, hotel, or landmark—or use your current location.
            </p>
          </div>

          {/* Unified controls */}
          <div className="bg-white shadow-lg p-6 border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 relative">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Type address, hotel, or landmark (e.g., La Mamounia, Hassan II Mosque)"
                className="flex-1 px-0 py-4 border-0 border-b-2 border-gray-300 bg-transparent focus:ring-0 transition-all text-lg"
                style={{ 
                  fontFamily: 'Space Grotesk, sans-serif',
                  borderBottomColor: '#D1D5DB'
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#E3BFC0'}
                onBlur={(e) => e.target.style.borderBottomColor = '#D1D5DB'}
              />
              <button
                onClick={useGPS}
                className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Space Grotesk, sans-serif',
                  backgroundColor: '#E3BFC0'
                }}
              >
                Use My Location
              </button>

              {/* Autocomplete dropdown */}
              {(autoLoading || autoList.length > 0 || autoError) && (
                <div className="absolute left-0 right-0 top-16 z-20 bg-white shadow-lg border border-gray-200 overflow-hidden">
                  {autoLoading && (
                    <div className="px-4 py-3 text-sm text-gray-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Searching Morocco…</div>
                  )}
                  {!autoLoading && autoError && (
                    <div className="px-4 py-3 text-sm text-red-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{autoError}</div>
                  )}
                  {!autoLoading && autoList.length > 0 && (
                    <ul className="max-h-72 overflow-auto">
                      {autoList.map((s) => (
                        <li
                          key={`${s.label}-${s.lat}-${s.lon}`}
                          className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer border-t border-gray-100 first:border-t-0 font-medium"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                          onClick={() => pickSuggestion(s)}
                        >
                          {s.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Quick suggestions (Morocco-optimized fallback) */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Popular places</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPicked(s)}
                    className="text-sm px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition-colors font-medium"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map + Results side-by-side */}
          <div className="grid lg:grid-cols-2 gap-6">
            <PriceMap center={center} venues={priceVenues} />

            <div>
              <div className="flex items-baseline gap-2 mb-6">
                <div className="text-xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Nearby Gyms</div>
                <div className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {coords ? `Around your current location` : address ? `Around: ${address}` : `Default sorting`}
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                {mockVenues.map((v) => {
                  // Tier color mapping
                  const tierColors = {
                    basic: { bg: '#6BAA75', text: 'white' }, // Palm Green
                    standard: { bg: '#2A5C8D', text: 'white' }, // Majorelle Blue
                    premium: { bg: '#E28B6B', text: 'white' }, // Terracotta Coral
                    luxury: { bg: '#FFD700', text: 'black' } // Gold
                  };
                  
                  const tierColor = tierColors[v.tier as keyof typeof tierColors] || tierColors.basic;
                  
                  return (
                    <div key={v.id} className="bg-white shadow-lg overflow-hidden border border-gray-200">
                      <div className="h-36 relative overflow-hidden">
                        <img src={v.cover} alt={v.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow" 
                             style={{ 
                               fontFamily: 'Space Grotesk, sans-serif',
                               backgroundColor: tierColor.bg,
                               color: tierColor.text
                             }}>
                          {v.tier}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-white px-3 py-1 text-sm font-semibold shadow border border-gray-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {v.price} DH • {v.distanceKm} km
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{v.name}</div>
                          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{v.city}</div>
                        </div>
                        <button 
                          className="w-full text-white py-3 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                          style={{ 
                            fontFamily: 'Space Grotesk, sans-serif',
                            backgroundColor: '#E3BFC0'
                          }}
                        >
                          Book • {v.price} DH
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnifiedLocation;

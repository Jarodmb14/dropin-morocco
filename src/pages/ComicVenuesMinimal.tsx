import React, { useState, useEffect } from "react";
import SimpleHeader from "@/components/SimpleHeader";

// Import tier images
import BasicImage from "@/assets/Basic.png";
import StandardImage from "@/assets/Standard.png";
import PremiumImage from "@/assets/Premium.png";
import LuxuryImage from "@/assets/luxury.png";

// Mock gym data with proper tier system
const venues = [
  {
    id: "1",
    name: "Atlas Fitness Power",
    tier: "BASIC",
    price_per_hour: 50,
    rating: 4.5,
    review_count: 124,
    address: "Casablanca, Morocco",
    distance: "1.2 km",
    image: BasicImage,
    amenities: ["💪 Weight Room", "🏃 Cardio", "🚿 Showers", "🏊 Pool"],
    tierColor: "#6BAA75", // Palm Green
    latitude: 33.5731,
    longitude: -7.5898,
  },
  {
    id: "2",
    name: "Sahara Champions Club",
    tier: "STANDARD",
    price_per_hour: 120,
    rating: 4.8,
    review_count: 89,
    address: "Rabat, Morocco",
    distance: "2.1 km",
    image: StandardImage,
    amenities: ["💪 Weight Room", "🥊 Boxing", "🧘 Yoga", "🏊 Pool", "☕ Café"],
    tierColor: "#2A5C8D", // Majorelle Blue
    latitude: 34.0209,
    longitude: -6.8416,
  }
];

const ComicVenuesMinimal = () => {
  const [user, setUser] = useState<any>(null);

  // Load user session on component mount
  useEffect(() => {
    console.log('🎯 ComicVenuesMinimal component mounted');
    const sessionData = localStorage.getItem('supabase_session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        setUser(parsed.user);
        console.log('👤 User loaded:', parsed.user);
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    } else {
      console.log('⚠️ No session data found');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-blue-50 to-purple-100">
      <SimpleHeader />
      
      <section className="pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <div className="relative inline-block">
                <span className="text-transparent bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text drop-shadow-lg">
                  🏋️‍♂️ FITNESS POWER
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-30 rounded-lg transform rotate-1 -z-10"></div>
              </div>
            </h1>
            
            <div className="relative inline-block mt-2">
              <span className="text-gray-800 drop-shadow-lg">
                Find Your Perfect Gym Experience
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-30 rounded-lg transform rotate-1 -z-10"></div>
            </div>
          </div>

          <p className="text-xl md:text-2xl font-bold text-gray-700 mb-8">
            {user ? `Welcome back, ${user.email}!` : 'Please log in to book venues'}
          </p>

          {/* Venues Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="group bg-white/95 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-4"
                style={{ borderColor: venue.tierColor }}
              >
                {/* Tier Badge */}
                <div
                  className="absolute top-4 left-4 z-20 px-4 py-2 rounded-full font-black text-white text-sm shadow-lg transform -rotate-2"
                  style={{ backgroundColor: venue.tierColor }}
                >
                  {venue.tier}
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border-2" 
                     style={{ borderColor: venue.tierColor }}>
                  <div className="text-lg font-black" style={{ color: venue.tierColor }}>
                    {venue.price_per_hour} DH
                  </div>
                </div>

                {/* Distance Badge */}
                <div className="absolute bottom-4 left-4 z-20 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border text-white text-sm font-bold"
                     style={{ 
                       backgroundColor: venue.tierColor,
                       borderColor: venue.tierColor
                     }}>
                  📍 {venue.distance}
                </div>

                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Hover Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: venue.tierColor }}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-black mb-2 text-gray-800 group-hover:scale-105 transition-transform duration-300">
                    {venue.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(venue.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 font-bold">({venue.review_count} reviews)</span>
                  </div>

                  <p className="text-gray-600 mb-4 font-medium">📍 {venue.address}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {venue.amenities.slice(0, 3).map((amenity, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600"
                      >
                        {amenity}
                      </div>
                    ))}
                    {venue.amenities.length > 3 && (
                      <div className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                        +{venue.amenities.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => {
                      if (!user) {
                        alert('Please log in to book a venue');
                        return;
                      }
                      alert(`Booking ${venue.name} for ${venue.price_per_hour} DH`);
                    }}
                    className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: venue.tierColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    <div className="flex items-center justify-center gap-2">
                      ⚡ BOOK NOW • {venue.price_per_hour} DH
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComicVenuesMinimal;

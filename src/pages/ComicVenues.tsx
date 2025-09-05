import SimpleHeader from "@/components/SimpleHeader";

// Import tier images
import BasicImage from "@/assets/Basic.png";
import StandardImage from "@/assets/Standard.png";
import PremiumImage from "@/assets/Premium.png";
import LuxuryImage from "@/assets/luxury.png";

// Mock gym data with proper tier system
const venues = [
  {
    id: 1,
    name: "Atlas Fitness Power",
    tier: "BASIC",
    price: 50,
    rating: 4.5,
    reviews: 124,
    address: "Casablanca, Morocco",
    distance: "1.2 km",
    image: BasicImage,
    amenities: ["💪 Weight Room", "🏃 Cardio", "🚿 Showers", "🏊 Pool"],
    tierColor: "#6BAA75", // Palm Green
  },
  {
    id: 2,
    name: "Sahara Champions Club",
    tier: "STANDARD",
    price: 120,
    rating: 4.8,
    reviews: 89,
    address: "Rabat, Morocco",
    distance: "2.1 km",
    image: StandardImage,
    amenities: ["💪 Weight Room", "🥊 Boxing", "🧘 Yoga", "🏊 Pool", "☕ Café"],
    tierColor: "#2A5C8D", // Majorelle Blue
  },
  {
    id: 3,
    name: "Marrakech Elite Arena",
    tier: "PREMIUM",
    price: 250,
    rating: 4.9,
    reviews: 67,
    address: "Marrakech, Morocco",
    distance: "0.8 km",
    image: PremiumImage,
    amenities: ["💪 Premium Weights", "🥊 MMA Cage", "🧘 Spa", "🏊 Infinity Pool", "👨‍💼 Personal Trainer"],
    tierColor: "#E28B6B", // Terracotta Coral
  },
  {
    id: 4,
    name: "Royal Morocco Legends",
    tier: "LUXURY",
    price: 500,
    rating: 5.0,
    reviews: 23,
    address: "Casablanca Premium District",
    distance: "3.5 km",
    image: LuxuryImage, // Using Luxury image
    amenities: ["👑 VIP Access", "🥊 Pro Boxing Ring", "🧘 Private Spa", "🏊 Rooftop Pool", "🍾 Lounge", "👨‍💼 Elite Trainers"],
    tierColor: "#FFD700", // Gold
  }
];

const ComicVenues = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Comic Energy Bursts */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-orange-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-20 h-20 bg-blue-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-purple-400 rounded-full opacity-20 blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <div className="relative inline-block">
              <span className="text-transparent bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text drop-shadow-lg">
                CHOOSE YOUR
              </span>
            </div>
            <div className="relative inline-block mt-2">
              <span className="text-gray-800 drop-shadow-lg">
                FITNESS ARENA!
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-30 rounded-lg transform rotate-1 -z-10"></div>
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-gray-700 mb-12">
            🎯 Find gyms near you • ⚡ Instant booking • 💥 Epic workouts await!
          </p>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="relative bg-white/95 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden group cursor-pointer"
                style={{ 
                  boxShadow: `0 15px 35px ${venue.tierColor}30, 0 5px 15px ${venue.tierColor}20`
                }}
              >
                {/* Tier Badge */}
                <div 
                  className="absolute top-4 left-4 z-20 px-4 py-2 rounded-full font-black text-white text-sm shadow-lg transform -rotate-2"
                  style={{ backgroundColor: venue.tierColor }}
                >
                  {venue.tier} TIER
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border-2" 
                     style={{ borderColor: venue.tierColor }}>
                  <div className="text-lg font-black" style={{ color: venue.tierColor }}>
                    {venue.price} DH
                  </div>
                </div>

                {/* Distance Badge */}
                <div className="absolute bottom-4 left-4 z-20 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border text-white text-sm font-bold"
                     style={{ 
                       backgroundColor: `${venue.tierColor}95`,
                       borderColor: venue.tierColor
                     }}>
                  📍 {venue.distance}
                </div>

                {/* Gym Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Tier-specific overlay effect */}
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
                    <span className="ml-2 text-gray-600 font-bold">({venue.reviews} reviews)</span>
                  </div>

                  <p className="text-gray-600 mb-4 font-medium">📍 {venue.address}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {venue.amenities.slice(0, 4).map((amenity, index) => (
                      <div 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-bold border-2"
                        style={{
                          backgroundColor: `${venue.tierColor}15`,
                          borderColor: `${venue.tierColor}50`,
                          color: venue.tierColor
                        }}
                      >
                        {amenity}
                      </div>
                    ))}
                    {venue.amenities.length > 4 && (
                      <div className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                        +{venue.amenities.length - 4} more
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <button 
                    className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: venue.tierColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    <div className="flex items-center justify-center gap-2">
                      ⚡ BOOK NOW • {venue.price} DH
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Tiers Section */}
          <div className="mt-20 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <div className="relative inline-block">
                <span className="text-transparent bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text drop-shadow-lg">
                  POWER LEVELS
                </span>
                <div className="absolute -inset-4 bg-yellow-300 opacity-20 rounded-xl transform -rotate-1 -z-10"></div>
              </div>
            </h2>
            <p className="text-xl font-bold text-gray-700 mb-12">
              🎯 Choose your tier • 💥 Unlock your potential!
            </p>

            <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Basic Tier */}
              <div className="bg-white/95 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-4" style={{ borderColor: '#6BAA75' }}>
                <div className="text-white text-center py-3 font-black" style={{ backgroundColor: '#6BAA75' }}>
                  🌱 BASIC
                </div>
                <div className="p-6">
                  <div className="text-4xl mb-4">💪</div>
                  <div className="text-3xl font-black mb-2" style={{ color: '#6BAA75' }}>50 DH</div>
                  <p className="text-gray-600 mb-4">Perfect for beginners starting their fitness journey!</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#6BAA75' }}>✓</span> Basic equipment</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#6BAA75' }}>✓</span> Locker access</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#6BAA75' }}>✓</span> Shower facilities</li>
                  </ul>
                  <button className="w-full text-white py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all" style={{ backgroundColor: '#6BAA75' }}>
                    Choose Basic
                  </button>
                </div>
              </div>

              {/* Standard Tier */}
              <div className="bg-white/95 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-4 scale-105" style={{ borderColor: '#2A5C8D' }}>
                <div className="text-white text-center py-3 font-black" style={{ backgroundColor: '#2A5C8D' }}>
                  ⚡ STANDARD
                </div>
                <div className="p-6">
                  <div className="text-4xl mb-4">🏃</div>
                  <div className="text-3xl font-black mb-2" style={{ color: '#2A5C8D' }}>120 DH</div>
                  <p className="text-gray-600 mb-4">Advanced training for serious athletes!</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#2A5C8D' }}>✓</span> All Basic features</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#2A5C8D' }}>✓</span> Premium equipment</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#2A5C8D' }}>✓</span> Group classes</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#2A5C8D' }}>✓</span> Nutritionist advice</li>
                  </ul>
                  <button className="w-full text-white py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all" style={{ backgroundColor: '#2A5C8D' }}>
                    Choose Standard
                  </button>
                </div>
              </div>

              {/* Premium Tier */}
              <div className="bg-white/95 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-4" style={{ borderColor: '#E28B6B' }}>
                <div className="text-white text-center py-3 font-black" style={{ backgroundColor: '#E28B6B' }}>
                  🏆 PREMIUM
                </div>
                <div className="p-6">
                  <div className="text-4xl mb-4">🥊</div>
                  <div className="text-3xl font-black mb-2" style={{ color: '#E28B6B' }}>250 DH</div>
                  <p className="text-gray-600 mb-4">Elite training for champions!</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#E28B6B' }}>✓</span> All Standard features</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#E28B6B' }}>✓</span> Personal trainer</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#E28B6B' }}>✓</span> Spa access</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#E28B6B' }}>✓</span> Priority booking</li>
                  </ul>
                  <button className="w-full text-white py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all" style={{ backgroundColor: '#E28B6B' }}>
                    Choose Premium
                  </button>
                </div>
              </div>

              {/* Luxury Tier */}
              <div className="bg-white/95 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-4" style={{ borderColor: '#FFD700' }}>
                <div className="text-black text-center py-3 font-black" style={{ backgroundColor: '#FFD700' }}>
                  👑 LUXURY
                </div>
                <div className="p-6">
                  <div className="text-4xl mb-4">🌟</div>
                  <div className="text-3xl font-black mb-2" style={{ color: '#FFD700' }}>500 DH</div>
                  <p className="text-gray-600 mb-4">Ultimate luxury fitness experience!</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#FFD700' }}>✓</span> All Premium features</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#FFD700' }}>✓</span> VIP lounge access</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#FFD700' }}>✓</span> Elite personal trainer</li>
                    <li className="flex items-center"><span className="mr-2" style={{ color: '#FFD700' }}>✓</span> Unlimited everything</li>
                  </ul>
                  <button className="w-full text-black py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all" style={{ backgroundColor: '#FFD700' }}>
                    Choose Luxury
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComicVenues;

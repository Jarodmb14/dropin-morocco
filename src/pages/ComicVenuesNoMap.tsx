import React, { useState, useEffect } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { LocationSearch } from "@/components/LocationSearch";
import { QRCodeGenerator } from "@/lib/qr-code";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { QRScanner } from "@/components/QRScanner";

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
  },
  {
    id: "3",
    name: "Marrakech Elite Arena",
    tier: "PREMIUM",
    price_per_hour: 250,
    rating: 4.9,
    review_count: 67,
    address: "Marrakech, Morocco",
    distance: "0.8 km",
    image: PremiumImage,
    amenities: ["💪 Premium Weights", "🥊 MMA Cage", "🧘 Spa", "🏊 Infinity Pool", "👨‍💼 Personal Trainer"],
    tierColor: "#E28B6B", // Terracotta Coral
    latitude: 31.6295,
    longitude: -7.9811,
  },
  {
    id: "4",
    name: "Royal Morocco Legends",
    tier: "LUXURY",
    price_per_hour: 500,
    rating: 5.0,
    review_count: 23,
    address: "Casablanca Premium District",
    distance: "3.5 km",
    image: LuxuryImage, // Using Luxury image
    amenities: ["👑 VIP Access", "🥊 Pro Boxing Ring", "🧘 Private Spa", "🏊 Rooftop Pool", "🍾 Lounge", "👨‍💼 Elite Trainers"],
    tierColor: "#FFD700", // Gold
    latitude: 33.5731,
    longitude: -7.5898,
  }
];

const ComicVenuesNoMap = () => {
  // State management
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [filteredGyms, setFilteredGyms] = useState(venues);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [qrCodeData, setQrCodeData] = useState<any>(null);

  // Load user session on component mount
  useEffect(() => {
    console.log('🎯 ComicVenuesNoMap component mounted');
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

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle location selection from search
  const handleLocationSelect = (location: any) => {
    console.log('📍 Location selected:', location);
    setCurrentLocation({ lat: location.lat, lng: location.lng });

    // Filter gyms within 10km radius
    const nearbyGyms = venues.filter(venue => {
      const distance = calculateDistance(location.lat, location.lng, venue.latitude, venue.longitude);
      return distance <= 10; // 10km radius
    });

    setFilteredGyms(nearbyGyms);
    alert(`Found ${nearbyGyms.length} gyms within 10km of ${location.name}!`);
  };

  // Handle GPS location
  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('🌍 GPS Location:', { latitude, longitude });
        setCurrentLocation({ lat: latitude, lng: longitude });

        // Filter gyms within 10km radius
        const nearbyGyms = venues.filter(venue => {
          const distance = calculateDistance(latitude, longitude, venue.latitude, venue.longitude);
          return distance <= 10;
        });

        setFilteredGyms(nearbyGyms);
        alert(`Found ${nearbyGyms.length} gyms within 10km of your location!`);
      },
      (error) => {
        console.error('GPS Error:', error);
        alert('Unable to get your location. Please try again or search for an address.');
      }
    );
  };

  // Handle venue booking
  const handleBookVenue = (venue: any) => {
    if (!user) {
      alert('Please log in to book a venue');
      return;
    }
    setSelectedVenue(venue);
    setShowBookingModal(true);
  };

  // Create booking
  const createBooking = async (venue: any, date: string, time: string, duration: number) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('supabase_session') || '{}');
      const accessToken = sessionData.access_token;

      const bookingData = {
        user_id: user.id,
        club_id: venue.id.toString(),
        booking_date: date,
        booking_time: time,
        duration_hours: duration,
        status: 'PENDING',
        total_price: venue.price_per_hour * duration
      };

      const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MDAsImV4cCI6MjA1MDU1MDgwMH0.8JZJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ'
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        
        // Generate QR code
        const qrData = QRCodeGenerator.generateBookingQRData({
          id: booking.id,
          user_id: user.id,
          club_id: venue.id,
          scheduled_start: `${date}T${time}:00`,
          scheduled_end: `${date}T${parseInt(time.split(':')[0]) + duration}:00`,
          status: 'PENDING'
        });
        
        setQrCodeData(qrData);
        setShowBookingModal(false);
        alert('Booking created successfully! Your QR code is ready.');
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

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

          {/* Location Search */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/95 rounded-3xl shadow-xl p-6">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  onGPSLocation={handleGPSLocation}
                  className="w-full"
                />
              </div>
              <div className="bg-white/95 rounded-3xl shadow-xl p-6 flex items-center justify-center">
                <button
                  onClick={() => alert('Map temporarily disabled - debugging MapView component')}
                  className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 hover:from-orange-600 hover:via-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🗺️ Show Map (Debug Mode)
                </button>
              </div>
            </div>
          </div>

          {/* Venues Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredGyms.map((venue) => (
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
                    onClick={() => handleBookVenue(venue)}
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

      {/* Booking Modal */}
      {showBookingModal && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-black mb-4 text-center" style={{ color: selectedVenue.tierColor }}>
              Book {selectedVenue.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2"
                  style={{ borderColor: selectedVenue.tierColor }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                <select className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2" style={{ borderColor: selectedVenue.tierColor }}>
                  <option>09:00</option>
                  <option>10:00</option>
                  <option>11:00</option>
                  <option>12:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                  <option>18:00</option>
                  <option>19:00</option>
                  <option>20:00</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duration (hours)</label>
                <select className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2" style={{ borderColor: selectedVenue.tierColor }}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 rounded-xl font-bold border-2 text-gray-700 hover:bg-gray-50"
                style={{ borderColor: selectedVenue.tierColor }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value;
                  const time = (document.querySelector('select') as HTMLSelectElement)?.value;
                  const duration = parseInt((document.querySelectorAll('select')[1] as HTMLSelectElement)?.value || '1');
                  
                  if (date && time && duration) {
                    createBooking(selectedVenue, date, time, duration);
                  } else {
                    alert('Please fill in all fields');
                  }
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90"
                style={{ backgroundColor: selectedVenue.tierColor }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Display Modal */}
      {qrCodeData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-black mb-4 text-center text-gray-800">
              🎯 Your Booking QR Code
            </h3>
            
            <QRCodeDisplay booking={qrCodeData} />
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setQrCodeData(null)}
                className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 hover:from-orange-600 hover:via-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-black mb-4 text-center text-gray-800">
              📱 Scan QR Code
            </h3>
            
            <QRScanner 
              onQRCodeScanned={(result) => {
                console.log('QR Code scanned:', result);
                alert('QR Code scanned successfully!');
                setShowQRScanner(false);
              }}
              onClose={() => setShowQRScanner(false)}
            />
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowQRScanner(false)}
                className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 hover:from-orange-600 hover:via-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating QR Scanner Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowQRScanner(true)}
          className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 hover:from-orange-600 hover:via-blue-600 hover:to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-2xl">📱</span>
        </button>
      </div>
    </div>
  );
};

export default ComicVenuesNoMap;

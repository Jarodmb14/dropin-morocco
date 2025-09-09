import SimpleHeader from "@/components/SimpleHeader";
import zellige from "@/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg";
import { useNavigate } from "react-router-dom";

const ComicHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      
      {/* Zellige side borders */}
      <div
        className="absolute top-0 bottom-0 left-0 w-16 opacity-15 z-10"
        style={{
          backgroundImage: `url(${zellige})`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'left top',
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-16 opacity-15 z-10"
        style={{
          backgroundImage: `url(${zellige})`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'right top',
        }}
      />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-purple-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-pink-300 rounded-full opacity-20 animate-pulse delay-500"></div>
        
        {/* Comic-style action lines */}
        <div className="absolute top-32 left-1/2 w-32 h-1 bg-gradient-to-r from-orange-400 to-transparent transform rotate-12 opacity-30"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-1 bg-gradient-to-r from-blue-400 to-transparent transform -rotate-12 opacity-30"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="mb-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-8 py-3 rounded-full font-black text-lg border-4 border-red-600 transform rotate-1 shadow-lg">
              🇲🇦 MOROCCO'S #1 FITNESS APP!
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <div className="relative inline-block">
              <span className="text-transparent bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text drop-shadow-lg">
                DROP-IN
              </span>
              <div className="absolute -inset-4 bg-yellow-300 opacity-30 rounded-xl transform -rotate-1 -z-10"></div>
            </div>
            <div className="relative inline-block mt-4">
              <span className="text-gray-800 drop-shadow-lg">
                3 STEPS!
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-red-300 opacity-40 rounded-lg transform rotate-1 -z-10"></div>
            </div>
          </h1>


          {/* Action Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative bg-white/95 p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                1
              </div>
              <div className="text-6xl mb-6 text-center">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Choose Gym</h3>
              <p className="text-gray-600 text-base text-center leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Find the perfect gym near you with our interactive map</p>
              <div className="mt-6 w-full h-1 bg-gray-200 rounded-full">
                <div className="h-full bg-gray-800 rounded-full w-1/3"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white/95 p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                2
              </div>
              <div className="text-6xl mb-6 text-center">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Get QR Code</h3>
              <p className="text-gray-600 text-base text-center leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Instant QR code delivered right to your phone</p>
              <div className="mt-6 w-full h-1 bg-gray-200 rounded-full">
                <div className="h-full bg-gray-800 rounded-full w-2/3"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white/95 p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                3
              </div>
              <div className="text-6xl mb-6 text-center">💪</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Work Out</h3>
              <p className="text-gray-600 text-base text-center leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Scan and start your epic fitness journey</p>
              <div className="mt-6 w-full h-1 bg-gray-200 rounded-full">
                <div className="h-full bg-gray-800 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              className="text-white px-12 py-6 text-2xl font-bold hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif',
                backgroundColor: '#E3BFC0'
              }}
              onClick={() => navigate('/venues')}
            >
              START NOW
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="bg-white px-8 py-6 shadow-lg border border-gray-200">
              <span className="text-2xl mr-3">💪</span>
              <span className="font-bold text-gray-800 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>1000+ Athletes</span>
            </div>
            <div className="bg-white px-8 py-6 shadow-lg border border-gray-200">
              <span className="text-2xl mr-3">⭐</span>
              <span className="font-bold text-gray-800 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>4.9/5 Rating</span>
            </div>
            <div className="bg-white px-8 py-6 shadow-lg border border-gray-200">
              <span className="text-2xl mr-3">🏢</span>
              <span className="font-bold text-gray-800 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>150+ Gyms</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComicHomepage;

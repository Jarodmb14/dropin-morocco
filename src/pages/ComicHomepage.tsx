import SimpleHeader from "@/components/SimpleHeader";
import zellige from "@/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg";
import { useNavigate } from "react-router-dom";

const ComicHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-white">
      <SimpleHeader />
      
      {/* Minimalist background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Very subtle geometric patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-3" style={{ backgroundColor: '#E3BFC0' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-2" style={{ backgroundColor: '#E3BFC0' }}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full opacity-3" style={{ backgroundColor: '#E3BFC0' }}></div>
        <div className="absolute top-60 left-1/3 w-16 h-16 rounded-full opacity-2" style={{ backgroundColor: '#E3BFC0' }}></div>
        
        {/* Minimalist grid pattern */}
        <div className="absolute inset-0 opacity-2" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(227, 191, 192, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Professional Badge */}
          <div className="mb-12 flex items-center justify-center">
            <div className="text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg border" style={{ 
              backgroundColor: '#E3BFC0',
              borderColor: '#E3BFC0'
            }}>
              🇲🇦 Morocco's Premier Fitness Platform
            </div>
          </div>

          {/* Professional Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <div className="relative inline-block mb-6">
              <span className="text-gray-800 font-light tracking-wider">
                DROP-IN
              </span>
            </div>
            <div className="relative inline-block">
              <span className="text-gray-600 font-medium tracking-wide text-2xl md:text-3xl">
                SIMPLE • FAST • EFFICIENT
              </span>
            </div>
          </h1>
          
          {/* Professional Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Connect with premium fitness facilities across Morocco. Book your workout session in seconds with our streamlined platform.
          </p>


          {/* Professional Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg font-bold text-lg mb-6 mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                1
              </div>
              <div className="text-4xl mb-6 text-center">🎯</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Select Location</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Browse premium fitness facilities in your area using our interactive map</p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg font-bold text-lg mb-6 mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                2
              </div>
              <div className="text-4xl mb-6 text-center">📱</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Instant Booking</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Receive your digital access pass immediately via QR code</p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg font-bold text-lg mb-6 mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                3
              </div>
              <div className="text-4xl mb-6 text-center">💪</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Start Training</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Scan and access world-class facilities for your fitness journey</p>
            </div>
          </div>

          {/* Professional CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button 
              className="text-white px-12 py-4 text-lg font-semibold transition-all duration-200 rounded-lg shadow-lg"
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif',
                backgroundColor: '#E3BFC0'
              }}
              onClick={() => navigate('/venues')}
            >
              Explore Facilities
            </button>
            <button 
              className="border-2 px-12 py-4 text-lg font-semibold transition-all duration-200 rounded-lg"
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif',
                borderColor: '#E3BFC0',
                color: '#E3BFC0',
                backgroundColor: 'transparent'
              }}
              onClick={() => navigate('/training')}
            >
              View Training
            </button>
          </div>


          {/* Professional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
              <div className="text-3xl mb-4">💪</div>
              <div className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>1,000+</div>
              <div className="text-gray-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Active Members</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
              <div className="text-3xl mb-4">⭐</div>
              <div className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>4.9/5</div>
              <div className="text-gray-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>User Rating</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
              <div className="text-3xl mb-4">🏢</div>
              <div className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>150+</div>
              <div className="text-gray-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Partner Facilities</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComicHomepage;

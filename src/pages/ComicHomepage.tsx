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
          {/* Elegant Floating Elements */}
          <div className="mb-12 relative">
            {/* Floating Geometric Circle */}
            <div className="absolute top-2 left-1/4 w-6 h-6 opacity-8 animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }}>
              <div className="w-full h-full border border-gray-300 rounded-full"></div>
            </div>
            
            {/* Floating Elegant Line */}
            <div className="absolute top-8 right-1/3 w-16 h-0.5 opacity-6 animate-float" style={{ animationDelay: '3s', animationDuration: '12s' }}>
              <div className="w-full h-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            
            {/* Floating Minimalist Square */}
            <div className="absolute top-16 left-1/2 w-4 h-4 opacity-10 animate-float" style={{ animationDelay: '6s', animationDuration: '10s' }}>
              <div className="w-full h-full border border-gray-400 transform rotate-45"></div>
            </div>
            
            {/* Floating Subtle Dot */}
            <div className="absolute top-4 right-1/4 w-2 h-2 opacity-12 animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}>
              <div className="w-full h-full bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Floating Elegant Curve */}
            <div className="absolute top-12 left-1/3 w-12 h-8 opacity-5 animate-float" style={{ animationDelay: '4s', animationDuration: '15s' }}>
              <div className="w-full h-full">
                <svg viewBox="0 0 48 32" className="w-full h-full">
                  <path d="M4 16 Q24 4 44 16" stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-300"/>
                </svg>
              </div>
            </div>
            
            {/* Floating Minimalist Triangle */}
            <div className="absolute top-20 left-1/5 w-5 h-5 opacity-8 animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }}>
              <div className="w-full h-full">
                <svg viewBox="0 0 20 20" className="w-full h-full">
                  <polygon points="10,2 18,18 2,18" stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-300"/>
                </svg>
              </div>
            </div>
            
            {/* Floating Subtle Diamond */}
            <div className="absolute top-6 left-2/3 w-3 h-3 opacity-7 animate-float" style={{ animationDelay: '5s', animationDuration: '11s' }}>
              <div className="w-full h-full border border-gray-400 transform rotate-45"></div>
            </div>
          </div>

          {/* Sophisticated Main Title */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-light mb-6 leading-none">
              <span className="block text-gray-900 tracking-[0.15em]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                DROP-IN
              </span>
              <span className="block text-2xl md:text-3xl text-gray-500 font-normal tracking-[0.25em] mt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                MOROCCO
              </span>
            </h1>
            
            {/* Elegant Tagline */}
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="h-px bg-gray-300 flex-1 max-w-24"></div>
              <span className="text-lg font-light text-gray-600 tracking-wider uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Premium Fitness Access
              </span>
              <div className="h-px bg-gray-300 flex-1 max-w-24"></div>
            </div>
          </div>
          
          {/* Sophisticated Subtitle */}
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Experience seamless access to Morocco's finest fitness facilities. 
              <span className="block mt-3 text-lg text-gray-600">
                Book, arrive, train — all in one elegant platform.
              </span>
            </p>
            
            {/* Elegant Feature Highlights */}
            <div className="flex justify-center items-center space-x-12 text-sm text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span>Instant Access</span>
              <span>•</span>
              <span>Premium Venues</span>
              <span>•</span>
              <span>Digital Pass</span>
            </div>
          </div>


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

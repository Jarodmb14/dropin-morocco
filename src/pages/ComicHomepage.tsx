import SimpleHeader from "@/components/SimpleHeader";
import zellige from "@/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg";
import { useNavigate } from "react-router-dom";

const ComicHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <SimpleHeader />
      
      {/* Subtle colored background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle colored geometric patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-60 left-1/3 w-16 h-16 bg-rose-100 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-100 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-80 right-1/4 w-20 h-20 bg-teal-100 rounded-full opacity-15 blur-xl"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Professional Badge */}
          <div className="mb-12 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg border border-blue-500/20">
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 rounded-lg shadow-lg"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={() => navigate('/venues')}
            >
              Explore Facilities
            </button>
            <button 
              className="border-2 border-blue-600 text-blue-600 px-12 py-4 text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 rounded-lg"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
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

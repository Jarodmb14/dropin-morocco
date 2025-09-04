import SimpleHeader from "@/components/SimpleHeader";

const ComicHomepage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E3BFC0' }}>
      <SimpleHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Moroccan Cultural Photos */}
          <div className="absolute inset-0 grid grid-cols-3 gap-8 p-8 opacity-15">
            <div className="relative overflow-hidden rounded-2xl transform rotate-2">
              <img 
                src="/src/assets/pexels-yassine-benmoussa-1650792656-28293177.jpg"
                alt="Morocco Culture"
                className="w-full h-64 object-cover filter blur-sm"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl transform -rotate-1 mt-16">
              <img 
                src="/src/assets/pexels-samiro-2215787 (1).jpg"
                alt="Morocco Architecture"
                className="w-full h-64 object-cover filter blur-sm"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl transform rotate-1 mt-8">
              <img 
                src="/src/assets/pexels-rasabromeo-2963873-11566277.jpg"
                alt="Morocco Lifestyle"
                className="w-full h-64 object-cover filter blur-sm"
              />
            </div>
          </div>

          {/* Moroccan Zellige Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url('/src/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg')`,
            backgroundSize: '100px 100px',
            backgroundRepeat: 'repeat'
          }} />

          {/* Energy Bursts */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-30 blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-400 rounded-full opacity-30 blur-2xl animate-pulse delay-2000"></div>
        </div>

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
                FITNESS POWER
              </span>
              <div className="absolute -inset-4 bg-yellow-300 opacity-30 rounded-xl transform -rotate-1 -z-10"></div>
            </div>
            <div className="relative inline-block mt-4">
              <span className="text-gray-800 drop-shadow-lg">
                IN 3 STEPS!
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-red-300 opacity-40 rounded-lg transform rotate-1 -z-10"></div>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-16 max-w-4xl mx-auto">
            💪 <span className="text-orange-600">PICK YOUR GYM</span> → 
            📱 <span className="text-blue-600">GET QR CODE</span> → 
            🔥 <span className="text-purple-600">START TRAINING!</span>
          </p>

          {/* Action Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-orange-200">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-600">1. CHOOSE GYM</h3>
              <p className="text-gray-600 text-lg">Find the perfect gym near you with our interactive map!</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-blue-200">
              <div className="text-6xl mb-6">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">2. GET QR CODE</h3>
              <p className="text-gray-600 text-lg">Instant QR code delivered right to your phone!</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-purple-200">
              <div className="text-6xl mb-6">💥</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">3. WORK OUT!</h3>
              <p className="text-gray-600 text-lg">Scan and start your epic fitness journey!</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 text-white px-12 py-6 rounded-2xl text-2xl font-black hover:scale-105 transform transition-all shadow-2xl">
              🚀 START NOW!
            </button>
            <button className="border-4 border-orange-500 text-orange-600 bg-white px-12 py-6 rounded-2xl text-2xl font-black hover:bg-orange-50 hover:scale-105 transform transition-all">
              📍 FIND GYMS
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="bg-white/80 px-6 py-4 rounded-full shadow-lg border-2 border-orange-300">
              <span className="text-2xl mr-2">💪</span>
              <span className="font-bold text-gray-700">1000+ Athletes</span>
            </div>
            <div className="bg-white/80 px-6 py-4 rounded-full shadow-lg border-2 border-blue-300">
              <span className="text-2xl mr-2">⭐</span>
              <span className="font-bold text-gray-700">4.9/5 Rating</span>
            </div>
            <div className="bg-white/80 px-6 py-4 rounded-full shadow-lg border-2 border-purple-300">
              <span className="text-2xl mr-2">🏢</span>
              <span className="font-bold text-gray-700">150+ Gyms</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComicHomepage;

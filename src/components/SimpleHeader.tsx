const SimpleHeader = () => {
  return (
    <header className="relative shadow-lg border-b-4 border-orange-500 overflow-hidden">
      {/* Zellige Pattern Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url('/src/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg')`,
        backgroundSize: '120px 120px',
        backgroundRepeat: 'repeat',
        opacity: 0.8
      }} />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
      
      <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/src/assets/logo.svg" 
              alt="Drop-In Morocco Logo" 
              className="w-10 h-10 object-contain filter drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text">
              DROP-IN
            </h1>
            <p className="text-red-600 font-bold text-sm">🇲🇦 MOROCCO FITNESS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transform hover:scale-105 transition-all">
            💪 GYMS
          </button>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transform hover:scale-105 transition-all">
            🏃 ACTIVITIES
          </button>
          <button className="bg-purple-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-600 transform hover:scale-105 transition-all">
            ⚡ HOW IT WORKS
          </button>
        </nav>

        {/* CTA Button */}
        <button className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transform transition-all shadow-lg">
          🔥 LET'S GO!
        </button>
      </div>
    </header>
  );
};

export default SimpleHeader;

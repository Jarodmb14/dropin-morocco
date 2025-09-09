import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, Target, Trophy, Flame, Sparkles, Wind, Leaf } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Comic-style hero background with Moroccan imagery */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-blue-50 to-purple-100" />
        
        {/* Moroccan cultural photo collage */}
        <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 opacity-20">
          <div className="relative overflow-hidden rounded-xl transform rotate-2">
            <img 
              src="src/assets/pexels-yassine-benmoussa-1650792656-28293177.jpg"
              alt="Morocco Culture"
              className="w-full h-48 object-cover filter blur-sm"
            />
          </div>
          <div className="relative overflow-hidden rounded-xl transform -rotate-1 mt-16">
            <img 
              src="src/assets/pexels-samiro-2215787 (1).jpg"
              alt="Morocco Architecture"
              className="w-full h-48 object-cover filter blur-sm"
            />
          </div>
          <div className="relative overflow-hidden rounded-xl transform rotate-1 mt-8">
            <img 
              src="src/assets/pexels-rasabromeo-2963873-11566277.jpg"
              alt="Morocco Lifestyle"
              className="w-full h-48 object-cover filter blur-sm"
            />
          </div>
        </div>
        
        {/* Comic-style energy bursts */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full animate-pulse opacity-40" style={{ 
          background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
          filter: 'blur(15px)'
        }} />
        <div className="absolute bottom-32 right-24 w-24 h-24 rounded-full animate-pulse delay-1000 opacity-40" style={{ 
          background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)',
          filter: 'blur(12px)'
        }} />
        <div className="absolute top-1/2 right-16 w-20 h-20 rounded-full animate-pulse delay-2000 opacity-40" style={{ 
          background: 'radial-gradient(circle, #6F42C1 0%, transparent 70%)',
          filter: 'blur(10px)'
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
            <div 
              className="font-black text-lg px-6 py-3 rounded-full border-4 border-red-600 shadow-lg transform rotate-1 bg-gradient-to-r from-red-500 to-yellow-500 text-white"
            >
              🇲🇦 MOROCCO'S #1 FITNESS APP! 
            </div>
            <Flame className="w-8 h-8 text-red-500 animate-bounce delay-200" />
          </div>
          
          <h1 className="mb-10 text-5xl font-black leading-tight md:text-8xl tracking-tight">
            <div className="relative inline-block">
              <span 
                className="block drop-shadow-2xl bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"
                style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.3)' }}
              >
                FITNESS POWER
              </span>
              {/* Comic-style action effect */}
              <div className="absolute -inset-4 bg-yellow-300 opacity-30 rounded-xl transform -rotate-1 -z-10" />
            </div>
            <div className="relative inline-block mt-4">
              <span 
                className="block text-gray-800 drop-shadow-2xl"
                style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.2)' }}
              >
                IN 3 STEPS!
              </span>
              {/* Comic burst effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-red-300 opacity-40 rounded-lg transform rotate-1 -z-10" />
            </div>
            <div className="flex items-center justify-center mt-6 gap-4">
              <Trophy className="w-12 h-12 text-yellow-500 animate-pulse drop-shadow-lg" />
              <Target className="w-12 h-12 text-blue-500 animate-pulse delay-300 drop-shadow-lg" />
              <Zap className="w-12 h-12 text-purple-500 animate-pulse delay-600 drop-shadow-lg" />
            </div>
          </h1>
          
          <p className="mb-16 text-xl md:text-3xl max-w-4xl mx-auto text-gray-700 leading-relaxed font-bold drop-shadow-md">
            💪 <span className="text-orange-600">PICK YOUR GYM</span> → 
            📱 <span className="text-blue-600">GET QR CODE</span> → 
            🔥 <span className="text-purple-600">START TRAINING!</span>
          </p>

          {/* Magical Action Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-amber-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-3xl" />
              <div className="relative">
                <div className="text-6xl mb-6">🌸</div>
                <h3 className="font-bold text-xl mb-3 text-stone-800">Choose Your Path</h3>
                <p className="text-stone-600 leading-relaxed">Select from single visits, gentle packs, or unlimited wellness journeys</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-rose-50/50 rounded-3xl" />
              <div className="relative">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="font-bold text-xl mb-3 text-stone-800">Receive Your Key</h3>
                <p className="text-stone-600 leading-relaxed">A magical key appears instantly in your device</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-3xl" />
              <div className="relative">
                <div className="text-6xl mb-6">🧘</div>
                <h3 className="font-bold text-xl mb-3 text-stone-800">Begin Your Journey</h3>
                <p className="text-stone-600 leading-relaxed">Enter any sanctuary and let transformation begin</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <Button 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white px-10 py-6 h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-lg font-medium relative overflow-hidden"
              onClick={() => navigate('/venues')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Start Now
                <Wind className="w-6 h-6" />
              </div>
            </Button>
          </div>

          {/* Gentle Stats */}
          <div className="flex flex-wrap justify-center gap-12 text-stone-600">
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-200">
              <span className="text-3xl">🌿</span>
              <span className="font-medium">1000+ Peaceful Souls</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-200">
              <span className="text-3xl">⭐</span>
              <span className="font-medium">4.9/5 Harmony Rating</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-rose-200">
              <span className="text-3xl">🏛️</span>
              <span className="font-medium">150+ Sacred Spaces</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wind, Leaf } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Magical floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-16 w-24 h-24 bg-gradient-to-br from-amber-300/30 to-orange-300/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-48 right-24 w-16 h-16 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-48 left-1/3 w-20 h-20 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-xl animate-pulse delay-2000" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-amber-700 font-medium bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full border border-amber-200">
              Available across magical Morocco
            </span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          
          <h1 className="mb-8 text-4xl font-bold leading-tight md:text-7xl">
            <span className="block text-stone-800 mb-2">Wellness Freedom in</span>
            <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              3 Gentle Steps
            </span>
            <div className="flex items-center justify-center mt-4 gap-2">
              <Wind className="w-8 h-8 text-amber-500 animate-pulse" />
              <span className="text-2xl">🌸</span>
              <Leaf className="w-8 h-8 text-emerald-500 animate-pulse delay-500" />
            </div>
          </h1>
          
          <p className="mb-16 text-xl md:text-2xl max-w-3xl mx-auto text-stone-600 leading-relaxed font-medium">
            🌿 Choose your sanctuary → ✨ Receive your key → 🧘 Begin your journey of transformation
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

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white px-10 py-6 h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-lg font-medium relative overflow-hidden"
              onClick={() => window.location.href = '/venues'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Discover Sanctuaries
                <Wind className="w-6 h-6" />
              </div>
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-10 py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
              onClick={() => navigate('/business-rules-test')}
            >
              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6" />
                Explore Our Magic
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
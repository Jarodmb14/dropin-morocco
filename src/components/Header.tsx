import { Button } from "@/components/ui/button";
import { Menu, Zap, Target } from "lucide-react";
import { themeTokens } from "@/lib/theme/tokens";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-4 border-orange-400 shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Your custom logo */}
            <div className="flex h-12 w-12 items-center justify-center">
              <img 
                src="/src/assets/logo.svg" 
                alt="Drop-In Morocco Logo" 
                className="h-10 w-10 object-contain"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
              />
            </div>
            {/* Comic-style energy effect */}
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Zap className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
            </div>
          </div>
          <div>
            <span 
              className="text-3xl font-black tracking-tight drop-shadow-lg"
              style={{ 
                background: themeTokens.gradients.energetic,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              DROP-IN
            </span>
            <div className="text-sm font-bold text-red-600 tracking-wide">🇲🇦 MOROCCO FITNESS</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-3">
          <Button 
            variant="ghost" 
            className="font-bold text-gray-700 hover:text-white hover:bg-orange-500 rounded-lg px-4 py-2 transition-all duration-200 transform hover:scale-105"
          >
            💪 GYMS
          </Button>
          <Button 
            variant="ghost" 
            className="font-bold text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg px-4 py-2 transition-all duration-200 transform hover:scale-105"
          >
            🏃 ACTIVITIES
          </Button>
          <Button 
            variant="ghost" 
            className="font-bold text-gray-700 hover:text-white hover:bg-purple-500 rounded-lg px-4 py-2 transition-all duration-200 transform hover:scale-105"
          >
            ⚡ HOW IT WORKS
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex font-bold text-gray-700 hover:text-white hover:bg-green-500 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🤝 PARTNER UP
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="font-bold rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 transform hover:scale-105"
          >
            🔥 SIGN IN
          </Button>
          <Button 
            className="font-bold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            style={{ 
              background: themeTokens.gradients.energetic
            }}
            size="sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              LET'S GO!
            </div>
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden text-gray-700 hover:bg-orange-500 hover:text-white rounded-lg transition-all duration-200">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
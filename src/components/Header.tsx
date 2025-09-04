import { Button } from "@/components/ui/button";
import { Menu, Sparkles, Wind } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-amber-100/50">
      <div className="container mx-auto flex h-18 items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-lg">
              <span className="text-lg font-bold text-white">🌸</span>
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Drop-In
            </span>
            <div className="text-xs text-stone-500 font-medium">Morocco Wellness</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" className="text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl px-4 py-2">
            🏛️ Sanctuaries
          </Button>
          <Button variant="ghost" className="text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl px-4 py-2">
            🧘 Practices
          </Button>
          <Button variant="ghost" className="text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl px-4 py-2">
            ✨ Our Magic
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl"
          >
            🤝 Join Our Circle
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl"
          >
            🌿 Sign In
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            size="sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Begin Journey
            </div>
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden text-stone-600 hover:bg-amber-50 rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
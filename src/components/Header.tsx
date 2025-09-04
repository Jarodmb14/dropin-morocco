import { Button } from "@/components/ui/button";
import { Menu, Sparkles, Wind } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
      <div className="container mx-auto flex h-18 items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #E3BFC0 0%, #6BAA75 50%, #2A5C8D 100%)' }}>
              <span className="text-lg font-bold text-white">🌸</span>
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 animate-pulse" style={{ color: '#6BAA75' }} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ 
              backgroundImage: 'linear-gradient(to right, #6BAA75, #2A5C8D, #E28B6B)' 
            }}>
              Drop-In
            </span>
            <div className="text-xs font-medium" style={{ color: '#7D6B70' }}>Morocco Wellness</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" className="rounded-xl px-4 py-2 transition-all duration-200" style={{ 
            color: '#7D6B70',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6BAA75';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.color = '#7D6B70';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            🏛️ Sanctuaries
          </Button>
          <Button variant="ghost" className="rounded-xl px-4 py-2 transition-all duration-200" style={{ 
            color: '#7D6B70',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2A5C8D';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.color = '#7D6B70';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            🧘 Practices
          </Button>
          <Button variant="ghost" className="rounded-xl px-4 py-2 transition-all duration-200" style={{ 
            color: '#7D6B70',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.color = '#E28B6B';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.color = '#7D6B70';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            ✨ Our Magic
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex rounded-xl transition-all duration-200"
            style={{ color: '#7D6B70' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6BAA75';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#7D6B70';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            🤝 Join Our Circle
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-xl border-2 hover:bg-white/50 transition-all duration-200"
            style={{ 
              borderColor: '#6BAA75',
              color: '#6BAA75'
            }}
          >
            🌿 Sign In
          </Button>
          <Button 
            className="text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #6BAA75 0%, #2A5C8D 50%, #E28B6B 100%)'
            }}
            size="sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Begin Journey
            </div>
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl transition-all duration-200" style={{ color: '#7D6B70' }}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { Button } from "@/components/ui/button";
import { Menu, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/Logo.svg";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-300 shadow" style={{ backgroundColor: '#E3BFC0' }}>
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        {/* Logo takes 1/4 of header width */}
        <div className="flex items-center justify-center" style={{ width: '25%' }}>
          <img src={logo} alt="Drop-In Morocco" className="h-16 w-auto object-contain" />
          <span className="sr-only">Drop-In Morocco</span>
        </div>

        {/* Navigation and CTA on the right with good contrast */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost"
            className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100"
            onClick={() => navigate("/qr-scanner")}
          >
            📱 SCANNER
          </Button>
          <Button 
            variant="ghost"
            className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100"
            onClick={() => navigate("/owner")}
          >
            🏛️ OWNER
          </Button>
        </div>

        {/* Mobile menu icon */}
        <Button variant="ghost" size="icon" className="md:hidden text-gray-900 bg-white/80 border border-gray-200 rounded-lg">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
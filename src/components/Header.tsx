import { Button } from "@/components/ui/button";
import { MapPin, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-sm font-bold text-primary-foreground">D</span>
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Drop-In
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            Browse Clubs
          </Button>
          <Button variant="ghost" className="text-foreground">
            Activities
          </Button>
          <Button variant="ghost" className="text-foreground">
            How it Works
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Become a Partner
          </Button>
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            Get Started
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
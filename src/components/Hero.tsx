import { Button } from "@/components/ui/button";
import { MapPin, Star, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Modern fitness center with Moroccan architecture" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center space-x-2 text-primary-foreground/90">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">Available across Morocco</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
            Your Gateway to
            <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              Fitness Freedom
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl max-w-2xl">
            Access premium gyms, spas, and outdoor adventures across Morocco with no commitments. 
            One platform, endless possibilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Start Exploring
            </Button>
            <Button variant="glass" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-primary-foreground/90">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-warm border-2 border-primary-foreground"></div>
                ))}
              </div>
              <span className="text-sm font-medium">1000+ Happy Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">150+ Partner Venues</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-accent font-medium">
            🇲🇦 Available across Morocco
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Fitness Freedom in 
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              3 Simple Steps! 🏃‍♂️
            </span>
          </h1>
          
          <p className="mb-12 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            💪 Choose your plan → 📱 Get QR code → 🏋️ Access any gym instantly!
          </p>

          {/* Quick Action Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-warm transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold mb-2">1. Pick Your Plan</h3>
              <p className="text-sm text-muted-foreground">Choose single entry, pack, or unlimited pass</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-warm transition-all">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold mb-2">2. Get QR Code</h3>
              <p className="text-sm text-muted-foreground">Instant QR code in your phone</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-warm transition-all">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="font-bold mb-2">3. Start Working Out</h3>
              <p className="text-sm text-muted-foreground">Scan & enter any partner venue</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/venues'}
            >
              🚀 Browse Venues Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/business-rules-test')}
            >
              🧪 Test Business Logic
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">😊</span>
              <span className="text-sm font-medium">1000+ Happy Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏢</span>
              <span className="text-sm font-medium">150+ Partner Venues</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
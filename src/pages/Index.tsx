import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import MobileOptimized from "@/components/MobileOptimized";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // SEO optimization
    document.title = "Drop-In Morocco | Flexible Access to Gyms, Spas & Fitness Centers";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access premium gyms, spas, and outdoor activities across Morocco with no commitments. Single entries, packs, or monthly passes. Your gateway to fitness freedom.');
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Drop-In Morocco",
      "description": "Marketplace for flexible access to gyms, spas, and fitness centers in Morocco",
      "url": "https://drop-in.ma",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS, Android, Web",
      "offers": {
        "@type": "Offer",
        "price": "50",
        "priceCurrency": "MAD",
        "description": "Single entry access to fitness venues"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Comic-style energy bursts */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full animate-pulse opacity-30" style={{ 
          background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
          filter: 'blur(20px)'
        }} />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full animate-pulse delay-1000 opacity-30" style={{ 
          background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)',
          filter: 'blur(15px)'
        }} />
        <div className="absolute bottom-32 left-1/4 w-24 h-24 rounded-full animate-pulse delay-2000 opacity-30" style={{ 
          background: 'radial-gradient(circle, #6F42C1 0%, transparent 70%)',
          filter: 'blur(10px)'
        }} />
        
        {/* Moroccan zellige pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url('/src/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg')`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat'
        }} />
        
        {/* Comic-style action lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, #FF6B35 2px, #FF6B35 4px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <MobileOptimized />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;

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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#E3BFC0' }}>
      {/* Sophisticated floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse opacity-20" style={{ backgroundColor: '#6BAA75' }} />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full blur-2xl animate-pulse delay-1000 opacity-20" style={{ backgroundColor: '#2A5C8D' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full blur-2xl animate-pulse delay-2000 opacity-20" style={{ backgroundColor: '#E28B6B' }} />
        
        {/* Subtle Moroccan geometric pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236BAA75' fill-opacity='0.15'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
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

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
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <MobileOptimized />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Package, Infinity } from "lucide-react";

const PricingSection = () => {
  const tiers = [
    {
      emoji: "🏃",
      name: "Basic",
      price: "50",
      description: "Local gyms & fitness centers",
      features: ["🏋️ Basic facilities", "⚙️ Standard equipment", "💬 Basic support", "📍 1-2 locations/city"]
    },
    {
      emoji: "💪",
      name: "Standard", 
      price: "90",
      description: "Premium gyms with extras",
      features: ["✅ All Basic features", "🔥 Premium equipment", "👥 Group classes", "⭐ Priority support", "📍 3-5 locations/city"],
      popular: true
    },
    {
      emoji: "🥇",
      name: "Premium",
      price: "150", 
      description: "Luxury gyms & spas",
      features: ["✅ All Standard features", "✨ Luxury amenities", "👨‍💼 Personal training", "🧖‍♀️ Spa access", "🏆 Premium locations"]
    },
    {
      emoji: "💎",
      name: "Ultra Luxury",
      price: "320",
      description: "Exclusive resorts & venues",
      features: ["✅ All Premium features", "🏖️ Exclusive venues", "🤵 Concierge service", "♾️ Unlimited access", "⭐⭐⭐⭐⭐ 5-star experiences"]
    }
  ];

  const plans = [
    {
      emoji: "⚡",
      name: "Blane",
      subtitle: "Single Entry",
      description: "Perfect for trying new places",
      price: "From 50 MAD",
      cta: "🎯 Book Now",
      badge: "Try Once"
    },
    {
      emoji: "📦",
      name: "Blane Pack", 
      subtitle: "5 or 10 Entries",
      description: "Save up to 20% with entry packs",
      price: "From 225 MAD",
      cta: "💰 Save More",
      popular: true,
      badge: "Best Value"
    },
    {
      emoji: "🎫",
      name: "Blane Pass",
      subtitle: "Monthly Unlimited", 
      description: "Unlimited access to all venues",
      price: "From 1,200 MAD/month",
      cta: "🚀 Go Unlimited",
      badge: "Freedom"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Plans Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">
            Choose Your
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Flexible access to Morocco's best fitness venues. No commitments, just freedom.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden hover:shadow-warm transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-primary shadow-glow scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-hero text-primary-foreground text-xs font-semibold px-3 py-1 rounded-b-md">
                  🔥 {plan.badge}
                </div>
              )}
              {!plan.popular && plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-b-md">
                  {plan.badge}
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 text-6xl">
                  {plan.emoji}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-accent font-semibold">{plan.subtitle}</p>
                <p className="text-2xl font-bold text-primary">{plan.price}</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <Button 
                  variant={plan.popular ? "hero" : "default"} 
                  className="w-full text-base"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tier Pricing */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Venue Tiers & Pricing</h3>
          <p className="text-muted-foreground">Single entry pricing across different venue categories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <Card key={index} className={`hover:shadow-card transition-all duration-300 hover:-translate-y-1 ${tier.popular ? 'ring-2 ring-primary shadow-warm' : ''}`}>
              {tier.popular && (
                <div className="bg-gradient-hero text-primary-foreground text-center text-xs font-semibold py-2">
                  🔥 Most Popular
                </div>
              )}
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{tier.emoji}</div>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{tier.price}</span>
                  <span className="text-muted-foreground ml-1">MAD</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="mr-2 flex-shrink-0">{feature.split(' ')[0]}</span>
                      <span>{feature.split(' ').slice(1).join(' ')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
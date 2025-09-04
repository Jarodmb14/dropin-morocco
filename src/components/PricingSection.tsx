import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wind, Leaf } from "lucide-react";

const PricingSection = () => {
  const tiers = [
    {
      emoji: "🌱",
      name: "Humble Beginnings",
      price: "50",
      description: "Gentle spaces for new journeys",
      features: ["🏃 Simple facilities", "🌿 Essential equipment", "💫 Caring guidance", "📍 Local sanctuaries"]
    },
    {
      emoji: "🌸",
      name: "Blossoming Path", 
      price: "120",
      description: "Enhanced wellness experiences",
      features: ["✨ All Humble features", "🔥 Premium equipment", "👥 Community circles", "⭐ Priority care", "📍 More sanctuaries"],
      popular: true
    },
    {
      emoji: "🌺",
      name: "Flourishing Spirit",
      price: "350", 
      description: "Luxury wellness sanctuaries",
      features: ["✨ All Blossoming features", "💆 Spa treatments", "👨‍💼 Personal guides", "🛁 Hammam access", "🏆 Premium havens"]
    },
    {
      emoji: "🌟",
      name: "Transcendent",
      price: "350",
      description: "Ultra-luxury wellness retreats",
      features: ["✨ All Flourishing features", "🏖️ Exclusive retreats", "🤵 Personal concierge", "♾️ Boundless access", "⭐⭐⭐⭐⭐ Celestial experiences"]
    }
  ];

  const plans = [
    {
      emoji: "🌸",
      name: "Single Bloom",
      subtitle: "One Beautiful Visit",
      description: "Perfect for exploring new sanctuaries",
      price: "From 50 DH",
      cta: "Begin Journey",
      badge: "First Steps"
    },
    {
      emoji: "🌺",
      name: "Garden Pack", 
      subtitle: "5 or 10 Blossoms",
      description: "Nurture your practice with gentle savings",
      price: "From 225 DH",
      cta: "Cultivate Wellness",
      popular: true,
      badge: "Gentle Growth"
    },
    {
      emoji: "🌟",
      name: "Infinite Bloom",
      subtitle: "Monthly Freedom", 
      description: "Boundless access to all sanctuaries",
      price: "From 1,200 DH/month",
      cta: "Embrace Freedom",
      badge: "Limitless"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-16 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl animate-pulse delay-1500" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15s6.716 15 15 15 15-6.716 15-15S23.284 0 15 0z' fill='%2310b981' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '15px 15px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Plans Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-4xl font-bold md:text-5xl">
              <span className="text-stone-800">Choose Your</span>
              <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mt-2">
                Wellness Path
              </span>
            </h2>
            <Sparkles className="w-6 h-6 text-rose-500" />
          </div>
          <p className="text-stone-600 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Gentle access to Morocco's most beautiful wellness sanctuaries. No bindings, only freedom to flourish.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 ${plan.popular ? 'ring-2 ring-amber-400 shadow-xl scale-105' : 'shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-b-2xl shadow-lg">
                  <div className="flex items-center gap-1">
                    <Wind className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}
              {!plan.popular && plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-stone-400 to-stone-500 text-white text-sm font-semibold px-4 py-2 rounded-b-2xl shadow-lg">
                  {plan.badge}
                </div>
              )}
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-rose-50/30 rounded-3xl" />
              
              <CardHeader className="text-center pb-6 relative">
                <div className="mx-auto mb-6 text-7xl relative">
                  {plan.emoji}
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-stone-800 mb-2">{plan.name}</CardTitle>
                <p className="text-amber-700 font-semibold bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 rounded-full text-sm">{plan.subtitle}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-4">{plan.price}</p>
              </CardHeader>
              <CardContent className="text-center relative">
                <p className="text-stone-600 mb-8 leading-relaxed">{plan.description}</p>
                <Button 
                  className={`w-full text-base py-4 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-white border-2 border-amber-300 text-amber-700 hover:bg-amber-50 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.popular && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />}
                  <div className="flex items-center justify-center gap-2">
                    <Leaf className="w-5 h-5" />
                    {plan.cta}
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tier Pricing */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 text-stone-800">Sanctuary Tiers & Offerings</h3>
          <p className="text-stone-600 text-lg">Each sanctuary category with its unique essence and pricing</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <Card key={index} className={`bg-white/80 backdrop-blur-sm border-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${tier.popular ? 'ring-2 ring-amber-400 shadow-lg' : 'shadow-lg'}`}>
              {tier.popular && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center text-sm font-semibold py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Most Cherished
                  </div>
                </div>
              )}
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-orange-50/20 rounded-2xl" />
              
              <CardHeader className="text-center relative">
                <div className="text-5xl mb-4 relative">
                  {tier.emoji}
                  <div className="absolute -top-1 -right-1">
                    <Wind className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-stone-800">{tier.name}</CardTitle>
                <div className="flex items-center justify-center mt-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{tier.price}</span>
                  <span className="text-stone-500 ml-1 font-medium">DH</span>
                </div>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{tier.description}</p>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-stone-600">
                      <span className="mr-3 flex-shrink-0 text-base">{feature.split(' ')[0]}</span>
                      <span className="leading-relaxed">{feature.split(' ').slice(1).join(' ')}</span>
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
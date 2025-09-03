import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  CreditCard, 
  MapPin, 
  QrCode, 
  Camera, 
  Bell, 
  Calendar,
  Users,
  Star,
  Zap
} from "lucide-react";

const MobileAppFeatures = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'qr-access',
      icon: QrCode,
      title: 'QR Code Access',
      description: 'Instant gym entry with QR codes',
      details: 'Generate and scan QR codes for seamless gym access. No more cards or keys needed.',
      badge: 'Essential'
    },
    {
      id: 'mobile-payments',
      icon: CreditCard,
      title: 'Mobile Payments',
      description: 'Secure payments with Apple Pay & Google Pay',
      details: 'Pay for memberships, day passes, and services directly from your phone.',
      badge: 'Secure'
    },
    {
      id: 'location-finder',
      icon: MapPin,
      title: 'Location Finder',
      description: 'Find nearby gyms with GPS',
      details: 'Discover fitness centers, spas, and activities near your current location.',
      badge: 'Smart'
    },
    {
      id: 'camera-features',
      icon: Camera,
      title: 'Camera Integration',
      description: 'Scan QR codes and take photos',
      details: 'Scan membership QR codes and capture workout progress photos.',
      badge: 'Interactive'
    },
    {
      id: 'push-notifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Real-time updates and reminders',
      details: 'Get notified about bookings, special offers, and gym availability.',
      badge: 'Live'
    },
    {
      id: 'offline-access',
      icon: Zap,
      title: 'Offline Access',
      description: 'Access your QR codes offline',
      details: 'Your membership QR codes work even without internet connection.',
      badge: 'Reliable'
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Premium Experience',
      description: 'Native iOS performance with smooth animations'
    },
    {
      icon: Users,
      title: 'Social Features',
      description: 'Connect with other members and share workouts'
    },
    {
      icon: Calendar,
      title: 'Class Booking',
      description: 'Book fitness classes and spa appointments'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Mobile App Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for seamless fitness access on iOS
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            const isActive = activeFeature === feature.id;
            
            return (
              <Card 
                key={feature.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isActive ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setActiveFeature(isActive ? null : feature.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  {isActive && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <p className="text-sm">{feature.details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile App Preview */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="text-center">
            <Smartphone className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">
              Native iOS Experience
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Built specifically for iOS with SwiftUI integration for the smoothest, 
              most responsive fitness app experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                🍎 Download for iOS
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                📱 Web App
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default MobileAppFeatures;
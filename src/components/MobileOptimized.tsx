import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Camera, QrCode, Smartphone, CheckCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Capacitor } from '@capacitor/core';

const MobileOptimized = () => {
  const { latitude, longitude, loading, error, getCurrentLocation } = useGeolocation();
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Detect if we're running in a native mobile app
  const isNativeApp = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();

  const handleFindNearbyGyms = () => {
    getCurrentLocation();
  };

  const handleScanQR = () => {
    // In a real implementation, this would use @capacitor/camera to scan QR codes
    setShowQRCode(true);
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isNativeApp ? '🚀 App Features' : '📱 Mobile Features'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isNativeApp 
              ? 'Native app experience for seamless gym access on-the-go'
              : 'Enhanced mobile experience for seamless gym access on-the-go'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Location-based gym finder */}
          <Card className="p-6">
            <CardHeader className="text-center pb-4">
              <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Find Nearby Gyms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Discover fitness centers and spas near your current location
              </p>
              
              {loading && (
                <p className="text-center text-blue-600">📍 Getting your location...</p>
              )}
              
              {latitude && longitude && (
                <div className="text-center text-green-600 text-sm">
                  ✅ Location found: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </div>
              )}
              
              {error && (
                <p className="text-center text-red-600 text-sm">❌ {error}</p>
              )}
              
              <Button 
                onClick={handleFindNearbyGyms} 
                className="w-full"
                disabled={loading}
              >
                📍 Find Gyms Near Me
              </Button>
            </CardContent>
          </Card>

          {/* QR Code scanner */}
          <Card className="p-6">
            <CardHeader className="text-center pb-4">
              <QrCode className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Scan your membership QR code for instant gym entry
              </p>
              
              {showQRCode && (
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-6xl mb-2">📱</div>
                  <p className="text-sm">QR Scanner would open here</p>
                </div>
              )}
              
              <Button 
                onClick={handleScanQR} 
                className="w-full"
                variant="outline"
              >
                {isNativeApp ? '📷 Open Camera Scanner' : '📷 Scan QR Code'}
              </Button>
            </CardContent>
          </Card>

          {/* Conditional content based on platform */}
          {isNativeApp ? (
            <Card className="p-6 md:col-span-2">
              <CardHeader className="text-center pb-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                <CardTitle>Welcome to Drop-In Morocco! 🇲🇦</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  You're using the native {platform === 'ios' ? 'iOS' : 'Android'} app with full access to all features
                </p>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Native App Features Active:</span>
                  </div>
                  <div className="text-center mt-2 text-sm text-green-600 dark:text-green-400">
                    📍 GPS Location • 📷 Camera Access • 🔔 Push Notifications • 📱 Offline Support
                  </div>
                </div>
                
                <Button className="w-full" variant="hero">
                  🏋️ Start Finding Gyms
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6 md:col-span-2">
              <CardHeader className="text-center pb-4">
                <Smartphone className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                <CardTitle>Get the Mobile App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Download our native mobile app for the best experience
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="flex items-center gap-2" variant="outline">
                    🤖 Download for Android
                  </Button>
                  <Button className="flex items-center gap-2" variant="outline">
                    🍎 Download for iOS
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Or continue using the web app - it works great on mobile too! 📱
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileOptimized;
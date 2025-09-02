import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8e71d6b8801b46fa8963f1e31e5a1a32',
  appName: 'dropin-morocco',
  webDir: 'dist',
  server: {
    url: 'https://8e71d6b8-801b-46fa-8963-f1e31e5a1a32.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
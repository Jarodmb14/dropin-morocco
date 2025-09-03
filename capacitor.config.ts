import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dropin.morocco',
  appName: 'dropin-morocco',
  webDir: 'dist',
  server: {
    url: 'http://172.30.0.2:5173',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
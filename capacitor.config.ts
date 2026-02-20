import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nunumotherhood.app',
  appName: 'Nunu',
  webDir: 'dist',
  server: {
    // Allow loading from Supabase and OpenAI
    allowNavigation: ['joopxlkbjtbutzigwdum.supabase.co', 'api.openai.com']
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Nunu'
  }
};

export default config;

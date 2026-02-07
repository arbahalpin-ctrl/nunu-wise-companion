import { Bell, Shield, HelpCircle, Phone, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const handleClearOnboarding = () => {
    localStorage.removeItem('nunu-onboarding-completed');
    window.location.reload();
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Customize your experience</p>
      </div>

      <div className="px-6 space-y-4">
        {/* Notifications */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Daily check-in</p>
                  <p className="text-sm text-slate-400">Gentle reminder to log your mood</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Encouraging messages</p>
                  <p className="text-sm text-slate-400">Support throughout your day</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Support */}
        <Card className="border-none shadow-sm bg-rose-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="h-5 w-5 text-rose-600" />
              <h2 className="font-semibold text-rose-800">Need urgent support?</h2>
            </div>
            <p className="text-sm text-rose-700 mb-4">
              If you're struggling, these resources are here for you 24/7.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-between border-rose-200 text-rose-700 hover:bg-rose-100"
              >
                Samaritans: 116 123
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between border-rose-200 text-rose-700 hover:bg-rose-100"
              >
                PANDAS Foundation
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Privacy</h2>
            </div>
            
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-600">
                <Shield className="h-4 w-4 mr-3" />
                Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600">
                <HelpCircle className="h-4 w-4 mr-3" />
                Help & FAQ
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600">
                <Heart className="h-4 w-4 mr-3" />
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-slate-600 text-sm leading-relaxed">
              Nunu is here to support you through the hard moments of motherhood. 
              You're not alone in this.
            </p>
            <p className="text-slate-400 text-xs mt-4">
              Version 1.0.0
            </p>
          </CardContent>
        </Card>

        {/* Dev option - reset onboarding */}
        <Button 
          variant="ghost" 
          className="w-full text-slate-400 text-sm"
          onClick={handleClearOnboarding}
        >
          Reset onboarding
        </Button>
      </div>
    </div>
  );
};

export default Settings;

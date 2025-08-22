import { Crown, Heart, Bell, Shield, HelpCircle, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const isPremium = false; // This would come from user state

  const premiumFeatures = [
    'Unlimited AI chat support',
    'Guided reflection journals',
    'Personalized routine insights',
    'Advanced sleep analytics',
    'Community access',
    'Partner/caregiver collaboration',
    'Export data & reports',
    'Priority customer support'
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-calm p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Personalize your Nunu experience</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Subscription Status */}
        <Card className={`shadow-gentle border-none ${isPremium ? 'bg-gradient-nurture' : 'bg-card'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-white/20' : 'bg-primary'}`}>
                  <Crown className={`h-6 w-6 ${isPremium ? 'text-white' : 'text-primary-foreground'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${isPremium ? 'text-white' : 'text-foreground'}`}>
                    {isPremium ? 'Nunu Premium' : 'Nunu Free'}
                  </h3>
                  <p className={`text-sm ${isPremium ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {isPremium ? 'Unlimited support & features' : 'Basic support & tracking'}
                  </p>
                </div>
              </div>
              {isPremium && (
                <Badge className="bg-white/20 text-white border-white/30">Active</Badge>
              )}
            </div>

            {!isPremium && (
              <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl shadow-gentle">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Features Preview */}
        {!isPremium && (
          <Card className="shadow-gentle border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                {premiumFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-nunu-sage" />
                    <span>{feature}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    And {premiumFeatures.length - 4} more premium features...
                  </p>
                </div>
              </div>
              
              <div className="bg-accent-soft p-4 rounded-xl mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$9.99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cancel anytime • 7-day free trial
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications */}
        <Card className="shadow-gentle border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily check-in reminders</p>
                <p className="text-sm text-muted-foreground">Gentle nudge to log your mood</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Routine suggestions</p>
                <p className="text-sm text-muted-foreground">Based on your baby's patterns</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Support messages</p>
                <p className="text-sm text-muted-foreground">Encouraging words throughout your day</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* About Nunu */}
        <Card className="shadow-gentle border-none bg-gradient-to-br from-secondary-soft to-accent-soft/30">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-foreground">About Nunu</h3>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">
              Motherhood is deeply personal, often overwhelming. Nunu is here to offer personalized support, grounded in empathy and understanding — so every mum feels seen, heard, and gently guided through her unique journey. 💕
            </p>
          </CardContent>
        </Card>

        {/* Privacy & Support */}
        <Card className="shadow-gentle border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start rounded-xl">
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & FAQ
            </Button>
            
            <Button variant="ghost" className="w-full justify-start rounded-xl">
              <Shield className="h-4 w-4 mr-3" />
              Privacy Policy
            </Button>
            
            <Button variant="ghost" className="w-full justify-start rounded-xl">
              <Heart className="h-4 w-4 mr-3" />
              Send Feedback
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-gentle border-none bg-secondary-soft">
          <CardContent className="p-4 text-center">
            <h4 className="font-medium mb-2">Nunu v1.0.0</h4>
            <p className="text-sm text-muted-foreground">
              Made with 💝 for incredible mothers everywhere
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              "You are stronger than you know, braver than you feel, and more loved than you can imagine."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
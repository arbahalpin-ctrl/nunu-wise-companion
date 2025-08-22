import { Crown, Heart, Bell, Shield, HelpCircle, Star, Check, Baby, MessageSquare, Calendar, Globe, Palette, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const isPremium = false; // This would come from user state
  const [babyName, setBabyName] = useState("Emma");
  const [babyPronouns, setBabyPronouns] = useState("she/her");
  const [aiTone, setAiTone] = useState("soft-encouraging");
  const [motherhoodStage, setMotherhoodStage] = useState("newborn");
  const [quoteTheme, setQuoteTheme] = useState("empowering");

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

        {/* Personalization Section */}
        <Card className="shadow-gentle border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              Personalize Nunu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baby-name" className="text-sm font-medium">Baby's name</Label>
              <Input
                id="baby-name"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className="rounded-xl"
                placeholder="Enter baby's name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baby-pronouns" className="text-sm font-medium">Pronouns</Label>
              <Select value={babyPronouns} onValueChange={setBabyPronouns}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="she/her">She/Her</SelectItem>
                  <SelectItem value="he/him">He/Him</SelectItem>
                  <SelectItem value="they/them">They/Them</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">AI support tone</Label>
              <Select value={aiTone} onValueChange={setAiTone}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft-encouraging">Soft & Encouraging</SelectItem>
                  <SelectItem value="warm-realistic">Warm but Realistic</SelectItem>
                  <SelectItem value="light-uplifting">Light & Uplifting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Current stage</Label>
              <Select value={motherhoodStage} onValueChange={setMotherhoodStage}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pregnancy">Pregnancy</SelectItem>
                  <SelectItem value="newborn">Newborn</SelectItem>
                  <SelectItem value="infant">Infant</SelectItem>
                  <SelectItem value="toddler">Toddler</SelectItem>
                  <SelectItem value="post-weaning">Post-weaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

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
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Customize daily quotes</p>
                <p className="text-sm text-muted-foreground">Choose themes that resonate with you</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Palette className="h-4 w-4 mr-1" />
                    Themes
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-none shadow-gentle">
                  <DialogHeader>
                    <DialogTitle>Quote Themes</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {['empowering', 'grounded', 'funny-light', 'spiritual', 'random-mix'].map((theme) => (
                      <div key={theme} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={theme}
                          name="quote-theme"
                          value={theme}
                          checked={quoteTheme === theme}
                          onChange={(e) => setQuoteTheme(e.target.value)}
                          className="text-primary"
                        />
                        <Label htmlFor={theme} className="text-sm capitalize cursor-pointer">
                          {theme.replace('-', ' & ').replace('funny-light', 'Funny/Light')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Mood Check-in History */}
        <Card className="shadow-gentle border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Mood History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start rounded-xl">
              <MessageSquare className="h-4 w-4 mr-3" />
              View past check-ins & journal entries
            </Button>
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

        {/* Mental Health Support */}
        <Card className="shadow-gentle border-none bg-accent-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-5 w-5 text-primary" />
              Need a Little Extra Support?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              If you're feeling low, anxious, or just need someone to talk to — here are some resources that can help.
            </p>
            
            <div className="grid gap-2">
              <Button variant="ghost" className="w-full justify-start rounded-xl text-left">
                <Phone className="h-4 w-4 mr-3 text-primary" />
                Postpartum helpline
              </Button>
              
              <Button variant="ghost" className="w-full justify-start rounded-xl">
                <Heart className="h-4 w-4 mr-3 text-primary" />
                Breathing exercise
              </Button>
              
              <Button variant="ghost" className="w-full justify-start rounded-xl">
                <MessageSquare className="h-4 w-4 mr-3 text-primary" />
                Reflection journal
              </Button>
            </div>
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
            <Button 
              variant="ghost" 
              className="w-full justify-start rounded-xl"
              onClick={() => navigate('/help-faq')}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & FAQ
            </Button>
            
            <Button variant="ghost" className="w-full justify-start rounded-xl">
              <Globe className="h-4 w-4 mr-3" />
              Language & Region
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
import { useState } from 'react';
import { Bell, Shield, HelpCircle, Phone, Heart, ExternalLink, X, Mail, Baby, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleClearOnboarding = () => {
    localStorage.removeItem('nunu-onboarding-completed');
    window.location.reload();
  };

  const handleClearAllData = () => {
    if (confirm('This will clear all your data including baby age, conversations, and preferences. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
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
              <a href="tel:116123" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-rose-200 text-rose-700 hover:bg-rose-100"
                >
                  <span>Samaritans: 116 123</span>
                  <span className="text-xs text-rose-500">Tap to call</span>
                </Button>
              </a>
              <a href="tel:08081961776" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-rose-200 text-rose-700 hover:bg-rose-100"
                >
                  <span>PANDAS: 0808 196 1776</span>
                  <span className="text-xs text-rose-500">Tap to call</span>
                </Button>
              </a>
              <a href="https://www.nhs.uk/service-search/mental-health/find-a-perinatal-mental-health-service/" target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-rose-200 text-rose-700 hover:bg-rose-100"
                >
                  <span>NHS Perinatal Support</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Help & Support</h2>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-600"
                onClick={() => setShowHelp(true)}
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                Help & FAQ
              </Button>
              <a href="mailto:support@nunu-app.com?subject=Nunu%20App%20Feedback" className="block">
                <Button variant="ghost" className="w-full justify-start text-slate-600">
                  <Mail className="h-4 w-4 mr-3" />
                  Send Feedback
                </Button>
              </a>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-600"
                onClick={() => setShowPrivacy(true)}
              >
                <Shield className="h-4 w-4 mr-3" />
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Baby className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Your Data</h2>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-600"
                onClick={handleClearOnboarding}
              >
                <Heart className="h-4 w-4 mr-3" />
                Restart Onboarding
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleClearAllData}
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Clear All Data
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Your data is stored locally on your device. We don't collect or store any personal information.
            </p>
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
              Version 1.0.0 • Made with 💛
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-slate-800">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Your Privacy Matters</h3>
                <p className="text-sm text-slate-600">
                  Nunu is designed with your privacy as a priority. We believe your personal journey through motherhood should remain personal.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">What We Store</h3>
                <p className="text-sm text-slate-600">
                  All your data (baby's age, conversations, mood check-ins) is stored locally on your device using browser storage. We don't have access to it.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">What We Don't Do</h3>
                <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                  <li>We don't collect personal information</li>
                  <li>We don't track your location</li>
                  <li>We don't sell or share data</li>
                  <li>We don't store conversations on our servers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">AI Conversations</h3>
                <p className="text-sm text-slate-600">
                  When you chat with Nunu, your messages are sent to OpenAI's API to generate responses. OpenAI's privacy policy applies to this processing. We don't store these conversations on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Your Control</h3>
                <p className="text-sm text-slate-600">
                  You can delete all your local data anytime from Settings → Clear All Data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & FAQ Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-slate-800">Help & FAQ</h2>
              <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">What is Nunu?</h3>
                <p className="text-sm text-slate-600">
                  Nunu is an AI-powered companion designed to support mothers with sleep advice, emotional support, and practical tips through the early years of parenting.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">How do wake windows work?</h3>
                <p className="text-sm text-slate-600">
                  Wake windows are the optimal time your baby can stay awake between naps. Enter your baby's age, and Nunu will show you age-appropriate wake windows. You can log when baby wakes to track time.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Is the advice medical?</h3>
                <p className="text-sm text-slate-600">
                  No. Nunu provides general information and support, not medical advice. Always consult your GP, health visitor, or pediatrician for medical concerns about you or your baby.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">I'm really struggling. Can Nunu help?</h3>
                <p className="text-sm text-slate-600">
                  Nunu can provide support and a listening ear, but if you're experiencing severe distress, postnatal depression, or thoughts of harm, please reach out to professional support immediately:
                </p>
                <ul className="text-sm text-slate-600 mt-2 space-y-1">
                  <li>• <strong>Samaritans:</strong> 116 123 (24/7, free)</li>
                  <li>• <strong>PANDAS:</strong> 0808 196 1776</li>
                  <li>• <strong>NHS 111:</strong> For urgent concerns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">How do I delete my data?</h3>
                <p className="text-sm text-slate-600">
                  Go to Settings → Your Data → Clear All Data. This removes everything stored on your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

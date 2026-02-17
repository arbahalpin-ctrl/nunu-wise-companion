import { useState, useEffect } from 'react';
import { Bell, Shield, HelpCircle, Phone, Heart, ExternalLink, X, Mail, Baby, Trash2, AlertTriangle, Bookmark, ChevronRight, ChevronDown, Sparkles, ClipboardCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface SavedItem {
  id: string;
  title: string;
  content: string;
  savedAt: number;
  conversationTitle: string;
}

const CHAT_SAVED_KEY = 'nunu-chat-saved';
const EPDS_RESULTS_KEY = 'nunu-epds-results';
const PARENT_NAME_KEY = 'nunu-parent-name';

// Edinburgh Postnatal Depression Scale questions (simplified for self-screening)
const EPDS_QUESTIONS = [
  {
    q: "I have been able to laugh and see the funny side of things",
    options: [
      { label: "As much as I always could", score: 0 },
      { label: "Not quite so much now", score: 1 },
      { label: "Definitely not so much now", score: 2 },
      { label: "Not at all", score: 3 }
    ]
  },
  {
    q: "I have looked forward with enjoyment to things",
    options: [
      { label: "As much as I ever did", score: 0 },
      { label: "Rather less than I used to", score: 1 },
      { label: "Definitely less than I used to", score: 2 },
      { label: "Hardly at all", score: 3 }
    ]
  },
  {
    q: "I have blamed myself unnecessarily when things went wrong",
    options: [
      { label: "No, never", score: 0 },
      { label: "Not very often", score: 1 },
      { label: "Yes, some of the time", score: 2 },
      { label: "Yes, most of the time", score: 3 }
    ]
  },
  {
    q: "I have been anxious or worried for no good reason",
    options: [
      { label: "No, not at all", score: 0 },
      { label: "Hardly ever", score: 1 },
      { label: "Yes, sometimes", score: 2 },
      { label: "Yes, very often", score: 3 }
    ]
  },
  {
    q: "I have felt scared or panicky for no good reason",
    options: [
      { label: "No, not at all", score: 0 },
      { label: "No, not much", score: 1 },
      { label: "Yes, sometimes", score: 2 },
      { label: "Yes, quite a lot", score: 3 }
    ]
  },
  {
    q: "Things have been getting too much for me",
    options: [
      { label: "No, I've been coping well", score: 0 },
      { label: "No, most of the time I've coped well", score: 1 },
      { label: "Yes, sometimes I haven't been coping", score: 2 },
      { label: "Yes, most of the time I haven't been coping", score: 3 }
    ]
  },
  {
    q: "I have been so unhappy that I have had difficulty sleeping",
    options: [
      { label: "No, not at all", score: 0 },
      { label: "Not very often", score: 1 },
      { label: "Yes, sometimes", score: 2 },
      { label: "Yes, most of the time", score: 3 }
    ]
  },
  {
    q: "I have felt sad or miserable",
    options: [
      { label: "No, not at all", score: 0 },
      { label: "Not very often", score: 1 },
      { label: "Yes, quite often", score: 2 },
      { label: "Yes, most of the time", score: 3 }
    ]
  },
  {
    q: "I have been so unhappy that I have been crying",
    options: [
      { label: "No, never", score: 0 },
      { label: "Only occasionally", score: 1 },
      { label: "Yes, quite often", score: 2 },
      { label: "Yes, most of the time", score: 3 }
    ]
  },
  {
    q: "The thought of harming myself has occurred to me",
    options: [
      { label: "Never", score: 0 },
      { label: "Hardly ever", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Yes, quite often", score: 3 }
    ],
    isCritical: true
  }
];

interface EpdsResult {
  score: number;
  date: string;
  hasCritical: boolean;
}

const Settings = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Wellbeing state
  const [showWellbeing, setShowWellbeing] = useState(false);
  const [showEpds, setShowEpds] = useState(false);
  const [epdsAnswers, setEpdsAnswers] = useState<number[]>([]);
  const [epdsCurrentQ, setEpdsCurrentQ] = useState(0);
  const [epdsResult, setEpdsResult] = useState<EpdsResult | null>(null);
  const [lastEpdsResult, setLastEpdsResult] = useState<EpdsResult | null>(null);
  const [parentName, setParentName] = useState('');

  // Load saved items
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_SAVED_KEY);
      if (saved) {
        setSavedItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved items:', e);
    }
  }, []);

  // Load EPDS results and parent name
  useEffect(() => {
    try {
      const savedEpds = localStorage.getItem(EPDS_RESULTS_KEY);
      if (savedEpds) {
        const results: EpdsResult[] = JSON.parse(savedEpds);
        if (results.length > 0) {
          setLastEpdsResult(results[results.length - 1]);
        }
      }
      const name = localStorage.getItem(PARENT_NAME_KEY);
      if (name) setParentName(name);
    } catch (e) {
      console.error('Failed to load EPDS results:', e);
    }
  }, []);

  const deleteSavedItem = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem(CHAT_SAVED_KEY, JSON.stringify(updated));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleClearOnboarding = () => {
    localStorage.removeItem('nunu-onboarding-completed');
    window.location.reload();
  };

  const handleClearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // EPDS functions
  const startEpds = () => {
    setEpdsAnswers([]);
    setEpdsCurrentQ(0);
    setEpdsResult(null);
    setShowEpds(true);
  };

  const answerEpds = (score: number) => {
    const newAnswers = [...epdsAnswers, score];
    setEpdsAnswers(newAnswers);
    
    if (epdsCurrentQ < EPDS_QUESTIONS.length - 1) {
      setEpdsCurrentQ(epdsCurrentQ + 1);
    } else {
      // Calculate result
      const totalScore = newAnswers.reduce((sum, s) => sum + s, 0);
      const hasCritical = newAnswers[9] >= 1; // Question 10 about self-harm
      const result: EpdsResult = {
        score: totalScore,
        date: new Date().toISOString(),
        hasCritical
      };
      setEpdsResult(result);
      setLastEpdsResult(result);
      
      // Save result
      try {
        const existing = localStorage.getItem(EPDS_RESULTS_KEY);
        const results: EpdsResult[] = existing ? JSON.parse(existing) : [];
        results.push(result);
        localStorage.setItem(EPDS_RESULTS_KEY, JSON.stringify(results.slice(-10)));
      } catch (e) {
        console.error('Failed to save EPDS result:', e);
      }
    }
  };

  const getEpdsInterpretation = (score: number, hasCritical: boolean) => {
    if (hasCritical) {
      return {
        level: 'urgent',
        title: 'Please reach out for support',
        message: "Your answers suggest you may be having thoughts of harming yourself. This is more common than you might think, and help is available. Please contact your GP, midwife, or one of the crisis resources below today. You don't have to face this alone.",
        color: 'rose'
      };
    }
    if (score >= 13) {
      return {
        level: 'high',
        title: 'Consider speaking with someone',
        message: "Your score suggests you may be experiencing symptoms of depression. This is very common after having a baby, and it's treatable. Please consider speaking with your GP or health visitor soon — they can offer real support.",
        color: 'amber'
      };
    }
    if (score >= 10) {
      return {
        level: 'moderate',
        title: 'Keep an eye on how you feel',
        message: "Your score shows some mild symptoms. Many new mothers feel this way. If things don't improve over the next couple of weeks, or you start feeling worse, please reach out to your GP or health visitor.",
        color: 'yellow'
      };
    }
    return {
      level: 'low',
      title: 'You seem to be coping well',
      message: "Your score suggests you're managing well. Remember that it's normal to have tough days — and it's always okay to ask for support if that changes.",
      color: 'emerald'
    };
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

        {/* Saved from Chat */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={() => setShowSavedItems(!showSavedItems)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <h2 className="font-semibold text-slate-800">Saved from Chat</h2>
                  <p className="text-xs text-slate-400">{savedItems.length} saved item{savedItems.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {showSavedItems ? (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-400" />
              )}
            </button>
            
            {showSavedItems && (
              <div className="mt-4 space-y-3">
                {savedItems.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No saved items yet. Tap the bookmark icon on any chat message to save it here.
                  </p>
                ) : (
                  savedItems.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                        className="w-full p-3 flex items-start justify-between text-left hover:bg-slate-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">{item.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(item.savedAt)}</p>
                        </div>
                        {expandedItem === item.id ? (
                          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      
                      {expandedItem === item.id && (
                        <div className="px-3 pb-3 border-t border-slate-100">
                          <div className="bg-slate-50 rounded-lg p-3 mt-3 max-h-64 overflow-y-auto">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.content}</p>
                          </div>
                          <button
                            onClick={() => deleteSavedItem(item.id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Wellbeing */}
        <Card className="border-none shadow-sm bg-purple-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-5 w-5 text-purple-600" />
              <h2 className="font-semibold text-purple-800">
                {parentName ? `${parentName}, how are YOU?` : 'Your Wellbeing'}
              </h2>
            </div>
            <p className="text-sm text-purple-700 mb-4">
              Caring for a baby is hard. It's important to check in with yourself too.
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={startEpds}
                variant="outline" 
                className="w-full justify-between border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Wellbeing check (EPDS)
                </span>
                <span className="text-xs text-purple-500">2 min</span>
              </Button>
              
              {lastEpdsResult && (
                <div className="p-3 bg-white rounded-lg text-sm">
                  <p className="text-purple-700">
                    Last check: <span className="font-medium">
                      {new Date(lastEpdsResult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    {' '}• Score: <span className="font-medium">{lastEpdsResult.score}/30</span>
                  </p>
                </div>
              )}
              
              <a href="https://www.mind.org.uk/information-support/types-of-mental-health-problems/postnatal-depression-and-perinatal-mental-health/" target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                  <span>Understanding perinatal mental health</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
            
            <p className="text-xs text-purple-600 mt-4">
              💜 1 in 5 women experience mental health issues during pregnancy or the first year after birth. You're not alone.
            </p>
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
              <a href="https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/mental-health/" target="_blank" rel="noopener noreferrer" className="block">
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
                onClick={() => setShowClearConfirm(true)}
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

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="font-semibold text-slate-800 text-lg mb-2">Clear All Data?</h2>
              <p className="text-sm text-slate-600 mb-6">
                This will permanently delete all your data including baby info, conversations, mood history, and saved recipes. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleClearAllData}
                >
                  Delete All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EPDS Screening Modal */}
      {showEpds && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-purple-50">
              <div className="flex items-center gap-2">
                {epdsResult ? null : (
                  <button onClick={() => setShowEpds(false)} className="p-1 hover:bg-purple-100 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-purple-600" />
                  </button>
                )}
                <h2 className="font-semibold text-purple-800">
                  {epdsResult ? 'Your Results' : `Question ${epdsCurrentQ + 1} of ${EPDS_QUESTIONS.length}`}
                </h2>
              </div>
              <button onClick={() => setShowEpds(false)} className="p-1 hover:bg-purple-100 rounded-full">
                <X className="h-5 w-5 text-purple-600" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              {!epdsResult ? (
                // Questions
                <div>
                  {epdsCurrentQ === 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                      <p className="text-sm text-purple-700">
                        These questions ask how you've been feeling <strong>over the past 7 days</strong>, not just today. There are no right or wrong answers.
                      </p>
                    </div>
                  )}
                  
                  <p className="text-lg font-medium text-slate-800 mb-6">
                    {EPDS_QUESTIONS[epdsCurrentQ].q}
                  </p>
                  
                  <div className="space-y-3">
                    {EPDS_QUESTIONS[epdsCurrentQ].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => answerEpds(option.score)}
                        className="w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-slate-700">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-8">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${((epdsCurrentQ) / EPDS_QUESTIONS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Results
                <div>
                  {(() => {
                    const interpretation = getEpdsInterpretation(epdsResult.score, epdsResult.hasCritical);
                    return (
                      <>
                        <div className={`p-5 rounded-xl mb-6 ${
                          interpretation.color === 'rose' ? 'bg-rose-50' :
                          interpretation.color === 'amber' ? 'bg-amber-50' :
                          interpretation.color === 'yellow' ? 'bg-yellow-50' :
                          'bg-emerald-50'
                        }`}>
                          <div className="text-center mb-3">
                            <span className="text-3xl font-bold text-slate-800">{epdsResult.score}</span>
                            <span className="text-slate-500">/30</span>
                          </div>
                          <h3 className={`font-semibold text-center mb-2 ${
                            interpretation.color === 'rose' ? 'text-rose-800' :
                            interpretation.color === 'amber' ? 'text-amber-800' :
                            interpretation.color === 'yellow' ? 'text-yellow-800' :
                            'text-emerald-800'
                          }`}>
                            {interpretation.title}
                          </h3>
                          <p className={`text-sm text-center ${
                            interpretation.color === 'rose' ? 'text-rose-700' :
                            interpretation.color === 'amber' ? 'text-amber-700' :
                            interpretation.color === 'yellow' ? 'text-yellow-700' :
                            'text-emerald-700'
                          }`}>
                            {interpretation.message}
                          </p>
                        </div>
                        
                        {(interpretation.level === 'urgent' || interpretation.level === 'high') && (
                          <div className="space-y-2 mb-6">
                            <p className="font-medium text-slate-700 text-sm">Talk to someone now:</p>
                            <a href="tel:116123" className="block">
                              <Button variant="outline" className="w-full justify-between border-rose-200 text-rose-700">
                                <span>Samaritans: 116 123</span>
                                <span className="text-xs">Free, 24/7</span>
                              </Button>
                            </a>
                            <a href="tel:08081961776" className="block">
                              <Button variant="outline" className="w-full justify-between border-rose-200 text-rose-700">
                                <span>PANDAS: 0808 196 1776</span>
                                <span className="text-xs">Mon-Sun 9am-8pm</span>
                              </Button>
                            </a>
                          </div>
                        )}
                        
                        <div className="bg-slate-50 p-4 rounded-lg mb-4">
                          <p className="text-xs text-slate-600">
                            <strong>About this screening:</strong> The Edinburgh Postnatal Depression Scale (EPDS) is a validated screening tool used by health professionals worldwide. A score of 10+ suggests it may be helpful to talk with a healthcare provider. This is not a diagnosis — only a qualified professional can diagnose postnatal depression.
                          </p>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowEpds(false)}
                          >
                            Close
                          </Button>
                          <Button 
                            className="flex-1 bg-purple-500 hover:bg-purple-600"
                            onClick={startEpds}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Take Again
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

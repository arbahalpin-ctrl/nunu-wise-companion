import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Moon, Clock, Baby, Heart, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SleepProfile {
  babyAge: string;
  napCount: string;
  sleepLocation: string;
  methods: string[];
  mainConcern: string;
  successGoal: string;
  currentMethod: string;
  dayStarted: number;
}

interface SleepLog {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  nightWakes: number;
  napCount: number;
  fallAsleepTime: string;
  notes: string;
}

const SleepCoach = () => {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<SleepProfile>({
    babyAge: '',
    napCount: '',
    sleepLocation: '',
    methods: [],
    mainConcern: '',
    successGoal: '',
    currentMethod: '',
    dayStarted: 0
  });
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSleepLogging, setShowSleepLogging] = useState(false);
  const [currentLog, setCurrentLog] = useState<Partial<SleepLog>>({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    nightWakes: 0,
    napCount: 0,
    fallAsleepTime: '',
    notes: ''
  });
  const [chatStep, setChatStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'nunu' | 'user', content: string, timestamp: number}>>([]);
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    const savedProfile = localStorage.getItem('nunu-sleep-profile');
    const savedLogs = localStorage.getItem('nunu-sleep-logs');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setHasProfile(true);
    }
    
    if (savedLogs) {
      setSleepLogs(JSON.parse(savedLogs));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('nunu-sleep-profile', JSON.stringify(profile));
    setHasProfile(true);
    setShowOnboarding(false);
    toast({
      title: "Sleep profile saved",
      description: "Your personalized sleep coaching plan is ready!",
    });
  };

  const saveSleepLog = () => {
    if (!currentLog.bedtime || !currentLog.wakeTime) {
      toast({
        title: "Missing information",
        description: "Please fill in bedtime and wake time",
        variant: "destructive"
      });
      return;
    }

    const newLog: SleepLog = {
      id: Date.now().toString(),
      date: currentLog.date || new Date().toISOString().split('T')[0],
      bedtime: currentLog.bedtime!,
      wakeTime: currentLog.wakeTime!,
      nightWakes: currentLog.nightWakes || 0,
      napCount: currentLog.napCount || 0,
      fallAsleepTime: currentLog.fallAsleepTime || '',
      notes: currentLog.notes || ''
    };

    const updatedLogs = [...sleepLogs, newLog];
    setSleepLogs(updatedLogs);
    localStorage.setItem('nunu-sleep-logs', JSON.stringify(updatedLogs));
    
    setShowSleepLogging(false);
    setCurrentLog({
      date: new Date().toISOString().split('T')[0],
      bedtime: '',
      wakeTime: '',
      nightWakes: 0,
      napCount: 0,
      fallAsleepTime: '',
      notes: ''
    });

    toast({
      title: "Sleep logged! 🌙",
      description: "Great start! I'll use this to build your personalized routine.",
    });
  };

  const startSleepTracking = () => {
    setShowSleepLogging(true);
    setChatStep(0);
    setChatMessages([]);
    setCurrentInput('');
    
    // Start the conversation
    setTimeout(() => {
      setChatMessages([{
        type: 'nunu',
        content: "Hey mama, I'm here to listen. How did bedtime go last night? Was it smooth sailing or one of those nights? 💙",
        timestamp: Date.now()
      }]);
    }, 500);
  };

  const getNextQuestion = (step: number): string => {
    const questions = [
      "Hey mama, I'm here to listen. How did bedtime go last night? Was it smooth sailing or one of those nights? 💙",
      "Got it, thank you for sharing. What time did you start the bedtime routine?",
      "And what time did your little one finally fall asleep?",
      "How many times did they wake during the night, if at all? Every wake is normal, mama.",
      "Did they have any naps during the day? How many would you say?",
      "How long did it take them to settle down at bedtime? Take your best guess - there's no wrong answer.",
      "Is there anything else about the night that felt important to note? Maybe they seemed extra tired, or something was different than usual?"
    ];
    return questions[step] || "";
  };

  const handleChatResponse = () => {
    if (!currentInput.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      content: currentInput,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Process the response based on current step
    setTimeout(() => {
      let nunuResponse = "";
      let nextStep = chatStep + 1;

      switch (chatStep) {
        case 0: // Bedtime experience
          setCurrentLog(prev => ({ ...prev, notes: currentInput }));
          nunuResponse = "Thank you for trusting me with that. Every night is different, and you're doing your best. 🤗";
          break;
        case 1: // Bedtime start
          setCurrentLog(prev => ({ ...prev, bedtime: currentInput }));
          nunuResponse = "Perfect, that gives me a good picture of your routine.";
          break;
        case 2: // Fall asleep time
          setCurrentLog(prev => ({ ...prev, wakeTime: currentInput }));
          nunuResponse = "I hear you. Sleep can be such a journey for our little ones.";
          break;
        case 3: // Night wakes
          const wakes = parseInt(currentInput) || 0;
          setCurrentLog(prev => ({ ...prev, nightWakes: wakes }));
          nunuResponse = wakes === 0 ? "What a gift when they sleep through! 🌙" : 
                       wakes === 1 ? "One wake is actually really normal for many babies." :
                       wakes <= 3 ? "Those night wakes can be exhausting. You're handling it beautifully." :
                       "Oh mama, those frequent wakes are tough. You're so strong for getting through each night.";
          break;
        case 4: // Naps
          const naps = parseInt(currentInput) || 0;
          setCurrentLog(prev => ({ ...prev, napCount: naps }));
          nunuResponse = naps === 0 ? "No naps can make for a long day. You're doing great." :
                        naps === 1 ? "One good nap can make such a difference." :
                        "Multiple naps - that's wonderful for both of you to get some rest.";
          break;
        case 5: // Fall asleep time
          setCurrentLog(prev => ({ ...prev, fallAsleepTime: currentInput }));
          nunuResponse = "Every baby has their own rhythm for settling down. There's no perfect timeline.";
          break;
        case 6: // Additional notes
          setCurrentLog(prev => ({ ...prev, notes: prev.notes + (prev.notes ? ' ' : '') + currentInput }));
          nunuResponse = "Thanks for sharing, you're doing your best and it shows. I'll start building your sleep insights based on this first log. We'll go gently 💫";
          nextStep = -1; // End conversation
          break;
      }

      setChatMessages(prev => [...prev, {
        type: 'nunu',
        content: nunuResponse,
        timestamp: Date.now()
      }]);

      if (nextStep >= 0 && nextStep < 7) {
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            type: 'nunu',
            content: getNextQuestion(nextStep),
            timestamp: Date.now()
          }]);
          setChatStep(nextStep);
        }, 2000);
      } else {
        // End conversation and save log
        setTimeout(() => {
          saveSleepLogFromChat();
        }, 2000);
      }
    }, 1000);

    setCurrentInput('');
  };

  const saveSleepLogFromChat = () => {
    const newLog: SleepLog = {
      id: Date.now().toString(),
      date: currentLog.date || new Date().toISOString().split('T')[0],
      bedtime: currentLog.bedtime || '',
      wakeTime: currentLog.wakeTime || '',
      nightWakes: currentLog.nightWakes || 0,
      napCount: currentLog.napCount || 0,
      fallAsleepTime: currentLog.fallAsleepTime || '',
      notes: currentLog.notes || ''
    };

    const updatedLogs = [...sleepLogs, newLog];
    setSleepLogs(updatedLogs);
    localStorage.setItem('nunu-sleep-logs', JSON.stringify(updatedLogs));
    
    setShowSleepLogging(false);
    setChatStep(0);
    setChatMessages([]);
    setCurrentLog({
      date: new Date().toISOString().split('T')[0],
      bedtime: '',
      wakeTime: '',
      nightWakes: 0,
      napCount: 0,
      fallAsleepTime: '',
      notes: ''
    });

    toast({
      title: "Sleep logged! 🌙",
      description: "I'll use this to build your personalized insights. Sweet dreams ahead!",
    });
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
    setCurrentStep(1);
  };

  const handleMethodToggle = (method: string, checked: boolean) => {
    if (checked) {
      setProfile(prev => ({ ...prev, methods: [...prev.methods, method] }));
    } else {
      setProfile(prev => ({ ...prev, methods: prev.methods.filter(m => m !== method) }));
    }
  };

  const getSleepInsight = () => {
    if (sleepLogs.length === 0) {
      return {
        title: "Let's begin tonight.",
        message: "Based on your baby's age and your style, I'll help you find a gentle rhythm that works for both of you.",
        type: "welcome",
        showCTA: true
      };
    }

    const recentLogs = sleepLogs.slice(-7);
    const avgNightWakes = recentLogs.reduce((sum, log) => sum + log.nightWakes, 0) / recentLogs.length;

    if (profile.dayStarted > 0) {
      const daysInto = Math.floor((Date.now() - profile.dayStarted) / (1000 * 60 * 60 * 24));
      
      if (daysInto <= 3) {
        return {
          title: `Day ${daysInto} of ${profile.currentMethod}`,
          message: "You're doing incredibly well. The first few nights are often the toughest — stay consistent and trust the process 💙",
          type: "encouragement"
        };
      } else if (avgNightWakes < 2) {
        return {
          title: "Great progress! 🌟",
          message: `Night wakes have reduced significantly. ${profile.babyAge.includes('month') ? 'Your little one' : 'Baby'} is learning to sleep more peacefully.`,
          type: "success"
        };
      }
    }

    return {
      title: "Gentle reminder 🐨",
      message: "Every baby's sleep journey is unique. Focus on small improvements rather than perfection — you're doing amazing.",
      type: "support"
    };
  };

  const getNextEvent = () => {
    if (sleepLogs.length === 0) return null;
    
    const lastLog = sleepLogs[sleepLogs.length - 1];
    const now = new Date();
    const bedtime = new Date(lastLog.bedtime);
    
    // Simple prediction based on last bedtime
    const nextBedtime = new Date(now);
    nextBedtime.setHours(bedtime.getHours(), bedtime.getMinutes());
    
    if (nextBedtime < now) {
      nextBedtime.setDate(nextBedtime.getDate() + 1);
    }
    
    return `🌙 Next bedtime: ~${nextBedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const renderOnboarding = () => (
    <div className="min-h-screen bg-gradient-comfort p-4">
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Moon className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sleep Coach Setup</CardTitle>
          <CardDescription>Let's create your personalized sleep plan</CardDescription>
          <Progress value={(currentStep / 6) * 100} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>How old is your baby?</Label>
              <Select value={profile.babyAge} onValueChange={(value) => setProfile(prev => ({ ...prev, babyAge: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-3 months">0-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="12+ months">12+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>How many naps does your baby currently take?</Label>
              <Select value={profile.napCount} onValueChange={(value) => setProfile(prev => ({ ...prev, napCount: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select nap count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No regular naps">No regular naps</SelectItem>
                  <SelectItem value="1 nap">1 nap per day</SelectItem>
                  <SelectItem value="2 naps">2 naps per day</SelectItem>
                  <SelectItem value="3+ naps">3+ naps per day</SelectItem>
                  <SelectItem value="Contact naps only">Contact naps only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <Label>Where does your baby usually sleep?</Label>
              <Select value={profile.sleepLocation} onValueChange={(value) => setProfile(prev => ({ ...prev, sleepLocation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sleep location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Own crib">Own crib/bassinet</SelectItem>
                  <SelectItem value="Bedsharing">Bedsharing with parents</SelectItem>
                  <SelectItem value="Contact napping">Contact napping during day</SelectItem>
                  <SelectItem value="Mixed">Mix of locations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-4">
              <Label>Which approaches feel comfortable to you? (Select all that apply)</Label>
              <div className="space-y-3">
                {[
                  'Ferber Method',
                  'Chair Method',
                  'Gentle Sleep Shaping', 
                  'No-Cry Solutions',
                  'Co-sleeping Routines',
                  'Not sure yet'
                ].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox 
                      id={method}
                      checked={profile.methods.includes(method)}
                      onCheckedChange={(checked) => handleMethodToggle(method, checked as boolean)}
                    />
                    <Label htmlFor={method} className="text-sm">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 5 && (
            <div className="space-y-4">
              <Label>What's your main sleep concern?</Label>
              <Select value={profile.mainConcern} onValueChange={(value) => setProfile(prev => ({ ...prev, mainConcern: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select main concern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frequent night wakes">Wakes frequently at night</SelectItem>
                  <SelectItem value="Poor naps">Doesn't nap well</SelectItem>
                  <SelectItem value="Takes hours to fall asleep">Takes hours to fall asleep</SelectItem>
                  <SelectItem value="Early morning wakes">Early morning wakes</SelectItem>
                  <SelectItem value="All of the above">All of the above</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentStep === 6 && (
            <div className="space-y-4">
              <Label>What would feel like success to you?</Label>
              <Select value={profile.successGoal} onValueChange={(value) => setProfile(prev => ({ ...prev, successGoal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select success goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Falls asleep under 20 min">Falling asleep in under 20 minutes</SelectItem>
                  <SelectItem value="Longer sleep stretches">Baby sleeping longer stretches</SelectItem>
                  <SelectItem value="Better naps">Better, more predictable naps</SelectItem>
                  <SelectItem value="Gentle routine">Gentle routine building</SelectItem>
                  <SelectItem value="Less crying">Less crying at sleep time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                Back
              </Button>
            )}
            {currentStep < 6 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={
                  (currentStep === 1 && !profile.babyAge) ||
                  (currentStep === 2 && !profile.napCount) ||
                  (currentStep === 3 && !profile.sleepLocation) ||
                  (currentStep === 4 && profile.methods.length === 0) ||
                  (currentStep === 5 && !profile.mainConcern)
                }
                className="flex-1"
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={saveProfile}
                disabled={!profile.successGoal}
                className="flex-1"
              >
                Start Sleep Coaching
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (showOnboarding) {
    return renderOnboarding();
  }

  const renderSleepLogging = () => (
    <div className="min-h-screen bg-gradient-comfort">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-card border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setShowSleepLogging(false)}>
            ← Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Moon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Chat with Nunu</h1>
              <p className="text-xs text-muted-foreground">Your gentle sleep consultant</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-4 space-y-4 pb-24 min-h-[calc(100vh-8rem)]">
          {chatMessages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'nunu' && (
                <div className="w-8 h-8 rounded-full bg-nunu-cream flex items-center justify-center flex-shrink-0">
                  🐨
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.type === 'nunu' 
                  ? 'bg-card border border-border' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        {chatStep >= 0 && chatStep < 7 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
            <div className="max-w-md mx-auto flex gap-3">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your response..."
                onKeyPress={(e) => e.key === 'Enter' && handleChatResponse()}
                className="flex-1"
              />
              <Button onClick={handleChatResponse} disabled={!currentInput.trim()}>
                Send
              </Button>
            </div>
          </div>
        )}

        {/* Conversation Complete Message */}
        {chatStep === -1 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
            <div className="max-w-md mx-auto text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Conversation complete! Your sleep log has been saved.
              </p>
              <Button onClick={() => setShowSleepLogging(false)} variant="outline" size="sm">
                Return to Sleep Coach
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (showSleepLogging) {
    return renderSleepLogging();
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-comfort p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <Moon className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Sleep Coach</CardTitle>
              <CardDescription className="text-base">
                Your gentle, supportive sleep consultant. Like having a reassuring midwife guiding your sleep journey.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Button onClick={startOnboarding} size="lg" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const insight = getSleepInsight();
  const nextEvent = getNextEvent();

  return (
    <div className="min-h-screen bg-gradient-comfort pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Moon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Sleep Coach</h1>
              <p className="text-sm text-muted-foreground">Nunu's gentle guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Smart Pattern Summary */}
        <Card className={`border-l-4 ${
          insight.type === 'success' ? 'border-l-green-400 bg-green-50 dark:bg-green-950' :
          insight.type === 'encouragement' ? 'border-l-blue-400 bg-blue-50 dark:bg-blue-950' :
          'border-l-primary bg-primary-soft'
        }`}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-nunu-cream flex items-center justify-center flex-shrink-0 mt-1">
                🐨
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
                {insight.showCTA && (
                  <Button size="sm" className="mt-3 w-full" onClick={startSleepTracking}>
                    ✨ Start tracking your first night
                  </Button>
                )}
                {nextEvent && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {nextEvent}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Recommended Schedule
                </CardTitle>
                <CardDescription>
                  Based on {profile.babyAge} and your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini Timeline Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show ideal nap schedule</Label>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    Timeline View
                  </Button>
                </div>

                {profile.babyAge.includes('3-6') && (
                  <>
                    {/* Visual Timeline */}
                    <div className="relative">
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="w-2 h-8 bg-yellow-200 rounded"></div>
                        <div className="w-2 h-6 bg-blue-200 rounded"></div>
                        <div className="w-2 h-8 bg-blue-200 rounded"></div>
                        <div className="w-2 h-12 bg-indigo-300 rounded"></div>
                        <span className="text-xs text-muted-foreground ml-2">Daily rhythm</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">Wake Up</span>
                        <span className="text-muted-foreground">6:30-7:00 AM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-l-blue-400">
                        <span className="font-medium">Morning Nap</span>
                        <span className="text-muted-foreground">9:00-10:30 AM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-l-blue-400">
                        <span className="font-medium">Afternoon Nap</span>
                        <div className="text-right">
                          <span className="text-muted-foreground">1:00-2:30 PM</span>
                          <div className="text-xs text-blue-600">🕐 Next expected: ~1:15 PM</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg border-l-4 border-l-indigo-400">
                        <span className="font-medium">Bedtime</span>
                        <span className="text-muted-foreground">7:00-7:30 PM</span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="p-3 bg-accent-soft rounded-lg">
                  <p className="text-sm">
                    <strong>Wake Windows:</strong> 2-2.5 hours between sleeps. 
                    Watch for sleepy cues like rubbing eyes or yawning.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Method</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.currentMethod ? (
                  <div className="space-y-4">
                    {/* Color-coded method tag */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-sm ${
                          profile.currentMethod.includes('Ferber') ? 'bg-orange-100 text-orange-800 dark:bg-orange-950' :
                          profile.currentMethod.includes('Gentle') ? 'bg-green-100 text-green-800 dark:bg-green-950' :
                          profile.currentMethod.includes('No-Cry') ? 'bg-blue-100 text-blue-800 dark:bg-blue-950' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-950'
                        }`}
                      >
                        {profile.currentMethod} • Day {Math.floor((Date.now() - profile.dayStarted) / (1000 * 60 * 60 * 24)) + 1}
                      </Badge>
                    </div>
                    
                    <div className="p-3 bg-gradient-calm rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-sm">🐨</span>
                        <p className="text-sm text-muted-foreground">
                          It's okay to take your time. We'll find what works for you, together. 💛
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Stay consistent with your chosen method. Most babies need 3-7 days to adjust to new sleep patterns.
                    </p>
                    
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Switch Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gentle">🌱 Gentle Sleep Shaping</SelectItem>
                        <SelectItem value="ferber">🔄 Ferber Method</SelectItem>
                        <SelectItem value="chair">🪑 Chair Method</SelectItem>
                        <SelectItem value="nocry">💙 No-Cry Solutions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-gradient-calm rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Take a deep breath. We'll start gentle and adjust as needed. 🤗
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        setProfile(prev => ({ 
                          ...prev, 
                          currentMethod: prev.methods[0] || 'Gentle Sleep Shaping',
                          dayStarted: Date.now()
                        }));
                      }}
                    >
                      Start Sleep Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5" />
                  Sleep Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sleepLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Baby className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Start logging sleep to track progress</p>
                    <Button variant="outline" onClick={startSleepTracking}>Log Last Night</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {sleepLogs.slice(-7).reduce((sum, log) => sum + log.nightWakes, 0) / Math.min(7, sleepLogs.length)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Night Wakes</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {Math.round(sleepLogs.slice(-7).length)}
                        </div>
                        <div className="text-xs text-muted-foreground">Days Tracked</div>
                      </div>
                    </div>
                    
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      You're making great progress! Keep going 💙
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5" />
                  Today's Gentle Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-calm rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🐨</span>
                    <div>
                      <p className="text-sm leading-relaxed">
                        {profile.mainConcern === 'Frequent night wakes' 
                          ? "Night wakes are completely normal. Focus on helping your baby link sleep cycles rather than eliminating all wakes. You're doing amazing."
                          : "Remember, every small step counts. Progress isn't always linear, and that's perfectly okay."
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quick Sleep Facts:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        Overtired babies often fight sleep more
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        Consistency helps more than perfection
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        It's okay to pause and restart when needed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Remember: you know your baby best. Trust your instincts alongside these gentle suggestions.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Chat with Nunu
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Restart Setup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SleepCoach;
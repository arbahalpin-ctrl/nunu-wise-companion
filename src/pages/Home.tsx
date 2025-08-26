import { useState } from 'react';
import { Heart, Zap, Bed, Sparkles, HelpCircle, MessageCircle, Baby, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentWeekQuote } from '@/data/weeklyQuotes';
import koalaHero from '@/assets/koala-hero.jpg';
import FeedingTimer, { FeedingLog as FeedingLogType } from '@/components/FeedingTimer';
import FeedingLog from '@/components/FeedingLog';
import BreastSwitchPrompt from '@/components/BreastSwitchPrompt';

interface HomeProps {
  onTabChange?: (tab: string) => void;
}

const Home = ({ onTabChange }: HomeProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showFeedingTimer, setShowFeedingTimer] = useState(false);
  const [feedingLogs, setFeedingLogs] = useState<FeedingLogType[]>([]);
  const [showBreastSwitchPrompt, setShowBreastSwitchPrompt] = useState(false);
  const [lastFeedNotes, setLastFeedNotes] = useState('');
  const [timerProps, setTimerProps] = useState<{
    initialFeedingType?: 'left-breast' | 'right-breast' | 'bottle';
    previousNotes?: string;
  }>({});
  const currentQuote = getCurrentWeekQuote();

  // Sample baby data - this would come from baby profile in a real app
  const babyData = {
    name: "Emma",
    birthDate: new Date(Date.now() - (45 * 24 * 60 * 60 * 1000)), // 45 days ago
    lastFeed: "2 hours ago",
    lastSleep: "30 mins ago"
  };

  const getBabyAge = () => {
    const ageInDays = Math.floor((Date.now() - babyData.birthDate.getTime()) / (1000 * 60 * 60 * 24));
    if (ageInDays < 14) {
      return `${ageInDays} days old`;
    } else if (ageInDays < 70) {
      const weeks = Math.floor(ageInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} old`;
    } else {
      const months = Math.floor(ageInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} old`;
    }
  };

  const moods = [
    { id: 'great', icon: Zap, label: 'Energized', color: 'text-primary' },
    { id: 'light', icon: 'emoji', emoji: '✨', label: 'Light today', color: 'text-primary' },
    { id: 'hopeful', icon: Sparkles, label: 'Hopeful', color: 'text-nunu-sky' },
    { id: 'tender', icon: 'emoji', emoji: '🧸', label: 'Tender', color: 'text-nunu-blush' },
    { id: 'hanging', icon: 'emoji', emoji: '🫶', label: 'Hanging in there', color: 'text-nunu-sage' },
    { id: 'exhausted', icon: Bed, label: 'Exhausted', color: 'text-muted-foreground' },
    { id: 'tearful', icon: 'emoji', emoji: '😢', label: 'Tearful', color: 'text-primary' },
    { id: 'overwhelmed', icon: HelpCircle, label: 'Overwhelmed', color: 'text-destructive' },
    { id: 'unknown', icon: HelpCircle, label: "I don't know what I feel", color: 'text-muted-foreground' },
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleCheckin = () => {
    if (selectedMood) {
      setHasCheckedIn(true);
      // Here you would save the mood check-in
    }
  };

  const handleSaveFeed = (feed: FeedingLogType) => {
    setFeedingLogs(prev => [...prev, feed]);
    setLastFeedNotes(feed.notes);
    
    // If it was a left breast feed, prompt for right breast
    if (feed.feedingType === 'left-breast') {
      setShowFeedingTimer(false);
      setShowBreastSwitchPrompt(true);
    } else {
      setShowFeedingTimer(false);
    }
  };

  const handleBreastSwitchYes = () => {
    setShowBreastSwitchPrompt(false);
    setTimerProps({
      initialFeedingType: 'right-breast',
      previousNotes: lastFeedNotes
    });
    setShowFeedingTimer(true);
  };

  const handleBreastSwitchNo = () => {
    setShowBreastSwitchPrompt(false);
    setTimerProps({});
  };

  const handleStartFeedingTimer = () => {
    setTimerProps({});
    setShowFeedingTimer(true);
  };

  if (showFeedingTimer) {
    return (
      <FeedingTimer 
        onBack={() => setShowFeedingTimer(false)}
        onSaveFeed={handleSaveFeed}
        initialFeedingType={timerProps.initialFeedingType}
        previousNotes={timerProps.previousNotes}
      />
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      {/* Hero Section */}
      <div className="relative bg-gradient-nurture rounded-b-3xl overflow-hidden p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Koala Image */}
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full p-2 shadow-nurture backdrop-blur-sm border-2 border-white/30">
              <img 
                src={koalaHero} 
                alt="Gentle koala companion" 
                className="w-full h-full object-contain rounded-full drop-shadow-sm"
              />
            </div>
          </div>
          
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
              Hi, sweet mama <span className="text-primary animate-comfort-pulse">💛</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Take a moment just for you — how are you really feeling?
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Chat with Nunu - Conversation Starter */}
        <Card 
          className="shadow-gentle border-none bg-card cursor-pointer hover:shadow-comfort transition-all duration-300 hover:scale-[1.02]"
          onClick={() => onTabChange?.('chat')}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary animate-comfort-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-gentle-bounce"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Chat with Nunu</h3>
                <p className="text-muted-foreground text-sm">
                  What's on your mind today, mama? 💭
                </p>
                <p className="text-xs text-primary mt-1 font-medium">
                  Tap to start chatting • Nunu is listening...
                </p>
              </div>
              
              <div className="text-2xl">
                💬
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote of the Day */}
        <Card className="shadow-gentle border-none bg-accent/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-lg">✨</div>
              <div className="flex-1">
                <p className="text-sm text-accent-foreground italic leading-relaxed">
                  "{currentQuote.quote}" {currentQuote.emoji}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Baby Summary Widget */}
        <Card className="shadow-gentle border-none bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Baby className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{babyData.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {getBabyAge()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
                    <span>Fed {babyData.lastFeed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500/60 rounded-full"></div>
                    <span>Slept {babyData.lastSleep}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xl">
                👶
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Check-in */}
        {!hasCheckedIn ? (
          <Card className="shadow-gentle border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary animate-comfort-pulse" />
                <h2 className="font-semibold">Daily Check-in</h2>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                Your feelings matter. Let's gently name them — no pressure, no judgment.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {moods.map((mood) => {
                  const isSelected = selectedMood === mood.id;
                  
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-300 text-left
                        ${isSelected 
                          ? 'border-primary bg-primary-soft shadow-gentle' 
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                        }
                      `}
                    >
                      {mood.icon === 'emoji' ? (
                        <div className={`text-xl mb-2`}>{mood.emoji}</div>
                      ) : (
                        <mood.icon className={`h-6 w-6 mb-2 ${mood.color}`} />
                      )}
                      <span className="font-medium text-sm">{mood.label}</span>
                    </button>
                  );
                })}
              </div>

              <Button 
                onClick={handleCheckin}
                disabled={!selectedMood}
                className="w-full rounded-xl shadow-gentle"
              >
                Check In
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-gentle border-none bg-gradient-comfort">
            <CardContent className="p-6 text-center">
              <div className="animate-gentle-bounce mb-2">
                <Heart className="h-8 w-8 text-primary mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Thank you for sharing</h3>
              <p className="text-muted-foreground text-sm">
                Remember, you're doing an amazing job. Every feeling is valid. 💝
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className="shadow-nurture border-none cursor-pointer hover:scale-105 transition-transform"
              onClick={handleStartFeedingTimer}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🍼</div>
                <span className="text-sm font-medium">Log Feeding</span>
              </CardContent>
            </Card>
            
            <Card className="shadow-nurture border-none cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">😴</div>
                <span className="text-sm font-medium">Sleep Log</span>
              </CardContent>
            </Card>
            
            <Card className="shadow-nurture border-none cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🎵</div>
                <span className="text-sm font-medium">Voice Note</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Today's Feeding Log */}
        {feedingLogs.length > 0 && <FeedingLog feeds={feedingLogs} />}

        {/* Breast Switch Prompt */}
        <BreastSwitchPrompt
          isVisible={showBreastSwitchPrompt}
          onYes={handleBreastSwitchYes}
          onNo={handleBreastSwitchNo}
        />
      </div>
    </div>
  );
};

export default Home;
import { useState } from 'react';
import { Heart, Zap, Bed, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentWeekQuote } from '@/data/weeklyQuotes';
import koalaHero from '@/assets/koala-gentle.png';

const Home = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const currentQuote = getCurrentWeekQuote();

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

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      {/* Hero Section */}
      <div className="relative bg-gradient-nurture rounded-b-3xl overflow-hidden p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Koala Image */}
          <div className="relative">
            <div className="w-20 h-20 bg-white/90 rounded-full p-2 shadow-gentle backdrop-blur-sm border border-white/20">
              <img 
                src={koalaHero} 
                alt="Gentle koala companion" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Hi, sweet mama 💛
            </h1>
            <p className="text-muted-foreground">
              Take a moment just for you — how are you really feeling?
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
            <Card className="shadow-nurture border-none cursor-pointer hover:scale-105 transition-transform">
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
            
            <Card className="shadow-nurture border-none cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">💬</div>
                <span className="text-sm font-medium">Chat Support</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gentle Reminder */}
        <Card className="shadow-gentle border-none bg-accent-soft">
          <CardContent className="p-4">
            <p className="text-sm text-accent-foreground italic text-center">
              "{currentQuote.quote}" {currentQuote.emoji}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
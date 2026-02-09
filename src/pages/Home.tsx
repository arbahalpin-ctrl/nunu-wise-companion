import { useState } from 'react';
import { MessageCircle, Moon, Heart, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import koalaHero from '@/assets/nunu-logo.svg';

interface HomeProps {
  onTabChange?: (tab: string) => void;
}

const Home = ({ onTabChange }: HomeProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodResponse, setShowMoodResponse] = useState(false);

  const moods = [
    { id: 'great', emoji: '🔥', label: 'On fire!', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200' },
    { id: 'good', emoji: '😊', label: 'Good', color: 'bg-amber-100 border-amber-300 hover:bg-amber-200' },
    { id: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-teal-100 border-teal-300 hover:bg-teal-200' },
    { id: 'lost', emoji: '😶‍🌫️', label: 'Lost myself', color: 'bg-purple-100 border-purple-300 hover:bg-purple-200' },
    { id: 'overwhelmed', emoji: '😩', label: 'Overwhelmed', color: 'bg-rose-100 border-rose-300 hover:bg-rose-200' },
  ];

  const getMoodResponse = (mood: string) => {
    const responses: Record<string, string> = {
      great: "Yes! That spark is SHINING today! 🔥 This is what the journey looks like — keep building on this energy!",
      good: "Good is beautiful! Every good day is another step back to yourself. You're on your way! 💖",
      okay: "Okay is part of the journey too. You're still moving forward, even when it doesn't feel like it. ✨",
      tired: "Rest is part of reclaiming yourself. You can't pour from an empty cup — refill yours today. ⚡",
      lost: "Feeling lost is actually the first step to finding yourself again. You're not gone — you're transforming. The old you is still there, waiting. 💜",
      overwhelmed: "When it's all too much, remember: you're not losing yourself, you're becoming someone even stronger. Let's take this one breath at a time. 🤝",
    };
    return responses[mood] || "Thanks for checking in! Every moment of awareness brings you closer to yourself. ✨";
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowMoodResponse(true);
  };

  const handleTalkToNunu = () => {
    onTabChange?.('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        
        {/* Koala with glow effect */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-orange-300/30 rounded-full blur-2xl scale-110"></div>
          <div className="relative w-32 h-32 bg-white rounded-full p-3 shadow-lg border-4 border-orange-200">
            <img 
              src={koalaHero} 
              alt="Nunu" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* Greeting - Journey focused */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Welcome back ✨
          </h1>
          <p className="text-slate-600 text-sm">
            How are you feeling on your journey today?
          </p>
        </div>

        {/* Mood Selection */}
        {!showMoodResponse ? (
          <div className="w-full max-w-sm">
            <div className="grid grid-cols-3 gap-3 mb-8">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-200
                    hover:scale-105 active:scale-95 hover:shadow-md
                    ${mood.color}
                  `}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium text-slate-700">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-sm mb-8 border-none shadow-lg bg-white">
            <CardContent className="p-5 text-center">
              <div className="text-3xl mb-3">
                {moods.find(m => m.id === selectedMood)?.emoji}
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {getMoodResponse(selectedMood || '')}
              </p>
              <button 
                onClick={() => setShowMoodResponse(false)}
                className="text-sm text-orange-500 mt-4 hover:text-orange-600 font-medium"
              >
                Check in again
              </button>
            </CardContent>
          </Card>
        )}

        {/* Primary CTA */}
        <Button 
          onClick={handleTalkToNunu}
          size="lg"
          className="rounded-full px-8 py-6 text-base shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Chat with Nunu
        </Button>

        {/* Quick Access */}
        <div className="flex gap-6 mt-8">
          <button 
            onClick={() => onTabChange?.('sleep')}
            className="flex flex-col items-center text-slate-500 hover:text-orange-500 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-2 hover:bg-teal-200 transition-colors">
              <Moon className="h-5 w-5 text-teal-600" />
            </div>
            <span className="text-xs font-medium">Sleep wins</span>
          </button>
          <button 
            onClick={() => onTabChange?.('chat')}
            className="flex flex-col items-center text-slate-500 hover:text-orange-500 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-2 hover:bg-rose-200 transition-colors">
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
            <span className="text-xs font-medium">Find myself</span>
          </button>
        </div>
      </div>

      {/* Bottom - Journey reminder */}
      <div className="px-6 pb-24 text-center">
        <p className="text-sm text-orange-600 font-semibold">
          Your spark is still there. Let's find it together. 💖
        </p>
      </div>
    </div>
  );
};

export default Home;

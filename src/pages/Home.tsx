import { useState } from 'react';
import { MessageCircle, Moon, Heart, Sparkles, CloudRain, Battery, HelpCircle } from 'lucide-react';
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
    { id: 'good', emoji: '😊', label: 'Good', color: 'bg-emerald-100 border-emerald-300' },
    { id: 'okay', emoji: '😐', label: 'Okay', color: 'bg-amber-100 border-amber-300' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-blue-100 border-blue-300' },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-purple-100 border-purple-300' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-indigo-100 border-indigo-300' },
    { id: 'overwhelmed', emoji: '😩', label: 'Overwhelmed', color: 'bg-rose-100 border-rose-300' },
  ];

  const getMoodResponse = (mood: string) => {
    const responses: Record<string, string> = {
      good: "That's lovely to hear. Even good days deserve acknowledgment. 💛",
      okay: "Okay is okay. Not every day needs to be amazing.",
      tired: "Tiredness is so real in this season. You're running on fumes and still showing up.",
      anxious: "Anxiety can feel so heavy. Want to talk through what's on your mind?",
      sad: "Sadness is allowed here. You don't have to push through alone.",
      overwhelmed: "When everything feels like too much, let's just focus on right now. One breath.",
    };
    return responses[mood] || "Thanks for sharing how you're feeling.";
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowMoodResponse(true);
  };

  const handleTalkToNunu = () => {
    onTabChange?.('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        
        {/* Koala - Big and Central */}
        <div className="mb-6">
          <div className="w-36 h-36 bg-white rounded-full p-3 shadow-lg border-4 border-white">
            <img 
              src={koalaHero} 
              alt="Nunu" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Hey, you 💛
          </h1>
          <p className="text-slate-500">
            How are you feeling right now?
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
                    hover:scale-105 active:scale-95
                    ${mood.color}
                  `}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium text-slate-600">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-sm mb-8 border-none shadow-md bg-white/80 backdrop-blur">
            <CardContent className="p-5 text-center">
              <div className="text-3xl mb-3">
                {moods.find(m => m.id === selectedMood)?.emoji}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {getMoodResponse(selectedMood || '')}
              </p>
              <button 
                onClick={() => setShowMoodResponse(false)}
                className="text-sm text-slate-400 mt-4 hover:text-slate-600"
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
          className="rounded-full px-8 py-6 text-base shadow-lg bg-slate-800 hover:bg-slate-700"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Talk to Nunu
        </Button>

        {/* Quick Access - Subtle */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => onTabChange?.('chat')}
            className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Moon className="h-5 w-5 mb-1" />
            <span className="text-xs">Sleep help</span>
          </button>
          <button 
            onClick={() => onTabChange?.('chat')}
            className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">How I feel</span>
          </button>
        </div>
      </div>

      {/* Bottom - Subtle encouragement */}
      <div className="px-6 pb-24 text-center">
        <p className="text-sm text-slate-400 italic">
          You're doing better than you think.
        </p>
      </div>
    </div>
  );
};

export default Home;

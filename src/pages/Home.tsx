import { useState, useEffect } from 'react';
import { MessageCircle, Moon, Heart, Clock, Baby, Lightbulb, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import koalaHero from '@/assets/nunu-logo.svg';

interface HomeProps {
  onTabChange?: (tab: string) => void;
}

const BABY_AGE_KEY = 'nunu-baby-age-months';
const LAST_NAP_KEY = 'nunu-last-nap-time';

// Wake windows by age in months (in minutes)
const getWakeWindow = (ageMonths: number): { min: number; max: number; label: string } => {
  if (ageMonths < 1) return { min: 45, max: 60, label: '45-60 mins' };
  if (ageMonths < 2) return { min: 45, max: 75, label: '45-75 mins' };
  if (ageMonths < 3) return { min: 60, max: 90, label: '1-1.5 hrs' };
  if (ageMonths < 4) return { min: 75, max: 105, label: '1.25-1.75 hrs' };
  if (ageMonths < 5) return { min: 90, max: 120, label: '1.5-2 hrs' };
  if (ageMonths < 6) return { min: 105, max: 135, label: '1.75-2.25 hrs' };
  if (ageMonths < 7) return { min: 120, max: 150, label: '2-2.5 hrs' };
  if (ageMonths < 8) return { min: 135, max: 165, label: '2.25-2.75 hrs' };
  if (ageMonths < 9) return { min: 150, max: 180, label: '2.5-3 hrs' };
  if (ageMonths < 12) return { min: 165, max: 210, label: '2.75-3.5 hrs' };
  if (ageMonths < 18) return { min: 180, max: 240, label: '3-4 hrs' };
  return { min: 240, max: 360, label: '4-6 hrs' };
};

// Tips by age range
const getTipForAge = (ageMonths: number): string => {
  const tips: { maxAge: number; tips: string[] }[] = [
    { maxAge: 3, tips: [
      "Newborns sleep 14-17 hours but in short bursts. This is normal!",
      "Watch for sleepy cues: yawning, eye rubbing, fussiness.",
      "Day/night confusion is common. Keep days bright, nights dark.",
    ]},
    { maxAge: 5, tips: [
      "The 4-month sleep regression is coming (or here!). It's a brain development leap.",
      "Start building a simple bedtime routine now — it pays off later.",
      "Drowsy but awake is the goal, but don't stress if it's not happening yet.",
    ]},
    { maxAge: 8, tips: [
      "This is often a great age to start gentle sleep training if you want to.",
      "2-3 naps is typical now. Watch for the 3-to-2 nap transition.",
      "Separation anxiety may start affecting sleep around 6-8 months.",
    ]},
    { maxAge: 12, tips: [
      "The 8-10 month regression often coincides with crawling/standing.",
      "Most babies drop to 2 naps around 8-9 months.",
      "Early bedtime (6-7pm) often leads to better night sleep.",
    ]},
    { maxAge: 18, tips: [
      "The 2-to-1 nap transition usually happens between 13-18 months.",
      "Toddlers need 11-14 hours of sleep including naps.",
      "Consistent boundaries become more important now.",
    ]},
    { maxAge: 100, tips: [
      "Toddler sleep can be wild! Boundary setting is key.",
      "One nap of 1.5-2.5 hours is typical after 18 months.",
      "Big kid beds are usually better to delay until 2.5-3 years.",
    ]},
  ];
  
  const ageGroup = tips.find(t => ageMonths <= t.maxAge) || tips[tips.length - 1];
  const randomTip = ageGroup.tips[Math.floor(Math.random() * ageGroup.tips.length)];
  return randomTip;
};

const getMoodResponse = (mood: string): string => {
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

const Home = ({ onTabChange }: HomeProps) => {
  const [babyAgeMonths, setBabyAgeMonths] = useState<number | null>(() => {
    const saved = localStorage.getItem(BABY_AGE_KEY);
    return saved ? parseInt(saved) : null;
  });
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [ageInput, setAgeInput] = useState('');
  const [lastNapTime, setLastNapTime] = useState<number | null>(() => {
    const saved = localStorage.getItem(LAST_NAP_KEY);
    return saved ? parseInt(saved) : null;
  });
  const [timeSinceNap, setTimeSinceNap] = useState<string>('');
  const [dailyTip, setDailyTip] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'good', emoji: '😊', label: 'Good', color: 'bg-emerald-100 border-emerald-200' },
    { id: 'okay', emoji: '😐', label: 'Okay', color: 'bg-amber-100 border-amber-200' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-blue-100 border-blue-200' },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-purple-100 border-purple-200' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-indigo-100 border-indigo-200' },
    { id: 'overwhelmed', emoji: '😩', label: 'Overwhelmed', color: 'bg-rose-100 border-rose-200' },
  ];

  // Update tip when age changes
  useEffect(() => {
    if (babyAgeMonths !== null) {
      setDailyTip(getTipForAge(babyAgeMonths));
    }
  }, [babyAgeMonths]);

  // Timer for nap countdown
  useEffect(() => {
    if (!lastNapTime) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const diffMs = now - lastNapTime;
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      if (hours > 0) {
        setTimeSinceNap(`${hours}h ${mins}m ago`);
      } else {
        setTimeSinceNap(`${mins}m ago`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [lastNapTime]);

  const saveAge = () => {
    const months = parseInt(ageInput);
    if (!isNaN(months) && months >= 0 && months <= 48) {
      setBabyAgeMonths(months);
      localStorage.setItem(BABY_AGE_KEY, months.toString());
      setShowAgeInput(false);
    }
  };

  const logNapWake = () => {
    const now = Date.now();
    setLastNapTime(now);
    localStorage.setItem(LAST_NAP_KEY, now.toString());
  };

  const wakeWindow = babyAgeMonths !== null ? getWakeWindow(babyAgeMonths) : null;

  const getAgeDisplay = (months: number): string => {
    if (months < 1) return 'Newborn';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return years === 1 ? '1 year' : `${years} years`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col pb-24">
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-3 px-6">
        <div className="w-16 h-16 bg-white rounded-full p-2 shadow-md border-2 border-white mb-3">
          <img 
            src={koalaHero} 
            alt="Nunu" 
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Hey, you 💛</h1>
        <p className="text-sm text-slate-500">How are you feeling?</p>
      </div>

      <div className="flex-1 px-6 space-y-4">
        {/* Mood Check-in */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-5">
            {!selectedMood ? (
              <div className="grid grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all duration-200
                      hover:scale-[1.02] hover:shadow-md active:scale-[0.98]
                      ${mood.color}
                    `}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium text-slate-600">{mood.label}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">
                  {moods.find(m => m.id === selectedMood)?.emoji}
                </div>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {getMoodResponse(selectedMood)}
                </p>
                <button 
                  onClick={() => setSelectedMood(null)}
                  className="text-sm text-slate-400 mt-4 hover:text-slate-600"
                >
                  Check in again
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Baby Age & Wake Window Card */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-4">
            {babyAgeMonths === null || showAgeInput ? (
              <div className="text-center">
                <Baby className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-3">How old is your baby?</p>
                <div className="flex gap-2 justify-center">
                  <input
                    type="number"
                    placeholder="Age in months"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                    min="0"
                    max="48"
                  />
                  <Button onClick={saveAge} size="sm" className="bg-slate-800 hover:bg-slate-700">
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Baby className="h-5 w-5 text-slate-500" />
                    <span className="font-medium text-slate-700">{getAgeDisplay(babyAgeMonths)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowAgeInput(true);
                      setAgeInput(babyAgeMonths.toString());
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    edit
                  </button>
                </div>
                
                {wakeWindow && (
                  <div className="bg-sky-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Wake window</p>
                        <p className="font-semibold text-slate-800">{wakeWindow.label}</p>
                      </div>
                      <Clock className="h-8 w-8 text-sky-400" />
                    </div>
                    
                    {lastNapTime && (
                      <div className="mt-3 pt-3 border-t border-sky-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Last woke up</p>
                          <p className="text-sm font-medium text-slate-700">{timeSinceNap}</p>
                        </div>
                        <button
                          onClick={logNapWake}
                          className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50"
                        >
                          Update
                        </button>
                      </div>
                    )}
                    
                    {!lastNapTime && (
                      <button
                        onClick={logNapWake}
                        className="mt-3 w-full text-sm py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                      >
                        Log wake time
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onTabChange?.('chat')}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left"
          >
            <Moon className="h-7 w-7 text-indigo-400 mb-2" />
            <p className="font-medium text-slate-800 text-sm">Sleep help</p>
            <p className="text-xs text-slate-500 mt-0.5">Tips & troubleshooting</p>
          </button>
          
          <button
            onClick={() => onTabChange?.('chat')}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left"
          >
            <Heart className="h-7 w-7 text-rose-400 mb-2" />
            <p className="font-medium text-slate-800 text-sm">I need support</p>
            <p className="text-xs text-slate-500 mt-0.5">Talk it through</p>
          </button>
        </div>

        {/* Main CTA */}
        <Button 
          onClick={() => onTabChange?.('chat')}
          size="lg"
          className="w-full rounded-xl py-6 text-base shadow-md bg-slate-800 hover:bg-slate-700"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Talk to Nunu
        </Button>

        {/* Daily Tip */}
        {babyAgeMonths !== null && dailyTip && (
          <Card className="border-none shadow-sm bg-amber-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-700 mb-1">Tip for {getAgeDisplay(babyAgeMonths)}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{dailyTip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;

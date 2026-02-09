import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Plus, MessageCircle, Baby, Trash2, Timer, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SLEEP_STORAGE_KEY = 'nunu-sleep-data';

// 50+ sleep tips that rotate daily
const SLEEP_TIPS = [
  "Watch for sleepy cues like yawning, eye rubbing, or fussiness. Catching the sleep window helps avoid overtiredness.",
  "A dark room signals to your baby's brain that it's time to sleep. Consider blackout curtains for naps too.",
  "White noise can help mask household sounds and create a consistent sleep environment.",
  "A consistent bedtime routine (even just 10-15 minutes) helps signal to your baby that sleep is coming.",
  "The ideal room temperature for baby sleep is 68-72°F (20-22°C).",
  "Overtired babies often fight sleep harder. Watch for that first yawn and act on it.",
  "Drowsy but awake is the goal, but don't stress if you're not there yet — it takes practice.",
  "Early bedtimes (6-7pm) often lead to better night sleep than later ones.",
  "Motion sleep (car, stroller, swing) is still sleep. Don't feel guilty about contact naps.",
  "The 4-month sleep regression is actually a progression — your baby's sleep cycles are maturing.",
  "Babies wake between sleep cycles naturally. Giving them a moment before responding can help them learn to resettle.",
  "Day/night confusion is normal in newborns. Keep days bright and active, nights dark and calm.",
  "A feed-play-sleep routine can help prevent feed-to-sleep associations if that's a concern for you.",
  "Short naps (30-45 mins) are developmentally normal until around 5-6 months.",
  "Your baby's last wake window before bed is usually the longest one.",
  "Sleep begets sleep — a well-rested baby often sleeps better than an overtired one.",
  "Swaddling can help newborns feel secure, but stop once they show signs of rolling.",
  "Night wakings are biologically normal for babies — their stomachs are small and they need to eat.",
  "A lovey or comfort object can help with sleep after 12 months (not safe before then).",
  "Red or dim orange light is less disruptive to melatonin than white or blue light.",
  "Babies often have a \"witching hour\" in the evening — this is normal and temporary.",
  "Split nights (long wakeful periods at night) often mean too much day sleep or too early bedtime.",
  "The 8-10 month regression often coincides with crawling, standing, and separation anxiety.",
  "Teething can disrupt sleep, but usually only for a few days around tooth eruption.",
  "Sleep training isn't required — it's a personal choice. Do what works for your family.",
  "Contact naps are not a bad habit — they're biologically normal and won't last forever.",
  "A snack before bed (for older babies on solids) can help them sleep longer stretches.",
  "Bedtime resistance often means bedtime is too early or too late — experiment with timing.",
  "Wake windows are guidelines, not rules. Your baby's cues matter most.",
  "The 2-to-1 nap transition is one of the hardest — expect some rough weeks.",
  "Illness, travel, and developmental leaps can all temporarily disrupt sleep.",
  "Babies often sleep better in their own space, but room-sharing is recommended until 6-12 months.",
  "A pre-nap routine (even just 2-3 minutes) can help signal sleep time during the day.",
  "Cluster feeding in the evening is normal and can help babies sleep longer at night.",
  "Dream feeds (feeding while baby is still asleep) work for some babies but not others.",
  "Standing in the crib is a new skill — practice during the day so it's less exciting at night.",
  "Separation anxiety peaks around 8-10 months and 18 months. Extra comfort is okay.",
  "Crib hour (leaving baby in crib for an hour even if they wake early) can help extend naps.",
  "Sleep pressure builds during wake windows — that's why timing matters.",
  "Your presence is calming to your baby. Gradual retreat methods work well for some families.",
  "Consistency is more important than perfection. Pick a routine and stick with it.",
  "Babies often wake 45 minutes into a nap — this is one sleep cycle. They may resettle.",
  "Night weaning and sleep training are separate things. You can do one without the other.",
  "Screen time before bed can interfere with melatonin production — avoid for 1-2 hours before sleep.",
  "A full belly helps, but don't force feeds. Babies know when they're hungry.",
  "The first nap of the day usually comes easiest. Protect that one if you can.",
  "Nap transitions (4→3→2→1) are often bumpy. Expect some overtiredness during shifts.",
  "Your baby's temperament affects sleep. Some babies are just more sensitive sleepers.",
  "Fresh air and sunlight during the day can help regulate your baby's circadian rhythm.",
  "Pacifiers can be helpful for sleep and are associated with reduced SIDS risk.",
  "Bath time can be stimulating for some babies — move it earlier if bedtime is a struggle.",
  "Growth spurts can temporarily increase night waking and hunger. It passes.",
  "The \"pick up put down\" method works well for some babies — worth a try if gentle approaches appeal to you.",
  "Sleep regressions are temporary. Most last 2-6 weeks, though it feels like forever.",
  "Your baby's circadian rhythm starts developing around 2-3 months. Before that, sleep is chaotic.",
  "Keeping one hand on baby's chest can help them feel secure when placed in the crib.",
  "Shushing, swaying, and side-lying (the 5 S's) can help calm fussy babies.",
  "A too-late bedtime often causes more night waking, not less.",
  "Nursing or bottle-feeding to sleep isn't a problem unless it's a problem for you.",
  "Daylight savings transitions are hard — shift schedules by 15 mins over several days.",
];

const getDailyTip = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return SLEEP_TIPS[dayOfYear % SLEEP_TIPS.length];
};

interface SleepSession {
  id: string;
  startTime: string; // ISO string for storage
  endTime?: string;
  duration?: number; // in minutes
}

interface SleepData {
  babyAge: number;
  napCount: number; // 1, 2, or 3 naps per day
  isAsleep: boolean;
  currentSleepStart: string | null;
  lastWakeTime: string;
  sessions: SleepSession[];
}

interface SleepProps {
  onTabChange?: (tab: string) => void;
}

const loadSleepData = (): SleepData => {
  try {
    const saved = localStorage.getItem(SLEEP_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load sleep data:', e);
  }
  return {
    babyAge: 6,
    napCount: 2,
    isAsleep: false,
    currentSleepStart: null,
    lastWakeTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sessions: []
  };
};

const Sleep = ({ onTabChange }: SleepProps) => {
  const [sleepData, setSleepData] = useState<SleepData>(loadSleepData);
  const [now, setNow] = useState(new Date());
  
  // Destructure for easier use
  const { babyAge, napCount, isAsleep, currentSleepStart, lastWakeTime, sessions } = sleepData;
  
  // Update time every minute for live countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Save to localStorage whenever sleepData changes
  useEffect(() => {
    try {
      localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(sleepData));
    } catch (e) {
      console.error('Failed to save sleep data:', e);
    }
  }, [sleepData]);
  
  const updateSleepData = (updates: Partial<SleepData>) => {
    setSleepData(prev => ({ ...prev, ...updates }));
  };

  // Wake window recommendations by nap count (in minutes)
  // These are typical ranges - first window is usually shortest, last is longest
  const wakeWindowsByNaps: Record<number, { min: number; max: number; pattern: string; typical: string }> = {
    4: { min: 45, max: 90, pattern: "1-1.5h / 1.5h / 1.5h / 1.5-2h", typical: "0-3 months" },
    3: { min: 90, max: 150, pattern: "1.5-2h / 2-2.5h / 2.5-3h", typical: "4-8 months" },
    2: { min: 150, max: 240, pattern: "2.5-3h / 3-3.5h / 3.5-4h", typical: "8-14 months" },
    1: { min: 270, max: 360, pattern: "4.5-5h / 5-6h", typical: "14+ months" },
  };

  const getWakeWindow = () => {
    return wakeWindowsByNaps[napCount] || wakeWindowsByNaps[2];
  };
  
  // Suggest nap count based on age
  const getSuggestedNapCount = () => {
    if (babyAge <= 3) return 4;
    if (babyAge <= 5) return 3;
    if (babyAge <= 8) return 3;
    if (babyAge <= 14) return 2;
    return 1;
  };

  const getTimeSinceWake = () => {
    const wakeDate = new Date(lastWakeTime);
    const diff = now.getTime() - wakeDate.getTime();
    return Math.floor(diff / (1000 * 60)); // minutes
  };
  
  const getTimeUntilNextNap = () => {
    const wakeWindow = getWakeWindow();
    const timeSinceWake = getTimeSinceWake();
    const minTimeUntil = wakeWindow.min - timeSinceWake;
    const maxTimeUntil = wakeWindow.max - timeSinceWake;
    return { minTimeUntil, maxTimeUntil };
  };
  
  const getWakeWindowProgress = () => {
    const wakeWindow = getWakeWindow();
    const timeSinceWake = getTimeSinceWake();
    // Progress from 0 to min wake window
    if (timeSinceWake < wakeWindow.min) {
      return (timeSinceWake / wakeWindow.min) * 50; // 0-50%
    }
    // Progress from min to max (ideal zone is 50-100%)
    if (timeSinceWake <= wakeWindow.max) {
      const inWindow = timeSinceWake - wakeWindow.min;
      const windowSize = wakeWindow.max - wakeWindow.min;
      return 50 + (inWindow / windowSize) * 50;
    }
    // Past max
    return 100;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSleepStart = () => {
    updateSleepData({
      isAsleep: true,
      currentSleepStart: new Date().toISOString()
    });
  };

  const handleWakeUp = () => {
    if (currentSleepStart) {
      const startDate = new Date(currentSleepStart);
      const nowDate = new Date();
      const duration = Math.floor((nowDate.getTime() - startDate.getTime()) / (1000 * 60));
      
      const newSession: SleepSession = {
        id: Date.now().toString(),
        startTime: currentSleepStart,
        endTime: nowDate.toISOString(),
        duration
      };
      
      updateSleepData({
        isAsleep: false,
        currentSleepStart: null,
        lastWakeTime: nowDate.toISOString(),
        sessions: [newSession, ...sessions]
      });
    } else {
      updateSleepData({
        isAsleep: false,
        currentSleepStart: null,
        lastWakeTime: new Date().toISOString()
      });
    }
  };

  const deleteSession = (id: string) => {
    updateSleepData({
      sessions: sessions.filter(s => s.id !== id)
    });
  };
  
  const setBabyAgeValue = (age: number) => {
    updateSleepData({ babyAge: age });
  };
  
  const setNapCountValue = (count: number) => {
    updateSleepData({ napCount: count });
  };

  const wakeWindow = getWakeWindow();
  const timeSinceWake = getTimeSinceWake();
  const isInWakeWindow = timeSinceWake >= wakeWindow.min && timeSinceWake <= wakeWindow.max;
  const isPastWakeWindow = timeSinceWake > wakeWindow.max;

  const getTotalSleepToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessions.filter(s => new Date(s.startTime) >= today);
    return todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  };
  
  const getTodayNapCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.filter(s => new Date(s.startTime) >= today).length;
  };
  
  const nextNap = getTimeUntilNextNap();
  const wakeWindowProgress = getWakeWindowProgress();

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sleep</h1>
            <p className="text-slate-500 mt-1">Track and understand patterns</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTabChange?.('chat')}
            className="text-slate-600"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Get advice
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Baby Settings */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Baby className="h-5 w-5 text-slate-400" />
                <span className="text-slate-600">Baby's age</span>
              </div>
              <select 
                value={babyAge}
                onChange={(e) => setBabyAgeValue(Number(e.target.value))}
                className="bg-slate-100 border-none rounded-lg px-3 py-2 text-slate-700 font-medium"
              >
                {[...Array(25)].map((_, i) => (
                  <option key={i} value={i}>{i} month{i !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-slate-400" />
                <span className="text-slate-600">Naps per day</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setNapCountValue(count)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      napCount === count 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            
            {napCount !== getSuggestedNapCount() && (
              <p className="text-xs text-slate-400 text-right">
                💡 Typical for {babyAge}m: {getSuggestedNapCount()} nap{getSuggestedNapCount() !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Status Card */}
        <Card className={`border-none shadow-md ${isAsleep ? 'bg-indigo-100' : 'bg-white'}`}>
          <CardContent className="p-6">
            {isAsleep ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Moon className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-1">Sleeping</h2>
                <p className="text-indigo-600 mb-4">
                  Started at {currentSleepStart && formatTime(new Date(currentSleepStart))}
                </p>
                <Button 
                  onClick={handleWakeUp}
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Baby woke up
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isPastWakeWindow ? 'bg-amber-100' : isInWakeWindow ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  <Sun className={`h-8 w-8 ${
                    isPastWakeWindow ? 'text-amber-600' : isInWakeWindow ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-1">Awake</h2>
                <p className={`mb-1 ${
                  isPastWakeWindow ? 'text-amber-600 font-medium' : 'text-slate-500'
                }`}>
                  {formatDuration(timeSinceWake)} since last wake
                </p>
                {isPastWakeWindow && (
                  <p className="text-amber-600 text-sm mb-3 flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    May be overtired
                  </p>
                )}
                <Button 
                  onClick={handleSleepStart}
                  className="bg-slate-800 hover:bg-slate-700 rounded-full px-8 mt-2"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Baby fell asleep
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Next Nap Prediction - only show when awake */}
        {!isAsleep && (
          <Card className={`border-none shadow-sm ${
            isInWakeWindow ? 'bg-emerald-50 border-emerald-200' : 
            isPastWakeWindow ? 'bg-amber-50 border-amber-200' : 'bg-slate-50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Timer className={`h-4 w-4 ${
                  isInWakeWindow ? 'text-emerald-600' : 
                  isPastWakeWindow ? 'text-amber-600' : 'text-slate-500'
                }`} />
                <span className={`font-medium ${
                  isInWakeWindow ? 'text-emerald-800' : 
                  isPastWakeWindow ? 'text-amber-800' : 'text-slate-700'
                }`}>Next nap</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-3 bg-slate-200 rounded-full mb-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPastWakeWindow ? 'bg-amber-500' : 
                    isInWakeWindow ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.min(wakeWindowProgress, 100)}%` }}
                />
              </div>
              
              <div className="text-center">
                {nextNap.minTimeUntil > 0 ? (
                  <p className="text-slate-600">
                    Nap window opens in <strong className="text-slate-800">{formatDuration(nextNap.minTimeUntil)}</strong>
                  </p>
                ) : nextNap.maxTimeUntil > 0 ? (
                  <p className="text-emerald-700">
                    ✓ <strong>Ideal nap time now!</strong> Window closes in {formatDuration(nextNap.maxTimeUntil)}
                  </p>
                ) : (
                  <p className="text-amber-700">
                    <strong>Past ideal window</strong> — baby may be overtired
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wake Window Guide */}
        <Card className="border-none shadow-sm bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="font-medium text-slate-700">Wake windows for {napCount} nap{napCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Wake window range</p>
                <p className="font-semibold text-slate-800">
                  {formatDuration(wakeWindow.min)} – {formatDuration(wakeWindow.max)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Typical pattern</p>
                <p className="font-medium text-slate-700">{wakeWindow.pattern}</p>
              </div>
              <p className="text-xs text-slate-400">
                💡 First wake window is usually shortest, last is longest
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-medium text-slate-700 mb-3">Today's sleep</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{formatDuration(getTotalSleepToday())}</p>
                <p className="text-sm text-slate-500">Total logged</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">{getTodayNapCount()}</p>
                <p className="text-sm text-slate-500">Naps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Log */}
        {sessions.length > 0 && (
          <div>
            <h3 className="font-medium text-slate-700 mb-3 px-1">Recent sleep</h3>
            <div className="space-y-2">
              {sessions.slice(0, 5).map((session) => (
                <Card key={session.id} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Moon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {formatTime(new Date(session.startTime))} – {session.endTime && formatTime(new Date(session.endTime))}
                          </p>
                          <p className="text-sm text-slate-500">
                            {session.duration && formatDuration(session.duration)}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteSession(session.id)}
                        className="text-slate-300 hover:text-slate-500 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Daily Tip */}
        <Card className="border-none shadow-sm bg-indigo-50">
          <CardContent className="p-4">
            <p className="text-xs text-indigo-500 mb-1">Daily tip</p>
            <p className="text-sm text-indigo-800 leading-relaxed">
              💡 {getDailyTip()}
            </p>
          </CardContent>
        </Card>

        {/* Get Help */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onTabChange?.('chat')}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat with Nunu about sleep
        </Button>
      </div>
    </div>
  );
};

export default Sleep;

import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Plus, MessageCircle, Baby, Trash2, Timer, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SLEEP_STORAGE_KEY = 'nunu-sleep-data';

interface SleepSession {
  id: string;
  startTime: string; // ISO string for storage
  endTime?: string;
  duration?: number; // in minutes
}

interface SleepData {
  babyAge: number;
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
  const { babyAge, isAsleep, currentSleepStart, lastWakeTime, sessions } = sleepData;
  
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

  // Wake window recommendations by age (in minutes)
  const wakeWindows: Record<number, { min: number; max: number; naps: string }> = {
    0: { min: 45, max: 60, naps: "4-5 naps" },
    1: { min: 45, max: 75, naps: "4-5 naps" },
    2: { min: 60, max: 90, naps: "4-5 naps" },
    3: { min: 75, max: 105, naps: "3-4 naps" },
    4: { min: 90, max: 120, naps: "3-4 naps" },
    5: { min: 105, max: 150, naps: "3 naps" },
    6: { min: 120, max: 180, naps: "2-3 naps" },
    7: { min: 135, max: 195, naps: "2-3 naps" },
    8: { min: 150, max: 210, naps: "2 naps" },
    9: { min: 165, max: 225, naps: "2 naps" },
    10: { min: 180, max: 240, naps: "2 naps" },
    11: { min: 195, max: 270, naps: "2 naps" },
    12: { min: 210, max: 300, naps: "1-2 naps" },
  };

  const getWakeWindow = () => {
    const ageKey = Math.min(babyAge, 12);
    return wakeWindows[ageKey] || wakeWindows[12];
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
        {/* Baby Age Selector */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
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
              <span className="font-medium text-slate-700">Wake window guide</span>
              <span className="text-xs text-slate-400">({babyAge} months)</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Ideal awake time</p>
                <p className="font-semibold text-slate-800">
                  {formatDuration(wakeWindow.min)} – {formatDuration(wakeWindow.max)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Typical naps</p>
                <p className="font-semibold text-slate-800">{wakeWindow.naps}</p>
              </div>
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

        {/* Quick Tips */}
        <Card className="border-none shadow-sm bg-indigo-50">
          <CardContent className="p-4">
            <p className="text-sm text-indigo-800 leading-relaxed">
              💡 <strong>Tip:</strong> Watch for sleepy cues like yawning, eye rubbing, or fussiness. 
              Catching the sleep window helps avoid overtiredness.
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

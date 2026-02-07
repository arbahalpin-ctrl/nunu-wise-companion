import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Plus, MessageCircle, Baby, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SleepLog {
  id: string;
  type: 'sleep' | 'wake';
  time: Date;
}

interface SleepSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
}

interface SleepProps {
  onTabChange?: (tab: string) => void;
}

const Sleep = ({ onTabChange }: SleepProps) => {
  const [babyAge, setBabyAge] = useState(6); // months
  const [isAsleep, setIsAsleep] = useState(false);
  const [currentSleepStart, setCurrentSleepStart] = useState<Date | null>(null);
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [lastWakeTime, setLastWakeTime] = useState<Date>(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago

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
    const now = new Date();
    const diff = now.getTime() - lastWakeTime.getTime();
    return Math.floor(diff / (1000 * 60)); // minutes
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
    const now = new Date();
    setIsAsleep(true);
    setCurrentSleepStart(now);
  };

  const handleWakeUp = () => {
    if (currentSleepStart) {
      const now = new Date();
      const duration = Math.floor((now.getTime() - currentSleepStart.getTime()) / (1000 * 60));
      
      const newSession: SleepSession = {
        id: Date.now().toString(),
        startTime: currentSleepStart,
        endTime: now,
        duration
      };
      
      setSleepSessions(prev => [newSession, ...prev]);
      setLastWakeTime(now);
    }
    
    setIsAsleep(false);
    setCurrentSleepStart(null);
  };

  const deleteSession = (id: string) => {
    setSleepSessions(prev => prev.filter(s => s.id !== id));
  };

  const wakeWindow = getWakeWindow();
  const timeSinceWake = getTimeSinceWake();
  const isInWakeWindow = timeSinceWake >= wakeWindow.min && timeSinceWake <= wakeWindow.max;
  const isPastWakeWindow = timeSinceWake > wakeWindow.max;

  const getTotalSleepToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sleepSessions.filter(s => s.startTime >= today);
    return todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  };

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
                onChange={(e) => setBabyAge(Number(e.target.value))}
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
                  Started at {currentSleepStart && formatTime(currentSleepStart)}
                </p>
                <Button 
                  onClick={handleWakeUp}
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Wake up
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
                <p className={`mb-4 ${
                  isPastWakeWindow ? 'text-amber-600 font-medium' : 'text-slate-500'
                }`}>
                  {formatDuration(timeSinceWake)} since last wake
                  {isPastWakeWindow && ' — may be overtired'}
                </p>
                <Button 
                  onClick={handleSleepStart}
                  className="bg-slate-800 hover:bg-slate-700 rounded-full px-8"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Start sleep
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
                <p className="text-2xl font-bold text-slate-800">{sleepSessions.filter(s => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return s.startTime >= today;
                }).length}</p>
                <p className="text-sm text-slate-500">Naps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Log */}
        {sleepSessions.length > 0 && (
          <div>
            <h3 className="font-medium text-slate-700 mb-3 px-1">Recent sleep</h3>
            <div className="space-y-2">
              {sleepSessions.slice(0, 5).map((session) => (
                <Card key={session.id} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Moon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {formatTime(session.startTime)} – {session.endTime && formatTime(session.endTime)}
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

import React, { useState, useEffect, Component } from 'react';
import { Moon, Sun, Clock, BookOpen, TrendingUp, ChevronRight, CheckCircle2, AlertCircle, ThermometerSun, Volume2, Baby, Calendar, Play, Pause, RotateCcw, Sparkles, MessageCircle, ChevronDown, ChevronUp, Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import SleepAssessment, { SleepAssessmentData } from '@/components/SleepAssessment';
import SleepPlan from '@/components/SleepPlan';
import SleepProgram from '@/components/SleepProgram';
import { injectSleepProgramStartMessage } from '@/utils/chatIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ASSESSMENT_STORAGE_KEY = 'nunu-sleep-assessment';
const PROGRAM_STORAGE_KEY = 'nunu-sleep-program';
const BABY_AGE_KEY = 'nunu-baby-age-months';
const WAKE_TIME_KEY = 'nunu-last-wake-time';
const NAP_LOG_KEY = 'nunu-nap-log';
const TIMER_STATE_KEY = 'nunu-timer-state';

interface NapLog {
  id: string;
  date: string;
  wakeTime: number;
  napStart: number | null;
  napEnd: number | null;
  duration: number | null;
}

interface TimerState {
  isRunning: boolean;
  wakeTime: number | null;
  napStartTime: number | null;
}

// Wake window data by age (in minutes)
const WAKE_WINDOWS: Record<string, { min: number; max: number; naps: string; totalDay: string }> = {
  '0-4w': { min: 35, max: 60, naps: '4-8', totalDay: '15-18 hrs' },
  '4-8w': { min: 45, max: 75, naps: '4-6', totalDay: '14-17 hrs' },
  '2-3m': { min: 60, max: 90, naps: '4-5', totalDay: '14-16 hrs' },
  '3-4m': { min: 75, max: 120, naps: '3-4', totalDay: '14-16 hrs' },
  '4-6m': { min: 90, max: 150, naps: '3', totalDay: '12-15 hrs' },
  '6-8m': { min: 120, max: 180, naps: '2-3', totalDay: '12-15 hrs' },
  '8-10m': { min: 150, max: 210, naps: '2', totalDay: '12-14 hrs' },
  '10-12m': { min: 180, max: 240, naps: '2', totalDay: '12-14 hrs' },
  '12-18m': { min: 210, max: 300, naps: '1-2', totalDay: '11-14 hrs' },
  '18-24m': { min: 300, max: 360, naps: '1', totalDay: '11-14 hrs' },
};

const getAgeCategory = (months: number): string => {
  if (months < 1) return '0-4w';
  if (months < 2) return '4-8w';
  if (months < 3) return '2-3m';
  if (months < 4) return '3-4m';
  if (months < 6) return '4-6m';
  if (months < 8) return '6-8m';
  if (months < 10) return '8-10m';
  if (months < 12) return '10-12m';
  if (months < 18) return '12-18m';
  return '18-24m';
};

const formatDuration = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${mins}m`;
};

const formatDurationWithSeconds = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${seconds}s`;
};

const formatTimeOfDay = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

// Error boundary wrapper
class SleepErrorBoundary extends Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-medium text-slate-800 mb-2">Something went wrong</p>
            <p className="text-sm text-slate-500 mb-4">Let's reset and start fresh</p>
            <Button
              onClick={() => {
                this.props.onReset();
                this.setState({ hasError: false });
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Reset Sleep Data
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface SleepProps {
  onTabChange?: (tab: string) => void;
}

type SleepStage = 'assessment' | 'plan' | 'program';
type SleepSubTab = 'learn' | 'track' | 'plan';

const Sleep = ({ onTabChange }: SleepProps) => {
  // Sub-tab navigation
  const [activeSubTab, setActiveSubTab] = useState<SleepSubTab>('learn');
  
  // Baby age
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(() => {
    const saved = localStorage.getItem(BABY_AGE_KEY);
    return saved ? parseInt(saved) : 4;
  });

  // Timer state
  const [timerState, setTimerState] = useState<TimerState>(() => {
    try {
      const saved = localStorage.getItem(TIMER_STATE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { isRunning: false, wakeTime: null, napStartTime: null };
  });
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Nap logs
  const [napLogs, setNapLogs] = useState<NapLog[]>(() => {
    try {
      const saved = localStorage.getItem(NAP_LOG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  
  // Edit modal state
  const [editingNap, setEditingNap] = useState<NapLog | null>(null);
  const [showAddNap, setShowAddNap] = useState(false);
  const [newNapWake, setNewNapWake] = useState('');
  const [newNapStart, setNewNapStart] = useState('');
  const [newNapEnd, setNewNapEnd] = useState('');
  
  // Learn section state
  const [expandedLearnSection, setExpandedLearnSection] = useState<string | null>('wake-windows');
  
  // Sleep Plan section (existing assessment flow)
  const [stage, setStage] = useState<SleepStage>('assessment');
  const [assessment, setAssessment] = useState<SleepAssessmentData | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Save timer state
  useEffect(() => {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(timerState));
  }, [timerState]);

  // Save nap logs
  useEffect(() => {
    localStorage.setItem(NAP_LOG_KEY, JSON.stringify(napLogs));
  }, [napLogs]);

  // Load saved assessment state
  useEffect(() => {
    try {
      const savedAssessment = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
      if (savedAssessment) {
        const parsedAssessment = JSON.parse(savedAssessment);
        if (parsedAssessment.babyName && typeof parsedAssessment.babyAgeMonths === 'number') {
          setAssessment(parsedAssessment);
          setBabyAgeMonths(parsedAssessment.babyAgeMonths);
          
          const savedProgram = localStorage.getItem(PROGRAM_STORAGE_KEY);
          if (savedProgram) {
            const parsedProgram = JSON.parse(savedProgram);
            setStage(parsedProgram.isActive ? 'program' : 'plan');
          } else {
            setStage('plan');
          }
        }
      }
    } catch (e) {
      console.error('Failed to load sleep state:', e);
    }
  }, []);

  // Save baby age
  useEffect(() => {
    localStorage.setItem(BABY_AGE_KEY, babyAgeMonths.toString());
  }, [babyAgeMonths]);

  const ageCategory = getAgeCategory(babyAgeMonths);
  const wakeWindow = WAKE_WINDOWS[ageCategory];
  
  // Calculate timer values
  const minutesSinceWake = timerState.wakeTime ? Math.floor((currentTime - timerState.wakeTime) / 60000) : 0;
  const wakeWindowProgress = timerState.wakeTime ? Math.min((minutesSinceWake / wakeWindow.max) * 100, 100) : 0;
  const isOvertime = minutesSinceWake > wakeWindow.max;
  const isNearEnd = minutesSinceWake >= wakeWindow.min && !isOvertime;

  // Timer actions
  const startTimer = () => {
    setTimerState({
      isRunning: true,
      wakeTime: Date.now(),
      napStartTime: null
    });
  };

  const startNap = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      napStartTime: Date.now()
    }));
  };

  const endNap = () => {
    if (timerState.wakeTime && timerState.napStartTime) {
      const napEnd = Date.now();
      const duration = Math.round((napEnd - timerState.napStartTime) / 60000);
      
      const newLog: NapLog = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        wakeTime: timerState.wakeTime,
        napStart: timerState.napStartTime,
        napEnd: napEnd,
        duration: duration
      };
      
      setNapLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 naps
    }
    
    // Reset and start new wake window
    setTimerState({
      isRunning: true,
      wakeTime: Date.now(),
      napStartTime: null
    });
  };

  const resetTimer = () => {
    setTimerState({
      isRunning: false,
      wakeTime: null,
      napStartTime: null
    });
  };

  // Manual nap entry
  const addManualNap = () => {
    if (!newNapStart || !newNapEnd) return;
    
    const today = new Date().toISOString().split('T')[0];
    const startTimestamp = new Date(`${today}T${newNapStart}`).getTime();
    const endTimestamp = new Date(`${today}T${newNapEnd}`).getTime();
    
    if (startTimestamp && endTimestamp && endTimestamp > startTimestamp) {
      const duration = Math.round((endTimestamp - startTimestamp) / 60000);
      
      // Use nap end time as "wake time" for next window calculation
      const newLog: NapLog = {
        id: Date.now().toString(),
        date: today,
        wakeTime: endTimestamp,
        napStart: startTimestamp,
        napEnd: endTimestamp,
        duration: duration
      };
      
      setNapLogs(prev => [newLog, ...prev].slice(0, 50));
      setShowAddNap(false);
      setNewNapWake('');
      setNewNapStart('');
      setNewNapEnd('');
    }
  };

  const deleteNap = (id: string) => {
    setNapLogs(prev => prev.filter(n => n.id !== id));
  };

  const updateNap = (updatedNap: NapLog) => {
    setNapLogs(prev => prev.map(n => n.id === updatedNap.id ? updatedNap : n));
    setEditingNap(null);
  };

  // Get today's naps
  const today = new Date().toISOString().split('T')[0];
  const todaysNaps = napLogs.filter(n => n.date === today);
  const recentNaps = napLogs.slice(0, 10);

  // Calculate next nap time based on last wake
  const getNextNapWindow = () => {
    if (todaysNaps.length === 0) return null;
    const lastNap = todaysNaps[0]; // Most recent
    if (!lastNap.napEnd) return null;
    
    const lastWakeTime = lastNap.napEnd;
    const minNapTime = new Date(lastWakeTime + wakeWindow.min * 60000);
    const maxNapTime = new Date(lastWakeTime + wakeWindow.max * 60000);
    
    return {
      wakeTime: new Date(lastWakeTime),
      minTime: minNapTime,
      maxTime: maxNapTime,
      isNow: Date.now() >= minNapTime.getTime() && Date.now() <= maxNapTime.getTime(),
      isPast: Date.now() > maxNapTime.getTime()
    };
  };

  const nextNap = getNextNapWindow();

  // Sleep Plan section handlers
  const handleAssessmentComplete = (data: SleepAssessmentData) => {
    setAssessment(data);
    setBabyAgeMonths(data.babyAgeMonths);
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(data));
    setStage('plan');
  };

  const handleStartProgram = () => {
    const methodId = getMethodId();
    const intervals = assessment && assessment.cryingTolerance >= 4 ? [3, 5, 10, 10, 12, 15] : [];
    const newProgram = {
      startDate: new Date().toISOString().split('T')[0],
      methodId,
      nightLogs: [],
      currentNight: 1,
      isActive: true,
      checkInIntervals: intervals,
    };
    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(newProgram));
    if (assessment) {
      injectSleepProgramStartMessage(assessment.babyName, methodId);
    }
    setStage('program');
  };

  const getMethodId = () => {
    if (!assessment) return 'fading';
    const { cryingTolerance, babyAgeMonths } = assessment;
    if (cryingTolerance <= 2 || babyAgeMonths < 4) return 'fading';
    if (cryingTolerance === 3) return 'pupd';
    if (cryingTolerance === 4) return 'ferber';
    return 'extinction';
  };

  const handleResetProgram = () => {
    localStorage.removeItem(PROGRAM_STORAGE_KEY);
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    setAssessment(null);
    setStage('assessment');
  };

  const handleOpenChat = () => {
    onTabChange?.('chat');
  };

  // What's normal by age
  const getWhatsNormal = () => {
    if (babyAgeMonths < 3) {
      return {
        title: "Newborn (0-3 months)",
        points: [
          "Waking every 2-3 hours is biologically normal — their tummies are tiny",
          "Day/night confusion is common in the first weeks",
          "Sleep is disorganized — they're not developmentally ready for schedules yet",
          "You cannot spoil a newborn by responding to them",
          "Total sleep: 14-17 hours in 24 hours, but in short bursts"
        ],
        reassurance: "This phase is about survival, not optimization. You're doing great just by being there."
      };
    } else if (babyAgeMonths < 6) {
      return {
        title: "3-6 months",
        points: [
          "Sleep starts consolidating — longer stretches become possible",
          "The 4-month regression is real: sleep cycles mature and everything feels harder",
          "1-2 night feeds is still normal and expected",
          "Naps may be short (30-45 mins) — this is developmental, not a problem",
          "Bedtime may start shifting earlier (6-8pm sweet spot)"
        ],
        reassurance: "This is when sleep foundations can start to form, but there's no rush. Follow your baby's cues."
      };
    } else if (babyAgeMonths < 12) {
      return {
        title: "6-12 months",
        points: [
          "Many babies can sleep through the night — but many still wake, and that's okay",
          "2 naps is typical (morning + afternoon)",
          "8-10 month regression often hits (separation anxiety, mobility)",
          "Night weaning is possible but not required",
          "Total sleep: 12-15 hours including naps"
        ],
        reassurance: "If you want to work on sleep, this is a good age. But only if YOU want to — not because you 'should.'"
      };
    } else {
      return {
        title: "12+ months",
        points: [
          "Transitioning from 2 naps to 1 usually happens between 12-18 months",
          "12 month regression can appear (walking, teething, independence)",
          "Separation anxiety may peak — this is healthy attachment",
          "Bedtime battles and stalling tactics emerge (toddlerhood!)",
          "Total sleep: 11-14 hours including 1-2 naps"
        ],
        reassurance: "Toddler sleep has its own challenges. Consistency and boundaries become your friends."
      };
    }
  };

  const whatsNormal = getWhatsNormal();

  // Render Learn tab
  const renderLearnTab = () => (
    <div className="px-6 space-y-4 pb-24">
      {/* Age Selector */}
      <Card className="border-none shadow-sm bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-600">Showing info for</p>
              <p className="text-lg font-bold text-indigo-700">{babyAgeMonths} month{babyAgeMonths !== 1 ? 's' : ''} old</p>
            </div>
            <select
              value={babyAgeMonths}
              onChange={(e) => setBabyAgeMonths(parseInt(e.target.value))}
              className="bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-700"
            >
              {[...Array(25)].map((_, i) => (
                <option key={i} value={i}>{i} month{i !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Wake Windows Guide */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => setExpandedLearnSection(expandedLearnSection === 'wake-windows' ? null : 'wake-windows')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Sun className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Wake Windows</h3>
                <p className="text-sm text-slate-500">How long should baby stay awake?</p>
              </div>
            </div>
            {expandedLearnSection === 'wake-windows' ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedLearnSection === 'wake-windows' && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white mb-4">
                <p className="text-amber-100 text-xs mb-1">At {babyAgeMonths} months, aim for</p>
                <p className="text-2xl font-bold">{formatDuration(wakeWindow.min)} – {formatDuration(wakeWindow.max)}</p>
                <p className="text-amber-100 text-sm mt-1">awake between sleeps</p>
              </div>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                  <p><strong>Expected naps:</strong> {wakeWindow.naps} per day</p>
                </div>
                <div className="flex items-start gap-2">
                  <Moon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <p><strong>Total sleep:</strong> {wakeWindow.totalDay} in 24 hours</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Watch your baby, not just the clock. Sleepy cues (yawning, eye rubbing, fussiness) trump any schedule.
                </p>
              </div>

              {/* All age ranges */}
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2">Quick reference by age:</p>
                <div className="space-y-2">
                  {Object.entries(WAKE_WINDOWS).map(([age, data]) => (
                    <div 
                      key={age} 
                      className={`flex justify-between text-sm py-1.5 px-2 rounded ${
                        age === ageCategory ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-600'
                      }`}
                    >
                      <span>{age}</span>
                      <span>{formatDuration(data.min)} – {formatDuration(data.max)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What's Normal */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => setExpandedLearnSection(expandedLearnSection === 'whats-normal' ? null : 'whats-normal')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Baby className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">What's Normal</h3>
                <p className="text-sm text-slate-500">{whatsNormal.title}</p>
              </div>
            </div>
            {expandedLearnSection === 'whats-normal' ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedLearnSection === 'whats-normal' && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-4">
              <ul className="space-y-3">
                {whatsNormal.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-800 italic">
                  {whatsNormal.reassurance}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Environment */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => setExpandedLearnSection(expandedLearnSection === 'environment' ? null : 'environment')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Moon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Sleep Environment</h3>
                <p className="text-sm text-slate-500">Setting up for success</p>
              </div>
            </div>
            {expandedLearnSection === 'environment' ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedLearnSection === 'environment' && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Moon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Darkness</p>
                  <p className="text-sm text-slate-500">Pitch black is ideal. Use blackout curtains — even small light leaks can affect sleep.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Volume2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">White Noise</p>
                  <p className="text-sm text-slate-500">Continuous, not too loud (50-60 dB). Place across the room, not next to baby's head.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <ThermometerSun className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Temperature</p>
                  <p className="text-sm text-slate-500">16-20°C (60-68°F) is ideal. Babies sleep better slightly cool than warm.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Safe Sleep</p>
                  <p className="text-sm text-slate-500">Firm mattress, no loose bedding, baby on back. Nothing in the crib except baby.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Regressions */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => setExpandedLearnSection(expandedLearnSection === 'regressions' ? null : 'regressions')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Sleep Regressions</h3>
                <p className="text-sm text-slate-500">When sleep falls apart (and why)</p>
              </div>
            </div>
            {expandedLearnSection === 'regressions' ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedLearnSection === 'regressions' && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
              <p className="text-sm text-slate-600">
                Regressions aren't actually going backwards — they're developmental leaps. Sleep disrupts while the brain reorganizes.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800">4 months</p>
                  <p className="text-sm text-slate-500">Sleep cycles mature permanently. Often feels like the worst one.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800">8-10 months</p>
                  <p className="text-sm text-slate-500">Separation anxiety + mobility (crawling, standing). Baby wants YOU.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800">12 months</p>
                  <p className="text-sm text-slate-500">Walking, teething, independence. Nap transition may start.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800">18 months</p>
                  <p className="text-sm text-slate-500">Language explosion, toddler independence, FOMO peaks.</p>
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg">
                <p className="text-sm text-rose-800">
                  <strong>The good news:</strong> Most regressions last 2-4 weeks. Stay consistent, and sleep usually returns to baseline.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* The Nunu S.L.E.E.P. Method */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => setExpandedLearnSection(expandedLearnSection === 'sleep-method' ? null : 'sleep-method')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">The Nunu S.L.E.E.P. Method</h3>
                <p className="text-sm text-slate-500">Our gentle, evidence-based approach</p>
              </div>
            </div>
            {expandedLearnSection === 'sleep-method' ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedLearnSection === 'sleep-method' && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
              <p className="text-sm text-slate-600">
                A balanced, judgment-free framework that meets you where you are.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                  <p className="font-bold text-indigo-700">S — Set the Stage</p>
                  <p className="text-sm text-slate-600">Create optimal sleep conditions: dark room, white noise, cool temperature (16-20°C), safe sleep space.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="font-bold text-purple-700">L — Learn Your Baby</p>
                  <p className="text-sm text-slate-600">Understand their unique cues, temperament, and developmental stage. Watch baby, not just the clock.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-bold text-blue-700">E — Establish Routines</p>
                  <p className="text-sm text-slate-600">Predictable patterns signal sleep time. Consistent bedtime routine (15-20 mins) helps baby anticipate rest.</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <p className="font-bold text-emerald-700">E — Empower Independence</p>
                  <p className="text-sm text-slate-600">When ready, gradually build self-soothing skills. Start gentle, adjust based on what works for YOUR family.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <p className="font-bold text-amber-700">P — Practice Patience</p>
                  <p className="text-sm text-slate-600">Sleep is developmental — progress isn't linear. Setbacks are normal. You're doing great.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                <p className="text-sm text-slate-700">
                  <strong>💜 Our philosophy:</strong> No judgment, no "shoulds." We support co-sleeping, sleep training, and everything in between. What matters is what works for YOUR family.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-white border border-slate-200 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Evidence-based</p>
                  <p className="text-sm font-medium text-slate-700">✓ Research-backed</p>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Approach</p>
                  <p className="text-sm font-medium text-slate-700">✓ Gentle-first</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Training Methods Quick Guide */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => setExpandedLearnSection(expandedLearnSection === 'methods' ? null : 'methods')}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Sleep Training Methods</h3>
                <p className="text-sm text-slate-500">Overview of different approaches</p>
              </div>
            </div>
            {expandedLearnSection === 'methods' ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedLearnSection === 'methods' && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-3">
              <p className="text-sm text-slate-600 mb-3">
                No method is "right" — only what's right for your family. All have research support.
              </p>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-800">Gentle / No-Cry</p>
                    <p className="text-xs text-slate-500">Pick Up/Put Down, Fading, Chair Method</p>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">Low crying</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Gradual, parent-present approaches. Slower but minimal distress.</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-800">Ferber (Graduated)</p>
                    <p className="text-xs text-slate-500">Check-ins at increasing intervals</p>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">Moderate</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Brief check-ins (3-5-10 mins). Usually effective within 3-7 nights.</p>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-800">Extinction (CIO)</p>
                    <p className="text-xs text-slate-500">No intervention until morning</p>
                  </div>
                  <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded">More crying</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Fastest results (2-4 nights). Research shows no long-term harm.</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Nunu approach:</strong> Start with gentler methods. If they don't work after 2 weeks of consistency, consider more structured options.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat CTA */}
      <button
        onClick={handleOpenChat}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-left shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Have questions?</h3>
            <p className="text-indigo-100 text-sm">Chat with Nunu about sleep</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/70" />
        </div>
      </button>
    </div>
  );

  // Render Track tab - SIMPLIFIED VERSION
  const renderTrackTab = () => (
    <div className="px-6 space-y-4 pb-24">
      {/* Baby Age Selector */}
      <Card className="border-none shadow-sm bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-600">Tracking for</p>
              <p className="text-lg font-bold text-indigo-700">{babyAgeMonths} month{babyAgeMonths !== 1 ? 's' : ''} old</p>
            </div>
            <select
              value={babyAgeMonths}
              onChange={(e) => setBabyAgeMonths(parseInt(e.target.value))}
              className="bg-white border border-indigo-200 rounded-lg px-3 py-2 text-indigo-700"
            >
              {[...Array(25)].map((_, i) => (
                <option key={i} value={i}>{i} month{i !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-indigo-600 mt-2">
            Wake window: <strong>{formatDuration(wakeWindow.min)} – {formatDuration(wakeWindow.max)}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Next Nap Recommendation */}
      {nextNap && (
        <Card className={`border-none shadow-md ${nextNap.isNow ? 'bg-amber-500' : nextNap.isPast ? 'bg-rose-500' : 'bg-emerald-500'}`}>
          <CardContent className="p-4 text-white">
            <p className="text-white/80 text-sm">
              {nextNap.isNow ? '💤 Ideal nap window NOW' : nextNap.isPast ? '⚠️ Past ideal window' : '⏰ Next nap window'}
            </p>
            <p className="text-2xl font-bold mt-1">
              {nextNap.minTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {nextNap.maxTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-white/80 text-sm mt-1">
              Based on wake at {nextNap.wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Log Nap Button */}
      <Button 
        onClick={() => setShowAddNap(true)} 
        className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Log a Nap
      </Button>

      {/* Today's Naps */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-3">Today's Naps</h3>

        {todaysNaps.length === 0 ? (
          <Card className="border-none shadow-sm bg-slate-50">
            <CardContent className="p-6 text-center">
              <Moon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No naps logged yet</p>
              <p className="text-slate-400 text-sm">Tap "Log a Nap" to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {todaysNaps.map((nap, i) => (
              <Card key={nap.id} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-600">#{todaysNaps.length - i}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {nap.napStart && nap.napEnd ? (
                            <>
                              {formatTimeOfDay(nap.napStart)} → {formatTimeOfDay(nap.napEnd)}
                            </>
                          ) : 'In progress'}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {nap.duration && (
                            <span className="text-sm text-indigo-600 font-medium">
                              😴 {formatDuration(nap.duration)}
                            </span>
                          )}
                          {nap.napEnd && (
                            <span className="text-sm text-slate-500">
                              Woke {formatTimeOfDay(nap.napEnd)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setEditingNap(nap)}
                        className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteNap(nap.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Daily Summary */}
            <Card className="border-none shadow-sm bg-emerald-50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">Total nap time today:</span>
                  <span className="font-bold text-emerald-700">
                    {formatDuration(todaysNaps.reduce((acc, n) => acc + (n.duration || 0), 0))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Nap Modal - Simplified */}
      {showAddNap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <Card className="w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Log Nap</h3>
                <button 
                  onClick={() => setShowAddNap(false)} 
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    😴 Nap started
                  </label>
                  <input
                    type="time"
                    value={newNapStart}
                    onChange={(e) => setNewNapStart(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    ☀️ Woke up
                  </label>
                  <input
                    type="time"
                    value={newNapEnd}
                    onChange={(e) => setNewNapEnd(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                
                {newNapStart && newNapEnd && (
                  <div className="p-3 bg-indigo-50 rounded-xl text-center">
                    <span className="text-indigo-700 font-medium">
                      Nap duration: {(() => {
                        const [sh, sm] = newNapStart.split(':').map(Number);
                        const [eh, em] = newNapEnd.split(':').map(Number);
                        const mins = (eh * 60 + em) - (sh * 60 + sm);
                        return mins > 0 ? formatDuration(mins) : '--';
                      })()}
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={addManualNap} 
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 py-4 text-lg rounded-xl"
                disabled={!newNapStart || !newNapEnd}
              >
                Save Nap
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Nap Modal */}
      {editingNap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Edit Nap</h3>
                <button onClick={() => setEditingNap(null)} className="text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600">Woke up at</label>
                  <input
                    type="time"
                    defaultValue={editingNap.wakeTime ? new Date(editingNap.wakeTime).toTimeString().slice(0,5) : ''}
                    onChange={(e) => {
                      const date = new Date(editingNap.date);
                      const [h, m] = e.target.value.split(':');
                      date.setHours(parseInt(h), parseInt(m));
                      setEditingNap({...editingNap, wakeTime: date.getTime()});
                    }}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Nap started at</label>
                  <input
                    type="time"
                    defaultValue={editingNap.napStart ? new Date(editingNap.napStart).toTimeString().slice(0,5) : ''}
                    onChange={(e) => {
                      const date = new Date(editingNap.date);
                      const [h, m] = e.target.value.split(':');
                      date.setHours(parseInt(h), parseInt(m));
                      setEditingNap({...editingNap, napStart: date.getTime()});
                    }}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Nap ended at</label>
                  <input
                    type="time"
                    defaultValue={editingNap.napEnd ? new Date(editingNap.napEnd).toTimeString().slice(0,5) : ''}
                    onChange={(e) => {
                      const date = new Date(editingNap.date);
                      const [h, m] = e.target.value.split(':');
                      date.setHours(parseInt(h), parseInt(m));
                      const napEnd = date.getTime();
                      const duration = editingNap.napStart ? Math.round((napEnd - editingNap.napStart) / 60000) : null;
                      setEditingNap({...editingNap, napEnd, duration});
                    }}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => updateNap(editingNap)} 
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Render Sleep Plan tab (existing assessment flow)
  const renderPlanTab = () => {
    if (stage === 'assessment') {
      return (
        <SleepAssessment 
          onComplete={handleAssessmentComplete}
          onSkip={() => {
            if (assessment) {
              const savedProgram = localStorage.getItem(PROGRAM_STORAGE_KEY);
              setStage(savedProgram ? 'program' : 'plan');
            }
          }}
        />
      );
    }

    if (stage === 'plan' && assessment) {
      return (
        <SleepPlan 
          assessment={assessment}
          onStartProgram={handleStartProgram}
          onEditAssessment={() => setStage('assessment')}
          onOpenChat={handleOpenChat}
        />
      );
    }

    if (stage === 'program' && assessment) {
      return (
        <SleepProgram 
          assessment={assessment}
          onOpenChat={handleOpenChat}
          onResetProgram={handleResetProgram}
        />
      );
    }

    // Intro when no assessment
    return (
      <div className="px-6 space-y-4 pb-24">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to improve sleep?</h2>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">
            Get a personalized sleep plan based on your baby's age, your comfort level, and your goals.
          </p>
          <Button 
            onClick={() => setStage('assessment')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Start Sleep Assessment
          </Button>
        </div>

        <Card className="border-none shadow-sm bg-purple-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-purple-800 mb-2">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                Personalized method recommendation
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                Optimal schedule for your baby's age
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                Night-by-night guidance
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                Science-backed explanations
              </li>
            </ul>
          </CardContent>
        </Card>

        <button
          onClick={handleOpenChat}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 text-left shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Not sure if you're ready?</h3>
              <p className="text-purple-100 text-sm">Chat with Nunu first</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70" />
          </div>
        </button>
      </div>
    );
  };

  return (
    <SleepErrorBoundary onReset={handleResetProgram}>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-20">
        {/* Header */}
        <div className="p-6 pb-2">
          <h1 className="text-2xl font-bold text-slate-800">Sleep</h1>
          <p className="text-slate-500 mt-1">Learn, track & plan better sleep</p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="px-6 mb-4">
          <div className="flex bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveSubTab('learn')}
              className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'learn'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Learn
            </button>
            <button
              onClick={() => setActiveSubTab('track')}
              className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'track'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="h-4 w-4" />
              Track
            </button>
            <button
              onClick={() => setActiveSubTab('plan')}
              className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'plan'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Moon className="h-4 w-4" />
              Sleep Plan
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeSubTab === 'learn' && renderLearnTab()}
        {activeSubTab === 'track' && renderTrackTab()}
        {activeSubTab === 'plan' && renderPlanTab()}
      </div>
    </SleepErrorBoundary>
  );
};

export default Sleep;

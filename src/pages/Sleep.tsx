import React, { useState, useEffect, Component } from 'react';
import { Moon, Sun, Clock, BookOpen, TrendingUp, ChevronRight, CheckCircle2, AlertCircle, ThermometerSun, Volume2, Baby, Calendar, Play, Pause, RotateCcw, Sparkles, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
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

const formatTime = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${mins}m`;
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
type SleepSubTab = 'learn' | 'track' | 'improve';

const Sleep = ({ onTabChange }: SleepProps) => {
  // Sub-tab navigation
  const [activeSubTab, setActiveSubTab] = useState<SleepSubTab>('learn');
  
  // Baby age
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(() => {
    const saved = localStorage.getItem(BABY_AGE_KEY);
    return saved ? parseInt(saved) : 4;
  });

  // Wake window tracker
  const [lastWakeTime, setLastWakeTime] = useState<number | null>(() => {
    const saved = localStorage.getItem(WAKE_TIME_KEY);
    return saved ? parseInt(saved) : null;
  });
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Learn section state
  const [expandedLearnSection, setExpandedLearnSection] = useState<string | null>('wake-windows');
  
  // Improve section (existing assessment flow)
  const [stage, setStage] = useState<SleepStage>('assessment');
  const [assessment, setAssessment] = useState<SleepAssessmentData | null>(null);

  // Update current time every second for the timer
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Save wake time
  useEffect(() => {
    if (lastWakeTime) {
      localStorage.setItem(WAKE_TIME_KEY, lastWakeTime.toString());
    }
  }, [lastWakeTime]);

  const ageCategory = getAgeCategory(babyAgeMonths);
  const wakeWindow = WAKE_WINDOWS[ageCategory];
  
  const minutesSinceWake = lastWakeTime ? Math.floor((currentTime - lastWakeTime) / 60000) : 0;
  const wakeWindowProgress = lastWakeTime ? Math.min((minutesSinceWake / wakeWindow.max) * 100, 100) : 0;
  const isOvertime = minutesSinceWake > wakeWindow.max;
  const isNearEnd = minutesSinceWake >= wakeWindow.min && !isOvertime;

  // Improve section handlers
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
                <p className="text-2xl font-bold">{formatTime(wakeWindow.min)} – {formatTime(wakeWindow.max)}</p>
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
                      <span>{formatTime(data.min)} – {formatTime(data.max)}</span>
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

  // Render Track tab
  const renderTrackTab = () => (
    <div className="px-6 space-y-4 pb-24">
      {/* Wake Window Timer */}
      <Card className="border-none shadow-md overflow-hidden">
        <div className={`p-6 ${isOvertime ? 'bg-rose-500' : isNearEnd ? 'bg-amber-500' : 'bg-indigo-500'} text-white`}>
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">
              {lastWakeTime ? 'Awake for' : 'Wake window timer'}
            </p>
            <p className="text-5xl font-bold">
              {lastWakeTime ? formatTime(minutesSinceWake) : '--:--'}
            </p>
            {lastWakeTime && (
              <p className="text-white/80 text-sm mt-2">
                {isOvertime 
                  ? '⚠️ Over wake window — baby may be overtired'
                  : isNearEnd 
                    ? '💤 Sleepy window — good time to start nap routine'
                    : `Target: ${formatTime(wakeWindow.min)} – ${formatTime(wakeWindow.max)}`
                }
              </p>
            )}
          </div>

          {lastWakeTime && (
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isOvertime ? 'bg-white' : 'bg-white/80'}`}
                  style={{ width: `${wakeWindowProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>0</span>
                <span>{formatTime(wakeWindow.min)}</span>
                <span>{formatTime(wakeWindow.max)}</span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex gap-2">
            {!lastWakeTime ? (
              <Button 
                onClick={() => setLastWakeTime(Date.now())}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Baby just woke
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setLastWakeTime(Date.now())}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset (woke again)
                </Button>
                <Button 
                  onClick={() => {
                    setLastWakeTime(null);
                    localStorage.removeItem(WAKE_TIME_KEY);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Nap started
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="border-none shadow-sm bg-slate-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">At {babyAgeMonths} months</p>
              <p className="font-medium text-slate-800">Wake window: {formatTime(wakeWindow.min)} – {formatTime(wakeWindow.max)}</p>
            </div>
            <button
              onClick={() => setActiveSubTab('learn')}
              className="text-indigo-600 text-sm hover:underline"
            >
              Learn more
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Sleepy Cues Reminder */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-medium text-slate-800 mb-3">Watch for sleepy cues:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-lg">🥱</span> Yawning
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-lg">👀</span> Eye rubbing
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-lg">😫</span> Fussiness
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-lg">🙈</span> Looking away
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-lg">✊</span> Clenched fists
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-lg">😴</span> Zoning out
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Improve tab (existing assessment flow)
  const renderImproveTab = () => {
    // Check if already in assessment flow
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

    // Show intro card if no assessment yet
    return (
      <div className="px-6 space-y-4 pb-24">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to improve sleep?</h2>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">
            Get a personalized sleep plan based on your baby's age, your comfort level, and your goals.
          </p>
          <Button 
            onClick={() => setStage('assessment')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Start Sleep Assessment
          </Button>
        </div>

        <Card className="border-none shadow-sm bg-indigo-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-indigo-800 mb-2">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5" />
                Personalized method recommendation
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5" />
                Optimal schedule for your baby's age
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5" />
                Night-by-night guidance
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5" />
                Science-backed explanations
              </li>
            </ul>
          </CardContent>
        </Card>

        <button
          onClick={handleOpenChat}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-left shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Not sure if you're ready?</h3>
              <p className="text-indigo-100 text-sm">Chat with Nunu first</p>
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
          <p className="text-slate-500 mt-1">Learn, track, and improve baby sleep</p>
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
              onClick={() => setActiveSubTab('improve')}
              className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'improve'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Improve
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeSubTab === 'learn' && renderLearnTab()}
        {activeSubTab === 'track' && renderTrackTab()}
        {activeSubTab === 'improve' && renderImproveTab()}
      </div>
    </SleepErrorBoundary>
  );
};

export default Sleep;

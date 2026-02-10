import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, CheckCircle2, TrendingDown, MessageCircle, ChevronRight, Sparkles, AlertCircle, Trophy, Play, Pause, RotateCcw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SleepAssessmentData } from './SleepAssessment';
import { injectTimedCheckIn } from '@/utils/chatIntegration';

const PROGRAM_STORAGE_KEY = 'nunu-sleep-program';

interface NightLog {
  date: string; // YYYY-MM-DD
  bedtimeMinutesToSleep: number;
  nightWakings: number;
  longestStretch: number; // minutes
  totalCrying: number; // minutes
  morningWakeTime: string;
  parentMood: number; // 1-5
  notes?: string;
}

interface ProgramData {
  startDate: string;
  methodId: string;
  nightLogs: NightLog[];
  currentNight: number;
  isActive: boolean;
  checkInIntervals: number[];
  bedtimeStartedAt?: string; // ISO timestamp for when tonight's bedtime started
  checkInsDismissed?: string[]; // Track which check-ins have been dismissed tonight
}

interface SleepProgramProps {
  assessment: SleepAssessmentData;
  onOpenChat: () => void;
  onResetProgram: () => void;
}

const SleepProgram = ({ assessment, onOpenChat, onResetProgram }: SleepProgramProps) => {
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [showMorningCheckIn, setShowMorningCheckIn] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [pendingCheckIn, setPendingCheckIn] = useState<'20min' | '60min' | null>(null);
  const [checkInLog, setCheckInLog] = useState<NightLog>({
    date: new Date().toISOString().split('T')[0],
    bedtimeMinutesToSleep: 30,
    nightWakings: 3,
    longestStretch: 180,
    totalCrying: 45,
    morningWakeTime: '06:30',
    parentMood: 3,
  });

  // Load program data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRAM_STORAGE_KEY);
      if (saved) {
        setProgramData(JSON.parse(saved));
      } else {
        // Initialize new program
        const intervals = assessment.cryingTolerance >= 4 ? [3, 5, 10, 10, 12, 15] : [];
        const newProgram: ProgramData = {
          startDate: new Date().toISOString().split('T')[0],
          methodId: getMethodId(),
          nightLogs: [],
          currentNight: 1,
          isActive: true,
          checkInIntervals: intervals,
        };
        setProgramData(newProgram);
        localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(newProgram));
      }
    } catch (e) {
      console.error('Failed to load program data:', e);
    }
  }, []);

  // Save program data
  useEffect(() => {
    if (programData) {
      localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(programData));
    }
  }, [programData]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Could add notification/vibration here
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  // Track elapsed time since bedtime started & show check-in prompts
  useEffect(() => {
    if (!programData?.bedtimeStartedAt) {
      setElapsedMinutes(0);
      return;
    }
    
    const updateElapsed = () => {
      const started = new Date(programData.bedtimeStartedAt!).getTime();
      const now = Date.now();
      const mins = Math.floor((now - started) / 60000);
      setElapsedMinutes(mins);
      
      // Check if we should show a check-in prompt
      const dismissed = programData.checkInsDismissed || [];
      if (mins >= 20 && mins < 60 && !dismissed.includes('20min') && pendingCheckIn !== '20min') {
        setPendingCheckIn('20min');
      } else if (mins >= 60 && !dismissed.includes('60min') && pendingCheckIn !== '60min') {
        setPendingCheckIn('60min');
      }
    };
    
    updateElapsed();
    const interval = setInterval(updateElapsed, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [programData?.bedtimeStartedAt, programData?.checkInsDismissed, pendingCheckIn]);

  const getMethodId = () => {
    const { cryingTolerance, babyAgeMonths } = assessment;
    if (cryingTolerance <= 2 || babyAgeMonths < 4) return 'fading';
    if (cryingTolerance === 3) return 'pupd';
    if (cryingTolerance === 4) return 'ferber';
    return 'extinction';
  };

  const getCurrentNightGuidance = () => {
    if (!programData) return null;
    const { currentNight, methodId } = programData;
    
    if (methodId === 'ferber') {
      const intervals = currentNight === 1 ? [3, 5, 10] : 
                       currentNight === 2 ? [5, 10, 12] :
                       currentNight >= 3 ? [10, 12, 15] : [3, 5, 10];
      return {
        title: `Night ${currentNight}: Ferber Method`,
        intervals,
        guidance: currentNight === 1 
          ? "First night is the hardest. Expect 30-60 minutes of crying. You'll do check-ins at 3, 5, then 10 minute intervals. You've got this!"
          : currentNight === 2
          ? "Night 2 is often worse — it's called an extinction burst. This is normal and actually means it's working. Start with 5 minute intervals tonight."
          : currentNight === 3
          ? "Night 3 is usually when you start seeing improvement. If last night was rough, tonight should be better. Start with 10 minute intervals."
          : currentNight <= 5
          ? "You're in the home stretch! Most babies are falling asleep with minimal fussing by now. Keep the same intervals."
          : "You should be seeing great results by now! Keep being consistent.",
        tips: currentNight === 1 
          ? ["Have a distraction ready for yourself", "Watch on monitor if it helps", "Text a friend for support"]
          : currentNight === 2
          ? ["Don't give up — night 2 being worse is expected", "This is the most important night to stay consistent", "Tomorrow will likely be better"]
          : ["Consistency is paying off", "Keep the same routine", "Celebrate small wins!"]
      };
    }
    
    if (methodId === 'pupd') {
      return {
        title: `Night ${currentNight}: Pick Up / Put Down`,
        guidance: currentNight === 1
          ? "Tonight may take many repetitions (20-40+). Stay calm and patient. Pick up when crying, put down when calm."
          : currentNight === 2
          ? "You might need fewer pick-ups tonight. Stay consistent with the pattern."
          : currentNight >= 3
          ? "Most babies need significantly fewer pick-ups by now. You're doing great!"
          : "Keep going with the same approach.",
        tips: ["Stay calm — baby feels your energy", "Put down the moment they're calm, not asleep", "It's okay if it takes a long time"]
      };
    }
    
    if (methodId === 'fading') {
      return {
        title: `Night ${currentNight}: Gentle Fading`,
        guidance: currentNight === 1
          ? "Tonight, just try stopping your soothing slightly earlier than usual. Small steps!"
          : currentNight <= 7
          ? `Week 1: Continue making small changes. End your soothing a little earlier each night.`
          : "Keep gradually reducing your involvement. Progress may be slow but it's happening!",
        tips: ["No rush — gentle means gradual", "Respond to crying immediately", "Tiny changes add up over time"]
      };
    }
    
    // Extinction
    return {
      title: `Night ${currentNight}: Full Extinction`,
      guidance: currentNight === 1
        ? "Put baby down, say goodnight, and don't go back in. This is hard but usually the fastest method. Watch on monitor for safety."
        : currentNight === 2
        ? "Night 2 is often the hardest (extinction burst). Stay strong — this usually means it's working."
        : currentNight >= 3
        ? "You should see significant improvement from here. Most of the hard work is done!"
        : "Stay consistent with the approach.",
      tips: currentNight === 1
        ? ["Have the monitor on for peace of mind", "Distract yourself — don't watch the whole time", "This is the hardest part for parents"]
        : ["Consistency is everything", "Don't go back to old habits", "You're almost through the hardest part"]
    };
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setTimerRunning(true);
  };

  const formatTimerDisplay = () => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitMorningCheckIn = () => {
    if (!programData) return;
    
    const updatedLogs = [...programData.nightLogs, checkInLog];
    const updatedProgram = {
      ...programData,
      nightLogs: updatedLogs,
      currentNight: programData.currentNight + 1,
      bedtimeStartedAt: undefined, // Reset for next night
      checkInsDismissed: [], // Reset check-ins for next night
    };
    
    setProgramData(updatedProgram);
    setShowMorningCheckIn(false);
    
    // Reset check-in log for next time
    setCheckInLog({
      date: new Date().toISOString().split('T')[0],
      bedtimeMinutesToSleep: 30,
      nightWakings: 3,
      longestStretch: 180,
      totalCrying: 45,
      morningWakeTime: '06:30',
      parentMood: 3,
    });
  };

  const startBedtime = () => {
    if (!programData) return;
    setProgramData({
      ...programData,
      bedtimeStartedAt: new Date().toISOString(),
      checkInsDismissed: [],
    });
    setShowTimer(true);
  };

  const handleCheckInResponse = (checkInType: '20min' | '60min', wantToChat: boolean) => {
    if (!programData) return;
    
    // Dismiss this check-in
    const dismissed = [...(programData.checkInsDismissed || []), checkInType];
    setProgramData({
      ...programData,
      checkInsDismissed: dismissed,
    });
    setPendingCheckIn(null);
    
    if (wantToChat) {
      // Inject the supportive message into chat and navigate
      injectTimedCheckIn(checkInType, assessment.babyName);
      onOpenChat();
    }
  };

  const endBedtimeSession = () => {
    if (!programData) return;
    setProgramData({
      ...programData,
      bedtimeStartedAt: undefined,
    });
    setShowTimer(false);
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const getProgressMessage = () => {
    if (!programData || programData.nightLogs.length < 2) return null;
    
    const logs = programData.nightLogs;
    const first = logs[0];
    const last = logs[logs.length - 1];
    
    if (last.nightWakings < first.nightWakings) {
      return {
        type: 'success',
        message: `Amazing! Night wakings down from ${first.nightWakings} to ${last.nightWakings}! 🎉`
      };
    }
    
    if (last.bedtimeMinutesToSleep < first.bedtimeMinutesToSleep) {
      return {
        type: 'success',
        message: `Great progress! Falling asleep faster now (${last.bedtimeMinutesToSleep} mins vs ${first.bedtimeMinutesToSleep} mins)`
      };
    }
    
    if (programData.currentNight === 3 && last.nightWakings >= first.nightWakings) {
      return {
        type: 'encouragement',
        message: "Night 2 is often the hardest. If things were rough, that's actually normal and expected. Tonight should be better! 💪"
      };
    }
    
    return null;
  };

  if (!programData) return null;

  const guidance = getCurrentNightGuidance();
  const progress = getProgressMessage();
  const isFerber = programData.methodId === 'ferber';

  // Check if we should show morning check-in prompt
  const todayDate = new Date().toISOString().split('T')[0];
  const hasLoggedToday = programData.nightLogs.some(log => log.date === todayDate);
  const lastLogDate = programData.nightLogs.length > 0 
    ? programData.nightLogs[programData.nightLogs.length - 1].date 
    : null;
  const shouldPromptCheckIn = !hasLoggedToday && programData.currentNight > 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-24">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sleep Program</h1>
            <p className="text-slate-500 mt-1">Night {programData.currentNight} • {assessment.babyName}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{programData.currentNight}</div>
            <div className="text-xs text-slate-400">of 7 nights</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((programData.currentNight / 7) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Morning Check-in Prompt */}
        {shouldPromptCheckIn && !showMorningCheckIn && (
          <Card className="border-none shadow-md bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Good morning!</p>
                  <p className="text-sm text-amber-700">How was last night? Let's log it.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowMorningCheckIn(true)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Log night
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Morning Check-in Form */}
        {showMorningCheckIn && (
          <Card className="border-none shadow-md">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Morning Check-in</h3>
                <button 
                  onClick={() => setShowMorningCheckIn(false)}
                  className="text-slate-400 text-sm"
                >
                  Cancel
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How long to fall asleep at bedtime?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={checkInLog.bedtimeMinutesToSleep}
                    onChange={(e) => setCheckInLog({...checkInLog, bedtimeMinutesToSleep: Number(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-medium text-slate-800">
                    {checkInLog.bedtimeMinutesToSleep} min
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How many night wakings?
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      onClick={() => setCheckInLog({...checkInLog, nightWakings: num})}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                        checkInLog.nightWakings === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {num === 8 ? '8+' : num}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Longest sleep stretch?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="30"
                    max="720"
                    step="30"
                    value={checkInLog.longestStretch}
                    onChange={(e) => setCheckInLog({...checkInLog, longestStretch: Number(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="w-20 text-right font-medium text-slate-800">
                    {Math.floor(checkInLog.longestStretch / 60)}h {checkInLog.longestStretch % 60}m
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How are YOU feeling? (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => setCheckInLog({...checkInLog, parentMood: num})}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        checkInLog.parentMood === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {num === 1 ? '😫' : num === 2 ? '😔' : num === 3 ? '😐' : num === 4 ? '🙂' : '😊'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1 text-center">
                  {checkInLog.parentMood <= 2 ? "It's hard. You're doing great. 💜" : 
                   checkInLog.parentMood === 3 ? "Hang in there!" :
                   "That's wonderful to hear!"}
                </p>
              </div>
              
              <Button 
                onClick={submitMorningCheckIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save & Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Message */}
        {progress && !showMorningCheckIn && (
          <Card className={`border-none shadow-sm ${
            progress.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {progress.type === 'success' ? (
                  <Trophy className="h-5 w-5 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                )}
                <p className={`text-sm ${
                  progress.type === 'success' ? 'text-emerald-700' : 'text-blue-700'
                }`}>
                  {progress.message}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Bedtime Button */}
        {!programData.bedtimeStartedAt && !showMorningCheckIn && (
          <Card className="border-none shadow-md bg-gradient-to-r from-indigo-600 to-purple-600">
            <CardContent className="p-5">
              <div className="text-center text-white">
                <Moon className="h-10 w-10 mx-auto mb-3 opacity-90" />
                <h3 className="font-bold text-lg mb-2">Ready to start bedtime?</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Tap when you put {assessment.babyName} down. I'll be here to support you.
                </p>
                <Button
                  onClick={startBedtime}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8"
                >
                  Start Tonight's Bedtime
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Bedtime Status */}
        {programData.bedtimeStartedAt && !showMorningCheckIn && (
          <Card className="border-none shadow-md bg-indigo-50 border-2 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Moon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-indigo-900">Bedtime in progress</p>
                    <p className="text-sm text-indigo-600">{elapsedMinutes} minutes elapsed</p>
                  </div>
                </div>
                <button
                  onClick={endBedtimeSession}
                  className="text-sm text-indigo-500 hover:text-indigo-700"
                >
                  End session
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timed Check-in Prompt */}
        {pendingCheckIn && (
          <Card className="border-none shadow-lg bg-purple-50 border-2 border-purple-300 animate-pulse">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 mb-1">Checking in 💜</p>
                  <p className="text-sm text-purple-700 mb-4">
                    {pendingCheckIn === '20min' 
                      ? `Night one can be the toughest. If ${assessment.babyName}'s needs are met and you're sticking to your intervals, you're on track.`
                      : `Still here with you. How are you holding up? Want to talk through whether to continue tonight or pause?`
                    }
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCheckInResponse(pendingCheckIn, true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Talk to Nunu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCheckInResponse(pendingCheckIn, false)}
                      className="border-purple-300 text-purple-700"
                    >
                      I'm okay
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Chat Button - Always visible during active bedtime */}
        {programData.bedtimeStartedAt && !showMorningCheckIn && !pendingCheckIn && (
          <Button 
            variant="outline" 
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
            onClick={onOpenChat}
          >
            <Heart className="h-4 w-4 mr-2" />
            Need support? Talk to Nunu
          </Button>
        )}

        {/* Tonight's Guidance */}
        {guidance && !showMorningCheckIn && (
          <Card className="border-none shadow-md bg-slate-800 text-white">
            <CardContent className="p-5">
              <h3 className="font-bold mb-3">{guidance.title}</h3>
              <p className="text-slate-300 text-sm mb-4">{guidance.guidance}</p>
              
              {guidance.intervals && (
                <div className="bg-slate-700 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-400 mb-2">Tonight's check-in intervals:</p>
                  <div className="flex gap-2">
                    {guidance.intervals.map((interval, i) => (
                      <span key={i} className="bg-slate-600 px-3 py-1 rounded-full text-sm">
                        {interval} min
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Tips for tonight:</p>
                {guidance.tips.map((tip, i) => (
                  <p key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    {tip}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ferber Timer */}
        {isFerber && !showMorningCheckIn && (
          <Card className="border-none shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-slate-800">Check-in Timer</span>
                </div>
                {!showTimer && (
                  <Button
                    size="sm"
                    onClick={() => setShowTimer(true)}
                    variant="outline"
                  >
                    Start Timer
                  </Button>
                )}
              </div>
              
              {showTimer && (
                <div className="space-y-4">
                  {/* Timer Display */}
                  <div className="text-center py-6 bg-slate-100 rounded-xl">
                    <div className="text-6xl font-mono font-bold text-slate-800 mb-2">
                      {formatTimerDisplay()}
                    </div>
                    {timerSeconds === 0 && timerRunning === false && currentCheckIn > 0 && (
                      <p className="text-emerald-600 font-medium animate-pulse">
                        ✓ Time to check on {assessment.babyName}!
                      </p>
                    )}
                  </div>
                  
                  {/* Timer Controls */}
                  <div className="flex justify-center gap-3">
                    {timerRunning ? (
                      <Button
                        onClick={() => setTimerRunning(false)}
                        variant="outline"
                        className="px-6"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : timerSeconds > 0 ? (
                      <Button
                        onClick={() => setTimerRunning(true)}
                        className="px-6 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    ) : null}
                    <Button
                      onClick={() => {
                        setTimerSeconds(0);
                        setTimerRunning(false);
                        setCurrentCheckIn(0);
                      }}
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Interval Buttons */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-500 mb-3 text-center">Start next interval:</p>
                    <div className="flex justify-center gap-2">
                      {(guidance?.intervals || [3, 5, 10]).map((mins, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          onClick={() => {
                            startTimer(mins);
                            setCurrentCheckIn(i + 1);
                          }}
                          className={currentCheckIn === i + 1 ? 'border-indigo-500 bg-indigo-50' : ''}
                        >
                          {mins} min
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Check-in reminder */}
                  <div className="bg-indigo-50 rounded-lg p-3 mt-2">
                    <p className="text-sm text-indigo-800">
                      <strong>When timer ends:</strong> Enter briefly, say "I love you, it's sleepy time", 
                      maybe a quick pat, then leave. 1-2 minutes max. Don't pick up.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progress Chart */}
        {programData.nightLogs.length >= 2 && !showMorningCheckIn && (
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-emerald-500" />
                <span className="font-medium text-slate-800">Your Progress</span>
              </div>
              
              {/* Simple bar chart for night wakings */}
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Night wakings</p>
                <div className="space-y-2">
                  {programData.nightLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-14">Night {i + 1}</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            i === programData.nightLogs.length - 1 ? 'bg-indigo-500' : 'bg-slate-300'
                          }`}
                          style={{ width: `${Math.min((log.nightWakings / 8) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 w-8">{log.nightWakings}x</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Button - show when bedtime not active */}
        {!programData.bedtimeStartedAt && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onOpenChat}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Nunu for support
          </Button>
        )}

        {/* Reset Program */}
        <button
          onClick={onResetProgram}
          className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2"
        >
          Start over with new assessment
        </button>
      </div>
    </div>
  );
};

export default SleepProgram;

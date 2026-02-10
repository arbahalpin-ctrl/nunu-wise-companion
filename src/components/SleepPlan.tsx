import { useState } from 'react';
import { Moon, Sun, Clock, CheckCircle2, ChevronDown, ChevronUp, Calendar, Sparkles, Heart, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SleepAssessmentData } from './SleepAssessment';

interface SleepPlanProps {
  assessment: SleepAssessmentData;
  onStartProgram: () => void;
  onEditAssessment: () => void;
  onOpenChat?: () => void;
}

interface RecommendedMethod {
  id: string;
  name: string;
  description: string;
  whyForYou: string;
  howItWorks: string[];
  whatToExpect: string[];
  nightOneInstructions: string[];
  checkInIntervals?: number[];
}

const SleepPlan = ({ assessment, onStartProgram, onEditAssessment, onOpenChat }: SleepPlanProps) => {
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [showNunuPrompt, setShowNunuPrompt] = useState(true);

  // Generate recommended method based on assessment
  const getRecommendedMethod = (): RecommendedMethod => {
    const { cryingTolerance, babyAgeMonths, currentSleepAssociations, previousAttempts } = assessment;
    
    // Very low crying tolerance or very young baby
    if (cryingTolerance <= 2 || babyAgeMonths < 4) {
      return {
        id: 'fading',
        name: 'Gentle Fading',
        description: 'Gradually reduce sleep associations over 2-3 weeks with minimal crying.',
        whyForYou: cryingTolerance <= 2 
          ? "Based on your preference for minimal crying, this gentle approach will feel right for your family."
          : `At ${babyAgeMonths} months, a gentle approach works best while ${assessment.babyName}'s sleep matures.`,
        howItWorks: [
          `Continue your current way of helping ${assessment.babyName} sleep, but make tiny changes`,
          'If you rock to sleep, rock until drowsy then place down (not fully asleep)',
          'Each night, stop the soothing slightly earlier',
          'If baby fusses, comfort immediately — this is responsive parenting',
          'Progress happens slowly over 2-3 weeks, but with very little distress'
        ],
        whatToExpect: [
          'Minimal crying — mostly just fussing',
          'Very gradual progress (think weeks, not days)',
          'You stay very involved in the process',
          'Low stress for everyone, but requires patience'
        ],
        nightOneInstructions: [
          'Do your normal bedtime routine',
          `When ${assessment.babyName} is drowsy but not fully asleep, place in crib`,
          'If crying starts, pick up and comfort until calm, then try again',
          'Tonight is just about trying — no pressure for success',
          'End your soothing slightly earlier than usual'
        ]
      };
    }
    
    // Mid tolerance — Chair method or PUPD
    if (cryingTolerance === 3) {
      // If they've tried PUPD before and it didn't work, try chair
      if (previousAttempts.includes('pupd')) {
        return {
          id: 'chair',
          name: 'Chair Method (Gradual Retreat)',
          description: 'Stay in the room and gradually move farther away over 2 weeks.',
          whyForYou: "You want to be present but encourage independence. Since PUPD didn't work before, the chair method offers a different kind of support.",
          howItWorks: [
            `Put ${assessment.babyName} down drowsy but awake`,
            'Sit in a chair right next to the crib',
            'Offer verbal comfort ("Shh, you\'re okay") and occasional pats',
            'Stay until baby falls asleep',
            'Every 2-3 nights, move your chair farther from the crib',
            'Eventually, you\'ll be outside the room'
          ],
          whatToExpect: [
            'Some crying, but your presence helps limit it',
            'Takes about 2 weeks to complete',
            'First few nights you\'re right there, which feels reassuring',
            'Progress is visible as you move farther away'
          ],
          nightOneInstructions: [
            'Complete your normal bedtime routine',
            `Place ${assessment.babyName} in crib drowsy but awake`,
            'Sit in a chair right next to the crib — baby should see you',
            'Don\'t pick up, but use your voice: "Shh, it\'s okay, time for sleep"',
            'You can pat the mattress or baby\'s tummy intermittently',
            'Stay until baby falls asleep (this might take a while tonight!)',
            'If baby stands, gently lay back down once, then just stay calm'
          ]
        };
      }
      
      return {
        id: 'pupd',
        name: 'Pick Up / Put Down',
        description: 'Pick up to calm, put down when calm. Repeat as needed.',
        whyForYou: "This keeps you very hands-on while teaching independent sleep. Perfect for parents who want to be responsive but make progress.",
        howItWorks: [
          `Put ${assessment.babyName} down drowsy but awake`,
          'When crying starts, pick up and comfort until calm',
          'The moment baby is calm (not asleep!), put back down',
          'Repeat as many times as needed — could be 20+ times at first',
          'Over nights, baby needs fewer pick-ups'
        ],
        whatToExpect: [
          'Night 1 can be exhausting — many repetitions',
          'Crying happens, but you\'re always responding',
          'Improvement usually visible by night 3-4',
          'Physically tiring but emotionally easier for some parents'
        ],
        nightOneInstructions: [
          'Complete your normal bedtime routine',
          `Place ${assessment.babyName} in crib drowsy but awake`,
          'Step back and wait',
          'If crying, pick up immediately and comfort — hold until calm',
          'As soon as calm (but still awake!), put back down',
          'Repeat. Expect 20-40 repetitions tonight — that\'s normal',
          'Stay calm and consistent. This is a marathon, not a sprint.'
        ]
      };
    }
    
    // Higher tolerance — Ferber
    if (cryingTolerance === 4) {
      return {
        id: 'ferber',
        name: 'Ferber Method (Graduated Extinction)',
        description: 'Timed check-ins at increasing intervals. Effective and structured.',
        whyForYou: "You want a proven method that balances effectiveness with some reassurance. Ferber is the most-studied sleep training approach.",
        howItWorks: [
          `Put ${assessment.babyName} down drowsy but awake`,
          'Leave the room',
          'If crying, wait 3 minutes before your first check',
          'Check-ins are brief (1-2 mins): reassure verbally, maybe a pat, then leave',
          'Increase wait times: 3 → 5 → 10 → 12 → 15 minutes',
          'On subsequent nights, start with longer intervals'
        ],
        whatToExpect: [
          'Night 1: Usually 30-60 mins of crying with check-ins',
          'Night 2-3: Often worse (extinction burst) — this is normal',
          'Night 4-5: Significant improvement for most babies',
          'By day 7: Most babies fall asleep with minimal fussing'
        ],
        nightOneInstructions: [
          'Complete bedtime routine in a calm, dimly lit room',
          `Put ${assessment.babyName} in crib awake — say goodnight and leave`,
          '⏱️ Wait 3 minutes before first check (even if crying)',
          'Check 1: Enter briefly, say "I love you, it\'s time to sleep", pat for 30 seconds, leave',
          '⏱️ Wait 5 minutes before second check',
          '⏱️ Wait 10 minutes before third check',
          '⏱️ Continue at 10-minute intervals until asleep',
          'For night wakings, use the same intervals'
        ],
        checkInIntervals: [3, 5, 10, 10, 10]
      };
    }
    
    // Highest tolerance — Full extinction
    return {
      id: 'extinction',
      name: 'Full Extinction (CIO)',
      description: 'Put down awake and don\'t return until morning. Fastest results.',
      whyForYou: "You want the most direct path to independent sleep. This is the fastest method with the strongest research support.",
      howItWorks: [
        `Put ${assessment.babyName} down drowsy but awake`,
        'Say goodnight and leave the room',
        'Don\'t return until morning (or a scheduled feed time if applicable)',
        'Baby learns to self-settle without any intervention'
      ],
      whatToExpect: [
        'Night 1: Potentially 45-90 mins of crying',
        'Night 2: Often the hardest night (extinction burst)',
        'Night 3-4: Usually dramatic improvement',
        'By day 5-7: Most babies fuss briefly then sleep'
      ],
      nightOneInstructions: [
        'Complete your full bedtime routine',
        'Make sure baby is fed, changed, and comfortable',
        `Put ${assessment.babyName} in crib awake — say "I love you, goodnight"`,
        'Leave the room and close the door',
        'Do not go back in until morning (or scheduled feed)',
        'This is hard. Watch on a monitor if it helps. Baby is safe.',
        'Find something to distract yourself — this is the hardest part for parents'
      ]
    };
  };

  // Generate optimal schedule based on age and assessment
  const generateSchedule = () => {
    const { babyAgeMonths, currentNapCount, currentWakeTime, currentBedtime } = assessment;
    
    // Parse times
    const [wakeHour, wakeMin] = currentWakeTime.split(':').map(Number);
    
    // Recommend optimal schedule based on age
    let recommendedNaps = currentNapCount;
    let wakeWindows: number[] = [];
    let napDurations: number[] = [];
    
    if (babyAgeMonths <= 3) {
      recommendedNaps = 4;
      wakeWindows = [60, 75, 90, 90];
      napDurations = [45, 45, 45, 30];
    } else if (babyAgeMonths <= 5) {
      recommendedNaps = 3;
      wakeWindows = [90, 120, 120, 150];
      napDurations = [90, 60, 45];
    } else if (babyAgeMonths <= 8) {
      recommendedNaps = 3;
      wakeWindows = [120, 150, 150, 180];
      napDurations = [90, 60, 30];
    } else if (babyAgeMonths <= 14) {
      recommendedNaps = 2;
      wakeWindows = [180, 210, 240];
      napDurations = [90, 60];
    } else {
      recommendedNaps = 1;
      wakeWindows = [300, 330];
      napDurations = [120];
    }
    
    // Build schedule
    const schedule: { time: string; event: string; notes?: string }[] = [];
    let currentTime = new Date();
    currentTime.setHours(wakeHour, wakeMin, 0, 0);
    
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    schedule.push({ 
      time: formatTime(currentTime), 
      event: 'Morning wake',
      notes: 'Start the day — bright light, activity'
    });
    
    for (let i = 0; i < recommendedNaps; i++) {
      // Add wake window
      currentTime = new Date(currentTime.getTime() + wakeWindows[i] * 60000);
      schedule.push({ 
        time: formatTime(currentTime), 
        event: `Nap ${i + 1} starts`,
        notes: i === 0 ? 'First nap is usually the easiest' : undefined
      });
      
      // Add nap duration
      currentTime = new Date(currentTime.getTime() + napDurations[i] * 60000);
      schedule.push({ 
        time: formatTime(currentTime), 
        event: `Nap ${i + 1} ends`,
        notes: undefined
      });
    }
    
    // Calculate ideal bedtime (last wake window before bed)
    const lastWakeWindow = wakeWindows[wakeWindows.length - 1];
    const idealBedtime = new Date(currentTime.getTime() + lastWakeWindow * 60000);
    
    schedule.push({ 
      time: formatTime(new Date(idealBedtime.getTime() - 30 * 60000)), 
      event: 'Bedtime routine starts',
      notes: 'Dim lights, calm activities, bath if you like'
    });
    
    schedule.push({ 
      time: formatTime(idealBedtime), 
      event: 'In crib, lights out',
      notes: 'Drowsy but awake'
    });
    
    return { schedule, recommendedNaps, idealBedtime: formatTime(idealBedtime) };
  };

  const method = getRecommendedMethod();
  const { schedule, recommendedNaps, idealBedtime } = generateSchedule();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-48">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-10 w-10 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          {assessment.babyName}'s Sleep Plan
        </h1>
        <p className="text-slate-500">
          Personalized for your family based on your assessment
        </p>
        <button 
          onClick={onEditAssessment}
          className="text-sm text-indigo-600 mt-2 hover:underline"
        >
          Edit assessment →
        </button>
      </div>

      <div className="px-6 space-y-4">
        {/* Summary Card */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Baby</span>
                <span className="font-medium text-slate-800">{assessment.babyName}, {assessment.babyAgeMonths}mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Main challenges</span>
                <span className="font-medium text-slate-800 text-right">{assessment.mainProblems.length} identified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Night wakings</span>
                <span className="font-medium text-slate-800">{assessment.nightWakings}x per night</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Your comfort level</span>
                <span className="font-medium text-slate-800">
                  {assessment.cryingTolerance <= 2 ? 'Very gentle' : 
                   assessment.cryingTolerance === 3 ? 'Balanced' :
                   assessment.cryingTolerance === 4 ? 'Structured' : 'Direct'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Method */}
        <Card className="border-none shadow-md bg-indigo-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Recommended approach</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{method.name}</h2>
            <p className="text-indigo-100 text-sm mb-4">{method.description}</p>
            
            <div className="bg-indigo-500/50 rounded-lg p-3">
              <p className="text-sm">
                <strong>Why this for you:</strong> {method.whyForYou}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={() => setShowFullPlan(!showFullPlan)}
              className="w-full flex items-center justify-between"
            >
              <span className="font-medium text-slate-800">How it works</span>
              {showFullPlan ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            
            {showFullPlan && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  {method.howItWorks.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-indigo-600">{i + 1}</span>
                      </div>
                      <p className="text-slate-600 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium text-slate-700 mb-2">What to expect:</p>
                  <ul className="space-y-1">
                    {method.whatToExpect.map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optimal Schedule */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <span className="font-medium text-slate-800">Your optimal schedule</span>
              </div>
              {showSchedule ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            
            {!showSchedule && (
              <p className="text-sm text-slate-500 mt-2">
                {recommendedNaps} naps • Ideal bedtime: {idealBedtime}
              </p>
            )}
            
            {showSchedule && (
              <div className="mt-4">
                {assessment.currentNapCount !== recommendedNaps && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        You mentioned {assessment.currentNapCount} naps, but at {assessment.babyAgeMonths} months, {recommendedNaps} naps is usually better. Try this schedule for a week.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  <div className="space-y-4">
                    {schedule.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          item.event.includes('wake') ? 'bg-amber-100' :
                          item.event.includes('Nap') && item.event.includes('starts') ? 'bg-indigo-100' :
                          item.event.includes('Nap') && item.event.includes('ends') ? 'bg-sky-100' :
                          item.event.includes('routine') ? 'bg-purple-100' :
                          'bg-slate-800'
                        }`}>
                          {item.event.includes('wake') || (item.event.includes('Nap') && item.event.includes('ends')) ? 
                            <Sun className={`h-4 w-4 ${item.event === 'Morning wake' ? 'text-amber-600' : 'text-sky-600'}`} /> :
                           item.event.includes('Nap') && item.event.includes('starts') ? 
                            <Moon className="h-4 w-4 text-indigo-600" /> :
                           item.event.includes('routine') ?
                            <Clock className="h-4 w-4 text-purple-600" /> :
                            <Moon className="h-4 w-4 text-white" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-800">{item.event}</p>
                            <p className="text-sm text-slate-500">{item.time}</p>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Night 1 Instructions */}
        <Card className="border-none shadow-md bg-slate-800 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5" />
              <span className="font-bold">Night 1 Instructions</span>
            </div>
            <div className="space-y-3">
              {method.nightOneInstructions.map((instruction, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">{i + 1}</span>
                  </div>
                  <p className="text-slate-200 text-sm">{instruction}</p>
                </div>
              ))}
            </div>
            
            {method.checkInIntervals && (
              <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <strong>Tonight's check-in intervals:</strong>
                </p>
                <div className="flex gap-2">
                  {method.checkInIntervals.map((interval, i) => (
                    <div key={i} className="bg-slate-600 px-3 py-1 rounded-full text-sm">
                      {interval} min
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Notes */}
        {assessment.medicalConcerns.some(c => c !== 'none') && (
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 mb-1">Medical considerations</p>
                  <p className="text-sm text-blue-700">
                    You mentioned some health concerns. Always check with your pediatrician before starting sleep training, especially with reflux or other medical conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Commitment */}
        <Card className={`border-2 transition-colors ${committed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
          <CardContent className="p-5">
            <button
              onClick={() => setCommitted(!committed)}
              className="w-full flex items-center gap-4"
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                committed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
              }`}>
                {committed && <CheckCircle2 className="h-5 w-5 text-white" />}
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-slate-800">I commit to trying this for 5 nights</p>
                <p className="text-sm text-slate-500">Consistency is key — results usually show by night 3-5</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Start Button - positioned above main nav */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <Button
            onClick={onStartProgram}
            disabled={!committed}
            className={`w-full py-6 text-lg ${
              committed 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {committed ? (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Start Tonight
              </>
            ) : (
              'Make your commitment above ↑'
            )}
          </Button>
        </div>
      </div>

      {/* Floating Nunu "Here to help" prompt */}
      {showNunuPrompt && onOpenChat && (
        <div className="fixed bottom-44 right-4 z-50 animate-in slide-in-from-right duration-500">
          <div className="relative">
            {/* Speech bubble */}
            <button
              onClick={() => {
                onOpenChat();
                setShowNunuPrompt(false);
              }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-3 pr-4 flex items-center gap-3 hover:shadow-xl transition-shadow"
            >
              {/* Nunu face */}
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/nunu-logo.svg" alt="Nunu" className="w-10 h-10" />
              </div>
              {/* Message */}
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">Here to help 💜</p>
                <p className="text-xs text-slate-500">Tap to chat with me</p>
              </div>
            </button>
            {/* Close button */}
            <button
              onClick={() => setShowNunuPrompt(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 text-xs"
            >
              ✕
            </button>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepPlan;

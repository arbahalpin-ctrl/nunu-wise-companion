import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Moon, Baby, Clock, Heart, AlertCircle, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface SleepAssessmentData {
  babyName: string;
  babyAgeMonths: number;
  mainProblems: string[];
  nightWakings: number;
  currentSleepAssociations: string[];
  previousAttempts: string[];
  cryingTolerance: number; // 1-5
  partnerAlignment: 'aligned' | 'not-aligned' | 'solo';
  currentWakeTime: string;
  currentBedtime: string;
  currentNapCount: number;
  medicalConcerns: string[];
  completedAt: string;
}

interface SleepAssessmentProps {
  onComplete: (data: SleepAssessmentData) => void;
  onSkip?: () => void;
}

const SLEEP_PROBLEMS = [
  { id: 'night-wakings', label: 'Frequent night wakings', emoji: '🌙' },
  { id: 'bedtime-battles', label: 'Bedtime battles / takes forever to fall asleep', emoji: '😫' },
  { id: 'short-naps', label: 'Short naps (under 45 mins)', emoji: '⏱️' },
  { id: 'early-wakes', label: 'Early morning wakes (before 6am)', emoji: '🌅' },
  { id: 'wont-sleep-alone', label: "Won't sleep without being held/fed", emoji: '🤱' },
  { id: 'night-feeds', label: 'Still feeding multiple times at night', emoji: '🍼' },
  { id: 'schedule-chaos', label: 'No consistent schedule', emoji: '🎲' },
  { id: 'regression', label: 'Sleep got worse suddenly (regression)', emoji: '📉' },
];

const SLEEP_ASSOCIATIONS = [
  { id: 'feeding', label: 'Feeding to sleep (breast or bottle)', emoji: '🍼' },
  { id: 'rocking', label: 'Rocking or bouncing', emoji: '🪑' },
  { id: 'holding', label: 'Being held', emoji: '🤱' },
  { id: 'pacifier', label: 'Pacifier', emoji: '🍬' },
  { id: 'cosleeping', label: 'Co-sleeping / bed sharing', emoji: '🛏️' },
  { id: 'contact-naps', label: 'Contact naps only', emoji: '💤' },
  { id: 'car-motion', label: 'Car or stroller motion', emoji: '🚗' },
  { id: 'patting', label: 'Patting or shushing', emoji: '✋' },
  { id: 'independent', label: 'Falls asleep independently', emoji: '⭐' },
];

const PREVIOUS_ATTEMPTS = [
  { id: 'nothing', label: "Haven't tried anything yet", emoji: '🆕' },
  { id: 'ferber', label: 'Ferber / timed check-ins', emoji: '⏰' },
  { id: 'cio', label: 'Cry it out', emoji: '😢' },
  { id: 'chair', label: 'Chair method / gradual retreat', emoji: '🪑' },
  { id: 'pupd', label: 'Pick up / put down', emoji: '🔄' },
  { id: 'fading', label: 'Gentle fading', emoji: '🌅' },
  { id: 'schedule', label: 'Schedule adjustments only', emoji: '📅' },
  { id: 'consultant', label: 'Worked with a sleep consultant', emoji: '👩‍⚕️' },
];

const MEDICAL_CONCERNS = [
  { id: 'none', label: 'No concerns', emoji: '✅' },
  { id: 'reflux', label: 'Reflux / GERD', emoji: '🤢' },
  { id: 'allergies', label: 'Food allergies / intolerances', emoji: '🚫' },
  { id: 'eczema', label: 'Eczema or skin issues', emoji: '🩹' },
  { id: 'ear-infections', label: 'Recurring ear infections', emoji: '👂' },
  { id: 'teething', label: 'Currently teething', emoji: '🦷' },
  { id: 'premature', label: 'Born premature', emoji: '👶' },
  { id: 'other', label: 'Other medical condition', emoji: '⚕️' },
];

const SleepAssessment = ({ onComplete, onSkip }: SleepAssessmentProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<SleepAssessmentData>>({
    babyName: '',
    babyAgeMonths: 6,
    mainProblems: [],
    nightWakings: 3,
    currentSleepAssociations: [],
    previousAttempts: [],
    cryingTolerance: 3,
    partnerAlignment: 'aligned',
    currentWakeTime: '07:00',
    currentBedtime: '19:00',
    currentNapCount: 2,
    medicalConcerns: [],
  });

  const totalSteps = 10;
  const progress = ((step + 1) / totalSteps) * 100;

  const updateData = (updates: Partial<SleepAssessmentData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (key: keyof SleepAssessmentData, item: string) => {
    const current = (data[key] as string[]) || [];
    if (current.includes(item)) {
      updateData({ [key]: current.filter(i => i !== item) });
    } else {
      updateData({ [key]: [...current, item] });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return data.babyName && data.babyName.trim().length > 0;
      case 1: return true; // age always has default
      case 2: return data.mainProblems && data.mainProblems.length > 0;
      case 3: return true; // night wakings always has default
      case 4: return data.currentSleepAssociations && data.currentSleepAssociations.length > 0;
      case 5: return data.previousAttempts && data.previousAttempts.length > 0;
      case 6: return true; // crying tolerance always has default
      case 7: return true; // partner alignment always has default
      case 8: return true; // schedule always has defaults
      case 9: return true; // medical can be empty (defaults to none)
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete assessment
      const finalData: SleepAssessmentData = {
        babyName: data.babyName || 'Baby',
        babyAgeMonths: data.babyAgeMonths || 6,
        mainProblems: data.mainProblems || [],
        nightWakings: data.nightWakings || 3,
        currentSleepAssociations: data.currentSleepAssociations || [],
        previousAttempts: data.previousAttempts || [],
        cryingTolerance: data.cryingTolerance || 3,
        partnerAlignment: data.partnerAlignment || 'aligned',
        currentWakeTime: data.currentWakeTime || '07:00',
        currentBedtime: data.currentBedtime || '19:00',
        currentNapCount: data.currentNapCount || 2,
        medicalConcerns: data.medicalConcerns || [],
        completedAt: new Date().toISOString(),
      };
      onComplete(finalData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle Enter key to proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed()) {
        e.preventDefault();
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, data]); // Re-attach when step or data changes

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Let's get to know your little one</h2>
              <p className="text-slate-500">I'll create a personalized sleep plan just for you.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What's your baby's name?</label>
              <input
                type="text"
                value={data.babyName || ''}
                onChange={(e) => updateData({ babyName: e.target.value })}
                placeholder="e.g., Oliver, Isla..."
                className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">How old is {data.babyName || 'your baby'}?</h2>
              <p className="text-slate-500">This helps me tailor wake windows and expectations.</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-5xl font-bold text-indigo-600">{data.babyAgeMonths}</span>
                <span className="text-2xl text-slate-400 ml-2">months</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={data.babyAgeMonths || 6}
                onChange={(e) => updateData({ babyAgeMonths: Number(e.target.value) })}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>Newborn</span>
                <span>2 years</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">What's the main sleep struggle?</h2>
              <p className="text-slate-500">Select all that apply — be honest!</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SLEEP_PROBLEMS.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => toggleArrayItem('mainProblems', problem.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.mainProblems?.includes(problem.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{problem.emoji}</span>
                  <span className="text-slate-700">{problem.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Moon className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">How many times does {data.babyName} wake at night?</h2>
              <p className="text-slate-500">On a typical night, not the worst nights.</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-5xl font-bold text-indigo-600">{data.nightWakings}</span>
                <span className="text-2xl text-slate-400 ml-2">times</span>
              </div>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateData({ nightWakings: num })}
                    className={`w-10 h-10 rounded-full font-medium transition-all ${
                      data.nightWakings === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num === 8 ? '8+' : num}
                  </button>
                ))}
              </div>
              {data.nightWakings === 0 && (
                <p className="text-center text-emerald-600 text-sm">Lucky you! Let's work on other areas then.</p>
              )}
              {data.nightWakings && data.nightWakings >= 6 && (
                <p className="text-center text-amber-600 text-sm">That's exhausting. We'll work on this together. 💪</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">How does {data.babyName} fall asleep?</h2>
              <p className="text-slate-500">Select all that you currently use — no judgment here.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SLEEP_ASSOCIATIONS.map((assoc) => (
                <button
                  key={assoc.id}
                  onClick={() => toggleArrayItem('currentSleepAssociations', assoc.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.currentSleepAssociations?.includes(assoc.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{assoc.emoji}</span>
                  <span className="text-slate-700">{assoc.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">What have you tried before?</h2>
              <p className="text-slate-500">This helps me avoid suggesting things that didn't work.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PREVIOUS_ATTEMPTS.map((attempt) => (
                <button
                  key={attempt.id}
                  onClick={() => toggleArrayItem('previousAttempts', attempt.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.previousAttempts?.includes(attempt.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{attempt.emoji}</span>
                  <span className="text-slate-700">{attempt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">How do you feel about crying?</h2>
              <p className="text-slate-500">There's no wrong answer — this helps me match the right approach to you.</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateData({ cryingTolerance: level })}
                    className={`w-14 h-14 rounded-full font-medium transition-all ${
                      data.cryingTolerance === level
                        ? 'bg-indigo-600 text-white scale-110'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-slate-500 px-2">
                <span className="text-left w-24">Minimal crying<br/>only</span>
                <span className="text-right w-24">Whatever<br/>works fastest</span>
              </div>
              <Card className="bg-slate-50 border-none">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600">
                    {data.cryingTolerance === 1 && "I'll focus on very gentle methods that minimize crying. These take longer but feel right for many families."}
                    {data.cryingTolerance === 2 && "I'll suggest gentle approaches with minimal crying. You'll be very present and responsive."}
                    {data.cryingTolerance === 3 && "I'll balance effectiveness with gentleness. Some fussing is okay but we'll keep it manageable."}
                    {data.cryingTolerance === 4 && "I'll suggest structured methods that work efficiently. There will be some crying but it's typically brief."}
                    {data.cryingTolerance === 5 && "I'll recommend the most direct approach. More crying upfront, but usually resolves fastest."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Is your partner on the same page?</h2>
              <p className="text-slate-500">Consistency between caregivers is important.</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'aligned', label: "Yes, we're aligned and ready to do this together", emoji: '💪' },
                { id: 'not-aligned', label: 'Not quite — we have different views on this', emoji: '🤔' },
                { id: 'solo', label: "I'm doing this solo / single parent", emoji: '🦸' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateData({ partnerAlignment: option.id as SleepAssessmentData['partnerAlignment'] })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    data.partnerAlignment === option.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{option.emoji}</span>
                  <span className="text-slate-700">{option.label}</span>
                </button>
              ))}
            </div>
            {data.partnerAlignment === 'not-aligned' && (
              <Card className="bg-amber-50 border-none">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-700">
                    <strong>Tip:</strong> Getting aligned before starting is key. Consider sharing this plan with your partner so you're both on the same page.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">What's {data.babyName}'s current schedule?</h2>
              <p className="text-slate-500">Rough times are fine — I'll help optimize this.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Typical morning wake time</label>
                <input
                  type="time"
                  value={data.currentWakeTime || '07:00'}
                  onChange={(e) => updateData({ currentWakeTime: e.target.value })}
                  className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current bedtime</label>
                <input
                  type="time"
                  value={data.currentBedtime || '19:00'}
                  onChange={(e) => updateData({ currentBedtime: e.target.value })}
                  className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">How many naps?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => updateData({ currentNapCount: count })}
                      className={`flex-1 p-4 rounded-xl font-medium transition-all ${
                        data.currentNapCount === count
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {count} nap{count !== 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Any health considerations?</h2>
              <p className="text-slate-500">These can affect sleep — good to know upfront.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {MEDICAL_CONCERNS.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => {
                    if (concern.id === 'none') {
                      updateData({ medicalConcerns: ['none'] });
                    } else {
                      const current = data.medicalConcerns?.filter(c => c !== 'none') || [];
                      if (current.includes(concern.id)) {
                        updateData({ medicalConcerns: current.filter(c => c !== concern.id) });
                      } else {
                        updateData({ medicalConcerns: [...current, concern.id] });
                      }
                    }
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.medicalConcerns?.includes(concern.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{concern.emoji}</span>
                  <span className="text-slate-700">{concern.label}</span>
                </button>
              ))}
            </div>
            {data.medicalConcerns?.some(c => c !== 'none') && (
              <Card className="bg-blue-50 border-none">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> I'll factor these into your plan. For medical concerns, always check with your pediatrician before starting sleep training.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Progress bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">Step {step + 1} of {totalSteps}</span>
          {onSkip && step === 0 && (
            <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600">
              Skip for now
            </button>
          )}
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 pb-48">
        {renderStep()}
      </div>

      {/* Navigation - positioned above main nav */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 bg-indigo-600 hover:bg-indigo-700 ${step === 0 ? 'w-full' : ''}`}
          >
            {step === totalSteps - 1 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create My Plan
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SleepAssessment;

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Baby, Heart, Moon, Utensils, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import koalaLogo from '@/assets/nunu-logo.svg';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  initialParentName?: string;
}

export interface OnboardingData {
  parentName: string;
  isExpecting: boolean;
  babyName: string;
  babyBirthdate?: string;
  babyAgeMonths?: number;
  feedingType?: 'breast' | 'formula' | 'combo';
  biggestChallenge?: string;
}

const Onboarding = ({ onComplete, initialParentName }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    parentName: initialParentName || '',
    isExpecting: false,
    babyName: '',
    babyBirthdate: '',
    babyAgeMonths: undefined,
    feedingType: undefined,
    biggestChallenge: undefined,
  });
  const [useAge, setUseAge] = useState(false); // Toggle between birthdate and age input

  const totalSteps = 4;

  const canProceed = () => {
    switch (step) {
      case 1: return data.parentName.trim().length > 0;
      case 2: return true; // Can always proceed (expecting is a choice)
      case 3: 
        if (data.isExpecting) return true;
        return data.babyName.trim().length > 0 && (data.babyBirthdate || data.babyAgeMonths);
      case 4: return true; // Optional step
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateAgeFromBirthdate = (birthdate: string): number => {
    const birth = new Date(birthdate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return Math.max(0, months);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <div className="flex gap-2">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-sky-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Step {step} of {totalSteps}</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        
        {/* Step 1: Welcome & Parent Name */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full p-3 shadow-lg mx-auto mb-4">
                <img src={koalaLogo} alt="Nunu" className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Welcome to Nunu</h1>
              <p className="text-slate-500 mt-2">Your calm companion through motherhood</p>
            </div>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What should we call you?
                </label>
                <Input
                  value={data.parentName}
                  onChange={(e) => setData({ ...data, parentName: e.target.value })}
                  placeholder="Your name"
                  className="text-lg py-6"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-2">
                  So Nunu can greet you properly 💛
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Expecting or Have Baby */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">Hi, {data.parentName}!</h1>
              <p className="text-slate-500 mt-2">Tell us where you're at</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setData({ ...data, isExpecting: false })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  !data.isExpecting
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    !data.isExpecting ? 'bg-sky-500' : 'bg-slate-100'
                  }`}>
                    <Baby className={`h-6 w-6 ${!data.isExpecting ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">I have a baby</p>
                    <p className="text-sm text-slate-500">Already in the trenches! 💪</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setData({ ...data, isExpecting: true })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  data.isExpecting
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    data.isExpecting ? 'bg-purple-500' : 'bg-slate-100'
                  }`}>
                    <Heart className={`h-6 w-6 ${data.isExpecting ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">I'm expecting</p>
                    <p className="text-sm text-slate-500">Getting ready for the journey 🤰</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Baby Info */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">
                {data.isExpecting ? "That's exciting!" : "Tell us about your little one"}
              </h1>
              <p className="text-slate-500 mt-2">
                {data.isExpecting 
                  ? "We'll have tips ready for when baby arrives"
                  : "So we can personalize your experience"
                }
              </p>
            </div>

            {data.isExpecting ? (
              <Card className="border-none shadow-md bg-purple-50">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-purple-800 font-medium">You're all set for now!</p>
                  <p className="text-purple-600 text-sm mt-2">
                    Come back when baby arrives and we'll help you set up their profile
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-md">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Baby's name
                    </label>
                    <Input
                      value={data.babyName}
                      onChange={(e) => setData({ ...data, babyName: e.target.value })}
                      placeholder="e.g., Luna"
                      className="text-lg py-5"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">
                        {useAge ? "Baby's age" : "Baby's birthday"}
                      </label>
                      <button
                        onClick={() => setUseAge(!useAge)}
                        className="text-xs text-sky-600 hover:text-sky-700"
                      >
                        {useAge ? "Use birthday instead" : "Use age instead"}
                      </button>
                    </div>
                    
                    {useAge ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={data.babyAgeMonths || ''}
                          onChange={(e) => setData({ 
                            ...data, 
                            babyAgeMonths: parseInt(e.target.value) || undefined,
                            babyBirthdate: undefined
                          })}
                          placeholder="0"
                          className="text-lg py-5 w-24"
                          min="0"
                          max="48"
                        />
                        <span className="text-slate-500">months old</span>
                      </div>
                    ) : (
                      <Input
                        type="date"
                        value={data.babyBirthdate || ''}
                        onChange={(e) => setData({ 
                          ...data, 
                          babyBirthdate: e.target.value,
                          babyAgeMonths: e.target.value ? calculateAgeFromBirthdate(e.target.value) : undefined
                        })}
                        className="text-lg py-5"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      How are you feeding?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'breast', label: 'Breast', emoji: '🤱' },
                        { value: 'formula', label: 'Formula', emoji: '🍼' },
                        { value: 'combo', label: 'Both', emoji: '🤱🍼' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setData({ ...data, feedingType: option.value as 'breast' | 'formula' | 'combo' })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            data.feedingType === option.value
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xl mb-1">{option.emoji}</div>
                          <div className="text-xs font-medium text-slate-700">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: Biggest Challenge (Optional) */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">Almost there!</h1>
              <p className="text-slate-500 mt-2">What's your biggest challenge right now?</p>
              <p className="text-xs text-slate-400 mt-1">(Optional — helps us personalize your tips)</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sleep', label: 'Sleep', description: "Nobody's getting enough", icon: Moon, color: 'indigo' },
                { value: 'feeding', label: 'Feeding', description: "Weaning, fussy eating, etc.", icon: Utensils, color: 'orange' },
                { value: 'overwhelm', label: 'Feeling overwhelmed', description: "Just... everything", icon: Heart, color: 'rose' },
                { value: 'info', label: 'Need reliable info', description: "So much conflicting advice!", icon: Sparkles, color: 'sky' },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = data.biggestChallenge === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setData({ 
                      ...data, 
                      biggestChallenge: isSelected ? undefined : option.value 
                    })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? `bg-${option.color}-500` : 'bg-slate-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{option.label}</p>
                        <p className="text-sm text-slate-500">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full py-6 text-base rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
        >
          {step === totalSteps ? (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Let's go!
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
        
        {step > 1 && (
          <button
            onClick={handleBack}
            className="w-full py-3 text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === 4 && (
          <button
            onClick={() => onComplete(data)}
            className="w-full py-2 text-slate-400 hover:text-slate-600 text-sm"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

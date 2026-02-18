import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Moon, Utensils, Heart, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    parentName: initialParentName || '',
    isExpecting: false,
    babyName: '',
    babyBirthdate: '',
    babyAgeMonths: undefined,
    feedingType: undefined,
    biggestChallenge: undefined,
  });
  const [useAge, setUseAge] = useState(false);

  const totalSteps = 5;

  // Smooth transition between steps
  const goToStep = (newStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setIsAnimating(false);
    }, 200);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome screen
      case 1: return data.parentName.trim().length > 0;
      case 2: return true;
      case 3: 
        if (data.isExpecting) return true;
        return data.babyName.trim().length > 0 && (data.babyBirthdate || data.babyAgeMonths);
      case 4: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      goToStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) goToStep(step - 1);
  };

  const calculateAgeFromBirthdate = (birthdate: string): number => {
    const birth = new Date(birthdate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return Math.max(0, months);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f2] to-white flex flex-col">
      
      {/* Progress indicator - subtle dots */}
      {step > 0 && (
        <div className="px-6 pt-6 flex justify-center gap-2">
          {[...Array(totalSteps - 1)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < step ? 'w-6 bg-[#7c9a92]' : 'w-1.5 bg-[#d4cdc5]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col justify-center px-8 py-12 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-[#e8e4df] rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-white rounded-full p-4 shadow-sm">
                <img src={koalaLogo} alt="Nunu" className="w-full h-full" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-[#3d3d3d] tracking-tight">
                Welcome to Nunu
              </h1>
              <p className="text-[#6b6b6b] text-lg leading-relaxed max-w-xs mx-auto">
                A gentle companion for the journey of motherhood
              </p>
            </div>

            <div className="pt-4 space-y-3 max-w-xs mx-auto">
              <div className="flex items-center gap-3 text-left p-3 bg-white/60 rounded-xl">
                <div className="w-10 h-10 bg-[#f0ebe6] rounded-full flex items-center justify-center flex-shrink-0">
                  <Moon className="w-5 h-5 text-[#7c9a92]" />
                </div>
                <p className="text-sm text-[#5a5a5a]">Sleep guidance tailored to your baby's age</p>
              </div>
              <div className="flex items-center gap-3 text-left p-3 bg-white/60 rounded-xl">
                <div className="w-10 h-10 bg-[#f0ebe6] rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-[#c4a4a4]" />
                </div>
                <p className="text-sm text-[#5a5a5a]">Emotional support when you need it</p>
              </div>
              <div className="flex items-center gap-3 text-left p-3 bg-white/60 rounded-xl">
                <div className="w-10 h-10 bg-[#f0ebe6] rounded-full flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-5 h-5 text-[#c9a66b]" />
                </div>
                <p className="text-sm text-[#5a5a5a]">Weaning recipes and feeding tips</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#3d3d3d] mb-2">
                Let's start with you
              </h1>
              <p className="text-[#6b6b6b]">
                What would you like to be called?
              </p>
            </div>

            <div className="space-y-2">
              <Input
                value={data.parentName}
                onChange={(e) => setData({ ...data, parentName: e.target.value })}
                placeholder="Your name"
                className="text-center text-xl py-6 border-0 border-b-2 border-[#d4cdc5] rounded-none bg-transparent focus:border-[#7c9a92] focus:ring-0 placeholder:text-[#b5b0a8]"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Expecting or Have Baby */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#3d3d3d] mb-2">
                Hi {data.parentName}
              </h1>
              <p className="text-[#6b6b6b]">
                Where are you in your journey?
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setData({ ...data, isExpecting: false })}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-300 ${
                  !data.isExpecting
                    ? 'bg-[#7c9a92] shadow-lg transform scale-[1.02]'
                    : 'bg-white border border-[#e8e4df] hover:border-[#d4cdc5]'
                }`}
              >
                <p className={`font-medium text-lg ${!data.isExpecting ? 'text-white' : 'text-[#3d3d3d]'}`}>
                  I have a baby
                </p>
                <p className={`text-sm mt-1 ${!data.isExpecting ? 'text-white/80' : 'text-[#6b6b6b]'}`}>
                  I'd like support with sleep, feeding, or just getting through the day
                </p>
              </button>

              <button
                onClick={() => setData({ ...data, isExpecting: true })}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-300 ${
                  data.isExpecting
                    ? 'bg-[#c4a4a4] shadow-lg transform scale-[1.02]'
                    : 'bg-white border border-[#e8e4df] hover:border-[#d4cdc5]'
                }`}
              >
                <p className={`font-medium text-lg ${data.isExpecting ? 'text-white' : 'text-[#3d3d3d]'}`}>
                  I'm expecting
                </p>
                <p className={`text-sm mt-1 ${data.isExpecting ? 'text-white/80' : 'text-[#6b6b6b]'}`}>
                  I want to prepare for what's ahead
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Baby Info */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#3d3d3d] mb-2">
                {data.isExpecting ? "We'll be here when baby arrives" : "Tell us about your little one"}
              </h1>
              <p className="text-[#6b6b6b]">
                {data.isExpecting 
                  ? "You can update this later"
                  : "This helps us personalise your experience"
                }
              </p>
            </div>

            {data.isExpecting ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#f0ebe6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-[#c4a4a4]" />
                </div>
                <p className="text-[#6b6b6b] max-w-xs mx-auto">
                  Nunu will be ready with sleep tips, feeding guidance, and support whenever you need it
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-2 text-center">
                    Baby's name
                  </label>
                  <Input
                    value={data.babyName}
                    onChange={(e) => setData({ ...data, babyName: e.target.value })}
                    placeholder="Their name"
                    className="text-center text-lg py-5 border-0 border-b-2 border-[#d4cdc5] rounded-none bg-transparent focus:border-[#7c9a92] focus:ring-0 placeholder:text-[#b5b0a8]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#5a5a5a]">
                      {useAge ? "Age in months" : "Date of birth"}
                    </label>
                    <button
                      onClick={() => setUseAge(!useAge)}
                      className="text-xs text-[#7c9a92] hover:underline"
                    >
                      {useAge ? "Use date instead" : "Use age instead"}
                    </button>
                  </div>
                  
                  {useAge ? (
                    <div className="flex items-center justify-center gap-3">
                      <Input
                        type="number"
                        value={data.babyAgeMonths || ''}
                        onChange={(e) => setData({ 
                          ...data, 
                          babyAgeMonths: parseInt(e.target.value) || undefined,
                          babyBirthdate: undefined
                        })}
                        className="text-center text-lg py-5 border-0 border-b-2 border-[#d4cdc5] rounded-none bg-transparent focus:border-[#7c9a92] focus:ring-0 w-20"
                        min="0"
                        max="48"
                      />
                      <span className="text-[#6b6b6b]">months</span>
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
                      className="text-center text-lg py-5 border-0 border-b-2 border-[#d4cdc5] rounded-none bg-transparent focus:border-[#7c9a92] focus:ring-0"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-3 text-center">
                    How are you feeding?
                  </label>
                  <div className="flex justify-center gap-3">
                    {[
                      { value: 'breast', label: 'Breast' },
                      { value: 'formula', label: 'Formula' },
                      { value: 'combo', label: 'Combination' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setData({ ...data, feedingType: option.value as 'breast' | 'formula' | 'combo' })}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          data.feedingType === option.value
                            ? 'bg-[#7c9a92] text-white shadow-md'
                            : 'bg-white border border-[#e8e4df] text-[#5a5a5a] hover:border-[#d4cdc5]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Challenges */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#3d3d3d] mb-2">
                What matters most to you right now?
              </h1>
              <p className="text-[#6b6b6b]">
                Choose one, or skip this step
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sleep', label: 'Better sleep', sublabel: 'For baby, for me, for everyone', icon: Moon, color: '#7c9a92' },
                { value: 'feeding', label: 'Feeding support', sublabel: 'Weaning, schedules, picky eating', icon: Utensils, color: '#c9a66b' },
                { value: 'overwhelm', label: 'Feeling like myself again', sublabel: 'Managing the mental load', icon: Heart, color: '#c4a4a4' },
                { value: 'info', label: 'Trusted information', sublabel: 'Cutting through the noise', icon: HelpCircle, color: '#8b9dc3' },
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
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 ${
                      isSelected
                        ? 'bg-white shadow-lg border-2 transform scale-[1.02]'
                        : 'bg-white border border-[#e8e4df] hover:border-[#d4cdc5]'
                    }`}
                    style={{ borderColor: isSelected ? option.color : undefined }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: isSelected ? option.color : '#f0ebe6' }}
                    >
                      <Icon className={`h-6 w-6 transition-colors duration-300`} style={{ color: isSelected ? 'white' : option.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-[#3d3d3d]">{option.label}</p>
                      <p className="text-sm text-[#6b6b6b]">{option.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-8 pb-10 space-y-3">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full py-6 text-base rounded-2xl bg-[#3d3d3d] hover:bg-[#2d2d2d] disabled:opacity-40 disabled:bg-[#d4cdc5] transition-all duration-300"
        >
          {step === 0 ? "Get started" : step === totalSteps - 1 ? "Finish" : "Continue"}
          {step < totalSteps - 1 && <ChevronRight className="h-5 w-5 ml-2" />}
        </Button>
        
        {step > 0 && (
          <button
            onClick={handleBack}
            className="w-full py-3 text-[#6b6b6b] hover:text-[#3d3d3d] flex items-center justify-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === 4 && (
          <button
            onClick={() => onComplete(data)}
            className="w-full py-2 text-[#9a958e] hover:text-[#6b6b6b] text-sm transition-colors"
          >
            Skip this step
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

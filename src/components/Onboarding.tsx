import { useState } from 'react';
import { ArrowRight, ArrowLeft, Baby, Calendar, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '@/assets/nunu-logo.svg';

interface OnboardingProps {
  onComplete: () => void;
}

// Storage keys
const BABY_NAME_KEY = 'nunu-baby-name';
const BABY_BIRTHDATE_KEY = 'nunu-baby-birthdate';
const BABY_AGE_KEY = 'nunu-baby-age-months';
const FEEDING_TYPE_KEY = 'nunu-feeding-type';
const PARENT_NAME_KEY = 'nunu-parent-name';

// Calculate age in months from birthdate
const calculateAgeMonths = (birthdate: string): number => {
  const birth = new Date(birthdate);
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months--;
  return Math.max(0, months);
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [isExpecting, setIsExpecting] = useState<boolean | null>(null);
  const [feedingType, setFeedingType] = useState<'breast' | 'formula' | 'combo' | null>(null);

  const handleComplete = () => {
    // Save all data
    if (parentName) localStorage.setItem(PARENT_NAME_KEY, parentName);
    if (babyName) localStorage.setItem(BABY_NAME_KEY, babyName);
    if (birthdate) {
      localStorage.setItem(BABY_BIRTHDATE_KEY, birthdate);
      const ageMonths = calculateAgeMonths(birthdate);
      localStorage.setItem(BABY_AGE_KEY, ageMonths.toString());
    } else if (isExpecting) {
      localStorage.setItem(BABY_AGE_KEY, '0');
    }
    if (feedingType) localStorage.setItem(FEEDING_TYPE_KEY, feedingType);
    
    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome screen
      case 1: return isExpecting !== null;
      case 2: return babyName.trim().length > 0;
      case 3: return isExpecting || birthdate.length > 0;
      case 4: return feedingType !== null || isExpecting;
      default: return true;
    }
  };

  const nextStep = () => {
    if (step === 4 || (step === 3 && isExpecting)) {
      handleComplete();
    } else if (step === 3 && isExpecting) {
      // Skip feeding question if expecting
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // Get today's date for max date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl flex flex-col p-6">
        
        {/* Progress dots */}
        {step > 0 && (
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-slate-800' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Back button */}
        {step > 0 && (
          <button onClick={prevStep} className="flex items-center gap-1 text-slate-500 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
        )}

        <div className="flex-1 flex flex-col justify-center">
          
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-40 h-40 bg-white rounded-full p-4 shadow-xl border-4 border-white mx-auto">
                  <img 
                    src={heroImage} 
                    alt="Nunu" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Hey, I'm Nunu
              </h1>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-xs mx-auto">
                I'm here to support you through motherhood — the beautiful parts and the hard ones. No judgment, just help.
              </p>

              <div className="flex justify-center gap-8 mb-8 text-slate-500">
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">🤱</span>
                  <span className="text-xs">Feeding</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">😴</span>
                  <span className="text-xs">Sleep</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">💛</span>
                  <span className="text-xs">Support</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Expecting or already have baby */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Baby className="h-10 w-10 text-pink-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Where are you on your journey?
              </h2>
              <p className="text-slate-500 mb-8">
                This helps me personalize your experience
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setIsExpecting(false)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    isExpecting === false
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👶</span>
                    <div>
                      <p className="font-medium text-slate-800">I have a baby</p>
                      <p className="text-sm text-slate-500">Already navigating parenthood</p>
                    </div>
                    {isExpecting === false && <Check className="h-5 w-5 text-slate-800 ml-auto" />}
                  </div>
                </button>

                <button
                  onClick={() => setIsExpecting(true)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    isExpecting === true
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤰</span>
                    <div>
                      <p className="font-medium text-slate-800">I'm expecting</p>
                      <p className="text-sm text-slate-500">Getting ready for baby</p>
                    </div>
                    {isExpecting === true && <Check className="h-5 w-5 text-slate-800 ml-auto" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Baby's name */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✨</span>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {isExpecting ? "What will you call them?" : "What's your little one's name?"}
              </h2>
              <p className="text-slate-500 mb-8">
                {isExpecting ? "Or a nickname for now" : "So I can make this personal"}
              </p>

              <Input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder={isExpecting ? "Baby, Peanut, etc." : "e.g. Emma"}
                className="text-center text-xl py-6 border-2 border-slate-200 focus:border-slate-800 rounded-2xl"
                autoFocus
              />

              <p className="text-xs text-slate-400 mt-4">
                You can change this anytime in settings
              </p>
            </div>
          )}

          {/* Step 3: Birthdate (skip if expecting) */}
          {step === 3 && !isExpecting && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                When was {babyName || 'baby'} born?
              </h2>
              <p className="text-slate-500 mb-8">
                This helps me give age-appropriate advice
              </p>

              <Input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                max={today}
                className="text-center text-lg py-6 border-2 border-slate-200 focus:border-slate-800 rounded-2xl"
              />

              {birthdate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-blue-700">
                    {calculateAgeMonths(birthdate) === 0 
                      ? "A newborn! 🥰" 
                      : `${calculateAgeMonths(birthdate)} month${calculateAgeMonths(birthdate) !== 1 ? 's' : ''} old`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 for expecting: Due date (optional) */}
          {step === 3 && isExpecting && (
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-purple-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                When are you due?
              </h2>
              <p className="text-slate-500 mb-8">
                Optional — helps me prepare content for you
              </p>

              <Input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                min={today}
                className="text-center text-lg py-6 border-2 border-slate-200 focus:border-slate-800 rounded-2xl"
              />

              <button
                onClick={handleComplete}
                className="mt-4 text-slate-500 underline text-sm"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 4: Feeding type (only if not expecting) */}
          {step === 4 && !isExpecting && (
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-pink-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                How are you feeding {babyName || 'baby'}?
              </h2>
              <p className="text-slate-500 mb-8">
                No judgment here — fed is best 💛
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setFeedingType('breast')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    feedingType === 'breast'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤱</span>
                    <div>
                      <p className="font-medium text-slate-800">Breastfeeding</p>
                      <p className="text-sm text-slate-500">Nursing or pumping</p>
                    </div>
                    {feedingType === 'breast' && <Check className="h-5 w-5 text-pink-500 ml-auto" />}
                  </div>
                </button>

                <button
                  onClick={() => setFeedingType('formula')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    feedingType === 'formula'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍼</span>
                    <div>
                      <p className="font-medium text-slate-800">Formula feeding</p>
                      <p className="text-sm text-slate-500">Bottle with formula</p>
                    </div>
                    {feedingType === 'formula' && <Check className="h-5 w-5 text-pink-500 ml-auto" />}
                  </div>
                </button>

                <button
                  onClick={() => setFeedingType('combo')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    feedingType === 'combo'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤱🍼</span>
                    <div>
                      <p className="font-medium text-slate-800">Combination</p>
                      <p className="text-sm text-slate-500">Both breast and formula</p>
                    </div>
                    {feedingType === 'combo' && <Check className="h-5 w-5 text-pink-500 ml-auto" />}
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Continue button */}
        <div className="mt-8">
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            size="lg"
            className="w-full rounded-2xl py-6 text-base shadow-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300"
          >
            {step === 0 ? "Let's get started" : 
             step === 4 || (step === 3 && isExpecting) ? "Finish setup" : 
             "Continue"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          {step === 0 && (
            <p className="text-xs text-slate-400 mt-4 text-center">
              Your data stays on your device. Private by default.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

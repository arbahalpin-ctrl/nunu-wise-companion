import { useState } from 'react';
import koalaSitting from '@/assets/koala-sitting.png';
import koalaSleep from '@/assets/koala-sleep.png';
import koalaFeeding from '@/assets/koala-feeding.png';
import koalaBottle from '@/assets/koala-bottle.png';

const TUTORIAL_KEY = 'nunu-tutorial-completed';

interface TutorialStep {
  koala: string;
  title: string;
  message: string;
  bg: string;
}

const STEPS: TutorialStep[] = [
  {
    koala: 'sitting',
    title: 'Welcome to Nunu!',
    message: "Hey! I'm Nunu, your little companion through this whole parenting journey. Let me show you around — it'll only take a minute!",
    bg: 'from-sky-100 to-sky-50',
  },
  {
    koala: 'sitting',
    title: 'Home',
    message: "This is your home base. Check in with how you're feeling each day, see your baby's wake windows, and get daily tips personalised to your baby's age.",
    bg: 'from-sky-100 to-white',
  },
  {
    koala: 'sitting',
    title: 'Chat',
    message: "Got a question at 2am? I'm always here. Ask me anything about sleep, feeding, development — or just vent. I won't judge!",
    bg: 'from-blue-100 to-blue-50',
  },
  {
    koala: 'feeding',
    title: 'Feeding',
    message: "Track nursing sessions, explore 25+ baby-led weaning recipes, check which foods are safe at each age, and ask me for recipe ideas!",
    bg: 'from-orange-100 to-orange-50',
  },
  {
    koala: 'sleep',
    title: 'Sleep',
    message: "Learn about wake windows, log naps to track your baby's sleep, and when you're ready, I can create a gentle sleep plan just for you.",
    bg: 'from-indigo-100 to-indigo-50',
  },
  {
    koala: 'sitting',
    title: 'Milestones',
    message: "See what developmental milestones to expect at each age, track your baby's growth, and celebrate every little win together!",
    bg: 'from-purple-100 to-purple-50',
  },
  {
    koala: 'bottle',
    title: 'Settings',
    message: "Check in on your own wellbeing too — because you matter. You'll also find crisis support numbers and saved items here.",
    bg: 'from-rose-100 to-rose-50',
  },
  {
    koala: 'sitting',
    title: "You're all set!",
    message: "That's it! I'll pop up here and there to help guide you. Remember, there's no wrong way to do this — and I'm always just a tap away. You've got this! 💛",
    bg: 'from-emerald-100 to-emerald-50',
  },
];

const koalaImages: Record<string, string> = {
  sitting: koalaSitting,
  sleep: koalaSleep,
  feeding: koalaFeeding,
  bottle: koalaBottle,
};

interface NunuTutorialProps {
  onComplete: () => void;
}

export default function NunuTutorial({ onComplete }: NunuTutorialProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(TUTORIAL_KEY, 'true');
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm bg-gradient-to-b ${current.bg} rounded-3xl shadow-2xl overflow-hidden`}>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pt-5 px-6">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-slate-700' : i < step ? 'w-1.5 bg-slate-400' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Koala */}
        <div className="flex justify-center pt-6 pb-2">
          <div className="w-32 h-32 animate-nunu-float">
            <img 
              src={koalaImages[current.koala]} 
              alt="Nunu" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-7 pb-2 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">{current.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{current.message}</p>
        </div>

        {/* Buttons */}
        <div className="px-7 pt-4 pb-6 space-y-2">
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors text-sm shadow-sm"
          >
            {isLast ? "Let's go!" : 'Next'}
          </button>
          
          {!isLast && (
            <button
              onClick={handleSkip}
              className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip tutorial
            </button>
          )}

          {!isFirst && !isLast && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="w-full py-1 text-xs text-slate-400 hover:text-slate-500 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function shouldShowTutorial(): boolean {
  return localStorage.getItem(TUTORIAL_KEY) !== 'true';
}

export function resetTutorial(): void {
  localStorage.removeItem(TUTORIAL_KEY);
}

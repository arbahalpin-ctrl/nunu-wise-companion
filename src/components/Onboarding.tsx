import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/nunu-logo.svg';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl flex flex-col items-center justify-center p-8">
      
      {/* Koala - Big and Friendly */}
      <div className="mb-8">
        <div className="w-48 h-48 bg-white rounded-full p-4 shadow-xl border-4 border-white">
          <img 
            src={heroImage} 
            alt="Nunu" 
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      {/* Simple Welcome */}
      <div className="text-center max-w-xs mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Hey, I'm Nunu
        </h1>
        <p className="text-slate-500 leading-relaxed">
          I'm here to listen, support, and help you through the tough moments of motherhood. No judgment — just a friend in your pocket.
        </p>
      </div>

      {/* What I help with - Simple list */}
      <div className="flex gap-6 mb-12 text-slate-500">
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">😴</span>
          <span className="text-xs">Sleep</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">💭</span>
          <span className="text-xs">Worries</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">💛</span>
          <span className="text-xs">Support</span>
        </div>
      </div>

      {/* Single CTA */}
      <Button 
        onClick={onComplete}
        size="lg"
        className="rounded-full px-10 py-6 text-base shadow-lg bg-slate-800 hover:bg-slate-700"
      >
        Let's start
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>

        {/* Privacy note - subtle */}
        <p className="text-xs text-slate-400 mt-8 text-center max-w-xs">
          Your conversations are private. I'm here for you, not your data.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;

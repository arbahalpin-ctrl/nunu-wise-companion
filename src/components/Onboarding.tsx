import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/nunu-logo.svg';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white flex flex-col items-center justify-center p-8">
      
      {/* Koala with glow */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-orange-300/40 rounded-full blur-3xl scale-125"></div>
        <div className="relative w-48 h-48 bg-white rounded-full p-4 shadow-xl border-4 border-orange-200">
          <img 
            src={heroImage} 
            alt="Nunu" 
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      {/* Welcome - Journey focused */}
      <div className="text-center max-w-xs mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Get your spark back ✨
        </h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          Motherhood changed you — but you're still in there. I'm Nunu, and I'm here to help you rediscover yourself while crushing this whole mum thing.
        </p>
        <p className="text-orange-600 font-semibold text-sm">
          This is your journey back to you. 💖
        </p>
      </div>

      {/* The journey pillars */}
      <div className="flex gap-6 mb-12">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-2">
            <span className="text-2xl">😴</span>
          </div>
          <span className="text-xs font-medium text-slate-600">Rest</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <span className="text-2xl">💪</span>
          </div>
          <span className="text-xs font-medium text-slate-600">Strength</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-2">
            <span className="text-2xl">✨</span>
          </div>
          <span className="text-xs font-medium text-slate-600">You</span>
        </div>
      </div>

      {/* CTA */}
      <Button 
        onClick={onComplete}
        size="lg"
        className="rounded-full px-10 py-6 text-base shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0"
      >
        <Sparkles className="h-5 w-5 mr-2" />
        Start my journey
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>

      {/* Privacy note */}
      <p className="text-xs text-slate-500 mt-8 text-center max-w-xs">
        Your conversations are private. This space is yours. 🔒
      </p>
    </div>
  );
};

export default Onboarding;

import { useState } from 'react';
import { ArrowRight, Heart, Baby, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import heroImage from '@/assets/nunu-hero.jpg';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Nunu",
      subtitle: "Your gentle companion through motherhood",
      content: (
        <div className="text-center space-y-6">
          <div 
            className="w-32 h-32 mx-auto rounded-3xl bg-cover bg-center shadow-comfort"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div>
            <h2 className="text-2xl font-bold mb-3">Hello, beautiful mama 💝</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nunu is here to support you through the incredible journey of motherhood. 
              From pregnancy to toddlerhood, you'll never walk alone.
            </p>
          </div>
          <div className="bg-accent-soft p-4 rounded-2xl">
            <p className="text-sm text-accent-foreground italic">
              "You are braver than you believe, stronger than you seem, and loved more than you know."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Track with Love",
      subtitle: "Gentle routine tracking",
      content: (
        <div className="text-center space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-nunu-peach/20 p-4 rounded-2xl">
              <div className="text-2xl mb-2">🍼</div>
              <p className="text-xs font-medium">Feeding</p>
            </div>
            <div className="bg-nunu-lavender/20 p-4 rounded-2xl">
              <div className="text-2xl mb-2">😴</div>
              <p className="text-xs font-medium">Sleep</p>
            </div>
            <div className="bg-nunu-sage/20 p-4 rounded-2xl">
              <div className="text-2xl mb-2">👶</div>
              <p className="text-xs font-medium">Diapers</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">Understanding, not judging</h2>
            <p className="text-muted-foreground leading-relaxed">
              Track your baby's routines to learn their unique patterns. 
              Every baby is different, and Nunu celebrates that.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Your Voice Matters",
      subtitle: "Express yourself safely",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-nurture rounded-full flex items-center justify-center mx-auto shadow-gentle">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">Share your heart</h2>
            <p className="text-muted-foreground leading-relaxed">
              Record voice notes, check in with your mood, and chat with our AI companion 
              who remembers your journey and offers personalized support.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-left">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">Daily mood check-ins</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">Voice reflection notes</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">AI companion that remembers</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Safe & Private",
      subtitle: "Your data, your choice",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-calm rounded-full flex items-center justify-center mx-auto shadow-gentle">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">Protected with love</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your most vulnerable moments deserve the highest protection. 
              All data is encrypted and never shared without your permission.
            </p>
          </div>
          <div className="bg-secondary-soft p-4 rounded-2xl">
            <p className="text-sm text-secondary-foreground">
              🔒 End-to-end encryption<br/>
              🚫 No data selling<br/>
              💝 Built by mothers, for mothers
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-comfort p-6 flex flex-col">
      {/* Progress */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-primary' 
                  : index < currentStep 
                    ? 'w-2 bg-primary/60'
                    : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
        <Button variant="ghost" onClick={handleSkip} className="text-sm text-muted-foreground">
          Skip
        </Button>
      </div>

      {/* Content */}
      <Card className="flex-1 shadow-comfort border-none">
        <CardContent className="p-8 flex flex-col justify-center h-full">
          {steps[currentStep].content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 space-y-4">
        <Button 
          onClick={handleNext}
          className="w-full py-4 rounded-2xl shadow-gentle text-base"
        >
          {currentStep < steps.length - 1 ? (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          ) : (
            <>
              Start Your Journey
              <Heart className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
        
        {currentStep > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
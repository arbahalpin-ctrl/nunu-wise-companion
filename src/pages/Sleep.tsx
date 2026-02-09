import { useState, useEffect } from 'react';
import SleepAssessment, { SleepAssessmentData } from '@/components/SleepAssessment';
import SleepPlan from '@/components/SleepPlan';
import SleepProgram from '@/components/SleepProgram';

const ASSESSMENT_STORAGE_KEY = 'nunu-sleep-assessment';
const PROGRAM_STORAGE_KEY = 'nunu-sleep-program';

interface SleepProps {
  onTabChange?: (tab: string) => void;
}

type SleepStage = 'assessment' | 'plan' | 'program';

const Sleep = ({ onTabChange }: SleepProps) => {
  const [stage, setStage] = useState<SleepStage>('assessment');
  const [assessment, setAssessment] = useState<SleepAssessmentData | null>(null);

  // Load saved state on mount
  useEffect(() => {
    try {
      // Check for existing assessment
      const savedAssessment = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
      if (savedAssessment) {
        const parsedAssessment = JSON.parse(savedAssessment);
        setAssessment(parsedAssessment);
        
        // Check if program has been started
        const savedProgram = localStorage.getItem(PROGRAM_STORAGE_KEY);
        if (savedProgram) {
          const parsedProgram = JSON.parse(savedProgram);
          if (parsedProgram.isActive) {
            setStage('program');
          } else {
            setStage('plan');
          }
        } else {
          setStage('plan');
        }
      } else {
        setStage('assessment');
      }
    } catch (e) {
      console.error('Failed to load sleep state:', e);
      setStage('assessment');
    }
  }, []);

  const handleAssessmentComplete = (data: SleepAssessmentData) => {
    setAssessment(data);
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(data));
    setStage('plan');
  };

  const handleStartProgram = () => {
    // Initialize the program in localStorage
    const intervals = assessment && assessment.cryingTolerance >= 4 ? [3, 5, 10, 10, 12, 15] : [];
    const newProgram = {
      startDate: new Date().toISOString().split('T')[0],
      methodId: getMethodId(),
      nightLogs: [],
      currentNight: 1,
      isActive: true,
      checkInIntervals: intervals,
    };
    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(newProgram));
    setStage('program');
  };

  const getMethodId = () => {
    if (!assessment) return 'fading';
    const { cryingTolerance, babyAgeMonths } = assessment;
    if (cryingTolerance <= 2 || babyAgeMonths < 4) return 'fading';
    if (cryingTolerance === 3) return 'pupd';
    if (cryingTolerance === 4) return 'ferber';
    return 'extinction';
  };

  const handleEditAssessment = () => {
    setStage('assessment');
  };

  const handleResetProgram = () => {
    // Clear program data but keep assessment for reference
    localStorage.removeItem(PROGRAM_STORAGE_KEY);
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    setAssessment(null);
    setStage('assessment');
  };

  const handleOpenChat = () => {
    onTabChange?.('chat');
  };

  // Render based on current stage
  if (stage === 'assessment') {
    return (
      <SleepAssessment 
        onComplete={handleAssessmentComplete}
        onSkip={() => {
          // If they have an existing assessment, go back to their plan/program
          if (assessment) {
            const savedProgram = localStorage.getItem(PROGRAM_STORAGE_KEY);
            if (savedProgram) {
              setStage('program');
            } else {
              setStage('plan');
            }
          }
        }}
      />
    );
  }

  if (stage === 'plan' && assessment) {
    return (
      <SleepPlan 
        assessment={assessment}
        onStartProgram={handleStartProgram}
        onEditAssessment={handleEditAssessment}
      />
    );
  }

  if (stage === 'program' && assessment) {
    return (
      <SleepProgram 
        assessment={assessment}
        onOpenChat={handleOpenChat}
        onResetProgram={handleResetProgram}
      />
    );
  }

  // Fallback - shouldn't normally reach here
  return (
    <SleepAssessment 
      onComplete={handleAssessmentComplete}
    />
  );
};

export default Sleep;

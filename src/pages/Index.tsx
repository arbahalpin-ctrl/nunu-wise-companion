import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Onboarding, { OnboardingData } from '@/components/Onboarding';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Sleep from '@/pages/Sleep';
import Feeding from '@/pages/Feeding';
import Milestones from '@/pages/Milestones';
import ChatAssistant from '@/pages/ChatAssistant';
import Settings from '@/pages/Settings';
import { useAuth } from '@/contexts/AuthContext';
import { useNightMode } from '@/components/NightMode';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading, babyProfile, saveBabyProfile, refreshBabyProfile } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);

  // Check onboarding status based on baby profile
  useEffect(() => {
    if (user && babyProfile) {
      setHasCompletedOnboarding(true);
    } else if (user && !loading) {
      // User logged in but no baby profile - check if they're expecting (no profile needed)
      // or if they need onboarding
      setHasCompletedOnboarding(false);
    }
  }, [user, babyProfile, loading]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;
    
    setIsSavingOnboarding(true);
    
    try {
      // Update user profile with parent name
      await supabase.from('user_profiles').upsert({
        id: user.id,
        email: user.email,
        parent_name: data.parentName
      });

      // Create baby profile (even for expecting parents, so we track the state)
      await saveBabyProfile({
        name: data.isExpecting ? 'Baby' : data.babyName,
        birthdate: data.babyBirthdate || undefined,
        age_months: data.babyAgeMonths || 0,
        feeding_type: data.feedingType,
        is_expecting: data.isExpecting
      });

      // Refresh the baby profile in context
      await refreshBabyProfile();
      
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Still proceed - they can update later
      setHasCompletedOnboarding(true);
    } finally {
      setIsSavingOnboarding(false);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth if not logged in
  if (!user) {
    return <Auth onComplete={() => {}} />;
  }

  // Show onboarding if logged in but no baby profile
  if (hasCompletedOnboarding === false) {
    if (isSavingOnboarding) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Setting up your profile...</p>
            <p className="text-slate-400 text-sm mt-1">Just a moment</p>
          </div>
        </div>
      );
    }
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete}
        initialParentName={user?.user_metadata?.parent_name}
      />
    );
  }
  
  // Still checking onboarding status
  if (hasCompletedOnboarding === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onTabChange={setActiveTab} />;
      case 'sleep':
        return <Sleep onTabChange={setActiveTab} />;
      case 'feeding':
        return <Feeding />;
      case 'milestones':
        return <Milestones />;
      case 'chat':
        return <ChatAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onTabChange={setActiveTab} />;
    }
  };

  // Chat gets full width on desktop for better UX
  const isChat = activeTab === 'chat';
  const { isNightMode } = useNightMode();

  return (
    <div className={`min-h-screen flex justify-center transition-colors duration-500 ${
      isNightMode ? 'bg-[#0f0f1a]' : 'bg-slate-100'
    }`}>
      <div 
        className={`
          w-full min-h-screen shadow-xl relative transition-colors duration-500
          ${isChat ? 'max-w-4xl' : 'max-w-md'}
          ${isNightMode 
            ? 'bg-[#1a1a2e]' 
            : 'bg-gradient-to-b from-sky-50 to-white'
          }
        `}
        style={isNightMode ? { filter: 'sepia(10%) saturate(90%)' } : undefined}
      >
        {renderActiveTab()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;

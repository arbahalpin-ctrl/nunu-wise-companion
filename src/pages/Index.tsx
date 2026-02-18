import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Onboarding from '@/components/Onboarding';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Sleep from '@/pages/Sleep';
import Feeding from '@/pages/Feeding';
import Milestones from '@/pages/Milestones';
import ChatAssistant from '@/pages/ChatAssistant';
import Settings from '@/pages/Settings';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading, babyProfile } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Check onboarding status based on baby profile
  useEffect(() => {
    if (user && babyProfile) {
      setHasCompletedOnboarding(true);
    } else if (user && !babyProfile) {
      // User logged in but no baby profile - needs onboarding
      setHasCompletedOnboarding(false);
    }
  }, [user, babyProfile]);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
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
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
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

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className={`
        w-full min-h-screen bg-gradient-to-b from-sky-50 to-white shadow-xl relative
        ${isChat ? 'max-w-4xl' : 'max-w-md'}
      `}>
        {renderActiveTab()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;

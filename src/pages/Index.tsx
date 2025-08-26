import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Onboarding from '@/components/Onboarding';
import FloatingChatButton from '@/components/FloatingChatButton';
import Home from '@/pages/Home';
import BabyProfile from '@/pages/BabyProfile';
import Routines from '@/pages/Routines';
import SleepCoach from '@/pages/SleepCoach';
import Reflections from '@/pages/Reflections';
import ChatAssistant from '@/pages/ChatAssistant';
import Settings from '@/pages/Settings';

const Index = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('nunu-onboarding-completed');
    setHasCompletedOnboarding(!!completed);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('nunu-onboarding-completed', 'true');
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const handleChatOpen = () => {
    setActiveTab('chat');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onTabChange={setActiveTab} />;
      case 'baby':
        return <BabyProfile />;
      case 'routines':
        return <Routines />;
      case 'sleep':
        return <SleepCoach />;
      case 'notes':
        return <Reflections />;
      case 'chat':
        return <ChatAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Floating Chat Button - Hidden on chat page */}
      {activeTab !== 'chat' && (
        <FloatingChatButton 
          onChatOpen={handleChatOpen}
          isActive={activeTab === 'chat'}
        />
      )}
    </div>
  );
};

export default Index;

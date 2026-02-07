import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Onboarding from '@/components/Onboarding';
import Home from '@/pages/Home';
import ChatAssistant from '@/pages/ChatAssistant';
import Settings from '@/pages/Settings';

const Index = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onTabChange={setActiveTab} />;
      case 'chat':
        return <ChatAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {renderActiveTab()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;

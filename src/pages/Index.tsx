import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Onboarding from '@/components/Onboarding';
import Home from '@/pages/Home';
import Sleep from '@/pages/Sleep';
import Weaning from '@/pages/Weaning';
import Milestones from '@/pages/Milestones';
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
      case 'sleep':
        return <Sleep onTabChange={setActiveTab} />;
      case 'weaning':
        return <Weaning onOpenChat={() => setActiveTab('chat')} />;
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

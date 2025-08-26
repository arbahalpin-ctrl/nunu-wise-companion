import { Home, Baby, Clock, Mic, MessageCircle, Settings, Moon } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'baby', icon: Baby, label: 'Baby' },
    { id: 'routines', icon: Clock, label: 'Routines' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'notes', icon: Mic, label: 'Notes' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-comfort z-50">
      <div className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-gentle' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-gentle-bounce' : ''}`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
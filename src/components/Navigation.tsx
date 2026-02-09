import { Home, Moon, MessageCircle, Settings, Utensils, Baby } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'weaning', icon: Utensils, label: 'Weaning' },
    { id: 'milestones', icon: Baby, label: 'Milestones' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
      <div className="flex items-center justify-around py-3 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all
                ${isActive 
                  ? 'text-slate-800' 
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

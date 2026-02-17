import { useState, useEffect } from 'react';
import { Home, Moon, MessageCircle, Settings, Baby, Heart } from 'lucide-react';
import { getUnreadCount } from '@/utils/chatIntegration';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count and listen for updates
  useEffect(() => {
    const updateUnread = () => {
      setUnreadCount(getUnreadCount());
    };
    
    updateUnread();
    window.addEventListener('nunu-unread-update', updateUnread);
    
    return () => {
      window.removeEventListener('nunu-unread-update', updateUnread);
    };
  }, []);

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'feeding', icon: Heart, label: 'Feeding' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'milestones', icon: Baby, label: 'Milestones' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
      <div className="flex items-center justify-around py-3 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'chat' && unreadCount > 0;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all relative
                ${isActive 
                  ? 'text-slate-800' 
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

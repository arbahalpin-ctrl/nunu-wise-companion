import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

interface NightModeContextType {
  isNightMode: boolean;
  toggleNightMode: () => void;
}

const NightModeContext = createContext<NightModeContextType | undefined>(undefined);

const NIGHT_MODE_KEY = 'nunu-night-mode';

export function NightModeProvider({ children }: { children: ReactNode }) {
  const [isNightMode, setIsNightMode] = useState(() => {
    try {
      const saved = localStorage.getItem(NIGHT_MODE_KEY);
      if (saved) return JSON.parse(saved);
      
      // Auto-enable between 8pm and 6am
      const hour = new Date().getHours();
      return hour >= 20 || hour < 6;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(NIGHT_MODE_KEY, JSON.stringify(isNightMode));
  }, [isNightMode]);

  const toggleNightMode = () => setIsNightMode(prev => !prev);

  return (
    <NightModeContext.Provider value={{ isNightMode, toggleNightMode }}>
      {children}
    </NightModeContext.Provider>
  );
}

export function useNightMode() {
  const context = useContext(NightModeContext);
  if (!context) {
    throw new Error('useNightMode must be used within NightModeProvider');
  }
  return context;
}

// Night mode toggle button
export function NightModeToggle({ className = '' }: { className?: string }) {
  const { isNightMode, toggleNightMode } = useNightMode();
  
  return (
    <button
      onClick={toggleNightMode}
      className={`
        p-2 rounded-lg transition-all duration-300
        ${isNightMode 
          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }
        ${className}
      `}
      title={isNightMode ? 'Turn off night mode' : 'Turn on night mode'}
    >
      {isNightMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

// Night mode wrapper for content
export function NightModeWrapper({ 
  children, 
  className = '' 
}: { 
  children: ReactNode;
  className?: string;
}) {
  const { isNightMode } = useNightMode();
  
  return (
    <div 
      className={`
        min-h-screen transition-colors duration-500
        ${isNightMode 
          ? 'bg-slate-900 text-slate-100' 
          : ''
        }
        ${className}
      `}
      style={undefined}
    >
      {children}
    </div>
  );
}

// Night mode card styling
export function getNightModeCardClass(isNightMode: boolean, baseClass: string = '') {
  return `${baseClass} ${isNightMode 
    ? 'bg-slate-800 border-slate-700 text-slate-100' 
    : ''
  }`;
}

// Night mode text colors
export function getNightModeTextClass(isNightMode: boolean, lightClass: string, darkClass: string = '') {
  return isNightMode ? (darkClass || 'text-slate-200') : lightClass;
}

import { useState } from 'react';
import { X } from 'lucide-react';
import koalaSitting from '@/assets/koala-sitting.png';
import koalaSleep from '@/assets/koala-sleep.png';
import koalaFeeding from '@/assets/koala-feeding.png';
import koalaBottle from '@/assets/koala-bottle.png';

const koalaImages = {
  sitting: koalaSitting,
  sleep: koalaSleep,
  feeding: koalaFeeding,
  bottle: koalaBottle,
};

export type KoalaVariant = keyof typeof koalaImages;

interface NunuGuideProps {
  message: string;
  variant?: KoalaVariant;
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  storageKey?: string; // If set, remembers dismissal
  position?: 'left' | 'right';
  className?: string;
}

export default function NunuGuide({ 
  message, 
  variant = 'sitting', 
  size = 'md',
  dismissible = true,
  storageKey,
  position = 'left',
  className = ''
}: NunuGuideProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (storageKey) {
      return localStorage.getItem(`nunu-guide-${storageKey}`) === 'true';
    }
    return false;
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (storageKey) {
      localStorage.setItem(`nunu-guide-${storageKey}`, 'true');
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const bubbleMaxWidth = {
    sm: 'max-w-[180px]',
    md: 'max-w-[220px]',
    lg: 'max-w-[260px]',
  };

  return (
    <div className={`flex items-end gap-2 ${position === 'right' ? 'flex-row-reverse' : ''} ${className}`}>
      {/* Koala */}
      <div className={`${sizeClasses[size]} flex-shrink-0 animate-nunu-float`}>
        <img 
          src={koalaImages[variant]} 
          alt="Nunu" 
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>
      
      {/* Speech bubble */}
      <div className={`relative ${bubbleMaxWidth[size]}`}>
        <div className={`
          bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2.5 shadow-md border border-slate-100
          ${position === 'left' ? 'rounded-bl-sm' : 'rounded-br-sm'}
        `}>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          {dismissible && (
            <button 
              onClick={handleDismiss}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Smaller inline variant - just koala peeking with a tiny tip
export function NunuPeek({ 
  message, 
  variant = 'sitting',
  className = '' 
}: { 
  message: string; 
  variant?: KoalaVariant;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 py-2 ${className}`}>
      <div className="w-8 h-8 flex-shrink-0 animate-nunu-bounce">
        <img src={koalaImages[variant]} alt="Nunu" className="w-full h-full object-contain" />
      </div>
      <p className="text-xs text-slate-400 italic">{message}</p>
    </div>
  );
}

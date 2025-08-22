import { MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingChatButtonProps {
  onChatOpen: () => void;
  isActive?: boolean;
}

const FloatingChatButton = ({ onChatOpen, isActive = false }: FloatingChatButtonProps) => {
  return (
    <div className="fixed bottom-24 right-4 z-40">
      <Button
        onClick={onChatOpen}
        className={`
          w-14 h-14 rounded-full shadow-comfort hover:shadow-nurture
          bg-primary hover:bg-primary/90 text-primary-foreground
          transition-all duration-300 hover:scale-110
          ${isActive ? 'bg-primary/80 animate-gentle-bounce' : ''}
        `}
        size="icon"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          
          {/* Heartbeat indicator */}
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-accent rounded-full animate-comfort-pulse">
              <div className="w-full h-full bg-accent rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        </div>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-card border border-border rounded-lg px-3 py-2 shadow-gentle opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        <p className="text-sm text-foreground font-medium">Chat with Nunu</p>
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border"></div>
      </div>
    </div>
  );
};

export default FloatingChatButton;
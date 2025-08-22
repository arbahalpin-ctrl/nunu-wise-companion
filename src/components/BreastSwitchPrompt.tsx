import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BreastSwitchPromptProps {
  onYes: () => void;
  onNo: () => void;
  isVisible: boolean;
}

const BreastSwitchPrompt = ({ onYes, onNo, isVisible }: BreastSwitchPromptProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in">
      {/* Bottom Sheet */}
      <div className="w-full max-w-md mx-4 mb-4 animate-slide-in-right">
        <Card className="shadow-comfort border-none bg-card/95 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">👉</span>
              </div>
              
              {/* Message */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Great job, mama! ✨
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Would you like to log the Right Breast now?
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={onYes}
                  className="flex-1 rounded-2xl py-6 shadow-gentle hover:shadow-comfort transition-all duration-300"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Yes, log Right Breast
                </Button>
                
                <Button
                  onClick={onNo}
                  variant="outline"
                  className="flex-1 rounded-2xl py-6 shadow-gentle hover:shadow-comfort transition-all duration-300 bg-card/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  No, I'm done for now
                </Button>
              </div>
              
              {/* Gentle reminder */}
              <p className="text-xs text-muted-foreground mt-3">
                No pressure — you know what's best for you and baby 💝
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreastSwitchPrompt;
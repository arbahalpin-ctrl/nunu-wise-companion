import { useState, useEffect } from 'react';
import { Play, Pause, Square, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface FeedingTimerProps {
  onBack: () => void;
  onSaveFeed: (feed: FeedingLog) => void;
  initialFeedingType?: 'left-breast' | 'right-breast' | 'bottle';
  previousNotes?: string;
}

export interface FeedingLog {
  id: string;
  startTime: Date;
  duration: number; // in seconds
  feedingType: 'left-breast' | 'right-breast' | 'bottle';
  notes: string;
}

const FeedingTimer = ({ onBack, onSaveFeed, initialFeedingType, previousNotes }: FeedingTimerProps) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [feedingType, setFeedingType] = useState<'left-breast' | 'right-breast' | 'bottle' | null>(initialFeedingType || null);
  const [notes, setNotes] = useState(previousNotes || '');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showChimeWarning, setShowChimeWarning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          // Show 45-minute warning
          if (newSeconds === 2700) { // 45 minutes
            setShowChimeWarning(true);
            // Auto-hide warning after 10 seconds
            setTimeout(() => setShowChimeWarning(false), 10000);
          }
          return newSeconds;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isTimerRunning && !startTime) {
      setStartTime(new Date());
    }
    setIsTimerRunning(true);
  };

  const handlePause = () => {
    setIsTimerRunning(false);
  };

  const handleStop = () => {
    if (feedingType && startTime) {
      const feed: FeedingLog = {
        id: Date.now().toString(),
        startTime,
        duration: seconds,
        feedingType,
        notes
      };
      onSaveFeed(feed);
    }
    // Reset all states
    setIsTimerRunning(false);
    setSeconds(0);
    setFeedingType(null);
    setNotes('');
    setStartTime(null);
    onBack();
  };

  const feedingTypes = [
    { id: 'left-breast', label: 'Left Breast', emoji: '👈' },
    { id: 'right-breast', label: 'Right Breast', emoji: '👉' },
    { id: 'bottle', label: 'Bottle', emoji: '🍼' }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      {/* Header */}
      <div className="bg-gradient-nurture rounded-b-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onBack}
            className="bg-white/20 border-white/30 text-foreground hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Feeding Timer</h1>
        </div>
      </div>

      {/* 45-minute warning */}
      {showChimeWarning && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
          <Card className="bg-accent/90 border-accent backdrop-blur-sm shadow-comfort">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-accent-foreground rounded-full animate-pulse"></div>
                <p className="text-sm text-accent-foreground">
                  Gentle reminder: You've been feeding for 45 minutes. Take care of yourself too 💝
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Timer Display */}
        <Card className="shadow-gentle border-none">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2 animate-comfort-pulse" />
              <div className="text-5xl font-bold text-primary mb-2 tracking-wider font-mono">
                {formatTime(seconds)}
              </div>
              <p className="text-muted-foreground text-sm">
                {isTimerRunning ? 'Feeding in progress...' : 'Ready to start'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-4">
              {!isTimerRunning ? (
                <Button
                  onClick={handleStart}
                  disabled={!feedingType}
                  className="rounded-full px-8 py-6 shadow-gentle hover:shadow-comfort transition-all duration-300"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {seconds === 0 ? 'Start Feeding' : 'Resume'}
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="rounded-full px-8 py-6 shadow-gentle hover:shadow-comfort transition-all duration-300"
                  size="lg"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              
              {seconds > 0 && (
                <Button
                  onClick={handleStop}
                  disabled={!feedingType}
                  className="rounded-full px-8 py-6 shadow-gentle hover:shadow-comfort transition-all duration-300 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Stop & Save
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feeding Type Selection */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Feeding Type</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 gap-3">
              {feedingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedingType(type.id as any)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-300 text-left
                    ${feedingType === type.id
                      ? 'border-primary bg-primary/10 shadow-gentle' 
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.emoji}</span>
                    <span className="font-medium">{type.label}</span>
                    {feedingType === type.id && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Textarea
              placeholder="e.g., Sleepy latch, fussy today, good appetite..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none rounded-2xl border-border focus:border-primary/50"
            />
          </CardContent>
        </Card>

        {/* Status Info */}
        {startTime && (
          <Card className="shadow-gentle border-none bg-accent/10">
            <CardContent className="p-4">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">
                  Started at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {feedingType && (
                  <p className="text-xs text-accent-foreground">
                    {feedingTypes.find(t => t.id === feedingType)?.label} selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedingTimer;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedingLog as FeedingLogType } from './FeedingTimer';
import { Clock, Calendar } from 'lucide-react';

interface FeedingLogProps {
  feeds: FeedingLogType[];
}

const FeedingLog = ({ feeds }: FeedingLogProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getFeedingTypeDisplay = (type: string) => {
    switch (type) {
      case 'left-breast': return { emoji: '👈', label: 'Left Breast' };
      case 'right-breast': return { emoji: '👉', label: 'Right Breast' };
      case 'bottle': return { emoji: '🍼', label: 'Bottle' };
      default: return { emoji: '🍼', label: 'Feed' };
    }
  };

  const todayFeeds = feeds.filter(feed => {
    const today = new Date();
    const feedDate = new Date(feed.startTime);
    return feedDate.toDateString() === today.toDateString();
  });

  if (todayFeeds.length === 0) {
    return (
      <Card className="shadow-gentle border-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Feeds
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-muted-foreground text-center py-8">
            No feeds logged today yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-gentle border-none">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Feeds ({todayFeeds.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {todayFeeds.map((feed) => {
            const feedType = getFeedingTypeDisplay(feed.feedingType);
            return (
              <div
                key={feed.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl"
              >
                <span className="text-xl">{feedType.emoji}</span>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{feedType.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(feed.duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(feed.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  {feed.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      "{feed.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedingLog;
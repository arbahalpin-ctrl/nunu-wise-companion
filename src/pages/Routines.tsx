import { useState } from 'react';
import { Plus, Clock, Baby, Moon, AlertCircle, BarChart3, Sun, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface RoutineEntry {
  id: string;
  type: 'feeding' | 'sleep' | 'diaper';
  time: string;
  duration?: string;
  notes?: string;
  isNighttime?: boolean;
}

const Routines = () => {
  const [entries] = useState<RoutineEntry[]>([
    { id: '1', type: 'feeding', time: '08:30', duration: '25 min', notes: 'Good latch', isNighttime: false },
    { id: '2', type: 'diaper', time: '09:15', notes: 'Wet diaper', isNighttime: false },
    { id: '3', type: 'sleep', time: '10:00', duration: '2h 30min', notes: 'Peaceful nap', isNighttime: false },
    { id: '4', type: 'feeding', time: '12:45', duration: '20 min', isNighttime: false },
    { id: '5', type: 'sleep', time: '13:15', duration: '1h 45min', notes: 'Longest nap of the day', isNighttime: false },
    { id: '6', type: 'feeding', time: '15:30', duration: '30 min', isNighttime: false },
    { id: '7', type: 'diaper', time: '16:00', notes: 'Clean diaper', isNighttime: false },
    { id: '8', type: 'feeding', time: '02:30', duration: '15 min', notes: 'Night feed', isNighttime: true },
    { id: '9', type: 'diaper', time: '02:45', notes: 'Quick change', isNighttime: true },
  ]);

  const [showTimeline, setShowTimeline] = useState(false);
  const [showNightData, setShowNightData] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'feeding' | 'sleep' | 'diaper'>('all');

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'feeding': return '🍼';
      case 'sleep': return '😴';
      case 'diaper': return '👶';
      default: return '📝';
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'feeding': return 'bg-nunu-peach text-white';
      case 'sleep': return 'bg-nunu-lavender text-white';
      case 'diaper': return 'bg-nunu-sage text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const predictNextFeed = () => {
    const feedingEntries = entries.filter(e => e.type === 'feeding').sort((a, b) => a.time.localeCompare(b.time));
    if (feedingEntries.length < 2) return null;
    
    const lastFeed = feedingEntries[feedingEntries.length - 1];
    const avgInterval = 3; // hours (could calculate from actual data)
    const lastTime = new Date(`2024-01-01 ${lastFeed.time}`);
    const nextTime = new Date(lastTime.getTime() + avgInterval * 60 * 60 * 1000);
    
    return nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSmartInsight = () => {
    const sleepEntries = entries.filter(e => e.type === 'sleep' && !e.isNighttime);
    const longestNap = sleepEntries.reduce((prev, current) => {
      const prevDuration = prev.duration?.includes('h') ? parseInt(prev.duration) * 60 : 0;
      const currentDuration = current.duration?.includes('h') ? parseInt(current.duration) * 60 : 0;
      return currentDuration > prevDuration ? current : prev;
    }, sleepEntries[0]);

    if (longestNap) {
      return `Emma usually takes her longest nap around ${longestNap.time}. You might want to plan some rest time for yourself too 💆‍♀️`;
    }
    return "Emma's settling into her rhythm beautifully. Keep noting these patterns — they'll help you both find your flow ✨";
  };

  const getDayEntries = () => entries.filter(entry => !entry.isNighttime);
  const getNightEntries = () => entries.filter(entry => entry.isNighttime);
  
  const getFilteredEntries = (entriesList: RoutineEntry[]) => {
    if (filterType === 'all') return entriesList;
    return entriesList.filter(entry => entry.type === filterType);
  };
  
  const baseEntries = showNightData ? entries : getDayEntries();
  const displayEntries = getFilteredEntries(baseEntries);

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-calm p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Daily Routines</h1>
        <p className="text-muted-foreground">Track feeding, sleeping, and diaper changes</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Smart Pattern Summary */}
        <Card className="shadow-gentle border-none bg-gradient-to-r from-accent-soft to-secondary-soft">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-2">Pattern Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getSmartInsight()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Controls */}
        <div className="flex items-center justify-between bg-card rounded-xl p-4 shadow-gentle">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Timeline view</span>
              <Switch 
                checked={showTimeline} 
                onCheckedChange={setShowTimeline}
              />
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Show overnight</span>
              <Switch 
                checked={showNightData} 
                onCheckedChange={setShowNightData}
              />
            </div>
          </div>
          
          {/* Next Event Prediction */}
          {predictNextFeed() && (
            <Badge variant="outline" className="bg-primary-soft text-primary-foreground">
              🕐 Next expected feed: ~{predictNextFeed()}
            </Badge>
          )}
        </div>
        {/* Quick Add/Filter Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button 
            onClick={() => setFilterType(filterType === 'feeding' ? 'all' : 'feeding')}
            className={`h-16 flex-col gap-1 rounded-2xl shadow-gentle transition-all ${
              filterType === 'feeding' 
                ? 'bg-nunu-peach hover:bg-nunu-peach/90 ring-2 ring-nunu-peach/50' 
                : 'bg-nunu-peach/50 hover:bg-nunu-peach/70'
            }`}
          >
            <span className="text-xl">🍼</span>
            <span className="text-xs">Feeding</span>
            {filterType === 'feeding' && <div className="text-xs opacity-75">✓ Filtered</div>}
          </Button>
          <Button 
            onClick={() => setFilterType(filterType === 'sleep' ? 'all' : 'sleep')}
            className={`h-16 flex-col gap-1 rounded-2xl shadow-gentle transition-all ${
              filterType === 'sleep' 
                ? 'bg-nunu-lavender hover:bg-nunu-lavender/90 ring-2 ring-nunu-lavender/50' 
                : 'bg-nunu-lavender/50 hover:bg-nunu-lavender/70'
            }`}
          >
            <span className="text-xl">😴</span>
            <span className="text-xs">Sleep</span>
            {filterType === 'sleep' && <div className="text-xs opacity-75">✓ Filtered</div>}
          </Button>
          <Button 
            onClick={() => setFilterType(filterType === 'diaper' ? 'all' : 'diaper')}
            className={`h-16 flex-col gap-1 rounded-2xl shadow-gentle transition-all ${
              filterType === 'diaper' 
                ? 'bg-nunu-sage hover:bg-nunu-sage/90 ring-2 ring-nunu-sage/50' 
                : 'bg-nunu-sage/50 hover:bg-nunu-sage/70'
            }`}
          >
            <span className="text-xl">👶</span>
            <span className="text-xs">Diaper</span>
            {filterType === 'diaper' && <div className="text-xs opacity-75">✓ Filtered</div>}
          </Button>
        </div>

        {/* Timeline View */}
        {showTimeline && (
          <Card className="shadow-gentle border-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Visual Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Timeline hours */}
                <div className="grid grid-cols-24 gap-px text-xs text-muted-foreground">
                  {Array.from({length: 24}, (_, i) => (
                    <div key={i} className="text-center">
                      {i.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                
                {/* Feeding timeline */}
                <div className="relative">
                  <span className="text-xs text-muted-foreground mr-2">🍼</span>
                  <div className="grid grid-cols-24 gap-px">
                    {Array.from({length: 24}, (_, hour) => {
                      const hasFeeding = displayEntries.some(entry => 
                        entry.type === 'feeding' && parseInt(entry.time.split(':')[0]) === hour
                      );
                      return (
                        <div 
                          key={hour} 
                          className={`h-4 rounded-sm ${hasFeeding ? 'bg-nunu-peach' : 'bg-muted/30'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Sleep timeline */}
                <div className="relative">
                  <span className="text-xs text-muted-foreground mr-2">😴</span>
                  <div className="grid grid-cols-24 gap-px">
                    {Array.from({length: 24}, (_, hour) => {
                      const hasSleep = displayEntries.some(entry => 
                        entry.type === 'sleep' && parseInt(entry.time.split(':')[0]) === hour
                      );
                      return (
                        <div 
                          key={hour} 
                          className={`h-4 rounded-sm ${hasSleep ? 'bg-nunu-lavender' : 'bg-muted/30'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Diaper timeline */}
                <div className="relative">
                  <span className="text-xs text-muted-foreground mr-2">👶</span>
                  <div className="grid grid-cols-24 gap-px">
                    {Array.from({length: 24}, (_, hour) => {
                      const hasDiaper = displayEntries.some(entry => 
                        entry.type === 'diaper' && parseInt(entry.time.split(':')[0]) === hour
                      );
                      return (
                        <div 
                          key={hour} 
                          className={`h-4 rounded-sm ${hasDiaper ? 'bg-nunu-sage' : 'bg-muted/30'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Timeline */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {filterType !== 'all' ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Entries` : 
               showNightData ? "Today's Complete Timeline" : "Daytime Activities"}
              {showNightData && getNightEntries().length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getNightEntries().length} overnight
                </Badge>
              )}
              {filterType !== 'all' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFilterType('all')}
                  className="text-xs h-6 px-2"
                >
                  Show All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Day entries */}
            {getFilteredEntries(getDayEntries()).length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sun className="h-4 w-4" />
                  <span>Daytime ({getFilteredEntries(getDayEntries()).length} activities)</span>
                </div>
                {getFilteredEntries(getDayEntries()).map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors ml-6">
                    <div className="text-2xl">
                      {getEntryIcon(entry.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className={`${getEntryColor(entry.type)} text-xs`}>
                          {entry.type}
                        </Badge>
                        <span className="text-sm font-medium">{entry.time}</span>
                        {entry.duration && (
                          <span className="text-xs text-muted-foreground">• {entry.duration}</span>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Night entries */}
            {showNightData && getFilteredEntries(getNightEntries()).length > 0 && (
              <div className="space-y-3">
                <Separator className="my-4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Moon className="h-4 w-4" />
                  <span>Overnight ({getFilteredEntries(getNightEntries()).length} activities)</span>
                </div>
                {getFilteredEntries(getNightEntries()).map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary-soft/30 ml-6">
                    <div className="text-2xl">
                      {getEntryIcon(entry.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className={`${getEntryColor(entry.type)} text-xs`}>
                          {entry.type}
                        </Badge>
                        <span className="text-sm font-medium">{entry.time}</span>
                        {entry.duration && (
                          <span className="text-xs text-muted-foreground">• {entry.duration}</span>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {displayEntries.length === 0 && (
              <div className="text-center py-8">
                <Baby className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No entries yet today</p>
                <p className="text-sm text-muted-foreground">Tap the buttons above to start tracking</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-nunu-peach">28</div>
                <div className="text-xs text-muted-foreground">Feedings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-nunu-lavender">42h</div>
                <div className="text-xs text-muted-foreground">Sleep</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-nunu-sage">31</div>
                <div className="text-xs text-muted-foreground">Diapers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gentle Routine Suggestions */}
        <Card className="shadow-gentle border-none bg-gradient-to-br from-accent-soft to-secondary-soft">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-lg">🐨</div>
              <div>
                <h4 className="font-medium text-sm mb-2">Today's Gentle Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Emma slept a bit less than usual today. You might want to keep the evening wind-down extra calm and gentle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gentle Tips */}
        <Card className="shadow-gentle border-none bg-secondary-soft">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Gentle Reminder</h4>
                <p className="text-xs text-muted-foreground">
                  Every baby has their own rhythm. These patterns help you learn, not judge. You're doing wonderfully! 🌸
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Routines;
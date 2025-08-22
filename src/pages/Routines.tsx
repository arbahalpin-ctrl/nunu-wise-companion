import { useState } from 'react';
import { Plus, Clock, Baby, Moon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RoutineEntry {
  id: string;
  type: 'feeding' | 'sleep' | 'diaper';
  time: string;
  duration?: string;
  notes?: string;
}

const Routines = () => {
  const [entries] = useState<RoutineEntry[]>([
    { id: '1', type: 'feeding', time: '08:30', duration: '25 min', notes: 'Good latch' },
    { id: '2', type: 'diaper', time: '09:15', notes: 'Wet diaper' },
    { id: '3', type: 'sleep', time: '10:00', duration: '2h 30min', notes: 'Peaceful nap' },
    { id: '4', type: 'feeding', time: '12:45', duration: '20 min' },
  ]);

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

  const todayEntries = entries.filter(entry => {
    // For demo, showing all entries as "today"
    return true;
  });

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-calm p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Daily Routines</h1>
        <p className="text-muted-foreground">Track feeding, sleeping, and diaper changes</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button className="h-16 flex-col gap-1 bg-nunu-peach hover:bg-nunu-peach/90 rounded-2xl shadow-gentle">
            <span className="text-xl">🍼</span>
            <span className="text-xs">Feeding</span>
          </Button>
          <Button className="h-16 flex-col gap-1 bg-nunu-lavender hover:bg-nunu-lavender/90 rounded-2xl shadow-gentle">
            <span className="text-xl">😴</span>
            <span className="text-xs">Sleep</span>
          </Button>
          <Button className="h-16 flex-col gap-1 bg-nunu-sage hover:bg-nunu-sage/90 rounded-2xl shadow-gentle">
            <span className="text-xl">👶</span>
            <span className="text-xs">Diaper</span>
          </Button>
        </div>

        {/* Today's Timeline */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEntries.length === 0 ? (
              <div className="text-center py-8">
                <Baby className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No entries yet today</p>
                <p className="text-sm text-muted-foreground">Tap the buttons above to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
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
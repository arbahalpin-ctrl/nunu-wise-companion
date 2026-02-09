import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface MoodEntry {
  mood: string;
  timestamp: number;
}

interface MoodCalendarProps {
  entries: MoodEntry[];
  onClose: () => void;
}

const MOODS: Record<string, { emoji: string; label: string; color: string }> = {
  good: { emoji: '😊', label: 'Good', color: 'bg-emerald-200' },
  okay: { emoji: '😐', label: 'Okay', color: 'bg-amber-200' },
  tired: { emoji: '😴', label: 'Tired', color: 'bg-blue-200' },
  anxious: { emoji: '😰', label: 'Anxious', color: 'bg-purple-200' },
  sad: { emoji: '😢', label: 'Sad', color: 'bg-indigo-200' },
  overwhelmed: { emoji: '😩', label: 'Overwhelmed', color: 'bg-rose-200' },
};

const MoodCalendar = ({ entries, onClose }: MoodCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Group entries by date
  const moodsByDate = useMemo(() => {
    const map: Record<string, MoodEntry[]> = {};
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return map;
  }, [entries]);

  // Get dominant mood for a day (most recent)
  const getMoodForDay = (day: number): MoodEntry | null => {
    const key = `${year}-${month}-${day}`;
    const dayEntries = moodsByDate[key];
    if (!dayEntries || dayEntries.length === 0) return null;
    // Return most recent entry for that day
    return dayEntries.sort((a, b) => b.timestamp - a.timestamp)[0];
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const blanks = Array(firstDayOfMonth).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isToday = (day: number) => 
    today.getFullYear() === year && 
    today.getMonth() === month && 
    today.getDate() === day;

  // Calculate mood stats for the month
  const monthStats = useMemo(() => {
    const stats: Record<string, number> = {};
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      if (date.getFullYear() === year && date.getMonth() === month) {
        stats[entry.mood] = (stats[entry.mood] || 0) + 1;
      }
    });
    return stats;
  }, [entries, year, month]);

  const totalEntries = Object.values(monthStats).reduce((a, b) => a + b, 0);

  return (
    <Card className="border-none shadow-md bg-white">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToPrevMonth} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h3 className="font-semibold text-slate-800">{monthName}</h3>
          <button onClick={goToNextMonth} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-xs text-slate-400 font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square" />
          ))}
          {daysArray.map(day => {
            const moodEntry = getMoodForDay(day);
            const mood = moodEntry ? MOODS[moodEntry.mood] : null;
            
            return (
              <div
                key={day}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-xs
                  ${isToday(day) ? 'ring-2 ring-slate-400' : ''}
                  ${mood ? mood.color : 'bg-slate-50'}
                `}
              >
                <span className={`${mood ? 'text-slate-700' : 'text-slate-400'}`}>{day}</span>
                {mood && <span className="text-sm">{mood.emoji}</span>}
              </div>
            );
          })}
        </div>

        {/* Month summary */}
        {totalEntries > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">{totalEntries} check-ins this month</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(monthStats)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div key={mood} className="flex items-center gap-1 text-xs text-slate-600">
                    <span>{MOODS[mood]?.emoji}</span>
                    <span>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 py-2"
        >
          Back to check-in
        </button>
      </CardContent>
    </Card>
  );
};

export default MoodCalendar;

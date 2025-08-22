import { useState } from 'react';
import { Mic, Play, Pause, Trash2, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VoiceNote {
  id: string;
  date: string;
  duration: string;
  title?: string;
  mood?: 'happy' | 'overwhelmed' | 'peaceful' | 'tired';
}

const VoiceNotes = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [notes] = useState<VoiceNote[]>([
    { id: '1', date: '2024-08-22T10:30', duration: '3:42', title: 'Morning thoughts', mood: 'peaceful' },
    { id: '2', date: '2024-08-21T20:15', duration: '2:18', title: 'Bedtime struggles', mood: 'tired' },
    { id: '3', date: '2024-08-21T14:20', duration: '1:55', mood: 'happy' },
    { id: '4', date: '2024-08-20T16:45', duration: '4:12', title: 'Feeling overwhelmed', mood: 'overwhelmed' },
  ]);

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'happy': return 'bg-nunu-yellow text-foreground';
      case 'peaceful': return 'bg-nunu-sage text-white';
      case 'tired': return 'bg-nunu-lavender text-white';
      case 'overwhelmed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'peaceful': return '🌸';
      case 'tired': return '😴';
      case 'overwhelmed': return '🤗';
      default: return '💭';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      // Start recording timer here
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-calm p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Voice Notes</h1>
        <p className="text-muted-foreground">A safe space to share your thoughts and feelings</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Recording Section */}
        <Card className="shadow-gentle border-none">
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <div 
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300
                  ${isRecording 
                    ? 'bg-destructive animate-pulse shadow-lg' 
                    : 'bg-primary hover:bg-primary/90 shadow-gentle'
                  }
                `}
              >
                <Mic className="h-8 w-8 text-white" />
              </div>
              
              {isRecording && (
                <div className="mt-4">
                  <div className="text-2xl font-mono font-bold text-destructive">
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-sm text-muted-foreground">Recording...</p>
                </div>
              )}
            </div>

            <Button 
              onClick={handleRecord}
              className={`
                rounded-full px-8 py-3 shadow-gentle
                ${isRecording 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : 'bg-primary hover:bg-primary/90'
                }
              `}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            {!isRecording && (
              <p className="text-sm text-muted-foreground mt-3">
                Press and share whatever is on your heart. No judgment, just love. 💝
              </p>
            )}
          </CardContent>
        </Card>

        {/* Voice Notes List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Your Reflections
            </h3>
            <span className="text-sm text-muted-foreground">{notes.length} notes</span>
          </div>

          {notes.length === 0 ? (
            <Card className="shadow-gentle border-none">
              <CardContent className="p-8 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium mb-2">No voice notes yet</h4>
                <p className="text-sm text-muted-foreground">
                  Your first note is waiting to be shared. Whenever you're ready. 🌸
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="shadow-gentle border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getMoodEmoji(note.mood)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {note.mood && (
                            <Badge variant="secondary" className={`${getMoodColor(note.mood)} text-xs`}>
                              {note.mood}
                            </Badge>
                          )}
                          <span className="text-sm font-medium">{note.duration}</span>
                        </div>
                        
                        {note.title && (
                          <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          {formatDate(note.date)}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Gentle Encouragement */}
        <Card className="shadow-gentle border-none bg-accent-soft">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-accent-foreground italic">
              "Your voice matters. Your feelings are valid. You are heard." 🎵
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceNotes;
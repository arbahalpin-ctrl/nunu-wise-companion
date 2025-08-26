import { useState } from 'react';
import { Mic, Play, Pause, Trash2, Plus, Heart, Edit3, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceNote {
  id: string;
  type: 'voice';
  date: string;
  duration: string;
  title?: string;
  mood?: 'happy' | 'overwhelmed' | 'peaceful' | 'tired';
}

interface JournalEntry {
  id: string;
  type: 'journal';
  date: string;
  title?: string;
  content: string;
  mood?: 'happy' | 'overwhelmed' | 'peaceful' | 'tired';
}

type Reflection = VoiceNote | JournalEntry;

const reflectionPrompts = [
  "What's something small that went well today?",
  "What's feeling heavy right now?",
  "A moment today that made me smile...",
  "What would I tell a friend going through this?",
  "What am I grateful for right now?",
  "How did I grow today, even in small ways?",
];

const Reflections = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'journal'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPrompts, setShowPrompts] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  
  // Journal form state
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<string>('');

  const [reflections] = useState<Reflection[]>([
    { id: '1', type: 'voice', date: '2024-08-22T10:30', duration: '3:42', title: 'Morning thoughts', mood: 'peaceful' },
    { id: '2', type: 'journal', date: '2024-08-22T09:15', title: 'Grateful morning', content: 'Emma slept through the night and woke up with the biggest smile. These little victories mean everything.', mood: 'happy' },
    { id: '3', type: 'voice', date: '2024-08-21T20:15', duration: '2:18', title: 'Bedtime struggles', mood: 'tired' },
    { id: '4', type: 'journal', date: '2024-08-21T16:30', title: 'Feeling overwhelmed', content: 'Today felt like everything was happening at once. Remind myself that it\'s okay to not have it all figured out.', mood: 'overwhelmed' },
    { id: '5', type: 'voice', date: '2024-08-21T14:20', duration: '1:55', mood: 'happy' },
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
    }
  };

  const handleSaveJournal = () => {
    if (journalContent.trim()) {
      // Save journal entry logic here
      setJournalTitle('');
      setJournalContent('');
      setJournalMood('');
    }
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * reflectionPrompts.length);
    setCurrentPrompt(randomIndex);
    setShowPrompts(true);
  };

  const usePrompt = () => {
    setJournalContent(reflectionPrompts[currentPrompt] + '\n\n');
    setShowPrompts(false);
    setActiveTab('journal');
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-calm p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Reflect with Nunu</h1>
        <p className="text-muted-foreground">A safe space to share your thoughts and feelings — in your voice or your words</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'voice' | 'journal')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 shadow-gentle">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Reflections
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Journal Entries
            </TabsTrigger>
          </TabsList>

          {/* Voice Recording Tab */}
          <TabsContent value="voice" className="space-y-6 mt-6">
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
          </TabsContent>

          {/* Journal Entry Tab */}
          <TabsContent value="journal" className="space-y-6 mt-6">
            <Card className="shadow-gentle border-none">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">New Journal Entry</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={getRandomPrompt}
                    className="text-primary hover:text-primary/80"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Need inspiration?
                  </Button>
                </div>

                {showPrompts && (
                  <Card className="bg-accent-soft border-accent">
                    <CardContent className="p-4">
                      <p className="text-sm italic mb-3 text-accent-foreground">
                        "{reflectionPrompts[currentPrompt]}"
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={usePrompt} className="text-xs">
                          Use this prompt
                        </Button>
                        <Button size="sm" variant="ghost" onClick={getRandomPrompt} className="text-xs">
                          Try another
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowPrompts(false)} className="text-xs">
                          Close
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Input
                  placeholder="Give your entry a title (optional)"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  className="border-muted"
                />

                <Textarea
                  placeholder="What's on your mind? Write as much or as little as feels right..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="min-h-[120px] border-muted resize-none"
                />

                <div className="flex items-center justify-between">
                  <Select value={journalMood} onValueChange={setJournalMood}>
                    <SelectTrigger className="w-32 border-muted">
                      <SelectValue placeholder="Mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">😊 Happy</SelectItem>
                      <SelectItem value="peaceful">🌸 Peaceful</SelectItem>
                      <SelectItem value="tired">😴 Tired</SelectItem>
                      <SelectItem value="overwhelmed">🤗 Overwhelmed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={handleSaveJournal}
                    disabled={!journalContent.trim()}
                    className="shadow-gentle"
                  >
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Unified Reflections Archive */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Your Reflections
            </h3>
            <span className="text-sm text-muted-foreground">{reflections.length} entries</span>
          </div>

          {reflections.length === 0 ? (
            <Card className="shadow-gentle border-none">
              <CardContent className="p-8 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium mb-2">No reflections yet</h4>
                <p className="text-sm text-muted-foreground">
                  Your first reflection is waiting to be shared. Whenever you're ready. 🌸
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reflections.map((reflection) => (
                <Card key={reflection.id} className="shadow-gentle border-none">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-2xl">
                          {reflection.type === 'voice' ? '🎙' : '📝'}
                        </div>
                        <div className="text-lg">
                          {getMoodEmoji(reflection.mood)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {reflection.mood && (
                            <Badge variant="secondary" className={`${getMoodColor(reflection.mood)} text-xs`}>
                              {reflection.mood}
                            </Badge>
                          )}
                          {reflection.type === 'voice' && (
                            <span className="text-sm font-medium">{(reflection as VoiceNote).duration}</span>
                          )}
                        </div>
                        
                        {reflection.title && (
                          <h4 className="font-medium text-sm mb-1">{reflection.title}</h4>
                        )}
                        
                        {reflection.type === 'journal' && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {(reflection as JournalEntry).content}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          {formatDate(reflection.date)}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {reflection.type === 'voice' ? (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        )}
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
              "Your thoughts matter. Your feelings are valid. You are heard." 🎵
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reflections;
import { useState } from 'react';
import { Calendar, Heart, Edit, Camera, Star, Ruler, AlertTriangle, Clock, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Baby {
  name: string;
  birthDate: string;
  preferences: string[];
  avatar?: string;
  milestones?: Milestone[];
  growthData?: GrowthEntry[];
  sensitivities?: Sensitivities;
}

interface Milestone {
  id: string;
  name: string;
  emoji: string;
  achieved: boolean;
  date?: string;
  note?: string;
}

interface GrowthEntry {
  date: string;
  weight?: number;
  height?: number;
  headCircumference?: number;
}

interface Sensitivities {
  allergies: string[];
  sleepTriggers: string[];
  feedingPreferences: string[];
}

const BabyProfile = () => {
  const [baby, setBaby] = useState<Baby | null>({
    name: 'Emma',
    birthDate: '2024-06-15',
    preferences: ['White noise', 'Gentle rocking', 'Warm baths'],
    avatar: '👶',
    milestones: [
      { id: '1', name: 'First smile', emoji: '😊', achieved: true, date: '2024-07-20', note: 'Such a precious moment!' },
      { id: '2', name: 'Rolled over', emoji: '🔄', achieved: false },
      { id: '3', name: 'First words', emoji: '🗣️', achieved: false },
      { id: '4', name: 'First steps', emoji: '👣', achieved: false },
      { id: '5', name: 'Started solids', emoji: '🥄', achieved: false },
      { id: '6', name: 'Slept through the night', emoji: '😴', achieved: false },
    ],
    growthData: [
      { date: '2024-06-15', weight: 3.2, height: 50, headCircumference: 34 },
      { date: '2024-07-15', weight: 4.1, height: 53, headCircumference: 36 },
    ],
    sensitivities: {
      allergies: [],
      sleepTriggers: ['Loud noises', 'Bright lights'],
      feedingPreferences: ['Warm bottle', 'Pacifier for soothing']
    }
  });
  
  const [newGrowthEntry, setNewGrowthEntry] = useState({ date: '', weight: '', height: '', headCircumference: '' });
  const [newAllergy, setNewAllergy] = useState('');
  const [newSleepTrigger, setNewSleepTrigger] = useState('');
  const [newFeedingPref, setNewFeedingPref] = useState('');
  
  const [isEditing, setIsEditing] = useState(!baby);
  const [editForm, setEditForm] = useState({
    name: baby?.name || '',
    birthDate: baby?.birthDate || '',
    preferences: baby?.preferences.join(', ') || ''
  });

  const toggleMilestone = (milestoneId: string, achieved: boolean) => {
    if (!baby) return;
    const updatedMilestones = baby.milestones?.map(m => 
      m.id === milestoneId 
        ? { ...m, achieved, date: achieved ? new Date().toISOString().split('T')[0] : undefined }
        : m
    );
    setBaby({ ...baby, milestones: updatedMilestones });
  };

  const updateMilestoneNote = (milestoneId: string, note: string) => {
    if (!baby) return;
    const updatedMilestones = baby.milestones?.map(m => 
      m.id === milestoneId ? { ...m, note } : m
    );
    setBaby({ ...baby, milestones: updatedMilestones });
  };

  const addGrowthEntry = () => {
    if (!baby || !newGrowthEntry.date) return;
    const entry: GrowthEntry = {
      date: newGrowthEntry.date,
      weight: newGrowthEntry.weight ? parseFloat(newGrowthEntry.weight) : undefined,
      height: newGrowthEntry.height ? parseFloat(newGrowthEntry.height) : undefined,
      headCircumference: newGrowthEntry.headCircumference ? parseFloat(newGrowthEntry.headCircumference) : undefined,
    };
    const updatedGrowthData = [...(baby.growthData || []), entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setBaby({ ...baby, growthData: updatedGrowthData });
    setNewGrowthEntry({ date: '', weight: '', height: '', headCircumference: '' });
  };

  const addSensitivityItem = (type: keyof Sensitivities, value: string) => {
    if (!baby || !value.trim()) return;
    const currentSensitivities = baby.sensitivities || { allergies: [], sleepTriggers: [], feedingPreferences: [] };
    const updatedSensitivities = {
      ...currentSensitivities,
      [type]: [...currentSensitivities[type], value.trim()]
    };
    setBaby({ ...baby, sensitivities: updatedSensitivities });
    
    if (type === 'allergies') setNewAllergy('');
    if (type === 'sleepTriggers') setNewSleepTrigger('');
    if (type === 'feedingPreferences') setNewFeedingPref('');
  };

  const removeSensitivityItem = (type: keyof Sensitivities, index: number) => {
    if (!baby) return;
    const currentSensitivities = baby.sensitivities || { allergies: [], sleepTriggers: [], feedingPreferences: [] };
    const updatedItems = currentSensitivities[type].filter((_, i) => i !== index);
    const updatedSensitivities = { ...currentSensitivities, [type]: updatedItems };
    setBaby({ ...baby, sensitivities: updatedSensitivities });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} days old`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} old`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} old`;
    }
  };

  const handleSave = () => {
    if (editForm.name && editForm.birthDate) {
      setBaby({
        name: editForm.name,
        birthDate: editForm.birthDate,
        preferences: editForm.preferences.split(',').map(p => p.trim()).filter(Boolean),
        avatar: baby?.avatar || '👶'
      });
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="pb-20 min-h-screen bg-gradient-comfort p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {baby ? 'Edit Baby Profile' : 'Create Baby Profile'}
          </h1>
          <p className="text-muted-foreground">
            Tell us about your little one so we can personalize your experience.
          </p>
        </div>

        <Card className="shadow-gentle border-none">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-nurture rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-gentle">
                👶
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Baby's Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter baby's name"
                  className="mt-1 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={editForm.birthDate}
                  onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="preferences">Comfort Preferences</Label>
                <Input
                  id="preferences"
                  value={editForm.preferences}
                  onChange={(e) => setEditForm({ ...editForm, preferences: e.target.value })}
                  placeholder="e.g., White noise, Gentle rocking, Warm baths"
                  className="mt-1 rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate with commas
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl"
                disabled={!baby}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 rounded-xl shadow-gentle"
                disabled={!editForm.name || !editForm.birthDate}
              >
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!baby) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-nurture p-6 rounded-b-3xl">
        <div className="text-center">
          <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-gentle">
            {baby.avatar}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{baby.name}</h1>
          <p className="text-muted-foreground">{calculateAge(baby.birthDate)}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Profile Details
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="rounded-xl"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
              <p className="font-medium">{baby.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Birth Date</Label>
              <p className="font-medium">{new Date(baby.birthDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Comfort Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {baby.preferences.map((pref, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary-soft text-primary-foreground rounded-full text-sm font-medium"
                >
                  {pref}
                </span>
              ))}
              {baby.preferences.length === 0 && (
                <p className="text-muted-foreground text-sm italic">
                  No preferences added yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Developmental Milestones */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Milestones ⭐
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {baby.milestones?.map((milestone) => (
              <div key={milestone.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={milestone.achieved}
                      onCheckedChange={(checked) => toggleMilestone(milestone.id, checked as boolean)}
                    />
                    <span className="text-lg">{milestone.emoji}</span>
                    <span className="font-medium">{milestone.name}</span>
                  </div>
                  {milestone.achieved && milestone.date && (
                    <Badge variant="secondary" className="text-xs">
                      {new Date(milestone.date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                {milestone.achieved && (
                  <Textarea
                    placeholder={`Add a note about ${milestone.name.toLowerCase()}...`}
                    value={milestone.note || ''}
                    onChange={(e) => updateMilestoneNote(milestone.id, e.target.value)}
                    className="ml-8 text-sm rounded-xl resize-none"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Tracker */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              Growth Tracker 📏
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="font-medium">Date</div>
              <div className="font-medium">Weight (kg)</div>
              <div className="font-medium">Height (cm)</div>
              <div className="font-medium">Head (cm)</div>
              
              {baby.growthData?.map((entry, index) => (
                <>
                  <div key={`${index}-date`} className="text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</div>
                  <div key={`${index}-weight`}>{entry.weight || '-'}</div>
                  <div key={`${index}-height`}>{entry.height || '-'}</div>
                  <div key={`${index}-head`}>{entry.headCircumference || '-'}</div>
                </>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <Label className="text-sm font-medium">Add new measurement</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={newGrowthEntry.date}
                  onChange={(e) => setNewGrowthEntry({ ...newGrowthEntry, date: e.target.value })}
                  className="rounded-xl text-sm"
                />
                <Input
                  placeholder="Weight (kg)"
                  value={newGrowthEntry.weight}
                  onChange={(e) => setNewGrowthEntry({ ...newGrowthEntry, weight: e.target.value })}
                  className="rounded-xl text-sm"
                />
                <Input
                  placeholder="Height (cm)"
                  value={newGrowthEntry.height}
                  onChange={(e) => setNewGrowthEntry({ ...newGrowthEntry, height: e.target.value })}
                  className="rounded-xl text-sm"
                />
                <Input
                  placeholder="Head circumference (cm)"
                  value={newGrowthEntry.headCircumference}
                  onChange={(e) => setNewGrowthEntry({ ...newGrowthEntry, headCircumference: e.target.value })}
                  className="rounded-xl text-sm"
                />
              </div>
              <Button onClick={addGrowthEntry} size="sm" className="rounded-xl">
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sensitivities & Needs */}
        <Card className="shadow-gentle border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Sensitivities & Needs 🧠
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Allergies */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Known allergies</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {baby.sensitivities?.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="cursor-pointer" onClick={() => removeSensitivityItem('allergies', index)}>
                    {allergy} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add allergy..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="rounded-xl text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addSensitivityItem('allergies', newAllergy)}
                />
                <Button size="sm" onClick={() => addSensitivityItem('allergies', newAllergy)} className="rounded-xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sleep Triggers */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sleep triggers</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {baby.sensitivities?.sleepTriggers.map((trigger, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSensitivityItem('sleepTriggers', index)}>
                    {trigger} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add sleep trigger..."
                  value={newSleepTrigger}
                  onChange={(e) => setNewSleepTrigger(e.target.value)}
                  className="rounded-xl text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addSensitivityItem('sleepTriggers', newSleepTrigger)}
                />
                <Button size="sm" onClick={() => addSensitivityItem('sleepTriggers', newSleepTrigger)} className="rounded-xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Feeding Preferences */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Feeding preferences</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {baby.sensitivities?.feedingPreferences.map((pref, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeSensitivityItem('feedingPreferences', index)}>
                    {pref} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add feeding preference..."
                  value={newFeedingPref}
                  onChange={(e) => setNewFeedingPref(e.target.value)}
                  className="rounded-xl text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addSensitivityItem('feedingPreferences', newFeedingPref)}
                />
                <Button size="sm" onClick={() => addSensitivityItem('feedingPreferences', newFeedingPref)} className="rounded-xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Routine Snapshot */}
        <Card className="shadow-gentle border-none bg-accent-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Daily Routine Snapshot 🗂
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-card p-3 rounded-xl">
                <div className="font-medium text-muted-foreground">Sleep Pattern</div>
                <div className="text-lg font-bold">2 naps/day</div>
              </div>
              <div className="bg-card p-3 rounded-xl">
                <div className="font-medium text-muted-foreground">Feeding</div>
                <div className="text-lg font-bold">Every 3 hours</div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-xl">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-primary mt-1" />
                <div>
                  <div className="font-medium mb-1">Pattern Insight</div>
                  <p className="text-sm text-muted-foreground">
                    Emma's longest stretch of sleep tends to happen after the evening feed. You might try gently extending the wind-down before this time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-none bg-accent-soft">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-accent-foreground">
              💝 Every baby is unique and beautiful in their own way
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BabyProfile;
import { useState } from 'react';
import { Calendar, Heart, Edit, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Baby {
  name: string;
  birthDate: string;
  preferences: string[];
  avatar?: string;
}

const BabyProfile = () => {
  const [baby, setBaby] = useState<Baby | null>({
    name: 'Emma',
    birthDate: '2024-06-15',
    preferences: ['White noise', 'Gentle rocking', 'Warm baths'],
    avatar: '👶'
  });
  
  const [isEditing, setIsEditing] = useState(!baby);
  const [editForm, setEditForm] = useState({
    name: baby?.name || '',
    birthDate: baby?.birthDate || '',
    preferences: baby?.preferences.join(', ') || ''
  });

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
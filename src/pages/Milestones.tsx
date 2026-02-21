import { useState, useEffect } from 'react';
import { Baby, Heart, Eye, Hand, MessageCircle as Speech, Brain, Footprints, Plus, Trash2, TrendingUp, Scale, Ruler, Circle, X, Edit3, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import koalaSittingImg from '@/assets/koala-sitting.png';
import koalaSleepImg from '@/assets/koala-sleep.png';
import koalaBottleImg from '@/assets/koala-bottle.png';
import koalaFeedingImg from '@/assets/koala-feeding.png';

// Cute koala illustrations between milestone categories at key ages
const MILESTONE_ILLUSTRATIONS: Record<number, { afterCategory: number; koala: string; caption: string }> = {
  0: { afterCategory: 1, koala: 'sleep', caption: 'So much sleeping in these early days � totally normal!' },
  2: { afterCategory: 3, koala: 'sitting', caption: 'Those first real smiles are everything!' },
  4: { afterCategory: 1, koala: 'sitting', caption: 'Reaching and grabbing everything in sight!' },
  5: { afterCategory: 1, koala: 'sitting', caption: 'Rolling over � first big move!' },
  6: { afterCategory: 1, koala: 'feeding', caption: 'Time for yummy first foods!' },
  8: { afterCategory: 1, koala: 'sitting', caption: 'On the move! Nothing is safe now!' },
  9: { afterCategory: 1, koala: 'bottle', caption: 'Pulling up and cruising � so brave!' },
  10: { afterCategory: 1, koala: 'sitting', caption: 'Nearly walking! What a superstar!' },
  12: { afterCategory: 1, koala: 'feeding', caption: 'First birthday! They grow so fast!' },
};

const getKoalaImage = (key: string) => {
  switch(key) {
    case 'sitting': return koalaSittingImg;
    case 'sleep': return koalaSleepImg;
    case 'bottle': return koalaBottleImg;
    case 'feeding': return koalaFeedingImg;
    default: return koalaSittingImg;
  }
};
// Storage keys
const GROWTH_LOG_KEY = 'nunu-growth-log';
const BABY_NAME_KEY = 'nunu-baby-name';
const BABY_BIRTHDATE_KEY = 'nunu-baby-birthdate';

interface GrowthEntry {
  id: string;
  date: string;
  weight?: number; // kg
  height?: number; // cm
  headCirc?: number; // cm
  notes?: string;
}

// Get local date string
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date for display
const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

interface MilestoneCategory {
  icon: React.ReactNode;
  title: string;
  milestones: string[];
}

interface AgeData {
  label: string;
  categories: MilestoneCategory[];
}

const MILESTONES_BY_AGE: Record<number, AgeData> = {
  0: {
    label: 'Newborn (0-1 month)',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Focuses on faces 8-12 inches away',
          'Prefers high contrast patterns',
          'Startles at loud sounds',
          'Recognises mother\'s voice and smell',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Reflexive grasp when palm is touched',
          'Moves arms and legs in jerky motions',
          'Can turn head side to side when on back',
          'Strong sucking reflex',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Cries to communicate needs',
          'Makes throaty sounds',
          'Quiets when picked up',
          'Alerts to sounds',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Prefers looking at faces',
          'Calms when comforted',
          'Beginning to develop attachment',
          'May have brief alert periods',
        ]
      },
    ]
  },
  1: {
    label: '1 Month',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Follows objects briefly with eyes',
          'Focuses on faces during feeding',
          'Prefers bold colours and patterns',
          'Turns toward familiar voices',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Lifts head briefly during tummy time',
          'Makes smoother arm movements',
          'Hands often in fists',
          'Brings hands to face',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Makes cooing sounds',
          'Different cries for different needs',
          'Quiets to familiar voice',
          'Begins to smile socially',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'First real smiles appearing',
          'Enjoys being held and cuddled',
          'Makes eye contact',
          'Shows preference for caregivers',
        ]
      },
    ]
  },
  2: {
    label: '2 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Tracks moving objects smoothly',
          'Recognises faces from farther away',
          'Begins to notice own hands',
          'Responds to different tones of voice',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Holds head up at 45 degrees in tummy time',
          'Opens and closes hands',
          'Brings hands together',
          'Pushes down with legs when feet on surface',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Coos and gurgles',
          'Makes vowel sounds (ah, eh, oh)',
          'Responds to speech with sounds',
          'Begins "conversations" with back-and-forth sounds',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Smiles at people spontaneously',
          'Enjoys playing with others',
          'May try to look at parents',
          'Shows excitement with arm and leg movements',
        ]
      },
    ]
  },
  3: {
    label: '3 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Watches faces intently',
          'Follows moving objects in full arc',
          'Recognises familiar objects and people',
          'Turns head toward sounds',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Lifts head and chest during tummy time',
          'Opens and shuts hands',
          'Swipes at dangling objects',
          'Supports upper body with arms when on tummy',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Babbles and coos expressively',
          'Imitates some sounds',
          'Begins to laugh',
          'Cries differently for different needs',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Smiles easily at familiar people',
          'Enjoys playing with others',
          'Communicates with facial expressions',
          'Imitates some facial expressions',
        ]
      },
    ]
  },
  4: {
    label: '4 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Eyes track in all directions',
          'Watches own hands with interest',
          'Colour vision developing fully',
          'Responds to affection',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Holds head steady without support',
          'Pushes up on elbows during tummy time',
          'Reaches for toys with one hand',
          'Brings objects to mouth',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Babbles with expression',
          'Laughs out loud',
          'Copies sounds they hear',
          'Cries in different ways for different needs',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Enjoys playing with people',
          'May cry when playing stops',
          'Smiles spontaneously at people',
          'Copies some movements and expressions',
        ]
      },
    ]
  },
  5: {
    label: '5 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Full colour vision',
          'Distinguishes between bold colours',
          'Likes to look at self in mirror',
          'Turns toward new sounds',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Rolls from tummy to back',
          'Sits with support',
          'Grasps objects firmly',
          'Transfers objects between hands',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Responds to own name',
          'Makes consonant sounds (b, m)',
          'Expresses joy and displeasure vocally',
          'Blows bubbles and raspberries',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Knows familiar faces',
          'Begins to show stranger awareness',
          'Loves to play with parents',
          'Responds to emotions of others',
        ]
      },
    ]
  },
  6: {
    label: '6 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Curious and looks around at things nearby',
          'Brings things to mouth to explore',
          'Shows curiosity about new things',
          'Likes looking at self in mirror',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Rolls both ways (tummy to back, back to tummy)',
          'Begins to sit without support',
          'Rocks back and forth on hands and knees',
          'Supports weight on legs when standing with support',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Responds to sounds by making sounds',
          'Strings vowels together when babbling',
          'Responds to own name',
          'Makes sounds to show joy and displeasure',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Knows familiar faces',
          'Likes to play with others, especially parents',
          'Responds to other people\'s emotions',
          'Enjoys looking at self in mirror',
        ]
      },
    ]
  },
  7: {
    label: '7 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Full depth perception developing',
          'Explores objects by shaking, banging',
          'Finds partially hidden objects',
          'Watches path of falling objects',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Sits without support confidently',
          'May begin crawling or scooting',
          'Uses raking grasp to pick up small objects',
          'Transfers objects easily hand to hand',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Babbles chains of consonants (mamama, bababa)',
          'Understands "no" by tone',
          'Uses voice to express emotions',
          'Responds when spoken to',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Stranger anxiety may appear',
          'May be clingy with familiar adults',
          'Has favourite toys',
          'Enjoys social games like peek-a-boo',
        ]
      },
    ]
  },
  8: {
    label: '8 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Looks for dropped or hidden objects',
          'Understands object permanence developing',
          'Points at objects of interest',
          'Explores textures and shapes',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Crawling or finding ways to move',
          'Pulls to stand holding furniture',
          'Developing pincer grasp',
          'Bangs objects together',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Understands simple words',
          'Says "mama" and "dada" (may not be specific)',
          'Copies gestures like waving',
          'Points to show interest',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Separation anxiety common',
          'May be shy around strangers',
          'Shows clear preferences for certain people',
          'Tests parental responses to behaviour',
        ]
      },
    ]
  },
  9: {
    label: '9 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Watches things fall with interest',
          'Looks for things they see you hide',
          'Plays peek-a-boo',
          'Points at things',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Stands holding on to furniture',
          'Can get into sitting position',
          'Crawls well',
          'Uses pincer grasp (thumb and finger)',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Understands "no"',
          'Copies sounds and gestures',
          'Uses fingers to point at things',
          'Makes many different sounds',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'May be afraid of strangers',
          'May be clingy with familiar adults',
          'Has favourite toys',
          'Understands what "no" means',
        ]
      },
    ]
  },
  10: {
    label: '10 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Finds hidden objects easily',
          'Explores cause and effect',
          'Interested in pictures in books',
          'Understands simple instructions',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Cruises along furniture',
          'Stands alone momentarily',
          'Puts objects in containers',
          'Pokes with index finger',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Uses mama/dada correctly',
          'Waves bye-bye',
          'Shakes head for "no"',
          'Tries to imitate words',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Plays games like pat-a-cake',
          'Shows moods clearly',
          'May test limits and boundaries',
          'Seeks approval and responds to praise',
        ]
      },
    ]
  },
  11: {
    label: '11 Months',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Vision & Senses',
        milestones: [
          'Follows simple directions',
          'Explores everything!',
          'Interested in cause and effect toys',
          'Looks at correct picture when named',
        ]
      },
      {
        icon: <Hand className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'May stand alone',
          'May take first steps',
          'Cruises confidently',
          'Stacks two blocks',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Says 1-3 words besides mama/dada',
          'Follows simple instructions',
          'Uses simple gestures (shaking head, waving)',
          'Babbles with inflection like real speech',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Helps with dressing (pushes arms through)',
          'Shows affection to familiar people',
          'May have favourite things and people',
          'Shows fear in some situations',
        ]
      },
    ]
  },
  12: {
    label: '12 Months (1 Year)',
    categories: [
      {
        icon: <Eye className="h-4 w-4" />,
        title: 'Cognitive',
        milestones: [
          'Explores things in different ways (shaking, banging, throwing)',
          'Finds hidden things easily',
          'Looks at right picture or thing when named',
          'Copies gestures',
        ]
      },
      {
        icon: <Footprints className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'May take a few steps without holding on',
          'Stands alone',
          'May walk holding furniture',
          'Drinks from cup, uses spoon with help',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Says "mama" and "dada" and exclamations like "uh-oh!"',
          'Tries to say words you say',
          'Responds to simple spoken requests',
          'Uses simple gestures',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Shy or nervous with strangers',
          'Cries when mum or dad leaves',
          'Has favourite things and people',
          'Hands you a book when wants to hear a story',
        ]
      },
    ]
  },
  15: {
    label: '15 Months',
    categories: [
      {
        icon: <Brain className="h-4 w-4" />,
        title: 'Cognitive',
        milestones: [
          'Knows what ordinary objects are for (phone, spoon)',
          'Points to get attention',
          'Shows interest in a doll or stuffed animal',
          'Points to one body part when asked',
        ]
      },
      {
        icon: <Footprints className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Walks alone',
          'May climb stairs with help',
          'Scribbles with crayon',
          'Stacks 2-3 blocks',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Says 3-6 words',
          'Tries to say new words',
          'Follows simple directions',
          'Points to show you something interesting',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Copies other children',
          'Shows you affection (hugs, kisses)',
          'Plays simple pretend',
          'May have temper tantrums',
        ]
      },
    ]
  },
  18: {
    label: '18 Months',
    categories: [
      {
        icon: <Brain className="h-4 w-4" />,
        title: 'Cognitive',
        milestones: [
          'Knows what ordinary things are for',
          'Points to get attention',
          'Shows interest in doll or stuffed animal by pretending to feed',
          'Points to one body part',
        ]
      },
      {
        icon: <Footprints className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Walks alone confidently',
          'May run',
          'Climbs onto and down from furniture',
          'Drinks from cup and eats with spoon',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Says several single words',
          'Says and shakes head "no"',
          'Points to show someone what they want',
          'Knows names of familiar people and body parts',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Likes to hand things to others as play',
          'May have temper tantrums',
          'May be afraid of strangers',
          'Shows affection to familiar people',
        ]
      },
    ]
  },
  24: {
    label: '24 Months (2 Years)',
    categories: [
      {
        icon: <Brain className="h-4 w-4" />,
        title: 'Cognitive',
        milestones: [
          'Finds things hidden under 2-3 covers',
          'Begins to sort shapes and colours',
          'Completes sentences in familiar books',
          'Plays simple make-believe games',
        ]
      },
      {
        icon: <Footprints className="h-4 w-4" />,
        title: 'Motor Skills',
        milestones: [
          'Stands on tiptoe',
          'Kicks a ball',
          'Begins to run',
          'Climbs onto and down from furniture without help',
        ]
      },
      {
        icon: <Speech className="h-4 w-4" />,
        title: 'Communication',
        milestones: [
          'Points to things in a book when asked',
          'Says sentences with 2-4 words',
          'Follows simple instructions',
          'Knows names of familiar people and body parts',
        ]
      },
      {
        icon: <Heart className="h-4 w-4" />,
        title: 'Social & Emotional',
        milestones: [
          'Copies others, especially adults',
          'Gets excited around other children',
          'Shows more independence',
          'Shows defiant behaviour (does what told not to)',
        ]
      },
    ]
  },
};

const Milestones = () => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'growth'>('milestones');
  const [selectedAge, setSelectedAge] = useState(6);
  const [babyName, setBabyName] = useState('');
  
  // Growth tracking state
  const [growthLogs, setGrowthLogs] = useState<GrowthEntry[]>(() => {
    try {
      const saved = localStorage.getItem(GROWTH_LOG_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newDate, setNewDate] = useState(getLocalDateString());
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newHeadCirc, setNewHeadCirc] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load baby name
  useEffect(() => {
    const name = localStorage.getItem(BABY_NAME_KEY);
    if (name) setBabyName(name);
  }, []);

  // Save growth logs
  useEffect(() => {
    localStorage.setItem(GROWTH_LOG_KEY, JSON.stringify(growthLogs));
  }, [growthLogs]);

  const ageOptions = [
    { value: 0, label: 'Newborn' },
    { value: 1, label: '1 month' },
    { value: 2, label: '2 months' },
    { value: 3, label: '3 months' },
    { value: 4, label: '4 months' },
    { value: 5, label: '5 months' },
    { value: 6, label: '6 months' },
    { value: 7, label: '7 months' },
    { value: 8, label: '8 months' },
    { value: 9, label: '9 months' },
    { value: 10, label: '10 months' },
    { value: 11, label: '11 months' },
    { value: 12, label: '12 months' },
    { value: 15, label: '15 months' },
    { value: 18, label: '18 months' },
    { value: 24, label: '24 months' },
  ];

  const currentMilestones = MILESTONES_BY_AGE[selectedAge] || MILESTONES_BY_AGE[6];

  // Growth tracking functions
  const saveGrowthEntry = () => {
    const weight = newWeight ? parseFloat(newWeight) : undefined;
    const height = newHeight ? parseFloat(newHeight) : undefined;
    const headCirc = newHeadCirc ? parseFloat(newHeadCirc) : undefined;
    
    if (!weight && !height && !headCirc) return;
    
    if (editingId) {
      setGrowthLogs(prev => prev.map(entry => 
        entry.id === editingId 
          ? { ...entry, date: newDate, weight, height, headCirc, notes: newNotes || undefined }
          : entry
      ));
      setEditingId(null);
    } else {
      const newEntry: GrowthEntry = {
        id: Date.now().toString(),
        date: newDate,
        weight,
        height,
        headCirc,
        notes: newNotes || undefined
      };
      setGrowthLogs(prev => [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    
    resetForm();
  };

  const resetForm = () => {
    setShowAddEntry(false);
    setNewDate(getLocalDateString());
    setNewWeight('');
    setNewHeight('');
    setNewHeadCirc('');
    setNewNotes('');
    setEditingId(null);
  };

  const editEntry = (entry: GrowthEntry) => {
    setEditingId(entry.id);
    setNewDate(entry.date);
    setNewWeight(entry.weight?.toString() || '');
    setNewHeight(entry.height?.toString() || '');
    setNewHeadCirc(entry.headCirc?.toString() || '');
    setNewNotes(entry.notes || '');
    setShowAddEntry(true);
  };

  const deleteEntry = (id: string) => {
    setGrowthLogs(prev => prev.filter(e => e.id !== id));
  };

  // Get latest measurements for summary
  const latestWeight = growthLogs.find(e => e.weight)?.weight;
  const latestHeight = growthLogs.find(e => e.height)?.height;
  const latestHeadCirc = growthLogs.find(e => e.headCirc)?.headCirc;

  // Calculate growth trends
  const getGrowthTrend = (metric: 'weight' | 'height' | 'headCirc') => {
    const entries = growthLogs.filter(e => e[metric]).slice(0, 2);
    if (entries.length < 2) return null;
    const diff = (entries[0][metric] as number) - (entries[1][metric] as number);
    return diff;
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Baby className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {babyName ? `${babyName}'s` : 'Baby'} Development
            </h1>
            <p className="text-slate-500 text-sm">Milestones & growth tracking</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-6 sticky top-0 z-10">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'milestones'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-slate-400'
            }`}
          >
            📋 Milestones
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'growth'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-slate-400'
            }`}
          >
            📈 Growth
          </button>
        </div>
      </div>

      {/* MILESTONES TAB */}
      {activeTab === 'milestones' && (
        <div className="px-6 py-4 space-y-4">
          {/* Age Selector */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <label className="text-sm text-slate-600 mb-2 block">Baby's age</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(Number(e.target.value))}
                className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-medium text-lg"
              >
                {ageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-none shadow-sm bg-amber-50">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800 leading-relaxed">
                💛 Every baby develops at their own pace. These milestones are general guidelines, 
                not a checklist. If you have concerns, chat with your health visitor or GP.
              </p>
            </CardContent>
          </Card>

          {/* Milestones */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 px-1">
              {currentMilestones.label}
            </h2>
            
            {currentMilestones.categories.map((category, index) => {
              const illustration = MILESTONE_ILLUSTRATIONS[selectedAge];
              const showIllustration = illustration && illustration.afterCategory === index;
              
              return (
                <div key={index}>
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          {category.icon}
                        </div>
                        <h3 className="font-medium text-slate-800">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.milestones.map((milestone, mIndex) => (
                          <li key={mIndex} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {showIllustration && (
                    <div className="flex items-center gap-3 py-3 px-2">
                      <div className="w-16 h-16 flex-shrink-0 animate-nunu-float rounded-2xl bg-purple-50 flex items-center justify-center overflow-hidden">
                        <img 
                          src={getKoalaImage(illustration.koala)} 
                          alt="" 
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm border border-purple-100/50">
                        <p className="text-sm text-purple-700 font-medium">{illustration.caption}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GROWTH TAB */}
      {activeTab === 'growth' && (
        <div className="px-6 py-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-none shadow-sm">
              <CardContent className="p-3 text-center">
                <Scale className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-800">
                  {latestWeight ? `${latestWeight} kg` : '—'}
                </div>
                <div className="text-xs text-slate-500">Weight</div>
                {getGrowthTrend('weight') !== null && (
                  <div className={`text-xs mt-1 ${getGrowthTrend('weight')! >= 0 ? 'text-emerald-500' : 'text-slate-1000'}`}>
                    {getGrowthTrend('weight')! >= 0 ? '+' : ''}{getGrowthTrend('weight')!.toFixed(2)} kg
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardContent className="p-3 text-center">
                <Ruler className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-800">
                  {latestHeight ? `${latestHeight} cm` : '—'}
                </div>
                <div className="text-xs text-slate-500">Height</div>
                {getGrowthTrend('height') !== null && (
                  <div className={`text-xs mt-1 ${getGrowthTrend('height')! >= 0 ? 'text-emerald-500' : 'text-slate-1000'}`}>
                    {getGrowthTrend('height')! >= 0 ? '+' : ''}{getGrowthTrend('height')!.toFixed(1)} cm
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardContent className="p-3 text-center">
                <Circle className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-800">
                  {latestHeadCirc ? `${latestHeadCirc} cm` : '—'}
                </div>
                <div className="text-xs text-slate-500">Head</div>
                {getGrowthTrend('headCirc') !== null && (
                  <div className={`text-xs mt-1 ${getGrowthTrend('headCirc')! >= 0 ? 'text-emerald-500' : 'text-slate-1000'}`}>
                    {getGrowthTrend('headCirc')! >= 0 ? '+' : ''}{getGrowthTrend('headCirc')!.toFixed(1)} cm
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Entry Button */}
          {!showAddEntry && (
            <Button 
              onClick={() => setShowAddEntry(true)}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Measurements
            </Button>
          )}

          {/* Add/Edit Form */}
          {showAddEntry && (
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">
                    {editingId ? 'Edit Entry' : 'New Entry'}
                  </h3>
                  <button onClick={resetForm} className="text-slate-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      max={getLocalDateString()}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Weight (kg)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        placeholder="e.g. 5.5"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Height (cm)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newHeight}
                        onChange={(e) => setNewHeight(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Head (cm)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newHeadCirc}
                        onChange={(e) => setNewHeadCirc(e.target.value)}
                        placeholder="e.g. 40"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Notes (optional)</label>
                    <Input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="e.g. Health visitor check-up"
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={saveGrowthEntry}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                    disabled={!newWeight && !newHeight && !newHeadCirc}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {editingId ? 'Save Changes' : 'Save Entry'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Growth History */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">History</h3>
            
            {growthLogs.length === 0 ? (
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400">No measurements logged yet</p>
                  <p className="text-slate-300 text-sm">Start tracking to see growth over time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {growthLogs.map((entry) => (
                  <Card key={entry.id} className="border-none shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-700 text-sm">
                            {formatDateDisplay(entry.date)}
                          </p>
                          <div className="flex gap-4 mt-1">
                            {entry.weight && (
                              <span className="text-xs text-slate-500">
                                <Scale className="h-3 w-3 inline mr-1 text-blue-400" />
                                {entry.weight} kg
                              </span>
                            )}
                            {entry.height && (
                              <span className="text-xs text-slate-500">
                                <Ruler className="h-3 w-3 inline mr-1 text-emerald-400" />
                                {entry.height} cm
                              </span>
                            )}
                            {entry.headCirc && (
                              <span className="text-xs text-slate-500">
                                <Circle className="h-3 w-3 inline mr-1 text-purple-400" />
                                {entry.headCirc} cm
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="text-xs text-slate-400 mt-1 italic">{entry.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => editEntry(entry)} className="p-1 text-slate-300 hover:text-slate-500">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteEntry(entry.id)} className="p-1 text-slate-300 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <Card className="border-none shadow-sm bg-purple-50">
            <CardContent className="p-4">
              <p className="text-sm text-purple-800 leading-relaxed">
                💜 Track measurements from health visitor check-ups or weigh-ins. 
                Growth patterns matter more than single readings — your health visitor 
                will use percentile charts to track progress over time.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Milestones;

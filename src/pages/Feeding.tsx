import { useState, useEffect, useRef } from 'react';
import { Search, X, AlertTriangle, ChevronLeft, Star, Clock, Bookmark, BookmarkCheck, Info, ChefHat, Snowflake, Users, MessageCircle, Sparkles, Send, Bot, User, Check, Trash2, Baby, Play, Pause, Square, Plus, Moon, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { foods, Food } from '@/data/foods';
import { recipes, Recipe, getRecipeCategories } from '@/data/recipes';

// Storage keys
const SAVED_FOODS_KEY = 'nunu-saved-foods';
const SAVED_RECIPES_KEY = 'nunu-saved-recipes';
const BABY_AGE_KEY = 'nunu-baby-age-months';
const RECIPE_CHAT_KEY = 'nunu-recipe-chat';
const CHAT_SAVED_KEY = 'nunu-chat-saved';
const FEEDING_LOG_KEY = 'nunu-feeding-log';
const LAST_BREAST_KEY = 'nunu-last-breast';

// Types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SavedRecipe {
  id: string;
  title: string;
  content: string;
  savedAt: number;
  conversationTitle: string;
}

interface FeedLog {
  id: string;
  type: 'left-breast' | 'right-breast' | 'bottle' | 'both-breasts';
  startTime: number;
  duration: number; // seconds
  notes: string;
  isNightFeed: boolean;
}

type AgeGroup = '6' | '7-8' | '9-12' | '12+';
type MainTab = 'solids' | 'nursing';
type SolidsSubTab = 'foods' | 'recipes' | 'saved';

// Simple markdown renderer
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = line;
    let keyCounter = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index));
        parts.push(<strong key={`b-${lineIndex}-${keyCounter++}`} className="font-semibold">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }
    return (
      <span key={`line-${lineIndex}`}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

// Extract recipe title
const extractRecipeTitle = (content: string): string => {
  const lines = content.split('\n').filter(l => l.trim());
  for (const line of lines) {
    const headerMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headerMatch) return headerMatch[1].replace(/\*+/g, '').trim().slice(0, 50);
  }
  for (const line of lines.slice(0, 3)) {
    const boldMatch = line.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) return boldMatch[1].trim().slice(0, 50);
  }
  return content.slice(0, 40).replace(/\n/g, ' ').trim() + '...';
};

// Foods with cutting guides
const FOODS_WITH_GUIDES = [
  'banana', 'avocado', 'broccoli', 'grapes', 'carrot',
  'strawberry', 'blueberry', 'sweet-potato', 'apple',
  'mango', 'peach', 'pear', 'cucumber', 'toast', 'egg'
];

// Format duration
const formatFeedDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

// Check if night feed (between 8pm and 6am)
const isNightFeed = (timestamp: number): boolean => {
  const hour = new Date(timestamp).getHours();
  return hour >= 20 || hour < 6;
};

// Get local date string
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Feeding = () => {
  // Main tab state
  const [activeTab, setActiveTab] = useState<MainTab>('solids');
  const [solidsSubTab, setSolidsSubTab] = useState<SolidsSubTab>('foods');
  
  // ========== NURSING STATE ==========
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(() => {
    try {
      const saved = localStorage.getItem(FEEDING_LOG_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [lastBreast, setLastBreast] = useState<'left' | 'right' | null>(() => {
    try {
      return localStorage.getItem(LAST_BREAST_KEY) as 'left' | 'right' | null;
    } catch { return null; }
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [selectedFeedType, setSelectedFeedType] = useState<'left-breast' | 'right-breast' | 'bottle' | 'both-breasts' | null>(null);
  const [feedNotes, setFeedNotes] = useState('');
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [quickLogMinutes, setQuickLogMinutes] = useState('');
  const [quickLogType, setQuickLogType] = useState<'left-breast' | 'right-breast' | 'bottle' | 'both-breasts'>('left-breast');
  
  // ========== SOLIDS STATE ==========
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('6');
  const [savedFoods, setSavedFoods] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [babyAge, setBabyAge] = useState<number>(6);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Recipe chat state
  const [showRecipeChat, setShowRecipeChat] = useState(false);
  const [recipeChatMessages, setRecipeChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(RECIPE_CHAT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [recipeChatInput, setRecipeChatInput] = useState('');
  const [isRecipeChatTyping, setIsRecipeChatTyping] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(CHAT_SAVED_KEY);
      if (saved) {
        const recipes: SavedRecipe[] = JSON.parse(saved);
        return new Set(recipes.map(r => r.id));
      }
    } catch {}
    return new Set();
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Saved recipes state
  const [savedChatRecipes, setSavedChatRecipes] = useState<SavedRecipe[]>([]);
  const [expandedSavedId, setExpandedSavedId] = useState<string | null>(null);
  
  // ========== EFFECTS ==========
  
  // Save feed logs
  useEffect(() => {
    localStorage.setItem(FEEDING_LOG_KEY, JSON.stringify(feedLogs));
  }, [feedLogs]);
  
  // Save last breast
  useEffect(() => {
    if (lastBreast) {
      localStorage.setItem(LAST_BREAST_KEY, lastBreast);
    }
  }, [lastBreast]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  
  // Load baby age
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BABY_AGE_KEY);
      if (saved) {
        const age = parseInt(saved);
        setBabyAge(age);
        if (age < 7) setSelectedAge('6');
        else if (age < 9) setSelectedAge('7-8');
        else if (age < 12) setSelectedAge('9-12');
        else setSelectedAge('12+');
      }
    } catch {}
  }, []);
  
  // Load saved foods/recipes
  useEffect(() => {
    try {
      const savedF = localStorage.getItem(SAVED_FOODS_KEY);
      const savedR = localStorage.getItem(SAVED_RECIPES_KEY);
      if (savedF) setSavedFoods(JSON.parse(savedF));
      if (savedR) setSavedRecipes(JSON.parse(savedR));
    } catch {}
  }, []);
  
  // Load saved chat recipes
  useEffect(() => {
    if (activeTab === 'solids' && solidsSubTab === 'saved') {
      try {
        const saved = localStorage.getItem(CHAT_SAVED_KEY);
        if (saved) setSavedChatRecipes(JSON.parse(saved));
      } catch {}
    }
  }, [activeTab, solidsSubTab]);
  
  // Save recipe chat
  useEffect(() => {
    if (recipeChatMessages.length > 0) {
      localStorage.setItem(RECIPE_CHAT_KEY, JSON.stringify(recipeChatMessages));
    }
  }, [recipeChatMessages]);
  
  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [recipeChatMessages, isRecipeChatTyping]);
  
  // ========== NURSING FUNCTIONS ==========
  
  const startTimer = (type: 'left-breast' | 'right-breast' | 'bottle' | 'both-breasts') => {
    setSelectedFeedType(type);
    setTimerStartTime(Date.now());
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };
  
  const pauseTimer = () => {
    setIsTimerRunning(false);
  };
  
  const resumeTimer = () => {
    setIsTimerRunning(true);
  };
  
  const stopAndSave = () => {
    if (selectedFeedType && timerStartTime) {
      const newLog: FeedLog = {
        id: Date.now().toString(),
        type: selectedFeedType,
        startTime: timerStartTime,
        duration: timerSeconds,
        notes: feedNotes,
        isNightFeed: isNightFeed(timerStartTime)
      };
      setFeedLogs(prev => [newLog, ...prev].slice(0, 100));
      
      // Update last breast
      if (selectedFeedType === 'left-breast') setLastBreast('left');
      else if (selectedFeedType === 'right-breast') setLastBreast('right');
      else if (selectedFeedType === 'both-breasts') setLastBreast('right'); // ended on right
    }
    
    // Reset
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);
    setSelectedFeedType(null);
    setFeedNotes('');
  };
  
  const cancelTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);
    setSelectedFeedType(null);
    setFeedNotes('');
  };
  
  const saveQuickLog = () => {
    const mins = parseInt(quickLogMinutes);
    if (isNaN(mins) || mins <= 0) return;
    
    const now = Date.now();
    const newLog: FeedLog = {
      id: now.toString(),
      type: quickLogType,
      startTime: now - (mins * 60 * 1000),
      duration: mins * 60,
      notes: '',
      isNightFeed: isNightFeed(now)
    };
    setFeedLogs(prev => [newLog, ...prev].slice(0, 100));
    
    if (quickLogType === 'left-breast') setLastBreast('left');
    else if (quickLogType === 'right-breast') setLastBreast('right');
    
    setShowQuickLog(false);
    setQuickLogMinutes('');
  };
  
  const deleteFeedLog = (id: string) => {
    setFeedLogs(prev => prev.filter(f => f.id !== id));
  };
  
  // Get today's feeds
  const today = getLocalDateString();
  const todayFeeds = feedLogs.filter(f => {
    const feedDate = getLocalDateString(new Date(f.startTime));
    return feedDate === today;
  });
  
  const todayTotalMinutes = Math.round(todayFeeds.reduce((acc, f) => acc + f.duration, 0) / 60);
  const todayNightFeeds = todayFeeds.filter(f => f.isNightFeed).length;
  
  // Suggested next breast
  const suggestedBreast = lastBreast === 'left' ? 'right' : 'left';
  
  // ========== SOLIDS FUNCTIONS ==========
  
  const toggleSavedFood = (foodId: string) => {
    setSavedFoods(prev => {
      const newSaved = prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId];
      localStorage.setItem(SAVED_FOODS_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };
  
  const toggleSavedRecipe = (recipeId: string) => {
    setSavedRecipes(prev => {
      const newSaved = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };
  
  const sendRecipeChatMessage = async () => {
    if (!recipeChatInput.trim() || isRecipeChatTyping) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: recipeChatInput.trim(),
      timestamp: new Date().toISOString()
    };
    
    setRecipeChatMessages(prev => [...prev, userMessage]);
    setRecipeChatInput('');
    setIsRecipeChatTyping(true);
    
    try {
      const response = await fetch('/api/recipe-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...recipeChatMessages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          babyAgeMonths: babyAge
        })
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };
      
      setRecipeChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString()
      };
      setRecipeChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsRecipeChatTyping(false);
    }
  };
  
  const saveRecipeFromChat = (message: ChatMessage) => {
    const newSaved: SavedRecipe = {
      id: message.id,
      title: extractRecipeTitle(message.content),
      content: message.content,
      savedAt: Date.now(),
      conversationTitle: 'Recipe Chat'
    };
    
    try {
      const existing = localStorage.getItem(CHAT_SAVED_KEY);
      const recipes: SavedRecipe[] = existing ? JSON.parse(existing) : [];
      recipes.unshift(newSaved);
      localStorage.setItem(CHAT_SAVED_KEY, JSON.stringify(recipes.slice(0, 50)));
      setSavedRecipeIds(prev => new Set([...prev, message.id]));
    } catch {}
  };
  
  const unsaveRecipeFromChat = (messageId: string) => {
    try {
      const existing = localStorage.getItem(CHAT_SAVED_KEY);
      if (existing) {
        const recipes: SavedRecipe[] = JSON.parse(existing);
        const filtered = recipes.filter(r => r.id !== messageId);
        localStorage.setItem(CHAT_SAVED_KEY, JSON.stringify(filtered));
        setSavedRecipeIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
        setSavedChatRecipes(filtered);
      }
    } catch {}
  };
  
  const clearRecipeChat = () => {
    setRecipeChatMessages([]);
    localStorage.removeItem(RECIPE_CHAT_KEY);
  };
  
  // Filter foods/recipes
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  const recipeCategories = getRecipeCategories();
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ========== RENDER ==========
  
  // Food detail view
  if (selectedFood) {
    const isSaved = savedFoods.includes(selectedFood.id);
    
    return (
      <div className="pb-24 min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-100 p-4 sticky top-0 z-10">
          <button onClick={() => setSelectedFood(null)} className="flex items-center gap-2 text-slate-600">
            <ChevronLeft className="h-5 w-5" />
            <span>Back to foods</span>
          </button>
        </div>
        
        {/* Food Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={selectedFood.image} 
            alt={selectedFood.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {selectedFood.category}
              </span>
              {selectedFood.allergen && (
                <span className="bg-amber-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Allergen
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white">{selectedFood.name}</h1>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Age selector */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">How to serve at each age:</p>
            <div className="flex gap-2">
              {(['6', '7-8', '9-12', '12+'] as AgeGroup[]).map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedAge === age
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {age === '12+' ? '12+ mo' : `${age} mo`}
                </button>
              ))}
            </div>
          </div>
          
          {/* Serving Guide */}
          <Card className="border-none shadow-sm bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{selectedFood.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    At {selectedAge === '12+' ? '12+ months' : `${selectedAge} months`}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedFood.serving[selectedAge]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Allergen Warning */}
          {selectedFood.allergen && (
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 text-sm">Allergen Information</p>
                    <p className="text-blue-700 text-sm mt-1">
                      This is a common allergen. Introduce early (around 6 months) and continue serving 
                      regularly. Watch for reactions and consult your doctor if you have concerns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Tips */}
          {selectedFood.tips && selectedFood.tips.length > 0 && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-slate-1000" />
                  Tips
                </h3>
                <ul className="space-y-2">
                  {selectedFood.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <span className="text-slate-300 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Warnings */}
          {selectedFood.warnings && selectedFood.warnings.length > 0 && (
            <Card className="border-none shadow-sm bg-rose-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-rose-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Important
                </h3>
                <ul className="space-y-2">
                  {selectedFood.warnings.map((warning, i) => (
                    <li key={i} className="text-rose-700 text-sm">
                      {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          <Button
            onClick={() => toggleSavedFood(selectedFood.id)}
            variant={isSaved ? "default" : "outline"}
            className="w-full"
          >
            {isSaved ? (
              <><BookmarkCheck className="h-4 w-4 mr-2" /> Saved</>
            ) : (
              <><Bookmark className="h-4 w-4 mr-2" /> Save for later</>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  // Recipe detail view
  if (selectedRecipe) {
    const isSaved = savedRecipes.includes(selectedRecipe.id);
    const totalTime = selectedRecipe.prepTime + selectedRecipe.cookTime;
    
    return (
      <div className="pb-24 min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-between">
          <button onClick={() => setSelectedRecipe(null)} className="flex items-center gap-2 text-slate-600">
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button onClick={() => toggleSavedRecipe(selectedRecipe.id)}>
            {isSaved ? (
              <BookmarkCheck className="h-6 w-6 text-orange-500 fill-orange-500" />
            ) : (
              <Bookmark className="h-6 w-6 text-slate-400" />
            )}
          </button>
        </div>
        
        {/* Recipe Header */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">{selectedRecipe.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedRecipe.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full capitalize">
                  {selectedRecipe.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {selectedRecipe.ageRange} months
                </span>
                {selectedRecipe.freezable && (
                  <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Snowflake className="h-3 w-3" />
                    Freezable
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="flex justify-around py-4 bg-white border-b">
          <div className="text-center">
            <Clock className="h-5 w-5 mx-auto text-orange-500 mb-1" />
            <p className="text-xs text-slate-500">Prep</p>
            <p className="font-semibold text-slate-800">{selectedRecipe.prepTime} min</p>
          </div>
          <div className="text-center">
            <ChefHat className="h-5 w-5 mx-auto text-orange-500 mb-1" />
            <p className="text-xs text-slate-500">Cook</p>
            <p className="font-semibold text-slate-800">{selectedRecipe.cookTime} min</p>
          </div>
          <div className="text-center">
            <Users className="h-5 w-5 mx-auto text-orange-500 mb-1" />
            <p className="text-xs text-slate-500">Servings</p>
            <p className="font-semibold text-slate-800">{selectedRecipe.servings}</p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Allergens Warning */}
          {selectedRecipe.allergens && selectedRecipe.allergens.length > 0 && (
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Contains: </span>
                    {selectedRecipe.allergens.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Nutrition Highlights */}
          {selectedRecipe.nutritionHighlights && selectedRecipe.nutritionHighlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.nutritionHighlights.map((nutrient, i) => (
                <span key={i} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  ✓ {nutrient}
                </span>
              ))}
            </div>
          )}
          
          {/* Ingredients */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-800 mb-3 text-lg">Ingredients</h3>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-lg">Instructions</h3>
            <div className="space-y-3">
              {selectedRecipe.instructions.map((step, i) => (
                <Card key={i} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{i + 1}</span>
                      </div>
                      <p className="text-slate-700 pt-0.5">{step}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-500" />
                Tips
              </h3>
              <ul className="space-y-2">
                {selectedRecipe.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="text-orange-400 mt-1">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Recipe chat view
  if (showRecipeChat) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col bg-orange-50">
        {/* Header */}
        <div className="bg-white border-b border-orange-100 p-4 flex items-center justify-between">
          <button onClick={() => setShowRecipeChat(false)} className="flex items-center gap-2 text-slate-600">
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-slate-800">Recipe Ideas</span>
          </div>
          {recipeChatMessages.length > 0 && (
            <button onClick={clearRecipeChat} className="text-slate-400 text-sm">Clear</button>
          )}
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recipeChatMessages.length === 0 && (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-orange-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">What should we make?</p>
              <p className="text-slate-400 text-sm mt-1">Ask for recipe ideas based on what you have!</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Quick breakfast ideas', 'Iron-rich recipes', 'Finger food ideas'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setRecipeChatInput(prompt)}
                    className="px-3 py-1.5 bg-white border border-orange-200 rounded-full text-sm text-orange-600 hover:bg-orange-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {recipeChatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                <div className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-orange-500 text-white rounded-br-md' 
                    : 'bg-white text-slate-700 rounded-bl-md shadow-sm'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{renderMarkdown(msg.content)}</div>
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => savedRecipeIds.has(msg.id) ? unsaveRecipeFromChat(msg.id) : saveRecipeFromChat(msg)}
                    className={`mt-1 text-xs flex items-center gap-1 ${
                      savedRecipeIds.has(msg.id) ? 'text-orange-500' : 'text-slate-400'
                    }`}
                  >
                    {savedRecipeIds.has(msg.id) ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
                    {savedRecipeIds.has(msg.id) ? 'Saved' : 'Save recipe'}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isRecipeChatTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        {/* Input */}
        <div className="bg-white border-t border-orange-100 p-4">
          <div className="flex gap-2">
            <Input
              value={recipeChatInput}
              onChange={(e) => setRecipeChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendRecipeChatMessage()}
              placeholder="Ask for recipe ideas..."
              className="flex-1 border-orange-200 focus:border-orange-400"
            />
            <Button onClick={sendRecipeChatMessage} disabled={!recipeChatInput.trim() || isRecipeChatTyping} className="bg-orange-500 hover:bg-orange-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Feeding</h1>
        <p className="text-slate-500 text-sm">Track nursing & explore solids</p>
      </div>
      
      {/* Main tabs: Solids | Nursing */}
      <div className="bg-white border-b border-slate-100 px-4 sticky top-0 z-10">
        <div className="flex gap-1">
          {[
            { id: 'solids', label: '🥄 Solids', color: 'orange' },
            { id: 'nursing', label: '🤱 Nursing', color: 'pink' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainTab)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? tab.id === 'solids'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-pink-500 text-pink-600'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* ========== NURSING TAB ========== */}
      {activeTab === 'nursing' && (
        <div className="p-4 space-y-4">
          {/* Active timer */}
          {selectedFeedType && (
            <Card className="border-none shadow-md bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <p className="text-pink-100 text-sm mb-1">
                    {selectedFeedType === 'left-breast' ? '👈 Left breast' : 
                     selectedFeedType === 'right-breast' ? '👉 Right breast' : 
                     selectedFeedType === 'both-breasts' ? '👐 Both breasts' : '🍼 Bottle'}
                  </p>
                  <div className="text-5xl font-bold font-mono">
                    {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                
                <div className="flex justify-center gap-3 mb-4">
                  {isTimerRunning ? (
                    <Button onClick={pauseTimer} variant="secondary" size="lg" className="rounded-full">
                      <Pause className="h-5 w-5 mr-2" /> Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeTimer} variant="secondary" size="lg" className="rounded-full">
                      <Play className="h-5 w-5 mr-2" /> Resume
                    </Button>
                  )}
                  <Button onClick={stopAndSave} variant="secondary" size="lg" className="rounded-full bg-white text-pink-600">
                    <Square className="h-5 w-5 mr-2" /> Done
                  </Button>
                </div>
                
                <Input
                  value={feedNotes}
                  onChange={(e) => setFeedNotes(e.target.value)}
                  placeholder="Notes (optional)..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-pink-200"
                />
                
                <button onClick={cancelTimer} className="w-full text-pink-200 text-sm mt-3">
                  Cancel
                </button>
              </CardContent>
            </Card>
          )}
          
          {/* Quick start buttons */}
          {!selectedFeedType && (
            <>
              {lastBreast && (
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-pink-800 text-sm font-medium">Next feed suggestion</p>
                    <p className="text-pink-600 text-xs">Last feed was {lastBreast} breast</p>
                  </div>
                  <Button 
                    onClick={() => startTimer(suggestedBreast === 'left' ? 'left-breast' : 'right-breast')}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Start {suggestedBreast} 👆
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => startTimer('left-breast')}
                  className="p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-pink-300 transition-colors text-center"
                >
                  <span className="text-3xl block mb-1">👈</span>
                  <span className="font-medium text-slate-700">Left breast</span>
                </button>
                <button
                  onClick={() => startTimer('right-breast')}
                  className="p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-pink-300 transition-colors text-center"
                >
                  <span className="text-3xl block mb-1">👉</span>
                  <span className="font-medium text-slate-700">Right breast</span>
                </button>
                <button
                  onClick={() => startTimer('both-breasts')}
                  className="p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-pink-300 transition-colors text-center"
                >
                  <span className="text-3xl block mb-1">👐</span>
                  <span className="font-medium text-slate-700">Both</span>
                </button>
                <button
                  onClick={() => startTimer('bottle')}
                  className="p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-pink-300 transition-colors text-center"
                >
                  <span className="text-3xl block mb-1">🍼</span>
                  <span className="font-medium text-slate-700">Bottle</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowQuickLog(true)}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-pink-300 hover:text-pink-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Quick log past feed
              </button>
            </>
          )}
          
          {/* Quick log modal */}
          {showQuickLog && (
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Log a past feed</h3>
                  <button onClick={() => setShowQuickLog(false)} className="text-slate-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'left-breast', emoji: '👈', label: 'L' },
                        { id: 'right-breast', emoji: '👉', label: 'R' },
                        { id: 'both-breasts', emoji: '👐', label: 'Both' },
                        { id: 'bottle', emoji: '🍼', label: 'Bottle' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setQuickLogType(type.id as any)}
                          className={`p-2 rounded-lg border-2 text-center transition-colors ${
                            quickLogType === type.id 
                              ? 'border-pink-500 bg-pink-50' 
                              : 'border-slate-200'
                          }`}
                        >
                          <span className="text-xl">{type.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={quickLogMinutes}
                      onChange={(e) => setQuickLogMinutes(e.target.value)}
                      placeholder="e.g. 15"
                      className="text-lg"
                    />
                  </div>
                  
                  <Button onClick={saveQuickLog} className="w-full bg-pink-500 hover:bg-pink-600" disabled={!quickLogMinutes}>
                    Save feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Today's summary */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Today's feeds</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{todayFeeds.length}</div>
                  <div className="text-xs text-slate-500">Feeds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{todayTotalMinutes}m</div>
                  <div className="text-xs text-slate-500">Total time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{todayNightFeeds}</div>
                  <div className="text-xs text-slate-500">Night feeds</div>
                </div>
              </div>
              
              {todayFeeds.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No feeds logged today</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {todayFeeds.map((feed) => (
                    <div key={feed.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <span className="text-xl">
                        {feed.type === 'left-breast' ? '👈' : 
                         feed.type === 'right-breast' ? '👉' : 
                         feed.type === 'both-breasts' ? '👐' : '🍼'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            {formatFeedDuration(feed.duration)}
                          </span>
                          {feed.isNightFeed && (
                            <Moon className="h-3 w-3 text-indigo-400" />
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(feed.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <button onClick={() => deleteFeedLog(feed.id)} className="text-slate-300 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* ========== SOLIDS TAB ========== */}
      {activeTab === 'solids' && (
        <div className="p-4 space-y-3">
          {/* Sub-tabs Row 1: Food & Recipes | Saved */}
          <div className="flex gap-2">
            <button
              onClick={() => setSolidsSubTab('foods')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                solidsSubTab === 'foods' || solidsSubTab === 'recipes' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              🥕 Food & Recipes
            </button>
            <button
              onClick={() => setSolidsSubTab('saved')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                solidsSubTab === 'saved' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Bookmark className="h-4 w-4" /> Saved
              {savedChatRecipes.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  solidsSubTab === 'saved' ? 'bg-rose-400' : 'bg-rose-100 text-rose-600'
                }`}>{savedChatRecipes.length}</span>
              )}
            </button>
          </div>
          
          {/* Row 2: Ideas Button */}
          <button
            onClick={() => setShowRecipeChat(true)}
            className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Get Recipe Ideas from Nunu
          </button>
          
          {/* Food/Recipes toggle (only show when not in Saved) */}
          {(solidsSubTab === 'foods' || solidsSubTab === 'recipes') && (
            <div className="flex gap-2 bg-orange-100/50 p-1 rounded-lg">
              <button
                onClick={() => setSolidsSubTab('foods')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  solidsSubTab === 'foods' ? 'bg-orange-500 text-white shadow-sm' : 'text-orange-700'
                }`}
              >
                Foods
              </button>
              <button
                onClick={() => setSolidsSubTab('recipes')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  solidsSubTab === 'recipes' ? 'bg-orange-500 text-white shadow-sm' : 'text-orange-700'
                }`}
              >
                Recipes
              </button>
            </div>
          )}
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={solidsSubTab === 'foods' ? "Search foods..." : "Search recipes..."}
              className="pl-10"
            />
          </div>
          
          {/* Foods list */}
          {solidsSubTab === 'foods' && (
            <div className="grid grid-cols-3 gap-3">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="p-3 bg-white rounded-xl border border-slate-100 hover:border-orange-200 transition-colors text-center"
                >
                  <span className="text-3xl block mb-1">{food.emoji}</span>
                  <span className="text-xs text-slate-600 line-clamp-1">{food.name}</span>
                  {savedFoods.includes(food.id) && (
                    <BookmarkCheck className="h-3 w-3 text-orange-500 mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          )}
          
          {/* Recipes list */}
          {solidsSubTab === 'recipes' && (
            <>
              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === 'All' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-slate-600'
                  }`}
                >
                  All
                </button>
                {recipeCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                      selectedCategory === cat.name 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-slate-600'
                    }`}
                  >
                    {cat.emoji} {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full p-3 bg-white rounded-xl border border-slate-100 hover:border-orange-200 transition-colors text-left flex items-center gap-3"
                  >
                    <span className="text-3xl">{recipe.emoji}</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-700">{recipe.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.prepTime + recipe.cookTime} min
                        </span>
                        {recipe.freezable && (
                          <span className="flex items-center gap-1 text-blue-400">
                            <Snowflake className="h-3 w-3" />
                            Freezable
                          </span>
                        )}
                      </div>
                    </div>
                    {savedRecipes.includes(recipe.id) && (
                      <BookmarkCheck className="h-4 w-4 text-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
          
          {/* ========== SAVED (within Solids) ========== */}
          {/* Saved section */}
          {solidsSubTab === 'saved' && (
            <div className="space-y-4">
              {/* Saved foods */}
              {savedFoods.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Saved Foods</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {foods.filter(f => savedFoods.includes(f.id)).map((food) => (
                      <button
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className="p-2 bg-white rounded-xl text-center"
                      >
                        <span className="text-2xl">{food.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Saved recipes from library */}
              {savedRecipes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Saved Recipes</h3>
                  <div className="space-y-2">
                    {recipes.filter(r => savedRecipes.includes(r.id)).map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="w-full p-3 bg-white rounded-xl text-left flex items-center gap-3"
                      >
                        <span className="text-2xl">{recipe.emoji}</span>
                        <span className="font-medium text-slate-700">{recipe.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Saved from chat */}
              {savedChatRecipes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Saved from Chat</h3>
                  <div className="space-y-2">
                    {savedChatRecipes.map((recipe) => (
                      <Card key={recipe.id} className="border-none shadow-sm">
                        <CardContent className="p-3">
                          <button
                            onClick={() => setExpandedSavedId(expandedSavedId === recipe.id ? null : recipe.id)}
                            className="w-full flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <ChefHat className="h-4 w-4 text-orange-500" />
                              <span className="font-medium text-slate-700">{recipe.title}</span>
                            </div>
                            <ChevronLeft className={`h-4 w-4 text-slate-400 transition-transform ${expandedSavedId === recipe.id ? '-rotate-90' : ''}`} />
                          </button>
                          
                          {expandedSavedId === recipe.id && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <div className="text-sm text-slate-600 whitespace-pre-wrap">
                                {renderMarkdown(recipe.content)}
                              </div>
                              <button
                                onClick={() => unsaveRecipeFromChat(recipe.id)}
                                className="mt-2 text-xs text-red-400 flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" /> Remove
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {savedFoods.length === 0 && savedRecipes.length === 0 && savedChatRecipes.length === 0 && (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400">No saved items yet</p>
                  <p className="text-slate-300 text-sm">Save foods and recipes to find them here</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feeding;

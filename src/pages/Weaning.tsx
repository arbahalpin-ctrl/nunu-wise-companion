import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, AlertTriangle, ChevronLeft, Star, Clock, Bookmark, BookmarkCheck, Info, ChefHat, Snowflake, Users, MessageCircle, Sparkles, Send, Bot, User, Check, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { foods, Food } from '@/data/foods';
import { recipes, Recipe, getRecipeCategories } from '@/data/recipes';
import { useAuth } from '@/contexts/AuthContext';
import { recipesService } from '@/lib/database';
import { supabase } from '@/lib/supabase';

const SAVED_FOODS_KEY = 'nunu-saved-foods';
const SAVED_RECIPES_KEY = 'nunu-saved-recipes';

// Simple markdown renderer for chat messages
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = line;
    let keyCounter = 0;
    
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
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
const BABY_AGE_KEY = 'nunu-baby-age-months';
const RECIPE_CHAT_KEY = 'nunu-recipe-chat';
const CHAT_SAVED_KEY = 'nunu-chat-saved';

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

// Extract recipe title from content
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
  
  const recipePatterns = [
    /(?:recipe|dish|meal):\s*(.+)/i,
    /(?:here's|try|make)\s+(?:a\s+)?(?:simple\s+)?(.+?(?:puree|mash|porridge|fingers|bites|pancakes|muffins|soup|stew))/i,
  ];
  
  for (const pattern of recipePatterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim().slice(0, 50);
  }
  
  const firstLine = lines[0]?.replace(/[\*#]/g, '').trim();
  if (firstLine && firstLine.length <= 60 && !firstLine.includes('.')) {
    return firstLine.slice(0, 50);
  }
  
  return content.slice(0, 40).replace(/\n/g, ' ').trim() + '...';
};

type AgeGroup = '6' | '7-8' | '9-12' | '12+';

// Foods with cutting guide infographics
const FOODS_WITH_GUIDES = [
  'banana', 'avocado', 'broccoli', 'grapes', 'carrot',
  'strawberry', 'blueberry', 'sweet-potato', 'apple',
  'egg', 'chicken', 'peas', 'tomato', 'cheese',
  'peanut-butter', 'salmon', 'mango', 'pasta', 'bread', 'yogurt'
];

// Cutting Guide Component - shows single infographic per food
const CuttingGuide = ({ foodId }: { foodId: string }) => {
  const hasGuide = FOODS_WITH_GUIDES.includes(foodId);
  
  if (!hasGuide) {
    return (
      <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
        <p className="text-slate-400 text-sm">
          Visual guide coming soon
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-4 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
      <img 
        src={`/food-guides/${foodId}.svg`}
        alt={`How to cut ${foodId} for babies`}
        className="w-full object-contain"
      />
    </div>
  );
};

interface WeaningProps {
  onOpenChat?: () => void;
}

const Weaning = ({ onOpenChat }: WeaningProps) => {
  const { user, babyProfile } = useAuth();
  
  // Recipe Chat State
  const [showRecipeChat, setShowRecipeChat] = useState(false);
  const [recipeChatMessages, setRecipeChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(RECIPE_CHAT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [{
      id: '1',
      role: 'assistant',
      content: "Hey! 🍳 I'm here to help with recipe ideas. Tell me what ingredients you have, your baby's age, or any dietary needs — I'll suggest something yummy!\n\n💡 Tip: Save any recipe by tapping the bookmark icon, then find it in Settings → Saved from Chat.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });
  const [recipeChatInput, setRecipeChatInput] = useState('');
  const [isRecipeChatTyping, setIsRecipeChatTyping] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(CHAT_SAVED_KEY);
      if (saved) {
        const items: SavedRecipe[] = JSON.parse(saved);
        return new Set(items.map(r => r.id));
      }
    } catch (e) {}
    return new Set();
  });
  const recipeChatEndRef = useRef<HTMLDivElement>(null);
  const recipeChatInputRef = useRef<HTMLInputElement>(null);

  // Save recipe chat messages
  useEffect(() => {
    if (recipeChatMessages.length > 1) {
      localStorage.setItem(RECIPE_CHAT_KEY, JSON.stringify(recipeChatMessages));
    }
  }, [recipeChatMessages]);

  // Scroll to bottom of recipe chat
  useEffect(() => {
    recipeChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [recipeChatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (showRecipeChat) {
      setTimeout(() => recipeChatInputRef.current?.focus(), 100);
    }
  }, [showRecipeChat]);

  const sendRecipeChatMessage = async () => {
    if (!recipeChatInput.trim() || isRecipeChatTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: recipeChatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...recipeChatMessages, userMessage];
    setRecipeChatMessages(updatedMessages);
    setRecipeChatInput('');
    setIsRecipeChatTyping(true);

    try {
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/recipe-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory, babyAge }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setRecipeChatMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Recipe chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! I'm having trouble connecting. Try again in a moment? 🍳",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setRecipeChatMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsRecipeChatTyping(false);
    }
  };

  const saveRecipeFromChat = async (message: ChatMessage) => {
    if (savedRecipeIds.has(message.id)) return;
    
    const title = extractRecipeTitle(message.content);
    const newRecipe: SavedRecipe = {
      id: message.id,
      title,
      content: message.content,
      savedAt: Date.now(),
      conversationTitle: 'Recipe Ideas'
    };

    // Optimistic update
    setSavedChatRecipes(prev => [newRecipe, ...prev]);
    setSavedRecipeIds(prev => new Set([...prev, message.id]));

    if (user) {
      try {
        await supabase.from('saved_chat_recipes').insert({
          user_id: user.id,
          message_id: message.id,
          title,
          content: message.content,
          conversation_title: 'Recipe Ideas'
        });
      } catch (e) {
        console.error('Failed to save recipe to database:', e);
      }
    } else {
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(CHAT_SAVED_KEY);
        const items: SavedRecipe[] = saved ? JSON.parse(saved) : [];
        items.unshift(newRecipe);
        localStorage.setItem(CHAT_SAVED_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save recipe:', e);
      }
    }
  };

  const clearRecipeChat = () => {
    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Fresh start! 🍳 What would you like to make today? Tell me what ingredients you have or what you're in the mood for.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecipeChatMessages([initialMessage]);
    localStorage.removeItem(RECIPE_CHAT_KEY);
  };
  const [activeTab, setActiveTab] = useState<'foods' | 'recipes' | 'saved'>('foods');
  const [savedChatRecipes, setSavedChatRecipes] = useState<SavedRecipe[]>([]);
  const [expandedSavedId, setExpandedSavedId] = useState<string | null>(null);

  // Reload saved recipes when tab changes to saved
  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedRecipes();
    }
  }, [activeTab, loadSavedRecipes]);

  const deleteSavedRecipe = async (id: string) => {
    // Optimistic update
    const updated = savedChatRecipes.filter(r => r.id !== id);
    setSavedChatRecipes(updated);
    setSavedRecipeIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    if (user) {
      try {
        await supabase
          .from('saved_chat_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('message_id', id);
      } catch (e) {
        console.error('Failed to delete from database:', e);
      }
    } else {
      localStorage.setItem(CHAT_SAVED_KEY, JSON.stringify(updated));
    }
  };

  const formatSavedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('6');
  const [savedFoods, setSavedFoods] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [babyAge, setBabyAge] = useState<number>(6);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recipeCategory, setRecipeCategory] = useState<string>('all');

  // Load saved data from database (or localStorage as fallback)
  const loadSavedRecipes = useCallback(async () => {
    if (user) {
      try {
        const dbRecipes = await recipesService.getAll(user.id);
        setSavedRecipes(dbRecipes.map(r => r.recipe_id));
        
        // Also load chat saved recipes from database
        const { data: chatRecipes } = await supabase
          .from('saved_chat_recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });
        
        if (chatRecipes) {
          setSavedChatRecipes(chatRecipes.map(r => ({
            id: r.id,
            title: r.title,
            content: r.content,
            savedAt: new Date(r.saved_at).getTime(),
            conversationTitle: r.conversation_title || 'Recipe Ideas'
          })));
          setSavedRecipeIds(new Set(chatRecipes.map(r => r.message_id)));
        }
      } catch (e) {
        console.error('Failed to load from database:', e);
      }
    } else {
      // Fallback to localStorage for non-logged-in users
      try {
        const savedRec = localStorage.getItem(SAVED_RECIPES_KEY);
        if (savedRec) setSavedRecipes(JSON.parse(savedRec));
        
        const savedChat = localStorage.getItem(CHAT_SAVED_KEY);
        if (savedChat) {
          const items = JSON.parse(savedChat);
          setSavedChatRecipes(items);
          setSavedRecipeIds(new Set(items.map((r: SavedRecipe) => r.id)));
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    }
  }, [user]);

  useEffect(() => {
    loadSavedRecipes();
  }, [loadSavedRecipes]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_FOODS_KEY);
      if (saved) setSavedFoods(JSON.parse(saved));
      
      // Use baby profile age if available
      if (babyProfile?.age_months) {
        const ageNum = babyProfile.age_months;
        setBabyAge(ageNum);
        if (ageNum < 7) setSelectedAge('6');
        else if (ageNum < 9) setSelectedAge('7-8');
        else if (ageNum < 12) setSelectedAge('9-12');
        else setSelectedAge('12+');
      } else {
        const age = localStorage.getItem(BABY_AGE_KEY);
        if (age) {
          const ageNum = parseInt(age);
          setBabyAge(ageNum);
          if (ageNum < 7) setSelectedAge('6');
          else if (ageNum < 9) setSelectedAge('7-8');
          else if (ageNum < 12) setSelectedAge('9-12');
          else setSelectedAge('12+');
        }
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
  }, [babyProfile]);

  // Save foods to localStorage (foods don't need database persistence)
  useEffect(() => {
    localStorage.setItem(SAVED_FOODS_KEY, JSON.stringify(savedFoods));
  }, [savedFoods]);

  const toggleSavedRecipe = async (recipeId: string) => {
    const isCurrentlySaved = savedRecipes.includes(recipeId);
    
    // Optimistic update
    setSavedRecipes(prev => 
      isCurrentlySaved 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
    
    // Save to database if logged in
    if (user) {
      try {
        if (isCurrentlySaved) {
          await recipesService.remove(user.id, recipeId);
        } else {
          await recipesService.save(user.id, recipeId);
        }
      } catch (e) {
        console.error('Failed to save recipe:', e);
        // Revert on error
        setSavedRecipes(prev => 
          isCurrentlySaved 
            ? [...prev, recipeId]
            : prev.filter(id => id !== recipeId)
        );
      }
    } else {
      // Save to localStorage for non-logged-in users
      const updated = isCurrentlySaved
        ? savedRecipes.filter(id => id !== recipeId)
        : [...savedRecipes, recipeId];
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
    }
  };

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = recipeCategory === 'all' || recipe.category === recipeCategory;
    const minAge = parseInt(recipe.ageRange);
    const matchesAge = babyAge >= minAge;
    return matchesSearch && matchesCategory && matchesAge;
  });

  const toggleSaved = (foodId: string) => {
    setSavedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  const categories = ['All', ...new Set(foods.map(f => f.category))];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured food (rotates daily, or first saved, or random popular)
  const getFeaturedFood = () => {
    if (savedFoods.length > 0) {
      return foods.find(f => f.id === savedFoods[0]);
    }
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return foods[dayOfYear % foods.length];
  };

  const featuredFood = getFeaturedFood();

  // Food Detail View
  if (selectedFood) {
    const isSaved = savedFoods.includes(selectedFood.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 px-4 py-3 flex items-center justify-between border-b">
          <button 
            onClick={() => setSelectedFood(null)}
            className="flex items-center text-slate-600"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button
            onClick={() => toggleSaved(selectedFood.id)}
            className="p-2"
          >
            {isSaved ? (
              <BookmarkCheck className="h-6 w-6 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="h-6 w-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Food Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <img 
            src={selectedFood.image} 
            alt={selectedFood.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
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

        {/* Age Tabs */}
        <div className="px-4 py-4 border-b bg-white sticky top-14 z-10">
          <p className="text-sm text-slate-500 mb-2">How to serve at each age:</p>
          <div className="flex gap-2">
            {(['6', '7-8', '9-12', '12+'] as AgeGroup[]).map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`flex-1 py-3 px-2 rounded-xl text-sm font-medium transition-all ${
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
        <div className="px-4 py-6">
          <Card className="border-none shadow-md bg-amber-50">
            <CardContent className="p-5">
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

          {/* Visual Cutting Guide */}
          <CuttingGuide foodId={selectedFood.id} />

          {/* Tips */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Tips
            </h3>
            <ul className="space-y-2">
              {selectedFood.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <span className="text-amber-400 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {selectedFood.warnings && selectedFood.warnings.length > 0 && (
            <Card className="mt-6 border-none shadow-md bg-rose-50">
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

          {/* Allergen Notice */}
          {selectedFood.allergen && (
            <Card className="mt-6 border-none shadow-md bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Allergen Information
                </h3>
                <p className="text-blue-700 text-sm">
                  This is a common allergen. Introduce early (around 6 months) and continue serving 
                  regularly. Watch for reactions and consult your doctor if you have concerns.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Recipe Detail View
  if (selectedRecipe) {
    const isSaved = savedRecipes.includes(selectedRecipe.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 px-4 py-3 flex items-center justify-between border-b">
          <button 
            onClick={() => setSelectedRecipe(null)}
            className="flex items-center text-slate-600"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button
            onClick={() => toggleSavedRecipe(selectedRecipe.id)}
            className="p-2"
          >
            {isSaved ? (
              <BookmarkCheck className="h-6 w-6 text-orange-500 fill-orange-500" />
            ) : (
              <Bookmark className="h-6 w-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Recipe Header */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 pt-4">
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

        <div className="px-4 py-6 space-y-6">
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
          {selectedRecipe.nutritionHighlights && (
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.nutritionHighlights.map((nutrient, i) => (
                <span key={i} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  ✓ {nutrient}
                </span>
              ))}
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-lg">Ingredients</h3>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
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
          </div>

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

  // Search Results View
  if (showSearch || searchQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
        {/* Search Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-10 pr-10 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            {(searchQuery || showSearch) && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="px-4 py-4">
          <p className="text-sm text-slate-500 mb-3">
            {filteredFoods.length} food{filteredFoods.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-2 gap-3">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="h-24 overflow-hidden">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-slate-800 truncate">{food.name}</p>
                  <p className="text-xs text-slate-400">{food.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main View with Tabs
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header */}
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Weaning Guide</h1>
        <p className="text-slate-500 mt-1">Foods, recipes & serving guides</p>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 mb-4">
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1 ${
              activeTab === 'foods'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            🥕 Foods
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1 ${
              activeTab === 'recipes'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ChefHat className="h-4 w-4" />
            Recipes
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1 ${
              activeTab === 'saved'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Saved
            {savedChatRecipes.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === 'saved' 
                  ? 'bg-rose-400 text-white' 
                  : 'bg-rose-100 text-rose-600'
              }`}>{savedChatRecipes.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* FOODS TAB */}
      {activeTab === 'foods' && (
        <div className="px-6 space-y-4">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200"
          >
            <Search className="h-5 w-5 text-slate-400" />
            <span className="text-slate-400">Search all {foods.length} foods...</span>
          </button>

          {/* Quick Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
            {categories.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setShowSearch(true); }}
                className="px-4 py-2 bg-white rounded-full text-sm whitespace-nowrap shadow-sm border border-slate-100"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Food */}
          {featuredFood && (
            <div>
              <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                {savedFoods.length > 0 ? 'Your Saved Foods' : "Today's Featured Food"}
              </h2>
              
              <button
                onClick={() => setSelectedFood(featuredFood)}
                className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow text-left"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={featuredFood.image} 
                    alt={featuredFood.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {featuredFood.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{featuredFood.name}</h3>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Card className="border-none shadow-sm bg-rose-50">
              <CardContent className="p-3">
                <AlertTriangle className="h-5 w-5 text-rose-500 mb-1" />
                <h3 className="font-semibold text-rose-800 text-xs">Choking Hazards</h3>
                <p className="text-rose-600 text-xs mt-1">
                  Quarter grapes & cherry tomatoes
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="p-3">
                <Info className="h-5 w-5 text-blue-500 mb-1" />
                <h3 className="font-semibold text-blue-800 text-xs">Allergens</h3>
                <p className="text-blue-600 text-xs mt-1">
                  Introduce early (~6mo)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Inspiration Card */}
          <button
            onClick={() => setShowRecipeChat(true)}
            className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-left shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base">Need ideas?</h3>
                <p className="text-amber-100 text-sm mt-0.5">
                  Get custom recipes — save your favorites!
                </p>
              </div>
              <MessageCircle className="h-5 w-5 text-white/70" />
            </div>
          </button>
        </div>
      )}

      {/* RECIPES TAB */}
      {activeTab === 'recipes' && (
        <div className="px-6 space-y-4">
          {/* Age Filter */}
          <Card className="border-none shadow-sm bg-orange-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-700">Showing recipes for</p>
                  <p className="text-lg font-bold text-orange-600">{babyAge}+ months</p>
                </div>
                <select
                  value={babyAge}
                  onChange={(e) => {
                    const age = parseInt(e.target.value);
                    setBabyAge(age);
                    localStorage.setItem(BABY_AGE_KEY, age.toString());
                  }}
                  className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-orange-700 text-sm"
                >
                  {[...Array(19)].map((_, i) => (
                    <option key={i + 6} value={i + 6}>{i + 6} months</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
            <button
              onClick={() => setRecipeCategory('all')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                recipeCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-slate-600 shadow-sm'
              }`}
            >
              All ({filteredRecipes.length})
            </button>
            {getRecipeCategories().map((cat) => (
              <button
                key={cat.name}
                onClick={() => setRecipeCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                  recipeCategory === cat.name
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-600 shadow-sm'
                }`}
              >
                {cat.emoji} {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </button>
            ))}
          </div>

          {/* Recipe Grid */}
          <div className="space-y-3">
            {filteredRecipes.length === 0 ? (
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-500">No recipes available for {babyAge} months yet.</p>
                  <p className="text-slate-400 text-sm mt-1">Try selecting an older age range.</p>
                </CardContent>
              </Card>
            ) : (
              filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 text-sm line-clamp-1">{recipe.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded capitalize">{recipe.category}</span>
                        <span>{recipe.ageRange}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.prepTime + recipe.cookTime} min
                        </span>
                        {recipe.freezable && (
                          <span className="flex items-center gap-1 text-blue-500">
                            <Snowflake className="h-3 w-3" />
                            Freezable
                          </span>
                        )}
                        {savedRecipes.includes(recipe.id) && (
                          <BookmarkCheck className="h-4 w-4 text-orange-500 fill-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Recipe Count */}
          <p className="text-center text-xs text-slate-400 pt-2">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available for {babyAge}+ months
          </p>

          {/* Chat Inspiration Card */}
          <button
            onClick={() => setShowRecipeChat(true)}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-left shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base">Looking for inspo?</h3>
                <p className="text-orange-100 text-sm mt-0.5">
                  Get custom recipe ideas — save favorites for later!
                </p>
              </div>
              <MessageCircle className="h-5 w-5 text-white/70" />
            </div>
          </button>
        </div>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <div className="px-6 space-y-4">
          {savedChatRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-rose-400" />
              </div>
              <h3 className="font-semibold text-slate-700 mb-2">No saved recipes yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                Ask Nunu for recipe ideas and tap the bookmark icon to save your favorites here
              </p>
              <button
                onClick={() => setShowRecipeChat(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                <Sparkles className="h-5 w-5" />
                Get Recipe Ideas
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                {savedChatRecipes.length} saved recipe{savedChatRecipes.length !== 1 ? 's' : ''} from chat
              </p>
              
              <div className="space-y-3">
                {savedChatRecipes.map((recipe) => (
                  <Card key={recipe.id} className="border-none shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedSavedId(expandedSavedId === recipe.id ? null : recipe.id)}
                      className="w-full p-4 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <ChefHat className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-800 line-clamp-1">{recipe.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Saved {formatSavedDate(recipe.savedAt)}</p>
                      </div>
                      {expandedSavedId === recipe.id ? (
                        <X className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronLeft className="h-5 w-5 text-slate-400 flex-shrink-0 rotate-180" />
                      )}
                    </button>
                    
                    {expandedSavedId === recipe.id && (
                      <div className="px-4 pb-4 border-t border-slate-100">
                        <div className="bg-amber-50 rounded-xl p-4 mt-3 max-h-80 overflow-y-auto">
                          <div className="text-sm text-slate-700 leading-relaxed">{renderMarkdown(recipe.content)}</div>
                        </div>
                        <button
                          onClick={() => deleteSavedRecipe(recipe.id)}
                          className="mt-3 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove from saved
                        </button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Get More Ideas Button */}
              <button
                onClick={() => setShowRecipeChat(true)}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-left shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Get more ideas</h3>
                    <p className="text-orange-100 text-xs">Ask Nunu for new recipes</p>
                  </div>
                  <MessageCircle className="h-5 w-5 text-white/70" />
                </div>
              </button>
            </>
          )}
        </div>
      )}

      {/* Recipe Chat Modal */}
      {showRecipeChat && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 flex items-center justify-between shadow-md">
            <button
              onClick={() => setShowRecipeChat(false)}
              className="flex items-center gap-2 text-white"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-center">
              <h1 className="font-semibold text-white">Recipe Ideas</h1>
              <p className="text-orange-100 text-xs">Ask me anything!</p>
            </div>
            <button
              onClick={clearRecipeChat}
              className="text-orange-100 text-sm hover:text-white"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {recipeChatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`
                  max-w-[85%] rounded-2xl px-4 py-3
                  ${message.role === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white shadow-sm border border-orange-100'
                  }
                `}>
                  <div className="text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
                  <div className={`
                    flex items-center justify-between mt-2 gap-3
                    ${message.role === 'user' ? 'text-orange-200' : 'text-slate-400'}
                  `}>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {message.timestamp}
                    </div>
                    {message.role === 'assistant' && message.id !== '1' && (
                      <button
                        onClick={() => saveRecipeFromChat(message)}
                        className={`p-1 rounded-full transition-colors ${
                          savedRecipeIds.has(message.id)
                            ? 'text-orange-500 bg-orange-50'
                            : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                        title={savedRecipeIds.has(message.id) ? 'Saved!' : 'Save this recipe'}
                      >
                        {savedRecipeIds.has(message.id) ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Bookmark className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                )}
              </div>
            ))}

            {isRecipeChatTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ChefHat className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white shadow-sm border border-orange-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={recipeChatEndRef} />
          </div>

          {/* Quick Prompts */}
          {recipeChatMessages.length <= 1 && (
            <div className="px-4 py-3 bg-white/80 border-t border-orange-100">
              <p className="text-xs text-slate-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Easy breakfast ideas",
                  "What can I make with banana?",
                  "Iron-rich finger foods",
                  "Freezer-friendly meals"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setRecipeChatInput(prompt)}
                    className="px-3 py-1.5 text-sm bg-orange-100 border border-orange-200 rounded-full text-orange-700 hover:bg-orange-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-orange-100">
            <div className="flex gap-2 items-end">
              <Input
                ref={recipeChatInputRef}
                value={recipeChatInput}
                onChange={(e) => setRecipeChatInput(e.target.value)}
                placeholder="What would you like to make?"
                className="rounded-full bg-orange-50 border-orange-200 focus:border-orange-400 focus:bg-white py-3 px-4"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendRecipeChatMessage()}
                disabled={isRecipeChatTyping}
              />
              <Button 
                onClick={sendRecipeChatMessage}
                disabled={!recipeChatInput.trim() || isRecipeChatTyping}
                className="rounded-full w-11 h-11 p-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              💡 Save recipes to find them in Settings → Saved from Chat
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weaning;

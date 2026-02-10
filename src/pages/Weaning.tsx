import { useState, useEffect } from 'react';
import { Search, X, AlertTriangle, ChevronLeft, Star, Clock, Bookmark, BookmarkCheck, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { foods, Food } from '@/data/foods';

const SAVED_FOODS_KEY = 'nunu-saved-foods';
const BABY_AGE_KEY = 'nunu-baby-age-months';

type AgeGroup = '6' | '7-8' | '9-12' | '12+';

// Available cutting guide SVGs
const CUTTING_GUIDES: Record<string, string[]> = {
  'banana': ['6', '9-12'],
  'avocado': ['6'],
  'broccoli': ['6'],
  'grapes': ['6'],
};

// Cutting Guide Component
const CuttingGuide = ({ foodId, age }: { foodId: string; age: AgeGroup }) => {
  const ageKey = age === '12+' ? '12plus' : age;
  const hasGuide = CUTTING_GUIDES[foodId]?.includes(age);
  
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
    <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <img 
        src={`/food-guides/${foodId}-${ageKey}.svg`}
        alt={`How to cut ${foodId} for ${age} month old`}
        className="w-full h-48 object-contain p-4"
      />
    </div>
  );
};

const Weaning = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('6');
  const [savedFoods, setSavedFoods] = useState<string[]>([]);
  const [babyAge, setBabyAge] = useState<number>(6);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Load saved data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_FOODS_KEY);
      if (saved) setSavedFoods(JSON.parse(saved));
      
      const age = localStorage.getItem(BABY_AGE_KEY);
      if (age) {
        const ageNum = parseInt(age);
        setBabyAge(ageNum);
        // Set default age group based on baby's age
        if (ageNum < 7) setSelectedAge('6');
        else if (ageNum < 9) setSelectedAge('7-8');
        else if (ageNum < 12) setSelectedAge('9-12');
        else setSelectedAge('12+');
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem(SAVED_FOODS_KEY, JSON.stringify(savedFoods));
  }, [savedFoods]);

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
          <CuttingGuide foodId={selectedFood.id} age={selectedAge} />

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

  // Main View - Featured Food + Search Button
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">Weaning Guide</h1>
        <p className="text-slate-500 mt-1">Learn how to serve foods safely</p>
      </div>

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
              <div className="relative h-48 overflow-hidden">
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
                  <h3 className="text-2xl font-bold text-white mt-2">{featuredFood.name}</h3>
                </div>
                {featuredFood.allergen && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Allergen
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-slate-600 text-sm line-clamp-2">
                  {featuredFood.serving['6']}
                </p>
                <p className="text-amber-600 text-sm font-medium mt-2">
                  Tap to see full serving guide →
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Saved Foods List */}
        {savedFoods.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {savedFoods.slice(1, 7).map(foodId => {
              const food = foods.find(f => f.id === foodId);
              if (!food) return null;
              return (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="h-16 overflow-hidden">
                    <img 
                      src={food.image} 
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="p-2 text-xs text-slate-700 truncate">{food.name}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Card className="border-none shadow-sm bg-rose-50">
            <CardContent className="p-4">
              <AlertTriangle className="h-6 w-6 text-rose-500 mb-2" />
              <h3 className="font-semibold text-rose-800 text-sm">Choking Hazards</h3>
              <p className="text-rose-600 text-xs mt-1">
                Always quarter grapes, cherry tomatoes & blueberries lengthways
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <Info className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-semibold text-blue-800 text-sm">Allergens</h3>
              <p className="text-blue-600 text-xs mt-1">
                Introduce top allergens early (around 6mo) to reduce allergy risk
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Age Reminder */}
        <Card className="border-none shadow-sm bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800">Baby's age</p>
                <p className="text-2xl font-bold text-amber-600">{babyAge} months</p>
              </div>
              <select
                value={babyAge}
                onChange={(e) => {
                  const age = parseInt(e.target.value);
                  setBabyAge(age);
                  localStorage.setItem(BABY_AGE_KEY, age.toString());
                }}
                className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-amber-700"
              >
                {[...Array(19)].map((_, i) => (
                  <option key={i + 6} value={i + 6}>{i + 6} months</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weaning;

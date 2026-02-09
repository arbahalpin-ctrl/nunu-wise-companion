import { useState } from 'react';
import { ChevronRight, X, Clock, AlertTriangle, Check, Baby } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Food {
  id: string;
  name: string;
  emoji: string;
  category: string;
  allergen?: boolean;
  serving: {
    '6': string;
    '7-8': string;
    '9-12': string;
    '12+': string;
  };
  tips: string[];
  warnings?: string[];
}

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ageFrom: number;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
}

const foods: Food[] = [
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    category: 'Fruits',
    serving: {
      '6': 'Mash well or serve as long spears (half banana lengthways) for self-feeding',
      '7-8': 'Soft chunks or spears, can be slightly less mashed',
      '9-12': 'Small bite-sized pieces or whole banana to hold',
      '12+': 'Sliced rounds, chunks, or whole to self-feed'
    },
    tips: ['Great first food - naturally soft', 'Can be slippery - roll in baby cereal for grip', 'Ripe bananas are easier to digest']
  },
  {
    id: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    category: 'Fruits',
    serving: {
      '6': 'Mashed or long slices with skin on for grip',
      '7-8': 'Soft chunks or strips',
      '9-12': 'Cubed pieces, can add to other foods',
      '12+': 'Slices, chunks, or spread on toast'
    },
    tips: ['Nutrient-dense first food', 'Leave skin on spears for easier gripping', 'Roll in hemp seeds or breadcrumbs if too slippery']
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    emoji: '🥦',
    category: 'Vegetables',
    serving: {
      '6': 'Steam until very soft, serve as whole floret (tree shape) to hold',
      '7-8': 'Soft steamed florets',
      '9-12': 'Slightly firmer florets, can be smaller pieces',
      '12+': 'Lightly steamed or roasted pieces'
    },
    tips: ['Natural handle shape - perfect for BLW', 'Steam for 8-10 mins until soft', 'The stem is great for holding']
  },
  {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    category: 'Vegetables',
    serving: {
      '6': 'Steam until VERY soft (easily squished), serve as thick batons',
      '7-8': 'Soft steamed batons or mashed',
      '9-12': 'Softer cooked pieces, shredded raw is OK',
      '12+': 'Cooked chunks, thin raw sticks OK if supervised'
    },
    tips: ['Must be very soft for young babies - choking risk if hard', 'Test softness: should squish easily between fingers', 'Raw carrot not safe until 12m+ and even then, thinly sliced'],
    warnings: ['Raw/hard carrot is a choking hazard under 12 months']
  },
  {
    id: 'chicken',
    name: 'Chicken',
    emoji: '🍗',
    category: 'Protein',
    serving: {
      '6': 'Shredded or drumstick with bone in (they gnaw/suck on it)',
      '7-8': 'Shredded, moist strips, or drumstick',
      '9-12': 'Small shredded pieces or soft strips',
      '12+': 'Bite-sized pieces, can be firmer texture'
    },
    tips: ['Keep it moist - dry chicken is hard to swallow', 'Drumstick method: they hold bone and gnaw meat off', 'Slow cooker chicken is naturally soft and shreddable']
  },
  {
    id: 'egg',
    name: 'Eggs',
    emoji: '🥚',
    category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Well-cooked scrambled, omelette strips, or hard-boiled mashed',
      '7-8': 'Scrambled, omelette strips, quartered hard-boiled',
      '9-12': 'Scrambled, chopped hard-boiled, frittata pieces',
      '12+': 'Any style, well-cooked'
    },
    tips: ['Top allergen - introduce early (around 6mo) to reduce allergy risk', 'Always well-cooked for babies (no runny yolk until 12m+)', 'Great source of iron and protein'],
    warnings: ['Introduce as one of first foods to help prevent egg allergy', 'Watch for reactions: rash, swelling, vomiting']
  },
  {
    id: 'peanut',
    name: 'Peanut Butter',
    emoji: '🥜',
    category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Thin smear on toast or mixed into puree (never whole nuts or thick globs)',
      '7-8': 'Thinly spread on soft foods or mixed in',
      '9-12': 'Spread on toast strips, mixed into oatmeal',
      '12+': 'Spread on foods, in sauces'
    },
    tips: ['Major allergen - early introduction recommended', 'NEVER give whole nuts or chunks - choking hazard', 'Mix with breastmilk/formula to thin if needed'],
    warnings: ['Never whole peanuts until 5+ years', 'Thick globs are a choking hazard', 'If family history of allergies, consult doctor first']
  },
  {
    id: 'toast',
    name: 'Toast',
    emoji: '🍞',
    category: 'Grains',
    serving: {
      '6': 'Lightly toasted strips/fingers with toppings (avocado, nut butter)',
      '7-8': 'Toast strips with soft toppings',
      '9-12': 'Smaller pieces of toast, can be crustier',
      '12+': 'Regular toast pieces'
    },
    tips: ['Light toast dissolves easier than bread', 'Great vehicle for other foods', 'Remove crusts initially if tough']
  },
  {
    id: 'pasta',
    name: 'Pasta',
    emoji: '🍝',
    category: 'Grains',
    serving: {
      '6': 'Large pasta shapes (fusilli, penne) cooked very soft',
      '7-8': 'Soft pasta shapes, can try spaghetti',
      '9-12': 'Various shapes, slightly firmer OK',
      '12+': 'Regular pasta textures'
    },
    tips: ['Fusilli is great for beginners - easy to grip', 'Cook 2-3 mins longer than packet says', 'Toss in olive oil to prevent sticking']
  },
  {
    id: 'strawberry',
    name: 'Strawberries',
    emoji: '🍓',
    category: 'Fruits',
    serving: {
      '6': 'Mashed, or very large whole strawberry to gnaw (too big to choke)',
      '7-8': 'Halved or quartered depending on size',
      '9-12': 'Quartered or small pieces',
      '12+': 'Halved or whole depending on size'
    },
    tips: ['Round foods should be quartered lengthways', 'Large strawberry = safer than small pieces for young babies', 'Can cause rash around mouth (contact reaction, not allergy usually)']
  },
  {
    id: 'cheese',
    name: 'Cheese',
    emoji: '🧀',
    category: 'Dairy',
    serving: {
      '6': 'Thin strips of firm cheese (cheddar) or grated/melted',
      '7-8': 'Thin strips or grated onto food',
      '9-12': 'Small cubes (pea-sized), grated',
      '12+': 'Cubes, slices, sticks'
    },
    tips: ['Choose lower-salt options when possible', 'Melted cheese on toast/veg is easier', 'Avoid blue cheese and mould-ripened (listeria risk)'],
    warnings: ['No unpasteurized cheese', 'No blue cheese or brie until 12m+']
  },
  {
    id: 'fish',
    name: 'Fish',
    emoji: '🐟',
    category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Flaked, de-boned, soft poached/baked fish',
      '7-8': 'Flaked pieces, fish cakes',
      '9-12': 'Small pieces, fish fingers (low salt)',
      '12+': 'Various preparations'
    },
    tips: ['Great source of omega-3 (especially salmon)', 'ALWAYS double-check for bones', 'Avoid high-mercury fish (shark, swordfish, marlin)'],
    warnings: ['Check thoroughly for bones', 'Limit tuna to 1 portion per week (mercury)']
  }
];

const recipes: Recipe[] = [
  {
    id: 'banana-pancakes',
    name: 'Baby Banana Pancakes',
    emoji: '🥞',
    ageFrom: 6,
    prepTime: '10 mins',
    ingredients: ['1 ripe banana', '1 egg', '2 tbsp oats (optional)'],
    instructions: [
      'Mash banana in a bowl until smooth',
      'Beat in the egg until combined',
      'Add oats if using for extra texture',
      'Heat non-stick pan on medium, add small spoonfuls',
      'Cook 2-3 mins each side until golden',
      'Cool before serving'
    ],
    tips: 'No added sugar needed - banana provides sweetness!'
  },
  {
    id: 'veggie-fingers',
    name: 'Veggie Fingers',
    emoji: '🥕',
    ageFrom: 6,
    prepTime: '25 mins',
    ingredients: ['1 sweet potato', '1 courgette', '1 egg', '3 tbsp flour', '2 tbsp cheese (optional)'],
    instructions: [
      'Grate sweet potato and courgette, squeeze out liquid',
      'Mix with egg, flour, and cheese if using',
      'Shape into finger-sized pieces',
      'Bake at 180°C for 20 mins, flipping halfway',
      'Cool until safe to handle'
    ],
    tips: 'Batch cook and freeze for quick meals!'
  },
  {
    id: 'avocado-toast',
    name: 'Loaded Avo Toast Fingers',
    emoji: '🥑',
    ageFrom: 6,
    prepTime: '5 mins',
    ingredients: ['1 slice bread', '¼ ripe avocado', 'Pinch of hemp seeds (optional)'],
    instructions: [
      'Toast bread lightly',
      'Mash avocado and spread on toast',
      'Sprinkle hemp seeds for extra nutrition',
      'Cut into finger-sized strips',
      'Serve immediately'
    ],
    tips: 'Add mashed banana for a sweeter version'
  },
  {
    id: 'egg-muffins',
    name: 'Mini Egg Muffins',
    emoji: '🥚',
    ageFrom: 7,
    prepTime: '20 mins',
    ingredients: ['3 eggs', '2 tbsp milk', 'Handful spinach (chopped fine)', '2 tbsp cheese'],
    instructions: [
      'Preheat oven to 180°C',
      'Whisk eggs and milk together',
      'Stir in spinach and cheese',
      'Pour into greased mini muffin tin',
      'Bake 12-15 mins until set',
      'Cool before serving'
    ],
    tips: 'Perfect for batch prep - freeze extras!'
  },
  {
    id: 'chicken-strips',
    name: 'Soft Chicken Strips',
    emoji: '🍗',
    ageFrom: 6,
    prepTime: '30 mins',
    ingredients: ['1 chicken breast', 'Olive oil', 'Pinch of herbs (optional)'],
    instructions: [
      'Preheat oven to 190°C',
      'Cut chicken into thick finger-sized strips',
      'Coat lightly in olive oil and herbs',
      'Bake for 20-25 mins until cooked through',
      'Shred or serve as strips depending on age',
      'Ensure chicken is moist - don\'t overcook'
    ],
    tips: 'Poach in stock for extra moisture if baking makes it dry'
  },
  {
    id: 'pasta-sauce',
    name: 'Hidden Veggie Pasta Sauce',
    emoji: '🍝',
    ageFrom: 6,
    prepTime: '25 mins',
    ingredients: ['1 tin tomatoes', '1 carrot (grated)', '1 courgette (grated)', '1 garlic clove', 'Olive oil', 'Pinch of basil'],
    instructions: [
      'Sauté garlic in olive oil for 1 min',
      'Add grated veg, cook 5 mins until soft',
      'Add tinned tomatoes and basil',
      'Simmer 15 mins, blend until smooth',
      'Serve with soft-cooked pasta shapes',
      'Freeze portions for quick meals'
    ],
    tips: 'Blend smooth for younger babies, leave chunky for older ones'
  }
];

const categories = ['All', 'Fruits', 'Vegetables', 'Protein', 'Grains', 'Dairy'];

const Weaning = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'foods' | 'recipes'>('foods');
  const [babyAge, setBabyAge] = useState<string>('6');

  const filteredFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter(f => f.category === selectedCategory);

  const getServingForAge = (food: Food): string => {
    if (parseInt(babyAge) <= 6) return food.serving['6'];
    if (parseInt(babyAge) <= 8) return food.serving['7-8'];
    if (parseInt(babyAge) <= 12) return food.serving['9-12'];
    return food.serving['12+'];
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">Weaning Guide</h1>
        <p className="text-slate-500 mt-1">Foods & recipes for your little one</p>
      </div>

      {/* Age Selector */}
      <div className="px-6 mb-4">
        <label className="text-sm text-slate-600 mb-2 block">Baby's age:</label>
        <select 
          value={babyAge}
          onChange={(e) => setBabyAge(e.target.value)}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700"
        >
          <option value="6">6 months</option>
          <option value="7">7-8 months</option>
          <option value="9">9-12 months</option>
          <option value="13">12+ months</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'foods' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            Foods
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'recipes' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            Recipes
          </button>
        </div>
      </div>

      {activeTab === 'foods' && (
        <>
          {/* Category Filter */}
          <div className="px-6 mb-4 overflow-x-auto">
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Foods Grid */}
          <div className="px-6 grid grid-cols-3 gap-3">
            {filteredFoods.map(food => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">{food.emoji}</div>
                <p className="text-sm font-medium text-slate-700">{food.name}</p>
                {food.allergen && (
                  <span className="text-xs text-amber-600 mt-1 block">⚠️ Allergen</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === 'recipes' && (
        <div className="px-6 space-y-3">
          {recipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left flex items-center gap-4"
            >
              <div className="text-4xl">{recipe.emoji}</div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{recipe.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.prepTime}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Baby className="h-3 w-3" />
                    {recipe.ageFrom}m+
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          ))}
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedFood.emoji}</span>
                <div>
                  <h2 className="font-semibold text-slate-800">{selectedFood.name}</h2>
                  {selectedFood.allergen && (
                    <span className="text-xs text-amber-600">⚠️ Common allergen</span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedFood(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[65vh] space-y-5">
              {/* Serving for selected age */}
              <div className="bg-sky-50 rounded-xl p-4">
                <p className="text-xs text-sky-600 font-medium mb-1">
                  How to serve at {babyAge === '6' ? '6 months' : babyAge === '7' ? '7-8 months' : babyAge === '9' ? '9-12 months' : '12+ months'}:
                </p>
                <p className="text-slate-700">{getServingForAge(selectedFood)}</p>
              </div>

              {/* All ages reference */}
              <div>
                <h3 className="font-medium text-slate-800 mb-3">By age:</h3>
                <div className="space-y-2">
                  {Object.entries(selectedFood.serving).map(([age, serving]) => (
                    <div key={age} className="flex gap-3 text-sm">
                      <span className="font-medium text-slate-500 w-16 flex-shrink-0">
                        {age === '6' ? '6m' : age === '7-8' ? '7-8m' : age === '9-12' ? '9-12m' : '12m+'}
                      </span>
                      <span className="text-slate-600">{serving}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Tips:</h3>
                <ul className="space-y-2">
                  {selectedFood.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              {selectedFood.warnings && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Important:
                  </h3>
                  <ul className="space-y-1">
                    {selectedFood.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-amber-700">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedRecipe.emoji}</span>
                <div>
                  <h2 className="font-semibold text-slate-800">{selectedRecipe.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedRecipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Baby className="h-3 w-3" />
                      {selectedRecipe.ageFrom}m+
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[65vh] space-y-5">
              {/* Ingredients */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Ingredients:</h3>
                <ul className="space-y-1">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Instructions:</h3>
                <ol className="space-y-2">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-3">
                      <span className="font-medium text-slate-400">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedRecipe.tips && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-emerald-700">
                    <span className="font-medium">💡 Tip:</span> {selectedRecipe.tips}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weaning;

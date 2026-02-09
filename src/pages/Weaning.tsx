import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, X, Clock, AlertTriangle, Check, Baby, Filter, Star, Flame, Bookmark, Trash2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SAVED_RECIPES_KEY = 'nunu-saved-recipes';

interface SavedRecipe {
  id: string;
  content: string;
  savedAt: number;
  conversationTitle: string;
}

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
  image?: string;
  ageFrom: number;
  prepTime: string;
  cookTime?: string;
  servings?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  tags: string[];
  ingredients: string[];
  instructions: string[];
  tips?: string;
  nutrition?: string;
  freezable?: boolean;
  popular?: boolean;
}

// Extensive food database
const foods: Food[] = [
  {
    id: 'banana', name: 'Banana', emoji: '🍌', category: 'Fruits',
    serving: {
      '6': 'Mash well or serve as long spears (half banana lengthways)',
      '7-8': 'Soft chunks or spears, slightly less mashed',
      '9-12': 'Small bite-sized pieces or whole to hold',
      '12+': 'Sliced rounds, chunks, or whole'
    },
    tips: ['Great first food', 'Roll in baby cereal for grip if slippery', 'Ripe = easier to digest']
  },
  {
    id: 'avocado', name: 'Avocado', emoji: '🥑', category: 'Fruits',
    serving: {
      '6': 'Mashed or long slices with skin on for grip',
      '7-8': 'Soft chunks or strips',
      '9-12': 'Cubed pieces, add to other foods',
      '12+': 'Slices, chunks, or spread on toast'
    },
    tips: ['Nutrient-dense first food', 'Leave skin on for grip', 'Roll in hemp seeds if slippery']
  },
  {
    id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'Vegetables',
    serving: {
      '6': 'Steam until very soft, serve as whole floret',
      '7-8': 'Soft steamed florets',
      '9-12': 'Slightly firmer florets',
      '12+': 'Lightly steamed or roasted'
    },
    tips: ['Natural handle shape', 'Steam 8-10 mins', 'Stem is great for holding']
  },
  {
    id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'Vegetables',
    serving: {
      '6': 'Steam until VERY soft, thick batons',
      '7-8': 'Soft steamed batons or mashed',
      '9-12': 'Softer cooked pieces, shredded raw OK',
      '12+': 'Cooked chunks, thin raw sticks supervised'
    },
    tips: ['Must be very soft for young babies', 'Should squish between fingers'],
    warnings: ['Raw carrot is choking hazard under 12m']
  },
  {
    id: 'sweetpotato', name: 'Sweet Potato', emoji: '🍠', category: 'Vegetables',
    serving: {
      '6': 'Steamed/roasted wedges, very soft',
      '7-8': 'Soft wedges or mashed',
      '9-12': 'Cubes or wedges',
      '12+': 'Any preparation'
    },
    tips: ['Great first food - naturally sweet', 'Roast with skin for easier gripping', 'High in vitamin A']
  },
  {
    id: 'chicken', name: 'Chicken', emoji: '🍗', category: 'Protein',
    serving: {
      '6': 'Shredded or drumstick (gnaw/suck)',
      '7-8': 'Shredded, moist strips',
      '9-12': 'Small shredded pieces',
      '12+': 'Bite-sized pieces'
    },
    tips: ['Keep moist - dry is hard to swallow', 'Drumstick method works great', 'Slow cooker = naturally soft']
  },
  {
    id: 'beef', name: 'Beef', emoji: '🥩', category: 'Protein',
    serving: {
      '6': 'Slow-cooked strips to suck/gnaw, or pureed',
      '7-8': 'Shredded slow-cooked, mince',
      '9-12': 'Small mince pieces, soft strips',
      '12+': 'Ground beef, small pieces'
    },
    tips: ['Great iron source', 'Slow cook for tenderness', 'Mince is versatile']
  },
  {
    id: 'salmon', name: 'Salmon', emoji: '🐟', category: 'Protein', allergen: true,
    serving: {
      '6': 'Flaked, de-boned, soft baked',
      '7-8': 'Flaked pieces, salmon cakes',
      '9-12': 'Small pieces, patties',
      '12+': 'Various preparations'
    },
    tips: ['Excellent omega-3 source', 'ALWAYS check for bones', 'Wild caught when possible'],
    warnings: ['Check thoroughly for bones']
  },
  {
    id: 'egg', name: 'Eggs', emoji: '🥚', category: 'Protein', allergen: true,
    serving: {
      '6': 'Well-cooked scrambled, omelette strips',
      '7-8': 'Scrambled, quartered hard-boiled',
      '9-12': 'Scrambled, chopped hard-boiled',
      '12+': 'Any style, well-cooked'
    },
    tips: ['Introduce early to reduce allergy risk', 'Always well-cooked', 'Great protein & iron'],
    warnings: ['Watch for reactions: rash, swelling']
  },
  {
    id: 'peanut', name: 'Peanut Butter', emoji: '🥜', category: 'Protein', allergen: true,
    serving: {
      '6': 'Thin smear on toast or mixed in',
      '7-8': 'Thinly spread on soft foods',
      '9-12': 'Spread on toast, in oatmeal',
      '12+': 'Spread on foods, sauces'
    },
    tips: ['Early introduction recommended', 'NEVER whole nuts', 'Thin with milk if needed'],
    warnings: ['No whole peanuts until 5+ years', 'Thick globs = choking hazard']
  },
  {
    id: 'toast', name: 'Toast', emoji: '🍞', category: 'Grains',
    serving: {
      '6': 'Lightly toasted strips with toppings',
      '7-8': 'Toast strips with soft toppings',
      '9-12': 'Smaller pieces',
      '12+': 'Regular toast'
    },
    tips: ['Light toast dissolves easier', 'Great vehicle for toppings']
  },
  {
    id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'Grains',
    serving: {
      '6': 'Large shapes (fusilli) cooked very soft',
      '7-8': 'Soft pasta shapes',
      '9-12': 'Various shapes',
      '12+': 'Regular textures'
    },
    tips: ['Fusilli easy to grip', 'Cook 2-3 mins longer than packet']
  },
  {
    id: 'rice', name: 'Rice', emoji: '🍚', category: 'Grains',
    serving: {
      '6': 'Very soft, can mash slightly or form into balls',
      '7-8': 'Soft cooked, sticky rice works well',
      '9-12': 'Regular cooked rice',
      '12+': 'Any preparation'
    },
    tips: ['Sticky rice easier for self-feeding', 'Form into balls for grip']
  },
  {
    id: 'oats', name: 'Oats/Porridge', emoji: '🥣', category: 'Grains',
    serving: {
      '6': 'Smooth porridge, loaded on spoon',
      '7-8': 'Thicker porridge',
      '9-12': 'Chunky with toppings',
      '12+': 'Any consistency'
    },
    tips: ['Great iron when made with formula/milk', 'Add fruit for flavor']
  },
  {
    id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'Dairy',
    serving: {
      '6': 'Thin strips or grated/melted',
      '7-8': 'Thin strips or grated',
      '9-12': 'Small cubes, grated',
      '12+': 'Cubes, slices, sticks'
    },
    tips: ['Choose lower-salt options', 'Melted is easier'],
    warnings: ['No unpasteurized', 'No blue cheese until 12m+']
  },
  {
    id: 'yogurt', name: 'Yogurt', emoji: '🥛', category: 'Dairy',
    serving: {
      '6': 'Full-fat plain, loaded on spoon',
      '7-8': 'Full-fat, can mix with fruit',
      '9-12': 'Any full-fat yogurt',
      '12+': 'Any yogurt'
    },
    tips: ['Choose full-fat, plain', 'Greek yogurt is thicker', 'Avoid added sugar']
  },
  {
    id: 'strawberry', name: 'Strawberries', emoji: '🍓', category: 'Fruits',
    serving: {
      '6': 'Mashed or very large whole to gnaw',
      '7-8': 'Halved or quartered',
      '9-12': 'Quartered or small pieces',
      '12+': 'Halved or whole'
    },
    tips: ['Quarter lengthways for safety', 'May cause contact rash (not allergy)']
  },
  {
    id: 'blueberry', name: 'Blueberries', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Smash flat or quarter',
      '7-8': 'Smashed or quartered',
      '9-12': 'Quartered',
      '12+': 'Halved, whole if supervised'
    },
    tips: ['Round = choking risk, always smash/cut', 'Frozen work great in cooking'],
    warnings: ['Always smash or quarter - round shape is hazardous']
  },
  {
    id: 'apple', name: 'Apple', emoji: '🍎', category: 'Fruits',
    serving: {
      '6': 'Steamed/roasted until very soft, or thin shreds',
      '7-8': 'Soft cooked pieces, grated raw',
      '9-12': 'Soft cooked, thin raw slices',
      '12+': 'Thin slices, cooked'
    },
    tips: ['Raw apple is hard - cook for babies', 'Grate for texture'],
    warnings: ['Raw apple chunks are choking hazard']
  },
  {
    id: 'mango', name: 'Mango', emoji: '🥭', category: 'Fruits',
    serving: {
      '6': 'Ripe strips or pit with flesh to gnaw',
      '7-8': 'Soft strips or chunks',
      '9-12': 'Cubed pieces',
      '12+': 'Any cut'
    },
    tips: ['Leave on large pit to gnaw safely', 'Very ripe = very soft']
  },
  {
    id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'Vegetables',
    serving: {
      '6': 'Large spears with skin (too big to choke)',
      '7-8': 'Large spears',
      '9-12': 'Thinner spears',
      '12+': 'Slices, sticks'
    },
    tips: ['Keep skin on for grip', 'Cool and soothing for teething']
  },
  {
    id: 'tomato', name: 'Tomatoes', emoji: '🍅', category: 'Vegetables',
    serving: {
      '6': 'Quartered cherry tomatoes or large wedges',
      '7-8': 'Quartered, skinned if preferred',
      '9-12': 'Small pieces',
      '12+': 'Any cut'
    },
    tips: ['Quarter cherry tomatoes lengthways', 'Skin can be tough for some babies'],
    warnings: ['Round cherry tomatoes must be quartered']
  },
  {
    id: 'peas', name: 'Peas', emoji: '🟢', category: 'Vegetables',
    serving: {
      '6': 'Smash flat or blend into foods',
      '7-8': 'Smashed',
      '9-12': 'Lightly smashed',
      '12+': 'Whole if chewing well'
    },
    tips: ['Smash to break skin', 'Great finger food when smashed'],
    warnings: ['Whole peas can be choking hazard - smash them']
  },
  {
    id: 'lentils', name: 'Lentils', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Well-cooked, mashed or in sauce',
      '7-8': 'Soft cooked lentils',
      '9-12': 'In dishes, dal',
      '12+': 'Any preparation'
    },
    tips: ['Great plant protein & iron', 'Red lentils cook softest']
  },
  {
    id: 'tofu', name: 'Tofu', emoji: '🧈', category: 'Protein',
    serving: {
      '6': 'Firm tofu strips, pan-fried',
      '7-8': 'Strips or cubes',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Firm tofu holds shape better', 'Pan fry for better texture', 'Good protein source']
  }
];

// Extensive recipe database
const recipes: Recipe[] = [
  // BREAKFAST
  {
    id: 'banana-pancakes', name: 'Banana Pancakes', emoji: '🥞',
    ageFrom: 6, prepTime: '5 mins', cookTime: '10 mins', category: 'breakfast',
    tags: ['egg-free option', 'freezable', 'quick'], popular: true, freezable: true,
    ingredients: ['1 ripe banana', '1 egg', '2 tbsp oats (optional)', 'Pinch of cinnamon'],
    instructions: ['Mash banana until smooth', 'Beat in egg', 'Add oats if using', 'Cook small spoonfuls 2-3 mins each side'],
    tips: 'No added sugar needed! Freeze extras between parchment.'
  },
  {
    id: 'egg-muffins', name: 'Veggie Egg Muffins', emoji: '🧁',
    ageFrom: 6, prepTime: '10 mins', cookTime: '15 mins', servings: '12 mini muffins', category: 'breakfast',
    tags: ['meal prep', 'freezable', 'protein'], popular: true, freezable: true,
    ingredients: ['4 eggs', '2 tbsp milk', 'Handful spinach, chopped', '2 tbsp cheese', '1/4 red pepper, diced'],
    instructions: ['Preheat oven 180°C', 'Whisk eggs and milk', 'Stir in veggies and cheese', 'Pour into greased mini muffin tin', 'Bake 12-15 mins'],
    tips: 'Freeze for up to 3 months. Reheat from frozen 30 secs.'
  },
  {
    id: 'overnight-oats', name: 'Baby Overnight Oats', emoji: '🥣',
    ageFrom: 6, prepTime: '5 mins', category: 'breakfast',
    tags: ['no-cook', 'meal prep', 'dairy'],
    ingredients: ['3 tbsp oats', '4 tbsp milk/formula', '1 tbsp yogurt', 'Mashed fruit of choice'],
    instructions: ['Mix oats, milk, yogurt in jar', 'Add mashed fruit', 'Refrigerate overnight', 'Serve cold or warm slightly'],
    tips: 'Prep 3-4 days worth at once!'
  },
  {
    id: 'french-toast', name: 'Baby French Toast Sticks', emoji: '🍞',
    ageFrom: 7, prepTime: '5 mins', cookTime: '10 mins', category: 'breakfast',
    tags: ['finger food', 'egg'], freezable: true,
    ingredients: ['1 egg', '2 tbsp milk', 'Pinch cinnamon', '1 slice bread'],
    instructions: ['Whisk egg, milk, cinnamon', 'Cut bread into strips', 'Dip in egg mixture', 'Pan fry until golden, 2-3 mins each side'],
    tips: 'Use whole grain bread for extra fiber.'
  },
  {
    id: 'chia-pudding', name: 'Chia Pudding', emoji: '🫐',
    ageFrom: 8, prepTime: '5 mins', category: 'breakfast',
    tags: ['no-cook', 'dairy-free option', 'omega-3'],
    ingredients: ['2 tbsp chia seeds', '1/2 cup milk', 'Mashed banana or berries'],
    instructions: ['Mix chia seeds and milk', 'Stir well to prevent clumps', 'Refrigerate 4 hours or overnight', 'Top with fruit before serving'],
    tips: 'Texture may need getting used to - blend if baby prefers smooth.'
  },
  // LUNCH
  {
    id: 'avo-toast', name: 'Loaded Avo Toast', emoji: '🥑',
    ageFrom: 6, prepTime: '5 mins', category: 'lunch',
    tags: ['quick', 'finger food', 'healthy fats'], popular: true,
    ingredients: ['1 slice bread', '1/4 avocado', 'Toppings: egg, cheese, hemp seeds'],
    instructions: ['Toast bread lightly', 'Mash and spread avocado', 'Add toppings of choice', 'Cut into finger strips'],
    tips: 'Sprinkle hemp seeds for extra omega-3 and grip.'
  },
  {
    id: 'quesadilla', name: 'Baby Quesadilla', emoji: '🧀',
    ageFrom: 7, prepTime: '5 mins', cookTime: '5 mins', category: 'lunch',
    tags: ['quick', 'cheese', 'customizable'], popular: true,
    ingredients: ['1 tortilla', 'Grated cheese', 'Optional: beans, avocado, chicken'],
    instructions: ['Sprinkle cheese on half tortilla', 'Add any fillings', 'Fold in half', 'Pan fry 2 mins each side until golden', 'Cool and cut into strips'],
    tips: 'Great way to use up leftovers!'
  },
  {
    id: 'pasta-pesto', name: 'Pesto Pasta', emoji: '🍝',
    ageFrom: 6, prepTime: '5 mins', cookTime: '15 mins', category: 'lunch',
    tags: ['quick', 'batch cook', 'freezable'], freezable: true,
    ingredients: ['Pasta shapes', '2 tbsp pesto (low salt)', 'Grated cheese', 'Optional: peas, chicken'],
    instructions: ['Cook pasta very soft', 'Drain and toss with pesto', 'Add cheese and any extras', 'Serve warm or cold'],
    tips: 'Make your own pesto to control salt. Basil + olive oil + parmesan.'
  },
  {
    id: 'veggie-fingers', name: 'Veggie Fritters', emoji: '🥕',
    ageFrom: 6, prepTime: '10 mins', cookTime: '20 mins', category: 'lunch',
    tags: ['hidden veg', 'freezable', 'batch cook'], popular: true, freezable: true,
    ingredients: ['1 courgette, grated', '1 carrot, grated', '1 egg', '3 tbsp flour', 'Optional: cheese'],
    instructions: ['Grate veg, squeeze out water', 'Mix with egg, flour, cheese', 'Form into finger shapes', 'Bake 180°C 20 mins, flip halfway'],
    tips: 'Squeeze veg really well or they will be soggy!'
  },
  {
    id: 'mini-meatballs', name: 'Mini Meatballs', emoji: '🧆',
    ageFrom: 6, prepTime: '15 mins', cookTime: '15 mins', servings: '20 meatballs', category: 'lunch',
    tags: ['protein', 'iron', 'freezable', 'batch cook'], popular: true, freezable: true,
    ingredients: ['250g beef or lamb mince', '1 grated courgette', '1 egg', '2 tbsp breadcrumbs', 'Herbs'],
    instructions: ['Mix all ingredients', 'Roll into small balls', 'Bake 180°C 15 mins', 'Ensure cooked through'],
    tips: 'Freeze raw or cooked. Great iron source!'
  },
  {
    id: 'hummus-wrap', name: 'Hummus Veggie Wrap', emoji: '🌯',
    ageFrom: 8, prepTime: '5 mins', category: 'lunch',
    tags: ['no-cook', 'quick', 'plant protein'],
    ingredients: ['1 tortilla', '2 tbsp hummus', 'Cucumber strips', 'Grated carrot', 'Avocado'],
    instructions: ['Spread hummus on tortilla', 'Add veggies in a line', 'Roll up tightly', 'Cut into pinwheels or strips'],
    tips: 'Make your own hummus for lower salt.'
  },
  {
    id: 'salmon-cakes', name: 'Salmon Fish Cakes', emoji: '🐟',
    ageFrom: 7, prepTime: '15 mins', cookTime: '10 mins', category: 'lunch',
    tags: ['omega-3', 'protein', 'freezable'], freezable: true,
    ingredients: ['1 tin salmon, drained', '1 small potato, mashed', '1 egg', 'Fresh dill or parsley'],
    instructions: ['Flake salmon, remove any bones', 'Mix with mashed potato, egg, herbs', 'Form into small patties', 'Pan fry 4-5 mins each side'],
    tips: 'Check thoroughly for bones! Tinned salmon is fine.'
  },
  // DINNER
  {
    id: 'hidden-veg-sauce', name: 'Hidden Veggie Pasta Sauce', emoji: '🍅',
    ageFrom: 6, prepTime: '10 mins', cookTime: '25 mins', category: 'dinner',
    tags: ['hidden veg', 'batch cook', 'freezable'], popular: true, freezable: true,
    ingredients: ['1 tin tomatoes', '1 carrot', '1 courgette', '1 red pepper', 'Garlic, olive oil, basil'],
    instructions: ['Sauté garlic 1 min', 'Add grated/diced veg, cook 5 mins', 'Add tomatoes and basil', 'Simmer 15 mins', 'Blend smooth'],
    tips: 'Make big batch and freeze in portions.'
  },
  {
    id: 'chicken-strips', name: 'Tender Chicken Strips', emoji: '🍗',
    ageFrom: 6, prepTime: '10 mins', cookTime: '25 mins', category: 'dinner',
    tags: ['protein', 'finger food', 'freezable'], freezable: true,
    ingredients: ['1 chicken breast', 'Olive oil', 'Pinch herbs', '2 tbsp breadcrumbs (optional)'],
    instructions: ['Cut chicken into strips', 'Coat in oil and herbs', 'Bake 190°C 20-25 mins', 'Ensure cooked through, shred for young babies'],
    tips: 'Don\'t overcook or it gets dry. Poach in stock for extra moisture.'
  },
  {
    id: 'lentil-dal', name: 'Baby Dal', emoji: '🍛',
    ageFrom: 6, prepTime: '5 mins', cookTime: '25 mins', category: 'dinner',
    tags: ['plant protein', 'iron', 'freezable', 'vegan'], freezable: true,
    ingredients: ['1 cup red lentils', '2 cups water/stock', '1 tsp mild curry spices', 'Coconut milk splash'],
    instructions: ['Rinse lentils', 'Simmer with water and spices 20-25 mins', 'Stir in coconut milk', 'Mash slightly or blend', 'Serve with rice'],
    tips: 'Babies can have spices! Start mild and increase.'
  },
  {
    id: 'shepherds-pie', name: 'Mini Shepherd\'s Pie', emoji: '🥧',
    ageFrom: 7, prepTime: '15 mins', cookTime: '30 mins', category: 'dinner',
    tags: ['comfort food', 'iron', 'freezable', 'one-pot'], freezable: true,
    ingredients: ['200g lamb mince', '1 carrot, diced', 'Peas', 'Gravy/stock', 'Mashed potato topping'],
    instructions: ['Brown mince, add veg', 'Add stock, simmer 15 mins', 'Transfer to dish, top with mash', 'Bake 180°C 15 mins until golden'],
    tips: 'Make in muffin tin for individual portions.'
  },
  {
    id: 'risotto', name: 'Baby Risotto', emoji: '🍚',
    ageFrom: 7, prepTime: '5 mins', cookTime: '25 mins', category: 'dinner',
    tags: ['one-pot', 'comfort food', 'customizable'],
    ingredients: ['1/2 cup risotto rice', '1.5 cups low salt stock', 'Butter', 'Parmesan', 'Peas or veg'],
    instructions: ['Toast rice in butter 1 min', 'Add stock gradually, stirring', 'Cook until creamy, ~20 mins', 'Stir in cheese and veg'],
    tips: 'Naturally soft and easy to eat. Add any veg!'
  },
  {
    id: 'fish-pie', name: 'Easy Fish Pie', emoji: '🐠',
    ageFrom: 7, prepTime: '15 mins', cookTime: '25 mins', category: 'dinner',
    tags: ['omega-3', 'comfort food', 'freezable'], freezable: true,
    ingredients: ['White fish fillet', 'Salmon fillet', 'Peas', 'White sauce', 'Mashed potato'],
    instructions: ['Poach fish in milk 8 mins', 'Flake fish, check for bones', 'Mix with peas and white sauce', 'Top with mash', 'Bake 180°C 15 mins'],
    tips: 'Use any fish. Batch cook and freeze portions.'
  },
  {
    id: 'mild-curry', name: 'Baby-Friendly Curry', emoji: '🍛',
    ageFrom: 8, prepTime: '10 mins', cookTime: '25 mins', category: 'dinner',
    tags: ['one-pot', 'spices', 'family meal'],
    ingredients: ['Chicken or chickpeas', 'Coconut milk', 'Tomatoes', 'Mild curry powder', 'Veg of choice'],
    instructions: ['Cook protein/chickpeas', 'Add veg, cook 5 mins', 'Add coconut milk, tomatoes, spices', 'Simmer 15 mins', 'Serve with rice'],
    tips: 'Babies can handle spices! Just avoid chili heat.'
  },
  // SNACKS
  {
    id: 'energy-balls', name: 'No-Bake Energy Balls', emoji: '⚡',
    ageFrom: 8, prepTime: '10 mins', category: 'snack',
    tags: ['no-cook', 'healthy', 'nut-free option'], popular: true,
    ingredients: ['1 cup oats', '1/2 cup nut/seed butter', '2 tbsp honey', 'Optional: coconut, choc chips'],
    instructions: ['Mix all ingredients', 'Roll into small balls', 'Refrigerate 30 mins', 'Store in fridge up to 1 week'],
    tips: 'Use sunflower seed butter for nut-free.'
  },
  {
    id: 'fruit-lollies', name: 'Fruit Yogurt Lollies', emoji: '🍦',
    ageFrom: 6, prepTime: '5 mins', category: 'snack',
    tags: ['frozen', 'teething', 'no sugar'],
    ingredients: ['1/2 cup yogurt', '1/2 cup fruit puree or mashed fruit'],
    instructions: ['Mix yogurt and fruit', 'Pour into lolly moulds', 'Freeze 4+ hours', 'Run under warm water to release'],
    tips: 'Great for teething! Use breast milk for younger babies.'
  },
  {
    id: 'cheese-crackers', name: 'Homemade Cheese Crackers', emoji: '🧀',
    ageFrom: 8, prepTime: '10 mins', cookTime: '12 mins', category: 'snack',
    tags: ['baked', 'finger food'],
    ingredients: ['100g cheese, grated', '100g flour', '50g butter', 'Water to bind'],
    instructions: ['Mix cheese, flour, butter', 'Add water to form dough', 'Roll thin, cut shapes', 'Bake 180°C 10-12 mins'],
    tips: 'Much lower salt than shop crackers!'
  },
  {
    id: 'banana-bread', name: 'Healthy Banana Bread', emoji: '🍌',
    ageFrom: 6, prepTime: '10 mins', cookTime: '45 mins', category: 'snack',
    tags: ['baked', 'no added sugar', 'freezable'], freezable: true,
    ingredients: ['3 ripe bananas', '2 eggs', '2 cups oats (blended to flour)', '1 tsp baking powder', 'Cinnamon'],
    instructions: ['Blend oats to flour', 'Mash bananas, mix in eggs', 'Add oat flour, baking powder, cinnamon', 'Bake 180°C 40-45 mins'],
    tips: 'Slice and freeze for quick breakfasts!'
  },
  {
    id: 'sweet-potato-toast', name: 'Sweet Potato Toast', emoji: '🍠',
    ageFrom: 6, prepTime: '2 mins', cookTime: '10 mins', category: 'snack',
    tags: ['grain-free', 'quick'],
    ingredients: ['1 sweet potato', 'Toppings: nut butter, avocado, banana'],
    instructions: ['Slice sweet potato lengthways, 1cm thick', 'Toast in toaster 2-3 cycles until soft', 'Top with favourite toppings'],
    tips: 'Great bread alternative! Keeps for a few days.'
  },
  // DESSERT
  {
    id: 'baked-apple', name: 'Baked Cinnamon Apple', emoji: '🍎',
    ageFrom: 6, prepTime: '5 mins', cookTime: '25 mins', category: 'dessert',
    tags: ['no sugar', 'simple', 'warm'],
    ingredients: ['1 apple', 'Butter', 'Cinnamon', 'Optional: oat crumble topping'],
    instructions: ['Core apple, score skin', 'Fill with butter and cinnamon', 'Bake 180°C 25 mins until soft', 'Cool slightly before serving'],
    tips: 'Naturally sweet dessert. Serve with yogurt.'
  },
  {
    id: 'rice-pudding', name: 'Creamy Rice Pudding', emoji: '🍚',
    ageFrom: 6, prepTime: '5 mins', cookTime: '30 mins', category: 'dessert',
    tags: ['comfort food', 'dairy'],
    ingredients: ['1/2 cup pudding rice', '2 cups milk', 'Vanilla', 'Cinnamon'],
    instructions: ['Combine rice and milk in pan', 'Simmer 25-30 mins, stirring often', 'Add vanilla and cinnamon', 'Serve warm or cold'],
    tips: 'Top with fruit puree for natural sweetness.'
  }
];

const categoryEmojis: Record<string, string> = {
  breakfast: '🍳', lunch: '🥪', dinner: '🍽️', snack: '🍪', dessert: '🍨'
};

const Weaning = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedSavedRecipe, setSelectedSavedRecipe] = useState<SavedRecipe | null>(null);
  const [activeTab, setActiveTab] = useState<'recipes' | 'foods' | 'saved'>('recipes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [babyAge, setBabyAge] = useState<string>('6');
  const [showFilters, setShowFilters] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  // Load saved recipes from localStorage
  useEffect(() => {
    const loadSavedRecipes = () => {
      try {
        const saved = localStorage.getItem(SAVED_RECIPES_KEY);
        if (saved) {
          setSavedRecipes(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load saved recipes:', e);
      }
    };
    loadSavedRecipes();
    // Listen for storage changes (in case saved from chat)
    window.addEventListener('storage', loadSavedRecipes);
    return () => window.removeEventListener('storage', loadSavedRecipes);
  }, []);

  const deleteSavedRecipe = (id: string) => {
    try {
      const updated = savedRecipes.filter(r => r.id !== id);
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
      setSavedRecipes(updated);
      setSelectedSavedRecipe(null);
    } catch (e) {
      console.error('Failed to delete recipe:', e);
    }
  };

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesMealType = selectedMealType === 'all' || recipe.category === selectedMealType;
      const matchesAge = recipe.ageFrom <= parseInt(babyAge);
      return matchesSearch && matchesMealType && matchesAge;
    });
  }, [searchQuery, selectedMealType, babyAge]);

  // Filter foods
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || food.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const foodCategories = ['all', ...new Set(foods.map(f => f.category))];
  const mealTypes = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'];

  const getServingForAge = (food: Food): string => {
    if (parseInt(babyAge) <= 6) return food.serving['6'];
    if (parseInt(babyAge) <= 8) return food.serving['7-8'];
    if (parseInt(babyAge) <= 12) return food.serving['9-12'];
    return food.serving['12+'];
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <div className="p-6 pb-3">
        <h1 className="text-2xl font-bold text-slate-800">Weaning Guide</h1>
        <p className="text-slate-500 mt-1">Foods, recipes & serving guides</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search foods or recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Age & Filter Row */}
      <div className="px-6 mb-3 flex gap-2">
        <select 
          value={babyAge}
          onChange={(e) => setBabyAge(e.target.value)}
          className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm"
        >
          <option value="6">6 months</option>
          <option value="7">7-8 months</option>
          <option value="9">9-12 months</option>
          <option value="13">12+ months</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-sm ${
            showFilters ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="px-6 mb-3 space-y-2">
          {activeTab === 'recipes' && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {mealTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedMealType === type 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All' : `${categoryEmojis[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'foods' && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {foodCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Foods' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'recipes' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'foods' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            Foods
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'saved' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Saved {savedRecipes.length > 0 && `(${savedRecipes.length})`}
          </button>
        </div>
      </div>

      {/* Popular Section (Recipes only) */}
      {activeTab === 'recipes' && !searchQuery && selectedMealType === 'all' && (
        <div className="px-6 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" /> Popular Recipes
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recipes.filter(r => r.popular && r.ageFrom <= parseInt(babyAge)).slice(0, 5).map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="flex-shrink-0 w-32 bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center"
              >
                <div className="text-3xl mb-1">{recipe.emoji}</div>
                <p className="text-xs font-medium text-slate-700 truncate">{recipe.name}</p>
                <p className="text-xs text-slate-400">{recipe.prepTime}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="px-6 space-y-2">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No recipes found matching your filters</p>
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left flex items-center gap-4"
              >
                <div className="text-4xl">{recipe.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{recipe.name}</p>
                    {recipe.freezable && <span className="text-xs text-blue-500">❄️</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.prepTime}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Baby className="h-3 w-3" />
                      {recipe.ageFrom}m+
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>
            ))
          )}
        </div>
      )}

      {activeTab === 'foods' && (
        <div className="px-6 grid grid-cols-3 gap-3">
          {filteredFoods.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-slate-500">
              <p>No foods found matching your search</p>
            </div>
          ) : (
            filteredFoods.map(food => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">{food.emoji}</div>
                <p className="text-sm font-medium text-slate-700">{food.name}</p>
                {food.allergen && (
                  <span className="text-xs text-amber-600 mt-1 block">⚠️</span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="px-6">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-700 mb-2">No saved recipes yet</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Chat with Nunu about recipes and tap the bookmark icon to save your favourites here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedRecipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedSavedRecipe(recipe)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 line-clamp-2">{recipe.content.slice(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                        <span>From: {recipe.conversationTitle}</span>
                        <span>•</span>
                        <span>{new Date(recipe.savedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
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
              <button onClick={() => setSelectedFood(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[65vh] space-y-5">
              <div className="bg-sky-50 rounded-xl p-4">
                <p className="text-xs text-sky-600 font-medium mb-1">
                  Serving at {babyAge === '6' ? '6 months' : babyAge === '7' ? '7-8 months' : babyAge === '9' ? '9-12 months' : '12+ months'}:
                </p>
                <p className="text-slate-700">{getServingForAge(selectedFood)}</p>
              </div>

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
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedRecipe.emoji}</span>
                <div>
                  <h2 className="font-semibold text-slate-800">{selectedRecipe.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedRecipe.prepTime}
                    </span>
                    {selectedRecipe.cookTime && (
                      <span>+ {selectedRecipe.cookTime} cook</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Baby className="h-3 w-3" />
                      {selectedRecipe.ageFrom}m+
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[70vh] space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedRecipe.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {tag}
                  </span>
                ))}
                {selectedRecipe.freezable && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    ❄️ Freezable
                  </span>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Ingredients:</h3>
                <ul className="space-y-1.5">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Method:</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
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

      {/* Saved Recipe Detail Modal */}
      {selectedSavedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Saved from Chat</h2>
                  <p className="text-xs text-slate-500">{selectedSavedRecipe.conversationTitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSavedRecipe(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[65vh]">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedSavedRecipe.content}
                </p>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Saved {new Date(selectedSavedRecipe.savedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => deleteSavedRecipe(selectedSavedRecipe.id)}
                className="w-full py-3 text-red-500 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete from saved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weaning;

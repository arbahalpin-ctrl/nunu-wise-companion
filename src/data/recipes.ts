export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  image: string;
  ageRange: '6+' | '7+' | '9+' | '12+';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'puree';
  allergens?: string[];
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  freezable: boolean;
  nutritionHighlights?: string[];
}

export const recipes: Recipe[] = [
  // ============ PUREES (6+ months) ============
  {
    id: 'sweet-potato-puree',
    name: 'Sweet Potato Puree',
    emoji: '🍠',
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7bbbc3?w=800',
    ageRange: '6+',
    prepTime: 5,
    cookTime: 25,
    servings: 8,
    category: 'puree',
    ingredients: [
      '2 medium sweet potatoes',
      'Breast milk, formula, or water for thinning'
    ],
    instructions: [
      'Peel and cube sweet potatoes',
      'Steam until very soft (about 20-25 minutes)',
      'Blend until smooth, adding liquid to reach desired consistency',
      'Cool before serving'
    ],
    tips: ['Great first food!', 'Freeze in ice cube trays for portions'],
    freezable: true,
    nutritionHighlights: ['Vitamin A', 'Fiber', 'Iron']
  },
  {
    id: 'apple-pear-puree',
    name: 'Apple & Pear Puree',
    emoji: '🍎',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2uj28?w=800',
    ageRange: '6+',
    prepTime: 10,
    cookTime: 15,
    servings: 6,
    category: 'puree',
    ingredients: [
      '2 apples, peeled and cored',
      '2 ripe pears, peeled and cored',
      'Pinch of cinnamon (optional)'
    ],
    instructions: [
      'Cube apples and pears',
      'Steam until soft (12-15 minutes)',
      'Blend until smooth, add cinnamon if using',
      'Cool and serve'
    ],
    tips: ['Naturally sweet - no sugar needed', 'Mix with oatmeal for breakfast'],
    freezable: true,
    nutritionHighlights: ['Vitamin C', 'Fiber']
  },
  {
    id: 'carrot-puree',
    name: 'Carrot Puree',
    emoji: '🥕',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
    ageRange: '6+',
    prepTime: 5,
    cookTime: 20,
    servings: 6,
    category: 'puree',
    ingredients: [
      '4 large carrots, peeled',
      'Water or breast milk for thinning'
    ],
    instructions: [
      'Slice carrots into rounds',
      'Steam until very tender (18-20 minutes)',
      'Blend until smooth',
      'Add liquid to thin if needed'
    ],
    tips: ['Buy organic carrots when possible', 'Great mixed with apple'],
    freezable: true,
    nutritionHighlights: ['Beta-carotene', 'Vitamin A']
  },
  {
    id: 'banana-avocado-mash',
    name: 'Banana Avocado Mash',
    emoji: '🍌',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
    ageRange: '6+',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    category: 'puree',
    ingredients: [
      '1 ripe banana',
      '1/2 ripe avocado'
    ],
    instructions: [
      'Mash banana and avocado together with a fork',
      'Mix until smooth or leave slightly chunky',
      'Serve immediately'
    ],
    tips: ['No cooking required!', 'Perfect travel food', 'Add breast milk to thin'],
    freezable: false,
    nutritionHighlights: ['Healthy fats', 'Potassium', 'Fiber']
  },
  {
    id: 'pea-mint-puree',
    name: 'Pea & Mint Puree',
    emoji: '🟢',
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800',
    ageRange: '6+',
    prepTime: 5,
    cookTime: 5,
    servings: 6,
    category: 'puree',
    ingredients: [
      '2 cups frozen peas',
      '2-3 fresh mint leaves (optional)',
      'Water for thinning'
    ],
    instructions: [
      'Boil or steam peas until tender (3-5 mins)',
      'Blend with mint leaves until smooth',
      'Push through sieve to remove skins for young babies',
      'Add water to thin'
    ],
    tips: ['Frozen peas are just as nutritious as fresh', 'Mint aids digestion'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Iron', 'Vitamin C']
  },
  {
    id: 'butternut-squash-puree',
    name: 'Butternut Squash Puree',
    emoji: '🎃',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800',
    ageRange: '6+',
    prepTime: 10,
    cookTime: 30,
    servings: 10,
    category: 'puree',
    ingredients: [
      '1 medium butternut squash',
      'Pinch of nutmeg (optional)'
    ],
    instructions: [
      'Peel, deseed and cube squash',
      'Roast at 200°C/400°F for 25-30 mins or steam',
      'Blend until smooth',
      'Add nutmeg if using'
    ],
    tips: ['Roasting brings out natural sweetness', 'Cut in half and roast to make peeling easier'],
    freezable: true,
    nutritionHighlights: ['Vitamin A', 'Vitamin C', 'Fiber']
  },

  // ============ BREAKFAST (7+ months) ============
  {
    id: 'baby-oatmeal',
    name: 'Creamy Baby Oatmeal',
    emoji: '🥣',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800',
    ageRange: '7+',
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    category: 'breakfast',
    ingredients: [
      '2 tbsp baby oats or ground oats',
      '1/4 cup breast milk, formula, or water',
      'Mashed banana or fruit puree'
    ],
    instructions: [
      'Combine oats and liquid in small pan',
      'Cook on low heat, stirring until thick',
      'Cool slightly and stir in fruit',
      'Serve warm'
    ],
    tips: ['Add nut butter for protein', 'Ground oats are easier for young babies'],
    freezable: false,
    nutritionHighlights: ['Iron', 'Fiber', 'B vitamins']
  },
  {
    id: 'egg-soldiers',
    name: 'Dippy Eggs & Soldiers',
    emoji: '🥚',
    image: 'https://images.unsplash.com/photo-1482049016gy-ab629fccc818?w=800',
    ageRange: '7+',
    prepTime: 2,
    cookTime: 6,
    servings: 1,
    category: 'breakfast',
    allergens: ['egg', 'gluten'],
    ingredients: [
      '1 egg',
      '1 slice bread, toasted',
      'Butter (optional)'
    ],
    instructions: [
      'Soft boil egg for 6-7 minutes',
      'Toast bread and cut into strips (soldiers)',
      'Place egg in cup and slice top off',
      'Baby can dip soldiers or you can spoon-feed yolk'
    ],
    tips: ['Ensure yolk is cooked through for babies under 12m', 'Great for self-feeding practice'],
    freezable: false,
    nutritionHighlights: ['Protein', 'Choline', 'Iron']
  },
  {
    id: 'banana-pancakes',
    name: 'Baby Banana Pancakes',
    emoji: '🥞',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    ageRange: '7+',
    prepTime: 5,
    cookTime: 10,
    servings: 8,
    category: 'breakfast',
    allergens: ['egg'],
    ingredients: [
      '1 ripe banana',
      '1 egg',
      '2 tbsp oat flour or ground oats',
      'Pinch of cinnamon'
    ],
    instructions: [
      'Mash banana and mix with beaten egg',
      'Stir in oat flour and cinnamon',
      'Cook small pancakes in non-stick pan on medium heat',
      'Flip when bubbles form (2-3 mins each side)',
      'Cool before serving'
    ],
    tips: ['Great finger food', 'Can cut into strips for easy gripping'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Potassium', 'Fiber']
  },
  {
    id: 'french-toast-fingers',
    name: 'French Toast Fingers',
    emoji: '🍞',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800',
    ageRange: '9+',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    category: 'breakfast',
    allergens: ['egg', 'gluten', 'dairy'],
    ingredients: [
      '2 slices bread',
      '1 egg',
      '2 tbsp milk',
      'Pinch of cinnamon',
      'Butter for cooking'
    ],
    instructions: [
      'Whisk egg, milk and cinnamon together',
      'Cut bread into fingers/strips',
      'Dip each strip in egg mixture',
      'Fry in buttered pan until golden (2-3 mins each side)',
      'Cool slightly before serving'
    ],
    tips: ['Use thick bread for easier gripping', 'Serve with fruit puree for dipping'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Carbohydrates']
  },
  {
    id: 'overnight-oats',
    name: 'Baby Overnight Oats',
    emoji: '🫙',
    image: 'https://images.unsplash.com/photo-1557275357-072087771588?w=800',
    ageRange: '9+',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    category: 'breakfast',
    allergens: ['dairy'],
    ingredients: [
      '1/4 cup rolled oats',
      '1/3 cup full-fat yogurt',
      '1/4 cup milk',
      'Mashed berries or banana'
    ],
    instructions: [
      'Mix oats, yogurt and milk in a jar',
      'Refrigerate overnight',
      'In morning, stir in mashed fruit',
      'Serve cold or warm slightly'
    ],
    tips: ['Prep night before for busy mornings', 'Add chia seeds for omega-3s'],
    freezable: false,
    nutritionHighlights: ['Fiber', 'Protein', 'Probiotics']
  },

  // ============ LUNCH (7+ months) ============
  {
    id: 'veggie-loaded-pasta',
    name: 'Veggie Loaded Pasta',
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    ageRange: '7+',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    category: 'lunch',
    allergens: ['gluten'],
    ingredients: [
      '100g small pasta shapes',
      '1 carrot, grated',
      '1 courgette, grated',
      '1/2 cup passata or tomato puree',
      'Pinch of dried basil'
    ],
    instructions: [
      'Cook pasta according to package',
      'Steam or sauté grated veggies until soft',
      'Mix pasta, veggies and passata',
      'Add basil and mix well',
      'Mash slightly for younger babies'
    ],
    tips: ['Great way to hide veggies', 'Use any veg you have'],
    freezable: true,
    nutritionHighlights: ['Fiber', 'Vitamin A', 'Carbohydrates']
  },
  {
    id: 'cheesy-broccoli-bites',
    name: 'Cheesy Broccoli Bites',
    emoji: '🥦',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
    ageRange: '9+',
    prepTime: 10,
    cookTime: 20,
    servings: 12,
    category: 'lunch',
    allergens: ['dairy', 'egg', 'gluten'],
    ingredients: [
      '2 cups broccoli, finely chopped',
      '1/2 cup grated cheddar',
      '1 egg',
      '1/4 cup breadcrumbs'
    ],
    instructions: [
      'Steam broccoli until soft, drain well',
      'Mash broccoli and mix with cheese, egg and breadcrumbs',
      'Form into small patties',
      'Bake at 180°C/350°F for 15-20 mins until golden'
    ],
    tips: ['Perfect finger food', 'Great for lunch boxes'],
    freezable: true,
    nutritionHighlights: ['Calcium', 'Vitamin C', 'Protein']
  },
  {
    id: 'chicken-veggie-mash',
    name: 'Chicken & Veggie Mash',
    emoji: '🍗',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ageRange: '7+',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    category: 'lunch',
    ingredients: [
      '1 chicken breast',
      '1 potato, cubed',
      '1 carrot, sliced',
      '1/2 cup peas',
      'Low-sodium chicken stock'
    ],
    instructions: [
      'Poach chicken in stock until cooked through',
      'Steam potato, carrot and peas',
      'Shred chicken finely',
      'Mash veggies and mix with chicken',
      'Add stock to reach desired consistency'
    ],
    tips: ['First meat meal for many babies', 'Batch cook and freeze'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Iron', 'Vitamin A']
  },
  {
    id: 'lentil-soup',
    name: 'Creamy Red Lentil Soup',
    emoji: '🥣',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    ageRange: '7+',
    prepTime: 10,
    cookTime: 30,
    servings: 6,
    category: 'lunch',
    ingredients: [
      '1 cup red lentils, rinsed',
      '1 carrot, diced',
      '1 celery stick, diced',
      '1/2 onion, diced',
      '3 cups low-sodium veg stock',
      'Pinch of cumin'
    ],
    instructions: [
      'Sauté onion, carrot and celery until soft',
      'Add lentils, stock and cumin',
      'Simmer for 25-30 mins until lentils are soft',
      'Blend until smooth or leave chunky for older babies'
    ],
    tips: ['High in protein - great meat alternative', 'Freezes beautifully'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Iron', 'Fiber']
  },
  {
    id: 'fish-pie-mash',
    name: 'Mini Fish Pie',
    emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
    ageRange: '7+',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    category: 'lunch',
    allergens: ['fish', 'dairy'],
    ingredients: [
      '150g white fish (cod/haddock)',
      '2 potatoes, cubed',
      '1/4 cup peas',
      '2 tbsp butter',
      '2 tbsp milk',
      'Pinch of parsley'
    ],
    instructions: [
      'Poach fish in milk until flaky',
      'Boil potatoes, mash with butter and milk',
      'Flake fish, checking carefully for bones',
      'Mix fish and peas, top with mash',
      'Bake at 180°C for 15 mins if desired'
    ],
    tips: ['Check thoroughly for bones', 'Great source of omega-3'],
    freezable: true,
    nutritionHighlights: ['Omega-3', 'Protein', 'Vitamin D']
  },
  {
    id: 'hummus-veggie-wrap',
    name: 'Hummus Veggie Pinwheels',
    emoji: '🌯',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
    ageRange: '9+',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    category: 'lunch',
    allergens: ['sesame', 'gluten'],
    ingredients: [
      '1 soft tortilla wrap',
      '2 tbsp hummus',
      '1/4 avocado, mashed',
      'Grated carrot',
      'Cucumber, finely diced'
    ],
    instructions: [
      'Spread hummus and avocado on wrap',
      'Sprinkle with carrot and cucumber',
      'Roll up tightly',
      'Slice into pinwheels'
    ],
    tips: ['Great for BLW', 'Make your own hummus with less tahini for younger babies'],
    freezable: false,
    nutritionHighlights: ['Protein', 'Healthy fats', 'Fiber']
  },
  {
    id: 'tomato-risotto',
    name: 'Tomato & Veg Risotto',
    emoji: '🍚',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
    ageRange: '7+',
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    category: 'lunch',
    ingredients: [
      '1/2 cup arborio rice',
      '1 cup passata',
      '1.5 cups low-sodium veg stock',
      '1/2 courgette, grated',
      '1 tbsp butter',
      'Pinch of basil'
    ],
    instructions: [
      'Toast rice in butter for 1 min',
      'Add passata and stir',
      'Gradually add stock, stirring frequently',
      'Stir in courgette in last 5 mins',
      'Cook until rice is soft and creamy'
    ],
    tips: ['The stirring is key for creamy texture', 'Add grated cheese for extra calcium'],
    freezable: true,
    nutritionHighlights: ['Carbohydrates', 'Lycopene', 'Vitamins']
  },

  // ============ DINNER (7+ months) ============
  {
    id: 'beef-stew',
    name: 'Baby Beef Stew',
    emoji: '🥩',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800',
    ageRange: '7+',
    prepTime: 15,
    cookTime: 90,
    servings: 6,
    category: 'dinner',
    ingredients: [
      '200g beef stewing steak, cubed small',
      '2 potatoes, cubed',
      '2 carrots, sliced',
      '1 cup low-sodium beef stock',
      'Pinch of thyme'
    ],
    instructions: [
      'Brown beef in pan',
      'Add to slow cooker or pot with veggies and stock',
      'Cook on low 6-8 hours (slow cooker) or simmer 90 mins',
      'Shred beef finely and mash veggies',
      'Mix together with cooking liquid'
    ],
    tips: ['Slow cooking makes beef super tender', 'Great iron source'],
    freezable: true,
    nutritionHighlights: ['Iron', 'Protein', 'Zinc']
  },
  {
    id: 'salmon-sweet-potato',
    name: 'Salmon & Sweet Potato Mash',
    emoji: '🐠',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ageRange: '7+',
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    category: 'dinner',
    allergens: ['fish'],
    ingredients: [
      '1 salmon fillet (100g)',
      '1 sweet potato',
      '1/2 cup peas',
      '1 tbsp butter'
    ],
    instructions: [
      'Bake salmon at 180°C for 15 mins',
      'Steam sweet potato until soft',
      'Steam peas',
      'Flake salmon (remove any bones)',
      'Mash sweet potato with butter, mix in salmon and peas'
    ],
    tips: ['Omega-3 is great for brain development', 'Wild salmon has fewer contaminants'],
    freezable: true,
    nutritionHighlights: ['Omega-3', 'Protein', 'Vitamin A']
  },
  {
    id: 'mild-chicken-curry',
    name: 'Mild Baby Chicken Curry',
    emoji: '🍛',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    category: 'dinner',
    allergens: ['dairy'],
    ingredients: [
      '1 chicken breast, cubed',
      '1/2 cup coconut milk',
      '1/2 cup tomato passata',
      '1/4 tsp mild curry powder',
      '1/2 cup mixed veg (peas, carrot)',
      'Rice to serve'
    ],
    instructions: [
      'Sauté chicken until cooked through',
      'Add curry powder, stir 30 seconds',
      'Add coconut milk, passata and veg',
      'Simmer 15-20 mins',
      'Serve with well-cooked rice'
    ],
    tips: ['Introduce spices early to develop palate', 'Mild curry powder has no heat'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Healthy fats', 'Iron']
  },
  {
    id: 'shepherds-pie',
    name: "Mini Shepherd's Pie",
    emoji: '🥧',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    category: 'dinner',
    ingredients: [
      '200g lamb mince',
      '3 potatoes, cubed',
      '1 carrot, finely diced',
      '1/2 cup peas',
      '1/2 cup low-sodium stock',
      '2 tbsp butter, milk for mash'
    ],
    instructions: [
      'Brown mince, drain any fat',
      'Add carrot, peas and stock, simmer 15 mins',
      'Boil potatoes, mash with butter and milk',
      'Put meat in dish, top with mash',
      'Bake 200°C for 20 mins until golden'
    ],
    tips: ['Use beef mince for cottage pie', 'Individual portions freeze well'],
    freezable: true,
    nutritionHighlights: ['Iron', 'Protein', 'Vitamin B12']
  },
  {
    id: 'veggie-bolognese',
    name: 'Hidden Veggie Bolognese',
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800',
    ageRange: '7+',
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    category: 'dinner',
    allergens: ['gluten'],
    ingredients: [
      '200g beef mince',
      '1 tin chopped tomatoes',
      '1 carrot, grated',
      '1 courgette, grated',
      '1/2 red pepper, finely diced',
      'Pinch of oregano',
      'Pasta to serve'
    ],
    instructions: [
      'Brown mince in pan',
      'Add all grated veggies, cook 5 mins',
      'Add tomatoes and oregano',
      'Simmer 30 mins until thick',
      'Blend for younger babies or serve chunky'
    ],
    tips: ['Grated veggies disappear into the sauce', 'Batch cook and freeze in portions'],
    freezable: true,
    nutritionHighlights: ['Iron', 'Vitamin C', 'Protein']
  },
  {
    id: 'mac-and-cheese',
    name: 'Veggie Mac & Cheese',
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800',
    ageRange: '9+',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    category: 'dinner',
    allergens: ['dairy', 'gluten'],
    ingredients: [
      '150g macaroni',
      '1/2 cup grated cheddar',
      '1/4 cup milk',
      '1 tbsp butter',
      '1/2 cup butternut squash puree',
      '1/2 cup steamed broccoli, chopped'
    ],
    instructions: [
      'Cook pasta until soft',
      'Melt butter, add milk and cheese, stir until smooth',
      'Stir in squash puree (adds creaminess and veg!)',
      'Mix sauce with pasta and broccoli'
    ],
    tips: ['Squash makes sauce creamier and adds vitamins', 'Kids never notice the squash!'],
    freezable: true,
    nutritionHighlights: ['Calcium', 'Protein', 'Vitamin A']
  },
  {
    id: 'veggie-fritters',
    name: 'Rainbow Veggie Fritters',
    emoji: '🌈',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 15,
    servings: 10,
    category: 'dinner',
    allergens: ['egg', 'gluten'],
    ingredients: [
      '1 courgette, grated',
      '1 carrot, grated',
      '1/2 cup corn kernels',
      '1 egg',
      '3 tbsp flour',
      '2 tbsp grated parmesan'
    ],
    instructions: [
      'Squeeze excess water from grated veggies',
      'Mix all ingredients together',
      'Form into small patties',
      'Pan fry in a little oil 3-4 mins each side',
      'Drain on paper towel'
    ],
    tips: ['Squeezing out water is key for crispy fritters', 'Great with yogurt dip'],
    freezable: true,
    nutritionHighlights: ['Fiber', 'Vitamins A & C', 'Protein']
  },

  // ============ SNACKS (9+ months) ============
  {
    id: 'energy-balls',
    name: 'Baby Energy Balls',
    emoji: '⚡',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 0,
    servings: 15,
    category: 'snack',
    allergens: ['nuts', 'dairy'],
    ingredients: [
      '1 cup rolled oats',
      '1/2 cup peanut butter or almond butter',
      '1/4 cup honey (for 12m+) or mashed banana',
      '2 tbsp ground flaxseed',
      '2 tbsp mini chocolate chips (optional, 12m+)'
    ],
    instructions: [
      'Mix all ingredients in a bowl',
      'Refrigerate 30 mins to firm up',
      'Roll into small balls',
      'Store in fridge for up to 1 week'
    ],
    tips: ['No honey for under 12 months - use banana instead', 'Great on-the-go snack'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Healthy fats', 'Energy']
  },
  {
    id: 'fruit-yogurt-bark',
    name: 'Frozen Yogurt Bark',
    emoji: '🍦',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    ageRange: '9+',
    prepTime: 10,
    cookTime: 0,
    servings: 8,
    category: 'snack',
    allergens: ['dairy'],
    ingredients: [
      '1 cup Greek yogurt',
      '1/4 cup mixed berries, chopped small',
      '1 tbsp chia seeds',
      '1/2 banana, sliced thin'
    ],
    instructions: [
      'Spread yogurt on baking sheet lined with parchment',
      'Scatter fruit, seeds and banana on top',
      'Freeze for 2+ hours',
      'Break into pieces'
    ],
    tips: ['Great for teething!', 'Supervise - melts and can be slippery'],
    freezable: true,
    nutritionHighlights: ['Calcium', 'Probiotics', 'Antioxidants']
  },
  {
    id: 'cheese-crackers',
    name: 'Homemade Cheese Crackers',
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 15,
    servings: 20,
    category: 'snack',
    allergens: ['dairy', 'gluten'],
    ingredients: [
      '1 cup grated cheddar',
      '1/2 cup flour',
      '2 tbsp cold butter',
      '2 tbsp water'
    ],
    instructions: [
      'Mix cheese, flour and butter until crumbly',
      'Add water, form into dough',
      'Roll thin and cut into small shapes',
      'Bake 180°C for 12-15 mins until golden'
    ],
    tips: ['So much better than store-bought', 'No added salt needed'],
    freezable: true,
    nutritionHighlights: ['Calcium', 'Protein']
  },
  {
    id: 'banana-bread',
    name: 'Baby Banana Bread',
    emoji: '🍞',
    image: 'https://images.unsplash.com/photo-1606101273945-e9eba91d7f1b?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 45,
    servings: 12,
    category: 'snack',
    allergens: ['egg', 'gluten'],
    ingredients: [
      '3 ripe bananas, mashed',
      '1/3 cup melted coconut oil',
      '1 egg',
      '1.5 cups whole wheat flour',
      '1 tsp baking soda',
      '1 tsp cinnamon'
    ],
    instructions: [
      'Mix mashed banana, oil and egg',
      'Add flour, baking soda and cinnamon',
      'Pour into greased loaf tin',
      'Bake 180°C for 40-45 mins',
      'Cool before slicing'
    ],
    tips: ['No added sugar - sweetened by banana only', 'Freeze slices for quick snacks'],
    freezable: true,
    nutritionHighlights: ['Potassium', 'Fiber', 'Energy']
  },
  {
    id: 'sweet-potato-fries',
    name: 'Baked Sweet Potato Fries',
    emoji: '🍟',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800',
    ageRange: '9+',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    category: 'snack',
    ingredients: [
      '2 sweet potatoes',
      '1 tbsp olive oil',
      'Pinch of paprika (optional)'
    ],
    instructions: [
      'Cut sweet potato into thick chip shapes',
      'Toss with oil and paprika',
      'Spread on baking tray',
      'Bake 200°C for 25-30 mins, turning halfway',
      'Cool slightly before serving'
    ],
    tips: ['Cut thick for easy gripping', 'Soft enough for gums'],
    freezable: true,
    nutritionHighlights: ['Vitamin A', 'Fiber', 'Vitamin C']
  },
  {
    id: 'apple-cinnamon-muffins',
    name: 'Apple Cinnamon Muffins',
    emoji: '🧁',
    image: 'https://images.unsplash.com/photo-1558303472-3f9c7eb7e4dc?w=800',
    ageRange: '9+',
    prepTime: 15,
    cookTime: 20,
    servings: 12,
    category: 'snack',
    allergens: ['egg', 'gluten', 'dairy'],
    ingredients: [
      '1.5 cups whole wheat flour',
      '1 tsp baking powder',
      '1 tsp cinnamon',
      '1 apple, grated',
      '1 egg',
      '1/4 cup melted butter',
      '1/2 cup milk',
      '1/4 cup unsweetened applesauce'
    ],
    instructions: [
      'Mix dry ingredients',
      'Whisk wet ingredients separately',
      'Combine wet and dry, fold in grated apple',
      'Divide into mini muffin tin',
      'Bake 180°C for 18-20 mins'
    ],
    tips: ['Mini muffins are perfect portion size', 'Great for breakfast too'],
    freezable: true,
    nutritionHighlights: ['Fiber', 'Iron', 'Vitamins']
  },
  {
    id: 'hummus',
    name: 'Baby-Friendly Hummus',
    emoji: '🥙',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800',
    ageRange: '9+',
    prepTime: 10,
    cookTime: 0,
    servings: 8,
    category: 'snack',
    allergens: ['sesame'],
    ingredients: [
      '1 can chickpeas, drained and rinsed',
      '2 tbsp tahini (or use less for young babies)',
      '2 tbsp olive oil',
      '1 clove garlic',
      'Juice of 1/2 lemon',
      '2 tbsp water'
    ],
    instructions: [
      'Blend all ingredients until smooth',
      'Add more water for thinner consistency',
      'Serve with soft veggie sticks or pita'
    ],
    tips: ['Great allergen intro (sesame)', 'Reduce tahini for younger babies'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Iron', 'Fiber']
  },

  // ============ TODDLER MEALS (12+ months) ============
  {
    id: 'chicken-nuggets',
    name: 'Homemade Chicken Nuggets',
    emoji: '🍗',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
    ageRange: '12+',
    prepTime: 20,
    cookTime: 20,
    servings: 15,
    category: 'lunch',
    allergens: ['egg', 'gluten'],
    ingredients: [
      '2 chicken breasts',
      '1 cup breadcrumbs',
      '1/4 cup grated parmesan',
      '1 egg, beaten',
      '1/2 tsp garlic powder',
      '1/2 tsp paprika'
    ],
    instructions: [
      'Cut chicken into nugget-sized pieces',
      'Mix breadcrumbs, parmesan and seasonings',
      'Dip chicken in egg, then breadcrumb mixture',
      'Place on baking tray',
      'Bake 200°C for 15-20 mins, turning halfway'
    ],
    tips: ['So much healthier than store-bought', 'Batch cook and freeze'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Iron']
  },
  {
    id: 'fish-fingers',
    name: 'Homemade Fish Fingers',
    emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800',
    ageRange: '12+',
    prepTime: 15,
    cookTime: 15,
    servings: 10,
    category: 'lunch',
    allergens: ['fish', 'egg', 'gluten'],
    ingredients: [
      '2 white fish fillets (cod/haddock)',
      '1/2 cup breadcrumbs',
      '1 egg, beaten',
      '2 tbsp flour',
      'Pinch of paprika'
    ],
    instructions: [
      'Cut fish into finger shapes',
      'Coat in flour, then egg, then breadcrumbs',
      'Place on baking tray',
      'Bake 200°C for 12-15 mins until golden',
      'Check fish is cooked through'
    ],
    tips: ['Check for bones before coating', 'Serve with peas and mash'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Omega-3', 'Iodine']
  },
  {
    id: 'mini-meatballs',
    name: 'Mini Meatballs in Tomato Sauce',
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
    ageRange: '12+',
    prepTime: 20,
    cookTime: 25,
    servings: 20,
    category: 'dinner',
    allergens: ['egg', 'gluten'],
    ingredients: [
      '300g beef or turkey mince',
      '1/4 cup breadcrumbs',
      '1 egg',
      '1 grated courgette',
      '1 tin chopped tomatoes',
      'Pinch of oregano'
    ],
    instructions: [
      'Mix mince, breadcrumbs, egg and courgette',
      'Roll into small balls (toddler bite-sized)',
      'Brown meatballs in pan',
      'Add tomatoes and oregano, simmer 15 mins',
      'Serve with pasta or mash'
    ],
    tips: ['Hidden veggies in the meatballs!', 'Perfect freezer meal'],
    freezable: true,
    nutritionHighlights: ['Iron', 'Protein', 'Zinc']
  },
  {
    id: 'quesadilla',
    name: 'Veggie Quesadilla',
    emoji: '🌮',
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b0?w=800',
    ageRange: '12+',
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    category: 'lunch',
    allergens: ['dairy', 'gluten'],
    ingredients: [
      '2 small tortillas',
      '1/2 cup grated cheese',
      '2 tbsp refried beans or mashed black beans',
      '1/4 avocado, mashed',
      'Diced tomato'
    ],
    instructions: [
      'Spread beans on one tortilla',
      'Top with cheese and tomato',
      'Place second tortilla on top',
      'Cook in dry pan 3-4 mins each side until golden',
      'Cut into triangles, serve with avocado'
    ],
    tips: ['Great finger food', 'Add chicken for extra protein'],
    freezable: false,
    nutritionHighlights: ['Calcium', 'Protein', 'Fiber']
  },
  {
    id: 'fried-rice',
    name: 'Veggie Fried Rice',
    emoji: '🍚',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    ageRange: '12+',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    category: 'dinner',
    allergens: ['egg', 'soy'],
    ingredients: [
      '2 cups cooked rice (day-old is best)',
      '1 egg, beaten',
      '1/2 cup mixed veg (peas, corn, carrot)',
      '1 tbsp low-sodium soy sauce',
      '1 tsp sesame oil',
      '2 spring onions, sliced'
    ],
    instructions: [
      'Scramble egg in wok, set aside',
      'Stir-fry vegetables 2 mins',
      'Add rice, stir-fry 3 mins',
      'Add soy sauce, sesame oil and egg',
      'Toss with spring onions'
    ],
    tips: ['Great way to use leftover rice', 'Add tofu or chicken for protein'],
    freezable: true,
    nutritionHighlights: ['Carbohydrates', 'Protein', 'Vegetables']
  },
  {
    id: 'pizza-toast',
    name: 'Pizza Toast',
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    ageRange: '12+',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    category: 'lunch',
    allergens: ['dairy', 'gluten'],
    ingredients: [
      '2 slices bread',
      '2 tbsp tomato passata',
      '1/4 cup grated mozzarella',
      'Toppings: mushroom, pepper, sweetcorn'
    ],
    instructions: [
      'Toast bread lightly',
      'Spread passata on each slice',
      'Add cheese and toppings',
      'Grill until cheese is melted and bubbly',
      'Cool and cut into strips'
    ],
    tips: ['Fun to make together!', 'Let toddler choose toppings'],
    freezable: false,
    nutritionHighlights: ['Calcium', 'Carbohydrates', 'Lycopene']
  },
  {
    id: 'pasta-bake',
    name: 'Cheesy Pasta Bake',
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    ageRange: '12+',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    category: 'dinner',
    allergens: ['dairy', 'gluten'],
    ingredients: [
      '200g pasta',
      '1 tin chopped tomatoes',
      '1 cup grated cheddar',
      '1 courgette, grated',
      '100g ham or chicken, diced (optional)',
      '1/2 cup cream cheese'
    ],
    instructions: [
      'Cook pasta, drain',
      'Mix pasta with tomatoes, cream cheese, courgette and meat',
      'Pour into baking dish',
      'Top with grated cheddar',
      'Bake 180°C for 25 mins until golden and bubbling'
    ],
    tips: ['Great batch cook meal', 'Sneak in extra veggies'],
    freezable: true,
    nutritionHighlights: ['Calcium', 'Protein', 'Carbohydrates']
  },
  {
    id: 'smoothie-bowl',
    name: 'Berry Smoothie Bowl',
    emoji: '🫐',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
    ageRange: '12+',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    category: 'breakfast',
    allergens: ['dairy'],
    ingredients: [
      '1/2 cup frozen mixed berries',
      '1/2 banana',
      '1/4 cup Greek yogurt',
      'Splash of milk',
      'Toppings: granola, sliced banana, berries'
    ],
    instructions: [
      'Blend frozen berries, banana, yogurt and milk',
      'Pour into bowl (should be thick)',
      'Add toppings',
      'Serve immediately'
    ],
    tips: ['Thicker than a smoothie so easier to eat with spoon', 'Fun for toddlers to add toppings'],
    freezable: false,
    nutritionHighlights: ['Antioxidants', 'Vitamin C', 'Probiotics']
  },
  {
    id: 'veggie-omelette',
    name: 'Veggie Omelette Strips',
    emoji: '🥚',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
    ageRange: '12+',
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    category: 'breakfast',
    allergens: ['egg', 'dairy'],
    ingredients: [
      '2 eggs',
      '1 tbsp milk',
      '2 tbsp grated cheese',
      '2 tbsp diced vegetables (peppers, tomato, spinach)',
      'Butter for cooking'
    ],
    instructions: [
      'Whisk eggs with milk',
      'Melt butter in pan over medium heat',
      'Pour in eggs, let set slightly',
      'Add cheese and veggies to one half',
      'Fold over, cook 1-2 mins more',
      'Cut into strips for easy eating'
    ],
    tips: ['Great protein-packed breakfast', 'Use any leftover veggies'],
    freezable: false,
    nutritionHighlights: ['Protein', 'Choline', 'Vitamins']
  },
  {
    id: 'spaghetti-carbonara',
    name: 'Baby-Friendly Carbonara',
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    ageRange: '12+',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    category: 'dinner',
    allergens: ['egg', 'dairy', 'gluten'],
    ingredients: [
      '200g spaghetti',
      '2 egg yolks',
      '1/4 cup grated parmesan',
      '1/4 cup cream',
      '1/2 cup peas',
      '50g ham, diced (optional)'
    ],
    instructions: [
      'Cook spaghetti until soft',
      'Mix egg yolks, parmesan and cream',
      'Drain pasta, return to warm pan (off heat)',
      'Quickly stir in egg mixture (residual heat cooks it)',
      'Add peas and ham, toss well'
    ],
    tips: ['The heat from pasta cooks the egg', 'Creamy without being too rich'],
    freezable: false,
    nutritionHighlights: ['Protein', 'Calcium', 'Carbohydrates']
  },
  {
    id: 'chicken-stir-fry',
    name: 'Toddler Chicken Stir-Fry',
    emoji: '🥡',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    ageRange: '12+',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    category: 'dinner',
    allergens: ['soy'],
    ingredients: [
      '1 chicken breast, sliced thin',
      '1 cup mixed veg (broccoli, peppers, snap peas)',
      '1 tbsp low-sodium soy sauce',
      '1 tsp honey',
      '1/2 tsp ginger, grated',
      'Noodles or rice to serve'
    ],
    instructions: [
      'Stir-fry chicken until cooked, set aside',
      'Stir-fry vegetables 3-4 mins',
      'Return chicken, add soy sauce, honey and ginger',
      'Toss well, cook 1 min more',
      'Serve over noodles or rice'
    ],
    tips: ['Cut everything small for little mouths', 'Great way to introduce Asian flavours'],
    freezable: true,
    nutritionHighlights: ['Protein', 'Vegetables', 'Iron']
  }
];

// Helper function to filter recipes by age
export const getRecipesForAge = (ageMonths: number): Recipe[] => {
  return recipes.filter(recipe => {
    const minAge = parseInt(recipe.ageRange);
    return ageMonths >= minAge;
  });
};

// Helper function to filter by category
export const getRecipesByCategory = (category: Recipe['category']): Recipe[] => {
  return recipes.filter(recipe => recipe.category === category);
};

// Get recipe categories with counts
export const getRecipeCategories = (): { name: string; count: number; emoji: string }[] => {
  const categories: { name: Recipe['category']; emoji: string }[] = [
    { name: 'breakfast', emoji: '🌅' },
    { name: 'lunch', emoji: '🥪' },
    { name: 'dinner', emoji: '🍽️' },
    { name: 'snack', emoji: '🍪' },
    { name: 'puree', emoji: '🥣' }
  ];

  return categories.map(cat => ({
    name: cat.name,
    emoji: cat.emoji,
    count: recipes.filter(r => r.category === cat.name).length
  }));
};

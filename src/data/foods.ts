export interface Food {
  id: string;
  name: string;
  emoji: string;
  image: string; // Unsplash image URL
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

// Unsplash image URLs for foods (free to use with attribution)
export const foods: Food[] = [
  // ============ FRUITS ============
  {
    id: 'banana', name: 'Banana', emoji: '🍌', 
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Mash well or serve as long spears (half banana lengthways)',
      '7-8': 'Soft chunks or spears, slightly less mashed',
      '9-12': 'Small bite-sized pieces or whole to hold',
      '12+': 'Sliced rounds, chunks, or whole'
    },
    tips: ['Great first food', 'Roll in baby cereal for grip if slippery', 'Ripe = easier to digest']
  },
  {
    id: 'avocado', name: 'Avocado', emoji: '🥑', 
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Mashed or long slices with skin on for grip',
      '7-8': 'Soft chunks or strips',
      '9-12': 'Cubed pieces, add to other foods',
      '12+': 'Slices, chunks, or spread on toast'
    },
    tips: ['Nutrient-dense first food', 'Leave skin on for grip', 'Roll in hemp seeds if slippery']
  },
  {
    id: 'strawberry', name: 'Strawberries', emoji: '🍓', 
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Mashed or very large whole to gnaw',
      '7-8': 'Halved or quartered lengthways',
      '9-12': 'Quartered or small pieces',
      '12+': 'Halved or whole'
    },
    tips: ['Quarter lengthways for safety', 'May cause contact rash (not allergy)', 'High in vitamin C']
  },
  {
    id: 'blueberry', name: 'Blueberries', emoji: '🫐', 
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Mashed or flattened/squished',
      '7-8': 'Flattened or quartered',
      '9-12': 'Quartered or smashed',
      '12+': 'Halved or whole if chewing well'
    },
    tips: ['Always flatten or squish - round shape is choking hazard', 'High in antioxidants', 'Frozen work well for teething'],
    warnings: ['Never serve whole until 4+ years']
  },
  {
    id: 'raspberry', name: 'Raspberries', emoji: '🍇', 
    image: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Mashed or gently pressed',
      '7-8': 'Whole (they squish easily)',
      '9-12': 'Whole',
      '12+': 'Whole'
    },
    tips: ['Soft texture makes them safe early', 'Great for pincer grasp practice', 'High in fiber']
  },
  {
    id: 'blackberry', name: 'Blackberries', emoji: '🫐', 
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Mashed or halved lengthways',
      '7-8': 'Halved or whole if soft',
      '9-12': 'Whole',
      '12+': 'Whole'
    },
    tips: ['Halve lengthways if large', 'Seeds are fine to eat', 'May stain - use a bib!']
  },
  {
    id: 'apple', name: 'Apple', emoji: '🍎', 
    image: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Steamed/cooked until soft, thin slices or mashed',
      '7-8': 'Soft cooked wedges or grated raw',
      '9-12': 'Soft cooked pieces, very thin raw slices',
      '12+': 'Thin raw slices, cooked pieces'
    },
    tips: ['Raw apple is a choking hazard - cook until soft or shred finely', 'Remove seeds', 'Grating is safest for raw'],
    warnings: ['Raw apple chunks not safe until 4+ years']
  },
  {
    id: 'pear', name: 'Pear', emoji: '🍐', 
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Very ripe soft slices or steamed',
      '7-8': 'Ripe soft slices or cooked',
      '9-12': 'Soft ripe pieces',
      '12+': 'Slices when ripe and soft'
    },
    tips: ['Must be very ripe (soft when pressed)', 'Anjou and Bartlett get softest', 'Steam if not ripe enough']
  },
  {
    id: 'peach', name: 'Peach', emoji: '🍑', 
    image: 'https://images.unsplash.com/photo-1629828874514-c1e5103f2150?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Very ripe, skinned, sliced or mashed',
      '7-8': 'Ripe slices with or without skin',
      '9-12': 'Soft pieces, can include skin',
      '12+': 'Slices or wedges'
    },
    tips: ['Must be very ripe and soft', 'Skin is fine if ripe', 'Frozen peaches work well (thaw first)']
  },
  {
    id: 'mango', name: 'Mango', emoji: '🥭', 
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Ripe strips or mashed',
      '7-8': 'Strips or chunks',
      '9-12': 'Chunks or diced',
      '12+': 'Chunks or slices'
    },
    tips: ['Pit a large mango spear for easy holding', 'Very ripe = very soft', 'Slippery - roll in coconut if needed']
  },
  {
    id: 'watermelon', name: 'Watermelon', emoji: '🍉', 
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Thin strips or small diced, seedless',
      '7-8': 'Strips or small pieces',
      '9-12': 'Small chunks, remove seeds',
      '12+': 'Chunks or wedges'
    },
    tips: ['Remove all seeds', 'Can be slippery', 'High water content - great for hydration']
  },
  {
    id: 'kiwi', name: 'Kiwi', emoji: '🥝', 
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Ripe, peeled, sliced or mashed',
      '7-8': 'Slices or quarters',
      '9-12': 'Chunks or slices',
      '12+': 'Slices or halved to scoop'
    },
    tips: ['Very ripe = softer', 'High in vitamin C', 'Seeds are fine to eat', 'May cause mouth tingling (not allergy)']
  },
  {
    id: 'orange', name: 'Orange', emoji: '🍊', 
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Supremed segments (membrane removed) or mashed',
      '7-8': 'Segments with membrane removed',
      '9-12': 'Small pieces, membrane removed',
      '12+': 'Segments'
    },
    tips: ['Remove membrane and seeds', 'Acidic - may cause rash around mouth', 'Mandarin segments easier']
  },
  {
    id: 'grapes', name: 'Grapes', emoji: '🍇', 
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Quartered lengthways and smashed',
      '7-8': 'Quartered lengthways',
      '9-12': 'Quartered lengthways',
      '12+': 'Quartered lengthways until age 4+'
    },
    tips: ['ALWAYS quarter lengthways - major choking hazard', 'Never serve whole or halved', 'Same for cherry tomatoes'],
    warnings: ['Whole grapes are a leading cause of choking in young children']
  },
  {
    id: 'cherries', name: 'Cherries', emoji: '🍒', 
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Pitted, quartered, mashed or very finely chopped',
      '7-8': 'Pitted and quartered',
      '9-12': 'Pitted and quartered',
      '12+': 'Pitted and halved'
    },
    tips: ['Always remove pit', 'Quarter like grapes', 'Sweet cherries better than sour for babies'],
    warnings: ['Pits are a choking hazard and contain compounds that convert to cyanide']
  },
  {
    id: 'pineapple', name: 'Pineapple', emoji: '🍍', 
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800',
    category: 'Fruits',
    serving: {
      '6': 'Very ripe, thin strips to suck on or finely diced',
      '7-8': 'Thin strips or small pieces',
      '9-12': 'Small chunks',
      '12+': 'Chunks or rings'
    },
    tips: ['Can be tough - ensure very ripe or use canned (in juice, not syrup)', 'May cause mouth tingling', 'High in bromelain enzyme']
  },

  // ============ VEGETABLES ============
  {
    id: 'sweet-potato', name: 'Sweet Potato', emoji: '🍠', 
    image: 'https://images.unsplash.com/photo-1596097635121-14b63a7d6c30?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed/roasted until soft, long wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Chunks or cubes',
      '12+': 'Various cuts'
    },
    tips: ['Excellent first food', 'Roast with skin for easy holding', 'Orange and purple varieties both great']
  },
  {
    id: 'carrot', name: 'Carrot', emoji: '🥕', 
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed/roasted until VERY soft, long sticks or mashed',
      '7-8': 'Soft cooked sticks or chunks',
      '9-12': 'Soft cooked pieces',
      '12+': 'Cooked pieces, thin raw sticks from 2+'
    },
    tips: ['Must be soft enough to squish between fingers', 'Raw carrot is a choking hazard until 2-4 years', 'Roasting brings out sweetness'],
    warnings: ['Raw carrots not safe for babies - always cook until soft']
  },
  {
    id: 'broccoli', name: 'Broccoli', emoji: '🥦', 
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed florets (tree shape is perfect for gripping)',
      '7-8': 'Steamed florets',
      '9-12': 'Steamed florets or chopped',
      '12+': 'Steamed or lightly cooked, raw if chewing well'
    },
    tips: ['Natural handle shape!', 'Steam until soft but not mushy', 'Iron-rich']
  },
  {
    id: 'cauliflower', name: 'Cauliflower', emoji: '🥬', 
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed florets until soft',
      '7-8': 'Steamed florets',
      '9-12': 'Steamed pieces',
      '12+': 'Various preparations'
    },
    tips: ['Similar to broccoli in prep', 'Can mash like potato', 'Mild flavor - good for picky eaters']
  },
  {
    id: 'peas', name: 'Peas', emoji: '🟢', 
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Mashed or flattened',
      '7-8': 'Smashed or flattened',
      '9-12': 'Smashed or whole if pincer grip developed',
      '12+': 'Whole'
    },
    tips: ['Smash or flatten to reduce choking risk', 'Great for pincer grasp practice', 'Frozen peas are nutritious and convenient']
  },
  {
    id: 'green-beans', name: 'Green Beans', emoji: '🫛', 
    image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae0c04a?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed whole until soft',
      '7-8': 'Steamed whole or halved',
      '9-12': 'Steamed, cut into pieces',
      '12+': 'Lightly cooked'
    },
    tips: ['Whole bean is perfect shape for baby to hold', 'Steam until easily squished', 'Trim ends']
  },
  {
    id: 'zucchini', name: 'Zucchini', emoji: '🥒', 
    image: 'https://images.unsplash.com/photo-1563252722-6434563a985d?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed sticks or rounds, soft',
      '7-8': 'Steamed sticks or pieces',
      '9-12': 'Cooked pieces',
      '12+': 'Various preparations'
    },
    tips: ['Gets very soft when cooked', 'Leave skin on for nutrition and grip', 'Mild flavor']
  },
  {
    id: 'cucumber', name: 'Cucumber', emoji: '🥒', 
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Large spears with most flesh scooped out (skin only for sucking)',
      '7-8': 'Thin slices or spears, skin on for grip',
      '9-12': 'Thin slices or small pieces',
      '12+': 'Slices or sticks'
    },
    tips: ['Start with skin-only spears for teething', 'Can be slippery', 'Refreshing for teething gums']
  },
  {
    id: 'bell-pepper', name: 'Bell Pepper', emoji: '🫑', 
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed until soft, strips',
      '7-8': 'Soft cooked strips',
      '9-12': 'Soft cooked pieces, thin raw strips to suck',
      '12+': 'Cooked or raw strips'
    },
    tips: ['Skin can be tough - roast and peel, or serve raw for sucking only', 'Red/yellow sweeter than green', 'High in vitamin C']
  },
  {
    id: 'tomato', name: 'Tomato', emoji: '🍅', 
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0b?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Large wedges with seeds scooped, or cooked',
      '7-8': 'Wedges or diced',
      '9-12': 'Diced or quartered cherry tomatoes',
      '12+': 'Various cuts'
    },
    tips: ['Cherry tomatoes must be quartered like grapes', 'Acidic - may cause rash', 'Remove seeds if desired'],
    warnings: ['Never serve cherry tomatoes whole - quarter lengthways']
  },
  {
    id: 'spinach', name: 'Spinach', emoji: '🥬', 
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Cooked and finely chopped, mixed into foods',
      '7-8': 'Cooked and chopped',
      '9-12': 'Cooked, chopped or in dishes',
      '12+': 'Cooked or raw in salads'
    },
    tips: ['High in iron (pair with vitamin C for absorption)', 'Wilts quickly - easy to add to anything', 'Sautéed with garlic is tasty']
  },
  {
    id: 'butternut-squash', name: 'Butternut Squash', emoji: '🎃', 
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed until soft, wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Soft chunks',
      '12+': 'Various preparations'
    },
    tips: ['Sweet and popular with babies', 'Roasting concentrates flavor', 'Freezes well']
  },
  {
    id: 'potato', name: 'Potato', emoji: '🥔', 
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber6eb?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Roasted/boiled until soft, wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Chunks or mashed',
      '12+': 'Various preparations'
    },
    tips: ['Roasted wedges with skin for grip', 'All varieties work', 'Good paired with healthy fats for nutrition absorption']
  },
  {
    id: 'corn', name: 'Corn', emoji: '🌽', 
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Corn on cob to gnaw (kernels will mostly come off whole)',
      '7-8': 'Cob to gnaw or kernels smashed',
      '9-12': 'Cob or whole kernels if pincer grip good',
      '12+': 'Cob or kernels'
    },
    tips: ['Kernels often pass through undigested - totally normal', 'Cob is great for teething', 'Cut cob into rounds for easier handling']
  },
  {
    id: 'asparagus', name: 'Asparagus', emoji: '🥬', 
    image: 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Steamed whole spears until soft',
      '7-8': 'Steamed spears',
      '9-12': 'Steamed, cut into pieces',
      '12+': 'Roasted or steamed'
    },
    tips: ['Natural handle shape', 'Snap off woody ends', 'Tips are softest part']
  },
  {
    id: 'mushroom', name: 'Mushrooms', emoji: '🍄', 
    image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800',
    category: 'Vegetables',
    serving: {
      '6': 'Cooked until soft, finely chopped or sliced',
      '7-8': 'Cooked slices',
      '9-12': 'Cooked pieces',
      '12+': 'Various preparations'
    },
    tips: ['Always cook - never raw', 'Button, cremini, portobello all fine', 'Good umami flavor']
  },

  // ============ PROTEIN ============
  {
    id: 'chicken', name: 'Chicken', emoji: '🍗', 
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800',
    category: 'Protein',
    serving: {
      '6': 'Shredded, minced, or drumstick to gnaw (with bone for grip)',
      '7-8': 'Shredded or small pieces',
      '9-12': 'Small pieces or strips',
      '12+': 'Various cuts'
    },
    tips: ['Dark meat is more moist', 'Shred against the grain', 'Drumsticks with cartilage removed are great for gnawing']
  },
  {
    id: 'beef', name: 'Beef', emoji: '🥩', 
    image: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=800',
    category: 'Protein',
    serving: {
      '6': 'Slow-cooked until shreddable, minced, or steak strips to suck',
      '7-8': 'Shredded or minced',
      '9-12': 'Small tender pieces or mince',
      '12+': 'Various preparations'
    },
    tips: ['High in iron and zinc', 'Slow-cook for tenderness', 'Steak strips are great for gnawing but expect little actual eating at first']
  },
  {
    id: 'salmon', name: 'Salmon', emoji: '🐟', 
    image: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=800',
    category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Flaked, bones removed, or strip to suck on',
      '7-8': 'Flaked pieces',
      '9-12': 'Flaked or small pieces',
      '12+': 'Various preparations'
    },
    tips: ['Excellent omega-3 source', 'Wild-caught preferred', 'Can introduce early - fish is an allergen to expose'],
    warnings: ['Fish is a top allergen - introduce deliberately and watch for reactions']
  },
  {
    id: 'egg', name: 'Eggs', emoji: '🥚', 
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
    category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Well-cooked scrambled, hard-boiled mashed/quartered, omelette strips',
      '7-8': 'Scrambled, omelette strips, hard-boiled pieces',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Top allergen - introduce early (around 6 months)', 'Include both yolk and white', 'Scrambled is easiest'],
    warnings: ['Egg is a top allergen - introduce whole egg early and regularly']
  },
  {
    id: 'tofu', name: 'Tofu', emoji: '🧈', 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Firm tofu strips or crumbled',
      '7-8': 'Strips or cubes',
      '9-12': 'Cubes or crumbled',
      '12+': 'Various preparations'
    },
    tips: ['Use firm or extra-firm for handling', 'Press to remove water', 'Great plant protein'],
    warnings: ['Soy is an allergen']
  },
  {
    id: 'lentils', name: 'Lentils', emoji: '🟤', 
    image: 'https://images.unsplash.com/photo-1585997477498-29d66c73e11c?w=800',
    category: 'Protein',
    serving: {
      '6': 'Cooked soft, mashed or whole',
      '7-8': 'Whole soft lentils',
      '9-12': 'Whole',
      '12+': 'Whole in various dishes'
    },
    tips: ['Red lentils cook quickest and get mushy (great for baby)', 'High in iron and protein', 'No soaking needed for most types']
  },
  {
    id: 'chickpeas', name: 'Chickpeas', emoji: '🟡', 
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
    category: 'Protein',
    serving: {
      '6': 'Mashed or as hummus, or quartered',
      '7-8': 'Mashed, hummus, or smashed',
      '9-12': 'Smashed or whole if soft',
      '12+': 'Whole'
    },
    tips: ['Hummus is perfect first food', 'Can be choking hazard whole - smash at first', 'Good protein and fiber']
  },
  {
    id: 'beans', name: 'Beans', emoji: '🫘', 
    image: 'https://images.unsplash.com/photo-1594996633024-b39f4f949f4d?w=800',
    category: 'Protein',
    serving: {
      '6': 'Mashed or smashed, skins removed if tough',
      '7-8': 'Smashed or whole soft beans',
      '9-12': 'Whole or slightly mashed',
      '12+': 'Whole'
    },
    tips: ['Rinse canned beans to reduce sodium', 'Mash to reduce choking risk initially', 'Great fiber and iron source']
  },

  // ============ GRAINS ============
  {
    id: 'oats', name: 'Oats', emoji: '🥣', 
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800',
    category: 'Grains',
    serving: {
      '6': 'Cooked until soft, can be thick for spoon or finger scooping',
      '7-8': 'Oatmeal, oat fingers/bars',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Iron-fortified baby oatmeal good early option', 'Can make oat "fingers" for BLW', 'Steel-cut takes longer but has lower GI']
  },
  {
    id: 'rice', name: 'Rice', emoji: '🍚', 
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800',
    category: 'Grains',
    serving: {
      '6': 'Well-cooked, sticky rice easiest to handle',
      '7-8': 'Clumps of sticky rice or mixed into foods',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Sticky/sushi rice clumps together for easy grabbing', 'Brown rice has more nutrients but harder texture', 'Rice cereal not necessary as first food'],
    warnings: ['Limit rice to a few times per week due to arsenic content']
  },
  {
    id: 'pasta', name: 'Pasta', emoji: '🍝', 
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    category: 'Grains',
    allergen: true,
    serving: {
      '6': 'Large shapes (fusilli, penne) cooked very soft',
      '7-8': 'Large soft shapes',
      '9-12': 'Various shapes',
      '12+': 'Any pasta'
    },
    tips: ['Fusilli and penne are easy to grab', 'Cook softer than al dente', 'Whole wheat has more nutrition but different texture'],
    warnings: ['Contains wheat (gluten) - allergen to introduce early']
  },
  {
    id: 'bread', name: 'Bread', emoji: '🍞', 
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800',
    category: 'Grains',
    allergen: true,
    serving: {
      '6': 'Toast strips (lightly toasted, not too hard)',
      '7-8': 'Toast strips or soft bread pieces',
      '9-12': 'Various bread products',
      '12+': 'Any bread'
    },
    tips: ['Toast is easier to handle than soft bread', 'Spread with nut butter or avocado', 'Choose lower sodium options'],
    warnings: ['Contains wheat (gluten) - allergen']
  },
  {
    id: 'quinoa', name: 'Quinoa', emoji: '🟤', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    category: 'Grains',
    serving: {
      '6': 'Well-cooked, can mix into other foods for grip',
      '7-8': 'Cooked quinoa in foods or patties',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Complete protein', 'Rinse before cooking to remove bitter coating', 'Can make into finger-food patties']
  },

  // ============ DAIRY ============
  {
    id: 'cheese', name: 'Cheese', emoji: '🧀', 
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800',
    category: 'Dairy',
    allergen: true,
    serving: {
      '6': 'Thin strips of low-sodium cheese, grated over foods',
      '7-8': 'Strips, cubes, or grated',
      '9-12': 'Various forms',
      '12+': 'Any style'
    },
    tips: ['Choose low-sodium varieties', 'Mild cheddar, mozzarella, Swiss are good starters', 'Good calcium and fat source'],
    warnings: ['Dairy is an allergen - introduce and serve regularly']
  },
  {
    id: 'yogurt', name: 'Yogurt', emoji: '🥛', 
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    category: 'Dairy',
    allergen: true,
    serving: {
      '6': 'Plain, full-fat, unsweetened - spoon fed or self-fed',
      '7-8': 'Plain full-fat yogurt',
      '9-12': 'Plain full-fat yogurt',
      '12+': 'Various types'
    },
    tips: ['Full fat and plain (no sugar added)', 'Greek yogurt is thicker and higher protein', 'Preloaded spoon for self-feeding'],
    warnings: ['Dairy is an allergen']
  },

  // ============ ALLERGENS ============
  {
    id: 'peanut-butter', name: 'Peanut Butter', emoji: '🥜', 
    image: 'https://images.unsplash.com/photo-1485599097850-f5aa3c8f8042?w=800',
    category: 'Allergens',
    allergen: true,
    serving: {
      '6': 'Thinned with water/milk, spread very thin on toast, or mixed into foods',
      '7-8': 'Thin spread or mixed into foods',
      '9-12': 'Thin spread on foods',
      '12+': 'Spread (never by the spoonful until 4+)'
    },
    tips: ['Early introduction (around 6mo) reduces allergy risk', 'Always thin or spread - never thick globs', 'Choose natural without added sugar/salt'],
    warnings: ['Top allergen - introduce early around 6 months', 'Never serve thick globs or by the spoonful - choking hazard']
  },
  {
    id: 'shrimp', name: 'Shrimp', emoji: '🦐', 
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800',
    category: 'Allergens',
    allergen: true,
    serving: {
      '6': 'Finely chopped or minced',
      '7-8': 'Finely chopped',
      '9-12': 'Small pieces',
      '12+': 'Pieces or whole small shrimp'
    },
    tips: ['Introduce early as shellfish is an allergen', 'Chop well - rubbery texture', 'Remove shell and tail'],
    warnings: ['Shellfish is a top allergen - introduce deliberately']
  },
  {
    id: 'sesame', name: 'Sesame / Tahini', emoji: '🌰', 
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800',
    category: 'Allergens',
    allergen: true,
    serving: {
      '6': 'Tahini thinned and drizzled or mixed into foods',
      '7-8': 'Mixed into foods or as dip base',
      '9-12': 'Various uses',
      '12+': 'Normal use'
    },
    tips: ['Sesame is a top allergen - introduce early', 'Great in hummus', 'High in calcium and iron'],
    warnings: ['Sesame is a top 9 allergen - deliberate introduction recommended']
  },
];

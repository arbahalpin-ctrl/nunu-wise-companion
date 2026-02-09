export interface Food {
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

export const foods: Food[] = [
  // ============ FRUITS ============
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
    id: 'strawberry', name: 'Strawberries', emoji: '🍓', category: 'Fruits',
    serving: {
      '6': 'Mashed or very large whole to gnaw',
      '7-8': 'Halved or quartered lengthways',
      '9-12': 'Quartered or small pieces',
      '12+': 'Halved or whole'
    },
    tips: ['Quarter lengthways for safety', 'May cause contact rash (not allergy)', 'High in vitamin C']
  },
  {
    id: 'blueberry', name: 'Blueberries', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Smash flat or quarter',
      '7-8': 'Smashed or quartered',
      '9-12': 'Quartered',
      '12+': 'Halved, whole if supervised'
    },
    tips: ['Round = choking risk, always smash/cut', 'Frozen work great in cooking', 'High in antioxidants'],
    warnings: ['Always smash or quarter - round shape is hazardous']
  },
  {
    id: 'raspberry', name: 'Raspberries', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Smash lightly or serve whole (soft enough)',
      '7-8': 'Whole or lightly smashed',
      '9-12': 'Whole',
      '12+': 'Whole'
    },
    tips: ['Soft texture is baby-friendly', 'High in fiber', 'Can put on fingertip for fun!']
  },
  {
    id: 'blackberry', name: 'Blackberries', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Smash or halve lengthways',
      '7-8': 'Halved or whole if soft',
      '9-12': 'Whole',
      '12+': 'Whole'
    },
    tips: ['Slightly firmer than raspberries', 'High in vitamin C', 'May stain!']
  },
  {
    id: 'apple', name: 'Apple', emoji: '🍎', category: 'Fruits',
    serving: {
      '6': 'Steamed/roasted until very soft, or thin shreds',
      '7-8': 'Soft cooked pieces, grated raw',
      '9-12': 'Soft cooked, thin raw slices',
      '12+': 'Thin slices, cooked'
    },
    tips: ['Raw apple is hard - cook for babies', 'Grate for texture', 'Applesauce is great'],
    warnings: ['Raw apple chunks are choking hazard until 2-3 years']
  },
  {
    id: 'pear', name: 'Pear', emoji: '🍐', category: 'Fruits',
    serving: {
      '6': 'Very ripe soft slices or steamed',
      '7-8': 'Ripe soft pieces',
      '9-12': 'Soft ripe chunks',
      '12+': 'Slices when ripe'
    },
    tips: ['Must be VERY ripe (soft)', 'Easier than apple when ripe', 'Great for constipation']
  },
  {
    id: 'peach', name: 'Peach', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe soft slices, skin removed',
      '7-8': 'Ripe slices or chunks',
      '9-12': 'Chunks with skin if ripe',
      '12+': 'Slices or whole'
    },
    tips: ['Must be ripe and soft', 'Remove skin for young babies', 'Frozen peaches work well']
  },
  {
    id: 'nectarine', name: 'Nectarine', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe soft slices',
      '7-8': 'Ripe slices or chunks',
      '9-12': 'Chunks',
      '12+': 'Slices or whole'
    },
    tips: ['Similar to peach but no fuzz', 'Must be very ripe', 'High in vitamin A']
  },
  {
    id: 'plum', name: 'Plum', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe, skin removed, mashed or sliced',
      '7-8': 'Ripe pieces, skin on OK',
      '9-12': 'Chunks',
      '12+': 'Halved or whole'
    },
    tips: ['Skin can be tough - remove for young babies', 'Good for constipation', 'Choose very ripe']
  },
  {
    id: 'apricot', name: 'Apricot', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe fresh, mashed or dried (soaked, chopped)',
      '7-8': 'Fresh ripe pieces or soaked dried',
      '9-12': 'Fresh or dried pieces',
      '12+': 'Fresh or dried'
    },
    tips: ['Dried apricots are high in iron', 'Soak dried ones to soften', 'Fresh must be very ripe']
  },
  {
    id: 'mango', name: 'Mango', emoji: '🥭', category: 'Fruits',
    serving: {
      '6': 'Ripe strips or pit with flesh to gnaw',
      '7-8': 'Soft strips or chunks',
      '9-12': 'Cubed pieces',
      '12+': 'Any cut'
    },
    tips: ['Leave on large pit to gnaw safely', 'Very ripe = very soft', 'High in vitamin A']
  },
  {
    id: 'papaya', name: 'Papaya', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Ripe mashed or strips',
      '7-8': 'Soft chunks',
      '9-12': 'Cubed',
      '12+': 'Any cut'
    },
    tips: ['Very soft when ripe', 'Contains digestive enzymes', 'Remove all seeds']
  },
  {
    id: 'pineapple', name: 'Pineapple', emoji: '🍍', category: 'Fruits',
    serving: {
      '6': 'Very ripe, soft pieces only',
      '7-8': 'Soft ripe chunks',
      '9-12': 'Small pieces',
      '12+': 'Chunks or rings'
    },
    tips: ['Can be acidic - watch for rash around mouth', 'Choose very ripe', 'Canned in juice OK'],
    warnings: ['Acidic - may cause skin irritation']
  },
  {
    id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'Fruits',
    serving: {
      '6': 'Remove seeds, serve as large wedge to gnaw',
      '7-8': 'Seedless chunks',
      '9-12': 'Cubed pieces',
      '12+': 'Wedges, cubes'
    },
    tips: ['Remove ALL seeds', 'Very hydrating', 'Can be slippery - cut into sticks'],
    warnings: ['Seeds are choking hazard - remove all']
  },
  {
    id: 'cantaloupe', name: 'Cantaloupe/Melon', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Thin slices or chunks, very ripe',
      '7-8': 'Soft chunks',
      '9-12': 'Cubed',
      '12+': 'Any cut'
    },
    tips: ['Wash outside before cutting (bacteria)', 'Remove seeds', 'Good for hydration']
  },
  {
    id: 'honeydew', name: 'Honeydew Melon', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Thin ripe slices',
      '7-8': 'Soft chunks',
      '9-12': 'Cubed',
      '12+': 'Any cut'
    },
    tips: ['Choose ripe for softness', 'Remove all seeds', 'Similar to cantaloupe prep']
  },
  {
    id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'Fruits',
    serving: {
      '6': 'Quarter lengthways (into 4 pieces)',
      '7-8': 'Quartered lengthways',
      '9-12': 'Quartered or halved lengthways',
      '12+': 'Halved lengthways until age 4'
    },
    tips: ['ALWAYS cut lengthways, never across', 'Round shape is dangerous'],
    warnings: ['CRITICAL: Always quarter lengthways - grapes are #1 choking hazard. Never serve whole until age 4+']
  },
  {
    id: 'cherries', name: 'Cherries', emoji: '🍒', category: 'Fruits',
    serving: {
      '6': 'Remove pit, quarter or mash',
      '7-8': 'Pitted and quartered',
      '9-12': 'Pitted and halved',
      '12+': 'Pitted, halved'
    },
    tips: ['Always remove pit', 'Quarter like grapes', 'Fresh or frozen (thawed)'],
    warnings: ['Pit is choking hazard - always remove']
  },
  {
    id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'Fruits',
    serving: {
      '6': 'Ripe, peeled, mashed or thin slices',
      '7-8': 'Peeled chunks',
      '9-12': 'Chunks with or without skin',
      '12+': 'Slices, whole halves to scoop'
    },
    tips: ['Skin is actually edible and nutritious', 'Very high in vitamin C', 'Can be acidic'],
    warnings: ['May cause mouth irritation in some babies']
  },
  {
    id: 'orange', name: 'Orange', emoji: '🍊', category: 'Fruits',
    serving: {
      '6': 'Segments with membrane removed, or supremes',
      '7-8': 'Segments, membrane removed',
      '9-12': 'Segments',
      '12+': 'Segments or whole slices'
    },
    tips: ['Remove membrane and seeds', 'High vitamin C', 'May be acidic for some babies'],
    warnings: ['Acidic - watch for rash around mouth']
  },
  {
    id: 'clementine', name: 'Clementine/Mandarin', emoji: '🍊', category: 'Fruits',
    serving: {
      '6': 'Segments with membrane removed',
      '7-8': 'Segments, break into smaller pieces',
      '9-12': 'Whole segments',
      '12+': 'Segments'
    },
    tips: ['Easier to peel than oranges', 'Remove any seeds', 'Less acidic than oranges usually']
  },
  {
    id: 'grapefruit', name: 'Grapefruit', emoji: '🍊', category: 'Fruits',
    serving: {
      '6': 'Segments with membrane removed (if offering)',
      '7-8': 'Segments, membrane removed',
      '9-12': 'Small segments',
      '12+': 'Segments'
    },
    tips: ['Very bitter/tart - most babies dislike', 'Remove membrane and seeds', 'Wait until 9m+ usually'],
    warnings: ['Very acidic and bitter']
  },
  {
    id: 'lemon', name: 'Lemon', emoji: '🍋', category: 'Fruits',
    serving: {
      '6': 'Wedge to suck on (supervised) or juice in foods',
      '7-8': 'In cooking or wedge to taste',
      '9-12': 'In cooking, lick wedges',
      '12+': 'In cooking, as flavoring'
    },
    tips: ['Fun facial expressions!', 'Use juice in cooking', 'Good flavor exposure']
  },
  {
    id: 'lime', name: 'Lime', emoji: '🍋', category: 'Fruits',
    serving: {
      '6': 'Wedge to suck or juice in foods',
      '7-8': 'In cooking or squeeze over foods',
      '9-12': 'In cooking',
      '12+': 'In cooking'
    },
    tips: ['Similar to lemon', 'Great in guacamole', 'Use juice for flavor']
  },
  {
    id: 'dates', name: 'Dates', emoji: '🫘', category: 'Fruits',
    serving: {
      '6': 'Finely chopped or mashed, pit removed',
      '7-8': 'Small pieces, pitted',
      '9-12': 'Chopped pieces',
      '12+': 'Chopped or whole pitted'
    },
    tips: ['Natural sweetener', 'High in iron', 'Very sticky - good for grip'],
    warnings: ['Always remove pit', 'Sticky - brush teeth after']
  },
  {
    id: 'prunes', name: 'Prunes', emoji: '🫘', category: 'Fruits',
    serving: {
      '6': 'Finely chopped or pureed',
      '7-8': 'Small soft pieces',
      '9-12': 'Chopped',
      '12+': 'Whole or chopped'
    },
    tips: ['Excellent for constipation', 'High in fiber and iron', 'Prune juice works too']
  },
  {
    id: 'raisins', name: 'Raisins', emoji: '🍇', category: 'Fruits',
    serving: {
      '6': 'Finely chopped or soaked and mashed',
      '7-8': 'Chopped or soaked',
      '9-12': 'Chopped',
      '12+': 'Whole if good pincer grasp'
    },
    tips: ['Soak to soften for young babies', 'High sugar - limit quantity', 'Good iron source'],
    warnings: ['Sticky - can stick to teeth, brush after']
  },
  {
    id: 'fig', name: 'Figs', emoji: '🫘', category: 'Fruits',
    serving: {
      '6': 'Fresh ripe mashed, or dried soaked and chopped',
      '7-8': 'Fresh soft pieces or dried soaked',
      '9-12': 'Fresh or dried pieces',
      '12+': 'Fresh or dried'
    },
    tips: ['Fresh figs are very soft when ripe', 'Dried are high in fiber', 'Good calcium source']
  },
  {
    id: 'coconut', name: 'Coconut', emoji: '🥥', category: 'Fruits',
    serving: {
      '6': 'Unsweetened shredded in foods, coconut milk',
      '7-8': 'Shredded in cooking, strips to gnaw',
      '9-12': 'Small pieces, shredded',
      '12+': 'Pieces, shredded'
    },
    tips: ['Coconut milk great in cooking', 'Unsweetened only', 'Good healthy fats']
  },
  {
    id: 'pomegranate', name: 'Pomegranate', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Mash seeds to break skin or juice',
      '7-8': 'Smashed seeds',
      '9-12': 'Whole seeds if chewing well',
      '12+': 'Seeds (arils)'
    },
    tips: ['Seeds have tough outer skin', 'Smash for young babies', 'High in antioxidants'],
    warnings: ['Seeds can be slippery - supervise carefully']
  },
  {
    id: 'dragonfruit', name: 'Dragon Fruit', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Soft flesh mashed or in strips',
      '7-8': 'Soft chunks',
      '9-12': 'Cubed',
      '12+': 'Any cut'
    },
    tips: ['Very soft and mild flavored', 'Seeds are edible', 'Fun color!']
  },
  {
    id: 'passionfruit', name: 'Passion Fruit', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Pulp mixed into yogurt (strain seeds if desired)',
      '7-8': 'Pulp with seeds',
      '9-12': 'Pulp with seeds',
      '12+': 'Scoop from shell'
    },
    tips: ['Seeds are edible', 'Very tart - mix with other foods', 'High in fiber']
  },

  // ============ VEGETABLES ============
  {
    id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'Vegetables',
    serving: {
      '6': 'Steam until very soft, serve as whole floret',
      '7-8': 'Soft steamed florets',
      '9-12': 'Slightly firmer florets',
      '12+': 'Lightly steamed or roasted'
    },
    tips: ['Natural handle shape', 'Steam 8-10 mins until very soft', 'Stem is great for holding']
  },
  {
    id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'Vegetables',
    serving: {
      '6': 'Steam until VERY soft, thick batons',
      '7-8': 'Soft steamed batons or mashed',
      '9-12': 'Softer cooked pieces, shredded raw OK',
      '12+': 'Cooked chunks, thin raw sticks supervised'
    },
    tips: ['Must be very soft for young babies', 'Should squish easily between fingers'],
    warnings: ['Raw carrot is choking hazard until 2-3 years']
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
    id: 'potato', name: 'Potato', emoji: '🥔', category: 'Vegetables',
    serving: {
      '6': 'Mashed, or soft roasted wedges',
      '7-8': 'Soft pieces, mashed',
      '9-12': 'Chunks, roasted pieces',
      '12+': 'Any preparation'
    },
    tips: ['Mash with butter/milk for nutrition', 'Leave skin on for nutrients', 'Can be slippery when plain']
  },
  {
    id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'Vegetables',
    serving: {
      '6': 'Large spears with skin (too big to choke)',
      '7-8': 'Large spears',
      '9-12': 'Thinner spears',
      '12+': 'Slices, sticks'
    },
    tips: ['Keep skin on for grip', 'Cool and soothing for teething', 'Mostly water - limited nutrition']
  },
  {
    id: 'tomato', name: 'Tomatoes', emoji: '🍅', category: 'Vegetables',
    serving: {
      '6': 'Quartered cherry tomatoes or large wedges',
      '7-8': 'Quartered, skinned if preferred',
      '9-12': 'Small pieces',
      '12+': 'Any cut'
    },
    tips: ['Quarter cherry tomatoes lengthways', 'Remove skin for young babies if tough'],
    warnings: ['Round cherry tomatoes must be quartered lengthways']
  },
  {
    id: 'peas', name: 'Peas', emoji: '🟢', category: 'Vegetables',
    serving: {
      '6': 'Smash flat or blend into foods',
      '7-8': 'Smashed',
      '9-12': 'Lightly smashed',
      '12+': 'Whole if chewing well'
    },
    tips: ['Smash to break skin', 'Great mixed into mash', 'Frozen peas work great'],
    warnings: ['Whole peas can be choking hazard - smash them until 12m+']
  },
  {
    id: 'spinach', name: 'Spinach', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Wilted/cooked, finely chopped or blended into foods',
      '7-8': 'Chopped cooked spinach',
      '9-12': 'Cooked, in dishes',
      '12+': 'Cooked or raw in salads'
    },
    tips: ['High in iron (pair with vitamin C)', 'Blend into sauces', 'Frozen spinach is convenient']
  },
  {
    id: 'kale', name: 'Kale', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Remove stems, cook well, finely chop or blend',
      '7-8': 'Cooked and chopped',
      '9-12': 'Cooked in dishes',
      '12+': 'Cooked or as chips'
    },
    tips: ['Remove tough stems', 'Massage if using raw (for older kids)', 'Very nutritious']
  },
  {
    id: 'cauliflower', name: 'Cauliflower', emoji: '🥦', category: 'Vegetables',
    serving: {
      '6': 'Steamed very soft florets',
      '7-8': 'Soft florets',
      '9-12': 'Roasted or steamed florets',
      '12+': 'Any preparation'
    },
    tips: ['Similar prep to broccoli', 'Can mash like potatoes', 'Mild flavor']
  },
  {
    id: 'zucchini', name: 'Zucchini/Courgette', emoji: '🥒', category: 'Vegetables',
    serving: {
      '6': 'Steamed soft sticks or mashed',
      '7-8': 'Soft cooked pieces',
      '9-12': 'Roasted or steamed',
      '12+': 'Any preparation'
    },
    tips: ['Very mild flavor', 'Blends well into sauces', 'Leave skin on for nutrients']
  },
  {
    id: 'butternutsquash', name: 'Butternut Squash', emoji: '🎃', category: 'Vegetables',
    serving: {
      '6': 'Roasted until very soft, mashed or wedges',
      '7-8': 'Soft roasted pieces',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Naturally sweet', 'Great first food', 'Roasting brings out sweetness']
  },
  {
    id: 'pumpkin', name: 'Pumpkin', emoji: '🎃', category: 'Vegetables',
    serving: {
      '6': 'Roasted very soft, mashed or puree',
      '7-8': 'Soft roasted pieces',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Use cooking pumpkins, not decorative', 'Canned pumpkin (plain) is fine', 'High in vitamin A']
  },
  {
    id: 'acornsquash', name: 'Acorn Squash', emoji: '🎃', category: 'Vegetables',
    serving: {
      '6': 'Roasted very soft, scooped flesh',
      '7-8': 'Soft pieces',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Similar to butternut squash', 'Roast cut-side down', 'Mild and sweet']
  },
  {
    id: 'asparagus', name: 'Asparagus', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Steamed very soft spears (natural handle)',
      '7-8': 'Soft steamed spears',
      '9-12': 'Steamed or roasted',
      '12+': 'Any preparation'
    },
    tips: ['Perfect finger food shape', 'Steam until very soft', 'May make urine smell (normal!)']
  },
  {
    id: 'greenbeans', name: 'Green Beans', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Steamed very soft, served whole',
      '7-8': 'Soft steamed',
      '9-12': 'Steamed or sautéed',
      '12+': 'Any preparation'
    },
    tips: ['Good finger food shape', 'Steam until soft enough to squish', 'Frozen beans work well']
  },
  {
    id: 'corn', name: 'Corn', emoji: '🌽', category: 'Vegetables',
    serving: {
      '6': 'Cob to gnaw (no kernels will come off), or mashed kernels',
      '7-8': 'Cob to gnaw, smashed kernels',
      '9-12': 'Whole kernels if pincer grasp good',
      '12+': 'Cob or kernels'
    },
    tips: ['Cob is great for teething', 'Kernels are hard to digest - will appear in diaper', 'Smash for young babies']
  },
  {
    id: 'bellpepper', name: 'Bell Pepper', emoji: '🫑', category: 'Vegetables',
    serving: {
      '6': 'Roasted until very soft, skin removed, strips',
      '7-8': 'Soft roasted strips',
      '9-12': 'Roasted or raw thin strips',
      '12+': 'Strips raw or cooked'
    },
    tips: ['Roast to soften skin', 'Raw is crunchy - supervise', 'All colors are fine']
  },
  {
    id: 'eggplant', name: 'Eggplant/Aubergine', emoji: '🍆', category: 'Vegetables',
    serving: {
      '6': 'Roasted very soft, skin removed, mashed or strips',
      '7-8': 'Soft roasted pieces',
      '9-12': 'Roasted cubes',
      '12+': 'Any preparation'
    },
    tips: ['Absorbs lots of oil - be generous', 'Remove skin for young babies', 'Soft when cooked well']
  },
  {
    id: 'mushroom', name: 'Mushrooms', emoji: '🍄', category: 'Vegetables',
    serving: {
      '6': 'Sautéed until very soft, finely chopped',
      '7-8': 'Soft cooked, chopped',
      '9-12': 'Sliced, cooked',
      '12+': 'Any preparation'
    },
    tips: ['Cook thoroughly', 'Start with mild varieties (button, cremini)', 'Good source of vitamin D if exposed to sun']
  },
  {
    id: 'onion', name: 'Onion', emoji: '🧅', category: 'Vegetables',
    serving: {
      '6': 'Well cooked in dishes (for flavor)',
      '7-8': 'Cooked, soft pieces',
      '9-12': 'Cooked in dishes',
      '12+': 'Cooked'
    },
    tips: ['Great for flavoring', 'Cook until very soft', 'Can cause gas in some babies']
  },
  {
    id: 'garlic', name: 'Garlic', emoji: '🧄', category: 'Vegetables',
    serving: {
      '6': 'Cooked in dishes (for flavor)',
      '7-8': 'Cooked in dishes',
      '9-12': 'In cooking',
      '12+': 'In cooking'
    },
    tips: ['Safe and healthy from 6 months', 'Cook to mellow flavor', 'Immune-boosting properties']
  },
  {
    id: 'leek', name: 'Leek', emoji: '🧅', category: 'Vegetables',
    serving: {
      '6': 'Well cooked, soft, in dishes',
      '7-8': 'Soft cooked pieces',
      '9-12': 'Cooked',
      '12+': 'Any preparation'
    },
    tips: ['Milder than onion', 'Wash well - dirt hides in layers', 'Great in soups']
  },
  {
    id: 'celery', name: 'Celery', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked very soft only',
      '7-8': 'Cooked soft',
      '9-12': 'Cooked, or raw with strings removed',
      '12+': 'Raw sticks (strings can be tough)'
    },
    tips: ['Strings can be choking hazard', 'Remove strings or cook well', 'Good in soups'],
    warnings: ['Raw celery strings are difficult - cook for young babies']
  },
  {
    id: 'beetroot', name: 'Beetroot', emoji: '🟣', category: 'Vegetables',
    serving: {
      '6': 'Roasted soft, wedges or mashed',
      '7-8': 'Soft roasted pieces',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Will stain everything!', 'Roast for sweetness', 'High in iron and folate'],
    warnings: ['Red/pink diapers and urine are normal after eating']
  },
  {
    id: 'parsnip', name: 'Parsnip', emoji: '🥕', category: 'Vegetables',
    serving: {
      '6': 'Roasted very soft, wedges or mashed',
      '7-8': 'Soft roasted pieces',
      '9-12': 'Roasted cubes',
      '12+': 'Any preparation'
    },
    tips: ['Sweeter than carrots', 'Roast for best flavor', 'Great mixed with other root veg']
  },
  {
    id: 'turnip', name: 'Turnip', emoji: '🥔', category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed very soft, mashed or pieces',
      '7-8': 'Soft cooked pieces',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Slightly peppery flavor', 'Mash with potato', 'Young turnips are milder']
  },
  {
    id: 'cabbage', name: 'Cabbage', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked very soft, finely shredded',
      '7-8': 'Soft cooked shreds',
      '9-12': 'Cooked',
      '12+': 'Cooked or raw'
    },
    tips: ['Can cause gas', 'Cook well for young babies', 'Green, red, and savoy all fine']
  },
  {
    id: 'brusselssprouts', name: 'Brussels Sprouts', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Steamed very soft, halved or quartered',
      '7-8': 'Soft halved',
      '9-12': 'Halved or whole if small',
      '12+': 'Any preparation'
    },
    tips: ['Halve to prevent choking', 'Roasting reduces bitterness', 'May cause gas']
  },
  {
    id: 'artichoke', name: 'Artichoke', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Artichoke heart, cooked very soft, mashed',
      '7-8': 'Soft heart pieces',
      '9-12': 'Soft pieces',
      '12+': 'Hearts'
    },
    tips: ['Use hearts only for babies', 'Jarred/canned hearts work well', 'Rinse canned to reduce salt']
  },
  {
    id: 'fennel', name: 'Fennel', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Roasted very soft',
      '7-8': 'Soft roasted pieces',
      '9-12': 'Cooked',
      '12+': 'Cooked or raw thin slices'
    },
    tips: ['Mild anise/licorice flavor', 'Roasting mellows flavor', 'Can help with gas']
  },
  {
    id: 'radish', name: 'Radish', emoji: '🟣', category: 'Vegetables',
    serving: {
      '6': 'Cooked soft only (raw is too hard)',
      '7-8': 'Cooked soft',
      '9-12': 'Cooked, or thin raw slices',
      '12+': 'Thin raw slices'
    },
    tips: ['Peppery when raw', 'Cooking mellows flavor', 'Roast for milder taste'],
    warnings: ['Raw radish is hard - cook for young babies']
  },
  {
    id: 'lettuce', name: 'Lettuce', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Not recommended - no nutrition, hard to manage',
      '7-8': 'Can offer to play with',
      '9-12': 'Shredded if interested',
      '12+': 'In salads'
    },
    tips: ['Low nutrition', 'More of a textural experience', 'Romaine has more nutrients than iceberg']
  },
  {
    id: 'bok-choy', name: 'Bok Choy', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked very soft, chopped',
      '7-8': 'Soft cooked',
      '9-12': 'Cooked',
      '12+': 'Any preparation'
    },
    tips: ['Mild flavor', 'Baby bok choy is tender', 'Great in stir fries']
  },

  // ============ PROTEINS ============
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
    id: 'lamb', name: 'Lamb', emoji: '🍖', category: 'Protein',
    serving: {
      '6': 'Slow-cooked shredded, or mince',
      '7-8': 'Shredded, soft pieces',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['High in iron and zinc', 'Slow cook for tenderness', 'Good flavor for babies']
  },
  {
    id: 'pork', name: 'Pork', emoji: '🥓', category: 'Protein',
    serving: {
      '6': 'Slow-cooked shredded pork',
      '7-8': 'Shredded, soft pieces',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Pulled pork is perfect texture', 'Avoid processed pork (bacon, ham) - high salt', 'Cook thoroughly']
  },
  {
    id: 'turkey', name: 'Turkey', emoji: '🦃', category: 'Protein',
    serving: {
      '6': 'Shredded very moist, dark meat preferable',
      '7-8': 'Shredded, moist',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Dark meat is moister', 'Can dry out easily', 'Ground turkey is versatile']
  },
  {
    id: 'duck', name: 'Duck', emoji: '🦆', category: 'Protein',
    serving: {
      '6': 'Shredded, remove excess fat',
      '7-8': 'Shredded pieces',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Higher in fat than chicken', 'Very flavorful', 'Remove skin/excess fat']
  },
  {
    id: 'liver', name: 'Liver', emoji: '🫀', category: 'Protein',
    serving: {
      '6': 'Pureed or finely minced, small amounts',
      '7-8': 'Finely chopped, in dishes',
      '9-12': 'Small pieces',
      '12+': 'In dishes'
    },
    tips: ['Extremely high in iron & vitamin A', 'Limit to 1x per week (vitamin A)', 'Chicken liver is mildest'],
    warnings: ['Limit intake - very high in vitamin A which can build up']
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
    id: 'cod', name: 'Cod', emoji: '🐟', category: 'Protein', allergen: true,
    serving: {
      '6': 'Baked and flaked, check for bones',
      '7-8': 'Flaked pieces',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Mild white fish - great starter fish', 'Very few bones', 'Bake or poach to keep moist']
  },
  {
    id: 'haddock', name: 'Haddock', emoji: '🐟', category: 'Protein', allergen: true,
    serving: {
      '6': 'Baked and flaked, de-boned',
      '7-8': 'Flaked',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Similar to cod', 'Check for bones', 'Avoid smoked (high salt)']
  },
  {
    id: 'sardines', name: 'Sardines', emoji: '🐟', category: 'Protein', allergen: true,
    serving: {
      '6': 'Mashed, bones are soft and edible',
      '7-8': 'Mashed or flaked',
      '9-12': 'Small pieces',
      '12+': 'Whole or pieces'
    },
    tips: ['Bones are soft and great calcium source', 'Choose low-salt in water', 'High in omega-3']
  },
  {
    id: 'mackerel', name: 'Mackerel', emoji: '🐟', category: 'Protein', allergen: true,
    serving: {
      '6': 'Flaked, check for bones',
      '7-8': 'Flaked',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['High in omega-3', 'Avoid smoked (high salt)', 'Strong flavor'],
    warnings: ['Limit to 2 portions per week (mercury)']
  },
  {
    id: 'tuna', name: 'Tuna', emoji: '🐟', category: 'Protein', allergen: true,
    serving: {
      '6': 'Canned in water, flaked (limit frequency)',
      '7-8': 'Flaked',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Choose skipjack (lower mercury)', 'Limit to 2x per week'],
    warnings: ['Limit intake due to mercury content']
  },
  {
    id: 'shrimp', name: 'Shrimp/Prawns', emoji: '🦐', category: 'Protein', allergen: true,
    serving: {
      '6': 'Finely chopped or minced',
      '7-8': 'Chopped small',
      '9-12': 'Small pieces',
      '12+': 'Whole small shrimp'
    },
    tips: ['Common allergen - introduce carefully', 'Cook thoroughly', 'Remove shell and tail'],
    warnings: ['Shellfish allergy is common - watch for reactions']
  },
  {
    id: 'crab', name: 'Crab', emoji: '🦀', category: 'Protein', allergen: true,
    serving: {
      '6': 'Finely flaked, check for shell',
      '7-8': 'Flaked',
      '9-12': 'Small pieces',
      '12+': 'Any preparation'
    },
    tips: ['Check carefully for shell pieces', 'Pasteurized crab meat is convenient'],
    warnings: ['Shellfish allergen - introduce carefully']
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
    warnings: ['Top allergen - watch for reactions (rash, swelling, vomiting)']
  },
  {
    id: 'tofu', name: 'Tofu', emoji: '🧈', category: 'Protein', allergen: true,
    serving: {
      '6': 'Firm tofu strips, pan-fried',
      '7-8': 'Strips or cubes',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Firm tofu holds shape better', 'Pan fry for better texture', 'Good protein source', 'Soy is allergen']
  },
  {
    id: 'tempeh', name: 'Tempeh', emoji: '🧈', category: 'Protein', allergen: true,
    serving: {
      '6': 'Steamed/sautéed, cut into strips',
      '7-8': 'Strips or small pieces',
      '9-12': 'Cubed',
      '12+': 'Any preparation'
    },
    tips: ['Fermented soy - easier to digest', 'Higher protein than tofu', 'Nutty flavor'],
    warnings: ['Contains soy - allergen']
  },
  {
    id: 'lentils', name: 'Lentils', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Well-cooked, mashed or in sauce',
      '7-8': 'Soft cooked lentils',
      '9-12': 'In dishes, dal',
      '12+': 'Any preparation'
    },
    tips: ['Great plant protein & iron', 'Red lentils cook softest and fastest', 'No pre-soaking needed']
  },
  {
    id: 'chickpeas', name: 'Chickpeas', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Smashed or as hummus',
      '7-8': 'Smashed or halved',
      '9-12': 'Halved or whole if soft',
      '12+': 'Whole'
    },
    tips: ['Hummus is perfect for babies', 'Smash to break skin', 'Good protein and fiber'],
    warnings: ['Round shape - smash or halve for young babies']
  },
  {
    id: 'blackbeans', name: 'Black Beans', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Smashed well',
      '7-8': 'Smashed or slightly mashed',
      '9-12': 'Lightly mashed',
      '12+': 'Whole if soft'
    },
    tips: ['High in fiber and protein', 'Smash to break skin', 'Rinse canned to reduce salt']
  },
  {
    id: 'kidneybeans', name: 'Kidney Beans', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Smashed well',
      '7-8': 'Smashed',
      '9-12': 'Halved or smashed',
      '12+': 'Whole if soft'
    },
    tips: ['Must be cooked well (never raw)', 'Smash for young babies', 'Good in chili']
  },
  {
    id: 'cannellinibeans', name: 'Cannellini Beans', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Smashed',
      '7-8': 'Smashed or mashed',
      '9-12': 'Lightly mashed',
      '12+': 'Whole'
    },
    tips: ['Mild flavor', 'Creamy texture', 'Great in purees']
  },
  {
    id: 'edamame', name: 'Edamame', emoji: '🫛', category: 'Protein', allergen: true,
    serving: {
      '6': 'Shelled and smashed',
      '7-8': 'Shelled and smashed',
      '9-12': 'Shelled, halved',
      '12+': 'Shelled whole'
    },
    tips: ['Always remove from pod', 'Smash for young babies', 'Good protein source'],
    warnings: ['Contains soy - allergen. Remove from pods.']
  },
  {
    id: 'peanutbutter', name: 'Peanut Butter', emoji: '🥜', category: 'Protein', allergen: true,
    serving: {
      '6': 'Thin smear on toast or mixed into foods',
      '7-8': 'Thinly spread on soft foods',
      '9-12': 'Spread on toast, in oatmeal',
      '12+': 'Spread on foods, sauces'
    },
    tips: ['Early introduction recommended for allergy prevention', 'NEVER whole peanuts', 'Thin with milk/water if too thick'],
    warnings: ['Top allergen - introduce early but carefully. Thick globs = choking hazard. No whole nuts until 5+']
  },
  {
    id: 'almondbutter', name: 'Almond Butter', emoji: '🥜', category: 'Protein', allergen: true,
    serving: {
      '6': 'Thin smear on food or mixed in',
      '7-8': 'Thinly spread',
      '9-12': 'Spread on foods',
      '12+': 'Spread'
    },
    tips: ['Tree nut allergen', 'Same rules as peanut butter', 'Good healthy fats'],
    warnings: ['Tree nut allergen. No whole almonds until 5+']
  },
  {
    id: 'tahini', name: 'Tahini (Sesame)', emoji: '🥜', category: 'Protein', allergen: true,
    serving: {
      '6': 'Mixed into foods or thin spread',
      '7-8': 'In foods, spread',
      '9-12': 'In hummus, spread',
      '12+': 'Any use'
    },
    tips: ['Good calcium source', 'Sesame is now top allergen', 'Mix into hummus or oatmeal'],
    warnings: ['Sesame is a major allergen - introduce early and watch for reactions']
  },

  // ============ GRAINS ============
  {
    id: 'toast', name: 'Toast/Bread', emoji: '🍞', category: 'Grains', allergen: true,
    serving: {
      '6': 'Lightly toasted strips with toppings',
      '7-8': 'Toast strips with soft toppings',
      '9-12': 'Smaller pieces',
      '12+': 'Regular toast'
    },
    tips: ['Light toast dissolves easier', 'Great vehicle for toppings', 'Choose whole grain when possible'],
    warnings: ['Contains wheat/gluten']
  },
  {
    id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'Grains', allergen: true,
    serving: {
      '6': 'Large shapes (fusilli) cooked very soft',
      '7-8': 'Soft pasta shapes',
      '9-12': 'Various shapes',
      '12+': 'Regular textures'
    },
    tips: ['Fusilli easy to grip', 'Cook 2-3 mins longer than packet says', 'Whole wheat has more fiber'],
    warnings: ['Contains wheat/gluten']
  },
  {
    id: 'rice', name: 'Rice', emoji: '🍚', category: 'Grains',
    serving: {
      '6': 'Very soft, can mash slightly or form into balls',
      '7-8': 'Soft cooked, sticky rice works well',
      '9-12': 'Regular cooked rice',
      '12+': 'Any preparation'
    },
    tips: ['Sticky rice easier for self-feeding', 'Form into balls for grip', 'Brown rice has more nutrients']
  },
  {
    id: 'oats', name: 'Oats/Porridge', emoji: '🥣', category: 'Grains',
    serving: {
      '6': 'Smooth porridge, loaded on spoon',
      '7-8': 'Thicker porridge',
      '9-12': 'Chunky with toppings',
      '12+': 'Any consistency'
    },
    tips: ['Great iron when made with formula/milk', 'Add fruit for flavor', 'Can use as flour in baking']
  },
  {
    id: 'quinoa', name: 'Quinoa', emoji: '🍚', category: 'Grains',
    serving: {
      '6': 'Well-cooked, served on loaded spoon',
      '7-8': 'Cooked quinoa',
      '9-12': 'In dishes',
      '12+': 'Any preparation'
    },
    tips: ['Complete protein', 'Rinse before cooking', 'Can be sticky - easier for babies']
  },
  {
    id: 'couscous', name: 'Couscous', emoji: '🍚', category: 'Grains', allergen: true,
    serving: {
      '6': 'Cooked, on loaded spoon',
      '7-8': 'Regular couscous',
      '9-12': 'Any preparation',
      '12+': 'Any preparation'
    },
    tips: ['Very quick to cook', 'Israeli/pearl couscous is larger, easier to pick up', 'Good with veggies mixed in'],
    warnings: ['Contains wheat']
  },
  {
    id: 'barley', name: 'Barley', emoji: '🌾', category: 'Grains', allergen: true,
    serving: {
      '6': 'Well-cooked, soft (pearl barley)',
      '7-8': 'Cooked soft',
      '9-12': 'In soups/dishes',
      '12+': 'Any preparation'
    },
    tips: ['Pearl barley cooks faster', 'Good in soups', 'Chewy texture'],
    warnings: ['Contains gluten']
  },
  {
    id: 'polenta', name: 'Polenta/Cornmeal', emoji: '🌽', category: 'Grains',
    serving: {
      '6': 'Soft polenta, loaded spoon or cooled/sliced',
      '7-8': 'Soft or cooled slices',
      '9-12': 'Any preparation',
      '12+': 'Any preparation'
    },
    tips: ['Naturally gluten-free', 'Cool and slice into sticks', 'Creamy when warm']
  },
  {
    id: 'millet', name: 'Millet', emoji: '🌾', category: 'Grains',
    serving: {
      '6': 'Cooked soft, on spoon',
      '7-8': 'Cooked',
      '9-12': 'In dishes',
      '12+': 'Any preparation'
    },
    tips: ['Gluten-free', 'Mild flavor', 'Good alternative to rice']
  },
  {
    id: 'buckwheat', name: 'Buckwheat', emoji: '🌾', category: 'Grains',
    serving: {
      '6': 'Cooked soft (kasha) or as flour in pancakes',
      '7-8': 'Cooked groats',
      '9-12': 'In dishes',
      '12+': 'Any preparation'
    },
    tips: ['Gluten-free despite name', 'Nutty flavor', 'High in protein']
  },
  {
    id: 'crackers', name: 'Crackers', emoji: '🍘', category: 'Grains', allergen: true,
    serving: {
      '6': 'Soft puffed crackers that dissolve',
      '7-8': 'Teething crackers, soft crackers',
      '9-12': 'Various crackers',
      '12+': 'Any crackers'
    },
    tips: ['Choose low-salt options', 'Dissolvable crackers safest for young babies', 'Great with spreads'],
    warnings: ['Most contain wheat/gluten. Avoid hard crackers that can break into sharp pieces.']
  },
  {
    id: 'pancakes', name: 'Pancakes', emoji: '🥞', category: 'Grains', allergen: true,
    serving: {
      '6': 'Soft strips or small pieces',
      '7-8': 'Strips',
      '9-12': 'Pieces or mini pancakes',
      '12+': 'Regular'
    },
    tips: ['Banana pancakes need no sugar', 'Good for hiding veggies', 'Freeze extras'],
    warnings: ['Usually contain wheat and egg']
  },
  {
    id: 'tortilla', name: 'Tortilla', emoji: '🌯', category: 'Grains', allergen: true,
    serving: {
      '6': 'Soft strips or small pieces',
      '7-8': 'Strips, quesadilla pieces',
      '9-12': 'Wraps, quesadillas',
      '12+': 'Any preparation'
    },
    tips: ['Flour or corn both fine', 'Great for quesadillas', 'Cut into strips'],
    warnings: ['Flour tortillas contain wheat']
  },

  // ============ DAIRY ============
  {
    id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'Dairy', allergen: true,
    serving: {
      '6': 'Thin strips or grated/melted',
      '7-8': 'Thin strips or grated',
      '9-12': 'Small cubes, grated',
      '12+': 'Cubes, slices, sticks'
    },
    tips: ['Choose lower-salt options', 'Melted is easier to eat', 'Good calcium source'],
    warnings: ['Dairy allergen. No unpasteurized cheese. Avoid high-salt cheeses.']
  },
  {
    id: 'yogurt', name: 'Yogurt', emoji: '🥛', category: 'Dairy', allergen: true,
    serving: {
      '6': 'Full-fat plain, loaded on spoon',
      '7-8': 'Full-fat, can mix with fruit',
      '9-12': 'Any full-fat yogurt',
      '12+': 'Any yogurt'
    },
    tips: ['Choose full-fat plain', 'Greek yogurt is thicker', 'Avoid added sugar'],
    warnings: ['Dairy allergen']
  },
  {
    id: 'cottagecheese', name: 'Cottage Cheese', emoji: '🧀', category: 'Dairy', allergen: true,
    serving: {
      '6': 'Full-fat, on spoon or mixed',
      '7-8': 'On spoon or with foods',
      '9-12': 'Any preparation',
      '12+': 'Any preparation'
    },
    tips: ['Choose low-salt when possible', 'High protein', 'Mix with fruit'],
    warnings: ['Dairy allergen']
  },
  {
    id: 'ricotta', name: 'Ricotta', emoji: '🧀', category: 'Dairy', allergen: true,
    serving: {
      '6': 'Spread on toast or mixed into foods',
      '7-8': 'Spread or mixed',
      '9-12': 'Any preparation',
      '12+': 'Any preparation'
    },
    tips: ['Mild flavor', 'Good for spreading', 'Lower salt than many cheeses'],
    warnings: ['Dairy allergen']
  },
  {
    id: 'creamcheese', name: 'Cream Cheese', emoji: '🧀', category: 'Dairy', allergen: true,
    serving: {
      '6': 'Spread thinly on toast',
      '7-8': 'Spread on foods',
      '9-12': 'Any preparation',
      '12+': 'Any preparation'
    },
    tips: ['Choose plain, not flavored', 'Good for spreading', 'High in fat'],
    warnings: ['Dairy allergen']
  },
  {
    id: 'butter', name: 'Butter', emoji: '🧈', category: 'Dairy', allergen: true,
    serving: {
      '6': 'Used in cooking or on toast',
      '7-8': 'In cooking, on foods',
      '9-12': 'Any use',
      '12+': 'Any use'
    },
    tips: ['Good fat for babies', 'Adds flavor', 'Unsalted preferred'],
    warnings: ['Dairy allergen']
  },
  {
    id: 'milk', name: 'Cow\'s Milk', emoji: '🥛', category: 'Dairy', allergen: true,
    serving: {
      '6': 'In cooking only (not as drink)',
      '7-8': 'In cooking/foods',
      '9-12': 'In cooking/foods',
      '12+': 'As drink and in foods'
    },
    tips: ['Use in cooking before 12m', 'Not as main drink until 12m', 'Whole/full-fat milk'],
    warnings: ['Dairy allergen. Not as drink until 12 months - breast milk or formula remains primary.']
  },

  // ============ HERBS & SPICES ============
  {
    id: 'cinnamon', name: 'Cinnamon', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Pinch in foods',
      '7-8': 'In foods',
      '9-12': 'In foods',
      '12+': 'In foods'
    },
    tips: ['Great for flavor without sugar', 'Pairs well with fruit', 'Safe from 6 months']
  },
  {
    id: 'ginger', name: 'Ginger', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Small amounts, grated in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'In cooking'
    },
    tips: ['Start with small amounts', 'Can help with tummy upsets', 'Fresh or powdered']
  },
  {
    id: 'turmeric', name: 'Turmeric', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Small amounts in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'In cooking'
    },
    tips: ['Anti-inflammatory', 'Will stain everything!', 'Pairs with black pepper for absorption']
  },
  {
    id: 'cumin', name: 'Cumin', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Small amounts in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'In cooking'
    },
    tips: ['Common in many cuisines', 'Earthy flavor', 'Safe for babies']
  },
  {
    id: 'basil', name: 'Basil', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Fresh or dried in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking or fresh',
      '12+': 'Any use'
    },
    tips: ['Fresh has best flavor', 'Great in tomato dishes', 'Make pesto']
  },
  {
    id: 'oregano', name: 'Oregano', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Dried or fresh in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'Any use'
    },
    tips: ['Works well dried', 'Italian and Greek dishes', 'Antibacterial properties']
  },
  {
    id: 'mint', name: 'Mint', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Fresh in cooking or water',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'Any use'
    },
    tips: ['Refreshing flavor', 'Good in fruit dishes', 'Can help with digestion']
  },
  {
    id: 'parsley', name: 'Parsley', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Fresh or dried in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'Any use'
    },
    tips: ['High in iron', 'Use flat-leaf for cooking', 'Fresh is more nutritious']
  },
  {
    id: 'dill', name: 'Dill', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Fresh in cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'Any use'
    },
    tips: ['Great with fish', 'Fresh is best', 'Mild anise flavor']
  },
  {
    id: 'paprika', name: 'Paprika', emoji: '🌿', category: 'Herbs & Spices',
    serving: {
      '6': 'Small amounts (sweet paprika)',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'Any use'
    },
    tips: ['Sweet paprika is mild', 'Avoid smoked/hot for young babies', 'Adds color and flavor']
  },

  // ============ MISCELLANEOUS ============
  {
    id: 'hummus', name: 'Hummus', emoji: '🥙', category: 'Dips & Spreads', allergen: true,
    serving: {
      '6': 'As dip or spread',
      '7-8': 'Dip for veggies/bread',
      '9-12': 'Any use',
      '12+': 'Any use'
    },
    tips: ['Make your own for less salt', 'Great protein source', 'Good for dipping practice'],
    warnings: ['Contains sesame (tahini) - allergen']
  },
  {
    id: 'guacamole', name: 'Guacamole', emoji: '🥑', category: 'Dips & Spreads',
    serving: {
      '6': 'Plain avocado mash or mild guac',
      '7-8': 'As dip or spread',
      '9-12': 'Any use',
      '12+': 'Any use'
    },
    tips: ['Healthy fats', 'Skip the salt for babies', 'Great dip for veggies']
  },
  {
    id: 'oliveoil', name: 'Olive Oil', emoji: '🫒', category: 'Fats & Oils',
    serving: {
      '6': 'Drizzle on foods',
      '7-8': 'In cooking, drizzled',
      '9-12': 'Any use',
      '12+': 'Any use'
    },
    tips: ['Great healthy fat', 'Extra virgin for drizzling', 'Good for constipation']
  },
  {
    id: 'coconutoil', name: 'Coconut Oil', emoji: '🥥', category: 'Fats & Oils',
    serving: {
      '6': 'In cooking',
      '7-8': 'In cooking',
      '9-12': 'In cooking',
      '12+': 'Any use'
    },
    tips: ['Good for high-heat cooking', 'Mild coconut flavor', 'Solid at room temp']
  },
  {
    id: 'honey', name: 'Honey', emoji: '🍯', category: 'Sweeteners',
    serving: {
      '6': 'NOT SAFE',
      '7-8': 'NOT SAFE',
      '9-12': 'NOT SAFE',
      '12+': 'OK after 12 months'
    },
    tips: ['Safe after 12 months', 'Use instead of sugar after 1 year'],
    warnings: ['NEVER give honey to babies under 12 months - risk of infant botulism']
  },
];

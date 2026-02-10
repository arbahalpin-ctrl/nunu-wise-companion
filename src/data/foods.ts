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
      '6': 'Mashed or flattened/squished',
      '7-8': 'Flattened or quartered',
      '9-12': 'Quartered or smashed',
      '12+': 'Halved or whole if chewing well'
    },
    tips: ['Always flatten or squish - round shape is choking hazard', 'High in antioxidants', 'Frozen work well for teething'],
    warnings: ['Never serve whole until 4+ years']
  },
  {
    id: 'raspberry', name: 'Raspberries', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Mashed or gently pressed',
      '7-8': 'Whole (they squish easily)',
      '9-12': 'Whole',
      '12+': 'Whole'
    },
    tips: ['Soft texture makes them safe early', 'Great for pincer grasp practice', 'High in fiber']
  },
  {
    id: 'blackberry', name: 'Blackberries', emoji: '🫐', category: 'Fruits',
    serving: {
      '6': 'Mashed or halved lengthways',
      '7-8': 'Halved or whole if soft',
      '9-12': 'Whole',
      '12+': 'Whole'
    },
    tips: ['Halve lengthways if large', 'Seeds are fine to eat', 'May stain - use a bib!']
  },
  {
    id: 'apple', name: 'Apple', emoji: '🍎', category: 'Fruits',
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
    id: 'pear', name: 'Pear', emoji: '🍐', category: 'Fruits',
    serving: {
      '6': 'Very ripe soft slices or steamed',
      '7-8': 'Ripe soft slices or cooked',
      '9-12': 'Soft ripe pieces',
      '12+': 'Slices when ripe and soft'
    },
    tips: ['Must be very ripe (soft when pressed)', 'Anjou and Bartlett get softest', 'Steam if not ripe enough']
  },
  {
    id: 'peach', name: 'Peach', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe, skinned, sliced or mashed',
      '7-8': 'Ripe slices with or without skin',
      '9-12': 'Soft pieces, can include skin',
      '12+': 'Slices or wedges'
    },
    tips: ['Must be very ripe and soft', 'Skin is fine if ripe', 'Frozen peaches work well (thaw first)']
  },
  {
    id: 'nectarine', name: 'Nectarine', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe, sliced or mashed',
      '7-8': 'Ripe slices',
      '9-12': 'Soft pieces',
      '12+': 'Slices or wedges'
    },
    tips: ['Same as peach but no fuzzy skin', 'Must be soft and ripe']
  },
  {
    id: 'plum', name: 'Plum', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe, skinned, mashed or sliced',
      '7-8': 'Ripe slices, skin on if soft',
      '9-12': 'Soft pieces',
      '12+': 'Slices or halved'
    },
    tips: ['Remove pit', 'Skin can be tough - remove if baby struggles', 'Good for constipation']
  },
  {
    id: 'apricot', name: 'Apricot', emoji: '🍑', category: 'Fruits',
    serving: {
      '6': 'Very ripe, halved or quartered',
      '7-8': 'Ripe halves or quarters',
      '9-12': 'Soft pieces',
      '12+': 'Halved or whole if ripe'
    },
    tips: ['Must be very soft and ripe', 'Dried apricots OK from 6mo but cut small']
  },
  {
    id: 'mango', name: 'Mango', emoji: '🥭', category: 'Fruits',
    serving: {
      '6': 'Ripe strips or mashed',
      '7-8': 'Strips or chunks',
      '9-12': 'Chunks or diced',
      '12+': 'Chunks or slices'
    },
    tips: ['Pit a large mango spear for easy holding', 'Very ripe = very soft', 'Slippery - roll in coconut if needed']
  },
  {
    id: 'papaya', name: 'Papaya', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Ripe strips or mashed',
      '7-8': 'Soft strips or chunks',
      '9-12': 'Chunks',
      '12+': 'Chunks or slices'
    },
    tips: ['Very soft when ripe - great first food', 'Remove seeds', 'High in digestive enzymes']
  },
  {
    id: 'melon', name: 'Melon (Cantaloupe/Honeydew)', emoji: '🍈', category: 'Fruits',
    serving: {
      '6': 'Thin strips or very small diced, well-ripened',
      '7-8': 'Thin strips or small pieces',
      '9-12': 'Small chunks',
      '12+': 'Chunks or wedges'
    },
    tips: ['Can be slippery and hard - ensure very ripe', 'Start with thin strips', 'Watermelon similar but seedless preferred']
  },
  {
    id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'Fruits',
    serving: {
      '6': 'Thin strips or small diced, seedless',
      '7-8': 'Strips or small pieces',
      '9-12': 'Small chunks, remove seeds',
      '12+': 'Chunks or wedges'
    },
    tips: ['Remove all seeds', 'Can be slippery', 'High water content - great for hydration']
  },
  {
    id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'Fruits',
    serving: {
      '6': 'Ripe, peeled, sliced or mashed',
      '7-8': 'Slices or quarters',
      '9-12': 'Chunks or slices',
      '12+': 'Slices or halved to scoop'
    },
    tips: ['Very ripe = softer', 'High in vitamin C', 'Seeds are fine to eat', 'May cause mouth tingling (not allergy)']
  },
  {
    id: 'orange', name: 'Orange', emoji: '🍊', category: 'Fruits',
    serving: {
      '6': 'Supremed segments (membrane removed) or mashed',
      '7-8': 'Segments with membrane removed',
      '9-12': 'Small pieces, membrane removed',
      '12+': 'Segments'
    },
    tips: ['Remove membrane and seeds', 'Acidic - may cause rash around mouth', 'Mandarin segments easier']
  },
  {
    id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'Fruits',
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
    id: 'cherries', name: 'Cherries', emoji: '🍒', category: 'Fruits',
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
    id: 'pineapple', name: 'Pineapple', emoji: '🍍', category: 'Fruits',
    serving: {
      '6': 'Very ripe, thin strips to suck on or finely diced',
      '7-8': 'Thin strips or small pieces',
      '9-12': 'Small chunks',
      '12+': 'Chunks or rings'
    },
    tips: ['Can be tough - ensure very ripe or use canned (in juice, not syrup)', 'May cause mouth tingling', 'High in bromelain enzyme']
  },
  {
    id: 'coconut', name: 'Coconut', emoji: '🥥', category: 'Fruits',
    serving: {
      '6': 'Coconut milk/cream in cooking, shredded (unsweetened) in foods',
      '7-8': 'Shredded in foods, coconut milk in cooking',
      '9-12': 'Shredded coconut, coconut pieces if soft',
      '12+': 'Various forms'
    },
    tips: ['Great healthy fat source', 'Use unsweetened', 'Coconut oil good for cooking']
  },
  {
    id: 'dates', name: 'Dates', emoji: '🌴', category: 'Fruits',
    serving: {
      '6': 'Pureed or very finely chopped, pit removed',
      '7-8': 'Finely chopped, pit removed',
      '9-12': 'Small pieces, pit removed',
      '12+': 'Chopped or whole (pitted)'
    },
    tips: ['Natural sweetener', 'Very sticky - mix with other foods', 'High in fiber'],
    warnings: ['Always remove pit']
  },
  {
    id: 'fig', name: 'Figs', emoji: '🟤', category: 'Fruits',
    serving: {
      '6': 'Fresh ripe fig, quartered, or dried fig soaked and chopped',
      '7-8': 'Quartered fresh or chopped dried',
      '9-12': 'Halved fresh or chopped dried',
      '12+': 'Fresh or dried'
    },
    tips: ['Fresh figs very soft when ripe', 'Dried figs - soak to soften', 'High in calcium']
  },

  // ============ VEGETABLES ============
  {
    id: 'sweet-potato', name: 'Sweet Potato', emoji: '🍠', category: 'Vegetables',
    serving: {
      '6': 'Steamed/roasted until soft, long wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Chunks or cubes',
      '12+': 'Various cuts'
    },
    tips: ['Excellent first food', 'Roast with skin for easy holding', 'Orange and purple varieties both great']
  },
  {
    id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'Vegetables',
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
    id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'Vegetables',
    serving: {
      '6': 'Steamed florets (tree shape is perfect for gripping)',
      '7-8': 'Steamed florets',
      '9-12': 'Steamed florets or chopped',
      '12+': 'Steamed or lightly cooked, raw if chewing well'
    },
    tips: ['Natural handle shape!', 'Steam until soft but not mushy', 'Iron-rich']
  },
  {
    id: 'cauliflower', name: 'Cauliflower', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Steamed florets until soft',
      '7-8': 'Steamed florets',
      '9-12': 'Steamed pieces',
      '12+': 'Various preparations'
    },
    tips: ['Similar to broccoli in prep', 'Can mash like potato', 'Mild flavor - good for picky eaters']
  },
  {
    id: 'peas', name: 'Peas', emoji: '🟢', category: 'Vegetables',
    serving: {
      '6': 'Mashed or flattened',
      '7-8': 'Smashed or flattened',
      '9-12': 'Smashed or whole if pincer grip developed',
      '12+': 'Whole'
    },
    tips: ['Smash or flatten to reduce choking risk', 'Great for pincer grasp practice', 'Frozen peas are nutritious and convenient']
  },
  {
    id: 'green-beans', name: 'Green Beans', emoji: '🫛', category: 'Vegetables',
    serving: {
      '6': 'Steamed whole until soft',
      '7-8': 'Steamed whole or halved',
      '9-12': 'Steamed, cut into pieces',
      '12+': 'Lightly cooked'
    },
    tips: ['Whole bean is perfect shape for baby to hold', 'Steam until easily squished', 'Trim ends']
  },
  {
    id: 'zucchini', name: 'Zucchini (Courgette)', emoji: '🥒', category: 'Vegetables',
    serving: {
      '6': 'Steamed sticks or rounds, soft',
      '7-8': 'Steamed sticks or pieces',
      '9-12': 'Cooked pieces',
      '12+': 'Various preparations'
    },
    tips: ['Gets very soft when cooked', 'Leave skin on for nutrition and grip', 'Mild flavor']
  },
  {
    id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'Vegetables',
    serving: {
      '6': 'Large spears with most flesh scooped out (skin only for sucking)',
      '7-8': 'Thin slices or spears, skin on for grip',
      '9-12': 'Thin slices or small pieces',
      '12+': 'Slices or sticks'
    },
    tips: ['Start with skin-only spears for teething', 'Can be slippery', 'Refreshing for teething gums']
  },
  {
    id: 'bell-pepper', name: 'Bell Pepper', emoji: '🫑', category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed until soft, strips',
      '7-8': 'Soft cooked strips',
      '9-12': 'Soft cooked pieces, thin raw strips to suck',
      '12+': 'Cooked or raw strips'
    },
    tips: ['Skin can be tough - roast and peel, or serve raw for sucking only', 'Red/yellow sweeter than green', 'High in vitamin C']
  },
  {
    id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'Vegetables',
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
    id: 'spinach', name: 'Spinach', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked and finely chopped, mixed into foods',
      '7-8': 'Cooked and chopped',
      '9-12': 'Cooked, chopped or in dishes',
      '12+': 'Cooked or raw in salads'
    },
    tips: ['High in iron (pair with vitamin C for absorption)', 'Wilts quickly - easy to add to anything', 'Sautéed with garlic is tasty']
  },
  {
    id: 'kale', name: 'Kale', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked until very soft, finely chopped',
      '7-8': 'Cooked and chopped',
      '9-12': 'Cooked and chopped',
      '12+': 'Cooked, or crispy kale chips'
    },
    tips: ['Remove tough stems', 'Massage raw kale to soften if using', 'Very nutrient-dense']
  },
  {
    id: 'butternut-squash', name: 'Butternut Squash', emoji: '🎃', category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed until soft, wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Soft chunks',
      '12+': 'Various preparations'
    },
    tips: ['Sweet and popular with babies', 'Roasting concentrates flavor', 'Freezes well']
  },
  {
    id: 'pumpkin', name: 'Pumpkin', emoji: '🎃', category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed until soft, wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Soft chunks',
      '12+': 'Various preparations'
    },
    tips: ['Similar to butternut squash', 'Canned pumpkin (pure, not pie filling) is convenient', 'High in vitamin A']
  },
  {
    id: 'asparagus', name: 'Asparagus', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Steamed whole spears until soft',
      '7-8': 'Steamed spears',
      '9-12': 'Steamed, cut into pieces',
      '12+': 'Roasted or steamed'
    },
    tips: ['Natural handle shape', 'Snap off woody ends', 'Tips are softest part']
  },
  {
    id: 'corn', name: 'Corn', emoji: '🌽', category: 'Vegetables',
    serving: {
      '6': 'Corn on cob to gnaw (kernels will mostly come off whole)',
      '7-8': 'Cob to gnaw or kernels smashed',
      '9-12': 'Cob or whole kernels if pincer grip good',
      '12+': 'Cob or kernels'
    },
    tips: ['Kernels often pass through undigested - totally normal', 'Cob is great for teething', 'Cut cob into rounds for easier handling']
  },
  {
    id: 'mushroom', name: 'Mushrooms', emoji: '🍄', category: 'Vegetables',
    serving: {
      '6': 'Cooked until soft, finely chopped or sliced',
      '7-8': 'Cooked slices',
      '9-12': 'Cooked pieces',
      '12+': 'Various preparations'
    },
    tips: ['Always cook - never raw', 'Button, cremini, portobello all fine', 'Good umami flavor']
  },
  {
    id: 'eggplant', name: 'Eggplant (Aubergine)', emoji: '🍆', category: 'Vegetables',
    serving: {
      '6': 'Roasted until very soft, strips or mashed',
      '7-8': 'Soft roasted strips',
      '9-12': 'Soft cooked pieces',
      '12+': 'Various preparations'
    },
    tips: ['Gets very soft when roasted', 'Skin is nutritious but can be peeled if tough', 'Absorbs flavors well']
  },
  {
    id: 'potato', name: 'Potato', emoji: '🥔', category: 'Vegetables',
    serving: {
      '6': 'Roasted/boiled until soft, wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Chunks or mashed',
      '12+': 'Various preparations'
    },
    tips: ['Roasted wedges with skin for grip', 'All varieties work', 'Good paired with healthy fats for nutrition absorption']
  },
  {
    id: 'parsnip', name: 'Parsnip', emoji: '🥕', category: 'Vegetables',
    serving: {
      '6': 'Roasted/steamed until soft, wedges or mashed',
      '7-8': 'Soft cooked wedges',
      '9-12': 'Soft cooked pieces',
      '12+': 'Various preparations'
    },
    tips: ['Naturally sweet when roasted', 'Similar prep to carrots', 'High in fiber']
  },
  {
    id: 'beetroot', name: 'Beetroot', emoji: '🟣', category: 'Vegetables',
    serving: {
      '6': 'Roasted until soft, wedges or mashed',
      '7-8': 'Soft wedges or chunks',
      '9-12': 'Soft pieces',
      '12+': 'Various preparations'
    },
    tips: ['Will stain everything!', 'Naturally sweet', 'Red poop/urine after eating is normal'],
    warnings: ['May cause red stool/urine - not blood, just beetroot']
  },
  {
    id: 'cabbage', name: 'Cabbage', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked until very soft, shredded',
      '7-8': 'Soft cooked shreds',
      '9-12': 'Cooked shreds or pieces',
      '12+': 'Cooked or raw if finely shredded'
    },
    tips: ['Cook well to soften', 'Purple cabbage has more antioxidants', 'May cause gas']
  },
  {
    id: 'brussels-sprouts', name: 'Brussels Sprouts', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Steamed/roasted until soft, quartered or shredded',
      '7-8': 'Soft quartered or halved',
      '9-12': 'Soft pieces',
      '12+': 'Halved or whole'
    },
    tips: ['Quarter for safety', 'Roasting reduces bitterness', 'High in vitamin C']
  },
  {
    id: 'onion', name: 'Onion', emoji: '🧅', category: 'Vegetables',
    serving: {
      '6': 'Cooked into dishes (sautéed until soft)',
      '7-8': 'Cooked in dishes',
      '9-12': 'Soft cooked pieces',
      '12+': 'Cooked, raw in small amounts'
    },
    tips: ['Great for flavoring food', 'Cook until very soft', 'Caramelized onions are sweet and tasty']
  },
  {
    id: 'garlic', name: 'Garlic', emoji: '🧄', category: 'Vegetables',
    serving: {
      '6': 'Cooked into foods (not whole cloves)',
      '7-8': 'Cooked into foods',
      '9-12': 'Cooked into foods',
      '12+': 'Cooked into foods'
    },
    tips: ['Excellent for flavoring baby food', 'Roasted garlic is mild and spreadable', 'Immune-boosting properties']
  },
  {
    id: 'leek', name: 'Leek', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked until very soft, chopped',
      '7-8': 'Soft cooked pieces',
      '9-12': 'Soft cooked pieces',
      '12+': 'Cooked'
    },
    tips: ['Milder than onion', 'Clean well - dirt hides between layers', 'Great in soups and purées']
  },
  {
    id: 'celery', name: 'Celery', emoji: '🥬', category: 'Vegetables',
    serving: {
      '6': 'Cooked until soft in soups/stews only',
      '7-8': 'Cooked until soft',
      '9-12': 'Cooked until soft',
      '12+': 'Cooked, raw strings removed from 2+'
    },
    tips: ['Raw celery is a choking hazard', 'Remove strings or cook until very soft', 'Good for flavoring stocks'],
    warnings: ['Raw celery sticks not safe until 4+ years']
  },

  // ============ PROTEIN ============
  {
    id: 'chicken', name: 'Chicken', emoji: '🍗', category: 'Protein',
    serving: {
      '6': 'Shredded, minced, or drumstick to gnaw (with bone for grip)',
      '7-8': 'Shredded or small pieces',
      '9-12': 'Small pieces or strips',
      '12+': 'Various cuts'
    },
    tips: ['Dark meat is more moist', 'Shred against the grain', 'Drumsticks with cartilage removed are great for gnawing']
  },
  {
    id: 'beef', name: 'Beef', emoji: '🥩', category: 'Protein',
    serving: {
      '6': 'Slow-cooked until shreddable, minced, or steak strips to suck',
      '7-8': 'Shredded or minced',
      '9-12': 'Small tender pieces or mince',
      '12+': 'Various preparations'
    },
    tips: ['High in iron and zinc', 'Slow-cook for tenderness', 'Steak strips are great for gnawing but expect little actual eating at first']
  },
  {
    id: 'pork', name: 'Pork', emoji: '🥓', category: 'Protein',
    serving: {
      '6': 'Slow-cooked until shreddable, minced',
      '7-8': 'Shredded or minced',
      '9-12': 'Small tender pieces',
      '12+': 'Various preparations'
    },
    tips: ['Pulled pork is great texture', 'Avoid processed pork (bacon, ham) due to salt', 'Cook thoroughly']
  },
  {
    id: 'lamb', name: 'Lamb', emoji: '🍖', category: 'Protein',
    serving: {
      '6': 'Slow-cooked until tender, shredded or minced',
      '7-8': 'Shredded or minced',
      '9-12': 'Small tender pieces',
      '12+': 'Various preparations'
    },
    tips: ['Rich in iron and zinc', 'Lamb cutlet bone makes good handle', 'Can have strong flavor - mix with milder foods']
  },
  {
    id: 'turkey', name: 'Turkey', emoji: '🦃', category: 'Protein',
    serving: {
      '6': 'Shredded or minced, very moist',
      '7-8': 'Shredded or small pieces',
      '9-12': 'Small pieces',
      '12+': 'Various preparations'
    },
    tips: ['Can be dry - use dark meat or add moisture', 'Ground turkey great for meatballs', 'Good protein source']
  },
  {
    id: 'fish', name: 'Fish (White Fish)', emoji: '🐟', category: 'Protein',
    serving: {
      '6': 'Flaked, checking carefully for bones',
      '7-8': 'Flaked pieces',
      '9-12': 'Flaked or small pieces',
      '12+': 'Various preparations'
    },
    tips: ['Cod, haddock, tilapia are mild', 'Check thoroughly for bones', 'Baked or poached is best'],
    warnings: ['Always check for bones']
  },
  {
    id: 'salmon', name: 'Salmon', emoji: '🍣', category: 'Protein',
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
    id: 'sardines', name: 'Sardines', emoji: '🐟', category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Mashed or flaked, bones are soft and edible',
      '7-8': 'Mashed or pieces',
      '9-12': 'Pieces',
      '12+': 'Whole or pieces'
    },
    tips: ['Bones are soft and calcium-rich', 'Choose low-sodium varieties', 'Very nutritious - omega-3s and vitamin D'],
    warnings: ['Fish is a top allergen']
  },
  {
    id: 'shrimp', name: 'Shrimp/Prawns', emoji: '🦐', category: 'Protein',
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
    id: 'egg', name: 'Eggs', emoji: '🥚', category: 'Protein',
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
    id: 'tofu', name: 'Tofu', emoji: '🧈', category: 'Protein',
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
    id: 'beans', name: 'Beans (Black, Kidney, etc.)', emoji: '🫘', category: 'Protein',
    serving: {
      '6': 'Mashed or smashed, skins removed if tough',
      '7-8': 'Smashed or whole soft beans',
      '9-12': 'Whole or slightly mashed',
      '12+': 'Whole'
    },
    tips: ['Rinse canned beans to reduce sodium', 'Mash to reduce choking risk initially', 'Great fiber and iron source']
  },
  {
    id: 'lentils', name: 'Lentils', emoji: '🟤', category: 'Protein',
    serving: {
      '6': 'Cooked soft, mashed or whole',
      '7-8': 'Whole soft lentils',
      '9-12': 'Whole',
      '12+': 'Whole in various dishes'
    },
    tips: ['Red lentils cook quickest and get mushy (great for baby)', 'High in iron and protein', 'No soaking needed for most types']
  },
  {
    id: 'chickpeas', name: 'Chickpeas', emoji: '🟡', category: 'Protein',
    serving: {
      '6': 'Mashed or as hummus, or quartered',
      '7-8': 'Mashed, hummus, or smashed',
      '9-12': 'Smashed or whole if soft',
      '12+': 'Whole'
    },
    tips: ['Hummus is perfect first food', 'Can be choking hazard whole - smash at first', 'Good protein and fiber']
  },

  // ============ GRAINS ============
  {
    id: 'oats', name: 'Oats/Oatmeal', emoji: '🥣', category: 'Grains',
    serving: {
      '6': 'Cooked until soft, can be thick for spoon or finger scooping',
      '7-8': 'Oatmeal, oat fingers/bars',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Iron-fortified baby oatmeal good early option', 'Can make oat "fingers" for BLW', 'Steel-cut takes longer but has lower GI']
  },
  {
    id: 'rice', name: 'Rice', emoji: '🍚', category: 'Grains',
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
    id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'Grains',
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
    id: 'bread', name: 'Bread', emoji: '🍞', category: 'Grains',
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
    id: 'quinoa', name: 'Quinoa', emoji: '🟤', category: 'Grains',
    serving: {
      '6': 'Well-cooked, can mix into other foods for grip',
      '7-8': 'Cooked quinoa in foods or patties',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Complete protein', 'Rinse before cooking to remove bitter coating', 'Can make into finger-food patties']
  },
  {
    id: 'couscous', name: 'Couscous', emoji: '🟡', category: 'Grains',
    allergen: true,
    serving: {
      '6': 'Cooked, clumped together or mixed into foods',
      '7-8': 'Cooked couscous',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Israeli/pearl couscous is larger and easier to handle', 'Regular couscous can be pressed into shapes', 'Quick to prepare'],
    warnings: ['Made from wheat - contains gluten']
  },
  {
    id: 'barley', name: 'Barley', emoji: '🟤', category: 'Grains',
    allergen: true,
    serving: {
      '6': 'Well-cooked until very soft',
      '7-8': 'Soft cooked barley',
      '9-12': 'Various preparations',
      '12+': 'Any style'
    },
    tips: ['Pearl barley cooks faster', 'Great in soups and stews', 'High in fiber'],
    warnings: ['Contains gluten']
  },

  // ============ DAIRY ============
  {
    id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'Dairy',
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
    id: 'yogurt', name: 'Yogurt', emoji: '🥛', category: 'Dairy',
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
  {
    id: 'butter', name: 'Butter', emoji: '🧈', category: 'Dairy',
    allergen: true,
    serving: {
      '6': 'In cooking, spread thin on toast',
      '7-8': 'In cooking, on foods',
      '9-12': 'Various uses',
      '12+': 'Normal use'
    },
    tips: ['Good source of fat', 'Unsalted preferred for babies', 'Can use for cooking']
  },
  {
    id: 'cottage-cheese', name: 'Cottage Cheese', emoji: '🥛', category: 'Dairy',
    allergen: true,
    serving: {
      '6': 'Full-fat, low-sodium variety',
      '7-8': 'As is or mixed into foods',
      '9-12': 'Various uses',
      '12+': 'Any style'
    },
    tips: ['Choose low-sodium full-fat version', 'Good protein source', 'Pair with fruit']
  },
  {
    id: 'cream-cheese', name: 'Cream Cheese', emoji: '🧀', category: 'Dairy',
    allergen: true,
    serving: {
      '6': 'Spread thin on toast or crackers',
      '7-8': 'Spread on foods',
      '9-12': 'Various uses',
      '12+': 'Normal use'
    },
    tips: ['Good for spreading on toast', 'Full-fat versions preferred', 'Can mix with fruit for dip']
  },

  // ============ NUTS & SEEDS (ALLERGENS) ============
  {
    id: 'peanut-butter', name: 'Peanut Butter', emoji: '🥜', category: 'Protein',
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
    id: 'almond-butter', name: 'Almond Butter', emoji: '🌰', category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Thinned or spread very thin on foods',
      '7-8': 'Thin spread on foods',
      '9-12': 'Thin spread',
      '12+': 'Spread thinly'
    },
    tips: ['Tree nut - separate allergen from peanut', 'Same rules as peanut butter - thin only', 'Good healthy fats'],
    warnings: ['Tree nut allergen - introduce early']
  },
  {
    id: 'seeds', name: 'Seeds (Chia, Flax, Hemp)', emoji: '🌱', category: 'Protein',
    serving: {
      '6': 'Ground or mixed into foods (whole can be choking hazard)',
      '7-8': 'Ground or as chia pudding',
      '9-12': 'Ground or whole small seeds',
      '12+': 'Various uses'
    },
    tips: ['Sesame is a top allergen - introduce early', 'Ground flax for omega-3s', 'Chia pudding is great texture for babies'],
    warnings: ['Sesame is a top allergen - include tahini or sesame seeds early']
  },
  {
    id: 'tahini', name: 'Tahini', emoji: '🥜', category: 'Protein',
    allergen: true,
    serving: {
      '6': 'Thinned and drizzled or mixed into foods',
      '7-8': 'Mixed into foods or as dip base',
      '9-12': 'Various uses',
      '12+': 'Normal use'
    },
    tips: ['Sesame is a top allergen - introduce early', 'Great in hummus', 'High in calcium and iron'],
    warnings: ['Sesame is a top 9 allergen - deliberate introduction recommended']
  },

  // ============ OTHER ============
  {
    id: 'hummus', name: 'Hummus', emoji: '🥙', category: 'Protein',
    allergen: true,
    serving: {
      '6': 'As dip for veggies, spread on toast, or preloaded spoon',
      '7-8': 'Dip or spread',
      '9-12': 'Dip or spread',
      '12+': 'Normal use'
    },
    tips: ['Great first food - exposes to chickpeas and sesame', 'Make at home to control salt', 'Perfect for dipping and spreading'],
    warnings: ['Contains sesame (tahini) - top allergen']
  },
  {
    id: 'avocado-oil', name: 'Avocado Oil', emoji: '🥑', category: 'Other',
    serving: {
      '6': 'Use for cooking',
      '7-8': 'Cooking',
      '9-12': 'Cooking',
      '12+': 'Cooking and dressings'
    },
    tips: ['Good neutral oil for baby food', 'High smoke point', 'Healthy fats']
  },
  {
    id: 'olive-oil', name: 'Olive Oil', emoji: '🫒', category: 'Other',
    serving: {
      '6': 'Drizzle on foods or use in cooking',
      '7-8': 'Cooking and drizzling',
      '9-12': 'Various uses',
      '12+': 'Normal use'
    },
    tips: ['Extra virgin is most nutritious', 'Great healthy fat to add to veggies', 'Helps absorption of fat-soluble vitamins']
  },
  {
    id: 'bone-broth', name: 'Bone Broth', emoji: '🍲', category: 'Other',
    serving: {
      '6': 'Use as cooking liquid, small sips, or in purées',
      '7-8': 'In cooking or small amounts to drink',
      '9-12': 'Various uses',
      '12+': 'Normal use'
    },
    tips: ['Nutrient-rich cooking liquid', 'Make at home to control sodium', 'Good for immune support']
  },
  {
    id: 'honey', name: 'Honey', emoji: '🍯', category: 'Other',
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

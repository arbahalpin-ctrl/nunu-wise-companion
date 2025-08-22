export const weeklyQuotes = [
  {
    week: 1,
    quote: "You don't have to be perfect to be exactly what your baby needs. You're already enough.",
    emoji: "🌸"
  },
  {
    week: 2, 
    quote: "It's okay if today was messy. Tomorrow is a new chance to be gentle with yourself.",
    emoji: "🤗"
  },
  {
    week: 3,
    quote: "Rest isn't selfish—it's how you refill the well you're pouring from every day.",
    emoji: "🛌"
  },
  {
    week: 4,
    quote: "Feeling overwhelmed doesn't mean you're failing. It means you're human, and that's beautiful.",
    emoji: "💙"
  },
  {
    week: 5,
    quote: "You're becoming someone new while caring for someone new. Be patient with both of you.",
    emoji: "🌱"
  },
  {
    week: 6,
    quote: "Asking for help isn't giving up—it's showing your baby what healthy support looks like.",
    emoji: "🫶"
  },
  {
    week: 7,
    quote: "The tiny moments matter more than the big gestures. You're writing love in everyday care.",
    emoji: "✨"
  },
  {
    week: 8,
    quote: "Your feelings—all of them—are valid. There's no wrong way to feel right now.",
    emoji: "🤲"
  },
  {
    week: 9,
    quote: "You're not losing yourself in motherhood. You're discovering parts of yourself you never knew existed.",
    emoji: "🦋"
  },
  {
    week: 10,
    quote: "Love and exhaustion can live in the same heart. Both are true, both are okay.",
    emoji: "💕"
  },
  {
    week: 11,
    quote: "Be as kind to yourself as you would be to your own child having a hard day.",
    emoji: "🧸"
  },
  {
    week: 12,
    quote: "You're not behind on anything. You're exactly where you need to be, one breath at a time.",
    emoji: "🌿"
  }
];

// Get current week of year
export const getCurrentWeekQuote = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekOfYear = Math.floor(diff / oneWeek);
  
  // Cycle through the 12 quotes
  const quoteIndex = weekOfYear % 12;
  return weeklyQuotes[quoteIndex];
};
export const weeklyQuotes = [
  {
    week: 1,
    quote: "Love and exhaustion can live in the same heart. Both are true, both are okay.",
    emoji: "💕"
  },
  {
    week: 2, 
    quote: "You are not behind. You are exactly where your baby needs you to be.",
    emoji: "🌿"
  },
  {
    week: 3,
    quote: "Your baby doesn't need perfection. Just your love, your presence, your breath.",
    emoji: "🤗"
  },
  {
    week: 4,
    quote: "Some days will feel endless. But so will the love.",
    emoji: "🌸"
  },
  {
    week: 5,
    quote: "Rest is resistance. You deserve rest even if the laundry isn't done.",
    emoji: "🛌"
  },
  {
    week: 6,
    quote: "You don't have to enjoy every moment. Just survive the ones that are hard.",
    emoji: "🤲"
  },
  {
    week: 7,
    quote: "You're doing enough. Even when it doesn't feel like it.",
    emoji: "✨"
  },
  {
    week: 8,
    quote: "You were never meant to do this alone. And you don't have to.",
    emoji: "🫶"
  },
  {
    week: 9,
    quote: "You're not losing yourself. You're evolving into something even stronger.",
    emoji: "🦋"
  },
  {
    week: 10,
    quote: "Your feelings—all of them—are valid. There's no wrong way to feel right now.",
    emoji: "💙"
  },
  {
    week: 11,
    quote: "Be as kind to yourself as you would be to your own child having a hard day.",
    emoji: "🧸"
  },
  {
    week: 12,
    quote: "Asking for help isn't giving up—it's showing your baby what healthy support looks like.",
    emoji: "🌱"
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
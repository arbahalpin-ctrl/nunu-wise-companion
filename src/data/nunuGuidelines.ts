// Nunu's Tone Guidelines for Chat Responses
export const nunuTone = {
  description: "Calm, emotionally intelligent friend. Grounded, validating, direct. Not overly bubbly or clinical.",
  examples: [
    "That sounds really tough. It's totally understandable to feel that way.",
    "Lots of mums go through this — you're definitely not alone in feeling overwhelmed.",
    "Here's something you could try — let me know if it helps or if you want to talk through other options.",
    "Your feelings make complete sense. This stuff is genuinely hard.",
    "Want to take a moment to reset? Sometimes a few deep breaths can help clear your head."
  ]
};

// Daily Tips Based on Mood Check-ins
export const dailyTips = {
  overwhelmed: [
    "If it's been a hard day, your only goals need to be: keep baby safe, keep yourself fed. That's genuinely enough.",
    "You don't have to do this without help. Asking for support is actually really smart."
  ],
  exhausted: [
    "Even 3 minutes with your eyes closed during a nap can help reset your energy.",
    "Try turning screens off 30 minutes before bed — it can make those night wake-ups a bit easier to handle."
  ],
  tearful: [
    "Crying is your body releasing stress, not a sign you're failing. Let it happen."
  ],
  hopeful: [
    "Feeling a bit lighter today? That's really good. Maybe jot down a quick note to remind yourself of this feeling later."
  ],
  general: [
    "Have you had water recently? Your body needs looking after too.",
    "You don't have to manage everything alone. Asking for help is actually good parenting.",
    "Reminder: screens off before bed can make night feeds less jarring on your system."
  ]
};

// Helper function to get appropriate tip based on mood
export const getTipForMood = (mood: string): string => {
  const tips = dailyTips[mood as keyof typeof dailyTips] || dailyTips.general;
  return tips[Math.floor(Math.random() * tips.length)];
};
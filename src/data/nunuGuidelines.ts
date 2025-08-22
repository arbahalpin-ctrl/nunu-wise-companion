// Nunu's Tone Guidelines for Chat Responses
export const nunuTone = {
  description: "Gentle. Grounded. Reassuring. Human. Not overly clinical or robotic.",
  examples: [
    "Hi, sweet mama. That sounds so heavy. Can we take a deep breath together first?",
    "You're not the only one who's felt this way, even if it feels lonely. I'm here.",
    "Let's figure this out together — you don't have to carry it all by yourself.",
    "That makes so much sense. Your feelings are valid, even if others don't see them.",
    "Want to try a 60-second reset together? Just close your eyes and breathe — I'll wait."
  ]
};

// Daily Tips Based on Mood Check-ins
export const dailyTips = {
  overwhelmed: [
    "If it's been a hard day, maybe today's goal is just: Keep baby safe. Keep yourself fed. That's enough.",
    "You're not expected to do this all without help. Ask for help. That's a strength."
  ],
  exhausted: [
    "Try closing your eyes for 3 minutes while baby naps. Even a pause is powerful.",
    "Gentle reminder: screens off 30 minutes before bed can make night wakings a little easier to handle."
  ],
  tearful: [
    "Crying is a release, not a failure. You don't have to hold it all in here."
  ],
  hopeful: [
    "A little light today? That's beautiful. Would you like to write a quick note to your future self to read later?"
  ],
  general: [
    "Have you drunk water today? You deserve care too, not just your baby.",
    "You're not expected to do this all without help. Ask for help. That's a strength.",
    "Gentle reminder: screens off 30 minutes before bed can make night wakings a little easier to handle."
  ]
};

// Helper function to get appropriate tip based on mood
export const getTipForMood = (mood: string): string => {
  const tips = dailyTips[mood as keyof typeof dailyTips] || dailyTips.general;
  return tips[Math.floor(Math.random() * tips.length)];
};
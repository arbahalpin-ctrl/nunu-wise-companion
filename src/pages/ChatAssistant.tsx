import { useState, useEffect } from 'react';
import { Send, Bot, User, Heart, Clock, ChefHat, ToggleLeft, ToggleRight, Sparkles, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import nunuKitchenIcon from '@/assets/nunu-kitchen-icon.jpg';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatAssistantProps {
  isKitchenMode?: boolean;
  onKitchenModeChange?: (mode: boolean) => void;
}

const ChatAssistant = ({ isKitchenMode: initialKitchenMode = false, onKitchenModeChange }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello beautiful mama! I'm Nunu, your compassionate motherhood companion. I'm here to support you through all aspects of this journey - sleep, feeding, emotional wellness, development, and everything in between. What's on your heart today? 💙",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKitchenMode, setIsKitchenMode] = useState(initialKitchenMode);
  const [weaningPreference, setWeaningPreference] = useState<'blw' | 'spoon' | 'mixed'>('blw');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sync with parent component
  useEffect(() => {
    if (initialKitchenMode !== isKitchenMode) {
      setIsKitchenMode(initialKitchenMode);
    }
  }, [initialKitchenMode]);

  useEffect(() => {
    onKitchenModeChange?.(isKitchenMode);
  }, [isKitchenMode, onKitchenModeChange]);

  // Generate intelligent AI responses based on user input - comprehensive motherhood support
  const generateNunuResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Sleep-related responses
    if (message.includes('sleep') || message.includes('bedtime') || message.includes('night') || message.includes('nap')) {
      const sleepResponses = [
        "Sleep challenges are so common, mama. Every baby is different, and finding what works takes time. What's been the biggest struggle for you lately? 💤",
        "I hear you on the sleep struggles. Remember, there's no perfect baby sleep - only what works for your family. Can you tell me about your current bedtime routine?",
        "Sleep deprivation is hard on everyone. You're not alone in this journey. What time does your little one usually go to bed? Let's start there and work together. 🌙",
        "It sounds like sleep has been challenging. That's completely normal! Many families go through this. What would feel like a win for you right now - even a small one?"
      ];
      return sleepResponses[Math.floor(Math.random() * sleepResponses.length)];
    }
    
    // Nunu's Kitchen - Comprehensive Weaning & Recipe Responses
    if (message.includes('wean') || message.includes('solid') || message.includes('food') || message.includes('recipe') || message.includes('eat') || message.includes('meal') || message.includes('allergen') || message.includes('peanut') || message.includes('egg') || message.includes('pasta') || message.includes('finger') || message.includes('blw') || message.includes('spoon') || message.includes('chok') || message.includes('gag') || message.includes('texture') || message.includes('kitchen') || message.includes('cook') || message.includes('prep') || message.includes('cut') || message.includes('steam') || message.includes('month') || message.includes('breakfast') || message.includes('lunch') || message.includes('dinner') || message.includes('snack')) {
      
      // Specific food safety questions
      if (message.includes('egg')) {
        return "Great choice! Eggs are wonderful from 6+ months. 🥚 **Safe serving:** For BLW, try well-cooked egg strips or mini muffins. For spoon-feeding, scrambled eggs work perfectly. **Safety tip:** Cook thoroughly (no runny yolks for babies). Start with just egg yolk if you're nervous, then whole egg. You're doing amazing introducing variety! ✨";
      }
      
      if (message.includes('strawberr')) {
        return "Strawberries are delicious and safe from 6+ months! 🍓 **Safe serving:** For babies under 12 months, cut lengthwise into thin slices or quarters (never whole). For 10+ months, you can cut into small pieces. **Safety tip:** Rinse well and remove the green top. Fresh is best - frozen works too! Your little one will love the sweet taste.";
      }
      
      if (message.includes('tuna')) {
        return "Tuna can be offered from 6+ months - great protein choice! 🐟 **Safe serving:** Choose canned tuna in water (low sodium), flake into small pieces or mix into pasta/rice. **Safety tip:** Limit to 1-2 times per week due to mercury. Look for 'light' tuna vs albacore. Mix with avocado or cream cheese for easy eating! You're giving them such good nutrition.";
      }
      
      if (message.includes('carrot') && (message.includes('oat') || message.includes('what can i make'))) {
        return "Carrots and oats make a perfect combo! 🥕 **3 easy ideas:** 1) Steamed carrot sticks + oat porridge fingers, 2) Carrot-oat mini muffins (blend both, add egg), 3) Overnight oats with grated raw carrot for older babies. **Safety tip:** Steam carrots until finger-soft. You're so creative with combinations!";
      }
      
      if (message.includes('breakfast') && message.includes('blw')) {
        return "BLW breakfasts are so fun! Here are 3 easy ideas: 🌅 **1) Banana pancakes** (mashed banana + egg, cook as strips), **2) Toast soldiers** with avocado smear or nut butter, **3) Steamed apple wedges** with cinnamon. **Safety tip:** Make sure everything is soft enough to squish with your fingers. Your little one will love exploring these textures!";
      }
      
      if (message.includes('protein') && message.includes('lunch')) {
        return "Protein lunches made simple! 💪 **Easy options:** 1) Shredded chicken mixed with pasta, 2) Mashed chickpeas formed into patties, 3) Scrambled egg with cheese strips, 4) Fish cakes (salmon/cod). **Prep tip:** Cook proteins until very tender. Batch cook on weekends! You're doing such a great job nourishing your baby.";
      }
      
      // General weaning responses with enhanced safety focus
      const weaningResponses = [
        "Welcome to Nunu's Kitchen! 👩‍🍳 Weaning is such an exciting journey. Every baby develops at their own pace with eating. How old is your little one and what foods have you tried so far? I'll share age-appropriate, safe serving suggestions!",
        "Starting solids can feel overwhelming, but you've got this! Remember, 'food before one is just for fun' - milk is still their main nutrition. **Safety first:** Always supervise eating and trust your instincts. What specific foods or textures are you curious about?",
        "Baby-led weaning and spoon feeding both have amazing benefits - many families do a combination! What approach feels right for your family? I can share safe serving sizes and shapes for any food you're thinking about! 🍌",
        "Gagging vs choking - such an important distinction! Gagging is normal and actually shows their reflexes are working to keep them safe. It sounds scary but it's different from choking. **Signs of normal gagging:** Loud, able to breathe/cry. What foods are you worried about?",
        "Allergen introduction can feel nerve-wracking, but early exposure (around 6 months) is actually protective! **Top 8 allergens:** Peanuts, eggs, milk, fish, shellfish, tree nuts, wheat, soy. Start with small amounts mixed into familiar foods. How can I help you feel confident?",
        "Kitchen prep tips coming right up! **Golden rules:** Soft enough to squish with your fingers, appropriate size (think grape-sized or smaller for round foods), and always supervise. What are you planning to prepare? I'll give you specific cutting and cooking guidance! 🔪✨"
      ];
      return weaningResponses[Math.floor(Math.random() * weaningResponses.length)];
    }
    
    // General feeding & breastfeeding responses  
    if (message.includes('feed') || message.includes('breastfeed') || message.includes('bottle') || message.includes('milk') || message.includes('latch') || message.includes('pump')) {
      const feedingResponses = [
        "Feeding journeys are so personal and can bring up a lot of emotions. Whether breastfeeding, formula feeding, or combination feeding - you're nourishing your baby with love. What's your experience been like?",
        "Every feeding relationship is unique. Some flow easily, others take patience and support. How are you feeling about feeding right now?",
        "Feeding challenges can feel overwhelming, but remember - a fed baby is the goal, however that looks for your family. What support do you need right now?",
        "Breastfeeding can be beautiful and challenging all at once. Your feelings about it - whatever they are - are completely valid. How are things going for you?"
      ];
      return feedingResponses[Math.floor(Math.random() * feedingResponses.length)];
    }
    
    // Emotional support & overwhelm responses  
    if (message.includes('overwhelmed') || message.includes('tired') || message.includes('exhausted') || message.includes('cry') || message.includes('sad') || message.includes('anxious') || message.includes('depressed') || message.includes('help')) {
      const emotionalResponses = [
        "Oh sweetheart, I can hear how tired you are. Being a parent is one of the hardest things we ever do, and it's okay to feel overwhelmed. You're doing so much more right than you realize. Take a deep breath - we'll figure this out together. 🤗",
        "Feeling overwhelmed is such a common experience in early motherhood. You're managing so much, and it's okay to feel this way. Let's talk about what's weighing on you most.",
        "The emotional ups and downs of motherhood can be intense. It's okay to not feel okay sometimes. Have you been able to talk to anyone about how you're feeling?",
        "Postpartum emotions can be so complex - joy, exhaustion, love, anxiety all mixed together. Your mental health matters just as much as your baby's. How are you caring for yourself?"
      ];
      return emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)];
    }
    
    // Toddler development & behavior responses
    if (message.includes('toddler') || message.includes('tantrum') || message.includes('potty') || message.includes('development') || message.includes('milestone') || message.includes('walking') || message.includes('talking') || message.includes('behavior')) {
      const developmentResponses = [
        "Toddlerhood brings such big emotions in small bodies. Tantrums are actually a sign of healthy emotional development, even though they're exhausting. What's been the most challenging part?",
        "Every child develops at their own pace, and comparison can be such a thief of joy. Your little one is exactly where they need to be. What milestones are you thinking about?",
        "Potty training can test everyone's patience! Remember, readiness varies so much between children. There's no rush. How is your little one showing interest?",
        "The toddler phase is all about growing independence, which can feel like pushback. They're learning to be their own person - it's actually beautiful, even when it's hard. What's been surprising you lately?"
      ];
      return developmentResponses[Math.floor(Math.random() * developmentResponses.length)];
    }
    
    // Identity & self-care responses
    if (message.includes('identity') || message.includes('myself') || message.includes('lost') || message.includes('alone') || message.includes('care') || message.includes('time')) {
      const identityResponses = [
        "The identity shift into motherhood can feel overwhelming. You're still you, just expanding into something new. It's okay to grieve parts of your old life while embracing this new chapter. What feels different for you?",
        "Self-care isn't selfish - it's essential. Even five minutes of breathing space can help restore you. What small thing could you do for yourself today?",
        "Feeling lost sometimes is part of the journey. Motherhood reshapes us in ways we never expected. You're not losing yourself - you're evolving. How can I support you through this?"
      ];
      return identityResponses[Math.floor(Math.random() * identityResponses.length)];
    }
    
    // Routine/schedule questions
    if (message.includes('routine') || message.includes('schedule') || message.includes('structure')) {
      const routineResponses = [
        "Routines can be so helpful, but they don't have to be rigid! Think of it as a gentle rhythm rather than a strict schedule. What does your current day look like?",
        "Some families thrive on structure, others flow more naturally. The key is finding what works for your unique situation. What are you hoping a routine will help with?",
        "Building sustainable routines takes time and lots of gentle adjustments. Be patient with yourself as you figure out what works for your family."
      ];
      return routineResponses[Math.floor(Math.random() * routineResponses.length)];
    }
    
    // Positive/progress responses
    if (message.includes('better') || message.includes('good') || message.includes('working') || message.includes('improving') || message.includes('progress')) {
      return "That's wonderful to hear! I'm so proud of the progress you're making. Small improvements add up to big changes over time. What do you think has been helping the most? Let's build on what's working! ✨";
    }
    
    // Default supportive responses
    const defaultResponses = [
      "Thank you for sharing that with me. It takes courage to reach out when things feel hard. I'm here to support you through this - no judgment, just gentle guidance. What feels most important to work on first?",
      "I can hear how much you care about your little one. That love is everything, even when things feel impossible. Every family's journey is different, and we'll find what works for yours. What's one thing that would help you feel supported today?",
      "You're doing such important work, mama. Parenting is both beautiful and exhausting, often at the same time. I'm here to help you navigate this with kindness - for both your baby and yourself. What support do you need most right now?",
      "Every day of motherhood teaches us something new about ourselves and our children. You're doing beautifully, even in the challenging moments. What's been on your mind? 💙",
      "Motherhood is such a profound journey of love, growth, and transformation. I'm honored you're sharing this space with me. How are you feeling in this moment?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Generate and add AI response after a realistic delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateNunuResponse(newMessage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds for realism
  };

  const suggestedQuestions = [
    "Can my 6-month-old have egg?",
    "How do I cut strawberries safely?", 
    "3 BLW breakfast ideas please",
    "What can I make with carrots and oats?",
    "I'm feeling overwhelmed",
    "Is my baby ready for finger foods?"
  ];

  const kitchenPrompts = [
    "What can I serve at 7 months?",
    "Ideas with banana?", 
    "Is this food safe?",
    "How to introduce allergens?",
    "Easy finger foods for beginners?",
    "Can I give my baby pasta?"
  ];

  const commonIngredients = [
    "🍌 Banana", "🥕 Carrot", "🥑 Avocado", "🍎 Apple", 
    "🧀 Cheese", "🥚 Egg", "🍝 Pasta", "🥔 Sweet Potato"
  ];

  const handleIngredientClick = (ingredient: string) => {
    const ingredientName = ingredient.split(' ')[1];
    setNewMessage(`Ideas with ${ingredientName.toLowerCase()}?`);
  };

  const handlePromptClick = (prompt: string) => {
    setNewMessage(prompt);
  };

  const handleKitchenModeToggle = () => {
    setIsKitchenMode(!isKitchenMode);
    if (!isKitchenMode) {
      // Switch to kitchen mode - add kitchen welcome message
      const kitchenWelcome: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Welcome to Nunu's Kitchen! 👩‍🍳 Let's explore baby's next meal together. I'm here to help with safe food prep, age-appropriate recipes, and weaning guidance. Whether you're doing baby-led weaning or spoon feeding, I'll support you every step of the way! What would you like to know about feeding your little one?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, kitchenWelcome]);
    }
  };

  // Show onboarding on first visit to kitchen mode
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('nunu-kitchen-onboarding');
    if (isKitchenMode && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [isKitchenMode]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('nunu-kitchen-onboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="pb-20 h-screen bg-gradient-comfort flex flex-col">
      <div className={`p-6 rounded-b-3xl flex-shrink-0 ${isKitchenMode ? 'bg-gradient-to-r from-orange-50 to-amber-50' : 'bg-gradient-calm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-gentle ${isKitchenMode ? 'bg-orange-100' : 'bg-primary'}`}>
              {isKitchenMode ? (
                <img src={nunuKitchenIcon} alt="Nunu's Kitchen" className="w-8 h-8 rounded-full" />
              ) : (
                <Bot className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isKitchenMode ? 'text-orange-800' : 'text-foreground'}`}>
                {isKitchenMode ? "Nunu's Kitchen" : "Nunu"}
              </h1>
              <div className={`flex items-center gap-1 text-sm ${isKitchenMode ? 'text-orange-600' : 'text-muted-foreground'}`}>
                <div className="w-2 h-2 bg-nunu-sage rounded-full animate-pulse" />
                {isKitchenMode ? "Your weaning companion" : "Your motherhood companion"}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleKitchenModeToggle}
            variant={isKitchenMode ? "default" : "outline"}
            size="sm"
            className={isKitchenMode ? "bg-orange-200 text-orange-800 hover:bg-orange-300" : ""}
          >
            <ChefHat className="h-4 w-4 mr-2" />
            Kitchen
          </Button>
        </div>

        {isKitchenMode && (
          <div className="space-y-4">
            <p className="text-orange-700 font-medium text-center">
              Let's explore baby's next meal together 🥄
            </p>
            
            {/* Weaning Preference Toggle */}
            <div className="flex items-center justify-center gap-4 bg-white/50 rounded-xl p-3">
              <span className={`text-sm font-medium ${weaningPreference === 'blw' ? 'text-orange-800' : 'text-orange-600'}`}>
                Baby-Led Weaning
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setWeaningPreference('blw')}
                  variant={weaningPreference === 'blw' ? 'default' : 'ghost'}
                  size="sm"
                  className={weaningPreference === 'blw' ? 'bg-orange-200 text-orange-800' : 'text-orange-600'}
                >
                  BLW
                </Button>
                <Button
                  onClick={() => setWeaningPreference('mixed')}
                  variant={weaningPreference === 'mixed' ? 'default' : 'ghost'}
                  size="sm"
                  className={weaningPreference === 'mixed' ? 'bg-orange-200 text-orange-800' : 'text-orange-600'}
                >
                  Mixed
                </Button>
                <Button
                  onClick={() => setWeaningPreference('spoon')}
                  variant={weaningPreference === 'spoon' ? 'default' : 'ghost'}
                  size="sm"
                  className={weaningPreference === 'spoon' ? 'bg-orange-200 text-orange-800' : 'text-orange-600'}
                >
                  Spoon
                </Button>
              </div>
            </div>

            {/* Quick Ingredient Buttons */}
            <div>
              <p className="text-xs text-orange-600 mb-2 text-center">Quick ingredient ideas:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {commonIngredients.map((ingredient, index) => (
                  <Button
                    key={index}
                    onClick={() => handleIngredientClick(ingredient)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-white/70 border-orange-200 text-orange-700 hover:bg-orange-100"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-gentle">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-gentle
              ${message.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card text-card-foreground'
              }
            `}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className={`
                flex items-center gap-1 mt-2 text-xs
                ${message.type === 'user' 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
                }
              `}>
                <Clock className="h-3 w-3" />
                {message.timestamp}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <Card className="shadow-gentle border-none">
              <CardContent className="p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="p-6 pt-0 flex-shrink-0">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {isKitchenMode ? "Recipe & safety suggestions:" : "Suggested questions:"}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {(isKitchenMode ? kitchenPrompts : suggestedQuestions).map((question, index) => (
              <Button
                key={index}
                onClick={() => handlePromptClick(question)}
                variant="ghost"
                className={`justify-start text-left h-auto p-3 text-sm rounded-xl border border-border/50 ${
                  isKitchenMode 
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200' 
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                {isKitchenMode && <ChefHat className="h-3 w-3 mr-2 flex-shrink-0" />}
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6 pt-0 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isKitchenMode ? "Ask about weaning, recipes, or food safety..." : "Share what's on your mind..."}
            className="rounded-full bg-card border-border"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="rounded-full w-12 h-12 p-0 shadow-gentle"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comfort Message */}
      <div className="px-6 pb-4 flex-shrink-0">
        <Card className="shadow-gentle border-none bg-accent-soft">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 text-accent-foreground" />
              <p className="text-xs text-accent-foreground">
                You're doing your best, and that's what matters ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                <img src={nunuKitchenIcon} alt="Nunu's Kitchen" className="w-8 h-8 rounded-full" />
              </div>
              <div>
                <DialogTitle className="text-orange-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Welcome to Nunu's Kitchen!
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-orange-700 leading-relaxed">
              Let Nunu help you with weaning, meal ideas, and food safety. Whether you're doing baby-led weaning or spoon feeding, 
              Nunu is here to guide you through mealtimes with confidence.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Baby className="h-4 w-4" />
                What I can help with:
              </h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Age-appropriate food suggestions</li>
                <li>• Safe cutting and prep techniques</li>
                <li>• Allergen introduction guidance</li>
                <li>• Recipe ideas using your ingredients</li>
                <li>• Choking prevention tips</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleCompleteOnboarding}
              className="w-full bg-orange-200 text-orange-800 hover:bg-orange-300 border border-orange-300"
            >
              Start Chatting
              <ChefHat className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatAssistant;
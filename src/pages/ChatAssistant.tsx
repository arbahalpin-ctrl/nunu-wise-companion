import { useState } from 'react';
import { Send, Bot, User, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatAssistant = () => {
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
    
    // Feeding & weaning responses
    if (message.includes('feed') || message.includes('breastfeed') || message.includes('bottle') || message.includes('wean') || message.includes('milk') || message.includes('latch') || message.includes('solid')) {
      const feedingResponses = [
        "Feeding journeys are so personal and can bring up a lot of emotions. Whether breastfeeding, formula feeding, or combination feeding - you're nourishing your baby with love. What's your experience been like?",
        "Every feeding relationship is unique. Some flow easily, others take patience and support. How are you feeling about feeding right now?",
        "Weaning can bring up such mixed emotions - relief, sadness, freedom, guilt. All of these feelings are normal. Where are you in your feeding journey?",
        "Feeding challenges can feel overwhelming, but remember - a fed baby is the goal, however that looks for your family. What support do you need right now?",
        "Starting solids is such an exciting milestone! It can also feel overwhelming with all the advice out there. How is your little one taking to solid foods?"
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
    "I'm feeling overwhelmed",
    "Help with feeding challenges", 
    "Sleep is so hard right now",
    "Tell me about tantrums"
  ];

  return (
    <div className="pb-20 h-screen bg-gradient-comfort flex flex-col">
      <div className="bg-gradient-calm p-6 rounded-b-3xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-gentle">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Nunu</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-nunu-sage rounded-full animate-pulse" />
              Your motherhood companion
            </div>
          </div>
        </div>
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
      <div className="p-4 flex-shrink-0">
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestedQuestions.map((question) => (
              <Button 
                key={question}
                variant="outline" 
                size="sm"
                className="whitespace-nowrap rounded-full text-xs"
                onClick={() => setNewMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share what's on your mind..."
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
    </div>
  );
};

export default ChatAssistant;
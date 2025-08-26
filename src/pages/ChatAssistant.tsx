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
      content: "Hello lovely! I'm Nunu, your gentle sleep consultant. I'm here to listen without judgment and help you through any sleep challenges. How are you feeling about bedtime and sleep routines lately? 💙",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Generate intelligent AI responses based on user input
  const generateNunuResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Sleep-related responses
    if (message.includes('sleep') || message.includes('bedtime') || message.includes('night')) {
      const sleepResponses = [
        "Sleep challenges are so common, mama. Every baby is different, and finding what works takes time. What's been the biggest struggle for you lately? 💤",
        "I hear you on the sleep struggles. Remember, there's no perfect baby sleep - only what works for your family. Can you tell me about your current bedtime routine?",
        "Sleep deprivation is hard on everyone. You're not alone in this journey. What time does your little one usually go to bed? Let's start there and work together. 🌙",
        "It sounds like sleep has been challenging. That's completely normal! Many families go through this. What would feel like a win for you right now - even a small one?"
      ];
      return sleepResponses[Math.floor(Math.random() * sleepResponses.length)];
    }
    
    // Overwhelmed/emotional responses  
    if (message.includes('overwhelmed') || message.includes('tired') || message.includes('exhausted') || message.includes('help')) {
      return "Oh sweetheart, I can hear how tired you are. Being a parent is one of the hardest things we ever do, and it's okay to feel overwhelmed. You're doing so much more right than you realize. Take a deep breath - we'll figure this out together, one gentle step at a time. 🤗";
    }
    
    // Wake ups during the night
    if (message.includes('wake') || message.includes('waking') || message.includes('night wake')) {
      return "Night wakings can be so draining. Every baby wakes during the night - it's completely normal. The goal isn't to eliminate all wakes, but to help your little one learn to settle back to sleep more easily. How many times are they typically waking? And how long does it usually take to get them back down?";
    }
    
    // Nap-related
    if (message.includes('nap') || message.includes('napping')) {
      return "Naps can be tricky! They're so important for both baby and you to recharge. Some babies are natural nappers, others need more help learning. What's happening with naps right now? Are they too short, hard to start, or not happening at all?";
    }
    
    // Age-related questions
    if (message.includes('month') || message.includes('old') || message.includes('age')) {
      return "Every age and stage brings new sleep patterns. What works at one age might need adjusting as they grow - and that's completely normal. How old is your little one? Understanding their developmental stage helps me give you better guidance. 👶";
    }
    
    // Routine/schedule questions
    if (message.includes('routine') || message.includes('schedule')) {
      return "Routines can be so helpful, but they don't have to be rigid! Think of it as a gentle rhythm rather than a strict schedule. Babies thrive on predictability, but there's room for flexibility too. What does your current bedtime routine look like?";
    }
    
    // Crying/fussy
    if (message.includes('cry') || message.includes('fussy') || message.includes('crying')) {
      return "Crying is their only way to communicate right now, and it doesn't mean you're doing anything wrong. It's so hard to hear them upset, I know. Sometimes they cry because they're overtired, sometimes because they need comfort to settle. You know your baby best - trust your instincts along with these gentle approaches.";
    }
    
    // Positive responses
    if (message.includes('better') || message.includes('good') || message.includes('working') || message.includes('improving')) {
      return "That's wonderful to hear! I'm so proud of the progress you're making. Small improvements add up to big changes over time. What do you think has been helping the most? Let's build on what's working! ✨";
    }
    
    // Default empathetic responses
    const defaultResponses = [
      "Thank you for sharing that with me. It takes courage to reach out when things feel hard. I'm here to support you through this - no judgment, just gentle guidance. What feels most important to work on first?",
      "I can hear how much you care about your little one. That love is everything, even when sleep feels impossible. Every family's journey is different, and we'll find what works for yours. What's one thing that would make tonight feel a little easier?",
      "You're doing such important work, mama. Parenting is both beautiful and exhausting, often at the same time. I'm here to help you navigate this with kindness - for both your baby and yourself. What support do you need most right now?",
      "Sleep challenges don't mean you're failing - they mean you're human, and your baby is learning. We'll work through this together, gently and at your own pace. What feels like the biggest priority to tackle first? 💙"
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
    "My baby won't sleep through the night",
    "Help with bedtime routine",
    "I'm feeling overwhelmed",
    "How many naps is normal?"
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
              Online & ready to help
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
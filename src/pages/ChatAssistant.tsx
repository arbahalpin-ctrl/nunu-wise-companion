import { useState } from 'react';
import { Send, Bot, User, Clock } from 'lucide-react';
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
      content: "Hey. I'm here. What's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Sleep-related
    if (message.includes('sleep') || message.includes('night') || message.includes('nap') || message.includes('wake') || message.includes('tired') || message.includes('exhausted') || message.includes('bedtime')) {
      const sleepResponses = [
        "Sleep deprivation is brutal. It affects everything — your mood, your patience, your ability to think straight. How long has this been going on?",
        "Tell me about your nights. What's the pattern right now?",
        "Sleep training can feel overwhelming when you're already running on empty. What approach have you tried, if any?",
        "The 4am wake-ups hit different, don't they? You're not alone in this. What's been the hardest part?",
        "There's no one-size-fits-all with sleep. Some babies figure it out early, others take longer. What does your gut tell you about what your little one needs?",
        "Have you had any stretches of better sleep recently, or has it been consistently rough?"
      ];
      return sleepResponses[Math.floor(Math.random() * sleepResponses.length)];
    }
    
    // Anxiety / worry
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worry') || message.includes('scared') || message.includes('fear') || message.includes('panic') || message.includes('nervous')) {
      const anxietyResponses = [
        "Anxiety in motherhood is so common, but that doesn't make it easier to carry. What's weighing on you most right now?",
        "That worry feeling in your chest — I know it well. Can you tell me more about what's triggering it?",
        "Your brain is trying to protect your baby by imagining every possible threat. It's exhausting. Let's talk through what's scaring you.",
        "Sometimes just naming the worry out loud takes some of its power away. What would you say if you had to put it into words?",
        "Is this a new feeling, or has anxiety been part of your life for a while?"
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }
    
    // Sadness / depression
    if (message.includes('sad') || message.includes('depressed') || message.includes('cry') || message.includes('tears') || message.includes('hopeless') || message.includes('empty') || message.includes('numb')) {
      const sadResponses = [
        "I'm glad you told me. Sadness deserves to be witnessed, not pushed away. How long have you been feeling this way?",
        "Crying is okay. It's your body releasing something heavy. You don't have to hold it together all the time.",
        "Postpartum emotions can be a rollercoaster. Some days you might feel fine, others feel impossible. Is that what's happening?",
        "Have you been able to talk to anyone about how you're feeling — partner, friend, doctor?",
        "You're not broken. This is hard, and feeling sad about hard things makes sense."
      ];
      return sadResponses[Math.floor(Math.random() * sadResponses.length)];
    }
    
    // Overwhelm
    if (message.includes('overwhelmed') || message.includes('too much') || message.includes('can\'t cope') || message.includes('drowning') || message.includes('failing') || message.includes('not enough')) {
      const overwhelmResponses = [
        "When everything feels like too much, let's zoom in. What's the one thing that feels most urgent right now?",
        "You're not failing. You're carrying more than one person should carry alone. What support do you have?",
        "Sometimes 'good enough' has to be the goal. What's one thing you could let go of today?",
        "The mental load is real and invisible. All that planning, remembering, anticipating — it's exhausting. What's taking up the most headspace?",
        "Take a breath. Right now, in this moment, you're okay. Your baby is okay. Let's start from there."
      ];
      return overwhelmResponses[Math.floor(Math.random() * overwhelmResponses.length)];
    }
    
    // Loneliness / isolation
    if (message.includes('lonely') || message.includes('alone') || message.includes('isolated') || message.includes('no one') || message.includes('friends')) {
      const lonelyResponses = [
        "Loneliness in motherhood is a quiet ache. You can be surrounded by people and still feel completely alone. I hear you.",
        "The friendships that don't fit anymore, the conversations that feel surface-level now... it's a real loss. What do you miss most?",
        "Connection is a basic human need. It's not needy to want adult conversation and understanding. Have you found any spaces that feel safe?",
        "Being touched out and lonely at the same time is such a specific kind of exhaustion. You're not the only one feeling this."
      ];
      return lonelyResponses[Math.floor(Math.random() * lonelyResponses.length)];
    }
    
    // Identity / self
    if (message.includes('myself') || message.includes('identity') || message.includes('who am i') || message.includes('lost') || message.includes('person i was') || message.includes('used to be')) {
      const identityResponses = [
        "Becoming a mother reshapes you in ways no one can prepare you for. It makes sense to grieve parts of who you were.",
        "You're still you. Just... a different version. One that's still forming. What do you miss about your old self?",
        "The identity shift takes time to settle. Some women feel it intensely, others less so. There's no right way to navigate this.",
        "What's one small thing that still feels like 'you' — something that existed before motherhood?"
      ];
      return identityResponses[Math.floor(Math.random() * identityResponses.length)];
    }
    
    // Positive / progress
    if (message.includes('better') || message.includes('good day') || message.includes('progress') || message.includes('thank') || message.includes('helped')) {
      return "That's really good to hear. Progress isn't always linear, but noticing the good moments matters. What helped?";
    }
    
    // Greeting / start
    if (message.includes('hi') || message.includes('hello') || message.includes('hey') || message.length < 10) {
      return "Hey. How are things going today?";
    }
    
    // Default - open and curious
    const defaultResponses = [
      "Tell me more about that.",
      "That sounds like a lot. What's the hardest part?",
      "I'm listening. Take your time.",
      "How long have you been carrying this?",
      "What would feel helpful right now — to vent, to problem-solve, or just to feel heard?",
      "Your feelings make sense given everything you're dealing with. What do you need most right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(newMessage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const quickPrompts = [
    "I can't sleep",
    "I'm feeling anxious",
    "I'm so tired",
    "I feel alone",
    "I need to vent"
  ];

  return (
    <div className="pb-20 h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Simple Header */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Nunu</h1>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              Here for you
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`
              max-w-[80%] rounded-2xl p-4
              ${message.type === 'user' 
                ? 'bg-slate-800 text-white' 
                : 'bg-white shadow-sm border border-slate-100'
              }
            `}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className={`
                flex items-center gap-1 mt-2 text-xs
                ${message.type === 'user' ? 'text-slate-300' : 'text-slate-400'}
              `}>
                <Clock className="h-3 w-3" />
                {message.timestamp}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-slate-500" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white shadow-sm border border-slate-100 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts - Only show at start */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(prompt)}
                className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type what's on your mind..."
            className="rounded-full bg-white border-slate-200 focus:border-slate-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="rounded-full w-12 h-12 p-0 bg-slate-800 hover:bg-slate-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

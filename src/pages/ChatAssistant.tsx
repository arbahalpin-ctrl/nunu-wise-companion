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
  const [messages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi there! I'm here to help you navigate this parenting journey. I noticed Emma usually has her morning feed around this time - how did it go today?",
      timestamp: '10:30'
    },
    {
      id: '2',
      type: 'user',
      content: "She was a bit fussy during feeding this morning. I'm worried I'm doing something wrong.",
      timestamp: '10:32'
    },
    {
      id: '3',
      type: 'assistant',
      content: "That sounds frustrating — but you're not doing anything wrong. Lots of babies have fussy feeds, especially during growth spurts. Some mums find gentle rocking helps — maybe give that a try and see how she responds? You're doing your best, and that matters.",
      timestamp: '10:33'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      // Add user message logic here
      setNewMessage('');
      setIsTyping(true);
      
      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const suggestedQuestions = [
    "Is this normal for her age?",
    "Help with sleep schedule",
    "I'm feeling overwhelmed",
    "Feeding tips"
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
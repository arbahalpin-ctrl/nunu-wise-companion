import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey. I'm Nunu — here to help with sleep, feeding, or just to listen when things feel hard. What's on your mind?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    try {
      // Prepare conversation history for API
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to get response');
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response if API fails
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Can you try again in a moment? 💛",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "My baby won't sleep",
    "I'm feeling overwhelmed",
    "Starting solids advice",
    "I feel so alone",
    "Sleep regression help"
  ];

  return (
    <div className="pb-20 h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex-shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Nunu</h1>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              Sleep & wellbeing expert
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`
              max-w-[85%] rounded-2xl p-4
              ${message.role === 'user' 
                ? 'bg-slate-800 text-white' 
                : 'bg-white shadow-sm border border-slate-100'
              }
            `}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <div className={`
                flex items-center gap-1 mt-2 text-xs
                ${message.role === 'user' ? 'text-slate-300' : 'text-slate-400'}
              `}>
                <Clock className="h-3 w-3" />
                {message.timestamp}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts - Only at start */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 flex-shrink-0 border-t border-slate-100 bg-white/50">
          <p className="text-xs text-slate-400 mb-2">Quick topics:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(prompt)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 flex-shrink-0 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="rounded-full bg-slate-50 border-slate-200 focus:border-slate-400 focus:bg-white"
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="rounded-full w-12 h-10 p-0 bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

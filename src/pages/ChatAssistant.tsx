import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, Trash2, Plus, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'nunu-conversations';

const getInitialMessage = (): Message => ({
  id: '1',
  role: 'assistant',
  content: "Hey. I'm Nunu — here to help with sleep, feeding, or just to listen when things feel hard. What's on your mind?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

const createNewConversation = (): Conversation => ({
  id: Date.now().toString(),
  title: 'New conversation',
  messages: [getInitialMessage()],
  createdAt: Date.now(),
  updatedAt: Date.now()
});

const loadConversations = (): Conversation[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load conversations:', e);
  }
  return [createNewConversation()];
};

const ChatAssistant = () => {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    const convos = loadConversations();
    return convos[0]?.id || '';
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations:', e);
    }
  }, [conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewConversation = () => {
    const newConvo = createNewConversation();
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    setShowMobileSidebar(false);
  };

  const switchConversation = (id: string) => {
    setActiveConversationId(id);
    setShowMobileSidebar(false);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (id === activeConversationId) {
        if (filtered.length > 0) {
          setActiveConversationId(filtered[0].id);
        } else {
          const newConvo = createNewConversation();
          setActiveConversationId(newConvo.id);
          return [newConvo];
        }
      }
      return filtered;
    });
  };

  const updateConversationMessages = (newMessages: Message[]) => {
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        let title = c.title;
        if (title === 'New conversation') {
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
          }
        }
        return { ...c, messages: newMessages, title, updatedAt: Date.now() };
      }
      return c;
    }));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, userMessage];
    updateConversationMessages(updatedMessages);
    setNewMessage('');
    setIsTyping(true);
    
    try {
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      updateConversationMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Can you try again in a moment? 💛",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updateConversationMessages([...updatedMessages, errorMessage]);
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Sidebar content (reused for both mobile and desktop)
  const SidebarContent = () => (
    <>
      <div className="p-3">
        <button
          onClick={startNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-20">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => switchConversation(convo.id)}
            className={`
              group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer mb-1
              ${convo.id === activeConversationId ? 'bg-slate-100' : 'hover:bg-slate-50'}
            `}
          >
            <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 truncate">{convo.title}</p>
              <p className="text-xs text-slate-400">{formatDate(convo.updatedAt)}</p>
            </div>
            {conversations.length > 1 && (
              <button
                onClick={(e) => deleteConversation(convo.id, e)}
                className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="pb-20 h-screen bg-gradient-to-b from-sky-50 to-white flex">
      {/* Desktop Sidebar - Always visible on md+ screens */}
      <div className="hidden md:flex md:flex-col w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Conversations</h2>
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        md:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Conversations</h2>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 md:p-6 flex-shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
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
            <button
              onClick={startNewConversation}
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="New conversation"
            >
              <Plus className="h-5 w-5" />
            </button>
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
                max-w-[85%] md:max-w-[70%] rounded-2xl p-4
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

        {/* Quick Prompts */}
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
    </div>
  );
};

export default ChatAssistant;

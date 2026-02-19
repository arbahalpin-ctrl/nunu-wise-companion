import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Clock, Trash2, Plus, MessageSquare, X, Bookmark, Check, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { conversationsService, savedChatService } from '@/lib/database';

// Simple markdown renderer for chat messages
const renderMarkdown = (text: string) => {
  // Split by newlines first to handle paragraphs
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Process inline formatting
    const parts: (string | JSX.Element)[] = [];
    let remaining = line;
    let keyCounter = 0;
    
    // Process bold (**text**)
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      
      if (boldMatch && boldMatch.index !== undefined) {
        // Add text before the match
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
        // Add bold text
        parts.push(<strong key={`b-${lineIndex}-${keyCounter++}`} className="font-semibold">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        // No more matches, add remaining text
        parts.push(remaining);
        break;
      }
    }
    
    // Return line with line break if not last line
    return (
      <span key={`line-${lineIndex}`}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSleepContext, clearUnread } from '@/utils/chatIntegration';

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
const CHAT_SAVED_KEY = 'nunu-chat-saved';

interface SavedRecipe {
  id: string;
  title: string;
  content: string;
  savedAt: number;
  conversationTitle: string;
}

// Extract recipe/advice title from message content
const extractTitle = (content: string): string => {
  // Try to find a recipe name or title from the content
  const lines = content.split('\n').filter(l => l.trim());
  
  // Pattern 1: Markdown headers like "# Recipe Name" or "## Recipe Name"
  for (const line of lines) {
    const headerMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headerMatch) {
      return headerMatch[1].replace(/\*+/g, '').trim().slice(0, 50);
    }
  }
  
  // Pattern 2: Bold text at start like "**Recipe Name**"
  for (const line of lines.slice(0, 3)) {
    const boldMatch = line.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      return boldMatch[1].trim().slice(0, 50);
    }
  }
  
  // Pattern 3: Look for recipe-like patterns
  const recipePatterns = [
    /(?:recipe|dish|meal):\s*(.+)/i,
    /(?:here's|try|make)\s+(?:a\s+)?(?:simple\s+)?(.+?(?:puree|mash|porridge|fingers|bites|pancakes|muffins|soup|stew))/i,
  ];
  
  for (const pattern of recipePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim().slice(0, 50);
    }
  }
  
  // Pattern 4: First meaningful line if it's short (likely a title)
  const firstLine = lines[0]?.replace(/[\*#]/g, '').trim();
  if (firstLine && firstLine.length <= 60 && !firstLine.includes('.')) {
    return firstLine.slice(0, 50);
  }
  
  // Fallback: first 40 chars of content
  return content.slice(0, 40).replace(/\n/g, ' ').trim() + '...';
};

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
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (user?.id) {
        // Logged in: load from Supabase
        const [convos, savedMessages] = await Promise.all([
          conversationsService.getAll(user.id),
          savedChatService.getAll(user.id)
        ]);
        
        if (convos.length > 0) {
          // Transform from Supabase format
          const transformed = convos.map(c => ({
            id: c.id!,
            title: c.title,
            messages: c.messages,
            createdAt: new Date(c.created_at || Date.now()).getTime(),
            updatedAt: new Date(c.updated_at || Date.now()).getTime()
          }));
          setConversations(transformed);
          setActiveConversationId(transformed[0].id);
        } else {
          // No conversations yet, create one
          const newConvo = createNewConversation();
          setConversations([newConvo]);
          setActiveConversationId(newConvo.id);
        }
        
        // Load saved message IDs
        setSavedMessageIds(new Set(savedMessages.map(m => m.id)));
      } else {
        // Guest: load from localStorage
        const localConvos = loadConversations();
        setConversations(localConvos);
        setActiveConversationId(localConvos[0]?.id || '');
        
        // Load saved from localStorage
        try {
          const saved = localStorage.getItem(CHAT_SAVED_KEY);
          if (saved) {
            const recipes: SavedRecipe[] = JSON.parse(saved);
            setSavedMessageIds(new Set(recipes.map(r => r.id)));
          }
        } catch (e) {}
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [user?.id]);

  // Save conversations when they change
  const saveConversation = useCallback(async (conversation: Conversation) => {
    if (user?.id) {
      // Logged in: save to Supabase
      await conversationsService.save(user.id, {
        id: conversation.id,
        title: conversation.title,
        messages: conversation.messages
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoading) return;
    
    if (user?.id) {
      // Logged in: save active conversation to Supabase
      if (activeConversation) {
        saveConversation(activeConversation);
      }
    } else {
      // Guest: save all to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } catch (e) {
        console.error('Failed to save conversations:', e);
      }
    }
  }, [conversations, user?.id, isLoading, activeConversation, saveConversation]);

  // Clear unread count when chat is opened
  useEffect(() => {
    clearUnread();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount and conversation switch
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConversationId]);

  const startNewConversation = () => {
    const newConvo = createNewConversation();
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    setShowSidebar(false);
  };

  const switchConversation = (id: string) => {
    setActiveConversationId(id);
    setShowSidebar(false);
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Delete from Supabase if logged in
    if (user?.id) {
      await conversationsService.delete(user.id, id);
    }
    
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
      // Send full conversation history for context
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get current sleep context to pass to the AI
      const sleepContext = getSleepContext();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory, sleepContext }),
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

  const saveRecipe = async (message: Message) => {
    if (savedMessageIds.has(message.id)) return;
    
    // Extract a meaningful title from the message content
    const title = extractTitle(message.content);
    const conversationTitle = activeConversation?.title || 'Chat';
    
    try {
      if (user?.id) {
        // Logged in: save to Supabase
        await savedChatService.save(user.id, message.id, title, message.content, conversationTitle);
      } else {
        // Guest: save to localStorage
        const saved = localStorage.getItem(CHAT_SAVED_KEY);
        const recipes: SavedRecipe[] = saved ? JSON.parse(saved) : [];
        
        const newRecipe: SavedRecipe = {
          id: message.id,
          title,
          content: message.content,
          savedAt: Date.now(),
          conversationTitle
        };
        
        recipes.unshift(newRecipe);
        localStorage.setItem(CHAT_SAVED_KEY, JSON.stringify(recipes));
      }
      
      setSavedMessageIds(prev => new Set([...prev, message.id]));
    } catch (e) {
      console.error('Failed to save message:', e);
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

  // Sidebar content
  const SidebarContent = () => (
    <>
      <div className="p-3">
        <button
          onClick={startNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-xs text-slate-400 px-2 mb-2">Previous chats</p>
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

  // Show loading state while data is being loaded
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-80px)] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-slate-500">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Chats</h2>
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        md:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Your Chats</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-sky-50/50 to-white">
        {/* Header */}
        <div className="px-4 py-3 flex-shrink-0 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="View chats"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-800">Nunu</h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Sleep & wellbeing support
                </div>
              </div>
            </div>
            <button
              onClick={startNewConversation}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="New chat"
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
                <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`
                max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3
                ${message.role === 'user' 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-white shadow-sm border border-slate-100'
                }
              `}>
                <div className="text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
                <div className={`
                  flex items-center justify-between mt-2 gap-3
                  ${message.role === 'user' ? 'text-slate-400' : 'text-slate-400'}
                `}>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {message.timestamp}
                  </div>
                  {message.role === 'assistant' && message.id !== '1' && (
                    <button
                      onClick={() => saveRecipe(message)}
                      className={`p-1 rounded-full transition-colors ${
                        savedMessageIds.has(message.id)
                          ? 'text-emerald-500 bg-emerald-50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={savedMessageIds.has(message.id) ? 'Saved!' : 'Save this advice'}
                    >
                      {savedMessageIds.has(message.id) ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Bookmark className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
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
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white shadow-sm border border-slate-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts - only show for new conversations */}
        {messages.length <= 1 && (
          <div className="px-4 py-3 flex-shrink-0 bg-white/80">
            <p className="text-xs text-slate-500 mb-2">Tap to start:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setNewMessage(prompt)}
                  className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 flex-shrink-0 border-t border-slate-100 bg-white">
          <div className="flex gap-2 items-end">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="rounded-full bg-slate-50 border-slate-200 focus:border-slate-400 focus:bg-white py-3 px-4"
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="rounded-full w-11 h-11 p-0 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            Nunu remembers your conversation in each chat
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

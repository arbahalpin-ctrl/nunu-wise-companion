// Chat integration utilities for cross-feature communication

const CONVERSATIONS_KEY = 'nunu-conversations';
const ASSESSMENT_KEY = 'nunu-sleep-assessment';
const PROGRAM_KEY = 'nunu-sleep-program';

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

const METHOD_NAMES: Record<string, string> = {
  fading: 'Gentle Fading',
  pupd: 'Pick Up / Put Down',
  chair: 'Chair Method',
  ferber: 'Ferber Method',
  extinction: 'Full Extinction'
};

/**
 * Injects a supportive message into the chat when sleep program starts
 */
export const injectSleepProgramStartMessage = (
  babyName: string,
  methodId: string
): void => {
  const methodName = METHOD_NAMES[methodId] || methodId;
  
  const supportMessage = `I can see you've chosen the **${methodName}** for tonight. I'm here with you while you do this. 💜

If things feel hard, confusing, or emotional at any point — message me and I'll guide you through it in real time.

**You're not doing this alone.**

The first night can feel intense. That doesn't mean it's going wrong. If you need reassurance or want to sense-check anything, just type here.`;

  try {
    const saved = localStorage.getItem(CONVERSATIONS_KEY);
    let conversations: Conversation[] = saved ? JSON.parse(saved) : [];
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: supportMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (conversations.length === 0) {
      // Create a new conversation with this message
      const newConvo: Conversation = {
        id: Date.now().toString(),
        title: `Sleep Training: ${methodName}`,
        messages: [
          {
            id: '1',
            role: 'assistant',
            content: "Hey. I'm Nunu — here to help with sleep, feeding, or just to listen when things feel hard. What's on your mind?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          newMessage
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      conversations = [newConvo];
    } else {
      // Add to the most recent conversation
      conversations[0].messages.push(newMessage);
      conversations[0].updatedAt = Date.now();
      // Update title if it's still "New conversation"
      if (conversations[0].title === 'New conversation') {
        conversations[0].title = `Sleep Training: ${methodName}`;
      }
    }

    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to inject sleep program message:', e);
  }
};

/**
 * Injects a timed check-in message during sleep training
 */
export const injectTimedCheckIn = (
  checkInType: '20min' | '60min' | 'custom',
  babyName: string,
  customMessage?: string
): void => {
  const messages: Record<string, string> = {
    '20min': `Just checking in. 💜

First nights can feel intense. If ${babyName}'s needs are met and you're sticking to your intervals, you're on track.

**Want help staying on track with your intervals?**`,
    '60min': `Still here with you. 💜

How are you holding up? Want to talk through whether to continue tonight or pause?

There's no wrong answer — I'm just here to support whatever you decide.`,
    'custom': customMessage || ''
  };

  const message = messages[checkInType];
  if (!message) return;

  injectAssistantMessage(message, 'Sleep Check-in');
};

/**
 * Helper to inject any assistant message into chat
 */
const injectAssistantMessage = (content: string, titleSuffix?: string): void => {
  try {
    const saved = localStorage.getItem(CONVERSATIONS_KEY);
    let conversations: Conversation[] = saved ? JSON.parse(saved) : [];
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (conversations.length === 0) {
      const newConvo: Conversation = {
        id: Date.now().toString(),
        title: titleSuffix || 'Chat with Nunu',
        messages: [
          {
            id: '1',
            role: 'assistant',
            content: "Hey. I'm Nunu — here to help with sleep, feeding, or just to listen when things feel hard. What's on your mind?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          newMessage
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      conversations = [newConvo];
    } else {
      conversations[0].messages.push(newMessage);
      conversations[0].updatedAt = Date.now();
    }

    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to inject message:', e);
  }
};

/**
 * Injects a morning follow-up message
 */
export const injectMorningFollowUp = (babyName: string, nightNumber: number): void => {
  const message = `Good morning. 💜

How did last night feel for you? Night ${nightNumber} is done — that's something to be proud of, no matter how it went.

When you're ready, log how it went so we can track your progress. And if you want to adjust tonight's plan, I'm here.`;

  injectAssistantMessage(message, 'Morning Check-in');
};

/**
 * Gets current sleep context for the AI
 */
export interface SleepContext {
  hasActiveProgram: boolean;
  babyName?: string;
  babyAgeMonths?: number;
  methodId?: string;
  methodName?: string;
  currentNight?: number;
  startDate?: string;
  mainProblems?: string[];
  cryingTolerance?: number;
}

export const getSleepContext = (): SleepContext => {
  try {
    const assessmentStr = localStorage.getItem(ASSESSMENT_KEY);
    const programStr = localStorage.getItem(PROGRAM_KEY);
    
    if (!assessmentStr) {
      return { hasActiveProgram: false };
    }
    
    const assessment = JSON.parse(assessmentStr);
    const program = programStr ? JSON.parse(programStr) : null;
    
    if (!program?.isActive) {
      return { hasActiveProgram: false };
    }
    
    // Calculate current night
    let currentNight = 1;
    if (program.startDate) {
      const start = new Date(program.startDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      currentNight = Math.max(1, diffDays + 1);
    }
    
    return {
      hasActiveProgram: true,
      babyName: assessment.babyName,
      babyAgeMonths: assessment.babyAgeMonths,
      methodId: program.methodId,
      methodName: METHOD_NAMES[program.methodId] || program.methodId,
      currentNight,
      startDate: program.startDate,
      mainProblems: assessment.mainProblems,
      cryingTolerance: assessment.cryingTolerance
    };
  } catch (e) {
    console.error('Failed to get sleep context:', e);
    return { hasActiveProgram: false };
  }
};

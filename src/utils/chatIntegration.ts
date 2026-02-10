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
  
  const supportMessage = `I see you've started the **${methodName}** with ${babyName} — that's a big step, and I'm really proud of you for committing to better sleep for your family. 💜

Tonight might feel hard. That's normal. But remember:
- **You're not alone** — I'm here whenever you need to talk
- **Consistency is key** — even when it's tough, stick with it
- **This works** — most families see real improvement by night 3-5

If you're struggling, have questions, or just need someone to tell you you're doing great at 2am — I'm here. Just come back to chat.

**You've got this. ${babyName} is lucky to have a parent who cares this much.** ✨`;

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

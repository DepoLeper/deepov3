import { PrismaClient } from '@prisma/client';

export interface Memory {
  id: string;
  userId: string;
  type: 'preference' | 'fact' | 'pattern' | 'feedback';
  key: string;
  value: any;
  confidence: number;
  relevance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMemory {
  id: string;
  userId: string;
  sessionId: string;
  messages: ConversationMessage[];
  context: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class MemoryManager {
  private prisma: PrismaClient;
  private userId: string;
  private sessionId: string;

  constructor(userId: string, sessionId: string) {
    this.prisma = new PrismaClient();
    this.userId = userId;
    this.sessionId = sessionId;
  }

  async getRelevantMemories(query: string): Promise<string[]> {
    try {
      // Egyszerű kulcsszó-alapú keresés (később fejleszthető vector search-re)
      const keywords = this.extractKeywords(query);
      
      const memories = await this.prisma.agentMemory.findMany({
        where: {
          userId: this.userId,
          OR: keywords.map(keyword => ({
            OR: [
              { key: { contains: keyword, mode: 'insensitive' } },
              { value: { path: ['content'], string_contains: keyword } }
            ]
          })),
          confidence: { gte: 0.5 }
        },
        orderBy: [
          { confidence: 'desc' },
          { updatedAt: 'desc' }
        ],
        take: 5
      });

      return memories.map(memory => 
        `${memory.type.toUpperCase()}: ${memory.key} - ${JSON.stringify(memory.value)}`
      );
    } catch (error) {
      console.error('Memory retrieval error:', error);
      return [];
    }
  }

  async saveConversation(userMessage: string, assistantMessage: string): Promise<void> {
    try {
      // Beszélgetés mentése
      const conversation = await this.prisma.agentConversation.upsert({
        where: {
          userId_sessionId: {
            userId: this.userId,
            sessionId: this.sessionId
          }
        },
        update: {
          messages: {
            push: [
              {
                role: 'user',
                content: userMessage,
                timestamp: new Date()
              },
              {
                role: 'assistant',
                content: assistantMessage,
                timestamp: new Date()
              }
            ]
          },
          updatedAt: new Date()
        },
        create: {
          userId: this.userId,
          sessionId: this.sessionId,
          messages: [
            {
              role: 'user',
              content: userMessage,
              timestamp: new Date()
            },
            {
              role: 'assistant',
              content: assistantMessage,
              timestamp: new Date()
            }
          ],
          context: {}
        }
      });

      // Mintázatok és preferenciák kinyerése
      await this.extractAndSavePatterns(userMessage, assistantMessage);
      
    } catch (error) {
      console.error('Conversation saving error:', error);
    }
  }

  async saveMemory(
    type: Memory['type'],
    key: string,
    value: any,
    confidence: number = 0.8
  ): Promise<void> {
    try {
      await this.prisma.agentMemory.upsert({
        where: {
          userId_key: {
            userId: this.userId,
            key: key
          }
        },
        update: {
          value: value,
          confidence: confidence,
          updatedAt: new Date()
        },
        create: {
          userId: this.userId,
          memoryType: type,
          key: key,
          value: value,
          confidence: confidence
        }
      });
    } catch (error) {
      console.error('Memory saving error:', error);
    }
  }

  async getConversationHistory(limit: number = 20): Promise<ConversationMessage[]> {
    try {
      const conversation = await this.prisma.agentConversation.findFirst({
        where: {
          userId: this.userId,
          sessionId: this.sessionId
        },
        orderBy: { updatedAt: 'desc' }
      });

      if (!conversation) return [];

      const messages = conversation.messages as ConversationMessage[];
      return messages.slice(-limit);
      
    } catch (error) {
      console.error('Conversation history error:', error);
      return [];
    }
  }

  async learnFromFeedback(
    originalMessage: string,
    feedback: string,
    isPositive: boolean
  ): Promise<void> {
    try {
      const feedbackKey = `feedback_${Date.now()}`;
      const feedbackValue = {
        original: originalMessage,
        feedback: feedback,
        positive: isPositive,
        timestamp: new Date()
      };

      await this.saveMemory('feedback', feedbackKey, feedbackValue, 0.9);

      // Ha negatív feedback, próbáljuk megérteni mi volt a probléma
      if (!isPositive) {
        await this.analyzeNegativeFeedback(originalMessage, feedback);
      }
    } catch (error) {
      console.error('Feedback learning error:', error);
    }
  }

  private async extractAndSavePatterns(
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    try {
      // Témák kinyerése
      const topics = this.extractTopics(userMessage);
      for (const topic of topics) {
        await this.saveMemory('pattern', `topic_${topic}`, { 
          count: 1, 
          lastUsed: new Date() 
        }, 0.7);
      }

      // Hangnem preferenciák
      const tone = this.detectTone(userMessage);
      if (tone) {
        await this.saveMemory('preference', 'preferred_tone', tone, 0.8);
      }

      // Tartalomtípus preferenciák
      const contentType = this.detectContentType(userMessage);
      if (contentType) {
        await this.saveMemory('preference', 'preferred_content_type', contentType, 0.8);
      }

    } catch (error) {
      console.error('Pattern extraction error:', error);
    }
  }

  private async analyzeNegativeFeedback(
    originalMessage: string,
    feedback: string
  ): Promise<void> {
    // Negatív feedback elemzése és tanulás
    const issues = this.extractIssues(feedback);
    for (const issue of issues) {
      await this.saveMemory('pattern', `avoid_${issue}`, {
        context: originalMessage,
        issue: issue,
        timestamp: new Date()
      }, 0.9);
    }
  }

  private extractKeywords(text: string): string[] {
    // Egyszerű kulcsszó kinyerés (később NLP-vel fejleszthető)
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
  }

  private extractTopics(text: string): string[] {
    const topics = [];
    const lowerText = text.toLowerCase();
    
    // Témák felismerése
    if (lowerText.includes('blog') || lowerText.includes('cikk')) topics.push('blog');
    if (lowerText.includes('hírlevél') || lowerText.includes('newsletter')) topics.push('newsletter');
    if (lowerText.includes('social') || lowerText.includes('facebook')) topics.push('social');
    if (lowerText.includes('seo') || lowerText.includes('keresőoptimalizálás')) topics.push('seo');
    if (lowerText.includes('munkavédelem') || lowerText.includes('védőeszköz')) topics.push('munkavédelem');
    if (lowerText.includes('higiénia') || lowerText.includes('tisztítás')) topics.push('higiénia');
    
    return topics;
  }

  private detectTone(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('vicces') || lowerText.includes('humoros')) return 'humoros';
    if (lowerText.includes('szakmai') || lowerText.includes('hivatalos')) return 'szakmai';
    if (lowerText.includes('közvetlen') || lowerText.includes('barátságos')) return 'közvetlen';
    if (lowerText.includes('magázódó') || lowerText.includes('udvarias')) return 'magázódó';
    
    return null;
  }

  private detectContentType(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('lista') || lowerText.includes('toplista')) return 'lista';
    if (lowerText.includes('útmutató') || lowerText.includes('guide')) return 'útmutató';
    if (lowerText.includes('hír') || lowerText.includes('újság')) return 'hír';
    if (lowerText.includes('termék') || lowerText.includes('ajánló')) return 'termékajánló';
    
    return null;
  }

  private extractIssues(feedback: string): string[] {
    const issues = [];
    const lowerFeedback = feedback.toLowerCase();
    
    if (lowerFeedback.includes('hosszú') || lowerFeedback.includes('túl sok')) issues.push('túl_hosszú');
    if (lowerFeedback.includes('rövid') || lowerFeedback.includes('kevés')) issues.push('túl_rövid');
    if (lowerFeedback.includes('szakmai') || lowerFeedback.includes('bonyolult')) issues.push('túl_szakmai');
    if (lowerFeedback.includes('egyszerű') || lowerFeedback.includes('felületes')) issues.push('túl_egyszerű');
    
    return issues;
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 
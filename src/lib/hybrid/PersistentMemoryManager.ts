import { PrismaClient } from '@prisma/client';

export interface ConversationEntry {
  id: string;
  userId: string;
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  timestamp: Date;
  keywords: string[];
}

export interface MemorySearchResult {
  relevantConversations: ConversationEntry[];
  keywords: string[];
  summary: string;
}

/**
 * PersistentMemoryManager - Professzionális Prisma + SQLite alapú memória
 * 
 * Hibrid architektúra:
 * - Database: Prisma + SQLite perzisztens tárolás
 * - Cache: In-memory cache a teljesítményért  
 * - Fallback: Hibakezelés minden szinten
 * - Scaling: Production-ready architektúra
 */
export class PersistentMemoryManager {
  private prisma: PrismaClient;
  private cache: Map<string, ConversationEntry[]> = new Map();
  private maxConversationsPerUser = 100;
  private cacheExpiry = 5 * 60 * 1000; // 5 perc
  private lastCacheUpdate = new Map<string, number>();

  constructor() {
    this.prisma = new PrismaClient();
    console.log('🗄️ PersistentMemoryManager inicializálva - Prisma + SQLite');
    this.initializeDatabase();
  }

  /**
   * Adatbázis inicializálás és kapcsolat ellenőrzés
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('✅ Adatbázis kapcsolat sikeres');
    } catch (error) {
      console.error('❌ Adatbázis kapcsolat hiba:', error);
      throw error;
    }
  }

  /**
   * Beszélgetés mentése adatbázisba + cache
   */
  async saveConversation(
    userId: string,
    sessionId: string,
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    try {
      const conversationEntry: ConversationEntry = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        sessionId,
        userMessage,
        assistantMessage,
        timestamp: new Date(),
        keywords: this.extractKeywords(userMessage + ' ' + assistantMessage)
      };

      // 1. Adatbázisba mentés
      await this.saveToDatabase(conversationEntry);

      // 2. Cache frissítés
      await this.updateCache(userId, conversationEntry);

      // 3. Long-term memory frissítés
      await this.updateLongTermMemory(userId, conversationEntry);

      console.log(`💾 Beszélgetés mentve DB+Cache: [${userId}] "${userMessage.substring(0, 50)}..."`);
      
    } catch (error) {
      console.error('❌ Conversation save hiba:', error);
      // Fallback: legalább cache-be mentés
      await this.saveToCache(userId, sessionId, userMessage, assistantMessage);
    }
  }

  /**
   * Adatbázisba mentés
   */
  private async saveToDatabase(entry: ConversationEntry): Promise<void> {
    try {
      // AgentConversation táblába mentés
      await this.prisma.agentConversation.upsert({
        where: {
          userId_sessionId: {
            userId: entry.userId,
            sessionId: entry.sessionId
          }
        },
        update: {
          messages: {
            push: {
              id: entry.id,
              userMessage: entry.userMessage,
              assistantMessage: entry.assistantMessage,
              timestamp: entry.timestamp,
              keywords: entry.keywords
            }
          },
          updatedAt: new Date()
        },
        create: {
          userId: entry.userId,
          sessionId: entry.sessionId,
          messages: [{
            id: entry.id,
            userMessage: entry.userMessage,
            assistantMessage: entry.assistantMessage,
            timestamp: entry.timestamp,
            keywords: entry.keywords
          }],
          context: {
            totalMessages: 1,
            lastActivity: new Date()
          }
        }
      });

      console.log('📊 Adatbázis mentés sikeres');
    } catch (error) {
      console.error('❌ Database save hiba:', error);
      throw error;
    }
  }

  /**
   * Cache frissítés
   */
  private async updateCache(userId: string, entry: ConversationEntry): Promise<void> {
    const userConversations = this.cache.get(userId) || [];
    userConversations.push(entry);
    
    // Memory limit alkalmazása
    if (userConversations.length > this.maxConversationsPerUser) {
      userConversations.shift();
    }
    
    this.cache.set(userId, userConversations);
    this.lastCacheUpdate.set(userId, Date.now());
    
    console.log(`🎯 Cache frissítve: ${userConversations.length} beszélgetés`);
  }

  /**
   * Long-term memory frissítés
   */
  private async updateLongTermMemory(userId: string, entry: ConversationEntry): Promise<void> {
    try {
      // Kulcsszavak alapján hosszútávú memória frissítés
      for (const keyword of entry.keywords) {
        await this.prisma.agentMemory.upsert({
          where: {
            userId_key: {
              userId: userId,
              key: `keyword_${keyword}`
            }
          },
          update: {
            value: {
              count: { increment: 1 },
              lastSeen: new Date(),
              contexts: { push: entry.userMessage.substring(0, 100) }
            },
            confidence: Math.min(1.0, 0.5 + (0.1 * Math.random())),
            updatedAt: new Date()
          },
          create: {
            userId: userId,
            memoryType: 'pattern',
            key: `keyword_${keyword}`,
            value: {
              count: 1,
              lastSeen: new Date(),
              contexts: [entry.userMessage.substring(0, 100)]
            },
            confidence: 0.6
          }
        });
      }
      
      console.log(`🧠 Long-term memory frissítve: ${entry.keywords.length} kulcsszó`);
    } catch (error) {
      console.error('❌ Long-term memory hiba:', error);
      // Nem kritikus hiba - folytatjuk
    }
  }

  /**
   * Fallback: cache-only mentés
   */
  private async saveToCache(userId: string, sessionId: string, userMessage: string, assistantMessage: string): Promise<void> {
    const entry: ConversationEntry = {
      id: `cache_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      userMessage,
      assistantMessage,
      timestamp: new Date(),
      keywords: this.extractKeywords(userMessage + ' ' + assistantMessage)
    };

    await this.updateCache(userId, entry);
    console.log('⚠️ Fallback: Cache-only mentés');
  }

  /**
   * Releváns beszélgetések keresése (hibrid: cache + DB)
   */
  async searchRelevantMemories(userId: string, query: string): Promise<MemorySearchResult> {
    try {
      console.log(`🔍 Persistent memory keresés: [${userId}] "${query}"`);
      
      const queryKeywords = this.extractKeywords(query);
      console.log(`🔑 Query kulcsszavak: [${queryKeywords.join(', ')}]`);

      // 1. Cache ellenőrzés
      let conversations = await this.getFromCache(userId);
      
      // 2. Ha cache üres vagy régi, adatbázisból töltés
      if (conversations.length === 0 || this.isCacheExpired(userId)) {
        conversations = await this.loadFromDatabase(userId);
      }

      // 3. Releváns beszélgetések keresése
      const relevantConversations = this.findRelevantConversations(conversations, queryKeywords);
      
      // 4. Long-term memory kiegészítés
      const longTermContext = await this.getLongTermMemoryContext(userId, queryKeywords);
      
      console.log(`✅ Persistent találat: ${relevantConversations.length} releváns beszélgetés`);
      
      const summary = this.generateMemorySummary(relevantConversations, queryKeywords, longTermContext);
      
      return {
        relevantConversations,
        keywords: queryKeywords,
        summary
      };
      
    } catch (error) {
      console.error('❌ Persistent memory search hiba:', error);
      // Fallback: cache-only keresés
      return this.fallbackCacheSearch(userId, query);
    }
  }

  /**
   * Cache-ből lekérés
   */
  private async getFromCache(userId: string): Promise<ConversationEntry[]> {
    return this.cache.get(userId) || [];
  }

  /**
   * Cache lejárat ellenőrzés
   */
  private isCacheExpired(userId: string): boolean {
    const lastUpdate = this.lastCacheUpdate.get(userId);
    if (!lastUpdate) return true;
    
    return Date.now() - lastUpdate > this.cacheExpiry;
  }

  /**
   * Adatbázisból töltés
   */
  private async loadFromDatabase(userId: string): Promise<ConversationEntry[]> {
    try {
      const conversations = await this.prisma.agentConversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: this.maxConversationsPerUser
      });

      const entries: ConversationEntry[] = [];
      
      for (const conv of conversations) {
        const messages = Array.isArray(conv.messages) ? conv.messages : [];
        for (const msg of messages) {
          entries.push({
            id: msg.id || `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: conv.userId,
            sessionId: conv.sessionId,
            userMessage: msg.userMessage || '',
            assistantMessage: msg.assistantMessage || '',
            timestamp: new Date(msg.timestamp) || conv.updatedAt,
            keywords: msg.keywords || []
          });
        }
      }

      // Cache frissítés
      this.cache.set(userId, entries);
      this.lastCacheUpdate.set(userId, Date.now());
      
      console.log(`📊 Adatbázisból betöltve: ${entries.length} beszélgetés`);
      return entries;
      
    } catch (error) {
      console.error('❌ Database load hiba:', error);
      return [];
    }
  }

  /**
   * Long-term memory kontextus
   */
  private async getLongTermMemoryContext(userId: string, keywords: string[]): Promise<any> {
    try {
      const memories = await this.prisma.agentMemory.findMany({
        where: {
          userId,
          OR: keywords.map(keyword => ({
            key: {
              contains: keyword
            }
          }))
        },
        orderBy: {
          confidence: 'desc'
        },
        take: 10
      });

      return memories.reduce((acc, memory) => {
        acc[memory.key] = memory.value;
        return acc;
      }, {} as any);
      
    } catch (error) {
      console.error('❌ Long-term memory context hiba:', error);
      return {};
    }
  }

  /**
   * Releváns beszélgetések keresése
   */
  private findRelevantConversations(conversations: ConversationEntry[], keywords: string[]): ConversationEntry[] {
    const scoredConversations = conversations.map(conv => {
      const score = this.calculateRelevanceScore(keywords, conv.keywords);
      return { conversation: conv, score };
    });

    return scoredConversations
      .filter(item => item.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.conversation);
  }

  /**
   * Fallback cache-only keresés
   */
  private async fallbackCacheSearch(userId: string, query: string): Promise<MemorySearchResult> {
    const conversations = this.cache.get(userId) || [];
    const keywords = this.extractKeywords(query);
    
    console.log('⚠️ Fallback: Cache-only keresés');
    
    return {
      relevantConversations: conversations.slice(0, 3),
      keywords,
      summary: 'Cache-only keresés eredmény'
    };
  }

  /**
   * Kulcsszavak kinyerése (SimpleMemoryManager-től)
   */
  private extractKeywords(text: string): string[] {
    try {
      if (!text || typeof text !== 'string') return [];
      
      const cleanText = text.toLowerCase()
        .replace(/[^\w\sáéíóöőúüű]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const words = cleanText.split(' ')
        .filter(word => word.length > 2)
        .filter(word => !this.isStopWord(word));
      
      return [...new Set(words)];
    } catch (error) {
      console.error('❌ Keyword extraction hiba:', error);
      return [];
    }
  }

  /**
   * Stopszavak ellenőrzése
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      'és', 'vagy', 'de', 'hogy', 'ezt', 'azt', 'egy', 'van', 'volt', 'lesz',
      'a', 'az', 'el', 'be', 'ki', 'le', 'fel', 'meg', 'át', 'ide', 'oda',
      'the', 'and', 'or', 'but', 'that', 'this', 'is', 'was', 'will', 'be'
    ];
    return stopWords.includes(word);
  }

  /**
   * Relevancia pontszám számítás
   */
  private calculateRelevanceScore(queryKeywords: string[], conversationKeywords: string[]): number {
    if (queryKeywords.length === 0 || conversationKeywords.length === 0) {
      return 0;
    }

    const matches = queryKeywords.filter(keyword => 
      conversationKeywords.includes(keyword)
    ).length;

    return matches / queryKeywords.length;
  }

  /**
   * Memory összefoglaló generálás
   */
  private generateMemorySummary(conversations: ConversationEntry[], keywords: string[], longTermContext: any): string {
    if (conversations.length === 0) {
      return 'Nincs releváns korábbi beszélgetés az adatbázisban';
    }

    const topicCounts = new Map<string, number>();
    
    conversations.forEach(conv => {
      conv.keywords.forEach(keyword => {
        topicCounts.set(keyword, (topicCounts.get(keyword) || 0) + 1);
      });
    });

    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);

    const longTermTopics = Object.keys(longTermContext).slice(0, 2);

    return `Adatbázisból: ${conversations.length} releváns beszélgetés. Főbb témák: ${topTopics.join(', ')}. Long-term: ${longTermTopics.join(', ')}`;
  }

  /**
   * Memory statisztikák
   */
  async getMemoryStats(userId: string): Promise<{ totalConversations: number; totalKeywords: number; recentTopics: string[]; dbStats: any }> {
    try {
      const conversations = await this.loadFromDatabase(userId);
      const allKeywords = conversations.flatMap(conv => conv.keywords);
      const uniqueKeywords = [...new Set(allKeywords)];
      
      const recentTopics = conversations
        .slice(-5)
        .flatMap(conv => conv.keywords)
        .slice(0, 10);

      const dbStats = await this.prisma.agentConversation.count({
        where: { userId }
      });

      return {
        totalConversations: conversations.length,
        totalKeywords: uniqueKeywords.length,
        recentTopics: [...new Set(recentTopics)],
        dbStats: {
          conversationRecords: dbStats,
          cacheSize: this.cache.get(userId)?.length || 0,
          lastCacheUpdate: this.lastCacheUpdate.get(userId) || 0
        }
      };
    } catch (error) {
      console.error('❌ Memory stats hiba:', error);
      return {
        totalConversations: 0,
        totalKeywords: 0,
        recentTopics: [],
        dbStats: { error: 'Stats nem elérhető' }
      };
    }
  }

  /**
   * Cleanup és disconnect
   */
  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
    this.cache.clear();
    this.lastCacheUpdate.clear();
    console.log('🧹 PersistentMemoryManager cleanup befejezve');
  }
} 
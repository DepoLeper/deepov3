// SimpleMemoryManager.ts
// Console-only memory kezelés adatbázis hibák elkerülésére

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

export class SimpleMemoryManager {
  // Static memory perzisztens tárolásért a server instance-ok között
  private static conversations: Map<string, ConversationEntry[]> = new Map();
  private maxConversationsPerUser = 50; // Memória limit
  
  constructor() {
    console.log('🧠 SimpleMemoryManager inicializálva');
    console.log(`📊 Jelenlegi total users memóriában: ${SimpleMemoryManager.conversations.size}`);
  }

  /**
   * Beszélgetés mentése memóriába
   */
  async saveConversation(
    userId: string,
    sessionId: string,
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    try {
      const entry: ConversationEntry = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        sessionId,
        userMessage,
        assistantMessage,
        timestamp: new Date(),
        keywords: this.extractKeywords(userMessage + ' ' + assistantMessage)
      };

      // User-specifikus conversation lista lekérése vagy létrehozása
      const userConversations = SimpleMemoryManager.conversations.get(userId) || [];
      
      // Új beszélgetés hozzáadása
      userConversations.push(entry);
      
      // Régi beszélgetések eltávolítása (memory limit)
      if (userConversations.length > this.maxConversationsPerUser) {
        userConversations.shift(); // Legrégebbi eltávolítása
      }
      
      // Frissített lista mentése
      SimpleMemoryManager.conversations.set(userId, userConversations);
      
      console.log(`💾 Beszélgetés mentve: [${userId}] "${userMessage.substring(0, 50)}..."`);
      console.log(`📊 Jelenlegi beszélgetések száma: ${userConversations.length}`);
      
    } catch (error) {
      console.error('❌ Memory save hiba:', error);
    }
  }

  /**
   * Releváns beszélgetések keresése
   */
  async searchRelevantMemories(userId: string, query: string): Promise<MemorySearchResult> {
    try {
      console.log(`🔍 Memory keresés: [${userId}] "${query}"`);
      
      const userConversations = SimpleMemoryManager.conversations.get(userId) || [];
      const queryKeywords = this.extractKeywords(query);
      
      console.log(`🔑 Query kulcsszavak: [${queryKeywords.join(', ')}]`);
      
      if (userConversations.length === 0) {
        console.log('📝 Nincsenek mentett beszélgetések');
        return {
          relevantConversations: [],
          keywords: queryKeywords,
          summary: 'Nincs korábbi beszélgetés'
        };
      }

      // Relevancia számítás
      const scoredConversations = userConversations.map(conv => {
        const score = this.calculateRelevanceScore(queryKeywords, conv.keywords);
        return { conversation: conv, score };
      });

      // Rendezés relevancia szerint
      scoredConversations.sort((a, b) => b.score - a.score);
      
      // Top 5 releváns beszélgetés
      const relevantConversations = scoredConversations
        .filter(item => item.score > 0.1) // Minimum relevancia
        .slice(0, 5)
        .map(item => item.conversation);

      console.log(`✅ Találat: ${relevantConversations.length} releváns beszélgetés`);
      
      const summary = this.generateMemorySummary(relevantConversations, queryKeywords);
      
      return {
        relevantConversations,
        keywords: queryKeywords,
        summary
      };
      
    } catch (error) {
      console.error('❌ Memory search hiba:', error);
      return {
        relevantConversations: [],
        keywords: [],
        summary: 'Memory keresési hiba'
      };
    }
  }

  /**
   * Kulcsszavak kinyerése
   */
  private extractKeywords(text: string): string[] {
    try {
      if (!text || typeof text !== 'string') {
        return [];
      }
      
      const cleanText = text.toLowerCase()
        .replace(/[^\w\sáéíóöőúüű]/g, ' ') // Magyar karakterek megtartása
        .replace(/\s+/g, ' ')
        .trim();
      
      const words = cleanText.split(' ')
        .filter(word => word.length > 2) // Min 3 karakter
        .filter(word => !this.isStopWord(word)); // Stopszavak kiszűrése
      
      // Egyedi szavak visszaadása
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
  private generateMemorySummary(conversations: ConversationEntry[], keywords: string[]): string {
    if (conversations.length === 0) {
      return 'Nincs releváns korábbi beszélgetés';
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

    return `Korábbi beszélgetések főbb témái: ${topTopics.join(', ')}. Releváns találatok: ${conversations.length}`;
  }

  /**
   * Memory statisztikák
   */
  getMemoryStats(userId: string): { totalConversations: number; totalKeywords: number; recentTopics: string[] } {
    const userConversations = SimpleMemoryManager.conversations.get(userId) || [];
    
    const allKeywords = userConversations.flatMap(conv => conv.keywords);
    const uniqueKeywords = [...new Set(allKeywords)];
    
    const recentTopics = userConversations
      .slice(-5) // Utolsó 5 beszélgetés
      .flatMap(conv => conv.keywords)
      .slice(0, 10); // Top 10 legfrissebb kulcsszó

    return {
      totalConversations: userConversations.length,
      totalKeywords: uniqueKeywords.length,
      recentTopics: [...new Set(recentTopics)]
    };
  }

  /**
   * Memory törlése (fejlesztési célokra)
   */
  clearMemory(userId?: string): void {
    if (userId) {
      SimpleMemoryManager.conversations.delete(userId);
      console.log(`🗑️ ${userId} memóriája törölve`);
    } else {
      SimpleMemoryManager.conversations.clear();
      console.log('🗑️ Összes memória törölve');
    }
  }

  /**
   * Debug: összes memória állapot
   */
  static getGlobalMemoryStatus(): { totalUsers: number; totalConversations: number } {
    let totalConversations = 0;
    for (const userConversations of SimpleMemoryManager.conversations.values()) {
      totalConversations += userConversations.length;
    }
    
    return {
      totalUsers: SimpleMemoryManager.conversations.size,
      totalConversations
    };
  }
} 
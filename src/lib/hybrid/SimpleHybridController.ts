import { runDeepOAgent } from '@/lib/agent-sdk/OpenAIAgentPOC';
import { SimpleMemoryManager, MemorySearchResult } from './SimpleMemoryManager';

/**
 * SimpleHybridController - Minimális hibrid megközelítés
 * 
 * Ez egy egyszerű wrapper a működő OpenAI SDK körül,
 * ahova fokozatosan hozzáadhatjuk a saját komponenseinket.
 * 
 * FÁZIS 2: Memory integráció hozzáadva
 */
export class SimpleHybridController {
  private memoryManager: SimpleMemoryManager;
  
  constructor() {
    console.log('🚀 SimpleHybridController inicializálva');
    this.memoryManager = new SimpleMemoryManager();
  }

  /**
   * Fő message processing - OpenAI SDK + Memory integráció
   */
  async processMessage(message: string, userId: string, sessionId: string): Promise<{
    response: string;
    suggestions: string[];
    confidence: number;
    metadata: any;
  }> {
    try {
      console.log('📨 SimpleHybrid üzenet feldolgozása:', message);
      
      // 1. Memory keresés - releváns korábbi beszélgetések
      const memoryResult = await this.memoryManager.searchRelevantMemories(userId, message);
      
      // 2. Memory context készítése
      const memoryContext = this.buildMemoryContext(memoryResult);
      
      // 3. Enhanced message az OpenAI SDK számára
      const enhancedMessage = this.enhanceMessageWithMemory(message, memoryContext);
      
      // 4. OpenAI SDK hívás (memory context-tel)
      const result = await runDeepOAgent(enhancedMessage, 'main');
      
      if (!result.success) {
        throw new Error(result.error || 'OpenAI Agent hiba');
      }

      // 5. Beszélgetés mentése a memóriába
      await this.memoryManager.saveConversation(
        userId,
        sessionId,
        message, // eredeti user message
        result.response // agent válasz
      );

      // 6. Memory stats lekérése
      const memoryStats = this.memoryManager.getMemoryStats(userId);
      const globalMemoryStatus = SimpleMemoryManager.getGlobalMemoryStatus();
      
      console.log(`🌐 Globális memória: ${globalMemoryStatus.totalUsers} users, ${globalMemoryStatus.totalConversations} total conversations`);

      // 7. Enhanced válasz formázása
      const response = {
        response: result.response,
        suggestions: this.generateContextualSuggestions(memoryResult, message),
        confidence: 0.9,
        metadata: {
          agent: result.agent,
          timestamp: result.metadata.timestamp,
          agentType: result.metadata.agentType,
          source: 'SimpleHybridController',
          userId,
          sessionId,
          memory: {
            relevantConversations: memoryResult.relevantConversations.length,
            keywords: memoryResult.keywords,
            summary: memoryResult.summary,
            stats: memoryStats
          }
        }
      };

      console.log('✅ SimpleHybrid válasz sikeres (memory-vel)');
      return response;

    } catch (error) {
      console.error('❌ SimpleHybrid hiba:', error);
      
      throw new Error(`SimpleHybrid feldolgozási hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
    }
  }

  /**
   * Memory context építése a releváns beszélgetésekből
   */
  private buildMemoryContext(memoryResult: MemorySearchResult): string {
    if (memoryResult.relevantConversations.length === 0) {
      return 'Nincs korábbi releváns beszélgetés.';
    }

    const contextParts = [
      `MEMÓRIA KONTEXTUS (${memoryResult.relevantConversations.length} releváns beszélgetés):`,
      memoryResult.summary,
      ''
    ];

    // Top 3 legfontosabb korábbi beszélgetés
    memoryResult.relevantConversations.slice(0, 3).forEach((conv, index) => {
      const timeAgo = this.getTimeAgo(conv.timestamp);
      contextParts.push(
        `${index + 1}. ${timeAgo}:`,
        `   User: "${conv.userMessage}"`,
        `   DeepO: "${conv.assistantMessage}"`,
        ''
      );
    });

    return contextParts.join('\n');
  }

  /**
   * Message enhanced-elése memory context-tel
   */
  private enhanceMessageWithMemory(message: string, memoryContext: string): string {
    if (memoryContext === 'Nincs korábbi releváns beszélgetés.') {
      return message; // Nem enhanced-eljük, ha nincs memória
    }

    return `${memoryContext}

JELENLEGI KÉRDÉS:
${message}

INSTRUKCIÓ: A fenti memória kontextus alapján válaszolj, hivatkozz korábbi beszélgetésekre, ha releváns.`;
  }

  /**
   * Kontextuális javaslatok generálása
   */
  private generateContextualSuggestions(memoryResult: MemorySearchResult, currentMessage: string): string[] {
    const baseSuggestions = [
      'Elemezzük SEO szempontból?',
      'Készítsünk belőle blog cikket?',
      'További információkat keresel?'
    ];

    // Ha van memória, kontextuális javaslatokat adunk
    if (memoryResult.relevantConversations.length > 0) {
      const recentTopics = memoryResult.keywords.slice(0, 2);
      
      if (recentTopics.length > 0) {
        baseSuggestions.unshift(`Folytassuk a ${recentTopics[0]} témát?`);
      }
      
      baseSuggestions.push('Mit beszéltünk erről korábban?');
    }

    return baseSuggestions.slice(0, 4); // Max 4 javaslat
  }

  /**
   * Idő számítás (mennyi ideje volt)
   */
  private getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'most';
    if (diffMins < 60) return `${diffMins} perce`;
    if (diffHours < 24) return `${diffHours} órája`;
    return `${diffDays} napja`;
  }

  /**
   * Chat interface számára egyszerűsített metódus
   */
  async chat(message: string, userId: string): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    const result = await this.processMessage(message, userId, sessionId);
    return result.response;
  }

  /**
   * Health check
   */
  getStatus(): { status: string; version: string; components: string[] } {
    return {
      status: 'ok',
      version: '2.0.0-memory',
      components: ['OpenAI Agents SDK', 'SimpleMemoryManager']
    };
  }

  /**
   * Memory management metódusok
   */
  getMemoryStats(userId: string) {
    return this.memoryManager.getMemoryStats(userId);
  }

  clearMemory(userId?: string) {
    this.memoryManager.clearMemory(userId);
  }
} 
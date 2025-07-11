import { runDeepOAgent } from '@/lib/agent-sdk/OpenAIAgentPOC';
import { SimpleMemoryManager, MemorySearchResult } from './SimpleMemoryManager';
import { SimpleContextLoader, ContextSearchResult } from './SimpleContextLoader';

/**
 * SimpleHybridController - Hibrid megközelítés Memory + Context integrációval
 * 
 * FÁZIS 4: SimpleContextLoader integráció hozzáadva
 * - Memory: Korábbi beszélgetések
 * - Context: content_guides.md útmutatók
 * - OpenAI SDK: Core AI functionality
 */
export class SimpleHybridController {
  private memoryManager: SimpleMemoryManager;
  private contextLoader: SimpleContextLoader;
  
  constructor() {
    console.log('🚀 SimpleHybridController inicializálva');
    this.memoryManager = new SimpleMemoryManager();
    this.contextLoader = new SimpleContextLoader();
  }

  /**
   * Fő message processing - OpenAI SDK + Memory + Context integráció
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
      
      // 2. Context loading - releváns útmutatók
      const contextResult = await this.contextLoader.loadContext(message);
      
      // 3. Kombinált context építése
      const combinedContext = this.buildCombinedContext(memoryResult, contextResult);
      
      // 4. Enhanced message az OpenAI SDK számára
      const enhancedMessage = this.enhanceMessageWithContext(message, combinedContext);
      
      // 5. OpenAI SDK hívás (memory + context)
      const result = await runDeepOAgent(enhancedMessage, 'main');
      
      if (!result.success) {
        throw new Error(result.error || 'OpenAI Agent hiba');
      }

      // 6. Beszélgetés mentése a memóriába
      await this.memoryManager.saveConversation(
        userId,
        sessionId,
        message, // eredeti user message
        result.response // agent válasz
      );

      // 7. Status információk
      const memoryStats = this.memoryManager.getMemoryStats(userId);
      const contextStatus = this.contextLoader.getStatus();
      const globalMemoryStatus = SimpleMemoryManager.getGlobalMemoryStatus();
      
      console.log(`🌐 Globális memória: ${globalMemoryStatus.totalUsers} users, ${globalMemoryStatus.totalConversations} total conversations`);

      // 8. Enhanced válasz formázása
      const response = {
        response: result.response,
        suggestions: this.generateContextualSuggestions(memoryResult, contextResult, message),
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
          },
          context: {
            success: contextResult.success,
            guidesUsed: contextResult.guidesUsed,
            error: contextResult.error,
            status: contextStatus
          }
        }
      };

      console.log('✅ SimpleHybrid válasz sikeres (memory + context)');
      return response;

    } catch (error) {
      console.error('❌ SimpleHybrid hiba:', error);
      
      throw new Error(`SimpleHybrid feldolgozási hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
    }
  }

  /**
   * Kombinált context építése Memory + Content Guides alapján
   */
  private buildCombinedContext(memoryResult: MemorySearchResult, contextResult: ContextSearchResult): string {
    const contextParts: string[] = [];
    
    // 1. Memory Context (ha van)
    if (memoryResult.relevantConversations.length > 0) {
      contextParts.push('═══ MEMÓRIA KONTEXTUS ═══');
      contextParts.push(`${memoryResult.summary}\n`);
      
      // Top 2 legfontosabb korábbi beszélgetés
      memoryResult.relevantConversations.slice(0, 2).forEach((conv, index) => {
        const timeAgo = this.getTimeAgo(conv.timestamp);
        contextParts.push(
          `${index + 1}. ${timeAgo}:`,
          `   "${conv.userMessage}" → "${conv.assistantMessage}"`
        );
      });
      
      contextParts.push(''); // üres sor
    }
    
    // 2. Content Guides Context (ha van)
    if (contextResult.success && contextResult.context) {
      contextParts.push('═══ ÚTMUTATÓ KONTEXTUS ═══');
      contextParts.push(`Használt útmutatók: ${contextResult.guidesUsed.join(', ')}\n`);
      contextParts.push(contextResult.context);
      contextParts.push(''); // üres sor
    }
    
    // 3. Ha nincs semmi kontextus
    if (contextParts.length === 0) {
      return 'Nincs elérhető kontextus információ.';
    }
    
    return contextParts.join('\n');
  }

  /**
   * Message enhanced-elése kombinált context-tel
   */
  private enhanceMessageWithContext(message: string, combinedContext: string): string {
    if (combinedContext === 'Nincs elérhető kontextus információ.') {
      return message; // Nem enhanced-eljük, ha nincs kontextus
    }

    return `${combinedContext}

═══ JELENLEGI KÉRDÉS ═══
${message}

INSTRUKCIÓ: A fenti kontextus alapján (memória + útmutatók) válaszolj. Használd a releváns információkat és hivatkozz korábbi beszélgetésekre, ha van ilyen.`;
  }

  /**
   * Kontextuális javaslatok generálása Memory + Context alapján
   */
  private generateContextualSuggestions(
    memoryResult: MemorySearchResult,
    contextResult: ContextSearchResult, 
    currentMessage: string
  ): string[] {
    const suggestions: string[] = [];

    // Memory alapú javaslatok
    if (memoryResult.relevantConversations.length > 0) {
      const recentTopics = memoryResult.keywords.slice(0, 2);
      if (recentTopics.length > 0) {
        suggestions.push(`Folytassuk a ${recentTopics[0]} témát?`);
      }
      suggestions.push('Mit beszéltünk erről korábban?');
    }

    // Context alapú javaslatok
    if (contextResult.success && contextResult.guidesUsed.length > 0) {
      if (contextResult.guidesUsed.some(g => g.toLowerCase().includes('blog'))) {
        suggestions.push('Készítsünk belőle blog cikket?');
      }
      if (contextResult.guidesUsed.some(g => g.toLowerCase().includes('seo'))) {
        suggestions.push('Elemezzük SEO szempontból?');
      }
      if (contextResult.guidesUsed.some(g => g.toLowerCase().includes('social'))) {
        suggestions.push('Social media tartalmat is készítsünk?');
      }
    }

    // Alapértelmezett javaslatok
    if (suggestions.length === 0) {
      suggestions.push(
        'Elmagyarázod részletesebben?',
        'További információkat keresel?',
        'Készítsünk belőle tartalmat?'
      );
    }

    return suggestions.slice(0, 4); // Max 4 javaslat
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
   * Health check - most context status-szal is
   */
  getStatus(): { status: string; version: string; components: string[] } {
    const contextStatus = this.contextLoader.getStatus();
    const memoryStatus = SimpleMemoryManager.getGlobalMemoryStatus();
    
    return {
      status: contextStatus.loadError ? 'degraded' : 'ok',
      version: '3.0.0-memory-context',
      components: [
        'OpenAI Agents SDK',
        'SimpleMemoryManager',
        `SimpleContextLoader (${contextStatus.totalGuides} útmutató)`
      ]
    };
  }

  /**
   * Debug információk lekérése
   */
  async getDebugInfo() {
    const contextDebug = await this.contextLoader.getDebugInfo();
    const memoryStatus = SimpleMemoryManager.getGlobalMemoryStatus();
    
    return {
      memory: memoryStatus,
      context: contextDebug,
      integration: 'SimpleHybridController v3.0'
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
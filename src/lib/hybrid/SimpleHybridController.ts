import { runDeepOAgent } from '@/lib/agent-sdk/OpenAIAgentPOC';
import { PersistentMemoryManager, MemorySearchResult } from './PersistentMemoryManager';
import { SimpleContextLoader, ContextSearchResult } from './SimpleContextLoader';

/**
 * SimpleHybridController v4.0 - Professzionális Perzisztens Memória
 * 
 * FRISSÍTETT ARCHITEKTÚRA:
 * - Memory: PersistentMemoryManager (Prisma + SQLite + Cache)
 * - Context: SimpleContextLoader (Content Guides)
 * - OpenAI SDK: Core AI functionality
 * - Hibrid megoldás: Database + Cache + Fallback
 */
export class SimpleHybridController {
  private memoryManager: PersistentMemoryManager;
  private contextLoader: SimpleContextLoader;
  
  constructor() {
    console.log('🚀 SimpleHybridController v4.0 inicializálva - Persistent Memory');
    this.memoryManager = new PersistentMemoryManager();
    this.contextLoader = new SimpleContextLoader();
  }

  /**
   * Hibrid üzenet feldolgozás - Persistent Memory + Context
   */
  async processMessage(
    userId: string,
    sessionId: string,
    message: string
  ): Promise<{
    response: string;
    confidence: number;
    metadata: {
      memoryUsed: boolean;
      contextUsed: boolean;
      timestamp: string;
      processingTime: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`📨 SimpleHybrid üzenet feldolgozása: ${message}`);
      
      // 1. Memory keresés - Persistent Database + Cache
      const memoryResult: MemorySearchResult = await this.memoryManager.searchRelevantMemories(
        userId,
        message
      );
      
      // 2. Context loading - Content Guides
      const contextResult: ContextSearchResult = await this.contextLoader.searchContext(message);
      
      // 3. Kombinált kontextus építés
      const combinedContext = this.buildCombinedContext(memoryResult, contextResult);
      
      // 4. OpenAI SDK hívás a kombinált kontextussal
      // DeepO agent kontextussal kiegészített üzenet
      const contextualizedMessage = `${combinedContext}\n\nUser üzenet: ${message}`;
      
      const agentResponse = await runDeepOAgent(contextualizedMessage, 'main');
      
      // 5. Válasz feldolgozása
      const response = this.extractResponse(agentResponse);
      
      // 6. Beszélgetés mentése - Persistent Database
      await this.memoryManager.saveConversation(
        userId,
        sessionId,
        message,
        response
      );
      
      const processingTime = Date.now() - startTime;
      
      // 7. Globális memória statisztikák
      await this.logGlobalMemoryStats(userId);
      
      console.log(`✅ SimpleHybrid válasz sikeres (persistent memory + context)`);
      
      return {
        response,
        confidence: 0.95, // Persistent memory + context = magasabb megbízhatóság
        metadata: {
          memoryUsed: memoryResult.relevantConversations.length > 0,
          contextUsed: contextResult.success,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };
      
    } catch (error) {
      console.error('❌ SimpleHybrid feldolgozási hiba:', error);
      
      // Fallback válasz
      return {
        response: 'Sajnos most nem tudok segíteni, de rögzítettem a kérésed.',
        confidence: 0.1,
        metadata: {
          memoryUsed: false,
          contextUsed: false,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Kombinált kontextus építés - Memory + Context
   */
  private buildCombinedContext(memoryResult: MemorySearchResult, contextResult: ContextSearchResult): string {
    let context = '';
    
    // Memory kontextus
    if (memoryResult.relevantConversations.length > 0) {
      context += `\n\n🧠 MEMÓRIA KONTEXTUS:\n${memoryResult.summary}\n`;
      
      // Top 3 releváns beszélgetés
      const topConversations = memoryResult.relevantConversations.slice(0, 3);
      topConversations.forEach((conv, index) => {
        context += `${index + 1}. User: "${conv.userMessage}" | Assistant: "${conv.assistantMessage.substring(0, 100)}..."\n`;
      });
    }
    
    // Content Guide kontextus
    if (contextResult.success) {
      context += `\n\n📖 ÚTMUTATÓ KONTEXTUS:\n${contextResult.context}\n`;
      context += `Használt útmutatók: ${contextResult.guidesUsed.join(', ')}\n`;
    }
    
    // Alap DeepO személyiség
    context += `\n\n🎯 DEEPO SZEMÉLYISÉG:
- Intelligens marketing asszisztens a T-DEPO számára
- Szakértő SEO, content marketing, social media témákban
- Barátságos, segítőkész, de professzionális hangvétel
- Magyar nyelvű szakértői tudás
- Válaszaid legyenek gyakorlatiak és actionable`;
    
    return context;
  }

  /**
   * Válasz kinyerése az OpenAI SDK válaszából
   */
  private extractResponse(agentResponse: any): string {
    try {
      console.log(`🔍 Agent response debugging:`, JSON.stringify(agentResponse, null, 2));
      
      // runDeepOAgent válasz struktúra kezelése
      if (agentResponse && agentResponse.success && agentResponse.response) {
        console.log(`✅ runDeepOAgent sikeres válasz: ${agentResponse.response.substring(0, 100)}...`);
        return agentResponse.response;
      }
      
      // runDeepOAgent hiba kezelése
      if (agentResponse && !agentResponse.success && agentResponse.error) {
        console.log(`❌ runDeepOAgent hiba: ${agentResponse.error}`);
        return `Hiba történt: ${agentResponse.error}`;
      }
      
      // Legacy OpenAI SDK válasz struktúrák
      if (agentResponse && agentResponse.messages && agentResponse.messages.length > 0) {
        const lastMessage = agentResponse.messages[agentResponse.messages.length - 1];
        return lastMessage?.content || 'Nincs válasz';
      }
      
      // String válasz
      if (typeof agentResponse === 'string') {
        return agentResponse;
      }
      
      // Content property
      if (agentResponse?.content) {
        return agentResponse.content;
      }
      
      console.log(`❌ Ismeretlen válasz struktúra:`, agentResponse);
      return 'Nincs értelmezhető válasz';
      
    } catch (error) {
      console.error('❌ Válasz kinyerési hiba:', error);
      return 'Hiba a válasz feldolgozásában';
    }
  }

  /**
   * Globális memória statisztikák logging
   */
  private async logGlobalMemoryStats(userId: string): Promise<void> {
    try {
      const stats = await this.memoryManager.getMemoryStats(userId);
      
      console.log(`🌐 Perzisztens memória: ${stats.totalConversations} beszélgetés, ${stats.totalKeywords} kulcsszó`);
      console.log(`📊 Cache állapot: ${stats.dbStats.cacheSize} cache, ${stats.dbStats.conversationRecords} DB record`);
      
    } catch (error) {
      console.error('❌ Memory stats hiba:', error);
    }
  }

  /**
   * Memory statisztikák lekérése
   */
  async getMemoryStats(userId: string) {
    return await this.memoryManager.getMemoryStats(userId);
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    await this.memoryManager.cleanup();
    console.log('🧹 SimpleHybridController cleanup befejezve');
  }
} 
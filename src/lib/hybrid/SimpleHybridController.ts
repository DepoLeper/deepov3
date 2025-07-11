import { runDeepOAgent } from '@/lib/agent-sdk/OpenAIAgentPOC';

/**
 * SimpleHybridController - Minimális hibrid megközelítés
 * 
 * Ez egy egyszerű wrapper a működő OpenAI SDK körül,
 * ahova fokozatosan hozzáadhatjuk a saját komponenseinket.
 */
export class SimpleHybridController {
  
  constructor() {
    console.log('🚀 SimpleHybridController inicializálva');
  }

  /**
   * Fő message processing - egyszerű wrapper az OpenAI SDK körül
   */
  async processMessage(message: string, userId: string, sessionId: string): Promise<{
    response: string;
    suggestions: string[];
    confidence: number;
    metadata: any;
  }> {
    try {
      console.log('📨 SimpleHybrid üzenet feldolgozása:', message);
      
      // 1. Tiszta OpenAI SDK hívás (működő kód)
      const result = await runDeepOAgent(message, 'main');
      
      if (!result.success) {
        throw new Error(result.error || 'OpenAI Agent hiba');
      }

      // 2. Válasz formázása
      const response = {
        response: result.response,
        suggestions: [
          'Elemezzük SEO szempontból?',
          'Készítsünk belőle blog cikket?',
          'További információkat keresel?'
        ],
        confidence: 0.9,
        metadata: {
          agent: result.agent,
          timestamp: result.metadata.timestamp,
          agentType: result.metadata.agentType,
          source: 'SimpleHybridController',
          userId,
          sessionId
        }
      };

      console.log('✅ SimpleHybrid válasz sikeres');
      return response;

    } catch (error) {
      console.error('❌ SimpleHybrid hiba:', error);
      
      throw new Error(`SimpleHybrid feldolgozási hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
    }
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
      version: '1.0.0-simple',
      components: ['OpenAI Agents SDK']
    };
  }
} 
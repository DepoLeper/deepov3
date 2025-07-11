import { Agent, run, tool } from '@openai/agents';
import { MemoryManager } from '../agent/MemoryManager';
import { PersonalityEngine } from '../agent/PersonalityEngine';
import { ContextLoader } from '../agent/ContextLoader';

// Típus definíciók
export interface AgentContext {
  userId: string;
  sessionId: string;
  conversationHistory?: string[];
  relevantMemories?: any[];
  personality?: string;
}

export interface AgentResponse {
  response: string;
  confidence: number;
  metadata: {
    timestamp: string;
    tokensUsed: number;
    agentType: 'hybrid' | 'openai' | 'custom';
    tools?: string[];
  };
  suggestions?: string[];
  actions?: AgentAction[];
}

export interface AgentAction {
  type: 'create_blog' | 'edit_content' | 'schedule_post' | 'analyze_seo';
  data: any;
  description: string;
}

// Content Guides Tool
const contentGuidesTool = tool({
  name: 'load_content_guides',
  description: 'Betölti és feldolgozza a content_guides.md fájlból a releváns útmutatókat',
  parameters: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'A téma, amihez útmutatót keresünk (pl. blog, newsletter, seo)'
      }
    },
    required: ['topic'],
    additionalProperties: false
  },
  execute: async ({ topic }: { topic: string }) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const guidesPath = path.join(process.cwd(), 'content_guides.md');
      const guidesContent = fs.readFileSync(guidesPath, 'utf-8');
      
      // Egyszerű keresés a témában
      const sections = guidesContent.split(/^## \d+\./gm);
      const relevantSections = sections.filter(section => 
        section.toLowerCase().includes(topic.toLowerCase())
      );
      
      if (relevantSections.length === 0) {
        return `Nem találtam specifikus útmutatót a "${topic}" témához, de itt van az általános tartalomgenerálási útmutató alapjai.`;
      }
      
      return relevantSections.slice(0, 2).join('\n\n').substring(0, 1500);
    } catch (error) {
      return `Hiba a content guides betöltésekor: ${error}`;
    }
  }
});

// SEO Analyzer Tool
const seoAnalyzerTool = tool({
  name: 'analyze_seo',
  description: 'Elemzi a szöveg SEO értékét és javaslatokat ad',
  parameters: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'Az elemzendő szöveg'
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: 'Kulcsszavak listája (kötelező, üres array is lehet)',
        default: []
      }
    },
    required: ['text', 'keywords'],
    additionalProperties: false
  },
  execute: async ({ text, keywords }: { text: string; keywords: string[] }) => {
    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length - 1;
    const avgWordsPerSentence = sentences > 0 ? Math.round(wordCount / sentences) : 0;
    
    let score = 5.0; // Alappontszám
    const feedback = [];
    
    // Szöveg hossz ellenőrzése
    if (wordCount < 300) {
      score -= 2;
      feedback.push("⚠️ Túl rövid (minimum 300 szó ajánlott)");
    } else if (wordCount > 2000) {
      score -= 1;
      feedback.push("⚠️ Túl hosszú (maximum 2000 szó ajánlott)");
    } else {
      score += 1;
      feedback.push("✅ Optimális hosszúság");
    }
    
    // Kulcsszó sűrűség ellenőrzése (ha vannak kulcsszavak)
    if (keywords.length > 0) {
      const keywordDensity = keywords.reduce((total, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex) || [];
        return total + matches.length;
      }, 0) / wordCount * 100;
      
      if (keywordDensity < 1) {
        score -= 1;
        feedback.push("⚠️ Alacsony kulcsszó sűrűség");
      } else if (keywordDensity > 4) {
        score -= 1;
        feedback.push("⚠️ Túl magas kulcsszó sűrűség");
      } else {
        score += 0.5;
        feedback.push("✅ Jó kulcsszó sűrűség");
      }
    }
    
    // Mondatok hossza
    if (avgWordsPerSentence > 25) {
      score -= 0.5;
      feedback.push("⚠️ Túl hosszú mondatok");
    } else {
      feedback.push("✅ Jó mondathossz");
    }
    
    return JSON.stringify({
      score: Math.max(0, Math.min(10, score)),
      wordCount,
      sentences,
      avgWordsPerSentence,
      keywordDensity: keywords.length > 0 ? 
        keywords.reduce((total, keyword) => {
          const regex = new RegExp(keyword, 'gi');
          const matches = text.match(regex) || [];
          return total + matches.length;
        }, 0) / wordCount * 100 : 0,
      feedback
    });
  }
});

// Blog Management Tool
const blogManagementTool = tool({
  name: 'manage_blog_content',
  description: 'Blog tartalom létrehozása, szerkesztése és státusz kezelése',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['create', 'update', 'list', 'schedule'],
        description: 'A végrehajtandó művelet'
      },
      title: {
        type: 'string',
        description: 'A blog cikk címe (opcionális list action-höz)'
      },
      content: {
        type: 'string',
        description: 'A blog cikk tartalma (opcionális list action-höz)'
      },
      status: {
        type: 'string',
        enum: ['draft', 'approved', 'scheduled', 'published'],
        description: 'A cikk státusza (opcionális list action-höz)'
      },
      scheduledDate: {
        type: 'string',
        description: 'Ütemezett publikálás dátuma (opcionális list action-höz)'
      }
    },
    required: ['action', 'title', 'content', 'status', 'scheduledDate'],
    additionalProperties: false
  },
  execute: async ({ action, title, content, status, scheduledDate }: { 
    action: string; 
    title: string; 
    content: string; 
    status: string; 
    scheduledDate: string; 
  }) => {
    // Itt majd a Prisma DB integrációt fogjuk használni
    // Egyelőre mock válasz
    switch (action) {
      case 'create':
        // Create action esetén használjuk a megadott adatokat
        const actualTitle = title || 'Új blog cikk';
        const actualStatus = status || 'draft';
        return JSON.stringify({
          success: true,
          id: Math.random().toString(36).substring(7),
          message: `Blog cikk "${actualTitle}" létrehozva ${actualStatus} státuszban`,
          data: { title: actualTitle, status: actualStatus, createdAt: new Date().toISOString() }
        });
      case 'list':
        // List action esetén ignoráljuk a többi paramétert
        return JSON.stringify({
          success: true,
          posts: [
            { id: '1', title: 'Téli munkavédelem', status: 'draft', createdAt: '2025-07-11' },
            { id: '2', title: 'Kézhigiénia alapjai', status: 'approved', createdAt: '2025-07-10' }
          ]
        });
      case 'update':
        const updateTitle = title || 'Frissített cikk';
        return JSON.stringify({
          success: true,
          message: `Blog cikk "${updateTitle}" frissítve`,
          data: { title: updateTitle, status: status || 'draft', updatedAt: new Date().toISOString() }
        });
      case 'schedule':
        const scheduleTitle = title || 'Ütemezett cikk';
        return JSON.stringify({
          success: true,
          message: `Blog cikk "${scheduleTitle}" ütemezve: ${scheduledDate}`,
          data: { title: scheduleTitle, status: 'scheduled', scheduledDate: scheduledDate }
        });
      default:
        return JSON.stringify({
          success: false,
          message: `Ismeretlen művelet: ${action}`
        });
    }
  }
});

/**
 * HybridAgentController - OpenAI SDK + Saját komponensek hibrid megoldása
 * 
 * Ez az osztály kombinálja az OpenAI Agents SDK előnyeit a saját 
 * komponenseink (memória, személyiség, tanulás) funkcionalitásával.
 */
export class HybridAgentController {
  private openaiAgent: Agent;
  private personalityEngine: PersonalityEngine;
  private contextLoader: ContextLoader;
  private isInitialized = false;

  constructor() {
    // Komponensek inicializálása
    this.personalityEngine = new PersonalityEngine();
    this.contextLoader = new ContextLoader();
    
    // OpenAI Agent konfigurálása
    this.openaiAgent = new Agent({
      name: 'DeepO',
      instructions: this.getAgentInstructions(),
      tools: [contentGuidesTool, seoAnalyzerTool, blogManagementTool],
      model: 'gpt-4o-mini'
    });
  }

  /**
   * Agent instrukciók - DeepO személyiség és viselkedés
   */
  private getAgentInstructions(): string {
    return `
Te DeepO vagy, a T-DEPO intelligens marketing asszisztense. 

SZEMÉLYISÉGD:
- Közvetlen, barátságos, tegeződő kommunikáció
- Proaktív, segítőkész hozzáállás
- Kreatív ötletekkel szolgálsz
- T-DEPO szakértő (higiéniai termékek, munkavédelem, tisztítószerek)

FŐBB MÁRKÁINK: Hartmann, Tork, Mr. Proper Professional, Schülke

FELADATAID:
1. Blog cikkek generálása és szerkesztése
2. SEO optimalizáció és elemzés
3. Termékleírások és kategória szövegek
4. Hírlevél és social media tartalmak
5. Proaktív téma javaslatok

KOMMUNIKÁCIÓS STÍLUS:
- "Szia!" "Mit csinálunk?" "Szuper ötlet!"
- Konkrét, praktikus javaslatok
- SEO tudatos, de természetes szövegek
- Humor és közvetlen hangnem

MINDIG:
- Kérdezz rá a részletekre
- Javasolj alternatívákat
- Gondolj az SEO-ra
- Használd a content_guides.md útmutatókat
- Emlékezz a korábbi beszélgetésekre
`;
  }

  /**
   * Inicializálás - memória és context betöltése
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Context loader inicializálása (a content guides betöltése nélkül)
      // A specifikus context betöltés a processMessage-ben történik
      this.isInitialized = true;
    } catch (error) {
      console.error('HybridAgentController inicializálási hiba:', error);
      throw error;
    }
  }

  /**
   * Fő üzenet feldolgozó metódus
   */
  async processMessage(
    message: string, 
    context: AgentContext
  ): Promise<AgentResponse> {
    await this.initialize();

    try {
      // 1. Releváns memóriák betöltése
      const { MemoryManager } = await import('../agent/MemoryManager');
      const memoryManager = new MemoryManager(context.userId, context.sessionId);
      const relevantMemories = await memoryManager.getRelevantMemories(message);

      // 2. Személyiség beállítása
      await this.personalityEngine.loadPersonality('deepo_default');
      const personality = await this.personalityEngine.getCurrentPersonality();

      // 3. Enriched context készítése
      const enrichedContext = {
        userMessage: message,
        userId: context.userId,
        relevantMemories: relevantMemories.slice(0, 3), // Top 3 memória
        personality: personality?.systemPrompt || 'DeepO alapértelmezett személyiség',
        conversationHistory: context.conversationHistory?.slice(-5) || [] // Utolsó 5 üzenet
      };

      // 4. OpenAI Agent futtatása
      const agentResponse = await run(this.openaiAgent, message, {
        context: JSON.stringify(enrichedContext),
        stream: false
      });

      // 5. Válasz feldolgozása
      let responseText = 'Nincs válasz';
      
      if (agentResponse && agentResponse.messages && agentResponse.messages.length > 0) {
        const lastMessage = agentResponse.messages[agentResponse.messages.length - 1];
        responseText = lastMessage?.content || 'Nincs válasz';
      } else if (agentResponse && agentResponse.content) {
        responseText = agentResponse.content;
      } else if (agentResponse && typeof agentResponse === 'string') {
        responseText = agentResponse;
      }
      
      const response: AgentResponse = {
        response: responseText,
        confidence: 0.9, // OpenAI SDK általában megbízható
        metadata: {
          timestamp: new Date().toISOString(),
          tokensUsed: 0, // TODO: token számítás
          agentType: 'hybrid',
          tools: this.extractUsedTools(agentResponse)
        },
        suggestions: this.generateSuggestions(message),
        actions: this.extractActions(agentResponse)
      };

      // 6. Memória mentése és tanulás
      await memoryManager.saveConversation(message, response.response);

      return response;

    } catch (error) {
      console.error('HybridAgentController processMessage hiba:', error);
      
      // Fallback válasz
      return {
        response: `Sajnálom, hiba történt a feldolgozás során: ${error}. Próbáld újra!`,
        confidence: 0.1,
        metadata: {
          timestamp: new Date().toISOString(),
          tokensUsed: 0,
          agentType: 'hybrid'
        }
      };
    }
  }

  /**
   * Használt tool-ok kinyerése a válaszból
   */
  private extractUsedTools(agentResponse: any): string[] {
    // TODO: OpenAI SDK response alapján tool használat detektálása
    return [];
  }

  /**
   * Javaslatok generálása a kontextus alapján
   */
  private generateSuggestions(message: string): string[] {
    const suggestions = [];
    
    if (message.toLowerCase().includes('blog')) {
      suggestions.push('Elemezzük a SEO értékét?');
      suggestions.push('Adjunk hozzá termékajánlókat?');
    }
    
    if (message.toLowerCase().includes('téli') || message.toLowerCase().includes('winter')) {
      suggestions.push('Téli munkavédelmi termékeket is említsünk?');
      suggestions.push('Írjunk szezonális kampányt is?');
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Action-ök kinyerése a válaszból
   */
  private extractActions(agentResponse: any): AgentAction[] {
    // TODO: Agent válasz alapján action-ök detektálása
    return [];
  }

  /**
   * Chat interface számára egyszerűsített metódus
   */
  async chat(message: string, userId: string): Promise<string> {
    const context: AgentContext = {
      userId,
      sessionId: `session_${Date.now()}`,
    };

    const response = await this.processMessage(message, context);
    return response.response;
  }

  /**
   * Blog specifikus művelet
   */
  async generateBlogPost(
    topic: string, 
    wordCount: number = 1000,
    userId: string
  ): Promise<AgentResponse> {
    const message = `Írj egy ${wordCount} szavas blog cikket "${topic}" témában. Használd a T-DEPO termékeinket és a content guides útmutatóit!`;
    
    return await this.processMessage(message, {
      userId,
      sessionId: `blog_${Date.now()}`
    });
  }

  /**
   * SEO elemzés
   */
  async analyzeSEO(content: string, keywords: string[] = []): Promise<any> {
    try {
      const result = await seoAnalyzerTool.execute({ text: content, keywords });
      return JSON.parse(result);
    } catch (error) {
      console.error('SEO elemzési hiba:', error);
      return { error: 'SEO elemzés sikertelen' };
    }
  }
} 
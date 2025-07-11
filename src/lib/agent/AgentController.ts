import OpenAI from 'openai';
import { MemoryManager } from './MemoryManager';
import { ContextLoader } from './ContextLoader';
import { PersonalityEngine } from './PersonalityEngine';
import { ToolManager } from './ToolManager';

export interface AgentConfig {
  userId: string;
  sessionId: string;
  personality: string;
  useContentGuides: boolean;
  temperature: number;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  message: string;
  thinking?: string;
  usedTools?: string[];
  confidence: number;
  tokensUsed: number;
}

export class AgentController {
  private openai: OpenAI;
  private memoryManager: MemoryManager;
  private contextLoader: ContextLoader;
  private personalityEngine: PersonalityEngine;
  private toolManager: ToolManager;

  constructor(config: AgentConfig) {
    this.openai = new OpenAI({
      apiKey: process.env.CHATGPT_API_KEY,
    });

    this.memoryManager = new MemoryManager(config.userId, config.sessionId);
    this.contextLoader = new ContextLoader();
    this.personalityEngine = new PersonalityEngine(config.personality);
    this.toolManager = new ToolManager();
  }

  async processMessage(
    message: string,
    conversationHistory: AgentMessage[]
  ): Promise<AgentResponse> {
    try {
      // 1. Memória betöltése
      const memories = await this.memoryManager.getRelevantMemories(message);
      
      // 2. Kontextus betöltése (content guides, stb.)
      const context = await this.contextLoader.loadContext(message);
      
      // 3. Személyiség és szabályok betöltése
      const personality = await this.personalityEngine.getPersonalityPrompt();
      
      // 4. Összetett prompt építése
      const systemPrompt = await this.buildSystemPrompt(
        personality,
        context,
        memories
      );

      // 5. Beszélgetés előzmények formázása
      const messages = this.formatConversationHistory(
        systemPrompt,
        conversationHistory,
        message
      );

      // 6. OpenAI API hívás
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const assistantMessage = response.choices[0]?.message?.content || '';
      
      // 7. Válasz feldolgozása és memória mentése
      await this.memoryManager.saveConversation(message, assistantMessage);
      
      // 8. Token használat számítása
      const tokensUsed = response.usage?.total_tokens || 0;

      return {
        message: assistantMessage,
        confidence: 0.9,
        tokensUsed,
      };

    } catch (error) {
      console.error('Agent processing error:', error);
      throw new Error('Hiba történt a kérés feldolgozása során');
    }
  }

  private async buildSystemPrompt(
    personality: string,
    context: string,
    memories: string[]
  ): Promise<string> {
    let systemPrompt = `${personality}\n\n`;

    if (context) {
      systemPrompt += `KONTEXTUS INFORMÁCIÓK:\n${context}\n\n`;
    }

    if (memories.length > 0) {
      systemPrompt += `RELEVÁNS MEMÓRIÁK:\n${memories.join('\n')}\n\n`;
    }

    systemPrompt += `
FONTOS SZABÁLYOK:
- Te vagy a DeepO, a T-Depo marketingcsapatának AI asszisztense
- Mindig emlékezz a korábbi beszélgetésekre
- Használd fel a kontextus információkat intelligensen
- Tanulj minden interakcióból
- Legyél konzisztens a személyiségeddel
- Ha nem vagy biztos valamiben, kérdezz vissza
`;

    return systemPrompt;
  }

  private formatConversationHistory(
    systemPrompt: string,
    history: AgentMessage[],
    currentMessage: string
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Legutóbbi 10 üzenet hozzáadása (token limitek miatt)
    const recentHistory = history.slice(-10);
    
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Aktuális üzenet hozzáadása
    messages.push({
      role: 'user',
      content: currentMessage,
    });

    return messages;
  }
} 
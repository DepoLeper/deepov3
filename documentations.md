# Dokumentációk

Ebbe a fájlba gyűjtjük a DeepO intelligens marketing asszisztens fejlesztése során használt külső rendszerek, technológiák és API-k hivatalos dokumentációinak linkjeit.

## Core Agent Technologies
- **OpenAI Agents SDK:** [NPM Package](https://www.npmjs.com/package/@openai/agents) | [GitHub](https://github.com/openai/agents)
- **OpenAI API (GPT-4):** [Hivatalos dokumentáció](https://platform.openai.com/docs/api-reference)
- **OpenAI Function Calling:** [Hivatalos útmutató](https://platform.openai.com/docs/guides/function-calling)
- **OpenAI Assistants API:** [Hivatalos dokumentáció](https://platform.openai.com/docs/assistants/overview)

## Web Framework Stack
- **Next.js:** [Hivatalos dokumentáció](https://nextjs.org/docs)
- **React:** [Hivatalos dokumentáció](https://react.dev/reference/react)
- **TypeScript:** [Hivatalos dokumentáció](https://www.typescriptlang.org/docs/)
- **Tailwind CSS:** [Hivatalos dokumentáció](https://tailwindcss.com/docs)

## Database & ORM
- **Prisma:** [Hivatalos dokumentáció](https://www.prisma.io/docs)
- **SQLite:** [Hivatalos dokumentáció](https://www.sqlite.org/docs.html)
- **Prisma Migrate:** [Migrációs útmutató](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## Authentication & Security
- **NextAuth.js:** [Hivatalos dokumentáció](https://next-auth.js.org/getting-started/introduction)
- **JWT (JSON Web Tokens):** [Hivatalos dokumentáció](https://jwt.io/introduction/)

## Content & UI Components
- **TipTap Editor:** [Hivatalos dokumentáció](https://tiptap.dev/docs)
- **TipTap React:** [React integráció](https://tiptap.dev/docs/editor/installation/react)
- **TipTap Collaboration:** [Collaborative editing](https://tiptap.dev/docs/editor/extensions/collaboration)

## External APIs
- **Unas API:** [Hivatalos dokumentáció](...) *(Ezt majd pótoljuk, amint megkapjuk a linket.)*
- **OpenAI Realtime API:** [Hivatalos dokumentáció](https://platform.openai.com/docs/guides/realtime)

## Development Tools
- **ESLint:** [Hivatalos dokumentáció](https://eslint.org/docs/latest/)
- **Prettier:** [Hivatalos dokumentáció](https://prettier.io/docs/en/)
- **PostCSS:** [Hivatalos dokumentáció](https://postcss.org/docs/)

## Deployment & DevOps
- **AlmaLinux 8:** [Hivatalos dokumentáció](https://wiki.almalinux.org/)
- **cPanel/WHM:** [Hivatalos dokumentáció](https://docs.cpanel.net/)
- **n8n:** [Hivatalos dokumentáció](https://docs.n8n.io/)

## Agent Framework Dokumentációk
- **Agent Design Patterns:** [OpenAI Cookbook](https://cookbook.openai.com/)
- **Multi-Agent Systems:** [Research Papers](https://arxiv.org/search/cs?searchtype=author&query=Multi-Agent)
- **Conversational AI:** [Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

## Projekt Belső Dokumentációk
- **specification.md** - DeepO projekt specifikáció és koncepció
- **steps.md** - Fejlesztési lépések és mérföldkövek
- **content_guides.md** - Tartalomgenerálási útmutatók és referenciák
- **openai_agent_comparison.md** - Saját agent vs. OpenAI SDK összehasonlítás
- **openaichatgptdoc.md** - OpenAI API és Agents SDK teljes dokumentációja
- **debug_log.md** - Részletes debug folyamat és problémamegoldás

## Megvalósított Hibrid Komponensek (Fázis 1-3)

### **SimpleHybridController** ✅
**Fájl:** `src/lib/hybrid/SimpleHybridController.ts`
**Szerepe:** Minimális wrapper az OpenAI SDK körül
**Funkcionalitás:**
- OpenAI Agents SDK hívások wrapper-elése
- Memory context átadás az OpenAI SDK-nak
- Debug monitoring és hibakezelés
- Kontextuális javaslatok generálása

**Interface:**
```typescript
class SimpleHybridController {
  async processMessage(message: string, userId: string, sessionId: string): Promise<{
    response: string;
    suggestions: string[];
    confidence: number;
    metadata: any;
  }>
}
```

### **SimpleMemoryManager** ✅
**Fájl:** `src/lib/hybrid/SimpleMemoryManager.ts`
**Szerepe:** Static Map alapú perzisztens memória
**Funkcionalitás:**
- Beszélgetések tárolása static Map-ben
- Kulcsszó alapú memory keresés
- Relevancia számítás
- Memory context építés az OpenAI SDK számára

**Interface:**
```typescript
class SimpleMemoryManager {
  async saveConversation(userId: string, sessionId: string, userMessage: string, assistantMessage: string): Promise<void>
  async searchRelevantMemories(userId: string, query: string): Promise<MemorySearchResult>
  getMemoryStats(userId: string): { totalConversations: number; totalKeywords: number; recentTopics: string[] }
}
```

### **Enhanced Chat Interface** ✅
**Fájl:** `src/app/chat/page.tsx`
**Szerepe:** Debug monitoring és memory visualization
**Funkcionalitás:**
- Real-time memory information display
- API response debugging
- Memory statistics megjelenítése
- Hibrid controller status indicator

## Következő Hibrid Komponensek (Fázis 4+)

### **SimpleContextLoader** ⏳
**Tervezett fájl:** `src/lib/hybrid/SimpleContextLoader.ts`
**Szerepe:** content_guides.md feldolgozás hibabiztos módon
**Tervezett funkcionalitás:**
- Markdown parsing robust hibakezeléssel
- Content guide keresés kulcsszavak alapján
- OpenAI SDK tool-okba integráció

### **PersonalityEngine Integration** ⏳
**Tervezett fájl:** `src/lib/hybrid/SimplePersonalityEngine.ts`
**Szerepe:** T-DEPO brand voice dinamikus alkalmazása
**Tervezett funkcionalitás:**
- T-DEPO brand voice szabályok
- Kontextus alapú személyiség váltás
- Kollégák preferenciáinak figyelembevétele

## Hibrid Architektúra Referenciák

### **OpenAI Agents SDK Komponensek:**
- **Agent Class:** Core agent orchestration
- **Tool System:** Function calling és tool management
- **Multi-Agent Handoffs:** Agent-to-agent communication
- **Memory Management:** Built-in conversation memory
- **Realtime Integration:** Voice és streaming capabilities

### **Saját Komponensek:**
- **HybridAgentController:** OpenAI SDK + saját komponensek integrálása
- **MemoryManager:** Perzisztens memória Prisma DB-vel
- **PersonalityEngine:** Dinamikus személyiség és brand voice
- **LearningEngine:** Kollaboratív tanulás és adaptáció
- **UnasIntegration:** T-DEPO termék API integráció

## Fejlesztési Megjegyzések

### **Hibrid Megközelítés Architektúra**
```typescript
// Hibrid Agent Controller struktúra
interface HybridAgentController {
  // OpenAI SDK Core
  openaiAgent: Agent;
  
  // Saját Komponensek
  memoryManager: MemoryManager;
  personalityEngine: PersonalityEngine;
  learningEngine: LearningEngine;
  unasIntegration: UnasIntegration;
  
  // Unified Interface
  processMessage(message: string, context: AgentContext): Promise<AgentResponse>;
}
```

### **.env Fájl Kezelése**
A `.env` fájl a Cursor globalIgnore védelme alatt áll, ezért közvetlenül nem szerkeszthető az AI asszisztens által. 

**Megoldás:** Ha módosítani kell a `.env` fájlt:
1. Az AI asszisztens megadja a teljes új tartalmat
2. A felhasználó manuálisan bemásolja a `.env` fájlba

**Fontos:** A `.env` fájl a `.gitignore`-ban szerepel, így nem kerül fel a GitHubra.

**Példa struktúra (`env.example`):**
```
# Prisma Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API Keys
OPENAI_API_KEY="your-openai-api-key-here"
OPENAI_ORGANIZATION="your-org-id-here"

# Agent Configuration
AGENT_MEMORY_RETENTION_DAYS=30
AGENT_LEARNING_RATE=0.1
AGENT_PERSONALITY_DEFAULT="helpful"

# T-DEPO Integration
UNAS_API_KEY="your-unas-api-key-here"
UNAS_API_URL="https://api.unas.hu"
TDEPO_BRAND_VOICE="direct_humorous"

# Development
NODE_ENV="development"
LOG_LEVEL="info"
```

### **Performance Optimalizációk**
- **Token Usage Optimization:** OpenAI SDK beépített cache és optimalizáció
- **Database Indexing:** Prisma indexek a gyors kereséshez
- **Memory Management:** Intelligent context pruning
- **API Rate Limiting:** Automatikus throttling és retry logic

### **Biztonsági Megfontolások**
- **API Key Management:** Környezeti változók biztonságos kezelése
- **User Authentication:** NextAuth.js session management
- **Data Privacy:** Felhasználói adatok védelmének biztosítása
- **Input Validation:** Minden user input sanitizálása

## Hasznos Linkek és Források

### **OpenAI Best Practices:**
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Function Calling Best Practices](https://platform.openai.com/docs/guides/function-calling/best-practices)
- [Agent Design Patterns](https://cookbook.openai.com/examples/orchestrating_agents)

### **Next.js Performance:**
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)

### **Database Design:**
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [SQLite Optimization](https://www.sqlite.org/optoverview.html)

### **T-DEPO Specific:**
- **Brand Guidelines:** T-DEPO márka irányelvek
- **Product Catalog:** Unas API endpoint dokumentáció
- **Marketing Strategy:** Tartalomstratégiai dokumentumok 
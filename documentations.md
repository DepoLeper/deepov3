# DeepO: Dokumentációs Központ

Ez a fájl összegyűjti az összes szükséges dokumentációt és referenciát a DeepO intelligens marketing asszisztens fejlesztéséhez.

## 📚 Projekt Dokumentációk

### 1. Projekt Specifikáció
- **Fájl**: `specification.md`
- **Tartalom**: Projekt célok, architektúra, jelenlegi állapot
- **Utolsó frissítés**: 2025.07.12 - Fázis 5 befejezés (Perzisztens Memória)

### 2. Fejlesztési Lépések
- **Fájl**: `steps.md`
- **Tartalom**: Részletes fejlesztési ütemterv és haladás
- **Utolsó frissítés**: 2025.07.12 - Fázis 5 teljes befejezés

### 3. Tartalomgenerálási Útmutatók
- **Fájl**: `content_guides.md`
- **Tartalom**: Részletes útmutatók tartalomgeneráláshoz
- **Utolsó frissítés**: 2025.07.12 - Jelentősen bővítve
- **Terjedelme**: 2000+ sor, 3 komplett útmutató

---

## 🤖 AI és Agent Technológiák

### OpenAI Agents SDK
- **Fájl**: `openaichatgptdoc.md`
- **Tartalom**: OpenAI hivatalos dokumentáció, Agent SDK, API referencia
- **Állapot**: Teljes referencia anyag

### Agent Összehasonlítás
- **Fájl**: `openai_agent_comparison.md`
- **Tartalom**: Különböző agent megoldások összehasonlítása
- **Célcsoport**: Technikai döntéshozás

---

## 🏗️ Hibrid Architektúra Dokumentáció

### Jelenlegi Komponensek (Fázis 5 - Professzionális Perzisztens Memória)

#### 1. OpenAI Agents SDK (Core AI)
- **Fájl**: `src/lib/agent-sdk/OpenAIAgentPOC.ts`
- **Szerepe**: Alapvető AI funkcionalitás
- **Dokumentáció**: `openaichatgptdoc.md`
- **Állapot**: ✅ Működik

#### 2. PersistentMemoryManager (v4.0) ✅ **ÚJ!**
- **Fájl**: `src/lib/hybrid/PersistentMemoryManager.ts`
- **Szerepe**: Professzionális perzisztens memória
- **Technológia**: Prisma + SQLite + In-memory Cache
- **Funkciók**:
  - Database backend (AgentConversation + AgentMemory)
  - Cache layer (5 perc expiry)
  - Long-term memory (pattern recognition)
  - Hybrid fallback mechanizmusok
  - 500 beszélgetés/user limit
- **Állapot**: ✅ Production-ready - 100% perzisztens

#### 3. SimpleContextLoader
- **Fájl**: `src/lib/hybrid/SimpleContextLoader.ts`
- **Szerepe**: Content guides feldolgozás
- **Forrás**: `content_guides.md`
- **Funkciók**:
  - Automatikus betöltés
  - Kulcsszó-alapú keresés
  - Relevancia pontozás
  - Hibabiztos működés
- **Állapot**: ✅ Működik - 4 útmutató betöltve

#### 4. SimpleHybridController (v4.0) ✅ **FRISSÍTVE!**
- **Fájl**: `src/lib/hybrid/SimpleHybridController.ts`
- **Szerepe**: PersistentMemory + Context + OpenAI SDK koordináció
- **Verziók**:
  - v1.0: Alapvető wrapper
  - v2.0: Memory integráció
  - v3.0: Memory + Context integráció
  - v4.0: **Perzisztens memória + Enhanced orchestration**
- **Állapot**: ✅ Production-ready - Teljes perzisztens hibrid architektúra

### Működési Architektúra

```
User Query → SimpleHybridController v4.0 → {
  1. PersistentMemoryManager (DB + Cache hybrid)
     ├── Cache check (5 perc expiry)
     └── Database load (Prisma + SQLite)
  2. SimpleContextLoader (content guides)
  3. Combined Context építés (Memory + Context)
  4. OpenAI SDK (AI válasz enhanced contexttal)
  5. Persistent Memory mentés (DB + Cache + Long-term)
  6. Response visszaadás (confidence: 0.95)
}
```

---

## 📖 Tartalomgenerálási Útmutatók (Frissített)

### 1. SEO-barát Blogbejegyzés Útmutató (2025)
- **Terjedelme**: ~1000+ sor
- **Tartalom**:
  - Modern SEO filozófia (People-First)
  - E-E-A-T keretrendszer
  - Felhasználói szándék megértése
  - Tökéletes blogbejegyzés anatómiája
  - Technikai SEO elemek
  - Linkelési stratégiák
  - Webáruházi specifikus megoldások
- **Célcsoport**: T-DEPO marketing csapat
- **Állapot**: ✅ Komplett útmutató

### 2. Hírlevél Szövegezés Útmutató
- **Terjedelme**: ~500+ sor
- **Tartalom**:
  - T-DEPO B2B hírlevél stratégia
  - Célközönség szegmentálás
  - Hírlevél típusok (akciós, tematikus, informatív)
  - Humoros, de professzionális hangvétel
  - Gyakorlati példák és sablonok
- **Célcsoport**: T-DEPO email marketing
- **Állapot**: ✅ Komplett útmutató

### 3. Social Media Poszt Útmutató
- **Terjedelme**: ~500+ sor
- **Tartalom**:
  - B2B social media stratégia
  - Platform specifikus megközelítések
  - LinkedIn, Facebook, Instagram
  - Hirdetési formátumok
  - Célzási stratégiák
  - Költségvetés tervezés
- **Célcsoport**: T-DEPO közösségi média
- **Állapot**: ✅ Komplett útmutató

---

## 🔧 Technikai Implementáció

### Next.js 15 Alkalmazás
- **Framework**: Next.js 15 with App Router
- **Nyelv**: TypeScript
- **Styling**: Tailwind CSS
- **Adatbázis**: PostgreSQL + Prisma ORM
- **Autentikáció**: NextAuth.js

### API Endpointok
- **Chat API**: `/api/chat/deepo`
- **Agent Test**: `/api/agent/test`
- **Agent POC**: `/api/agent/poc`

### Környezeti Változók
- **OpenAI API Key**: `OPENAI_API_KEY`
- **Database**: `DATABASE_URL`
- **Auth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

---

## 🌍 Deployment Környezet

### Cél Szerver
- **OS**: AlmaLinux 8
- **Domain**: `deepo.ubli.hu` (tervezett)
- **Hozzáférés**: cPanel és WHM
- **Követelmények**: Node.js, PostgreSQL

### Kompatibilitás
- **Helyi fejlesztés**: Windows 10
- **Szerver környezet**: AlmaLinux 8
- **Konzisztencia**: Docker konténerek (opcionális)

---

## 📊 Fejlesztési Haladás

### Befejezett Fázisok
1. **✅ Fázis 1**: Alaprendszer (OpenAI SDK)
2. **✅ Fázis 2**: SimpleHybridController
3. **✅ Fázis 3**: SimpleMemoryManager  
4. **✅ Fázis 4**: SimpleContextLoader
5. **✅ Fázis 5**: **Professzionális Perzisztens Memória** (PersistentMemoryManager)

### Következő Fázisok
6. **🔄 Fázis 6**: **Unas API integráció** (webáruház adatok) - **IN PROGRESS**
   - ✅ UnasApiClient (XML API kommunikáció)
   - ✅ UnasProductService (termékadatok kezelése)
   - ✅ API endpoint (/api/unas/test)
   - ✅ Environment variables (UNAS_API_KEY)
   - 🔄 DeepO agent integráció
7. **🚀 Fázis 7**: PersonalityEngine (T-DEPO brand voice)
8. **🔮 Fázis 8**: Production deployment (AlmaLinux8)

### Teljesítmény Mutatók
- **Perzisztens memória**: 100% működőképes (tesztelve: oldal frissítés, szerver restart)
- **Database backend**: Production-ready Prisma + SQLite
- **Cache teljesítmény**: 5 perc expiry, hibrid fallback
- **Context loading**: 4 útmutató betöltve
- **OpenAI SDK integráció**: Enhanced válaszok (confidence: 0.95)
- **Hibakezelés**: Multi-layer fallback minden szinten

---

## 📋 Külső Integrációk

### Tervezett Integrációk

#### 1. Unas API (Fázis 5)
- **Cél**: T-DEPO webáruház adatok
- **Funkciók**: Termékadatok, készlet, árak
- **Dokumentáció**: `unasdoc.md`
- **Státusz**: Tervezett

#### 2. N8N Automatizálás (Opcionális)
- **Cél**: Workflow automatizálás
- **Dokumentáció**: `n8ndoc.md`
- **Státusz**: Feltáró fázis

---

## 🔍 Debug és Monitoring

### Console Logok
A hibrid architektúra minden lépése monitorozva van:

```
🚀 SimpleHybridController inicializálva
🧠 SimpleMemoryManager inicializálva
📖 SimpleContextLoader inicializálása...
✅ SimpleContextLoader betöltve: 4 útmutató
📨 SimpleHybrid üzenet feldolgozása: [query]
🔍 Memory keresés: [user] [query]
✅ SimpleContextLoader: X útmutató találat
💾 Beszélgetés mentve
🌐 Globális memória: X users, X total conversations
✅ SimpleHybrid válasz sikeres (memory + context)
```

### Hibakezelés
- **Garantált válasz**: Minden esetben ad választ
- **Graceful degradation**: Komponens hibák esetén is működik
- **Fallback mechanizmusok**: Több szintű biztonság

---

## 📚 Referencia Anyagok

### OpenAI Dokumentáció
- **Agents SDK**: Teljes API referencia
- **Best Practices**: Agent fejlesztési útmutatók
- **Pricing**: Költségoptimalizálás

### T-DEPO Specifikus
- **Brand Voice**: Humoros, közvetlen, tegeződő
- **Célcsoport**: B2B higiéniai beszerzők
- **Termékportfólió**: Tisztítószerek, papíráruk, adagolók

### Technikai Stackek
- **Next.js**: App Router, API Routes
- **TypeScript**: Type safety
- **Prisma**: Database ORM
- **Tailwind**: Styling framework

---

## 🔄 Frissítési Protokoll

### Dokumentáció Frissítés
1. **Minden fázis befejezése után**
2. **Új funkciók implementálása esetén**
3. **Architektúra változások után**
4. **Külső API integrációk után**

### Verziókezelés
- **Git commit**: Minden változás
- **GitHub push**: Backup és együttműködés
- **Dokumentáció szinkron**: Kód és dokumentáció összhangja

---

*Ez a dokumentáció a projekt teljes műszaki hátterét és referenciáit tartalmazza. Minden jelentős változás után frissítésre kerül.* 
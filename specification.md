# DeepO: Intelligens Marketing Asszisztens - Projekt Specifikáció

## 📋 Projekt Áttekintés

### Projekt Név
**DeepO** - Intelligens Marketing Asszisztens a T-DEPO számára

### Jelenlegi Állapot (2025. július 12.)
**✅ FÁZIS 4 BEFEJEZVE - Memory + Context Hibrid Architektúra**

## 🎯 Projekt Célkitűzések

### Fő Cél
Egy intelligens, tanulóképes marketing asszisztens kifejlesztése, amely:
- **Hibrid AI architektúrát** használ (OpenAI Agents SDK + Custom komponensek)
- **Memóriával és kontextussal** rendelkezik
- **Tartalomgenerálási képességekkel** bír
- **T-DEPO specifikus tudásbázisra** épít

### Megvalósítás
**Working Backwards** filozófia - A működő rendszerből kiindulva építjük fel a komplexebb funkciókat.

## 🏗️ Hibrid Architektúra (Jelenlegi v4.0)

### ✅ Működő Komponensek

#### 1. **OpenAI Agents SDK** (Core AI)
- **Szerepe**: Alapvető AI funkcionalitás, természetes nyelvű kommunikáció
- **Implementáció**: `src/lib/agent-sdk/OpenAIAgentPOC.ts`
- **Állapot**: ✅ Működik

#### 2. **SimpleMemoryManager** (Static Map)
- **Szerepe**: Beszélgetések perzisztens tárolása memóriában
- **Implementáció**: `src/lib/hybrid/SimpleMemoryManager.ts`
- **Technológia**: `Map<string, ConversationEntry[]>`
- **Állapot**: ✅ Működik - 100% hibabiztos

#### 3. **SimpleContextLoader** (Content Guides)
- **Szerepe**: `content_guides.md` feldolgozása és kontextusba illesztése
- **Implementáció**: `src/lib/hybrid/SimpleContextLoader.ts`
- **Funkciók**: 
  - Kulcsszó-alapú keresés
  - Relevancia pontozás
  - Hibabiztos működés
- **Állapot**: ✅ Működik - 4 útmutató betöltve

#### 4. **SimpleHybridController** (Orchestration)
- **Szerepe**: Memory + Context + OpenAI SDK koordináció
- **Implementáció**: `src/lib/hybrid/SimpleHybridController.ts`
- **Funkciók**:
  - Kombinált kontextus építés
  - Hibabiztos feldolgozás
  - Real-time monitoring
- **Állapot**: ✅ Működik - v3.0 Memory + Context integráció

### 🔄 Aktuális Működés

**Console logok (működő rendszer):**
```
📖 SimpleContextLoader inicializálása...
✅ SimpleContextLoader betöltve: 4 útmutató
🔍 Memory keresés: [user] "query"
✅ SimpleContextLoader: X útmutató találat
✅ SimpleHybrid válasz sikeres (memory + context)
🌐 Globális memória: 1 users, X total conversations
```

## 📚 Tudásbázis és Tartalomgenerálás

### ✅ Frissített Content Guides (2025.07.12)

A `content_guides.md` fájl mostantól **részletes, professzionális útmutatókat** tartalmaz:

#### 1. **SEO-barát Blogbejegyzés Útmutató (2025)**
- **Scope**: Komplett SEO stratégia
- **Tartalom**: E-E-A-T, felhasználói szándék, technikai SEO
- **Hossz**: ~1000+ sor részletes útmutató
- **Célcsoport**: T-DEPO marketing csapat

#### 2. **Hírlevél Szövegezés Útmutató** 
- **Scope**: B2B email marketing T-DEPO stílusban
- **Tartalom**: 
  - Akciós, tematikus, informatív hírlevél típusok
  - Szegmentálási stratégiák
  - Humoros, de professzionális hangvétel
- **Célcsoport**: T-DEPO specifikus B2B kommunikáció

#### 3. **Social Media Poszt Útmutató**
- **Scope**: LinkedIn, Facebook, Instagram B2B stratégiák
- **Tartalom**: Platform-specifikus hirdetési formátumok
- **Célcsoport**: T-DEPO közösségi média jelenség

### 🤖 SimpleContextLoader Integráció

**Hogyan működik**:
1. **Automatikus betöltés**: Rendszerinduláskor feldolgozza a content_guides.md-t
2. **Kulcsszó keresés**: Felhasználói query alapján releváns útmutatók keresése
3. **Kombinált kontextus**: Memory + Content guides átadása az OpenAI SDK-nak
4. **Hibabiztos működés**: Soha nem dob hibát, mindig ad választ

## 🚀 Fejlesztési Irányok

### Következő Fázisok (Tervezett)

#### **Fázis 5: Unas API Integráció**
- **Cél**: T-DEPO webáruház adatok integrálása
- **Komponens**: `SimpleUnasConnector`
- **Funkciók**: Termékadatok, készletinfo, árak

#### **Fázis 6: PersonalityEngine**
- **Cél**: T-DEPO brand voice következetes alkalmazása
- **Komponens**: `SimplePersonalityEngine`
- **Funkciók**: Humoros, közvetlen, tegeződő stílus

#### **Fázis 7: Perzisztens Memória**
- **Cél**: Adatbázis alapú memória (Redis + PostgreSQL)
- **Komponens**: `PersistentMemoryManager`

### 🔧 Technikai Implementáció

#### Deployment Környezet
- **Szerver**: AlmaLinux 8
- **Domain**: `deepo.ubli.hu` (tervezett)
- **Technológia**: Next.js 15, Node.js
- **Adatbázis**: PostgreSQL, Prisma ORM
- **Memória**: Static Map (current), Redis (future)

#### Fejlesztési Elvek
1. **Hibabiztos működés**: Soha nem dob hibát
2. **Fokozatos fejlesztés**: Minden fázis önálló értéket ad
3. **Meglévő rendszer megőrzése**: Backwards compatibility
4. **Teljes dokumentáció**: Minden változás dokumentálva

## 📊 Jelenlegi Metrics

### Hibrid Architektúra Teljesítmény
- **Memory funkcionalitás**: ✅ 100% működik
- **Context loading**: ✅ 4 útmutató betöltve
- **OpenAI SDK integráció**: ✅ Sikeres válaszok
- **Hibabiztos működés**: ✅ Garantált

### Fejlesztési Haladás
- **Fázis 1**: ✅ Alaprendszer
- **Fázis 2**: ✅ SimpleHybridController
- **Fázis 3**: ✅ SimpleMemoryManager
- **Fázis 4**: ✅ SimpleContextLoader
- **Fázis 5**: 🔄 Következő (Unas API)

## 🎨 Felhasználói Élmény

### Chat Interface
- **URL**: `/chat`
- **Funkcionalitás**: Természetes nyelvű kommunikáció
- **Memória**: Beszélgetések folytatása
- **Kontextus**: Szakmai útmutatók alapján válaszol

### Debug Dashboard
- **Real-time monitoring**: Console logok
- **Memory tracking**: Felhasználók és beszélgetések száma
- **Context loading**: Betöltött útmutatók száma

## 🔐 Biztonsági Szempontok

### API Kulcsok
- **OpenAI API**: Környezeti változóban tárolva
- **Unas API**: Külön fájlban dokumentálva (read-only)

### Memória Kezelés
- **Jelenlegi**: Static Map (szerver újraindításkor törlődik)
- **Jövő**: Titkosított adatbázis tárolás

---

## 📝 Projekt Történet

### Eredeti Koncepció (2025 július)
**Változás**: Statikus SEO tartalomgenerátor → Intelligens marketing asszisztens

### Indoklás
Az agent technológia lehetővé teszi egy interaktívabb, tanulóképes és személyre szabott alkalmazás fejlesztését, ami messze meghaladja egy egyszerű tartalomgenerátor képességeit.

### Fázis 4 Befejezés (2025.07.12)
**Eredmény**: Működő hibrid architektúra Memory + Context integrációval
**Következő**: Unas API integráció és PersonalityEngine fejlesztés

---

*Ez a specifikáció a projekt aktuális állapotát tükrözi. Minden változás után frissítésre kerül.* 
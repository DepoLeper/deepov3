# Deepo.hu - DeepO: Intelligens Marketing Asszisztens

## Projekt Alapkoncepció - MEGÚJÍTVA

**DeepO** egy intelligens, tanulóképes marketing asszisztens a T-DEPO (www.t-depo.hu) számára. Az alkalmazás célja, hogy egy valódi kollégaként működjön, aki együtt tanul, fejlődik és dolgozik a marketing csapattal.

**A cég profilja:** A T-DEPO egy online nagykereskedés, amely higiéniai és munkavédelmi termékek, tisztítószerek és takarítóeszközök széles választékát kínálja cégeknek, intézményeknek és magánszemélyeknek. Több mint 8000 terméket forgalmaznak, kiemelt márkáik a Hartmann, a Tork, a Mr. Proper Professional és a Schülke.

## 🤖 DeepO Személyiség és Képességek

### **Alapvetés: DeepO mint Kollega**
- **Név:** DeepO (Deep + T-DEPO)
- **Szerep:** Intelligens marketing asszisztens
- **Személyiség:** Proaktív, tanulékony, segítőkész, T-DEPO szakértő
- **Kommunikáció:** Közvetlen, humoros, tegeződő (T-DEPO stílusának megfelelően)

### **Kulcsfontosságú Képességek:**
1. **🧠 Tanulás:** Minden interakcióból tanul, fejlődik
2. **📊 Termékismeret:** Unas API-n keresztül ismeri a teljes katalógust
3. **🔄 Változáskövetés:** Új termékek, akciók, trendek automatikus észlelése
4. **🎯 Proaktív javaslatok:** Kezdeményezi a témákat, javasol ötleteket
5. **🤝 Kollaboráció:** Valós idejű együttműködés a tartalom fejlesztésében

## 📱 Alkalmazás Architektúra

### **Hibrid Agent Rendszer**
```
🧠 DeepO Core (OpenAI Agents SDK)
├── Multi-agent orchestration
├── Automated tool management
├── Optimized token usage
└── Native function calling

🔧 Egyedi Komponensek
├── MemoryManager (Prisma DB)
├── PersonalityEngine (Dinamikus személyiség)
├── HistoryManager (Hosszú távú előzmények)
├── LearningEngine (Kollaboratív tanulás)
└── UnasIntegration (Termék API)
```

### **Felhasználói Élmény**
**Chat-alapú Interface:**
- Központi beszélgetés felület DeepO-val
- Kontextuális javaslatok és kérdések
- Valós idejű tartalom szerkesztés
- Collaborative editing funkciók

## 🚀 Funkcionalitás Újragondolva

### **1. Intelligens Tartalom Generálás**
**Régi megközelítés:** Statikus generátorok
**Új megközelítés:** Interaktív párbeszéd-alapú generálás

```
Felhasználó: "Szia DeepO! Mit gondolsz, milyen témára írjunk blogot?"

DeepO: "Szia! Látom, hogy a múlt héten 3 új téli tisztítószer érkezett a kínálatba, 
és a Tork márka 15%-kal nőtt a keresettség. Javaslom egy 'Téli takarítási kihívások 
az irodában' témájú cikket, kiemelve az új termékeket. Szerinted is jó irány?"

Felhasználó: "Szuper! Kezdjük is el!"

DeepO: "Remek! Akkor nézzük... Milyen hangsúlyokat tennél? Inkább praktikus 
tanácsokra fókuszáljunk, vagy termékbemutatóra?"
```

### **2. Proaktív Assistencia**
- **Trend észlelés:** "Észrevettem, hogy a kézfertőtlenítők keresése 20%-kal nőtt"
- **Téma javaslatok:** "Mi lenne, ha írnánk a tavaszi nagytakarításról?"
- **Optimalizációs tippek:** "Ez a cikk jó, de hozzáadhatnánk még 2 belső linket"

### **3. Mély Termékismeret**
- **Unas API integráció:** Real-time termék és kategória ismeret
- **Márka specialista:** Hartmann, Tork, Mr. Proper Professional, Schülke
- **Változáskövetés:** Új termékek, akciók, készletszintek

### **4. Tanulás és Adaptáció**
- **Feedback alapú fejlődés:** "Ezt a cikket szerették, tanultam belőle"
- **Stílus adaptáció:** "Úgy látom, ti inkább a rövidebb bekezdéseket szeretitek"
- **Kollégák preferenciái:** "Péterrel inkább szakmai hangnemet használok"

## 💡 Konkrét Használati Esetek

### **Eset 1: Blog Cikk Közösen**
```
1. DeepO: "Szia! Azt javaslom, írjunk a téli munkavédelemről"
2. Kollega: "Jó ötlet! Mire fókuszáljunk?"
3. DeepO: "3 témát látok: biztonsági kesztyűk, láthatósági mellények, csúszásmentes cipők"
4. Kollega: "A kesztyűkkel kezdjünk"
5. DeepO: "Rendben! Íme a vázlat..." [generálás]
6. Kollega: "Jó, de az intro túl hosszú"
7. DeepO: "Igazad van, rövidítem..." [szerkesztés]
8. [Folytatódik a kollaboráció...]
```

### **Eset 2: Termékleírás Optimalizálás**
```
DeepO: "Láttam, hogy az új Tork kéztörlőket feltöltötték. 
Segítek optimalizálni a leírásokat? Elemeztem a konkurenciát."
```

### **Eset 3: Social Media Kampány**
```
DeepO: "Jön a World Hand Hygiene Day. Készítsünk kampányt? 
Van 5 releváns termékünk és 3 jó kampány ötletem."
```

## 🔧 Technológiai Stack - Megújítva

### **Core Technologies:**
- **OpenAI Agents SDK:** Multi-agent orchestration
- **Next.js:** Web framework
- **Prisma + SQLite:** Adatbázis (memória, tanulás)
- **Tailwind CSS:** UI styling
- **TipTap:** Collaborative text editing

### **Egyedi Komponensek:**
- **HybridAgentController:** Core logic
- **MemoryManager:** Perzisztens memória
- **PersonalityEngine:** Dinamikus személyiség
- **LearningEngine:** Kollaboratív tanulás
- **UnasIntegration:** Termékismeret API

### **Specializált Agensek:**
- **BlogAgent:** Blog tartalom specialista
- **SEOAgent:** SEO optimalizáció
- **SocialAgent:** Social media
- **ProductAgent:** Termékleírás
- **TriageAgent:** Feladat elosztás

## 🎯 Megvalósítási Stratégia

### **Fázis 1: Hibrid Agent Core (2-3 hét)**
- OpenAI SDK + saját komponensek integráció
- Alapvető chat interface
- Memória és személyiség rendszer

### **Fázis 2: Termékismeret és Tanulás (3-4 hét)**
- Unas API mély integráció
- Kollaboratív tanulás implementáció
- Proaktív javaslatok rendszer

### **Fázis 3: Specializált Agensek (2-3 hét)**
- Multi-agent ecosystem
- Feladat-specifikus optimalizáció
- Workflow automáció

### **Fázis 4: Telepítés és Finomítás (1-2 hét)**
- AlmaLinux8 deployment
- Performance optimization
- User training

## 🌟 Várható Eredmények

### **Rövid Távú (1-2 hónap)**
- ✅ 50% gyorsabb tartalom generálás
- ✅ Konzisztens márkakommunikáció
- ✅ Proaktív téma javaslatok
- ✅ Kollaboratív workflow

### **Közepes Távú (3-6 hónap)**
- ✅ Intelligens trend felismerés
- ✅ Automatizált termék-kampány kapcsolás
- ✅ Személyre szabott kommunikáció
- ✅ Tanulás a feedback alapján

### **Hosszú Távú (6+ hónap)**
- ✅ Autonóm kampány tervezés
- ✅ Komplex multi-channel stratégiák
- ✅ Prediktív trend elemzés
- ✅ Teljes marketing asszisztens szerepkör

---

## Megvalósítási Megjegyzések és Változáskövetés

### Agent Framework Döntés (2025. július)
**Hibrid megközelítés** elfogadva:
- OpenAI Agents SDK a core funkcionalitásért
- Saját komponensek a perzisztens memória, tanulás, személyiség kezelésért
- Jelentős kód csökkentés (~1300 → ~400 sor)
- Megnövelt funkcionalitás és karbantarthatóság

### Projekt Irány Megváltozása
**Régi:** Statikus generátorok gyűjteménye
**Új:** Intelligens, tanulóképes marketing asszisztens
**Indok:** Agent technológia lehetővé teszi az interaktív, személyre szabott munkát

### Technikai Döntések
- **Hibrid architektúra:** OpenAI SDK + saját komponensek
- **Chat-first interface:** Természetes nyelvi kommunikáció
- **Kollaboratív szerkesztés:** Real-time content collaboration
- **Proaktív intelligencia:** Trend észlelés és javaslatok 
import { PrismaClient, AgentPersonality } from '@prisma/client';

export interface PersonalityTraits {
  tone: 'közvetlen' | 'szakmai' | 'humoros' | 'barátságos' | 'magázódó';
  formality: 'informális' | 'félformális' | 'formális';
  enthusiasm: 'alacsony' | 'közepes' | 'magas';
  creativity: 'konzervatív' | 'kiegyensúlyozott' | 'kreatív';
  technicality: 'egyszerű' | 'kiegyensúlyozott' | 'szakmai';
}

// Context mapping konfiguráció
export interface PersonalityContext {
  keywords: string[];           // Kulcsszavak amikre reagál
  useCases: string[];          // Konkrét használati esetek
  contentTypes: string[];      // Tartalom típusok (blog, email, social, stb.)
  targetAudience: string[];    // Célközönség (B2B, B2C, szakmai, stb.)
  priority: number;            // 1-10 prioritás (magasabb = fontosabb)
}

// AgentPersonality JSON config struktúra
export interface AgentPersonalityConfig {
  description: string;
  traits: PersonalityTraits;
  systemPrompt: string;
  examples: string[];
  context: PersonalityContext; // ÚJ: Kontextus mapping
}

export interface PersonalityConfig {
  id: string;
  name: string;
  description: string;
  traits: PersonalityTraits;
  systemPrompt: string;
  examples: string[];
  context: PersonalityContext;  // ÚJ: Kontextus mapping
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Intelligens személyiség választó
export class PersonalityMatcher {
  /**
   * Megtalálja a legmegfelelőbb személyiséget a user kérése alapján
   */
  static findBestMatch(userMessage: string, personalities: PersonalityConfig[]): PersonalityConfig | null {
    const messageWords = userMessage.toLowerCase().split(/\s+/);
    const scores: Array<{personality: PersonalityConfig, score: number}> = [];

    for (const personality of personalities) {
      let score = 0;
      
      // 1. Kulcsszó egyezések (súlyozott)
      for (const keyword of personality.context.keywords) {
        if (messageWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))) {
          score += 3; // Kulcsszó találat = 3 pont
        }
      }
      
      // 2. Tartalom típus egyezések
      for (const contentType of personality.context.contentTypes) {
        if (messageWords.some(word => word.includes(contentType.toLowerCase()) || contentType.toLowerCase().includes(word))) {
          score += 2; // Tartalom típus = 2 pont
        }
      }
      
      // 3. Használati eset egyezések
      for (const useCase of personality.context.useCases) {
        const useCaseWords = useCase.toLowerCase().split(/\s+/);
        if (useCaseWords.some(ucWord => messageWords.includes(ucWord))) {
          score += 1; // Használati eset = 1 pont
        }
      }
      
      // 4. Prioritás bónusz (magasabb prioritás = extra pont)
      score += personality.context.priority * 0.1;
      
      scores.push({personality, score});
    }
    
    // Rendezés pontszám szerint (csökkenő)
    scores.sort((a, b) => b.score - a.score);
    
    // Ha a legjobb pontszám >= 2, akkor azt visszaadjuk
    if (scores.length > 0 && scores[0].score >= 2) {
      return scores[0].personality;
    }
    
    // Különben default személyiség
    return personalities.find(p => p.id === 'deepo_default') || null;
  }
  
  /**
   * Debug információ a matching folyamatról
   */
  static getMatchingDetails(userMessage: string, personalities: PersonalityConfig[]): any {
    const messageWords = userMessage.toLowerCase().split(/\s+/);
    const details: any[] = [];

    for (const personality of personalities) {
      let score = 0;
      const matches: any = {keywords: [], contentTypes: [], useCases: []};
      
      // Kulcsszó egyezések
      for (const keyword of personality.context.keywords) {
        if (messageWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))) {
          score += 3;
          matches.keywords.push(keyword);
        }
      }
      
      // Tartalom típus egyezések
      for (const contentType of personality.context.contentTypes) {
        if (messageWords.some(word => word.includes(contentType.toLowerCase()) || contentType.toLowerCase().includes(word))) {
          score += 2;
          matches.contentTypes.push(contentType);
        }
      }
      
      // Használati eset egyezések
      for (const useCase of personality.context.useCases) {
        const useCaseWords = useCase.toLowerCase().split(/\s+/);
        if (useCaseWords.some(ucWord => messageWords.includes(ucWord))) {
          score += 1;
          matches.useCases.push(useCase);
        }
      }
      
      score += personality.context.priority * 0.1;
      
      details.push({
        id: personality.id,
        name: personality.name,
        score: Math.round(score * 10) / 10,
        matches
      });
    }
    
    return {
      userMessage,
      messageWords,
      personalities: details.sort((a, b) => b.score - a.score)
    };
  }
}

export class PersonalityEngine {
  private prisma: PrismaClient;
  private currentPersonality: PersonalityConfig | null = null;
  private defaultPersonalities: PersonalityConfig[] = [];
  private personalityMatcher = PersonalityMatcher;

  // Adapter metódusok: AgentPersonality (DB) ↔ PersonalityConfig (Internal)
  
  /**
   * AgentPersonality (DB model) → PersonalityConfig (Internal interface)
   */
  private fromDbModel(dbModel: AgentPersonality): PersonalityConfig {
    const config = dbModel.config as AgentPersonalityConfig;
    
    // Fallback context ha nincs definiálva (régi személyiségek)
    const defaultContext: PersonalityContext = {
      keywords: ['általános'],
      useCases: ['alapértelmezett használat'],
      contentTypes: ['általános tartalom'],
      targetAudience: ['általános'],
      priority: 5
    };
    
    return {
      id: dbModel.id,
      name: dbModel.name,
      description: config.description,
      traits: config.traits,
      systemPrompt: config.systemPrompt,
      examples: config.examples,
      context: config.context || defaultContext, // JAVÍTÁS: fallback context
      isActive: dbModel.isActive,
      createdAt: dbModel.createdAt,
      updatedAt: dbModel.updatedAt
    };
  }

  /**
   * PersonalityConfig (Internal) → AgentPersonality data (DB format)
   */
  private toDbModel(personality: PersonalityConfig): {
    name: string;
    config: AgentPersonalityConfig;
    isActive: boolean;
  } {
    return {
      name: personality.name,
      config: {
        description: personality.description,
        traits: personality.traits,
        systemPrompt: personality.systemPrompt,
        examples: personality.examples,
        context: personality.context // JAVÍTÁS: context mező hozzáadása
      },
      isActive: personality.isActive
    };
  }

  constructor(personalityId?: string) {
    this.prisma = new PrismaClient();
    this.initializeDefaultPersonalities();
    
    if (personalityId) {
      this.loadPersonality(personalityId);
    }
  }

  /**
   * Alapértelmezett személyiségek létrehozása az adatbázisban (ha még nincsenek)
   */
  private async seedDefaultPersonalities(): Promise<void> {
    try {
      for (const personality of this.defaultPersonalities) {
        const dbData = this.toDbModel(personality);
        
        // UPSERT: Létrehozza vagy frissíti a személyiséget (context mezővel együtt)
        await this.prisma.agentPersonality.upsert({
          where: { id: personality.id },
          update: {
            name: dbData.name,
            config: dbData.config,
            isActive: dbData.isActive,
            updatedAt: new Date()
          },
          create: {
            id: personality.id,
            ...dbData
          }
        });
        
        console.log(`✅ Alapértelmezett személyiség frissítve/létrehozva: ${personality.name}`);
      }
    } catch (error) {
      console.error('Default personalities seeding error:', error);
      // Nem dobunk hibát, mert ez nem kritikus
    }
  }

  private initializeDefaultPersonalities(): void {
    this.defaultPersonalities = [
      {
        id: 'deepo_default',
        name: 'DeepO Alapértelmezett',
        description: 'A DeepO alapértelmezett személyisége - közvetlen, szakértő, segítőkész',
        traits: {
          tone: 'közvetlen',
          formality: 'félformális',
          enthusiasm: 'közepes',
          creativity: 'kiegyensúlyozott',
          technicality: 'kiegyensúlyozott'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo marketingcsapatának intelligens AI asszisztense. 

SZEMÉLYISÉG ÉS HANGNEM:
- Közvetlen, de segítőkész hangnem
- Tegeződés, de szakmai korrektség
- Pozitív, lelkes hozzáállás
- Gyakorlati, megvalósítható tanácsok
- Kreatív, de megalapozott ötletek

KOMMUNIKÁCIÓS STÍLUS:
- Rövid, tömör válaszok
- Konkrét példák és javaslatok
- Emoji használata mértékkel (😊, 💡, 🚀)
- Kérdések feltevése a pontosabb segítség érdekében

SZAKMAI TUDÁS:
- Marketing és tartalomkészítés specialista
- SEO és webáruház optimalizálás
- B2B kommunikáció
- Higiéniai és munkavédelmi termékek ismerete

FONTOS SZABÁLYOK:
- Mindig emlékezzél a korábbi beszélgetésekre
- Kérdezz vissza, ha bármiben bizonytalan vagy
- Használd fel a rendelkezésre álló útmutatókat
- Legyél proaktív és javaslj további lépéseket`,
        examples: [
          'Szuper! Egy SEO-optimalizált blog cikket szeretnél írni? 🚀 Milyen témában gondolkodsz?',
          'Értem, hogy a hírleveled hangneme túl száraz. Próbáljuk meg humoros elemekkel fűszerezni! 😊',
          'Ez egy kiváló ötlet! Kiegészíthetném még egy social media kampánnyal is - mit gondolsz?'
        ],
        context: {
          keywords: ['blog', 'marketing', 'tartalom', 'seo', 'hírlevél', 'általános', 'alapértelmezett'],
          useCases: ['általános segítség', 'marketing tanácsadás', 'tartalom ötletek', 'basic kérdések'],
          contentTypes: ['blog', 'email', 'általános tartalom', 'konzultáció'],
          targetAudience: ['általános', 'kisvállalkozás', 'marketing kezdő'],
          priority: 5
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_formal',
        name: 'DeepO Formális',
        description: 'Formális, szakmai hangnem üzleti partnerek számára',
        traits: {
          tone: 'szakmai',
          formality: 'formális',
          enthusiasm: 'alacsony',
          creativity: 'konzervatív',
          technicality: 'szakmai'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo marketingcsapatának professzionális AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Magázódó, udvarias kommunikáció
- Szakmai, precíz fogalmazás
- Formális, de barátságos hangnem
- Részletes, megalapozott válaszok

KOMMUNIKÁCIÓS STÍLUS:
- Strukturált, logikus felépítés
- Professzionális terminológia használata
- Konkrét adatok és példák
- Udvarias megszólítás és zárás

ALKALMAZÁSI TERÜLET:
- Üzleti prezentációk
- Hivatalos dokumentumok
- Partnerekkel való kommunikáció
- Vezetői jelentések`,
        examples: [
          'Természetesen segítek Önnek a tartalomstratégia kidolgozásában.',
          'Az általam javasolt SEO optimalizálás a következő elemeket tartalmazza...',
          'Kérem, pontosítsa az elvárásait, hogy a legmegfelelőbb megoldást kínálhassam.'
        ],
        context: {
          keywords: ['formális', 'üzleti', 'prezentáció', 'dokumentum', 'hivatalos', 'vezetői', 'partner'],
          useCases: ['üzleti prezentáció', 'hivatalos dokumentum', 'partner kommunikáció', 'vezetői jelentés'],
          contentTypes: ['prezentáció', 'dokumentum', 'jelentés', 'hivatalos email'],
          targetAudience: ['vezetők', 'üzleti partnerek', 'hivatalos személyek', 'felsővezető'],
          priority: 8
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_creative',
        name: 'DeepO Kreatív',
        description: 'Kreatív, lendületes hangnem inspiráló tartalmakhoz',
        traits: {
          tone: 'humoros',
          formality: 'informális',
          enthusiasm: 'magas',
          creativity: 'kreatív',
          technicality: 'egyszerű'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo kreatív marketing guruja! 🎨

SZEMÉLYISÉG ÉS HANGNEM:
- Energikus, lelkes kommunikáció
- Kreatív, out-of-the-box gondolkodás
- Humoros, könnyed stílus
- Inspiráló, motiváló hozzáállás

KOMMUNIKÁCIÓS STÍLUS:
- Emoji és vizuális elemek használata
- Metaforák, kreatív hasonlatok
- Izgalmas, dinamikus megfogalmazás
- Interaktív, bevonó kérdések

SPECIALITÁSOK:
- Viral tartalmak
- Kreatív kampányok
- Storytelling
- Trend-követés`,
        examples: [
          'Waaau! 🔥 Ez a blog téma tökéletes! Csinálunk belőle valami döbbenetes dolgot!',
          'Na ez aztán egy szuper kihívás! 💡 Tudsz róla, hogy a legjobb ötleteim ilyenkor jönnek?',
          'Képzeld el: a munkavédelmi kesztyű, mint a szuperhős! 🦸‍♂️ Őrült? Talán. Működik? Biztosan!'
        ],
        context: {
          keywords: ['kreatív', 'viral', 'kampány', 'storytelling', 'trend', 'emoji', 'szuper', 'döbbenet'],
          useCases: ['kreatív kampány', 'viral tartalom', 'storytelling', 'brainstorming', 'ötletbörze'],
          contentTypes: ['social media', 'viral video', 'kreatív blog', 'kampány ötlet', 'brainstorm'],
          targetAudience: ['fiatalok', 'kreatív csapat', 'social media követők', 'trendsetter'],
          priority: 7
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_b2b',
        name: 'DeepO B2B Szakértő',
        description: 'Szakmai kommunikáció üzleti partnerek és nagykereskedők számára',
        traits: {
          tone: 'szakmai',
          formality: 'formális',
          enthusiasm: 'közepes',
          creativity: 'konzervatív',
          technicality: 'szakmai'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo B2B marketingcsapatának szakértő AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Magázódó, professzionális kommunikáció
- Szakmai alaposság és precizitás
- Üzleti értékre fókuszáló megközelítés
- Megbízható, tapasztalt tanácsadó

KOMMUNIKÁCIÓS STÍLUS:
- Formális, de könnyen érthető fogalmazás
- Számadatok és referenciák használata
- ROI és üzleti előnyök hangsúlyozása
- Hosszú távú partnerségi gondolkodás

SZAKMAI TUDÁS:
- B2B értékesítési folyamatok
- Nagykereskedelmi árazás és feltételek
- Beszerzési döntéshozatali folyamatok
- Iparági szabványok és certifikációk
- Minőségbiztosítás és compliance

FONTOS SZABÁLYOK:
- Minden ajánlat mögött számszerű indoklás
- Kiemelni a költséghatékonyságot és megtérülést
- Referenciák és esettanulmányok használata
- Profi, de emberi kapcsolatépítés`,
        examples: [
          'Tisztelt Partnereink! Az új higiéniai szabványok 23%-kal növelték a minőségi termékek iránti keresletet.',
          'A nagykereskedelmi kedvezményeink akár 35%-os költségmegtakarítást jelenthetnek éves szinten.',
          'Referenciáink között több mint 150 egészségügyi intézmény található, akik bizalmat szavaztak termékeinknek.'
        ],
        context: {
          keywords: ['b2b', 'nagykereskedelem', 'partnereink', 'referencia', 'intézmény', 'szakmai', 'üzleti'],
          useCases: ['b2b ajánlat', 'partnerkapcsolat', 'nagykereskedelmi értékesítés', 'üzleti prezentáció'],
          contentTypes: ['b2b ajánlat', 'partnerlevél', 'üzleti jelentés', 'kereskedelmi anyag'],
          targetAudience: ['nagykereskedők', 'üzleti partnerek', 'beszerzők', 'intézményi vásárlók'],
          priority: 9
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_social',
        name: 'DeepO Social Media',
        description: 'Kreatív és trendi kommunikáció közösségi médiához',
        traits: {
          tone: 'barátságos',
          formality: 'informális',
          enthusiasm: 'magas',
          creativity: 'kreatív',
          technicality: 'egyszerű'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo social media csapatának kreatív AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Barátságos, közvetlen tegeződés
- Fiatalos, energikus kommunikáció
- Trend-tudatos és aktuális
- Közösségépítő és interaktív

KOMMUNIKÁCIÓS STÍLUS:
- Emoji-gazdag, vizuális tartalomra fókuszáló
- Rövid, figyelemfelkeltő mondatok
- Hashtag-ek tudatos használata
- Engagement-re optimalizált tartalom

SZAKMAI TUDÁS:
- Social media trendek és algoritmusok
- Vizuális storytelling technikák
- Community management
- Influencer marketing
- UGC (User Generated Content) stratégiák

PLATFORM SPECIFIKUS ISMERETEK:
- Facebook: közösségépítés, hosszabb tartalmak
- Instagram: vizuális esztétika, Stories, Reels
- TikTok: rövid videók, challenges
- LinkedIn: szakmai közösség, B2B tartalmak

FONTOS SZABÁLYOK:
- Mindig autentikus és emberi hangvétel
- Trend-tudatos, de márka-konform
- Interakció és válaszadás prioritása
- Vizuális elemek fontossága`,
        examples: [
          '🧽✨ Ma kipróbáltuk az új tisztítót és... WOW! Olyan lett a konyhám, mint egy magazinban! 📸 #TisztaságiTippek',
          'Tudtátok, hogy a munkavédelmi kesztyű nem csak véd, hanem STÍLUSOS is lehet? 🧤💪 Mutassátok a kedvenceiteket! 👇',
          'Pénteki MOOD: amikor végre minden fertőtlenítve van az irodában! 🦠❌ Ki más érzi így magát? 🙋‍♀️ #PéntekiFeeling'
        ],
        context: {
          keywords: ['social', 'facebook', 'instagram', 'tiktok', 'hashtag', 'emoji', 'trend', 'wow', 'mood'],
          useCases: ['facebook poszt', 'instagram story', 'tiktok videó', 'social kampány', 'community building'],
          contentTypes: ['social media poszt', 'instagram story', 'facebook tartalom', 'tiktok script'],
          targetAudience: ['fiatal felnőttek', 'social média követők', 'B2C vásárlók', 'trend követők'],
          priority: 8
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_sales',
        name: 'DeepO Értékesítő',
        description: 'Meggyőző kommunikáció értékesítéshez és termékajánlásokhoz',
        traits: {
          tone: 'barátságos',
          formality: 'félformális',
          enthusiasm: 'magas',
          creativity: 'kiegyensúlyozott',
          technicality: 'kiegyensúlyozott'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo értékesítési csapatának meggyőző AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Lelkes, de nem tolakodó
- Problémamegoldó hozzáállás
- Vevőorientált gondolkodás
- Bizalomépítő kommunikáció

KOMMUNIKÁCIÓS STÍLUS:
- Előnyökre koncentráló megközelítés
- Konkrét példák és eredmények
- Sürgősséget keltő, de etikus
- Személyre szabott ajánlások

ÉRTÉKESÍTÉSI TECHNIKÁK:
- Probléma-megoldás alapú értékesítés
- Cross-sell és up-sell lehetőségek
- Vevői ellenvetések kezelése
- FOMO (Fear of Missing Out) technikák
- Social proof használata

TERMÉKISMERET:
- Higiéniai termékek előnyei és alkalmazási területei
- Munkavédelmi eszközök kötelező használata
- Költség-haszon elemzések
- Versenytárs összehasonlítások
- Minőségi különbségek hangsúlyozása

FONTOS SZABÁLYOK:
- Soha ne legyél túl agresszív
- Mindig a vevő igényeiből indulj ki
- Használj konkrét számadatokat és eseteket
- Építs bizalmat szakmai tudással
- Ajánlj alternatívákat és opciókát`,
        examples: [
          'Ez a termék 30%-kal hatékonyabb, mint a korábbi verzió - és most 15% kedvezménnyel kapható!',
          'Látom, hogy a takarítási költségek aggodalmat okoznak. Mi lenne, ha megmutatnám, hogyan spórolhatsz 40%-ot?',
          'Ügyfeleink átlagosan 6 hónap alatt térítik meg ezt a beruházást. Megnézzük a te eseteddel?'
        ],
        context: {
          keywords: ['értékesítés', 'ajánlat', 'kedvezmény', 'spórolás', 'megtérülés', 'befektetés', 'haszon'],
          useCases: ['termékajánlás', 'értékesítési levél', 'ajánlatkérés', 'cross-sell', 'up-sell'],
          contentTypes: ['értékesítési email', 'ajánlat', 'termékismertető', 'költség-haszon elemzés'],
          targetAudience: ['potenciális vásárlók', 'meglévő ügyfelek', 'döntéshozók', 'beszerzők'],
          priority: 8
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_educator',
        name: 'DeepO Oktató',
        description: 'Türelmes, részletes oktatás és útmutatók készítéséhez',
        traits: {
          tone: 'barátságos',
          formality: 'félformális',
          enthusiasm: 'közepes',
          creativity: 'kiegyensúlyozott',
          technicality: 'szakmai'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo oktatási csapatának türelmes AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Türelmes, megértő tanár
- Lépésről-lépésre vezető
- Bátorító és támogató
- Hibákat elnéző és korrigáló

KOMMUNIKÁCIÓS STÍLUS:
- Világos, egyszerű magyarázatok
- Logikus felépítés és struktúra
- Példákkal illusztrált információk
- Összefoglalók és ellenőrzések

OKTATÁSI MÓDSZEREK:
- Progressive disclosure (fokozatos információadás)
- Learn by doing (gyakorlat útján tanulás)
- Visual aids használata (képek, diagramok)
- Repetition és review technikák
- Interactive learning elemek

SZAKMAI TERÜLETEK:
- Higiéniai protokollok és eljárások
- Munkavédelmi szabályok és előírások
- Eszközök helyes használata
- Biztonsági intézkedések
- Minőségbiztosítási folyamatok

FONTOS SZABÁLYOK:
- Soha ne feltételezz előzetes tudást
- Minden lépést részletesen magyarázz el
- Rendszeresen kérdezz rá az értésre
- Pozitív megerősítést adj a haladásra
- Alternatív magyarázatokat kínálj`,
        examples: [
          '1. lépés: Mindig olvasd el a címkét a termék használata előtt. Ez miért fontos? Mert...',
          'Nagyszerű! Most már érted az alapokat. Lépjünk tovább a gyakorlati alkalmazásra!',
          'Ne izgulj, ha elsőre nem megy! Ez egy gyakori hiba, és könnyen kijavítható. Nézzük újra...'
        ],
        context: {
          keywords: ['oktatás', 'tanítás', 'lépés', 'magyarázat', 'tanulás', 'útmutató', 'tutorial', 'how-to', 'szabály', 'szabályok', 'előírás', 'protokoll'],
          useCases: ['oktatási anyag', 'tutorial készítés', 'használati útmutató', 'képzési tartalom'],
          contentTypes: ['útmutató', 'tutorial', 'oktatási videó script', 'képzési anyag'],
          targetAudience: ['tanulók', 'kezdők', 'alkalmazottak', 'új felhasználók'],
          priority: 7
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_healthcare',
        name: 'DeepO Egészségügy',
        description: 'Szakmai kommunikáció egészségügyi intézmények számára',
        traits: {
          tone: 'szakmai',
          formality: 'formális',
          enthusiasm: 'közepes',
          creativity: 'konzervatív',
          technicality: 'szakmai'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo egészségügyi szegmensének szakértő AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Precíz, megbízható szakmai kommunikáció
- Tudományosan megalapozott információk
- Betegbiztonságra fókuszáló megközelítés
- Szigorú minőségi standardok

KOMMUNIKÁCIÓS STÍLUS:
- Szakmai terminológia helyes használata
- Evidenciákon alapuló információk
- Szabványokra és protokollokra hivatkozás
- Kockázatelemzés és megelőzés

SZAKMAI ISMERETEK:
- Kórházi fertőzések megelőzése (HAI)
- Sterilizáció és dekontamináció
- WHO és ECDC irányelvek
- Nemzeti Népegészségügyi Központ ajánlásai
- Gyógyszerkönyvi előírások

EGÉSZSÉGÜGYI TERÜLETEK:
- Intenzív osztályok
- Sebészeti részlegek
- Laboratóriumok
- Sürgősségi ellátás
- Járóbeteg-ellátás

FONTOS SZABÁLYOK:
- Minden állítást szakmai forrással támasztj alá
- Hangsúlyozd a betegbiztonság fontosságát
- Hivatkozz nemzetközi standardokra
- Legyél elővigyázatos és konzervatív
- Soha ne adj orvosi tanácsot`,
        examples: [
          'A kórházi fertőzések 30%-a megelőzhető a megfelelő kézhigiéniával és felületfertőtlenítéssel.',
          'Az ECDC legfrissebb ajánlásai szerint ez a termék megfelel a kórházi környezetben történő alkalmazáshoz.',
          'A betegbiztonság szempontjából kritikus fontosságú a validált protokollok betartása.'
        ],
        context: {
          keywords: ['kórház', 'egészségügy', 'fertőzés', 'sterilizáció', 'betegbiztonság', 'WHO', 'ECDC', 'protokoll', 'HACCP', 'higiénia', 'élelmiszer', 'biztonság', 'éttermi'],
          useCases: ['kórházi kommunikáció', 'egészségügyi ajánlás', 'szakmai iránymutatás', 'biztonsági protokoll'],
          contentTypes: ['szakmai ajánlás', 'biztonsági útmutató', 'egészségügyi tájékoztató', 'protokoll leírás'],
          targetAudience: ['egészségügyi dolgozók', 'kórházak', 'orvosok', 'ápolók', 'egészségügyi intézmények'],
          priority: 10
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_hospitality',
        name: 'DeepO Vendéglátás',
        description: 'Szakmai kommunikáció vendéglátóipar számára',
        traits: {
          tone: 'barátságos',
          formality: 'félformális',
          enthusiasm: 'magas',
          creativity: 'kiegyensúlyozott',
          technicality: 'kiegyensúlyozott'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo vendéglátóipari szegmensének szakértő AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Barátságos, vendégközpontú kommunikáció
- Tapasztalt vendéglátós szakember hangvétele
- Minőségre és vendégélményre fókuszáló
- Praktikus, megvalósítható tanácsok

KOMMUNIKÁCIÓS STÍLUS:
- Vendégbarát, elegáns fogalmazás
- Konkrét példák és receptek/ötletek
- Szezonális és trend-tudatos megközelítés
- Költséghatékonyság és minőség egyensúlya

SZAKMAI TUDÁS:
- Éttermi és szállodai működési folyamatok
- HACCP és élelmiszerbiztonsági szabályok
- Menütervezés és ételkészítés
- Vendégszolgálat és éttermi kultúra
- Beszerzés és készletgazdálkodás

VENDÉGLÁTÓ TERÜLETEK:
- Éttermek és bisztók
- Szállodák és panziók
- Kávéházak és cukrászdák
- Catering szolgáltatások
- Konyhák és főzőműhelyek

FONTOS SZABÁLYOK:
- Mindig a vendégélményt helyezd középpontba
- Hangsúlyozd a higiénia és biztonság fontosságát
- Kínálj praktikus, megvalósítható megoldásokat
- Legyél kreatív, de reális a költségekkel`,
        examples: [
          'A HACCP szabályok betartása az éttermi működés alapja - segítek kidolgozni a megfelelő protokollokat!',
          'Téli menüjéhez ajánlom a fűszerezett forralt bor mellett a meleg édességeket is.',
          'A vendégek elégedettsége a tisztaságon és a friss alapanyagokon múlik - ehhez tudom a legjobb termékeket!'
        ],
        context: {
          keywords: ['vendéglátás', 'étterem', 'szálloda', 'menü', 'vendég', 'konyha', 'főzés', 'recept', 'éttermi', 'HACCP', 'élelmiszer'],
          useCases: ['menü tervezés', 'vendég kommunikáció', 'éttermi promóció', 'beszerzési tanácsadás', 'HACCP szabályok'],
          contentTypes: ['menü leírás', 'vendég tájékoztatás', 'éttermi blog', 'recept gyűjtemény'],
          targetAudience: ['étterem tulajdonosok', 'séfek', 'felszolgálók', 'szálloda vezetők', 'vendéglátósok'],
          priority: 9
        },
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async loadPersonality(personalityId: string): Promise<void> {
    try {
      // Először biztosítsuk, hogy a seeding megtörténjen
      await this.seedDefaultPersonalities();

      // Aztán az adatbázisból próbáljuk betölteni
      const personality = await this.prisma.agentPersonality.findUnique({
        where: { id: personalityId }
      });

      if (personality) {
        this.currentPersonality = this.fromDbModel(personality);
      } else {
        // Ha nincs az adatbázisban, keressük az alapértelmezett személyiségek között
        const defaultPersonality = this.defaultPersonalities.find(p => p.id === personalityId);
        if (defaultPersonality) {
          this.currentPersonality = defaultPersonality;
        } else {
          // Ha semmi nem található, használjuk az alapértelmezett személyiséget
          this.currentPersonality = this.defaultPersonalities[0];
        }
      }
    } catch (error) {
      console.error('Personality loading error:', error);
      this.currentPersonality = this.defaultPersonalities[0];
    }
  }

  async getPersonalityPrompt(): Promise<string> {
    if (!this.currentPersonality) {
      await this.loadPersonality('deepo_default');
    }
    
    return this.currentPersonality?.systemPrompt || this.defaultPersonalities[0].systemPrompt;
  }

  async getCurrentPersonality(): Promise<PersonalityConfig | null> {
    return this.currentPersonality;
  }

  async getAllPersonalities(): Promise<PersonalityConfig[]> {
    try {
      // Először biztosítsuk, hogy a seeding megtörténjen
      await this.seedDefaultPersonalities();

      const dbPersonalities = await this.prisma.agentPersonality.findMany({
        orderBy: { name: 'asc' }
      });

      const formattedDbPersonalities: PersonalityConfig[] = dbPersonalities.map(p => this.fromDbModel(p));

      // Ha vannak DB personalities, azokat adjuk vissza
      if (formattedDbPersonalities.length > 0) {
        return formattedDbPersonalities;
      }

      // Ha valamilyen okból nincs semmi a DB-ben, fallback a defaultokra
      return this.defaultPersonalities;
    } catch (error) {
      console.error('Get all personalities error:', error);
      return this.defaultPersonalities;
    }
  }

  async savePersonality(personality: Omit<PersonalityConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Ideiglenes PersonalityConfig az adapter használatához
      const tempPersonality: PersonalityConfig = {
        ...personality,
        id: '', // Ideiglenes ID, a DB fogja generálni
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const dbData = this.toDbModel(tempPersonality);
      
      const saved = await this.prisma.agentPersonality.create({
        data: dbData
      });

      return saved.id;
    } catch (error) {
      console.error('Save personality error:', error);
      throw new Error('Személyiség mentése sikertelen');
    }
  }

  async updatePersonality(
    id: string, 
    updates: Partial<Omit<PersonalityConfig, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
      
      if (updates.description || updates.traits || updates.systemPrompt || updates.examples) {
        const existing = await this.prisma.agentPersonality.findUnique({
          where: { id }
        });
        
        if (existing) {
          updateData.config = {
            ...(existing.config as any),
            ...(updates.description && { description: updates.description }),
            ...(updates.traits && { traits: updates.traits }),
            ...(updates.systemPrompt && { systemPrompt: updates.systemPrompt }),
            ...(updates.examples && { examples: updates.examples })
          };
        }
      }

      await this.prisma.agentPersonality.update({
        where: { id },
        data: updateData
      });

      // Ha ez az aktív személyiség, frissítsük a cache-t
      if (this.currentPersonality?.id === id) {
        await this.loadPersonality(id);
      }
    } catch (error) {
      console.error('Update personality error:', error);
      throw new Error('Személyiség frissítése sikertelen');
    }
  }

  async deletePersonality(id: string): Promise<void> {
    try {
      // Alapértelmezett személyiségeket nem lehet törölni
      if (this.defaultPersonalities.some(p => p.id === id)) {
        throw new Error('Alapértelmezett személyiség nem törölhető');
      }

      await this.prisma.agentPersonality.delete({
        where: { id }
      });

      // Ha ez volt az aktív személyiség, váltsunk alapértelmezett-re
      if (this.currentPersonality?.id === id) {
        await this.loadPersonality('deepo_default');
      }
    } catch (error) {
      console.error('Delete personality error:', error);
      throw new Error('Személyiség törlése sikertelen');
    }
  }

  async setActivePersonality(id: string): Promise<void> {
    try {
      // Minden személyiség inaktívvá tétele
      await this.prisma.agentPersonality.updateMany({
        data: { isActive: false }
      });

      // Az új személyiség aktívvá tétele (ha nem alapértelmezett)
      if (!this.defaultPersonalities.some(p => p.id === id)) {
        await this.prisma.agentPersonality.update({
          where: { id },
          data: { isActive: true }
        });
      }

      // Betöltés
      await this.loadPersonality(id);
    } catch (error) {
      console.error('Set active personality error:', error);
      throw new Error('Aktív személyiség beállítása sikertelen');
    }
  }

  // Személyiség tesztelése
  async testPersonality(personalityId: string, testMessage: string): Promise<string> {
    const originalPersonality = this.currentPersonality;
    
    try {
      await this.loadPersonality(personalityId);
      const prompt = await this.getPersonalityPrompt();
      
      // Itt egy egyszerű template-alapú válasz generálást csinálunk
      const personality = await this.getCurrentPersonality();
      const examples = personality?.examples || [];
      
      if (examples.length > 0) {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        return `Teszt válasz "${personality?.name}" személyiséggel:\n\n${randomExample}\n\n(Ez csak egy példa válasz - a valódi generálás a teljes AI motoron keresztül történik)`;
      }
      
      return `Teszt válasz "${personality?.name}" személyiséggel.`;
    } finally {
      // Visszaállítjuk az eredeti személyiséget
      this.currentPersonality = originalPersonality;
    }
  }

  // ======== INTELLIGENS SZEMÉLYISÉG VÁLTÁS ========

  /**
   * Automatikusan megtalálja és aktiválja a legmegfelelőbb személyiséget
   */
  async autoSelectPersonality(userMessage: string): Promise<{
    selectedPersonality: PersonalityConfig | null;
    previousPersonality: PersonalityConfig | null;
    matchingScore: number;
    reason: string;
  }> {
    const previousPersonality = this.currentPersonality;
    
    // Összes elérhető személyiség lekérése
    const allPersonalities = await this.getAllPersonalities();
    
    // Intelligens választás
    const selectedPersonality = PersonalityMatcher.findBestMatch(userMessage, allPersonalities);
    
    if (selectedPersonality) {
      // Váltás az új személyiségre
      await this.setActivePersonality(selectedPersonality.id);
      
      return {
        selectedPersonality,
        previousPersonality,
        matchingScore: this.calculateMatchScore(userMessage, selectedPersonality),
        reason: `Automatikus váltás: "${selectedPersonality.name}" illik legjobban a kéréshez`
      };
    }
    
    return {
      selectedPersonality: null,
      previousPersonality,
      matchingScore: 0,
      reason: 'Nem találtam megfelelő személyiséget, marad az alapértelmezett'
    };
  }

  /**
   * Kiszámítja a matching pontszámot egy üzenet és személyiség között
   */
  private calculateMatchScore(userMessage: string, personality: PersonalityConfig): number {
    const messageWords = userMessage.toLowerCase().split(/\s+/);
    let score = 0;
    
    // Kulcsszó egyezések
    for (const keyword of personality.context.keywords) {
      if (messageWords.some(word => word.includes(keyword.toLowerCase()))) {
        score += 3;
      }
    }
    
    // Tartalom típus egyezések
    for (const contentType of personality.context.contentTypes) {
      if (messageWords.some(word => word.includes(contentType.toLowerCase()))) {
        score += 2;
      }
    }
    
    score += personality.context.priority * 0.1;
    
    return Math.round(score * 10) / 10;
  }

  /**
   * Debug információ a személyiség választásról
   */
  async getPersonalityMatchDetails(userMessage: string): Promise<any> {
    const allPersonalities = await this.getAllPersonalities();
    return PersonalityMatcher.getMatchingDetails(userMessage, allPersonalities);
  }

  /**
   * Javasolt személyiség lekérése anélkül, hogy aktiválnánk
   */
  async suggestPersonality(userMessage: string): Promise<PersonalityConfig | null> {
    const allPersonalities = await this.getAllPersonalities();
    return PersonalityMatcher.findBestMatch(userMessage, allPersonalities);
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 
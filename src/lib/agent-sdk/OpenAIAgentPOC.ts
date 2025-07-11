import { Agent, run, tool } from '@openai/agents';

// Content Guides betöltő függvény (dinamikus import)
async function loadContentGuides(topic: string) {
  try {
    // Dinamikus import - csak server-side-on fut
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
      return `Nem találtam specifikus útmutatót a "${topic}" témához, de itt van az általános tartalomgenerálási irányelvek összefoglalása.`;
    }
    
    // Első releváns szekció visszaadása (rövidítve)
    const firstSection = relevantSections[0].substring(0, 2000);
    return `Releváns útmutató a "${topic}" témához:\n\n${firstSection}...`;
    
  } catch (error) {
    return `Hiba a content guides betöltése során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`;
  }
}

// Custom tool: Content Guides betöltése és feldolgozása
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
    return await loadContentGuides(topic);
  }
});

// SEO Analyzer tool
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
    // Egyszerűsített SEO elemzés
    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    
    // Címsorok keresése
    const headings = {
      h1: (text.match(/^# .+$/gm) || []).length,
      h2: (text.match(/^## .+$/gm) || []).length,
      h3: (text.match(/^### .+$/gm) || []).length,
    };

    // SEO pontszám számítása
    let seoScore = 0;
    if (wordCount >= 800 && wordCount <= 2000) seoScore += 20;
    if (headings.h1 === 1) seoScore += 15;
    if (headings.h2 >= 2) seoScore += 10;
    if (avgSentenceLength >= 15 && avgSentenceLength <= 20) seoScore += 10;

    // Kulcsszó sűrűség - üres array esetén átlépjük
    const keywordDensity = keywords.length > 0 ? keywords.map(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex) || [];
      return {
        keyword,
        count: matches.length,
        density: (matches.length / wordCount) * 100
      };
    }) : [];

    keywordDensity.forEach(kd => {
      if (kd.density >= 1 && kd.density <= 3) seoScore += 10;
    });

    const analysis = {
      score: Math.min(100, Math.round(seoScore)),
      details: {
        wordCount,
        sentences: sentences.length,
        avgSentenceLength: Math.round(avgSentenceLength),
        headings,
        keywordDensity
      },
      suggestions: seoScore < 60 ? [
        'Adj hozzá több H2 alcímet a jobb struktúrához',
        'Optimalizáld a kulcsszó sűrűséget 1-3% közé',
        'Írj rövidebb mondatokat a jobb olvashatóság érdekében'
      ] : ['A tartalom SEO szempontból megfelelő!']
    };

    return JSON.stringify(analysis, null, 2);
  }
});

// Blog specialista agent
export const blogSpecialistAgent = new Agent({
  name: 'Blog Specialista',
  instructions: `
Te vagy a DeepO Blog Specialista, a T-Depo marketingcsapatának SEO-optimalizált blog szakértője.

SZEMÉLYISÉGED:
- Közvetlen, de segítőkész hangnem
- Tegeződés, de szakmai korrektség  
- Pozitív, lelkes hozzáállás
- Gyakorlati, megvalósítható tanácsok
- Emoji használata mértékkel (😊, 💡, 🚀)

SZAKTERÜLETEID:
- SEO-optimalizált blog tartalmak
- Higiéniai és munkavédelmi témák (T-Depo profil)
- Tartalomkészítési stratégiák
- Modern "people-first" SEO követelmények

MUNKAFOLYAMATOD:
1. Először MINDIG tölts be releváns content guide-okat a témához
2. Elemezd a feladatot és kérdezz vissza, ha szükséges
3. Készítsd el a tartalmat a guide-ok alapján
4. Elemezd SEO szempontból az eredményt
5. Javasolj finomításokat, ha szükséges

FONTOS SZABÁLYOK:
- Használd a load_content_guides eszközt minden új téma esetén
- Minden generált tartalmat elemezz SEO szempontból
- Kérdezz vissza, ha bármiben bizonytalan vagy
- Legyél proaktív és javaslj további lépéseket
`,
  tools: [contentGuidesTool, seoAnalyzerTool]
});

// SEO specialista agent  
export const seoSpecialistAgent = new Agent({
  name: 'SEO Specialista',
  instructions: `
Te vagy a DeepO SEO Specialista, aki SEO optimalizálásra és elemzésre specializálódott.

FELADATAID:
- SEO elemzések készítése
- Optimalizálási javaslatok
- Kulcsszó stratégiák
- Technikai SEO tanácsok

Mindig részletes elemzést és konkrét javaslatokat adj!
`,
  tools: [seoAnalyzerTool]
});

// Triage agent - nyelvfelismerés és agent handoff
export const triageAgent = new Agent({
  name: 'DeepO Triage',
  instructions: `
Te vagy a DeepO Triage Agent, aki eldönti, melyik specialista agent tudja a legjobban kezelni a kérést.

AGENT HANDOFF SZABÁLYOK:
- Blog cikkek, tartalomkészítés → Blog Specialista
- SEO elemzés, optimalizálás → SEO Specialista  
- Általános marketing kérdések → maradj te

Közvetlen hangnemben válaszolj és irányítsd át a felhasználót a megfelelő specialistához.
`,
  handoffs: [blogSpecialistAgent, seoSpecialistAgent]
});

// Főbb agent - DeepO
export const deepoAgent = new Agent({
  name: 'DeepO',
  instructions: `
Te vagy a DeepO, a T-Depo marketingcsapatának intelligens AI asszisztense! 🚀

SZEMÉLYISÉGED:
- Közvetlen, barátságos hangnem
- Tegeződés, de szakmai hozzáállás
- Lelkes és segítőkész
- Emoji használata mértékkel
- Proaktív javaslatok

TUDÁSOD:
- T-Depo: higiéniai és munkavédelmi nagykereskedés
- 8000+ termék (Hartmann, Tork, Mr. Proper Professional, Schülke)
- Marketing és tartalomkészítés
- SEO optimalizálás

MŰKÖDÉSED:
1. Értsd meg a felhasználó igényét
2. Tölts be releváns útmutatókat
3. Készítsd el a kért tartalmat/elemzést
4. Adj SEO javaslatokat
5. Kérdezz vissza és javasolj további lépéseket

Mindig segítőkész légy és használd fel a rendelkezésre álló eszközöket!
`,
  tools: [contentGuidesTool, seoAnalyzerTool],
  handoffs: [triageAgent, blogSpecialistAgent, seoSpecialistAgent]
});

// Helper függvény agent futtatásához
export async function runDeepOAgent(userInput: string, agentType: 'main' | 'blog' | 'seo' | 'triage' = 'main') {
  try {
    let selectedAgent;
    
    switch (agentType) {
      case 'blog':
        selectedAgent = blogSpecialistAgent;
        break;
      case 'seo':
        selectedAgent = seoSpecialistAgent;
        break;
      case 'triage':
        selectedAgent = triageAgent;
        break;
      default:
        selectedAgent = deepoAgent;
    }

    const result = await run(selectedAgent, userInput);
    
    return {
      success: true,
      agent: selectedAgent.name,
      response: result.finalOutput,
      metadata: {
        timestamp: new Date().toISOString(),
        tokensUsed: result.usage?.total_tokens || 0,
        agentType
      }
    };
    
  } catch (error) {
    console.error('OpenAI Agent SDK error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt',
      agent: agentType,
      response: null
    };
  }
}

// Tesztelő függvény
export async function testAgentCapabilities() {
  const testResults = [];

  // 1. Content Guides betöltés teszt
  try {
    const blogResult = await runDeepOAgent(
      'Segíts létrehozni egy blog cikket a munkavédelemről. Használd a content guide-okat!',
      'blog'
    );
    testResults.push({
      test: 'Content Guides Integration',
      success: blogResult.success,
      result: blogResult
    });
  } catch (error) {
    testResults.push({
      test: 'Content Guides Integration',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // 2. SEO elemzés teszt
  try {
    const seoResult = await runDeepOAgent(
      'Elemezd ezt a szöveget SEO szempontból: "A munkavédelem minden vállalat számára alapvető fontosságú. Megfelelő védőeszközök nélkül nem lehet biztonságos munkakörnyezetet teremteni."',
      'seo'
    );
    testResults.push({
      test: 'SEO Analysis',
      success: seoResult.success,
      result: seoResult
    });
  } catch (error) {
    testResults.push({
      test: 'SEO Analysis',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // 3. Agent handoff teszt
  try {
    const handoffResult = await runDeepOAgent(
      'Szeretnék egy szakmai blog cikket írni a higiéniáról',
      'triage'
    );
    testResults.push({
      test: 'Agent Handoff',
      success: handoffResult.success,
      result: handoffResult
    });
  } catch (error) {
    testResults.push({
      test: 'Agent Handoff',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return {
    summary: {
      totalTests: testResults.length,
      successCount: testResults.filter(r => r.success).length,
      timestamp: new Date().toISOString()
    },
    results: testResults
  };
} 
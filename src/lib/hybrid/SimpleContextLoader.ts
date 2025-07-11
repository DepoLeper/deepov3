import fs from 'fs';
import path from 'path';

export interface ContentGuide {
  id: string;
  title: string;
  content: string;
  tags: string[];
  relevance: number;
}

export interface ContextSearchResult {
  success: boolean;
  context: string;
  guidesUsed: string[];
  error?: string;
}

/**
 * SimpleContextLoader - Hibabiztos content_guides.md feldolgozás
 * 
 * Fázis 4 Hibrid Komponens:
 * - Robust query handling (soha nem dob hibát)
 * - Fallback-ek minden esetben
 * - OpenAI SDK tool-okba integrálható
 * - Console monitoring
 */
export class SimpleContextLoader {
  private contentGuides: ContentGuide[] = [];
  private initialized = false;
  private loadError: string | null = null;

  constructor() {
    // Aszinkron inicializálás, de hibabiztos
    this.safeInitialize();
  }

  /**
   * Hibabiztos inicializálás - soha nem dob hibát
   */
  private async safeInitialize(): Promise<void> {
    try {
      console.log('📖 SimpleContextLoader inicializálása...');
      
      const guidesPath = path.join(process.cwd(), 'content_guides.md');
      if (!fs.existsSync(guidesPath)) {
        this.loadError = 'content_guides.md nem található';
        console.warn('⚠️  content_guides.md nem található, context loader üres módban indul');
        this.initialized = true;
        return;
      }

      const guidesContent = fs.readFileSync(guidesPath, 'utf-8');
      this.contentGuides = this.parseContentGuides(guidesContent);
      this.initialized = true;
      
      console.log(`✅ SimpleContextLoader betöltve: ${this.contentGuides.length} útmutató`);
      
    } catch (error) {
      this.loadError = `Betöltési hiba: ${error}`;
      console.error('❌ SimpleContextLoader hiba:', error);
      this.contentGuides = [];
      this.initialized = true; // Hibás esetben is initialized-nek jelöljük
    }
  }

  /**
   * Fő context loading metódus - SOHA nem dob hibát
   */
  async loadContext(query?: string | null): Promise<ContextSearchResult> {
    await this.ensureInitialized();

    // Robust query validáció
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.log('🔍 SimpleContextLoader: Üres query, nincs context');
      return {
        success: false,
        context: '',
        guidesUsed: [],
        error: 'Üres vagy érvénytelen query'
      };
    }

    // Ha nincs betöltött útmutató
    if (this.contentGuides.length === 0) {
      console.log('📖 SimpleContextLoader: Nincsenek betöltött útmutatók');
      return {
        success: false,
        context: '',
        guidesUsed: [],
        error: this.loadError || 'Nincsenek elérhető útmutatók'
      };
    }

    try {
      const relevantGuides = this.findRelevantGuides(query);
      
      if (relevantGuides.length === 0) {
        console.log(`🔍 SimpleContextLoader: Nincs releváns útmutató: "${query}"`);
        return {
          success: false,
          context: '',
          guidesUsed: [],
          error: 'Nincs releváns útmutató a témához'
        };
      }

      // Legjobb 2 útmutató kiválasztása (token limit miatt)
      const topGuides = relevantGuides.slice(0, 2);
      const contextContent = this.buildContext(topGuides);
      
      console.log(`✅ SimpleContextLoader: ${topGuides.length} útmutató találat: "${query}"`);
      
      return {
        success: true,
        context: contextContent,
        guidesUsed: topGuides.map(g => g.title),
        error: undefined
      };

    } catch (error) {
      console.error('❌ SimpleContextLoader keresési hiba:', error);
      return {
        success: false,
        context: '',
        guidesUsed: [],
        error: `Keresési hiba: ${error}`
      };
    }
  }

  /**
   * Inicializálás biztosítása
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.safeInitialize();
    }
  }

  /**
   * Hibabiztos guide keresés
   */
  private findRelevantGuides(query: string): ContentGuide[] {
    try {
      const queryLower = query.toLowerCase().trim();
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
      
      if (queryWords.length === 0) {
        return [];
      }

      // Releváns pontszámok számítása
      const guidesWithRelevance = this.contentGuides.map(guide => {
        let relevance = 0;
        
        // Cím egyezés (magasabb súly)
        for (const word of queryWords) {
          if (guide.title.toLowerCase().includes(word)) {
            relevance += 3;
          }
        }
        
        // Tag egyezés
        for (const tag of guide.tags) {
          for (const word of queryWords) {
            if (tag.toLowerCase().includes(word)) {
              relevance += 2;
            }
          }
        }
        
        // Tartalom egyezés
        for (const word of queryWords) {
          const contentLower = guide.content.toLowerCase();
          const matches = contentLower.split(word).length - 1;
          relevance += matches * 0.5;
        }
        
        // Speciális kulcsszavak
        relevance += this.calculateSpecialKeywords(queryLower, guide);
        
        return {
          ...guide,
          relevance
        };
      });

      // Sorbarendezés és szűrés
      return guidesWithRelevance
        .filter(guide => guide.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);
        
    } catch (error) {
      console.error('❌ SimpleContextLoader findRelevantGuides hiba:', error);
      return [];
    }
  }

  /**
   * Speciális kulcsszó súlyok
   */
  private calculateSpecialKeywords(query: string, guide: ContentGuide): number {
    let relevance = 0;
    
    // Blog specifikus
    if ((query.includes('blog') || query.includes('cikk')) && 
        guide.title.toLowerCase().includes('blog')) {
      relevance += 5;
    }
    
    // Hírlevél specifikus
    if ((query.includes('hírlevél') || query.includes('newsletter')) && 
        guide.title.toLowerCase().includes('hírlevél')) {
      relevance += 5;
    }
    
    // Social media specifikus
    if ((query.includes('social') || query.includes('facebook')) && 
        guide.title.toLowerCase().includes('social')) {
      relevance += 5;
    }
    
    // SEO specifikus
    if ((query.includes('seo') || query.includes('keresőoptimalizálás')) && 
        (guide.title.toLowerCase().includes('seo') || guide.content.toLowerCase().includes('seo'))) {
      relevance += 4;
    }
    
    return relevance;
  }

  /**
   * Context szöveg összeállítása
   */
  private buildContext(guides: ContentGuide[]): string {
    const contextParts = guides.map(guide => {
      const shortContent = guide.content.length > 1500 
        ? guide.content.substring(0, 1500) + '...'
        : guide.content;
        
      return `### ${guide.title}\n\n${shortContent}`;
    });

    return `A következő útmutatókat használd referenciaként a válaszadáshoz:\n\n${contextParts.join('\n\n---\n\n')}`;
  }

  /**
   * Markdown parsing - hibabiztos
   */
  private parseContentGuides(content: string): ContentGuide[] {
    try {
      const guides: ContentGuide[] = [];
      
      // Fő szekciók szeparálása
      const sections = content.split(/^## \d+\./gm);
      
      for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        
        // Cím kinyerése
        const titleMatch = section.match(/^([^\n]+)/);
        if (!titleMatch) continue;
        
        const title = titleMatch[1].trim();
        
        // Tartalom tisztítása
        const cleanContent = section
          .replace(/^([^\n]+)\n/, '') // Cím eltávolítása
          .trim();
        
        if (cleanContent.length === 0) continue;
        
        // Azonosító és tag-ek generálása
        const id = this.generateId(title);
        const tags = this.extractTags(title + ' ' + cleanContent);
        
        guides.push({
          id,
          title,
          content: cleanContent,
          tags,
          relevance: 0
        });
      }
      
      return guides;
      
    } catch (error) {
      console.error('❌ SimpleContextLoader parsing hiba:', error);
      return [];
    }
  }

  /**
   * Tag kinyerés
   */
  private extractTags(text: string): string[] {
    const tags = new Set<string>();
    const textLower = text.toLowerCase();
    
    // Tartalomtípusok
    if (textLower.includes('blog')) tags.add('blog');
    if (textLower.includes('hírlevél')) tags.add('newsletter');
    if (textLower.includes('social')) tags.add('social');
    if (textLower.includes('seo')) tags.add('seo');
    
    // Témák
    if (textLower.includes('munkavédelem')) tags.add('munkavédelem');
    if (textLower.includes('higiénia')) tags.add('higiénia');
    if (textLower.includes('takarítás')) tags.add('takarítás');
    
    return Array.from(tags);
  }

  /**
   * ID generálás
   */
  private generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }

  /**
   * Status lekérdezés
   */
  getStatus(): {
    initialized: boolean;
    totalGuides: number;
    loadError: string | null;
  } {
    return {
      initialized: this.initialized,
      totalGuides: this.contentGuides.length,
      loadError: this.loadError
    };
  }

  /**
   * Debug információk
   */
  async getDebugInfo(): Promise<{
    status: any;
    availableGuides: string[];
    sampleSearch?: ContextSearchResult;
  }> {
    await this.ensureInitialized();
    
    const debugInfo = {
      status: this.getStatus(),
      availableGuides: this.contentGuides.map(g => g.title),
      sampleSearch: undefined as ContextSearchResult | undefined
    };

    // Teszt keresés
    if (this.contentGuides.length > 0) {
      debugInfo.sampleSearch = await this.loadContext('blog seo');
    }

    return debugInfo;
  }
} 
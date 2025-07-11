import fs from 'fs';
import path from 'path';

export interface ContentGuide {
  id: string;
  title: string;
  content: string;
  tags: string[];
  relevance: number;
}

export class ContextLoader {
  private contentGuides: ContentGuide[] = [];
  private initialized = false;

  constructor() {
    this.loadContentGuides();
  }

  private async loadContentGuides(): Promise<void> {
    if (this.initialized) return;

    try {
      const guidesPath = path.join(process.cwd(), 'content_guides.md');
      const guidesContent = fs.readFileSync(guidesPath, 'utf-8');
      
      this.contentGuides = this.parseContentGuides(guidesContent);
      this.initialized = true;
    } catch (error) {
      console.error('Content guides loading error:', error);
      this.contentGuides = [];
    }
  }

  async loadContext(query: string): Promise<string> {
    await this.loadContentGuides();
    
    if (!query || typeof query !== 'string') {
      return '';
    }
    
    if (this.contentGuides.length === 0) {
      return '';
    }

    const relevantGuides = this.findRelevantGuides(query);
    
    if (relevantGuides.length === 0) {
      return '';
    }

    // Legfontosabb guide-ok összefűzése
    const contextContent = relevantGuides
      .slice(0, 3) // Maximum 3 guide a token limit miatt
      .map(guide => `### ${guide.title}\n\n${guide.content.substring(0, 2000)}...`)
      .join('\n\n---\n\n');

    return `A következő útmutatókat használd referenciaként:\n\n${contextContent}`;
  }

  private parseContentGuides(content: string): ContentGuide[] {
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
  }

  private findRelevantGuides(query: string): ContentGuide[] {
    if (!query || typeof query !== 'string') {
      return [];
    }
    
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
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
        const wordCount = (contentLower.match(new RegExp(word, 'g')) || []).length;
        relevance += wordCount * 0.5;
      }
      
      // Speciális kulcsszó egyezések
      relevance += this.calculateSpecialKeywordRelevance(queryLower, guide);
      
      return {
        ...guide,
        relevance
      };
    });
    
    // Sorbarendezés releváns pontszám alapján
    return guidesWithRelevance
      .filter(guide => guide.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  }

  private calculateSpecialKeywordRelevance(query: string, guide: ContentGuide): number {
    let relevance = 0;
    
    // Blog specifikus
    if (query.includes('blog') || query.includes('cikk')) {
      if (guide.title.toLowerCase().includes('blog') || 
          guide.title.toLowerCase().includes('seo')) {
        relevance += 5;
      }
    }
    
    // Hírlevél specifikus
    if (query.includes('hírlevél') || query.includes('newsletter') || query.includes('email')) {
      if (guide.title.toLowerCase().includes('hírlevél')) {
        relevance += 5;
      }
    }
    
    // Social media specifikus
    if (query.includes('social') || query.includes('facebook') || query.includes('instagram')) {
      if (guide.title.toLowerCase().includes('social') || 
          guide.title.toLowerCase().includes('poszt')) {
        relevance += 5;
      }
    }
    
    // SEO specifikus
    if (query.includes('seo') || query.includes('keresőoptimalizálás') || query.includes('keresés')) {
      if (guide.title.toLowerCase().includes('seo') || 
          guide.content.toLowerCase().includes('keresőmotor')) {
        relevance += 4;
      }
    }
    
    // Tartalomtípus specifikus
    if (query.includes('toplista') || query.includes('lista')) {
      if (guide.content.toLowerCase().includes('toplista') || 
          guide.content.toLowerCase().includes('lista')) {
        relevance += 3;
      }
    }
    
    // Hangnem specifikus
    if (query.includes('humoros') || query.includes('vicces')) {
      if (guide.content.toLowerCase().includes('humoros') || 
          guide.content.toLowerCase().includes('vicces')) {
        relevance += 3;
      }
    }
    
    return relevance;
  }

  private extractTags(text: string): string[] {
    const tags = new Set<string>();
    const textLower = text.toLowerCase();
    
    // Tartalomtípusok
    if (textLower.includes('blog') || textLower.includes('cikk')) tags.add('blog');
    if (textLower.includes('hírlevél') || textLower.includes('newsletter')) tags.add('newsletter');
    if (textLower.includes('social') || textLower.includes('poszt')) tags.add('social');
    if (textLower.includes('seo') || textLower.includes('keresőoptimalizálás')) tags.add('seo');
    
    // Témák
    if (textLower.includes('munkavédelem') || textLower.includes('védőeszköz')) tags.add('munkavédelem');
    if (textLower.includes('higiénia') || textLower.includes('tisztítás')) tags.add('higiénia');
    if (textLower.includes('takarítás') || textLower.includes('takarító')) tags.add('takarítás');
    
    // Stílusok
    if (textLower.includes('humoros') || textLower.includes('vicces')) tags.add('humoros');
    if (textLower.includes('szakmai') || textLower.includes('hivatalos')) tags.add('szakmai');
    if (textLower.includes('közvetlen') || textLower.includes('barátságos')) tags.add('közvetlen');
    
    // Formátumok
    if (textLower.includes('toplista') || textLower.includes('lista')) tags.add('lista');
    if (textLower.includes('útmutató') || textLower.includes('guide')) tags.add('útmutató');
    if (textLower.includes('termékajánló') || textLower.includes('ajánló')) tags.add('termékajánló');
    
    return Array.from(tags);
  }

  private generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }

  // Fejlesztési és debug célokra
  async getAvailableGuides(): Promise<ContentGuide[]> {
    await this.loadContentGuides();
    return this.contentGuides;
  }

  async searchGuides(query: string): Promise<ContentGuide[]> {
    await this.loadContentGuides();
    return this.findRelevantGuides(query);
  }

  // Új guide hozzáadása runtime-ban
  addCustomGuide(guide: Omit<ContentGuide, 'id'>): void {
    const customGuide: ContentGuide = {
      ...guide,
      id: this.generateId(guide.title)
    };
    this.contentGuides.push(customGuide);
  }

  // Guide frissítése
  updateGuide(id: string, updates: Partial<ContentGuide>): boolean {
    const index = this.contentGuides.findIndex(guide => guide.id === id);
    if (index === -1) return false;
    
    this.contentGuides[index] = { ...this.contentGuides[index], ...updates };
    return true;
  }

  // Statisztikák
  getStats(): {
    totalGuides: number;
    avgContentLength: number;
    tagDistribution: Record<string, number>;
  } {
    const totalGuides = this.contentGuides.length;
    const avgContentLength = this.contentGuides.reduce((sum, guide) => sum + guide.content.length, 0) / totalGuides;
    
    const tagDistribution: Record<string, number> = {};
    this.contentGuides.forEach(guide => {
      guide.tags.forEach(tag => {
        tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
      });
    });
    
    return {
      totalGuides,
      avgContentLength,
      tagDistribution
    };
  }
} 
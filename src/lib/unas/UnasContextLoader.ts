/**
 * UnasContextLoader - Unas termékadatok integrálása a DeepO kontextusba
 * 
 * Funkcionalitás:
 * - Termékspecifikus kontextus építés
 * - Kategória-alapú ajánlások
 * - SEO optimalizált termékleírások
 * - Automatikus terméktalálatok kulcsszavak alapján
 */

import { UnasApiClient, UnasProduct, UnasCategory, getUnasApiClient } from './UnasApiClient';
import { UnasProductService, getUnasProductService, ProductSearchResult } from './UnasProductService';

export interface UnasContextResult {
  success: boolean;
  context: string;
  productsFound: UnasProduct[];
  categoriesFound: UnasCategory[];
  recommendations: UnasProduct[];
  metadata: {
    searchTerms: string[];
    totalProducts: number;
    totalCategories: number;
    processingTime: number;
  };
}

export interface UnasSearchAnalysis {
  detectedKeywords: string[];
  productIntent: boolean;
  categoryIntent: boolean;
  commercialIntent: 'none' | 'low' | 'medium' | 'high';
  intentType: 'informational' | 'navigational' | 'commercial' | 'transactional';
}

export class UnasContextLoader {
  private apiClient: UnasApiClient | null = null;
  private productService: UnasProductService | null = null;
  private isInitialized = false;

  constructor() {
    console.log('🛍️ UnasContextLoader inicializálva');
  }

  /**
   * Inicializálás (csak ha van API kulcs)
   */
  private async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      const apiKey = process.env.UNAS_API_KEY;
      if (!apiKey) {
        console.log('⚠️ UNAS_API_KEY nincs beállítva - UnasContextLoader disabled');
        return false;
      }

      this.apiClient = getUnasApiClient({
        apiKey,
        timeout: 30000
      });

      this.productService = getUnasProductService(this.apiClient);
      this.isInitialized = true;

      console.log('✅ UnasContextLoader inicializálva API kulccsal');
      return true;

    } catch (error) {
      console.error('❌ UnasContextLoader inicializálási hiba:', error);
      return false;
    }
  }

  /**
   * Fő metódus: Unas kontextus keresés üzenet alapján
   */
  async searchUnasContext(message: string): Promise<UnasContextResult> {
    const startTime = Date.now();

    try {
      // Inicializálás ellenőrzése
      const initialized = await this.initialize();
      if (!initialized || !this.productService) {
        return this.createEmptyResult(startTime);
      }

      console.log('🔍 Unas kontextus keresés:', message);

      // 1. Üzenet elemzése
      const analysis = this.analyzeMessage(message);
      console.log('📊 Üzenet elemzés:', analysis);

      // 2. Ha nincs termék/kereskedelmi szándék, üres eredmény
      if (analysis.commercialIntent === 'none') {
        console.log('ℹ️ Nincs kereskedelmi szándék - nincs Unas kontextus');
        return this.createEmptyResult(startTime);
      }

      // 3. Termékek keresése
      const products = await this.searchRelevantProducts(analysis);
      
      // 4. Kategóriák lekérése
      const categories = await this.getRelevantCategories();

      // 5. Ajánlások generálása
      const recommendations = await this.generateRecommendations(products, analysis);

      // 6. Kontextus építés
      const context = this.buildUnasContext(products, categories, recommendations, analysis);

      const processingTime = Date.now() - startTime;

      console.log(`✅ Unas kontextus építve: ${products.length} termék, ${categories.length} kategória`);

      return {
        success: true,
        context,
        productsFound: products,
        categoriesFound: categories,
        recommendations,
        metadata: {
          searchTerms: analysis.detectedKeywords,
          totalProducts: products.length,
          totalCategories: categories.length,
          processingTime
        }
      };

    } catch (error) {
      console.error('❌ Unas kontextus keresési hiba:', error);
      return this.createEmptyResult(startTime, error);
    }
  }

  /**
   * Üzenet elemzése termék/kereskedelmi szándék felismeréshez
   */
  private analyzeMessage(message: string): UnasSearchAnalysis {
    const lowerMessage = message.toLowerCase();

    // Termék kulcsszavak (T-DEPO specifikus)
    const productKeywords = [
      'termék', 'product', 'árú', 'vásárlás', 'buy', 'price', 'ár', 'bolt', 'shop',
      'takarító', 'tisztító', 'higiénia', 'fertőtlenítő', 'kézfertőtlenítő',
      'szappan', 'mosószer', 'tisztítószer', 'papírtörlő', 'wc papír',
      'kesztyű', 'maszk', 'védőfelszerelés', 'irodaszer', 'equipment'
    ];

    const commercialKeywords = [
      'ajánlat', 'akció', 'kedvezmény', 'sale', 'offer', 'discount',
      'összehasonlít', 'compare', 'teszt', 'review', 'vélemény',
      'legjobb', 'best', 'top', 'recommended', 'ajánlott'
    ];

    const transactionalKeywords = [
      'megvesz', 'rendel', 'order', 'kosár', 'cart', 'checkout',
      'szállítás', 'delivery', 'payment', 'fizetés'
    ];

    // Kulcsszavak detektálása
    const detectedKeywords: string[] = [];
    
    productKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    });

    commercialKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    });

    transactionalKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    });

    // Szándék típus meghatározása
    let intentType: 'informational' | 'navigational' | 'commercial' | 'transactional' = 'informational';
    let commercialIntent: 'none' | 'low' | 'medium' | 'high' = 'none';

    if (transactionalKeywords.some(kw => lowerMessage.includes(kw))) {
      intentType = 'transactional';
      commercialIntent = 'high';
    } else if (commercialKeywords.some(kw => lowerMessage.includes(kw))) {
      intentType = 'commercial';
      commercialIntent = 'medium';
    } else if (productKeywords.some(kw => lowerMessage.includes(kw))) {
      intentType = 'commercial';
      commercialIntent = 'low';
    }

    const productIntent = productKeywords.some(kw => lowerMessage.includes(kw));
    const categoryIntent = lowerMessage.includes('kategória') || lowerMessage.includes('category');

    return {
      detectedKeywords,
      productIntent,
      categoryIntent,
      commercialIntent,
      intentType
    };
  }

  /**
   * Releváns termékek keresése
   */
  private async searchRelevantProducts(analysis: UnasSearchAnalysis): Promise<UnasProduct[]> {
    if (!this.productService) return [];

    try {
      // Keresési paraméterek építése
      const searchOptions = {
        query: analysis.detectedKeywords.join(' '),
        limit: analysis.commercialIntent === 'high' ? 10 : 5,
        includeDescription: analysis.commercialIntent !== 'none'
      };

      const searchResult = await this.productService.searchProducts(searchOptions);
      
      console.log(`🛒 ${searchResult.totalCount} termék találat`);
      return searchResult.products;

    } catch (error) {
      console.error('❌ Termék keresési hiba:', error);
      return [];
    }
  }

  /**
   * Releváns kategóriák lekérése
   */
  private async getRelevantCategories(): Promise<UnasCategory[]> {
    if (!this.productService) return [];

    try {
      const categories = await this.productService.getCategories(10);
      console.log(`📁 ${categories.length} kategória betöltve`);
      return categories;

    } catch (error) {
      console.error('❌ Kategória lekérési hiba:', error);
      return [];
    }
  }

  /**
   * Termékajánlások generálása
   */
  private async generateRecommendations(
    products: UnasProduct[], 
    analysis: UnasSearchAnalysis
  ): Promise<UnasProduct[]> {
    if (!this.productService || products.length === 0) return [];

    try {
      // Ha van konkrét termék találat, ajánljunk hasonlókat
      const firstProduct = products[0];
      
      // Egyszerű ajánlás: ugyanabból a kategóriából
      if (firstProduct.Category) {
        const relatedProducts = await this.productService.searchProducts({
          category: firstProduct.Category,
          limit: 3
        });
        
        // Szűrjük ki azokat, amik már benne vannak
        const recommendations = relatedProducts.products.filter(
          rec => !products.some(prod => prod.Id === rec.Id)
        );

        console.log(`💡 ${recommendations.length} ajánlás generálva`);
        return recommendations.slice(0, 3);
      }

      return [];

    } catch (error) {
      console.error('❌ Ajánlás generálási hiba:', error);
      return [];
    }
  }

  /**
   * Unas kontextus string építése
   */
  private buildUnasContext(
    products: UnasProduct[],
    categories: UnasCategory[],
    recommendations: UnasProduct[],
    analysis: UnasSearchAnalysis
  ): string {
    let context = '';

    // Termékadatok kontextus
    if (products.length > 0) {
      context += `\n\n🛍️ TERMÉKADATOK (${products.length} találat):\n`;
      
      products.slice(0, 5).forEach((product, index) => {
        context += `${index + 1}. "${product.Name}" (SKU: ${product.Sku})`;
        if (product.Price) context += ` - ${product.Price} Ft`;
        if (product.Category) context += ` [${product.Category}]`;
        if (product.Description) context += `\n   Leírás: ${product.Description.substring(0, 150)}...`;
        context += '\n';
      });
    }

    // Kategória kontextus
    if (categories.length > 0) {
      context += `\n📁 ELÉRHETŐ KATEGÓRIÁK:\n`;
      categories.slice(0, 5).forEach((category, index) => {
        context += `- ${category.Name}`;
        if (category.Description) context += ` (${category.Description})`;
        context += '\n';
      });
    }

    // Ajánlások
    if (recommendations.length > 0) {
      context += `\n💡 KAPCSOLÓDÓ AJÁNLÁSOK:\n`;
      recommendations.forEach((rec, index) => {
        context += `- "${rec.Name}" (${rec.Sku})`;
        if (rec.Price) context += ` - ${rec.Price} Ft`;
        context += '\n';
      });
    }

    // Kereskedelmi szándék szerinti utasítások
    context += `\n🎯 TARTALMI IRÁNYELVEK:\n`;
    
    switch (analysis.commercialIntent) {
      case 'high':
        context += `- Konkrét vásárlási döntést támogató tartalom
- Termékek részletes összehasonlítása
- Árak, előnyök, specifikációk kiemelése
- Call-to-action a vásárlásra`;
        break;
      
      case 'medium':
        context += `- Informatív, de termékcentrikus tartalom
- Termékjellemzők gyakorlati előnyeinek bemutatása
- Vásárlási tippek és útmutatók
- Soft termékajánlások`;
        break;
      
      case 'low':
        context += `- Általános információs tartalom termékreferenciákkal
- Oktató jellegű tartalom
- Termékek mint példák/illusztrációk
- Brandépítő kommunikáció`;
        break;
    }

    context += `\n\nSZANDÉK TÍPUS: ${analysis.intentType}`;
    context += `\nKULCSSZAVAK: ${analysis.detectedKeywords.join(', ')}`;

    return context;
  }

  /**
   * Üres eredmény létrehozása
   */
  private createEmptyResult(startTime: number, error?: any): UnasContextResult {
    return {
      success: false,
      context: '',
      productsFound: [],
      categoriesFound: [],
      recommendations: [],
      metadata: {
        searchTerms: [],
        totalProducts: 0,
        totalCategories: 0,
        processingTime: Date.now() - startTime
      }
    };
  }

  /**
   * API kapcsolat tesztelése
   */
  async testConnection(): Promise<{success: boolean; message: string}> {
    try {
      const initialized = await this.initialize();
      if (!initialized || !this.productService) {
        return {
          success: false,
          message: 'Unas API nincs konfigurálva (UNAS_API_KEY hiányzik)'
        };
      }

      const testResult = await this.productService.testConnection();
      return testResult;

    } catch (error) {
      return {
        success: false,
        message: `UnasContextLoader teszt hiba: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Cache statisztikák
   */
  getCacheStats() {
    if (!this.productService) {
      return { message: 'UnasProductService nincs inicializálva' };
    }
    
    return this.productService.getCacheStats();
  }
}

// Singleton instance exportálása
let unasContextLoader: UnasContextLoader | null = null;

export function getUnasContextLoader(): UnasContextLoader {
  if (!unasContextLoader) {
    unasContextLoader = new UnasContextLoader();
  }
  
  return unasContextLoader;
}

export default UnasContextLoader; 
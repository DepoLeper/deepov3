/**
 * UnasProductService - Termékadatok kezelése és cache-elés
 * 
 * Funkcionalitás:
 * - Termékadatok lekérése és cache-elése
 * - Kategória alapú szűrés
 * - Keresés terméknevek és cikkszámok alapján
 * - Integráció a DeepO agent-tel
 */

import { UnasApiClient, UnasProduct, UnasCategory, getUnasApiClient } from './UnasApiClient';

export interface ProductSearchOptions {
  query?: string;
  category?: string;
  limit?: number;
  includeDescription?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface ProductSearchResult {
  products: UnasProduct[];
  categories: UnasCategory[];
  totalCount: number;
  searchQuery: string;
}

export class UnasProductService {
  private apiClient: UnasApiClient;
  private productCache: Map<string, { data: UnasProduct[]; timestamp: Date }> = new Map();
  private categoryCache: Map<string, { data: UnasCategory[]; timestamp: Date }> = new Map();
  private cacheExpiry = 10 * 60 * 1000; // 10 perc

  constructor(apiClient: UnasApiClient) {
    this.apiClient = apiClient;
    console.log('🛍️ UnasProductService inicializálva');
  }

  /**
   * Termékek keresése
   */
  async searchProducts(options: ProductSearchOptions = {}): Promise<ProductSearchResult> {
    console.log('🔍 Termékek keresése:', options);

    try {
      // Cache kulcs generálása
      const cacheKey = this.generateCacheKey('products', options);
      const cached = this.getFromCache(this.productCache, cacheKey);
      
      if (cached) {
        console.log('📦 Termékek cache-ből betöltve');
        return this.filterAndFormatProducts(cached, options);
      }

      // API lekérés
      const products = await this.apiClient.getProducts({
        limit: options.limit || 50,
        contentType: options.includeDescription ? 'full' : 'normal'
      });

      // Cache-be mentés
      this.setCache(this.productCache, cacheKey, products);

      console.log(`✅ ${products.length} termék lekérve az API-ból`);
      return this.filterAndFormatProducts(products, options);

    } catch (error) {
      console.error('❌ Termék keresés hiba:', error);
      throw new Error(`Product search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Kategóriák lekérése
   */
  async getCategories(limit?: number): Promise<UnasCategory[]> {
    console.log('📁 Kategóriák lekérése');

    try {
      const cacheKey = `categories_${limit || 'all'}`;
      const cached = this.getFromCache(this.categoryCache, cacheKey);
      
      if (cached) {
        console.log('📦 Kategóriák cache-ből betöltve');
        return cached;
      }

      // API lekérés
      const categories = await this.apiClient.getCategories({ limit });

      // Cache-be mentés
      this.setCache(this.categoryCache, cacheKey, categories);

      console.log(`✅ ${categories.length} kategória lekérve`);
      return categories;

    } catch (error) {
      console.error('❌ Kategória lekérés hiba:', error);
      throw new Error(`Category fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Specifikus termék lekérése cikkszám alapján
   */
  async getProductBySku(sku: string): Promise<UnasProduct | null> {
    console.log('🔍 Termék keresése cikkszám alapján:', sku);

    try {
      const products = await this.apiClient.getProducts({ sku, contentType: 'full' });
      
      if (products.length === 0) {
        console.log(`❌ Termék nem található: ${sku}`);
        return null;
      }

      console.log(`✅ Termék megtalálva: ${products[0].Name}`);
      return products[0];

    } catch (error) {
      console.error('❌ Termék lekérés hiba:', error);
      throw new Error(`Product fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Termékajánlások kategória alapján
   */
  async getProductRecommendations(categoryId: number, limit: number = 5): Promise<UnasProduct[]> {
    console.log('💡 Termékajánlások lekérése:', { categoryId, limit });

    try {
      const products = await this.apiClient.getProducts({
        categoryId,
        limit,
        contentType: 'short'
      });

      console.log(`✅ ${products.length} termékajánlás lekérve`);
      return products;

    } catch (error) {
      console.error('❌ Termékajánlás lekérés hiba:', error);
      throw new Error(`Product recommendations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Termékadatok szűrése és formázása
   */
  private filterAndFormatProducts(products: UnasProduct[], options: ProductSearchOptions): ProductSearchResult {
    let filteredProducts = [...products];

    // Szöveges keresés
    if (options.query) {
      const query = options.query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.Name.toLowerCase().includes(query) ||
        product.Sku.toLowerCase().includes(query) ||
        (product.Description && product.Description.toLowerCase().includes(query))
      );
    }

    // Kategória szűrés
    if (options.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.Category && product.Category.toLowerCase().includes(options.category!.toLowerCase())
      );
    }

    // Ár szűrés
    if (options.priceRange) {
      filteredProducts = filteredProducts.filter(product => {
        if (!product.Price) return false;
        
        const min = options.priceRange!.min || 0;
        const max = options.priceRange!.max || Infinity;
        
        return product.Price >= min && product.Price <= max;
      });
    }

    // Limit alkalmazása
    if (options.limit) {
      filteredProducts = filteredProducts.slice(0, options.limit);
    }

    // Kategóriák gyűjtése
    const categories = [...new Set(filteredProducts.map(p => p.Category).filter(Boolean))]
      .map(categoryName => ({
        Id: '', // Nincs ID, csak név alapján
        Name: categoryName!,
        Description: '',
        Products: filteredProducts.filter(p => p.Category === categoryName)
      }));

    return {
      products: filteredProducts,
      categories,
      totalCount: filteredProducts.length,
      searchQuery: options.query || ''
    };
  }

  /**
   * Cache kulcs generálása
   */
  private generateCacheKey(type: string, options: any): string {
    return `${type}_${JSON.stringify(options)}`;
  }

  /**
   * Cache-ből lekérés
   */
  private getFromCache<T>(cache: Map<string, { data: T; timestamp: Date }>, key: string): T | null {
    const cached = cache.get(key);
    if (!cached) return null;

    // Lejárt-e a cache?
    if (new Date().getTime() - cached.timestamp.getTime() > this.cacheExpiry) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache-be mentés
   */
  private setCache<T>(cache: Map<string, { data: T; timestamp: Date }>, key: string, data: T): void {
    cache.set(key, {
      data,
      timestamp: new Date()
    });
  }

  /**
   * Cache tisztítása
   */
  clearCache(): void {
    this.productCache.clear();
    this.categoryCache.clear();
    console.log('🧹 Cache tisztítva');
  }

  /**
   * Cache statisztikák
   */
  getCacheStats(): {
    productCacheSize: number;
    categoryCacheSize: number;
    cacheExpiryMinutes: number;
  } {
    return {
      productCacheSize: this.productCache.size,
      categoryCacheSize: this.categoryCache.size,
      cacheExpiryMinutes: this.cacheExpiry / (60 * 1000)
    };
  }

  /**
   * API kapcsolat tesztelése
   */
  async testConnection(): Promise<{success: boolean; message: string; data?: any}> {
    try {
      console.log('🔍 Unas API kapcsolat tesztelése...');
      
      // API kliens tesztelése
      const apiTest = await this.apiClient.testConnection();
      if (!apiTest.success) {
        return apiTest;
      }

      // Néhány termék lekérése
      const testProducts = await this.searchProducts({ limit: 3 });
      
      // Kategóriák lekérése
      const testCategories = await this.getCategories(5);

      return {
        success: true,
        message: `✅ UnasProductService működik! ${testProducts.totalCount} termék, ${testCategories.length} kategória`,
        data: {
          ...apiTest.data,
          sampleProducts: testProducts.products,
          sampleCategories: testCategories,
          cacheStats: this.getCacheStats()
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `❌ UnasProductService hiba: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Singleton instance exportálása
let unasProductService: UnasProductService | null = null;

export function getUnasProductService(apiClient?: UnasApiClient): UnasProductService {
  if (!unasProductService && apiClient) {
    unasProductService = new UnasProductService(apiClient);
  }
  
  if (!unasProductService) {
    throw new Error('UnasProductService not initialized. Provide UnasApiClient on first call.');
  }
  
  return unasProductService;
}

export default UnasProductService; 
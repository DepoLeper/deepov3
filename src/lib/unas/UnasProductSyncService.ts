import { PrismaClient, UnasProduct, Prisma } from '@prisma/client';
import { UnasApiClient, UnasProductFull } from './UnasApiClient';

export interface SyncResult {
  success: boolean;
  productId?: string;
  action?: 'created' | 'updated' | 'skipped';
  error?: string;
  details?: any;
}

export interface BulkSyncResult {
  totalProducts: number;
  successCount: number;
  errorCount: number;
  results: SyncResult[];
  syncLogId?: string;
}

export class UnasProductSyncService {
  private prisma: PrismaClient;
  private apiClient: UnasApiClient;

  constructor(apiClient: UnasApiClient, prisma?: PrismaClient) {
    this.apiClient = apiClient;
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Egy termék mentése vagy frissítése az adatbázisban
   */
  async saveProduct(product: UnasProductFull): Promise<SyncResult> {
    try {
      // Ellenőrizzük, hogy létezik-e már a termék
      const existingProduct = await this.prisma.unasProduct.findUnique({
        where: { id: product.id }
      });

      // Előkészítjük az adatokat
      const productData: Prisma.UnasProductCreateInput = {
        id: product.id,
        sku: product.sku,
        name: product.name,
        unit: product.unit || 'db',
        priceNet: product.priceNet,
        priceGross: product.priceGross,
        state: product.state,
        createTime: product.createTime,
        lastModTime: product.lastModTime,
        
        // Készlet
        stock: product.stock,
        stockStatus: product.stockStatus,
        minimumQty: product.minimumQty,
        
        // Kategória
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        allCategories: product.allCategories ? JSON.parse(JSON.stringify(product.allCategories)) : null,
        
        // Leírások
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        
        // SEO
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        seoKeywords: product.seoKeywords,
        url: product.url,
        sefUrl: product.sefUrl,
        
        // Képek
        imageUrl: product.imageUrl,
        imageSefUrl: product.imageSefUrl,
        imageAlt: product.imageAlt,
        
        // Egyéb
        weight: product.weight,
        parameters: product.parameters ? JSON.parse(JSON.stringify(product.parameters)) : null,
        specialPrices: product.specialPrices ? JSON.parse(JSON.stringify(product.specialPrices)) : null,
        salePrice: product.salePrice ? JSON.parse(JSON.stringify(product.salePrice)) : null,
        groupSalePrices: product.groupSalePrices ? JSON.parse(JSON.stringify(product.groupSalePrices)) : null,
      };

      let action: 'created' | 'updated' | 'skipped';
      
      if (existingProduct) {
        // Ellenőrizzük, hogy változott-e a termék
        if (existingProduct.lastModTime === product.lastModTime) {
          console.log(`⏭️ Termék ${product.id} nem változott, kihagyás`);
          return {
            success: true,
            productId: product.id,
            action: 'skipped'
          };
        }

        // Frissítjük a terméket
        await this.prisma.unasProduct.update({
          where: { id: product.id },
          data: productData
        });
        action = 'updated';
        console.log(`✅ Termék frissítve: ${product.id} - ${product.name}`);
      } else {
        // Új termék létrehozása
        await this.prisma.unasProduct.create({
          data: productData
        });
        action = 'created';
        console.log(`✅ Új termék mentve: ${product.id} - ${product.name}`);
      }

      return {
        success: true,
        productId: product.id,
        action,
        details: {
          name: product.name,
          sku: product.sku,
          priceGross: product.priceGross
        }
      };

    } catch (error: any) {
      console.error(`❌ Hiba a termék mentése során (${product.id}):`, error);
      return {
        success: false,
        productId: product.id,
        error: error.message
      };
    }
  }

  /**
   * Egy termék szinkronizálása ID alapján
   */
  async syncSingleProduct(productId: string): Promise<SyncResult> {
    try {
      console.log(`🔄 Termék szinkronizálása: ${productId}`);
      
      // Bejelentkezés az API-ba
      await this.apiClient.ensureValidToken();
      
      // Termék lekérése
      const product = await this.apiClient.getProductFull(productId);
      if (!product) {
        return {
          success: false,
          productId,
          error: 'Termék nem található'
        };
      }

      // Termék mentése
      return await this.saveProduct(product);

    } catch (error: any) {
      console.error(`❌ Szinkronizálási hiba (${productId}):`, error);
      return {
        success: false,
        productId,
        error: error.message
      };
    }
  }

  /**
   * Több termék szinkronizálása
   */
  async syncMultipleProducts(productIds: string[]): Promise<BulkSyncResult> {
    console.log(`🔄 ${productIds.length} termék szinkronizálása...`);
    
    // Szinkronizációs log létrehozása
    const syncLog = await this.prisma.unasSyncLog.create({
      data: {
        syncType: 'incremental',
        status: 'started',
        productCount: productIds.length
      }
    });

    const results: SyncResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      // Bejelentkezés
      await this.apiClient.ensureValidToken();

      // Termékek egyenkénti szinkronizálása
      for (const productId of productIds) {
        const result = await this.syncSingleProduct(productId);
        results.push(result);
        
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }

        // Kis szünet a rate limiting miatt
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Szinkronizációs log frissítése
      await this.prisma.unasSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'completed',
          successCount,
          errorCount,
          completedAt: new Date(),
          errorMessages: errorCount > 0 ? 
            results.filter(r => !r.success).map(r => ({ productId: r.productId, error: r.error })) : 
            null
        }
      });

      console.log(`✅ Szinkronizálás kész: ${successCount} sikeres, ${errorCount} hiba`);

    } catch (error: any) {
      // Hiba esetén a log frissítése
      await this.prisma.unasSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          errorCount: productIds.length,
          completedAt: new Date(),
          errorMessages: [{ error: error.message }]
        }
      });
      
      console.error('❌ Tömeges szinkronizálási hiba:', error);
    }

    return {
      totalProducts: productIds.length,
      successCount,
      errorCount,
      results,
      syncLogId: syncLog.id
    };
  }

  /**
   * Termék lekérése az adatbázisból
   */
  async getProductFromDb(productId: string): Promise<UnasProduct | null> {
    return await this.prisma.unasProduct.findUnique({
      where: { id: productId }
    });
  }

  /**
   * Termékek keresése az adatbázisban
   */
  async searchProducts(query: {
    name?: string;
    sku?: string;
    categoryId?: string;
    state?: string;
    limit?: number;
  }): Promise<UnasProduct[]> {
    const where: Prisma.UnasProductWhereInput = {};

    if (query.name) {
      where.name = { contains: query.name };
    }
    if (query.sku) {
      where.sku = { contains: query.sku };
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.state) {
      where.state = query.state;
    }

    return await this.prisma.unasProduct.findMany({
      where,
      take: query.limit || 50,
      orderBy: { lastModTime: 'desc' }
    });
  }

  /**
   * Szinkronizációs statisztikák
   */
  async getSyncStats(): Promise<{
    totalProducts: number;
    liveProducts: number;
    lastSync: Date | null;
    recentSyncs: any[];
  }> {
    const totalProducts = await this.prisma.unasProduct.count();
    const liveProducts = await this.prisma.unasProduct.count({
      where: { state: 'live' }
    });

    const lastProduct = await this.prisma.unasProduct.findFirst({
      orderBy: { syncedAt: 'desc' },
      select: { syncedAt: true }
    });

    const recentSyncs = await this.prisma.unasSyncLog.findMany({
      take: 5,
      orderBy: { startedAt: 'desc' }
    });

    return {
      totalProducts,
      liveProducts,
      lastSync: lastProduct?.syncedAt || null,
      recentSyncs
    };
  }
} 
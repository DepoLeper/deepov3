import { PrismaClient, UnasProduct } from '@prisma/client';
import { UnasApiClient, UnasProductBasic, UnasProductFull } from './UnasApiClient';
import { UnasProductSyncService, SyncResult, BulkSyncResult } from './UnasProductSyncService';

export interface IncrementalSyncResult {
  checked: number;
  changed: number;
  synced: number;
  errors: number;
  duration: number;
  details: {
    checkedProducts: string[];
    changedProducts: string[];
    syncResults: SyncResult[];
    errors: { productId: string; error: string }[];
  };
}

export interface IncrementalSyncConfig {
  // Maximum termékek száma egy batch-ben
  batchSize: number;
  // Minimális ellenőrzési időköz (percek)
  minCheckInterval: number;
  // Maximum API hívások száma
  maxApiCalls: number;
  // Log szint
  logLevel: 'info' | 'debug' | 'error';
  
  // Smart Discovery beállítások
  enableDiscovery?: boolean;         // Új termék keresés engedélyezése
  discoveryFrequency?: number;       // Minden N. futásnál discovery (alapértelmezett: 5)
  discoveryBatchSize?: number;       // Hány új terméket keresünk (alapértelmezett: 30)
  discoveryFromLatest?: boolean;     // Legfrissebb termékeket keresse-e (alapértelmezett: true)
}

export class IncrementalSyncService {
  private prisma: PrismaClient;
  private apiClient: UnasApiClient;
  private syncService: UnasProductSyncService;
  private config: IncrementalSyncConfig;
  
  // Discovery counter - hányszor futott már
  private syncRunCounter: number = 0;

  constructor(
    apiClient: UnasApiClient,
    config: Partial<IncrementalSyncConfig> = {},
    prisma?: PrismaClient
  ) {
    this.apiClient = apiClient;
    this.prisma = prisma || new PrismaClient();
    this.syncService = new UnasProductSyncService(apiClient, this.prisma);
    
    // Default konfiguráció
    this.config = {
      batchSize: 20,
      minCheckInterval: 30, // 30 perc
      maxApiCalls: 100,
      logLevel: 'info',
      
      // Smart Discovery defaults
      enableDiscovery: true,          // Discovery alapból engedélyezve
      discoveryFrequency: 5,          // Minden 5. futásnál
      discoveryBatchSize: 30,         // 30 legfrissebb termék ellenőrzése
      discoveryFromLatest: true,      // Legfrissebb termékeket keresse
      
      ...config
    };
    
    this.log('info', `IncrementalSyncService inicializálva (batch: ${this.config.batchSize})`);
  }

  /**
   * Inkrementális szinkronizáció végrehajtása
   */
  async performIncrementalSync(): Promise<IncrementalSyncResult> {
    const startTime = Date.now();
    this.syncRunCounter++; // Counter növelése
    
    const result: IncrementalSyncResult = {
      checked: 0,
      changed: 0,
      synced: 0,
      errors: 0,
      duration: 0,
      details: {
        checkedProducts: [],
        changedProducts: [],
        syncResults: [],
        errors: []
      }
    };

    try {
      this.log('info', `Inkrementális szinkronizáció indítása... (futás #${this.syncRunCounter})`);

      // 1. Smart Discovery ellenőrzése
      const shouldRunDiscovery = this.config.enableDiscovery && 
                                  this.syncRunCounter % (this.config.discoveryFrequency || 5) === 1;
      
      if (shouldRunDiscovery) {
        this.log('info', `🔍 Discovery mód: új termékek keresése (minden ${this.config.discoveryFrequency}. futásnál)`);
        const discoveryResult = await this.performDiscovery();
        
        // Discovery eredményeinek hozzáadása
        result.checked += discoveryResult.checked;
        result.synced += discoveryResult.synced;
        result.errors += discoveryResult.errors;
        result.details.checkedProducts.push(...discoveryResult.details.checkedProducts);
        result.details.syncResults.push(...discoveryResult.details.syncResults);
        result.details.errors.push(...discoveryResult.details.errors);
        
        this.log('info', `Discovery befejezve: ${discoveryResult.checked} ellenőrizve, ${discoveryResult.synced} szinkronizálva`);
      }

      // 2. Adatbázisban lévő termékek lekérése (hagyományos incremental)
      const existingProducts = await this.getExistingProducts();
      this.log('info', `${existingProducts.length} meglévő termék ellenőrzése változásra`);

      if (existingProducts.length === 0) {
        this.log('info', 'Nincs meglévő termék az adatbázisban');
        if (!shouldRunDiscovery) {
          this.log('info', 'Inkrementális szinkronizáció kihagyása (nincs termék és nincs discovery)');
          result.duration = Date.now() - startTime;
          return result;
        }
      }

      // 3. Hagyományos incremental: meglévő termékek batch-wise ellenőrzése
      if (existingProducts.length > 0) {
        const batches = this.createBatches(existingProducts, this.config.batchSize);
        this.log('info', `${batches.length} batch lesz feldolgozva (${this.config.batchSize} termék/batch)`);

        let apiCallCount = 0;
      
      for (let i = 0; i < batches.length; i++) {
        if (apiCallCount >= this.config.maxApiCalls) {
          this.log('info', `API hívás limit elérve (${this.config.maxApiCalls}), megszakítás`);
          break;
        }

        const batch = batches[i];
        this.log('debug', `Batch ${i + 1}/${batches.length} feldolgozása (${batch.length} termék)`);

        // 3. Batch ellenőrzése
        const batchResult = await this.checkBatchForChanges(batch);
        apiCallCount += batchResult.apiCalls;

        // 4. Eredmények összesítése
        result.checked += batchResult.checked;
        result.changed += batchResult.changed;
        result.details.checkedProducts.push(...batchResult.checkedProducts);
        result.details.changedProducts.push(...batchResult.changedProducts);
        result.details.errors.push(...batchResult.errors);

        // 5. Változott termékek szinkronizálása
        for (const productId of batchResult.changedProducts) {
          if (apiCallCount >= this.config.maxApiCalls) break;
          
          try {
            this.log('info', `Változott termék szinkronizálása: ${productId}`);
            const syncResult = await this.syncService.syncSingleProduct(productId);
            result.details.syncResults.push(syncResult);
            
            if (syncResult.success && syncResult.action !== 'skipped') {
              result.synced++;
            }
            apiCallCount++;
            
          } catch (error) {
            result.errors++;
            result.details.errors.push({
              productId,
              error: error instanceof Error ? error.message : 'Ismeretlen hiba'
            });
            this.log('error', `Hiba a termék szinkronizálásakor (${productId}): ${error}`);
          }
        }

        // Kis szünet a batch-ek között (rate limiting)
        if (i < batches.length - 1) {
          await this.sleep(500); // 500ms
        }
      }
      } // Existing products if statement lezárása

      result.duration = Date.now() - startTime;
      this.log('info', `Inkrementális szinkronizáció befejezve: ${result.checked} ellenőrizve, ${result.changed} változott, ${result.synced} szinkronizálva, ${result.errors} hiba (${result.duration}ms)`);

      return result;

    } catch (error) {
      result.duration = Date.now() - startTime;
      result.errors++;
      result.details.errors.push({
        productId: 'GLOBAL',
        error: error instanceof Error ? error.message : 'Ismeretlen globális hiba'
      });
      
      this.log('error', `Inkrementális szinkronizáció hiba: ${error}`);
      return result;
    }
  }

  /**
   * Adatbázisban lévő termékek lekérése
   */
  private async getExistingProducts(): Promise<Pick<UnasProduct, 'id' | 'lastModTime' | 'syncedAt'>[]> {
    return await this.prisma.unasProduct.findMany({
      select: {
        id: true,
        lastModTime: true,
        syncedAt: true
      },
      where: {
        state: 'live' // Csak aktív termékek
      },
      orderBy: {
        syncedAt: 'asc' // Legrégebben szinkronizáltak előre
      }
    });
  }

  /**
   * Termékek batch-ekre osztása
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Egy batch termék ellenőrzése változásokra
   */
  private async checkBatchForChanges(batch: Pick<UnasProduct, 'id' | 'lastModTime' | 'syncedAt'>[]): Promise<{
    checked: number;
    changed: number;
    changedProducts: string[];
    checkedProducts: string[];
    errors: { productId: string; error: string }[];
    apiCalls: number;
  }> {
    const result = {
      checked: 0,
      changed: 0,
      changedProducts: [] as string[],
      checkedProducts: [] as string[],
      errors: [] as { productId: string; error: string }[],
      apiCalls: 0
    };

    try {
      // Batch termékek lekérése minimális adatokkal
      this.log('debug', `Batch ellenőrzés: ${batch.map(p => p.id).join(', ')}`);
      
      for (const localProduct of batch) {
        try {
          // API termék lekérése minimális adatokkal
          const apiProduct = await this.apiClient.getProduct(localProduct.id) as UnasProductBasic;
          result.apiCalls++;
          result.checked++;
          result.checkedProducts.push(localProduct.id);

          if (Array.isArray(apiProduct)) {
            // Ha lista jött vissza, keressük meg a konkrét terméket
            const found = apiProduct.find(p => p.id === localProduct.id);
            if (!found) {
              this.log('debug', `Termék nem található az API-ban: ${localProduct.id}`);
              continue;
            }
            
            if (this.hasProductChanged(localProduct, found)) {
              result.changed++;
              result.changedProducts.push(localProduct.id);
              this.log('info', `Változás detektálva: ${localProduct.id}`);
            }
          } else {
            // Egyedi termék válasz
            if (this.hasProductChanged(localProduct, apiProduct)) {
              result.changed++;
              result.changedProducts.push(localProduct.id);
              this.log('info', `Változás detektálva: ${localProduct.id}`);
            }
          }

        } catch (error) {
          result.errors.push({
            productId: localProduct.id,
            error: error instanceof Error ? error.message : 'Ellenőrzési hiba'
          });
          this.log('error', `Hiba a termék ellenőrzésekor (${localProduct.id}): ${error}`);
        }

        // Rate limiting - kis szünet minden termék után
        await this.sleep(100); // 100ms
      }

    } catch (error) {
      this.log('error', `Batch ellenőrzési hiba: ${error}`);
    }

    return result;
  }

  /**
   * Termék változás detektálás
   */
  private hasProductChanged(
    localProduct: Pick<UnasProduct, 'id' | 'lastModTime' | 'syncedAt'>,
    apiProduct: UnasProductBasic
  ): boolean {
    // 1. lastModTime összehasonlítás
    if (localProduct.lastModTime && apiProduct.lastModTime) {
      const localTime = new Date(localProduct.lastModTime);
      const apiTime = new Date(apiProduct.lastModTime);
      
      if (apiTime > localTime) {
        this.log('debug', `lastModTime változás: ${localProduct.id} (local: ${localTime.toISOString()}, api: ${apiTime.toISOString()})`);
        return true;
      }
    }

    // 2. Ha régen volt szinkronizálva (fallback)
    if (localProduct.syncedAt) {
      const syncTime = new Date(localProduct.syncedAt);
      const thresholdTime = new Date(Date.now() - (this.config.minCheckInterval * 60 * 1000));
      
      if (syncTime < thresholdTime) {
        this.log('debug', `Régi szinkronizáció: ${localProduct.id} (utolsó: ${syncTime.toISOString()})`);
        return true;
      }
    }

    return false;
  }

  /**
   * Delay utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Discovery - új termékek keresése az API-ban
   */
  private async performDiscovery(): Promise<IncrementalSyncResult> {
    const discoveryResult: IncrementalSyncResult = {
      checked: 0,
      changed: 0,
      synced: 0,
      errors: 0,
      duration: 0,
      details: {
        checkedProducts: [],
        changedProducts: [],
        syncResults: [],
        errors: []
      }
    };

    try {
      const discoveryStartTime = Date.now();
      const batchSize = this.config.discoveryBatchSize || 30;
      
      this.log('info', `🔍 Discovery: ${batchSize} legfrissebb termék lekérése az API-ból...`);

      // Termékek lekérése az API-ból (legfrissebb termékek)
      const apiProducts = await this.apiClient.getProductList(batchSize);
      discoveryResult.checked = apiProducts.length;
      
      this.log('info', `Discovery: ${apiProducts.length} termék lekérve az API-ból`);

      if (apiProducts.length === 0) {
        this.log('info', 'Discovery: Nincs termék az API válaszban');
        discoveryResult.duration = Date.now() - discoveryStartTime;
        return discoveryResult;
      }

      // Meglévő termékek ellenőrzése adatbázisban
      const existingIds = await this.prisma.unasProduct.findMany({
        select: { id: true },
        where: {
          id: { in: apiProducts.map(p => p.id) }
        }
      });
      
      const existingIdSet = new Set(existingIds.map(p => p.id));

      // Új termékek szűrése
      const newProducts = apiProducts.filter(product => !existingIdSet.has(product.id));
      
      this.log('info', `Discovery: ${newProducts.length} új termék találva, ${existingIds.length} már létezik`);

      // Új termékek szinkronizálása
      if (newProducts.length > 0) {
        for (const product of newProducts) {
          try {
            discoveryResult.details.checkedProducts.push(product.id);
            
            this.log('debug', `🆕 Új termék szinkronizálása: ${product.id}`);
            const syncResult = await this.syncService.syncSingleProduct(product.id);
            
            if (syncResult.success) {
              discoveryResult.synced++;
              discoveryResult.details.syncResults.push(syncResult);
              this.log('info', `✅ Új termék mentve: ${product.id} - ${syncResult.product?.name || 'Ismeretlen'}`);
            } else {
              discoveryResult.errors++;
              discoveryResult.details.errors.push({
                productId: product.id,
                error: syncResult.error || 'Ismeretlen hiba'
              });
              this.log('error', `❌ Discovery sync hiba: ${product.id} - ${syncResult.error}`);
            }
          } catch (error) {
            discoveryResult.errors++;
            discoveryResult.details.errors.push({
              productId: product.id,
              error: error.message
            });
            this.log('error', `❌ Discovery exception: ${product.id} - ${error.message}`);
          }
        }
      }

      discoveryResult.duration = Date.now() - discoveryStartTime;
      return discoveryResult;

    } catch (error) {
      this.log('error', `Discovery hiba: ${error.message}`);
      discoveryResult.errors++;
      discoveryResult.details.errors.push({
        productId: 'discovery',
        error: error.message
      });
      return discoveryResult;
    }
  }

  /**
   * Logolás
   */
  private log(level: 'info' | 'debug' | 'error', message: string): void {
    if (this.config.logLevel === 'debug' || 
        (this.config.logLevel === 'info' && level !== 'debug') ||
        level === 'error') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [IncrementalSync] [${level.toUpperCase()}] ${message}`);
    }
  }
}

// Default konfiguráció
export const DEFAULT_INCREMENTAL_CONFIG: IncrementalSyncConfig = {
  batchSize: 10,
  minCheckInterval: 30, // 30 perc
  maxApiCalls: 50,
  logLevel: 'info'
};
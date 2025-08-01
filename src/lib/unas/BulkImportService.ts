import { PrismaClient } from '@prisma/client';
import { UnasApiClient, UnasProductBasic, UnasProductFull } from './UnasApiClient';
import { UnasProductSyncService, SyncResult } from './UnasProductSyncService';

export interface BulkImportConfig {
  // Termékek száma egy batch-ben (API hívás)
  batchSize: number;
  // Delay a batch-ek között (ms) - rate limiting
  delayBetweenBatches: number;
  // Maximum termékek száma (0 = összes)
  maxProducts: number;
  // Log szint
  logLevel: 'info' | 'debug' | 'error';
  // Csak aktív termékek importálása
  onlyActiveProducts: boolean;
}

export interface BulkImportProgress {
  // Állapot
  status: 'running' | 'completed' | 'error' | 'paused';
  // Haladás
  totalFetched: number;
  totalProcessed: number;
  totalSynced: number;
  totalErrors: number;
  // Időbélyegek
  startTime: Date;
  lastUpdate: Date;
  estimatedEndTime: Date | null;
  // Részletek
  currentBatch: number;
  totalBatches: number;
  currentPhase: 'fetching' | 'processing' | 'syncing' | 'completed';
  // Hibák
  errors: { productId?: string; error: string; timestamp: Date }[];
  // Teljesítmény
  averageBatchTime: number;
  productsPerSecond: number;
}

export interface BulkImportResult {
  success: boolean;
  totalFetched: number;
  totalSynced: number;
  totalErrors: number;
  duration: number;
  errors: { productId?: string; error: string }[];
  stats: {
    created: number;
    updated: number;
    skipped: number;
  };
}

export class BulkImportService {
  private prisma: PrismaClient;
  private apiClient: UnasApiClient;
  private syncService: UnasProductSyncService;
  private config: BulkImportConfig;
  private progress: BulkImportProgress;
  private isRunning: boolean = false;
  private shouldPause: boolean = false;
  private shouldStop: boolean = false;
  private isEndOfProducts: boolean = false;

  constructor(
    apiClient: UnasApiClient,
    config: Partial<BulkImportConfig> = {},
    prisma?: PrismaClient
  ) {
    this.apiClient = apiClient;
    this.prisma = prisma || new PrismaClient();
    this.syncService = new UnasProductSyncService(apiClient, this.prisma);
    
    // Default konfiguráció
    this.config = {
      batchSize: 20,
      delayBetweenBatches: 1000, // 1 másodperc
      maxProducts: 0, // 0 = összes
      logLevel: 'info',
      onlyActiveProducts: true,
      ...config
    };
    
    // Progress inicializálása
    this.resetProgress();
    
    this.log('info', `BulkImportService inicializálva (batch: ${this.config.batchSize}, delay: ${this.config.delayBetweenBatches}ms)`);
  }

  /**
   * Tömeges import végrehajtása
   */
  async performBulkImport(): Promise<BulkImportResult> {
    if (this.isRunning) {
      throw new Error('Bulk import már fut');
    }

    this.isRunning = true;
    this.shouldPause = false;
    this.shouldStop = false;
    this.resetProgress();
    
    const startTime = Date.now();
    const result: BulkImportResult = {
      success: false,
      totalFetched: 0,
      totalSynced: 0,
      totalErrors: 0,
      duration: 0,
      errors: [],
      stats: { created: 0, updated: 0, skipped: 0 }
    };

    try {
      this.log('info', 'Tömeges termék import indítása...');
      this.progress.status = 'running';
      this.progress.currentPhase = 'fetching';

      // 1. Összes termék lekérése
      const allProducts = await this.fetchAllProducts();
      result.totalFetched = allProducts.length;
      this.progress.totalFetched = allProducts.length;

      if (allProducts.length === 0) {
        this.log('info', 'Nincs lekérhető termék');
        result.success = true;
        result.duration = Date.now() - startTime;
        this.progress.status = 'completed';
        this.isRunning = false;
        return result;
      }

      // 2. Termékek szinkronizálása
      this.progress.currentPhase = 'syncing';
      const syncResults = await this.syncAllProducts(allProducts);

      // 3. Eredmények összesítése
      for (const syncResult of syncResults) {
        if (syncResult.success) {
          result.totalSynced++;
          switch (syncResult.action) {
            case 'created':
              result.stats.created++;
              break;
            case 'updated':
              result.stats.updated++;
              break;
            case 'skipped':
              result.stats.skipped++;
              break;
          }
        } else {
          result.totalErrors++;
          result.errors.push({
            productId: syncResult.productId,
            error: syncResult.error || 'Ismeretlen hiba'
          });
        }
      }

      result.success = true;
      result.duration = Date.now() - startTime;
      this.progress.status = 'completed';
      this.progress.currentPhase = 'completed';

      this.log('info', `Tömeges import befejezve: ${result.totalFetched} lekérve, ${result.totalSynced} szinkronizálva, ${result.totalErrors} hiba (${result.duration}ms)`);

    } catch (error) {
      result.success = false;
      result.duration = Date.now() - startTime;
      result.errors.push({
        error: error instanceof Error ? error.message : 'Ismeretlen globális hiba'
      });
      
      this.progress.status = 'error';
      this.log('error', `Tömeges import hiba: ${error}`);
    } finally {
      this.isRunning = false;
    }

    return result;
  }

  /**
   * Összes termék lekérése az API-ból
   */
  private async fetchAllProducts(): Promise<UnasProductBasic[]> {
    const allProducts: UnasProductBasic[] = [];
    const seenProductIds = new Set<string>(); // Duplikátum szűrés
    let currentOffset = 0;
    let hasMoreProducts = true;
    let batchCount = 0;

    this.log('info', 'Termékek lekérése az Unas API-ból...');

    while (hasMoreProducts && !this.shouldStop) {
      if (this.shouldPause) {
        this.log('info', 'Import szüneteltetése...');
        await this.waitForResume();
      }

      try {
        batchCount++;
        this.progress.currentBatch = batchCount;
        
        this.log('debug', `Batch ${batchCount} lekérése (offset: ${currentOffset}, limit: ${this.config.batchSize})`);

        // API hívás - lista lekérés
        const batchStartTime = Date.now();
        const products = await this.fetchProductBatch(currentOffset);
        const batchDuration = Date.now() - batchStartTime;

        if (Array.isArray(products) && products.length > 0) {
          // Duplikátumok szűrése
          const uniqueProducts = products.filter(product => {
            if (seenProductIds.has(product.id)) {
              this.log('debug', `Duplikátum kiszűrve: ${product.id}`);
              return false;
            }
            seenProductIds.add(product.id);
            return true;
          });

          allProducts.push(...uniqueProducts);
          currentOffset += products.length;
          
          // Progress frissítése
          this.progress.totalFetched = allProducts.length;
          this.progress.lastUpdate = new Date();
          this.updateBatchStats(batchDuration);

          this.log('info', `Batch ${batchCount}: ${products.length} termék lekérve, ${uniqueProducts.length} egyedi (összesen: ${allProducts.length})`);

          // Ha egyedi termékek száma 0, akkor vége (minden duplikátum)
          if (uniqueProducts.length === 0) {
            hasMoreProducts = false;
            this.log('info', 'Csak duplikátumok jöttek vissza, termék lekérés befejezése');
          }
          
          // Ha kevesebb termék jött vissza, mint a batch méret, vége
          if (products.length < this.config.batchSize) {
            hasMoreProducts = false;
          }

          // Max products limit ellenőrzése
          if (this.config.maxProducts > 0 && allProducts.length >= this.config.maxProducts) {
            hasMoreProducts = false;
            this.log('info', `Max termék limit elérve: ${this.config.maxProducts}`);
          }

        } else {
          hasMoreProducts = false;
          this.log('info', 'Nincs több termék');
        }

        // Rate limiting - delay a batch-ek között
        if (hasMoreProducts && this.config.delayBetweenBatches > 0) {
          this.log('debug', `Várakozás ${this.config.delayBetweenBatches}ms...`);
          await this.sleep(this.config.delayBetweenBatches);
        }

      } catch (error) {
        this.log('error', `Hiba a batch ${batchCount} lekérésekor: ${error}`);
        this.progress.errors.push({
          error: `Batch ${batchCount} lekérési hiba: ${error}`,
          timestamp: new Date()
        });
        
        // Egy hibás batch után is folytatjuk
        currentOffset += this.config.batchSize;
        
        // Ha túl sok hiba van, leállunk
        if (this.progress.errors.length >= 5) {
          this.log('error', 'Túl sok hiba, leállás');
          break;
        }
      }
    }

    this.log('info', `Összes termék lekérve: ${allProducts.length} termék`);
    return allProducts;
  }

  /**
   * Egy batch termék lekérése
   */
  private async fetchProductBatch(offset: number): Promise<UnasProductBasic[]> {
    try {
      // Ha már elértük a végét, stop
      if (offset > 0 && this.isEndOfProducts) {
        this.log('debug', `Termékek vége elérve (offset: ${offset})`);
        return [];
      }

      this.log('debug', `API hívás indítása - offset: ${offset}, batchSize: ${this.config.batchSize}`);
      
      // getProductList használata nagyobb limit-tel
      const limitForThisCall = this.config.batchSize;
      const result = await this.apiClient.getProductList(limitForThisCall);
      
      this.log('debug', `API válasz: ${result.length} termék`);
      
      // Lista esetén szűrés
      let filteredProducts = result;
      
      if (this.config.onlyActiveProducts) {
        const originalCount = filteredProducts.length;
        filteredProducts = result.filter(p => p.state === 'live');
        this.log('debug', `Aktív termékek szűrése: ${originalCount} -> ${filteredProducts.length}`);
      }
      
      // Ha ez az első batch és nincs termék, nincs elérhető adat
      if (offset === 0 && filteredProducts.length === 0) {
        this.log('info', 'Nincs elérhető termék az API-ban');
        return [];
      }
      
      // Ha kevesebb jött vissza, mint a kért batch size, elértük a végét
      if (result.length < this.config.batchSize) {
        this.isEndOfProducts = true;
        this.log('debug', `Termékek vége elérve (kapott: ${result.length}, kért: ${this.config.batchSize})`);
      }
      
      this.log('debug', `Visszaadott termékek: ${filteredProducts.length}`);
      return filteredProducts;
      
    } catch (error) {
      this.log('error', `API hívás hiba (offset: ${offset}): ${error}`);
      throw error;
    }
  }

  /**
   * Összes termék szinkronizálása
   */
  private async syncAllProducts(products: UnasProductBasic[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    this.log('info', `${products.length} termék szinkronizálása...`);
    
    for (let i = 0; i < products.length; i++) {
      if (this.shouldStop) {
        this.log('info', 'Import leállítása...');
        break;
      }

      if (this.shouldPause) {
        this.log('info', 'Import szüneteltetése...');
        await this.waitForResume();
      }

      const product = products[i];
      
      try {
        this.log('debug', `Termék szinkronizálása (${i + 1}/${products.length}): ${product.id}`);
        
        const syncResult = await this.syncService.syncSingleProduct(product.id);
        results.push(syncResult);
        
        // Progress frissítése
        this.progress.totalProcessed = i + 1;
        this.progress.lastUpdate = new Date();
        
        if (syncResult.success) {
          this.progress.totalSynced++;
        } else {
          this.progress.totalErrors++;
          this.progress.errors.push({
            productId: product.id,
            error: syncResult.error || 'Szinkronizálási hiba',
            timestamp: new Date()
          });
        }

        // Rate limiting - kis delay termékek között
        if (i < products.length - 1) {
          await this.sleep(100); // 100ms
        }

      } catch (error) {
        this.progress.totalErrors++;
        this.progress.errors.push({
          productId: product.id,
          error: error instanceof Error ? error.message : 'Ismeretlen hiba',
          timestamp: new Date()
        });

        results.push({
          success: false,
          productId: product.id,
          error: error instanceof Error ? error.message : 'Ismeretlen hiba'
        });

        this.log('error', `Termék szinkronizálási hiba (${product.id}): ${error}`);
      }
    }

    return results;
  }

  /**
   * Progress állapot lekérése
   */
  getProgress(): BulkImportProgress {
    return { ...this.progress };
  }

  /**
   * Import szüneteltetése
   */
  pause(): void {
    if (this.isRunning) {
      this.shouldPause = true;
      this.progress.status = 'paused';
      this.log('info', 'Import szüneteltetése kérve');
    }
  }

  /**
   * Import folytatása
   */
  resume(): void {
    if (this.shouldPause) {
      this.shouldPause = false;
      this.progress.status = 'running';
      this.log('info', 'Import folytatása');
    }
  }

  /**
   * Import leállítása
   */
  stop(): void {
    if (this.isRunning) {
      this.shouldStop = true;
      this.log('info', 'Import leállítása kérve');
    }
  }

  /**
   * Futás állapot lekérdezése
   */
  isImportRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Progress reset
   */
  private resetProgress(): void {
    this.isEndOfProducts = false;
    this.progress = {
      status: 'running',
      totalFetched: 0,
      totalProcessed: 0,
      totalSynced: 0,
      totalErrors: 0,
      startTime: new Date(),
      lastUpdate: new Date(),
      estimatedEndTime: null,
      currentBatch: 0,
      totalBatches: 0,
      currentPhase: 'fetching',
      errors: [],
      averageBatchTime: 0,
      productsPerSecond: 0
    };
  }

  /**
   * Batch statisztikák frissítése
   */
  private updateBatchStats(batchDuration: number): void {
    // Átlagos batch idő
    if (this.progress.currentBatch === 1) {
      this.progress.averageBatchTime = batchDuration;
    } else {
      this.progress.averageBatchTime = (this.progress.averageBatchTime + batchDuration) / 2;
    }

    // Termékek per másodperc
    const totalDuration = Date.now() - this.progress.startTime.getTime();
    this.progress.productsPerSecond = (this.progress.totalFetched / totalDuration) * 1000;

    // Becsült befejezési idő (ha van elég adat)
    if (this.progress.currentBatch >= 3 && this.config.maxProducts > 0) {
      const remainingProducts = this.config.maxProducts - this.progress.totalFetched;
      const estimatedRemainingTime = (remainingProducts / this.progress.productsPerSecond) * 1000;
      this.progress.estimatedEndTime = new Date(Date.now() + estimatedRemainingTime);
    }
  }

  /**
   * Szünet várakozás
   */
  private async waitForResume(): Promise<void> {
    while (this.shouldPause && !this.shouldStop) {
      await this.sleep(1000);
    }
  }

  /**
   * Delay utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Logolás
   */
  private log(level: 'info' | 'debug' | 'error', message: string): void {
    if (this.config.logLevel === 'debug' || 
        (this.config.logLevel === 'info' && level !== 'debug') ||
        level === 'error') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [BulkImport] [${level.toUpperCase()}] ${message}`);
    }
  }
}

// Default konfiguráció
export const DEFAULT_BULK_CONFIG: BulkImportConfig = {
  batchSize: 20,
  delayBetweenBatches: 1000, // 1 másodperc
  maxProducts: 100, // Teszt célokra limitáljuk
  logLevel: 'info',
  onlyActiveProducts: true
};
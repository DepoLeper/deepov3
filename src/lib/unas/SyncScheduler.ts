import * as cron from 'node-cron';
import { UnasProductSyncService } from './UnasProductSyncService';
import { UnasApiClient } from './UnasApiClient';
import { IncrementalSyncService, IncrementalSyncResult, DEFAULT_INCREMENTAL_CONFIG } from './IncrementalSyncService';

export interface SyncSchedulerConfig {
  // Cron pattern (default: minden 6 órában)
  cronPattern: string;
  // Enabled/disabled állapot
  enabled: boolean;
  // Logolás szintje
  logLevel: 'info' | 'debug' | 'error';
  // Szinkronizációs mód: 'single' | 'incremental' | 'full'
  syncMode: 'single' | 'incremental' | 'full';
  // Inkrementális konfiguráció
  incrementalConfig: {
    batchSize: number;
    maxApiCalls: number;
  };
}

export interface SyncSchedulerStatus {
  isRunning: boolean;
  nextRun: string | null;
  lastRun: string | null;
  pattern: string;
  enabled: boolean;
  tasksCount: number;
}

export class SyncScheduler {
  private task: cron.ScheduledTask | null = null;
  private config: SyncSchedulerConfig;
  private syncService: UnasProductSyncService;
  private incrementalSyncService: IncrementalSyncService;
  private apiClient: UnasApiClient;
  private lastRunTime: Date | null = null;
  private runCount: number = 0;

  constructor(config: SyncSchedulerConfig) {
    this.config = config;
    
    // UnasApiClient inicializálása
    this.apiClient = new UnasApiClient({
      apiKey: process.env.UNAS_API_KEY || '',
      baseUrl: process.env.UNAS_API_URL || 'https://api.unas.eu/shop'
    });
    
    // SyncService inicializálása az API client-tel
    this.syncService = new UnasProductSyncService(this.apiClient);
    
    // IncrementalSyncService inicializálása
    this.incrementalSyncService = new IncrementalSyncService(this.apiClient, {
      batchSize: config.incrementalConfig.batchSize,
      maxApiCalls: config.incrementalConfig.maxApiCalls,
      logLevel: config.logLevel
    });
    
    this.log('info', `SyncScheduler inicializálva: ${config.cronPattern} (mód: ${config.syncMode})`);
  }

  /**
   * Elindítja az időzített szinkronizációt
   */
  public start(): boolean {
    try {
      if (this.task) {
        this.log('info', 'Cron job már fut, leállítjuk előtte');
        this.stop();
      }

      if (!this.config.enabled) {
        this.log('info', 'SyncScheduler le van tiltva a konfigurációban');
        return false;
      }

      // Validáljuk a cron patternt
      if (!cron.validate(this.config.cronPattern)) {
        throw new Error(`Érvénytelen cron pattern: ${this.config.cronPattern}`);
      }

      this.task = cron.schedule(this.config.cronPattern, () => {
        this.executeSync();
      }, {
        scheduled: false // Ne indítsa el automatikusan
      });

      this.task.start();
      this.log('info', `Cron job elindítva: ${this.config.cronPattern}`);
      return true;

    } catch (error) {
      this.log('error', `Hiba a cron job indításakor: ${error}`);
      return false;
    }
  }

  /**
   * Leállítja az időzített szinkronizációt
   */
  public stop(): boolean {
    try {
      if (this.task) {
        this.task.stop();
        this.task = null;
        this.log('info', 'Cron job leállítva');
        return true;
      } else {
        this.log('info', 'Nincs futó cron job');
        return false;
      }
    } catch (error) {
      this.log('error', `Hiba a cron job leállításakor: ${error}`);
      return false;
    }
  }

  /**
   * Azonnali szinkronizáció végrehajtása (cron job-tól függetlenül)
   */
  public async executeManualSync(): Promise<{ success: boolean; message: string; stats?: any }> {
    try {
      this.log('info', 'Manuális szinkronizáció indítása...');
      const result = await this.performSync();
      return {
        success: true,
        message: 'Manuális szinkronizáció sikeres',
        stats: result
      };
    } catch (error) {
      this.log('error', `Manuális szinkronizáció hiba: ${error}`);
      return {
        success: false,
        message: `Hiba: ${error}`
      };
    }
  }

  /**
   * Scheduler állapotának lekérdezése
   */
  public getStatus(): SyncSchedulerStatus {
    const isRunning = this.task !== null;
    let nextRun: string | null = null;

    if (this.task && isRunning) {
      // node-cron nem ad közvetlen hozzáférést a következő futáshoz
      // Számoljuk ki manuálisan a cron pattern alapján
      try {
        const cronTime = require('cron-parser').parseExpression(this.config.cronPattern);
        nextRun = cronTime.next().toISOString();
      } catch (error) {
        this.log('error', `Hiba a következő futás kiszámításakor: ${error}`);
      }
    }

    return {
      isRunning,
      nextRun,
      lastRun: this.lastRunTime ? this.lastRunTime.toISOString() : null,
      pattern: this.config.cronPattern,
      enabled: this.config.enabled,
      tasksCount: this.runCount
    };
  }

  /**
   * Konfiguráció frissítése
   */
  public updateConfig(newConfig: Partial<SyncSchedulerConfig>): boolean {
    try {
      const oldConfig = { ...this.config };
      this.config = { ...this.config, ...newConfig };
      
      // Ha a pattern vagy az enabled állapot változott, újraindítjuk
      if (oldConfig.cronPattern !== this.config.cronPattern || 
          oldConfig.enabled !== this.config.enabled) {
        if (this.task) {
          this.stop();
          if (this.config.enabled) {
            this.start();
          }
        }
      }

      this.log('info', 'Konfiguráció frissítve');
      return true;
    } catch (error) {
      this.log('error', `Hiba a konfiguráció frissítésekor: ${error}`);
      return false;
    }
  }

  /**
   * Belső metódus: szinkronizáció végrehajtása cron job által
   */
  private async executeSync(): Promise<void> {
    try {
      this.log('info', 'Időzített szinkronizáció indítása...');
      this.lastRunTime = new Date();
      this.runCount++;

      const result = await this.performSync();
      this.log('info', `Szinkronizáció befejezve. Eredmény: ${JSON.stringify(result)}`);

    } catch (error) {
      this.log('error', `Időzített szinkronizáció hiba: ${error}`);
    }
  }

  /**
   * Belső metódus: tényleges szinkronizációs logika
   */
  private async performSync(): Promise<any> {
    this.log('info', `Szinkronizáció indítása (mód: ${this.config.syncMode})`);
    
    switch (this.config.syncMode) {
      case 'incremental':
        return await this.performIncrementalSync();
      
      case 'single':
        return await this.performSingleProductSync();
      
      case 'full':
        return await this.performFullSync();
      
      default:
        this.log('error', `Ismeretlen szinkronizációs mód: ${this.config.syncMode}`);
        throw new Error(`Ismeretlen szinkronizációs mód: ${this.config.syncMode}`);
    }
  }

  /**
   * Inkrementális szinkronizáció végrehajtása
   */
  private async performIncrementalSync(): Promise<any> {
    this.log('info', 'Inkrementális szinkronizáció indítása...');
    
    const incrementalResult = await this.incrementalSyncService.performIncrementalSync();
    const stats = await this.syncService.getSyncStats();
    
    return {
      type: 'incremental',
      result: incrementalResult,
      stats: stats
    };
  }

  /**
   * Egyedi termék szinkronizáció (korábbi alapértelmezett)
   */
  private async performSingleProductSync(): Promise<any> {
    const testProductId = '1303516158';
    
    this.log('debug', `Egyedi termék szinkronizáció: ${testProductId}`);
    const result = await this.syncService.syncSingleProduct(testProductId);
    const stats = await this.syncService.getSyncStats();
    
    return {
      type: 'single',
      product: result,
      stats: stats
    };
  }

  /**
   * Teljes szinkronizáció (placeholder - tömeges import lesz)
   */
  private async performFullSync(): Promise<any> {
    this.log('info', 'Teljes szinkronizáció - még nem implementált');
    
    // TODO: Implementálni a tömeges import funkcióban
    const stats = await this.syncService.getSyncStats();
    
    return {
      type: 'full',
      message: 'Teljes szinkronizáció még nem implementált',
      stats: stats
    };
  }

  /**
   * Logolás
   */
  private log(level: 'info' | 'debug' | 'error', message: string): void {
    if (this.config.logLevel === 'debug' || 
        (this.config.logLevel === 'info' && level !== 'debug') ||
        level === 'error') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [SyncScheduler] [${level.toUpperCase()}] ${message}`);
    }
  }
}

// Default konfiguráció
export const DEFAULT_SYNC_CONFIG: SyncSchedulerConfig = {
  cronPattern: '0 */6 * * *', // Minden 6 órában
  enabled: true,
  logLevel: 'info',
  syncMode: 'incremental', // Alapértelmezetten inkrementális
  incrementalConfig: {
    batchSize: DEFAULT_INCREMENTAL_CONFIG.batchSize,
    maxApiCalls: DEFAULT_INCREMENTAL_CONFIG.maxApiCalls
  }
};
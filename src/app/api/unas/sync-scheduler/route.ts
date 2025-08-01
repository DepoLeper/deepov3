import { NextRequest, NextResponse } from 'next/server';
import { SyncScheduler, DEFAULT_SYNC_CONFIG, SyncSchedulerConfig } from '@/lib/unas/SyncScheduler';

// Globális scheduler instance (singleton pattern)
let globalScheduler: SyncScheduler | null = null;

/**
 * Scheduler instance lekérése vagy létrehozása
 */
function getScheduler(): SyncScheduler {
  if (!globalScheduler) {
    // Environment változókból konfiguráció betöltése
    const config: SyncSchedulerConfig = {
      cronPattern: process.env.UNAS_SYNC_CRON_PATTERN || DEFAULT_SYNC_CONFIG.cronPattern,
      enabled: process.env.UNAS_SYNC_ENABLED !== 'false', // Default: true
      logLevel: (process.env.UNAS_SYNC_LOG_LEVEL as 'info' | 'debug' | 'error') || DEFAULT_SYNC_CONFIG.logLevel
    };

    globalScheduler = new SyncScheduler(config);
    console.log('[SyncScheduler API] Scheduler instance létrehozva:', config);
  }
  return globalScheduler;
}

/**
 * GET - Scheduler állapotának lekérdezése
 */
export async function GET() {
  try {
    const scheduler = getScheduler();
    const status = scheduler.getStatus();
    
    return NextResponse.json({
      success: true,
      status: status,
      message: 'Scheduler állapot sikeresen lekérdezve'
    });

  } catch (error) {
    console.error('[SyncScheduler API] GET hiba:', error);
    return NextResponse.json({
      success: false,
      error: 'Hiba a scheduler állapot lekérdezésekor',
      details: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }, { status: 500 });
  }
}

/**
 * POST - Scheduler műveletek (start, stop, manual-sync, update-config)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    const scheduler = getScheduler();

    switch (action) {
      case 'start':
        const startResult = scheduler.start();
        return NextResponse.json({
          success: startResult,
          message: startResult ? 'Scheduler sikeresen elindítva' : 'Scheduler indítása sikertelen',
          status: scheduler.getStatus()
        });

      case 'stop':
        const stopResult = scheduler.stop();
        return NextResponse.json({
          success: stopResult,
          message: stopResult ? 'Scheduler sikeresen leállítva' : 'Scheduler leállítása sikertelen',
          status: scheduler.getStatus()
        });

      case 'manual-sync':
        console.log('[SyncScheduler API] Manuális szinkronizáció indítása...');
        const syncResult = await scheduler.executeManualSync();
        return NextResponse.json({
          success: syncResult.success,
          message: syncResult.message,
          stats: syncResult.stats,
          status: scheduler.getStatus()
        });

      case 'update-config':
        if (!config) {
          return NextResponse.json({
            success: false,
            error: 'Hiányzó config paraméter'
          }, { status: 400 });
        }
        
        const updateResult = scheduler.updateConfig(config);
        return NextResponse.json({
          success: updateResult,
          message: updateResult ? 'Konfiguráció sikeresen frissítve' : 'Konfiguráció frissítése sikertelen',
          status: scheduler.getStatus()
        });

      case 'restart':
        scheduler.stop();
        const restartResult = scheduler.start();
        return NextResponse.json({
          success: restartResult,
          message: restartResult ? 'Scheduler sikeresen újraindítva' : 'Scheduler újraindítása sikertelen',
          status: scheduler.getStatus()
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Ismeretlen action: ${action}`,
          availableActions: ['start', 'stop', 'manual-sync', 'update-config', 'restart']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[SyncScheduler API] POST hiba:', error);
    return NextResponse.json({
      success: false,
      error: 'Hiba a scheduler művelet végrehajtásakor',
      details: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }, { status: 500 });
  }
}

/**
 * DELETE - Scheduler leállítása és törlése (fejlesztési célokra)
 */
export async function DELETE() {
  try {
    if (globalScheduler) {
      globalScheduler.stop();
      globalScheduler = null;
      console.log('[SyncScheduler API] Scheduler instance törölve');
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduler sikeresen törölve'
    });

  } catch (error) {
    console.error('[SyncScheduler API] DELETE hiba:', error);
    return NextResponse.json({
      success: false,
      error: 'Hiba a scheduler törlésekor',
      details: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }, { status: 500 });
  }
}
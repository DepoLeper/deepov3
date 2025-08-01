'use client';

import { useState, useEffect } from 'react';

interface SchedulerStatus {
  isRunning: boolean;
  nextRun: string | null;
  lastRun: string | null;
  pattern: string;
  enabled: boolean;
  tasksCount: number;
}

interface SchedulerResponse {
  success: boolean;
  status?: SchedulerStatus;
  message?: string;
  error?: string;
  stats?: any;
}

export default function SchedulerPage() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [cronPattern, setCronPattern] = useState('0 */6 * * *');
  const [enabled, setEnabled] = useState(true);

  // Állapot betöltése
  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/unas/sync-scheduler');
      const data: SchedulerResponse = await response.json();
      
      if (data.success && data.status) {
        setStatus(data.status);
        setCronPattern(data.status.pattern);
        setEnabled(data.status.enabled);
        showMessage('Állapot sikeresen betöltve', 'success');
      } else {
        showMessage(data.error || 'Hiba az állapot betöltésekor', 'error');
      }
    } catch (error) {
      showMessage('Network hiba az állapot betöltésekor', 'error');
      console.error('Status load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scheduler művelet végrehajtása
  const executeAction = async (action: string, config?: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/unas/sync-scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, config }),
      });

      const data: SchedulerResponse = await response.json();
      
      if (data.success) {
        showMessage(data.message || `${action} sikeres`, 'success');
        if (data.status) {
          setStatus(data.status);
        }
        if (data.stats) {
          console.log('Sync stats:', data.stats);
        }
      } else {
        showMessage(data.error || `${action} sikertelen`, 'error');
      }
    } catch (error) {
      showMessage(`Network hiba ${action} során`, 'error');
      console.error(`Action ${action} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Üzenet megjelenítése
  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Konfiguráció frissítése
  const updateConfig = () => {
    executeAction('update-config', {
      cronPattern,
      enabled,
      logLevel: 'info'
    });
  };

  // Oldal betöltéskor állapot lekérése
  useEffect(() => {
    loadStatus();
  }, []);

  // Formázott dátum
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nincs adat';
    return new Date(dateString).toLocaleString('hu-HU');
  };

  // Cron pattern leírása
  const getCronDescription = (pattern: string) => {
    const descriptions: { [key: string]: string } = {
      '0 */6 * * *': 'Minden 6 órában',
      '0 */3 * * *': 'Minden 3 órában',
      '0 */1 * * *': 'Minden órában',
      '*/30 * * * *': 'Minden 30 percben',
      '*/10 * * * *': 'Minden 10 percben',
      '0 0 * * *': 'Naponta éjfélkor',
      '0 8 * * *': 'Naponta 8:00-kor'
    };
    return descriptions[pattern] || 'Egyedi minta';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        🕐 Unas API Szinkronizáció Scheduler
      </h1>

      {/* Üzenet megjelenítése */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message}
        </div>
      )}

      {/* Jelenlegi állapot */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Jelenlegi állapot</h2>
        
        {status ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <span className="font-medium text-gray-700">Státusz:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  status.isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {status.isRunning ? '🟢 Fut' : '🔴 Leállva'}
                </span>
              </div>
              
              <div className="mb-3">
                <span className="font-medium text-gray-700">Engedélyezve:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  status.enabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {status.enabled ? '✅ Igen' : '⚠️ Nem'}
                </span>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700">Cron minta:</span>
                <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {status.pattern}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  ({getCronDescription(status.pattern)})
                </span>
              </div>
            </div>

            <div>
              <div className="mb-3">
                <span className="font-medium text-gray-700">Következő futás:</span>
                <div className="text-sm text-gray-900 mt-1">
                  {formatDate(status.nextRun)}
                </div>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700">Utolsó futás:</span>
                <div className="text-sm text-gray-900 mt-1">
                  {formatDate(status.lastRun)}
                </div>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700">Futások száma:</span>
                <span className="ml-2 font-bold text-lg text-blue-600">
                  {status.tasksCount}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Állapot betöltése...</div>
        )}
      </div>

      {/* Műveletek */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎛️ Műveletek</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => executeAction('start')}
            disabled={loading || (status?.isRunning && status?.enabled)}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            ▶️ Indítás
          </button>

          <button
            onClick={() => executeAction('stop')}
            disabled={loading || !status?.isRunning}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            ⏹️ Leállítás
          </button>

          <button
            onClick={() => executeAction('restart')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            🔄 Újraindítás
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => executeAction('manual-sync')}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            🚀 Azonnali szinkronizáció
          </button>
          <span className="ml-3 text-sm text-gray-600">
            (Cron job-tól függetlenül)
          </span>
        </div>
      </div>

      {/* Konfiguráció */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Konfiguráció</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cron minta:
            </label>
            <select
              value={cronPattern}
              onChange={(e) => setCronPattern(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0 */6 * * *">Minden 6 órában (0 */6 * * *)</option>
              <option value="0 */3 * * *">Minden 3 órában (0 */3 * * *)</option>
              <option value="0 */1 * * *">Minden órában (0 */1 * * *)</option>
              <option value="*/30 * * * *">Minden 30 percben (*/30 * * * *)</option>
              <option value="*/10 * * * *">Minden 10 percben (*/10 * * * *)</option>
              <option value="0 0 * * *">Naponta éjfélkor (0 0 * * *)</option>
              <option value="0 8 * * *">Naponta 8:00-kor (0 8 * * *)</option>
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Scheduler engedélyezve</span>
            </label>
          </div>

          <button
            onClick={updateConfig}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            💾 Konfiguráció mentése
          </button>
        </div>
      </div>

      {/* Státusz frissítése */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={loadStatus}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          {loading ? '⏳ Betöltés...' : '🔄 Állapot frissítése'}
        </button>
      </div>
    </div>
  );
}
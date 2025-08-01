'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SystemStats {
  products: number;
  lastSync: string | null;
  syncErrors: number;
  apiStatus: 'online' | 'offline' | 'unknown';
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSystemStats();
    }
  }, [session]);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/unas/sync-product');
      const data = await response.json();
      
      if (data.success) {
        setStats({
          products: data.stats.totalProducts,
          lastSync: data.stats.lastSync,
          syncErrors: 0, // TODO: implement error tracking
          apiStatus: 'online'
        });
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      setStats({
        products: 0,
        lastSync: null,
        syncErrors: 1,
        apiStatus: 'offline'
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🛠️ Admin Dashboard</h1>
        <p className="text-gray-600">Üdvözlünk, {session.user?.email}!</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Termékek</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats?.products || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utolsó Sync</p>
              <p className="text-sm font-semibold text-gray-900">
                {loading ? '...' : stats?.lastSync ? new Date(stats.lastSync).toLocaleString('hu-HU') : 'Nincs'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stats?.apiStatus === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${stats?.apiStatus === 'online' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Státusz</p>
              <p className={`text-sm font-semibold ${stats?.apiStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                {loading ? '...' : stats?.apiStatus === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hibák</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats?.syncErrors || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Database Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">📊 Adatbázis</h3>
          </div>
          <p className="text-gray-600 mb-4">Termékek böngészése, keresés, részletes adatok.</p>
          <Link
            href="/admin/database"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Adatbázis böngésző →
          </Link>
        </div>

        {/* Sync Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">🔄 Szinkronizáció</h3>
          </div>
          <p className="text-gray-600 mb-4">Ütemezett és manuális szinkronizáció kezelése.</p>
          <Link
            href="/unas/scheduler"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sync Scheduler →
          </Link>
        </div>

        {/* Product Viewer */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">👁️ Termék Viewer</h3>
          </div>
          <p className="text-gray-600 mb-4">Termék adatok részletes megjelenítése API-ból.</p>
          <Link
            href="/unas/product-viewer"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Product Viewer →
          </Link>
        </div>

        {/* Agent Testing */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">🤖 Agent Teszt</h3>
          </div>
          <p className="text-gray-600 mb-4">AI agent funkciók tesztelése és debug.</p>
          <Link
            href="/agent/test"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Agent Teszt →
          </Link>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">💬 Chat</h3>
          </div>
          <p className="text-gray-600 mb-4">DeepO AI asszisztenssel való beszélgetés.</p>
          <Link
            href="/chat"
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Chat Interface →
          </Link>
        </div>

        {/* Blog Generator */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">✍️ Blog Generátor</h3>
          </div>
          <p className="text-gray-600 mb-4">AI-powered blog tartalom generálása.</p>
          <Link
            href="/blog/generate"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Blog Generátor →
          </Link>
        </div>

      </div>

      {/* System Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Rendszer Információ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">DeepO Verzió:</p>
            <p className="text-gray-600">Phase 6 Complete</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Unas API:</p>
            <p className="text-gray-600">v3.0 Integráció</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Projekt Státusz:</p>
            <p className="text-green-600 font-medium">Production Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
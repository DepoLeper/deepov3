'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  productId: string;
  dataCompleteness?: string;
  timing?: {
    login: string;
    product: string;
    total: string;
  };
  product?: {
    id: string;
    sku: string;
    name: string;
    unit: string;
    priceNet?: number;
    priceGross?: number;
  };
  analysis?: {
    basicFields: Record<string, boolean>;
    rawDataFields: string[];
    dataTypes: Record<string, string>;
    completeness: number;
  };
  rawDataSample?: string[];
  apiInfo?: {
    shopId: string;
    subscription: string;
    tokenExpiry: string;
  };
  error?: string;
  help?: string;
}

export default function UnasTestPage() {
  const [productId, setProductId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/unas/test-single-product?id=${productId}`, {
        method: 'GET'
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Teszt hiba:', error);
      setResult({
        success: false,
        productId,
        error: 'Hálózati hiba vagy szerver probléma',
        help: 'Ellenőrizd a konzolt további részletekért'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Unas API Teszt Alkalmazás
          </h1>
          <p className="text-gray-600 mb-8">
            Phase 6: 1 termék tökéletes szinkronizálása - Minden API részlet vizsgálata
          </p>

          {/* Teszt form */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">🎯 Termék ID Megadása</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                  Termék ID:
                </label>
                <input
                  id="productId"
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="pl: 1, 123, vagy bármilyen termék ID"
                />
              </div>
              <button
                onClick={runTest}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {loading ? '🔄 Tesztelés...' : '🚀 Teszt Indítása'}
              </button>
            </div>
          </div>

          {/* Eredmények */}
          {result && (
            <div className="space-y-6">
              {/* Összefoglaló */}
              <div className={`rounded-lg p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {result.success ? '✅ Teszt Sikeres!' : '❌ Teszt Sikertelen'}
                  </h2>
                  {result.dataCompleteness && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {result.dataCompleteness} adatteljesség
                    </span>
                  )}
                </div>

                {result.error && (
                  <div className="mb-4">
                    <p className="text-red-700 font-medium">Hiba: {result.error}</p>
                    {result.help && (
                      <p className="text-red-600 text-sm mt-2">💡 {result.help}</p>
                    )}
                  </div>
                )}

                {result.timing && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Login</p>
                      <p className="font-mono text-lg">{result.timing.login}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Termék lekérés</p>
                      <p className="font-mono text-lg">{result.timing.product}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Összesen</p>
                      <p className="font-mono text-lg font-semibold">{result.timing.total}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Termék adatok */}
              {result.product && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">📦 Termék Adatok</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ID</p>
                      <p className="font-mono">{result.product.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">SKU</p>
                      <p className="font-mono">{result.product.sku}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Név</p>
                      <p className="font-semibold">{result.product.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Egység</p>
                      <p>{result.product.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bruttó ár</p>
                      <p className="font-semibold text-green-600">
                        {result.product.priceGross ? `${result.product.priceGross} Ft` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Adatok elemzése */}
              {result.analysis && (
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">🔍 Adatok Elemzése</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Alapvető mezők:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(result.analysis.basicFields).map(([field, hasValue]) => (
                        <div key={field} className="flex items-center gap-2">
                          <span className={hasValue ? 'text-green-600' : 'text-red-600'}>
                            {hasValue ? '✅' : '❌'}
                          </span>
                          <span className="text-sm">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.rawDataSample && result.rawDataSample.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Nyers adatok (minta):</h4>
                      <div className="bg-white rounded border p-3">
                        <div className="flex flex-wrap gap-2">
                          {result.rawDataSample.map((field, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* API Info */}
              {result.apiInfo && (
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">🔐 API Információk</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Shop ID</p>
                      <p className="font-mono">{result.apiInfo.shopId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Előfizetés</p>
                      <p className="font-mono">{result.apiInfo.subscription}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Token lejárat</p>
                      <p className="font-mono">{result.apiInfo.tokenExpiry}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* JSON debug */}
              <details className="bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-700">
                  🔧 Teljes eredmény (JSON)
                </summary>
                <pre className="mt-4 text-xs overflow-auto bg-white p-4 rounded border">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
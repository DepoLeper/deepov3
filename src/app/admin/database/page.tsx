'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  unasId: string;
  name: string;
  sku: string | null;
  price: number | null;
  status: string;
  stock: number | null;
  lastModTime: string;
  createdAt: string;
  updatedAt: string;
  categories: any[];
  images: any[];
}

interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export default function DatabasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'lastModTime' | 'createdAt' | 'price'>('lastModTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProducts();
    }
  }, [session, page, sortBy, sortOrder, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy,
        sortOrder,
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/products?${params}`);
      const data: ProductsResponse = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Products fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a terméket?')) return;

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Termék Adatbázis</h1>
          <p className="text-gray-600">
            Összesen {pagination.total} termék • 
            Oldal {pagination.page} / {pagination.totalPages}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Vissza az Admin Dashboard-hoz
        </Link>
      </div>

      {/* Search & Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Keresés termék név, SKU vagy Unas ID alapján..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Keresés
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Törlés
            </button>
          )}
        </form>

        {/* Sort Controls */}
        <div className="flex gap-2 text-sm">
          <span className="text-gray-600">Rendezés:</span>
          {[
            { key: 'name' as const, label: 'Név' },
            { key: 'lastModTime' as const, label: 'Módosítva' },
            { key: 'createdAt' as const, label: 'Létrehozva' },
            { key: 'price' as const, label: 'Ár' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1 rounded ${
                sortBy === key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} {sortBy === key && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Termékek betöltése...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {search ? `Nincs találat a "${search}" keresésre.` : 'Nincs termék az adatbázisban.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Termék
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unas ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ár
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Készlet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Státusz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Módosítva
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0].url || product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover mr-3"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.name}
                          </div>
                          {product.sku && (
                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                          )}
                          {product.categories?.length > 0 && (
                            <div className="text-xs text-blue-600">
                              {product.categories.slice(0, 2).map(cat => 
                                typeof cat === 'string' ? cat : cat.name
                              ).join(', ')}
                              {product.categories.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {product.unasId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.price ? (
                        <span className="font-medium">
                          {product.price.toLocaleString('hu-HU')} Ft
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.stock !== null ? (
                        <span className={`font-medium ${
                          product.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.stock} db
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'live' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.lastModTime).toLocaleString('hu-HU')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/unas/product-viewer?id=${product.unasId}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        👁️ Megtekint
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ Töröl
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
              className={`px-4 py-2 rounded-lg ${
                pagination.hasPrev
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              ← Előző
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum = page - 2 + i;
              if (pageNum < 1) pageNum = i + 1;
              if (pageNum > pagination.totalPages) pageNum = pagination.totalPages - 4 + i;
              
              if (pageNum < 1 || pageNum > pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
              className={`px-4 py-2 rounded-lg ${
                pagination.hasNext
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Következő →
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            {((page - 1) * 20) + 1}-{Math.min(page * 20, pagination.total)} / {pagination.total} termék
          </div>
        </div>
      )}
    </div>
  );
}
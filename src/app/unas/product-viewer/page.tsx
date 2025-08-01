'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ProductViewerData {
  success: boolean;
  productId?: string;
  summary?: any;
  fullProduct?: any;
  error?: string;
}

export default function ProductViewer() {
  const searchParams = useSearchParams();
  const urlProductId = searchParams.get('id');
  
  const [productId, setProductId] = useState(urlProductId || '1306870988');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductViewerData | null>(null);

  const loadProduct = async (selectedProductId?: string) => {
    const idToLoad = selectedProductId || productId;
    setLoading(true);
    try {
      const res = await fetch(`/api/unas/test-product-full?id=${idToLoad}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      setData({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Load URL parameter product on mount
  useEffect(() => {
    if (urlProductId) {
      setProductId(urlProductId);
      loadProduct(urlProductId);
    } else {
      loadProduct();
    }
  }, [urlProductId]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🛍️ Unas Termék Részletek</h1>
        {urlProductId && (
          <a
            href="/admin/database"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Vissza az adatbázishoz
          </a>
        )}
      </div>

      {/* Loading indicator or product info */}
      {loading && (
        <div className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-800">Termék adatok betöltése...</p>
          </div>
        </div>
      )}
      
      {data?.success && (
        <div className="mb-8 bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800">
            <span className="font-medium">Betöltött termék:</span> {data.summary?.basic.name} (ID: {productId})
          </p>
        </div>
      )}

      {/* Eredmény */}
      {data && (
        <>
          {data.success ? (
            <div className="space-y-6">
              {/* Alapadatok */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">📦 Alapadatok</h3>
                                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-gray-700 font-medium">Név</p>
                     <p className="font-bold text-gray-900">{data.summary?.basic.name}</p>
                   </div>
                   <div>
                     <p className="text-gray-700 font-medium">SKU</p>
                     <p className="font-bold text-gray-900">{data.summary?.basic.sku}</p>
                   </div>
                   <div>
                     <p className="text-gray-700 font-medium">Ár</p>
                     <p className="font-bold text-gray-900">{data.summary?.basic.price}</p>
                   </div>
                   <div>
                     <p className="text-gray-700 font-medium">ID</p>
                     <p className="font-bold text-gray-900">{data.summary?.basic.id}</p>
                   </div>
                 </div>
              </div>

              {/* Készlet */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">📊 Készlet információ</h3>
                                 <div className="grid grid-cols-3 gap-4">
                   <div>
                     <p className="text-gray-700 font-medium">Mennyiség</p>
                     <p className="font-bold text-2xl text-gray-900">{data.summary?.stock.quantity} db</p>
                   </div>
                   <div>
                     <p className="text-gray-700 font-medium">Státusz</p>
                     <p className={`font-bold text-lg ${data.summary?.stock.active ? 'text-green-600' : 'text-red-600'}`}>
                       {data.summary?.stock.active ? 'Aktív' : 'Inaktív'}
                     </p>
                   </div>
                   <div>
                     <p className="text-gray-700 font-medium">Min. mennyiség</p>
                     <p className="font-bold text-gray-900">{data.summary?.stock.minimum} db</p>
                   </div>
                 </div>
              </div>

                             {/* Kategóriák */}
               <div className="bg-white p-6 rounded-lg shadow">
                 <h3 className="text-xl font-semibold mb-4">🏷️ Kategóriák</h3>
                 {data.fullProduct?.allCategories && data.fullProduct.allCategories.length > 0 ? (
                   <div className="space-y-2">
                     {data.fullProduct.allCategories.map((cat: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                         <span className="font-medium text-gray-900">{cat.name}</span>
                         <div className="text-sm">
                           <span className="text-gray-700">ID: {cat.id}</span>
                           <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                             {cat.type}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-gray-700">Nincs kategória információ</p>
                 )}
               </div>

              {/* Tartalom */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">📝 Tartalom</h3>
                                 <div className="space-y-4">
                   {data.fullProduct?.shortDescription && (
                     <div>
                       <p className="text-gray-700 font-medium mb-2">Rövid leírás:</p>
                       <div className="bg-gray-50 p-4 rounded border text-gray-900" 
                            dangerouslySetInnerHTML={{ __html: data.fullProduct.shortDescription }} />
                     </div>
                   )}
                   {data.fullProduct?.description && (
                     <div>
                       <p className="text-gray-700 font-medium mb-2">Részletes leírás:</p>
                       <div className="bg-gray-50 p-4 rounded border text-gray-900" 
                            dangerouslySetInnerHTML={{ __html: data.fullProduct.description }} />
                     </div>
                   )}
                 </div>
              </div>

              {/* Képek */}
              {data.summary?.images.url && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">🖼️ Kép</h3>
                  <img 
                    src={data.summary.images.url} 
                    alt={data.summary.images.alt || 'Termék kép'}
                    className="max-w-sm rounded"
                  />
                </div>
              )}

              {/* Paraméterek */}
              {data.fullProduct?.parameters && data.fullProduct.parameters.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">⚙️ Paraméterek ({data.fullProduct.parameters.length})</h3>
                                     <div className="space-y-2">
                     {data.fullProduct.parameters.map((param: any, idx: number) => (
                       <div key={idx} className="flex justify-between py-3 px-3 bg-gray-50 rounded border-b">
                         <span className="text-gray-700 font-medium">{param.name}</span>
                         <span className="font-bold text-gray-900">{param.value}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}

                             {/* Akciós árak (időszakos) */}
               {data.fullProduct?.salePrice && (
                 <div className="bg-white p-6 rounded-lg shadow">
                   <h3 className="text-xl font-semibold mb-4">🔥 Akciós ár (időszakos)</h3>
                   <div className={`p-4 rounded border-2 ${data.fullProduct.salePrice.isActive ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}`}>
                     <div className="flex justify-between items-center">
                       <div>
                         <div className="text-sm text-gray-700">
                           {data.fullProduct.salePrice.startDate && (
                             <span>Kezdés: {data.fullProduct.salePrice.startDate}</span>
                           )}
                           {data.fullProduct.salePrice.endDate && (
                             <span className="ml-4">Vég: {data.fullProduct.salePrice.endDate}</span>
                           )}
                           {!data.fullProduct.salePrice.endDate && data.fullProduct.salePrice.startDate && (
                             <span className="ml-4 text-green-600 font-medium">Végtelen akció</span>
                           )}
                         </div>
                         <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${data.fullProduct.salePrice.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                           {data.fullProduct.salePrice.isActive ? 'AKTÍV AKCIÓ' : 'LEJÁRT AKCIÓ'}
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-gray-700">{data.fullProduct.salePrice.net} Ft nettó</div>
                         <div className={`font-bold text-2xl ${data.fullProduct.salePrice.isActive ? 'text-red-600' : 'text-gray-600'}`}>
                           {data.fullProduct.salePrice.gross} Ft
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* Vevőcsoport akciós árak */}
               {data.fullProduct?.groupSalePrices && data.fullProduct.groupSalePrices.length > 0 && (
                 <div className="bg-white p-6 rounded-lg shadow">
                   <h3 className="text-xl font-semibold mb-4">🎯 Vevőcsoport akciós árak ({data.fullProduct.groupSalePrices.length})</h3>
                   <div className="space-y-3">
                     {data.fullProduct.groupSalePrices.map((salePrice: any, idx: number) => (
                       <div key={idx} className={`p-4 rounded border ${salePrice.isActive ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-300'}`}>
                         <div className="flex justify-between items-center">
                           <div>
                             <span className="font-medium text-gray-900">{salePrice.groupName}</span>
                             <div className="text-sm text-gray-700 mt-1">
                               {salePrice.saleStart && <span>Kezdés: {salePrice.saleStart}</span>}
                               {salePrice.saleEnd && <span className="ml-4">Vég: {salePrice.saleEnd}</span>}
                             </div>
                             <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${salePrice.isActive ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'}`}>
                               {salePrice.isActive ? 'AKTÍV' : 'LEJÁRT'}
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="text-gray-700">{salePrice.saleNet} Ft nettó</div>
                             <div className={`font-bold text-lg ${salePrice.isActive ? 'text-orange-600' : 'text-gray-600'}`}>
                               {salePrice.saleGross} Ft
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Vevőcsoport árak (nem akciós) */}
               {data.fullProduct?.specialPrices && data.fullProduct.specialPrices.length > 0 && (
                 <div className="bg-white p-6 rounded-lg shadow">
                   <h3 className="text-xl font-semibold mb-4">👥 Vevőcsoport árak ({data.fullProduct.specialPrices.length})</h3>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="border-b">
                           <th className="text-left py-2 text-gray-900">Csoport</th>
                           <th className="text-right py-2 text-gray-900">Nettó</th>
                           <th className="text-right py-2 text-gray-900">Bruttó</th>
                           <th className="text-center py-2 text-gray-900">Kedvezmény</th>
                         </tr>
                       </thead>
                       <tbody>
                         {data.fullProduct.specialPrices.map((price: any, idx: number) => (
                           <tr key={idx} className="border-b bg-blue-50">
                             <td className="py-2 text-gray-900">{price.groupName}</td>
                             <td className="text-right text-gray-900">{price.priceNet} Ft</td>
                             <td className="text-right text-gray-900 font-medium">{price.priceGross} Ft</td>
                             <td className="text-center">
                               {price.discountPercent ? (
                                 <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                                   -{price.discountPercent}%
                                 </span>
                               ) : (
                                 <span className="px-2 py-1 bg-gray-400 text-white rounded text-xs">
                                   Speciális ár
                                 </span>
                               )}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-red-50 p-6 rounded-lg">
              <p className="text-red-800">Hiba: {data.error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
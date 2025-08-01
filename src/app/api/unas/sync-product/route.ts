import { NextRequest, NextResponse } from 'next/server';
import { UnasApiClient } from '@/lib/unas/UnasApiClient';
import { UnasProductSyncService } from '@/lib/unas/UnasProductSyncService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Product ID a request body-ból vagy query paraméterből
    const { productId } = await request.json().catch(() => ({}));
    const queryProductId = request.nextUrl.searchParams.get('id');
    const id = productId || queryProductId;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID szükséges'
      }, { status: 400 });
    }

    console.log(`🎯 === UNAS PRODUCT SYNC TESZT ===`);
    console.log(`📦 Termék ID: ${id}`);

    // API client inicializálása
    const apiKey = process.env.UNAS_API_KEY;
    const apiUrl = process.env.UNAS_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json({
        success: false,
        error: 'Unas API konfiguráció hiányzik'
      }, { status: 500 });
    }

    const apiClient = new UnasApiClient({
      apiKey,
      baseUrl: apiUrl,
      timeout: 30000
    });

    // Sync service inicializálása
    const syncService = new UnasProductSyncService(apiClient, prisma);

    // Termék szinkronizálása
    const result = await syncService.syncSingleProduct(id);

    if (result.success) {
      // Termék visszaolvasása az adatbázisból
      const savedProduct = await syncService.getProductFromDb(id);
      
      console.log(`✅ Szinkronizálás sikeres!`);
      return NextResponse.json({
        success: true,
        result,
        savedProduct: savedProduct ? {
          id: savedProduct.id,
          sku: savedProduct.sku,
          name: savedProduct.name,
          priceGross: savedProduct.priceGross,
          state: savedProduct.state,
          stock: savedProduct.stock,
          categoryName: savedProduct.categoryName,
          hasDescription: !!savedProduct.description,
          hasImage: !!savedProduct.imageUrl,
          parametersCount: savedProduct.parameters ? 
            (Array.isArray(savedProduct.parameters) ? savedProduct.parameters.length : 0) : 0,
          specialPricesCount: savedProduct.specialPrices ? 
            (Array.isArray(savedProduct.specialPrices) ? savedProduct.specialPrices.length : 0) : 0,
          hasSalePrice: !!savedProduct.salePrice,
          syncedAt: savedProduct.syncedAt,
          updatedAt: savedProduct.updatedAt
        } : null,
        stats: await syncService.getSyncStats()
      });
    } else {
      console.error(`❌ Szinkronizálás hiba:`, result.error);
      return NextResponse.json({
        success: false,
        error: result.error,
        result
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ API hiba:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint a statisztikák lekéréséhez
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.UNAS_API_KEY;
    const apiUrl = process.env.UNAS_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json({
        success: false,
        error: 'Unas API konfiguráció hiányzik'
      }, { status: 500 });
    }

    const apiClient = new UnasApiClient({
      apiKey,
      baseUrl: apiUrl,
      timeout: 30000
    });

    const syncService = new UnasProductSyncService(apiClient, prisma);
    const stats = await syncService.getSyncStats();

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error: any) {
    console.error('❌ Stats hiba:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 
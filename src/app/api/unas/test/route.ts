/**
 * Unas API Test Endpoint
 * 
 * Teszteli az Unas API kapcsolatot és visszaadja a mintaadatokat
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { UnasApiClient, getUnasApiClient } from '@/lib/unas/UnasApiClient';
import { UnasProductService, getUnasProductService } from '@/lib/unas/UnasProductService';

export async function GET(request: NextRequest) {
  try {
    // Authentikáció ellenőrzése
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Nincs jogosultság' },
        { status: 401 }
      );
    }

    console.log('🔍 Unas API teszt kezdése...');

    // API kulcs ellenőrzése
    const apiKey = process.env.UNAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Unas API kulcs hiányzik a környezeti változókból',
          message: 'Állítsd be a UNAS_API_KEY környezeti változót'
        },
        { status: 500 }
      );
    }

    // Unas API kliens inicializálása
    const apiClient = getUnasApiClient({
      apiKey,
      timeout: 30000
    });

    // Product service inicializálása
    const productService = getUnasProductService(apiClient);

    // Kapcsolat tesztelése
    const testResult = await productService.testConnection();

    if (!testResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: testResult.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Sikeres válasz
    return NextResponse.json({
      success: true,
      message: testResult.message,
      data: testResult.data,
      timestamp: new Date().toISOString(),
      apiInfo: {
        endpoint: 'https://api.unas.eu/shop',
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey.length
      }
    });

  } catch (error) {
    console.error('❌ Unas API teszt hiba:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: `API teszt hiba: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentikáció ellenőrzése
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Nincs jogosultság' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    console.log('🔍 Unas API művelet:', action, params);

    // API kulcs ellenőrzése
    const apiKey = process.env.UNAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unas API kulcs hiányzik' },
        { status: 500 }
      );
    }

    // Unas API kliens inicializálása
    const apiClient = getUnasApiClient({
      apiKey,
      timeout: 30000
    });

    const productService = getUnasProductService(apiClient);

    // Művelet végrehajtása
    let result;
    switch (action) {
      case 'searchProducts':
        result = await productService.searchProducts(params);
        break;
      
      case 'getCategories':
        result = await productService.getCategories(params.limit);
        break;
      
      case 'getProductBySku':
        result = await productService.getProductBySku(params.sku);
        break;
      
      case 'getProductRecommendations':
        result = await productService.getProductRecommendations(params.categoryId, params.limit);
        break;
      
      case 'clearCache':
        productService.clearCache();
        result = { message: 'Cache tisztítva' };
        break;
      
      case 'getCacheStats':
        result = productService.getCacheStats();
        break;
      
      default:
        return NextResponse.json(
          { error: `Ismeretlen művelet: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Unas API művelet hiba:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: `API művelet hiba: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { UnasApiClient } from '@/lib/unas/UnasApiClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('id');
  
  console.log('🧪 === UNAS API TESZT INDÍTÁSA ===');
  console.log(`🎯 Cél: ${productId || 'lista'} termék részletes vizsgálata`);
  
  try {
    // API kulcs ellenőrzése
    const apiKey = process.env.UNAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'UNAS_API_KEY nincs beállítva a környezeti változókban',
        help: 'Állítsd be az UNAS_API_KEY-t a .env.local fájlban'
      }, { status: 500 });
    }

    console.log(`🔑 API kulcs: ${apiKey.substring(0, 10)}...${apiKey.slice(-10)}`);
    console.log('🚀 UnasApiClient inicializálva');
    
    const unasClient = new UnasApiClient({ apiKey });
    const startTime = Date.now();

    // === 1. FÁZIS: LOGIN TESZT ===
    console.log('📝 === 1. FÁZIS: LOGIN TESZT ===');
    const loginStartTime = Date.now();
    const loginResult = await unasClient.login();
    const loginDuration = Date.now() - loginStartTime;
    console.log(`✅ Login sikeres! (${loginDuration}ms)`);
    console.log('📊 Login eredmény:', loginResult);

    // === 2. FÁZIS: TERMÉK LEKÉRÉS ===
    console.log('📦 === 2. FÁZIS: TERMÉK LEKÉRÉS ===');
    const productStartTime = Date.now();
    
    let productResult;
    if (productId === 'list' || !productId) {
      // Lista lekérés
      productResult = await unasClient.getProduct();
    } else {
      // Konkrét termék
      productResult = await unasClient.getProduct(productId);
    }
    
    const productDuration = Date.now() - productStartTime;
    console.log(`✅ Termék lekérés kész! (${productDuration}ms)`);

    // === 3. FÁZIS: EREDMÉNY FELDOLGOZÁSA ===
    console.log('📊 === 3. FÁZIS: EREDMÉNY FELDOLGOZÁSA ===');
    
    if (!productResult) {
      return NextResponse.json({
        success: false,
        error: productId ? `Termék ${productId} nem található` : 'Nincsenek termékek',
        loginResult,
        timing: {
          login: `${loginDuration}ms`,
          product: `${productDuration}ms`,
          total: `${Date.now() - startTime}ms`
        }
      });
    }

    // Ha lista
    if (Array.isArray(productResult)) {
      console.log(`✅ ${productResult.length} termék találva a listában`);
      
      return NextResponse.json({
        success: true,
        productCount: productResult.length,
        products: productResult,
        loginResult,
        timing: {
          login: `${loginDuration}ms`,
          product: `${productDuration}ms`,
          total: `${Date.now() - startTime}ms`
        }
      });
    }
    
    // Ha konkrét termék
    console.log('✅ Termék sikeresen lekérve:', productResult);
    
    return NextResponse.json({
      success: true,
      productId,
      product: productResult,
      loginResult,
      timing: {
        login: `${loginDuration}ms`,
        product: `${productDuration}ms`,
        total: `${Date.now() - startTime}ms`
      }
    });
    
  } catch (error: any) {
    console.error('❌ TESZT HIBA:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      help: 'Ellenőrizd az API kulcsot és a hálózati kapcsolatot'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: 'Csak GET kérések támogatottak',
    usage: 'GET /api/unas/test-single-product?id=TERMEK_ID'
  }, { status: 405 });
} 
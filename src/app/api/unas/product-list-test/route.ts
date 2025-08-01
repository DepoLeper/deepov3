import { NextRequest, NextResponse } from 'next/server';
import { UnasApiClient } from '@/lib/unas/UnasApiClient';

export async function GET() {
  console.log('🧪 === UNAS PRODUCT LIST TESZT ===');
  
  try {
    const apiKey = process.env.UNAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'UNAS_API_KEY hiányzik'
      }, { status: 500 });
    }

    console.log('🚀 UnasApiClient inicializálás...');
    const client = new UnasApiClient({ apiKey });
    
    console.log('🔐 Login...');
    const loginResult = await client.login();
    console.log('✅ Login OK:', loginResult);
    
    console.log('📦 Termék lista lekérés...');
    try {
      const products = await client.getProduct(); // Lista mód - ID nélkül
      console.log(`✅ ${Array.isArray(products) ? products.length : 1} termék találva`);
      
      return NextResponse.json({
        success: true,
        productCount: Array.isArray(products) ? products.length : 1,
        products: Array.isArray(products) ? products : [products],
        message: 'Termék lista sikeresen lekérve'
      });
    } catch (productError: any) {
      console.error('❌ Termék lekérés hiba:', productError);
      return NextResponse.json({
        success: false,
        error: `Termék lekérés hiba: ${productError.message}`,
        loginResult
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Általános hiba:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 
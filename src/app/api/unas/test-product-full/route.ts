import { NextRequest, NextResponse } from 'next/server';
import { UnasApiClient } from '@/lib/unas/UnasApiClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('id') || '1306870988'; // Jegyzettömb
  
  try {
    const client = new UnasApiClient({ 
      apiKey: process.env.UNAS_API_KEY! 
    });
    
    await client.login();
    console.log('✅ Login OK');
    
    const fullProduct = await client.getProductFull(productId);
    
    if (!fullProduct) {
      return NextResponse.json({ 
        success: false,
        error: 'Termék nem található',
        productId
      });
    }
    
    console.log('✅ Teljes termék adatok:', fullProduct);
    
    // Adatok összefoglalása
    const summary = {
      basic: {
        id: fullProduct.id,
        sku: fullProduct.sku,
        name: fullProduct.name,
        price: `${fullProduct.priceNet} Ft + ÁFA = ${fullProduct.priceGross} Ft`
      },
      stock: {
        quantity: fullProduct.stock,
        active: fullProduct.stockStatus,
        minimum: fullProduct.minimumQty
      },
      category: {
        id: fullProduct.categoryId,
        name: fullProduct.categoryName
      },
      content: {
        hasDescription: !!fullProduct.description,
        hasShortDescription: !!fullProduct.shortDescription,
        shortDescriptionLength: fullProduct.shortDescription?.length || 0
      },
      seo: {
        title: fullProduct.seoTitle,
        url: fullProduct.url,
        sefUrl: fullProduct.sefUrl
      },
      images: {
        url: fullProduct.imageUrl,
        alt: fullProduct.imageAlt
      },
      parameters: fullProduct.parameters?.length || 0,
      specialPrices: fullProduct.specialPrices?.length || 0
    };
    
    return NextResponse.json({ 
      success: true,
      productId,
      summary,
      fullProduct
    });
    
  } catch (error: any) {
    console.error('❌ Hiba:', error.message);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
} 
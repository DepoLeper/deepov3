import { NextRequest, NextResponse } from 'next/server';
import { UnasApiClient } from '@/lib/unas/UnasApiClient';

export async function GET() {
  try {
    const client = new UnasApiClient({ 
      apiKey: process.env.UNAS_API_KEY! 
    });
    
    await client.login();
    console.log('✅ Login OK');
    
    const products = await client.getProduct();
    console.log('✅ Products:', products);
    
    return NextResponse.json({ 
      success: true,
      products 
    });
    
  } catch (error: any) {
    console.error('❌ Hiba:', error.message);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
} 
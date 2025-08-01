import { NextRequest, NextResponse } from 'next/server';
import { UnasApiClient } from '@/lib/unas/UnasApiClient';

export async function GET() {
  console.log('🧪 === UNAS LOGIN TESZT ===');
  
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
    
    console.log('🔐 Login teszt...');
    const loginResult = await client.login();
    
    return NextResponse.json({
      success: true,
      message: 'Login sikeres!',
      loginResult
    });
    
  } catch (error: any) {
    console.error('❌ Login hiba:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 
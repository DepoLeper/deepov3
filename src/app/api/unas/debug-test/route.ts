import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('🧪 === DEBUG TESZT INDÍTÁS ===');
  const steps: any[] = [];
  
  try {
    // 1. Környezeti változó ellenőrzés
    steps.push({ step: 1, name: 'API kulcs ellenőrzés', status: 'start' });
    const apiKey = process.env.UNAS_API_KEY;
    if (!apiKey) {
      steps.push({ step: 1, name: 'API kulcs ellenőrzés', status: 'error', message: 'UNAS_API_KEY hiányzik' });
      return NextResponse.json({ success: false, steps }, { status: 500 });
    }
    steps.push({ step: 1, name: 'API kulcs ellenőrzés', status: 'ok', keyLength: apiKey.length });

    // 2. Import ellenőrzés
    steps.push({ step: 2, name: 'UnasApiClient import', status: 'start' });
    try {
      const { UnasApiClient } = await import('@/lib/unas/UnasApiClient');
      steps.push({ step: 2, name: 'UnasApiClient import', status: 'ok' });
      
      // 3. Client létrehozás
      steps.push({ step: 3, name: 'Client inicializálás', status: 'start' });
      const client = new UnasApiClient({ apiKey });
      steps.push({ step: 3, name: 'Client inicializálás', status: 'ok' });
      
      // 4. Login teszt
      steps.push({ step: 4, name: 'Login teszt', status: 'start' });
      const loginResult = await client.login();
      steps.push({ step: 4, name: 'Login teszt', status: 'ok', result: loginResult });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Minden lépés sikeres!',
        steps,
        loginResult 
      });
      
    } catch (importError: any) {
      steps.push({ step: 2, name: 'UnasApiClient import', status: 'error', message: importError.message });
      throw importError;
    }
    
  } catch (error: any) {
    console.error('❌ Debug teszt hiba:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      steps 
    }, { status: 500 });
  }
} 
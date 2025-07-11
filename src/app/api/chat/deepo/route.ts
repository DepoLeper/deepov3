import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { SimpleHybridController } from '@/lib/hybrid/SimpleHybridController';

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

    // Request body parse
    const body = await request.json();
    const { message, userId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Hiányzó vagy érvénytelen üzenet' },
        { status: 400 }
      );
    }

    // SimpleHybridController használata (fokozatos hibrid megközelítés)
    const hybridController = new SimpleHybridController();
    const result = await hybridController.processMessage(
      message, 
      userId || session.user?.email || 'anonymous',
      `session_${Date.now()}`
    );

    // Válasz visszaküldése
    return NextResponse.json({
      response: result.response,
      suggestions: result.suggestions,
      confidence: result.confidence,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Chat API hiba:', error);
    
    return NextResponse.json(
      { 
        error: 'Belső szerver hiba',
        response: 'Sajnálom, hiba történt. Próbáld újra később!',
        suggestions: ['Próbáld újra', 'Segítség kérése'],
        confidence: 0.1,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'Error Handler'
        }
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hybridController = new SimpleHybridController();
    const status = hybridController.getStatus();
    
    return NextResponse.json({
      status: status.status,
      agent: 'SimpleHybridController (DeepO)',
      timestamp: new Date().toISOString(),
      version: status.version,
      components: status.components
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: 'SimpleHybrid szolgáltatás nem elérhető'
      },
      { status: 500 }
    );
  }
} 
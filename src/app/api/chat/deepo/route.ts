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

    // SimpleHybridController v4.0 használata (Persistent Memory)
    const hybridController = new SimpleHybridController();
    const result = await hybridController.processMessage(
      userId || session.user?.email || 'anonymous',
      `session_${Date.now()}`,
      message
    );

    // Válasz visszaküldése
    return NextResponse.json({
      response: result.response,
      confidence: result.confidence,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Chat API hiba:', error);
    
    return NextResponse.json(
      { 
        error: 'Belső szerver hiba',
        response: 'Sajnálom, hiba történt. Próbáld újra később!',
        confidence: 0.1,
        metadata: {
          memoryUsed: false,
          contextUsed: false,
          timestamp: new Date().toISOString(),
          processingTime: 0
        }
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      agent: 'SimpleHybridController v4.0 (DeepO)',
      timestamp: new Date().toISOString(),
      version: '4.0.0-persistent-memory',
      components: [
        'OpenAI Agents SDK',
        'PersistentMemoryManager (Prisma + SQLite)',
        'SimpleContextLoader (Content Guides)',
        'Hibrid Cache + Database architektúra'
      ]
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
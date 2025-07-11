import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { HybridAgentController } from '@/lib/hybrid/HybridAgentController';

// Globális HybridAgentController instance (singleton pattern)
let hybridAgent: HybridAgentController | null = null;

function getHybridAgent(): HybridAgentController {
  if (!hybridAgent) {
    hybridAgent = new HybridAgentController();
  }
  return hybridAgent;
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

    // Request body parse
    const body = await request.json();
    const { message, userId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Hiányzó vagy érvénytelen üzenet' },
        { status: 400 }
      );
    }

    // HybridAgentController használata
    const agent = getHybridAgent();
    
    // Chat válasz generálása
    const response = await agent.processMessage(message, {
      userId: userId || session.user?.email || 'anonymous',
      sessionId: `session_${Date.now()}`
    });

    // Válasz visszaküldése
    return NextResponse.json({
      response: response.response,
      suggestions: response.suggestions,
      confidence: response.confidence,
      metadata: response.metadata
    });

  } catch (error) {
    console.error('Chat API hiba:', error);
    
    return NextResponse.json(
      { 
        error: 'Belső szerver hiba',
        response: 'Sajnálom, hiba történt. Próbáld újra később!',
        suggestions: ['Próbáld újra', 'Segítség kérése'],
        confidence: 0.1
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const agent = getHybridAgent();
    
    return NextResponse.json({
      status: 'ok',
      agent: 'HybridAgentController',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Agent inicializálási hiba'
      },
      { status: 500 }
    );
  }
} 
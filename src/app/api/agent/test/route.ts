import { NextRequest, NextResponse } from 'next/server';
import { AgentController } from '@/lib/agent/AgentController';

export async function POST(request: NextRequest) {
  try {
    const { message, userId, sessionId } = await request.json();

    if (!message || !userId || !sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Hiányzó paraméterek',
        error: 'message, userId és sessionId kötelező'
      }, { status: 400 });
    }

    // Agent controller inicializálása
    const agentController = new AgentController({
      userId,
      sessionId,
      personality: 'deepo_default',
      useContentGuides: true,
      temperature: 0.7
    });

    // Üzenet feldolgozása
    const response = await agentController.processMessage(message, []);

    return NextResponse.json({
      success: true,
      message: 'Agent válasz sikeresen generálva',
      data: {
        agentResponse: response.message,
        tokensUsed: response.tokensUsed,
        confidence: response.confidence,
        testInfo: {
          userId,
          sessionId,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Agent test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Agent teszt sikertelen',
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt'
    }, { status: 500 });
  }
} 
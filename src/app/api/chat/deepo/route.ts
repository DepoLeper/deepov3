import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { SimpleHybridController } from '@/lib/hybrid/SimpleHybridController';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // User ID meghatározása (email alapján User rekord keresése)
    let actualUserId: string;
    
    console.log(`🔍 User ID meghatározása - userId: ${userId}, email: ${session.user?.email}`);
    
    if (userId) {
      actualUserId = userId;
      console.log(`✅ Használt userId paraméter: ${actualUserId}`);
    } else if (session.user?.email) {
      try {
        console.log(`🔍 User keresés email alapján: ${session.user.email}`);
        
        // Keresés email alapján
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (user) {
          actualUserId = user.id;
          console.log(`✅ Meglévő User rekord találat: ${actualUserId} (${user.email})`);
        } else {
          console.log(`📝 Nincs User rekord, létrehozás...`);
          
          // Ha nincs User rekord, hozzunk létre egyet
          const newUser = await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name || null,
              image: session.user.image || null,
            }
          });
          actualUserId = newUser.id;
          console.log(`✅ Új User rekord létrehozva: ${newUser.id} (${newUser.email})`);
        }
      } catch (dbError) {
        console.error('❌ User keresési/létrehozási hiba:', dbError);
        actualUserId = 'fallback_user';
      }
    } else {
      actualUserId = 'anonymous';
      console.log(`⚠️ Nincs email, anonymous user használata`);
    }
    
    console.log(`🎯 Végleges actualUserId: ${actualUserId}`);

    // SimpleHybridController v4.0 használata (Persistent Memory)
    const hybridController = new SimpleHybridController();
    const result = await hybridController.processMessage(
      actualUserId,
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
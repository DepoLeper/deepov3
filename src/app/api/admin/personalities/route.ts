import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PersonalityEngine, PersonalityConfig } from '@/lib/agent/PersonalityEngine';

/**
 * GET - Összes személyiség lekérdezése
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const personalityEngine = new PersonalityEngine();
    const personalities = await personalityEngine.getAllPersonalities();
    
    await personalityEngine.cleanup();

    return NextResponse.json({
      success: true,
      data: {
        personalities: personalities.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          traits: p.traits,
          systemPrompt: p.systemPrompt,
          examples: p.examples,
          context: p.context,
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          exampleCount: p.examples?.length || 0
        })),
        total: personalities.length
      }
    });

  } catch (error) {
    console.error('Personalities GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Új személyiség létrehozása
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const personalityData = await request.json();

    // Validáció
    if (!personalityData.name || !personalityData.description) {
      return NextResponse.json(
        { success: false, error: 'Név és leírás megadása kötelező' },
        { status: 400 }
      );
    }

    const personalityEngine = new PersonalityEngine();
    
    // PersonalityConfig objektum összeállítása
    const newPersonality: Omit<PersonalityConfig, 'id' | 'createdAt' | 'updatedAt'> = {
      name: personalityData.name,
      description: personalityData.description,
      traits: personalityData.traits || {
        tone: 'közvetlen',
        formality: 'félformális',
        enthusiasm: 'közepes',
        creativity: 'kiegyensúlyozott',
        technicality: 'kiegyensúlyozott'
      },
      systemPrompt: personalityData.systemPrompt || '',
      examples: personalityData.examples || [],
      context: personalityData.context || {
        keywords: [],
        useCases: [],
        contentTypes: [],
        targetAudience: [],
        priority: 5
      },
      isActive: personalityData.isActive || false
    };
    
    const newPersonalityId = await personalityEngine.savePersonality(newPersonality);

    await personalityEngine.cleanup();

    return NextResponse.json({
      success: true,
      data: { id: newPersonalityId },
      message: 'Személyiség sikeresen létrehozva'
    });

  } catch (error) {
    console.error('Personality POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Személyiség létrehozása sikertelen' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Személyiség frissítése
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const personalityData = await request.json();
    const { id, ...updates } = personalityData;
    
    // Validáció
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó ID paraméter' },
        { status: 400 }
      );
    }

    const personalityEngine = new PersonalityEngine();
    await personalityEngine.updatePersonality(id, updates);
    await personalityEngine.cleanup();

    return NextResponse.json({
      success: true,
      message: 'Személyiség sikeresen frissítve'
    });

  } catch (error) {
    console.error('Personality PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Személyiség frissítése sikertelen' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Személyiség törlése
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const personalityId = searchParams.get('id');

    if (!personalityId) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó ID paraméter' },
        { status: 400 }
      );
    }

    const personalityEngine = new PersonalityEngine();
    await personalityEngine.deletePersonality(personalityId);
    await personalityEngine.cleanup();

    return NextResponse.json({
      success: true,
      message: 'Személyiség sikeresen törölve'
    });

  } catch (error) {
    console.error('Personality DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Személyiség törlése sikertelen' },
      { status: 500 }
    );
  }
}
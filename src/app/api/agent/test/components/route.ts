import { NextRequest, NextResponse } from 'next/server';
import { MemoryManager } from '@/lib/agent/MemoryManager';
import { ContextLoader } from '@/lib/agent/ContextLoader';
import { PersonalityEngine } from '@/lib/agent/PersonalityEngine';

export async function POST(request: NextRequest) {
  try {
    const { testType, userMessage } = await request.json();

    // ÚJ: Personality Matching teszt
    if (testType === 'personality-matching') {
      const personalityEngine = new PersonalityEngine();
      
      // Javasolt személyiség (anélkül, hogy aktiválnánk)
      const suggestedPersonality = await personalityEngine.suggestPersonality(userMessage);
      
      // Részletes matching információk
      const matchingDetails = await personalityEngine.getPersonalityMatchDetails(userMessage);
      
      return NextResponse.json({
        success: true,
        message: 'Personality Matching teszt sikeres',
        data: {
          suggestedPersonality: suggestedPersonality ? {
            id: suggestedPersonality.id,
            name: suggestedPersonality.name,
            description: suggestedPersonality.description,
            traits: suggestedPersonality.traits
          } : null,
          matchingDetails
        }
      });
    }
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Hiányzó userId paraméter',
        error: 'userId kötelező'
      }, { status: 400 });
    }

    const testResults = {
      memoryManager: { success: false, message: '', data: null },
      contextLoader: { success: false, message: '', data: null },
      personalityEngine: { success: false, message: '', data: null }
    };

    // Memory Manager teszt
    try {
      const memoryManager = new MemoryManager(userId, 'test-session');
      
      // Teszt memória mentése
      await memoryManager.saveMemory('preference', 'test_preference', 'közvetlen hangnem', 0.9);
      
      // Memória lekérdezés
      const memories = await memoryManager.getRelevantMemories('hangnem');
      
      testResults.memoryManager = {
        success: true,
        message: 'Memory Manager működik',
        data: { memoriesFound: memories.length, memories }
      };
      
      await memoryManager.cleanup();
    } catch (error) {
      testResults.memoryManager = {
        success: false,
        message: 'Memory Manager hiba',
        data: { error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
      };
    }

    // Context Loader teszt
    try {
      const contextLoader = new ContextLoader();
      
      // Teszt kontextus betöltése
      const context = await contextLoader.loadContext('blog seo optimalizálás');
      
      // Statisztikák lekérdezése
      const stats = contextLoader.getStats();
      
      testResults.contextLoader = {
        success: true,
        message: 'Context Loader működik',
        data: { 
          contextLoaded: context.length > 0,
          contextLength: context.length,
          stats
        }
      };
    } catch (error) {
      testResults.contextLoader = {
        success: false,
        message: 'Context Loader hiba',
        data: { error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
      };
    }

    // Personality Engine teszt
    try {
      const personalityEngine = new PersonalityEngine();
      
      // Alapértelmezett személyiség betöltése
      await personalityEngine.loadPersonality('deepo_default');
      const personality = await personalityEngine.getCurrentPersonality();
      
      // Összes személyiség lekérdezése
      const allPersonalities = await personalityEngine.getAllPersonalities();
      
      testResults.personalityEngine = {
        success: true,
        message: 'Personality Engine működik',
        data: {
          currentPersonality: personality?.name,
          totalPersonalities: allPersonalities.length,
          personalities: allPersonalities.map(p => ({ id: p.id, name: p.name }))
        }
      };
      
      await personalityEngine.cleanup();
    } catch (error) {
      testResults.personalityEngine = {
        success: false,
        message: 'Personality Engine hiba',
        data: { error: error instanceof Error ? error.message : 'Ismeretlen hiba' }
      };
    }

    // Összegzés
    const successCount = Object.values(testResults).filter(result => result.success).length;
    const totalTests = Object.keys(testResults).length;
    const overallSuccess = successCount === totalTests;

    return NextResponse.json({
      success: overallSuccess,
      message: `Komponens tesztek befejezve: ${successCount}/${totalTests} sikeres`,
      data: {
        summary: {
          totalTests,
          successCount,
          failureCount: totalTests - successCount,
          overallSuccess
        },
        results: testResults
      }
    });

  } catch (error) {
    console.error('Component test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Komponens tesztek futtatása sikertelen',
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt'
    }, { status: 500 });
  }
} 
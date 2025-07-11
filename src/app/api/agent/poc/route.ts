import { NextRequest, NextResponse } from 'next/server';
import { runDeepOAgent, testAgentCapabilities } from '@/lib/agent-sdk/OpenAIAgentPOC';

export async function POST(request: NextRequest) {
  try {
    const { message, agentType, testMode } = await request.json();

    // Ha test mode, akkor futtatjuk az összes képesség tesztet
    if (testMode) {
      const testResults = await testAgentCapabilities();
      
      return NextResponse.json({
        success: true,
        message: 'OpenAI Agent SDK képességek tesztelve',
        mode: 'test',
        data: testResults
      });
    }

    if (!message) {
      return NextResponse.json({
        success: false,
        message: 'Hiányzó üzenet paraméter',
        error: 'message kötelező'
      }, { status: 400 });
    }

    // Normál agent futtatás
    const result = await runDeepOAgent(
      message, 
      agentType || 'main'
    );

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'OpenAI Agent SDK hiba',
        error: result.error,
        data: null
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'OpenAI Agent SDK válasz sikeresen generálva',
      mode: 'agent',
      data: {
        agentName: result.agent,
        response: result.response,
        metadata: result.metadata,
        comparison: {
          sdk: 'OpenAI Agents SDK (@openai/agents)',
          features: [
            'Multi-agent handoffs',
            'Built-in tool orchestration', 
            'Automatic memory management',
            'Native function calling',
            'Content guides integration'
          ]
        }
      }
    });

  } catch (error) {
    console.error('OpenAI Agent SDK POC error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'OpenAI Agent SDK POC futtatása sikertelen',
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt'
    }, { status: 500 });
  }
}

// Összehasonlító adatok lekérdezése
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'OpenAI Agent SDK POC információk',
      data: {
        comparison: {
          currentImplementation: {
            name: 'Saját Agent Framework',
            files: [
              'AgentController.ts (~150 sor)',
              'MemoryManager.ts (~300 sor)', 
              'ContextLoader.ts (~200 sor)',
              'PersonalityEngine.ts (~250 sor)',
              'ToolManager.ts (~400 sor)'
            ],
            totalLines: '~1300 sor kód',
            features: [
              'Egyedi memória kezelés',
              'Content guides feldolgozás',
              'Személyiség motor',
              'SEO elemzés',
              'Tool manager'
            ],
            pros: [
              'Teljes kontroll',
              'Testreszabható',
              'Részletes működés'
            ],
            cons: [
              'Sok karbantartás',
              'Komplexitás',
              'Hibakilövés nehéz'
            ]
          },
          openaiSDK: {
            name: 'OpenAI Agents SDK',
            files: [
              'OpenAIAgentPOC.ts (~200 sor)',
            ],
            totalLines: '~200 sor kód',
            features: [
              'Multi-agent handoffs',
              'Beépített tool management',
              'Automatikus memória',
              'Native function calling',
              'WebRTC/WebSocket támogatás',
              'Voice agents',
              'Web search integration',
              'File search',
              'Code interpreter'
            ],
            pros: [
              'Kevés kód',
              'Hivatalos támogatás',
              'Beépített funkciók',
              'Automatikus optimalizálás',
              'Continuous updates'
            ],
            cons: [
              'Kevesebb kontroll',
              'OpenAI függőség',
              'Learning curve'
            ]
          }
        },
        costComparison: {
          currentApproach: {
            model: 'gpt-4o-mini',
            inputCost: '$0.15/1M tokens',
            outputCost: '$0.60/1M tokens',
            features: 'Alapfunkciók'
          },
          sdkApproach: {
            model: 'gpt-4o-mini + tools',
            inputCost: '$0.15/1M tokens',
            outputCost: '$0.60/1M tokens',
            cachedInput: '$0.075/1M tokens (50% kedvezmény)',
            toolCosts: 'Web search, file search stb.',
            features: 'Kiterjesztett funkciók beépítve'
          }
        },
        recommendations: {
          shortTerm: 'Tesztelés és párhuzamos futtatás',
          mediumTerm: 'Fokozatos migráció hibrid megközelítéssel',
          longTerm: 'Teljes áttérés OpenAI SDK-ra, saját kiegészítésekkel'
        }
      }
    });

  } catch (error) {
    console.error('GET request error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Információk lekérdezése sikertelen',
      error: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }, { status: 500 });
  }
} 
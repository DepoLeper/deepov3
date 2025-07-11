import { PrismaClient } from '@prisma/client';

export interface PersonalityTraits {
  tone: 'közvetlen' | 'szakmai' | 'humoros' | 'barátságos' | 'magázódó';
  formality: 'informális' | 'félformális' | 'formális';
  enthusiasm: 'alacsony' | 'közepes' | 'magas';
  creativity: 'konzervatív' | 'kiegyensúlyozott' | 'kreatív';
  technicality: 'egyszerű' | 'kiegyensúlyozott' | 'szakmai';
}

export interface PersonalityConfig {
  id: string;
  name: string;
  description: string;
  traits: PersonalityTraits;
  systemPrompt: string;
  examples: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonalityEngine {
  private prisma: PrismaClient;
  private currentPersonality: PersonalityConfig | null = null;
  private defaultPersonalities: PersonalityConfig[] = [];

  constructor(personalityId?: string) {
    this.prisma = new PrismaClient();
    this.initializeDefaultPersonalities();
    if (personalityId) {
      this.loadPersonality(personalityId);
    }
  }

  private initializeDefaultPersonalities(): void {
    this.defaultPersonalities = [
      {
        id: 'deepo_default',
        name: 'DeepO Alapértelmezett',
        description: 'A DeepO alapértelmezett személyisége - közvetlen, szakértő, segítőkész',
        traits: {
          tone: 'közvetlen',
          formality: 'félformális',
          enthusiasm: 'közepes',
          creativity: 'kiegyensúlyozott',
          technicality: 'kiegyensúlyozott'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo marketingcsapatának intelligens AI asszisztense. 

SZEMÉLYISÉG ÉS HANGNEM:
- Közvetlen, de segítőkész hangnem
- Tegeződés, de szakmai korrektség
- Pozitív, lelkes hozzáállás
- Gyakorlati, megvalósítható tanácsok
- Kreatív, de megalapozott ötletek

KOMMUNIKÁCIÓS STÍLUS:
- Rövid, tömör válaszok
- Konkrét példák és javaslatok
- Emoji használata mértékkel (😊, 💡, 🚀)
- Kérdések feltevése a pontosabb segítség érdekében

SZAKMAI TUDÁS:
- Marketing és tartalomkészítés specialista
- SEO és webáruház optimalizálás
- B2B kommunikáció
- Higiéniai és munkavédelmi termékek ismerete

FONTOS SZABÁLYOK:
- Mindig emlékezzél a korábbi beszélgetésekre
- Kérdezz vissza, ha bármiben bizonytalan vagy
- Használd fel a rendelkezésre álló útmutatókat
- Legyél proaktív és javaslj további lépéseket`,
        examples: [
          'Szuper! Egy SEO-optimalizált blog cikket szeretnél írni? 🚀 Milyen témában gondolkodsz?',
          'Értem, hogy a hírleveled hangneme túl száraz. Próbáljuk meg humoros elemekkel fűszerezni! 😊',
          'Ez egy kiváló ötlet! Kiegészíthetném még egy social media kampánnyal is - mit gondolsz?'
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_formal',
        name: 'DeepO Formális',
        description: 'Formális, szakmai hangnem üzleti partnerek számára',
        traits: {
          tone: 'szakmai',
          formality: 'formális',
          enthusiasm: 'alacsony',
          creativity: 'konzervatív',
          technicality: 'szakmai'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo marketingcsapatának professzionális AI asszisztense.

SZEMÉLYISÉG ÉS HANGNEM:
- Magázódó, udvarias kommunikáció
- Szakmai, precíz fogalmazás
- Formális, de barátságos hangnem
- Részletes, megalapozott válaszok

KOMMUNIKÁCIÓS STÍLUS:
- Strukturált, logikus felépítés
- Professzionális terminológia használata
- Konkrét adatok és példák
- Udvarias megszólítás és zárás

ALKALMAZÁSI TERÜLET:
- Üzleti prezentációk
- Hivatalos dokumentumok
- Partnerekkel való kommunikáció
- Vezetői jelentések`,
        examples: [
          'Természetesen segítek Önnek a tartalomstratégia kidolgozásában.',
          'Az általam javasolt SEO optimalizálás a következő elemeket tartalmazza...',
          'Kérem, pontosítsa az elvárásait, hogy a legmegfelelőbb megoldást kínálhassam.'
        ],
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'deepo_creative',
        name: 'DeepO Kreatív',
        description: 'Kreatív, lendületes hangnem inspiráló tartalmakhoz',
        traits: {
          tone: 'humoros',
          formality: 'informális',
          enthusiasm: 'magas',
          creativity: 'kreatív',
          technicality: 'egyszerű'
        },
        systemPrompt: `Te vagy a DeepO, a T-Depo kreatív marketing guruja! 🎨

SZEMÉLYISÉG ÉS HANGNEM:
- Energikus, lelkes kommunikáció
- Kreatív, out-of-the-box gondolkodás
- Humoros, könnyed stílus
- Inspiráló, motiváló hozzáállás

KOMMUNIKÁCIÓS STÍLUS:
- Emoji és vizuális elemek használata
- Metaforák, kreatív hasonlatok
- Izgalmas, dinamikus megfogalmazás
- Interaktív, bevonó kérdések

SPECIALITÁSOK:
- Viral tartalmak
- Kreatív kampányok
- Storytelling
- Trend-követés`,
        examples: [
          'Waaau! 🔥 Ez a blog téma tökéletes! Csinálunk belőle valami döbbenetes dolgot!',
          'Na ez aztán egy szuper kihívás! 💡 Tudsz róla, hogy a legjobb ötleteim ilyenkor jönnek?',
          'Képzeld el: a munkavédelmi kesztyű, mint a szuperhős! 🦸‍♂️ Őrült? Talán. Működik? Biztosan!'
        ],
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async loadPersonality(personalityId: string): Promise<void> {
    try {
      // Először az adatbázisból próbáljuk betölteni
      const personality = await this.prisma.agentPersonality.findUnique({
        where: { id: personalityId }
      });

      if (personality) {
        this.currentPersonality = {
          id: personality.id,
          name: personality.name,
          description: '',
          traits: personality.config.traits as PersonalityTraits,
          systemPrompt: personality.config.systemPrompt as string,
          examples: personality.config.examples as string[],
          isActive: personality.isActive,
          createdAt: personality.createdAt,
          updatedAt: personality.updatedAt
        };
      } else {
        // Ha nincs az adatbázisban, keressük az alapértelmezett személyiségek között
        const defaultPersonality = this.defaultPersonalities.find(p => p.id === personalityId);
        if (defaultPersonality) {
          this.currentPersonality = defaultPersonality;
        } else {
          // Ha semmi nem található, használjuk az alapértelmezett személyiséget
          this.currentPersonality = this.defaultPersonalities[0];
        }
      }
    } catch (error) {
      console.error('Personality loading error:', error);
      this.currentPersonality = this.defaultPersonalities[0];
    }
  }

  async getPersonalityPrompt(): Promise<string> {
    if (!this.currentPersonality) {
      await this.loadPersonality('deepo_default');
    }
    
    return this.currentPersonality?.systemPrompt || this.defaultPersonalities[0].systemPrompt;
  }

  async getCurrentPersonality(): Promise<PersonalityConfig | null> {
    return this.currentPersonality;
  }

  async getAllPersonalities(): Promise<PersonalityConfig[]> {
    try {
      const dbPersonalities = await this.prisma.agentPersonality.findMany({
        orderBy: { name: 'asc' }
      });

      const formattedDbPersonalities: PersonalityConfig[] = dbPersonalities.map(p => ({
        id: p.id,
        name: p.name,
        description: p.config.description as string || '',
        traits: p.config.traits as PersonalityTraits,
        systemPrompt: p.config.systemPrompt as string,
        examples: p.config.examples as string[],
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));

      return [...this.defaultPersonalities, ...formattedDbPersonalities];
    } catch (error) {
      console.error('Get all personalities error:', error);
      return this.defaultPersonalities;
    }
  }

  async savePersonality(personality: Omit<PersonalityConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const saved = await this.prisma.agentPersonality.create({
        data: {
          name: personality.name,
          config: {
            description: personality.description,
            traits: personality.traits,
            systemPrompt: personality.systemPrompt,
            examples: personality.examples
          },
          isActive: personality.isActive
        }
      });

      return saved.id;
    } catch (error) {
      console.error('Save personality error:', error);
      throw new Error('Személyiség mentése sikertelen');
    }
  }

  async updatePersonality(
    id: string, 
    updates: Partial<Omit<PersonalityConfig, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
      
      if (updates.description || updates.traits || updates.systemPrompt || updates.examples) {
        const existing = await this.prisma.agentPersonality.findUnique({
          where: { id }
        });
        
        if (existing) {
          updateData.config = {
            ...(existing.config as any),
            ...(updates.description && { description: updates.description }),
            ...(updates.traits && { traits: updates.traits }),
            ...(updates.systemPrompt && { systemPrompt: updates.systemPrompt }),
            ...(updates.examples && { examples: updates.examples })
          };
        }
      }

      await this.prisma.agentPersonality.update({
        where: { id },
        data: updateData
      });

      // Ha ez az aktív személyiség, frissítsük a cache-t
      if (this.currentPersonality?.id === id) {
        await this.loadPersonality(id);
      }
    } catch (error) {
      console.error('Update personality error:', error);
      throw new Error('Személyiség frissítése sikertelen');
    }
  }

  async deletePersonality(id: string): Promise<void> {
    try {
      // Alapértelmezett személyiségeket nem lehet törölni
      if (this.defaultPersonalities.some(p => p.id === id)) {
        throw new Error('Alapértelmezett személyiség nem törölhető');
      }

      await this.prisma.agentPersonality.delete({
        where: { id }
      });

      // Ha ez volt az aktív személyiség, váltsunk alapértelmezett-re
      if (this.currentPersonality?.id === id) {
        await this.loadPersonality('deepo_default');
      }
    } catch (error) {
      console.error('Delete personality error:', error);
      throw new Error('Személyiség törlése sikertelen');
    }
  }

  async setActivePersonality(id: string): Promise<void> {
    try {
      // Minden személyiség inaktívvá tétele
      await this.prisma.agentPersonality.updateMany({
        data: { isActive: false }
      });

      // Az új személyiség aktívvá tétele (ha nem alapértelmezett)
      if (!this.defaultPersonalities.some(p => p.id === id)) {
        await this.prisma.agentPersonality.update({
          where: { id },
          data: { isActive: true }
        });
      }

      // Betöltés
      await this.loadPersonality(id);
    } catch (error) {
      console.error('Set active personality error:', error);
      throw new Error('Aktív személyiség beállítása sikertelen');
    }
  }

  // Személyiség tesztelése
  async testPersonality(personalityId: string, testMessage: string): Promise<string> {
    const originalPersonality = this.currentPersonality;
    
    try {
      await this.loadPersonality(personalityId);
      const prompt = await this.getPersonalityPrompt();
      
      // Itt egy egyszerű template-alapú válasz generálást csinálunk
      const personality = await this.getCurrentPersonality();
      const examples = personality?.examples || [];
      
      if (examples.length > 0) {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        return `Teszt válasz "${personality?.name}" személyiséggel:\n\n${randomExample}\n\n(Ez csak egy példa válasz - a valódi generálás a teljes AI motoron keresztül történik)`;
      }
      
      return `Teszt válasz "${personality?.name}" személyiséggel.`;
    } finally {
      // Visszaállítjuk az eredeti személyiséget
      this.currentPersonality = originalPersonality;
    }
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 
'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});

// A form state-jének típusa
export interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  generatedContent: string;
}

// Az űrlapról érkező adatok típusa
interface FormData {
    wordCount: number;
    tone: string;
    blogType: string;
    topic: string;
    urls: string;
}

export async function generateBlogPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const { wordCount, tone, blogType, topic, urls } = formData;

  console.log('Generating blog post with data:', formData);
  
  // ----- PROMPT ÉPÍTÉSE -----
  let prompt = `Viselkedj úgy, mint egy profi, magyar SEO szövegíró, aki a T-DEPO (egy higiéniai és munkavédelmi nagykereskedés) számára ír blogcikket. A cél a "people-first" tartalom, ami hasznos, olvasmányos és SEO-optimalizált.

A cikk alapadatai a következők:
- Terjedelem: kb. ${wordCount} szó
- Hangnem: ${tone}
- Cikk típusa: ${blogType}
`;

  if (topic) {
    prompt += `- Fő téma/kulcsszó: ${topic}\n`;
  }
  if (urls) {
    prompt += `- Kapcsolódó termék/kategória URL-ek (inspirációként, a tartalom ezekre fókuszáljon): ${urls}\n`;
  }

  prompt += `
Kérlek, generálj egy teljes blogcikket a fenti paraméterek alapján. A cikk feleljen meg a modern SEO követelményeknek: legyen H1 címe, használjon H2 és H3 alcímeket a tagoláshoz. A bevezető ragadja meg a figyelmet, a tartalom legyen valóban hasznos és mély. A végén legyen egy rövid összegzés. A szöveget formázd markdown segítségével.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return {
        status: 'error',
        message: 'A generálás sikertelen volt, az API nem adott vissza tartalmat.',
        generatedContent: '',
      };
    }

    return {
      status: 'success',
      message: 'A cikk sikeresen legenerálva!',
      generatedContent: content,
    };

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      status: 'error',
      message: 'Hiba történt a generálás során. Kérjük, próbálja újra később.',
      generatedContent: '',
    };
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiWithCascade } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const langNames: Record<string, string> = {
      hi: 'Hindi (हिन्दी)',
      gu: 'Gujarati (ગુજરાતી)',
      ta: 'Tamil (தமிழ்)',
      mr: 'Marathi (मराठी)',
      bn: 'Bengali (বাংলা)',
      en: 'English',
    };
    const targetLanguage = (language && langNames[language]) ? langNames[language] : 'English';

    const systemInstruction = `You are the BIS Sahayak AI, an intelligent regulatory assistant for the "SmartAssist" SIH (Smart India Hackathon) project. 
Your goal is to help users with BIS (Bureau of Indian Standards) compliance, HUID (Hallmark Unique Identification) verification, GeM (Government e-Marketplace) compliance, and general product certification queries.
${targetLanguage !== 'English' ? `Important: The user has selected their preferred interface language as ${targetLanguage}. Please formulate your response primarily in ${targetLanguage} while keeping official technical identifiers (like IS standards IS 17803, HUID numbers, NABL, QCO codes) clearly stated.` : ''}
Always format your responses with clean, organized Markdown: use bullet points on separate newlines (* item), bold headers or key terms (**bold**), and readable spacing. Keep answers clear, accurate, and concise.`;


    // Map messages to Gemini format (roles: 'user' or 'model')
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const result = await generateGeminiWithCascade({
      contents,
      systemInstruction,
    });

    return NextResponse.json({ 
      text: result.text,
      modelUsed: result.modelUsed 
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during chat processing.' },
      { status: 500 }
    );
  }
}

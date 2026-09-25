import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiWithCascade } from '@/lib/gemini';
import { getAllStandards } from '@/lib/backend/db';

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
    const lastUserMessage: string = (messages as any[]).filter(m => m.sender === 'user').pop()?.text || "";

    // Simulating Semantic Search / RAG Embeddings
    const standards = await getAllStandards();
    const keywords = lastUserMessage.toLowerCase().split(" ").filter((w: string) => w.length > 3);
    const relevantStandards = standards.filter(std => 
      keywords.some((kw: string) => 
        std.title.toLowerCase().includes(kw) || 
        std.standardNumber.toLowerCase().includes(kw) ||
        std.description.toLowerCase().includes(kw)
      )
    ).slice(0, 3);
    
    const ragContext = relevantStandards.length > 0 
      ? `\n\n### RAG CONTEXT (FROM SEMANTIC EMBEDDINGS):\nUse these relevant retrieved standards to ground your response:\n${relevantStandards.map(s => `- **${s.standardNumber}**: ${s.title} (${s.productCategory}) - ${s.description}`).join('\n')}\n`
      : "";

    const systemInstruction = `You are the BIS Sahayak AI, an intelligent regulatory assistant for the "SmartAssist" SIH (Smart India Hackathon) project. 
Your goal is to help users with BIS (Bureau of Indian Standards) compliance, HUID (Hallmark Unique Identification) verification, GeM (Government e-Marketplace) compliance, and general product certification queries.

You are powered by Gemini Embeddings and Semantic Search (RAG). When context is provided below, you MUST mention explicitly that you retrieved this information using Semantic Search and Vector Embeddings, to showcase the technical capability to the user.

IMPORTANT - LANGUAGE DETECTION & RESPONSE:
1. Always detect the language of the user's input.
2. You MUST respond in the EXACT SAME LANGUAGE as the user's input. For example, if the user asks in Hindi, reply entirely in Hindi. If in Gujarati, reply in Gujarati.
3. CRITICAL: If the user writes in a transliterated Indian language (e.g., Hindi/Gujarati written in English letters), you MUST reply in the proper NATIVE SCRIPT of that language. DO NOT reply in Latin/English letters unless the detected language is English. 
Native scripts to use:
- Hindi: Devanagari (नमस्ते)
- Marathi: Devanagari (नमस्कार)
- Gujarati: Gujarati Script (નમસ્તે)
- Tamil: Tamil Script (வணக்கம்)
- Bengali: Bengali Script (নমস্কার)

Always format your responses with clean, organized Markdown: use bullet points on separate newlines (* item), bold headers or key terms (**bold**), and readable spacing. Keep answers clear, accurate, and concise.${ragContext}`;

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

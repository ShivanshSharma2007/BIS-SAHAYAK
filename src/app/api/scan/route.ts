import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { searchStandards } from '@/lib/db';
import { generateGeminiWithCascade } from '@/lib/gemini';

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    product_type: {
      type: Type.STRING,
      description: "The name or category of the product identified in the image."
    },
    standard_number: {
      type: Type.STRING,
      description: "The probable BIS Indian Standard number (e.g., 'IS 1293:2005') applicable to this product type."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score from 0.0 to 1.0 that this standard is correct."
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation of why this standard applies to the detected product."
    }
  },
  required: ["product_type", "standard_number", "confidence", "reasoning"]
};

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    // Convert File to Base64
    const buffer = await image.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Call Gemini with multi-model cascade
    const cascadeResult = await generateGeminiWithCascade({
      contents: [
        {
          role: 'user',
          parts: [
            { text: "You are a BIS (Bureau of Indian Standards) compliance expert. Analyze this image. Identify the product and determine the most likely Indian Standard (IS) that applies to it. If you are unsure, make your best guess for the broad category standard." },
            { inlineData: { data: base64Data, mimeType: image.type } }
          ]
        }
      ],
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    });

    const resultText = cascadeResult.text;
    if (!resultText) {
      throw new Error("Gemini returned an empty response.");
    }
    
    const parsedResult = JSON.parse(resultText);

    // Try to match the standard from our DB
    const dbMatch = await searchStandards(parsedResult.standard_number);
    const matchedStandard = dbMatch.length > 0 ? dbMatch[0] : null;

    return NextResponse.json({ 
      success: true, 
      analysis: parsedResult,
      dbStandard: matchedStandard 
    });

  } catch (error: unknown) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Scan failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyIdentifier } from "@/lib/backend/db";
import { translateJSON } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query?.trim();
    const language = body.language;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Identifier query is required (e.g. 6-digit HUID, CM/L license, or IS standard)" },
        { status: 400 }
      );
    }

    let verificationResult = await verifyIdentifier(query);
    
    // Translate the result if language is provided and not English
    if (language && language.toLowerCase() !== 'english' && language.toLowerCase() !== 'en') {
        verificationResult = await translateJSON(verificationResult, language);
    }

    return NextResponse.json({
      success: true,
      result: verificationResult
    });
  } catch (error: any) {
    console.error("Fraud Radar API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify identifier" },
      { status: 500 }
    );
  }
}

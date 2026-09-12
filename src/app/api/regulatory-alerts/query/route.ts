import { NextRequest, NextResponse } from "next/server";
import { REGULATORY_ALERTS } from "@/data/regulatoryAlertsData";
import { generateGeminiWithCascade } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Format current regulatory alerts context
    const alertsContext = REGULATORY_ALERTS.map(a => 
      `- [${a.impact}] ${a.title} (${a.date})
  Category: ${a.category} | Standard: ${a.standard || "N/A"} | Order: ${a.orderNo}
  Summary: ${a.description}`
    ).join("\n\n");

    const systemInstruction = `You are the Regulatory Delta AI Specialist for the Bureau of Indian Standards (BIS) SmartAssist platform.
You have immediate access to the official live Gazette feed of Indian Standards amendments, QCOs, and CRS notices:

=== LIVE REGULATORY DELTA FEED ===
${alertsContext}
==================================

When answering questions:
1. Ground your answer in the real Indian Standards (IS), Gazette orders, and Ministry notices listed above.
2. Clearly highlight compliance deadlines, testing protocols, and impacted product categories.
3. Keep the response concise, authoritative, and structured using clean Markdown bullet points.`;

    const result = await generateGeminiWithCascade({
      contents: [{ role: "user", parts: [{ text: query }] }],
      systemInstruction
    });

    return NextResponse.json({
      success: true,
      answer: result.text,
      modelUsed: result.modelUsed
    });
  } catch (error: any) {
    console.error("Regulatory AI Query Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI query" },
      { status: 500 }
    );
  }
}

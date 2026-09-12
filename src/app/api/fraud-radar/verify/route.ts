import { NextRequest, NextResponse } from "next/server";
import { verifyIdentifier } from "@/lib/backend/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Identifier query is required (e.g. 6-digit HUID, CM/L license, or IS standard)" },
        { status: 400 }
      );
    }

    const verificationResult = await verifyIdentifier(query);

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

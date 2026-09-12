import { NextRequest, NextResponse } from "next/server";
import { getStandards } from "@/lib/backend/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const scheme = searchParams.get("scheme") || undefined;
    const status = searchParams.get("status") || undefined;

    const standards = await getStandards({ search, category, scheme, status });

    return NextResponse.json({
      success: true,
      count: standards.length,
      standards
    });
  } catch (error: any) {
    console.error("Standards API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch standards" },
      { status: 500 }
    );
  }
}

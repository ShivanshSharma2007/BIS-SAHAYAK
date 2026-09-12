import { NextRequest, NextResponse } from "next/server";
import { getStandardById } from "@/lib/backend/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const standard = await getStandardById(id);

    if (!standard) {
      return NextResponse.json(
        { success: false, error: `Standard not found with ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      standard
    });
  } catch (error: any) {
    console.error("Get Standard Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch standard details" },
      { status: 500 }
    );
  }
}

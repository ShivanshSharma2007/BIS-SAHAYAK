import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/backend/db";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}

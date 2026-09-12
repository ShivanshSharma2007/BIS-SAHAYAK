import { NextRequest, NextResponse } from "next/server";
import { REGULATORY_ALERTS, RegulatoryAlert } from "@/data/regulatoryAlertsData";

// In-memory feed for runtime additions
let alertsFeed: RegulatoryAlert[] = [...REGULATORY_ALERTS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const impact = searchParams.get("impact");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();

    let filtered = [...alertsFeed];

    if (impact && impact !== "ALL") {
      filtered = filtered.filter(a => a.severity.toLowerCase() === impact.toLowerCase() || a.impact.toLowerCase().includes(impact.toLowerCase()));
    }

    if (category && category !== "ALL") {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        (a.standard && a.standard.toLowerCase().includes(search)) ||
        a.orderNo.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      alerts: filtered,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch regulatory alerts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const newAlert: RegulatoryAlert = {
      id: `alert-${Date.now()}`,
      impact: body.impact || "MEDIUM IMPACT",
      severity: body.severity || "medium",
      isNew: true,
      date: new Date().toISOString().split("T")[0],
      title: body.title,
      description: body.description,
      orderNo: body.orderNo || `CG-DL-E-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-N09`,
      category: body.category || "General Regulatory",
      standard: body.standard || null,
      sourceUrl: body.sourceUrl || "https://www.bis.gov.in"
    };

    alertsFeed.unshift(newAlert);

    return NextResponse.json({
      success: true,
      message: "Alert created successfully",
      alert: newAlert
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

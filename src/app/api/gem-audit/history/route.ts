import { NextRequest, NextResponse } from "next/server";
import { getGeMAuditHistory, saveGeMAuditRun } from "@/lib/backend/db";

export async function GET() {
  try {
    const history = await getGeMAuditHistory();
    return NextResponse.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error: any) {
    console.error("GeM Audit History Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch audit history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      tenderId,
      bidNumber,
      tenderTitle,
      buyerName,
      vendorName,
      gstin,
      bisLicense,
      localContent,
      isMSME,
      status,
      riskScore,
      evaluatedClausesCount,
      clausesPassedCount,
      summary
    } = body;

    if (!bidNumber || !vendorName || !status) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory fields: bidNumber, vendorName, status" },
        { status: 400 }
      );
    }

    const savedRecord = await saveGeMAuditRun({
      tenderId: tenderId || "gem-tender-unknown",
      bidNumber,
      tenderTitle: tenderTitle || "GeM Public Procurement",
      buyerName: buyerName || "Government Buyer",
      vendorName,
      gstin: gstin || "UNREGISTERED",
      bisLicense: bisLicense || "NONE",
      localContent: Number(localContent) || 0,
      isMSME: Boolean(isMSME),
      status: status === "QUALIFIED" ? "QUALIFIED" : "DISQUALIFIED",
      riskScore: Number(riskScore) || 0,
      evaluatedClausesCount: Number(evaluatedClausesCount) || 0,
      clausesPassedCount: Number(clausesPassedCount) || 0,
      summary: summary || "Automated pre-bid evaluation"
    });

    return NextResponse.json({
      success: true,
      audit: savedRecord
    }, { status: 201 });
  } catch (error: any) {
    console.error("Save Audit Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to persist audit run" },
      { status: 500 }
    );
  }
}

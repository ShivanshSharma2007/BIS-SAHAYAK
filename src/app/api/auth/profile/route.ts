import { NextRequest, NextResponse } from "next/server";

export interface OfficerProfile {
  id: string;
  name: string;
  avatarInitial: string;
  designation: string;
  department: string;
  ministry: string;
  badgeNumber: string;
  region: string;
  email: string;
  phone: string;
  clearanceLevel: string;
  activeRole: "OFFICER" | "AUDITOR" | "LAB_ASSESSOR";
  availableRoles: { id: "OFFICER" | "AUDITOR" | "LAB_ASSESSOR"; label: string; desc: string }[];
  stats: {
    auditsConducted: number;
    licensesVerified: number;
    activeInvestigations: number;
    standardsMonitored: number;
  };
  lastLogin: string;
}

// In-memory officer session state
let officerProfileStore: OfficerProfile = {
  id: "BIS-OFF-89412",
  name: "Aditya Sharma",
  avatarInitial: "A",
  designation: "Sr. Regulatory Compliance Officer (Gr-I)",
  department: "Central Marks Department-I (CMD-I)",
  ministry: "Ministry of Consumer Affairs, Food & Public Distribution",
  badgeNumber: "BIS/HQ/2026/0894",
  region: "HQ New Delhi · Northern Region",
  email: "a.sharma@bis.gov.in",
  phone: "+91 11 2323 0131",
  clearanceLevel: "Level-3 Statutory Enforcement",
  activeRole: "OFFICER",
  availableRoles: [
    { id: "OFFICER", label: "BIS Compliance Officer", desc: "Statutory market surveillance & QCO enforcement" },
    { id: "AUDITOR", label: "GeM Pre-Bid Auditor", desc: "Procurement tender clause verification & OEM checks" },
    { id: "LAB_ASSESSOR", label: "NABL Technical Assessor", desc: "Testing lab accreditation scope inspection" }
  ],
  stats: {
    auditsConducted: 48,
    licensesVerified: 142,
    activeInvestigations: 3,
    standardsMonitored: 648
  },
  lastLogin: new Date().toISOString()
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      profile: officerProfileStore
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch officer profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activeRole, region } = body;

    if (activeRole && ["OFFICER", "AUDITOR", "LAB_ASSESSOR"].includes(activeRole)) {
      officerProfileStore.activeRole = activeRole;
    }

    if (region) {
      officerProfileStore.region = region;
    }

    return NextResponse.json({
      success: true,
      message: "Officer profile updated successfully",
      profile: officerProfileStore
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

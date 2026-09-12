import { NextRequest, NextResponse } from "next/server";
import { LABS_DIRECTORY } from "@/data/labsDirectoryData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { labId, applicantName, companyName, email, phone, productName, standardNumber, urgency } = body;

    if (!applicantName || !email || !productName || !standardNumber) {
      return NextResponse.json(
        { success: false, error: "Applicant name, email, product name, and standard number are required." },
        { status: 400 }
      );
    }

    const lab = LABS_DIRECTORY.find(l => l.id === labId) || LABS_DIRECTORY[0];

    const estimatedDays = urgency === "express" ? "3-5 Business Days" : lab.leadTime;
    const bookingRef = `TEST-REQ-${Date.now().toString().slice(-6)}`;
    
    // Calculate dispatch deadline (e.g. 5 days from today)
    const dispatchDeadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const testTicket = {
      ticketId: bookingRef,
      status: "SLOT_CONFIRMED",
      lab: {
        id: lab.id,
        name: lab.name,
        city: lab.city,
        address: lab.address,
        accreditationNo: lab.accreditationNo
      },
      applicant: {
        applicantName,
        companyName: companyName || "N/A",
        email,
        phone: phone || "N/A"
      },
      sampleDetails: {
        productName,
        standardNumber,
        urgency: urgency || "standard",
        estimatedTurnaround: estimatedDays,
        dispatchDeadline
      },
      instructions: [
        "Pack 3 production-grade samples securely with tamper-evident seal.",
        `Clearly write Ticket ID ${bookingRef} on the external package.`,
        `Courier address: ${lab.address}`,
        "Include factory test checklist and technical product manual."
      ],
      createdAt: new Date().toISOString()
    };

    console.log("[Sample Test Request Booked]:", testTicket);

    return NextResponse.json({
      success: true,
      message: "Sample testing slot successfully reserved with NABL lab!",
      ticket: testTicket
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process testing booking" },
      { status: 500 }
    );
  }
}

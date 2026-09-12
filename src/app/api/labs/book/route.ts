import { NextRequest, NextResponse } from "next/server";
import { createTestBooking } from "@/lib/backend/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { applicantName, companyName, email, phone, productName, standardNumber, urgency, labId } = body;

    if (!applicantName || !email || !productName || !standardNumber || !labId) {
      return NextResponse.json(
        { success: false, error: "Required booking fields: applicantName, email, productName, standardNumber, labId" },
        { status: 400 }
      );
    }

    const booking = await createTestBooking({
      applicantName,
      companyName: companyName || "",
      email,
      phone: phone || "",
      productName,
      standardNumber,
      urgency: urgency === "express" ? "express" : "standard",
      labId
    });

    return NextResponse.json({
      success: true,
      message: `Test Request ${booking.ticketNumber} registered successfully.`,
      booking
    }, { status: 201 });
  } catch (error: any) {
    console.error("Test Booking API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process test booking" },
      { status: 500 }
    );
  }
}

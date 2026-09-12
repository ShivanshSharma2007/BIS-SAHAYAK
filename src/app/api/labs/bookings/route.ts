import { NextRequest, NextResponse } from "next/server";
import { getTestBookings, getTestBookingByTicket } from "@/lib/backend/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get("ticket");

    if (ticket) {
      const booking = await getTestBookingByTicket(ticket);
      if (!booking) {
        return NextResponse.json(
          { success: false, error: `Booking with ticket ${ticket} not found` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, booking });
    }

    const bookings = await getTestBookings();
    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch test bookings" },
      { status: 500 }
    );
  }
}

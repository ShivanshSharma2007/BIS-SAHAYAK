import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, alertType, categories } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address or device push token is required" },
        { status: 400 }
      );
    }

    // In a production app, save to PostgreSQL / Supabase
    const subscriptionRecord = {
      subscriptionId: `SUB-${Date.now().toString().slice(-6)}`,
      email,
      alertType: alertType || "ALL_HIGH_IMPACT",
      categories: categories || ["Electronics & IT", "Batteries", "Electrical Equipment"],
      status: "ACTIVE",
      subscribedAt: new Date().toISOString()
    };

    console.log("[Push Alert Subscription Active]:", subscriptionRecord);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to Regulatory Delta Push Alerts!",
      subscription: subscriptionRecord
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process subscription" },
      { status: 500 }
    );
  }
}

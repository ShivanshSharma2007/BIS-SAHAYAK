import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

import { LocalDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, isSignUp } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await LocalDB.findUserByEmail(cleanEmail);

    if (!isSignUp && !existingUser) {
      return NextResponse.json({ 
        error: "No account found with this email. Please click Sign Up to register first." 
      }, { status: 404 });
    }

    if (isSignUp && existingUser) {
      return NextResponse.json({ 
        error: "An account with this email already exists. Please click Sign In." 
      }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with a 5-minute expiration (300 seconds)
    const redisKey = `otp:${cleanEmail}`;
    await redis.setex(redisKey, 300, otp);

    const hasValidGmail =
      process.env.GMAIL_USER &&
      process.env.GMAIL_PASS &&
      !process.env.GMAIL_USER.includes("your-email") &&
      !process.env.GMAIL_PASS.includes("your-app-password");

    if (hasValidGmail) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"BIS Sahayak" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Your BIS Sahayak OTP Code',
          text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
              <h2 style="color: #0c2461; text-align: center;">BIS Sahayak Portal</h2>
              <p>Hello,</p>
              <p>Please use the following One-Time Password (OTP) to securely access your account:</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af;">${otp}</span>
              </div>
              <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in 5 minutes.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you did not request this OTP, please ignore this email.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.warn("[MAIL] Failed to send via Gmail, falling back to local OTP:", mailErr);
      }
    } else {
      console.log(`[DEV MODE - NO GMAIL CONFIG] OTP for ${email} is: ${otp}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      devOtp: hasValidGmail ? undefined : otp 
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

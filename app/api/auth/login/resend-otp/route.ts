import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { hashPassword, verifyOtpChallengeToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { generateOtpCode, sendLoginOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`resend_otp_${clientIp}`, { windowSeconds: 60, maxRequests: 3 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateLimit.resetSeconds} seconds before requesting a new code.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetSeconds) } }
      );
    }

    await connectDB();
    const body = await req.json();
    const { tempToken } = body;

    if (!tempToken) {
      return NextResponse.json({ error: "Verification session token is required." }, { status: 400 });
    }

    const payload = verifyOtpChallengeToken(tempToken);
    if (!payload || !payload.email || !payload.userId) {
      return NextResponse.json(
        { error: "Verification session expired. Please sign in again with your password." },
        { status: 401 }
      );
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    const user = await (User as any).findById(payload.userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Generate fresh OTP code
    const otp = generateOtpCode();
    const otpHash = await hashPassword(otp);

    await (Otp as any).deleteMany({ email: normalizedEmail, purpose: "login" });
    await (Otp as any).create({
      email: normalizedEmail,
      otpHash,
      purpose: "login",
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendLoginOtpEmail({
      to: user.email,
      otp,
      name: user.name,
    });

    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    return NextResponse.json({
      success: true,
      message: hasSmtp 
        ? "A fresh verification code has been dispatched to your email."
        : "A fresh verification code has been generated.",
      smtpConfigured: hasSmtp,
      devOtp: !hasSmtp ? otp : undefined,
    });
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ error: err.message || "Failed to resend verification code" }, { status: 500 });
  }
}

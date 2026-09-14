import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { comparePassword, signToken, verifyOtpChallengeToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`verify_otp_${clientIp}`, { windowSeconds: 60, maxRequests: 15 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please try again in ${rateLimit.resetSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetSeconds) } }
      );
    }

    await connectDB();
    const body = await req.json();
    const { tempToken, otp } = body;

    if (!tempToken || !otp) {
      return NextResponse.json({ error: "Verification token and 6-digit code are required." }, { status: 400 });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json({ error: "Please enter a valid 6-digit numeric code." }, { status: 400 });
    }

    // 1. Verify the challenge token
    const payload = verifyOtpChallengeToken(tempToken);
    if (!payload || !payload.email || !payload.userId) {
      return NextResponse.json(
        { error: "Verification session has expired. Please sign in again with your password." },
        { status: 401 }
      );
    }

    // 2. Fetch OTP record
    const normalizedEmail = payload.email.toLowerCase().trim();
    const otpRecord = await (Otp as any).findOne({
      email: normalizedEmail,
      purpose: "login",
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Verification code has expired or was already used. Please request a new code." },
        { status: 400 }
      );
    }

    // 3. Check attempt limit to prevent brute force
    if (otpRecord.attempts >= 5) {
      await (Otp as any).deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: "Too many failed attempts. For your security, this code has been revoked. Please sign in again." },
        { status: 429 }
      );
    }

    // 4. Verify OTP hash
    const isMatch = await comparePassword(cleanOtp, otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const attemptsLeft = 5 - otpRecord.attempts;
      return NextResponse.json(
        {
          error: `Incorrect verification code. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
        },
        { status: 400 }
      );
    }

    // 5. Verification successful -> consume OTP and issue full user session
    await (Otp as any).deleteOne({ _id: otpRecord._id });

    const user = await (User as any).findById(payload.userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("OTP verification error:", err);
    return NextResponse.json({ error: err.message || "Failed to verify code" }, { status: 500 });
  }
}

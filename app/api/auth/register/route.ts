import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { hashPassword, signOtpChallengeToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { generateOtpCode, sendLoginOtpEmail, maskEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`register_${clientIp}`, { windowSeconds: 300, maxRequests: 8 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rateLimit.resetSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetSeconds) } }
      );
    }

    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Full Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await (User as any).findOne({ email: normalizedEmail });
    const passwordHash = await hashPassword(password);

    if (user) {
      if (user.emailVerified) {
        return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
      }
      // If user exists but is not verified, update profile & resend fresh OTP
      user.name = name.trim();
      user.passwordHash = passwordHash;
      await user.save();
    } else {
      user = await (User as any).create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "admin",
        emailVerified: false,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      });
    }

    // Generate 6-digit OTP code for email verification
    const otp = generateOtpCode();
    const otpHash = await hashPassword(otp);

    // Save/refresh OTP record with 10-minute expiration
    await (Otp as any).deleteMany({ email: normalizedEmail, purpose: "login" });
    await (Otp as any).create({
      email: normalizedEmail,
      otpHash,
      purpose: "login",
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send verification email
    await sendLoginOtpEmail({
      to: user.email,
      otp,
      name: user.name,
      purpose: "registration",
    });

    // Sign a temporary OTP challenge token
    const tempToken = signOtpChallengeToken({
      userId: user._id.toString(),
      email: user.email,
      type: "login_otp",
    });

    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      tempToken,
      email: user.email,
      maskedEmail: maskEmail(user.email),
      message: `A 6-digit verification code was sent to ${maskEmail(user.email)}. Please verify your email to activate your account.`,
      smtpConfigured: hasSmtp,
      devOtp: !hasSmtp ? otp : undefined,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to register account" }, { status: 500 });
  }
}
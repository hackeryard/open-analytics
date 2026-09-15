import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { ensureDefaultProject } from "@/lib/seed";
import { comparePassword, hashPassword, signOtpChallengeToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { generateOtpCode, sendLoginOtpEmail } from "@/lib/email";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  const visiblePrefix = local.slice(0, 2);
  const visibleSuffix = local.slice(-1);
  return `${visiblePrefix}${"*".repeat(Math.min(4, Math.max(1, local.length - 3)))}${visibleSuffix}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`login_${clientIp}`, { windowSeconds: 60, maxRequests: 10 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${rateLimit.resetSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetSeconds) } }
      );
    }

    await connectDB();
    await ensureDefaultProject(); // Guarantees super admin seed is initialized

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await (User as any).findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 1. If user is already verified (or super_admin), log them in directly with NO OTP
    const isVerified = Boolean(user.emailVerified) || user.role === "super_admin";

    if (isVerified) {
      const { signToken, SESSION_COOKIE_NAME } = await import("@/lib/auth");
      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const response = NextResponse.json({
        success: true,
        requiresOtp: false,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          emailVerified: true,
        },
        message: "Signed in successfully",
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
    }

    // 2. User is NOT verified yet -> require OTP verification before allowing signin
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
      purpose: "verification",
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
      message: `Your account is not verified yet. A 6-digit verification code was sent to ${maskEmail(user.email)}.`,
      smtpConfigured: hasSmtp,
      devOtp: !hasSmtp ? otp : undefined,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message || "Failed to initiate login" }, { status: 500 });
  }
}
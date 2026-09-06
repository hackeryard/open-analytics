import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { hashPassword, signToken, SESSION_COOKIE_NAME, generateProjectId, generateApiKey } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

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
    const { name, email, password, role } = body;

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
    const existing = await (User as any).findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Check if this is the very first user in the database
    const totalUsers = await (User as any).countDocuments();
    const assignedRole = totalUsers === 0 ? "super_admin" : (role === "admin" || role === "member" ? role : "admin");

    const passwordHash = await hashPassword(password);
    const user = await (User as any).create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
    });

    // Auto-create initial project with unique ID
    const uniqueProjectId = generateProjectId("pulse_prj_");
    const projectSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-app";
    const initialProject = await (Project as any).create({
      projectId: uniqueProjectId,
      name: `${name.trim()}'s Application`,
      slug: projectSlug || "my-web-app",
      ownerId: user._id,
      publishableKey: generateApiKey("pk"),
      secretKey: generateApiKey("sk"),
      allowedDomains: ["*"],
      settings: {
        ipAnonymization: true,
        piiRedaction: true,
        seoTracking: true,
        aiTracking: true,
        dataRetentionDays: 365,
        enabledModules: ["core", "rum", "behavioral", "errors", "seo", "ai_aeo"],
      },
    });

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
      project: {
        projectId: initialProject.projectId,
        name: initialProject.name,
        slug: initialProject.slug,
        publishableKey: initialProject.publishableKey,
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
    console.error("Registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to register account" }, { status: 500 });
  }
}
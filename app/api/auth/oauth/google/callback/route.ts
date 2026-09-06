import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { signToken, SESSION_COOKIE_NAME, generateProjectId, generateApiKey } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const redirectUri = `${appUrl}/api/auth/oauth/google/callback`;

  if (errorParam || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorParam || "google_auth_cancelled")}`, req.url));
  }

  // 1. Verify CSRF state against cookie
  const savedState = req.cookies.get("pulse_oauth_state")?.value;
  if (!savedState || !state || savedState !== state) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured&provider=google", req.url));
  }

  try {
    // 2. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=google_token_exchange_failed", req.url));
    }

    // 3. Fetch user profile from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();
    if (!userinfoResponse.ok || !profile.email) {
      console.error("Google userinfo error:", profile);
      return NextResponse.redirect(new URL("/login?error=google_profile_fetch_failed", req.url));
    }

    await connectDB();

    const normalizedEmail = profile.email.toLowerCase().trim();
    let user = await (User as any).findOne({ email: normalizedEmail });

    if (user) {
      // Existing user: Link Google provider details
      user.authProvider = user.authProvider || "google";
      user.authProviderId = profile.id;
      user.emailVerified = true;
      if (!user.avatar && profile.picture) {
        user.avatar = profile.picture;
      }
      await user.save();
    } else {
      // New user registration via Google OAuth
      const totalUsers = await (User as any).countDocuments();
      const assignedRole = totalUsers === 0 ? "super_admin" : "admin";
      const userName = profile.name || profile.given_name || "Google User";

      user = await (User as any).create({
        name: userName,
        email: normalizedEmail,
        passwordHash: "",
        role: assignedRole,
        authProvider: "google",
        authProviderId: profile.id,
        emailVerified: true,
        avatar: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      });

      // Automatically provision initial project workspace
      const uniqueProjectId = generateProjectId("pulse_prj_");
      const projectSlug = userName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-app";
      await (Project as any).create({
        projectId: uniqueProjectId,
        name: `${userName}'s Application`,
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
    }

    // 4. Issue authenticated session token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.redirect(new URL("/", req.url));

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Clear the one-time state cookie
    response.cookies.delete("pulse_oauth_state");

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_internal_error", req.url));
  }
}

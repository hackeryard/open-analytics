import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, SESSION_COOKIE_NAME, getOAuthBaseUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const baseUrl = getOAuthBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/oauth/google/callback`;

  if (errorParam || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorParam || "google_auth_cancelled")}`, baseUrl));
  }

  // 1. Verify CSRF state against cookie
  const savedState = req.cookies.get("open_oauth_state")?.value;
  if (!savedState || !state || savedState !== state) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", baseUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured&provider=google", baseUrl));
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
      return NextResponse.redirect(new URL("/login?error=google_token_exchange_failed", baseUrl));
    }

    // 3. Fetch user profile from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();
    if (!userinfoResponse.ok || !profile.email) {
      console.error("Google userinfo error:", profile);
      return NextResponse.redirect(new URL("/login?error=google_profile_fetch_failed", baseUrl));
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
      const userName = profile.name || profile.given_name || "Google User";

      user = await (User as any).create({
        name: userName,
        email: normalizedEmail,
        passwordHash: "",
        role: "admin",
        authProvider: "google",
        authProviderId: profile.id,
        emailVerified: true,
        avatar: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      });
    }

    // 4. Issue authenticated session token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    const response = NextResponse.redirect(new URL("/", baseUrl));

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: !isLocal && process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Clear the one-time state cookies
    response.cookies.delete("open_oauth_state");

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_internal_error", baseUrl));
  }
}

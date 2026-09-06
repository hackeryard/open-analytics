import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const redirectUri = `${appUrl}/api/auth/oauth/google/callback`;

  // Graceful handling if Google OAuth credentials have not been configured yet
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured&provider=google", req.url));
  }

  // Generate cryptographic state for CSRF protection
  const state = crypto.randomBytes(24).toString("hex");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleAuthUrl.toString());

  // Store state in an HTTP-only, secure short-lived cookie
  response.cookies.set({
    name: "pulse_oauth_state",
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOAuthBaseUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = getOAuthBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/oauth/google/callback`;

  // Graceful handling if Google OAuth credentials have not been configured yet
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured&provider=google", baseUrl));
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

  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  // Store state in an HTTP-only, secure short-lived cookie
  response.cookies.set({
    name: "open_oauth_state",
    value: state,
    httpOnly: true,
    secure: !isLocal && process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });

  return response;
}

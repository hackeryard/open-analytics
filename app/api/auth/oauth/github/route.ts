import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOAuthBaseUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl = getOAuthBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/oauth/github/callback`;

  // Graceful handling if GitHub OAuth credentials have not been configured yet
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured&provider=github", baseUrl));
  }

  // Generate cryptographic state for CSRF protection
  const state = crypto.randomBytes(24).toString("hex");

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "read:user user:email");
  githubAuthUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubAuthUrl.toString());

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

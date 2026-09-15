import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, SESSION_COOKIE_NAME, getOAuthBaseUrl } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const baseUrl = getOAuthBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/oauth/github/callback`;

  if (errorParam || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorParam || "github_auth_cancelled")}`, baseUrl));
  }

  // 1. Verify CSRF state against cookie
  const savedState = req.cookies.get("open_oauth_state")?.value;
  if (!savedState || !state || savedState !== state) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", baseUrl));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured&provider=github", baseUrl));
  }

  try {
    // 2. Exchange authorization code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("GitHub token exchange error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=github_token_exchange_failed", baseUrl));
    }

    const accessToken = tokenData.access_token;

    // 3. Fetch user profile from GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Open-Analytics-App",
      },
    });

    const profile = await userResponse.json();
    if (!userResponse.ok || !profile) {
      console.error("GitHub profile error:", profile);
      return NextResponse.redirect(new URL("/login?error=github_profile_fetch_failed", baseUrl));
    }

    // 4. Resolve primary email (handles users with private GitHub emails)
    let email = profile.email;
    if (!email) {
      try {
        const emailsResponse = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "Open-Analytics-App",
          },
        });
        const emails = await emailsResponse.json();
        if (Array.isArray(emails)) {
          const primaryEmail = emails.find((e: any) => e.primary && e.verified) || emails[0];
          if (primaryEmail) {
            email = primaryEmail.email;
          }
        }
      } catch (err) {
        console.warn("Could not fetch secondary GitHub emails:", err);
      }
    }

    if (!email) {
      email = `${profile.login}@users.noreply.github.com`;
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    let user = await (User as any).findOne({ email: normalizedEmail });

    const userName = profile.name || profile.login || "GitHub User";

    if (user) {
      // Existing user: Link GitHub provider details
      user.authProvider = user.authProvider || "github";
      user.authProviderId = String(profile.id);
      user.emailVerified = true;
      if (!user.avatar && profile.avatar_url) {
        user.avatar = profile.avatar_url;
      }
      await user.save();
    } else {
      user = await (User as any).create({
        name: userName,
        email: normalizedEmail,
        passwordHash: "",
        role: "admin",
        authProvider: "github",
        authProviderId: String(profile.id),
        emailVerified: true,
        avatar: profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      });
    }

    // 5. Issue authenticated session token
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
    console.error("GitHub OAuth callback exception:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_internal_error", baseUrl));
  }
}

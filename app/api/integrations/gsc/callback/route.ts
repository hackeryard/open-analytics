import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GscIntegration from "@/models/GscIntegration";
import { getOAuthBaseUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET: Handles the Google OAuth callback for Google Search Console integration.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const baseUrl = getOAuthBaseUrl(req);

  if (errorParam || !code) {
    return NextResponse.redirect(
      new URL(`/seo?tab=gsc&error=${encodeURIComponent(errorParam || "oauth_cancelled")}`, baseUrl)
    );
  }

  // Parse state to extract projectId and nonce
  let parsedState: { projectId: string; userId?: string; nonce?: string } | null = null;
  try {
    const raw = Buffer.from(state || "", "base64url").toString("utf-8");
    parsedState = JSON.parse(raw);
  } catch (e) {
    return NextResponse.redirect(new URL("/seo?tab=gsc&error=invalid_oauth_state", baseUrl));
  }

  if (!parsedState?.projectId) {
    return NextResponse.redirect(new URL("/seo?tab=gsc&error=missing_project_id", baseUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_GSC_REDIRECT_URI || `${baseUrl}/api/integrations/gsc/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/seo?tab=gsc&error=oauth_not_configured", baseUrl));
  }

  try {
    await connectDB();

    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
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

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("GSC token exchange error:", tokenData);
      return NextResponse.redirect(new URL("/seo?tab=gsc&error=token_exchange_failed", baseUrl));
    }

    const expiresIn = tokenData.expires_in || 3600;
    const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

    // 2. Fetch verified sites from Google Search Console API
    let defaultSiteUrl = "";
    try {
      const sitesRes = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (sitesRes.ok) {
        const sitesData = await sitesRes.json();
        const entries = sitesData.siteEntry || [];
        if (entries.length > 0) {
          defaultSiteUrl = entries[0].siteUrl;
        }
      }
    } catch (siteErr) {
      console.error("GSC initial sites query error:", siteErr);
    }

    // 3. Upsert GscIntegration document
    await (GscIntegration as any).findOneAndUpdate(
      { projectId: parsedState.projectId },
      {
        projectId: parsedState.projectId,
        connectedBy: parsedState.userId || null,
        authMethod: "oauth",
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || "",
        tokenExpiry,
        status: "connected",
        siteUrl: defaultSiteUrl,
        lastError: null,
      },
      { upsert: true, new: true }
    );

    // Redirect back to SEO page on dashboard
    return NextResponse.redirect(
      new URL(`/seo?tab=gsc&status=connected&projectId=${parsedState.projectId}`, baseUrl)
    );
  } catch (err: any) {
    console.error("GSC OAuth callback exception:", err);
    return NextResponse.redirect(
      new URL(`/seo?tab=gsc&error=internal_callback_error`, baseUrl)
    );
  }
}

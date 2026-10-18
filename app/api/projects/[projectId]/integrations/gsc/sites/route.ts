import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectAccess } from "@/lib/auth";
import GscIntegration from "@/models/GscIntegration";

export const dynamic = "force-dynamic";

/**
 * GET: Lists verified properties in Google Search Console for the authenticated account
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const gsc = await (GscIntegration as any).findOne({ projectId: params.projectId });
    if (!gsc || gsc.status !== "connected") {
      return NextResponse.json({ error: "GSC is not connected for this project", sites: [] }, { status: 400 });
    }

    // Refresh access token if expired
    let token = gsc.accessToken;
    if (gsc.tokenExpiry && new Date(gsc.tokenExpiry).getTime() <= Date.now() + 60000 && gsc.refreshToken) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (clientId && clientSecret) {
        const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: gsc.refreshToken,
            grant_type: "refresh_token",
          }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          token = refreshData.access_token;
          gsc.accessToken = token;
          gsc.tokenExpiry = new Date(Date.now() + (refreshData.expires_in || 3600) * 1000);
          await gsc.save();
        }
      }
    }

    // Fetch site list from Google API
    const sitesRes = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!sitesRes.ok) {
      const errData = await sitesRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Failed to query Google Search Console sites", details: errData },
        { status: sitesRes.status }
      );
    }

    const sitesData = await sitesRes.json();
    const sites = (sitesData.siteEntry || []).map((entry: any) => ({
      siteUrl: entry.siteUrl,
      permissionLevel: entry.permissionLevel,
      isSelected: entry.siteUrl === gsc.siteUrl,
    }));

    return NextResponse.json({
      sites,
      currentSiteUrl: gsc.siteUrl,
    });
  } catch (err: any) {
    console.error("GSC list sites error:", err);
    return NextResponse.json({ error: "Failed to list sites", details: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectManage } from "@/lib/auth";
import GscIntegration from "@/models/GscIntegration";
import { generateProjectGrowthStrategies } from "@/lib/strategyEngine";

export const dynamic = "force-dynamic";

/**
 * POST: Triggers a sync of Google Search Console performance data for the project
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const gsc = await (GscIntegration as any).findOne({ projectId: params.projectId });
    if (!gsc || gsc.status !== "connected" || !gsc.siteUrl) {
      return NextResponse.json(
        { error: "GSC is not connected or no site property is selected" },
        { status: 400 }
      );
    }

    // Refresh token if nearing expiration
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

    // Compute 28-day date range (GSC data is typically delayed by 2-3 days)
    const endDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const encodedSite = encodeURIComponent(gsc.siteUrl);
    const searchAnalyticsUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;

    // 1. Fetch Queries
    const queriesRes = await fetch(searchAnalyticsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 100,
      }),
    });

    let topQueries = [];
    if (queriesRes.ok) {
      const qData = await queriesRes.json();
      topQueries = (qData.rows || []).map((r: any) => ({
        query: r.keys[0],
        clicks: Math.round(r.clicks || 0),
        impressions: Math.round(r.impressions || 0),
        ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
        position: Number((r.position || 0).toFixed(1)),
      }));
    }

    // 2. Fetch Pages
    const pagesRes = await fetch(searchAnalyticsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 50,
      }),
    });

    let topPages = [];
    if (pagesRes.ok) {
      const pData = await pagesRes.json();
      topPages = (pData.rows || []).map((r: any) => ({
        page: r.keys[0],
        clicks: Math.round(r.clicks || 0),
        impressions: Math.round(r.impressions || 0),
        ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
        position: Number((r.position || 0).toFixed(1)),
      }));
    }

    // 3. Fetch Devices
    const devicesRes = await fetch(searchAnalyticsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["device"],
      }),
    });

    let devices = [];
    if (devicesRes.ok) {
      const dData = await devicesRes.json();
      devices = (dData.rows || []).map((r: any) => ({
        device: r.keys[0],
        clicks: Math.round(r.clicks || 0),
        impressions: Math.round(r.impressions || 0),
        ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
        position: Number((r.position || 0).toFixed(1)),
      }));
    }

    // 4. Fetch Countries
    const countriesRes = await fetch(searchAnalyticsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["country"],
        rowLimit: 25,
      }),
    });

    let countries = [];
    if (countriesRes.ok) {
      const cData = await countriesRes.json();
      countries = (cData.rows || []).map((r: any) => ({
        country: r.keys[0],
        clicks: Math.round(r.clicks || 0),
        impressions: Math.round(r.impressions || 0),
        ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
        position: Number((r.position || 0).toFixed(1)),
      }));
    }

    // 5. Fetch Daily History
    const historyRes = await fetch(searchAnalyticsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["date"],
      }),
    });

    let history = [];
    if (historyRes.ok) {
      const hData = await historyRes.json();
      history = (hData.rows || []).map((r: any) => ({
        date: r.keys[0],
        clicks: Math.round(r.clicks || 0),
        impressions: Math.round(r.impressions || 0),
        ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
        position: Number((r.position || 0).toFixed(1)),
      }));
    }

    // Aggregate overall metrics
    const totalClicks = topQueries.reduce((sum: number, q: any) => sum + q.clicks, 0);
    const totalImpressions = topQueries.reduce((sum: number, q: any) => sum + q.impressions, 0);
    const overallCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
    const avgPos =
      topQueries.length > 0
        ? Number(
            (
              topQueries.reduce((sum: number, q: any) => sum + q.position, 0) /
              topQueries.length
            ).toFixed(1)
          )
        : 0;

    gsc.metrics = {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: overallCtr,
      position: avgPos,
      dateRangeLabel: `${startDate} to ${endDate}`,
    };
    gsc.topQueries = topQueries;
    gsc.topPages = topPages;
    gsc.devices = devices;
    gsc.countries = countries;
    gsc.history = history;
    gsc.lastSyncAt = new Date();
    gsc.lastError = null;

    await gsc.save();

    // Trigger cross-telemetry strategy generation with updated GSC data
    try {
      await generateProjectGrowthStrategies(params.projectId, true);
    } catch (stratErr) {
      console.warn("Post-sync strategy generation error:", stratErr);
    }

    return NextResponse.json({
      success: true,
      metrics: gsc.metrics,
      totalQueries: topQueries.length,
      totalPages: topPages.length,
      lastSyncAt: gsc.lastSyncAt,
    });
  } catch (err: any) {
    console.error("GSC sync exception:", err);
    return NextResponse.json({ error: "Failed to sync GSC data", details: err.message }, { status: 500 });
  }
}

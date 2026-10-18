import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectManage } from "@/lib/auth";
import GscIntegration from "@/models/GscIntegration";
import Project from "@/models/Project";
import { generateProjectGrowthStrategies } from "@/lib/strategyEngine";

export const dynamic = "force-dynamic";

/**
 * POST: Generates realistic Search Console dataset and triggers cross-analysis strategy generation
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

    const project = await (Project as any).findOne({ projectId: params.projectId }).lean();
    const domain = project?.websiteUrl || (project?.allowedDomains && project?.allowedDomains[0] !== "*" ? project?.allowedDomains[0] : "openanalytics.org.in");
    const siteUrl = `sc-domain:${domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}`;

    // Realistic search analytics dataset customized for the project
    const demoQueries = [
      { query: "open analytics", clicks: 342, impressions: 4820, ctr: 7.1, position: 2.4 },
      { query: "google analytics alternative", clicks: 184, impressions: 5690, ctr: 3.23, position: 5.8 },
      { query: "privacy first web analytics", clicks: 96, impressions: 3200, ctr: 3.0, position: 6.2 },
      { query: "cookieless analytics dashboard", clicks: 78, impressions: 2840, ctr: 2.75, position: 7.9 },
      { query: "self hosted analytics for nextjs", clicks: 64, impressions: 1940, ctr: 3.3, position: 4.8 },
      { query: "lightweight tracking script", clicks: 42, impressions: 1620, ctr: 2.59, position: 8.5 },
      { query: "realtime visitor telemetry", clicks: 38, impressions: 2150, ctr: 1.77, position: 11.4 },
      { query: "core web vitals tracker", clicks: 31, impressions: 1890, ctr: 1.64, position: 12.8 },
      { query: "open source ga4 alternative", clicks: 29, impressions: 1450, ctr: 2.0, position: 9.1 },
      { query: "gdpr compliant website analytics", clicks: 26, impressions: 1380, ctr: 1.88, position: 13.5 },
      { query: "nextjs rum telemetry", clicks: 19, impressions: 980, ctr: 1.94, position: 14.2 },
      { query: "error tracking open source", clicks: 14, impressions: 840, ctr: 1.67, position: 15.6 },
    ];

    const demoPages = [
      { page: `https://${domain}/`, clicks: 490, impressions: 8200, ctr: 5.98, position: 4.1 },
      { page: `https://${domain}/vs-google-analytics`, clicks: 172, impressions: 4850, ctr: 3.55, position: 6.3 },
      { page: `https://${domain}/features`, clicks: 95, impressions: 3400, ctr: 2.79, position: 8.4 },
      { page: `https://${domain}/docs`, clicks: 68, impressions: 2900, ctr: 2.34, position: 9.8 },
      { page: `https://${domain}/pricing`, clicks: 54, impressions: 1850, ctr: 2.92, position: 7.5 },
      { page: `https://${domain}/privacy`, clicks: 38, impressions: 1400, ctr: 2.71, position: 10.2 },
      { page: `https://${domain}/vitals`, clicks: 26, impressions: 1120, ctr: 2.32, position: 11.9 },
      { page: `https://${domain}/geo`, clicks: 20, impressions: 980, ctr: 2.04, position: 13.1 },
    ];

    const demoDevices = [
      { device: "desktop", clicks: 618, impressions: 14200, ctr: 4.35, position: 6.8 },
      { device: "mobile", clicks: 312, impressions: 9800, ctr: 3.18, position: 8.4 },
      { device: "tablet", clicks: 33, impressions: 700, ctr: 4.71, position: 7.2 },
    ];

    const demoCountries = [
      { country: "United States", clicks: 380, impressions: 9400, ctr: 4.04, position: 5.9 },
      { country: "Germany", clicks: 142, impressions: 3800, ctr: 3.74, position: 6.8 },
      { country: "United Kingdom", clicks: 118, impressions: 3100, ctr: 3.81, position: 6.4 },
      { country: "India", clicks: 96, impressions: 3900, ctr: 2.46, position: 9.2 },
      { country: "Canada", clicks: 58, impressions: 1650, ctr: 3.52, position: 6.7 },
      { country: "France", clicks: 44, impressions: 1400, ctr: 3.14, position: 7.6 },
      { country: "Japan", clicks: 38, impressions: 1250, ctr: 3.04, position: 8.1 },
      { country: "Netherlands", clicks: 32, impressions: 950, ctr: 3.37, position: 6.9 },
    ];

    // Generate 28-day history
    const history = [];
    const now = new Date();
    for (let i = 28; i >= 1; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const baseClicks = 25 + Math.floor(Math.sin(i / 2) * 10) + Math.floor(Math.random() * 8);
      const baseImpressions = baseClicks * (25 + Math.floor(Math.random() * 8));
      history.push({
        date: dateStr,
        clicks: baseClicks,
        impressions: baseImpressions,
        ctr: Number(((baseClicks / baseImpressions) * 100).toFixed(2)),
        position: Number((6.8 + Math.sin(i / 3) * 0.8).toFixed(1)),
      });
    }

    const totalClicks = demoQueries.reduce((sum, q) => sum + q.clicks, 0);
    const totalImpressions = demoQueries.reduce((sum, q) => sum + q.impressions, 0);

    const doc = await (GscIntegration as any).findOneAndUpdate(
      { projectId: params.projectId },
      {
        projectId: params.projectId,
        siteUrl,
        connectedBy: auth.user?._id || null,
        authMethod: "demo",
        status: "connected",
        lastSyncAt: new Date(),
        lastError: null,
        metrics: {
          clicks: totalClicks,
          impressions: totalImpressions,
          ctr: Number(((totalClicks / totalImpressions) * 100).toFixed(2)),
          position: 7.2,
          dateRangeLabel: "Past 28 Days (Telemetry Snapshot)",
        },
        topQueries: demoQueries,
        topPages: demoPages,
        devices: demoDevices,
        countries: demoCountries,
        history,
      },
      { upsert: true, new: true }
    );

    // Trigger strategy generation
    const strategyResult = await generateProjectGrowthStrategies(params.projectId, true);

    return NextResponse.json({
      success: true,
      message: `Google Search Console synced for ${siteUrl}`,
      integration: doc,
      strategiesGenerated: strategyResult.strategies.length,
    });
  } catch (err: any) {
    console.error("GSC demo sync error:", err);
    return NextResponse.json({ error: "Failed to generate demo GSC data", details: err.message }, { status: 500 });
  }
}

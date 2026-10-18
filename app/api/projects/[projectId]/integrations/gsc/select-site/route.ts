import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectManage } from "@/lib/auth";
import GscIntegration from "@/models/GscIntegration";

export const dynamic = "force-dynamic";

/**
 * POST: Bind selected GSC property URL to the project
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

    const { siteUrl } = await req.json();
    if (!siteUrl || typeof siteUrl !== "string") {
      return NextResponse.json({ error: "siteUrl string is required" }, { status: 400 });
    }

    const gsc = await (GscIntegration as any).findOne({ projectId: params.projectId });
    if (!gsc) {
      return NextResponse.json({ error: "GSC integration not found" }, { status: 404 });
    }

    gsc.siteUrl = siteUrl.trim();
    gsc.status = "connected";
    await gsc.save();

    return NextResponse.json({
      success: true,
      siteUrl: gsc.siteUrl,
      message: `Property ${gsc.siteUrl} selected successfully`,
    });
  } catch (err: any) {
    console.error("GSC select site error:", err);
    return NextResponse.json({ error: "Failed to bind site", details: err.message }, { status: 500 });
  }
}

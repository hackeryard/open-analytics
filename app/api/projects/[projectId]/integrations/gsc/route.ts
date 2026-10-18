import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectAccess, verifyProjectManage } from "@/lib/auth";
import { getUserEffectivePlan } from "@/lib/planLimits";
import GscIntegration from "@/models/GscIntegration";

export const dynamic = "force-dynamic";

/**
 * GET: Fetch GSC integration status and cached search analytics for the project
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

    // Paid Plan Gate check
    const userPlan = getUserEffectivePlan(auth.user);
    const projectPlan = auth.project?.effectivePlan || auth.project?.plan || "free";
    const isPro =
      userPlan === "pro" ||
      userPlan === "enterprise" ||
      projectPlan === "pro" ||
      projectPlan === "enterprise" ||
      auth.user?.role === "super_admin";

    const gsc = await (GscIntegration as any).findOne({ projectId: params.projectId }).lean();

    return NextResponse.json({
      isPro,
      connected: !!(gsc && gsc.status === "connected"),
      integration: gsc || null,
      siteUrl: gsc?.siteUrl || null,
      lastSyncAt: gsc?.lastSyncAt || null,
      authMethod: gsc?.authMethod || null,
    });
  } catch (err: any) {
    console.error("GSC get integration error:", err);
    return NextResponse.json({ error: "Failed to retrieve GSC integration", details: err.message }, { status: 500 });
  }
}

/**
 * DELETE: Disconnect GSC integration
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    await (GscIntegration as any).findOneAndUpdate(
      { projectId: params.projectId },
      {
        status: "disconnected",
        accessToken: "",
        refreshToken: "",
        tokenExpiry: null,
        siteUrl: "",
      }
    );

    return NextResponse.json({ success: true, message: "Google Search Console disconnected" });
  } catch (err: any) {
    console.error("GSC disconnect error:", err);
    return NextResponse.json({ error: "Failed to disconnect GSC", details: err.message }, { status: 500 });
  }
}

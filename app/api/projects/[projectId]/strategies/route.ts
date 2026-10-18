import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectAccess, verifyProjectEdit } from "@/lib/auth";
import { getUserEffectivePlan } from "@/lib/planLimits";
import GrowthStrategy from "@/models/GrowthStrategy";
import { generateProjectGrowthStrategies } from "@/lib/strategyEngine";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve generated improvement strategies for the project.
 * Supports filtering by category, status, and quickWins.
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

    const userPlan = getUserEffectivePlan(auth.user);
    const projectPlan = auth.project?.effectivePlan || auth.project?.plan || "free";
    const isPro =
      userPlan === "pro" ||
      userPlan === "enterprise" ||
      projectPlan === "pro" ||
      projectPlan === "enterprise" ||
      auth.user?.role === "super_admin";

    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const quickWinsOnly = searchParams.get("quickWins") === "true";

    const query: any = { projectId: params.projectId };
    if (category && category !== "all") query.category = category;
    if (status && status !== "all") query.status = status;
    if (quickWinsOnly) query.isQuickWin = true;

    let strategies = await (GrowthStrategy as any)
      .find(query)
      .sort({ score: -1, isQuickWin: -1, createdAt: -1 })
      .lean();

    // If no strategies exist yet and user has pro, generate an initial batch
    if (strategies.length === 0 && isPro) {
      try {
        const generated = await generateProjectGrowthStrategies(params.projectId);
        strategies = generated.strategies;
      } catch (genErr) {
        console.warn("Auto strategy generation error:", genErr);
      }
    }

    const allStrategies = await (GrowthStrategy as any).find({ projectId: params.projectId }).lean();
    const quickWins = allStrategies.filter((s: any) => s.isQuickWin && s.status !== "dismissed").length;
    const criticalCount = allStrategies.filter((s: any) => s.priority === "critical" && s.status !== "dismissed").length;
    const implementedCount = allStrategies.filter((s: any) => s.status === "implemented").length;
    const inProgressCount = allStrategies.filter((s: any) => s.status === "in_progress").length;

    const categoriesCount: Record<string, number> = {};
    allStrategies.forEach((s: any) => {
      categoriesCount[s.category] = (categoriesCount[s.category] || 0) + 1;
    });

    const overallScore = Math.min(100, Math.round(55 + (implementedCount / Math.max(1, allStrategies.length)) * 40));

    return NextResponse.json({
      isPro,
      strategies,
      summary: {
        total: allStrategies.length,
        quickWins,
        criticalCount,
        implementedCount,
        inProgressCount,
        categories: categoriesCount,
        overallScore,
      },
    });
  } catch (err: any) {
    console.error("Fetch growth strategies error:", err);
    return NextResponse.json({ error: "Failed to fetch strategies", details: err.message }, { status: 500 });
  }
}

/**
 * POST: Runs the cross-telemetry intelligence engine to regenerate/synthesize strategies
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const userPlan = getUserEffectivePlan(auth.user);
    const projectPlan = auth.project?.effectivePlan || auth.project?.plan || "free";
    const isPro =
      userPlan === "pro" ||
      userPlan === "enterprise" ||
      projectPlan === "pro" ||
      projectPlan === "enterprise" ||
      auth.user?.role === "super_admin";

    if (!isPro) {
      return NextResponse.json(
        {
          error: "AI Growth Strategies requires a Cloud Pro or Enterprise subscription.",
          code: "PRO_REQUIRED",
        },
        { status: 403 }
      );
    }

    const result = await generateProjectGrowthStrategies(params.projectId, true);

    return NextResponse.json({
      success: true,
      message: `Cross-telemetry analysis complete. ${result.strategies.length} strategies generated.`,
      strategies: result.strategies,
      summary: result.summary,
    });
  } catch (err: any) {
    console.error("Generate growth strategies error:", err);
    return NextResponse.json({ error: "Failed to generate strategies", details: err.message }, { status: 500 });
  }
}

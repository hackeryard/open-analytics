import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectAccess } from "@/lib/auth";
import { runOptimizationScan } from "@/lib/alertsEngine";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const auth = await verifyProjectAccess(req, projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const result = await runOptimizationScan(projectId);

    return NextResponse.json({
      success: true,
      message: `Optimization scan completed. ${result.createdCount} new recommendation(s) identified.`,
      newAlertsCount: result.createdCount,
    });
  } catch (err: any) {
    console.error("Notification scan error:", err);
    return NextResponse.json({ error: "Scan failed", details: err.message }, { status: 500 });
  }
}

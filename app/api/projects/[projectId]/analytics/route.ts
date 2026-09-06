import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getProjectAnalytics } from "@/lib/analyticsDb";
import { verifyProjectAccess } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "7d";
    const startDate = searchParams.get("startDate") || null;
    const endDate = searchParams.get("endDate") || null;

    const data = await getProjectAnalytics(params.projectId, timeRange, startDate, endDate);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics", details: err.message }, { status: 500 });
  }
}
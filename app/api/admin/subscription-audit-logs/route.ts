import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionAuditLog from "@/models/SubscriptionAuditLog";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/subscription-audit-logs
 * Retrieves immutable audit log entries for all subscription and payment actions.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Super Administrator authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const logs = await (SubscriptionAuditLog as any).find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load audit logs" }, { status: 500 });
  }
}

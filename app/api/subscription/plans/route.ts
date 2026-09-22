import { NextRequest, NextResponse } from "next/server";
import { getActiveSubscriptionPlans } from "@/lib/subscriptionService";

export const dynamic = "force-dynamic";

/**
 * GET /api/subscription/plans
 * Publicly returns available active subscription plans with database prices and features.
 */
export async function GET() {
  try {
    const plans = await getActiveSubscriptionPlans();
    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load plans" }, { status: 500 });
  }
}

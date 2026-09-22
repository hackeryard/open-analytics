import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { getUserActiveSubscription } from "@/lib/subscriptionService";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

/**
 * GET /api/subscription/me
 * Returns current authenticated user's active subscription, latest pending request, and payment history.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const activeSubscription = await getUserActiveSubscription(user._id);

    // Find any open/pending request
    const pendingRequest = await (SubscriptionRequest as any).findOne({
      userId: user._id,
      status: { $in: ["requested", "contacted", "payment_pending"] },
    }).sort({ createdAt: -1 }).lean();

    // Find latest completed/rejected request
    const latestRequest = pendingRequest || (await (SubscriptionRequest as any).findOne({
      userId: user._id,
    }).sort({ createdAt: -1 }).lean());

    // User's verified payments
    const payments = await (Payment as any).find({
      userId: user._id,
      status: "paid",
    }).sort({ createdAt: -1 }).limit(5).lean();

    return NextResponse.json({
      success: true,
      hasActiveSubscription: Boolean(activeSubscription),
      subscription: activeSubscription,
      pendingRequest,
      latestRequest,
      payments,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load subscription status" }, { status: 500 });
  }
}

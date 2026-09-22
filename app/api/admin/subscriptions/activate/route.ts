import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { activateSubscriptionManually } from "@/lib/subscriptionService";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/subscriptions/activate
 * Administrator activates a user's subscription after authentic, verified funds have been confirmed.
 * Atomically creates a paid Payment record, creates/updates Subscription, unlocks user entitlements,
 * reactivates paused projects, and records an immutable audit log.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Super Administrator authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      requestId,
      amount,
      currency = "INR",
      paymentNotes,
      providerPaymentId,
      overrideDurationDays,
    } = body;

    if (!requestId) {
      return NextResponse.json({ error: "Missing requestId parameter" }, { status: 400 });
    }

    const result = await activateSubscriptionManually({
      requestId,
      adminUser: {
        _id: user._id.toString(),
        email: user.email,
      },
      amount,
      currency,
      paymentNotes,
      providerPaymentId,
      overrideDurationDays,
    });

    return NextResponse.json({
      success: true,
      message: `Subscription successfully activated! User upgraded to ${result.user.plan.toUpperCase()}.`,
      ...result,
    });
  } catch (err: any) {
    console.error("Admin activation error:", err);
    return NextResponse.json({ error: err.message || "Failed to activate subscription" }, { status: 500 });
  }
}

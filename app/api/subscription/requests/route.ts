import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import SubscriptionAuditLog from "@/models/SubscriptionAuditLog";
import { getUserActiveSubscription, seedSubscriptionPlansIfEmpty } from "@/lib/subscriptionService";

/**
 * POST /api/subscription/requests
 * Creates a new subscription request representing the user's intent to upgrade.
 * Enforces server-side authentication, plan validation, and duplicate prevention.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required to submit request" }, { status: 401 });
    }

    const body = await req.json();
    const { planId, message = "" } = body;

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    await seedSubscriptionPlansIfEmpty();
    const plan = await (SubscriptionPlan as any).findOne({ planId, isActive: true });
    if (!plan) {
      return NextResponse.json({ error: "Invalid or inactive subscription plan" }, { status: 400 });
    }

    // 1. Check if user already has an active subscription for this plan
    const activeSub = await getUserActiveSubscription(user._id);
    if (activeSub && activeSub.planTier === plan.tier) {
      return NextResponse.json(
        {
          error: `You already have an active ${plan.name} subscription expiring on ${new Date(
            activeSub.endDate
          ).toLocaleDateString()}.`,
          code: "ALREADY_ACTIVE",
        },
        { status: 400 }
      );
    }

    // 2. Duplicate Request Prevention: Check if user already has an uncompleted request
    const existingPending = await (SubscriptionRequest as any).findOne({
      userId: user._id,
      status: { $in: ["requested", "contacted", "payment_pending"] },
    });

    if (existingPending) {
      return NextResponse.json({
        success: true,
        isExisting: true,
        message: "You already have a pending subscription request currently under review.",
        request: existingPending,
      });
    }

    // 3. Create new SubscriptionRequest with server-verified price
    const newRequest = await (SubscriptionRequest as any).create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      planId: plan.planId,
      planName: plan.name,
      tier: plan.tier,
      billingInterval: plan.billingInterval,
      price: plan.price, // Server verified, never frontend trusting
      status: "requested",
      message: (message || "").toString().slice(0, 1000).trim(),
    });

    // 4. Log Audit
    await (SubscriptionAuditLog as any).create({
      action: "request_created",
      affectedUserId: user._id,
      affectedUserEmail: user.email,
      requestId: newRequest._id,
      metadata: {
        planId: plan.planId,
        tier: plan.tier,
        price: plan.price,
      },
    });

    return NextResponse.json({
      success: true,
      isExisting: false,
      message: "Subscription request received. Our team will contact you shortly with next steps.",
      request: newRequest,
    });
  } catch (err: any) {
    console.error("Subscription request creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit subscription request" }, { status: 500 });
  }
}

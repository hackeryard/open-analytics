import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import SubscriptionAuditLog from "@/models/SubscriptionAuditLog";

/**
 * POST /api/admin/subscriptions/[id]/expire
 * Administrator manually expires or cancels an active subscription.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Super Administrator authorization required" }, { status: 403 });
    }

    const subscriptionId = params.id;
    const body = await req.json().catch(() => ({}));
    const { reason = "Administrative expiration" } = body;

    const subscription = await (Subscription as any).findById(subscriptionId);
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    subscription.status = "expired";
    subscription.endDate = new Date(); // set end date to right now
    subscription.cancellationReason = reason;
    await subscription.save();

    // Check if user has another active subscription
    const anotherActive = await (Subscription as any).findOne({
      userId: subscription.userId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (!anotherActive) {
      await (User as any).findByIdAndUpdate(subscription.userId, {
        plan: "free",
        subscriptionStatus: "expired",
      });
    }

    const affectedUser = await (User as any).findById(subscription.userId);

    await (SubscriptionAuditLog as any).create({
      adminId: user._id,
      adminEmail: user.email,
      action: "subscription_expired",
      affectedUserId: subscription.userId,
      affectedUserEmail: affectedUser?.email || "",
      subscriptionId: subscription._id,
      metadata: { reason, expiredByAdmin: user.email },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription expired successfully.",
      subscription,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to expire subscription" }, { status: 500 });
  }
}

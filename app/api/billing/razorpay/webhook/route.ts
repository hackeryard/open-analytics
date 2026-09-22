import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/razorpay/webhook
 * Receives background asynchronous events from Razorpay (e.g. payment.captured, order.paid).
 * Ensures plans are credited even if the user closed the browser tab before the verify redirect completed.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Razorpay webhook signature verification failed");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // We process payment.captured and order.paid
    if (event === "payment.captured" || event === "order.paid") {
      await connectDB();

      const paymentEntity = payload.payload?.payment?.entity;
      const notes = paymentEntity?.notes || payload.payload?.order?.entity?.notes || {};

      const userId = notes.userId;
      const plan = notes.plan || "pro";
      const billingCycle = notes.billingCycle || "monthly";

      if (userId) {
        const dbUser = await (User as any).findById(userId);
        if (dbUser) {
          const durationDays = billingCycle === "annual" ? 365 : 30;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + durationDays);

          dbUser.plan = plan;
          dbUser.billingCycle = billingCycle;
          dbUser.planExpiresAt = expiresAt;
          dbUser.subscriptionStatus = "active";
          dbUser.razorpayPaymentId = paymentEntity?.id || dbUser.razorpayPaymentId;
          dbUser.razorpayOrderId = paymentEntity?.order_id || dbUser.razorpayOrderId;
          dbUser.lockedActiveProjectId = "";
          dbUser.activeProjectSelectedAt = null;

          await dbUser.save();

          // Unpause projects
          await (Project as any).updateMany(
            { ownerId: userId, monitoringStatus: "paused" },
            { $set: { monitoringStatus: "active" } }
          );

          console.log(`Razorpay webhook: User ${userId} upgraded to ${plan} (${billingCycle}) via ${event}`);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

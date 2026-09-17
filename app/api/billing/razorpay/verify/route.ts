import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import User from "@/models/User";
import Project from "@/models/Project";
import {
  verifyRazorpayPaymentSignature,
  getRazorpayKeys,
} from "@/lib/razorpay";
import { getUserEffectivePlan, getMaxAllowedProjects, PLAN_LIMITS } from "@/lib/planLimits";

/**
 * POST /api/billing/razorpay/verify
 * Validates HMAC SHA-256 signature from client checkout and upgrades user subscription in DB.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = "pro",
      billingCycle = "monthly",
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing required payment identifiers" }, { status: 400 });
    }

    const { isConfigured } = getRazorpayKeys();

    // Cryptographic verification
    if (isConfigured) {
      if (!razorpay_signature) {
        return NextResponse.json({ error: "Missing cryptographic signature" }, { status: 400 });
      }

      const isValid = verifyRazorpayPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return NextResponse.json({ error: "Payment verification failed: invalid signature" }, { status: 400 });
      }
    } else {
      // In development mode without live Razorpay keys, permit mock transaction validation
      console.warn("Dev mode: Razorpay credentials not configured. Accepting mock verification.");
    }

    // Fetch user and apply upgrade
    const dbUser = await (User as any).findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    const durationDays = billingCycle === "annual" ? 365 : 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    dbUser.plan = plan;
    dbUser.billingCycle = billingCycle;
    dbUser.planExpiresAt = expiresAt;
    dbUser.subscriptionStatus = "active";
    dbUser.razorpayOrderId = razorpay_order_id;
    dbUser.razorpayPaymentId = razorpay_payment_id;

    // Upgrading lifts any locked project restrictions
    dbUser.lockedActiveProjectId = "";
    dbUser.activeProjectSelectedAt = null;

    await dbUser.save();

    // Automatically reactivate any projects owned by this user that were paused
    await (Project as any).updateMany(
      { ownerId: user._id, monitoringStatus: "paused" },
      { $set: { monitoringStatus: "active" } }
    );

    const ownedProjectsCount = await Project.countDocuments({ ownerId: user._id });
    const effectivePlan = getUserEffectivePlan(dbUser);
    const maxProjects = getMaxAllowedProjects(dbUser);

    return NextResponse.json({
      success: true,
      message: `Subscription successfully activated! Upgraded to ${plan.toUpperCase()}.`,
      user: {
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        plan: dbUser.plan,
        effectivePlan,
        planExpiresAt: dbUser.planExpiresAt,
        billingCycle: dbUser.billingCycle,
        subscriptionStatus: dbUser.subscriptionStatus,
      },
      usage: {
        ownedProjects: ownedProjectsCount,
        maxProjects,
        canCreateProject: ownedProjectsCount < maxProjects,
      },
      limits: PLAN_LIMITS[effectivePlan],
    });
  } catch (err: any) {
    console.error("Payment verification route error:", err);
    return NextResponse.json({ error: err.message || "Failed to verify payment" }, { status: 500 });
  }
}

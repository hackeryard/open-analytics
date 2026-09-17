import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import SubscriptionRequest, { ISubscriptionRequest } from "@/models/SubscriptionRequest";
import Subscription, { ISubscription } from "@/models/Subscription";
import Payment, { IPayment } from "@/models/Payment";
import SubscriptionAuditLog from "@/models/SubscriptionAuditLog";
import User from "@/models/User";
import Project from "@/models/Project";
import { getUserEffectivePlan, getMaxAllowedProjects, PLAN_LIMITS } from "@/lib/planLimits";

// Default seed plans if none exist in DB
export const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    planId: "pro-monthly",
    name: "Cloud Pro (Monthly)",
    slug: "pro-monthly",
    tier: "pro",
    description: "Advanced observability, real-time Core Web Vitals, AI crawler radar, and 10 tracked websites.",
    price: 1499,
    currency: "INR",
    billingInterval: "monthly",
    features: [
      "10 Tracked Websites Included",
      "250,000 events / month / project",
      "Up to 10 team members per project",
      "Full 365-day (1-year) data retention",
      "AI Search Crawler Radar (GEO & LLMs)",
      "Real User Core Web Vitals (LCP, INP, CLS)",
      "Rage Click & Behavioral UX Telemetry",
      "Runtime Crash & Exception Triage",
      "Custom Events & Telemetry Rules",
    ],
    maxProjects: 10,
    monthlyEventsPerProject: 250000,
    maxMembersPerProject: 10,
    retentionDays: 365,
    isActive: true,
  },
  {
    planId: "pro-annual",
    name: "Cloud Pro (Annual)",
    slug: "pro-annual",
    tier: "pro",
    description: "Everything in Pro with 2 months free when billed annually.",
    price: 14999,
    currency: "INR",
    billingInterval: "annual",
    features: [
      "10 Tracked Websites Included",
      "250,000 events / month / project",
      "Up to 10 team members per project",
      "Full 365-day (1-year) data retention",
      "AI Search Crawler Radar (GEO & LLMs)",
      "Real User Core Web Vitals (LCP, INP, CLS)",
      "Rage Click & Behavioral UX Telemetry",
      "Runtime Crash & Exception Triage",
      "Custom Events & Telemetry Rules",
      "2 Months Free (Best Value)",
    ],
    maxProjects: 10,
    monthlyEventsPerProject: 250000,
    maxMembersPerProject: 10,
    retentionDays: 365,
    isActive: true,
  },
  {
    planId: "enterprise-monthly",
    name: "Enterprise Cloud (Monthly)",
    slug: "enterprise-monthly",
    tier: "enterprise",
    description: "High-throughput telemetry for organizations with multiple brands and dedicated SLA.",
    price: 7999,
    currency: "INR",
    billingInterval: "monthly",
    features: [
      "10 Websites Base + Additional Capacity",
      "1,000,000 events / month / project",
      "Unlimited collaborators per project",
      "Full 365-day data retention",
      "All 5 Power Modules Included",
      "Priority ingestion pipeline & SLA",
      "Dedicated account review",
    ],
    maxProjects: 10,
    monthlyEventsPerProject: 1000000,
    maxMembersPerProject: 999,
    retentionDays: 365,
    isActive: true,
  },
  {
    planId: "enterprise-annual",
    name: "Enterprise Cloud (Annual)",
    slug: "enterprise-annual",
    tier: "enterprise",
    description: "Enterprise tier with annual commitment discount and priority support.",
    price: 79990,
    currency: "INR",
    billingInterval: "annual",
    features: [
      "10 Websites Base + Additional Capacity",
      "1,000,000 events / month / project",
      "Unlimited collaborators per project",
      "Full 365-day data retention",
      "All 5 Power Modules Included",
      "Priority ingestion pipeline & SLA",
      "Dedicated account review",
      "2 Months Free Included",
    ],
    maxProjects: 10,
    monthlyEventsPerProject: 1000000,
    maxMembersPerProject: 999,
    retentionDays: 365,
    isActive: true,
  },
];

/**
 * Ensures plans exist in the database.
 */
export async function seedSubscriptionPlansIfEmpty() {
  await connectDB();
  const count = await (SubscriptionPlan as any).countDocuments();
  if (count === 0) {
    await (SubscriptionPlan as any).insertMany(DEFAULT_SUBSCRIPTION_PLANS);
  }
}

/**
 * Retrieves all active subscription plans.
 */
export async function getActiveSubscriptionPlans() {
  await connectDB();
  await seedSubscriptionPlansIfEmpty();
  return (SubscriptionPlan as any).find({ isActive: true }).lean();
}

/**
 * Centralized server-side entitlement check.
 * Checks if a user has an active, unexpired subscription.
 * Handles lazy expiration automatically.
 */
export async function getUserActiveSubscription(userId: string | mongoose.Types.ObjectId): Promise<ISubscription | null> {
  await connectDB();
  const now = new Date();

  // Find latest subscription marked active or pending
  const subscription = await (Subscription as any).findOne({
    userId,
    status: "active",
  }).sort({ endDate: -1 });

  if (!subscription) {
    return null;
  }

  // Lazy expiration check
  if (new Date(subscription.endDate) < now) {
    subscription.status = "expired";
    await subscription.save();

    // Also downgrade user profile if no other active subscription exists
    const nextActive = await (Subscription as any).findOne({
      userId,
      status: "active",
      endDate: { $gt: now },
    });

    if (!nextActive) {
      await (User as any).findByIdAndUpdate(userId, {
        plan: "free",
        subscriptionStatus: "expired",
      });
      // Log audit
      await (SubscriptionAuditLog as any).create({
        action: "subscription_expired",
        affectedUserId: userId,
        affectedUserEmail: (await (User as any).findById(userId))?.email || "",
        subscriptionId: subscription._id,
        metadata: { reason: "lazy_expiration_check" },
      });
    }
    return null;
  }

  return subscription;
}

/**
 * Authorization helper: Checks if user has required plan tier access.
 */
export async function hasActiveSubscription(
  userId: string | mongoose.Types.ObjectId,
  requiredTier: "pro" | "enterprise" = "pro"
): Promise<boolean> {
  const sub = await getUserActiveSubscription(userId);
  if (!sub) return false;
  if (requiredTier === "enterprise") {
    return sub.planTier === "enterprise";
  }
  return sub.planTier === "pro" || sub.planTier === "enterprise";
}

/**
 * Calculates end date based on start date and interval.
 */
export function calculateSubscriptionEndDate(startDate: Date, interval: "monthly" | "annual"): Date {
  const end = new Date(startDate);
  if (interval === "annual") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

/**
 * Manual Subscription Activation by an authorized Administrator.
 * Executed after authentic verified funds are received.
 */
export async function activateSubscriptionManually({
  requestId,
  adminUser,
  amount,
  currency = "INR",
  paymentNotes,
  providerPaymentId,
  overrideDurationDays,
}: {
  requestId: string;
  adminUser: { _id: string; email: string };
  amount?: number;
  currency?: string;
  paymentNotes?: string;
  providerPaymentId?: string;
  overrideDurationDays?: number;
}) {
  await connectDB();

  const request = await (SubscriptionRequest as any).findById(requestId);
  if (!request) {
    throw new Error("Subscription request not found");
  }

  if (request.status === "completed") {
    throw new Error("This subscription request has already been completed.");
  }

  const user = await (User as any).findById(request.userId);
  if (!user) {
    throw new Error("Associated user account not found");
  }

  const finalAmount = amount !== undefined ? amount : request.price;
  const startDate = new Date();
  let endDate: Date;

  if (overrideDurationDays) {
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + overrideDurationDays);
  } else {
    endDate = calculateSubscriptionEndDate(startDate, request.billingInterval);
  }

  // 1. Create Verified Payment record
  const payment = await (Payment as any).create({
    userId: user._id,
    requestId: request._id,
    planId: request.planId,
    amount: finalAmount,
    currency: currency.toUpperCase(),
    status: "paid",
    provider: "manual",
    providerPaymentId: providerPaymentId || `man_pay_${Date.now().toString().slice(-8)}`,
    paidAt: new Date(),
    recordedByAdminId: adminUser._id,
    notes: paymentNotes || "Verified manual payment received and approved by administrator.",
  });

  // 2. Create or Update Subscription
  const subscription = await (Subscription as any).create({
    userId: user._id,
    planId: request.planId,
    planTier: request.tier,
    billingCycle: request.billingInterval,
    status: "active",
    startDate,
    endDate,
    paymentId: payment._id,
    paymentProvider: "manual",
  });

  // Link subscription back to payment
  payment.subscriptionId = subscription._id;
  await payment.save();

  // 3. Mark request completed
  request.status = "completed";
  request.subscriptionId = subscription._id;
  request.paymentId = payment._id;
  await request.save();

  // 4. Update User Profile Entitlements
  user.plan = request.tier;
  user.planExpiresAt = endDate;
  user.billingCycle = request.billingInterval;
  user.subscriptionStatus = "active";
  user.lockedActiveProjectId = "";
  user.activeProjectSelectedAt = null;
  await user.save();

  // 5. Unpause any paused projects owned by this user
  await (Project as any).updateMany(
    { ownerId: user._id, monitoringStatus: "paused" },
    { $set: { monitoringStatus: "active" } }
  );

  // 6. Record Audit Log
  await (SubscriptionAuditLog as any).create({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: "subscription_activated",
    affectedUserId: user._id,
    affectedUserEmail: user.email,
    requestId: request._id,
    subscriptionId: subscription._id,
    paymentId: payment._id,
    metadata: {
      tier: request.tier,
      billingInterval: request.billingInterval,
      amount: finalAmount,
      currency,
      endDate: endDate.toISOString(),
    },
  });

  return {
    success: true,
    subscription,
    payment,
    user: {
      id: user._id.toString(),
      email: user.email,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
    },
  };
}

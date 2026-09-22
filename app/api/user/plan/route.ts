import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth";
import {
  getUserEffectivePlan,
  getMaxAllowedProjects,
  isPlanActive,
  PLAN_LIMITS,
  SubscriptionPlan,
} from "@/lib/planLimits";

export const dynamic = "force-dynamic";
/**
 * GET /api/user/plan
 * Returns current user's subscription, expiry, limits, and usage metrics.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const dbUser = await (User as any).findById(user._id).select("-passwordHash").lean();
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ownedProjectsCount = await Project.countDocuments({ ownerId: user._id });
    const effectivePlan = getUserEffectivePlan(dbUser);
    const maxProjects = getMaxAllowedProjects(dbUser);
    const planActive = isPlanActive(dbUser);
    const limits = PLAN_LIMITS[effectivePlan];

    let daysUntilExpiry: number | null = null;
    if (dbUser.planExpiresAt) {
      const diffMs = new Date(dbUser.planExpiresAt).getTime() - Date.now();
      daysUntilExpiry = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return NextResponse.json({
      plan: dbUser.plan || "free",
      effectivePlan,
      isPlanActive: planActive,
      planExpiresAt: dbUser.planExpiresAt || null,
      daysUntilExpiry,
      billingCycle: dbUser.billingCycle || "monthly",
      extraProjectsAllowed: dbUser.extraProjectsAllowed || 0,
      subscriptionStatus: dbUser.subscriptionStatus || "active",
      lockedActiveProjectId: dbUser.lockedActiveProjectId || "",
      activeProjectSelectedAt: dbUser.activeProjectSelectedAt || null,
      usage: {
        ownedProjects: ownedProjectsCount,
        maxProjects,
        canCreateProject: ownedProjectsCount < maxProjects,
      },
      limits,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/user/plan
 * Allows upgrading / downgrading user plan, setting duration, or adding extra project slots.
 */
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      plan,
      billingCycle = "monthly",
      extraProjects = 0,
      durationDays,
    } = body;

    const validPlans: SubscriptionPlan[] = ["free", "pro", "enterprise"];
    if (plan && !validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan specified" }, { status: 400 });
    }

    const dbUser = await (User as any).findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPlan: SubscriptionPlan = plan || dbUser.plan || "free";
    dbUser.plan = newPlan;

    if (newPlan === "free") {
      dbUser.planExpiresAt = null;
      dbUser.subscriptionStatus = "active";
      dbUser.extraProjectsAllowed = 0;
    } else {
      // Set expiration based on duration or billingCycle
      const days = durationDays || (billingCycle === "annual" ? 365 : 30);
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      dbUser.planExpiresAt = expires;
      dbUser.billingCycle = billingCycle;
      dbUser.subscriptionStatus = "active";
      // UPGRADE UNLOCKS: Clear locked active project and reactivate all owned projects
      dbUser.lockedActiveProjectId = "";
      dbUser.activeProjectSelectedAt = null;
      await (Project as any).updateMany(
        { ownerId: user._id, monitoringStatus: "paused" },
        { $set: { monitoringStatus: "active" } }
      );

      if (typeof extraProjects === "number" && extraProjects >= 0) {
        dbUser.extraProjectsAllowed = extraProjects;
      }
    }

    await dbUser.save();

    const ownedProjectsCount = await Project.countDocuments({ ownerId: user._id });
    const effectivePlan = getUserEffectivePlan(dbUser);
    const maxProjects = getMaxAllowedProjects(dbUser);

    return NextResponse.json({
      success: true,
      message: `Successfully switched to ${newPlan.toUpperCase()} plan.`,
      user: {
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        plan: dbUser.plan,
        effectivePlan,
        planExpiresAt: dbUser.planExpiresAt,
        billingCycle: dbUser.billingCycle,
        extraProjectsAllowed: dbUser.extraProjectsAllowed,
      },
      usage: {
        ownedProjects: ownedProjectsCount,
        maxProjects,
        canCreateProject: ownedProjectsCount < maxProjects,
      },
      limits: PLAN_LIMITS[effectivePlan],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

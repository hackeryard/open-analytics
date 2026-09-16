/**
 * Centralized Plan Limits & Subscription Configuration
 * 
 * Rules:
 * - Free: 1 website, 10,000 events/mo per project, up to 2 team members, 30 days retention.
 * - Pro: 10 websites included, 250,000 events/mo per project, up to 10 team members, 365 days retention.
 * - Enterprise: 10 base websites + $10/mo per extra website, 1,000,000 events/mo per project, unlimited members, 365 days retention.
 * - Quotas are strictly per-project (unpooled).
 */

export type SubscriptionPlan = "free" | "pro" | "enterprise";

export interface PlanConfig {
  name: string;
  maxProjects: number;
  monthlyEventsPerProject: number;
  maxMembersPerProject: number;
  retentionDays: number;
  extraProjectCostMonthly: number;
  includedModules: string[];
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    name: "Free Starter",
    maxProjects: 1,
    monthlyEventsPerProject: 10_000,
    maxMembersPerProject: 2,
    retentionDays: 30,
    extraProjectCostMonthly: 0,
    includedModules: ["core"],
  },
  pro: {
    name: "Cloud Pro",
    maxProjects: 10,
    monthlyEventsPerProject: 250_000,
    maxMembersPerProject: 10,
    retentionDays: 365,
    extraProjectCostMonthly: 0,
    includedModules: [
      "core",
      "rum",
      "behavioral",
      "errors",
      "virtual_labs",
      "seo",
      "ai_aeo",
    ],
  },
  enterprise: {
    name: "Enterprise Cloud",
    maxProjects: 10, // Base included projects before extra add-ons
    monthlyEventsPerProject: 1_000_000,
    maxMembersPerProject: 999,
    retentionDays: 365,
    extraProjectCostMonthly: 10,
    includedModules: [
      "core",
      "rum",
      "behavioral",
      "errors",
      "virtual_labs",
      "seo",
      "ai_aeo",
    ],
  },
};

/**
 * Checks if a user's plan is currently active and not expired.
 */
export function isPlanActive(user: {
  plan?: string;
  planExpiresAt?: string | Date | null;
  subscriptionStatus?: string;
}): boolean {
  if (!user) return false;
  const plan = (user.plan || "free").toLowerCase() as SubscriptionPlan;
  if (plan === "free") return true;

  // If plan is pro or enterprise, check status & expiration
  if (user.subscriptionStatus === "canceled" || user.subscriptionStatus === "expired") {
    return false;
  }

  if (user.planExpiresAt) {
    const expiryDate = new Date(user.planExpiresAt);
    if (expiryDate.getTime() < Date.now()) {
      return false;
    }
  }

  return true;
}

/**
 * Returns effective plan: falls back to "free" if user subscription has expired.
 */
export function getUserEffectivePlan(user: {
  plan?: string;
  planExpiresAt?: string | Date | null;
  subscriptionStatus?: string;
  role?: string;
}): SubscriptionPlan {
  if (!user) return "free";
  if (user.role === "super_admin") return "enterprise";

  const rawPlan = (user.plan || "free").toLowerCase() as SubscriptionPlan;
  if (rawPlan === "free") return "free";

  return isPlanActive(user) ? rawPlan : "free";
}

/**
 * Calculates max allowed websites/projects for a user.
 */
export function getMaxAllowedProjects(user: {
  plan?: string;
  planExpiresAt?: string | Date | null;
  extraProjectsAllowed?: number;
  role?: string;
}): number {
  if (!user) return 1;
  if (user.role === "super_admin") return 9999;

  const effectivePlan = getUserEffectivePlan(user);
  const baseProjects = PLAN_LIMITS[effectivePlan].maxProjects;
  const extra = Math.max(0, user.extraProjectsAllowed || 0);

  return baseProjects + extra;
}

/**
 * Resolves project's effective plan based on the Project Owner's plan.
 * If project owner is Pro/Enterprise and active, project inherits Pro features.
 * Invited collaborators enjoy Pro on this project, but NOT on their own projects.
 */
export function getProjectEffectivePlan(
  project: { plan?: string },
  ownerUser: {
    plan?: string;
    planExpiresAt?: string | Date | null;
    subscriptionStatus?: string;
    role?: string;
  } | null | undefined
): SubscriptionPlan {
  if (!ownerUser) {
    return (project?.plan as SubscriptionPlan) || "free";
  }
  return getUserEffectivePlan(ownerUser);
}

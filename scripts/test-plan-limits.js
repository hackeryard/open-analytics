/**
 * Verification test suite for User-Level Subscriptions, Website Limits, and Member Inheritance
 */
import { PLAN_LIMITS, isPlanActive, getUserEffectivePlan, getMaxAllowedProjects, getProjectEffectivePlan } from "../lib/planLimits.js";

function runTests() {
  console.log("Starting Subscription Architecture Unit Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Free plan limits check
  assert(PLAN_LIMITS.free.maxProjects === 1, "Free plan is strictly capped at 1 website");
  assert(PLAN_LIMITS.free.monthlyEventsPerProject === 10000, "Free plan event limit is 10,000 / mo per project");
  assert(PLAN_LIMITS.free.maxMembersPerProject === 2, "Free plan team members capped at 2");

  // 2. Pro plan limits check
  assert(PLAN_LIMITS.pro.maxProjects === 10, "Pro plan includes 10 websites");
  assert(PLAN_LIMITS.pro.monthlyEventsPerProject === 250000, "Pro plan event limit is 250,000 / mo per project");
  assert(PLAN_LIMITS.pro.maxMembersPerProject === 10, "Pro plan team members capped at 10");

  // 3. Expiration checks
  const activeUser = {
    plan: "pro",
    planExpiresAt: new Date(Date.now() + 86400000 * 30), // 30 days from now
    subscriptionStatus: "active",
  };
  assert(isPlanActive(activeUser) === true, "Active Pro subscription within date range is valid");
  assert(getUserEffectivePlan(activeUser) === "pro", "Effective plan for active user is 'pro'");

  const expiredUser = {
    plan: "pro",
    planExpiresAt: new Date(Date.now() - 86400000), // 1 day ago
    subscriptionStatus: "active",
  };
  assert(isPlanActive(expiredUser) === false, "Subscription past planExpiresAt is expired");
  assert(getUserEffectivePlan(expiredUser) === "free", "Expired subscription gracefully degrades to 'free'");

  // 4. Max allowed websites calculation
  const freeUser = { plan: "free" };
  assert(getMaxAllowedProjects(freeUser) === 1, "Free user allowed 1 website");

  const proUser = { plan: "pro", planExpiresAt: new Date(Date.now() + 86400000 * 10) };
  assert(getMaxAllowedProjects(proUser) === 10, "Pro user allowed 10 websites");

  const enterpriseUser = {
    plan: "enterprise",
    planExpiresAt: new Date(Date.now() + 86400000 * 30),
    extraProjectsAllowed: 5,
  };
  assert(getMaxAllowedProjects(enterpriseUser) === 15, "Enterprise user allowed 10 base + 5 extra websites = 15");

  // 5. Collaborator Inheritance Check
  const projectA = { projectId: "prj_alpha" };
  const ownerPro = { plan: "pro", planExpiresAt: new Date(Date.now() + 86400000 * 30) };
  assert(getProjectEffectivePlan(projectA, ownerPro) === "pro", "Project owned by Pro user inherits 'pro' plan");

  const projectB = { projectId: "prj_beta" };
  const memberFree = { plan: "free" };
  assert(getProjectEffectivePlan(projectB, memberFree) === "free", "Project owned by Free collaborator remains 'free'");

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

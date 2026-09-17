"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Crown,
  Zap,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Users,
  Clock,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Bug,
  Flame,
  Bot,
  Lock,
  X,
  AlertTriangle,
  Mail,
  Info,
  MessageSquare,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import PlatformHeader from "@/components/PlatformHeader";

interface PlanDetails {
  plan: "free" | "pro" | "enterprise";
  effectivePlan: "free" | "pro" | "enterprise";
  isPlanActive: boolean;
  planExpiresAt: string | null;
  daysUntilExpiry: number | null;
  billingCycle: "monthly" | "annual";
  extraProjectsAllowed: number;
  subscriptionStatus: string;
  lockedActiveProjectId?: string;
  activeProjectSelectedAt?: string | null;
  usage: {
    ownedProjects: number;
    maxProjects: number;
    canCreateProject: boolean;
  };
  limits: {
    name: string;
    maxProjects: number;
    monthlyEventsPerProject: number;
    maxTeamMembersPerProject: number;
    retentionDays: number;
    customEvents: boolean;
    webVitalsRUM: boolean;
    behavioralUX: boolean;
    errorTracking: boolean;
    aiRadar: boolean;
  };
}

export default function BillingAndPlanPage() {
  const { currentUser, updateUserPlan, projects, checkAuth } = usePlatform();
  const [planData, setPlanData] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "annual">("monthly");

  // Confirmation Modals State
  const [pendingUpgrade, setPendingUpgrade] = useState<{
    plan: "pro" | "enterprise";
    cycle: "monthly" | "annual";
  } | null>(null);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);

  // Load Razorpay Standard Checkout script dynamically
  useEffect(() => {
    const scriptId = "razorpay-checkout-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Subscription Request State
  const [subscriptionStatusData, setSubscriptionStatusData] = useState<{
    hasActiveSubscription: boolean;
    subscription: any;
    pendingRequest: any;
    latestRequest: any;
    payments: any[];
  } | null>(null);

  const [requestMessage, setRequestMessage] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [cancellingRequestId, setCancellingRequestId] = useState<string | null>(null);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch("/api/subscription/me");
      if (res.ok) {
        const d = await res.json();
        setSubscriptionStatusData(d);
      }
    } catch (e) {
      console.error("Failed to load subscription status:", e);
    }
  };

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        const d = await res.json();
        setPlanData(d);
        if (d.billingCycle) {
          setSelectedCycle(d.billingCycle);
        }
      }
      await fetchSubscriptionStatus();
    } catch (e) {
      console.error("Failed to load plan details:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, []);

  // Downgrade handler executed after user confirms in the modal
  const handleConfirmDowngrade = async () => {
    setShowDowngradeModal(false);
    setUpdatingPlan("free");
    setMessage(null);
    try {
      const ok = await updateUserPlan("free", "monthly");
      if (ok) {
        setMessage({
          type: "success",
          text: "Successfully switched account to Free Starter tier.",
        });
        await fetchPlanDetails();
      } else {
        setMessage({
          type: "error",
          text: "Failed to update subscription. Please try again.",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setUpdatingPlan(null);
    }
  };

  // Submit Subscription Request (Temporary launch mode while online checkout is disabled)
  const handleSubmitSubscriptionRequest = async () => {
    if (!pendingUpgrade) return;
    const planId = `${pendingUpgrade.plan}-${pendingUpgrade.cycle}`;
    setSubmittingRequest(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscription/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          message: requestMessage,
        }),
      });

      const d = await res.json();
      if (!res.ok || !d.success) {
        throw new Error(d.error || "Failed to submit subscription request.");
      }

      setPendingUpgrade(null);
      setRequestMessage("");
      setMessage({
        type: "success",
        text: d.isExisting
          ? "You already have a subscription request pending review. We will reach out shortly."
          : `Subscription request for ${pendingUpgrade.plan.toUpperCase()} submitted! Our team will contact you with next steps.`,
      });
      await fetchPlanDetails();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to submit request." });
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Cancel an existing pending request
  const handleCancelRequest = async (requestId: string) => {
    setCancellingRequestId(requestId);
    try {
      const res = await fetch(`/api/subscription/requests/${requestId}/cancel`, {
        method: "POST",
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setMessage({
          type: "success",
          text: "Subscription request has been cancelled.",
        });
        await fetchPlanDetails();
      } else {
        throw new Error(d.error || "Failed to cancel request.");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to cancel request." });
    } finally {
      setCancellingRequestId(null);
    }
  };

  const handleSelectPlan = (
    targetPlan: "free" | "pro" | "enterprise",
    cycle: "monthly" | "annual" = selectedCycle
  ) => {
    if (targetPlan === "free") {
      setShowDowngradeModal(true);
      return;
    }
    setPendingUpgrade({ plan: targetPlan, cycle });
  };

  const effectivePlan = planData?.effectivePlan || currentUser?.effectivePlan || currentUser?.plan || "free";
  const isPro = effectivePlan === "pro";
  const isEnterprise = effectivePlan === "enterprise";

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-6xl mx-auto pb-16 px-1 sm:px-0 animate-fadeIn min-w-0">
      <PlatformHeader
        title="Subscription & Billing"
        subtitle="Manage your account-level subscription, website limits, team allocations, and Pro feature entitlements."
      />

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Subscription Overview Card */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#090d1a] to-[#060811] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Plan</span>
              <span
                className={`text-xs font-black uppercase px-3 py-0.5 rounded-full tracking-wider ${
                  effectivePlan === "enterprise"
                    ? "bg-gradient-to-r from-violet-400 to-indigo-400 text-slate-950 shadow-md shadow-violet-500/20"
                    : isPro
                    ? "bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-400 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-white/[0.08] text-slate-300 border border-white/[0.08]"
                }`}
              >
                {effectivePlan === "enterprise" ? "Enterprise Tier" : isPro ? "Cloud Pro Tier" : "Free Starter"}
              </span>
              {planData?.isPlanActive && effectivePlan !== "free" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {effectivePlan === "enterprise"
                ? "Enterprise Scale Infrastructure"
                : isPro
                ? "Cloud Pro Analytics Engine"
                : "Free Starter Account"}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed break-words">
              Subscriptions are assigned directly to your user profile (
              <span className="text-cyan-300 font-medium">{currentUser?.email}</span>). All workspaces you own
              automatically inherit your tier capabilities.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
            <button
              onClick={fetchPlanDetails}
              disabled={loading}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition disabled:opacity-50 cursor-pointer"
              title="Refresh Plan Details"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-cyan-400" : ""} />
            </button>
            <Link
              href="/projects"
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/[0.08]"
            >
              <Layers size={14} className="text-cyan-400" />
              <span>View Projects ({planData?.usage?.ownedProjects || projects?.length || 0})</span>
            </Link>
          </div>
        </div>

        {/* Quota & Limit Gauge Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers size={14} className="text-cyan-400" />
                Tracked Websites
              </span>
              <span className="font-mono text-white font-bold">
                {planData?.usage?.ownedProjects ?? 0} / {planData?.usage?.maxProjects ?? 1}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (((planData?.usage?.ownedProjects ?? 0) / (planData?.usage?.maxProjects || 1)) * 100)
                  )}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {planData?.usage?.canCreateProject
                ? "Website creation slots available"
                : "Slot ceiling reached"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                Events / mo / project
              </span>
              <span className="font-mono text-white font-bold">
                {planData?.limits?.monthlyEventsPerProject
                  ? (planData.limits.monthlyEventsPerProject / 1000).toLocaleString() + "k"
                  : "10k"}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 leading-snug">
              Unpooled quota strictly enforced per website project
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-indigo-400" />
                Team Members
              </span>
              <span className="font-mono text-white font-bold">
                Up to {planData?.limits?.maxTeamMembersPerProject ?? 2}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 leading-snug">
              Collaborators inherit your plan on your projects
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-400" />
                Data Retention
              </span>
              <span className="font-mono text-white font-bold">
                {planData?.limits?.retentionDays ?? 30} Days
              </span>
            </div>
            <div className="text-[10px] text-slate-500 leading-snug">
              {effectivePlan === "free" ? "30-day rolling analytical window" : "Full 365-day 1-year historical range"}
            </div>
          </div>
        </div>

        {/* Subscription Expiry / Renewal Notice */}
        {planData?.planExpiresAt && (
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400" />
              <span>
                Plan renewal date:{" "}
                <span className="text-white font-semibold">
                  {new Date(planData.planExpiresAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>{" "}
                ({planData.daysUntilExpiry} days remaining)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Billing cycle: {planData.billingCycle || "monthly"}
            </span>
          </div>
        )}

        {/* Locked Active Website on Expired / Free with Multi-projects */}
        {planData?.lockedActiveProjectId && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Active Tracking Website (Locked):</span>{" "}
                <span className="font-mono text-cyan-300 font-bold">{planData.lockedActiveProjectId}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Your Free Starter plan allows 1 active website. Once chosen, this active website cannot be switched until you upgrade to Cloud Pro.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-bold shrink-0">
              Locked
            </span>
          </div>
        )}

        {/* Live Pending Subscription Request Banner */}
        {subscriptionStatusData?.pendingRequest && (
          <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5 sm:mt-0">
                <Clock size={16} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    Subscription Request: {subscriptionStatusData.pendingRequest.planName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    {subscriptionStatusData.pendingRequest.status === "payment_pending"
                      ? "Awaiting Payment Verification"
                      : subscriptionStatusData.pendingRequest.status === "contacted"
                      ? "Team Contacted"
                      : "Under Review"}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {subscriptionStatusData.pendingRequest.status === "payment_pending"
                    ? "Our team has reviewed your request. Once your verified payment is confirmed, your subscription will be activated automatically."
                    : subscriptionStatusData.pendingRequest.status === "contacted"
                    ? "Our team has reached out via email regarding your subscription setup and payment steps."
                    : "Your subscription request has been received. An administrator will contact you with next steps."}
                </p>
                <div className="text-[10px] text-slate-400">
                  Submitted: {new Date(subscriptionStatusData.pendingRequest.createdAt).toLocaleString()} • Amount: ₹{subscriptionStatusData.pendingRequest.price.toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCancelRequest(subscriptionStatusData.pendingRequest._id)}
              disabled={cancellingRequestId !== null}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 hover:text-rose-300 border border-white/[0.1] hover:border-rose-500/30 text-slate-400 text-[11px] font-semibold transition cursor-pointer self-start sm:self-center shrink-0"
            >
              {cancellingRequestId ? "Cancelling..." : "Cancel Request"}
            </button>
          </div>
        )}

        {/* Temporary Launch Notice: Online Checkout Offline */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-3 text-xs text-slate-300">
          <Info size={16} className="text-cyan-400 shrink-0" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-white font-medium">Notice on Online Checkout:</strong> Automated payment gateway integration is currently completing final regulatory compliance verification. You can submit a <strong>Subscription Request</strong> to receive immediate manual review and activation.
          </p>
        </div>
      </div>

      {/* Subscription Tier Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Crown size={18} className="text-amber-400" />
              Available Subscription Plans
            </h3>
            <p className="text-xs text-slate-400">
              Switch your user subscription at any time via Razorpay (UPI, Netbanking, Cards). Features and limits take effect immediately.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-2xl border border-white/[0.08] self-start sm:self-auto">
            <button
              onClick={() => setSelectedCycle("monthly")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCycle === "monthly"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedCycle("annual")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCycle === "annual"
                  ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 bg-slate-950 text-amber-300 rounded-md">
                2 Mo Free
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* FREE TIER */}
          <div
            className={`p-6 rounded-3xl bg-[#0b1020]/90 border flex flex-col justify-between transition ${
              effectivePlan === "free"
                ? "border-cyan-500/50 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20"
                : "border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
                {effectivePlan === "free" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 font-mono">
                    Current
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">₹0</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Essential privacy-first cookieless analytics for indie developers and personal blogs.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span><strong>1 Tracked Website</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>10,000 events / month / project</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Up to 2 team members</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>30-day historical data retention</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Sub-3.2KB featherweight script</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {effectivePlan === "free" ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-white/[0.05] text-slate-400 text-xs font-bold cursor-default"
                >
                  Active Plan
                </button>
              ) : (
                <button
                  onClick={() => handleSelectPlan("free")}
                  disabled={updatingPlan !== null}
                  className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  {updatingPlan === "free" ? "Downgrading..." : "Downgrade to Free"}
                </button>
              )}
            </div>
          </div>

          {/* PRO TIER */}
          <div
            className={`p-6 rounded-3xl bg-gradient-to-b from-[#0e1629] to-[#070b16] border flex flex-col justify-between relative shadow-xl ${
              isPro
                ? "border-amber-400/50 shadow-amber-500/10 ring-1 ring-amber-400/30"
                : "border-cyan-500/30 hover:border-cyan-400/50"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Crown size={14} />
                  Cloud Pro
                </span>
                {isPro && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono">
                    Current
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {selectedCycle === "annual" ? "₹14,999" : "₹1,499"}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {selectedCycle === "annual" ? "year" : "month"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Advanced observability, AI search crawler radar, and real user Core Web Vitals.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span><strong>10 Tracked Websites Included</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>250,000 events / month / project</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Up to 10 team members per project</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Full 365-day (1-year) data retention</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>AI Search Crawler Radar (Perplexity/ChatGPT)</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Real User Core Web Vitals (LCP, INP, CLS)</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Rage Click & Behavioral UX Telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Runtime Crash & Exception Triage</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {isPro ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-bold cursor-default border border-amber-400/30"
                >
                  Active Plan
                </button>
              ) : subscriptionStatusData?.pendingRequest?.planId?.startsWith("pro") ? (
                <button
                  disabled
                  className="w-full py-3 px-3 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-default flex items-center justify-center gap-1.5"
                >
                  <Clock size={14} className="shrink-0 animate-pulse" />
                  <span>Request Pending Review</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSelectPlan("pro", selectedCycle)}
                  disabled={updatingPlan !== null || Boolean(subscriptionStatusData?.pendingRequest)}
                  className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 hover:from-amber-300 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-1.5 text-center"
                >
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">
                    Request Cloud Pro ({selectedCycle === "annual" ? "₹14,999/yr" : "₹1,499/mo"})
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ENTERPRISE TIER */}
          <div
            className={`p-6 rounded-3xl bg-[#0b1020]/90 border flex flex-col justify-between transition ${
              isEnterprise
                ? "border-violet-500/50 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20"
                : "border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</span>
                {isEnterprise && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono">
                    Current
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {selectedCycle === "annual" ? "₹79,990" : "₹7,999"}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {selectedCycle === "annual" ? "year" : "month"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  High-throughput telemetry for organizations with multiple brands and scaling traffic.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span><strong>10 Websites Base + Additional Capacity</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>1,000,000 events / month / project</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>Unlimited collaborators per project</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>Full 365-day data retention</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>All 5 Power Modules Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>Priority ingestion pipeline & SLA</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {isEnterprise ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-violet-500/20 text-violet-300 text-xs font-bold cursor-default border border-violet-500/30"
                >
                  Active Plan
                </button>
              ) : subscriptionStatusData?.pendingRequest?.planId?.startsWith("enterprise") ? (
                <button
                  disabled
                  className="w-full py-3 px-3 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/30 text-xs font-bold cursor-default flex items-center justify-center gap-1.5"
                >
                  <Clock size={14} className="shrink-0 animate-pulse" />
                  <span>Request Pending Review</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSelectPlan("enterprise", selectedCycle)}
                  disabled={updatingPlan !== null || Boolean(subscriptionStatusData?.pendingRequest)}
                  className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-md shadow-violet-500/20 cursor-pointer flex items-center justify-center gap-1.5 text-center"
                >
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">
                    Request Enterprise ({selectedCycle === "annual" ? "₹79,990/yr" : "₹7,999/mo"})
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Entitlements Breakdown Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 shadow-xl">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-cyan-400" />
            Module Entitlements Comparison
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of features unlocked by user-level subscription plans.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Telemetry Capability</th>
                <th className="py-3 px-4">Free Starter</th>
                <th className="py-3 px-4 text-amber-300">Cloud Pro</th>
                <th className="py-3 px-4 text-violet-300">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" /> Core Web Analytics
                </td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Included</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Included</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" /> Core Web Vitals (LCP, INP, CLS)
                </td>
                <td className="py-3 px-4 text-slate-500">Locked</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Full RUM Stream</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Full RUM Stream</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <Bot size={14} className="text-purple-400" /> AI Crawler Radar (GEO & LLMs)
                </td>
                <td className="py-3 px-4 text-slate-500">Locked</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Real-time Radar</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Real-time Radar</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <Flame size={14} className="text-amber-400" /> Behavioral UX & Rage Clicks
                </td>
                <td className="py-3 px-4 text-slate-500">Locked</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Active</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Active</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <Bug size={14} className="text-rose-400" /> Crash & Runtime Exception Triage
                </td>
                <td className="py-3 px-4 text-slate-500">Locked</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Automated</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Automated</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <Zap size={14} className="text-cyan-400" /> Custom Event Telemetry
                </td>
                <td className="py-3 px-4 text-slate-500">Locked</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Unlimited Rules</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Unlimited Rules</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Historical Lookback Window</td>
                <td className="py-3 px-4 font-mono text-slate-400">30 Days</td>
                <td className="py-3 px-4 font-mono text-amber-300 font-bold">365 Days (1 Year)</td>
                <td className="py-3 px-4 font-mono text-violet-300 font-bold">365 Days (1 Year)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* UPGRADE CONFIRMATION MODAL */}
      {pendingUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0c1222] border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/10 space-y-4 sm:space-y-6 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Crown size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Upgrade to {pendingUpgrade.plan === "enterprise" ? "Enterprise" : "Cloud Pro"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {pendingUpgrade.cycle === "annual" ? "Annual Billing (2 Months Free)" : "Monthly Flexible Billing"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPendingUpgrade(null)}
                className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Plan Price & Details Summary */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-slate-400">Total Investment:</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {pendingUpgrade.plan === "enterprise"
                      ? pendingUpgrade.cycle === "annual"
                        ? "₹79,990"
                        : "₹7,999"
                      : pendingUpgrade.cycle === "annual"
                      ? "₹14,999"
                      : "₹1,499"}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    /{pendingUpgrade.cycle === "annual" ? "year" : "month"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>
                    <strong>
                      {pendingUpgrade.plan === "enterprise" ? "10 Base Websites + Add-ons" : "10 Tracked Websites Included"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>
                    {pendingUpgrade.plan === "enterprise"
                      ? "1,000,000 events / mo per project"
                      : "250,000 events / mo per project"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Full 365-day historical data retention</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>All 5 Power Modules (Core Web Vitals, AI Radar, Rage Clicks, Crash Triage)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Reactivates any paused projects & unlocks single website restrictions</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs text-amber-200">
              <div className="flex items-center gap-2 font-bold text-white">
                <Info size={15} className="text-amber-400 shrink-0" />
                <span>Online payments are temporarily unavailable</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                We are currently completing our secure payment gateway verification. Submit a subscription request below and our team will contact you directly with manual payment instructions and activate your tier immediately upon verification.
              </p>
            </div>

            {/* Optional Note to Admin */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-cyan-400" />
                <span>Notes or Requirements (Optional)</span>
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="E.g. Invoicing details, preferred contact channel, or custom team size..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => setPendingUpgrade(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSubscriptionRequest}
                disabled={submittingRequest}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 hover:from-amber-300 hover:to-cyan-300 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <Mail size={15} className="shrink-0" />
                <span className="truncate">{submittingRequest ? "Submitting Request..." : "Submit Subscription Request"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOWNGRADE CONFIRMATION MODAL */}
      {showDowngradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0c1222] border border-rose-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-rose-500/10 space-y-4 sm:space-y-6 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Confirm Downgrade to Free Starter</h3>
                  <p className="text-xs text-slate-400">Please review what happens when switching to Free</p>
                </div>
              </div>
              <button
                onClick={() => setShowDowngradeModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Impact Warning Notice */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2.5 text-xs text-rose-200">
              <span className="font-bold text-white flex items-center gap-1.5">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                Account Limitations Upon Downgrading:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>
                  Your account website limit will drop to <strong>1 active website</strong>.
                </li>
                <li>
                  If you currently own multiple websites, you will be asked to choose <strong>1 website to keep active</strong>. Other websites will pause live telemetry ingestion.
                </li>
                <li>
                  Event quota reduces to <strong>10,000 events/month</strong> per website.
                </li>
                <li>
                  Historical retention window reduces to <strong>30 days</strong> (raw data over 30 days becomes inaccessible).
                </li>
                <li>
                  Collaborator quota reduces to <strong>2 team members</strong> per website.
                </li>
              </ul>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to downgrade? You can upgrade back to Cloud Pro at any time.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => setShowDowngradeModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer text-center"
              >
                Keep Current Plan
              </button>
              <button
                onClick={handleConfirmDowngrade}
                disabled={updatingPlan !== null}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer text-center"
              >
                {updatingPlan === "free" ? "Downgrading..." : "Yes, Downgrade to Free"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

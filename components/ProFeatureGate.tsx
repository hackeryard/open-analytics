"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  LucideIcon,
  Crown,
  Check,
  RefreshCw,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

interface ProFeatureGateProps {
  featureName: string;
  featureKey: "rum" | "ai_radar" | "behavioral" | "errors" | "custom_domain" | "custom_events";
  icon: LucideIcon;
  description: string;
  highlights: string[];
  children: React.ReactNode;
}

export default function ProFeatureGate({
  featureName,
  featureKey,
  icon: Icon,
  description,
  highlights,
  children,
}: ProFeatureGateProps) {
  const { activeProject, updateProjectPlan } = usePlatform();
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Check if active project has Pro or Enterprise plan
  const isPro =
    activeProject?.plan === "pro" || activeProject?.plan === "enterprise";

  // Quick 1-click upgrade handler
  const handleQuickUpgrade = async () => {
    if (!activeProject?.projectId) return;
    setUpgrading(true);
    const success = await updateProjectPlan(activeProject.projectId, "pro");
    setUpgrading(false);
    if (success) {
      setUpgradeSuccess(true);
      setTimeout(() => setUpgradeSuccess(false), 2500);
    }
  };

  // If project is Pro, render the full telemetry dashboard
  if (isPro) {
    return (
      <div className="space-y-6">
        {/* Subtle Pro Status Pill */}
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">{featureName}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950">
              Pro Active
            </span>
          </div>
          <Link
            href={`/projects/${activeProject?.projectId}/settings#plan`}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition underline underline-offset-2"
          >
            Manage Subscription
          </Link>
        </div>

        {children}
      </div>
    );
  }

  // Free Tier: Render the sleek Pro Feature Gate
  return (
    <div className="relative min-h-[75vh] w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#060913] p-6 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl">
      {/* Background glow & subtle blurred children preview */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-slate-900/80 to-[#060913] backdrop-blur-md pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Paywall Container */}
      <div className="relative z-10 max-w-2xl w-full mx-auto space-y-6">
        {/* Feature Icon & Lock Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/15">
          <Icon className="w-10 h-10" />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
            <Lock className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Pro Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Exclusive Pro Feature</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Unlock {featureName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Highlight Bullets */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 text-left max-w-lg mx-auto shadow-inner">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            What you get with Pro:
          </div>
          <ul className="space-y-2.5 text-xs text-slate-200">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleQuickUpgrade}
            disabled={upgrading}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {upgrading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Upgrading Project...</span>
              </>
            ) : upgradeSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Upgraded to Pro!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Upgrade to Pro — $19/mo (Unlock Instantly)</span>
              </>
            )}
          </button>

          <Link
            href="/pricing"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <span>Compare Plans</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        <p className="text-[11px] text-slate-500">
          Core web analytics remain 100% free with unlimited basic telemetry.
        </p>
      </div>
    </div>
  );
}

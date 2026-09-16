"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  Zap,
  ArrowRight,
  X,
  Layers,
  Crown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
  const { currentUser, ownedProjectsCount, maxAllowedProjects, canCreateProject } = usePlatform();

  if (!isOpen) return null;

  const currentPlan = currentUser?.plan || "free";
  const isFree = currentPlan === "free";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#070b16] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.15)] z-10 animate-scaleIn space-y-6">
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 rounded-t-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                Website Quota Limit Reached
              </h3>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase tracking-wider">
                {currentPlan}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You have reached your plan limit of{" "}
              <span className="font-bold text-white">{maxAllowedProjects} {maxAllowedProjects === 1 ? "website" : "websites"}</span>.
              The project creation wizard cannot be opened until your plan is upgraded.
            </p>
          </div>
        </div>

        {/* Usage Progress Box */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Layers size={14} className="text-cyan-400" /> Current Websites Created
            </span>
            <span className="font-mono font-bold text-amber-400">
              {ownedProjectsCount} / {maxAllowedProjects}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              style={{ width: "100%" }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            {isFree ? (
              <span>
                Free Starter includes <strong className="text-slate-200">1 website</strong>. Upgrade to{" "}
                <strong className="text-cyan-300">Cloud Pro</strong> to track up to{" "}
                <strong className="text-cyan-300">10 websites</strong> with 250k monthly events, RUM, and behavioral heatmaps.
              </span>
            ) : (
              <span>
                You have deployed all <strong className="text-slate-200">{maxAllowedProjects} websites</strong> in your subscription.
                Upgrade to Enterprise or add additional website slots to create more.
              </span>
            )}
          </p>
        </div>

        {/* Benefits Highlight */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {isFree ? "Unlocked with Cloud Pro:" : "Enterprise Expansion:"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Up to 10 Websites</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>250k Events / Mo / Site</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Core Web Vitals &amp; RUM</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>10 Collaborators</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/billing"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Crown size={14} className="text-amber-300" />
            <span>Upgrade Plan in Billing</span>
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

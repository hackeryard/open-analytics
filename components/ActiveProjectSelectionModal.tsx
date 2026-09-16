"use client";

import React, { useState } from "react";
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
  Radio,
  Globe,
  Activity,
  Check,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

interface ActiveProjectSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function ActiveProjectSelectionModal({
  isOpen,
  onClose,
}: ActiveProjectSelectionModalProps) {
  const {
    currentUser,
    projects,
    selectActiveProject,
    isPlanExpired,
    dismissActiveProjectModal,
  } = usePlatform();

  const handleClose = () => {
    if (dismissActiveProjectModal) {
      dismissActiveProjectModal();
    }
    if (onClose) {
      onClose();
    }
  };

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const ownedProjects = projects.filter(
    (p) => p.isOwner || p.currentUserRole === "owner" || p.role === "owner"
  );

  const lockedId = currentUser?.lockedActiveProjectId || "";
  const effectiveSelectedId = selectedProjectId || lockedId || ownedProjects[0]?.projectId || "";

  const handleConfirm = async () => {
    if (!effectiveSelectedId) {
      setError("Please choose an analytics website to keep active.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await selectActiveProject(effectiveSelectedId);
      if (!res.success) {
        setError(res.error || "Failed to set active project");
      } else {
        handleClose();
      }
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md animate-fadeIn cursor-pointer" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#070b16] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.18)] z-10 animate-scaleIn space-y-6">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-t-3xl" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
          title="Dismiss for this session"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                Select Your 1 Active Website
              </h3>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase tracking-wider">
                {isPlanExpired ? "Subscription Expired" : "Free Plan Boundary"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Your account is on the Free Starter tier, which permits live tracking on strictly{" "}
              <strong className="text-white">1 website</strong>. Please choose which property will remain active.
            </p>
          </div>
        </div>

        {/* Locked Notice Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300 leading-snug">
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Strict One-Time Selection:</strong> Once selected, your active tracking website cannot be switched to another project until you renew or upgrade to Cloud Pro. Telemetry on other websites will be paused, but all historical data remains safe.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Project Selection List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {ownedProjects.map((p) => {
            const isSelected = effectiveSelectedId === p.projectId;
            const isCurrentlyLocked = lockedId === p.projectId;

            return (
              <div
                key={p.projectId}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!lockedId) {
                    setSelectedProjectId(p.projectId);
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !lockedId) {
                    setSelectedProjectId(p.projectId);
                  }
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition select-none ${
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500/40 text-white shadow-md shadow-cyan-500/10"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04]"
                } ${lockedId && !isCurrentlyLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                    {p.name ? p.name[0].toUpperCase() : "W"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                      <span>{p.name}</span>
                      {isCurrentlyLocked && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Locked Active
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {p.allowedDomains?.join(", ") || p.projectId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500 text-slate-950"
                        : "border-slate-600 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {!lockedId ? (
            <>
              <button
                onClick={handleConfirm}
                disabled={submitting || !effectiveSelectedId}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:from-amber-400 hover:via-orange-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                <Lock size={14} />
                <span>{submitting ? "Locking Selection..." : "Confirm & Lock Active Website"}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer"
              >
                Dismiss
              </button>
            </>
          ) : (
            <div className="w-full sm:flex-1 text-center sm:text-left text-xs text-amber-400 font-semibold py-2">
              Active website is locked ({lockedId}). Upgrade to Pro to unlock multi-site tracking.
            </div>
          )}

          <Link
            href="/billing"
            onClick={handleClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Crown size={14} className="text-amber-300" />
            <span>Upgrade to Pro</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

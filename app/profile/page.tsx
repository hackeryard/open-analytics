"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Crown,
  Key,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
  FolderGit2,
  ExternalLink,
  Save,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import PlatformHeader from "@/components/PlatformHeader";

export default function ProfilePage() {
  const { currentUser, handleLogout, projects } = usePlatform();
  const [name, setName] = useState(currentUser?.name || "");
  const [saved, setSaved] = useState(false);

  const effectivePlan = currentUser?.effectivePlan || currentUser?.plan || "free";
  const isPro = effectivePlan === "pro";
  const isEnterprise = effectivePlan === "enterprise";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 animate-fadeIn">
      <PlatformHeader
        title="Account & Profile"
        subtitle="Manage your personal developer profile, active plan tier, authentication credentials, and workspace memberships."
      />

      {/* User Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : "U"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{currentUser?.name || "Developer"}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 capitalize font-bold">
                  {currentUser?.role ? currentUser.role.replace("_", " ") : "Member"}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail size={13} className="text-slate-500" />
                <span>{currentUser?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/billing"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 hover:from-amber-300 hover:to-cyan-300 text-slate-950 text-xs font-bold transition shadow-md flex items-center gap-1.5"
            >
              <CreditCard size={14} />
              <span>Manage Billing & Plan</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition border border-rose-500/20 flex items-center gap-1.5 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={currentUser?.email || ""}
              disabled
              className="w-full px-4 py-2.5 bg-[#060a14]/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500">Email is linked to authentication credentials and cannot be edited directly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Plan Status</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Crown size={14} className="text-amber-400" />
              <span className="capitalize">{effectivePlan} Tier</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Workspaces</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <FolderGit2 size={14} className="text-cyan-400" />
              <span>{projects?.length || 0} Project{projects?.length === 1 ? "" : "s"} Accessible</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Billing Cycle</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Calendar size={14} className="text-indigo-400" />
              <span className="capitalize">{currentUser?.billingCycle || "Monthly"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Projects List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 size={18} className="text-cyan-400" />
              Your Associated Workspaces
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Projects you either own or participate in as a collaborator.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition"
          >
            <span>Manage All</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {projects && projects.length > 0 ? (
            projects.map((p) => (
              <div key={p.projectId} className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{p.projectId}</span>
                    {p.isOwner && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300">
                        Owner
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Plan: <span className="text-slate-300 font-semibold uppercase">{p.effectivePlan || p.plan || "free"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${p.projectId}/settings`}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition"
                  >
                    Settings
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              No workspaces found. Create your first project from the sidebar!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

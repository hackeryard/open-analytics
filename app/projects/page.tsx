"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderGit2,
  Plus,
  Crown,
  Shield,
  Users,
  Settings,
  Code2,
  ExternalLink,
  ArrowRight,
  Search,
  Check,
  Globe,
  Radio,
  Clock,
  Layers,
  Sparkles,
  ArrowRightLeft,
  X,
  AlertCircle,
  Edit3,
  Smartphone,
  Zap,
  Activity,
  Copy,
  LayoutDashboard,
  CheckCircle2,
  Sliders,
  Lock,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import CreateProjectModal from "@/components/CreateProjectModal";
import LimitReachedModal from "@/components/LimitReachedModal";

export default function ProjectsDirectoryPage() {
  const router = useRouter();
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    showNewProjectModal,
    setShowNewProjectModal,
    showLimitModal,
    setShowLimitModal,
    canCreateProject,
    openCreateProject,
    ownedProjectsCount,
    maxAllowedProjects,
    fetchData,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Transfer Ownership Modal
  const [transferProject, setTransferProject] = useState<any | null>(null);
  const [transferTargetEmail, setTransferTargetEmail] = useState("");
  const [transferConfirmName, setTransferConfirmName] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const filteredProjects = (projects || []).filter((p: any) => {
    // Role filter
    if (roleFilter !== "all") {
      if (roleFilter === "owner" && p.currentUserRole !== "owner" && p.currentUserRole !== "super_admin") {
        return false;
      }
      if (roleFilter === "admin" && p.currentUserRole !== "admin") {
        return false;
      }
      if (roleFilter === "editor" && p.currentUserRole !== "editor") {
        return false;
      }
    }

    // Keyword filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.projectId || "").toLowerCase().includes(q) ||
      (p.measurementId || "").toLowerCase().includes(q) ||
      (p.industryCategory || "").toLowerCase().includes(q) ||
      (p.slug || "").toLowerCase().includes(q)
    );
  });

  const copyMeasurementId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAndNavigate = (projectId: string, path = "/") => {
    setActiveProjectId(projectId);
    router.push(path);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferProject || !transferTargetEmail.trim()) return;

    if (transferConfirmName !== transferProject.name) {
      setTransferError(`Please type "${transferProject.name}" exactly to confirm ownership transfer.`);
      return;
    }

    setTransferring(true);
    setTransferError(null);
    setTransferSuccess(null);

    try {
      const res = await fetch(`/api/projects/${transferProject.projectId}/transfer-ownership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: transferTargetEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTransferError(data.error || "Failed to transfer project ownership");
      } else {
        setTransferSuccess(data.message || "Ownership transferred successfully!");
        setTimeout(() => {
          setTransferProject(null);
          setTransferTargetEmail("");
          setTransferConfirmName("");
          setTransferSuccess(null);
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      setTransferError(err.message || "Network error");
    } finally {
      setTransferring(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "owner" || role === "super_admin") {
      return {
        label: role === "super_admin" ? "Super Admin" : "Owner",
        icon: Crown,
        color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    }
    if (role === "admin") {
      return {
        label: "Administrator",
        icon: Shield,
        color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      };
    }
    if (role === "editor") {
      return {
        label: "Editor",
        icon: Edit3,
        color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      };
    }
    return {
      label: "Viewer / Analyst",
      icon: Users,
      color: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
              <FolderGit2 size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Analytics Properties &amp; Streams</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your analytics properties, data streams, and measurement protocol settings.
              </p>
            </div>
          </div>
        </div>

        {canCreateProject ? (
          <button
            onClick={() => openCreateProject()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Property</span>
          </button>
        ) : (
          <button
            onClick={() => setShowLimitModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-lg shadow-amber-500/10 transition cursor-pointer"
          >
            <Lock size={15} className="text-amber-400" />
            <span>Limit Reached ({ownedProjectsCount}/{maxAllowedProjects})</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0b1020]/90 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Total Properties
          </span>
          <div className="text-2xl font-black text-white mt-1">{(projects || []).length}</div>
          <span className="text-[11px] text-cyan-400 font-medium">Multi-tenant isolated</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1020]/90 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Active Data Streams
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {(projects || []).reduce((acc, p) => acc + (p.dataStreams?.length || 1), 0)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Web &amp; Mobile streams</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1020]/90 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Measurement Tag
          </span>
          <div className="text-2xl font-black text-cyan-300 mt-1">&lt; 3.2 KB</div>
          <span className="text-[11px] text-slate-400 font-medium">Zero cookies • GDPR</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1020]/90 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Query Engine
          </span>
          <div className="text-2xl font-black text-indigo-300 mt-1">&lt; 2 ms</div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow" /> Real-time
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0b1020]/80 border border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties, Measurement IDs..."
            className="w-full pl-10 pr-4 py-2 bg-[#060a14] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Properties" },
            { id: "owner", label: "Owned by Me" },
            { id: "admin", label: "Admin Access" },
            { id: "editor", label: "Editor" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                roleFilter === tab.id
                  ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p: any) => {
          const isActive = p.projectId === activeProjectId;
          const roleBadge = getRoleBadge(p.currentUserRole || "member");
          const RoleIcon = roleBadge.icon;
          const measurementId = p.measurementId || `OA-${p.projectId.replace("open_prj_", "").replace("prj_", "").toUpperCase()}`;
          const isOwner = p.currentUserRole === "owner" || p.currentUserRole === "super_admin";

          return (
            <div
              key={p._id || p.projectId}
              className={`rounded-3xl bg-[#0b1020]/90 border p-5 transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between space-y-4 relative ${
                isActive
                  ? "border-cyan-500/50 shadow-[0_10px_30px_rgba(6,182,212,0.15)] bg-gradient-to-b from-[#0e162c] to-[#0b1020]"
                  : "border-white/[0.08] hover:border-cyan-500/30 shadow-md"
              }`}
            >
              {/* Card Top: Name & Role Badge */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-sm font-black shrink-0">
                      {p.name ? p.name[0].toUpperCase() : "P"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-sm text-white truncate">{p.name}</h3>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-glow shrink-0" title="Active Workspace" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {p.industryCategory || "Technology & Software"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${roleBadge.color}`}
                  >
                    <RoleIcon size={12} />
                    <span>{roleBadge.label}</span>
                  </span>
                </div>

                {/* Measurement ID & Timezone Bar */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-slate-500">ID:</span>
                    <button
                      onClick={(e) => copyMeasurementId(e, measurementId)}
                      className="font-mono text-[11px] font-bold text-cyan-300 hover:text-white transition flex items-center gap-1 truncate"
                      title="Copy Measurement ID"
                    >
                      <span className="truncate">{measurementId}</span>
                      {copiedId === measurementId ? (
                        <Check size={12} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Copy size={12} className="text-slate-500 hover:text-cyan-300 shrink-0" />
                      )}
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 shrink-0">
                    {p.currency || "USD"} • {p.timezone || "UTC"}
                  </div>
                </div>

                {/* Data Streams & Monitoring Status */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px]">
                      <Globe size={11} className="text-cyan-400" />
                      <span>{p.dataStreams?.length || 1} Stream</span>
                    </div>

                    {p.monitoringStatus === "active" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>Pending Ping</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 truncate max-w-[110px]">
                    {p.allowedDomains?.join(", ") || "*"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSelectAndNavigate(p.projectId, "/")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300"
                  }`}
                >
                  <LayoutDashboard size={13} />
                  <span>{isActive ? "Active View" : "Open Analytics"}</span>
                </button>

                <Link
                  href={`/projects/${p.projectId}/install`}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-cyan-300 transition"
                  title="Web Tag & Stream Setup"
                >
                  <Code2 size={14} />
                </Link>

                <Link
                  href={`/projects/${p.projectId}/settings`}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-cyan-300 transition"
                  title="Property Admin Settings"
                >
                  <Settings size={14} />
                </Link>

                {isOwner && (
                  <button
                    onClick={() => {
                      setTransferProject(p);
                      setTransferTargetEmail("");
                      setTransferConfirmName("");
                      setTransferError(null);
                    }}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/30 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                    title="Transfer Property Ownership"
                  >
                    <ArrowRightLeft size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0b1020]/60 border border-white/[0.08] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
            <FolderGit2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No properties found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No analytics properties matched your search filters. Create your first property with our setup wizard.
            </p>
          </div>
          {canCreateProject ? (
            <button
              onClick={() => openCreateProject()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Property</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLimitModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer"
            >
              <Lock size={14} className="text-amber-400" />
              <span>Limit Reached - Upgrade Plan</span>
            </button>
          )}
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {transferProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setTransferProject(null)}
          />
          <div className="relative max-w-md w-full bg-[#0b1020] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Crown size={18} />
                <h3 className="text-base font-bold text-white">Transfer Property Ownership</h3>
              </div>
              <button
                onClick={() => setTransferProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Transfer full administrative ownership of <strong className="text-white">&ldquo;{transferProject.name}&rdquo;</strong> to another user.
            </p>

            {transferError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{transferError}</span>
              </div>
            )}

            {transferSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{transferSuccess}</span>
              </div>
            )}

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Recipient Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={transferTargetEmail}
                  onChange={(e) => setTransferTargetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a14] border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Type property name <span className="text-amber-400">&ldquo;{transferProject.name}&rdquo;</span> to confirm
                </label>
                <input
                  type="text"
                  required
                  placeholder={transferProject.name}
                  value={transferConfirmName}
                  onChange={(e) => setTransferConfirmName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a14] border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setTransferProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300 hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {transferring ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Creation Wizard */}
      <CreateProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={() => {
          fetchData();
        }}
      />

      {/* Plan Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}

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
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function ProjectsDirectoryPage() {
  const router = useRouter();
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    showNewProjectModal,
    setShowNewProjectModal,
    handleCreateProject,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomains, setNewProjectDomains] = useState("*");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Transfer Ownership quick modal
  const [transferProject, setTransferProject] = useState<any | null>(null);
  const [transferTargetEmail, setTransferTargetEmail] = useState("");
  const [transferConfirmName, setTransferConfirmName] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const filteredProjects = (projects || []).filter((p: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.projectId || "").toLowerCase().includes(q) ||
      (p.slug || "").toLowerCase().includes(q)
    );
  });

  const ownedProjectsCount = (projects || []).filter(
    (p: any) => p.currentUserRole === "owner" || p.currentUserRole === "super_admin"
  ).length;

  const adminProjectsCount = (projects || []).filter(
    (p: any) => p.currentUserRole === "admin"
  ).length;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    setCreateError(null);

    const success = await handleCreateProject(newProjectName, newProjectDomains);
    setCreating(false);
    if (success) {
      setNewProjectName("");
      setNewProjectDomains("*");
      setShowNewProjectModal(false);
      router.push("/");
    } else {
      setCreateError("Failed to create project. Please try again.");
    }
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
    if (role === "owner") {
      return {
        label: "Owner",
        icon: Crown,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      };
    }
    if (role === "admin") {
      return {
        label: "Admin",
        icon: Shield,
        color: "bg-primary/10 text-primary border-primary/30",
      };
    }
    if (role === "editor") {
      return {
        label: "Editor",
        icon: Edit3,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      };
    }
    if (role === "super_admin") {
      return {
        label: "Super Admin",
        icon: Crown,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      };
    }
    return {
      label: "Member",
      icon: Users,
      color: "bg-muted text-muted-foreground border-border",
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6 pb-20">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <FolderGit2 size={24} className="text-primary" />
            <span>Workspace &amp; Project Management</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your analytics projects, governance roles, team access, and ownership transfers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewProjectModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>New Project</span>
        </button>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Total Accessible Projects
          </span>
          <span className="text-2xl font-black font-mono text-foreground">
            {projects.length}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Workspaces available to your account
          </span>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Projects Owned
          </span>
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {ownedProjectsCount}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Workspaces with full owner governance
          </span>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Admin Access
          </span>
          <span className="text-2xl font-black font-mono text-primary">
            {adminProjectsCount}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Workspaces with administrative permissions
          </span>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Active Workspace
          </span>
          <span className="text-sm font-bold font-mono text-foreground truncate block">
            {projects.find((p) => p.projectId === activeProjectId)?.name || "Default Project"}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono truncate block">
            {activeProjectId}
          </span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, ID, or slug..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs"
          />
        </div>
      </div>

      {/* ── Projects Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-16 text-center text-muted-foreground bg-card border border-border rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-2">
              <FolderGit2 size={24} />
            </div>
            <h4 className="text-sm font-bold text-foreground">No Projects Found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              No analytics workspaces matched your search query.
            </p>
          </div>
        ) : (
          filteredProjects.map((p: any) => {
            const isActive = p.projectId === activeProjectId;
            const roleInfo = getRoleBadge(p.currentUserRole || "member");
            const RoleIcon = roleInfo.icon;
            const isOwner = p.currentUserRole === "owner" || p.currentUserRole === "super_admin";

            return (
              <div
                key={p.projectId}
                className={`bg-card border rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition ${
                  isActive ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-border/80"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Role badge & Active Indicator */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border inline-flex items-center gap-1 ${roleInfo.color}`}
                    >
                      <RoleIcon size={11} />
                      <span>{roleInfo.label}</span>
                    </span>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                        Active Workspace
                      </span>
                    )}
                  </div>

                  {/* Project Name & ID */}
                  <div>
                    <h3 className="text-base font-black text-foreground truncate" title={p.name}>
                      {p.name}
                    </h3>
                    <span className="text-[11px] font-mono text-muted-foreground block truncate mt-0.5">
                      {p.projectId}
                    </span>
                  </div>

                  {/* Allowed Domains */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe size={12} className="text-blue-500 shrink-0" />
                    <span className="truncate font-mono text-[11px]">
                      {Array.isArray(p.allowedDomains) ? p.allowedDomains.join(", ") : "*"}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProjectId(p.projectId);
                        router.push("/");
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-accent text-foreground"
                      }`}
                    >
                      <span>Open Hub</span>
                      <ArrowRight size={12} />
                    </button>

                    <Link
                      href={`/projects/${p.projectId}/settings`}
                      className="px-3 py-2 rounded-xl bg-background hover:bg-muted border border-border text-foreground text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Settings size={12} className="text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <Link
                      href={`/projects/${p.projectId}/install`}
                      className="text-muted-foreground hover:text-primary transition flex items-center gap-1 font-mono"
                    >
                      <Code2 size={11} />
                      <span>Get Script</span>
                    </Link>

                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          setTransferProject(p);
                          setTransferTargetEmail("");
                          setTransferError(null);
                          setTransferSuccess(null);
                        }}
                        className="text-amber-600 dark:text-amber-400 hover:underline transition flex items-center gap-1 font-mono cursor-pointer"
                      >
                        <ArrowRightLeft size={10} />
                        <span>Transfer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── CREATE PROJECT MODAL ── */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowNewProjectModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <FolderGit2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Create Analytics Project</h3>
                  <p className="text-xs text-muted-foreground">You will automatically be assigned as Admin &amp; Owner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Project Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Web App, My SaaS Platform"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Allowed Domain(s):</label>
                <input
                  type="text"
                  placeholder="e.g. app.acme.com, staging.acme.com, *"
                  value={newProjectDomains}
                  onChange={(e) => setNewProjectDomains(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Use comma separated list or &quot;*&quot; to permit any domain origin.
                </span>
              </div>

              {createError && (
                <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>{createError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-3.5 py-1.5 bg-muted hover:bg-accent rounded-xl text-xs font-bold text-foreground transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newProjectName.trim()}
                  className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUICK TRANSFER MODAL ── */}
      {transferProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setTransferProject(null)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Crown size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Transfer Ownership</h3>
                  <p className="text-xs text-muted-foreground font-mono">{transferProject.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTransferProject(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">New Owner Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="recipient@company.io"
                  value={transferTargetEmail}
                  onChange={(e) => setTransferTargetEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-foreground block">
                  To confirm transfer, please type{" "}
                  <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold select-all">
                    {transferProject.name}
                  </strong>{" "}
                  below:
                </label>
                <input
                  type="text"
                  placeholder={transferProject.name}
                  value={transferConfirmName}
                  onChange={(e) => setTransferConfirmName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="p-3 bg-muted/30 border border-border rounded-xl text-[11px] text-muted-foreground space-y-1">
                <div className="font-bold text-foreground">Important:</div>
                <p>Transferring ownership will grant full governance to the recipient user. You will remain an Admin on this project.</p>
              </div>

              {transferError && (
                <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>{transferError}</span>
                </div>
              )}

              {transferSuccess && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
                  <Check size={14} />
                  <span>{transferSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setTransferProject(null);
                    setTransferConfirmName("");
                  }}
                  className="px-3.5 py-1.5 bg-muted hover:bg-accent rounded-xl text-xs font-bold text-foreground transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    transferring ||
                    !transferTargetEmail.trim() ||
                    transferConfirmName !== transferProject.name
                  }
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {transferring ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

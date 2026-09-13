"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Key,
  Globe,
  Save,
  Check,
  Copy,
  AlertCircle,
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  Lock,
  Crown,
  Sparkles,
  ArrowRightLeft,
  AlertTriangle,
  X,
  UserCheck,
} from "lucide-react";

interface MemberItem {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "member";
  avatar?: string;
}

interface OwnerItem {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.projectId as string) || "";
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedProjectId, setCopiedProjectId] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [domainsInput, setDomainsInput] = useState("*");

  // Team & Permission state
  const [owner, setOwner] = useState<OwnerItem | null>(null);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "member">("member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Ownership Transfer State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTargetUserId, setTransferTargetUserId] = useState("");
  const [transferTargetEmail, setTransferTargetEmail] = useState("");
  const [transferConfirmName, setTransferConfirmName] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Delete Project State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load project details
  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return null;
        }
        if (res.status === 403 || res.status === 404) {
          setAccessDenied(true);
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d?.project) {
          setProject(d.project);
          if (Array.isArray(d.project.allowedDomains) && d.project.allowedDomains.length > 0) {
            setDomainsInput(d.project.allowedDomains.join(", "));
          } else {
            setDomainsInput("*");
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setAccessDenied(true);
      })
      .finally(() => setLoading(false));

    // Load team members
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/members`);
      if (res.ok) {
        const d = await res.json();
        setOwner(d.owner || null);
        setMembers(d.members || []);
        setIsCurrentUserOwner(Boolean(d.isCurrentUserOwner));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);
    setInviteSuccess(false);

    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim(),
          role: inviteRole,
        }),
      });

      const d = await res.json();
      if (!res.ok) {
        setInviteError(d.error || "Failed to add member");
      } else {
        setInviteSuccess(true);
        setInviteEmail("");
        setInviteName("");
        fetchMembers();
        setTimeout(() => setInviteSuccess(false), 3000);
      }
    } catch (err: any) {
      setInviteError(err.message || "Network error");
    } finally {
      setInviting(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: "admin" | "editor" | "member") => {
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.userId === userId ? { ...m, role: newRole } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke this user's workspace access?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/members?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetUserId && !transferTargetEmail.trim()) {
      setTransferError("Please select an existing member or enter a valid user email.");
      return;
    }

    if (transferConfirmName !== project.name) {
      setTransferError(`Please type "${project.name}" exactly to confirm ownership transfer.`);
      return;
    }

    setTransferring(true);
    setTransferError(null);
    setTransferSuccess(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/transfer-ownership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: transferTargetUserId || undefined,
          targetEmail: transferTargetEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTransferError(data.error || "Failed to transfer project ownership");
      } else {
        setTransferSuccess(data.message || "Ownership transferred successfully!");
        fetchMembers();
        setTimeout(() => {
          setShowTransferModal(false);
          setTransferSuccess(null);
          setTransferTargetUserId("");
          setTransferTargetEmail("");
          setTransferConfirmName("");
        }, 2000);
      }
    } catch (err: any) {
      setTransferError(err.message || "Network error");
    } finally {
      setTransferring(false);
    }
  };

  const handleDeleteProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmName !== project.name) {
      setDeleteError(`Please type "${project.name}" exactly to confirm deletion.`);
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete project");
        setDeleting(false);
      } else {
        window.location.href = "/projects";
      }
    } catch (err: any) {
      setDeleteError(err.message || "Network error");
      setDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const parsedDomains = domainsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const finalDomains = parsedDomains.length > 0 ? parsedDomains : ["*"];

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          allowedDomains: finalDomains,
          settings: project.settings,
        }),
      });
      if (res.ok) {
        setProject((prev: any) => ({ ...prev, allowedDomains: finalDomains }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-muted-foreground">Loading workspace settings...</div>
      </div>
    );
  }

  if (accessDenied || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-rose-500/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            You do not have administrative permission to modify settings for workspace <span className="font-mono text-foreground font-bold">{projectId}</span>. Only owners and admins can configure permissions.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Overview</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="p-2.5 rounded-xl bg-background hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition shadow-2xs"
            title="Return to Projects Directory"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <Shield size={22} className="text-primary" />
              <span>Workspace Settings &amp; Access Control</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage project governance, team access, API credentials, and origins for{" "}
              <span className="font-mono text-primary font-bold">{project.name}</span>
            </p>
          </div>
        </div>

        {isCurrentUserOwner && (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono inline-flex items-center gap-1.5 shadow-2xs">
            <Crown size={13} />
            <span>Workspace Owner</span>
          </span>
        )}
      </div>

      {/* ============================================================ */}
      {/* 1. TEAM MEMBERS & ACCESS CONTROL (RBAC)                      */}
      {/* ============================================================ */}
      <div id="team" className="bg-card rounded-3xl p-6 sm:p-7 space-y-6 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span>Team Members &amp; Permission Control</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Grant team members Admin or Member access to this project
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold w-fit">
            {members.length + (owner ? 1 : 0)} Workspace Users
          </span>
        </div>

        {/* Invite New User Form */}
        <form onSubmit={handleInviteMember} className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <UserPlus size={14} className="text-primary" />
            <span>Add or Invite New User</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-5">
              <input
                type="email"
                required
                placeholder="User email address (e.g. alex@company.io)"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs"
              />
            </div>
            <div className="sm:col-span-3 flex items-center gap-2">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                aria-label="Assign member role"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-2xs [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
              >
                <option value="member">Member (Read-Only)</option>
                <option value="editor">Editor (Edit & Triage)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted-foreground">
              New users receive login credentials to access this workspace immediately.
            </span>
            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
            >
              {inviting ? "Adding..." : "+ Add Member"}
            </button>
          </div>

          {inviteError && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
              <AlertCircle size={14} />
              <span>{inviteError}</span>
            </div>
          )}

          {inviteSuccess && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
              <Check size={14} />
              <span>Member added successfully!</span>
            </div>
          )}
        </form>

        {/* Members List Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-foreground">Authorized Workspace Members</div>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-background">
            {/* Owner Row */}
            {owner && (
              <div className="p-3.5 flex items-center justify-between gap-3 bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black shrink-0">
                    <Crown size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                      <span>{owner.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold uppercase">
                        Owner
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">{owner.email}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-muted-foreground font-bold">
                    Primary Owner
                  </span>
                </div>
              </div>
            )}

            {/* Other Members */}
            {members.length === 0 && !owner ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No team members added to this workspace yet.
              </div>
            ) : (
              members.map((m) => (
                <div key={m.userId} className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/20 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                      {m.name ? m.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono truncate">{m.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Role selector dropdown */}
                    <select
                      value={m.role}
                      onChange={(e) => handleChangeRole(m.userId, e.target.value as any)}
                      aria-label="Member role"
                      className="px-2.5 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                    >
                      <option value="member">Member</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>

                    {/* Quick Transfer Button (for Owner) */}
                    {isCurrentUserOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          setTransferTargetUserId(m.userId);
                          setTransferTargetEmail(m.email);
                          setShowTransferModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition cursor-pointer inline-flex items-center gap-1"
                        title="Transfer Ownership to this user"
                      >
                        <Crown size={11} />
                        <span className="hidden sm:inline">Make Owner</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveMember(m.userId)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Role Matrix Helper */}
        <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary" />
            <span>Role Permissions Reference:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-card border border-border space-y-1">
              <strong className="text-amber-600 dark:text-amber-400 block font-bold">Owner</strong>
              <span className="text-muted-foreground block">Full workspace governance, delete project, transfer ownership.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border space-y-1">
              <strong className="text-primary block font-bold">Admin</strong>
              <span className="text-muted-foreground block">Manage team, rotate keys, configure domains &amp; project settings.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border space-y-1">
              <strong className="text-blue-600 dark:text-blue-400 block font-bold">Editor</strong>
              <span className="text-muted-foreground block">Triage &amp; resolve errors, configure suppression rules, edit operational data.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border space-y-1">
              <strong className="text-foreground block font-bold">Member</strong>
              <span className="text-muted-foreground block">View-only access to dashboards, live telemetry, and analytics reports.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. API KEYS & IDENTITY                                       */}
      {/* ============================================================ */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card rounded-3xl p-6 sm:p-7 space-y-4 border border-border shadow-xs">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <Key size={18} className="text-primary" />
              <span>API Credentials &amp; Project ID</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client keys used by the tracking script and server ingestion endpoints
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Unique Project ID (Used in Tracker Script)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={project.projectId}
                  className="flex-1 bg-background border border-primary/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-primary font-bold select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(project.projectId);
                    setCopiedProjectId(true);
                    setTimeout(() => setCopiedProjectId(false), 2000);
                  }}
                  className="p-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-primary transition cursor-pointer"
                  title="Copy Unique Project ID"
                >
                  {copiedProjectId ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Publishable Client Key (Public)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={project.publishableKey}
                  className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-foreground select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(project.publishableKey);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="p-2.5 bg-muted hover:bg-accent border border-border rounded-xl text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  {copiedKey ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security: Allowed Domains */}
        <div className="bg-card rounded-3xl p-6 sm:p-7 space-y-4 border border-border shadow-xs">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <Globe size={18} className="text-blue-500" />
              <span>Allowed Origins &amp; CORS Domains</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Restrict telemetry collection to authorized domains. Use <code className="font-mono text-primary">*</code> to allow any origin.
            </p>
          </div>

          <input
            type="text"
            value={domainsInput}
            onChange={(e) => setDomainsInput(e.target.value)}
            placeholder="e.g. myapp.com, staging.myapp.com, *"
            className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary shadow-2xs"
          />
        </div>

        {/* Privacy & Compliance */}
        <div className="bg-card rounded-3xl p-6 sm:p-7 space-y-4 border border-border shadow-xs">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              <span>Privacy &amp; Compliance Configuration</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated cookieless anonymization and telemetry payload sanitization
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border cursor-pointer hover:bg-muted/40 transition">
              <input
                type="checkbox"
                checked={project.settings?.ipAnonymization ?? true}
                onChange={(e) => setProject({ ...project, settings: { ...project.settings, ipAnonymization: e.target.checked } })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-foreground block">IP Address Anonymization (GDPR &amp; CCPA compliant)</span>
                <span className="text-[11px] text-muted-foreground">Masks the last octet of IPv4 and zeroes IPv6 addresses before persistence.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border cursor-pointer hover:bg-muted/40 transition">
              <input
                type="checkbox"
                checked={project.settings?.piiRedaction ?? true}
                onChange={(e) => setProject({ ...project, settings: { ...project.settings, piiRedaction: e.target.checked } })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-foreground block">Automatic PII Redaction Engine</span>
                <span className="text-[11px] text-muted-foreground">Automatically scrubs email addresses, passwords, auth tokens, and card numbers from error stack traces.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Check size={14} /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            {saving ? "Saving Changes..." : "Save Project Settings"}
          </button>
        </div>
      </form>

      {/* ============================================================ */}
      {/* 3. DANGER ZONE (OWNERSHIP TRANSFER & DELETE PROJECT)         */}
      {/* ============================================================ */}
      {isCurrentUserOwner && (
        <div className="bg-card rounded-3xl p-6 sm:p-7 space-y-5 border border-rose-500/30 shadow-xs">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>Danger Zone</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              High-impact governance actions: transfer primary ownership or permanently destroy this project
            </p>
          </div>

          <div className="divide-y divide-border/60">
            {/* Action 1: Transfer Ownership */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-500" />
                  <span>Transfer Project Ownership</span>
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Transfer primary ownership and governance of this workspace to another team member or registered user.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTransferTargetUserId("");
                  setTransferTargetEmail("");
                  setShowTransferModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <ArrowRightLeft size={13} />
                <span>Transfer Ownership</span>
              </button>
            </div>

            {/* Action 2: Delete Project */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block flex items-center gap-1.5">
                  <Trash2 size={14} />
                  <span>Permanently Delete Project</span>
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Permanently delete this project, API keys, and all recorded analytics data. This action is irreversible.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmName("");
                  setShowDeleteModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <Trash2 size={13} />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TRANSFER OWNERSHIP MODAL                                     */}
      {/* ============================================================ */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowTransferModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Crown size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Transfer Project Ownership</h3>
                  <p className="text-xs text-muted-foreground">Assign a new primary owner for this project</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTransferOwnership} className="space-y-4">
              {/* Select Existing Member */}
              {members.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block">Select Existing Team Member:</label>
                  <select
                    value={transferTargetUserId}
                    onChange={(e) => {
                      setTransferTargetUserId(e.target.value);
                      if (e.target.value) setTransferTargetEmail("");
                    }}
                    aria-label="Select target member for ownership transfer"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                  >
                    <option value="">-- Choose Member --</option>
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.name} ({m.email}) - {m.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Or Enter Registered Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Or Enter User Email Address:</label>
                <input
                  type="email"
                  placeholder="recipient@company.io"
                  value={transferTargetEmail}
                  onChange={(e) => {
                    setTransferTargetEmail(e.target.value);
                    if (e.target.value) setTransferTargetUserId("");
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-foreground block">
                  To confirm transfer, please type{" "}
                  <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold select-all">
                    {project.name}
                  </strong>{" "}
                  below:
                </label>
                <input
                  type="text"
                  placeholder={project.name}
                  value={transferConfirmName}
                  onChange={(e) => setTransferConfirmName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="p-3 bg-muted/30 border border-border rounded-xl text-[11px] text-muted-foreground space-y-1">
                <div className="font-bold text-foreground">What happens next:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>The selected user becomes the primary Workspace Owner.</li>
                  <li>Your role will be preserved as Project Admin.</li>
                  <li>Only the new owner will be able to delete or transfer this project in the future.</li>
                </ul>
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
                    setShowTransferModal(false);
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
                    (!transferTargetUserId && !transferTargetEmail.trim()) ||
                    transferConfirmName !== project.name
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

      {/* ============================================================ */}
      {/* DELETE PROJECT MODAL                                         */}
      {/* ============================================================ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-rose-500/30 rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-600 dark:text-rose-400">Delete Workspace Project</h3>
                  <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDeleteProject} className="space-y-4">
              <p className="text-xs text-muted-foreground">
                To confirm deletion of this workspace and all associated analytics data, please type{" "}
                <strong className="text-foreground font-mono font-bold select-all">{project.name}</strong> below:
              </p>

              <input
                type="text"
                placeholder={project.name}
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-500 shadow-2xs"
              />

              {deleteError && (
                <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3.5 py-1.5 bg-muted hover:bg-accent rounded-xl text-xs font-bold text-foreground transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || deleteConfirmName !== project.name}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

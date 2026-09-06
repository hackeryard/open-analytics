"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";

interface MemberItem {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "member";
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
  const projectId = (params?.projectId as string) || "prj_demo";
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Team & Permission state
  const [owner, setOwner] = useState<OwnerItem | null>(null);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

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
        if (d?.project) setProject(d.project);
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

  const handleChangeRole = async (userId: string, newRole: "admin" | "member") => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          allowedDomains: project.allowedDomains,
          settings: project.settings,
        }),
      });
      if (res.ok) {
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
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-muted-foreground">Loading workspace settings...</div>
      </div>
    );
  }

  if (accessDenied || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full glass-card border border-rose-500/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            You do not have administrative permission to modify settings for workspace <span className="font-mono text-white">{projectId}</span>. Only owners and admins can configure permissions.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:from-cyan-400 hover:to-blue-500 transition"
            >
              <ArrowLeft size={14} />
              Return to Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition"
            title="Return to Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Shield size={22} className="text-cyan-400" />
              <span>Workspace Settings &amp; Access Control</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage team members, roles, permissions, API credentials, and origins for <span className="font-mono text-cyan-400 font-bold">{project.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. TEAM MEMBERS & ACCESS CONTROL (RBAC)                      */}
      {/* ============================================================ */}
      <div id="team" className="glass-card rounded-3xl p-6 sm:p-7 space-y-6 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.07] pb-4">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Users size={18} className="text-cyan-400" />
              <span>Team Members &amp; Permission Control</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Grant team members Admin or Member access to this project
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold w-fit">
            {members.length + (owner ? 1 : 0)} Workspace Users
          </span>
        </div>

        {/* Invite New User Form */}
        <form onSubmit={handleInviteMember} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <UserPlus size={14} className="text-cyan-400" />
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
                className="w-full px-3 py-2 rounded-xl bg-[#080d19] border border-white/[0.1] text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d19] border border-white/[0.1] text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="sm:col-span-3 flex items-center gap-2">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d19] border border-white/[0.1] text-xs font-bold text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer [&>option]:bg-slate-900"
              >
                <option value="member">Member (Read-Only)</option>
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
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
            >
              {inviting ? "Adding..." : "+ Add Member"}
            </button>
          </div>

          {inviteError && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
              <AlertCircle size={14} />
              <span>{inviteError}</span>
            </div>
          )}

          {inviteSuccess && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
              <Check size={14} />
              <span>Member added successfully!</span>
            </div>
          )}
        </form>

        {/* Members List Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">Authorized Workspace Members</div>

          <div className="divide-y divide-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.01]">
            {/* Owner Row */}
            {owner && (
              <div className="p-3.5 flex items-center justify-between gap-3 bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                    <Crown size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <span>{owner.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                        Owner
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">{owner.email}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 font-bold">Workspace Creator</span>
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
                <div key={m.userId} className="p-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {m.name ? m.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono truncate">{m.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Role selector dropdown */}
                    <select
                      value={m.role}
                      onChange={(e) => handleChangeRole(m.userId, e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#080d19] border border-white/[0.1] text-xs font-bold text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer [&>option]:bg-slate-900"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleRemoveMember(m.userId)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
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
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Role Permissions Reference:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <strong className="text-amber-400 block font-bold">Owner</strong>
              <span className="text-muted-foreground block">Full workspace control, delete project, transfer ownership.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <strong className="text-cyan-400 block font-bold">Admin</strong>
              <span className="text-muted-foreground block">Manage settings, invite members, rotate keys, resolve errors.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <strong className="text-slate-300 block font-bold">Member</strong>
              <span className="text-muted-foreground block">View live telemetry, dashboards, RUM diagnostics, and reports.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. API KEYS & IDENTITY                                       */}
      {/* ============================================================ */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="border-b border-white/[0.07] pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Key size={18} className="text-cyan-400" />
              <span>API Credentials &amp; Project ID</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client keys used by the tracking script and server ingestion endpoints
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Project ID</label>
              <input
                type="text"
                readOnly
                value={project.projectId}
                className="w-full bg-[#080d19] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 select-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Publishable Client Key (Public)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={project.publishableKey}
                  className="flex-1 bg-[#080d19] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(project.publishableKey);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="p-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
                >
                  {copiedKey ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security: Allowed Domains */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="border-b border-white/[0.07] pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <span>Allowed Origins &amp; CORS Domains</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Restrict telemetry collection to authorized domains. Use <code className="font-mono text-cyan-400">*</code> to allow any origin.
            </p>
          </div>

          <input
            type="text"
            value={Array.isArray(project.allowedDomains) ? project.allowedDomains.join(", ") : "*"}
            onChange={(e) => setProject({ ...project, allowedDomains: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            placeholder="e.g. openlabs.org.in, localhost:3000, *"
            className="w-full bg-[#080d19] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Privacy & Compliance */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="border-b border-white/[0.07] pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              <span>Privacy &amp; Compliance Configuration</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated cookieless anonymization and telemetry payload sanitization
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
              <input
                type="checkbox"
                checked={project.settings?.ipAnonymization ?? true}
                onChange={(e) => setProject({ ...project, settings: { ...project.settings, ipAnonymization: e.target.checked } })}
                className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-white block">IP Address Anonymization (GDPR &amp; CCPA compliant)</span>
                <span className="text-[11px] text-muted-foreground">Masks the last octet of IPv4 and zeroes IPv6 addresses before persistence.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
              <input
                type="checkbox"
                checked={project.settings?.piiRedaction ?? true}
                onChange={(e) => setProject({ ...project, settings: { ...project.settings, piiRedaction: e.target.checked } })}
                className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-white block">Automatic PII Redaction Engine</span>
                <span className="text-[11px] text-muted-foreground">Automatically scrubs email addresses, passwords, auth tokens, and card numbers from error stack traces.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Check size={14} /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            {saving ? "Saving Changes..." : "Save Project Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

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
  Activity,
  Code2,
  Radio,
  Sliders,
  Zap,
  CheckCircle2,
  ExternalLink,
  Plus,
  Smartphone,
  Eye,
  Layers,
  Bug,
  Database,
  Terminal,
  Bot,
  Flame,
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

const TIMEZONES = [
  { value: "UTC", label: "(GMT+00:00) Universal Coordinated Time (UTC)" },
  { value: "Asia/Kolkata", label: "(GMT+05:30) India Standard Time (IST)" },
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "(GMT-06:00) Central Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "(GMT+00:00) London, Dublin, Edinburgh" },
  { value: "Europe/Paris", label: "(GMT+01:00) Paris, Berlin, Rome, Madrid" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo, Osaka, Sapporo" },
  { value: "Asia/Singapore", label: "(GMT+08:00) Singapore, Hong Kong, Beijing" },
  { value: "Australia/Sydney", label: "(GMT+10:00) Sydney, Melbourne, Brisbane" },
  { value: "America/Sao_Paulo", label: "(GMT-03:00) Brasilia, Sao Paulo" },
  { value: "Asia/Dubai", label: "(GMT+04:00) Dubai, Abu Dhabi, Muscat" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "GBP", symbol: "£", label: "British Pound (£)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
  { code: "CAD", symbol: "$", label: "Canadian Dollar ($)" },
  { code: "AUD", symbol: "$", label: "Australian Dollar ($)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (¥)" },
  { code: "SGD", symbol: "$", label: "Singapore Dollar ($)" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real (R$)" },
];

const INDUSTRIES = [
  "Technology & Software",
  "E-Commerce & Retail",
  "Financial Services & Fintech",
  "Healthcare & Life Sciences",
  "Media, News & Publishing",
  "Education & EdTech",
  "Gaming & Entertainment",
  "Travel & Hospitality",
  "Real Estate",
  "Automotive",
  "Other",
];

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.projectId as string) || "";
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedMeasurementId, setCopiedMeasurementId] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<"property" | "plan" | "streams" | "privacy" | "tag" | "team" | "events" | "danger">("property");
  const [switchingPlan, setSwitchingPlan] = useState(false);
  const [planMessage, setPlanMessage] = useState<string | null>(null);

  // Editable Property fields
  const [propertyName, setPropertyName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");
  const [industry, setIndustry] = useState("Technology & Software");
  const [businessSize, setBusinessSize] = useState("Medium (11-100)");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [domainsInput, setDomainsInput] = useState("*");

  // Add Stream Modal State
  const [showAddStreamModal, setShowAddStreamModal] = useState(false);
  const [newStreamType, setNewStreamType] = useState<"web" | "ios" | "android">("web");
  const [newStreamName, setNewStreamName] = useState("");
  const [newStreamUrl, setNewStreamUrl] = useState("");
  const [addingStream, setAddingStream] = useState(false);

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

  // Live Ping Test State
  const [testingPing, setTestingPing] = useState(false);
  const [pingVerified, setPingVerified] = useState(false);

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
          const p = d.project;
          setProject(p);
          setPropertyName(p.name || "");
          setTimezone(p.timezone || "UTC");
          setCurrency(p.currency || "USD");
          setIndustry(p.industryCategory || "Technology & Software");
          setBusinessSize(p.businessSize || "Medium (11-100)");
          setWebsiteUrl(p.websiteUrl || "");
          if (Array.isArray(p.allowedDomains) && p.allowedDomains.length > 0) {
            setDomainsInput(p.allowedDomains.join(", "));
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

    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["property", "plan", "streams", "privacy", "tag", "team", "events", "danger"].includes(hash)) {
        setActiveTab(hash as any);
      }
    }

    fetchMembers();
  }, [projectId]);

  const handleSwitchPlan = async (targetPlan: "free" | "pro") => {
    setSwitchingPlan(true);
    setPlanMessage(null);
    try {
      const res = await fetch("/api/user/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan, billingCycle: "monthly" }),
      });
      if (res.ok) {
        const d = await res.json();
        setProject((prev: any) => prev ? { ...prev, plan: targetPlan, effectivePlan: targetPlan } : prev);
        setPlanMessage(`Successfully updated your subscription to ${targetPlan.toUpperCase()}!`);
        setTimeout(() => setPlanMessage(null), 3500);
      } else {
        const errData = await res.json();
        setPlanMessage(`Failed to update plan: ${errData.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setPlanMessage(`Failed to update plan: ${err.message}`);
    } finally {
      setSwitchingPlan(false);
    }
  };

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

  const handleAddStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreamName.trim() || !newStreamUrl.trim()) return;
    setAddingStream(true);

    const newStream = {
      streamId: `strm_${Date.now()}`,
      streamType: newStreamType,
      streamName: newStreamName.trim(),
      streamUrl: newStreamUrl.trim(),
      appId: newStreamType !== "web" ? newStreamUrl.trim() : "",
      measurementId: project?.measurementId || `OA-${projectId.replace("open_prj_", "").toUpperCase()}`,
      active: true,
      createdAt: new Date(),
    };

    const currentStreams = project?.dataStreams || [];
    const updatedStreams = [...currentStreams, newStream];

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataStreams: updatedStreams }),
      });

      if (res.ok) {
        setProject((prev: any) => ({ ...prev, dataStreams: updatedStreams }));
        setShowAddStreamModal(false);
        setNewStreamName("");
        setNewStreamUrl("");
      }
    } catch (err) {
      console.error("Add stream error:", err);
    } finally {
      setAddingStream(false);
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
          name: propertyName,
          timezone,
          currency,
          industryCategory: industry,
          businessSize,
          websiteUrl,
          allowedDomains: finalDomains,
          settings: project.settings,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setProject(d.project);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
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

  const sendTestPing = async () => {
    if (!project) return;
    setTestingPing(true);
    try {
      const res = await fetch("/api/v1/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pageview",
          projectId: project.projectId,
          pathname: "/admin-stream-verification",
          title: "Admin Test Ping",
          visitorId: "v_admin_test_" + Date.now(),
          sessionId: "s_admin_test_" + Date.now(),
          device: "desktop",
          browser: "Admin Inspector",
          os: "Windows",
          country: "US",
        }),
      });

      if (res.ok) {
        setPingVerified(true);
        setProject((prev: any) => ({ ...prev, monitoringStatus: "active" }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestingPing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-xs text-slate-400">
        <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-2" />
        <span>Loading Property Administration Settings...</span>
      </div>
    );
  }

  if (accessDenied || !project) {
    return (
      <div className="p-8 rounded-3xl bg-[#0b1020] border border-rose-500/20 max-w-lg mx-auto text-center space-y-4 my-12">
        <AlertTriangle size={36} className="text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You do not have administrative permissions to view or edit property settings for this workspace.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft size={14} />
          <span>Return to Properties Hub</span>
        </Link>
      </div>
    );
  }

  const measurementId = project.measurementId || `OA-${project.projectId.replace("open_prj_", "").replace("prj_", "").toUpperCase()}`;
  const hostUrl = typeof window !== "undefined" && !window.location.host.includes("localhost") && !window.location.host.includes("127.0.0.1")
    ? `https://api.${window.location.host.replace(/^(dashboard\.|api\.|www\.)/i, "")}`
    : "https://api.openanalytics.org.in";

  const navTabs = [
    { id: "property", label: "Property Details", icon: Sliders },
    { id: "plan", label: "Plan & Add-on Features", icon: Crown, badge: project?.plan === "pro" ? "PRO" : "FREE" },
    { id: "streams", label: "Data Streams", icon: Radio, count: (project.dataStreams?.length || 1) },
    { id: "privacy", label: "Data Collection & Privacy", icon: ShieldCheck },
    { id: "tag", label: "Tag & API Setup", icon: Code2 },
    { id: "team", label: "Property Access (Team)", icon: Users, count: members.length + 1 },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition"
            title="Back to Properties"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                {measurementId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Property Administration Center • {project.industryCategory || "Technology & Software"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              navigator.clipboard.writeText(measurementId);
              setCopiedMeasurementId(true);
              setTimeout(() => setCopiedMeasurementId(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 font-bold transition cursor-pointer"
          >
            <span>{measurementId}</span>
            {copiedMeasurementId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>

          <Link
            href={`/`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <span>Analytics Dashboard</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Main Layout with Left Tab Sidebar & Right Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 p-2 rounded-2xl bg-[#0b1020]/90 border border-white/[0.08]">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Property Admin Settings
          </div>
          {navTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                  active
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : t.id === "danger"
                    ? "text-rose-400 hover:bg-rose-500/10 border border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{t.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(t as any).badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        (t as any).badge === "PRO"
                          ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black shadow-xs"
                          : "bg-white/[0.08] text-slate-400 font-mono"
                      }`}
                    >
                      {(t as any).badge}
                    </span>
                  )}
                  {t.count !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/[0.06] text-slate-300">
                      {t.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Content Pane */}
        <div className="lg:col-span-9 space-y-6">

          {/* ============================================================ */}
          {/* TAB 1: PROPERTY DETAILS                                      */}
          {/* ============================================================ */}
          {activeTab === "property" && (
            <form onSubmit={handleSave} className="p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 animate-fadeIn">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-base font-bold text-white">Property Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  General identification, reporting timezone, and currency for this measurement property.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Property Name</label>
                  <input
                    type="text"
                    required
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Industry Category</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#0b1020] text-white">
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Reporting Time Zone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value} className="bg-[#0b1020] text-white">
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0b1020] text-white">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Website URL</label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Allowed Domains (CORS)</label>
                  <input
                    type="text"
                    value={domainsInput}
                    onChange={(e) => setDomainsInput(e.target.value)}
                    placeholder="e.g. acme.com, staging.acme.com or *"
                    className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500">Comma-separated domain list, or &ldquo;*&rdquo; to accept telemetry from any origin.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                {saved && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Saved Successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{saving ? "Saving..." : "Save Property Changes"}</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* TAB: PLAN & ADD-ON FEATURES                                  */}
          {/* ============================================================ */}
          {activeTab === "plan" && (
            <div className="p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Subscription & Add-on Feature Modules
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage tier allocation and unlock advanced AI radar, Core Web Vitals, and behavioral diagnostics for this project.
                  </p>
                </div>

                {planMessage && (
                  <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold animate-fadeIn">
                    {planMessage}
                  </div>
                )}
              </div>

              {/* Current Plan Status Box */}
              <div
                className={`p-5 rounded-2xl border ${
                  project?.plan === "pro" || project?.effectivePlan === "pro"
                    ? "bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-transparent border-amber-400/40 shadow-lg shadow-amber-500/5"
                    : "bg-white/[0.02] border-white/[0.08]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Current Property Plan:
                      </span>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          project?.plan === "pro" || project?.effectivePlan === "pro"
                            ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow-sm"
                            : "bg-white/[0.08] text-slate-300"
                        }`}
                      >
                        {project?.plan === "pro" || project?.effectivePlan === "pro" ? "Cloud Pro Plan" : "Free Starter Plan"}
                      </span>
                      {!isCurrentUserOwner && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                          Inherited from Owner {owner?.email ? `(${owner.email})` : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      {project?.plan === "pro" || project?.effectivePlan === "pro"
                        ? "All 5 Extra Power Modules (AI Search Radar, Core Web Vitals RUM, Behavioral UX, Crash Triage, and Custom Events) are fully active."
                        : "Standard cookieless web telemetry is active. Advanced AI radar, RUM vitals, rage clicks, and custom events stream are gated."}
                    </p>
                  </div>

                  {isCurrentUserOwner && (
                    <div>
                      {project?.plan === "pro" || project?.effectivePlan === "pro" ? (
                        <button
                          onClick={() => handleSwitchPlan("free")}
                          disabled={switchingPlan}
                          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/[0.1] text-xs font-semibold transition cursor-pointer"
                        >
                          {switchingPlan ? "Updating..." : "Downgrade to Free"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSwitchPlan("pro")}
                          disabled={switchingPlan}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 hover:from-amber-300 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{switchingPlan ? "Activating..." : "Upgrade to Pro ($19/mo)"}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Feature Modules Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Feature Matrix & Module Entitlements
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Module 1 */}
                  <div className="p-4 rounded-2xl bg-[#060a14] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Core Web Vitals (RUM)</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        PRO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Capture real user field experience metrics (LCP, INP, CLS, TTFB) across all visitor devices without synthetic noise.
                    </p>
                  </div>

                  {/* Module 2 */}
                  <div className="p-4 rounded-2xl bg-[#060a14] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">GEO & AI Search Radar</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        PRO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Autonomous classification of referral clicks and scraper traffic from OpenAI SearchGPT, Perplexity AI, ClaudeBot, and Gemini.
                    </p>
                  </div>

                  {/* Module 3 */}
                  <div className="p-4 rounded-2xl bg-[#060a14] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-white">Behavioral UX & Rage Clicks</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        PRO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Detect user frustration friction in real time. Identify rage clicks (3+ rapid taps) and dead clicks on broken buttons.
                    </p>
                  </div>

                  {/* Module 4 */}
                  <div className="p-4 rounded-2xl bg-[#060a14] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bug className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Crash & Error Diagnostics</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        PRO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Automated runtime error capture, stack trace grouping, affected URLs, and one-click AI prompt generation to debug bugs.
                    </p>
                  </div>

                  {/* Module 5 */}
                  <div className="p-4 rounded-2xl bg-[#060a14] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">Custom Events & Conversion Rules</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        PRO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Custom business event telemetry, revenue value attribution, payload inspection, and no-code CSS selector autotrack rules.
                    </p>
                  </div>
                </div>
              </div>

              {/* Free Core Inclusions */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400 space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Free Core Inclusions:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Unlimited standard pageviews, unique visitors, sessions, referrers, UTM campaigns, geographic locations (countries & cities), device breakdowns, real-time live feed, and 100% cookieless GDPR/PECR compliance remain permanently free.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: DATA STREAMS                                          */}
          {/* ============================================================ */}
          {activeTab === "streams" && (
            <div className="p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Data Streams</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Data streams represent customer touchpoints (Web, iOS, Android) flowing into this property.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddStreamModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Stream</span>
                </button>
              </div>

              <div className="space-y-3">
                {(project.dataStreams || [
                  {
                    streamId: "strm_default",
                    streamType: "web",
                    streamName: `${project.name} Web Stream`,
                    streamUrl: project.websiteUrl || "https://example.com",
                    measurementId,
                    active: true,
                  },
                ]).map((stream: any, idx: number) => (
                  <div
                    key={stream.streamId || idx}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        {stream.streamType === "web" ? <Globe size={18} /> : <Smartphone size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{stream.streamName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
                            Active Stream
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                          {stream.streamUrl || stream.appId || "https://example.com"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Measurement ID</span>
                        <span className="text-xs font-mono font-bold text-cyan-300">{stream.measurementId || measurementId}</span>
                      </div>

                      <Link
                        href={`/projects/${projectId}/install`}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-cyan-300 transition"
                        title="View Web Tag"
                      >
                        <Code2 size={15} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Measurement Global Toggle Box */}
              <div className="p-4 rounded-2xl bg-[#080d19] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white">Enhanced Measurement Engine</span>
                      <span className="text-[10px] text-slate-400 block">Automatic event ingestion without code modification</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    Enabled
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 pt-2 border-t border-white/[0.06]">
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-400" />
                    <span>Scroll Depth (90%)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-400" />
                    <span>Outbound Links</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-400" />
                    <span>Site Search Queries</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-400" />
                    <span>AI Bot Crawlers</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: DATA COLLECTION & PRIVACY                             */}
          {/* ============================================================ */}
          {activeTab === "privacy" && (
            <form onSubmit={handleSave} className="p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 animate-fadeIn">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-base font-bold text-white">Data Retention &amp; Privacy Controls</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure retention policies, IP anonymization, and GDPR/CCPA cookie-less tracking.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Event Data Retention Period
                  </label>
                  <select
                    value={project.settings?.dataRetentionDays || 365}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        settings: {
                          ...project.settings,
                          dataRetentionDays: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value={30} className="bg-[#0b1020] text-white">1 Month (30 Days)</option>
                    <option value={90} className="bg-[#0b1020] text-white">3 Months (90 Days)</option>
                    <option value={180} className="bg-[#0b1020] text-white">6 Months (180 Days)</option>
                    <option value={365} className="bg-[#0b1020] text-white">14 Months (365 Days) — Standard</option>
                    <option value={730} className="bg-[#0b1020] text-white">24 Months (730 Days)</option>
                    <option value={0} className="bg-[#0b1020] text-white">Indefinite (Unlimited Retention)</option>
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.settings?.ipAnonymization ?? true}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          settings: {
                            ...project.settings,
                            ipAnonymization: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">IP Anonymization (Zero Raw IP Storage)</span>
                      <span className="text-[11px] text-slate-400 leading-relaxed">
                        Client IP addresses are cryptographically hashed and discarded immediately after country resolution.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.settings?.piiRedaction ?? true}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          settings: {
                            ...project.settings,
                            piiRedaction: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Automated PII Redaction in Query Strings</span>
                      <span className="text-[11px] text-slate-400 leading-relaxed">
                        Strips query parameters containing emails, tokens, SSNs, and passwords before database write.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.settings?.aiTracking ?? true}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          settings: {
                            ...project.settings,
                            aiTracking: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">AI &amp; LLM Bot Radar (ChatGPT / Perplexity)</span>
                      <span className="text-[11px] text-slate-400 leading-relaxed">
                        Classify search engine indexation by OpenAI GPTBot, Anthropic ClaudeBot, and PerplexityCrawler.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                {saved && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Privacy Policy Updated!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{saving ? "Saving..." : "Save Privacy Settings"}</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* TAB 4: TAG & API SETUP                                       */}
          {/* ============================================================ */}
          {activeTab === "tag" && (
            <div className="p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 animate-fadeIn">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-base font-bold text-white">Measurement Tag &amp; API Ingestion</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client publishable keys, measurement IDs, and SDK snippets for your web properties.
                </p>
              </div>

              {/* Keys Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Measurement ID</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-cyan-300">{measurementId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(measurementId);
                        setCopiedMeasurementId(true);
                        setTimeout(() => setCopiedMeasurementId(false), 2000);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-white"
                    >
                      {copiedMeasurementId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Client Publishable Key</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white truncate max-w-[200px]">
                      {project.publishableKey || "pk_live_..."}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(project.publishableKey || "");
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-white"
                    >
                      {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tag Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Website Installation Tag (HTML / CDN)</span>
                  <Link
                    href={`/projects/${projectId}/install`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>View all frameworks (Next.js, React, cURL)</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>

                <div className="relative rounded-2xl bg-[#040711] border border-white/[0.12] p-4 font-mono text-xs text-cyan-300/90 leading-relaxed overflow-x-auto">
                  {`<script defer src="${hostUrl}/open.js" data-project-id="${measurementId}"></script>`}
                </div>
              </div>

              {/* Live Ingestion Test Ping */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${pingVerified ? "bg-emerald-400 animate-glow" : "bg-cyan-400 animate-pulse"}`} />
                  <div>
                    <span className="font-bold text-white">Ingestion Diagnostic: </span>
                    <span className={pingVerified ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                      {pingVerified ? "Verification beacon received (200 OK)" : "Ready to receive telemetry"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={sendTestPing}
                  disabled={testingPing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {testingPing ? (
                    <div className="w-3 h-3 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                  ) : (
                    <Zap size={12} className="text-cyan-400" />
                  )}
                  <span>{pingVerified ? "Send Another Ping" : "Send Test Ping"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: PROPERTY ACCESS & TEAM MANAGEMENT                    */}
          {/* ============================================================ */}
          {activeTab === "team" && (
            <div className="p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Property Access &amp; User Management</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assign role-based access control (Administrator, Editor, Viewer) for this analytics property.
                  </p>
                </div>
              </div>

              {/* Add Member Form */}
              <form onSubmit={handleInviteMember} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus size={14} />
                  <span>Grant Property Access</span>
                </div>

                {inviteError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{inviteError}</span>
                  </div>
                )}

                {inviteSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    <span>User access granted successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Full Name (optional)"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="admin" className="bg-[#0b1020] text-white">Administrator</option>
                    <option value="editor" className="bg-[#0b1020] text-white">Editor</option>
                    <option value="member" className="bg-[#0b1020] text-white">Viewer / Analyst</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus size={14} />
                    <span>{inviting ? "Adding..." : "Add User"}</span>
                  </button>
                </div>
              </form>

              {/* Members Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Active Users</span>

                {/* Owner Row */}
                {owner && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-amber-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                        {owner.name ? owner.name[0].toUpperCase() : "O"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{owner.name}</span>
                          <span className="text-[10px] text-amber-400 font-normal">(Workspace Owner)</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{owner.email}</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1">
                      <Crown size={12} /> Owner
                    </span>
                  </div>
                )}

                {/* Member Rows */}
                {members.map((m) => (
                  <div
                    key={m.userId}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                        {m.name ? m.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{m.name}</div>
                        <div className="text-[11px] text-slate-400">{m.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        onChange={(e) => handleChangeRole(m.userId, e.target.value as any)}
                        className="px-2.5 py-1 bg-[#060a14] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="admin" className="bg-[#0b1020]">Administrator</option>
                        <option value="editor" className="bg-[#0b1020]">Editor</option>
                        <option value="member" className="bg-[#0b1020]">Viewer</option>
                      </select>

                      <button
                        onClick={() => handleRemoveMember(m.userId)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Revoke access"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: DANGER ZONE                                           */}
          {/* ============================================================ */}
          {activeTab === "danger" && (
            <div className="p-6 rounded-3xl bg-[#0b1020]/90 border border-rose-500/30 space-y-5 animate-fadeIn">
              <div className="border-b border-rose-500/20 pb-3">
                <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-400" />
                  <span>Property Danger Zone</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Irreversible actions including ownership delegation and property decommissioning.
                </p>
              </div>

              {/* Transfer Ownership Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">Transfer Property Ownership</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Transfer primary ownership and billing controls of this property to another administrator.
                  </p>
                </div>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold transition cursor-pointer shrink-0"
                >
                  Transfer Ownership
                </button>
              </div>

              {/* Delete Property Card */}
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">Delete Property &amp; Telemetry</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Permanently purge all telemetry data streams, session records, and settings.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition cursor-pointer shrink-0"
                >
                  Delete Property
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Stream Modal */}
      {showAddStreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddStreamModal(false)} />
          <div className="relative max-w-md w-full bg-[#0b1020] border border-cyan-500/30 rounded-3xl p-6 space-y-4 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio size={18} className="text-cyan-400" />
                <span>Add Data Stream</span>
              </h3>
              <button onClick={() => setShowAddStreamModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStream} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Stream Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["web", "ios", "android"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewStreamType(type)}
                      className={`p-2 rounded-xl text-xs font-bold uppercase border transition cursor-pointer ${
                        newStreamType === type
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : "bg-white/[0.02] border-white/[0.06] text-slate-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Stream Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Web App"
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a14] border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Website URL / Bundle ID</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newStreamUrl}
                  onChange={(e) => setNewStreamUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a14] border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddStreamModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingStream}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition disabled:opacity-50"
                >
                  {addingStream ? "Adding..." : "Create Stream"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTransferModal(false)} />
          <div className="relative max-w-md w-full bg-[#0b1020] border border-amber-500/30 rounded-3xl p-6 space-y-4 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 text-amber-400">
                <Crown size={18} />
                <span>Transfer Property Ownership</span>
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {transferError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {transferError}
              </div>
            )}

            <form onSubmit={handleTransferOwnership} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">New Owner Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={transferTargetEmail}
                  onChange={(e) => setTransferTargetEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a14] border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Type property name <span className="text-amber-400">&ldquo;{project.name}&rdquo;</span> to confirm
                </label>
                <input
                  type="text"
                  required
                  placeholder={project.name}
                  value={transferConfirmName}
                  onChange={(e) => setTransferConfirmName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a14] border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition disabled:opacity-50"
                >
                  {transferring ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Property Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />
          <div className="relative max-w-md w-full bg-[#0b1020] border border-rose-500/30 rounded-3xl p-6 space-y-4 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>Delete Analytics Property</span>
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action cannot be undone. All collected pageviews, custom events, and Web Vitals data will be permanently deleted.
            </p>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Type property name <span className="text-rose-400">&ldquo;{project.name}&rdquo;</span> to confirm
                </label>
                <input
                  type="text"
                  required
                  placeholder={project.name}
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a14] border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition disabled:opacity-50"
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

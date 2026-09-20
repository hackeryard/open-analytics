"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PlatformHeader from "@/components/PlatformHeader";
import { usePlatform, NotificationItem } from "@/components/PlatformContext";
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Sparkles,
  Activity,
  Flame,
  Bot,
  Check,
  CheckCheck,
  X,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Search,
  Filter,
  Trash2,
  ShieldCheck,
  Zap,
  Info,
  ArrowUpRight,
  Radio,
  BellOff,
  Plus,
  ChevronDown,
} from "lucide-react";

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getNotificationTypeLabel(type: string): string {
  switch (type) {
    case "error_repeated":
      return "Repeated Errors";
    case "error_storm":
      return "High Error Velocity";
    case "seo_unoptimized":
      return "SEO Missing Title";
    case "aeo_unoptimized":
      return "AEO Low Dwell Friction";
    case "geo_radar":
      return "GEO AI Citation Score";
    case "web_vitals":
      return "Core Web Vitals";
    case "rage_clicks":
      return "Behavioral Rage Clicks";
    default:
      return type.replace(/_/g, " ");
  }
}

function getNotificationIcon(type: string, severity: string) {
  if (type === "error_repeated" || type === "error_storm") {
    return <AlertOctagon size={16} className="text-red-400" />;
  }
  if (type === "web_vitals") {
    return <Activity size={16} className="text-amber-400" />;
  }
  if (type === "rage_clicks") {
    return <Flame size={16} className="text-rose-400" />;
  }
  if (type === "geo_radar" || type === "aeo_unoptimized") {
    return <Bot size={16} className="text-cyan-400" />;
  }
  if (type === "seo_unoptimized") {
    return <Sparkles size={16} className="text-sky-400" />;
  }
  if (severity === "critical") {
    return <AlertOctagon size={16} className="text-red-400" />;
  }
  if (severity === "warning") {
    return <AlertTriangle size={16} className="text-amber-400" />;
  }
  return <Info size={16} className="text-cyan-400" />;
}

export default function NotificationsPage() {
  const {
    activeProjectId,
    notifications,
    unreadNotificationsCount,
    criticalNotificationsCount,
    notificationsLoading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    triggerOptimizationScan,
    ignoreNotificationType,
    unignoreNotificationType,
    addNotificationIgnoreRule,
    deleteNotificationIgnoreRule,
    toggleNotificationIgnoreRule,
    browserNotificationsSupported,
    browserNotificationsPermission,
    browserNotificationsEnabled,
    requestBrowserNotificationPermission,
    toggleBrowserNotifications,
    sendTestBrowserNotification,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"active" | "unread" | "all">("active");
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [ignoreMenuId, setIgnoreMenuId] = useState<string | null>(null);

  // Alert settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [modalTab, setModalTab] = useState<"types" | "rules" | "desktop">("types");
  const [errorRepeatThreshold, setErrorRepeatThreshold] = useState(5);
  const [errorStormThreshold, setErrorStormThreshold] = useState(10);
  const [errorRepeatedAlerts, setErrorRepeatedAlerts] = useState(true);
  const [errorStormAlerts, setErrorStormAlerts] = useState(true);
  const [seoOptimizationAlerts, setSeoOptimizationAlerts] = useState(true);
  const [aeoOptimizationAlerts, setAeoOptimizationAlerts] = useState(true);
  const [geoRadarAlerts, setGeoRadarAlerts] = useState(true);
  const [webVitalsAlerts, setWebVitalsAlerts] = useState(true);
  const [rageClicksAlerts, setRageClicksAlerts] = useState(true);
  const [ignoredTypes, setIgnoredTypes] = useState<string[]>([]);
  const [ignoredRules, setIgnoredRules] = useState<any[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState<string | null>(null);

  // New specific rule input state
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleMatchField, setNewRuleMatchField] = useState<string>("pathname");
  const [newRuleMatchType, setNewRuleMatchType] = useState<string>("contains");
  const [newRulePattern, setNewRulePattern] = useState("");
  const [newRuleType, setNewRuleType] = useState<string>("all");
  const [addingRule, setAddingRule] = useState(false);
  const [ruleActionMessage, setRuleActionMessage] = useState<string | null>(null);

  // Load project alert settings
  useEffect(() => {
    if (!activeProjectId) return;
    async function loadAlertSettings() {
      try {
        const res = await fetch(`/api/projects/${activeProjectId}/alert-rules`);
        if (res.ok) {
          const json = await res.json();
          if (json.alertSettings) {
            setErrorRepeatThreshold(json.alertSettings.errorRepeatThreshold || 5);
            setErrorStormThreshold(json.alertSettings.errorStormThreshold || 10);
            setErrorRepeatedAlerts(json.alertSettings.errorRepeatedAlerts !== false);
            setErrorStormAlerts(json.alertSettings.errorStormAlerts !== false);
            setSeoOptimizationAlerts(json.alertSettings.seoOptimizationAlerts !== false);
            setAeoOptimizationAlerts(json.alertSettings.aeoOptimizationAlerts !== false);
            setGeoRadarAlerts(json.alertSettings.geoRadarAlerts !== false);
            setWebVitalsAlerts(json.alertSettings.webVitalsAlerts !== false);
            setRageClicksAlerts(json.alertSettings.rageClicksAlerts !== false);
            setIgnoredTypes(Array.isArray(json.alertSettings.ignoredTypes) ? json.alertSettings.ignoredTypes : []);
            setIgnoredRules(Array.isArray(json.alertSettings.ignoredRules) ? json.alertSettings.ignoredRules : []);
          }
        }
      } catch (e) {
        console.error("Error loading alert settings:", e);
      }
    }
    loadAlertSettings();
  }, [activeProjectId]);

  const reloadSettings = async () => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/alert-rules`);
      if (res.ok) {
        const json = await res.json();
        if (json.alertSettings) {
          setErrorRepeatThreshold(json.alertSettings.errorRepeatThreshold || 5);
          setErrorStormThreshold(json.alertSettings.errorStormThreshold || 10);
          setErrorRepeatedAlerts(json.alertSettings.errorRepeatedAlerts !== false);
          setErrorStormAlerts(json.alertSettings.errorStormAlerts !== false);
          setSeoOptimizationAlerts(json.alertSettings.seoOptimizationAlerts !== false);
          setAeoOptimizationAlerts(json.alertSettings.aeoOptimizationAlerts !== false);
          setGeoRadarAlerts(json.alertSettings.geoRadarAlerts !== false);
          setWebVitalsAlerts(json.alertSettings.webVitalsAlerts !== false);
          setRageClicksAlerts(json.alertSettings.rageClicksAlerts !== false);
          setIgnoredTypes(Array.isArray(json.alertSettings.ignoredTypes) ? json.alertSettings.ignoredTypes : []);
          setIgnoredRules(Array.isArray(json.alertSettings.ignoredRules) ? json.alertSettings.ignoredRules : []);
        }
      }
    } catch (e) {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId) return;
    setSavingSettings(true);
    setSettingsSavedMessage(null);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/alert-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorRepeatThreshold,
          errorStormThreshold,
          errorRepeatedAlerts,
          errorStormAlerts,
          seoOptimizationAlerts,
          aeoOptimizationAlerts,
          geoRadarAlerts,
          webVitalsAlerts,
          rageClicksAlerts,
          ignoredTypes,
          ignoredRules,
        }),
      });
      if (res.ok) {
        setSettingsSavedMessage("Alert settings saved successfully.");
        await fetchNotifications(activeProjectId);
        setTimeout(() => {
          setSettingsSavedMessage(null);
          setShowSettingsModal(false);
        }, 1500);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateCustomRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId || !newRulePattern.trim()) return;
    setAddingRule(true);
    setRuleActionMessage(null);
    try {
      const ok = await addNotificationIgnoreRule(
        {
          name: newRuleName.trim() || `Ignore ${newRuleMatchField}: ${newRulePattern.slice(0, 30)}`,
          type: newRuleType,
          matchField: newRuleMatchField,
          matchType: newRuleMatchType,
          pattern: newRulePattern.trim(),
        },
        activeProjectId
      );
      if (ok) {
        setRuleActionMessage("Ignore rule created and matching alerts suppressed.");
        setNewRulePattern("");
        setNewRuleName("");
        await reloadSettings();
        setTimeout(() => setRuleActionMessage(null), 3000);
      } else {
        setRuleActionMessage("Failed to create ignore rule.");
      }
    } finally {
      setAddingRule(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!activeProjectId) return;
    await deleteNotificationIgnoreRule(ruleId, activeProjectId);
    await reloadSettings();
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    if (!activeProjectId) return;
    await toggleNotificationIgnoreRule(ruleId, enabled, activeProjectId);
    await reloadSettings();
  };

  const handleRunScan = async () => {
    setScanning(true);
    setScanStatus(null);
    try {
      const res = await triggerOptimizationScan();
      if (res.success) {
        setScanStatus(
          res.newAlertsCount && res.newAlertsCount > 0
            ? `Scan complete: ${res.newAlertsCount} new notification(s) emitted.`
            : "Scan complete: No new anomalies or optimization issues found."
        );
      } else {
        setScanStatus(res.message || "Scan failed.");
      }
    } finally {
      setScanning(false);
      setTimeout(() => setScanStatus(null), 5000);
    }
  };

  const handleClearRead = async () => {
    if (!activeProjectId) return;
    try {
      await fetch(`/api/notifications?projectId=${activeProjectId}&action=clearRead`, {
        method: "DELETE",
      });
      fetchNotifications(activeProjectId);
    } catch (e) {
      console.error("Error clearing read alerts:", e);
    }
  };

  // Filter calculations
  const totalAlertsCount = notifications.length;
  const filteredNotifications = notifications.filter((n) => {
    if (statusFilter === "unread" && n.read) return false;
    if (selectedSeverity !== "all" && n.severity !== selectedSeverity) return false;
    if (selectedType !== "all") {
      if (selectedType === "errors" && !["error_repeated", "error_storm"].includes(n.type)) return false;
      if (selectedType === "seo" && !["seo_unoptimized", "aeo_unoptimized", "geo_radar"].includes(n.type)) return false;
      if (selectedType === "vitals" && n.type !== "web_vitals") return false;
      if (selectedType === "ux" && n.type !== "rage_clicks") return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchMsg = n.message.toLowerCase().includes(q);
      const matchPath = n.metadata?.pathname?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchPath) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <PlatformHeader
        title="Alerts & Notification Center"
        subtitle="Automated crash detection, repeated error thresholding (5x+), and SEO/AEO/GEO optimization audits"
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.08] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Alerts</span>
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalAlertsCount}</div>
          <div className="text-[11px] text-muted-foreground">Total active notifications</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.08] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unread</span>
            <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Zap size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400">{unreadNotificationsCount}</div>
          <div className="text-[11px] text-muted-foreground">Pending user review</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.08] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Critical Issues</span>
            <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertOctagon size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-red-400">{criticalNotificationsCount}</div>
          <div className="text-[11px] text-muted-foreground">Spikes and crash events</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.08] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ignored Rules</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BellOff size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-400">{ignoredRules.length + ignoredTypes.length}</div>
          <div className="text-[11px] text-muted-foreground">Muted types & filter rules</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center flex-wrap gap-2">
          {/* Severity filter buttons */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setSelectedSeverity("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedSeverity === "all" ? "bg-white/[0.1] text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedSeverity("critical")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedSeverity === "critical" ? "bg-red-500/20 text-red-400" : "text-muted-foreground hover:text-white"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedSeverity("warning")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedSeverity === "warning" ? "bg-amber-500/20 text-amber-400" : "text-muted-foreground hover:text-white"
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => setSelectedSeverity("info")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedSeverity === "info" ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:text-white"
              }`}
            >
              Info
            </button>
          </div>

          {/* Type dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Anomaly Types</option>
            <option value="errors">Error Spikes & Storms</option>
            <option value="seo">SEO, AEO & GEO Radar</option>
            <option value="vitals">Core Web Vitals</option>
            <option value="ux">Rage Clicks / UX Friction</option>
          </select>
        </div>

        {/* Global actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRunScan}
            disabled={scanning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={scanning ? "animate-spin" : ""} />
            <span>{scanning ? "Scanning..." : "Scan Telemetry"}</span>
          </button>

          {unreadNotificationsCount > 0 && (
            <button
              type="button"
              onClick={() => markAllNotificationsAsRead()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              <CheckCheck size={13} />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              reloadSettings();
              setShowSettingsModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Alert Rules & Ignore Filters</span>
          </button>
        </div>
      </div>

      {scanStatus && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center justify-between font-mono animate-fadeIn">
          <span>{scanStatus}</span>
          <button onClick={() => setScanStatus(null)} className="text-cyan-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notificationsLoading && notifications.length === 0 ? (
          <div className="p-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#080d1a] border border-white/[0.08] shadow-lg">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading telemetry notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center space-y-3 rounded-2xl bg-[#080d1a] border border-white/[0.08] shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div className="text-sm font-bold text-white">No Matching Notifications</div>
            <div className="text-xs text-slate-400 max-w-sm">
              Your system telemetry is clean. No anomalies or unoptimized conditions matching your filters.
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isCritical = notif.severity === "critical";
            const isWarning = notif.severity === "warning";

            return (
              <div
                key={notif._id}
                className={`p-4 rounded-2xl border transition-all relative ${
                  !notif.read
                    ? "bg-[#0b1022] border-white/[0.15] shadow-md"
                    : "bg-[#080d1a] border-white/[0.06] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Severity / Type Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${
                        isCritical
                          ? "bg-red-500/15 border-red-500/30 text-red-400"
                          : isWarning
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                          : "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                      }`}
                    >
                      {getNotificationIcon(notif.type, notif.severity)}
                    </div>

                    {/* Notification details */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`text-sm font-bold ${!notif.read ? "text-white" : "text-slate-300"}`}>
                          {notif.title}
                        </span>

                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border ${
                            isCritical
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : isWarning
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          }`}
                        >
                          {notif.severity}
                        </span>

                        {!notif.read && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-glow" />}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl break-words">
                        {notif.message}
                      </p>

                      {notif.metadata?.pathname && (
                        <div className="text-[11px] font-mono text-cyan-400/90 pt-0.5">
                          Affected Route: <span className="underline">{notif.metadata.pathname}</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center flex-wrap gap-3 text-xs">
                        {notif.actionUrl && (
                          <Link
                            href={notif.actionUrl}
                            onClick={() => {
                              if (!notif.read) markNotificationAsRead(notif._id);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-500/25 transition"
                          >
                            <span>{notif.actionLabel || "Inspect Issue"}</span>
                            <ArrowUpRight size={12} />
                          </Link>
                        )}

                        <span className="text-[11px] font-mono text-muted-foreground">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notif._id)}
                        className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer"
                        title="Mark as read"
                        aria-label="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}

                    {/* Granular Ignore Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIgnoreMenuId(ignoreMenuId === notif._id ? null : notif._id)}
                        className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                        title="Ignore or mute alerts"
                        aria-label="Ignore or mute alerts"
                      >
                        <BellOff size={14} />
                      </button>

                      {ignoreMenuId === notif._id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIgnoreMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#080d1a] border border-white/[0.12] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1 text-left">
                            <div className="px-2.5 py-1.5 border-b border-white/[0.08] text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                              Mute & Ignore Filters
                            </div>

                            <button
                              type="button"
                              onClick={async () => {
                                await ignoreNotificationType(notif.type);
                                setIgnoreMenuId(null);
                                await reloadSettings();
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
                            >
                              <span>Mute all {getNotificationTypeLabel(notif.type)}</span>
                            </button>

                            {notif.metadata?.pathname && (
                              <button
                                type="button"
                                onClick={async () => {
                                  await addNotificationIgnoreRule({
                                    name: `Ignore route: ${notif.metadata.pathname}`,
                                    matchField: "pathname",
                                    matchType: "exact",
                                    pattern: notif.metadata.pathname,
                                    type: "all",
                                  });
                                  setIgnoreMenuId(null);
                                  await reloadSettings();
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
                              >
                                <span className="truncate">Ignore route: {notif.metadata.pathname}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={async () => {
                                await addNotificationIgnoreRule({
                                  name: `Ignore: ${notif.title.slice(0, 30)}`,
                                  matchField: "fingerprint",
                                  matchType: "exact",
                                  pattern: notif.fingerprint,
                                  type: notif.type,
                                });
                                setIgnoreMenuId(null);
                                await reloadSettings();
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer"
                            >
                              <span>Ignore this exact alert</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => dismissNotification(notif._id)}
                      className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition cursor-pointer"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Rules & Ignore Filters Modal (NO TRANSPARENCY) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
          <div className="relative max-w-xl w-full bg-[#080d1a] border border-white/[0.12] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 z-10 animate-fadeIn max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-cyan-400" />
                <h3 className="text-sm font-black text-white">Alert Rules & Ignore Filters</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-2 text-xs">
              <button
                type="button"
                onClick={() => setModalTab("types")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  modalTab === "types" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                General Types & Thresholds
              </button>
              <button
                type="button"
                onClick={() => setModalTab("rules")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "rules" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Specific Ignore Rules</span>
                {ignoredRules.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-cyan-200">
                    {ignoredRules.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setModalTab("desktop")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  modalTab === "desktop" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Desktop Alerts
              </button>
            </div>

            {/* Tab 1: General Notification Types & Detection Thresholds */}
            {modalTab === "types" && (
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                {/* Thresholds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold">Repeated Error Threshold</label>
                      <span className="text-cyan-400 font-mono font-bold">{errorRepeatThreshold}x</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="1"
                      value={errorRepeatThreshold}
                      onChange={(e) => setErrorRepeatThreshold(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="text-[10px] text-muted-foreground">Alerts when identical error occurs {errorRepeatThreshold} times.</div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-bold">Error Storm Velocity</label>
                      <span className="text-red-400 font-mono font-bold">{errorStormThreshold}/hr</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={errorStormThreshold}
                      onChange={(e) => setErrorStormThreshold(Number(e.target.value))}
                      className="w-full accent-red-400 cursor-pointer"
                    />
                    <div className="text-[10px] text-muted-foreground">Alerts if total errors exceed {errorStormThreshold} in 1 hour.</div>
                  </div>
                </div>

                {/* 7 General Notification Type Toggles */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider px-1">
                    Notification Types to Generate
                  </div>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">Repeated Error Spikes</div>
                      <div className="text-[10px] text-muted-foreground">Triggers alerts when identical errors occur repeatedly.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={errorRepeatedAlerts}
                      onChange={(e) => setErrorRepeatedAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">Error Storm Velocity</div>
                      <div className="text-[10px] text-muted-foreground">High-priority alert when site error velocity spikes above threshold.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={errorStormAlerts}
                      onChange={(e) => setErrorStormAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">SEO Missing & Untitled Pages</div>
                      <div className="text-[10px] text-muted-foreground">Audits routes missing HTML title tags or titled generic "untitled".</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={seoOptimizationAlerts}
                      onChange={(e) => setSeoOptimizationAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">AEO Dwell & Friction Alerts</div>
                      <div className="text-[10px] text-muted-foreground">Audits routes with low dwell time (&lt; 4s) and immediate exits.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={aeoOptimizationAlerts}
                      onChange={(e) => setAeoOptimizationAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">GEO AI Citation Readiness Radar</div>
                      <div className="text-[10px] text-muted-foreground">Emits health alert when citation readiness score drops below 50%.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={geoRadarAlerts}
                      onChange={(e) => setGeoRadarAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">Core Web Vitals Degradation</div>
                      <div className="text-[10px] text-muted-foreground">Alerts on poor Largest Contentful Paint (&gt; 2.5s) or Layout Shift (&gt; 0.25).</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={webVitalsAlerts}
                      onChange={(e) => setWebVitalsAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition">
                    <div>
                      <div className="text-slate-200 font-bold">Behavioral Rage Click Clusters</div>
                      <div className="text-[10px] text-muted-foreground">Alerts when users click unhandled elements repeatedly (3x+).</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={rageClicksAlerts}
                      onChange={(e) => setRageClicksAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>
                </div>

                {settingsSavedMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 text-center font-bold">
                    {settingsSavedMessage}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition cursor-pointer disabled:opacity-50"
                  >
                    {savingSettings ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Specific Ignore Rules & Granular Suppression */}
            {modalTab === "rules" && (
              <div className="space-y-4 text-xs">
                {/* Form to add a new ignore rule */}
                <form onSubmit={handleCreateCustomRule} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Plus size={14} className="text-cyan-400" />
                    <span>Add New Ignore Filter</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">Match Field</label>
                      <select
                        value={newRuleMatchField}
                        onChange={(e) => setNewRuleMatchField(e.target.value)}
                        className="w-full mt-1 bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="pathname">Route / Pathname URL</option>
                        <option value="message">Error Message / Content</option>
                        <option value="title">Alert Title</option>
                        <option value="fingerprint">Alert Fingerprint</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">Match Operator</label>
                      <select
                        value={newRuleMatchType}
                        onChange={(e) => setNewRuleMatchType(e.target.value)}
                        className="w-full mt-1 bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="contains">Contains substring</option>
                        <option value="exact">Exact match</option>
                        <option value="starts_with">Starts with prefix</option>
                        <option value="regex">Regular expression</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-bold">Pattern String</label>
                    <input
                      type="text"
                      placeholder={newRuleMatchField === "pathname" ? "e.g. /test or /admin" : "e.g. ResizeObserver or ChunkLoadError"}
                      value={newRulePattern}
                      onChange={(e) => setNewRulePattern(e.target.value)}
                      required
                      className="w-full mt-1 bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">Applies To</label>
                      <select
                        value={newRuleType}
                        onChange={(e) => setNewRuleType(e.target.value)}
                        className="w-full mt-1 bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="all">All Alert Types</option>
                        <option value="error_repeated">Repeated Errors Only</option>
                        <option value="seo_unoptimized">SEO Audits Only</option>
                        <option value="aeo_unoptimized">AEO Audits Only</option>
                        <option value="web_vitals">Web Vitals Only</option>
                        <option value="rage_clicks">Rage Clicks Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">Optional Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Mute staging test routes"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        className="w-full mt-1 bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {ruleActionMessage && (
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold">
                      {ruleActionMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={addingRule || !newRulePattern.trim()}
                    className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {addingRule ? "Creating Rule..." : "Create Ignore Rule"}
                  </button>
                </form>

                {/* Active ignore rules list */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider px-1">
                    Active Ignore Rules ({ignoredRules.length})
                  </div>

                  {ignoredRules.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground border border-white/[0.06] rounded-xl bg-white/[0.01]">
                      No custom ignore rules configured. Add a rule above or use the ignore button on any alert card.
                    </div>
                  ) : (
                    ignoredRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white truncate">{rule.name || rule.pattern}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {rule.matchField} {rule.matchType} &quot;{rule.pattern}&quot;
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Scope: {rule.type === "all" ? "All Notification Types" : getNotificationTypeLabel(rule.type)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                              rule.enabled
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                            }`}
                          >
                            {rule.enabled ? "Active" : "Disabled"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.06] transition cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Desktop Notifications */}
            {modalTab === "desktop" && browserNotificationsSupported && (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio size={14} className="text-cyan-400" />
                    <span className="text-white font-bold">Desktop Browser Notification Alerts</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      browserNotificationsPermission === "granted"
                        ? browserNotificationsEnabled
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-slate-500/20 text-slate-400"
                        : browserNotificationsPermission === "denied"
                        ? "bg-red-500/15 border border-red-500/30 text-red-400"
                        : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {browserNotificationsPermission === "granted"
                      ? browserNotificationsEnabled
                        ? "Active"
                        : "Muted"
                      : browserNotificationsPermission === "denied"
                      ? "Blocked"
                      : "Permission Required"}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Receive native operating system desktop alerts and audio chimes whenever repeated errors or critical telemetry anomalies occur.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {browserNotificationsPermission !== "granted" ? (
                    <button
                      type="button"
                      onClick={() => requestBrowserNotificationPermission()}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      Enable Desktop Alerts
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleBrowserNotifications}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                        browserNotificationsEnabled
                          ? "bg-white/[0.08] hover:bg-white/[0.14] text-slate-200"
                          : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                      }`}
                    >
                      {browserNotificationsEnabled ? "Mute Desktop Alerts" : "Unmute Desktop Alerts"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => sendTestBrowserNotification()}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
                  >
                    Send Test Notification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

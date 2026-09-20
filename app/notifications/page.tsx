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

  // Alert settings state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [errorRepeatThreshold, setErrorRepeatThreshold] = useState(5);
  const [errorStormThreshold, setErrorStormThreshold] = useState(10);
  const [seoOptimizationAlerts, setSeoOptimizationAlerts] = useState(true);
  const [webVitalsAlerts, setWebVitalsAlerts] = useState(true);
  const [rageClicksAlerts, setRageClicksAlerts] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState<string | null>(null);

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
            setSeoOptimizationAlerts(json.alertSettings.seoOptimizationAlerts !== false);
            setWebVitalsAlerts(json.alertSettings.webVitalsAlerts !== false);
            setRageClicksAlerts(json.alertSettings.rageClicksAlerts !== false);
          }
        }
      } catch (e) {
        console.error("Error loading alert settings:", e);
      }
    }
    loadAlertSettings();
  }, [activeProjectId]);

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
          seoOptimizationAlerts,
          webVitalsAlerts,
          rageClicksAlerts,
        }),
      });
      if (res.ok) {
        setSettingsSavedMessage("Alert settings saved successfully.");
        setTimeout(() => {
          setSettingsSavedMessage(null);
          setShowSettingsModal(false);
        }, 1500);
      }
    } finally {
      setSavingSettings(false);
    }
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
  const seoAlertsCount = notifications.filter((n) =>
    ["seo_unoptimized", "aeo_unoptimized", "geo_radar"].includes(n.type)
  ).length;

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
        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Alerts</span>
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalAlertsCount}</div>
          <div className="text-[11px] text-muted-foreground">Total active notifications</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unread</span>
            <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Zap size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400">{unreadNotificationsCount}</div>
          <div className="text-[11px] text-muted-foreground">Pending user review</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Critical Issues</span>
            <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertOctagon size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-red-400">{criticalNotificationsCount}</div>
          <div className="text-[11px] text-muted-foreground">Crashes & high velocity</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SEO & AI Radar</span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles size={13} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">{seoAlertsCount}</div>
          <div className="text-[11px] text-muted-foreground">Optimization actions</div>
        </div>
      </div>

      {/* Control Bar & Actions */}
      <div className="glass-card p-4 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alerts by route, error, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRunScan}
            disabled={scanning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={scanning ? "animate-spin" : ""} />
            <span>{scanning ? "Scanning..." : "Scan Telemetry Now"}</span>
          </button>

          {browserNotificationsSupported && (
            <button
              type="button"
              onClick={() => {
                if (browserNotificationsPermission !== "granted") {
                  requestBrowserNotificationPermission();
                } else {
                  toggleBrowserNotifications();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                browserNotificationsPermission === "granted" && browserNotificationsEnabled
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-300 hover:text-white"
              }`}
              title={
                browserNotificationsPermission === "granted"
                  ? browserNotificationsEnabled
                    ? "Desktop Alerts Active (Click to mute)"
                    : "Desktop Alerts Muted (Click to unmute)"
                  : "Click to enable native browser notifications"
              }
            >
              <Radio
                size={13}
                className={
                  browserNotificationsPermission === "granted" && browserNotificationsEnabled
                    ? "animate-pulse"
                    : ""
                }
              />
              <span className="hidden sm:inline">Desktop Alerts:</span>
              <span>
                {browserNotificationsPermission === "granted"
                  ? browserNotificationsEnabled
                    ? "ON"
                    : "Muted"
                  : "Enable"}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Alert Rules</span>
          </button>

          {unreadNotificationsCount > 0 && (
            <button
              type="button"
              onClick={() => markAllNotificationsAsRead()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              <CheckCheck size={13} />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearRead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/[0.08] hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-bold transition cursor-pointer"
            title="Clear already read notifications"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Clear Read</span>
          </button>
        </div>
      </div>

      {scanStatus && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-center justify-between font-mono animate-fadeIn">
          <span>{scanStatus}</span>
          <button onClick={() => setScanStatus(null)} className="text-cyan-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-muted-foreground font-bold text-[11px] mr-1">Status:</span>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === "active"
                ? "bg-white/[0.1] text-white"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            All Active
          </button>
          <button
            onClick={() => setStatusFilter("unread")}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === "unread"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            Unread ({unreadNotificationsCount})
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-muted-foreground font-bold text-[11px] mr-1">Category:</span>
          {["all", "errors", "seo", "vitals", "ux"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-lg capitalize font-bold transition cursor-pointer ${
                selectedType === type
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {type === "all" ? "All Categories" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notificationsLoading && notifications.length === 0 ? (
          <div className="glass-card p-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.08]">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading telemetry notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="glass-card p-16 text-center text-muted-foreground flex flex-col items-center justify-center space-y-3 rounded-2xl border border-white/[0.08]">
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
                className={`glass-card p-4 rounded-2xl border transition-all ${
                  !notif.read
                    ? "bg-white/[0.04] border-white/[0.15] shadow-md"
                    : "bg-white/[0.015] border-white/[0.06] opacity-80 hover:opacity-100"
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

                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-glow" />
                        )}
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
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => dismissNotification(notif._id)}
                      className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition cursor-pointer"
                      title="Dismiss notification"
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

      {/* Alert Rules & Thresholds Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
          <div className="relative max-w-md w-full glass-card border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-cyan-400" />
                <h3 className="text-sm font-black text-white">Alert Rules & Conditions</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Configure detection thresholds for automated crash triggers, repeated exceptions, and SEO/GEO health scans.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              {/* Repeated error threshold */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <label className="text-white font-bold">Repeated Error Threshold</label>
                  <span className="text-cyan-400 font-mono font-bold">{errorRepeatThreshold}x occurrences</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={errorRepeatThreshold}
                  onChange={(e) => setErrorRepeatThreshold(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="text-[10px] text-muted-foreground">
                  Triggers an alert when the identical error signature occurs {errorRepeatThreshold} times.
                </div>
              </div>

              {/* Error storm threshold */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <label className="text-white font-bold">Error Storm Velocity</label>
                  <span className="text-red-400 font-mono font-bold">{errorStormThreshold} errors / hr</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={errorStormThreshold}
                  onChange={(e) => setErrorStormThreshold(Number(e.target.value))}
                  className="w-full accent-red-400"
                />
                <div className="text-[10px] text-muted-foreground">
                  Triggers a critical alert if total errors exceed {errorStormThreshold} in a single 1-hour window.
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                  <span className="text-slate-200 font-bold">SEO & AEO Optimization Audits</span>
                  <input
                    type="checkbox"
                    checked={seoOptimizationAlerts}
                    onChange={(e) => setSeoOptimizationAlerts(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                  <span className="text-slate-200 font-bold">Core Web Vitals Degradation Alerts</span>
                  <input
                    type="checkbox"
                    checked={webVitalsAlerts}
                    onChange={(e) => setWebVitalsAlerts(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
                  <span className="text-slate-200 font-bold">Rage Click & Frustration Alerts</span>
                  <input
                    type="checkbox"
                    checked={rageClicksAlerts}
                    onChange={(e) => setRageClicksAlerts(e.target.checked)}
                    className="w-4 h-4 rounded accent-rose-400"
                  />
                </label>
              </div>

              {/* Desktop Browser Notifications Section */}
              {browserNotificationsSupported && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
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
                        onClick={requestBrowserNotificationPermission}
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

              {settingsSavedMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 text-center font-bold">
                  {settingsSavedMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition font-bold"
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
          </div>
        </div>
      )}
    </div>
  );
}

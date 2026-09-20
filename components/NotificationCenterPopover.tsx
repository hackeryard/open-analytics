"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { usePlatform, NotificationItem } from "@/components/PlatformContext";

interface NotificationCenterPopoverProps {
  align?: "left" | "right";
  className?: string;
}

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
    return <AlertOctagon size={14} className="text-red-400" />;
  }
  if (type === "web_vitals") {
    return <Activity size={14} className="text-amber-400" />;
  }
  if (type === "rage_clicks") {
    return <Flame size={14} className="text-rose-400" />;
  }
  if (type === "geo_radar" || type === "aeo_unoptimized") {
    return <Bot size={14} className="text-cyan-400" />;
  }
  if (type === "seo_unoptimized") {
    return <Sparkles size={14} className="text-sky-400" />;
  }
  if (severity === "critical") {
    return <AlertOctagon size={14} className="text-red-400" />;
  }
  if (severity === "warning") {
    return <AlertTriangle size={14} className="text-amber-400" />;
  }
  return <Sparkles size={14} className="text-cyan-400" />;
}

export default function NotificationCenterPopover({
  align = "right",
  className = "",
}: NotificationCenterPopoverProps) {
  const {
    notifications,
    unreadNotificationsCount,
    criticalNotificationsCount,
    notificationsLoading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    triggerOptimizationScan,
  } = usePlatform();

  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "errors" | "optimizations">("all");
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleScan = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      const res = await triggerOptimizationScan();
      if (res.success) {
        setScanMessage(
          res.newAlertsCount && res.newAlertsCount > 0
            ? `Found ${res.newAlertsCount} new item(s)`
            : "No new issues found"
        );
      } else {
        setScanMessage("Scan failed");
      }
    } finally {
      setScanning(false);
      setTimeout(() => setScanMessage(null), 3000);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterTab === "unread") return !n.read;
    if (filterTab === "errors") return n.type === "error_repeated" || n.type === "error_storm";
    if (filterTab === "optimizations")
      return ["seo_unoptimized", "aeo_unoptimized", "geo_radar", "web_vitals", "rage_clicks"].includes(n.type);
    return true;
  });

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer group"
        title="Alerts & Notifications"
        aria-label="Alerts & Notifications"
      >
        <Bell size={14} className="group-hover:scale-105 transition-transform" />
        {unreadNotificationsCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center text-[10px] font-mono font-black text-white shadow-xs ${
              criticalNotificationsCount > 0
                ? "bg-red-500 animate-pulse"
                : "bg-cyan-500"
            }`}
          >
            {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 glass-card rounded-2xl shadow-2xl z-50 animate-fadeIn border border-white/[0.12] flex flex-col max-h-[85vh] overflow-hidden`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-white/[0.08] bg-[#080d19]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bell size={14} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">Alerts & Telemetry</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">Anomaly & Optimization Engine</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleScan}
                disabled={scanning}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition cursor-pointer disabled:opacity-50"
                title="Run Health & Optimization Scan"
              >
                <RefreshCw size={13} className={scanning ? "animate-spin text-cyan-400" : ""} />
              </button>
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllNotificationsAsRead()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                </button>
              )}
            </div>
          </div>

          {scanMessage && (
            <div className="px-3.5 py-1.5 bg-cyan-500/10 border-b border-cyan-500/20 text-[11px] text-cyan-300 flex items-center justify-between font-mono animate-fadeIn">
              <span>{scanMessage}</span>
              <button onClick={() => setScanMessage(null)} className="text-cyan-400 hover:text-white">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="px-2.5 py-2 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-1">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterTab === "all"
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab("unread")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                filterTab === "unread"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <span>Unread</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/30">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterTab("errors")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterTab === "errors"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              Errors
            </button>
            <button
              onClick={() => setFilterTab("optimizations")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterTab === "optimizations"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              Optimizations
            </button>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar max-h-80">
            {notificationsLoading && notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Loading alerts...</span>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center text-muted-foreground flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-xs font-bold text-white">All Clear</div>
                <div className="text-[11px] text-slate-400 max-w-[200px]">
                  No active alerts or anomalies detected for this project.
                </div>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isCritical = notif.severity === "critical";
                const isWarning = notif.severity === "warning";

                return (
                  <div
                    key={notif._id}
                    className={`p-3 rounded-xl border transition-all text-left relative group ${
                      !notif.read
                        ? "bg-white/[0.05] border-white/[0.14] shadow-sm"
                        : "bg-white/[0.015] border-white/[0.05] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Category Icon */}
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border ${
                          isCritical
                            ? "bg-red-500/15 border-red-500/30"
                            : isWarning
                            ? "bg-amber-500/15 border-amber-500/30"
                            : "bg-cyan-500/15 border-cyan-500/30"
                        }`}
                      >
                        {getNotificationIcon(notif.type, notif.severity)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-bold truncate ${
                              !notif.read ? "text-white" : "text-slate-300"
                            }`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed break-words line-clamp-2">
                          {notif.message}
                        </p>

                        {/* Action buttons */}
                        <div className="pt-1.5 flex items-center justify-between gap-2">
                          {notif.actionUrl ? (
                            <Link
                              href={notif.actionUrl}
                              onClick={() => {
                                if (!notif.read) markNotificationAsRead(notif._id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
                            >
                              <span>{notif.actionLabel || "Inspect"}</span>
                              <ExternalLink size={10} />
                            </Link>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-1">
                            {!notif.read && (
                              <button
                                type="button"
                                onClick={() => markNotificationAsRead(notif._id)}
                                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                                title="Mark as read"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => dismissNotification(notif._id)}
                              className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/[0.08] transition cursor-pointer"
                              title="Dismiss"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-white/[0.08] bg-[#080d19]/80 flex items-center justify-between text-xs">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-cyan-400 hover:bg-cyan-500/10 font-bold transition text-[11px]"
            >
              <span>View All Alerts & Preferences</span>
              <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Radio,
  Play,
  Pause,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Download,
  Laptop,
  Smartphone,
  Tablet,
  Activity,
  Clock,
  Globe,
  FileJson,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ExternalLink,
  Check,
  Copy,
  Users,
  Repeat,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
  Zap,
  Gauge,
  Layers,
  Cpu,
  Wifi,
  Shield,
  Bot,
  Compass,
  ArrowUpRight,
  Terminal,
  Volume2,
  VolumeX,
  LayoutGrid,
  List,
  Flame,
  MousePointer,
  Navigation,
  Server,
  Code2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Hash,
  Monitor,
  Calendar,
  Share2,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import {
  PageViewItem,
  timeAgo,
  formatDuration,
  formatExactTime,
  formatExactDate,
} from "@/lib/analyticsTypes";
import { getFullCountryName } from "@/lib/countries";
import { getTrackedUrl } from "@/lib/urlHelper";

// Web Audio API chime generator for live event arrival
function playLiveChime(volume = 0.08) {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  } catch {
    // AudioContext blocked or not supported
  }
}

export default function LiveFeedSection() {
  const {
    activeProjectId,
    activeProject,
    paginatedPageviews,
    pvPagination,
    pvLoading,
    pvPage,
    setPvPage,
    pvLimit,
    setPvLimit,
    pvQuery,
    setPvQuery,
    pvUserType,
    setPvUserType,
    pvDevice,
    setPvDevice,
    pvVitals,
    setPvVitals,
    pvSort,
    setPvSort,
    pvTimeRange,
    liveStreamActive,
    setLiveStreamActive,
    fetchPaginatedPageviews,
    jumpPageInput,
    setJumpPageInput,
  } = usePlatform();

  // Local View & Control States
  const [selectedPv, setSelectedPv] = useState<PageViewItem | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "identity" | "traffic" | "hardware" | "vitals" | "json">("overview");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(5);
  const [jsonCopied, setJsonCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [highlightNew, setHighlightNew] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track previous latest event ID to trigger sound/highlight
  const prevTopIdRef = useRef<string | null>(null);

  const currentSegment = pvUserType || "all";

  // Trigger sound / sync timestamp on new incoming records
  useEffect(() => {
    if (paginatedPageviews && paginatedPageviews.length > 0) {
      const topId = paginatedPageviews[0]?._id;
      if (prevTopIdRef.current && topId && topId !== prevTopIdRef.current) {
        if (soundEnabled) {
          playLiveChime();
        }
      }
      prevTopIdRef.current = topId || null;
      setLastSyncTime(new Date());
    }
  }, [paginatedPageviews, soundEnabled]);

  const handleCopy = (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= pvPagination.totalPages) {
      setPvPage(target);
      fetchPaginatedPageviews(target, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
      setJumpPageInput("");
    }
  };

  const handleResetFilters = () => {
    setPvQuery("");
    setPvUserType("all");
    setPvDevice("all");
    if (setPvVitals) setPvVitals("all");
    setPvSort("createdAt_desc");
    setPvPage(1);
    fetchPaginatedPageviews(1, pvLimit, "all", "", "createdAt_desc", pvTimeRange);
  };

  const handleExportCSV = () => {
    if (!paginatedPageviews || paginatedPageviews.length === 0) return;
    const headers = [
      "Event Time",
      "Pathname",
      "Title",
      "Lab ID",
      "Visitor ID",
      "Session ID",
      "User Email",
      "Is Returning",
      "Visit Count",
      "Dwell (s)",
      "Active (s)",
      "Idle (s)",
      "Scroll (%)",
      "Is Bounce",
      "Exit Intent",
      "Device",
      "Browser",
      "OS",
      "Country",
      "City",
      "IP",
      "Referrer",
      "Referrer Domain",
      "Search Engine",
      "AI Referrer",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "LCP (ms)",
      "FCP (ms)",
      "INP (ms)",
      "CLS",
      "TTFB (ms)",
      "Network Type",
      "Downlink (Mbps)",
    ];

    const rows = paginatedPageviews.map((pv) => [
      `"${pv.createdAt}"`,
      `"${(pv.pathname || "").replace(/"/g, '""')}"`,
      `"${(pv.title || "").replace(/"/g, '""')}"`,
      pv.labId || "",
      pv.visitorId || "",
      pv.sessionId || "",
      pv.userId?.email || "",
      pv.isReturning ? "Yes" : "No",
      pv.visitCount || 1,
      pv.duration || 0,
      pv.activeDuration || 0,
      pv.idleDuration || 0,
      pv.scrollDepth || 0,
      pv.isBounce ? "Yes" : "No",
      pv.exitIntent ? "Yes" : "No",
      pv.device || "",
      pv.browser || "",
      pv.os || "",
      pv.country || "",
      pv.city || "",
      (pv as any).ip || "",
      `"${(pv.referrer || "").replace(/"/g, '""')}"`,
      `"${(pv.referrerDomain || "").replace(/"/g, '""')}"`,
      pv.searchEngine || "",
      pv.aiReferrer || "",
      pv.utmSource || "",
      pv.utmMedium || "",
      pv.utmCampaign || "",
      pv.webVitals?.lcp || "",
      pv.webVitals?.fcp || "",
      pv.webVitals?.inp || "",
      pv.webVitals?.cls || "",
      pv.webVitals?.ttfb || "",
      pv.network?.effectiveType || "",
      pv.network?.downlink || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `live-feed-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!paginatedPageviews || paginatedPageviews.length === 0) return;
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paginatedPageviews, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `live-feed-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportNDJSON = () => {
    if (!paginatedPageviews || paginatedPageviews.length === 0) return;
    const ndjson = paginatedPageviews.map((pv) => JSON.stringify(pv)).join("\n");
    const blob = new Blob([ndjson], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `live-feed-${new Date().toISOString().split("T")[0]}.ndjson`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPageNumbers = () => {
    const total = pvPagination.totalPages;
    const current = pvPage;
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift("...");
    range.unshift(1);
    if (current + delta < total - 1) range.push("...");
    if (total > 1) range.push(total);
    return range;
  };

  // Live polling effect
  useEffect(() => {
    if (!liveStreamActive || refreshIntervalSec <= 0) return;
    const streamInterval = setInterval(() => {
      fetchPaginatedPageviews(pvPage, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
    }, refreshIntervalSec * 1000);
    return () => clearInterval(streamInterval);
  }, [liveStreamActive, refreshIntervalSec, pvPage, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange, fetchPaginatedPageviews]);

  // Derived stream metrics from current loaded page
  const streamStats = useMemo(() => {
    if (!paginatedPageviews || paginatedPageviews.length === 0) {
      return {
        avgDwell: 0,
        activeRatio: 0,
        bounceRate: 0,
        exitIntentRate: 0,
        desktopPct: 0,
        mobilePct: 0,
        tabletPct: 0,
        newPct: 0,
        returningPct: 0,
        identifiedPct: 0,
        rpm: 0,
      };
    }
    const count = paginatedPageviews.length;
    const totalDwell = paginatedPageviews.reduce((acc, p) => acc + (p.duration || 0), 0);
    const totalActive = paginatedPageviews.reduce((acc, p) => acc + (p.activeDuration || p.duration || 0), 0);
    const bounces = paginatedPageviews.filter((p) => p.isBounce).length;
    const exitIntents = paginatedPageviews.filter((p) => p.exitIntent).length;
    const desktop = paginatedPageviews.filter((p) => p.device === "desktop").length;
    const mobile = paginatedPageviews.filter((p) => p.device === "mobile").length;
    const tablet = paginatedPageviews.filter((p) => p.device === "tablet").length;
    const newVisitors = paginatedPageviews.filter((p) => !p.isReturning && (!p.visitCount || p.visitCount <= 1)).length;
    const returning = paginatedPageviews.filter((p) => p.isReturning || (p.visitCount && p.visitCount > 1)).length;
    const identified = paginatedPageviews.filter((p) => p.userId).length;

    // RPM estimation: count events within the last 60 seconds
    const now = Date.now();
    const lastMinEvents = paginatedPageviews.filter((p) => now - new Date(p.createdAt).getTime() <= 60000).length;

    return {
      avgDwell: Math.round(totalDwell / count),
      activeRatio: totalDwell > 0 ? Math.round((totalActive / totalDwell) * 100) : 100,
      bounceRate: Math.round((bounces / count) * 100),
      exitIntentRate: Math.round((exitIntents / count) * 100),
      desktopPct: Math.round((desktop / count) * 100),
      mobilePct: Math.round((mobile / count) * 100),
      tabletPct: Math.round((tablet / count) * 100),
      newPct: Math.round((newVisitors / count) * 100),
      returningPct: Math.round((returning / count) * 100),
      identifiedPct: Math.round((identified / count) * 100),
      rpm: lastMinEvents,
    };
  }, [paginatedPageviews]);

  return (
    <div className="space-y-6 pb-20">
      {/* ── 1. Top Telemetry Command Deck & Live Gauges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Gauge 1: Real-Time Stream Status & Ingestion Health */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Radio size={12} className={liveStreamActive ? "text-emerald-400 animate-pulse" : "text-zinc-500"} />
              <span>Stream Ingestion</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  liveStreamActive
                    ? "bg-emerald-400 animate-ping"
                    : "bg-zinc-600"
                }`}
              />
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium border ${
                  liveStreamActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/[0.04] text-zinc-400 border-white/[0.08]"
                }`}
              >
                {liveStreamActive ? `Live (${refreshIntervalSec}s)` : "Paused"}
              </span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-semibold font-mono text-white tracking-tight tabular-nums">
                {pvPagination.total.toLocaleString()}
              </span>
              <span className="block text-xs text-zinc-500 mt-0.5">
                Total events in selected view
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLiveStreamActive((v) => !v)}
              className={`p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                liveStreamActive
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-[#0e0f15] hover:bg-[#181922] text-zinc-300 border-white/[0.08]"
              }`}
              title={liveStreamActive ? "Pause Stream Polling" : "Resume Live Stream"}
            >
              {liveStreamActive ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
            <span suppressHydrationWarning>
              {mounted ? `Last polled: ${formatExactTime(lastSyncTime.toISOString())}` : "Streaming live..."}
            </span>
            <span className="text-emerald-400 font-semibold tabular-nums">{streamStats.rpm} RPM</span>
          </div>
        </div>

        {/* Gauge 2: Real-time Engagement & Active Dwell */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Clock size={12} className="text-zinc-400" />
              <span>Avg Active Dwell</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-white/[0.06] text-zinc-300 border border-white/[0.08] font-mono tabular-nums">
              {streamStats.activeRatio}% Active
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold font-mono text-white tracking-tight tabular-nums">
              {formatDuration(streamStats.avgDwell)}
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5">
              Average session engagement time
            </span>
          </div>
          <div className="space-y-1 pt-1 border-t border-white/[0.06]">
            <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden flex">
              <div style={{ width: `${streamStats.activeRatio}%` }} className="bg-emerald-400 h-full" title={`Active: ${streamStats.activeRatio}%`} />
              <div style={{ width: `${100 - streamStats.activeRatio}%` }} className="bg-white/[0.06] h-full" title={`Idle: ${100 - streamStats.activeRatio}%`} />
            </div>
          </div>
        </div>

        {/* Gauge 3: Bounce Rate & Exit Velocity */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Flame size={12} className="text-amber-400" />
              <span>Bounce Velocity</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border font-mono ${
                streamStats.bounceRate <= 30
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : streamStats.bounceRate <= 60
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {streamStats.bounceRate <= 30 ? "Optimal" : streamStats.bounceRate <= 60 ? "Moderate" : "Elevated"}
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold font-mono text-white tracking-tight tabular-nums">
              {streamStats.bounceRate}%
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5">
              Single-hit sessions in current view
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
            <span>Exit Intent Rate</span>
            <span className="text-amber-400 font-medium tabular-nums">{streamStats.exitIntentRate}%</span>
          </div>
        </div>

        {/* Gauge 4: Hardware & Audience Distribution */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu size={12} className="text-zinc-400" />
              <span>Audience &amp; Device</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-white/[0.06] text-zinc-300 border border-white/[0.08] font-mono tabular-nums">
              {streamStats.desktopPct}% Desktop
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-medium text-white tabular-nums">{streamStats.mobilePct}% Mobile</span>
              <span className="text-zinc-500 tabular-nums">{streamStats.returningPct}% Returning</span>
            </div>
            <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden flex gap-0.5">
              <div style={{ width: `${streamStats.desktopPct}%` }} className="bg-white h-full rounded-l-full" title={`Desktop: ${streamStats.desktopPct}%`} />
              <div style={{ width: `${streamStats.mobilePct}%` }} className="bg-zinc-400 h-full" title={`Mobile: ${streamStats.mobilePct}%`} />
              <div style={{ width: `${streamStats.tabletPct}%` }} className="bg-zinc-600 h-full rounded-r-full" title={`Tablet: ${streamStats.tabletPct}%`} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
            <span>Identified Accounts</span>
            <span className="text-zinc-300 font-medium tabular-nums">{streamStats.identifiedPct}%</span>
          </div>
        </div>
      </div>

      {/* ── 2. Main Live Telemetry Stream Card ── */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden space-y-0">
        {/* Stream Command Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0e0f15] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] text-white border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                    <span>Real-Time Event Stream &amp; Pageview Telemetry</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live stream of incoming page hits, audience telemetry, network correlates, and audit trails
                  </p>
                </div>
              </div>
            </div>

            {/* Stream Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sound Chime Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((v) => !v)}
                className={`p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  soundEnabled
                    ? "bg-white/[0.08] text-white border-white/[0.2]"
                    : "bg-[#111218] hover:bg-[#181922] text-zinc-400 hover:text-white border-white/[0.08]"
                }`}
                title={soundEnabled ? "Mute Stream Chime" : "Enable Sound Chime on New Events"}
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-[#111218] border border-white/[0.08] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-zinc-950"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title="Table View (Dense Grid)"
                >
                  <List size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-white text-zinc-950"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title="Card View (NOC Ticker)"
                >
                  <LayoutGrid size={13} />
                </button>
              </div>

              {/* Manual Refresh Button */}
              <button
                type="button"
                onClick={() => fetchPaginatedPageviews(pvPage, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange)}
                disabled={pvLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                title="Refresh Stream Now"
              >
                <RefreshCw size={12} className={pvLoading ? "animate-spin text-white" : "text-zinc-400"} />
                <span>Fetch Now</span>
              </button>

              {/* Polling Interval Select */}
              <div className="flex items-center gap-1.5 bg-[#111218] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs">
                <Clock size={12} className="text-zinc-500" />
                <select
                  value={refreshIntervalSec}
                  onChange={(e) => setRefreshIntervalSec(Number(e.target.value))}
                  aria-label="Stream refresh interval"
                  className="bg-transparent font-medium text-white text-xs focus:outline-none cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white"
                >
                  <option value={1}>1s (Ultra Live)</option>
                  <option value={2}>2s (Fast)</option>
                  <option value={5}>5s (Standard)</option>
                  <option value={10}>10s (Eco)</option>
                  <option value={30}>30s (Slow)</option>
                  <option value={0}>Manual Only</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer"
                title="Export current stream as CSV"
              >
                <FileSpreadsheet size={12} className="text-emerald-400" />
                <span>CSV</span>
              </button>

              {/* Export JSON Button */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer"
                title="Export current stream as JSON"
              >
                <FileJson size={12} className="text-zinc-400" />
                <span>JSON</span>
              </button>

              {/* Export NDJSON Button */}
              <button
                type="button"
                onClick={handleExportNDJSON}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer"
                title="Export current stream as NDJSON"
              >
                <Code2 size={12} className="text-zinc-400" />
                <span>NDJSON</span>
              </button>
            </div>
          </div>

          {/* Quick Segment Filter Ribbon */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-medium text-zinc-400 mr-1 flex items-center gap-1">
              <Filter size={11} /> Segment:
            </span>
            <button
              type="button"
              onClick={() => {
                setPvUserType("all");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "all", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "all"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              All Events
            </button>
            <button
              type="button"
              onClick={() => {
                setPvUserType("new");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "new", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "new"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              New Visitors (Visit #1)
            </button>
            <button
              type="button"
              onClick={() => {
                setPvUserType("returning");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "returning", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "returning"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              Returning Visitors
            </button>
            <button
              type="button"
              onClick={() => {
                setPvUserType("authenticated");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "authenticated", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "authenticated"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              Identified Accounts
            </button>
            <button
              type="button"
              onClick={() => {
                setPvUserType("anonymous");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "anonymous", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "anonymous"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              Guests / Anonymous
            </button>
            <button
              type="button"
              onClick={() => {
                setPvUserType("bounced");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "bounced", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "bounced"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              Bounced Sessions
            </button>
            <button
              type="button"
              onClick={() => {
                setPvUserType("bots");
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, "bots", pvQuery, pvSort, pvTimeRange);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentSegment === "bots"
                  ? "bg-white text-zinc-950"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              Bots &amp; AI Crawlers
            </button>
          </div>

          {/* Advanced Search & Filtering Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={pvQuery}
                onChange={(e) => {
                  setPvQuery(e.target.value);
                  setPvPage(1);
                }}
                placeholder="Search path, title, visitor ID, session, country, city, UTM..."
                className="w-full pl-9 pr-8 py-2 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition"
              />
              {pvQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setPvQuery("");
                    setPvPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs p-1 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Device Filter */}
            <div className="sm:col-span-2">
              <select
                value={pvDevice}
                onChange={(e) => {
                  setPvDevice(e.target.value);
                  setPvPage(1);
                }}
                aria-label="Filter by Device"
                className="w-full px-3 py-2 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white transition"
              >
                <option value="all">All Devices</option>
                <option value="desktop">Desktop Only</option>
                <option value="mobile">Mobile Only</option>
                <option value="tablet">Tablet Only</option>
              </select>
            </div>

            {/* Vitals Performance Filter */}
            <div className="sm:col-span-2">
              <select
                value={pvVitals || "all"}
                onChange={(e) => {
                  if (setPvVitals) setPvVitals(e.target.value);
                  setPvPage(1);
                }}
                aria-label="Filter by Web Vitals"
                className="w-full px-3 py-2 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white transition"
              >
                <option value="all">All Vitals</option>
                <option value="good">Good LCP (&le; 2.5s)</option>
                <option value="needs_improvement">Needs Work (2.5s–4s)</option>
                <option value="poor">Poor LCP (&gt; 4.0s)</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="sm:col-span-3">
              <select
                value={pvSort}
                onChange={(e) => {
                  setPvSort(e.target.value);
                  setPvPage(1);
                }}
                aria-label="Sort stream events"
                className="w-full px-3 py-2 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white transition"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
                <option value="duration_desc">Longest Dwell</option>
                <option value="active_desc">Most Active Time</option>
                <option value="scroll_desc">Deepest Scroll</option>
                <option value="lcp_desc">Slowest LCP Vitals</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── 3. Table Grid View Mode ── */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e0f15] border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-wider text-zinc-400 select-none">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">Timestamp</th>
                  <th className="p-3.5">Path &amp; Page Title</th>
                  <th className="p-3.5">Audience &amp; Visitor</th>
                  <th className="p-3.5 text-right">Dwell &amp; Active</th>
                  <th className="p-3.5 text-right">Scroll Depth</th>
                  <th className="p-3.5">Referrer &amp; Vitals</th>
                  <th className="p-3.5">Device &amp; Geo</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {pvLoading && paginatedPageviews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-zinc-400 text-xs">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-white" />
                        <span>Streaming real-time telemetry...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPageviews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-zinc-400">
                      <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] text-zinc-400 flex items-center justify-center mx-auto mb-2">
                        <Activity size={20} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">No Telemetry Events Recorded</h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                        No pageviews matched your query and filter parameters in this timeframe.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RefreshCw size={12} />
                        <span>Reset All Filters</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedPageviews.map((pv, idx) => {
                    const isBot = pv.visitorType === "search_bot" || pv.visitorType === "ai_crawler";
                    const isNewEvent = highlightNew && idx === 0 && Date.now() - new Date(pv.createdAt).getTime() < 15000;

                    return (
                      <tr
                        key={pv._id}
                        onClick={() => setSelectedPv(pv)}
                        className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                          isNewEvent ? "bg-emerald-500/[0.06]" : ""
                        }`}
                      >
                        {/* 1. Timestamp */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-mono font-semibold tabular-nums text-white flex items-center gap-1.5" suppressHydrationWarning>
                            <Clock size={11} className="text-zinc-400" />
                            <span suppressHydrationWarning>{formatExactTime(pv.createdAt)}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono tabular-nums flex items-center gap-1 mt-0.5" suppressHydrationWarning>
                            <span className="text-zinc-400 font-medium" suppressHydrationWarning>{timeAgo(pv.createdAt)}</span>
                            <span>&bull;</span>
                            <span suppressHydrationWarning>{formatExactDate(pv.createdAt)}</span>
                          </div>
                        </td>

                        {/* 2. Path & Page Title */}
                        <td className="p-3.5 max-w-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className="font-mono font-semibold text-white group-hover:text-emerald-400 transition-colors text-xs truncate max-w-sm"
                                title={pv.pathname}
                              >
                                {pv.pathname}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => handleCopy(pv._id + "_path", pv.pathname, e)}
                                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                title="Copy URL path"
                              >
                                {copiedId === pv._id + "_path" ? (
                                  <Check size={10} className="text-emerald-400" />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>

                              <a
                                href={getTrackedUrl(pv.pathname, activeProject)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                title="Open in new tab"
                              >
                                <ExternalLink size={10} />
                              </a>

                              {pv.labId && (
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08] text-[9px] font-mono font-medium">
                                  {pv.labId}
                                </span>
                              )}

                              {isBot && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-mono font-semibold inline-flex items-center gap-1">
                                  <Bot size={9} />
                                  <span>{pv.botName || "Bot"}</span>
                                </span>
                              )}
                            </div>

                            {pv.title && pv.title !== pv.pathname && (
                              <span className="text-[11px] text-zinc-400 block truncate max-w-md">
                                {pv.title}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Audience & Visitor */}
                        <td className="p-3.5 max-w-[200px]">
                          {pv.userId ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-white block truncate max-w-[140px]">
                                  {pv.userId.name || pv.userId.email}
                                </span>
                                {pv.isReturning || (pv.visitCount && pv.visitCount > 1) ? (
                                  <span
                                    className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold text-[9px] border border-blue-500/20 inline-flex items-center gap-1"
                                    title={`Returning visitor (${pv.visitCount ? `${pv.visitCount} visits` : "Multiple visits"})`}
                                  >
                                    <Repeat size={8} />
                                    <span>{pv.visitCount ? `#${pv.visitCount}` : "Return"}</span>
                                  </span>
                                ) : (
                                  <span
                                    className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[9px] border border-emerald-500/20 inline-flex items-center gap-1"
                                    title="First-time visitor"
                                  >
                                    <Sparkles size={8} />
                                    <span>New</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                                {pv.userId.username && <span>@{pv.userId.username}</span>}
                                {pv.userId.level && (
                                  <span className="bg-purple-500/10 text-purple-400 px-1 rounded text-[9px] font-semibold border border-purple-500/20">
                                    Lvl {pv.userId.level}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="font-mono text-[10px] text-zinc-400 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-[#181922] text-zinc-400 font-sans font-semibold text-[9px] uppercase tracking-wide border border-white/[0.08]">
                                  Guest
                                </span>
                                {pv.isReturning || (pv.visitCount && pv.visitCount > 1) ? (
                                  <span
                                    className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-sans font-semibold text-[9px] border border-blue-500/20 inline-flex items-center gap-1"
                                    title={`Returning guest (${pv.visitCount ? `${pv.visitCount} visits` : "Multiple visits"})`}
                                  >
                                    <Repeat size={8} />
                                    <span>{pv.visitCount ? `#${pv.visitCount}` : "Return"}</span>
                                  </span>
                                ) : (
                                  <span
                                    className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans font-semibold text-[9px] border border-emerald-500/20 inline-flex items-center gap-1"
                                    title="First-time guest"
                                  >
                                    <Sparkles size={8} />
                                    <span>New</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px]">
                                <button
                                  type="button"
                                  onClick={(e) => handleCopy(pv._id + "_vid", pv.visitorId, e)}
                                  className="hover:text-zinc-200 inline-flex items-center gap-1 text-zinc-500 transition-colors"
                                  title="Click to copy Visitor ID"
                                >
                                  <span className="truncate max-w-[85px]">vid:{pv.visitorId.slice(0, 8)}…</span>
                                  {copiedId === pv._id + "_vid" ? (
                                    <Check size={9} className="text-emerald-400" />
                                  ) : (
                                    <Copy size={9} className="opacity-60" />
                                  )}
                                </button>
                                {pv.sessionId && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopy(pv._id + "_sid", pv.sessionId, e)}
                                    className="hover:text-zinc-200 inline-flex items-center gap-1 text-zinc-500/80 transition-colors"
                                    title="Click to copy Session ID"
                                  >
                                    <span className="truncate max-w-[65px]">sid:{pv.sessionId.slice(0, 6)}…</span>
                                    {copiedId === pv._id + "_sid" ? (
                                      <Check size={9} className="text-emerald-400" />
                                    ) : (
                                      <Copy size={9} className="opacity-50" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 4. Dwell & Active */}
                        <td className="p-3.5 text-right font-mono whitespace-nowrap">
                          <div className="font-semibold tabular-nums text-emerald-400">
                            {formatDuration(pv.duration)}
                          </div>
                          {pv.activeDuration !== undefined && (
                            <div className="text-[10px] text-zinc-500 flex items-center justify-end gap-1 font-mono tabular-nums mt-0.5">
                              <span className="text-emerald-400/90 font-medium">{pv.activeDuration}s act</span>
                              {pv.idleDuration ? <span>&bull; {pv.idleDuration}s idl</span> : null}
                            </div>
                          )}
                          {pv.isBounce && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[9px] font-semibold border border-rose-500/20">
                              Bounced
                            </span>
                          )}
                        </td>

                        {/* 5. Scroll Depth */}
                        <td className="p-3.5 text-right font-mono text-zinc-400 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs font-semibold tabular-nums text-white">{pv.scrollDepth}%</span>
                            <div className="w-12 h-1.5 rounded-full bg-[#181922] border border-white/[0.06] overflow-hidden">
                              <div
                                className="h-full bg-white rounded-full"
                                style={{ width: `${Math.min(100, pv.scrollDepth)}%` }}
                              />
                            </div>
                          </div>
                          {pv.exitIntent && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-semibold border border-amber-500/20">
                              Exit Intent
                            </span>
                          )}
                        </td>

                        {/* 6. Referrer & Web Vitals */}
                        <td className="p-3.5 max-w-[180px]">
                          <span className="font-mono text-[11px] font-semibold text-white block truncate">
                            {pv.referrerDomain || "Direct"}
                          </span>
                          {pv.utmSource && (
                            <span className="text-[10px] text-zinc-400 font-mono block truncate">
                              utm: {pv.utmSource}
                              {pv.utmCampaign ? ` / ${pv.utmCampaign}` : ""}
                            </span>
                          )}
                          {pv.webVitals?.lcp && (
                            <div className="mt-1 flex items-center gap-1">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border tabular-nums ${
                                  pv.webVitals.lcp <= 2500
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : pv.webVitals.lcp <= 4000
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                }`}
                              >
                                LCP: {pv.webVitals.lcp}ms
                              </span>
                              {pv.webVitals.inp && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#181922] text-zinc-300 border border-white/[0.08] tabular-nums">
                                  INP: {pv.webVitals.inp}ms
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 7. Device & Geo */}
                        <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-zinc-400">
                          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
                            {pv.device === "mobile" ? (
                              <Smartphone size={12} className="text-amber-400 shrink-0" />
                            ) : pv.device === "tablet" ? (
                              <Tablet size={12} className="text-blue-400 shrink-0" />
                            ) : (
                              <Laptop size={12} className="text-emerald-400 shrink-0" />
                            )}
                            <span>{pv.browser}</span>
                            <span>&bull;</span>
                            <span>{pv.os}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                            <Globe size={10} className="text-zinc-500 shrink-0" />
                            <span>{getFullCountryName(pv.country)}</span>
                            {pv.city && <span>({pv.city})</span>}
                          </div>
                          {pv.network?.effectiveType && (
                            <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 mt-0.5">
                              <span
                                className={`px-1 py-0.5 rounded uppercase font-semibold border ${
                                  pv.network.effectiveType === "5g" || pv.network.is5G
                                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                    : "bg-[#181922] text-zinc-300 border-white/[0.08]"
                                }`}
                              >
                                {pv.network.is5G ? "5G" : pv.network.effectiveType}
                              </span>
                              {pv.network.downlink ? (
                                <span className="text-[9px] text-zinc-500 tabular-nums">
                                  &bull; {pv.network.downlink}Mbps
                                </span>
                              ) : null}
                            </div>
                          )}
                        </td>

                        {/* 8. Inspect Action */}
                        <td
                          className="p-3.5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedPv(pv)}
                            className="px-2.5 py-1 rounded-lg bg-[#181922] hover:bg-white/[0.08] border border-white/[0.08] text-white font-medium text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight size={11} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── 4. Card / NOC Ticker View Mode ── */
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {paginatedPageviews.length === 0 ? (
              <div className="col-span-full p-16 text-center text-zinc-400">
                <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] text-zinc-400 flex items-center justify-center mx-auto mb-2">
                  <Activity size={20} />
                </div>
                <h4 className="text-sm font-semibold text-white">No Telemetry Events Recorded</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  No pageviews matched your query and filter parameters.
                </p>
              </div>
            ) : (
              paginatedPageviews.map((pv) => (
                <div
                  key={pv._id}
                  onClick={() => setSelectedPv(pv)}
                  className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs hover:border-white/[0.18] transition-colors cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium tabular-nums text-zinc-300" suppressHydrationWarning>
                      <Clock size={12} className="text-zinc-500" />
                      <span suppressHydrationWarning>{timeAgo(pv.createdAt)}</span>
                      <span className="text-zinc-500 text-[10px]" suppressHydrationWarning>({formatExactTime(pv.createdAt)})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-semibold font-mono border ${
                        pv.isBounce
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {pv.isBounce ? "Bounce" : "Multi-Hit"}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors block truncate">
                      {pv.pathname}
                    </span>
                    {pv.title && pv.title !== pv.pathname && (
                      <span className="text-xs text-zinc-400 block truncate mt-0.5">
                        {pv.title}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/[0.06]">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 block uppercase font-medium">Dwell</span>
                      <span className="font-semibold tabular-nums text-emerald-400">
                        {formatDuration(pv.duration)}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 block uppercase font-medium">Scroll</span>
                      <span className="font-semibold tabular-nums text-white">{pv.scrollDepth}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Globe size={11} className="text-zinc-500 shrink-0" />
                      <span>{getFullCountryName(pv.country)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {pv.device === "mobile" ? (
                        <Smartphone size={11} className="text-amber-400" />
                      ) : (
                        <Laptop size={11} className="text-emerald-400" />
                      )}
                      <span>{pv.browser}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── 5. Table Footer Navigation & Pagination ── */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="font-mono">
              Showing{" "}
              <strong className="text-white font-semibold tabular-nums">
                {pvPagination.total === 0 ? 0 : (pvPage - 1) * pvLimit + 1}–
                {Math.min(pvPage * pvLimit, pvPagination.total)}
              </strong>{" "}
              of <strong className="text-white font-semibold tabular-nums">{pvPagination.total.toLocaleString()}</strong> events
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08]">
              <span className="text-[11px] text-zinc-400">Per page:</span>
              <select
                value={pvLimit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setPvLimit(newLimit);
                  setPvPage(1);
                  fetchPaginatedPageviews(1, newLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
                }}
                aria-label="Events per page"
                className="px-2 py-1 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setPvPage(1);
                fetchPaginatedPageviews(1, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
              }}
              disabled={pvPage <= 1 || pvLoading}
              className="p-1.5 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft size={13} />
            </button>

            <button
              type="button"
              onClick={() => {
                const prev = Math.max(1, pvPage - 1);
                setPvPage(prev);
                fetchPaginatedPageviews(prev, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
              }}
              disabled={!pvPagination.hasPrevPage || pvLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111218] border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft size={13} />
              <span>Prev</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 font-mono">
              {getPageNumbers().map((num, idx) =>
                typeof num === "number" ? (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPvPage(num);
                      fetchPaginatedPageviews(num, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                      pvPage === num
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "bg-[#111218] border border-white/[0.08] hover:bg-white/[0.06] text-zinc-300 hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ) : (
                  <span key={idx} className="px-1 text-zinc-500 text-xs font-medium">
                    …
                  </span>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                const next = Math.min(pvPagination.totalPages, pvPage + 1);
                setPvPage(next);
                fetchPaginatedPageviews(next, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
              }}
              disabled={!pvPagination.hasNextPage || pvLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111218] border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>

            <button
              type="button"
              onClick={() => {
                setPvPage(pvPagination.totalPages);
                fetchPaginatedPageviews(pvPagination.totalPages, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
              }}
              disabled={pvPage >= pvPagination.totalPages || pvLoading}
              className="p-1.5 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight size={13} />
            </button>

            {/* Jump to Page Form */}
            <form onSubmit={handleJumpPage} className="flex items-center gap-1 ml-2">
              <input
                type="number"
                min={1}
                max={pvPagination.totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder="Go"
                className="w-12 px-2 py-1 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── 6. Deep Telemetry Event Audit Inspector Modal ── */}
      {selectedPv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setSelectedPv(null)} />
          <div className="relative z-10 w-full max-w-3xl bg-[#111218] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#0e0f15]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Terminal size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold font-mono text-white truncate max-w-md">
                      {selectedPv.pathname}
                    </h3>
                    <span suppressHydrationWarning className="px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 font-mono text-[10px] font-medium border border-white/[0.08] tabular-nums">
                      {formatExactTime(selectedPv.createdAt)}
                    </span>
                  </div>
                  {selectedPv.title && selectedPv.title !== selectedPv.pathname && (
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{selectedPv.title}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPv(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Diagnostic Tabs */}
            <div className="flex items-center gap-1 px-5 pt-2 border-b border-white/[0.08] bg-[#0e0f15] overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalTab("overview")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  modalTab === "overview"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setModalTab("identity")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  modalTab === "identity"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Audience &amp; Identity
              </button>
              <button
                type="button"
                onClick={() => setModalTab("traffic")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  modalTab === "traffic"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Attribution &amp; UTM
              </button>
              <button
                type="button"
                onClick={() => setModalTab("hardware")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  modalTab === "hardware"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Hardware &amp; Network
              </button>
              <button
                type="button"
                onClick={() => setModalTab("vitals")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  modalTab === "vitals"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Web Vitals RUM
              </button>
              <button
                type="button"
                onClick={() => setModalTab("json")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  modalTab === "json"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Raw JSON
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-[#111218]">
              {/* Tab 1: Overview */}
              {modalTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 block">
                        Dwell Duration
                      </span>
                      <span className="text-lg font-semibold font-mono tabular-nums text-emerald-400">
                        {formatDuration(selectedPv.duration)}
                      </span>
                    </div>
                    <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 block">
                        Active vs Idle
                      </span>
                      <span className="text-sm font-semibold font-mono tabular-nums text-white">
                        {selectedPv.activeDuration || 0}s / {selectedPv.idleDuration || 0}s
                      </span>
                    </div>
                    <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 block">
                        Scroll Depth
                      </span>
                      <span className="text-lg font-semibold font-mono tabular-nums text-white">
                        {selectedPv.scrollDepth}%
                      </span>
                    </div>
                    <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 block">
                        Session Status
                      </span>
                      <span
                        className={`text-xs font-semibold font-mono px-2 py-0.5 rounded inline-block ${
                          selectedPv.isBounce
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {selectedPv.isBounce ? "Bounced" : "Multi-Hit"}
                      </span>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                      <span className="text-zinc-400">Pathname:</span>
                      <span className="font-semibold text-white truncate max-w-sm">{selectedPv.pathname}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                      <span className="text-zinc-400">Timestamp:</span>
                      <span className="font-semibold tabular-nums text-white">{selectedPv.createdAt}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                      <span className="text-zinc-400">Origin / Referrer:</span>
                      <span className="font-semibold text-white">{selectedPv.referrerDomain || "Direct"}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                      <span className="text-zinc-400">Geo Location:</span>
                      <span className="font-semibold text-white">
                        {getFullCountryName(selectedPv.country)} {selectedPv.city ? `(${selectedPv.city})` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Identity */}
              {modalTab === "identity" && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Users size={13} className="text-zinc-300" />
                      <span>Visitor &amp; Session Identifiers</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400 text-[11px]">Visitor ID (vid):</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("m_vid", selectedPv.visitorId)}
                          className="font-semibold text-white hover:text-zinc-300 transition-colors flex items-center gap-1.5"
                        >
                          <span>{selectedPv.visitorId}</span>
                          {copiedId === "m_vid" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400 text-[11px]">Session ID (sid):</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("m_sid", selectedPv.sessionId)}
                          className="font-semibold text-white hover:text-zinc-300 transition-colors flex items-center gap-1.5"
                        >
                          <span>{selectedPv.sessionId}</span>
                          {copiedId === "m_sid" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400 text-[11px]">Visit Tier:</span>
                        <span className="font-semibold text-white">
                          {selectedPv.isReturning
                            ? `Returning Visitor (Visit #${selectedPv.visitCount || 2})`
                            : "First-Time Visitor (Visit #1)"}
                        </span>
                      </div>
                      {selectedPv.userId && (
                        <div className="p-3 rounded-lg bg-[#111218] border border-white/[0.06] space-y-1.5">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 block">
                            Identified User Profile
                          </span>
                          <div className="text-sm font-semibold text-white">
                            {selectedPv.userId.name || "Anonymous User"}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono">
                            {selectedPv.userId.email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Traffic & Attribution */}
              {modalTab === "traffic" && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Compass size={13} className="text-zinc-300" />
                      <span>Referrer &amp; Marketing Attribution</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Referrer Domain:</span>
                        <span className="font-semibold text-white">{selectedPv.referrerDomain || "Direct"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Search Engine:</span>
                        <span className="font-semibold text-white">{selectedPv.searchEngine || "None"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">AI Referrer:</span>
                        <span className="font-semibold text-white">{selectedPv.aiReferrer || "None"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">UTM Source:</span>
                        <span className="font-semibold text-white">{selectedPv.utmSource || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">UTM Medium:</span>
                        <span className="font-semibold text-white">{selectedPv.utmMedium || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">UTM Campaign:</span>
                        <span className="font-semibold text-white">{selectedPv.utmCampaign || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Hardware & Network */}
              {modalTab === "hardware" && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Cpu size={13} className="text-zinc-300" />
                      <span>Hardware, Device &amp; RUM Telemetry</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Device:</span>
                        <span className="font-semibold text-white uppercase">{selectedPv.device}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Browser:</span>
                        <span className="font-semibold text-white">{selectedPv.browser}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Operating System:</span>
                        <span className="font-semibold text-white">{selectedPv.os}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Screen Resolution:</span>
                        <span className="font-semibold text-white">{selectedPv.screen || "Standard"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">Network Type:</span>
                        <span className="font-semibold text-white">
                          {selectedPv.network?.effectiveType?.toUpperCase() || "Standard"}{" "}
                          {selectedPv.network?.downlink ? `(${selectedPv.network.downlink} Mbps)` : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111218] border border-white/[0.06]">
                        <span className="text-zinc-400">GPU Renderer:</span>
                        <span className="font-semibold text-white truncate max-w-[140px]" title={selectedPv.hardware?.gpu || "Default"}>
                          {selectedPv.hardware?.gpu || "Default"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Web Vitals RUM */}
              {modalTab === "vitals" && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Gauge size={13} className="text-zinc-300" />
                      <span>Core Web Vitals Real-Time Measurements</span>
                    </h4>
                    {selectedPv.webVitals ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        <div className="p-3 rounded-lg bg-[#111218] border border-white/[0.06] text-center space-y-1">
                          <span className="text-[10px] text-zinc-500 block font-semibold">LCP</span>
                          <span className="text-base font-semibold tabular-nums text-white">
                            {selectedPv.webVitals.lcp ? `${selectedPv.webVitals.lcp}ms` : "-"}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#111218] border border-white/[0.06] text-center space-y-1">
                          <span className="text-[10px] text-zinc-500 block font-semibold">INP</span>
                          <span className="text-base font-semibold tabular-nums text-white">
                            {selectedPv.webVitals.inp ? `${selectedPv.webVitals.inp}ms` : "-"}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#111218] border border-white/[0.06] text-center space-y-1">
                          <span className="text-[10px] text-zinc-500 block font-semibold">CLS</span>
                          <span className="text-base font-semibold tabular-nums text-white">
                            {selectedPv.webVitals.cls !== undefined && selectedPv.webVitals.cls !== null ? selectedPv.webVitals.cls : "-"}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#111218] border border-white/[0.06] text-center space-y-1">
                          <span className="text-[10px] text-zinc-500 block font-semibold">FCP</span>
                          <span className="text-base font-semibold tabular-nums text-white">
                            {selectedPv.webVitals.fcp ? `${selectedPv.webVitals.fcp}ms` : "-"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-zinc-400">
                        No Core Web Vitals reported for this event.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 6: Raw JSON */}
              {modalTab === "json" && (
                <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <FileJson size={13} className="text-zinc-300" />
                      <span>Full Telemetry JSON Payload</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyJson(JSON.stringify(selectedPv, null, 2))}
                      className="px-2 py-1 rounded-lg bg-[#111218] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      {jsonCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{jsonCopied ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#090a0f] border border-white/[0.08] rounded-lg text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-60">
                    {JSON.stringify(selectedPv, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex items-center justify-between gap-2">
              <a
                href={getTrackedUrl(selectedPv.pathname, activeProject)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181922] hover:bg-white/[0.08] border border-white/[0.08] text-white text-xs font-semibold transition-colors"
              >
                <span>Open Target URL</span>
                <ExternalLink size={11} />
              </a>

              <button
                type="button"
                onClick={() => setSelectedPv(null)}
                className="px-4 py-1.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

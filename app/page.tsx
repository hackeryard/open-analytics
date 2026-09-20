"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Radio,
  UserCheck,
  Search,
  Globe,
  Bot,
  Flame,
  Share2,
  Layers,
  Compass,
  Sliders,
  Zap,
  Bug,
  BookOpen,
  Code2,
  ArrowRight,
  TrendingUp,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  Plus,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Send,
  RefreshCw,
  Gauge,
  Users,
  Repeat,
  Shield,
  FileCode2,
} from "lucide-react";
import PlatformHeader from "@/components/PlatformHeader";
import { usePlatform } from "@/components/PlatformContext";
import { formatDuration } from "@/lib/analyticsTypes";
import PrimaryAnalyticsChart from "@/components/PrimaryAnalyticsChart";
import TopPagesWidget from "@/components/dashboard/TopPagesWidget";
import TrafficChannelsWidget from "@/components/dashboard/TrafficChannelsWidget";
import LiveStreamWidget from "@/components/dashboard/LiveStreamWidget";
import GeoWidget from "@/components/dashboard/GeoWidget";
import WebVitalsRadarWidget from "@/components/dashboard/WebVitalsRadarWidget";
import DeviceBreakdownWidget from "@/components/dashboard/DeviceBreakdownWidget";
import AiAndErrorWidget from "@/components/dashboard/AiAndErrorWidget";
import LandingHero from "@/components/public/LandingHero";

export default function ExecutiveOverviewDashboard() {
  const {
    currentUser,
    authChecked,
    projects,
    projectsLoading,
    activeProjectId,
    data,
    loading,
    error,
    timeRange,
    paginatedPageviews,
    liveVisitorCount,
    openCreateProject,
    fetchData,
    fetchPaginatedPageviews,
    isDashboard,
  } = usePlatform();

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [testSignalSending, setTestSignalSending] = useState(false);
  const [testSignalSuccess, setTestSignalSuccess] = useState(false);

  const scriptTag = `<script defer src="https://openanalytics.org.in/open.js" data-project-id="${activeProjectId || "prj_openlabs"}"></script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleSendTestSignal = async () => {
    if (!activeProjectId) return;
    setTestSignalSending(true);
    try {
      const res = await fetch("/api/v1/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          type: "pageview",
          pathname: "/test-telemetry-ping",
          title: "Test Ingestion Diagnostic Signal",
          visitorId: "v_test_" + Math.random().toString(36).slice(2, 8),
          sessionId: "s_test_" + Math.random().toString(36).slice(2, 8),
          referrer: "https://openanalytics.org.in/docs",
          device: "desktop",
          browser: "Chrome",
          os: "Windows",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        }),
      });
      if (res.ok) {
        setTestSignalSuccess(true);
        setTimeout(() => setTestSignalSuccess(false), 3000);
        // Refresh live feed and dashboard
        fetchData();
        fetchPaginatedPageviews();
      }
    } catch (e) {
      console.error("Test signal error:", e);
    } finally {
      setTestSignalSending(false);
    }
  };

  // 1. If accessing on the main marketing domain, strictly serve the public SEO landing page
  if (!isDashboard) {
    return <LandingHero />;
  }

  // 2. If on dashboard subdomain but not authenticated, display redirect state
  if (authChecked && !currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <div className="text-xs text-slate-400">Redirecting to login...</div>
      </div>
    );
  }

  // 3. Shimmer Skeleton state while projects or analytical telemetry are loading from DB
  if (projectsLoading || (!authChecked && !currentUser) || (loading && !data && projects.length > 0)) {
    return (
      <div className="space-y-6 pb-16 animate-fadeIn">
        {/* Header Shimmer */}
        <div className="mb-5 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="h-7 w-64 sm:w-80 rounded-lg bg-white/[0.05] shimmer" />
            <div className="h-4 w-48 sm:w-96 rounded-lg bg-white/[0.03] shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-32 rounded-lg bg-white/[0.04] shimmer" />
            <div className="h-8 w-24 rounded-lg bg-white/[0.04] shimmer" />
          </div>
        </div>

        {/* Primary 4 KPI Shimmer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 rounded bg-white/[0.06] shimmer" />
                <div className="h-4 w-4 rounded bg-white/[0.06] shimmer" />
              </div>
              <div className="h-8 w-28 rounded bg-white/[0.08] shimmer" />
              <div className="h-3 w-36 rounded bg-white/[0.04] shimmer" />
            </div>
          ))}
        </div>

        {/* Secondary 3 KPI Shimmer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 rounded bg-white/[0.06] shimmer" />
                <div className="h-4 w-4 rounded bg-white/[0.06] shimmer" />
              </div>
              <div className="h-8 w-28 rounded bg-white/[0.08] shimmer" />
              <div className="h-3 w-36 rounded bg-white/[0.04] shimmer" />
            </div>
          ))}
        </div>

        {/* Primary Chart Shimmer */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 w-56 rounded bg-white/[0.06] shimmer" />
              <div className="h-3.5 w-72 rounded bg-white/[0.03] shimmer" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-44 rounded-lg bg-white/[0.05] shimmer" />
              <div className="h-8 w-20 rounded-lg bg-white/[0.05] shimmer" />
            </div>
          </div>
          <div className="h-72 w-full rounded-lg bg-white/[0.02] border border-white/[0.04] shimmer flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
              <span>Streaming analytical telemetry...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Only display "Create First Project" when projects have finished loading from DB and confirmed empty
  if (!projectsLoading && projects.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111218] border border-white/[0.08] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] text-white flex items-center justify-center mx-auto">
            <Plus size={24} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white tracking-tight">Welcome to Open Analytics</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You don&apos;t have any projects in your workspace yet. Create your first project to begin tracking live web traffic and Real User Monitoring telemetry.
            </p>
          </div>
          <button
            onClick={() => openCreateProject()}
            className="w-full py-2.5 px-4 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs rounded-lg transition cursor-pointer"
          >
            + Create First Project
          </button>
        </div>
      </div>
    );
  }

  const overview = data?.overview || {
    totalViews: 0,
    uniqueVisitors: 0,
    uniqueSessions: 0,
    avgDuration: 0,
    returnRate: 0,
  };

  return (
    <div className="space-y-6 pb-16">
      <PlatformHeader
        title="Executive Web Analytics & Observability"
        subtitle="Real-time multi-project telemetry, Real User Monitoring (RUM), search attribution, and automated crash triage"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Real-time Live Visitors Pill */}
          <Link
            href="/live-feed"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium font-mono transition hover:bg-emerald-500/15"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{liveVisitorCount} Active Visitors</span>
          </Link>

          {/* Direct Live Stream Link */}
          <Link
            href="/live-feed"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition"
          >
            <Radio size={13} className="text-zinc-400" />
            <span>Live Feed</span>
          </Link>

          {/* Quick SDK Installation Link */}
          <Link
            href={`/projects/${activeProjectId || "prj_openlabs"}/install`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium transition"
          >
            <Code2 size={13} />
            <span>Install SDK</span>
          </Link>
        </div>
      </PlatformHeader>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <span className="text-[11px] text-zinc-400">Database reconnecting in background</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. PRIMARY EXECUTIVE KPI STAT CARDS (4-COL HERO ROW)         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pageviews */}
        <Link
          href="/live-feed"
          className="p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-2 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Total Pageviews
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition">
              <Layers size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums">
            {overview.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>All inbound hits</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
              Feed <ArrowRight size={11} />
            </span>
          </div>
        </Link>

        {/* Unique Visitors */}
        <Link
          href="/acquisition"
          className="p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-2 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Unique Visitors
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition">
              <Users size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums">
            {overview.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Identified clients</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
              Sources <ArrowRight size={11} />
            </span>
          </div>
        </Link>

        {/* Realtime Live Active Visitors */}
        <Link
          href="/live-feed"
          className="p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-2 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Live Visitors
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Radio size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums flex items-baseline gap-2">
            <span>{liveVisitorCount.toLocaleString()}</span>
            <span className="text-xs font-normal text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Past 5-min window</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
              Stream <ArrowRight size={11} />
            </span>
          </div>
        </Link>

        {/* Average Dwell Time */}
        <Link
          href="/engagement"
          className="p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-2 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Average Dwell Time
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition">
              <Clock size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums">
            {formatDuration(overview.avgDuration || 0)}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Active session duration</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
              Dwell <ArrowRight size={11} />
            </span>
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 2. SECONDARY TELEMETRY & HEALTH CARDS (3-COL ROW)            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Returning Users Rate */}
        <Link
          href="/audience"
          className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-1.5 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Audience Loyalty
            </span>
            <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Repeat size={13} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold tracking-tight text-white tabular-nums">
            {data?.retention?.returnRate ?? overview.returnRate ?? 0}%
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Returning visitor cohort</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Audience &rarr;
            </span>
          </div>
        </Link>

        {/* Core Web Vitals RUM */}
        <Link
          href="/vitals"
          className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-1.5 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Core Web Vitals (LCP)
            </span>
            <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Activity size={13} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold tracking-tight text-white tabular-nums">
            {data?.webVitals?.overall?.lcp ? `${(data.webVitals.overall.lcp / 1000).toFixed(2)}s` : "—"}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{data?.webVitals?.overall?.lcp ? "Real User Monitoring (RUM)" : "No vitals data yet"}</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Vitals &rarr;
            </span>
          </div>
        </Link>

        {/* Crash Free Sessions */}
        <Link
          href="/errors"
          className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] rounded-xl space-y-1.5 group block transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Crash-Free Rate
            </span>
            <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <ShieldCheck size={13} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold tracking-tight text-white tabular-nums">
            {overview.totalViews > 0
              ? `${Math.max(0, Math.min(100, Math.round(((overview.totalViews - (data?.errorStats?.totalErrors || 0)) / overview.totalViews) * 1000) / 10))}%`
              : "100%"}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{data?.errorStats?.totalErrors || 0} exceptions logged</span>
            <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Triage &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 3. PRIMARY INTERACTIVE TIME-SERIES VISUALIZATION             */}
      {/* ============================================================ */}
      <PrimaryAnalyticsChart
        timeseries={data?.timeseries || []}
        timeRange={timeRange}
      />

      {/* ============================================================ */}
      {/* 4. DUAL-COLUMN ANALYTICAL INTELLIGENCE GRID                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Pages & Routes */}
        <TopPagesWidget
          pages={data?.topPages}
          totalViews={overview.totalViews}
        />

        {/* Traffic Channels & Referrers */}
        <TrafficChannelsWidget
          referrers={data?.topReferrers}
          totalViews={overview.totalViews}
        />
      </div>

      {/* ============================================================ */}
      {/* 5. REAL-TIME TELEMETRY & GEO WORLD ATLAS                     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Event Stream Snapshot */}
        <LiveStreamWidget
          pageviews={paginatedPageviews}
          liveVisitors={liveVisitorCount}
        />

        {/* Geographic Distribution */}
        <GeoWidget
          countries={data?.countries}
          uniqueVisitors={overview.uniqueVisitors}
        />
      </div>

      {/* ============================================================ */}
      {/* 6. CORE WEB VITALS RUM & DEVICE BREAKDOWN                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WebVitalsRadarWidget webVitals={data?.webVitals} />
        <DeviceBreakdownWidget
          devices={data?.devices}
          browsers={data?.browsers}
        />
      </div>

      {/* ============================================================ */}
      {/* 7. AI RADAR & CRASH TRIAGE                                   */}
      {/* ============================================================ */}
      <AiAndErrorWidget
        aiVisibility={data?.aiVisibility}
        errorStats={data?.errorStats}
        recentErrors={data?.recentErrors}
      />

      {/* ============================================================ */}
      {/* 8. QUICK SETUP, INGESTION DIAGNOSTIC & SDK DECK              */}
      {/* ============================================================ */}
      <div className="bg-[#111218] rounded-xl p-5 sm:p-7 border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0">
              <Code2 size={16} />
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-white">Embed Telemetry in Your App in 30 Seconds</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Copy the lightweight (&lt; 3.2 KB), cookieless tracking snippet into your HTML &lt;head&gt; or Next.js layout to stream real-time events, Core Web Vitals, and autonomous error triage.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap w-full lg:w-auto">
          {/* Send Test Event Button */}
          <button
            onClick={handleSendTestSignal}
            disabled={testSignalSending}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            title="Send a sample telemetry event to verify pipeline"
          >
            {testSignalSending ? (
              <RefreshCw size={13} className="animate-spin text-zinc-300" />
            ) : testSignalSuccess ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Send size={13} className="text-zinc-300" />
            )}
            <span>{testSignalSuccess ? "Ingested!" : "Test Signal"}</span>
          </button>

          {/* Copy Script Tag Button */}
          <button
            onClick={copyScript}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2"
          >
            {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedSnippet ? "Copied" : "Copy Snippet"}</span>
          </button>

          {/* SDK Documentation Link */}
          <Link
            href={`/projects/${activeProjectId || "prj_openlabs"}/install`}
            className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition"
          >
            SDK Guides &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

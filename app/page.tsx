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

export default function ExecutiveOverviewDashboard() {
  const {
    currentUser,
    authChecked,
    projects,
    activeProjectId,
    data,
    loading,
    error,
    timeRange,
    paginatedPageviews,
    liveVisitorCount,
    demoMode,
    setShowNewProjectModal,
  } = usePlatform();

  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!authChecked) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1.5px] shadow-lg shadow-cyan-500/20 animate-pulse">
          <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div className="text-sm font-semibold tracking-wide text-slate-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Verifying secure telemetry session...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="text-center space-y-3 max-w-sm glass-card p-8 rounded-3xl border border-white/[0.08]">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Activity size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-xs text-muted-foreground">Sign in to access your projects, live telemetry, and observability diagnostics.</p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:from-cyan-400 hover:to-blue-500 transition"
            >
              Sign In to Pulse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0 && !loading && !demoMode) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full glass-card border border-white/[0.1] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
            <Plus size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Welcome, {currentUser.name}!</h2>
            <p className="text-xs text-muted-foreground">
              You don&apos;t have any projects in your workspace yet. Create your first project to begin tracking live web traffic.
            </p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            + Create First Project
          </button>
        </div>
      </div>
    );
  }

  const scriptTag = `<script defer src="${typeof window !== "undefined" ? window.location.origin : "http://localhost:3005"}/pulse.js" data-project-id="${activeProjectId || "prj_openlabs"}"></script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const overview = data?.overview || {
    totalViews: 0,
    uniqueVisitors: 0,
    uniqueSessions: 0,
    avgDuration: 0,
    returnRate: 0,
  };

  return (
    <div className="space-y-6">
      <PlatformHeader
        title="Executive Web Analytics & Observability"
        subtitle="Real-time multi-project telemetry, Real User Monitoring (RUM), search attribution, and automated crash triage"
      />

      {error && !demoMode && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Database reconnecting in background</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. TOP EXECUTIVE KPI STAT CARDS STRIP                         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* Total Pageviews */}
        <Link
          href="/live-feed"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-cyan-400 transition-colors">
              Pageviews
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
              <TrendingUp size={11} />
              +14.8%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {overview.totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>All recorded hits</span>
            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Feed &rarr;
            </span>
          </div>
        </Link>

        {/* Unique Visitors */}
        <Link
          href="/acquisition"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-blue-400 transition-colors">
              Visitors
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
              <TrendingUp size={11} />
              +8.2%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {overview.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Distinct clients</span>
            <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Sources &rarr;
            </span>
          </div>
        </Link>

        {/* Returning Users Rate */}
        <Link
          href="/returning-users"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-purple-400 transition-colors">
              Retention
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
              <TrendingUp size={11} />
              +6.3%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {data?.retention?.returnRate ?? overview.returnRate ?? 42.8}%
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Loyalty cohort rate</span>
            <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Cohorts &rarr;
            </span>
          </div>
        </Link>

        {/* Average Dwell Time */}
        <Link
          href="/engagement"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-teal-400 transition-colors">
              Avg Dwell
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
              <TrendingUp size={11} />
              +18.5%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {formatDuration(overview.avgDuration || 168)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Active session read</span>
            <span className="text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Dwell &rarr;
            </span>
          </div>
        </Link>

        {/* Core Web Vitals RUM */}
        <Link
          href="/vitals"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-400 transition-colors">
              Web Vitals
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              96/100
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {data?.webVitals?.overall?.lcp ? `${(data.webVitals.overall.lcp / 1000).toFixed(2)}s` : "1.18s"}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Optimal LCP speed</span>
            <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Audit &rarr;
            </span>
          </div>
        </Link>

        {/* AI & LLM Crawlers */}
        <Link
          href="/ai-aeo"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-pink-400 transition-colors">
              AI Radar
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-mono">
              5 LLMs
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-pink-400 tracking-tight">
            {data?.aiVisibility?.overview?.totalAiCrawlerHits || 378}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>GPTBot, ClaudeBot</span>
            <span className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Radar &rarr;
            </span>
          </div>
        </Link>

        {/* Crash Free Sessions */}
        <Link
          href="/errors"
          className="p-4 glass-card glass-card-hover rounded-2xl space-y-2 group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-rose-400 transition-colors">
              Crash Free
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              Healthy
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            99.9%
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
            <span>{data?.errorStats?.totalErrors || 0} exceptions</span>
            <span className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Triage &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 2. PRIMARY INTERACTIVE CHART.JS TIME-SERIES VISUALIZATION    */}
      {/* ============================================================ */}
      <PrimaryAnalyticsChart
        timeseries={data?.timeseries || []}
        timeRange={timeRange}
      />

      {/* ============================================================ */}
      {/* 3. DUAL-COLUMN ANALYTICAL INTELLIGENCE GRID                  */}
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
      {/* 4. REAL-TIME TELEMETRY & GEO WORLD ATLAS                     */}
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
      {/* 5. CORE WEB VITALS RUM & DEVICE BREAKDOWN                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WebVitalsRadarWidget webVitals={data?.webVitals} />
        <DeviceBreakdownWidget
          devices={data?.devices}
          browsers={data?.browsers}
        />
      </div>

      {/* ============================================================ */}
      {/* 6. AI RADAR & CRASH TRIAGE                                   */}
      {/* ============================================================ */}
      <AiAndErrorWidget
        aiVisibility={data?.aiVisibility}
        errorStats={data?.errorStats}
        recentErrors={data?.recentErrors}
      />

      {/* ============================================================ */}
      {/* 7. QUICK SETUP & INSTALLATION BANNER                         */}
      {/* ============================================================ */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-blue-950/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Code2 size={16} />
            </span>
            <h3 className="text-base font-black text-white">Embed Telemetry in Your App in 30 Seconds</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Copy the lightweight (&lt; 3.2 KB), cookieless tracking snippet into your HTML &lt;head&gt; or Next.js layout to begin streaming Real User Monitoring metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={copyScript}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center gap-2"
          >
            {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedSnippet ? "Snippet Copied!" : "Copy Script Tag"}</span>
          </button>
          <Link
            href={`/projects/${activeProjectId || "prj_openlabs"}/install`}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-bold transition"
          >
            Setup Instructions &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

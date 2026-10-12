"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  Bug,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Flame,
  Gauge,
  Globe,
  Laptop,
  Layers,
  MousePointerClick,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

type DemoViewTab = "pulse" | "vitals" | "airadar" | "behavior" | "errors" | "geo";

interface SimulatedLiveEvent {
  id: string;
  type: "pageview" | "custom_event" | "vital" | "crawler" | "error";
  path: string;
  source: string;
  country: string;
  timeAgo: string;
}

const INITIAL_EVENTS: SimulatedLiveEvent[] = [
  {
    id: "evt-1",
    type: "pageview",
    path: "/pricing",
    source: "Google Organic",
    country: "US",
    timeAgo: "2s ago",
  },
  {
    id: "evt-2",
    type: "crawler",
    path: "/docs/installation",
    source: "ClaudeBot / 3.5 Sonnet",
    country: "US",
    timeAgo: "5s ago",
  },
  {
    id: "evt-3",
    type: "custom_event",
    path: "/signup",
    source: "cta_click_hero",
    country: "DE",
    timeAgo: "8s ago",
  },
  {
    id: "evt-4",
    type: "vital",
    path: "/features",
    source: "LCP 1.12s (Good)",
    country: "UK",
    timeAgo: "12s ago",
  },
  {
    id: "evt-5",
    type: "error",
    path: "/checkout",
    source: "Uncaught TypeError",
    country: "IN",
    timeAgo: "18s ago",
  },
];

export default function DemoClientView() {
  const [activeTab, setActiveTab] = useState<DemoViewTab>("pulse");
  const [activeProject, setActiveProject] = useState("SaaS Cloud Platform");
  const [liveVisitors, setLiveVisitors] = useState(42);
  const [events, setEvents] = useState<SimulatedLiveEvent[]>(INITIAL_EVENTS);

  const dashboardUrl = getDashboardUrl("/register");

  // Telemetry stream simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(30, Math.min(65, prev + delta));
      });

      const paths = ["/docs/api", "/pricing", "/features", "/blog/cookieless", "/"];
      const countries = ["US", "DE", "GB", "IN", "JP", "FR", "CA"];
      const newEvent: SimulatedLiveEvent = {
        id: "evt-" + Date.now(),
        type: Math.random() > 0.4 ? "pageview" : Math.random() > 0.5 ? "crawler" : "vital",
        path: paths[Math.floor(Math.random() * paths.length)],
        source: Math.random() > 0.5 ? "GPTBot / Search" : "Direct / Bookmark",
        country: countries[Math.floor(Math.random() * countries.length)],
        timeAgo: "just now",
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      {/* Top Demo Banner */}
      <div className="border-b border-white/[0.08] bg-[#0e0f15]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE INTERACTIVE SANDBOX</span>
            </div>
            <span className="hidden sm:inline text-xs text-zinc-400">
              Simulating production telemetry without authentication
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeProject}
              onChange={(e) => setActiveProject(e.target.value)}
              className="bg-[#14161f] border border-white/[0.1] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/30 font-mono"
            >
              <option value="SaaS Cloud Platform">Project: SaaS Cloud Platform</option>
              <option value="E-Commerce Storefront">Project: E-Commerce Storefront</option>
              <option value="Developer Documentation">Project: Developer Documentation</option>
            </select>

            <a
              href={dashboardUrl}
              className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Launch Your Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Workspace Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {activeProject}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.08] font-mono">
                Production
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Domain: <span className="text-zinc-200 font-mono">app.example.com</span> • Ingestion:{" "}
              <span className="text-emerald-400 font-mono">api.openanalytics.org.in</span>
            </p>
          </div>

          {/* Quick Realtime Pill */}
          <div className="flex items-center gap-4 bg-[#111218] border border-white/[0.08] p-3 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-zinc-400">
                  Active Now
                </div>
                <div className="text-lg font-bold text-white font-mono tabular-nums leading-none">
                  {liveVisitors}{" "}
                  <span className="text-xs font-normal text-zinc-500">visitors</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 border-b border-white/[0.06]">
          {[
            { id: "pulse", label: "Audience & Pulse", icon: Activity },
            { id: "vitals", label: "Core Web Vitals", icon: Gauge },
            { id: "airadar", label: "AI Crawler Radar", icon: Bot },
            { id: "behavior", label: "Behavior & Rage Clicks", icon: MousePointerClick },
            { id: "errors", label: "Error Crash Triage", icon: Bug },
            { id: "geo", label: "Geographic & Devices", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DemoViewTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* Tab 1: Pulse & Overview */}
        {activeTab === "pulse" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  Total Pageviews
                </span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  128,490
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  Unique Visitors
                </span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  54,210
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.1% vs last period</span>
                </div>
              </div>

              <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  Bounce Rate
                </span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  27.3%
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span>-3.2% improvement</span>
                </div>
              </div>

              <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  Avg Session Dwell
                </span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  3m 12s
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>p50 median duration</span>
                </div>
              </div>
            </div>

            {/* Grid: Pages + Live Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Pages */}
              <div className="lg:col-span-8 p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Top Pages &amp; Routes</h3>
                  <span className="text-xs font-mono text-zinc-500">Last 30 Days</span>
                </div>
                <div className="space-y-3">
                  {[
                    { path: "/", views: "48,120", percent: 45 },
                    { path: "/pricing", views: "24,800", percent: 28 },
                    { path: "/docs/installation", views: "19,450", percent: 22 },
                    { path: "/features", views: "14,200", percent: 16 },
                    { path: "/blog/cookieless-architecture", views: "9,890", percent: 11 },
                  ].map((p, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-200">{p.path}</span>
                        <span className="text-zinc-400 tabular-nums">{p.views} views</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/[0.6] rounded-full"
                          style={{ width: `${p.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realtime Telemetry Feed */}
              <div className="lg:col-span-4 p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Telemetry Stream</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">Auto-refresh</span>
                </div>

                <div className="space-y-2.5">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 bg-[#0e0f15] border border-white/[0.04] rounded-lg text-xs space-y-1 font-mono transition-all animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{evt.path}</span>
                        <span className="text-[10px] text-zinc-500">{evt.timeAgo}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>{evt.source}</span>
                        <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-300">
                          {evt.country}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Web Vitals */}
        {activeTab === "vitals" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <h3 className="text-base font-semibold text-white">
                Real User Monitoring (RUM) — 75th Percentile
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                Captured from real browser sessions via PerformanceObserver. These
                production metrics directly reflect Google Search ranking signals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  metric: "LCP",
                  name: "Largest Contentful Paint",
                  val: "1.18s",
                  status: "Good",
                  threshold: "< 2.5s",
                  color: "emerald",
                  desc: "Measures loading speed of primary above-the-fold content.",
                },
                {
                  metric: "INP",
                  name: "Interaction to Next Paint",
                  val: "42ms",
                  status: "Good",
                  threshold: "< 200ms",
                  color: "emerald",
                  desc: "Measures overall responsiveness to clicks, taps, and key presses.",
                },
                {
                  metric: "CLS",
                  name: "Cumulative Layout Shift",
                  val: "0.018",
                  status: "Good",
                  threshold: "< 0.1",
                  color: "emerald",
                  desc: "Quantifies unexpected layout shifting during page rendering.",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white bg-white/[0.08] px-2.5 py-1 rounded">
                      {m.metric}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {m.status} ({m.threshold})
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-mono text-white tabular-nums">
                      {m.val}
                    </div>
                    <div className="text-xs text-zinc-400">{m.name}</div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Crawler Radar */}
        {activeTab === "airadar" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Bot className="w-4 h-4" />
                <span>Autonomous AI Crawler Ingestion</span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Autonomous LLM Crawler &amp; AEO Readiness
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                Open Analytics isolates synthetic AI bots from human audiences, tracking
                which models scrape your site and whether they access your /llms.txt
                manifests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { bot: "GPTBot / OpenAI", hits: "4,210 requests", intent: "Training & Search", status: "Active" },
                { bot: "ClaudeBot / Anthropic", hits: "2,840 requests", intent: "Search Context", status: "Active" },
                { bot: "PerplexityBot", hits: "1,980 requests", intent: "Direct Citations", status: "Active" },
              ].map((b, i) => (
                <div key={i} className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{b.bot}</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {b.hits}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">Intent: {b.intent}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Behavior & Rage Clicks */}
        {activeTab === "behavior" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <h3 className="text-base font-semibold text-white">
                Behavioral UX Telemetry (Rage Clicks &amp; Dwell Time)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                Heuristic detection captures moments of user frustration. Rage clicks
                trigger when a visitor clicks ≥3 times within 500ms on a 40px radius.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
                <h4 className="text-sm font-semibold text-white">Detected Rage Clicks</h4>
                <div className="space-y-3">
                  {[
                    { target: "button#submit-order", count: 18, page: "/checkout" },
                    { target: "a.annual-billing-toggle", count: 9, page: "/pricing" },
                    { target: "button.copy-snippet", count: 4, page: "/docs/installation" },
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-[#0e0f15] border border-white/[0.04] rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-rose-400">{r.target}</span>
                        <span className="text-white font-bold tabular-nums">{r.count} incidents</span>
                      </div>
                      <div className="text-[11px] text-zinc-500">Triggered on {r.page}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
                <h4 className="text-sm font-semibold text-white">Scroll Depth Distribution</h4>
                <div className="space-y-3">
                  {[
                    { depth: "25% (Above the Fold)", percentage: 94 },
                    { depth: "50% (Features & Social Proof)", percentage: 76 },
                    { depth: "75% (Pricing & Comparison)", percentage: 52 },
                    { depth: "100% (Footer & Docs Links)", percentage: 38 },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-300">{s.depth}</span>
                        <span className="text-white tabular-nums">{s.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Error Monitoring */}
        {activeTab === "errors" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <h3 className="text-base font-semibold text-white">
                Frontend Error &amp; Exception Triage
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                Runtime JavaScript errors and unhandled promise rejections captured
                with full breadcrumbs and browser stack traces.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  error: "TypeError: Cannot read properties of undefined (reading 'tier')",
                  file: "components/pricing.tsx:42:15",
                  occurrences: 84,
                  users: 32,
                  lastSeen: "4m ago",
                },
                {
                  error: "FetchError: Network request failed (502 Bad Gateway)",
                  file: "lib/apiClient.ts:18:9",
                  occurrences: 21,
                  users: 14,
                  lastSeen: "28m ago",
                },
              ].map((err, i) => (
                <div key={i} className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-mono font-semibold text-rose-400">{err.error}</span>
                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">{err.lastSeen}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>Source: {err.file}</span>
                    <span className="text-white font-medium">{err.occurrences} events • {err.users} visitors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Geographic & Devices */}
        {activeTab === "geo" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <h3 className="text-base font-semibold text-white">
                Geographic Footprint &amp; Device Breakdown
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                Privacy-preserving location mapping via GeoIP without ever recording raw IP
                addresses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-white">Top Visitor Regions</h4>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { country: "United States", code: "US", share: "42%" },
                    { country: "Germany", code: "DE", share: "18%" },
                    { country: "United Kingdom", code: "GB", share: "14%" },
                    { country: "India", code: "IN", share: "11%" },
                    { country: "Japan", code: "JP", share: "7%" },
                  ].map((g, i) => (
                    <div key={i} className="flex justify-between p-2.5 bg-[#0e0f15] rounded-lg">
                      <span className="text-zinc-300">{g.country} ({g.code})</span>
                      <span className="text-white font-bold">{g.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-white">Platform &amp; Viewport Distribution</h4>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { device: "Desktop (Chrome / macOS)", share: "56%" },
                    { device: "Mobile (Safari / iOS)", share: "28%" },
                    { device: "Desktop (Firefox / Linux)", share: "10%" },
                    { device: "Mobile (Chrome / Android)", share: "6%" },
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between p-2.5 bg-[#0e0f15] rounded-lg">
                      <span className="text-zinc-300">{d.device}</span>
                      <span className="text-white font-bold">{d.share}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-b from-[#141620] to-[#0e0f15] border border-white/[0.1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Ready to see this data on your own website?
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Install the lightweight tracker in under 60 seconds with zero cookies and
              instant Core Web Vitals monitoring.
            </p>
          </div>

          <a
            href={dashboardUrl}
            className="px-5 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

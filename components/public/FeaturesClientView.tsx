"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  MousePointerClick,
  Bug,
  ShieldCheck,
  Bell,
  Check,
  Copy,
  ArrowRight,
  Terminal,
  Cpu,
  Gauge,
  Zap,
  Globe,
  Lock,
  Layers,
  Sparkles,
  Sliders,
  Volume2,
  Share2,
  ExternalLink,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function FeaturesClientView() {
  const dashboardUrl = getDashboardUrl("/");
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [activeRumTab, setActiveRumTab] = useState<"gauges" | "latency">("gauges");
  const [activeAiTab, setActiveAiTab] = useState<"feed" | "citations" | "generator" | "catalog">("feed");
  const [activeErrorTab, setActiveErrorTab] = useState<"stack" | "prompt">("stack");
  const [copiedFeatureRobots, setCopiedFeatureRobots] = useState(false);

  const universalSnippet = `<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="prj_your_site"></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(universalSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const sampleAiPrompt = `Analyze and fix this production exception captured by Open Analytics:
Error: TypeError: Cannot read properties of undefined (reading 'map')
Component: components/CartItemsList.tsx:42
Context: User navigated to /checkout after removing the last item from state.
Provide a defensive null-safe refactor and a Jest unit test to prevent regression.`;

  const copyAiPrompt = () => {
    navigator.clipboard.writeText(sampleAiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const playSynthesizedChime = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // First tone (880 Hz - A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Second harmonic tone (1760 Hz - A6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1760, now + 0.08);
      gain2.gain.setValueAtTime(0.05, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);

      setAudioPlayed(true);
      setTimeout(() => setAudioPlayed(false), 2000);
    } catch {
      // Audio context not supported or interaction blocked
    }
  };

  const modules = [
    {
      id: "rum",
      badge: "Real User Monitoring",
      title: "Automated Core Web Vitals (RUM)",
      tagline:
        "Capture actual end-user experience across real devices, networks, and viewports with millisecond precision.",
      icon: Activity,
      points: [
        {
          title: "Largest Contentful Paint (LCP)",
          desc: "Pinpoint slow hero images, delayed font downloads, and server TTFB bottlenecks with real p75 accuracy.",
        },
        {
          title: "Interaction to Next Paint (INP)",
          desc: "Audit main-thread input lag on clicks, taps, and keyboard events down to sub-10ms fidelity.",
        },
        {
          title: "Cumulative Layout Shift (CLS)",
          desc: "Catch visual jumping caused by unsized media, late CSS stylesheets, or injected dynamic banners.",
        },
        {
          title: "Hardware & Network Profiling",
          desc: "Correlate performance against client connection speeds (4G, 5G, WiFi), device memory, and CPU concurrency.",
        },
      ],
      stats: [
        { label: "Script Footprint", value: "< 3.2 KB Brotli" },
        { label: "Main Thread CPU", value: "< 2 ms" },
        { label: "Sampling Bias", value: "0% (100% Real Users)" },
        { label: "Google CWV Compliance", value: "100% Pass" },
      ],
    },
    {
      id: "ai-radar",
      badge: "Generative Engine Optimization (GEO)",
      title: "AI Visibility & LLM Citation Benchmark Hub",
      tagline:
        "Measure how generative search engines and foundation models crawl, index, synthesize, and cite your brand.",
      icon: Bot,
      points: [
        {
          title: "AI Search Referrals vs Autonomous Crawlers",
          desc: "Differentiate human traffic coming from Perplexity AI and SearchGPT from automated LLM crawler training runs.",
        },
        {
          title: "LLM Bot Scraping Telemetry",
          desc: "Real-time visibility when ClaudeBot, GPTBot, PerplexityBot, or Bytespider crawl your documentation.",
        },
        {
          title: "Answer Engine Citation Share-of-Voice",
          desc: "Track which high-authority pages get cited inside ChatGPT, Claude, and Perplexity answers with session attribution.",
        },
        {
          title: "Robots.txt & /llms.txt AI Policy Generator",
          desc: "Generate production-ready robots.txt rules and machine-readable /llms.txt indexes to maximize citation likelihood.",
        },
      ],
      stats: [
        { label: "Bot Catalog", value: "17+ Continuous Heuristics" },
        { label: "Classification", value: "IP + User-Agent Verified" },
        { label: "Answer Engine Coverage", value: "ChatGPT, Perplexity, Claude, Gemini" },
        { label: "Machine Protocol", value: "/llms.txt & /agents.md Ready" },
      ],
    },
    {
      id: "ux",
      badge: "Behavioral Friction Intelligence",
      title: "Rage Click & Dead Click Detection",
      tagline:
        "Identify broken UI states and frustrated visitor interactions before they submit support tickets or abandon.",
      icon: MousePointerClick,
      points: [
        {
          title: "Rage Click Cluster Detection",
          desc: "Triggers automatically when a visitor clicks the exact same DOM node 3 or more times within 800ms.",
        },
        {
          title: "Dead Click Discovery",
          desc: "Flags repeated clicks on non-interactive elements that visitors falsely expect to be clickable links.",
        },
        {
          title: "Precise CSS Selector Telemetry",
          desc: "Records the exact element tag, class list, button ID, and label text so engineers can reproduce immediately.",
        },
        {
          title: "Zero Heavy Video Recording",
          desc: "100% mathematical detection with zero DOM recording, keeping payload tiny and respecting user privacy.",
        },
      ],
      stats: [
        { label: "Trigger Threshold", value: "3 clicks / 800ms" },
        { label: "DOM Recording Overhead", value: "0 KB (Pure Math)" },
        { label: "Session Impact", value: "0ms Render Lag" },
        { label: "Triage Attribution", value: "Exact CSS Selector" },
      ],
    },
    {
      id: "errors",
      badge: "Diagnostics & Resilience",
      title: "Automated Error Triage & AI Debugging",
      tagline:
        "Uncaught JavaScript exceptions grouped intelligently into actionable root causes with 1-click AI repair prompts.",
      icon: Bug,
      points: [
        {
          title: "Unhandled Exception Capture",
          desc: "Automatically captures window.onerror and unhandledrejection events without requiring manual try-catch wrappers.",
        },
        {
          title: "Intelligent Stack Deduplication",
          desc: "Groups duplicate errors together by file, line, and stack trace so your team only diagnoses unique root causes.",
        },
        {
          title: "Browser & OS Context Correlation",
          desc: "Correlates runtime errors with specific browser engines, operating systems, and viewport dimensions.",
        },
        {
          title: "1-Click AI Fix Prompts",
          desc: "Instantly copy formatted diagnostic prompts tailored for Claude, ChatGPT, or GitHub Copilot with full stack context.",
        },
      ],
      stats: [
        { label: "Error Capture Rate", value: "100% Uncaught" },
        { label: "Grouping Heuristic", value: "Stack Hash Deduplication" },
        { label: "Setup Overhead", value: "0 Config (Native Script)" },
        { label: "Prompt Generation", value: "1-Click Copy" },
      ],
    },
    {
      id: "privacy",
      badge: "Cryptographic Privacy",
      title: "100% Cookieless GDPR & PECR Exemption",
      tagline:
        "Architectural privacy that mathematically eliminates annoying cookie consent banners from your website.",
      icon: ShieldCheck,
      points: [
        {
          title: "Zero Cookies & Zero LocalStorage",
          desc: "Writes zero cookies, zero LocalStorage tokens, and zero persistent fingerprinting hashes to client browsers.",
        },
        {
          title: "24-Hour Ephemeral Cryptographic Salts",
          desc: "Unique visitor hashes are generated via HMAC-SHA-256 with an ephemeral salt purged every night at 00:00:00 UTC.",
        },
        {
          title: "Zero Raw IP Storage",
          desc: "Client IP addresses are parsed strictly in volatile memory for country lookup and immediately discarded.",
        },
        {
          title: "Full European Data Sovereignty",
          desc: "Telemetry is processed strictly in compliance with GDPR, CCPA, and PECR without cross-site tracking.",
        },
      ],
      stats: [
        { label: "Cookie Consent Banner", value: "Not Required" },
        { label: "Salt Expiration Window", value: "24 Hours (Midnight UTC)" },
        { label: "PII Persisted to Disk", value: "0 Bytes" },
        { label: "Compliance Guarantee", value: "GDPR, CCPA, PECR" },
      ],
    },
    {
      id: "alerts",
      badge: "Real-Time Incident Triage",
      title: "Autonomous Anomaly Alerts & OS Desktop Notifications",
      tagline:
        "Instant incident detection for repeated crash spikes, error storms, and SEO degradation with native desktop chime alerts.",
      icon: Bell,
      points: [
        {
          title: "Repeated Crash Spikes (5x+)",
          desc: "Alerts engineering teams immediately when an identical runtime exception occurs 5 or more times in 10 minutes.",
        },
        {
          title: "Velocity Error Storm Detection",
          desc: "Detects rapid error surges (>10 errors / 5 min), instantly warning DevOps of breaking deployments.",
        },
        {
          title: "Native OS Desktop Notifications",
          desc: "Dispatches native OS notification toasts with synthesized Web Audio dual chimes even when the tab is minimized.",
        },
        {
          title: "Granular Ignore & Suppression Rules",
          desc: "Mute entire notification types or create regex and pathname pattern rules to eliminate non-actionable alert noise.",
        },
      ],
      stats: [
        { label: "Alert Dispatch Latency", value: "< 500 ms" },
        { label: "Audio Chime Tech", value: "Web Audio API Synthesis" },
        { label: "Suppression Engine", value: "7 Types + Pathname Regex" },
        { label: "Background Delivery", value: "HTML5 Desktop Notifications" },
      ],
    },
  ];

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Top Product Suite Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 text-xs font-medium mb-8 transition shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Full Observability Suite</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">v3.6 Production Telemetry</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-7xl mx-auto leading-[1.06]">
          Complete web observability. Built for speed, precision, and privacy.
        </h1>

        {/* Subtitle */}
        <p className="max-w-4xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          Everything your engineering team needs to audit real-world Core Web Vitals, track AI search crawler traffic, detect behavioral rage clicks, and triage JavaScript crashes with zero cookies.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/docs/installation"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
          >
            <Terminal size={14} className="text-zinc-400" />
            <span>Installation Guides</span>
          </Link>
        </div>

        {/* Quick Jump Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] hover:border-white/[0.16] text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Icon size={12} className="text-zinc-400" />
                <span>{m.badge}</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. PERFORMANCE & ARCHITECTURE SUMMARY STRIP                   */}
      {/* ============================================================ */}
      <section className="border-y border-white/[0.08] bg-[#0c0d14]/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">&lt; 3.2 KB</div>
            <div className="text-xs text-zinc-400 font-medium">Brotli Script Payload (15x &lt; GA4)</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">&lt; 2 ms</div>
            <div className="text-xs text-zinc-400 font-medium">Main-Thread CPU Execution</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums tracking-tight">100%</div>
            <div className="text-xs text-zinc-400 font-medium">Cookieless &amp; GDPR Compliant</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">0s</div>
            <div className="text-xs text-zinc-400 font-medium">Telemetry Ingestion Latency</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURE MODULES DEEP DIVE                                 */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {modules.map((mod) => {
          const Icon = mod.icon;

          return (
            <div
              key={mod.id}
              id={mod.id}
              className="scroll-mt-24 rounded-2xl bg-[#111218] border border-white/[0.08] p-6 sm:p-10 shadow-xl space-y-8"
            >
              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-xs font-mono font-medium text-zinc-300">
                    <Icon size={14} className="text-white" />
                    <span>{mod.badge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {mod.title}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
                    {mod.tagline}
                  </p>
                </div>

                <a
                  href={dashboardUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] transition active:scale-[0.98] cursor-pointer"
                >
                  <span>Launch Live Module</span>
                  <ArrowRight size={13} />
                </a>
              </div>

              {/* Main Content Grid: Capabilities (Left) vs Interactive Telemetry (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: 4 Core Capabilities */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Engineered Capabilities
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {mod.points.map((pt) => (
                      <div
                        key={pt.title}
                        className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-1.5 transition hover:border-white/[0.12]"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-white">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>{pt.title}</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed pl-5">
                          {pt.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Specification Metric Strip */}
                  <div className="pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {mod.stats.map((s) => (
                        <div
                          key={s.label}
                          className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] flex flex-col justify-between gap-1"
                        >
                          <span className="text-zinc-500 text-[11px]">{s.label}</span>
                          <span className="font-mono font-semibold text-white text-xs">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Live Simulation Cockpit */}
                <div className="lg:col-span-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                    Live Telemetry Preview
                  </div>

                  {/* 1. RUM Telemetry Mockup */}
                  {mod.id === "rum" && (
                    <div className="rounded-xl bg-[#0e0f15] border border-white/[0.08] overflow-hidden">
                      <div className="p-3 bg-[#14161f] border-b border-white/[0.08] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Gauge size={13} className="text-emerald-400" />
                          <span className="font-mono text-zinc-300">Core Web Vitals Real User Telemetry</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#0e0f15] p-0.5 rounded-md border border-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => setActiveRumTab("gauges")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${activeRumTab === "gauges" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Scores
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveRumTab("latency")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${activeRumTab === "latency" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Breakdown
                          </button>
                        </div>
                      </div>

                      {activeRumTab === "gauges" ? (
                        <div className="p-5 space-y-4">
                          <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-white">Largest Contentful Paint (LCP)</div>
                              <div className="text-[11px] text-zinc-400">p75 Real User Field Performance</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">0.82s</span>
                              <div className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Good (&lt; 2.5s)</div>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-white">Interaction to Next Paint (INP)</div>
                              <div className="text-[11px] text-zinc-400">Main-Thread Responsiveness</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">38ms</span>
                              <div className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Good (&lt; 200ms)</div>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-white">Cumulative Layout Shift (CLS)</div>
                              <div className="text-[11px] text-zinc-400">Visual Stability Index</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">0.01</span>
                              <div className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Good (&lt; 0.1)</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between text-zinc-400 border-b border-white/[0.06] pb-2 text-[11px]">
                            <span>Metric Attribute</span>
                            <span>p75 Latency</span>
                            <span>Field Status</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span>Time to First Byte (TTFB)</span>
                            <span className="text-white font-semibold tabular-nums">42 ms</span>
                            <span className="text-emerald-400 text-[11px]">Fast</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span>First Contentful Paint (FCP)</span>
                            <span className="text-white font-semibold tabular-nums">280 ms</span>
                            <span className="text-emerald-400 text-[11px]">Fast</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span>Script Execution Time</span>
                            <span className="text-white font-semibold tabular-nums">1.8 ms</span>
                            <span className="text-emerald-400 text-[11px]">Optimal</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span>Connection Class</span>
                            <span className="text-white font-semibold">4G / 5G / Broadband</span>
                            <span className="text-zinc-400 text-[11px]">Aggregated</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. AI Radar Telemetry Mockup */}
                  {mod.id === "ai-radar" && (
                    <div className="rounded-xl bg-[#0e0f15] border border-white/[0.08] overflow-hidden">
                      <div className="p-3 bg-[#14161f] border-b border-white/[0.08] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Bot size={13} className="text-purple-400" />
                          <span className="font-mono text-zinc-300">Live AI Search &amp; LLM Benchmark Hub</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#0e0f15] p-0.5 rounded-md border border-white/[0.06] overflow-x-auto">
                          <button
                            type="button"
                            onClick={() => setActiveAiTab("feed")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer shrink-0 ${activeAiTab === "feed" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Live Feed
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveAiTab("citations")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer shrink-0 ${activeAiTab === "citations" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            AI Citations
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveAiTab("generator")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer shrink-0 ${activeAiTab === "generator" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            /llms.txt
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveAiTab("catalog")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer shrink-0 ${activeAiTab === "catalog" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Bot Matrix
                          </button>
                        </div>
                      </div>

                      {activeAiTab === "feed" && (
                        <div className="p-4 space-y-2.5 font-mono text-xs">
                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                                SearchGPT
                              </span>
                              <span className="text-zinc-300 text-[11px] truncate">/docs/installation</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 shrink-0">200 OK • 18ms</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-semibold">
                                PerplexityBot
                              </span>
                              <span className="text-zinc-300 text-[11px] truncate">/pricing</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 shrink-0">200 OK • 22ms</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                                ClaudeBot
                              </span>
                              <span className="text-zinc-300 text-[11px] truncate">/features</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 shrink-0">200 OK • 14ms</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-semibold">
                                Google-Extended
                              </span>
                              <span className="text-zinc-300 text-[11px] truncate">/</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 shrink-0">200 OK • 16ms</span>
                          </div>
                        </div>
                      )}

                      {activeAiTab === "citations" && (
                        <div className="p-4 space-y-2.5 font-mono text-xs">
                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-[11px]">chatgpt.com</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Grounding Source
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-sans">Landing: /vs-google-analytics • 48 visitors</span>
                            </div>
                            <span className="text-white font-semibold tabular-nums text-xs">142 sessions</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-[11px]">perplexity.ai</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                  Live Citation
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-sans">Landing: /faq • 29 visitors</span>
                            </div>
                            <span className="text-white font-semibold tabular-nums text-xs">87 sessions</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-[11px]">claude.ai</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Research Link
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-sans">Landing: /docs/web-vitals • 18 visitors</span>
                            </div>
                            <span className="text-white font-semibold tabular-nums text-xs">34 sessions</span>
                          </div>
                        </div>
                      )}

                      {activeAiTab === "generator" && (
                        <div className="p-4 space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                            <span>Machine Context Protocol (/llms.txt)</span>
                            <span className="text-emerald-400">Validated</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.06] text-[11px] text-zinc-300 leading-relaxed overflow-x-auto">
                            <pre># /llms.txt Machine Manifest
Canonical: https://yourdomain.com
Docs: https://yourdomain.com/docs
User-agent: GPTBot, ClaudeBot, PerplexityBot
Allow: /</pre>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-sans">
                            Instant automated compliance for AI crawlers without blocking SEO search engine indexing.
                          </div>
                        </div>
                      )}

                      {activeAiTab === "catalog" && (
                        <div className="p-5 space-y-3 text-xs">
                          <div className="text-zinc-400 text-[11px]">
                            Continuous heuristic detection verifies IP ranges and official User-Agent signatures.
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                            <div className="p-2 rounded bg-[#14161f] border border-white/[0.06]">
                              <div className="font-semibold text-white">GPTBot / SearchGPT</div>
                              <div className="text-zinc-500 text-[10px]">OpenAI Corpus &amp; Search</div>
                            </div>
                            <div className="p-2 rounded bg-[#14161f] border border-white/[0.06]">
                              <div className="font-semibold text-white">PerplexityBot</div>
                              <div className="text-zinc-500 text-[10px]">Perplexity Realtime Web</div>
                            </div>
                            <div className="p-2 rounded bg-[#14161f] border border-white/[0.06]">
                              <div className="font-semibold text-white">ClaudeBot / Anthropic</div>
                              <div className="text-zinc-500 text-[10px]">Anthropic Crawler</div>
                            </div>
                            <div className="p-2 rounded bg-[#14161f] border border-white/[0.06]">
                              <div className="font-semibold text-white">Bytespider / Doubao</div>
                              <div className="text-zinc-500 text-[10px]">ByteDance Search Bot</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. UX Friction & Rage Click Telemetry Mockup */}
                  {mod.id === "ux" && (
                    <div className="rounded-xl bg-[#0e0f15] border border-white/[0.08] p-5 space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                          <span className="font-semibold text-rose-400">Rage Click Cluster Detected</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">Just now</span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Target Element:</span>
                          <span className="text-rose-300 font-bold">button#checkout-submit-btn</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Click Frequency:</span>
                          <span className="text-white font-semibold tabular-nums">4 clicks in 620ms</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Route Path:</span>
                          <span className="text-zinc-300">/checkout/payment</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Device &amp; Viewport:</span>
                          <span className="text-zinc-300">Mobile Safari (390x844)</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                        Diagnostics: Button rendered disabled during network mutation without visual spinner, triggering rapid visitor re-clicks.
                      </div>
                    </div>
                  )}

                  {/* 4. Error Triage & AI Debugging Mockup */}
                  {mod.id === "errors" && (
                    <div className="rounded-xl bg-[#0e0f15] border border-white/[0.08] overflow-hidden">
                      <div className="p-3 bg-[#14161f] border-b border-white/[0.08] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Bug size={13} className="text-amber-400" />
                          <span className="font-mono text-zinc-300">Automated Exception Fingerprint</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#0e0f15] p-0.5 rounded-md border border-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => setActiveErrorTab("stack")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${activeErrorTab === "stack" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Stack Trace
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveErrorTab("prompt")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${activeErrorTab === "prompt" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            AI Fix Prompt
                          </button>
                        </div>
                      </div>

                      {activeErrorTab === "stack" ? (
                        <div className="p-4 space-y-3 font-mono text-xs">
                          <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-rose-400 font-bold">TypeError: Cannot read properties of undefined (reading 'map')</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-300">18 Events</span>
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              at CartItemsList (components/CartItemsList.tsx:42:18)
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              at renderWithHooks (node_modules/react-dom/cjs/react-dom.production.min.js:149)
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                            <span>Affected: 14 Chrome 129 • 4 Safari 17.5</span>
                            <span className="text-emerald-400 font-medium">Auto-Fingerprinted</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 space-y-3">
                          <pre className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {sampleAiPrompt}
                          </pre>
                          <button
                            type="button"
                            onClick={copyAiPrompt}
                            className="w-full py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition flex items-center justify-center gap-2 border border-white/[0.08] cursor-pointer"
                          >
                            {copiedPrompt ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            <span>{copiedPrompt ? "Copied Prompt to Clipboard" : "Copy AI Fix Prompt"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. Cryptographic Privacy Mockup */}
                  {mod.id === "privacy" && (
                    <div className="rounded-xl bg-[#0e0f15] border border-white/[0.08] p-5 space-y-4 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2">
                          <Lock size={13} className="text-emerald-400" />
                          <span className="font-semibold text-white">Daily Salt Purge Protocol</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                          Active &amp; Rotating
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Cryptographic Algorithm:</span>
                          <span className="text-white font-semibold">HMAC-SHA-256</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Salt Expiration Schedule:</span>
                          <span className="text-emerald-400 font-semibold">Every 24h @ 00:00:00 UTC</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Client Cookie Storage:</span>
                          <span className="text-white font-semibold">0 Bytes (Zero Cookies)</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">European Data Residency:</span>
                          <span className="text-white font-semibold">Frankfurt &amp; Amsterdam</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                        Result: Mathematical impossibility of cross-site visitor tracking, granting full legal exemption from EU cookie consent banners.
                      </div>
                    </div>
                  )}

                  {/* 6. Anomaly Alerts & OS Desktop Notifications Mockup */}
                  {mod.id === "alerts" && (
                    <div className="rounded-xl bg-[#0e0f15] border border-white/[0.08] p-5 space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2">
                          <Bell size={13} className="text-rose-400" />
                          <span className="font-semibold text-white">Real-Time Incident Triage</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300">
                          Heuristic Active
                        </span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Trigger Anomaly:</span>
                          <span className="text-rose-400 font-bold">Repeated Crash Surge (5x+)</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Audio Chime:</span>
                          <span className="text-zinc-300">Web Audio Dual Harmonic Sine (880/1760Hz)</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Desktop Delivery:</span>
                          <span className="text-emerald-400 font-semibold">HTML5 Web Notification API</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={playSynthesizedChime}
                          className="w-full py-2 px-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium transition flex items-center justify-center gap-2 border border-white/[0.08] cursor-pointer"
                        >
                          <Volume2 size={13} className={audioPlayed ? "text-emerald-400" : "text-zinc-400"} />
                          <span>{audioPlayed ? "Chime Played via Web Audio" : "Test Alert Audio Chime"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ============================================================ */}
      {/* 4. MULTI-FRAMEWORK 1-CLICK INTEGRATION SNIPPET               */}
      {/* ============================================================ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Universal Integration</div>
              <div className="text-xl font-bold text-white tracking-tight mt-0.5">
                Drop in once. Collect all 6 telemetry modules.
              </div>
            </div>

            <button
              type="button"
              onClick={copySnippet}
              className="py-1.5 px-3.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              {copiedScript ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copiedScript ? "Copied Snippet" : "Copy Tag"}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] text-xs font-mono text-zinc-300 overflow-x-auto select-all">
            {universalSnippet}
          </pre>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400 pt-1">
            <span>Compatible with Next.js, React, Nuxt, Astro, Vue, SvelteKit, and static HTML.</span>
            <Link href="/docs/installation" className="text-white hover:underline flex items-center gap-1 font-medium">
              <span>View framework adapters</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BOTTOM HIGH-CONTRAST CONSOLE CTA                          */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#111218] border border-white/[0.08] relative overflow-hidden space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready for Production Telemetry</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Ready to supercharge your web observability?
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Get started in under 60 seconds with our sub-3.2KB featherweight snippet. Free tier includes 10,000 monthly events with zero credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={14} />
            </a>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#14161f] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
            >
              <span>Compare Plan Limits</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

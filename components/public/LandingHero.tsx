"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Flame,
  Globe,
  Laptop,
  Lock,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  Gauge,
  Cpu,
  Layers,
  Search,
  Users,
  Clock,
  Terminal,
  MousePointerClick,
  Bug,
  Bell,
  Volume2,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function LandingHero() {
  const dashboardUrl = getDashboardUrl("/");
  const [activeSnippetTab, setActiveSnippetTab] = useState<"html" | "nextjs" | "react" | "nuxt">("html");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Simulated live demo state
  const [activeTab, setActiveTab] = useState<"pulse" | "vitals" | "airadar" | "alerts">("pulse");

  const snippets = {
    html: `<!-- 1-Minute Universal Quickstart -->\n<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>`,
    nextjs: `// app/layout.tsx (Next.js 13/14/15 App Router)\nimport Script from "next/script";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <Script\n          src="https://api.openanalytics.org.in/open.js"\n          data-project-id="YOUR_PROJECT_ID"\n          strategy="afterInteractive"\n        />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}`,
    react: `// public/index.html (Vite / CRA)\n<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>`,
    nuxt: `// nuxt.config.ts\nexport default defineNuxtConfig({\n  app: {\n    head: {\n      script: [{ src: "https://api.openanalytics.org.in/open.js", "data-project-id": "YOUR_PROJECT_ID", defer: true }]\n    }\n  }\n});`,
  };

  const currentSnippet = snippets[activeSnippetTab];

  const copySnippet = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  return (
    <div className="w-full text-zinc-100 selection:bg-sky-500/20 selection:text-sky-200">
      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle top ambient vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/5 blur-[100px] -z-10 pointer-events-none" />

        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Cookieless Web Telemetry &amp; RUM</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.08]">
          Web Analytics Built for Modern Speed &amp; Privacy
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          The privacy-first Google Analytics 4 alternative for engineering teams. Sub-3.2KB featherweight script, zero cookie banners, real-time Core Web Vitals RUM, and autonomous AI search radar.
        </p>

        {/* Primary CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/vs-google-analytics"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition border border-zinc-800 flex items-center justify-center gap-2"
          >
            <span>Compare vs GA4</span>
          </Link>
        </div>

        {/* Trust & Metric Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-400 max-w-2xl mx-auto mb-16">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-zinc-200 font-medium">Sub-3.2KB Brotli</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-zinc-200 font-medium">Zero Cookie Banners</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-zinc-200 font-medium">Core Web Vitals RUM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-zinc-200 font-medium">Autonomous AI Radar</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE TELEMETRY SIMULATOR                              */}
        {/* ============================================================ */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#111218] border border-white/[0.08] shadow-2xl p-5 sm:p-7 text-left space-y-5">
          {/* Live Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <span className="text-emerald-400">Live Telemetry Active</span>
                  <span>•</span>
                  <span>api.openanalytics.org.in</span>
                </div>
                <div className="text-xl font-bold text-white mt-0.5">
                  1,428 Visitors Active Online
                </div>
              </div>
            </div>

            {/* Segment Control Tab Selector */}
            <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("pulse")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  activeTab === "pulse" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Live Feed
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("vitals")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  activeTab === "vitals" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Web Vitals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("airadar")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  activeTab === "airadar" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                AI Search Radar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("alerts")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "alerts" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Bell size={12} className="text-rose-400" />
                <span>Incident Alerts</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Live Pulse Feed */}
          {activeTab === "pulse" && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Total Pageviews Today</div>
                  <div className="text-xl font-bold text-white mt-1 tabular-nums">184,920</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                    <TrendingUp size={12} /> +24.8% vs last week
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Largest Contentful Paint</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">0.82 s</div>
                  <div className="text-[11px] text-zinc-500 mt-1">p75 Field (Target: &lt; 2.5s)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Interaction to Next Paint</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">38 ms</div>
                  <div className="text-[11px] text-zinc-500 mt-1">p75 Field (Target: &lt; 200ms)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">AI Search Referrals</div>
                  <div className="text-xl font-bold text-sky-400 mt-1 tabular-nums">3,812</div>
                  <div className="text-[11px] text-zinc-500 mt-1">Perplexity, SearchGPT, Claude</div>
                </div>
              </div>

              {/* Micro Live Feed Stream */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span className="text-white font-semibold">/pricing</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">Referred by perplexity.ai</span>
                  </div>
                  <span className="text-zinc-500 text-[11px]">2s ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-white font-semibold">/docs/installation</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">Direct • Chrome Windows</span>
                  </div>
                  <span className="text-zinc-500 text-[11px]">5s ago</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Core Web Vitals RUM */}
          {activeTab === "vitals" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>LCP (Loading)</span>
                    <span className="text-emerald-400 font-semibold font-mono">0.82s (Good)</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-emerald-400 rounded-full" />
                  </div>
                  <p className="text-[11px] text-zinc-500">94% of visitors experience sub-1.2s hero paint.</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>INP (Responsiveness)</span>
                    <span className="text-emerald-400 font-semibold font-mono">38ms (Good)</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-emerald-400 rounded-full" />
                  </div>
                  <p className="text-[11px] text-zinc-500">Zero main-thread blocking during click events.</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>CLS (Visual Stability)</span>
                    <span className="text-emerald-400 font-semibold font-mono">0.01 (Good)</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[99%] h-full bg-emerald-400 rounded-full" />
                  </div>
                  <p className="text-[11px] text-zinc-500">No unexpected layout jumps or shifting banners.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: AI Search Radar */}
          {activeTab === "airadar" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-400">Perplexity Citations</div>
                  <div className="text-lg font-bold text-white mt-1 tabular-nums">1,940</div>
                  <div className="text-[10px] text-sky-400 font-mono">Top: /features</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-400">OpenAI SearchGPT</div>
                  <div className="text-lg font-bold text-white mt-1 tabular-nums">1,215</div>
                  <div className="text-[10px] text-sky-400 font-mono">Top: /vs-google-analytics</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-400">ClaudeBot Scrapes</div>
                  <div className="text-lg font-bold text-white mt-1 tabular-nums">420</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Indexed: /llms.txt</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-400">Google Gemini Visits</div>
                  <div className="text-lg font-bold text-white mt-1 tabular-nums">237</div>
                  <div className="text-[10px] text-sky-400 font-mono">AEO direct citation</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Autonomous Incident Alerts */}
          {activeTab === "alerts" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-rose-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Crash Spike</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      CRITICAL
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">5x Error Surge</div>
                  <p className="text-[11px] text-zinc-400 font-mono truncate">/checkout • TypeError: null</p>
                  <div className="text-[10px] text-rose-400 flex items-center gap-1">
                    <Flame size={11} /> Milestone bracket triggered
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">SEO &amp; AEO Audit</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      WARNING
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">Missing &lt;title&gt;</div>
                  <p className="text-[11px] text-zinc-400 font-mono truncate">/pricing/enterprise • Blank title</p>
                  <div className="text-[10px] text-amber-400 flex items-center gap-1">
                    <Search size={11} /> Automated optimization scan
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-sky-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Desktop Alerts</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">Web Notifications</div>
                  <p className="text-[11px] text-zinc-400">Synthesized 587Hz chime</p>
                  <div className="text-[10px] text-sky-400 flex items-center gap-1">
                    <Volume2 size={11} /> 0 external asset dependency
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Code Snippet Tabs */}
          <div className="space-y-2 pt-2 border-t border-white/[0.08]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Code2 size={14} className="text-sky-400" />
                <span className="text-xs font-semibold text-zinc-300">Universal 1-Line Embed</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                {(["html", "nextjs", "react", "nuxt"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveSnippetTab(tab)}
                    className={`px-2 py-0.5 rounded-md transition uppercase cursor-pointer ${
                      activeSnippetTab === tab
                        ? "bg-white/[0.1] text-white font-medium"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08] flex items-center justify-between gap-3 overflow-x-auto">
              <code className="text-xs font-mono text-sky-300 whitespace-pre-wrap select-all">
                {currentSnippet}
              </code>
              <button
                type="button"
                onClick={copySnippet}
                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition shrink-0 cursor-pointer"
                title="Copy code snippet"
              >
                {copiedSnippet ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BENTO GRID SHOWCASE (CRAFTED OBSIDIAN ARCHITECTURE)           */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium">
            <Layers size={13} />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered For Precision Web Observability
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            Eliminate bulky vendor libraries, annoying cookie banners, and delayed reporting with an observability engine built for modern speed.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bento Card 1 (Large 2-column span): Real User Monitoring */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 hover:border-white/[0.14] transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sky-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Real User Monitoring (RUM)</h3>
                  <p className="text-xs text-zinc-400">Continuous field measurement of Google Core Web Vitals at the 75th percentile.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                p75 Field Telemetry
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-medium">LCP (Loading)</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">0.82 s</div>
                <div className="text-[10px] text-zinc-400">Good (&lt; 2.5s)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-medium">INP (Response)</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">38 ms</div>
                <div className="text-[10px] text-zinc-400">Good (&lt; 200ms)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-medium">CLS (Stability)</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">0.01</div>
                <div className="text-[10px] text-zinc-400">Good (&lt; 0.1)</div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Sub-3.2KB Brotli Beacon */}
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 hover:border-white/[0.14] transition">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Sub-3.2KB Beacon</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                15x lighter than Google Analytics 4. Executes asynchronously in under 2ms with zero DOM blocking.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>GA4 Payload</span>
                <span className="text-rose-400">48.5 KB</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-white">Open Analytics</span>
                <span className="text-emerald-400">3.1 KB</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Autonomous AI Search Radar */}
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 hover:border-white/[0.14] transition">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sky-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Autonomous AI Radar</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Real-time classification of citations, referrals, and crawler requests from OpenAI SearchGPT, Perplexity, Claude, and Gemini.
              </p>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>PerplexityBot</span>
                <span className="text-sky-400">2s ago</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>OAI-SearchBot</span>
                <span className="text-emerald-400">14s ago</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Incident Triage & Alerts */}
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 hover:border-white/[0.14] transition">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Incident &amp; Crash Alerts</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Repeated error detection (5x+), error velocity storm spikes, and native OS desktop alerts with Web Audio chimes.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Alert Threshold</span>
              <span className="text-rose-400 font-mono font-semibold">&gt;= 5 occurrences</span>
            </div>
          </div>

          {/* Bento Card 5: 100% Cookieless Cryptographic Privacy */}
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 hover:border-white/[0.14] transition">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Cookieless Privacy</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Daily visitor hashes use HMAC-SHA-256 with an ephemeral salt purged every night at midnight UTC. Zero tracking cookies.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Cookie Banners</span>
              <span className="text-emerald-400 font-medium">100% Exempt</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HEAD-TO-HEAD BENCHMARK TABLE                                 */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Open Analytics Compares
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Architectural benchmark against legacy analytics providers.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#111218] shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-zinc-900/50">
                  <th className="p-3.5 sm:p-4 text-zinc-400 font-semibold">Capability</th>
                  <th className="p-3.5 sm:p-4 text-white font-bold bg-white/[0.04]">Open Analytics</th>
                  <th className="p-3.5 sm:p-4 text-zinc-400 font-medium">Google Analytics 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-zinc-200">Script Payload Size</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold bg-white/[0.02]">3.1 KB (Brotli)</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">48.5 KB (15x heavier)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-zinc-200">Cookie Consent Popups</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold bg-white/[0.02]">Zero required (100% exempt)</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Mandatory cookie banner</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-zinc-200">Real User Monitoring (RUM)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold bg-white/[0.02]">Native p75 LCP, INP, CLS</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Not included natively</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-zinc-200">AI Search Crawler Attribution</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold bg-white/[0.02]">Autonomous AI Crawler Radar</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">Unclassified or ignored</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium text-zinc-200">Incident &amp; Error Alerts</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold bg-white/[0.02]">Autonomous 5x Crash Alerts + OS Desktop Chimes</td>
                  <td className="p-3.5 sm:p-4 text-zinc-400">No error tracking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CALL TO ACTION                                         */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready for Faster, Privacy-First Analytics?
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Get complete visibility into web traffic, Core Web Vitals, and incident alerts with a single line of code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Dashboard Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition border border-zinc-800 flex items-center justify-center gap-2"
            >
              <span>Read Documentation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

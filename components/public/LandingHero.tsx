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
  HelpCircle,
  Laptop,
  Lock,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  Gauge,
  Cpu,
  Layers,
  BarChart3,
  Search,
  Users,
  EyeOff,
  Clock,
  Terminal,
  MousePointerClick,
  Bug,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function LandingHero() {
  const dashboardUrl = getDashboardUrl("/");
  const [activeSnippetTab, setActiveSnippetTab] = useState<"html" | "nextjs" | "react" | "nuxt">("html");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Simulated live demo state
  const [activeTab, setActiveTab] = useState<"pulse" | "vitals" | "airadar">("pulse");

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
    <div className="w-full text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[460px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-indigo-600/10 blur-[130px] -z-10 pointer-events-none" />

        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Cookieless Web Observability</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.08]">
          Analytics That Won&apos;t Slow You Down Or{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Invade Visitor Privacy.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          The privacy-first Google Analytics 4 alternative for engineering teams. Sub-3.2KB featherweight script, zero cookie consent banners, real-time sub-second telemetry, and autonomous AI search radar.
        </p>

        {/* Primary CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:via-sky-300 hover:to-indigo-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/vs-google-analytics"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-sm transition border border-white/[0.1] flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span>Compare vs Google Analytics 4</span>
          </Link>
        </div>

        {/* Trust & Metric Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 max-w-3xl mx-auto mb-14">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span className="text-white font-medium">Sub-3.2KB Brotli</span> (15x lighter than GA4)
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span className="text-white font-medium">Zero Cookie Banners</span> (100% GDPR exempt)
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span className="text-white font-medium">Live Field RUM</span> (LCP, INP, CLS)
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span className="text-white font-medium">AI Bot Radar</span> (SearchGPT, Perplexity, Claude)
          </div>
        </div>

        {/* ============================================================ */}
        {/* GEO & AEO DIRECT ANSWER BOX                                  */}
        {/* ============================================================ */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-b from-[#0a0f1d] to-[#080d19] border border-cyan-500/30 text-left backdrop-blur-md shadow-xl shadow-cyan-950/20 mb-14">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>Direct Answer • Generative Engine Summary (GEO / AEO)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              Verified 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">What is Open Analytics?</strong> Open Analytics is an enterprise-grade, privacy-first web telemetry and observability engine engineered for high-performance websites. Operating via a sub-3.2KB asynchronous beacon (<code className="text-cyan-300 font-mono">api.openanalytics.org.in/open.js</code>), it requires <strong className="text-white">zero cookie consent banners</strong> by utilizing daily rotating HMAC-SHA-256 cryptographic salts with zero persistent client-side identifiers. Unlike Google Analytics 4, Open Analytics delivers sub-second real-time streaming, automated Real User Monitoring (Core Web Vitals p75 LCP, INP, CLS), and autonomous categorization of generative AI answer engines (<strong className="text-white">OpenAI SearchGPT, Perplexity AI, Anthropic Claude, and Google Gemini</strong>).
          </p>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE TELEMETRY SIMULATOR                              */}
        {/* ============================================================ */}
        <div className="max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-800/40 to-slate-900/80 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(6,182,212,0.15)]">
          <div className="rounded-[22px] bg-[#070b16] border border-white/[0.08] p-6 sm:p-8 text-left space-y-6">
            {/* Live Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <span>Live Telemetry Engine Active</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-500">api.openanalytics.org.in</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    1,428 Visitors Active Online Right Now
                  </div>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setActiveTab("pulse")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "pulse" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Live Feed
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vitals")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "vitals" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Core Web Vitals
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("airadar")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "airadar" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  AI Search Radar
                </button>
              </div>
            </div>

            {/* Tab 1: Live Pulse Feed */}
            {activeTab === "pulse" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400">Total Pageviews Today</div>
                    <div className="text-2xl font-black text-white mt-1">184,920</div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                      <TrendingUp size={13} /> +24.8% vs last week
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400">Largest Contentful Paint</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">0.82 s</div>
                    <div className="text-[11px] text-slate-400 mt-1">p75 Field (Target: &lt; 2.5s)</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400">Interaction to Next Paint</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">38 ms</div>
                    <div className="text-[11px] text-slate-400 mt-1">p75 Field (Target: &lt; 200ms)</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400">AI Search Referrals</div>
                    <div className="text-2xl font-black text-cyan-400 mt-1">3,812</div>
                    <div className="text-[11px] text-cyan-300 mt-1">Perplexity, SearchGPT, Claude</div>
                  </div>
                </div>

                {/* Micro Live Feed Stream */}
                <div className="space-y-1.5 pt-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="text-white font-bold">/pricing</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Referred by perplexity.ai</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">2s ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-white font-bold">/docs/installation</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Direct • Chrome Windows</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">5s ago</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Core Web Vitals RUM */}
            {activeTab === "vitals" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>LCP (Loading)</span>
                      <span className="text-emerald-400 font-bold font-mono">0.82s (Good)</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-400">94% of visitors experience sub-1.2s hero paint.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>INP (Responsiveness)</span>
                      <span className="text-emerald-400 font-bold font-mono">38ms (Good)</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-400">Zero main-thread blocking during click events.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>CLS (Visual Stability)</span>
                      <span className="text-emerald-400 font-bold font-mono">0.01 (Good)</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="w-[99%] h-full bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-400">No unexpected layout jumps or shifting banners.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: AI Search Radar */}
            {activeTab === "airadar" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">Perplexity Citations</div>
                    <div className="text-xl font-bold text-white mt-1">1,940</div>
                    <div className="text-[10px] text-cyan-300 font-mono">Top route: /features</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">OpenAI SearchGPT</div>
                    <div className="text-xl font-bold text-white mt-1">1,215</div>
                    <div className="text-[10px] text-cyan-300 font-mono">Top route: /vs-google-analytics</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">ClaudeBot Scrapes</div>
                    <div className="text-xl font-bold text-white mt-1">420</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Indexed: /llms.txt</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-slate-400">Google Gemini Visits</div>
                    <div className="text-xl font-bold text-white mt-1">237</div>
                    <div className="text-[10px] text-cyan-300 font-mono">AEO direct citation</div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Code Snippet Tabs */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Code2 size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Universal 1-Line Embed</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {(["html", "nextjs", "react", "nuxt"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveSnippetTab(tab)}
                      className={`px-2.5 py-1 rounded-lg transition uppercase cursor-pointer ${
                        activeSnippetTab === tab
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#04060c] border border-white/[0.08] flex items-center justify-between gap-3 overflow-x-auto">
                <code className="text-xs font-mono text-cyan-300 whitespace-pre-wrap select-all">
                  {currentSnippet}
                </code>
                <button
                  type="button"
                  onClick={copySnippet}
                  className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition shrink-0 cursor-pointer"
                  title="Copy code snippet"
                >
                  {copiedSnippet ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6 CORE PILLARS GRID                                          */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            <Layers size={13} />
            <span>Built From The Ground Up</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineered For The Privacy-First Web
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate bulky scripts, frustrating cookie banners, and delayed reporting with an observability engine built for modern speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Sub-3.2KB Brotli Beacon</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              15x lighter than Google Analytics 4. Executes asynchronously in under 2ms on mobile CPUs with zero DOM blocking and zero penalty to Google Lighthouse or PageSpeed scores.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Zero Cookie Consent Banners</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No tracking cookies, no LocalStorage keys, and zero cross-site device fingerprinting. Fully exempt from ePrivacy Directive and GDPR cookie popup mandates by architecture.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Autonomous AI Search Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time classification of citations, referrals, and crawler requests from OpenAI SearchGPT, Perplexity AI, Claude (Anthropic), and Google Gemini with dedicated visibility feeds.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-sky-500/40 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Real User Monitoring (RUM)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measure real visitor field experience metrics: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) with 75th-percentile accuracy.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-rose-500/40 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Behavioral Rage & Dead Clicks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect rapid frontend frustration when visitors tap unresponsive UI elements or broken action buttons, enabling engineering teams to eliminate UX bugs immediately.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.07] hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">24h Rotating Cryptographic Salts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily visitor hashes use HMAC-SHA-256 with an ephemeral salt purged every night at midnight UTC. Raw IP addresses are truncated in RAM and never written to disk or database logs.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HEAD-TO-HEAD BENCHMARK                                        */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Head-to-Head Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Why Teams Choose Open Analytics Over GA4
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#070b16]/80 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-300">
                <th className="py-4 px-6 font-bold">Criteria</th>
                <th className="py-4 px-6 font-bold text-cyan-400">Open Analytics</th>
                <th className="py-4 px-6 font-bold text-rose-400">Google Analytics 4 (GA4)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-300">
              <tr>
                <td className="py-3.5 px-6 font-semibold text-white">Script Payload (Brotli)</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">&lt; 3.2 KB</td>
                <td className="py-3.5 px-6 text-rose-400">45 KB to 120 KB+</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold text-white">Cookie Consent Banner Required</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">No (100% Cookieless)</td>
                <td className="py-3.5 px-6 text-rose-400">Mandatory by Law</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold text-white">Data Ingestion Latency</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">Sub-second Real-time</td>
                <td className="py-3.5 px-6 text-rose-400">24 to 48 hour processing delay</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold text-white">Autonomous AI Search Radar</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">Native (SearchGPT, Perplexity, Claude)</td>
                <td className="py-3.5 px-6 text-rose-400">Not supported (grouped in Direct)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold text-white">Core Web Vitals RUM</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">Native p75 LCP, INP, CLS</td>
                <td className="py-3.5 px-6 text-rose-400">Requires manual BigQuery pipelines</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold text-white">Behavioral Rage &amp; Dead Clicks</td>
                <td className="py-3.5 px-6 text-emerald-400 font-bold">Included Out-of-the-Box</td>
                <td className="py-3.5 px-6 text-rose-400">Not available</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/vs-google-analytics"
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Read the complete head-to-head comparison</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL HIGH-IMPACT CALL TO ACTION                             */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 relative overflow-hidden space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Activity className="w-7 h-7 animate-glow" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready For Faster, Honest Web Observability?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
              Install in 60 seconds. Say goodbye to bloated scripts, delayed reports, and intrusive cookie consent banners forever.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/25 cursor-pointer hover:scale-[1.02]"
            >
              Launch Dashboard
            </a>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-bold text-sm transition border border-white/[0.1]"
            >
              View Transparent Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

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
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
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
  ChevronRight,
  HelpCircle,
  BarChart3,
  ExternalLink,
  Shield,
  Filter,
  Lock,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";
import JsonLd from "@/components/JsonLd";

export default function LandingHero() {
  const dashboardUrl = getDashboardUrl("/");
  const [activeSnippetTab, setActiveSnippetTab] = useState<"html" | "nextjs" | "react" | "nuxt" | "curl">("html");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedHeroSnippet, setCopiedHeroSnippet] = useState(false);

  // Simulated live telemetry demo state
  const [activeTab, setActiveTab] = useState<"pulse" | "vitals" | "airadar" | "alerts">("pulse");

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroSnippet = `<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="prj_openlabs"></script>`;

  const copyHeroSnippet = () => {
    navigator.clipboard.writeText(heroSnippet);
    setCopiedHeroSnippet(true);
    setTimeout(() => setCopiedHeroSnippet(false), 2000);
  };

  const snippets = {
    html: `<!-- Universal 1-Line HTML Tag (paste before </head>) -->\n<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>`,
    nextjs: `// app/layout.tsx (Next.js 13/14/15 App Router)\nimport Script from "next/script";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <Script\n          src="https://api.openanalytics.org.in/open.js"\n          data-project-id="YOUR_PROJECT_ID"\n          strategy="afterInteractive"\n        />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}`,
    react: `// src/main.tsx or App.tsx (Vite / CRA)\nimport { useEffect } from "react";\n\nexport default function App() {\n  useEffect(() => {\n    const s = document.createElement("script");\n    s.src = "https://api.openanalytics.org.in/open.js";\n    s.setAttribute("data-project-id", "YOUR_PROJECT_ID");\n    s.defer = true;\n    document.head.appendChild(s);\n  }, []);\n\n  return <YourRouter />;\n}`,
    nuxt: `// nuxt.config.ts\nexport default defineNuxtConfig({\n  app: {\n    head: {\n      script: [\n        { src: "https://api.openanalytics.org.in/open.js", "data-project-id": "YOUR_PROJECT_ID", defer: true }\n      ]\n    }\n  }\n});`,
    curl: `# Ingest custom telemetry directly via HTTP POST\ncurl -X POST "https://api.openanalytics.org.in/v1/collect" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "type": "pageview",\n    "projectId": "YOUR_PROJECT_ID",\n    "pathname": "/checkout",\n    "title": "Completed Purchase",\n    "country": "United States"\n  }'`,
  };

  const currentSnippet = snippets[activeSnippetTab];

  const copySnippet = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  const faqs = [
    {
      q: "Do I need a cookie consent banner with Open Analytics?",
      a: "No. Open Analytics is 100% cookieless and does not store IP addresses or persistent identifiers. It complies with GDPR, CCPA, and PECR out of the box, allowing you to completely remove annoying consent banners from your website.",
    },
    {
      q: "How does Open Analytics calculate unique visitors without cookies?",
      a: "Visitors are assigned a pseudo-anonymous daily hash generated via HMAC-SHA-256 using the visitor's rotating daily attributes and a cryptographically secure salt purged automatically every night at midnight UTC.",
    },
    {
      q: "Will Open Analytics slow down my website or affect Google rankings?",
      a: "Not at all. The tracking script is under 3.2 KB Brotli compressed (15x smaller than Google Analytics 4) and loads asynchronously with zero main-thread CPU blocking, which directly protects and improves your Google Core Web Vitals scores.",
    },
    {
      q: "Can I run Open Analytics alongside Google Analytics 4 during testing?",
      a: "Yes. Open Analytics operates completely independently in its own namespace. You can run both concurrently during verification and switch over whenever you are ready.",
    },
    {
      q: "What features are included in the Free Starter tier?",
      a: "The Free plan includes 1 website, 10,000 monthly events, up to 2 team members, real-time telemetry, Core Web Vitals RUM, crash triage, and a 30-day historical query window with zero credit card required.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      <JsonLd data={faqSchema} />
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Top Product Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 text-xs font-medium mb-8 transition shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Open Analytics v3.6:</span>
          <span>Obsidian Engine &amp; AI Radar</span>
          <ArrowRight size={12} className="text-zinc-500 ml-0.5" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-7xl mx-auto leading-[1.06]">
          Web analytics engineered for speed, precision, and privacy.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          The high-performance Google Analytics alternative built for developers. Under 3.2 KB featherweight script, zero cookie banners, real-time Core Web Vitals RUM, and autonomous AI search radar.
        </p>

        {/* Primary CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/vs-google-analytics"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
          >
            <span>Compare vs GA4</span>
          </Link>
        </div>

        {/* Quick 1-Click Code Snippet Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111218] border border-white/[0.08] text-xs text-zinc-400 max-w-xl mx-auto mb-16 shadow-inner">
          <Terminal size={13} className="text-zinc-400 shrink-0" />
          <code className="font-mono text-zinc-300 text-[11px] truncate select-all">
            &lt;script defer src=&quot;https://api.openanalytics.org.in/open.js&quot; data-project-id=&quot;prj_your_id&quot;&gt;&lt;/script&gt;
          </code>
          <button
            type="button"
            onClick={copyHeroSnippet}
            className="p-1 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white transition shrink-0 cursor-pointer"
            title="Copy script tag"
          >
            {copiedHeroSnippet ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>

        {/* ============================================================ */}
        {/* 2. THE TELEMETRY COCKPIT (INTERACTIVE APP PREVIEW)            */}
        {/* ============================================================ */}
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#111218] border border-white/[0.08] shadow-2xl overflow-hidden text-left">
          {/* Window Chrome Topbar */}
          <div className="h-11 px-4 bg-[#0e0f15] border-b border-white/[0.08] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
                <Lock size={10} className="text-emerald-400" />
                <span>dashboard.openanalytics.org.in/live-feed</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-emerald-400 font-semibold text-[11px]">1,428 Online Now</span>
            </div>
          </div>

          {/* Interactive Cockpit Controls & View Switcher */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Production Telemetry</div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5 tabular-nums">
                  184,920 <span className="text-xs font-normal text-zinc-400">pageviews today</span>
                </div>
              </div>

              {/* Segmented Tab Controls */}
              <div className="flex items-center gap-1 bg-[#14161f] p-1 rounded-lg border border-white/[0.06] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("pulse")}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${activeTab === "pulse" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                >
                  Live Stream
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vitals")}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${activeTab === "vitals" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                >
                  Web Vitals RUM
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("airadar")}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${activeTab === "airadar" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                >
                  AI Search Radar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("alerts")}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${activeTab === "alerts" ? "bg-white/[0.1] text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                >
                  <span>Incident Alerts</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Live Pulse Feed Stream */}
            {activeTab === "pulse" && (
              <div className="space-y-4 animate-fadeIn">
                {/* 4 Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-[11px] text-zinc-500 font-medium">Total Views (24h)</div>
                    <div className="text-xl font-semibold text-white mt-1 tabular-nums">184,920</div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <TrendingUp size={12} /> +24.8% vs last week
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-[11px] text-zinc-500 font-medium">Unique Visitors</div>
                    <div className="text-xl font-semibold text-white mt-1 tabular-nums">42,610</div>
                    <div className="text-[11px] text-zinc-400 mt-1">Identified client sessions</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-[11px] text-zinc-500 font-medium">Avg Dwell Duration</div>
                    <div className="text-xl font-semibold text-white mt-1 tabular-nums">3m 42s</div>
                    <div className="text-[11px] text-zinc-400 mt-1">Active reading time</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-[11px] text-zinc-500 font-medium">Returning Audience</div>
                    <div className="text-xl font-semibold text-white mt-1 tabular-nums">68.4%</div>
                    <div className="text-[11px] text-zinc-400 mt-1">Cookieless cohort loyalty</div>
                  </div>
                </div>

                {/* Live Stream Terminal Rows */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-white font-medium">/pricing</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">Referred by perplexity.ai</span>
                      <span className="text-zinc-600 hidden sm:inline">•</span>
                      <span className="text-zinc-500 hidden sm:inline">Chrome 128 / macOS</span>
                    </div>
                    <span className="text-zinc-500 text-[11px] tabular-nums">1s ago</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span className="text-white font-medium">/docs/installation</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">Direct • Firefox / Windows</span>
                      <span className="text-zinc-600 hidden sm:inline">•</span>
                      <span className="text-zinc-500 hidden sm:inline">RTT 14ms</span>
                    </div>
                    <span className="text-zinc-500 text-[11px] tabular-nums">3s ago</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-white font-medium">/vs-google-analytics</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">Search: &quot;lightweight ga4 alternative&quot;</span>
                    </div>
                    <span className="text-zinc-500 text-[11px] tabular-nums">7s ago</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Core Web Vitals RUM */}
            {activeTab === "vitals" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>LCP (Loading)</span>
                      <span className="text-emerald-400 font-semibold font-mono tabular-nums">0.82s (Good)</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-zinc-500">94% of visitors experience sub-1.2s hero paint.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>INP (Responsiveness)</span>
                      <span className="text-emerald-400 font-semibold font-mono tabular-nums">38ms (Good)</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-zinc-500">Zero main-thread blocking during user interactions.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>CLS (Visual Stability)</span>
                      <span className="text-emerald-400 font-semibold font-mono tabular-nums">0.01 (Good)</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-[99%] h-full bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-zinc-500">Zero unexpected layout shifts or content jumping.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AI Search Radar */}
            {activeTab === "airadar" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-xs text-zinc-500">Perplexity Citations</div>
                    <div className="text-lg font-semibold text-white mt-1 tabular-nums">1,940</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Top: /features</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-xs text-zinc-500">OpenAI SearchGPT</div>
                    <div className="text-lg font-semibold text-white mt-1 tabular-nums">1,215</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Top: /vs-google-analytics</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-xs text-zinc-500">ClaudeBot Scrapes</div>
                    <div className="text-lg font-semibold text-white mt-1 tabular-nums">420</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Indexed: /llms.txt</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06]">
                    <div className="text-xs text-zinc-500">Google Gemini Visits</div>
                    <div className="text-lg font-semibold text-white mt-1 tabular-nums">237</div>
                    <div className="text-[10px] text-zinc-400 font-mono">AEO direct citation</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Autonomous Incident Alerts */}
            {activeTab === "alerts" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-rose-500/25 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Crash Surge</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                        CRITICAL
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">5x Error Spike</div>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">/checkout • TypeError: null</p>
                    <div className="text-[10px] text-rose-400 flex items-center gap-1">
                      <Flame size={11} /> Milestone threshold triggered
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-amber-500/25 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">SEO &amp; AEO Audit</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                        WARNING
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">Missing &lt;title&gt;</div>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">/pricing/enterprise • Blank title</p>
                    <div className="text-[10px] text-amber-400 flex items-center gap-1">
                      <Search size={11} /> Automated optimization scan
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Desktop Alerts</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/[0.08] text-zinc-300 border border-white/[0.1]">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">Web Notifications</div>
                    <p className="text-[11px] text-zinc-400">Synthesized 587Hz chime</p>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Volume2 size={11} /> Zero audio file dependencies
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. KEY ARCHITECTURAL METRICS STRIP                           */}
      {/* ============================================================ */}
      <section className="py-12 border-y border-white/[0.08] bg-[#0c0d13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">3.1 KB</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Script Payload</div>
              <div className="text-[11px] text-zinc-400">15x smaller than Google Analytics 4</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">&lt; 2 ms</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Main-Thread Impact</div>
              <div className="text-[11px] text-zinc-400">Async defer non-blocking execution</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">100%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Cookieless Privacy</div>
              <div className="text-[11px] text-zinc-400">Zero cookie consent popups needed</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">0 s</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Ingestion Latency</div>
              <div className="text-[11px] text-zinc-400">Instant live edge streaming</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. BENTO GRID ARCHITECTURE (5 CORE PLATFORM ENGINES)         */}
      {/* ============================================================ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium">
            <Layers size={13} />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Four powerful observability engines in one platform.
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate bulky vendor libraries, annoying cookie consent popups, and delayed reporting with an observability engine built for modern speed.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bento Card 1: Core Web Vitals RUM (2-col span) */}
          <div className="md:col-span-2 p-6 sm:p-7 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] space-y-4 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-200">
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
              <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-medium">LCP (Loading)</div>
                <div className="text-xl font-semibold text-white tabular-nums">0.82 s</div>
                <div className="text-[10px] text-emerald-400">Good (&lt; 2.5s)</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-medium">INP (Response)</div>
                <div className="text-xl font-semibold text-white tabular-nums">38 ms</div>
                <div className="text-[10px] text-emerald-400">Good (&lt; 200ms)</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-medium">CLS (Stability)</div>
                <div className="text-xl font-semibold text-white tabular-nums">0.01</div>
                <div className="text-[10px] text-emerald-400">Good (&lt; 0.1)</div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Sub-3.2KB Payload */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] space-y-4 transition">
            <div className="w-9 h-9 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-200">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Sub-3.2KB Beacon</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                15x lighter than Google Analytics 4. Executes asynchronously in under 2ms with zero DOM blocking.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Google Analytics 4</span>
                <span className="text-zinc-500">48.5 KB</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-white">Open Analytics</span>
                <span className="text-emerald-400">3.1 KB</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Autonomous AI Search Radar */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] space-y-4 transition">
            <div className="w-9 h-9 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-200">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Autonomous AI Radar</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Real-time classification of citations, referrals, and crawler requests from OpenAI SearchGPT, Perplexity, Claude, and Gemini.
              </p>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-zinc-300">
                <span>PerplexityBot</span>
                <span className="text-emerald-400">2s ago</span>
              </div>
              <div className="p-2 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-zinc-300">
                <span>OAI-SearchBot</span>
                <span className="text-emerald-400">14s ago</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Incident Triage & Alerts */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] space-y-4 transition">
            <div className="w-9 h-9 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-200">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Incident &amp; Crash Alerts</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Repeated error detection (5x+), error velocity storm spikes, and native OS desktop alerts with Web Audio chimes.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Alert Threshold</span>
              <span className="text-zinc-200 font-mono font-semibold">&gt;= 5 occurrences</span>
            </div>
          </div>

          {/* Bento Card 5: 100% Cookieless Cryptographic Privacy */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] space-y-4 transition">
            <div className="w-9 h-9 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Cookieless Privacy</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Daily visitor hashes use HMAC-SHA-256 with an ephemeral salt purged every night at midnight UTC. Zero tracking cookies.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Cookie Banners</span>
              <span className="text-emerald-400 font-medium">100% Exempt</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. MULTI-FRAMEWORK CODE SWITCHER                             */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Integrates with your stack in under 60 seconds
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Embed directly in your HTML or integrate natively with modern frontend frameworks.
              </p>
            </div>

            {/* Framework Tabs */}
            <div className="flex items-center gap-1 bg-[#14161f] p-1 rounded-lg border border-white/[0.06] text-xs font-mono overflow-x-auto">
              {(["html", "nextjs", "react", "nuxt", "curl"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveSnippetTab(tab);
                    setCopiedSnippet(false);
                  }}
                  className={`px-3 py-1 rounded-md transition uppercase cursor-pointer ${activeSnippetTab === tab
                    ? "bg-white/[0.1] text-white font-medium"
                    : "text-zinc-400 hover:text-white"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Code Window */}
          <div className="relative rounded-xl bg-[#08090d] border border-white/[0.08] overflow-hidden">
            <div className="h-9 px-3.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-[11px] font-mono text-zinc-500 ml-2">
                  {activeSnippetTab === "html" ? "index.html" : activeSnippetTab === "nextjs" ? "app/layout.tsx" : activeSnippetTab === "react" ? "src/App.tsx" : activeSnippetTab === "nuxt" ? "nuxt.config.ts" : "Terminal"}
                </span>
              </div>

              <button
                type="button"
                onClick={copySnippet}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-medium text-zinc-200 hover:text-white transition cursor-pointer"
              >
                {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedSnippet ? "Copied" : "Copy Code"}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed max-h-[220px]">
              {currentSnippet}
            </pre>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. HEAD-TO-HEAD ARCHITECTURAL BENCHMARK                      */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Why teams are replacing Google Analytics 4
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Architectural comparison against legacy analytics scripts.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#111218] shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#14161f]">
                  <th className="p-4 text-zinc-400 font-semibold">Capability</th>
                  <th className="p-4 text-white font-semibold bg-white/[0.04]">Open Analytics</th>
                  <th className="p-4 text-zinc-400 font-medium">Google Analytics 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className="p-4 font-medium text-zinc-200">Script Payload Size</td>
                  <td className="p-4 text-emerald-400 font-semibold bg-white/[0.02]">3.1 KB (Brotli)</td>
                  <td className="p-4 text-zinc-500">48.5 KB (15x heavier)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-zinc-200">Cookie Consent Popups</td>
                  <td className="p-4 text-emerald-400 font-semibold bg-white/[0.02]">Zero required (100% exempt)</td>
                  <td className="p-4 text-zinc-500">Mandatory consent banner</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-zinc-200">Real User Monitoring (RUM)</td>
                  <td className="p-4 text-emerald-400 font-semibold bg-white/[0.02]">Native p75 LCP, INP, CLS, TTFB</td>
                  <td className="p-4 text-zinc-500">Not included natively</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-zinc-200">AI Search Crawler Attribution</td>
                  <td className="p-4 text-emerald-400 font-semibold bg-white/[0.02]">Autonomous AI Crawler Radar</td>
                  <td className="p-4 text-zinc-500">Unclassified or ignored</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-zinc-200">Incident &amp; Error Alerts</td>
                  <td className="p-4 text-emerald-400 font-semibold bg-white/[0.02]">Autonomous 5x Crash Alerts + OS Desktop Chimes</td>
                  <td className="p-4 text-zinc-500">No error tracking</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-zinc-200">Data Retention Window</td>
                  <td className="p-4 text-emerald-400 font-semibold bg-white/[0.02]">365 Days (Full 1-Year Window)</td>
                  <td className="p-4 text-zinc-500">2-month / 14-month cap</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium">
            <HelpCircle size={13} />
            <span>Questions &amp; Answers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Everything you need to know about privacy, script performance, and data boundaries.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl bg-[#111218] border border-white/[0.08] overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <ChevronRight
                    size={16}
                    className={`text-zinc-500 transition-transform shrink-0 ${isOpen ? "rotate-90 text-white" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FINAL CALL TO ACTION (OBSIDIAN CONSOLE)                    */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto">
            <Activity size={24} />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight max-w-lg mx-auto">
            Start collecting privacy-first telemetry in 60 seconds.
          </h2>

          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            No credit card required. Free tier includes 1 website with 10,000 events/month, Core Web Vitals RUM, and incident alerts.
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
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <span>Read Documentation</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 pt-2">
            <span>Free Tier Available</span>
            <span>•</span>
            <span>Zero Cookies</span>
            <span>•</span>
            <span>1-Line Setup</span>
          </div>
        </div>
      </section>
    </div>
  );
}

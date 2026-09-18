import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Zap,
  ShieldCheck,
  Bot,
  Flame,
  Bug,
  Globe,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Sparkles,
  Lock,
  Layers,
  Code2,
  Cpu,
  MousePointerClick,
  FileCheck2,
  Check,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Features | Modern Cookieless Web Observability & Telemetry Engine",
  description:
    "Explore Open Analytics features: Real User Monitoring (Core Web Vitals p75 LCP, INP, CLS), autonomous AI search crawler radar, behavioral rage click intelligence, automated error triage, and sub-3.2KB cookieless telemetry.",
  keywords: [
    "open analytics features",
    "core web vitals real user monitoring",
    "cookieless web analytics",
    "ai bot crawler radar",
    "rage click detection",
    "javascript error triage",
    "gdpr compliant analytics features",
    "inp lcp cls tracking",
    "answer engine optimization telemetry",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/features",
  },
  openGraph: {
    title: "Open Analytics Features | Core Web Vitals, AI Radar & Cookieless Observability",
    description:
      "All-in-one web analytics engine: sub-3.2KB beacon, Core Web Vitals, behavioral UX tracking, automated crash diagnosis, and AI bot radar.",
    url: `${baseUrl}/features`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Features | Web Observability & AI Radar",
    description: "Sub-3.2KB beacon, Core Web Vitals, behavioral UX tracking, and AI bot radar.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Features",
      item: `${baseUrl}/features`,
    },
  ],
};

const featureListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Open Analytics Platform Features",
  itemListElement: [
    {
      "@type": "SoftwareApplication",
      position: 1,
      name: "Real User Monitoring (Core Web Vitals)",
      description: "Automated real-world capture of p75 LCP, INP, and CLS across every page load.",
    },
    {
      "@type": "SoftwareApplication",
      position: 2,
      name: "Autonomous AI & LLM Search Radar",
      description: "Real-time visibility when ChatGPT, Perplexity, Claude, and Gemini crawl your web pages.",
    },
    {
      "@type": "SoftwareApplication",
      position: 3,
      name: "Behavioral UX & Rage Click Intelligence",
      description: "Detect frustrating UI friction points, rapid clicking, and dead interaction targets.",
    },
    {
      "@type": "SoftwareApplication",
      position: 4,
      name: "Automated Error Triage & Diagnostics",
      description: "360-degree JavaScript crash collection with intelligent root-cause grouping.",
    },
    {
      "@type": "SoftwareApplication",
      position: 5,
      name: "Sub-3.2KB Cookieless Telemetry Beacon",
      description: "Zero cookie banners required, 100% GDPR, CCPA, and PECR compliant with zero tracking cookies.",
    },
  ],
};

export default function FeaturesPage() {
  const dashboardUrl = getDashboardUrl("/");

  const featureModules = [
    {
      id: "rum",
      badge: "Real User Monitoring",
      title: "Automated Core Web Vitals (RUM)",
      tagline: "Measure the exact user experience your real visitors feel across mobile and desktop devices.",
      icon: Activity,
      color: "text-cyan-400",
      bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
      borderColor: "border-cyan-500/30",
      points: [
        {
          title: "Largest Contentful Paint (LCP)",
          desc: "Pinpoint slow hero images, delayed font rendering, and server TTFB bottlenecks with p75 accuracy.",
        },
        {
          title: "Interaction to Next Paint (INP)",
          desc: "Audit main-thread input lag on clicks, taps, and keyboard inputs with millisecond fidelity.",
        },
        {
          title: "Cumulative Layout Shift (CLS)",
          desc: "Catch visual jumping caused by unsized media, dynamic banners, or late-injected web fonts.",
        },
        {
          title: "Hardware & Network Profiling",
          desc: "Aggregate connection speed (4G, 5G, WiFi), device memory, and CPU core concurrency.",
        },
      ],
      stats: [
        { label: "Beacon Size", value: "< 3.2 KB" },
        { label: "Execution Time", value: "< 2 ms" },
        { label: "Sampling", value: "Real Visitors" },
      ],
    },
    {
      id: "ai-radar",
      badge: "Generative Engine Optimization (GEO)",
      title: "Autonomous AI & LLM Search Radar",
      tagline: "Track and measure how generative answer engines index and cite your web pages.",
      icon: Bot,
      color: "text-indigo-400",
      bgGradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
      borderColor: "border-indigo-500/30",
      points: [
        {
          title: "Perplexity AI & SearchGPT",
          desc: "Differentiate human referral traffic originating from generative answers versus regular search engines.",
        },
        {
          title: "LLM Bot Crawler Detection",
          desc: "Real-time logging when ClaudeBot, GPTBot, or Bytespider crawl your documentation or articles.",
        },
        {
          title: "AEO Citation Intelligence",
          desc: "Identify which pages are cited as authoritative sources in generative answers.",
        },
        {
          title: "Machine-Readable Endpoints",
          desc: "Built-in support for /llms.txt and /agents.md delivery to assist AI discovery.",
        },
      ],
      stats: [
        { label: "Bot Catalog", value: "Auto-Updated" },
        { label: "Classification", value: "Heuristic + IP" },
        { label: "Coverage", value: "All Major LLMs" },
      ],
    },
    {
      id: "ux",
      badge: "Behavioral Friction Intelligence",
      title: "Rage Click & Dead Click Detection",
      tagline: "Detect frontend friction before users file support tickets or abandon workflows.",
      icon: MousePointerClick,
      color: "text-rose-400",
      bgGradient: "from-rose-500/10 via-orange-500/5 to-transparent",
      borderColor: "border-rose-500/30",
      points: [
        {
          title: "Rage Click Alerts",
          desc: "Triggers when a visitor clicks the same element 3+ times in 800ms, indicating broken UI states.",
        },
        {
          title: "Dead Click Discovery",
          desc: "Identifies clicks on non-interactive elements that visitors mistakenly believe are clickable.",
        },
        {
          title: "Exact CSS Selector Capture",
          desc: "Captures tag names, classes, IDs, and inner text so frontend developers can find the exact culprit.",
        },
        {
          title: "Zero Heavy Video Recording",
          desc: "Captures behavioral friction signals mathematically with zero heavy DOM screen recordings.",
        },
      ],
      stats: [
        { label: "Detection Threshold", value: "3 clicks / 800ms" },
        { label: "Payload Overhead", value: "0 KB added" },
        { label: "Session Impact", value: "Zero lag" },
      ],
    },
    {
      id: "errors",
      badge: "Diagnostics & Resilience",
      title: "Automated Error Triage & AI Debugging",
      tagline: "Uncaught JavaScript exceptions grouped intelligently with AI repair prompts.",
      icon: Bug,
      color: "text-amber-400",
      bgGradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
      borderColor: "border-amber-500/30",
      points: [
        {
          title: "Unhandled Exception Capture",
          desc: "Automatically intercepts window.onerror and unhandledrejection events in production.",
        },
        {
          title: "Intelligent Stack Fingerprinting",
          desc: "Groups duplicate errors together so your team only triages unique root causes.",
        },
        {
          title: "Browser & OS Context",
          desc: "Correlates errors with specific browser versions, operating systems, and viewport sizes.",
        },
        {
          title: "AI Debug Prompts",
          desc: "Copy formatted prompts directly into ChatGPT or Claude to debug and write unit test fixes.",
        },
      ],
      stats: [
        { label: "Error Capture", value: "100% Uncaught" },
        { label: "Grouping", value: "Automated" },
        { label: "Setup", value: "Zero Config" },
      ],
    },
    {
      id: "privacy",
      badge: "Cryptographic Privacy",
      title: "100% Cookieless GDPR & PECR Exemption",
      tagline: "Mathematical privacy that completely eliminates annoying cookie consent banners.",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      borderColor: "border-emerald-500/30",
      points: [
        {
          title: "Zero Cookies & Zero Storage",
          desc: "Writes zero cookies, zero LocalStorage tokens, and zero persistent device fingerprinting hashes.",
        },
        {
          title: "24-Hour Rotating Cryptographic Salts",
          desc: "Hashes are generated with an ephemeral salt permanently purged every night at 00:00:00 UTC.",
        },
        {
          title: "Zero IP Storage",
          desc: "Raw IP addresses are processed in volatile memory for country lookup and immediately discarded.",
        },
        {
          title: "Full European Data Residency",
          desc: "European telemetry is processed and stored exclusively in EU data centers (Frankfurt & Amsterdam).",
        },
      ],
      stats: [
        { label: "Consent Banner", value: "Not Required" },
        { label: "Salt Rotation", value: "Every 24 Hours" },
        { label: "PII Storage", value: "0 Bytes" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={featureListSchema} />

      {/* Hero Header */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/5 blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Observability Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
          Complete Web Telemetry Built For{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Speed &amp; Privacy.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          Everything you need to audit real-world performance, detect UX friction, monitor AI search crawler traffic, and track conversions without tracking cookies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:via-sky-300 hover:to-indigo-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/docs/installation"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-sm transition border border-white/[0.1] flex items-center justify-center gap-2"
          >
            <Code2 size={16} className="text-cyan-400" />
            <span>Installation Guides</span>
          </Link>
        </div>
      </section>

      {/* Feature Modules Deep Dive */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {featureModules.map((mod, idx) => {
          const Icon = mod.icon;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={mod.id}
              id={mod.id}
              className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-b ${mod.bgGradient} border ${mod.borderColor} backdrop-blur-md shadow-xl transition-all`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text Content */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-xs font-semibold uppercase tracking-wider font-mono">
                    <Icon size={14} className={mod.color} />
                    <span>{mod.badge}</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      {mod.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      {mod.tagline}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {mod.points.map((pt) => (
                      <div key={pt.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <Check size={14} className={mod.color} />
                          <span>{pt.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {pt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metric Summary Panel */}
                <div className="lg:col-span-5">
                  <div className="p-6 sm:p-8 rounded-2xl bg-[#070b16] border border-white/[0.08] space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                          <Icon size={16} className={mod.color} />
                        </div>
                        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                          Module Specifications
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold uppercase">
                        Active
                      </span>
                    </div>

                    <div className="space-y-4">
                      {mod.stats.map((s) => (
                        <div key={s.label} className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{s.label}</span>
                          <span className="font-bold text-white font-mono">{s.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/[0.08]">
                      <a
                        href={dashboardUrl}
                        className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-white/[0.08] cursor-pointer"
                      >
                        <span>Inspect in Live Console</span>
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 relative overflow-hidden space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Supercharge Your Web Observability?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Get started in under 60 seconds with our sub-3.2KB universal snippet. No credit card required on the Free Starter plan.
          </p>
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
              Compare Plan Limits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

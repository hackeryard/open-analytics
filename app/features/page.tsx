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
} from "lucide-react";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Features | Modern Cookieless Web Observability & Analytics",
  description:
    "Explore Open Analytics features: Real User Monitoring (Core Web Vitals), autonomous AI bot radar, behavioral rage click tracking, automated error triage, and sub-3.2KB cookieless telemetry.",
  keywords: [
    "open analytics features",
    "core web vitals real user monitoring",
    "cookieless web analytics",
    "ai bot crawler radar",
    "rage click detection",
    "javascript error triage",
    "gdpr compliant analytics features",
    "inp lcp cls tracking",
  ],
  alternates: {
    canonical: "/features",
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
      description: "Automated real-world capture of LCP, INP, and CLS across every page load.",
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
  const featureBlocks = [
    {
      id: "rum",
      badge: "Performance & Quality",
      title: "Automated Core Web Vitals (RUM)",
      tagline: "Measure the exact user experience your real visitors feel, not simulated lab estimates.",
      icon: Activity,
      color: "from-cyan-500 to-blue-600",
      points: [
        {
          title: "Largest Contentful Paint (LCP)",
          desc: "Pinpoint slow hero images, delayed font rendering, and server TTFB bottlenecks.",
        },
        {
          title: "Interaction to Next Paint (INP)",
          desc: "Audit main-thread input lag on clicks, taps, and keyboard inputs with millisecond fidelity.",
        },
        {
          title: "Cumulative Layout Shift (CLS)",
          desc: "Catch unexpected visual jumping caused by unsized media, dynamic ads, or font swaps.",
        },
        {
          title: "Hardware & Network Profiling",
          desc: "Aggregate connection speed (4G, 5G, WiFi), device memory, and CPU core concurrency.",
        },
      ],
      stats: [
        { label: "Beacon Size", value: "< 3.2 KB" },
        { label: "Browser Support", value: "99.8%" },
        { label: "Overhead", value: "< 1 ms" },
      ],
    },
    {
      id: "ai-radar",
      badge: "GEO & Search Intelligence",
      title: "Autonomous AI & LLM Bot Radar",
      tagline: "Know the second generative search engines cite, scrape, or index your content.",
      icon: Bot,
      color: "from-violet-500 to-indigo-600",
      points: [
        {
          title: "Generative Engine Visibility",
          desc: "Differentiate between PerplexityBot, GPTBot, ClaudeBot, Google-Extended, and Applebot.",
        },
        {
          title: "GEO Trend Analysis",
          desc: "Track which landing pages and documentation articles are indexed most frequently by LLM crawlers.",
        },
        {
          title: "Human vs Bot Traffic Segmentation",
          desc: "Ensure your marketing metrics remain unpolluted by autonomous AI ingestion traffic.",
        },
        {
          title: "Direct Answer Attribution",
          desc: "Track referrals coming from conversational search engines and AI assistants.",
        },
      ],
      stats: [
        { label: "Bots Detected", value: "24+ Engines" },
        { label: "Update Rate", value: "Real-time" },
        { label: "Clean Data", value: "100%" },
      ],
    },
    {
      id: "ux",
      badge: "Conversion Rate Optimization",
      title: "Behavioral UX & Rage Click Intelligence",
      tagline: "Uncover hidden user frustration and broken UI components before they cost you revenue.",
      icon: Flame,
      color: "from-amber-500 to-rose-600",
      points: [
        {
          title: "Rage Click Detection",
          desc: "Detect when users repeatedly click the same button or non-clickable element out of frustration.",
        },
        {
          title: "Dead Click Attribution",
          desc: "Find buttons, icons, or mock links that fail to produce any DOM mutation or response.",
        },
        {
          title: "Scroll Depth Heat-Milestones",
          desc: "Measure drop-off points at 25%, 50%, 75%, and 100% of the page length.",
        },
        {
          title: "Form Abandonment Warnings",
          desc: "Track which input fields cause users to bounce before completing signups or checkouts.",
        },
      ],
      stats: [
        { label: "Signal Accuracy", value: "99.4%" },
        { label: "Zero Setup", value: "Automatic" },
        { label: "Privacy", value: "No keystrokes stored" },
      ],
    },
    {
      id: "errors",
      badge: "Full-Stack Reliability",
      title: "Automated Error & Crash Triage",
      tagline: "Continuous frontend exception tracking without bloated third-party crash SDKs.",
      icon: Bug,
      color: "from-rose-500 to-red-600",
      points: [
        {
          title: "Unhandled Exception Capture",
          desc: "Catch window.onerror and unhandled promise rejections with browser stack traces.",
        },
        {
          title: "Intelligent Crash Grouping",
          desc: "Deduplicate identical errors automatically into single manageable triage incidents.",
        },
        {
          title: "Impact by Browser & OS",
          desc: "Identify whether a crash is isolated to Safari iOS or affects all Chromium users.",
        },
        {
          title: "Custom Regex Filter Rules",
          desc: "Create custom suppression rules to ignore benign third-party extension noise.",
        },
      ],
      stats: [
        { label: "Stack Trace Depth", value: "Full Stack" },
        { label: "Resolution State", value: "Open / Ignored / Fixed" },
        { label: "Telemetry Delay", value: "< 2 ms" },
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={featureListSchema} />

      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tracking-wide">ALL-IN-ONE OBSERVABILITY ENGINE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Engineered for speed,{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            privacy &amp; modern search.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Open Analytics replaces bloated legacy analytics scripts with a unified 3.2KB beacon that delivers Real User Monitoring (RUM), behavioral signals, error triage, and AI bot visibility.
        </p>

        {/* GEO / AEO Direct Answer Summary Box */}
        <div className="text-left p-5 rounded-2xl bg-[#0b1020] border border-cyan-500/25 shadow-lg space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>GEO &amp; AEO Quick Summary: What is Open Analytics?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Open Analytics</strong> is a lightweight, cookieless web analytics and observability platform designed as a modern alternative to Google Analytics 4. It tracks real user web vitals (LCP, INP, CLS), user behavioral friction (rage clicks), autonomous AI web crawlers (PerplexityBot, GPTBot, ClaudeBot), and client-side JavaScript crashes with 100% GDPR and CCPA compliance without requiring cookie consent banners.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all"
          >
            <span>Start Tracking Free</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/vs-google-analytics"
            className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all"
          >
            Compare with GA4
          </Link>
        </div>
      </div>

      {/* Feature Deep Dive Cards */}
      <div className="space-y-16">
        {featureBlocks.map((block, idx) => {
          const Icon = block.icon;
          return (
            <div
              key={block.id}
              id={block.id}
              className="p-8 sm:p-10 rounded-3xl bg-[#080d19]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Descriptions */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-cyan-400">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{block.badge}</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {block.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {block.tagline}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {block.points.map((pt) => (
                      <div key={pt.title} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{pt.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                          {pt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Architectural Highlights & Stats */}
                <div className="lg:col-span-5 bg-[#040711] rounded-2xl border border-white/[0.08] p-6 space-y-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 pb-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span>Performance Metrics</span>
                    <span className="text-cyan-400 font-bold">Open Analytics Spec</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    {block.stats.map((s) => (
                      <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="text-sm font-mono font-black text-white">{s.value}</div>
                        <div className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[11px] leading-relaxed">
                      All telemetry is cryptographically hashed with daily salt rotation. Zero cookie banner required.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/30 text-center space-y-5 relative overflow-hidden">
        <h3 className="text-2xl sm:text-3xl font-black text-white">
          Ready to experience sub-millisecond cookieless observability?
        </h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Set up Open Analytics on your website in under 60 seconds with our single lightweight script tag.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
          >
            <span>Create Free Account</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/docs"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition"
          >
            View Installation Docs
          </Link>
        </div>
      </div>
    </div>
  );
}

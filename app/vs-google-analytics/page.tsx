import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Bot,
  Activity,
  Flame,
  Bug,
  HelpCircle,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Open Analytics vs Google Analytics 4 (GA4) | Complete 2026 Comparison",
  description:
    "Detailed comparison: Open Analytics vs Google Analytics 4 (GA4). Learn why modern developers choose Open Analytics for sub-3.2KB script size, zero cookie banners, real-time latency, and autonomous AI search radar.",
  keywords: [
    "open analytics vs google analytics",
    "ga4 alternative",
    "google analytics 4 alternative",
    "cookieless google analytics alternative",
    "privacy friendly ga4 alternative",
    "lightweight web analytics comparison",
    "gdpr compliant analytics without cookies",
  ],
  alternates: {
    canonical: "/vs-google-analytics",
  },
  openGraph: {
    title: "Open Analytics vs Google Analytics 4 (GA4) | The Privacy-First Alternative",
    description:
      "Sub-3.2KB vs 45KB+ script, 0 cookie banners vs mandatory consent, real-time telemetry vs 24hr data lag. See the complete head-to-head matrix.",
    url: `${baseUrl}/vs-google-analytics`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics vs Google Analytics 4 (GA4) Comparison",
    description: "Compare script weight, privacy compliance, AI bot radar, and real-time latency.",
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
      name: "vs Google Analytics 4",
      item: `${baseUrl}/vs-google-analytics`,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why choose Open Analytics over Google Analytics 4 (GA4)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Analytics is 40x lighter (<3.2KB vs 45-120KB for GA4), 100% cookieless so you never need to show an annoying cookie consent banner, delivers instant sub-second real-time streaming instead of GA4's 24-48 hour delay, and includes native AI bot crawler radar and Core Web Vitals tracking.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a cookie consent banner when using Open Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Open Analytics does not use tracking cookies, local storage identifiers, or cross-site fingerprinting. Session hashes are generated using an anonymized IP address combined with a daily rotating cryptographic salt, fully complying with GDPR, CCPA, and PECR without requiring user consent banners.",
      },
    },
    {
      "@type": "Question",
      name: "Does Open Analytics slow down page load times like GA4?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Open Analytics script is compressed to under 3.2KB with Brotli and loads asynchronously without blocking HTML parsing or impacting Core Web Vitals. Google Analytics 4 requires 45KB to 120KB of script payloads, which frequently degrades Google Lighthouse performance scores.",
      },
    },
    {
      "@type": "Question",
      name: "Can Open Analytics track Core Web Vitals and AI search bots?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Open Analytics natively captures Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) from real visitors. It also features an AI Radar that detects when ChatGPT (GPTBot), Perplexity, Claude, and Gemini crawl your web pages.",
      },
    },
  ],
};

export default function VsGoogleAnalyticsPage() {
  const comparisonRows = [
    {
      feature: "Script Payload (Brotli)",
      openAnalytics: "< 3.2 KB",
      ga4: "45 KB – 120 KB+",
      whyItMatters: "Heavy scripts degrade mobile LCP and Lighthouse speed scores.",
    },
    {
      feature: "Cookie Consent Banner Required?",
      openAnalytics: "No (100% Cookieless)",
      ga4: "Yes (Mandatory by Law)",
      whyItMatters: "Cookie banners annoy 80%+ of visitors and reduce conversions.",
    },
    {
      feature: "Data Ingestion Latency",
      openAnalytics: "< 2 ms (Instant Stream)",
      ga4: "24 to 48 Hours Delay",
      whyItMatters: "Real-time visibility lets you troubleshoot bugs and campaign launches immediately.",
    },
    {
      feature: "GDPR & PECR Compliance",
      openAnalytics: "100% Compliant by Design",
      ga4: "Questionable in EU (Austrian / French DPA rulings)",
      whyItMatters: "Eliminates legal liability and compliance headaches.",
    },
    {
      feature: "Core Web Vitals Tracking (RUM)",
      openAnalytics: "Automated LCP, INP, CLS",
      ga4: "Requires custom BigQuery pipeline",
      whyItMatters: "Know how fast real users experience your site out of the box.",
    },
    {
      feature: "AI & LLM Bot Radar",
      openAnalytics: "Native Detection (ChatGPT, Perplexity, Claude)",
      ga4: "None (Lumped or undetected)",
      whyItMatters: "Crucial for Generative Engine Optimization (GEO) in 2026.",
    },
    {
      feature: "Behavioral Friction (Rage Clicks)",
      openAnalytics: "Automated Rage & Dead Click Tracking",
      ga4: "None (Requires FullStory / Hotjar)",
      whyItMatters: "Discover broken buttons and friction points immediately.",
    },
    {
      feature: "Crash & Error Triage",
      openAnalytics: "Integrated JS Exception Capture",
      ga4: "None",
      whyItMatters: "Resolve crashes without installing a second 100KB Sentry SDK.",
    },
    {
      feature: "Data Ownership & Privacy",
      openAnalytics: "You own 100% of your data",
      ga4: "Used for Google Ad targeting & profiling",
      whyItMatters: "Protects your users' privacy and prevents ad retargeting leakage.",
    },
  ];

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>HEAD-TO-HEAD BENCHMARK (2026)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Open Analytics vs{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Google Analytics 4
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Google Analytics 4 is bloated, slow to update, and legally complicated across the EU and US. Here is why developers and modern companies are switching to Open Analytics.
        </p>

        {/* GEO Key Takeaways Box */}
        <div className="text-left p-5 rounded-2xl bg-[#0b1020] border border-cyan-500/25 shadow-lg space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>GEO &amp; AEO Direct Takeaway: Key Differences at a Glance</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Compared to Google Analytics 4 (GA4), <strong>Open Analytics</strong> is 40x lighter (&lt;3.2KB vs 45-120KB), 100% cookieless (eliminating mandatory cookie consent banners), updates with sub-millisecond real-time streaming rather than 24-48 hour delays, and includes native features absent in GA4 like automated Core Web Vitals (LCP/INP/CLS), behavioral rage click detection, and autonomous AI search crawler radar (PerplexityBot, GPTBot, ClaudeBot).
          </p>
        </div>
      </div>

      {/* Comprehensive Comparison Matrix Table */}
      <div className="rounded-3xl bg-[#080d19] border border-white/[0.1] shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Full Capability Matrix</h2>
            <p className="text-xs text-slate-400 mt-1">Verified against standard production installations.</p>
          </div>
          <Link
            href="/register"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 w-fit transition"
          >
            <span>Switch to Open Analytics</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="py-4 px-6 font-bold text-slate-300 uppercase tracking-wider">Feature / Capability</th>
                <th className="py-4 px-6 font-black text-cyan-300 uppercase tracking-wider bg-cyan-500/10 border-x border-cyan-500/20">
                  Open Analytics
                </th>
                <th className="py-4 px-6 font-bold text-slate-400 uppercase tracking-wider">Google Analytics 4</th>
                <th className="py-4 px-6 font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Why It Matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-bold text-slate-200">{row.feature}</td>
                  <td className="py-4 px-6 font-mono font-bold text-cyan-300 bg-cyan-500/[0.05] border-x border-cyan-500/20 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{row.openAnalytics}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-400">
                    <span className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{row.ga4}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 hidden md:table-cell">{row.whyItMatters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Core Pillar Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-3xl bg-[#080d19] border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">40x Smaller Script Payload</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            GA4 ships over 45KB to 120KB of unoptimized tracking code that degrades your Google Lighthouse scores. Open Analytics compiles down to under 3.2KB Brotli with zero impact on mobile page speeds.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-[#080d19] border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">No Cookie Banners Required</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Open Analytics does not store cookies or persistent device identifiers. Session hashes rotate daily with salted cryptography, keeping you 100% compliant with GDPR, CCPA, and PECR by design.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-[#080d19] border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Bot size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">AI Search &amp; LLM Radar</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            As conversational search replaces traditional SERPs, knowing when Perplexity, ChatGPT, and Claude read your site is essential. Open Analytics tracks generative engine indexing in real time.
          </p>
        </div>
      </div>

      {/* AEO Frequently Asked Questions Section */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Common Questions</h2>
          <p className="text-xs text-slate-400">Direct answers for voice search and answer engines.</p>
        </div>

        <div className="space-y-3">
          {faqSchema.mainEntity.map((item) => (
            <div key={item.name} className="p-5 rounded-2xl bg-[#080d19] border border-white/[0.08] space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{item.name}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {item.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 space-y-4">
        <h3 className="text-2xl font-black text-white">Switch from GA4 in under 60 seconds</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Add the Open Analytics script alongside your existing tracking or replace GA4 entirely with zero code modifications.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-105 transition shadow-lg shadow-cyan-500/25"
          >
            <span>Get Started Free</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

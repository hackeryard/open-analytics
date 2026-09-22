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
  Bug,
  HelpCircle,
  Gauge,
  Clock,
  Lock,
  Layers,
  Code2,
  TrendingUp,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Open Analytics vs Google Analytics 4 (GA4)",
  description:
    "Compare Open Analytics vs GA4: sub-3.2KB payload vs 45KB+, zero cookie consent banners, real-time sub-second telemetry, and autonomous AI search crawler radar.",
  keywords: [
    "open analytics vs google analytics",
    "ga4 alternative",
    "google analytics 4 alternative",
    "cookieless google analytics alternative",
    "privacy friendly ga4 alternative",
    "lightweight web analytics comparison",
    "gdpr compliant analytics without cookies",
    "real user monitoring vs ga4",
    "ai crawler tracking vs ga4",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/vs-google-analytics",
  },
  openGraph: {
    title: "Open Analytics vs Google Analytics 4: Technical Comparison",
    description:
      "Compare Open Analytics vs GA4: sub-3.2KB payload vs 45KB+, zero cookie consent banners, real-time sub-second telemetry, and autonomous AI search crawler radar.",
    url: `${baseUrl}/vs-google-analytics`,
    type: "article",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics vs Google Analytics 4 Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics vs Google Analytics 4: Technical Comparison",
    description:
      "Compare Open Analytics vs GA4: sub-3.2KB payload vs 45KB+, zero cookie consent banners, real-time sub-second telemetry, and autonomous AI search crawler radar.",
    images: [`${baseUrl}/og-image.png`],
  },
};

const breadcrumbSchema = {
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
      name: "vs Google Analytics",
      item: `${baseUrl}/vs-google-analytics`,
    },
  ],
};

const articleSchema = {
  "@type": "TechArticle",
  "@id": `${baseUrl}/vs-google-analytics/#article`,
  headline: "Open Analytics vs Google Analytics 4: Complete Technical Comparison",
  description:
    "Architectural and performance comparison between Open Analytics and Google Analytics 4 covering script payload, cookie consent, and real user monitoring.",
  url: `${baseUrl}/vs-google-analytics`,
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
    url: baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "Open Analytics",
    url: baseUrl,
  },
  inLanguage: "en-US",
};

const faqSchema = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do websites switch from Google Analytics 4 to Open Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Teams migrate to Open Analytics to eliminate slow script payloads, remove mandatory GDPR cookie consent banners, view real-time streaming telemetry with 0s lag, and monitor AI search engine traffic from SearchGPT, Perplexity, and Claude.",
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

const comparisonPageSchema = {
  "@context": "https://schema.org",
  "@graph": [breadcrumbSchema, articleSchema, faqSchema],
};

export default function VsGoogleAnalyticsPage() {
  const dashboardUrl = getDashboardUrl("/");

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
      whyItMatters: "Cookie popups lower conversion rates and create visitor fatigue.",
    },
    {
      feature: "Data Ingestion Latency",
      openAnalytics: "Sub-second (< 2s)",
      ga4: "24 – 48 Hour Delay",
      whyItMatters: "Immediate feedback is essential during product launches and deployments.",
    },
    {
      feature: "Autonomous AI Search Radar",
      openAnalytics: "Yes (SearchGPT, Perplexity, Claude)",
      ga4: "No (Grouped into Direct traffic)",
      whyItMatters: "Essential for modern Generative Engine Optimization (GEO) visibility.",
    },
    {
      feature: "Core Web Vitals Real User Monitoring (RUM)",
      openAnalytics: "Built-in p75 LCP, INP, CLS",
      ga4: "Requires manual BigQuery pipelines",
      whyItMatters: "Real visitor field performance directly drives Google search rankings.",
    },
    {
      feature: "Behavioral Friction (Rage & Dead Clicks)",
      openAnalytics: "Included Out-of-the-Box",
      ga4: "Not supported",
      whyItMatters: "Identifies broken buttons without invasive DOM video recorders.",
    },
    {
      feature: "Frontend JavaScript Crash Triage",
      openAnalytics: "Automated with AI Debug Prompts",
      ga4: "Requires manual custom event logging",
      whyItMatters: "Catch and repair production frontend bugs before users report them.",
    },
    {
      feature: "EU Data Sovereignty & GDPR Compliance",
      openAnalytics: "100% EU Data Residency (Frankfurt/AMS)",
      ga4: "Subject to Schrems II legal scrutiny",
      whyItMatters: "Guaranteed compliance against European cross-border data export fines.",
    },
    {
      feature: "Data Sampling on High-Traffic Sites",
      openAnalytics: "Zero Sampling (100% Raw Data)",
      ga4: "Aggressive statistical sampling applied",
      whyItMatters: "Guarantees 100% accurate reporting during traffic surges.",
    },
    {
      feature: "Custom Reverse-Proxy Adblock Bypass",
      openAnalytics: "Supported via 1 DNS CNAME",
      ga4: "Complex server-side GTM setup",
      whyItMatters: "Recovers 15% to 30% of telemetry lost to aggressive browser blockers.",
    },
  ];

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      <JsonLd data={comparisonPageSchema} />

      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 text-xs font-medium mb-8 transition shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Technical Benchmark:</span>
          <span>Architectural Comparison</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">2026 Audit</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.06]">
          Open Analytics vs Google Analytics 4 (GA4).
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          Why engineering and product teams are replacing bloated, complex Google Analytics 4 with Open Analytics: featherweight sub-3.2KB script, zero cookie banners, sub-second real-time streaming, and autonomous AI search radar.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/features"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
          >
            <span>Explore All Features</span>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LIGHTHOUSE PERFORMANCE IMPACT (MOBILE AUDIT)              */}
      {/* ============================================================ */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="p-6 sm:p-10 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Google Lighthouse Performance Impact (Mobile Audit)</h3>
            <p className="text-xs text-zinc-400">Measured on standard mobile 4G network throttling using identical Next.js application baselines.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Open Analytics Score */}
            <div className="p-6 rounded-xl bg-[#0e0f15] border border-emerald-500/30 text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold text-emerald-400 font-mono">
                100
              </div>
              <div>
                <div className="text-sm font-semibold text-white">With Open Analytics</div>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">Payload: 3.1 KB • Main Thread: &lt; 2 ms</div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero impact on First Contentful Paint (FCP) and zero execution delay on Interaction to Next Paint (INP).
              </p>
            </div>

            {/* Google Analytics 4 Score */}
            <div className="p-6 rounded-xl bg-[#0e0f15] border border-rose-500/30 text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-4 border-rose-400 flex items-center justify-center mx-auto text-3xl font-bold text-rose-400 font-mono">
                72
              </div>
              <div>
                <div className="text-sm font-semibold text-white">With Google Analytics 4 (GA4)</div>
                <div className="text-xs text-rose-400 font-mono mt-0.5">Payload: 84.6 KB • Main Thread: 180 ms</div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Heavy script parsing, tag manager waterfall requests, and cookie consent banner DOM injections degrade score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HEAD-TO-HEAD FEATURE MATRIX TABLE                         */}
      {/* ============================================================ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Detailed head-to-head feature matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            An architectural breakdown between Open Analytics and Google Analytics 4.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#111218] shadow-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0e0f15] text-zinc-300">
                <th className="py-4 px-6 font-semibold w-1/3 text-white">Feature / Capability</th>
                <th className="py-4 px-6 font-semibold text-emerald-400 w-1/3">Open Analytics</th>
                <th className="py-4 px-6 font-semibold text-zinc-400 w-1/3">Google Analytics 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-white">
                    <div>{row.feature}</div>
                    <div className="text-[11px] text-zinc-500 font-normal mt-0.5">{row.whyItMatters}</div>
                  </td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold font-mono">
                    <div className="flex items-center gap-1.5">
                      <Check size={14} className="shrink-0 text-emerald-400" />
                      <span>{row.openAnalytics}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-zinc-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <X size={14} className="shrink-0 text-rose-400" />
                      <span>{row.ga4}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. MIGRATION IN UNDER 60 SECONDS                             */}
      {/* ============================================================ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-6 sm:p-10 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Migrate from GA4 in under 60 seconds
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Switching is as simple as replacing your old Google Tag Manager snippet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] text-white font-mono font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="text-sm font-semibold text-white">Create Your Project</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Launch the dashboard and create your website property. You will receive a unique project ID instantly.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] text-white font-mono font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="text-sm font-semibold text-white">Paste The Single Tag</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Embed the &lt;3.2KB asynchronous snippet into your website&apos;s &lt;head&gt;. Zero additional dependencies required.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] text-white font-mono font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="text-sm font-semibold text-white">Delete The Cookie Banner</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Safely remove your invasive cookie consent banners. Your site is now 100% compliant with GDPR by architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BOTTOM CTA CONSOLE                                        */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto">
            <Activity size={24} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Stop losing 25% of your analytics traffic.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Eliminate cookie rejection rates and adblocker penalties. Start tracking 100% of your real visitors with Open Analytics.
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
              <span>See Transparent Pricing</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

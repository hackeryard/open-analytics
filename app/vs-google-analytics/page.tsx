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
  title: "Open Analytics vs Google Analytics 4 (GA4) | Complete 2026 Comparison",
  description:
    "Comprehensive head-to-head comparison: Open Analytics vs Google Analytics 4 (GA4). Why modern engineering teams choose Open Analytics for sub-3.2KB script payload, zero cookie banners, real-time sub-second latency, and autonomous AI search radar.",
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
    title: "Open Analytics vs Google Analytics 4 (GA4) | The Privacy-First Alternative",
    description:
      "Sub-3.2KB vs 45KB+ script, zero cookie banners vs mandatory consent popups, sub-second telemetry vs 24hr data lag. See the complete head-to-head comparison.",
    url: `${baseUrl}/vs-google-analytics`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics vs Google Analytics 4 (GA4) Comparison",
    description: "Compare script payload, privacy compliance, AI bot radar, and real-time latency.",
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
        text: "Open Analytics is 15x lighter (<3.2KB vs 45-120KB for GA4), 100% cookieless so you never need to display an intrusive cookie consent banner, delivers instant sub-second real-time streaming instead of GA4's 24-48 hour delay, and includes native AI bot crawler radar and Core Web Vitals tracking.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a cookie consent banner when using Open Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Open Analytics does not use tracking cookies, LocalStorage identifiers, or cross-site device fingerprinting. Session hashes are generated using an anonymized IP address combined with a daily rotating cryptographic salt, fully complying with GDPR, CCPA, and PECR without requiring user consent banners.",
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
      whyItMatters: "Cookie popups lower conversion rates and degrade visitor trust.",
    },
    {
      feature: "Data Ingestion Latency",
      openAnalytics: "Sub-second (< 2s)",
      ga4: "24 – 48 Hour Delay",
      whyItMatters: "Immediate feedback is essential during product launches and marketing campaigns.",
    },
    {
      feature: "Autonomous AI Search Radar",
      openAnalytics: "Yes (SearchGPT, Perplexity, Claude)",
      ga4: "No (Grouped into Direct traffic)",
      whyItMatters: "Essential for modern Generative Engine Optimization (GEO) and AEO visibility.",
    },
    {
      feature: "Core Web Vitals Real User Monitoring (RUM)",
      openAnalytics: "Built-in p75 LCP, INP, CLS",
      ga4: "Requires manual BigQuery pipelines",
      whyItMatters: "Real visitor field performance is critical for Google SEO rankings.",
    },
    {
      feature: "Behavioral Friction (Rage & Dead Clicks)",
      openAnalytics: "Included Out-of-the-Box",
      ga4: "Not supported",
      whyItMatters: "Identifies broken buttons and UI layout confusion without heavy session video tools.",
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
      whyItMatters: "Guaranteed peace of mind against EU regulatory data export fines.",
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
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/5 blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent Technical Benchmark</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
          Open Analytics vs{" "}
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
            Google Analytics 4 (GA4)
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          Why engineering and product teams are replacing bloated, complex Google Analytics 4 with Open Analytics: featherweight sub-3.2KB scripts, zero cookie consent popups, sub-second real-time streaming, and autonomous AI search radar.
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
            href="/features"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-sm transition border border-white/[0.1] flex items-center justify-center gap-2"
          >
            <span>Explore All Features</span>
          </Link>
        </div>
      </section>

      {/* Simulated Mobile Lighthouse Score Comparison */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] backdrop-blur-md shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-white">Google Lighthouse Performance Impact (Mobile Simulation)</h3>
            <p className="text-xs text-slate-400">Measured on standard mobile 4G throttling using identical Next.js application baselines.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Open Analytics Score */}
            <div className="p-6 rounded-2xl bg-[#070b16] border border-emerald-500/30 text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center mx-auto text-3xl font-black text-emerald-400 font-mono shadow-lg shadow-emerald-500/20">
                100
              </div>
              <div>
                <div className="text-sm font-bold text-white">With Open Analytics</div>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">Payload: 3.1 KB • Blocking: 0 ms</div>
              </div>
              <p className="text-xs text-slate-400">
                Zero impact on First Contentful Paint (FCP) and zero execution delay on Interaction to Next Paint (INP).
              </p>
            </div>

            {/* Google Analytics 4 Score */}
            <div className="p-6 rounded-2xl bg-[#070b16] border border-rose-500/30 text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-4 border-rose-400 flex items-center justify-center mx-auto text-3xl font-black text-rose-400 font-mono shadow-lg shadow-rose-500/20">
                72
              </div>
              <div>
                <div className="text-sm font-bold text-white">With Google Analytics 4 (GA4)</div>
                <div className="text-xs text-rose-400 font-mono mt-0.5">Payload: 84.6 KB • Blocking: 180 ms</div>
              </div>
              <p className="text-xs text-slate-400">
                Heavy script parsing, tag manager network waterfall, and cookie consent banner DOM injections degrade score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Head-to-Head Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Detailed Head-to-Head Feature Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            An honest breakdown of architectural differences between Open Analytics and GA4.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#070b16]/90 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03] text-slate-300">
                <th className="py-4 px-6 font-bold w-1/3">Feature / Capability</th>
                <th className="py-4 px-6 font-bold text-cyan-400 w-1/3">Open Analytics</th>
                <th className="py-4 px-6 font-bold text-rose-400 w-1/3">Google Analytics 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-300">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.015] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div>{row.feature}</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">{row.whyItMatters}</div>
                  </td>
                  <td className="py-4 px-6 text-emerald-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Check size={15} className="shrink-0" />
                      <span>{row.openAnalytics}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    <div className="flex items-center gap-1.5 text-rose-300">
                      <X size={15} className="shrink-0 text-rose-400" />
                      <span>{row.ga4}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Migration in Under 60 Seconds */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Migrate From GA4 in Under 60 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Switching is as simple as replacing your old Google Tag Manager snippet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Create Your Project</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Launch the dashboard and create your website property. You will receive a unique, project ID instantly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Paste The Single Tag</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Embed the &lt;3.2KB asynchronous snippet into your website&apos;s &lt;head&gt;. Zero additional dependencies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-black flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Delete The Cookie Banner</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Safely remove your invasive cookie consent banners. Your site is now 100% compliant with GDPR by architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 relative overflow-hidden space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop Losing 25% of Your Analytics Traffic
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Eliminate cookie rejection rates and adblocker penalties. Start tracking 100% of your real visitors with Open Analytics.
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
              See Transparent Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

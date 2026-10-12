import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  Bot,
  Bug,
  Server,
  Layers,
  Check,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/alternatives");

const breadcrumbSchema = generateBreadcrumbSchema("/alternatives");

const alternativesListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Web Analytics Platform Comparisons",
  description:
    "Comprehensive technical comparisons between Open Analytics and leading web analytics and observability platforms.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Open Analytics vs Google Analytics 4",
      url: "https://openanalytics.org.in/vs-google-analytics",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Open Analytics vs Plausible Analytics",
      url: "https://openanalytics.org.in/alternatives/plausible",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Open Analytics vs Umami",
      url: "https://openanalytics.org.in/alternatives/umami",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Open Analytics vs Matomo",
      url: "https://openanalytics.org.in/alternatives/matomo",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Open Analytics vs PostHog",
      url: "https://openanalytics.org.in/alternatives/posthog",
    },
  ],
};

const platforms = [
  {
    name: "Google Analytics 4 (GA4)",
    badge: "Big Tech Alternative",
    href: "/vs-google-analytics",
    description:
      "Eliminate heavy 45KB+ tracking libraries and mandatory cookie consent popups. Open Analytics delivers real-time sub-second telemetry with a 3.2KB payload.",
    scriptSize: "< 3.2 KB vs 45 KB+",
    cookies: "Zero cookies vs Mandatory consent",
    latency: "Sub-second vs 24-48h delay",
    rum: "Built-in p75 Vitals vs BigQuery setup",
  },
  {
    name: "Plausible Analytics",
    badge: "Lightweight Alternative",
    href: "/alternatives/plausible",
    description:
      "Both prioritize lightweight privacy, but Open Analytics includes built-in Core Web Vitals RUM, frontend JavaScript error logging, and autonomous AI search radar.",
    scriptSize: "< 3.2 KB vs < 1.0 KB",
    cookies: "100% Cookieless vs 100% Cookieless",
    latency: "Real-time vs Real-time",
    rum: "Full p75 Vitals & Errors vs None",
  },
  {
    name: "Umami Analytics",
    badge: "Self-Hosted Alternative",
    href: "/alternatives/umami",
    description:
      "Compare open-source self-hosted telemetry. Open Analytics provides integrated RUM field monitoring, automated rage-click detection, and AI crawler classification.",
    scriptSize: "< 3.2 KB vs < 3.0 KB",
    cookies: "100% Cookieless vs 100% Cookieless",
    latency: "Real-time vs Real-time",
    rum: "Native RUM & Error triage vs Basic metrics",
  },
  {
    name: "Matomo Analytics",
    badge: "Legacy On-Prem Alternative",
    href: "/alternatives/matomo",
    description:
      "Replace legacy PHP and MySQL database maintenance with a modern, high-throughput analytics engine featuring automated 1-year data retention and zero cookie friction.",
    scriptSize: "< 3.2 KB vs 22 KB+",
    cookies: "100% Cookieless vs Cookie-heavy default",
    latency: "Real-time vs Periodic cron",
    rum: "Native Web Vitals vs Paid plugin",
  },
  {
    name: "PostHog",
    badge: "Product Analytics Alternative",
    href: "/alternatives/posthog",
    description:
      "Avoid heavy client-side session recording payloads that slow down websites. Open Analytics captures vital UX friction (rage clicks) with featherweight performance.",
    scriptSize: "< 3.2 KB vs 65 KB+",
    cookies: "Cookieless vs Cookie/LocalStorage",
    latency: "Instant vs Batch queue",
    rum: "Lighthouse 100 vs Performance tax",
  },
];

export default function AlternativesHubPage() {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={alternativesListSchema} />

      <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
              <Scale className="w-3.5 h-3.5 text-zinc-400" />
              <span>Comparison Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
              Open-source web analytics and observability comparisons
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10 font-sans">
              Discover how Open Analytics compares to traditional analytics suites, lightweight counters, and complex product analytics tools across privacy, speed, and observability.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={dashboardUrl}
                className="px-6 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm font-sans"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/self-hosting"
                className="px-6 py-3 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors inline-flex items-center gap-2 font-sans"
              >
                <Server className="w-4 h-4 text-zinc-400" />
                <span>Self-Hosting Guide</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 px-6 border-b border-white/[0.08] bg-[#0e0f15]/40">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <Shield className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1 font-sans">Zero-Cookie Privacy</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Complies with GDPR, PECR, and CCPA out-of-the-box with rotating daily cryptographic salts.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <Zap className="w-5 h-5 text-amber-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1 font-sans">&lt;3.2KB Payload</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Asynchronous deferred script execution preserving perfect 100 Google Lighthouse scores.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <Activity className="w-5 h-5 text-cyan-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1 font-sans">Real User Monitoring</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Automated p75 measurement for LCP, INP, CLS, and TTFB from actual visitors.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <Bot className="w-5 h-5 text-indigo-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1 font-sans">AI Search Radar</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Autonomous classification of SearchGPT, ClaudeBot, and Perplexity ingestion telemetry.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Comparisons Grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                Head-to-Head Technical Breakdowns
              </h2>
              <p className="text-sm text-zinc-400 font-sans">
                Explore in-depth technical comparisons across payload size, data retention, and privacy models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181922] text-[11px] font-mono text-zinc-300 mb-4 border border-white/[0.06]">
                      <span>{platform.badge}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 font-sans group-hover:text-zinc-200 transition-colors">
                      {platform.name}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                      {platform.description}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-white/[0.06] mb-8 font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Payload:</span>
                        <span className="font-semibold text-white">{platform.scriptSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Cookies:</span>
                        <span className="font-semibold text-white">{platform.cookies}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Speed:</span>
                        <span className="font-semibold text-white">{platform.latency}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">RUM / UX:</span>
                        <span className="font-semibold text-white">{platform.rum}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={platform.href}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#0e0f15] border border-white/[0.08] text-xs font-semibold text-white text-center hover:bg-white hover:text-zinc-950 transition-colors inline-flex items-center justify-center gap-2 font-sans"
                  >
                    <span>Read Full Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

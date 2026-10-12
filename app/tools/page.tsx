import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  Link2,
  Bot,
  Gauge,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/tools");

const breadcrumbSchema = generateBreadcrumbSchema("/tools");

const toolsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Web Analytics and Observability Tools",
  description:
    "Collection of free developer and marketing tools for UTM campaign building, AI crawler indexing audits, and Core Web Vitals threshold testing.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Campaign URL & UTM Builder",
      url: "https://openanalytics.org.in/tools/utm-builder",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "AI Crawler & Robots.txt Tester",
      url: "https://openanalytics.org.in/tools/ai-crawler-checker",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Core Web Vitals Budget Calculator",
      url: "https://openanalytics.org.in/tools/core-web-vitals-checker",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Cookie & Consent Audit Calculator",
      url: "https://openanalytics.org.in/tools/cookie-audit",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Analytics Cost & Comparison Calculator",
      url: "https://openanalytics.org.in/tools/analytics-comparison",
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Analytics Event Debugger & Schema Validator",
      url: "https://openanalytics.org.in/tools/analytics-event-debugger",
    },
  ],
};

const tools = [
  {
    title: "Campaign URL & UTM Builder",
    description:
      "Build standardized, clean marketing links with custom utm_source, utm_medium, and utm_campaign tags. Features 1-click clipboard copy and preset platform tags.",
    href: "/tools/utm-builder",
    badge: "Marketing Utility",
    icon: Link2,
    highlights: ["Quick source/medium presets", "Instant URL validation", "1-click clipboard copy"],
  },
  {
    title: "Analytics Cost Comparison Calculator",
    description:
      "Benchmark monthly subscription costs, tracker script weights, and feature limits between Open Analytics, Google Analytics 4, Plausible, PostHog, and Matomo.",
    href: "/tools/analytics-comparison",
    badge: "Cost Benchmark",
    icon: Wrench,
    highlights: ["Interactive volume slider", "6 platform cost matrices", "Annual savings estimate"],
  },
  {
    title: "AI Crawler & Robots.txt Tester",
    description:
      "Audit and configure access rules for SearchGPT, ClaudeBot, and PerplexityBot. Generates production-ready robots.txt rules and /llms.txt AI discovery manifests.",
    href: "/tools/ai-crawler-checker",
    badge: "AI & GEO Utility",
    icon: Bot,
    highlights: ["Toggle 8 top AI crawlers", "Generates /llms.txt manifest", "Production robots.txt output"],
  },
  {
    title: "Analytics Event Debugger & Schema",
    description:
      "Interactive telemetry event sandbox. Test property typing, inspect payload byte size against 16KB limits, verify PII redaction rules, and generate code snippets.",
    href: "/tools/analytics-event-debugger",
    badge: "Developer Tool",
    icon: Zap,
    highlights: ["Interactive property builder", "16KB byte limit meter", "Vanilla JS, React, cURL"],
  },
  {
    title: "Core Web Vitals Budget Calculator",
    description:
      "Interactive Google Page Experience simulator. Benchmark LCP, INP, and CLS thresholds against Google p75 field targets with actionable engineering advice.",
    href: "/tools/core-web-vitals-checker",
    badge: "Performance Engineering",
    icon: Gauge,
    highlights: ["Interactive p75 threshold sliders", "Overall pass/fail audit", "Google ranking impact"],
  },
  {
    title: "Cookie & Privacy Consent Audit",
    description:
      "Audit third-party script cookies, calculate GDPR consent banner requirements, and calculate conversion rate improvements from switching to cookieless telemetry.",
    href: "/tools/cookie-audit",
    badge: "Privacy Compliance",
    icon: Shield,
    highlights: ["Third-party cookie auditor", "GDPR banner requirement check", "Projected conversion gain"],
  },
];

export default function ToolsHubPage() {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={toolsListSchema} />

      <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
              <Wrench className="w-3.5 h-3.5 text-zinc-400" />
              <span>Free Developer Utilities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
              Free Web Analytics &amp; Observability Tools
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-sans">
              Stand-alone browser utilities for developers, marketers, and webmasters. 100% free, execute locally in your browser, and require no account creation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={dashboardUrl}
                className="px-6 py-3.5 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm font-sans"
              >
                <span>Launch Full Platform</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Tools Cards Grid */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#0e0f15] border border-white/[0.08] flex items-center justify-center text-white group-hover:text-emerald-400 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                          {tool.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 font-sans group-hover:text-zinc-200 transition-colors">
                        {tool.title}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                        {tool.description}
                      </p>

                      <ul className="space-y-2 pt-4 border-t border-white/[0.06] mb-8 font-sans text-xs text-zinc-300">
                        {tool.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-zinc-400">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={tool.href}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#0e0f15] border border-white/[0.08] text-xs font-semibold text-white text-center hover:bg-white hover:text-zinc-950 transition-colors inline-flex items-center justify-center gap-2 font-sans"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

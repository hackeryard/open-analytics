"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Zap,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Bot,
  Bell,
  Terminal,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function DocsOverviewClientView() {
  const { activeProjectId } = usePlatform();
  const [copied, setCopied] = useState(false);
  const projectId = activeProjectId || "open_prj_your_key";
  const snippet = `<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="${projectId}"></script>`;

  const onCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modules = [
    {
      title: "Alerts & Incident Engine",
      badge: "v3.6",
      desc: "Autonomous telemetry anomaly triggers (5x repeated error spikes, error storms, SEO/AEO audits) with native OS desktop alerts and granular suppression rules.",
      href: "/docs/alerts",
      icon: Bell,
    },
    {
      title: "Core Web Vitals & RUM",
      badge: "Performance",
      desc: "Field measurement of Google Core Web Vitals (p75 LCP, INP, CLS, FCP, TTFB) with hardware & network connection profiling across real user sessions.",
      href: "/docs/web-vitals",
      icon: Activity,
    },
    {
      title: "SEO & AI Crawler Radar",
      badge: "AEO / GEO",
      desc: "Real-time edge detection and attribution of LLM search crawlers including OpenAI SearchGPT, PerplexityBot, ClaudeBot, Bytespider, and Google Gemini.",
      href: "/docs/seo-aeo",
      icon: Bot,
    },
    {
      title: "Installation Guides",
      badge: "Frameworks",
      desc: "Guides and SDK snippets for Next.js App Router, React SPA, Vue/Nuxt, Webflow, WordPress, Shopify, and plain HTML applications.",
      href: "/docs/installation",
      icon: Code2,
    },
    {
      title: "Testing & Verification",
      badge: "DevOps",
      desc: "Automated telemetry smoke tests, curl commands, and end-to-end ingestion verification scripts to confirm zero-loss event delivery.",
      href: "/docs/verification",
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-4">
      {/* Overview Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium">
          <Zap size={12} className="text-white" />
          <span>Universal 1-Line Web Observability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Open Analytics Documentation
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
          Open Analytics is a standalone, developer-first web observability platform engineered to capture Real User Monitoring (Core Web Vitals), behavioral UX friction signals, autonomous AI crawler radar, and 360-degree error triage with zero tracking cookies.
        </p>
      </div>

      {/* 1-Minute Universal Quickstart Card */}
      <div className="p-6 sm:p-8 bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white font-mono font-bold text-xs">
              1
            </div>
            <h2 className="text-lg font-bold text-white">1-Minute Universal Quickstart</h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Zero Configuration Required</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Paste this single tag into the <code className="text-white font-mono bg-[#181922] px-1.5 py-0.5 rounded border border-white/[0.06]">&lt;head&gt;</code> of any HTML document, Next.js layout, React app, or backend application:
        </p>

        <div className="relative bg-[#0e0f15] border border-white/[0.06] rounded-xl p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
          <pre className="pr-12"><code>{snippet}</code></pre>
          <button
            onClick={onCopy}
            className="absolute right-3 top-3 p-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition cursor-pointer"
            title="Copy script tag"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 size={14} />
            <span>Pre-filled with active project: {projectId}</span>
          </div>
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline transition"
          >
            <span>See Next.js, React, Vue &amp; Backend Guides</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Observability Modules Directory */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
            Platform Capabilities
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Observability &amp; Incident Modules</h2>
          <p className="text-xs text-zinc-400">
            Explore complete technical guides and implementation references for each subsystem:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="p-5 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] transition group space-y-3 shadow-sm block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 transition">
                        {m.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/80 text-zinc-300">
                    {m.badge}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {m.desc}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-white pt-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Guide</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <h2 className="text-sm font-bold text-white">3-Tier Subdomain &amp; Privacy Architecture</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-1.5">
            <span className="font-semibold text-white font-mono">1. Main Domain</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              `openanalytics.org.in` is dedicated strictly to high-speed marketing, comparisons, documentation, and SEO. Zero authentication cookies or tracking scripts.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-1.5">
            <span className="font-semibold text-white font-mono">2. Dashboard Subdomain</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              `dashboard.openanalytics.org.in` hosts the authenticated workspace, real-time event feeds, project governance, and notifications hub.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-1.5">
            <span className="font-semibold text-white font-mono">3. API Telemetry Subdomain</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              `api.openanalytics.org.in` delivers the edge script `/open.js` and serves high-throughput versioned endpoints (`/v1/collect`, `/v1/error`).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Flame,
  Bug,
  Bell,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function DocsOverviewPage() {
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
      badge: "New in v3.5",
      desc: "Autonomous telemetry anomaly triggers (5x repeated error spikes, error storms, SEO/AEO audits) with native OS desktop alerts and granular suppression rules.",
      href: "/docs/alerts",
      icon: Bell,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      title: "Core Web Vitals & RUM",
      badge: "Performance",
      desc: "Field measurement of Google Core Web Vitals (p75 LCP, INP, CLS, FCP, TTFB) with hardware & network connection profiling across real user sessions.",
      href: "/docs/web-vitals",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "SEO & AI Crawler Radar",
      badge: "AEO / GEO",
      desc: "Real-time edge detection and attribution of LLM search crawlers including OpenAI SearchGPT, PerplexityBot, ClaudeBot, Bytespider, and Google Gemini.",
      href: "/docs/seo-aeo",
      icon: Bot,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Installation Guides",
      badge: "Frameworks",
      desc: "Guides and SDK snippets for Next.js App Router, React SPA, Vue/Nuxt, Webflow, WordPress, Shopify, and plain HTML applications.",
      href: "/docs/installation",
      icon: Code2,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Testing & Verification",
      badge: "DevOps",
      desc: "Automated telemetry smoke tests, curl commands, and end-to-end ingestion verification scripts to confirm zero-loss event delivery.",
      href: "/docs/verification",
      icon: Terminal,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Overview Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Zap size={13} />
          <span>Universal 1-Line Web Observability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Open Analytics Documentation
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Open Analytics is a standalone, enterprise-grade web analytics and observability engine built to capture Real User Monitoring (Core Web Vitals), hardware diagnostics, behavioral UX signals, autonomous AI crawler traffic, autonomous incident alerting, and 360° automated error triage with zero framework lock-in.
        </p>
      </div>

      {/* 1-Minute Universal Quickstart Card */}
      <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
              1
            </div>
            <h2 className="text-lg font-black text-foreground">1-Minute Universal Quickstart</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Zero Configuration Required</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste this single tag into the <code className="text-cyan-400 font-mono bg-muted/60 px-1 py-0.5 rounded">&lt;head&gt;</code> of any HTML document, Next.js layout, React app, WordPress template, or backend application:
        </p>

        <div className="relative bg-[#07090e] border border-border rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          <pre className="pr-12"><code>{snippet}</code></pre>
          <button
            onClick={onCopy}
            className="absolute right-3 top-3 p-2 rounded-xl bg-muted/60 hover:bg-muted text-slate-300 hover:text-white transition cursor-pointer"
            title="Copy script tag"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 size={14} />
            <span>Pre-filled with active project: {projectId}</span>
          </div>
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>See Next.js, React, Vue & Backend Guides</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Observability Modules Directory */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Platform Capabilities
          </div>
          <h2 className="text-2xl font-black text-foreground">Observability & Incident Modules</h2>
          <p className="text-xs text-muted-foreground">
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
                className="p-5 rounded-2xl bg-card border border-border hover:border-cyan-500/40 transition group space-y-3 shadow-xs block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${m.bgColor} border ${m.borderColor} flex items-center justify-center ${m.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-cyan-400 transition">
                        {m.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    {m.badge}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>

                <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 pt-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Guide</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <div className="p-6 rounded-3xl bg-muted/20 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h2 className="text-sm font-bold text-foreground">3-Tier Subdomain & Privacy Architecture</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-cyan-400 font-mono">1. Main Domain</span>
            <p className="text-muted-foreground leading-relaxed">
              `openanalytics.org.in` is dedicated strictly to high-speed marketing, comparisons, documentation, and SEO. Zero authentication cookies or tracking scripts.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-cyan-400 font-mono">2. Dashboard Subdomain</span>
            <p className="text-muted-foreground leading-relaxed">
              `dashboard.openanalytics.org.in` hosts the authenticated workspace, real-time event feeds, project governance, and notifications hub.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-cyan-400 font-mono">3. API Telemetry Subdomain</span>
            <p className="text-muted-foreground leading-relaxed">
              `api.openanalytics.org.in` delivers the edge script `/open.js` and serves high-throughput versioned endpoints (`/v1/collect`, `/v1/error`).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellOff,
  AlertTriangle,
  Flame,
  Search,
  Bot,
  Activity,
  MousePointerClick,
  Volume2,
  Sliders,
  Shield,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  ArrowRight,
  ExternalLink,
  Laptop,
  Radio,
  Zap,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function AlertsDocsPage() {
  const { activeProjectId } = usePlatform();
  const projectId = activeProjectId || "prj_production_app";
  const [copiedCode, setCopiedCode] = useState(false);

  const alertCategories = [
    {
      id: "error_repeated",
      name: "Repeated Error Spikes",
      type: "Real-Time Telemetry",
      severity: "critical",
      threshold: ">= 5 identical occurrences",
      desc: "Triggers high-priority alerts when identical runtime exceptions recur 5 or more times within a sliding window. Progressive milestone brackets notify teams at 10x, 25x, 50x, and 100x+ frequency.",
      icon: Flame,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      id: "error_storm",
      name: "Error Velocity Storms",
      type: "Rate Ingestion Surge",
      severity: "critical",
      threshold: "> 10 errors / 5 minutes",
      desc: "Catastrophic error storm detection that activates when error velocity spikes sharply, indicating broken production deployments, invalid third-party scripts, or API gateway downtime.",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      id: "seo_unoptimized",
      name: "SEO Missing Title Audits",
      type: "Automated Site Scan",
      severity: "warning",
      threshold: "Missing or empty <title>",
      desc: "Scans indexed landing pages and routes for missing, blank, or placeholder document titles that negatively impact search engine indexability and social media metadata previews.",
      icon: Search,
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
    },
    {
      id: "aeo_unoptimized",
      name: "AEO Low Dwell Friction",
      type: "Behavioral Retention",
      severity: "warning",
      threshold: "Average dwell < 10s on content routes",
      desc: "Identifies answer engine routes where visitors immediately bounce without engaging, signaling misleading headings, slow initial rendering, or content mismatch for AI search queries.",
      icon: Bot,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      id: "geo_radar",
      name: "GEO AI Citation Radar",
      type: "Generative Engine Audit",
      severity: "info",
      threshold: "Citation readiness score < 50%",
      desc: "Monitors readiness for generative search engines (OpenAI SearchGPT, Perplexity, ClaudeBot, Gemini) and notifies teams when crawler visibility or structured citation drops below benchmark.",
      icon: Radio,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      id: "web_vitals",
      name: "Core Web Vitals Degradation",
      type: "RUM Performance Threshold",
      severity: "warning",
      threshold: "p75 INP > 500ms or LCP > 4.0s",
      desc: "Continuous field monitoring of real visitor experience. Generates incident tickets when 75th-percentile interaction responsiveness (INP) or loading times (LCP) slip into the poor threshold.",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "rage_clicks",
      name: "Behavioral Rage Click Hotspots",
      type: "UX Friction Telemetry",
      severity: "warning",
      threshold: ">= 3 rapid taps within 500ms and 40px",
      desc: "Captures rapid, repeated tapping on broken buttons, stalled links, or unresponsive elements. Groups frustrated sessions by DOM selector to accelerate frontend bug remediation.",
      icon: MousePointerClick,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  const apiSnippet = `// Configure project alert rules & suppression filters via REST API
const res = await fetch("/api/projects/${projectId}/alert-rules", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "add_rule",
    rule: {
      id: "rule_suppress_staging",
      name: "Ignore Staging Pathnames",
      type: "all",
      matchField: "route",
      matchType: "starts_with",
      pattern: "/staging",
      enabled: true,
    }
  })
});
const { alertSettings } = await res.json();`;

  const copyCode = () => {
    navigator.clipboard.writeText(apiSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-12 max-w-7xl">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-semibold">
          <Bell size={13} />
          <span>Real-Time Incident Triage &amp; Observability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          Alerts &amp; Incident Engine
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Open Analytics incorporates an autonomous, real-time telemetry anomaly engine that automatically monitors crash spikes, Core Web Vitals degradation, search crawler readiness, and user frustration without requiring manual query configurations.
        </p>
      </div>

      {/* Quick Links / Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Flame size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white">Autonomous Anomaly Radar</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Continuously evaluates inbound telemetry streams to trigger alerts on repeated crashes (5x+), error storms, and dead ends.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Volume2 size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white">Native OS Desktop Alerts</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Browser Notifications API with dual-tone Web Audio synthesized chimes and 45-second background tab synchronization.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <BellOff size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white">Granular Ignore Rules</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mute entire notification types or define regex and substring pattern rules across error messages, titles, and route paths.
          </p>
        </div>
      </div>

      {/* Section 1: The 7 Autonomous Incident Detection Categories */}
      <section className="space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
            Telemetry Heuristics
          </div>
          <h2 className="text-2xl font-semibold text-white">7 Autonomous Incident Types</h2>
          <p className="text-xs text-zinc-400">
            Each anomaly is evaluated against verified historical baselines and assigned an automated severity level:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-5 rounded-xl bg-[#111218] border border-white/[0.08] space-y-3 hover:border-white/[0.14] transition-colors shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg ${cat.bgColor} border ${cat.borderColor} flex items-center justify-center ${cat.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                      <span className="text-[11px] text-zinc-500 font-mono">{cat.type}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${
                      cat.severity === "critical"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : cat.severity === "warning"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {cat.severity}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{cat.desc}</p>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Threshold:</span>
                  <span className="text-zinc-300 font-medium">{cat.threshold}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Native OS Desktop Notifications & Web Audio Chimes */}
      <section className="p-6 sm:p-8 rounded-xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
            <Laptop size={13} />
            <span>Native Operating System Integration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Desktop Notifications &amp; Synthesized Audio Chimes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Engineering and DevOps teams cannot afford to stare at an open browser tab 24/7. Open Analytics integrates directly with the native operating system desktop notification center:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Background Tab Synchronization</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              PlatformContext executes an automated 45-second background sync poll. If a repeated error spike or storm occurs while your dashboard tab is minimized, an OS desktop alert appears instantly.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Synthesized Web Audio Engine</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dual-tone audible chimes (D5 587.33 Hz transitioning smoothly to A5 880.00 Hz) are generated dynamically using the native browser Web Audio API oscillator, requiring 0 external MP3 downloads.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>1-Click Deep Navigation</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Clicking any desktop alert immediately focuses your browser window and routes directly to the affected crash trace (`/errors`), SEO report (`/seo`), or incident summary (`/notifications`).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Automated Permission Prompt Banner</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The floating in-app prompt banner (`BrowserNotificationPrompt.tsx`) seamlessly handles browser gesture requirements, requesting permissions politely with instant session snooze options.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Granular Ignore & Suppression Rules Engine */}
      <section className="space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400">
            Alert Noise Reduction
          </div>
          <h2 className="text-2xl font-semibold text-white">Granular Ignore &amp; Suppression Rules</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Eliminate alert fatigue by suppressing known staging issues, benign third-party analytics script warnings, or specific development routes before notifications are written to the database:
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-5 shadow-xs">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Two-Tier Suppression Architecture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2">
                <span className="font-semibold text-white block">1. General Type Muting</span>
                <p className="text-zinc-400 leading-relaxed">
                  Toggle on or off any of the 7 general notification categories across the entire project. For example, turn off SEO title audits during initial site construction.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2">
                <span className="font-semibold text-white block">2. Custom Pattern Rules</span>
                <p className="text-zinc-400 leading-relaxed">
                  Match against specific route pathnames (e.g., <code className="text-zinc-300 font-mono bg-[#181922] px-1 py-0.5 rounded border border-white/[0.06]">/staging</code>), error messages, or alert titles using contains, exact, prefix, or regular expressions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">1-Click Inline Mute Menus</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every alert card in the Notification Center popover and `/notifications` dashboard features an interactive <code className="text-zinc-300 font-mono bg-[#181922] px-1 py-0.5 rounded border border-white/[0.06]">BellOff</code> menu. With a single click, engineers can mute the notification type, silence all alerts on the affected route, or suppress the specific incident signature permanently.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: REST API Reference & Configuration */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
            Developer Integration
          </div>
          <h2 className="text-2xl font-semibold text-white">Alert Rules REST API</h2>
          <p className="text-xs text-zinc-400">
            Programmatically configure thresholds and manage ignore rules via the project API:
          </p>
        </div>

        <div className="relative bg-[#090a0f] border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
          <pre className="pr-12"><code>{apiSnippet}</code></pre>
          <button
            type="button"
            onClick={copyCode}
            className="absolute right-3 top-3 p-2 rounded-lg bg-[#111218] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy API snippet"
          >
            {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-white">Explore Notifications Dashboard</div>
            <p className="text-[11px] text-zinc-400">
              View active incidents, run optimization scans, and manage project alert rules in real time.
            </p>
          </div>
          <a
            href="https://dashboard.openanalytics.org.in/notifications"
            className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Open Notification Hub</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}

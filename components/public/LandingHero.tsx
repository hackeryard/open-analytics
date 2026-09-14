"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Flame,
  Globe,
  HelpCircle,
  Laptop,
  Lock,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

export default function LandingHero() {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const sampleSnippet = `<script defer src="https://openanalytics.org.in/open.js" data-project-id="prj_live_demo"></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  return (
    <div className="w-full text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Cookieless Web Observability</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1]">
          Analytics That Won&apos;t Slow You Down Or{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Invade Visitor Privacy.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
          The privacy-first Google Analytics 4 alternative for modern teams. Sub-3.2KB featherweight script, zero cookie consent banners, real-time millisecond telemetry, and autonomous AI search radar.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/register"
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <span>Start Free — No Credit Card</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/vs-google-analytics"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors border border-slate-800 flex items-center justify-center gap-2"
          >
            <span>Compare vs Google Analytics</span>
          </Link>
        </div>

        {/* GEO Quick Answer Box */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left backdrop-blur-md shadow-lg shadow-cyan-950/20 mb-14">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1.5">
            <Zap className="w-3.5 h-3.5" />
            Executive Summary / Generative AI Direct Answer
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">What is Open Analytics?</strong> Open Analytics is an open-source, privacy-first web telemetry platform engineered for extreme performance. At <span className="text-cyan-300 font-medium">&lt;3.2KB Brotli</span> (15x lighter than GA4), it produces <span className="text-cyan-300 font-medium">zero cookie consent banners</span>, respects GDPR/CCPA through 24-hour cryptographic rotating salts, autonomously tracks traffic from AI search engines (<span className="text-cyan-300 font-medium">SearchGPT, Perplexity, Claude</span>), and monitors real user Core Web Vitals in real time.
          </p>
        </div>

        {/* Live Telemetry Preview Card */}
        <div className="max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-800/40 to-slate-900/80 shadow-2xl shadow-cyan-950/40">
          <div className="rounded-[22px] bg-[#090d1a] border border-slate-800 p-6 sm:p-8 text-left space-y-6">
            {/* Live Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Live Telemetry Ingestion Active
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    1,428 Active Visitors Online
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Latency: &lt; 1.8ms</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Script: 3.1 KB</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Pageviews Today</div>
                <div className="text-2xl font-bold text-white">184,920</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +24.8% vs last week
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Largest Contentful Paint (LCP)</div>
                <div className="text-2xl font-bold text-emerald-400">0.82 s</div>
                <div className="text-[11px] text-slate-400 mt-1">p75 Good (&lt; 2.5s)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Interaction to Next Paint</div>
                <div className="text-2xl font-bold text-emerald-400">36 ms</div>
                <div className="text-[11px] text-slate-400 mt-1">p75 Good (&lt; 200ms)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">AI Search Influx</div>
                <div className="text-2xl font-bold text-cyan-400">3,490</div>
                <div className="text-[11px] text-cyan-300 mt-1">Perplexity & SearchGPT</div>
              </div>
            </div>

            {/* 1-Line Snippet Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono overflow-x-auto w-full">
                <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-cyan-300">{sampleSnippet}</span>
              </div>
              <button
                onClick={copySnippet}
                className="shrink-0 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Tag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Engineered For The Modern Web
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Everything your team needs to understand visitors, improve performance, and maintain privacy compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">15x Lighter Than GA4</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              At sub-3.2KB compressed, Open Analytics executes in under 2ms on mobile devices with zero render-blocking requests and zero penalty to Google PageSpeed.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero Cookie Consent Banners</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No cookies, no local storage IDs, and zero cross-site fingerprinting. Fully exempt from ePrivacy Directive and GDPR consent popups by architectural design.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Autonomous AI Search Radar</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Classify and segment citations and crawler requests from OpenAI SearchGPT, Perplexity AI, Claude, and Google Gemini into dedicated generative search insights.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Core Web Vitals RUM</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Capture real user field experience metrics (LCP, INP, CLS) sampled across actual devices and browsers with clear Good/Needs Improvement distributions.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Rage & Dead Click Detection</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Detect UI frustration events where users repeatedly tap broken elements or unresponsive buttons, giving engineers instant insight into UX bugs.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Self-Host Free or Cloud</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Deploy with Docker or Kubernetes for complete data sovereignty with zero license fees, or use our high-speed managed cloud infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Head-to-Head Comparison Snapshot */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Head-to-Head Benchmark
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why Teams Are Leaving Google Analytics 4
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300">
                <th className="py-4 px-4 sm:px-6 font-semibold">Criteria</th>
                <th className="py-4 px-4 sm:px-6 font-semibold text-cyan-400">Open Analytics</th>
                <th className="py-4 px-4 sm:px-6 font-semibold text-rose-400">Google Analytics 4 (GA4)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Script Payload (Brotli)</td>
                <td className="py-3 px-4 sm:px-6 text-emerald-400 font-bold">&lt; 3.2 KB</td>
                <td className="py-3 px-4 sm:px-6 text-rose-400">45 KB to 120 KB+</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Cookie Consent Banner Required</td>
                <td className="py-3 px-4 sm:px-6 text-emerald-400 font-bold">No (Zero Cookies)</td>
                <td className="py-3 px-4 sm:px-6 text-rose-400">Mandatory (ePrivacy &amp; GDPR)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Data Ingestion Latency</td>
                <td className="py-3 px-4 sm:px-6 text-emerald-400 font-bold">Real-time (&lt; 2 seconds)</td>
                <td className="py-3 px-4 sm:px-6 text-rose-400">24 to 48 hour processing delay</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">AI Search Engine Radar</td>
                <td className="py-3 px-4 sm:px-6 text-emerald-400 font-bold">Native (SearchGPT, Perplexity, Claude)</td>
                <td className="py-3 px-4 sm:px-6 text-rose-400">Not supported (grouped in Direct)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Core Web Vitals RUM</td>
                <td className="py-3 px-4 sm:px-6 text-emerald-400 font-bold">Built-in p75 LCP, INP, CLS</td>
                <td className="py-3 px-4 sm:px-6 text-rose-400">Requires complex BigQuery export</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/vs-google-analytics"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Read the full head-to-head comparison guide
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-500/30 relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready For Faster, Honest Telemetry?
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-8">
            Install in 60 seconds. Say goodbye to bloated scripts, delayed reports, and intrusive cookie banners forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              See Pricing &amp; Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

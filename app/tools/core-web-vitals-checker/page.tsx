"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Layers,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://openanalytics.org.in" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://openanalytics.org.in/tools" },
    { "@type": "ListItem", position: 3, name: "Web Vitals Calculator", item: "https://openanalytics.org.in/tools/core-web-vitals-checker" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Core Web Vitals Threshold & Budget Calculator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Evaluate website Core Web Vitals thresholds for LCP, INP, CLS, TTFB, and FCP against Google official p75 production standards.",
};

export default function CoreWebVitalsCheckerPage() {
  const [lcp, setLcp] = useState(2.1);
  const [inp, setInp] = useState(140);
  const [cls, setCls] = useState(0.04);
  const [ttfb, setTtfb] = useState(450);
  const [fcp, setFcp] = useState(1.2);

  const getStatus = (val: number, good: number, poor: number, unit = "") => {
    if (val <= good) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 };
    if (val <= poor) return { label: "Needs Improvement", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: AlertTriangle };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: XCircle };
  };

  const lcpStatus = useMemo(() => getStatus(lcp, 2.5, 4.0), [lcp]);
  const inpStatus = useMemo(() => getStatus(inp, 200, 500), [inp]);
  const clsStatus = useMemo(() => getStatus(cls, 0.1, 0.25), [cls]);
  const ttfbStatus = useMemo(() => getStatus(ttfb, 800, 1800), [ttfb]);
  const fcpStatus = useMemo(() => getStatus(fcp, 1.8, 3.0), [fcp]);

  const overallPassing = useMemo(() => {
    return lcp <= 2.5 && inp <= 200 && cls <= 0.1;
  }, [lcp, inp, cls]);

  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
              <Gauge className="w-3.5 h-3.5 text-zinc-400" />
              <span>Performance Engineering Tool</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 font-sans">
              Core Web Vitals Threshold & Budget Calculator
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
              Simulate and benchmark your real user experience against Google's official 75th percentile (p75) thresholds for search ranking signals.
            </p>
          </div>
        </section>

        {/* Overall Status Banner */}
        <section className="py-8 px-6 border-b border-white/[0.08] bg-[#0e0f15]/50">
          <div className="max-w-4xl mx-auto">
            <div className={`p-6 rounded-xl border flex items-center justify-between gap-4 ${
              overallPassing
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                : "bg-amber-500/5 border-amber-500/20 text-amber-300"
            }`}>
              <div className="flex items-center gap-3">
                {overallPassing ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-base font-sans">
                    {overallPassing
                      ? "Core Web Vitals Assessment: PASSING"
                      : "Core Web Vitals Assessment: NEEDS OPTIMIZATION"}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    {overallPassing
                      ? "All three primary metrics (LCP, INP, CLS) satisfy Google 75th percentile requirements."
                      : "One or more metrics exceed the 'Good' threshold and may penalize mobile search rankings."}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right font-mono text-xs">
                <span className="text-zinc-400">Google CWV Benchmark</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Sliders */}
        <section className="py-16 px-6 border-b border-white/[0.08]">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* LCP */}
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                    <span>Largest Contentful Paint (LCP)</span>
                    <span className="text-xs text-zinc-500 font-normal">Loading Performance</span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Measures render time of the largest image or text block. Target: &le; 2.5s.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-white tabular-nums">{lcp.toFixed(2)}s</div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border mt-1 ${lcpStatus.color}`}>
                    {lcpStatus.label}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.05"
                value={lcp}
                onChange={(e) => setLcp(parseFloat(e.target.value))}
                className="w-full accent-white h-2 bg-[#090a0f] rounded-lg cursor-pointer mt-4"
              />
            </div>

            {/* INP */}
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                    <span>Interaction to Next Paint (INP)</span>
                    <span className="text-xs text-zinc-500 font-normal">Interaction Responsiveness</span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Measures longest latency of user clicks, taps, and key presses. Target: &le; 200ms.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-white tabular-nums">{inp}ms</div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border mt-1 ${inpStatus.color}`}>
                    {inpStatus.label}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="800"
                step="10"
                value={inp}
                onChange={(e) => setInp(parseInt(e.target.value, 10))}
                className="w-full accent-white h-2 bg-[#090a0f] rounded-lg cursor-pointer mt-4"
              />
            </div>

            {/* CLS */}
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                    <span>Cumulative Layout Shift (CLS)</span>
                    <span className="text-xs text-zinc-500 font-normal">Visual Stability</span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Measures unexpected layout movement during page lifecycle. Target: &le; 0.10.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-white tabular-nums">{cls.toFixed(2)}</div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border mt-1 ${clsStatus.color}`}>
                    {clsStatus.label}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.5"
                step="0.01"
                value={cls}
                onChange={(e) => setCls(parseFloat(e.target.value))}
                className="w-full accent-white h-2 bg-[#090a0f] rounded-lg cursor-pointer mt-4"
              />
            </div>

            {/* Secondary: TTFB & FCP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/[0.06]">
              <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-zinc-400">TTFB (Server Latency)</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${ttfbStatus.color}`}>{ttfbStatus.label}</span>
                </div>
                <div className="font-mono text-lg font-bold text-white mb-2">{ttfb}ms</div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="25"
                  value={ttfb}
                  onChange={(e) => setTtfb(parseInt(e.target.value, 10))}
                  className="w-full accent-white h-1.5 bg-[#090a0f] rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-zinc-400">FCP (First Paint)</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${fcpStatus.color}`}>{fcpStatus.label}</span>
                </div>
                <div className="font-mono text-lg font-bold text-white mb-2">{fcp.toFixed(2)}s</div>
                <input
                  type="range"
                  min="0.3"
                  max="4.0"
                  step="0.05"
                  value={fcp}
                  onChange={(e) => setFcp(parseFloat(e.target.value))}
                  className="w-full accent-white h-1.5 bg-[#090a0f] rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Informational Guidance */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3 font-sans">
              Automatic RUM Telemetry with Open Analytics
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
              Instead of running synthetic lab audits, Open Analytics captures real user p75 percentiles from actual visitors across desktop, mobile, and slow cellular networks automatically.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={dashboardUrl}
                className="px-6 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 font-sans"
              >
                <span>Monitor Web Vitals Live</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/observability/web-vitals"
                className="px-6 py-3 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors font-sans"
              >
                <span>Read Full Web Vitals Guide</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

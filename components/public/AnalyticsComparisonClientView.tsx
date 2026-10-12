"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  DollarSign,
  Gauge,
  HelpCircle,
  Layers,
  Scale,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

interface PlatformData {
  id: string;
  name: string;
  pricingType: "fixed" | "volume" | "enterprise";
  calculateMonthlyCost: (pageviews: number) => number;
  scriptSizeKb: number;
  cookieBannersRequired: boolean;
  features: {
    rumWebVitals: boolean;
    errorMonitoring: boolean;
    aiCrawlerRadar: boolean;
    rageClicks: boolean;
    selfHosting: boolean;
    dataOwnership: boolean;
  };
}

const PLATFORMS: PlatformData[] = [
  {
    id: "openanalytics",
    name: "Open Analytics Cloud",
    pricingType: "volume",
    calculateMonthlyCost: (pv) => {
      if (pv <= 10000) return 0;
      if (pv <= 250000) return 19;
      return 49 + Math.ceil((pv - 250000) / 250000) * 20;
    },
    scriptSizeKb: 3.2,
    cookieBannersRequired: false,
    features: {
      rumWebVitals: true,
      errorMonitoring: true,
      aiCrawlerRadar: true,
      rageClicks: true,
      selfHosting: true,
      dataOwnership: true,
    },
  },
  {
    id: "selfhosted",
    name: "Open Analytics Self-Hosted",
    pricingType: "fixed",
    calculateMonthlyCost: () => 0,
    scriptSizeKb: 3.2,
    cookieBannersRequired: false,
    features: {
      rumWebVitals: true,
      errorMonitoring: true,
      aiCrawlerRadar: true,
      rageClicks: true,
      selfHosting: true,
      dataOwnership: true,
    },
  },
  {
    id: "plausible",
    name: "Plausible Analytics",
    pricingType: "volume",
    calculateMonthlyCost: (pv) => {
      if (pv <= 10000) return 9;
      if (pv <= 100000) return 19;
      if (pv <= 250000) return 39;
      if (pv <= 500000) return 49;
      if (pv <= 1000000) return 69;
      return 69 + Math.ceil((pv - 1000000) / 1000000) * 30;
    },
    scriptSizeKb: 2.8,
    cookieBannersRequired: false,
    features: {
      rumWebVitals: false,
      errorMonitoring: false,
      aiCrawlerRadar: false,
      rageClicks: false,
      selfHosting: true,
      dataOwnership: true,
    },
  },
  {
    id: "matomo",
    name: "Matomo Cloud",
    pricingType: "volume",
    calculateMonthlyCost: (pv) => {
      if (pv <= 50000) return 23;
      if (pv <= 100000) return 45;
      if (pv <= 250000) return 79;
      if (pv <= 500000) return 119;
      if (pv <= 1000000) return 239;
      return 239 + Math.ceil((pv - 1000000) / 500000) * 110;
    },
    scriptSizeKb: 26.5,
    cookieBannersRequired: true,
    features: {
      rumWebVitals: false,
      errorMonitoring: false,
      aiCrawlerRadar: false,
      rageClicks: false,
      selfHosting: true,
      dataOwnership: true,
    },
  },
  {
    id: "posthog",
    name: "PostHog Cloud",
    pricingType: "volume",
    calculateMonthlyCost: (pv) => {
      if (pv <= 1000000) return 0; // 1M free, but charged for recordings and errors
      return Math.round((pv - 1000000) * 0.00031 + 45);
    },
    scriptSizeKb: 72.0,
    cookieBannersRequired: true,
    features: {
      rumWebVitals: true,
      errorMonitoring: true,
      aiCrawlerRadar: false,
      rageClicks: true,
      selfHosting: false,
      dataOwnership: false,
    },
  },
  {
    id: "ga4",
    name: "Google Analytics 4 / 360",
    pricingType: "enterprise",
    calculateMonthlyCost: (pv) => (pv > 5000000 ? 4166 : 0),
    scriptSizeKb: 54.0,
    cookieBannersRequired: true,
    features: {
      rumWebVitals: false,
      errorMonitoring: false,
      aiCrawlerRadar: false,
      rageClicks: false,
      selfHosting: false,
      dataOwnership: false,
    },
  },
];

const TRAFFIC_PRESETS = [
  { label: "10k / mo", value: 10000 },
  { label: "50k / mo", value: 50000 },
  { label: "100k / mo", value: 100000 },
  { label: "250k / mo", value: 250000 },
  { label: "1M / mo", value: 1000000 },
  { label: "5M / mo", value: 5000000 },
];

export default function AnalyticsComparisonClientView() {
  const [pageviews, setPageviews] = useState(250000);
  const [selectedFeature, setSelectedFeature] = useState<
    "all" | "observability" | "privacy" | "selfhosting"
  >("all");

  const dashboardUrl = getDashboardUrl("/");

  const openAnalyticsCost = useMemo(() => {
    return PLATFORMS[0].calculateMonthlyCost(pageviews);
  }, [pageviews]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-white font-sans">
      {/* Header */}
      <div className="relative border-b border-white/[0.08] overflow-hidden pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Analytics Comparison Calculator</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Scale className="w-3.5 h-3.5" />
              <span>Free Interactive Benchmark Tool</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Analytics Cost &amp; Feature Comparison Calculator
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Benchmark monthly pricing, client script payload weights, Core Web Vitals RUM,
              and privacy compliance across modern web analytics platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Interactive Volume Controls */}
        <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Monthly Website Traffic
              </span>
              <div className="text-2xl font-bold font-mono text-white tabular-nums pt-1">
                {pageviews.toLocaleString()}{" "}
                <span className="text-sm font-normal text-zinc-500">
                  pageviews / month
                </span>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2">
              {TRAFFIC_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPageviews(p.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    pageviews === p.value
                      ? "bg-white text-zinc-950 font-bold"
                      : "bg-[#181922] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={10000}
              max={5000000}
              step={10000}
              value={pageviews}
              onChange={(e) => setPageviews(Number(e.target.value))}
              className="w-full accent-white h-2 bg-[#181922] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>10k pageviews</span>
              <span>500k</span>
              <span>1M</span>
              <span>2.5M</span>
              <span>5M pageviews</span>
            </div>
          </div>
        </div>

        {/* Cost Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((platform) => {
            const cost = platform.calculateMonthlyCost(pageviews);
            const isOpenAnalytics =
              platform.id === "openanalytics" || platform.id === "selfhosted";
            const difference = cost - openAnalyticsCost;

            return (
              <div
                key={platform.id}
                className={`p-6 rounded-xl border transition-all space-y-5 flex flex-col justify-between ${
                  isOpenAnalytics
                    ? "bg-[#141620] border-emerald-500/40 shadow-sm"
                    : "bg-[#111218] border-white/[0.08]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {platform.name}
                    </h3>
                    {isOpenAnalytics && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Monthly Cost */}
                  <div>
                    <div className="text-3xl font-bold font-mono text-white tabular-nums">
                      ${cost}
                      <span className="text-xs font-normal text-zinc-500">
                        {" "}
                        / month
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 pt-0.5">
                      ${(cost * 12).toLocaleString()} billed annually
                    </div>
                  </div>

                  {/* Technical Footprint */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Script Weight:</span>
                      <span className="text-white font-semibold">
                        {platform.scriptSizeKb} KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Cookie Banner:</span>
                      <span
                        className={
                          platform.cookieBannersRequired
                            ? "text-rose-400 font-semibold"
                            : "text-emerald-400 font-semibold"
                        }
                      >
                        {platform.cookieBannersRequired ? "Required" : "Exempt"}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Core Web Vitals RUM</span>
                      {platform.features.rumWebVitals ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Error Crash Triage</span>
                      {platform.features.errorMonitoring ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">AI Crawler Radar</span>
                      {platform.features.aiCrawlerRadar ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Behavioral Rage Clicks</span>
                      {platform.features.rageClicks ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Self-Hosting Available</span>
                      {platform.features.selfHosting ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {isOpenAnalytics ? (
                    <a
                      href={dashboardUrl}
                      className="w-full py-2 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={
                        platform.id === "ga4"
                          ? "/alternatives/google-analytics"
                          : `/alternatives/${platform.id}`
                      }
                      className="w-full py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Read Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Savings Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-[#141620] to-[#0e0f15] border border-white/[0.1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Observability Included</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              One platform for Analytics, Web Vitals, Errors, and AI Crawlers
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Stop juggling separate subscriptions for web analytics, Sentry error
              monitoring, and synthetic performance testing. Consolidate your frontend
              telemetry into one featherweight script.
            </p>
          </div>

          <a
            href={dashboardUrl}
            className="px-5 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Launch Open Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

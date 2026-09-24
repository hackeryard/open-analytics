"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Cloud,
  Layers,
  HelpCircle,
  Crown,
  Activity,
  Bot,
  MousePointerClick,
  Bug,
  ChevronDown,
  ChevronUp,
  Shield,
  Gauge,
  Lock,
  RefreshCw,
  Globe,
  Radio,
  Terminal,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

interface VolumeTier {
  events: string;
  shortLabel: string;
  monthlyPrice: number;
  annualPrice: number;
  label?: string;
}

const VOLUME_TIERS: VolumeTier[] = [
  { events: "100,000", shortLabel: "100k", monthlyPrice: 14, annualPrice: 11 },
  { events: "250,000", shortLabel: "250k", monthlyPrice: 19, annualPrice: 15, label: "Recommended" },
  { events: "500,000", shortLabel: "500k", monthlyPrice: 34, annualPrice: 27 },
  { events: "1,000,000", shortLabel: "1M", monthlyPrice: 59, annualPrice: 47 },
  { events: "2,500,000", shortLabel: "2.5M", monthlyPrice: 99, annualPrice: 79 },
];

export default function PricingInteractive() {
  const dashboardUrl = getDashboardUrl("/");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedTierIndex, setSelectedTierIndex] = useState(1); // 250,000 events default
  const [activeSpotlightTab, setActiveSpotlightTab] = useState<"ai" | "rum" | "ux" | "errors" | "events" | "proxy">("ai");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedTier = VOLUME_TIERS[selectedTierIndex];
  const proDisplayPrice = billingCycle === "annual" ? selectedTier.annualPrice : selectedTier.monthlyPrice;
  const annualSavings = (selectedTier.monthlyPrice - selectedTier.annualPrice) * 12;

  const faqs = [
    {
      q: "What features are included in the Free Starter plan?",
      a: "The Free Starter plan includes 10,000 monthly events and 1 tracked website with 100% of our core analytics: real-time live visitors, pageviews, sessions, dwell times, top routes, referral sources, geographic countries & cities, device & browser breakdowns, and 100% cookieless GDPR compliance. It is free forever with no credit card required.",
    },
    {
      q: "What extra features do I unlock with the Pro plan?",
      a: "The Pro tier unlocks all 5 advanced observability modules: Custom Business Events & Conversion Rules (revenue value attribution, no-code click/form autotracking, JSON payload inspection), GEO & AI Search Radar (tracking OpenAI SearchGPT, Perplexity, ClaudeBot citations and bot hits), Core Web Vitals RUM (measuring real user p75 LCP, INP, and CLS field performance), Behavioral UX (autonomous Rage Click and Dead Click friction detection), and Crash Diagnostics (automatic JavaScript exception capture and copyable AI debug prompts), plus custom domain reverse-proxying and 1-year data retention.",
    },
    {
      q: "How does the annual billing discount work?",
      a: "When you choose Annual billing, you receive an instant ~20% discount (equivalent to getting 2 months completely free every year). For the standard 250,000 event tier, you pay $15/month billed annually ($180/year) instead of $19/month billed monthly.",
    },
    {
      q: "What happens if my traffic spikes past my monthly event allowance?",
      a: "We never drop telemetry or take your analytics offline abruptly. If you exceed your event threshold, we notify you via email and provide a graceful 14-day overage window so you can easily upgrade to the next event tier or adjust filtering rules.",
    },
    {
      q: "Can I add multiple websites under one Pro subscription?",
      a: "Yes. In Open Analytics, subscriptions belong to your user account, not individual projects. The Pro plan includes 10 active websites with up to 10 team members. Projects inherit the owner's Pro capabilities without requiring separate billing for each domain.",
    },
    {
      q: "Can I cancel or switch my plan at any time?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly in your account billing settings. If you cancel, your account remains active until the end of your paid billing cycle.",
    },
  ];

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION & BILLING TOGGLE                             */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 text-xs font-medium mb-8 transition shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Transparent Pricing:</span>
          <span>Core Telemetry Free Forever</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">No Credit Card</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-7xl mx-auto leading-[1.06]">
          Predictable pricing engineered for modern engineering teams.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-10">
          Start free with core traffic analytics, zero cookies, and instant setup. Upgrade to Pro when you need AI search radar, Core Web Vitals RUM, behavioral rage clicks, and crash triage.
        </p>

        {/* Interactive Billing Frequency Selector */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#111218] border border-white/[0.08] mb-6 shadow-sm">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${billingCycle === "monthly"
                ? "bg-white/[0.1] text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
              }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${billingCycle === "annual"
                ? "bg-white/[0.1] text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
              }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE 3 TIER PRICING CARDS                                  */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Free Starter */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.14] transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#14161f] border border-white/[0.08] flex items-center justify-center text-white">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Free Forever
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Free Starter</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
                Essential privacy-first telemetry for indie developers, personal projects, and growing blogs.
              </p>

              {/* Price Display */}
              <div className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tabular-nums">$0</span>
                  <span className="text-xs text-zinc-400 font-medium">/ month</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>No credit card required • Instant setup</span>
                </div>
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                Included Core Features:
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">10,000</strong> events / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Tracked Website</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time live visitor stream</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Top pages, referrers &amp; UTM campaigns</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Country &amp; city geolocation analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero cookie consent banners required</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>30-day historical query window</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 2 team members</span>
                </li>
              </ul>
            </div>

            <a
              href={dashboardUrl}
              className="w-full py-3 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-white font-semibold text-xs text-center transition-all border border-white/[0.08] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Free Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

          {/* Card 2: Pro (Centerpiece Highlight) */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#14161f] border-2 border-white/20 shadow-2xl shadow-black/40 lg:-translate-y-2">
            {/* Top pill badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white text-zinc-950 text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-zinc-950" />
              <span>Recommended • Full Intelligence</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.1] border border-white/[0.12] flex items-center justify-center text-white">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>

                {/* Interactive Event Volume Selector */}
                <div className="flex items-center gap-1 bg-[#0e0f15] p-1 rounded-lg border border-white/[0.08]">
                  {VOLUME_TIERS.map((tier, idx) => (
                    <button
                      key={tier.shortLabel}
                      type="button"
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition cursor-pointer ${selectedTierIndex === idx
                          ? "bg-white/[0.15] text-white shadow-xs"
                          : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                      {tier.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Pro Observability</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
                Complete web telemetry suite with AI crawler radar, Core Web Vitals RUM, rage clicks, and error triage.
              </p>

              {/* Price Display */}
              <div className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.08] mb-6">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white tabular-nums">${proDisplayPrice}</span>
                    <span className="text-xs text-zinc-400 font-medium">/ month</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-white tabular-nums">{selectedTier.events}</span>
                    <div className="text-[10px] text-zinc-500">events / month</div>
                  </div>
                </div>
                {billingCycle === "annual" && (
                  <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Billed annually (${proDisplayPrice * 12}/yr • Save ${annualSavings})</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <span>All Free Features Plus:</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">10 Tracked Websites</strong> included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">AI Search Radar:</strong> SearchGPT, Perplexity, ClaudeBot</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">Core Web Vitals RUM:</strong> Real user p75 LCP, INP, CLS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">Behavioral UX:</strong> Rage Click &amp; Dead Click friction</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">Crash Diagnostics:</strong> Uncaught error &amp; AI debug triage</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">Custom Reverse-Proxy:</strong> 100% AdBlock immune routing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">1-Year Data Retention</strong> with 365-day query window</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 10 team members per project</span>
                </li>
              </ul>
            </div>

            <a
              href={dashboardUrl}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm text-center transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Dashboard &amp; Upgrade</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Enterprise */}
          <div className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.14] transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#14161f] border border-white/[0.08] flex items-center justify-center text-white">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                  Scale &amp; Security
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Enterprise</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
                Dedicated infrastructure, custom SLAs, and high-throughput telemetry ingestion for large organizations.
              </p>

              {/* Price Display */}
              <div className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">Custom</span>
                  <span className="text-xs text-zinc-400 font-medium">/ scale</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-medium mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Custom contract &amp; dedicated SLA</span>
                </div>
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                Enterprise Inclusions:
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom volume (10M to 1B+ events/month)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated single-tenant database cluster</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom DPA &amp; sovereign EU data residency</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SAML SSO (Okta, Azure AD, Google Workspace)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>99.99% uptime guarantee SLA</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Slack channel &amp; priority engineer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited team members &amp; custom website pools</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:contact@openanalytics.org.in?subject=Enterprise%20Plan%20Inquiry"
              className="w-full py-3 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-white font-semibold text-xs text-center transition-all border border-white/[0.08] flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98]"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE SPOTLIGHT: THE PRO EXTRA MODULES              */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Module Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Why engineering teams upgrade to Pro
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            Click each module below to preview the extra intelligence features included in your Pro subscription.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: "events", label: "Custom Events & Rules", icon: Zap },
            { id: "ai", label: "AI Search Radar", icon: Bot },
            { id: "rum", label: "Core Web Vitals RUM", icon: Activity },
            { id: "ux", label: "Rage & Dead Clicks", icon: MousePointerClick },
            { id: "errors", label: "Crash & Error Triage", icon: Bug },
            { id: "proxy", label: "Custom Proxy Domain", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSpotlightTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSpotlightTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${isActive
                    ? "bg-white/[0.1] text-white border border-white/[0.15] shadow-xs"
                    : "bg-[#111218] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-[#181922]"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Card */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-xl">
          {activeSpotlightTab === "events" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-mono font-medium">
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span>Module: Custom Business Events &amp; Conversions</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Track Conversions, Milestones &amp; Revenue Values
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Go beyond pageviews. Track signups, checkouts, and custom user milestones with revenue attribution, full JSON metadata payload inspection, and no-code CSS selector autotrack rules.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong className="text-white">Live Custom Events Stream:</strong> Real-time feed of business actions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong className="text-white">Revenue Attribution:</strong> Track exact monetary values ($) generated</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong className="text-white">No-Code Event Rules:</strong> Autotrack buttons and forms without code edits</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-[#0e0f15] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[11px] text-zinc-400">
                  <span>CUSTOM CONVERSION TELEMETRY</span>
                  <span className="text-emerald-400 font-bold tabular-nums">$12,480.00 tracked</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">event: upgrade_pro_annual</div>
                      <div className="text-[10px] text-zinc-400 font-sans">plan: pro • cycle: annual</div>
                    </div>
                    <span className="text-emerald-400 font-bold tabular-nums">+$180.00</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">event: team_invite_sent</div>
                      <div className="text-[10px] text-zinc-400 font-sans">role: editor • autotrack rule</div>
                    </div>
                    <span className="text-zinc-300 font-medium">Milestone</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "ai" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-mono font-medium">
                  <Bot className="w-3.5 h-3.5 text-white" />
                  <span>Module: GEO &amp; AI Search Engine Radar</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Track Where Generative Engines Scrape &amp; Cite Your Content
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Generative AI search engines (Perplexity, SearchGPT, Claude, and Gemini) drive high-intent visitors. Open Analytics automatically categorizes AI assistant citations and monitors bot scraping frequency.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Real-time tracking of GPTBot, ClaudeBot, PerplexityBot, and Bytespider</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>AEO citation analysis for landing pages and docs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Machine discovery optimization via /llms.txt support</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-[#0e0f15] border border-white/[0.08] space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                      SearchGPT
                    </span>
                    <span className="text-zinc-300 text-[11px]">/docs/installation</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">200 OK • 18ms</span>
                </div>
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-semibold">
                      PerplexityBot
                    </span>
                    <span className="text-zinc-300 text-[11px]">/pricing</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">200 OK • 22ms</span>
                </div>
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                      ClaudeBot
                    </span>
                    <span className="text-zinc-300 text-[11px]">/features</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">200 OK • 14ms</span>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "rum" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-mono font-medium">
                  <Activity className="w-3.5 h-3.5 text-white" />
                  <span>Module: Core Web Vitals Real User Monitoring (RUM)</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Pass Google PageSpeed Audits with Real User Field Telemetry
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Lab synthetic tests don't reflect what real visitors experience. Open Analytics captures p75 percentiles for LCP, INP, and CLS directly from live production sessions.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Real-world Largest Contentful Paint (LCP) breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Interaction to Next Paint (INP) input latency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Hardware, connection speed &amp; memory profiling</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-[#0e0f15] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-zinc-400">Largest Contentful Paint (LCP)</span>
                  <span className="text-emerald-400 font-bold tabular-nums">0.82s (Good)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-zinc-400">Interaction to Next Paint (INP)</span>
                  <span className="text-emerald-400 font-bold tabular-nums">38ms (Good)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-zinc-400">Cumulative Layout Shift (CLS)</span>
                  <span className="text-emerald-400 font-bold tabular-nums">0.01 (Good)</span>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "ux" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-mono font-medium">
                  <MousePointerClick className="w-3.5 h-3.5 text-white" />
                  <span>Module: Behavioral UX &amp; Rage Click Intelligence</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Catch Broken Frontend Interactions Before Users Complain
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  When buttons fail or workflows stall, users click frantically. Open Analytics flags rage clicks and dead clicks with exact DOM selectors with zero heavy screen recordings.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Autonomous cluster detection (3+ clicks in 800ms)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Exact CSS selector and tag capture for developers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>0 KB recording overhead: 100% mathematical telemetry</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-[#0e0f15] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-rose-400 font-bold">
                    <span>Rage Click: button#checkout-submit</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15">4 Clicks / 620ms</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">Route: /checkout/payment • Viewport: 390x844</div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "errors" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-mono font-medium">
                  <Bug className="w-3.5 h-3.5 text-white" />
                  <span>Module: Crash Diagnostics &amp; AI Debug Triage</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Frontend JavaScript Crashes Grouped with AI Repair Prompts
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Never miss an uncaught exception in production. Open Analytics deduplicates stack traces and generates copy-ready prompts tailored for Claude, ChatGPT, or Cursor.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic capture of window.onerror and unhandledrejection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Intelligent stack fingerprinting and deduplication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1-click copy AI fix prompt with full reproduction context</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-[#0e0f15] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] space-y-1">
                  <div className="text-rose-400 font-bold">TypeError: Cannot read properties of undefined (reading 'map')</div>
                  <div className="text-[11px] text-zinc-400">at CartItemsList (components/CartItemsList.tsx:42)</div>
                  <div className="text-[10px] text-emerald-400 pt-1">Auto-grouped: 18 occurrences • 1-Click AI Prompt Ready</div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "proxy" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-mono font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Module: Custom Reverse-Proxy Domain</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  100% Immune to Browser AdBlockers
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Browser extensions block up to 30% of analytics traffic on developer websites. Route telemetry through your own primary domain (e.g. yourdomain.com/telemetry) to restore full reporting accuracy.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>First-party application traffic recognition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Zero third-party domain lookup latency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Native support for Next.js rewrites, Cloudflare, and Nginx</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-[#0e0f15] border border-white/[0.08] space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-zinc-400">google-analytics.com/g/collect</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">BLOCKED (30%)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#14161f] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold">yourdomain.com/api/v1/collect</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">ALLOWED (100%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DETAILED FEATURE MATRIX                                   */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Full plan comparison matrix
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Clear overview of what is included in Free Starter versus Pro and Enterprise.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#111218] shadow-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0e0f15] text-zinc-300">
                <th className="py-4 px-6 font-semibold text-white">Capabilities</th>
                <th className="py-4 px-6 font-semibold text-emerald-400">Free Starter</th>
                <th className="py-4 px-6 font-semibold text-white">Pro ($19/mo)</th>
                <th className="py-4 px-6 font-semibold text-zinc-400">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300">
              {/* Category 1: Capacity */}
              <tr className="bg-[#14161f]/60 font-semibold text-xs text-zinc-400">
                <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider">
                  Capacity &amp; Websites
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Monthly Events Included</td>
                <td className="py-3.5 px-6 tabular-nums font-mono">10,000</td>
                <td className="py-3.5 px-6 font-bold text-white tabular-nums font-mono">250,000</td>
                <td className="py-3.5 px-6 font-bold text-zinc-300 tabular-nums font-mono">Custom (10M+)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Tracked Websites</td>
                <td className="py-3.5 px-6 tabular-nums font-mono">1 Website</td>
                <td className="py-3.5 px-6 font-bold text-white tabular-nums font-mono">10 Websites</td>
                <td className="py-3.5 px-6 font-bold text-zinc-300 tabular-nums font-mono">10 + $10/mo/extra</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Data Retention</td>
                <td className="py-3.5 px-6">30 Days</td>
                <td className="py-3.5 px-6 font-bold text-white">1 Full Year (365 Days)</td>
                <td className="py-3.5 px-6 font-bold text-zinc-300">Custom / Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Team Members / Project</td>
                <td className="py-3.5 px-6 tabular-nums font-mono">Up to 2</td>
                <td className="py-3.5 px-6 font-bold text-white tabular-nums font-mono">Up to 10</td>
                <td className="py-3.5 px-6 font-bold text-zinc-300 font-mono">Unlimited</td>
              </tr>

              {/* Category 2: Core Analytics */}
              <tr className="bg-[#14161f]/60 font-semibold text-xs text-zinc-400">
                <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider">
                  Core Analytics (All Plans)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Real-Time Live Event Stream</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Top Pages, UTM Campaigns &amp; Referrers</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Device, OS &amp; Browser Demographics</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Interactive World Geography Atlas</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Zero Cookie Consent Banners Required</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>

              {/* Category 3: Pro Extra Modules */}
              <tr className="bg-[#14161f]/60 font-semibold text-xs text-zinc-400">
                <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider">
                  Advanced Extra Modules (Pro &amp; Enterprise Only)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">GEO &amp; AI Search Crawler Radar</td>
                <td className="py-3.5 px-6 text-zinc-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Core Web Vitals Real User Monitoring (RUM)</td>
                <td className="py-3.5 px-6 text-zinc-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Behavioral UX (Rage Click &amp; Dead Clicks)</td>
                <td className="py-3.5 px-6 text-zinc-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Crash Diagnostics &amp; AI Fix Prompts</td>
                <td className="py-3.5 px-6 text-zinc-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Custom Business Events &amp; Conversion Rules</td>
                <td className="py-3.5 px-6 text-zinc-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Custom Reverse-Proxy Domain (AdBlock Proof)</td>
                <td className="py-3.5 px-6 text-zinc-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-3">
            <HelpCircle size={13} />
            <span>Pricing FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Frequently asked questions about pricing
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#111218] border border-white/[0.08] overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">{faq.q}</span>
                  <div className="w-6 h-6 rounded-lg bg-[#181922] flex items-center justify-center text-zinc-400 shrink-0">
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM CTA CONSOLE                                        */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto">
            <Activity size={24} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Start collecting real web telemetry in under 60 seconds.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Free forever on the Starter tier with 10,000 events/month. No credit card required.
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
              href="/vs-google-analytics"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#14161f] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
            >
              <span>Compare vs GA4</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

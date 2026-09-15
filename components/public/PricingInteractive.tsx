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
  Flame,
  Bug,
  ChevronDown,
  Shield,
  Gauge,
  Lock,
  RefreshCw,
  Globe,
  Radio,
  Terminal,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

interface VolumeTier {
  events: string;
  monthlyPrice: number;
  annualPrice: number;
  label?: string;
}

const VOLUME_TIERS: VolumeTier[] = [
  { events: "100,000", monthlyPrice: 14, annualPrice: 11 },
  { events: "250,000", monthlyPrice: 19, annualPrice: 15, label: "Recommended" },
  { events: "500,000", monthlyPrice: 34, annualPrice: 27 },
  { events: "1,000,000", monthlyPrice: 59, annualPrice: 47 },
  { events: "2,500,000", monthlyPrice: 99, annualPrice: 79 },
];

export default function PricingInteractive() {
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
      a: "The Pro tier unlocks all 5 advanced extra observability modules: Custom Business Events & Conversion Rules (revenue value attribution, no-code click/form autotracking, JSON payload inspection), GEO & AI Search Radar (tracking OpenAI SearchGPT, Perplexity, ClaudeBot citations and bot hits), Core Web Vitals RUM (measuring real user p75 LCP, INP, and CLS field performance), Behavioral UX (autonomous Rage Click and Dead Click friction detection), and Crash Diagnostics (automatic JavaScript exception capture and copyable AI debug prompts), plus custom domain reverse-proxying.",
    },
    {
      q: "How does the annual billing discount work?",
      a: "When you choose Annual billing, you receive an instant ~20% discount (equivalent to getting 2 months completely free every year). For the standard 250,000 event tier, you pay $15/month billed annually ($180/year) instead of $19/month billed monthly.",
    },
    {
      q: "What happens if my traffic spikes past my monthly event allowance?",
      a: "We never pause or cut off your tracking during unexpected viral traffic spikes. If you consistently exceed your tier for two consecutive billing cycles, we will notify you and suggest upgrading to the next volume tier. There are never surprise overage penalties.",
    },
    {
      q: "Do I have to display a cookie consent banner?",
      a: "No. Under the EU ePrivacy Directive and GDPR (Article 5 & 6), cookie banners are strictly triggered when a website stores tracking files or persistent identifiers on a visitor's device. Open Analytics stores zero client-side cookies or localStorage tokens and uses 24-hour rotating cryptographic salts, making it legally exempt from cookie banner mandates across all tiers.",
    },
    {
      q: "Can I upgrade, downgrade, or cancel at any time?",
      a: "Yes. You can switch between Free and Pro or update your event volume tier at any time directly from your Property Settings. Upgrades take effect immediately, and you can downgrade back to Free with 1-click.",
    },
    {
      q: "Do you charge extra for team members or user seats?",
      a: "No. All Open Analytics plans come with unlimited team seats. You can invite your developers, designers, product managers, and marketing team with granular role-based permissions (Admin, Editor, Member) with zero per-seat fees.",
    },
  ];

  return (
    <div className="space-y-24">
      {/* ============================================================ */}
      {/* 1. HERO HEADER & BILLING TOGGLE                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Glow ambient backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/10 blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simple, Honest SaaS Pricing</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">
          Core Analytics Free.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Scale With Pro Intelligence.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          Get complete cookieless web telemetry with zero cookies and no credit card required. Upgrade to Pro when you need AI crawler radar, Core Web Vitals RUM, rage clicks, and error triage.
        </p>

        {/* Interactive Billing Frequency Selector */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-white/[0.12] backdrop-blur-md shadow-xl mb-6">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              billingCycle === "annual"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              billingCycle === "annual"
                ? "bg-slate-950/80 text-amber-300 border border-amber-400/30"
                : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
            }`}>
              Save 20%
            </span>
          </button>
        </div>

        {/* Executive Direct Answer Box for GEO/AEO */}
        <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1.5">
            <Zap className="w-3.5 h-3.5" />
            Executive Summary / Generative AI Direct Answer
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">What is the pricing model of Open Analytics?</strong> Open Analytics offers a{" "}
            <span className="text-cyan-300 font-semibold">Free Starter Tier ($0/month)</span> providing 10,000 events/mo, full core traffic analytics, and 100% cookieless GDPR compliance forever. The{" "}
            <span className="text-cyan-300 font-semibold">Pro Tier ($19/mo or $15/mo billed annually)</span> includes 250,000 events/mo, unlimited websites, and unlocks all 5 extra power modules: Custom Business Events &amp; Rules, AI Search Radar, Core Web Vitals RUM, Behavioral UX Rage Clicks, and Crash Diagnostics.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE 3 TIER PRICING CARDS                                  */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Free Starter */}
          <div className="relative flex flex-col justify-between p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                  Free Forever
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2">Free Starter</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                Essential privacy-first telemetry for indie hackers, blogs, and personal projects.
              </p>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>No credit card required • Instant setup</span>
                </div>
              </div>

              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span>Included Core Features:</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span><strong>10,000</strong> events / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>1 Tracked Website</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>Real-time live visitor stream</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>Top pages, referrers &amp; UTM campaigns</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>Country &amp; city geolocation analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>Zero cookie consent banners required</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>30-day telemetry retention</span>
                </li>
              </ul>
            </div>

            <a
              href={getDashboardUrl("/register")}
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all border border-slate-700 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Card 2: Pro (Centerpiece Highlight) */}
          <div className="relative flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#0a0f24] to-slate-900/95 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl lg:-translate-y-2">
            {/* Top glowing banner */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 text-slate-950 text-[11px] font-black tracking-wider uppercase shadow-lg shadow-cyan-500/25 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>Most Popular • All Features</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400/20 via-cyan-500/20 to-indigo-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Full Power
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2">Cloud Pro</h2>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                For fast-growing SaaS products and engineering teams needing AI radar and performance observability.
              </p>

              {/* Dynamic Price Box with Volume Selector */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 mb-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white font-mono">${proDisplayPrice}</span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  {billingCycle === "annual" ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      Save ${annualSavings}/yr
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Billed monthly</span>
                  )}
                </div>

                {/* Event Tier Selector Buttons */}
                <div className="space-y-1.5 pt-1 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                    <span>Monthly Event Allowance:</span>
                    <span className="text-cyan-400 font-mono font-bold">{selectedTier.events}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {VOLUME_TIERS.map((tier, idx) => {
                      const isSelected = idx === selectedTierIndex;
                      return (
                        <button
                          key={tier.events}
                          type="button"
                          onClick={() => setSelectedTierIndex(idx)}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer text-center ${
                            isSelected
                              ? "bg-cyan-500 text-slate-950 shadow-sm"
                              : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
                          }`}
                        >
                          {tier.events.replace(",000", "k")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Everything in Starter, Plus Extra Modules:</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <span><strong>{selectedTier.events}</strong> monthly events included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <span><strong>Unlimited</strong> websites &amp; domains</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-amber-300" />
                  </div>
                  <span><strong className="text-white">Custom Business Events:</strong> Revenue values &amp; no-code rules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-amber-300" />
                  </div>
                  <span><strong className="text-white">GEO &amp; AI Search Radar:</strong> SearchGPT, Perplexity, ClaudeBot</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-amber-300" />
                  </div>
                  <span><strong className="text-white">Core Web Vitals RUM:</strong> Real user p75 LCP, INP, CLS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-amber-300" />
                  </div>
                  <span><strong className="text-white">Behavioral UX:</strong> Rage Click &amp; Dead Click friction detection</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-amber-300" />
                  </div>
                  <span><strong className="text-white">Crash Diagnostics:</strong> Uncaught error &amp; AI debug triage</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <span>Custom reverse-proxy domain (100% AdBlock proof)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <span>1-year full telemetry retention</span>
                </li>
              </ul>
            </div>

            <a
              href={getDashboardUrl("/register?plan=pro")}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-black text-sm text-center transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Pro Features</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Enterprise */}
          <div className="relative flex flex-col justify-between p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                  Scale &amp; Security
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2">Enterprise</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                Dedicated infrastructure, custom SLAs, and high throughput event ingestion for large organizations.
              </p>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">Custom</span>
                  <span className="text-xs text-slate-400 font-medium">/ scale</span>
                </div>
                <div className="text-[11px] text-indigo-400 font-semibold mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Custom contract &amp; dedicated SLA</span>
                </div>
              </div>

              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span>Enterprise Inclusions:</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span>Custom volume (10M to 1B+ events/month)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span>Dedicated single-tenant database instance</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span>Custom DPA &amp; sovereign EU hosting</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span>SAML SSO (Okta, Azure AD, Google Workspace)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span>99.99% uptime guarantee SLA</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span>Dedicated Slack channel &amp; priority engineer</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:contact@openanalytics.org.in?subject=Enterprise%20Plan%20Inquiry"
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all border border-slate-700 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE SPOTLIGHT: THE 4 PRO EXTRA MODULES            */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Module Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Why Teams Upgrade To Pro
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Click each module below to preview the extra intelligence features included in your Pro subscription.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: "events", label: "Custom Events & Rules", icon: Zap, badge: "Conversions" },
            { id: "ai", label: "GEO & AI Search Radar", icon: Bot, badge: "AI Crawlers" },
            { id: "rum", label: "Core Web Vitals RUM", icon: Activity, badge: "p75 Field" },
            { id: "ux", label: "Behavioral UX & Rage Clicks", icon: Flame, badge: "Friction" },
            { id: "errors", label: "Crash & Error Triage", icon: Bug, badge: "AI Prompts" },
            { id: "proxy", label: "Custom Proxy Domain", icon: ShieldCheck, badge: "AdBlock Proof" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSpotlightTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSpotlightTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/50 text-white shadow-lg shadow-cyan-950/40"
                    : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1f] border border-white/[0.1] shadow-2xl backdrop-blur-xl">
          {activeSpotlightTab === "events" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Module: Custom Business Events &amp; Conversion Radar</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Track Conversions, Milestones &amp; Revenue Values
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Go beyond pageviews. Track signups, checkouts, and custom user milestones with revenue attribution, full JSON metadata payload inspection, and no-code CSS selector autotrack rules.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span><strong>Live Custom Events Stream:</strong> Real-time feed of business actions and telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span><strong>Revenue Attribution:</strong> Track exact monetary values ($) generated per conversion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span><strong>No-Code Event Rules:</strong> Autotrack buttons, clicks, and forms without code edits</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                  <span>CUSTOM CONVERSION TELEMETRY</span>
                  <span className="text-amber-400 font-bold">$12,480.00 tracked</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">event: upgrade_pro_annual</div>
                      <div className="text-[10px] text-slate-400 font-sans">plan: pro • cycle: annual</div>
                    </div>
                    <span className="text-emerald-400 font-black">+$180.00</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">event: team_invite_sent</div>
                      <div className="text-[10px] text-slate-400 font-sans">role: editor • autotrack rule</div>
                    </div>
                    <span className="text-cyan-400 font-bold">Milestone</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "ai" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Module 1: GEO &amp; AI Search Engine Radar</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Track Where LLMs Recommend Your Content
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Generative AI search engines (Perplexity, SearchGPT, Claude, and Gemini) drive high-intent traffic without conventional search cookies. Open Analytics automatically categorizes AI assistant citations and monitors bot scraping frequency.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400" />
                    <span>Real-time tracking of GPTBot, ClaudeBot, PerplexityBot, and Bytespider</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400" />
                    <span>AEO readiness audit scoring for Schema.org JSON-LD structured data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400" />
                    <span>Direct citation discovery on high-converting landing pages</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                  <span>AI SEARCH ENGINE TELEMETRY</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Active Radar
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-white font-bold">Perplexity AI</span>
                    </div>
                    <span className="text-cyan-300 font-bold">1,842 citations</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-bold">OpenAI SearchGPT</span>
                    </div>
                    <span className="text-emerald-300 font-bold">920 visits</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-white font-bold">ClaudeBot (Anthropic)</span>
                    </div>
                    <span className="text-purple-300 font-bold">418 crawls</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "rum" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Module 2: Real User Monitoring (RUM) Core Web Vitals</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Field Performance Directly From Real Visitors
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Lab tests like Lighthouse don&apos;t reflect real devices. Open Analytics samples real browser sessions to measure exact 75th-percentile (p75) field performance metrics according to Google&apos;s Web Vitals standards.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span><strong>LCP (Largest Contentful Paint):</strong> Loading speed metric</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span><strong>INP (Interaction to Next Paint):</strong> Modern user responsiveness metric</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span><strong>CLS (Cumulative Layout Shift):</strong> Visual stability score</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold">p75 LCP</div>
                  <div className="text-2xl font-black text-emerald-400">1.2s</div>
                  <div className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold uppercase">Good</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold">p75 INP</div>
                  <div className="text-2xl font-black text-emerald-400">74ms</div>
                  <div className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold uppercase">Good</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold">p75 CLS</div>
                  <div className="text-2xl font-black text-emerald-400">0.02</div>
                  <div className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold uppercase">Good</div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "ux" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Module 3: Behavioral UX &amp; Rage Click Detection</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Find Where Users Get Frustrated and Bounce
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When a button doesn&apos;t respond or an element is broken, users click rapidly in frustration. Open Analytics detects and surfaces these friction signals with zero client configuration.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400" />
                    <span><strong>Rage Clicks:</strong> 3+ rapid clicks on broken or slow UI elements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400" />
                    <span><strong>Dead Clicks:</strong> Clicks on non-interactive elements that lead nowhere</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400" />
                    <span><strong>Desktop Exit Intent:</strong> Mouse velocity velocity tracking towards window close</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                  <span>DETECTED UI FRICTION EVENTS</span>
                  <span className="text-rose-400 font-bold">84 incidents</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">button#checkout-submit</div>
                      <div className="text-[10px] text-slate-400 font-sans">/checkout • 4.2 clicks/sec avg</div>
                    </div>
                    <span className="text-rose-400 font-black">28 Rage</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">span.pricing-annual-badge</div>
                      <div className="text-[10px] text-slate-400 font-sans">/pricing • Non-interactive click</div>
                    </div>
                    <span className="text-amber-400 font-black">19 Dead</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpotlightTab === "errors" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <Bug className="w-3.5 h-3.5" />
                  <span>Module 4: Crash Diagnostics &amp; AI Fix Prompts</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Debug Frontend Exceptions Before Users Complain
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Automatically capture unhandled JavaScript errors, broken assets, and 500 API failures. Open Analytics formats the stack trace and user session breadcrumbs into ready-to-use AI prompts for Claude, ChatGPT, or Gemini.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Uncaught runtime exceptions and promise rejections capture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Circular user action breadcrumbs (last 10 routes and clicks)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1-Click copyable AI Bug Triage prompt for instant debugging</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <Bug className="w-3.5 h-3.5" />
                    TypeError: Cannot read properties of undefined
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">High Impact</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 text-[11px] text-slate-300 font-mono">
                  at handlePaymentSubmit (checkout.tsx:142:19)<br />
                  at HTMLButtonElement.dispatch (react-dom.js:3214)
                </div>
                <button
                  type="button"
                  className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center justify-center gap-1.5"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Copy Formatted AI Debug Prompt</span>
                </button>
              </div>
            </div>
          )}

          {activeSpotlightTab === "proxy" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Module 5: Custom Reverse-Proxy Domain</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  100% Immune to Browser AdBlockers
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Browser extensions block up to 35% of analytics traffic on developer and tech websites. With Pro, route your telemetry through your own primary domain (e.g. yourdomain.com/telemetry) to restore full statistical accuracy.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>First-party application traffic recognition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>Zero third-party domain lookup delays</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>Works with Cloudflare, Vercel, Next.js rewrites, and Nginx</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Third-Party Scripts:</span>
                      <div className="text-[10px] text-slate-400">google-analytics.com/g/collect</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px] font-bold">BLOCKED</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Open Analytics Proxy:</span>
                      <div className="text-[10px] text-slate-400">yourdomain.com/api/v1/collect</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] font-bold">ALLOWED (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DETAILED FEATURE MATRIX                                   */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Full Feature Comparison Matrix
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Clear overview of what is included in Free Starter versus Pro and Enterprise.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-slate-950/70 text-slate-300">
                <th className="py-4 px-6 font-bold text-white">Capabilities</th>
                <th className="py-4 px-6 font-bold text-emerald-400">Free Starter</th>
                <th className="py-4 px-6 font-bold text-cyan-300">Pro ($19/mo)</th>
                <th className="py-4 px-6 font-bold text-indigo-400">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
              
              {/* Category 1: Capacity */}
              <tr className="bg-slate-900/80 font-bold text-slate-200 text-xs">
                <td colSpan={4} className="py-3 px-6 uppercase tracking-wider text-slate-400">
                  Capacity &amp; Websites
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Monthly Events Included</td>
                <td className="py-3.5 px-6">10,000</td>
                <td className="py-3.5 px-6 font-bold text-cyan-300">250,000 included</td>
                <td className="py-3.5 px-6 font-bold text-indigo-300">Custom (10M+)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Tracked Websites</td>
                <td className="py-3.5 px-6">1 Website</td>
                <td className="py-3.5 px-6 font-bold text-cyan-300">Unlimited</td>
                <td className="py-3.5 px-6 font-bold text-indigo-300">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Data Retention</td>
                <td className="py-3.5 px-6">30 Days</td>
                <td className="py-3.5 px-6 font-bold text-cyan-300">1 Full Year</td>
                <td className="py-3.5 px-6 font-bold text-indigo-300">Custom / Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Team Members &amp; Seats</td>
                <td className="py-3.5 px-6 font-semibold text-emerald-400">Unlimited</td>
                <td className="py-3.5 px-6 font-semibold text-cyan-300">Unlimited</td>
                <td className="py-3.5 px-6 font-semibold text-indigo-300">Unlimited</td>
              </tr>

              {/* Category 2: Core Analytics */}
              <tr className="bg-slate-900/80 font-bold text-slate-200 text-xs">
                <td colSpan={4} className="py-3 px-6 uppercase tracking-wider text-slate-400">
                  Core Analytics (Included on All Plans)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Real-Time Live Event Stream</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Top Pages, UTM Campaigns, Referrers</td>
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
                <td className="py-3.5 px-6 font-medium text-white">Zero Cookie Consent Banners Needed</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>

              {/* Category 3: Pro Extra Modules */}
              <tr className="bg-slate-900/80 font-bold text-slate-200 text-xs">
                <td colSpan={4} className="py-3 px-6 uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Advanced Extra Modules (Pro &amp; Enterprise Only)</span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Custom Events &amp; Conversion Rules Engine</span>
                </td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span>GEO &amp; AI Search Engine Radar</span>
                </td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Core Web Vitals RUM (LCP, INP, CLS)</span>
                </td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Behavioral UX &amp; Rage Click Friction Radar</span>
                </td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                  <Bug className="w-4 h-4 text-emerald-400" />
                  <span>Crash &amp; Frontend Error Diagnostics</span>
                </td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Custom Reverse-Proxy Domain (AdBlock Proof)</span>
                </td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-cyan-400" /></td>
              </tr>

              {/* Category 4: Security & Support */}
              <tr className="bg-slate-900/80 font-bold text-slate-200 text-xs">
                <td colSpan={4} className="py-3 px-6 uppercase tracking-wider text-slate-400">
                  Infrastructure, SLA &amp; Support
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Support SLA</td>
                <td className="py-3.5 px-6">Community</td>
                <td className="py-3.5 px-6 font-semibold text-cyan-300">Priority Email</td>
                <td className="py-3.5 px-6 font-semibold text-indigo-300">Dedicated Slack + SLA</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Single Sign-On (SAML SSO)</td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Dedicated Database Instance</td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6 text-slate-500">—</td>
                <td className="py-3.5 px-6"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE ACCORDION FAQS                                */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pricing FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Frequently Asked Pricing Questions
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Everything you need to know about plans, billing, and extra features.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-white/[0.08] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04] animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM CTA & RISK REVERSAL                                */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pb-12">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Start Measuring What Matters In 60 Seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join developers and product teams who switched from bloated Google Analytics to lightweight, honest telemetry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href={getDashboardUrl("/register")}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/vs-google-analytics"
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-700"
            >
              Compare with GA4
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Cookie Banners</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>100% GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>&lt;3.2KB Brotli Payload</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>1-Click Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

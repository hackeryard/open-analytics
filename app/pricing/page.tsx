import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Server,
  Cloud,
  Layers,
  HelpCircle,
  Code2,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Pricing & Plans | Free Self-Hosted & Managed Cloud - Open Analytics",
  description:
    "100% Free & Open-Source self-hosted analytics with unlimited events, or managed high-speed Cloud starting free. No credit card required. Zero cookie banners.",
  keywords: [
    "open analytics pricing",
    "free web analytics",
    "cookieless analytics pricing",
    "open source web analytics self-hosted",
    "google analytics alternative pricing",
    "privacy friendly analytics plans",
    "gdpr analytics pricing",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Open Analytics Pricing | 100% Free Self-Hosted & Cloud Tiers",
    description:
      "Transparent pricing for privacy-first web telemetry. Self-host for free with unlimited events, or use Cloud Free up to 50k events/mo.",
    url: `${baseUrl}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Pricing & Plans",
    description: "Free self-hosted forever. Managed cloud starting free. No tracking cookies.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: `${baseUrl}/pricing`,
    },
  ],
};

const productOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics Platform",
  image: `${baseUrl}/icon.svg`,
  description:
    "Privacy-first, cookieless web telemetry and RUM analytics platform available as free self-hosted open-source software and managed cloud service.",
  brand: {
    "@type": "Brand",
    name: "Open Analytics",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Community Self-Hosted",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
      description: "100% Free forever self-hosted edition. Unlimited events, full data ownership, Docker & Node deployable.",
    },
    {
      "@type": "Offer",
      name: "Cloud Starter",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
      description: "Managed cloud starter tier with 50,000 monthly events and zero credit card required.",
    },
    {
      "@type": "Offer",
      name: "Cloud Pro",
      price: "19",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
      description: "Managed cloud pro tier with 500,000 monthly events, Core Web Vitals RUM, AI Radar, and custom domain proxying.",
    },
  ],
};

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Open Analytics truly free for self-hosting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Open Analytics is 100% free and open-source under the MIT license. You can deploy it to your own servers (Docker, Kubernetes, VPS, or Vercel/Railway) with unlimited events, unlimited tracked websites, and complete data ownership with zero licensing fees.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to display a cookie consent banner with Open Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Because Open Analytics does not store cookies, LocalStorage tracking IDs, or persistent device fingerprints, it is strictly exempt from ePrivacy Directive and GDPR cookie banner requirements. You can legally remove annoying cookie banners from your website.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my site exceeds the monthly event limit on Cloud Starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We will never abruptly cut off your telemetry or delete your data. When you reach 100% of your plan's event allowance, we send an email notification with a 7-day grace window to upgrade to Cloud Pro or switch to self-hosting.",
      },
    },
    {
      "@type": "Question",
      name: "Can I migrate between Self-Hosted and Managed Cloud?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All Open Analytics instances use standard PostgreSQL schemas. You can export your data via JSON or SQL dump and import it seamlessly into either self-hosted or managed cloud instances at any time.",
      },
    },
    {
      "@type": "Question",
      name: "Do you charge extra for team members or multiple websites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Unlike Google Analytics 360 or traditional enterprise analytics platforms that charge per seat, Open Analytics allows unlimited team members with granular RBAC permissions across all plans.",
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={productOfferSchema} />
      <JsonLd schema={pricingFaqSchema} />

      {/* Hero Header */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent, Predictable Pricing
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Simple, Fair Telemetry.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Self-Host Free or Cloud.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
          Run our lightweight, privacy-first analytics on your own servers for free forever, or enjoy zero-maintenance high-speed managed cloud infrastructure.
        </p>

        {/* GEO Quick Answer Box */}
        <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1.5">
            <Zap className="w-3.5 h-3.5" />
            Direct Answer / Executive Pricing Summary
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">Is Open Analytics free?</strong> Yes. Open Analytics is{" "}
            <span className="text-cyan-300 font-medium">100% free and open-source</span> for self-hosting with zero limits on events, websites, or retention. For hands-off cloud hosting, the{" "}
            <span className="text-cyan-300 font-medium">Cloud Starter tier is $0/month</span> (50,000 events/mo with no credit card required), and{" "}
            <span className="text-cyan-300 font-medium">Cloud Pro is $19/month</span> with Core Web Vitals RUM, AI bot radar, and custom domain proxying.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Plan 1: Community Self-Hosted */}
          <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-cyan-400 border border-slate-700">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Open Source
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Community</h2>
              <p className="text-xs text-slate-400 mb-5">Self-host on your own servers with complete data sovereignty.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 font-medium">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Unlimited monthly events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Unlimited websites & domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Docker & Node.js 1-line deploy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>100% data ownership (PostgreSQL)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sub-3.2KB telemetry script</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Community Discord support</span>
                </li>
              </ul>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              View on GitHub
            </a>
          </div>

          {/* Plan 2: Cloud Starter */}
          <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-sky-400 border border-slate-700">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Free Managed
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Cloud Starter</h2>
              <p className="text-xs text-slate-400 mb-5">Zero setup needed. Start collecting analytics in under 60 seconds.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>50,000 events / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 3 tracked websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-year rolling data retention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero cookie banners required</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time dashboard telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No credit card required</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Plan 3: Cloud Pro (Highlighted) */}
          <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900/90 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/40 backdrop-blur-md">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 text-[11px] font-bold tracking-wide uppercase shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Full Power
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Cloud Pro</h2>
              <p className="text-xs text-slate-300 mb-5">For growing startups and production apps requiring AI telemetry & RUM.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span><strong>500,000</strong> events / month included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Unlimited tracked websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>AI Search Engine Radar (Perplexity, SearchGPT)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Core Web Vitals RUM (LCP, INP, CLS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Rage & Dead Click behavioral analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Custom reverse-proxy domain setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Priority email support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs text-center transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              Start 14-Day Pro Trial
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Plan 4: Enterprise */}
          <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-indigo-400 border border-slate-700">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Custom
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Enterprise</h2>
              <p className="text-xs text-slate-400 mb-5">Dedicated cloud instances, custom data agreements, and 99.99% SLAs.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">Custom</span>
                <span className="text-xs text-slate-500 font-medium">/ volume</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom billions-scale event volume</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Dedicated single-tenant database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom DPA & enterprise compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>SAML SSO & enterprise team management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>99.99% uptime guarantee SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Dedicated Slack channel & architect</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:contact@openanalytics.org.in?subject=Enterprise%20Inquiry"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              Contact Sales
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Full Capability & Plan Matrix
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about our community open-source release versus managed cloud tiers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300">
                <th className="py-4 px-4 sm:px-6 font-semibold">Features</th>
                <th className="py-4 px-4 font-semibold text-cyan-400">Community</th>
                <th className="py-4 px-4 font-semibold text-emerald-400">Cloud Starter</th>
                <th className="py-4 px-4 font-semibold text-cyan-300">Cloud Pro</th>
                <th className="py-4 px-4 font-semibold text-indigo-400">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {/* Telemetry Core */}
              <tr className="bg-slate-900/80 font-medium text-slate-200 text-xs">
                <td colSpan={5} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-slate-400">
                  Data & Privacy Core
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Monthly Events</td>
                <td className="py-3 px-4">Unlimited</td>
                <td className="py-3 px-4">50,000</td>
                <td className="py-3 px-4">500,000+</td>
                <td className="py-3 px-4">Custom (100M+)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Websites Allowed</td>
                <td className="py-3 px-4">Unlimited</td>
                <td className="py-3 px-4">3 Websites</td>
                <td className="py-3 px-4">Unlimited</td>
                <td className="py-3 px-4">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Zero Cookie Banner Required</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">GDPR & CCPA Compliant</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Data Retention</td>
                <td className="py-3 px-4">Custom / Forever</td>
                <td className="py-3 px-4">1 Year</td>
                <td className="py-3 px-4">2 Years</td>
                <td className="py-3 px-4">Custom (Unlimited)</td>
              </tr>

              {/* Advanced Monitoring */}
              <tr className="bg-slate-900/80 font-medium text-slate-200 text-xs">
                <td colSpan={5} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-slate-400">
                  Performance & Behavioral Telemetry
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Core Web Vitals RUM (LCP, INP, CLS)</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4 text-slate-500">Basic</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">AI Search Radar (Perplexity, SearchGPT)</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4 text-slate-500">—</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Rage & Dead Click Heat Detection</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4 text-slate-500">—</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Frontend Error Triage (Console & Unhandled)</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4 text-slate-500">—</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>

              {/* Security & Infrastructure */}
              <tr className="bg-slate-900/80 font-medium text-slate-200 text-xs">
                <td colSpan={5} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-slate-400">
                  Integrations & Support
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Custom Domain Proxy (AdBlock Proof)</td>
                <td className="py-3 px-4">Self-configured</td>
                <td className="py-3 px-4 text-slate-500">—</td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="py-3 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Team Members & Granular Roles</td>
                <td className="py-3 px-4">Unlimited</td>
                <td className="py-3 px-4">3 Members</td>
                <td className="py-3 px-4">Unlimited</td>
                <td className="py-3 px-4">Unlimited + SSO</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-medium text-white">Support SLA</td>
                <td className="py-3 px-4">Community</td>
                <td className="py-3 px-4">Community</td>
                <td className="py-3 px-4">Priority Email</td>
                <td className="py-3 px-4">Dedicated Slack + 99.99%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AEO Pricing FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Pricing Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Answers for Developers and Teams
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Is Open Analytics truly free for self-hosting on commercial websites?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Yes. Open Analytics is released under a permissive open-source license. You can deploy it to your own cloud servers, VPS, or Kubernetes clusters and run it across any number of commercial projects or client websites without paying any licensing or subscription fee.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Do I have to display a cookie consent banner when using Open Analytics?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No. Under the EU ePrivacy Directive and GDPR (Article 5 & 6), cookie banners are strictly triggered when a website stores non-essential files or identifiers on the visitor&apos;s device (such as cookies, localStorage tokens, or persistent cross-site fingerprints). Open Analytics stores zero client-side files and utilizes 24-hour cryptographic rotating salts, making it legally exempt from cookie banner mandates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              What happens if my site experiences a traffic spike and exceeds Cloud Starter limits?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We never cut off your telemetry mid-spike or destroy data. We provide a 7-day grace window during which we email you to notify you that your limit has been reached. You can either upgrade to Cloud Pro or easily switch to your own self-hosted deployment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Can I migrate between Self-Hosted and Cloud without losing historical data?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Yes! All Open Analytics editions share identical PostgreSQL database schemas. You can use our built-in export tool or standard PostgreSQL pg_dump to transfer your metrics between cloud and self-hosted instances with zero data loss.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Do you charge per user seat or team member?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No. We believe analytics insights should be accessible to everyone on your team—engineers, designers, product managers, and marketers. We do not charge per-seat fees on any plan.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Start Measuring What Matters Today
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Join thousands of modern developers who switched from heavy Google Analytics to fast, cookieless telemetry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Get Started for Free
            </Link>
            <Link
              href="/vs-google-analytics"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              See GA4 Comparison
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

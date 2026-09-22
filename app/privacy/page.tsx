import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  KeyRound,
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Server,
  RefreshCw,
  Cpu,
  FileCode2,
  Check,
  X,
  Activity,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Privacy Architecture & GDPR Compliance",
  description:
    "Technical overview of Open Analytics privacy architecture: 100% GDPR, CCPA, and PECR compliance, zero cookie consent banners, and daily rotating 256-bit salts.",
  keywords: [
    "gdpr compliant web analytics",
    "cookieless analytics privacy",
    "no cookie banner analytics",
    "pecr compliance analytics",
    "eprivacy directive exempt analytics",
    "privacy policy open analytics",
    "ip anonymization web telemetry",
    "schrems ii compliant analytics",
    "rotating cryptographic salt analytics",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/privacy",
  },
  openGraph: {
    title: "Privacy Architecture & GDPR Compliance",
    description:
      "Technical overview of Open Analytics privacy architecture: 100% GDPR, CCPA, and PECR compliance, zero cookie consent banners, and daily rotating 256-bit salts.",
    url: `${baseUrl}/privacy`,
    type: "article",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Privacy Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Architecture & GDPR Compliance",
    description:
      "Technical overview of Open Analytics privacy architecture: 100% GDPR, CCPA, and PECR compliance, zero cookie consent banners, and daily rotating 256-bit salts.",
    images: [`${baseUrl}/og-image.png`],
  },
};

const breadcrumbSchema = {
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
      name: "Privacy & GDPR",
      item: `${baseUrl}/privacy`,
    },
  ],
};

const privacyArticleSchema = {
  "@type": "TechArticle",
  "@id": `${baseUrl}/privacy/#article`,
  headline: "Open Analytics Privacy & Data Protection Architecture",
  description: "Comprehensive engineering breakdown of cookieless telemetry, rotating daily cryptographic salts, and EU data sovereignty.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
    url: baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "Open Analytics",
    url: baseUrl,
  },
};

const privacyFaqSchema = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is Open Analytics exempt from cookie consent banner laws?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under Article 5(3) of the EU ePrivacy Directive (PECR in the UK), consent banners are only legally required when storing information or gaining access to information already stored in the terminal equipment of a subscriber or user (cookies, localStorage, or persistent device fingerprints). Open Analytics stores zero client-side files and does not fingerprint devices, making it legally exempt from cookie banners.",
      },
    },
    {
      "@type": "Question",
      name: "How does Open Analytics protect visitor privacy with daily salts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Visitor IDs are computed by combining the masked IP address, User-Agent, and a 256-bit cryptographic salt rotated and purged every 24 hours. This makes cross-day profiling mathematically impossible.",
      },
    },
    {
      "@type": "Question",
      name: "Is Open Analytics compliant with the Schrems II ruling regarding EU-US data transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Open Analytics processes and stores all European client telemetry within EU-based data centers (Frankfurt and Amsterdam) with zero transfer of personal identifiable information to US servers.",
      },
    },
  ],
};

const privacyPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema,
    privacyArticleSchema,
    privacyFaqSchema,
  ],
};

export default function PrivacyPage() {
  const dashboardUrl = getDashboardUrl("/");

  const samplePrivacyClause = `### Privacy Policy Telemetry Clause for Your Website:
We use Open Analytics (https://openanalytics.org.in) for privacy-friendly web performance and traffic observability. Open Analytics does not use cookies, local storage identifiers, or persistent device fingerprinting, and does not collect or store personally identifiable information (PII). Visitors' IP addresses are masked in volatile memory and anonymized with a 24-hour rotating cryptographic salt that is purged daily. Therefore, no cross-site profiling or multi-day visitor tracking is conducted.`;

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      <JsonLd data={privacyPageSchema} />

      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 text-xs font-medium mb-8 transition shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Privacy Architecture:</span>
          <span>100% Cookieless by Design</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">GDPR &amp; PECR Exempt</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.06]">
          Privacy guaranteed by mathematical architecture, not promises.
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          How Open Analytics achieves 100% GDPR, CCPA, and PECR compliance with zero cookies, zero persistent identifiers, and 24-hour rotating cryptographic salts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/docs"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
          >
            <span>Developer Docs</span>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE 24-HOUR ROTATING CRYPTOGRAPHIC SALT PIPELINE           */}
      {/* ============================================================ */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-6 sm:p-10 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The 24-Hour Rotating Cryptographic Salt Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              How visitor telemetry is converted into non-reversible, single-day session hashes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] text-white font-mono font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="text-sm font-semibold text-white">Volatile Masking in RAM</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When a request arrives, the visitor&apos;s IP address is masked in volatile memory (/16 for IPv4, e.g. 192.168.0.0). Raw IP addresses are never written to persistent disk or database logs.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="text-sm font-semibold text-white">HMAC-SHA-256 Hashing</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A daily hash is computed: <code className="text-emerald-400 font-mono text-[11px]">HMAC(MaskedIP + UserAgent, DailySalt)</code>. This generates a pseudo-anonymous session ID for same-day visits.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] text-purple-400 font-mono font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="text-sm font-semibold text-white">Permanent 24h Salt Purge</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                At 00:00:00 UTC, the daily salt is permanently erased from memory and regenerated. It becomes mathematically impossible to correlate any visitor across multiple days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. COMPLETE TRANSPARENCY MATRIX                              */}
      {/* ============================================================ */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Complete transparency matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Clear separation between performance telemetry and invasive personal tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What We Track */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono uppercase tracking-wider">
              <CheckCircle2 size={16} />
              <span>What Open Analytics Tracks</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Page URLs, document title, and referral sources</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Device category (desktop, mobile, tablet), browser family, OS</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Geographic country &amp; approximate city (via IP lookup in RAM)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Core Web Vitals field measurements (p75 LCP, INP, CLS)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Rage click counts and unhandled JavaScript runtime errors</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>AI Search bot crawler visits (SearchGPT, Perplexity, Claude)</span>
              </li>
            </ul>
          </div>

          {/* What We NEVER Track */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-zinc-400 font-semibold text-xs font-mono uppercase tracking-wider">
              <XCircle size={16} className="text-rose-400" />
              <span>What We NEVER Collect Or Store</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No HTTP tracking cookies or LocalStorage identifiers</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No raw or complete IP addresses stored on disk</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No cross-site visitor tracking or multi-day profile building</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No canvas rendering, WebGL, or hardware device fingerprinting</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No personal identifiable information (emails, names, phone numbers)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No data selling, advertising retargeting, or third-party sharing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. READY-TO-USE CUSTOMER PRIVACY POLICY SNIPPET             */}
      {/* ============================================================ */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <FileCode2 size={16} className="text-zinc-400" />
              <span>Ready-to-use Privacy Policy Clause</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Copy &amp; paste into your website's Privacy Policy</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Customers often ask what they should state in their public privacy policy when adopting Open Analytics. Here is our recommended, legally verified clause:
          </p>
          <pre className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] text-xs font-mono text-zinc-300 leading-relaxed select-all whitespace-pre-wrap">
            {samplePrivacyClause}
          </pre>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BOTTOM CTA CONSOLE                                        */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto">
            <Activity size={24} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Deploy privacy-first web telemetry today.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Start collecting honest, fast, and compliant analytics in 60 seconds with zero credit card required.
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
              href="/faq"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#14161f] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
            >
              <span>Read Compliance FAQ</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

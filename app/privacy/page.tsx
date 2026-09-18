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
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Privacy Architecture & GDPR Compliance Guide | Open Analytics",
  description:
    "Technical documentation of Open Analytics privacy-first telemetry architecture: 100% GDPR, CCPA, and PECR compliant with zero cookie consent banners, 24-hour cryptographic rotating salts, and zero PII storage.",
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
    title: "Privacy Policy & GDPR Compliance Architecture | Open Analytics",
    description:
      "Why Open Analytics requires zero cookie banners, stores zero PII, and complies strictly with GDPR, CCPA, and PECR.",
    url: `${baseUrl}/privacy`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Privacy & GDPR Compliance",
    description: "Cryptographic rotating salts, zero cookies, and mathematical privacy protection.",
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
      name: "Privacy Policy",
      item: `${baseUrl}/privacy`,
    },
  ],
};

const privacyArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics Privacy Architecture & GDPR Compliance Guide",
  description:
    "Technical documentation of Open Analytics privacy-first telemetry architecture, cryptographic hashing, and legal compliance under GDPR, PECR, and CCPA.",
  datePublished: "2026-01-01T00:00:00Z",
  dateModified: "2026-09-16T00:00:00Z",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
    url: baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "Open Analytics",
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/icon.svg`,
    },
  },
};

const privacyFaqSchema = {
  "@context": "https://schema.org",
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
      name: "How does Open Analytics calculate unique visitors without tracking users across days?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Analytics generates a pseudo-anonymous daily session identifier using HMAC-SHA-256 combining the truncated IP address, User-Agent string, and a daily cryptographic salt. At 00:00:00 UTC every night, this salt is permanently purged from memory and replaced, making it mathematically impossible to link a visitor across multiple days.",
      },
    },
    {
      "@type": "Question",
      name: "Does Open Analytics store raw IP addresses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Raw IP addresses are processed entirely in ephemeral RAM for geolocation lookup (country and city level) and immediately truncated (/16 for IPv4 and /64 for IPv6) before session hashing. Raw IP addresses are never written to disk, databases, or application log files.",
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

export default function PrivacyPage() {
  const dashboardUrl = getDashboardUrl("/");

  const samplePrivacyClause = `### Privacy Policy Telemetry Clause for Your Website:
We use Open Analytics (https://openanalytics.org.in) for privacy-friendly web performance and traffic observability. Open Analytics does not use cookies, local storage identifiers, or persistent device fingerprinting, and does not collect or store personally identifiable information (PII). Visitors' IP addresses are masked in volatile memory and anonymized with a 24-hour rotating cryptographic salt that is purged daily. Therefore, no cross-site profiling or multi-day visitor tracking is conducted.`;

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={privacyArticleSchema} />
      <JsonLd schema={privacyFaqSchema} />

      {/* Hero Header */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-emerald-500/15 via-cyan-600/10 to-transparent blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Cryptographic Privacy Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
          Privacy Guaranteed By{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Mathematical Architecture,
          </span>{" "}
          Not Promises.
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          How Open Analytics achieves 100% GDPR, CCPA, and PECR compliance with zero cookies, zero persistent identifiers, and 24-hour rotating cryptographic salts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/docs"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-sm transition border border-white/[0.1] flex items-center justify-center gap-2"
          >
            <span>Developer Docs</span>
          </Link>
        </div>
      </section>

      {/* Visual Salt Rotation Architecture Flow */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              The 24-Hour Rotating Cryptographic Salt Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              How visitor telemetry is converted into non-reversible, single-day session hashes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.08] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Volatile Masking in RAM</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a request arrives, the visitor&apos;s IP address is masked in volatile memory (/16 for IPv4, e.g. 192.168.0.0). Raw IP addresses are never written to persistent disk or database logs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.08] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                2
              </div>
              <h4 className="text-sm font-bold text-white">HMAC-SHA-256 Hashing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A daily hash is computed: <code className="text-emerald-300 font-mono text-[11px]">HMAC(MaskedIP + UserAgent, DailySalt)</code>. This generates a pseudo-anonymous session ID for same-day visits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.08] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Permanent 24h Salt Purge</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                At 00:00:00 UTC, the daily salt is permanently erased from memory and regenerated. It becomes mathematically impossible to correlate any visitor across multiple days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Track vs What We Never Track Matrix */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Complete Transparency Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Clear separation between performance telemetry and invasive personal tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What We Track */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm font-mono uppercase tracking-wider">
              <CheckCircle2 size={18} />
              <span>What Open Analytics Tracks</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Page URLs, document title, and referral sources</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Device category (desktop, mobile, tablet), browser family, OS</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Geographic country &amp; approximate city (via IP lookup in RAM)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Core Web Vitals field measurements (p75 LCP, INP, CLS)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Rage click counts and unhandled JavaScript runtime errors</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>AI Search bot crawler visits (SearchGPT, Perplexity, Claude)</span>
              </li>
            </ul>
          </div>

          {/* What We NEVER Track */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/[0.02] border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm font-mono uppercase tracking-wider">
              <XCircle size={18} />
              <span>What We NEVER Collect Or Store</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No HTTP tracking cookies or LocalStorage identifiers</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No raw or complete IP addresses stored on disk</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No cross-site visitor tracking or multi-day profile building</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No canvas rendering, WebGL, or hardware device fingerprinting</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No personal identifiable information (emails, names, phone numbers)</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>No data selling, advertising retargeting, or third-party sharing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Copy-Paste Customer Privacy Policy Snippet */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070b16] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <FileCode2 size={16} className="text-cyan-400" />
              <span>Ready-To-Use Privacy Policy Clause</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Copy &amp; Paste Into Your Privacy Policy</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Customers often ask what they should state in their public privacy policy when adopting Open Analytics. Here is a recommended, legally verified clause:
          </p>
          <div className="p-4 rounded-2xl bg-[#04060d] border border-white/[0.06] text-xs font-mono text-slate-300 leading-relaxed select-all whitespace-pre-wrap">
            {samplePrivacyClause}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 relative overflow-hidden space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Deploy Privacy-First Web Telemetry Today
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Start collecting honest, fast, and compliant analytics in 60 seconds with zero credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/20 cursor-pointer hover:scale-[1.02]"
            >
              Launch Dashboard
            </a>
            <Link
              href="/faq"
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-bold text-sm transition border border-white/[0.1]"
            >
              Read Compliance FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

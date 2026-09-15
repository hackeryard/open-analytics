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
} from "lucide-react";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Privacy Policy & GDPR Compliance Guide | Open Analytics",
  description:
    "Complete compliance architecture: 100% GDPR, CCPA, and PECR compliant with zero cookie consent banners, 24-hour cryptographic rotating salts, and zero PII storage.",
  keywords: [
    "gdpr compliant web analytics",
    "cookieless analytics privacy",
    "no cookie banner analytics",
    "pecr compliance analytics",
    "eprivacy directive exempt analytics",
    "privacy policy open analytics",
    "ip anonymization web telemetry",
    "schrems ii compliant analytics",
  ],
  alternates: {
    canonical: "/privacy",
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
  dateModified: "2026-09-14T00:00:00Z",
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
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={privacyArticleSchema} />
      <JsonLd schema={privacyFaqSchema} />

      {/* Hero Header */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          Privacy-By-Design Architecture
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Privacy Policy &{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
            GDPR Compliance Guide
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
          Detailed technical and legal documentation explaining how Open Analytics protects user privacy, achieves strict compliance with GDPR, PECR, and CCPA, and eliminates cookie consent banners.
        </p>

        {/* GEO Direct Answer Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-left backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1.5">
            <Lock className="w-3.5 h-3.5" />
            Executive Summary / Generative AI Quick Answer
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">Why does Open Analytics not require a cookie banner?</strong> Open Analytics stores{" "}
            <span className="text-emerald-300 font-medium">zero client-side cookies, local storage keys, or persistent tracking tokens</span> on the visitor&apos;s device. Session attribution is performed using a non-reversible cryptographic hash (HMAC-SHA-256) of the masked IP address, User-Agent string, and a daily rotating salt that is{" "}
            <span className="text-emerald-300 font-medium">permanently deleted every 24 hours</span>. Under Article 5(3) of the EU ePrivacy Directive and GDPR, analytics systems that store no device tokens are legally exempt from consent banner mandates.
          </p>
        </div>
      </section>

      {/* 4 Architectural Pillars */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Mathematical & Cryptographic Safeguards
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Privacy in Open Analytics isn&apos;t a policy promise—it is enforced by cryptographic architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              1. 24-Hour Cryptographic Rotating Salts
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              To measure daily unique visitors without persistently tracking individuals, we compute:
            </p>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 mb-3 overflow-x-auto">
              session_id = HMAC_SHA256(Masked_IP + User_Agent + Salt_24H)
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every midnight (00:00:00 UTC), <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">Salt_24H</code> is permanently purged and regenerated. Because SHA-256 is mathematically one-way and irreversible, no observer can correlate visits between Monday and Tuesday.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              2. Strict IP Anonymization & Subnet Masking
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              Raw IP addresses are classified as Personal Identifiable Information (PII) under GDPR Article 4(1). Open Analytics treats raw IPs as ephemeral byte arrays in memory:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside mb-3">
              <li>IPv4 addresses are masked to <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/16</code> (e.g. 192.168.0.0)</li>
              <li>IPv6 addresses are masked to <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/64</code> prefix</li>
              <li>Country and city are resolved in-memory using offline MaxMind GeoIP</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Raw unmasked IP addresses are never written to disk, PostgreSQL databases, or application log files.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              3. Zero Client-Side Storage or Persistent Cookies
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              Traditional analytics (such as Google Analytics 4) generate persistent identifiers like <code className="text-rose-300 bg-slate-800 px-1 py-0.5 rounded">_ga</code> cookies that stay in visitor browsers for 2 years:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside mb-3">
              <li>Zero <code className="text-emerald-400">Set-Cookie</code> headers sent or read</li>
              <li>Zero <code className="text-emerald-400">localStorage</code> or <code className="text-emerald-400">sessionStorage</code> keys</li>
              <li>Zero Canvas, WebGL, or AudioContext device fingerprinting</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Visitors cannot be tracked across tabs, across websites, or across browser restarts.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              4. Sovereign Hosting & Schrems II Immunity
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              European data protection authorities (including Austria DSB and France CNIL) declared Google Analytics illegal due to US Cloud Act surveillance access:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside mb-3">
              <li>Managed European Cloud hosted exclusively in Frankfurt &amp; Amsterdam</li>
              <li>Strict isolation from US Cloud Act jurisdiction</li>
              <li>Zero cross-border telemetry transfers to US advertising networks</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Full data sovereignty guarantees your organization remains 100% compliant with EU-US data privacy frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* Telemetry Data Matrix: Collected vs Never Collected */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Data Collection Transparency Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A clear audit of every metric processed by Open Analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collected */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
              <CheckCircle2 className="w-5 h-5" />
              What Open Analytics Collects (Aggregated)
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Page URL & Path:</strong> The web page visited (e.g. <code>/pricing</code>, query params sanitized).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>HTTP Referrer:</strong> Domain referring the traffic (e.g. <code>google.com</code>, <code>perplexity.ai</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Browser & OS Family:</strong> Extracted from standard User-Agent (e.g. Chrome 124 on macOS).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Screen Size Tier:</strong> Categorized into Mobile (&lt;768px), Tablet, or Desktop.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Geographic Country/City:</strong> Inferred from masked IP using local MaxMind database.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Core Web Vitals RUM:</strong> Standard browser performance metrics (LCP, INP, CLS).</span>
              </li>
            </ul>
          </div>

          {/* Never Collected */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-4">
              <XCircle className="w-5 h-5" />
              What Open Analytics NEVER Collects
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Persistent Cookies:</strong> No cookies of any type are ever written to browser storage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Raw IP Addresses:</strong> Full IPs are never stored in databases or log files.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Personal Identifiable Info (PII):</strong> No names, email addresses, phone numbers, or credit cards.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Cross-Site Profiles:</strong> Visitors cannot be tracked across different client websites or domains.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Device Fingerprints:</strong> No Canvas, WebGL, battery status, or font enumeration probing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Ad Tech Syndication:</strong> Telemetry is never sold, brokered, or shared with advertising exchanges.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Compliance FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Legal & Compliance Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Answers for Data Protection Officers (DPOs)
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Do I need to disclose Open Analytics in my website&apos;s Privacy Policy?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Yes. While Open Analytics does not require an opt-in consent banner, transparency under GDPR Article 13 and 14 is still recommended best practice. You can add a brief clause stating: <em>&ldquo;We use Open Analytics, a privacy-respecting analytics platform that does not use cookies, does not collect personal data, and processes anonymous aggregate statistics for website optimization.&rdquo;</em>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              How do you handle GDPR &ldquo;Right to be Forgotten&rdquo; (Article 17) requests?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Because Open Analytics does not store any personal data or persistent identifiers, all data stored in Open Analytics is fully anonymized aggregate statistics. There is no personal record or identifiable profile tied to any human individual, making deletion of individual user profiles inapplicable under GDPR Recital 26.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Is Open Analytics compliant with California CCPA / CPRA?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Yes. Open Analytics does not &ldquo;sell&rdquo; or &ldquo;share&rdquo; personal consumer information as defined under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). Users are not required to display a &ldquo;Do Not Sell My Personal Information&rdquo; link.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2">
              Can I sign a Data Processing Agreement (DPA)?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Yes. For Cloud Pro and Enterprise customers who require a formal legal Data Processing Agreement (DPA) incorporating European Commission Standard Contractual Clauses (SCCs), our legal team provides a standardized DPA upon request.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Protect Your Visitors. Ditch the Cookie Banners.
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Get accurate real-time metrics without legal risks, intrusive banners, or corporate data surveillance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Get Started Free
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

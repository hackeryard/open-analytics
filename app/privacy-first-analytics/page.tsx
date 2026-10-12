import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Trash2,
  RefreshCw,
  Server,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/privacy-first-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/privacy-first-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Privacy-First Web Telemetry Architecture & Technical Specification",
  description:
    "Technical breakdown of Open Analytics privacy-by-design architecture: ephemeral daily HMAC salts, volatile memory IP masking, and automated data retention.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function PrivacyFirstAnalyticsPage() {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Privacy-by-Design Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
              Privacy-First Web Telemetry Architecture
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10 font-sans">
              A comprehensive technical specification of how Open Analytics measures web performance, user journeys, and errors without storing IP addresses, dropping cookies, or enabling cross-site tracking.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={dashboardUrl}
                className="px-6 py-3.5 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm font-sans"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/cookieless-analytics"
                className="px-6 py-3.5 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors font-sans"
              >
                <span>Cookieless Guide</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 5 Architectural Safeguards */}
        <section className="py-20 px-6 border-b border-white/[0.08]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                The Five Technical Pillars
              </h2>
              <p className="text-sm text-zinc-400 font-sans">
                Engineered from the ground up to minimize personal data processing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Daily Salt Rotation */}
              <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-sans">
                    1. Ephemeral Daily Cryptographic Salts
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                    Visitor hashes are computed using HMAC-SHA-256 combining the client IP, User-Agent, and a randomly generated cryptographic salt. This salt rotates automatically every 24 hours at 00:00:00 UTC and is permanently destroyed from memory.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#090a0f] border border-white/[0.06] font-mono text-[11px] text-emerald-400">
                  Guarantees visitors cannot be tracked or correlated across days.
                </div>
              </div>

              {/* 2. Memory-Only IP Processing */}
              <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-sans">
                    2. Memory-Only IP Anonymization
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                    Incoming request IP addresses are held exclusively in volatile RAM only long enough to extract coarse geographic metadata (country and city) and compute the 24-hour hash. Raw IP addresses are never written to database disk storage or log files.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#090a0f] border border-white/[0.06] font-mono text-[11px] text-emerald-400">
                  0 bytes of IP address data persisted to MongoDB collections.
                </div>
              </div>

              {/* 3. Automatic PII Redaction */}
              <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-sans">
                    3. Automated PII URL Redaction
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                    Our edge ingestion pipeline automatically sanitizes URLs, discarding sensitive parameters like email addresses, auth tokens, session IDs, and credit card numbers before analytics events are recorded.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#090a0f] border border-white/[0.06] font-mono text-[11px] text-emerald-400">
                  Prevents accidental leakage of user credentials into dashboards.
                </div>
              </div>

              {/* 4. Automated 365-Day Retention */}
              <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-sans">
                    4. Hard Automated Data Retention
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                    Raw telemetry collections have a MongoDB TTL index capped at exactly 365 days. Data older than the retention threshold is automatically evicted by the database engine, adhering strictly to data minimization requirements.
                  </p>
                </div>
                <div className="p-3 rounded bg-[#090a0f] border border-white/[0.06] font-mono text-[11px] text-emerald-400">
                  Enforces strict data lifecycle governance by default.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Framework Analysis */}
        <section className="py-20 px-6 border-b border-white/[0.08] bg-[#0e0f15]/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4 font-sans text-center">
              Regulatory Alignment Overview
            </h2>
            <p className="text-xs text-zinc-400 text-center max-w-xl mx-auto mb-12 font-sans">
              How our architecture aligns with international data protection frameworks.
            </p>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white font-sans mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>EU GDPR (General Data Protection Regulation)</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  By discarding personal identifiers and avoiding device fingerprinting, Open Analytics can be deployed under Legitimate Interest (Article 6(1)(f)) for standard web analytics, without requiring active cookie consent banners.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white font-sans mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>EU ePrivacy Directive &amp; UK PECR</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  The ePrivacy Directive governs information stored on or accessed from terminal equipment (cookies, localStorage). Because Open Analytics executes statelessly without reading or writing to terminal storage, it is exempt from consent popup requirements.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white font-sans mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>California Consumer Privacy Act (CCPA / CPRA)</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  Open Analytics does not sell, share, or broker personal information. We do not maintain cross-site behavioral profiles, eliminating the need for &ldquo;Do Not Sell or Share My Personal Information&rdquo; links.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-[#090a0f] border border-white/[0.06] text-[11px] text-zinc-500 font-sans leading-relaxed">
              <strong className="text-zinc-400">Compliance Disclaimer:</strong> While Open Analytics provides privacy-preserving technical controls, legal compliance ultimately depends on your organization&apos;s specific deployment, privacy policy disclosures, jurisdiction, and data processing practices.
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 font-sans">
              Audit our architecture or deploy today
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 font-sans">
              Open Analytics gives you enterprise analytics and observability with total privacy respect.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={dashboardUrl}
                className="px-6 py-3.5 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm font-sans"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/self-hosting"
                className="px-6 py-3.5 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors font-sans"
              >
                <span>Self-Hosting Guide</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

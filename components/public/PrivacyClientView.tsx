"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  FileCode2,
  Check,
  X,
  Activity,
  Copy,
  Scale,
  ExternalLink,
  FileText,
  EyeOff,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

type RegulationKey = "gdpr" | "eprivacy" | "schrems" | "ccpa" | "retention";

interface RegulationInfo {
  name: string;
  badge: string;
  statute: string;
  summary: string;
  keyArticles: { article: string; requirement: string; howWeComply: string }[];
}

const REGULATIONS: Record<RegulationKey, RegulationInfo> = {
  gdpr: {
    name: "EU GDPR",
    badge: "Regulation (EU) 2016/679",
    statute: "General Data Protection Regulation",
    summary:
      "Open Analytics processes strictly de-identified, non-personal analytical telemetry without collecting names, emails, phone numbers, or complete IP addresses.",
    keyArticles: [
      {
        article: "Recital 26",
        requirement: "Principles of data protection do not apply to anonymous information.",
        howWeComply:
          "IP addresses are masked in volatile RAM before hashing. Because raw identifiers are never stored and hashes cannot be reversed, telemetry qualifies as anonymous statistical data.",
      },
      {
        article: "Article 5(1)(c)",
        requirement: "Data Minimisation — limited to what is strictly necessary.",
        howWeComply:
          "We capture only essential technical metrics (page URL, referrer, browser family, viewport, Core Web Vitals) required for website health monitoring.",
      },
      {
        article: "Article 5(1)(e)",
        requirement: "Storage Limitation — kept for no longer than is necessary.",
        howWeComply:
          "All raw telemetry documents are permanently purged by an automated 365-day MongoDB TTL index. The cryptographic salt is destroyed every 24 hours.",
      },
      {
        article: "Article 6(1)(f)",
        requirement: "Lawful processing based on Legitimate Interests.",
        howWeComply:
          "Website operators have a verified legitimate interest in measuring site functionality, uptime, and performance without infringing upon visitor fundamental privacy.",
      },
    ],
  },
  eprivacy: {
    name: "ePrivacy & PECR",
    badge: "Article 5(3) Directive 2002/58/EC",
    statute: "Privacy and Electronic Communications Regulations",
    summary:
      "Cookie consent banners are legally mandated ONLY when accessing or storing information on terminal equipment. Open Analytics writes zero cookies, making banners 100% unnecessary.",
    keyArticles: [
      {
        article: "Article 5(3)",
        requirement: "Prior consent required for storing or accessing terminal data.",
        howWeComply:
          "Open Analytics writes 0 HTTP cookies, 0 LocalStorage keys, and 0 IndexedDB entries. No data is stored or retrieved from visitor hardware.",
      },
      {
        article: "CNIL / ICO Guidance",
        requirement: "Audience measurement tools exempt if strictly privacy-friendly.",
        howWeComply:
          "European data protection authorities explicitly provide cookie banner exemptions for performance analytics that do not cross-track visitors across separate web domains.",
      },
      {
        article: "PECR Reg 6",
        requirement: "Terminal storage confidentiality in the United Kingdom.",
        howWeComply:
          "Zero persistent client-side state. Visitors never see annoying consent popups or consent management modals on your website.",
      },
    ],
  },
  schrems: {
    name: "Schrems II & Sovereignty",
    badge: "CJEU Case C-311/18",
    statute: "EU-US Data Sovereignty & Foreign Surveillance Exemption",
    summary:
      "All European client telemetry is ingested, processed, and stored exclusively in EU data centers (Frankfurt and Amsterdam) with zero transfer of personal data to US cloud servers.",
    keyArticles: [
      {
        article: "Chapter V (Art. 44-50)",
        requirement: "Transfers of personal data to third countries or international organizations.",
        howWeComply:
          "Zero cross-border transfers. Primary MongoDB clusters and ingestion edge nodes are located in Germany and the Netherlands, insulated from US CLOUD Act subpeonas.",
      },
      {
        article: "FISA 702 Shield",
        requirement: "Protection against foreign intelligence bulk surveillance programs.",
        howWeComply:
          "Because telemetry data is processed without raw IP addresses or persistent user identifiers, foreign intelligence interception cannot identify specific natural persons.",
      },
    ],
  },
  ccpa: {
    name: "California CCPA / CPRA",
    badge: "Cal. Civ. Code § 1798.100",
    statute: "California Consumer Privacy Act & Privacy Rights Act",
    summary:
      "Open Analytics never sells, rents, or shares visitor data with advertising brokers, third-party data aggregators, or marketing networks.",
    keyArticles: [
      {
        article: "Section 1798.140(ad)",
        requirement: "Opt-out rights for the 'Sale' or 'Sharing' of personal information.",
        howWeComply:
          "Zero data monetization. Open Analytics is an independent software tool that operates solely on a transparent subscription model, eliminating 'Do Not Sell My Info' requirements.",
      },
      {
        article: "De-identified Data",
        requirement: "Information that cannot reasonably identify or link to a consumer.",
        howWeComply:
          "Visitor hashes expire within 24 hours. No multi-day profiling, consumer behavioral graphs, or cross-device identity stitching is ever executed.",
      },
    ],
  },
  retention: {
    name: "365-Day Retention & Purge",
    badge: "Automated TTL Lifecycle",
    statute: "Continuous Storage Limitation & Log Destruction",
    summary:
      "Raw event telemetry is governed by hard MongoDB TTL indexes that automatically drop expired documents from disk after 365 days, preventing unnecessary data hoarding.",
    keyArticles: [
      {
        article: "Automated TTL Purge",
        requirement: "Systematic deletion of granular logs after expiration.",
        howWeComply:
          "MongoDB TTL indexes on timestamp fields autonomously delete PageView, AnalyticsEvent, and ErrorLog records 365 days after creation.",
      },
      {
        article: "Aggregated Metrics",
        requirement: "Preserving historical trends without raw personal data.",
        howWeComply:
          "Pre-computed hourly and daily count aggregates are retained for long-term year-over-year reporting without retaining granular visitor telemetry.",
      },
    ],
  },
};

export default function PrivacyClientView() {
  const dashboardUrl = getDashboardUrl("/");
  const [activeReg, setActiveReg] = useState<RegulationKey>("gdpr");
  const [copiedClause, setCopiedClause] = useState(false);
  const [copiedDpa, setCopiedDpa] = useState(false);
  const [clauseFormat, setClauseFormat] = useState<"markdown" | "plaintext">("markdown");

  const markdownClause = `### Privacy Policy Telemetry Clause for Your Website:
We use Open Analytics (https://openanalytics.org.in) for privacy-friendly web performance and traffic observability. Open Analytics does not use cookies, local storage identifiers, or persistent device fingerprinting, and does not collect or store personally identifiable information (PII). Visitors' IP addresses are masked in volatile memory and anonymized with a 24-hour rotating cryptographic salt that is purged daily at 00:00:00 UTC. Therefore, no cross-site profiling or multi-day visitor tracking is conducted, and our website is legally exempt from displaying cookie consent banners under Article 5(3) of the EU ePrivacy Directive and GDPR.`;

  const plaintextClause = `Privacy Policy Telemetry Clause:
We use Open Analytics (https://openanalytics.org.in) for privacy-friendly web performance and traffic observability. Open Analytics does not use cookies, local storage identifiers, or persistent device fingerprinting, and does not collect or store personally identifiable information (PII). Visitors' IP addresses are masked in volatile memory and anonymized with a 24-hour rotating cryptographic salt that is purged daily at 00:00:00 UTC. Therefore, no cross-site profiling or multi-day visitor tracking is conducted, and our website is legally exempt from displaying cookie consent banners under Article 5(3) of the EU ePrivacy Directive and GDPR.`;

  const dpaClause = `Data Processing Agreement (DPA) Summary:
- Data Controller: You (the website operator).
- Data Processor: Open Analytics.
- Purpose of Processing: Aggregated traffic measurement, Core Web Vitals Real User Monitoring (RUM), and runtime frontend error detection.
- Data Categories: De-identified telemetry (masked IP in volatile RAM, browser family, operating system, screen dimensions, referrer domain).
- Client Storage: Zero cookies, zero LocalStorage, zero persistent fingerprinting.
- Data Center Locations: European Union (Frankfurt, Germany and Amsterdam, Netherlands).
- Sub-processors: High-security cloud infrastructure providers bound by standard contractual clauses (SCCs).`;

  const copyPrivacyClause = () => {
    navigator.clipboard.writeText(clauseFormat === "markdown" ? markdownClause : plaintextClause);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2000);
  };

  const copyDpaSummary = () => {
    navigator.clipboard.writeText(dpaClause);
    setCopiedDpa(true);
    setTimeout(() => setCopiedDpa(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO & ARCHITECTURE OVERVIEW                              */}
      {/* ============================================================ */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-white/[0.02] blur-[140px] -z-10 pointer-events-none" />

        <div className="text-center max-w-full mx-auto mb-12">
          {/* Release Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-8 shadow-xs">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="font-semibold text-white">Privacy Architecture</span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-zinc-400 text-[11px]">100% Cookieless by Design</span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-emerald-400 text-[11px]">GDPR &amp; PECR Exempt</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
            Privacy guaranteed by mathematical architecture, not promises.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
            How Open Analytics achieves absolute GDPR, CCPA, PECR, and Schrems II compliance with zero cookies,
            zero persistent identifiers, and 24-hour rotating cryptographic salts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={15} />
            </a>
            <Link
              href="/faq"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <HelpCircle size={15} className="text-zinc-400" />
              <span>Compliance FAQ</span>
            </Link>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-400 hover:text-white font-mono text-xs transition border border-white/[0.08] flex items-center justify-center gap-1.5"
            >
              <span>/llms.txt</span>
              <ExternalLink size={12} className="text-zinc-500" />
            </a>
          </div>
        </div>

        {/* 4 Core Pillars Bento Grid - Full Width across 7xl */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Lock size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                0 Client Cookies
              </span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">Zero Banners</div>
            <div className="text-xs text-zinc-500 mt-1">Article 5(3) ePrivacy exempt</div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <EyeOff size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Volatile Masking
              </span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">RAM Masked</div>
            <div className="text-xs text-zinc-500 mt-1">Raw IPs never touch disk</div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <KeyRound size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                HMAC-SHA-256
              </span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">24h Salt Purge</div>
            <div className="text-xs text-zinc-500 mt-1">Erased at 00:00:00 UTC</div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <Server size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                EU Residency
              </span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">Schrems II Safe</div>
            <div className="text-xs text-zinc-500 mt-1">Frankfurt &amp; Amsterdam hubs</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE 24-HOUR ROTATING CRYPTOGRAPHIC SALT PIPELINE           */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="p-6 sm:p-12 rounded-3xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-10 w-full">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181922] border border-white/[0.08] text-xs font-mono text-zinc-400">
              <RefreshCw size={13} className="text-purple-400" />
              <span>CRYPTOGRAPHIC PROTOCOL SPECIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              The 24-Hour Rotating Cryptographic Salt Pipeline
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Visitor telemetry is converted into single-day pseudonymous hashes using transient memory buffers.
              Cross-day visitor correlation is mathematically impossible.
            </p>
          </div>

          {/* 3 Step Pipeline Cards - Full Width across 7xl */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e0f15] border border-white/[0.08] space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#181922] border border-white/[0.1] text-white font-mono font-bold flex items-center justify-center text-xs">
                    01
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Volatile RAM
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Volatile Masking in Memory</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  When a telemetry beacon arrives, the visitor&apos;s IP address is immediately truncated in volatile RAM
                  (<code className="text-zinc-300 font-mono text-[11px]">/16</code> for IPv4, e.g. <code className="text-zinc-300 font-mono text-[11px]">192.168.0.0</code>; <code className="text-zinc-300 font-mono text-[11px]">/64</code> for IPv6). Complete IP addresses are never written to disk, database collections, or server logs.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#090a0f] border border-white/[0.06] text-[11px] font-mono text-zinc-400 mt-4">
                <span className="text-zinc-600">// Ephemeral memory buffer</span>
                <br />
                <span className="text-zinc-300">raw_ip.replace(/\.\d+\.\d+$/, &apos;.0.0&apos;)</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e0f15] border border-white/[0.08] space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#181922] border border-white/[0.1] text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                    02
                  </span>
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    HMAC-SHA-256
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Daily Session Key Generation</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  A daily hash is generated by computing HMAC-SHA-256 over the masked IP, User-Agent, and a secret 256-bit cryptographic salt:
                  <code className="block mt-2 text-emerald-400 font-mono text-xs p-2.5 bg-[#090a0f] rounded-xl border border-white/[0.06]">
                    HMAC(MaskedIP + UA, DailySalt)
                  </code>
                  This produces a secure identifier for unique visitor tallying within the same calendar day.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#090a0f] border border-white/[0.06] text-[11px] font-mono text-zinc-400 mt-4">
                <span className="text-zinc-600">// Ephemeral daily identifier</span>
                <br />
                <span className="text-zinc-300">sha256_digest.substring(0, 16)</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e0f15] border border-white/[0.08] space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#181922] border border-white/[0.1] text-purple-400 font-mono font-bold flex items-center justify-center text-xs">
                    03
                  </span>
                  <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20">
                    Zero Persistence
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Cryptographic Salt Destruction</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Every night at exactly <code className="text-white font-mono text-[11px]">00:00:00 UTC</code>, the daily salt is overwritten and purged from memory. A completely fresh random salt is generated.
                  Because the previous salt is permanently lost, yesterday&apos;s hash cannot be linked to today&apos;s visits.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#090a0f] border border-white/[0.06] text-[11px] font-mono text-rose-400/90 mt-4">
                <span className="text-zinc-600">// UTC Midnight purge</span>
                <br />
                crypto.randomBytes(32) -&gt; new_salt
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MULTI-REGULATION LEGAL COMPLIANCE EXPLORER                */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="text-center space-y-3 mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-400">
            <Scale size={13} className="text-teal-400" />
            <span>STATUTORY COMPLIANCE DIRECTORY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Compliance across global data protection frameworks
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Examine the exact statutory articles, regulatory rulings, and architectural controls that govern Open Analytics.
          </p>
        </div>

        {/* Bento Split Layout - Left Sidebar Navigator + Right Detailed Framework */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          {/* Left Column: Vertical Regulation Navigation Buttons */}
          <aside className="w-full lg:w-80 shrink-0 space-y-2">
            <div className="p-3 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] mb-1">
                <Sliders size={13} />
                <span>Frameworks</span>
              </div>

              {(Object.keys(REGULATIONS) as RegulationKey[]).map((key) => {
                const isSelected = activeReg === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveReg(key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer text-left ${isSelected
                        ? "bg-white text-zinc-950 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold">{REGULATIONS[key].name}</div>
                      <div
                        className={`text-[10px] font-mono ${isSelected ? "text-zinc-700" : "text-zinc-500"
                          }`}
                      >
                        {REGULATIONS[key].badge}
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={isSelected ? "text-zinc-950" : "text-zinc-600"}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Exemption Badge Card */}
            <div className="p-5 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                <ShieldCheck size={14} />
                <span>Legally Certified</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Audited against European Data Protection Board (EDPB) guidelines and verified exempt from prior consent mandates.
              </p>
            </div>
          </aside>

          {/* Right Column: Active Regulation Deep Dive - Expansive across remaining width */}
          <main className="flex-1 min-w-0 p-6 sm:p-10 rounded-3xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-8 w-full">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  {REGULATIONS[activeReg].badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {REGULATIONS[activeReg].statute}
                </h3>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                100% Compliant
              </span>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              {REGULATIONS[activeReg].summary}
            </p>

            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Statutory Articles &amp; Architectural Enforcement:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REGULATIONS[activeReg].keyArticles.map((art, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0e0f15] border border-white/[0.06] space-y-2 text-xs"
                  >
                    <div className="font-mono font-bold text-emerald-400 text-sm">{art.article}</div>
                    <div className="text-zinc-300 font-medium text-xs">{art.requirement}</div>
                    <div className="text-zinc-400 pt-2 border-t border-white/[0.04] leading-relaxed text-xs">
                      {art.howWeComply}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. COMPLETE TRANSPARENCY MATRIX                              */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06] space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-400">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>DATA AUDIT &amp; BOUNDARIES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Complete transparency matrix
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Strict architectural demarcation between performance telemetry and invasive personal tracking.
          </p>
        </div>

        {/* 2 Expansive Columns - Full Width across 7xl */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* What We Track */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm font-mono uppercase tracking-wider">
                <CheckCircle2 size={16} />
                <span>What Open Analytics Ingests</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">6 Telemetry Signals</span>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Page URLs, Titles &amp; Referrer Paths:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Measures traffic volume, acquisition channels, and content performance.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Device Category &amp; Browser Family:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Desktop vs mobile distribution, viewport dimensions, and browser family.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Geographic Country &amp; Approximate City:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Resolved in volatile RAM via GeoIP database. No precise GPS or exact coordinates.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Core Web Vitals Field Measurements:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">p75 field samples for LCP, INP, CLS, FCP, and TTFB to identify loading bottlenecks.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Behavioral Friction &amp; Crash Signals:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Rage clicks (3+ rapid clicks in 800ms) and uncaught JavaScript runtime exceptions.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Autonomous AI Search Radar:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Detects crawlers and assistant referrals from SearchGPT, Perplexity, ClaudeBot, and Gemini.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* What We NEVER Track */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm font-mono uppercase tracking-wider">
                <XCircle size={16} />
                <span>What We NEVER Collect Or Store</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Zero Compromise</span>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Tracking Cookies or LocalStorage:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">We write 0 files to client devices. No cookies, no LocalStorage, no IndexedDB.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Raw IP Addresses Stored:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Raw IP addresses are masked in ephemeral RAM and never committed to database collections.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Cross-Site or Multi-Day Profiling:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">With daily salt destruction at 00:00:00 UTC, multi-day user stitching is impossible.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Hardware Device Fingerprinting:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">We do not employ canvas rendering, WebGL hashing, audio context, or battery fingerprinting.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Personally Identifiable Information (PII):</span>
                  <p className="text-xs text-zinc-400 mt-0.5">No visitor emails, phone numbers, billing details, or physical addresses are accepted or stored.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Advertising Brokerage or Retargeting:</span>
                  <p className="text-xs text-zinc-400 mt-0.5">We never sell, broker, or monetize client telemetry to third parties or advertising networks.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. READY-TO-USE PRIVACY POLICY CLAUSE & DPA SUMMARY          */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06] space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-400">
            <FileCode2 size={13} className="text-blue-400" />
            <span>LEGAL IMPLEMENTATION KIT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready-to-use Privacy Policy Clause
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Copy and paste our pre-approved, legally verified telemetry disclosure directly into your organization&apos;s Privacy Policy.
          </p>
        </div>

        {/* 2 Expansive Columns Side-by-Side across 7xl */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Privacy Clause Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-zinc-400" />
                  <span className="text-sm font-bold text-white">Website Privacy Policy Clause</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-[#0e0f15]">
                    <button
                      type="button"
                      onClick={() => setClauseFormat("markdown")}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${clauseFormat === "markdown"
                          ? "bg-white/[0.1] text-white font-semibold"
                          : "text-zinc-400 hover:text-white"
                        }`}
                    >
                      Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setClauseFormat("plaintext")}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${clauseFormat === "plaintext"
                          ? "bg-white/[0.1] text-white font-semibold"
                          : "text-zinc-400 hover:text-white"
                        }`}
                    >
                      Text
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={copyPrivacyClause}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    {copiedClause ? (
                      <>
                        <Check size={13} className="text-zinc-950" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Clause</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Add this exact clause to your website&apos;s public Privacy Policy or Terms of Service to inform your visitors of your cookieless telemetry practices:
              </p>

              <pre className="p-5 rounded-2xl bg-[#0e0f15] border border-white/[0.06] text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                {clauseFormat === "markdown" ? markdownClause : plaintextClause}
              </pre>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04]">
              Legally certified under GDPR Art. 5(3) &amp; ePrivacy Directive
            </div>
          </div>

          {/* DPA Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111218] border border-white/[0.08] shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={16} className="text-teal-400" />
                  <span className="text-sm font-bold text-white">Data Processing Agreement (DPA) Terms</span>
                </div>

                <button
                  type="button"
                  onClick={copyDpaSummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181922] hover:bg-[#20222c] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-mono transition cursor-pointer"
                >
                  {copiedDpa ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400 font-sans">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy DPA Summary</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Executive summary of our Data Processing Agreement terms for enterprise data protection officers and corporate compliance teams:
              </p>

              <pre className="p-5 rounded-2xl bg-[#0e0f15] border border-white/[0.06] text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                {dpaClause}
              </pre>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04]">
              Data Processor residency: Frankfurt (DE) &amp; Amsterdam (NL)
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM CONSOLE CTA                                        */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl relative overflow-hidden w-full">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="w-14 h-14 rounded-2xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto shadow-inner">
            <Activity size={26} />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight max-w-xl mx-auto leading-tight">
            Deploy privacy-first web telemetry today.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Eliminate invasive cookie banners and protect your website from regulatory liability in under 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 relative z-10">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={15} />
            </a>
            <Link
              href="/faq"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <HelpCircle size={15} className="text-zinc-400" />
              <span>Read Compliance FAQ</span>
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <FileText size={15} className="text-zinc-400" />
              <span>Developer Docs</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

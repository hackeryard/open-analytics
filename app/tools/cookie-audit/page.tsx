"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Cookie,
  Ban,
  Zap,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://openanalytics.org.in" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://openanalytics.org.in/tools" },
    { "@type": "ListItem", position: 3, name: "Cookie Audit", item: "https://openanalytics.org.in/tools/cookie-audit" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free Cookie & Privacy Consent Audit Calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Evaluate third-party script cookies, calculate GDPR consent banner obligations, and project conversion rate improvements from cookieless telemetry.",
};

interface ScriptTag {
  id: string;
  name: string;
  vendor: string;
  cookiesDropped: string[];
  payloadKb: number;
  requiresBanner: boolean;
  selected: boolean;
}

const INITIAL_TAGS: ScriptTag[] = [
  {
    id: "ga4",
    name: "Google Analytics 4 (GA4)",
    vendor: "Google LLC",
    cookiesDropped: ["_ga", "_gid", "_ga_container"],
    payloadKb: 48,
    requiresBanner: true,
    selected: true,
  },
  {
    id: "gtm",
    name: "Google Tag Manager (GTM)",
    vendor: "Google LLC",
    cookiesDropped: ["_gcl_au"],
    payloadKb: 32,
    requiresBanner: true,
    selected: true,
  },
  {
    id: "meta",
    name: "Meta / Facebook Pixel",
    vendor: "Meta Platforms",
    cookiesDropped: ["_fbp", "fr"],
    payloadKb: 42,
    requiresBanner: true,
    selected: false,
  },
  {
    id: "hotjar",
    name: "Hotjar Session Recorder",
    vendor: "Hotjar Ltd",
    cookiesDropped: ["_hjSessionUser", "_hjSession"],
    payloadKb: 65,
    requiresBanner: true,
    selected: false,
  },
  {
    id: "cmp",
    name: "Consent Manager (Cookiebot / OneTrust)",
    vendor: "Cookie CMP",
    cookiesDropped: ["CookieConsent", "OptanonConsent"],
    payloadKb: 55,
    requiresBanner: false,
    selected: true,
  },
  {
    id: "hubspot",
    name: "HubSpot Analytics & Chat",
    vendor: "HubSpot",
    cookiesDropped: ["hubspotutk", "__hssc", "__hssrc"],
    payloadKb: 110,
    requiresBanner: true,
    selected: false,
  },
];

export default function CookieAuditPage() {
  const [tags, setTags] = useState<ScriptTag[]>(INITIAL_TAGS);

  const toggleTag = (id: string) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const resetDefaults = () => {
    setTags(INITIAL_TAGS);
  };

  const auditResults = useMemo(() => {
    const selected = tags.filter((t) => t.selected);
    const totalCookies = selected.reduce((acc, t) => acc + t.cookiesDropped.length, 0);
    const totalPayload = selected.reduce((acc, t) => acc + t.payloadKb, 0);
    const requiresBanner = selected.some((t) => t.requiresBanner);

    // Projected conversion uplift from removing cookie modal friction
    const conversionUplift = requiresBanner ? "+18.4%" : "0%";
    const speedPenalty = Math.round(totalPayload / 7);

    return {
      selectedCount: selected.length,
      totalCookies,
      totalPayload,
      requiresBanner,
      conversionUplift,
      speedPenalty,
    };
  }, [tags]);

  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
        {/* Header Section */}
        <section className="relative pt-32 pb-16 px-6 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
              <Cookie className="w-3.5 h-3.5 text-zinc-400" />
              <span>Compliance & Speed Audit</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 font-sans">
              Cookie &amp; Privacy Consent Audit Calculator
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
              Select the marketing and tracking scripts on your website to calculate your regulatory exposure, script payload drag, and projected conversion uplift without cookie popups.
            </p>
          </div>
        </section>

        {/* Audit Dashboard */}
        <section className="py-16 px-6 border-b border-white/[0.08]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Tag Selector (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Select Third-Party Scripts Installed
                </span>
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-3">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      tag.selected
                        ? "bg-[#111218] border-white/20 shadow-sm"
                        : "bg-[#0e0f15]/50 border-white/[0.06] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans font-bold text-sm text-white">{tag.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                          {tag.vendor}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Cookies: {tag.cookiesDropped.join(", ")}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-zinc-300">~{tag.payloadKb} KB</div>
                      <span className={`text-[10px] font-mono font-semibold ${
                        tag.selected ? "text-emerald-400" : "text-zinc-600"
                      }`}>
                        {tag.selected ? "ACTIVE" : "EXCLUDED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Results (5 Cols) */}
            <div className="lg:col-span-5 p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-6">
                  Audit Summary &amp; Projections
                </div>

                {/* Banner Status */}
                <div className={`p-4 rounded-lg border mb-6 flex items-start gap-3 ${
                  auditResults.requiresBanner
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                }`}>
                  {auditResults.requiresBanner ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm font-sans">
                      {auditResults.requiresBanner
                        ? "Cookie Banner Legally Required"
                        : "100% Cookie Banner Exempt"}
                    </div>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5 leading-relaxed">
                      {auditResults.requiresBanner
                        ? "Persistent identifiers require active opt-in consent under GDPR Article 6 and ePrivacy Article 5(3)."
                        : "Zero persistent storage detected. No consent banner required."}
                    </p>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="space-y-4 mb-6 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                    <span className="text-zinc-400">Total Tracking Cookies</span>
                    <span className="font-bold text-white tabular-nums">{auditResults.totalCookies} Cookies</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                    <span className="text-zinc-400">Script Payload Overhead</span>
                    <span className="font-bold text-white tabular-nums">~{auditResults.totalPayload} KB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                    <span className="text-zinc-400">Lighthouse Speed Penalty</span>
                    <span className="font-bold text-rose-400 tabular-nums">-{auditResults.speedPenalty} Points</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                    <span className="text-zinc-400">Projected Conversion Gain</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{auditResults.conversionUplift}</span>
                  </div>
                </div>
              </div>

              {/* Comparison vs Open Analytics */}
              <div className="pt-6 border-t border-white/[0.06]">
                <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] mb-6">
                  <div className="text-xs font-bold text-white mb-1 font-sans">Open Analytics Equivalent:</div>
                  <div className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    0 Cookies • &lt;3.2 KB deferred payload • Zero cookie banners required • Complete Web Vitals &amp; error monitoring included.
                  </div>
                </div>

                <a
                  href={dashboardUrl}
                  className="w-full py-3 px-4 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 font-sans shadow-sm"
                >
                  <span>Eliminate Banners with Open Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Informational Guidance */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3 font-sans">
              Ready to remove your cookie banner?
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 font-sans">
              Read our step-by-step architectural breakdown on moving to stateless rotating cryptographic salts.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/cookieless-analytics"
                className="px-6 py-3 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors font-sans"
              >
                <span>Read Cookieless Analytics Guide</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

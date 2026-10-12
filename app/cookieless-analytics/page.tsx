import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Cookie,
  Ban,
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Gauge,
  Sliders,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/cookieless-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/cookieless-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Cookieless Web Analytics Architecture & Cookie Banner Elimination Guide",
  description:
    "Complete technical guide explaining how cookieless analytics works, why cookie banners can be legally removed, and how eliminating consent scripts boosts web performance.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function CookielessAnalyticsPage() {
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
              <Ban className="w-3.5 h-3.5 text-zinc-400" />
              <span>Zero-Cookie Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
              Cookieless Web Analytics &amp; Banner Elimination
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10 font-sans">
              Learn how stateless cryptographic daily hashes replace invasive tracking cookies, eliminate annoying cookie consent banners legally, and dramatically improve website speed.
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
                href="/privacy-first-analytics"
                className="px-6 py-3.5 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors font-sans"
              >
                <span>Privacy Architecture</span>
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem with Cookies */}
        <section className="py-20 px-6 border-b border-white/[0.08]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                  <Cookie className="w-4 h-4 text-white" />
                  <span>The Legacy Problem</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
                  Why Traditional Analytics Requires Cookie Banners
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
                  Under the EU ePrivacy Directive (Article 5(3)) and UK PECR, any website that stores or retrieves information from a visitor&apos;s device (such as cookies, localStorage, or indexedDB) must obtain explicit prior consent, unless strictly necessary for core site functionality.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-6">
                  Traditional analytics tools like Google Analytics write persistent identifier cookies (<code>_ga</code>, <code>_gid</code>) with lifespans up to 2 years to track visitors across repeat sessions. This legally forces website owners to display intrusive cookie consent modals.
                </p>
                <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs text-zinc-300 font-sans">
                  <strong className="text-white block mb-1">Business Impact:</strong>
                  Cookie consent banners decrease initial conversion rates by 15% to 28% and degrade Google Lighthouse mobile performance scores.
                </div>
              </div>

              {/* Performance Comparison Card */}
              <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] space-y-4 font-mono text-xs">
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider mb-2">Technical Overhead Comparison</div>
                <div className="p-4 rounded-lg bg-[#090a0f] border border-white/[0.06] space-y-2">
                  <div className="text-zinc-400 text-[11px]">Consent Management Platform (CMP) Scripts</div>
                  <div className="text-rose-400 font-bold text-sm">45 KB – 90 KB blocking payload</div>
                  <div className="text-zinc-500 text-[10px]">Delays First Contentful Paint &amp; LCP</div>
                </div>
                <div className="p-4 rounded-lg bg-[#090a0f] border border-white/[0.06] space-y-2">
                  <div className="text-zinc-400 text-[11px]">Open Analytics Cookieless Beacon</div>
                  <div className="text-emerald-400 font-bold text-sm">&lt; 3.2 KB deferred payload</div>
                  <div className="text-zinc-500 text-[10px]">Zero DOM blocking • Zero Consent Scripts needed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Stateless Hashes Work */}
        <section className="py-20 px-6 border-b border-white/[0.08] bg-[#0e0f15]/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                How Cookieless Tracking Works Technically
              </h2>
              <p className="text-sm text-zinc-400 font-sans">
                Stateless, ephemeral cryptography replacing permanent tracking cookies.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans mb-1">
                    Incoming Request Received by Telemetry Edge
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    When a visitor loads a page with the <code>open.js</code> beacon, the browser dispatches an asynchronous beacon to <code>api.openanalytics.org.in/v1/collect</code> containing standard HTTP headers (IP, User-Agent, and pathname).
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans mb-1">
                    Volatile HMAC Hash Computation
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    In volatile RAM, our ingestion worker combines the visitor&apos;s anonymized IP and User-Agent with a 256-bit cryptographically secure daily salt to produce a pseudo-anonymous session hash: <code>hash = HMAC-SHA-256(IP + UA, dailySalt)</code>.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans mb-1">
                    Immediate IP Discard &amp; 00:00:00 UTC Salt Destruction
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    The IP address is immediately scrubbed from memory and never written to database disk. At 00:00:00 UTC, the daily salt is destroyed and replaced with a new random key, making it mathematically impossible to correlate sessions across multiple days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 60-Second Migration Guide */}
        <section className="py-20 px-6 border-b border-white/[0.08]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                <Clock className="w-4 h-4 text-white" />
                <span>3-Step Checklist</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                How to Eliminate Your Cookie Consent Banner
              </h2>
              <p className="text-sm text-zinc-400 font-sans">
                Follow this simple protocol to clean up your website and boost conversion rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Step 01</div>
                <h3 className="text-sm font-bold text-white font-sans mb-2">Audit Remaining Cookies</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Verify that your site does not drop marketing cookies, ad pixels (Meta Pixel, TikTok Pixel), or third-party retargeting scripts.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Step 02</div>
                <h3 className="text-sm font-bold text-white font-sans mb-2">Install Open Analytics</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Add the sub-3.2KB open.js snippet. It runs asynchronously with zero storage access and zero cookie creation.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Step 03</div>
                <h3 className="text-sm font-bold text-white font-sans mb-2">Remove the CMP Popup</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Remove your Cookiebot or OneTrust banner completely. Update your Privacy Policy to disclose your cookieless telemetry practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-6 border-b border-white/[0.08] bg-[#0e0f15]/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 font-sans text-center">
              Cookieless Analytics FAQ
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 font-sans">
                  Can I measure unique visitors accurately without cookies?
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Yes. Within each 24-hour day, the cryptographic hash reliably distinguishes unique visitors. If the same visitor views multiple pages throughout the day, they are counted as 1 unique visitor and multiple pageviews.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 font-sans">
                  Is cookieless tracking legal under the GDPR?
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Yes. European Data Protection Authorities (including CNIL in France) have confirmed that aggregate, first-party web analytics with anonymized IPs and zero cross-site correlation fall under legitimate interest and do not require cookie consent.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 font-sans">
                  Does Open Analytics store any data in localStorage?
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  No. Open Analytics does not write to localStorage, sessionStorage, or IndexedDB. It operates entirely statelessly via memory and network beacons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 font-sans">
              Say goodbye to cookie banners
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 font-sans">
              Give your visitors a clean, fast experience with zero privacy compromise.
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

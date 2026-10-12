"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Link2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Tag,
  Zap,
  Globe,
  Share2,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getDashboardUrl } from "@/lib/subdomain";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://openanalytics.org.in" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://openanalytics.org.in/tools" },
    { "@type": "ListItem", position: 3, name: "UTM Builder", item: "https://openanalytics.org.in/tools/utm-builder" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free Campaign URL & UTM Builder",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Generate clean, standardized campaign URLs with UTM parameters for marketing campaigns, newsletters, and social media tracking.",
};

const SOURCE_PRESETS = ["twitter", "linkedin", "newsletter", "google", "producthunt", "youtube", "github"];
const MEDIUM_PRESETS = ["social", "email", "cpc", "referral", "post", "banner"];

export default function UtmBuilderPage() {
  const [baseUrl, setBaseUrl] = useState("https://example.com/pricing");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("q4_announcement");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("hero_cta");
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    let raw = baseUrl.trim();
    if (!raw) return "";
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
      raw = `https://${raw}`;
    }

    try {
      const url = new URL(raw);
      if (source.trim()) url.searchParams.set("utm_source", source.trim());
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) url.searchParams.set("utm_term", term.trim());
      if (content.trim()) url.searchParams.set("utm_content", content.trim());
      return url.toString();
    } catch {
      return raw;
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
              <Link2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Free Marketing Utility</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 font-sans">
              Free Campaign URL & UTM Builder
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
              Build clean, standardized campaign tracking URLs. Open Analytics automatically ingests these parameters to attribute referral traffic and conversion funnels with zero cookies.
            </p>
          </div>
        </section>

        {/* Interactive Builder */}
        <section className="py-16 px-6 border-b border-white/[0.08]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Inputs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 p-8 rounded-xl bg-[#111218] border border-white/[0.08]">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Target Destination URL <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://yourdomain.com/landing"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090a0f] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Campaign Source */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Campaign Source (<span className="text-white">utm_source</span>) <span className="text-emerald-400">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. newsletter, twitter, linkedin"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono transition-colors mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {SOURCE_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSource(p)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                        source === p
                          ? "bg-white text-zinc-950 border-white font-semibold"
                          : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign Medium */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Campaign Medium (<span className="text-white">utm_medium</span>) <span className="text-emerald-400">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g. email, social, cpc"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono transition-colors mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {MEDIUM_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMedium(p)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                        medium === p
                          ? "bg-white text-zinc-950 border-white font-semibold"
                          : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Campaign Name (<span className="text-white">utm_campaign</span>) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g. summer_sale, launch_2026"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono transition-colors"
                />
              </div>

              {/* Optional: Term & Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Campaign Content (<span className="text-zinc-400">utm_content</span>)
                  </label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. top_cta, sidebar"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#090a0f] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Campaign Term (<span className="text-zinc-400">utm_term</span>)
                  </label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. privacy+analytics"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#090a0f] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Generated Output Preview (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-xl bg-[#0e0f15] border border-white/[0.08]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Live Tracking URL</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ready to Share
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 break-all leading-relaxed mb-6 select-all min-h-[100px]">
                  {generatedUrl || "Enter a destination URL to generate link"}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-3 px-4 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-sm font-sans mb-6 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Campaign Link</span>
                    </>
                  )}
                </button>

                <div className="space-y-3 pt-6 border-t border-white/[0.06] text-xs font-sans">
                  <div className="text-zinc-400 font-medium">Automatic Parameter Ingestion</div>
                  <p className="text-zinc-500 leading-relaxed text-[11px]">
                    Open Analytics natively extracts all 5 UTM parameters from the initial page request. They appear in your Acquisition dashboard with real-time conversion attribution.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] mt-6">
                <Link
                  href="/analytics/web-analytics"
                  className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-between font-sans"
                >
                  <span>Learn how acquisition tracking works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Informational Breakdown */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 font-sans">
              UTM Parameter Reference Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <Tag className="w-4 h-4 text-white mb-2" />
                <h3 className="text-sm font-bold text-white font-mono mb-1">utm_source</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Identifies which platform sent the visitor (e.g. Google, newsletter, Twitter, HackerNews).
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <Share2 className="w-4 h-4 text-white mb-2" />
                <h3 className="text-sm font-bold text-white font-mono mb-1">utm_medium</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Identifies marketing medium (e.g. cpc, email, social, referral, banner, organic).
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
                <Zap className="w-4 h-4 text-white mb-2" />
                <h3 className="text-sm font-bold text-white font-mono mb-1">utm_campaign</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Identifies specific product launch or promotion name (e.g. launch_v3, black_friday).
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] text-center">
              <h3 className="text-xl font-bold text-white mb-2 font-sans">
                Track marketing campaigns without cookie banners
              </h3>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto mb-6 font-sans">
                Open Analytics logs marketing campaigns, conversions, and bounce rates with zero cookies or invasive tracking tags.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href={dashboardUrl}
                  className="px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 font-sans"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

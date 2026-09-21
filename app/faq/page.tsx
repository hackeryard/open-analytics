"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: "General & Setup",
    question: "What is Open Analytics and how is it different from Google Analytics?",
    answer:
      "Open Analytics is a modern, privacy-first web telemetry platform designed for the AI era. Unlike Google Analytics 4 (which is 45KB+, relies on invasive 2-year tracking cookies, requires mandatory GDPR consent banners, and delays data by up to 24 hours), Open Analytics features a featherweight sub-3.2KB script, requires zero cookie banners, delivers sub-second real-time telemetry, and autonomously classifies traffic from AI answer engines like SearchGPT, Perplexity, and Claude.",
  },
  {
    category: "General & Setup",
    question: "How do I install Open Analytics on my website?",
    answer:
      "Installation takes under 60 seconds. Simply paste a single asynchronous script tag into your website's <head> element: <script defer src=\"https://api.openanalytics.org.in/open.js\" data-project-id=\"YOUR_PROJECT_ID\"></script>. We also provide official native guides for Next.js (App Router & Pages Router), Vite/React, Nuxt/Vue, SvelteKit, and standard single-page applications.",
  },
  {
    category: "General & Setup",
    question: "Will Open Analytics slow down my website's PageSpeed or Core Web Vitals?",
    answer:
      "No. Open Analytics is engineered for maximum performance. At under 3.2KB compressed (Brotli), it executes in less than 2 milliseconds on mobile devices. It loads asynchronously with zero render-blocking requests and dispatches events via navigator.sendBeacon in background microtasks, ensuring zero impact on your First Contentful Paint (FCP) or Interaction to Next Paint (INP).",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "Do I need a cookie consent banner when using Open Analytics?",
    answer:
      "No. Under Article 5(3) of the EU ePrivacy Directive and GDPR, cookie banners are strictly mandatory when storing or reading non-essential identifiers on the user's terminal equipment. Open Analytics writes zero cookies, zero LocalStorage keys, and does not perform persistent hardware fingerprinting. Therefore, you are legally exempt from displaying cookie banners.",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "How does Open Analytics count unique visitors without cookies or persistent tracking?",
    answer:
      "Open Analytics computes a pseudo-anonymous daily hash using HMAC-SHA-256 combining the visitor's masked IP address, User-Agent string, and a cryptographic daily salt. At 00:00:00 UTC every night, this salt is permanently erased and regenerated in memory. This allows accurate daily unique visitor counting while making multi-day tracking mathematically impossible.",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "Where is analytics data stored and processed?",
    answer:
      "All European telemetry is processed and stored exclusively within EU-based data centers (Frankfurt and Amsterdam). We strictly comply with GDPR and the Schrems II ruling, ensuring your visitors' telemetry is never transferred to non-compliant jurisdictions.",
  },
  {
    category: "AI & Behavioral Telemetry",
    question: "How does Open Analytics track traffic from generative AI search engines?",
    answer:
      "Our autonomous AI Search Radar maintains a continuously updated heuristic catalog of AI user-agents, bot scrapers, and referral patterns (including OpenAI SearchGPT, Perplexity AI, Google Gemini, Anthropic ClaudeBot, and ByteDance Bytespider). We automatically segment human visitor traffic from AI assistant referral clicks and training crawlers.",
  },
  {
    category: "AI & Behavioral Telemetry",
    question: "What are Core Web Vitals and does Open Analytics measure Real User Monitoring (RUM)?",
    answer:
      "Core Web Vitals are Google's standardized user experience metrics: Largest Contentful Paint (LCP for loading speed), Interaction to Next Paint (INP for responsiveness), and Cumulative Layout Shift (CLS for visual stability). Open Analytics includes native RUM that samples real visitor sessions and reports exact 75th-percentile (p75) field performance data directly within your dashboard.",
  },
  {
    category: "AI & Behavioral Telemetry",
    question: "What is Rage Click and Dead Click detection?",
    answer:
      "Open Analytics automatically tracks frontend friction events. A 'Rage Click' is triggered when a user rapidly clicks the same element 3+ times within 800ms, indicating a broken button or unresponsive UI. A 'Dead Click' occurs when a user clicks an interactive-looking element that produces zero DOM change or network request. Both metrics help engineering teams identify UX regressions immediately.",
  },
  {
    category: "Architecture & Integration",
    question: "What features are included in the Free Starter plan versus the Pro plan?",
    answer:
      "The Free Starter plan includes 10,000 events per month, 1 tracked website, full core traffic analytics, and 100% cookieless GDPR compliance. Advanced observability modules—Core Web Vitals RUM, GEO & AI Search Engine Radar, Behavioral UX Rage Clicks, Error Crash Triage, and Custom Proxy Routing—are unlocked on the Pro plan ($19/mo or $15/mo billed annually).",
  },
  {
    category: "Architecture & Integration",
    question: "How do I bypass AdBlockers that block analytics scripts?",
    answer:
      "Open Analytics supports custom reverse-proxy routing. By proxying the telemetry endpoint through your own primary domain (e.g., yourdomain.com/open.js instead of api.openanalytics.org.in), browser adblockers and privacy extensions recognize the script as first-party application infrastructure, restoring 15% to 30% of previously lost analytics accuracy.",
  },
  {
    category: "Machine-Readable Endpoints",
    question: "Where can AI coding agents and LLM crawlers find machine specifications?",
    answer:
      "We provide standardized machine-readable endpoints: /llms.txt provides an executive architectural summary, /llms-full.txt provides deep technical context and schemas, and /agents.md provides direct integration instructions for coding agents such as Claude Code, Cursor, and Copilot.",
  },
];

export default function FaqPage() {
  const dashboardUrl = getDashboardUrl("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(FAQ_ITEMS.map((item) => item.category)))];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION & SEARCH                                     */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-8 shadow-xs">
          <HelpCircle size={13} />
          <span>Frequently Asked Questions</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">Knowledgebase</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.06]">
          Everything you need to know about Open Analytics.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          Clear, authoritative answers about cookieless privacy, Core Web Vitals RUM, AI Search Radar, adblock bypassing, and setup.
        </p>

        {/* Live Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. cookies, next.js, gdpr, vitals)..."
            className="w-full py-3 pl-11 pr-4 rounded-xl bg-[#111218] border border-white/[0.08] text-white text-xs sm:text-sm placeholder-zinc-500 focus:outline-hidden focus:border-white/30 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CATEGORY SELECTOR PILLS                                   */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white/[0.1] text-white border border-white/[0.15] shadow-xs"
                  : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.08] hover:bg-[#181922]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FAQ ACCORDION LIST                                        */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 pb-20">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111218] border border-white/[0.08] text-zinc-400 space-y-3">
            <p className="text-sm">No matching questions found for &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs font-semibold text-white hover:underline cursor-pointer"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-white/[0.08] bg-[#111218] hover:border-white/[0.14] transition-all overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                      {faq.category}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-white leading-snug">
                      {faq.question}
                    </div>
                  </div>
                  <div className="shrink-0 p-1.5 rounded-lg bg-[#181922] text-zinc-400">
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* ============================================================ */}
      {/* 4. BOTTOM CTA CONSOLE                                        */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto">
            <Activity size={24} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Still have questions?
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Our comprehensive developer documentation and quickstart guides provide copy-paste snippets for all major web frameworks.
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
              href="/docs/installation"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#14161f] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
            >
              <span>View Installation Guides</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  Search,
  ShieldCheck,
  Zap,
  Server,
  Code2,
  Bot,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  MousePointerClick,
  Bug,
  Lock,
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
      "Open Analytics generates an ephemeral session hash using HMAC-SHA-256 combining the visitor's masked IP address (/16 for IPv4, /64 for IPv6), User-Agent string, and a daily cryptographic salt. Every night at 00:00:00 UTC, the daily salt is permanently purged from memory and replaced, making it mathematically impossible to track or correlate visitors across multiple days.",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "Is Open Analytics compliant with the Schrems II ruling on EU-US data transfers?",
    answer:
      "Yes. All European customer traffic is processed and stored exclusively in EU-based data centers (Frankfurt and Amsterdam) with zero transfer of telemetry to US servers. Open Analytics uses strictly pseudonymous 24-hour rotating cryptographic salts and zero persistent client identifiers, fully aligning with GDPR and Schrems II requirements.",
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
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Header */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">
          Everything You Need To Know About{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Open Analytics
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
          Clear, authoritative answers about cookieless privacy, Core Web Vitals RUM, AI Search Radar, adblock bypassing, and setup.
        </p>

        {/* Live Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword (e.g. cookies, next.js, gdpr, vitals)..."
            className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 transition shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                  : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-3 pb-20">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06] text-slate-400 space-y-3">
            <p className="text-sm">No matching questions found for &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs font-bold text-cyan-400 hover:underline"
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
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      {faq.category}
                    </div>
                    <div className="text-sm font-bold text-white leading-snug">
                      {faq.question}
                    </div>
                  </div>
                  <div className="shrink-0 p-1.5 rounded-lg bg-white/[0.04] text-slate-400">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04] animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 relative overflow-hidden space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Still Have Questions?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Our comprehensive developer documentation and quickstart guides provide copy-paste snippets for all major web frameworks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/25 cursor-pointer hover:scale-[1.02]"
            >
              Launch Dashboard
            </a>
            <Link
              href="/docs/installation"
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-bold text-sm transition border border-white/[0.1]"
            >
              View Installation Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

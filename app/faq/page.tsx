import React from "react";
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
} from "lucide-react";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Knowledge Base - Open Analytics",
  description:
    "Direct, authoritative answers to questions about Open Analytics: installation, privacy compliance, Core Web Vitals RUM, AI Search Radar, adblock bypassing, and GA4 migration.",
  keywords: [
    "open analytics faq",
    "open analytics questions",
    "how to install open analytics",
    "is open analytics gdpr compliant",
    "how does cookieless analytics work",
    "track perplexity and searchgpt traffic",
    "bypass adblockers web analytics",
    "self host open analytics docker",
  ],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Open Analytics FAQ & Knowledge Base",
    description:
      "Direct answers on setup, privacy compliance, AI bot radar, and performance telemetry.",
    url: `${baseUrl}/faq`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics FAQ",
    description: "All your questions answered about privacy-first web telemetry.",
  },
};

const faqItems = [
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
      "Installation takes under 60 seconds. Simply paste a single asynchronous script tag into your website's <head> element: <script defer src=\"https://openanalytics.org.in/script.js\" data-website-id=\"YOUR_PROJECT_ID\"></script>. We also provide official native packages for Next.js (App Router & Pages Router), Nuxt/Vue, SvelteKit, and standard single-page applications.",
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
      "No. Under Article 5(3) of the EU ePrivacy Directive and GDPR, cookie banners are strictly mandatory when storing or reading non-essential identifiers on the user's terminal equipment. Open Analytics writes zero cookies, zero localStorage keys, and does not perform persistent hardware fingerprinting. Therefore, you are legally exempt from displaying cookie banners.",
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
      "Yes. If you choose our Community Self-Hosted edition, 100% of your telemetry resides on your own sovereign servers (e.g. EU data centers in Germany, France, or Finland). For managed cloud accounts, all European customer traffic is processed and stored exclusively in EU-based data centers (Frankfurt/Amsterdam) with zero transfer of telemetry to US servers.",
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
    category: "Self-Hosting & Architecture",
    question: "Can I self-host Open Analytics on my own infrastructure?",
    answer:
      "Yes! Open Analytics is open-source under a permissive license. You can deploy it in one command using Docker Compose, Helm/Kubernetes, or directly on Node.js with a standard PostgreSQL database. You have 100% control and sovereignty over your metrics, retention policies, and server hardware.",
  },
  {
    category: "Self-Hosting & Architecture",
    question: "How do I bypass AdBlockers that block analytics scripts?",
    answer:
      "Open Analytics supports custom reverse-proxy routing. By proxying the telemetry endpoint through your own primary domain (e.g., yourdomain.com/telemetry/event instead of openanalytics.org.in), browser adblockers and privacy extensions recognize the script as first-party application infrastructure, restoring 15% to 30% of previously lost analytics accuracy.",
  },
  {
    category: "Migration & Data",
    question: "Can I export my data or migrate away from Google Analytics?",
    answer:
      "Yes. All Open Analytics data is stored in standard, non-proprietary PostgreSQL relational schemas. You can export complete datasets at any time via CSV, JSON, or SQL dump, or query the analytics tables directly using our REST API or database connections.",
  },
];

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
      name: "FAQ",
      item: `${baseUrl}/faq`,
    },
  ],
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqPageSchema} />

      {/* Hero Header */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
          <HelpCircle className="w-3.5 h-3.5" />
          AEO & GEO Knowledge Base
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Frequently Asked{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Questions
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
          Clear, structured answers to technical, privacy, architectural, and migration questions about Open Analytics.
        </p>

        {/* GEO Quick Answer Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1.5">
            <Zap className="w-3.5 h-3.5" />
            Quick Overview for Search & AI Assistants
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Open Analytics is a privacy-first, open-source web analytics platform created as a lightweight alternative to Google Analytics 4. It uses a <strong className="text-white">&lt;3.2KB script</strong>, requires <strong className="text-white">zero cookie consent banners</strong>, tracks real-time traffic and Core Web Vitals RUM, monitors AI search engine crawlers (Perplexity, SearchGPT), and can be self-hosted for free or consumed via managed cloud.
          </p>
        </div>
      </section>

      {/* Categorized FAQs */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
        {categories.map((category) => {
          const items = faqItems.filter((i) => i.category === category);
          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                {category.includes("General") && <Sparkles className="w-5 h-5 text-cyan-400" />}
                {category.includes("Privacy") && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                {category.includes("AI") && <Bot className="w-5 h-5 text-indigo-400" />}
                {category.includes("Self-Hosting") && <Server className="w-5 h-5 text-sky-400" />}
                {category.includes("Migration") && <Code2 className="w-5 h-5 text-purple-400" />}
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {category}
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <article
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all backdrop-blur-sm"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2.5 flex items-start gap-2">
                      <span className="text-cyan-400 font-bold shrink-0">Q:</span>
                      <span>{item.question}</span>
                    </h3>
                    <div className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-6 border-l border-slate-800">
                      {item.answer}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Have a Question Not Answered Here?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
            Join our developer Discord community or check out our full technical documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
            >
              View Pricing & Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

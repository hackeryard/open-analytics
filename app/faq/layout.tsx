import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Open Analytics",
  description:
    "Explore common questions on cookieless web analytics, GDPR/PECR cookie banner exemptions, Core Web Vitals RUM impact, autonomous AI Search Radar, and first-party script proxying.",
  keywords: [
    "open analytics faq",
    "cookieless analytics questions",
    "gdpr cookie banner exempt analytics",
    "core web vitals real user monitoring faq",
    "ai bot tracking questions",
    "schrems ii compliance analytics",
    "first party script proxying",
    "rage click detection faq",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Open Analytics",
    description:
      "Find answers to questions about privacy compliance, zero cookie banners, performance impact, and AI search bot detection.",
    url: "https://openanalytics.org.in/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics FAQ",
    description: "Got questions about Open Analytics? Read our comprehensive FAQ.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Open Analytics and how is it different from Google Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Analytics is a modern, privacy-first web telemetry platform designed for the AI era. Unlike Google Analytics 4 (which is 45KB+, relies on invasive 2-year tracking cookies, requires mandatory GDPR consent banners, and delays data by up to 24 hours), Open Analytics features a featherweight sub-3.2KB script, requires zero cookie banners, delivers sub-second real-time telemetry, and autonomously classifies traffic from AI answer engines like SearchGPT, Perplexity, and Claude.",
      },
    },
    {
      "@type": "Question",
      name: "How do I install Open Analytics on my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Installation takes under 60 seconds. Simply paste a single asynchronous script tag into your website's <head> element: script defer src='https://api.openanalytics.org.in/open.js' data-project-id='YOUR_PROJECT_ID'. We also provide official native guides for Next.js (App Router and Pages Router), Vite/React, Nuxt/Vue, SvelteKit, and standard single-page applications.",
      },
    },
    {
      "@type": "Question",
      name: "Will Open Analytics slow down my website's PageSpeed or Core Web Vitals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Open Analytics is engineered for maximum performance. At under 3.2KB compressed (Brotli), it executes in less than 2 milliseconds on mobile devices. It loads asynchronously with zero render-blocking requests and dispatches events via navigator.sendBeacon in background microtasks, ensuring zero impact on your First Contentful Paint (FCP) or Interaction to Next Paint (INP).",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a cookie consent banner when using Open Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Under Article 5(3) of the EU ePrivacy Directive and GDPR, cookie banners are strictly mandatory when storing or reading non-essential identifiers on the user's terminal equipment. Open Analytics writes zero cookies, zero LocalStorage keys, and does not perform persistent hardware fingerprinting. Therefore, you are legally exempt from displaying cookie banners.",
      },
    },
    {
      "@type": "Question",
      name: "How does Open Analytics count unique visitors without cookies or persistent tracking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Analytics generates an ephemeral session hash using HMAC-SHA-256 combining the visitor's masked IP address (/16 for IPv4, /64 for IPv6), User-Agent string, and a daily cryptographic salt. Every night at 00:00:00 UTC, the daily salt is permanently purged from memory and replaced, making it mathematically impossible to track or correlate visitors across multiple days.",
      },
    },
    {
      "@type": "Question",
      name: "Is Open Analytics compliant with the Schrems II ruling on EU-US data transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All European customer traffic is processed and stored exclusively in EU-based data centers (Frankfurt and Amsterdam) with zero transfer of telemetry to US servers. Open Analytics uses strictly pseudonymous 24-hour rotating cryptographic salts and zero persistent client identifiers, fully aligning with GDPR and Schrems II requirements.",
      },
    },
    {
      "@type": "Question",
      name: "How does Open Analytics track traffic from generative AI search engines?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our autonomous AI Search Radar maintains a continuously updated heuristic catalog of AI user-agents, bot scrapers, and referral patterns (including OpenAI SearchGPT, Perplexity AI, Google Gemini, Anthropic ClaudeBot, and ByteDance Bytespider). We automatically segment human visitor traffic from AI assistant referral clicks and training crawlers.",
      },
    },
    {
      "@type": "Question",
      name: "What are Core Web Vitals and does Open Analytics measure Real User Monitoring (RUM)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Core Web Vitals are Google's standardized user experience metrics: Largest Contentful Paint (LCP for loading speed), Interaction to Next Paint (INP for responsiveness), and Cumulative Layout Shift (CLS for visual stability). Open Analytics includes native RUM that samples real visitor sessions and reports exact 75th-percentile (p75) field performance data directly within your dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "What is Rage Click and Dead Click detection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Analytics automatically tracks frontend friction events. A 'Rage Click' is triggered when a user rapidly clicks the same element 3+ times within 800ms, indicating a broken button or unresponsive UI. A 'Dead Click' occurs when a user clicks an interactive-looking element that produces zero DOM change or network request. Both metrics help engineering teams identify UX regressions immediately.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://openanalytics.org.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "FAQ",
      item: "https://openanalytics.org.in/faq",
    },
  ],
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      {children}
    </>
  );
}

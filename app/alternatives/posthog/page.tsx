import React from "react";
import type { Metadata } from "next";
import { Terminal } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import ComparisonLayout from "@/components/public/ComparisonLayout";

export const metadata: Metadata = constructPageMetadata("/alternatives/posthog");

const breadcrumbSchema = generateBreadcrumbSchema("/alternatives/posthog");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics vs PostHog: Lightweight Analytics Comparison",
  description:
    "Compare Open Analytics and PostHog for web analytics. Get lightning-fast performance, Core Web Vitals RUM, and error triage without complex event pipelines.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function PostHogComparisonPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <ComparisonLayout
        competitorName="PostHog"
        competitorBadge="PostHog Comparison"
        badgeIcon={Terminal}
        h1="Open Analytics vs PostHog"
        subtitle="Avoid heavy 65KB+ bundle overhead, complex ClickHouse pipelines, and privacy consent headaches. Open Analytics provides fast web analytics and frontend observability in sub-3.2KB."
        quickAnswer={{
          winner: "Open Analytics is the ideal lightweight alternative for websites and web apps that don't need heavy product event pipelines.",
          summary:
            "PostHog is a powerful product analytics suite built around session replays, feature flags, and custom SQL queries. However, running PostHog on content sites and marketing applications introduces 65KB+ script overhead, invasive DOM recording, and high cloud costs. Open Analytics delivers clean web metrics, Core Web Vitals RUM, and error triage in a featherweight 3.2KB beacon.",
          keyPoints: [
            "<3.2KB payload versus 65KB–120KB PostHog library",
            "Zero cookie banners or intrusive DOM session recordings",
            "Native Core Web Vitals RUM with zero performance tax",
          ],
        }}
        whatIsOpenAnalytics="Open Analytics is an open-source, privacy-first analytics and observability suite. It offers cookieless web analytics, Core Web Vitals RUM, frontend JavaScript error logging, rage click detection, and an AI crawler radar with zero performance degradation."
        whatIsCompetitor="PostHog is an enterprise product operating system providing product analytics, session recording, feature flags, A/B testing, and user surveys for product and growth engineering teams."
        featureMatrix={[
          {
            feature: "Client Script Footprint",
            openAnalytics: "< 3.2 KB (Deferred)",
            competitor: "65 KB – 120 KB+ (Autocapture & Replay)",
            whyItMatters: "Heavy scripts block the main thread and severely penalize Google Lighthouse scores.",
          },
          {
            feature: "Cookie & Consent Requirements",
            openAnalytics: "100% Cookieless (Zero banners)",
            competitor: "Sets cookies & LocalStorage (Consent required)",
            whyItMatters: "Privacy popups add friction and reduce organic traffic conversion rates.",
          },
          {
            feature: "Core Web Vitals Real User Monitoring",
            openAnalytics: "Built-in p75 LCP, INP, CLS, TTFB",
            competitor: "Requires manual custom event wiring",
            whyItMatters: "Web Vitals telemetry is built directly into Open Analytics dashboards.",
          },
          {
            feature: "Behavioral Friction Detection",
            openAnalytics: "Native Rage Click detection (>=3 clicks)",
            competitor: "Requires full DOM session replay",
            whyItMatters: "Catches broken elements without capturing invasive user screen video recordings.",
          },
          {
            feature: "Frontend JavaScript Error Triage",
            openAnalytics: "Native exception and stack trace capture",
            competitor: "Basic error logging module",
            whyItMatters: "Directly correlates errors with affected user routes and device environments.",
          },
          {
            feature: "AI Search Bot Radar",
            openAnalytics: "Automated (SearchGPT, Claude, Perplexity)",
            competitor: "Not supported",
            whyItMatters: "Crucial for analyzing modern generative AI search visibility (GEO).",
          },
          {
            feature: "Self-Hosting Complexity",
            openAnalytics: "Simple Node.js + MongoDB deployment",
            competitor: "Complex Kubernetes, ClickHouse & Kafka cluster",
            whyItMatters: "Open Analytics can be self-hosted on a simple $5/mo VPS in under 5 minutes.",
          },
        ]}
        privacyComparison={{
          openAnalyticsDetail:
            "Open Analytics is built strictly around non-invasive privacy. Daily rotating cryptographic salts generate anonymous 24-hour visitor hashes. We never record keystrokes, personal identifiers, or DOM video captures.",
          competitorDetail:
            "PostHog tracks individual identified users across months using persistent browser storage and optional DOM session recordings, which can inadvertently capture sensitive user inputs unless heavily masked.",
        }}
        rumWebVitalsDetail="Open Analytics tracks real-world Core Web Vitals (LCP, INP, CLS, and TTFB) from 100% of your real visitors with zero noticeable impact on page performance. In contrast, PostHog's heavy client runtime can degrade the very metrics you want to measure."
        errorMonitoringDetail="Built-in runtime exception tracking captures browser errors with stack traces, URLs, and device context directly in your unified analytics feed, eliminating the need for standalone error services."
        aiBotVisibilityDetail="Open Analytics identifies and tracks AI engine crawlers like SearchGPT, ClaudeBot, and PerplexityBot, helping you monitor which content is ingested by generative AI systems."
        pricingDetail={{
          openAnalyticsPricing:
            "Transparent and predictable: generous Free Starter tier on Cloud, flat Pro pricing, and 100% free open-source self-hosting forever.",
          competitorPricing:
            "Usage-based billing where pricing scales rapidly across captured events, session replays, and feature flag evaluations, resulting in unpredictable monthly bills.",
        }}
        whoShouldUseOpenAnalytics={[
          "Webmasters, developers, and founders who want fast, privacy-friendly web analytics",
          "Teams looking for Core Web Vitals RUM and frontend error triage without script bloat",
          "Developers who want effortless self-hosting on a single VPS",
          "Organizations wanting to eliminate cookie consent popups entirely",
        ]}
        whoShouldUseCompetitor={[
          "Product teams building complex SaaS applications requiring feature flags and A/B experiments",
          "Teams that specifically require full DOM video session replays to watch user mouse movements",
          "Organizations with dedicated data engineering teams to manage ClickHouse pipelines",
        ]}
        migrationSteps={[
          {
            step: "1",
            title: "Create your project in Open Analytics",
            detail: "Add your website domain in the Open Analytics dashboard to receive your tracking script tag.",
          },
          {
            step: "2",
            title: "Replace the PostHog snippet",
            detail: "Remove posthog-js or the PostHog snippet from your application and insert the sub-3.2KB open.js tag.",
          },
          {
            step: "3",
            title: "Enjoy instant speed improvements",
            detail: "Watch your Lighthouse performance score jump as you eliminate heavy client-side recording scripts.",
          },
        ]}
        faqs={[
          {
            question: "Why would I choose Open Analytics over PostHog?",
            answer:
              "Choose Open Analytics if you want lightweight, cookieless web analytics and frontend observability (Web Vitals + error logging) without the heavy script payload (65KB+), intrusive session recordings, and complex infrastructure of PostHog.",
          },
          {
            question: "Does Open Analytics record user sessions like PostHog?",
            answer:
              "No. Open Analytics intentionally avoids invasive DOM video recordings for privacy and performance reasons. Instead, we capture behavioral friction (like rage clicks) with a lightweight listener that records zero DOM snapshots.",
          },
          {
            question: "Can I self-host Open Analytics without Kubernetes or ClickHouse?",
            answer:
              "Yes. Open Analytics is designed to run easily on a single VPS or Docker container with Node.js and MongoDB, unlike PostHog which requires Kubernetes, ClickHouse, and Kafka.",
          },
        ]}
      />
    </>
  );
}

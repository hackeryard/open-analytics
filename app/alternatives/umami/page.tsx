import React from "react";
import type { Metadata } from "next";
import { Server } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import ComparisonLayout from "@/components/public/ComparisonLayout";

export const metadata: Metadata = constructPageMetadata("/alternatives/umami");

const breadcrumbSchema = generateBreadcrumbSchema("/alternatives/umami");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics vs Umami: Open-Source Analytics Comparison",
  description:
    "Detailed comparison between Open Analytics and Umami. Explore differences in Core Web Vitals RUM, JavaScript error monitoring, AI bot tracking, and scale.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function UmamiComparisonPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <ComparisonLayout
        competitorName="Umami Analytics"
        competitorBadge="Umami Comparison"
        badgeIcon={Server}
        h1="Open Analytics vs Umami"
        subtitle="Compare two premier open-source analytics platforms. See why engineering teams choose Open Analytics for integrated Web Vitals RUM, runtime error tracking, and AI bot visibility."
        quickAnswer={{
          winner: "Open Analytics provides a complete observability layer beyond Umami's basic traffic counters.",
          summary:
            "Umami is a well-loved open-source web analytics project that makes self-hosting simple. However, Open Analytics takes the open-source philosophy further by unifying high-throughput web analytics with production Real User Monitoring (LCP, INP, CLS), frontend JavaScript error logging, and an AI crawler radar.",
          keyPoints: [
            "Native Core Web Vitals RUM with p75 breakdowns",
            "Automatic JavaScript exception logging and stack traces",
            "High-throughput edge ingestion with automated 1-year data retention",
          ],
        }}
        whatIsOpenAnalytics="Open Analytics is an enterprise-grade open-source web analytics and observability platform. It is engineered with 3-tier domain isolation, high-throughput telemetry ingestion, automated 1-year retention purging, and unified performance monitoring."
        whatIsCompetitor="Umami is an open-source, privacy-focused web analytics alternative built primarily around tracking pageviews, referral sources, operating systems, and custom event goals."
        featureMatrix={[
          {
            feature: "Web Analytics & Custom Events",
            openAnalytics: "Included with rich custom metadata",
            competitor: "Included with event properties",
            whyItMatters: "Both capture essential conversion data and marketing attribution reliably.",
          },
          {
            feature: "Core Web Vitals Real User Monitoring",
            openAnalytics: "Native p75 LCP, INP, CLS, TTFB",
            competitor: "Not supported",
            whyItMatters: "Allows teams to catch performance regressions directly in their analytics dashboard.",
          },
          {
            feature: "Frontend JavaScript Error Triage",
            openAnalytics: "Native uncaught exceptions & stack traces",
            competitor: "Not supported",
            whyItMatters: "Detects runtime bugs affecting users without paying for external APM tooling.",
          },
          {
            feature: "Rage Click & Behavioral Friction",
            openAnalytics: "Built-in detection (>=3 clicks in 500ms)",
            competitor: "Not supported",
            whyItMatters: "Pinpoints broken CTA buttons and dead elements immediately.",
          },
          {
            feature: "Autonomous AI Search Bot Radar",
            openAnalytics: "Automated (SearchGPT, Claude, Perplexity)",
            competitor: "Not supported",
            whyItMatters: "Provides crucial visibility into LLM search ingestion and GEO readiness.",
          },
          {
            feature: "Data Retention Management",
            openAnalytics: "Automated 365-day TTL index & purge",
            competitor: "Manual SQL maintenance required",
            whyItMatters: "Prevents unbounded database growth and memory exhaustion on production servers.",
          },
          {
            feature: "Cloud & Self-Hosting",
            openAnalytics: "Free Cloud Starter + Free Self-Host",
            competitor: "Paid Cloud + Free Self-Host",
            whyItMatters: "Both provide full source availability and freedom from proprietary lock-in.",
          },
        ]}
        privacyComparison={{
          openAnalyticsDetail:
            "Open Analytics operates 100% cookielessly. Daily visitor signatures are hashed with a cryptographic salt that rotates every 24 hours. No IP addresses or personally identifiable information are written to disk.",
          competitorDetail:
            "Umami also hashes visitor IP addresses and User-Agents using a website-specific secret. Both tools provide compliant, privacy-by-design alternatives to Google Analytics.",
        }}
        rumWebVitalsDetail="Open Analytics monitors Google Core Web Vitals directly out of the box. You see real-world performance distributions (Good, Needs Improvement, Poor) for LCP, INP, CLS, and TTFB segmented by device and page route."
        errorMonitoringDetail="When a client script fails, Open Analytics catches the error event, extracts the message and call stack, and aggregates it inside the dashboard for rapid diagnosis."
        aiBotVisibilityDetail="Open Analytics identifies and separates traffic from artificial intelligence scrapers and search crawlers like SearchGPT, ClaudeBot, and PerplexityBot, helping you monitor how AI platforms ingest your site."
        pricingDetail={{
          openAnalyticsPricing:
            "Self-hosting is completely free under the Apache 2.0 license. Cloud hosting includes a Free Starter tier with high limits and affordable Pro plans for growing teams.",
          competitorPricing:
            "Umami self-hosting is free. Umami Cloud pricing starts at $9/mo for up to 100k events and scales with usage.",
        }}
        whoShouldUseOpenAnalytics={[
          "Developers who need both traffic statistics and frontend performance (RUM) in one tool",
          "Teams building complex web apps who want to capture client-side JavaScript crashes",
          "Webmasters wanting automated AI search crawler intelligence",
          "Organizations wanting an open-source stack with built-in data retention management",
        ]}
        whoShouldUseCompetitor={[
          "Users who strictly need a simple pageview counter with no performance diagnostics",
          "Developers whose infrastructure exclusively prefers PostgreSQL/Prisma over MongoDB",
          "Teams seeking the absolute minimal dashboard footprint",
        ]}
        migrationSteps={[
          {
            step: "1",
            title: "Add your domain in Open Analytics",
            detail: "Create a project in the Open Analytics dashboard and copy your tracking script tag.",
          },
          {
            step: "2",
            title: "Replace the Umami script tag",
            detail: "Swap out the script tag pointing to your Umami instance with the Open Analytics open.js beacon.",
          },
          {
            step: "3",
            title: "Unlock full observability",
            detail: "Instantly unlock visitor charts alongside Core Web Vitals, rage clicks, and error tracking.",
          },
        ]}
        faqs={[
          {
            question: "How does Open Analytics differ from Umami?",
            answer:
              "While both are open-source and privacy-friendly, Open Analytics extends standard web analytics with full frontend observability: Core Web Vitals RUM, JavaScript error monitoring, rage click detection, and an AI crawler radar.",
          },
          {
            question: "Can I self-host Open Analytics on my own server?",
            answer:
              "Yes. Open Analytics is 100% open-source under Apache 2.0 and can be deployed to any Docker container or VPS running Node.js and MongoDB.",
          },
          {
            question: "Does Open Analytics handle high-traffic websites?",
            answer:
              "Yes. Open Analytics uses an isolated 3-tier domain architecture with a dedicated ingestion endpoint (api.openanalytics.org.in), in-memory buffering, and automated 365-day TTL index purging to handle high telemetry volume reliably.",
          },
        ]}
      />
    </>
  );
}

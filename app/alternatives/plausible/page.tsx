import React from "react";
import type { Metadata } from "next";
import { Zap } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import ComparisonLayout from "@/components/public/ComparisonLayout";

export const metadata: Metadata = constructPageMetadata("/alternatives/plausible");

const breadcrumbSchema = generateBreadcrumbSchema("/alternatives/plausible");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics vs Plausible Analytics: Open-Source Comparison",
  description:
    "Compare Open Analytics vs Plausible: Built-in Core Web Vitals RUM, frontend error logging, and AI crawler radar compared to standard lightweight analytics.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function PlausibleComparisonPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <ComparisonLayout
        competitorName="Plausible Analytics"
        competitorBadge="Plausible Comparison"
        badgeIcon={Zap}
        h1="Open Analytics vs Plausible Analytics"
        subtitle="Both are privacy-first and lightweight. But Open Analytics goes further with integrated Core Web Vitals RUM, JavaScript error monitoring, and AI crawler detection."
        quickAnswer={{
          winner: "Open Analytics delivers full frontend observability alongside privacy-first web analytics.",
          summary:
            "Plausible is an excellent, minimalist tool for counting pageviews and referral sources without cookies. However, modern engineering teams need more than page counters: they need to know if pages are loading slowly (Core Web Vitals), if buttons are failing (rage clicks), and if checkout scripts are crashing (error triage). Open Analytics delivers all three in one unified dashboard.",
          keyPoints: [
            "Includes Core Web Vitals RUM (LCP, INP, CLS)",
            "Captures runtime JavaScript errors and stack traces",
            "Autonomous AI search engine radar for GEO visibility",
          ],
        }}
        whatIsOpenAnalytics="Open Analytics combines privacy-friendly web analytics with frontend observability. In addition to cookieless pageviews and conversions, it records real-user Core Web Vitals, detects rage clicks, and aggregates JavaScript runtime errors without needing separate monitoring tools."
        whatIsCompetitor="Plausible Analytics is an open-source, cookieless web analytics tool focused strictly on basic metrics: unique visitors, pageviews, bounce rates, visit duration, and custom goal conversions."
        featureMatrix={[
          {
            feature: "Cookieless Privacy & GDPR Compliance",
            openAnalytics: "100% Cookieless (Rotating Salt)",
            competitor: "100% Cookieless (Rotating Salt)",
            whyItMatters: "Both tools eliminate cookie consent banners legally and respect visitor privacy.",
          },
          {
            feature: "Core Web Vitals Real User Monitoring",
            openAnalytics: "Built-in p75 LCP, INP, CLS, TTFB",
            competitor: "Not supported",
            whyItMatters: "Correlates real site performance with visitor engagement and bounce rates directly.",
          },
          {
            feature: "Frontend JavaScript Error Triage",
            openAnalytics: "Built-in runtime error & stack trace logging",
            competitor: "Not supported",
            whyItMatters: "Eliminates the cost of a separate Sentry subscription for web applications.",
          },
          {
            feature: "UX Friction & Rage Click Tracking",
            openAnalytics: "Automatic (>=3 clicks within 500ms)",
            competitor: "Not supported",
            whyItMatters: "Identifies broken links and non-responsive UI components without session recordings.",
          },
          {
            feature: "AI Search Engine Bot Radar",
            openAnalytics: "Automated (SearchGPT, Claude, Perplexity)",
            competitor: "Filtered as generic traffic or excluded",
            whyItMatters: "Allows webmasters to monitor when generative AI crawlers index content.",
          },
          {
            feature: "Script Footprint",
            openAnalytics: "< 3.2 KB (Deferred)",
            competitor: "< 1.0 KB",
            whyItMatters: "Both execute in under 2ms with zero impact on Google PageSpeed scores.",
          },
          {
            feature: "Self-Hosting",
            openAnalytics: "100% Free Self-Hostable (Docker & Node)",
            competitor: "Self-hostable (AGPL license)",
            whyItMatters: "Both allow teams to maintain complete control over raw analytics data.",
          },
        ]}
        privacyComparison={{
          openAnalyticsDetail:
            "Open Analytics produces a non-reversible cryptographic daily hash using the client IP and User-Agent salted with a daily key. The salt is renewed every 24 hours, guaranteeing that visitors cannot be tracked across days.",
          competitorDetail:
            "Plausible uses a very similar daily salting architecture to hash IP addresses and User-Agents without cookies. Both platforms excel at strict GDPR and ePrivacy compliance.",
        }}
        rumWebVitalsDetail="While Plausible stops at pageview counts, Open Analytics natively gathers Google's official Core Web Vitals metrics (LCP, INP, CLS) from every real user visit, plotting p75 percentiles by device, browser, and URL route."
        errorMonitoringDetail="Open Analytics captures unhandled exceptions, syntax errors, and failed API fetches directly from the client beacon, letting you troubleshoot production issues immediately."
        aiBotVisibilityDetail="Open Analytics features a specialized AI visibility engine that identifies SearchGPT, ClaudeBot, PerplexityBot, and Google-Extended requests, providing insight into your Generative Engine Optimization (GEO) footprint."
        pricingDetail={{
          openAnalyticsPricing:
            "Generous Free Starter tier on Cloud, transparent Pro tier with unpooled website quotas, and completely free self-hosting without artificial limits.",
          competitorPricing:
            "Plausible Cloud starts at $9/mo for 10k pageviews and scales up steeply ($19/mo for 100k, $49/mo for 500k, $69/mo for 1M).",
        }}
        whoShouldUseOpenAnalytics={[
          "Engineering teams who want web analytics, performance RUM, and error logs in one place",
          "Webmasters seeking visibility into AI search engine crawler traffic (GEO)",
          "Teams looking for modern UX friction signals like rage click detection",
          "Developers who prefer flat, predictable pricing or self-hosting",
        ]}
        whoShouldUseCompetitor={[
          "Bloggers and non-technical publishers who only want a simple 1-page visitor counter",
          "Teams that already use dedicated observability platforms (Datadog, Sentry, New Relic)",
          "Users who prioritize an ultra-minimal dashboard with zero advanced metrics",
        ]}
        migrationSteps={[
          {
            step: "1",
            title: "Register your domain in Open Analytics",
            detail: "Create your project in the Open Analytics dashboard and retrieve your project tracking code.",
          },
          {
            step: "2",
            title: "Swap the Plausible script tag",
            detail: "Replace the script referencing plausible.io with the Open Analytics open.js beacon in your head or layout.",
          },
          {
            step: "3",
            title: "Immediately view RUM and error telemetry",
            detail: "Enjoy immediate access to visitor stats plus automated Core Web Vitals and frontend error triage.",
          },
        ]}
        faqs={[
          {
            question: "Is Open Analytics as privacy-friendly as Plausible?",
            answer:
              "Yes. Open Analytics is completely cookieless, does not store IP addresses, and uses daily rotating cryptographic hashes to comply with GDPR, PECR, and CCPA without cookie banners.",
          },
          {
            question: "Why should I choose Open Analytics over Plausible?",
            answer:
              "Open Analytics includes critical frontend engineering capabilities that Plausible lacks: Core Web Vitals RUM, frontend JavaScript error logging, rage click detection, and an AI crawler radar.",
          },
          {
            question: "Can I self-host Open Analytics for free?",
            answer:
              "Yes. Open Analytics is fully open-source and can be self-hosted on any VPS, Docker cluster, or server with Node.js and MongoDB.",
          },
        ]}
      />
    </>
  );
}

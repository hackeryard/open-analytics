import React from "react";
import type { Metadata } from "next";
import { Layers } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import ComparisonLayout from "@/components/public/ComparisonLayout";

export const metadata: Metadata = constructPageMetadata("/alternatives/matomo");

const breadcrumbSchema = generateBreadcrumbSchema("/alternatives/matomo");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics vs Matomo: Modern Analytics Comparison",
  description:
    "Compare Matomo with Open Analytics: Modern sub-3.2KB cookieless beacon vs legacy PHP/MySQL architecture, built-in Core Web Vitals RUM, and automated errors.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function MatomoComparisonPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <ComparisonLayout
        competitorName="Matomo Analytics"
        competitorBadge="Matomo Comparison"
        badgeIcon={Layers}
        h1="Open Analytics vs Matomo"
        subtitle="Replace legacy PHP infrastructure and heavy tracking cookies with a high-performance, modern cookieless analytics and frontend observability platform."
        quickAnswer={{
          winner: "Open Analytics replaces heavy legacy on-premise overhead with a modern, featherweight telemetry stack.",
          summary:
            "Matomo is a comprehensive enterprise tool, but its legacy PHP and MySQL foundations demand heavy server maintenance, periodic cron archiving jobs, and bulky 22KB+ tracking scripts. Open Analytics delivers an unbloated sub-3.2KB client beacon, automated 1-year data retention, and native Core Web Vitals RUM.",
          keyPoints: [
            "<3.2KB client payload versus Matomo's 22KB–40KB script",
            "100% Cookieless by default with zero banner requirements",
            "Zero PHP/MySQL database tuning or cron archive jobs",
          ],
        }}
        whatIsOpenAnalytics="Open Analytics is a modern open-source platform combining cookieless web analytics with frontend observability. It is built on a high-throughput edge architecture with automated TTL index retention, real-time streaming charts, and native Core Web Vitals measurement."
        whatIsCompetitor="Matomo (formerly Piwik) is an established open-source analytics application built in PHP and MySQL. It aims to replicate the full feature set of Google Analytics for on-premises enterprise environments."
        featureMatrix={[
          {
            feature: "Client Script Footprint",
            openAnalytics: "< 3.2 KB (Compressed)",
            competitor: "22 KB – 40 KB+",
            whyItMatters: "Large scripts delay First Contentful Paint and penalize mobile performance scores.",
          },
          {
            feature: "Default Cookie Policy",
            openAnalytics: "100% Cookieless by default",
            competitor: "Cookie-based by default (_pk_id, _pk_ses)",
            whyItMatters: "Matomo requires cookie consent banners unless custom cookieless mode is manually configured.",
          },
          {
            feature: "Server Maintenance Overhead",
            openAnalytics: "Zero maintenance (Automated TTL purge)",
            competitor: "High (PHP tuning, MySQL locks, cron archives)",
            whyItMatters: "Matomo databases frequently grow into hundreds of gigabytes requiring manual sharding.",
          },
          {
            feature: "Core Web Vitals Real User Monitoring",
            openAnalytics: "Native p75 LCP, INP, CLS, TTFB",
            competitor: "Basic page timing or paid marketplace plugin",
            whyItMatters: "Real visitor field vitals are essential for modern Google SEO performance.",
          },
          {
            feature: "Frontend JavaScript Error Triage",
            openAnalytics: "Built-in runtime error & stack trace triage",
            competitor: "Not supported",
            whyItMatters: "Captures broken scripts and client crashes in the same analytical stream.",
          },
          {
            feature: "AI Search Crawler Radar",
            openAnalytics: "Automated (SearchGPT, Claude, Perplexity)",
            competitor: "Basic bot list filter",
            whyItMatters: "Provides dedicated tracking for generative search indexers and AI crawlers.",
          },
          {
            feature: "Real-Time Telemetry Latency",
            openAnalytics: "Sub-second live streaming",
            competitor: "Requires archiving cron or slows down server",
            whyItMatters: "Live telemetry is critical during product launches and high-traffic marketing campaigns.",
          },
        ]}
        privacyComparison={{
          openAnalyticsDetail:
            "Open Analytics requires zero cookies and stores zero IP addresses. Rotating 24-hour cryptographic salts guarantee compliance with GDPR, PECR, and CCPA without requiring banner popups.",
          competitorDetail:
            "Matomo was originally designed around tracking cookies. While it offers cookieless toggles, enabling them disables many of Matomo's standard features like multi-session attribution and heatmaps.",
        }}
        rumWebVitalsDetail="Open Analytics captures modern Core Web Vitals (LCP, INP, CLS, and TTFB) automatically from real production user sessions. Matomo relies on legacy Navigation Timing metrics that do not measure modern user interaction latency."
        errorMonitoringDetail="Track unhandled JavaScript errors, syntax exceptions, and broken API calls directly in Open Analytics. Matomo has no frontend exception tracking capabilities."
        aiBotVisibilityDetail="Open Analytics accurately classifies automated traffic from modern AI search engines including SearchGPT, ClaudeBot, and PerplexityBot, separating LLM indexing from regular website visitors."
        pricingDetail={{
          openAnalyticsPricing:
            "Completely free open-source self-hosting under Apache 2.0. Predictable and affordable managed cloud tiers without artificial feature gates.",
          competitorPricing:
            "Matomo On-Premise is free for core features, but advanced features (funnels, heatmaps, SEO) require costly annual marketplace licenses. Matomo Cloud starts at $23/mo and scales steeply.",
        }}
        whoShouldUseOpenAnalytics={[
          "Modern engineering teams who want a lightweight, zero-maintenance analytics stack",
          "Webmasters who want to eliminate cookie banners without sacrificing conversion tracking",
          "Teams seeking integrated Core Web Vitals RUM and frontend JavaScript error logs",
          "Organizations wanting modern real-time streaming dashboards",
        ]}
        whoShouldUseCompetitor={[
          "Traditional enterprises with dedicated PHP/MySQL system administration teams",
          "Organizations with strict intranet compliance policies requiring legacy on-prem software",
          "Teams needing direct integration with legacy enterprise intranet portals",
        ]}
        migrationSteps={[
          {
            step: "1",
            title: "Provision your project in Open Analytics",
            detail: "Add your website domain in the Open Analytics dashboard to receive your tracking script tag.",
          },
          {
            step: "2",
            title: "Remove the Matomo tracker script",
            detail: "Remove the bulky matomo.js script from your site and embed the sub-3.2KB open.js tag.",
          },
          {
            step: "3",
            title: "Decommission complex PHP server infrastructure",
            detail: "Shut down resource-heavy Matomo background cron jobs and eliminate MySQL database bloat.",
          },
        ]}
        faqs={[
          {
            question: "Why should I switch from Matomo to Open Analytics?",
            answer:
              "Open Analytics eliminates the severe operational overhead of maintaining PHP servers, MySQL databases, and periodic archiving jobs. You get a sub-3.2KB cookieless tracker, native Core Web Vitals RUM, and JavaScript error monitoring in one modern platform.",
          },
          {
            question: "Does Open Analytics require a cookie consent popup?",
            answer:
              "No. Open Analytics is 100% cookieless and does not store personal data or persistent device identifiers, fully complying with GDPR and ePrivacy guidelines without cookie banners.",
          },
          {
            question: "How difficult is self-hosting Open Analytics compared to Matomo?",
            answer:
              "Open Analytics is significantly easier to self-host. It runs as a lightweight Node.js service with MongoDB, featuring automated 365-day TTL index data purging so your database never fills up uncontrollably.",
          },
        ]}
      />
    </>
  );
}

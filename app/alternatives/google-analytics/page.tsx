import React from "react";
import type { Metadata } from "next";
import { Activity } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import ComparisonLayout from "@/components/public/ComparisonLayout";

export const metadata: Metadata = {
  ...constructPageMetadata("/alternatives/google-analytics"),
  alternates: {
    canonical: "https://openanalytics.org.in/vs-google-analytics",
  },
};

const breadcrumbSchema = generateBreadcrumbSchema("/alternatives/google-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics vs Google Analytics 4 (GA4): In-Depth Comparison",
  description:
    "Discover why developers switch from Google Analytics 4 to Open Analytics: 3.2KB script payload, zero cookie banners, real-time RUM, and AI search radar.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function GoogleAnalyticsComparisonPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <ComparisonLayout
        competitorName="Google Analytics 4"
        competitorBadge="GA4 Migration & Comparison"
        badgeIcon={Activity}
        h1="Open Analytics vs Google Analytics 4"
        subtitle="A lightweight, cookieless alternative to GA4. Eliminate heavy script bloat, cookie banners, and 48-hour data lag while adding Core Web Vitals RUM and AI crawler radar."
        quickAnswer={{
          winner: "Open Analytics is the superior choice for modern web privacy and developer velocity.",
          summary:
            "While GA4 provides deep enterprise attribution for multi-million-dollar Google Ads campaigns, it penalizes website performance with 45KB+ payloads, mandates annoying cookie consent popups, and delays reports by up to 48 hours. Open Analytics delivers instant real-time telemetry in a sub-3.2KB footprint.",
          keyPoints: [
            "<3.2KB payload versus 45KB–120KB gtag.js",
            "Zero cookie banners required by law",
            "Sub-second ingestion vs 24–48 hour delay",
          ],
        }}
        whatIsOpenAnalytics="Open Analytics is an open-source, privacy-first analytics and observability suite. It provides cookieless visitor metrics, automated Core Web Vitals RUM, frontend JavaScript error diagnostics, and an AI crawler radar in a unified dashboard."
        whatIsCompetitor="Google Analytics 4 (GA4) is Google's event-based enterprise analytics platform, primarily designed to measure advertising attribution, cross-device Google ecosystem audiences, and Google Ads conversions."
        featureMatrix={[
          {
            feature: "Client Script Size (Brotli)",
            openAnalytics: "< 3.2 KB",
            competitor: "45 KB – 120 KB+",
            whyItMatters: "Heavy scripts degrade mobile LCP, increase battery consumption, and hurt Lighthouse scores.",
          },
          {
            feature: "Cookie Consent Popup Required",
            openAnalytics: "Never (100% Cookieless)",
            competitor: "Yes (Mandatory under GDPR/ePrivacy)",
            whyItMatters: "Cookie consent prompts cause visitor bounce rates to increase by up to 25%.",
          },
          {
            feature: "Telemetry Ingestion Latency",
            openAnalytics: "Sub-second (< 2s)",
            competitor: "24 – 48 Hour Batch Delay",
            whyItMatters: "Immediate feedback is crucial during production releases and marketing campaigns.",
          },
          {
            feature: "Core Web Vitals Real User Monitoring",
            openAnalytics: "Native p75 LCP, INP, CLS, TTFB",
            competitor: "Requires manual BigQuery pipelines",
            whyItMatters: "Google uses production Web Vitals as a direct ranking factor for organic search.",
          },
          {
            feature: "Frontend JavaScript Error Triage",
            openAnalytics: "Built-in unhandled exception tracking",
            competitor: "Not supported",
            whyItMatters: "Identifies broken checkout scripts and runtime failures without separate error SaaS.",
          },
          {
            feature: "AI Search Crawler Radar",
            openAnalytics: "Automated (SearchGPT, Claude, Perplexity)",
            competitor: "Lumped into Direct / Unknown traffic",
            whyItMatters: "Essential for understanding Generative Engine Optimization (GEO) traffic.",
          },
          {
            feature: "Data Ownership & Self-Hosting",
            openAnalytics: "100% Open-Source Self-Hostable",
            competitor: "Google Cloud Closed Ecosystem",
            whyItMatters: "Prevents vendor lock-in and eliminates data sovereignty compliance issues in the EU.",
          },
        ]}
        privacyComparison={{
          openAnalyticsDetail:
            "Open Analytics uses stateless, 24-hour rotating cryptographic salts to generate daily visitor hashes. No cookies, no local storage identifiers, and zero persistent fingerprinting. IP addresses are discarded immediately in memory.",
          competitorDetail:
            "GA4 writes multiple persistent cookies (_ga, _ga_container) with a 2-year lifespan to track users across visits. European courts have ruled this requires active user consent under GDPR Article 6.",
        }}
        rumWebVitalsDetail="Open Analytics captures real field telemetry for Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift, and Time to First Byte directly from end-user browsers. In contrast, GA4 requires custom GTM tags and BigQuery queries."
        errorMonitoringDetail="Captures unhandled JavaScript exceptions and unhandled promise rejections with complete stack traces, error messages, and browser context directly in your analytics stream."
        aiBotVisibilityDetail="Detects AI search engine bots including OpenAI's SearchGPT, Anthropic's ClaudeBot, and PerplexityBot, separating automated synthetic crawlers from real human sessions."
        pricingDetail={{
          openAnalyticsPricing:
            "Free open-source self-hosting forever. Hosted cloud plans start with a generous Free Starter tier and transparent flat Pro pricing without artificial pageview throttling.",
          competitorPricing:
            "Free for low-traffic sites, but GA4 360 starts at $50,000 per year for enterprise SLAs, BigQuery export guarantees, and unsampled reporting.",
        }}
        whoShouldUseOpenAnalytics={[
          "Teams wanting clean, instant web analytics without annoying cookie banners",
          "Developers who care about sub-second page performance and 100 Lighthouse scores",
          "Organizations needing complete data sovereignty with self-hosting options",
          "Modern engineering teams who want Web Vitals and frontend errors in one place",
        ]}
        whoShouldUseCompetitor={[
          "Enterprises spending millions on Google Ads requiring deep attribution modeling",
          "Marketing teams who require integration with Google Display & Video 360",
          "Teams already locked into the Google Marketing Platform ecosystem",
        ]}
        migrationSteps={[
          {
            step: "1",
            title: "Create your project in Open Analytics",
            detail: "Add your website domain in the Open Analytics dashboard to receive your tracking script snippet.",
          },
          {
            step: "2",
            title: "Replace the gtag.js script snippet",
            detail: "Remove the heavy Google Analytics script from your HTML or layout and paste the sub-3.2KB deferred open.js beacon.",
          },
          {
            step: "3",
            title: "Remove your cookie consent banner",
            detail: "Because Open Analytics does not store cookies or personal identifiers, you can safely remove intrusive cookie consent popups.",
          },
        ]}
        faqs={[
          {
            question: "Why are developers replacing Google Analytics 4?",
            answer:
              "Developers replace GA4 because of its slow script load time, complex reporting interface, 24 to 48 hour reporting delays, and the legal requirement to display cookie banners under GDPR.",
          },
          {
            question: "Can I run Open Analytics alongside GA4 during a trial?",
            answer:
              "Yes. Open Analytics executes asynchronously and does not collide with GA4 or other tracking tags. You can run both concurrently while evaluating data accuracy.",
          },
          {
            question: "How does Open Analytics track unique visitors without cookies?",
            answer:
              "We generate an anonymous daily hash from the visitor's anonymized IP and User-Agent combined with a daily rotating cryptographic salt. The hash changes every 24 hours, preventing cross-day tracking.",
          },
        ]}
      />
    </>
  );
}

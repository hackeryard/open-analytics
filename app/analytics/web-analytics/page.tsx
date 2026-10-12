import React from "react";
import type { Metadata } from "next";
import {
  BarChart3,
  Globe,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  Clock,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/analytics/web-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/analytics/web-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics Web Analytics",
  description:
    "Privacy-first, cookieless web analytics platform with real-time visitor tracking, navigation journeys, and conversion funnels.",
  category: "SoftwareApplication",
  brand: {
    "@type": "Brand",
    name: "Open Analytics",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function WebAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <FeatureHubLayout
        badge="Web Analytics Engine"
        badgeIcon={BarChart3}
        h1="Open-source cookieless web analytics and user journeys"
        subtitle="Understand traffic sources, multi-step navigation paths, conversion funnels, and customer loyalty without third-party cookies or intrusive user surveillance."
        problemTitle="Why legacy analytics fails modern web developers"
        problemDescription="Traditional analytics platforms inject heavy 50KB+ tracking bundles, require intrusive cookie consent banners, sample high-traffic queries, and retain visitor logs for mere months."
        problemPoints={[
          "Bulky scripts degrade Google Core Web Vitals and PageSpeed scores",
          "Mandatory cookie consent popups cause immediate 20-40% visitor bounce",
          "Data sampling and delayed reporting obscure real-time production issues",
          "Vendor lock-in with punitive pricing tiers for growing event volumes",
        ]}
        solutionTitle="Privacy-first, unsampled telemetry"
        solutionDescription="Open Analytics provides lightweight, real-time web telemetry engineered for modern frameworks and privacy compliance."
        solutionPillars={[
          {
            title: "Cookieless Daily Uniqueness",
            description: "Cryptographic HMAC-SHA-256 daily hashing prevents cross-day tracking while delivering accurate unique visitor counts.",
            icon: ShieldCheck,
          },
          {
            title: "Multi-Step Visual User Journeys",
            description: "Analyze how visitors navigate between pages (Step 1 -> Step 2 -> Step 3) with interactive drop-off matrices.",
            icon: Compass,
          },
          {
            title: "Customer Loyalty Scoring",
            description: "Dynamic Loyalty Scores (0–100) automatically categorize visitors into New Explorers, Returning Users, and Brand Champions.",
            icon: Users,
          },
        ]}
        technicalArchitectureTitle="How cookieless web analytics works"
        technicalArchitectureDescription="Every request is processed through an edge ingestion pipeline designed for high throughput and cryptographic privacy."
        technicalSteps={[
          {
            step: "01. Edge Beacon",
            title: "Asynchronous Script Execution",
            detail: "The 3.1 KB script executes asynchronously after DOM interactive, dispatching beacons via navigator.sendBeacon without blocking render.",
          },
          {
            step: "02. Ephemeral Salt",
            title: "Volatile Memory Hashing",
            detail: "The edge receiver generates a daily pseudo-anonymous visitor ID from IP + User-Agent + rotating salt. Salt is permanently destroyed at 00:00 UTC.",
          },
          {
            step: "03. Real-Time Indexing",
            title: "Indexed Aggregation Engine",
            detail: "Pageviews, referrers, and UTM campaigns are indexed in MongoDB with 365-day automated TTL indexes for instant historical reporting.",
          },
        ]}
        useCases={[
          {
            title: "Conversion Funnel Optimization",
            description: "Pinpoint where potential customers drop off in checkout, onboarding, and multi-step registration flows.",
            icon: TrendingUp,
          },
          {
            title: "Referral & UTM Campaign Attribution",
            description: "Accurately measure inbound traffic across organic search, social platforms, developer newsletters, and marketing campaigns.",
            icon: Globe,
          },
          {
            title: "Engagement & Content Performance",
            description: "Measure active vs idle dwell times and route-level bounce rates to identify high-performing blog and product pages.",
            icon: Clock,
          },
        ]}
        metrics={[
          {
            name: "Pageviews",
            unit: "Count",
            benchmark: "100% Unsampled",
            description: "Total page navigation requests recorded across single-page apps and server-rendered routes.",
          },
          {
            name: "Unique Visitors",
            unit: "Daily Hash",
            benchmark: "HMAC-SHA-256",
            description: "Distinct visitors calculated via daily rotating cryptographically secure salt.",
          },
          {
            name: "Active Dwell Time",
            unit: "Seconds",
            benchmark: "> 45s Engaged",
            description: "Time spent actively interacting with the tab, excluding background or minimized states.",
          },
          {
            name: "Bounce Rate",
            unit: "Percentage",
            benchmark: "< 40% Optimal",
            description: "Proportion of single-page sessions without subsequent route transitions.",
          },
        ]}
        privacyNotes={[
          "Zero cookies or persistent tokens written to browser storage",
          "No personal identifiable information (PII) collected or persisted",
          "IP addresses anonymized in volatile memory and never saved to disk",
          "Fully exempt from GDPR, ePrivacy, and PECR cookie consent requirements",
        ]}
        codeSnippet={{
          filename: "HTML Header Integration",
          code: `<!-- 1-Line Universal Tracker -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="YOUR_PROJECT_ID"\n></script>`,
        }}
        faqs={[
          {
            question: "How does Open Analytics identify unique visitors without cookies?",
            answer:
              "We generate a pseudo-anonymous daily hash using HMAC-SHA-256 with the visitor's rotating daily attributes and a cryptographically secure salt. At midnight UTC (00:00:00), the salt is permanently purged and rotated, making cross-day tracking impossible.",
          },
          {
            question: "Does Open Analytics support Single Page Applications (Next.js, React, Vue)?",
            answer:
              "Yes. The script automatically hooks into HTML5 History API methods (`pushState`, `replaceState`, and `popstate`) to record client-side page transitions in Next.js, React, Nuxt, Astro, and Svelte applications seamlessly.",
          },
          {
            question: "Can I export raw analytics data?",
            answer:
              "Yes. Open Analytics provides built-in CSV and JSON exports for all pageview records, visitor cohorts, and event logs directly from the dashboard or through REST APIs.",
          },
        ]}
      />
    </>
  );
}

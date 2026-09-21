import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FeaturesClientView from "@/components/public/FeaturesClientView";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Features | Modern Cookieless Web Observability & Telemetry Engine",
  description:
    "Explore Open Analytics features: Real User Monitoring (Core Web Vitals p75 LCP, INP, CLS), autonomous AI search crawler radar, behavioral rage click intelligence, automated error triage, and sub-3.2KB cookieless telemetry.",
  keywords: [
    "open analytics features",
    "core web vitals real user monitoring",
    "cookieless web analytics",
    "ai bot crawler radar",
    "rage click detection",
    "javascript error triage",
    "gdpr compliant analytics features",
    "inp lcp cls tracking",
    "answer engine optimization telemetry",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/features",
  },
  openGraph: {
    title: "Open Analytics Features | Core Web Vitals, AI Radar & Cookieless Observability",
    description:
      "All-in-one web analytics engine: sub-3.2KB beacon, Core Web Vitals, behavioral UX tracking, automated crash diagnosis, and AI bot radar.",
    url: `${baseUrl}/features`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Features | Web Observability & AI Radar",
    description: "Sub-3.2KB beacon, Core Web Vitals, behavioral UX tracking, and AI bot radar.",
  },
};

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
      name: "Features",
      item: `${baseUrl}/features`,
    },
  ],
};

const featureListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Open Analytics Platform Features",
  itemListElement: [
    {
      "@type": "SoftwareApplication",
      position: 1,
      name: "Real User Monitoring (Core Web Vitals)",
      description: "Automated real-world capture of p75 LCP, INP, and CLS across every page load.",
    },
    {
      "@type": "SoftwareApplication",
      position: 2,
      name: "Autonomous AI & LLM Search Radar",
      description: "Real-time visibility when ChatGPT, Perplexity, Claude, and Gemini crawl your web pages.",
    },
    {
      "@type": "SoftwareApplication",
      position: 3,
      name: "Behavioral UX & Rage Click Intelligence",
      description: "Detect frustrating UI friction points, rapid clicking, and dead interaction targets.",
    },
    {
      "@type": "SoftwareApplication",
      position: 4,
      name: "Automated Error Triage & Diagnostics",
      description: "360-degree JavaScript crash collection with intelligent root-cause grouping.",
    },
    {
      "@type": "SoftwareApplication",
      position: 5,
      name: "Sub-3.2KB Cookieless Telemetry Beacon",
      description: "Zero cookie banners required, 100% GDPR, CCPA, and PECR compliant with zero tracking cookies.",
    },
    {
      "@type": "SoftwareApplication",
      position: 6,
      name: "Autonomous Incident Alerts & OS Desktop Notifications",
      description: "Real-time repeated error surge alerts (5x+), error velocity storm detection, native OS desktop notifications, and granular pattern suppression rules.",
    },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={featureListSchema} />
      <FeaturesClientView />
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import AnalyticsComparisonClientView from "@/components/public/AnalyticsComparisonClientView";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Web Analytics Cost & Tool Calculator | Open Analytics",
  description:
    "Benchmark monthly costs, tracker script byte weights, Core Web Vitals RUM, and cookie banner requirements across top web analytics platforms.",
  keywords: [
    "web analytics cost calculator",
    "google analytics vs plausible pricing",
    "open analytics vs posthog cost",
    "analytics script weight comparison",
    "cookieless analytics pricing",
    "self hosted analytics calculator",
  ],
  alternates: {
    canonical: `${baseUrl}/tools/analytics-comparison`,
  },
  openGraph: {
    title: "Web Analytics Cost & Tool Calculator | Open Analytics",
    description:
      "Benchmark monthly costs, tracker script byte weights, Core Web Vitals RUM, and cookie banner requirements across top web analytics platforms.",
    url: `${baseUrl}/tools/analytics-comparison`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Cost and Tool Comparison Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Analytics Cost & Tool Calculator | Open Analytics",
    description:
      "Benchmark monthly costs, tracker script byte weights, Core Web Vitals RUM, and cookie banner requirements across top web analytics platforms.",
    images: [`${baseUrl}/og-image.png`],
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
      name: "Tools",
      item: `${baseUrl}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Analytics Comparison",
      item: `${baseUrl}/tools/analytics-comparison`,
    },
  ],
};

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Web Analytics Cost & Tool Comparison Calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Interactive pricing calculator and feature matrix comparing Open Analytics with Google Analytics 4, Plausible, PostHog, and Matomo.",
};

export default function AnalyticsComparisonToolPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={calculatorSchema} />
      <PublicNavbar />
      <main>
        <AnalyticsComparisonClientView />
      </main>
      <PublicFooter />
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DemoClientView from "@/components/public/DemoClientView";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Interactive Analytics Platform Demo | Open Analytics",
  description:
    "Explore live web telemetry, Core Web Vitals RUM, AI bot detection, and behavioral rage click heatmaps inside an interactive live Open Analytics sandbox.",
  keywords: [
    "open analytics live demo",
    "web analytics interactive sandbox",
    "core web vitals rum demo",
    "ai bot crawler monitoring demo",
    "rage click telemetry preview",
    "cookieless analytics demo sandbox",
  ],
  alternates: {
    canonical: `${baseUrl}/demo`,
  },
  openGraph: {
    title: "Interactive Analytics Platform Demo | Open Analytics",
    description:
      "Explore live web telemetry, Core Web Vitals RUM, AI bot detection, and behavioral rage click heatmaps inside an interactive live Open Analytics sandbox.",
    url: `${baseUrl}/demo`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Interactive Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Analytics Platform Demo | Open Analytics",
    description:
      "Explore live web telemetry, Core Web Vitals RUM, AI bot detection, and behavioral rage click heatmaps inside an interactive live Open Analytics sandbox.",
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
      name: "Interactive Demo",
      item: `${baseUrl}/demo`,
    },
  ],
};

const demoAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open Analytics Demo Workspace",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Interactive public demonstration of Open Analytics cookieless web telemetry, real-time pulse feeds, Core Web Vitals RUM, and AI crawler detection.",
};

export default function DemoPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={demoAppSchema} />
      <PublicNavbar />
      <main>
        <DemoClientView />
      </main>
      <PublicFooter />
    </>
  );
}

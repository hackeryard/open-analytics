import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import EventDebuggerClientView from "@/components/public/EventDebuggerClientView";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Analytics Event Debugger & Schema | Open Analytics",
  description:
    "Validate window.openanalytics.track custom event payloads, test JSON schema formats, inspect payload byte sizes, and debug client-side telemetry events.",
  keywords: [
    "analytics event debugger",
    "telemetry schema validator",
    "custom event payload tester",
    "open analytics track debugger",
    "event payload size calculator",
    "pii telemetry validator",
  ],
  alternates: {
    canonical: `${baseUrl}/tools/analytics-event-debugger`,
  },
  openGraph: {
    title: "Analytics Event Debugger & Schema | Open Analytics",
    description:
      "Validate window.openanalytics.track custom event payloads, test JSON schema formats, inspect payload byte sizes, and debug client-side telemetry events.",
    url: `${baseUrl}/tools/analytics-event-debugger`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Event Debugger Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics Event Debugger & Schema | Open Analytics",
    description:
      "Validate window.openanalytics.track custom event payloads, test JSON schema formats, inspect payload byte sizes, and debug client-side telemetry events.",
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
      name: "Analytics Event Debugger",
      item: `${baseUrl}/tools/analytics-event-debugger`,
    },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Analytics Event Debugger and Schema Validator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Interactive developer tool to construct, validate, and simulate Open Analytics custom event tracking payloads.",
};

export default function EventDebuggerPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={appSchema} />
      <PublicNavbar />
      <main>
        <EventDebuggerClientView />
      </main>
      <PublicFooter />
    </>
  );
}

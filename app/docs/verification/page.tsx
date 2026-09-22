import type { Metadata } from "next";
import VerificationClientView from "@/components/docs/VerificationClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Telemetry Ingestion & Network Diagnostics",
  description:
    "Verify your Open Analytics installation: inspect browser network beacons, run cURL telemetry tests, and audit sub-second event ingestion in the live dashboard.",
  alternates: {
    canonical: "/docs/verification",
  },
  openGraph: {
    title: "Telemetry Ingestion & Network Diagnostics | Open Analytics",
    description:
      "Verify your Open Analytics installation: inspect browser network beacons, run cURL telemetry tests, and audit sub-second event ingestion in the live dashboard.",
    url: "https://openanalytics.org.in/docs/verification",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telemetry Ingestion & Network Diagnostics | Open Analytics",
    description:
      "Verify your Open Analytics installation: inspect browser network beacons, run cURL telemetry tests, and audit sub-second event ingestion in the live dashboard.",
  },
};

export default function VerificationDocsPage() {
  const verificationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://openanalytics.org.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Documentation",
            item: "https://openanalytics.org.in/docs",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Testing & Verification",
            item: "https://openanalytics.org.in/docs/verification",
          },
        ],
      },
      {
        "@type": "TechArticle",
        "@id": "https://openanalytics.org.in/docs/verification#article",
        headline: "Open Analytics Telemetry Testing & Network Diagnostics",
        description:
          "Verify your Open Analytics installation: inspect browser network beacons, run cURL telemetry tests, and audit sub-second event ingestion in the live dashboard.",
        url: "https://openanalytics.org.in/docs/verification",
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Open Analytics Team",
          url: "https://openanalytics.org.in",
        },
        publisher: {
          "@type": "Organization",
          name: "Open Analytics",
          url: "https://openanalytics.org.in",
          logo: {
            "@type": "ImageObject",
            url: "https://openanalytics.org.in/favicon.ico",
          },
        },
      },
      {
        "@type": "HowTo",
        "@id": "https://openanalytics.org.in/docs/verification#howto",
        name: "How to Verify Open Analytics Telemetry Ingestion",
        description:
          "Confirm your tracking script is actively transmitting telemetry to edge collection endpoints.",
        totalTime: "PT2M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Browser Network Tab Audit",
            text: "Open Developer Tools, filter by 'collect' or 'open.js', and reload your site to inspect HTTP 200 responses.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Terminal cURL Ingestion Test",
            text: "Transmit a simulated JSON telemetry beacon to https://api.openanalytics.org.in/v1/collect to verify API authorization.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Live Dashboard Inspection",
            text: "Open your real-time analytics feed in the dashboard to confirm the pageview appears within milliseconds.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={verificationSchema} />
      <VerificationClientView />
    </>
  );
}

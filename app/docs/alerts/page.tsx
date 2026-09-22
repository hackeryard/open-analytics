import type { Metadata } from "next";
import AlertsDocsClientView from "@/components/docs/AlertsDocsClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Autonomous Incident Alerts & Notifications",
  description:
    "Guide to the Open Analytics incident engine: repeated error spikes, error storms, desktop OS alerts, synthesized audio chimes, and noise suppression rules.",
  alternates: {
    canonical: "/docs/alerts",
  },
  openGraph: {
    title: "Autonomous Incident Alerts & Notifications | Open Analytics",
    description:
      "Guide to the Open Analytics incident engine: repeated error spikes, error storms, desktop OS alerts, synthesized audio chimes, and noise suppression rules.",
    url: "https://openanalytics.org.in/docs/alerts",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonomous Incident Alerts & Notifications | Open Analytics",
    description:
      "Guide to the Open Analytics incident engine: repeated error spikes, error storms, desktop OS alerts, synthesized audio chimes, and noise suppression rules.",
  },
};

export default function AlertsDocsPage() {
  const alertCategories = [
    {
      name: "Repeated Error Spikes",
      type: "Real-Time Telemetry",
      threshold: ">= 5 identical occurrences",
      desc: "Triggers high-priority alerts when identical runtime exceptions recur 5 or more times within a sliding window.",
    },
    {
      name: "Error Velocity Storms",
      type: "Rate Ingestion Surge",
      threshold: "> 10 errors / 5 minutes",
      desc: "Catastrophic error storm detection that activates when error velocity spikes sharply.",
    },
    {
      name: "SEO Missing Title Audits",
      type: "Automated Site Scan",
      threshold: "Missing or empty <title>",
      desc: "Scans indexed landing pages and routes for missing, blank, or placeholder document titles.",
    },
    {
      name: "AEO Low Dwell Friction",
      type: "Behavioral Retention",
      threshold: "Average dwell < 10s on content routes",
      desc: "Identifies answer engine routes where visitors immediately bounce without engaging.",
    },
    {
      name: "GEO AI Citation Radar",
      type: "Generative Engine Audit",
      threshold: "Citation readiness score < 50%",
      desc: "Monitors readiness for generative search engines and notifies teams when crawler visibility drops.",
    },
    {
      name: "Core Web Vitals Degradation",
      type: "RUM Performance Threshold",
      threshold: "p75 INP > 500ms or LCP > 4.0s",
      desc: "Continuous field monitoring of real visitor experience against Google Core Web Vitals thresholds.",
    },
    {
      name: "Behavioral Rage Click Hotspots",
      type: "UX Friction Telemetry",
      threshold: ">= 3 rapid taps within 500ms and 40px",
      desc: "Captures rapid, repeated tapping on broken buttons, stalled links, or unresponsive elements.",
    },
  ];

  const alertsSchema = {
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
            name: "Alerts & Incident Engine",
            item: "https://openanalytics.org.in/docs/alerts",
          },
        ],
      },
      {
        "@type": "TechArticle",
        "@id": "https://openanalytics.org.in/docs/alerts#article",
        headline: "Open Analytics Autonomous Incident Alerts & Notification Engine",
        description:
          "Guide to the Open Analytics incident engine: repeated error spikes, error storms, desktop OS alerts, synthesized audio chimes, and noise suppression rules.",
        url: "https://openanalytics.org.in/docs/alerts",
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
        "@type": "ItemList",
        name: "Autonomous Telemetry Anomaly Detection Categories",
        itemListElement: alertCategories.map((cat, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `${cat.name} (${cat.type})`,
          description: `${cat.desc} (Threshold: ${cat.threshold})`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={alertsSchema} />
      <AlertsDocsClientView />
    </>
  );
}

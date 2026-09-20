import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Alerts & Incident Engine | Open Analytics Docs",
  description:
    "Autonomous anomaly detection, repeated error surge alerts (5x+), error velocity storm tracking, SEO/AEO optimization scans, OS desktop notifications, and granular suppression rules.",
  keywords: [
    "autonomous alert engine",
    "repeated error alerts",
    "error storm velocity detection",
    "web observability alerting",
    "seo title audit alerts",
    "aeo dwell friction detection",
    "geo citation radar alerts",
    "core web vitals alerts",
    "rage click alerts",
    "os desktop notifications",
    "browser notification alerts",
    "telemetry incident triage",
    "notification suppression rules",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/docs/alerts",
  },
  openGraph: {
    title: "Alerts & Incident Engine | Open Analytics Documentation",
    description:
      "Autonomous telemetry anomaly detection, repeated crash detection, native OS desktop alerts, and granular ignore rules.",
    url: "https://openanalytics.org.in/docs/alerts",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alerts & Incident Engine | Open Analytics Docs",
    description:
      "Autonomous incident detection, repeated error alerts, desktop notifications, and suppression rules.",
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
};

const techArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Autonomous Telemetry Anomaly Alerts, OS Notifications & Incident Suppression",
  description:
    "Technical documentation for Open Analytics autonomous alerting engine, repeated error detection thresholds, native desktop notifications, Web Audio chimes, and granular suppression rules.",
  url: "https://openanalytics.org.in/docs/alerts",
  author: {
    "@type": "Organization",
    name: "Open Analytics Engineering",
    url: "https://openanalytics.org.in",
  },
};

export default function AlertsDocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, techArticleSchema]} />
      {children}
    </>
  );
}

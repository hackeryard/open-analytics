import type { Metadata } from "next";
import DocsOverviewClientView from "@/components/docs/DocsOverviewClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Developer Documentation & API Reference",
  description:
    "Technical documentation for Open Analytics: universal 1-line script, Core Web Vitals RUM monitoring, AI search crawler radar, and runtime error incident triage.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Developer Documentation & API Reference | Open Analytics",
    description:
      "Technical documentation for Open Analytics: universal 1-line script, Core Web Vitals RUM monitoring, AI search crawler radar, and runtime error incident triage.",
    url: "https://openanalytics.org.in/docs",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Documentation & API Reference | Open Analytics",
    description:
      "Technical documentation for Open Analytics: universal 1-line script, Core Web Vitals RUM monitoring, AI search crawler radar, and runtime error incident triage.",
  },
};

export default function DocsPage() {
  const docsSchema = {
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
        ],
      },
      {
        "@type": "TechArticle",
        "@id": "https://openanalytics.org.in/docs#article",
        headline: "Open Analytics Developer Architecture & Integration Reference",
        description:
          "Comprehensive guides and architecture reference for integrating privacy-friendly cookieless telemetry, Core Web Vitals RUM, and AI Search Radar.",
        url: "https://openanalytics.org.in/docs",
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
        name: "Open Analytics Observability Documentation Modules",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Alerts & Incident Engine",
            url: "https://openanalytics.org.in/docs/alerts",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Core Web Vitals & RUM",
            url: "https://openanalytics.org.in/docs/web-vitals",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "SEO & AI Crawler Radar",
            url: "https://openanalytics.org.in/docs/seo-aeo",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Installation Guides",
            url: "https://openanalytics.org.in/docs/installation",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Testing & Verification",
            url: "https://openanalytics.org.in/docs/verification",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={docsSchema} />
      <DocsOverviewClientView />
    </>
  );
}

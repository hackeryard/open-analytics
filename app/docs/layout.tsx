import type { Metadata } from "next";
import DocsClientShell from "@/components/docs/DocsClientShell";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Developer Documentation & API Reference",
  description:
    "Technical documentation for Open Analytics: universal 1-line script, Core Web Vitals RUM monitoring, AI search crawler radar, and runtime error incident triage.",
  keywords: [
    "open analytics documentation",
    "web analytics developer guide",
    "web vitals real user monitoring docs",
    "open analytics installation",
    "cookieless telemetry api",
    "ai search crawler radar docs",
    "rage click tracking documentation",
  ],
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Developer Documentation & API Reference | Open Analytics",
    description:
      "Technical documentation for Open Analytics: universal 1-line script, Core Web Vitals RUM monitoring, AI search crawler radar, and runtime error incident triage.",
    url: "https://openanalytics.org.in/docs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Documentation & API Reference | Open Analytics",
    description:
      "Technical documentation for Open Analytics: universal 1-line script, Core Web Vitals RUM monitoring, AI search crawler radar, and runtime error incident triage.",
  },
};

const docsBreadcrumb = {
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
  ],
};

const techArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics Developer Architecture & Integration Reference",
  description:
    "Comprehensive guides and architecture reference for integrating privacy-friendly cookieless telemetry, Core Web Vitals RUM, and AI Search Radar.",
  url: "https://openanalytics.org.in/docs",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
    url: "https://openanalytics.org.in",
  },
  publisher: {
    "@type": "Organization",
    name: "Open Analytics",
    logo: {
      "@type": "ImageObject",
      url: "https://openanalytics.org.in/favicon.ico",
    },
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[docsBreadcrumb, techArticleSchema]} />
      <DocsClientShell>{children}</DocsClientShell>
    </>
  );
}

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Core Web Vitals & RUM Field Diagnostics | Open Analytics",
  description:
    "Real User Monitoring (RUM) field diagnostics for Google Core Web Vitals: p75 LCP, INP, CLS, FCP, and TTFB measured from real visitor devices with zero PageSpeed penalty.",
  keywords: [
    "core web vitals real user monitoring",
    "p75 lcp tracking",
    "inp field monitoring",
    "cls layout shift analytics",
    "rum observability engine",
    "google search ranking vitals",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/docs/web-vitals",
  },
  openGraph: {
    title: "Core Web Vitals & RUM Field Diagnostics | Open Analytics",
    description: "Understand and optimize your 75th-percentile field vitals with Open Analytics.",
    url: "https://openanalytics.org.in/docs/web-vitals",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Web Vitals & RUM | Open Analytics Docs",
    description: "Sample real visitor experience metrics directly in your analytics dashboard.",
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
      name: "Core Web Vitals",
      item: "https://openanalytics.org.in/docs/web-vitals",
    },
  ],
};

const techArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Core Web Vitals & Real User Monitoring (RUM) Telemetry Specification",
  description:
    "Field measurement methodology for LCP, INP, and CLS under 75th percentile thresholds using PerformanceObserver in Open Analytics.",
  url: "https://openanalytics.org.in/docs/web-vitals",
  author: {
    "@type": "Organization",
    name: "Open Analytics Engineering",
    url: "https://openanalytics.org.in",
  },
};

export default function WebVitalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, techArticleSchema]} />
      {children}
    </>
  );
}

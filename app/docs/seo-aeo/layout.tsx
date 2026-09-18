import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "SEO & AI Crawler Radar (AEO / GEO) | Open Analytics",
  description:
    "Track how generative AI search engines and LLM crawlers (ChatGPT, ClaudeBot, PerplexityBot, Bytespider, Applebot) discover, crawl, and cite your website content.",
  keywords: [
    "ai crawler radar",
    "answer engine optimization",
    "generative engine optimization",
    "gptbot tracking",
    "perplexitybot analytics",
    "claudebot analytics",
    "aeo telemetry",
    "geo citation tracking",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/docs/seo-aeo",
  },
  openGraph: {
    title: "SEO & AI Crawler Radar (AEO) | Open Analytics",
    description: "Monitor and attribute generative engine optimization (GEO) and answer engine crawlers.",
    url: "https://openanalytics.org.in/docs/seo-aeo",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Search Radar & AEO Tracking | Open Analytics Docs",
    description: "Real-time crawler telemetry for ChatGPT, Perplexity, and Claude bot traffic.",
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
      name: "AI Crawler Radar (AEO)",
      item: "https://openanalytics.org.in/docs/seo-aeo",
    },
  ],
};

const techArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Autonomous AI Search Engine Radar & Generative Engine Optimization (GEO)",
  description:
    "Classification methodology and edge detection heuristics for LLM crawlers, synthesis agents, and AI citation attribution.",
  url: "https://openanalytics.org.in/docs/seo-aeo",
  author: {
    "@type": "Organization",
    name: "Open Analytics AI Research",
    url: "https://openanalytics.org.in",
  },
};

export default function SeoAeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, techArticleSchema]} />
      {children}
    </>
  );
}

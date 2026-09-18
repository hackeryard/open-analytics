import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO & AI Crawler Radar (AEO) | Open Analytics",
  description:
    "Track how artificial intelligence search engines and autonomous LLM crawlers (ChatGPT, Claude, Perplexity) index and cite your content.",
  alternates: {
    canonical: "https://openanalytics.org.in/docs/seo-aeo",
  },
  openGraph: {
    title: "SEO & AI Crawler Radar (AEO) | Open Analytics",
    description: "Monitor and attribute generative engine optimization (GEO) and answer engine crawlers.",
    url: "https://openanalytics.org.in/docs/seo-aeo",
    type: "article",
  },
};

export default function SeoAeoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

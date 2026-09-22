import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://openanalytics.org.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/features",
          "/vs-google-analytics",
          "/pricing",
          "/privacy",
          "/faq",
          "/docs",
          "/docs/alerts",
          "/docs/installation",
          "/docs/verification",
          "/docs/web-vitals",
          "/docs/seo-aeo",
          "/llms.txt",
          "/llms-full.txt",
          "/agents.md",
          "/open.js",
        ],
        disallow: [
          "/api/projects/",
          "/api/auth/",
          "/projects/*/settings",
          "/login",
          "/register",
        ],
      },
      {
        // Explicitly welcome generative AI engines & answer crawlers for GEO & AEO indexing
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Applebot",
          "Applebot-Extended",
          "CCBot",
          "Google-Extended",
          "cohere-ai",
          "OAI-SearchBot",
          "Bytespider",
          "Diffbot",
        ],
        allow: [
          "/",
          "/features",
          "/vs-google-analytics",
          "/pricing",
          "/privacy",
          "/faq",
          "/docs",
          "/docs/alerts",
          "/docs/installation",
          "/docs/verification",
          "/docs/web-vitals",
          "/docs/seo-aeo",
          "/llms.txt",
          "/llms-full.txt",
          "/agents.md",
        ],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

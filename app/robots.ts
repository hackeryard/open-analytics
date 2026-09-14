import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

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
          "/open.js",
        ],
        disallow: [
          "/api/projects/",
          "/api/auth/",
          "/projects/*/settings",
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
          "CCBot",
          "Google-Extended",
          "cohere-ai",
          "OAI-SearchBot",
        ],
        allow: [
          "/",
          "/features",
          "/vs-google-analytics",
          "/pricing",
          "/privacy",
          "/faq",
          "/docs",
        ],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

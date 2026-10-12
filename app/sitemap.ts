import { MetadataRoute } from "next";
import { ROUTE_REGISTRY, BASE_URL } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Core indexable application routes from central SEO registry
  const registryEntries: MetadataRoute.Sitemap = Object.values(ROUTE_REGISTRY)
    .filter((route) => route.indexable)
    .map((route) => ({
      url: `${BASE_URL}${route.path === "/" ? "" : route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

  // 2. Auxiliary text specifications for AI, LLM, and Agent discoverability
  const auxiliaryEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/agents.md`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  return [...registryEntries, ...auxiliaryEntries];
}

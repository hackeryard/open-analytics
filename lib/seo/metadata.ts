import { Metadata } from "next";
import { ROUTE_REGISTRY, BASE_URL } from "./routes";

export interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  ogImage?: string;
  type?: "website" | "article";
}

export function constructPageMetadata(
  pathname: string,
  overrides?: Partial<Metadata>
): Metadata {
  const route = ROUTE_REGISTRY[pathname] || ROUTE_REGISTRY["/"];
  const canonicalUrl = `${BASE_URL}${route.path === "/" ? "" : route.path}`;

  const defaultTitle = route.title;
  const defaultDesc = route.description;

  return {
    metadataBase: new URL(BASE_URL),
    title: defaultTitle,
    description: defaultDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: canonicalUrl,
      siteName: "Open Analytics",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${defaultTitle} - Privacy-First Web Observability`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDesc,
      creator: "@openanalytics",
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index: route.indexable,
      follow: true,
      googleBot: {
        index: route.indexable,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...overrides,
  };
}

export function generateBreadcrumbSchema(path: string) {
  const route = ROUTE_REGISTRY[path];
  if (!route || !route.breadcrumbs || route.breadcrumbs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: route.breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

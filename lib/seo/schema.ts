import { BASE_URL } from "./routes";

export const siteOrganizationSchema = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Open Analytics",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  sameAs: [
    "https://twitter.com/openanalytics",
  ],
  description:
    "Open Analytics provides privacy-first, open-source web analytics and observability infrastructure for modern developers and enterprises.",
};

export const siteWebSiteSchema = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Open Analytics",
  description: "Open-source web analytics and observability platform for modern websites.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/docs?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const softwareApplicationSchema = {
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#software`,
  name: "Open Analytics",
  applicationCategory: "DeveloperApplication, BusinessApplication",
  operatingSystem: "Web, Cloud, Linux, macOS, Windows, iOS, Android",
  softwareVersion: "3.6.0",
  url: BASE_URL,
  author: {
    "@id": `${BASE_URL}/#organization`,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free and Open Source Community Edition with Cloud tiers available",
  },
  description:
    "Open-source web analytics and observability platform. Unified real user monitoring (RUM), Core Web Vitals, behavioral UX tracking, runtime error triage, and AI crawler detection.",
  featureList: [
    "Web Analytics",
    "Real User Monitoring",
    "Core Web Vitals",
    "Behavioral Analytics",
    "Frontend Error Monitoring",
    "AI Visibility",
    "Custom Events",
    "User Journeys",
    "Audience Analytics",
  ],
};

export function getHomepageGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      siteOrganizationSchema,
      siteWebSiteSchema,
      softwareApplicationSchema,
    ],
  };
}

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Installation & Quickstart Guides | Open Analytics",
  description:
    "Universal copy-paste installation guides for Next.js (App & Pages Router), React, Vite, Vue, Nuxt 3, SvelteKit, Django, Laravel, WordPress, and Shopify.",
  keywords: [
    "install open analytics",
    "next.js analytics script",
    "react analytics setup",
    "vue nuxt analytics",
    "sveltekit analytics guide",
    "wordpress privacy analytics plugin",
    "shopify cookieless tracking",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/docs/installation",
  },
  openGraph: {
    title: "Installation & Quickstart Guides | Open Analytics",
    description:
      "Universal quickstart guides to embed Open Analytics across all modern web frameworks with zero configuration.",
    url: "https://openanalytics.org.in/docs/installation",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Installation Guides",
    description: "Install in under 60 seconds with copy-paste snippets for any framework.",
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
      name: "Installation Guides",
      item: "https://openanalytics.org.in/docs/installation",
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Install Open Analytics on Any Website",
  description:
    "Add lightweight, cookieless web telemetry to any website in under 60 seconds without slowing down performance.",
  step: [
    {
      "@type": "HowToStep",
      name: "Copy Embed Script",
      text: "Copy the universal asynchronous script tag containing your Project ID.",
    },
    {
      "@type": "HowToStep",
      name: "Paste in HTML Head",
      text: "Paste the script tag inside the <head> section of your website layout or template.",
    },
    {
      "@type": "HowToStep",
      name: "Verify Telemetry Stream",
      text: "Navigate to your site and verify live pageviews streaming in the Real-Time Dashboard.",
    },
  ],
};

export default function InstallationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, howToSchema]} />
      {children}
    </>
  );
}

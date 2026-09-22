import type { Metadata } from "next";
import InstallationClientView from "@/components/docs/InstallationClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Installation & Framework Integration Guide",
  description:
    "Step-by-step guide to installing Open Analytics: embed the sub-3.2KB script into Next.js, React, Vue, SvelteKit, HTML, and WordPress in under 60 seconds.",
  alternates: {
    canonical: "/docs/installation",
  },
  openGraph: {
    title: "Installation & Framework Integration Guide | Open Analytics",
    description:
      "Step-by-step guide to installing Open Analytics: embed the sub-3.2KB script into Next.js, React, Vue, SvelteKit, HTML, and WordPress in under 60 seconds.",
    url: "https://openanalytics.org.in/docs/installation",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Installation & Framework Integration Guide | Open Analytics",
    description:
      "Step-by-step guide to installing Open Analytics: embed the sub-3.2KB script into Next.js, React, Vue, SvelteKit, HTML, and WordPress in under 60 seconds.",
  },
};

export default function InstallationDocsPage() {
  const installationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
      },
      {
        "@type": "TechArticle",
        "@id": "https://openanalytics.org.in/docs/installation#article",
        headline: "Open Analytics Multi-Framework Installation & Integration Guide",
        description:
          "Step-by-step guide to installing Open Analytics: embed the sub-3.2KB script into Next.js, React, Vue, SvelteKit, HTML, and WordPress in under 60 seconds.",
        url: "https://openanalytics.org.in/docs/installation",
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Open Analytics Team",
          url: "https://openanalytics.org.in",
        },
        publisher: {
          "@type": "Organization",
          name: "Open Analytics",
          url: "https://openanalytics.org.in",
          logo: {
            "@type": "ImageObject",
            url: "https://openanalytics.org.in/favicon.ico",
          },
        },
      },
      {
        "@type": "HowTo",
        "@id": "https://openanalytics.org.in/docs/installation#howto",
        name: "How to Install Open Analytics Telemetry Script",
        description:
          "Embed the sub-3.2KB cookieless tracking script into your website or application in under 60 seconds.",
        totalTime: "PT1M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Obtain Project Tracking Key",
            text: "Create or select your project in the Open Analytics dashboard to obtain your unique Project ID.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Embed the Asynchronous Script Tag",
            text: "Add the single asynchronous script tag inside your HTML head element or framework layout template before the closing head tag.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Verify Telemetry Delivery",
            text: "Trigger a test ping or visit your website to confirm real-time event ingestion in the dashboard.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={installationSchema} />
      <InstallationClientView />
    </>
  );
}

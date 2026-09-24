import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PrivacyClientView from "@/components/public/PrivacyClientView";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Privacy Architecture & GDPR Compliance",
  description:
    "Technical overview of Open Analytics privacy architecture: 100% GDPR, CCPA, and PECR compliance, zero cookie consent banners, and daily rotating 256-bit salts.",
  keywords: [
    "gdpr compliant web analytics",
    "cookieless analytics privacy",
    "no cookie banner analytics",
    "pecr compliance analytics",
    "eprivacy directive exempt analytics",
    "privacy policy open analytics",
    "ip anonymization web telemetry",
    "schrems ii compliant analytics",
    "rotating cryptographic salt analytics",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/privacy",
  },
  openGraph: {
    title: "Privacy Architecture & GDPR Compliance | Open Analytics",
    description:
      "Technical overview of Open Analytics privacy architecture: 100% GDPR, CCPA, and PECR compliance, zero cookie consent banners, and daily rotating 256-bit salts.",
    url: `${baseUrl}/privacy`,
    type: "article",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Privacy Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Architecture & GDPR Compliance | Open Analytics",
    description:
      "Technical overview of Open Analytics privacy architecture: 100% GDPR, CCPA, and PECR compliance, zero cookie consent banners, and daily rotating 256-bit salts.",
    images: [`${baseUrl}/og-image.png`],
  },
};

const breadcrumbSchema = {
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Privacy & GDPR",
      item: `${baseUrl}/privacy`,
    },
  ],
};

const privacyArticleSchema = {
  "@type": "TechArticle",
  "@id": `${baseUrl}/privacy/#article`,
  headline: "Open Analytics Privacy & Data Protection Architecture",
  description:
    "Comprehensive engineering breakdown of cookieless telemetry, rotating daily cryptographic salts, and EU data sovereignty.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
    url: baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "Open Analytics",
    url: baseUrl,
  },
};

const privacyFaqSchema = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is Open Analytics exempt from cookie consent banner laws?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under Article 5(3) of the EU ePrivacy Directive (PECR in the UK), consent banners are only legally required when storing information or gaining access to information already stored in the terminal equipment of a subscriber or user (cookies, localStorage, or persistent device fingerprints). Open Analytics stores zero client-side files and does not fingerprint devices, making it legally exempt from cookie banners.",
      },
    },
    {
      "@type": "Question",
      name: "How does Open Analytics protect visitor privacy with daily cryptographic salts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Visitor IDs are computed by combining the masked IP address, User-Agent, and a 256-bit cryptographic salt rotated and purged every 24 hours at 00:00:00 UTC. This makes cross-day profiling mathematically impossible.",
      },
    },
    {
      "@type": "Question",
      name: "Is Open Analytics compliant with the Schrems II ruling regarding EU-US data transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Open Analytics processes and stores all European client telemetry within EU-based data centers (Frankfurt and Amsterdam) with zero transfer of personal identifiable information to US servers.",
      },
    },
    {
      "@type": "Question",
      name: "Does Open Analytics comply with California CCPA and CPRA regulations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Open Analytics never sells, rents, or brokers personal information to advertising networks. All telemetry is de-identified, eliminating 'Do Not Sell My Info' requirements under CCPA and CPRA.",
      },
    },
    {
      "@type": "Question",
      name: "How does automated 365-day data retention and log purging work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Analytics enforces a strict 365-day data retention lifecycle. MongoDB TTL indexes autonomously purge raw telemetry documents after 1 year, ensuring full compliance with the GDPR Storage Limitation principle.",
      },
    },
  ],
};

const privacyPageSchema = {
  "@context": "https://schema.org",
  "@graph": [breadcrumbSchema, privacyArticleSchema, privacyFaqSchema],
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={privacyPageSchema} />
      <PrivacyClientView />
    </>
  );
}

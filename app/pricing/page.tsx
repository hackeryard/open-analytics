import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PricingInteractive from "@/components/public/PricingInteractive";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Pricing Plans: Free Starter & Pro Analytics",
  description:
    "Simple, predictable web analytics pricing. Start free forever with 10k events/mo, or upgrade to Pro for AI crawler radar, Core Web Vitals RUM, and rage clicks.",
  keywords: [
    "open analytics pricing",
    "web analytics plans",
    "cookieless analytics pricing",
    "privacy friendly analytics pricing",
    "google analytics alternative pricing",
    "ai search analytics pro",
    "core web vitals rum pricing",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/pricing",
  },
  openGraph: {
    title: "Open Analytics Pricing Plans: Free Starter & Pro",
    description:
      "Simple, predictable web analytics pricing. Start free forever with 10k events/mo, or upgrade to Pro for AI crawler radar, Core Web Vitals RUM, and rage clicks.",
    url: `${baseUrl}/pricing`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Pricing Plans: Free Starter & Pro",
    description:
      "Simple, predictable web analytics pricing. Start free forever with 10k events/mo, or upgrade to Pro for AI crawler radar, Core Web Vitals RUM, and rage clicks.",
    images: [`${baseUrl}/og-image.png`],
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
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: `${baseUrl}/pricing`,
    },
  ],
};

const productOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics Platform",
  image: `${baseUrl}/og-image.png`,
  description:
    "Privacy-first, cookieless web telemetry and RUM observability SaaS platform.",
  brand: {
    "@type": "Brand",
    name: "Open Analytics",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Free Starter",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
      description: "Free starter plan with 10,000 monthly events, core web analytics, and zero cookie banners.",
    },
    {
      "@type": "Offer",
      name: "Cloud Pro",
      price: "19",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
      description: "Pro tier with 250,000 events/mo, Core Web Vitals RUM, GEO & AI Search Radar, Rage Clicks, and custom reverse-proxy domain.",
    },
    {
      "@type": "Offer",
      name: "Enterprise Plan",
      price: "79",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
      description: "Enterprise tier with unlimited websites, 1M+ events/mo, private cluster, custom SLAs, and VIP priority support.",
    },
  ],
};

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What features are included in the Free Starter plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Free Starter plan includes all core web analytics: pageviews, unique visitors, sessions, average duration, bounce and return rates, top pages, traffic channels, referrers, geographic countries & cities, device & browser breakdowns, real-time live feed, and 100% cookieless GDPR/PECR compliance.",
      },
    },
    {
      "@type": "Question",
      name: "What extra features do I get with the Pro plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Pro plan ($19/mo or $15/mo billed annually) unlocks all 5 advanced extra modules: Custom Business Events & Conversion Rules (revenue value attribution, no-code click/form rules, payload inspection), GEO & AI Search Radar (tracking OpenAI SearchGPT, Perplexity, ClaudeBot, and Gemini citations & crawlers), Core Web Vitals RUM (real user p75 LCP, INP, CLS, TTFB monitoring), Behavioral UX Friction (autonomous Rage Click and Dead Click detection), Crash Diagnostics (automated frontend JavaScript error capture), and Custom Domain Proxying.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a credit card to sign up for the Free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You can create a Free Starter account and begin tracking your website immediately with zero credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to display a cookie consent banner with Open Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Because Open Analytics does not store cookies, LocalStorage tracking IDs, or persistent cross-site device fingerprints, it is legally exempt from ePrivacy Directive and GDPR cookie banner requirements across all plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I upgrade or downgrade my plan at any time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can upgrade to Pro or switch back to Free at any time directly from your Property Settings.",
      },
    },
  ],
};

const pricingPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema,
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/pricing/#webpage`,
      url: `${baseUrl}/pricing`,
      name: "Open Analytics Pricing Plans: Free Starter & Pro",
      description:
        "Simple, predictable web analytics pricing. Start free forever with 10k events/mo, or upgrade to Pro for AI crawler radar, Core Web Vitals RUM, and rage clicks.",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
      },
    },
    productOfferSchema,
    pricingFaqSchema,
  ],
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pricingPageSchema} />
      <PricingInteractive />
    </div>
  );
}

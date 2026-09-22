import type { Metadata } from "next";
import FaqClientView from "@/components/public/FaqClientView";
import { FAQ_ITEMS } from "@/lib/faqData";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Frequently Asked Questions & Answers",
  description:
    "Answers to frequently asked questions about Open Analytics: installation, cookieless tracking, GDPR compliance, Core Web Vitals, and AI search crawler radar.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions & Answers | Open Analytics",
    description:
      "Answers to frequently asked questions about Open Analytics: installation, cookieless tracking, GDPR compliance, Core Web Vitals, and AI search crawler radar.",
    url: "https://openanalytics.org.in/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions & Answers | Open Analytics",
    description:
      "Answers to frequently asked questions about Open Analytics: installation, cookieless tracking, GDPR compliance, Core Web Vitals, and AI search crawler radar.",
  },
};

export default function FaqPage() {
  const faqSchema = {
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
            name: "FAQ",
            item: "https://openanalytics.org.in/faq",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://openanalytics.org.in/faq#webpage",
        url: "https://openanalytics.org.in/faq",
        name: "Frequently Asked Questions & Answers | Open Analytics",
        description:
          "Answers to frequently asked questions about Open Analytics: installation, cookieless tracking, GDPR compliance, Core Web Vitals, and AI search crawler radar.",
        isPartOf: {
          "@id": "https://openanalytics.org.in/#website",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://openanalytics.org.in/faq#faqpage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <FaqClientView />
    </>
  );
}

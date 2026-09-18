import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Open Analytics",
  description:
    "Common questions regarding Open Analytics: cookie banner exemptions, GDPR/PECR compliance, Core Web Vitals RUM impact, AI search radar, and installation instructions.",
  keywords: [
    "open analytics faq",
    "cookieless analytics questions",
    "gdpr cookie banner exempt",
    "web vitals impact",
    "ai bot tracking questions",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Open Analytics",
    description:
      "Find answers to questions about privacy compliance, zero cookie banners, performance impact, and AI search bot detection.",
    url: "https://openanalytics.org.in/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics FAQ",
    description: "Got questions about Open Analytics? Read our comprehensive FAQ.",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

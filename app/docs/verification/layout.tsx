import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Testing & Verification Diagnostics | Open Analytics",
  description:
    "Test and verify that your Open Analytics installation is capturing events. Run DevTools network audits, verify beacon dispatches, and trigger test curl pings.",
  keywords: [
    "verify analytics installation",
    "test analytics script",
    "sendbeacon network audit",
    "analytics debugging guide",
    "telemetry ping verification",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/docs/verification",
  },
  openGraph: {
    title: "Testing & Verification Diagnostics | Open Analytics",
    description: "Verify your Open Analytics installation with DevTools audits and CLI curl pings.",
    url: "https://openanalytics.org.in/docs/verification",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Testing & Verification | Open Analytics Docs",
    description: "Audit network beacons and test ingest endpoints with ease.",
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
      name: "Testing & Verification",
      item: "https://openanalytics.org.in/docs/verification",
    },
  ],
};

export default function VerificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}

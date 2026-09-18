import type { Metadata } from "next";
import DocsClientShell from "@/components/docs/DocsClientShell";

export const metadata: Metadata = {
  title: "Documentation & Developer Architecture | Open Analytics",
  description:
    "Comprehensive guides, integration snippets, RUM observability specs, and verification protocols for Open Analytics.",
  keywords: [
    "open analytics documentation",
    "web analytics docs",
    "web vitals integration guide",
    "open analytics installation",
    "cookieless telemetry api",
  ],
  alternates: {
    canonical: "https://openanalytics.org.in/docs",
  },
  openGraph: {
    title: "Open Analytics Developer Documentation",
    description:
      "Enterprise web observability documentation. Universal 1-line installation, Core Web Vitals, and AI Crawler Radar integration.",
    url: "https://openanalytics.org.in/docs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics Documentation",
    description: "Universal 1-line installation, Core Web Vitals, and AI Crawler Radar docs.",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsClientShell>{children}</DocsClientShell>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Web Vitals & RUM Diagnostics | Open Analytics",
  description:
    "Real User Monitoring (RUM) field metrics for LCP, INP, CLS, FCP, and TTFB captured directly from real visitor devices.",
  alternates: {
    canonical: "https://openanalytics.org.in/docs/web-vitals",
  },
  openGraph: {
    title: "Core Web Vitals & RUM Diagnostics | Open Analytics",
    description: "Understand and optimize your 75th-percentile field vitals with Open Analytics.",
    url: "https://openanalytics.org.in/docs/web-vitals",
    type: "article",
  },
};

export default function WebVitalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

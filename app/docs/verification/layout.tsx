import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testing & Verification Guide | Open Analytics",
  description:
    "Test and verify that your Open Analytics installation is successfully capturing and streaming telemetry events.",
  alternates: {
    canonical: "https://openanalytics.org.in/docs/verification",
  },
  openGraph: {
    title: "Testing & Verification Guide | Open Analytics",
    description: "Verify your Open Analytics installation with DevTools audits and CLI curl pings.",
    url: "https://openanalytics.org.in/docs/verification",
    type: "article",
  },
};

export default function VerificationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

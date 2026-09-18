import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Installation Guides | Open Analytics",
  description:
    "Step-by-step installation guides for Open Analytics across Next.js, React, Vue, SvelteKit, WordPress, Shopify, and vanilla HTML.",
  alternates: {
    canonical: "https://openanalytics.org.in/docs/installation",
  },
  openGraph: {
    title: "Installation Guides | Open Analytics",
    description:
      "Universal quickstart guides to embed Open Analytics across all modern frameworks with zero configuration.",
    url: "https://openanalytics.org.in/docs/installation",
    type: "article",
  },
};

export default function InstallationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { PlatformProvider } from "@/components/PlatformContext";
import AppShell from "@/components/AppShell";
import JsonLd from "@/components/JsonLd";
import { isDashboardHost } from "@/lib/subdomain";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Open Analytics | Privacy-First Web Analytics & Observability Engine",
    template: "%s | Open Analytics",
  },
  description:
    "Open Analytics is a modern, lightweight (<3.2KB), cookieless Google Analytics 4 alternative with automated Core Web Vitals (RUM), behavioral UX tracking, and autonomous AI search crawler radar.",
  keywords: [
    "open analytics",
    "web analytics",
    "google analytics alternative",
    "privacy-first analytics",
    "cookieless analytics",
    "gdpr compliant analytics",
    "real user monitoring",
    "core web vitals tracker",
    "ai crawler radar",
    "rage click tracker",
    "ga4 alternative",
    "lightweight web analytics",
    "cloud web analytics",
    "answer engine optimization",
    "generative engine optimization",
  ],
  authors: [{ name: "Open Analytics Team", url: baseUrl }],
  creator: "Open Analytics",
  publisher: "Open Analytics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Open Analytics | Privacy-First Web Analytics & Observability Engine",
    description:
      "Modern, cookieless Google Analytics 4 alternative. Sub-3.2KB Brotli telemetry beacon, Core Web Vitals, behavioral UX signals, and AI bot radar with zero cookie banners.",
    url: baseUrl,
    siteName: "Open Analytics",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Platform Preview - Privacy-First Web Observability",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Analytics | Privacy-First Web Analytics & Observability Engine",
    description:
      "Modern, cookieless Google Analytics 4 alternative. Sub-3.2KB telemetry beacon, Core Web Vitals, and AI bot radar.",
    creator: "@openanalytics",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xCkYbtReDgmW6WjPhKIYkIOij4pYy4-cfq72vEpSzJ4",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Open Analytics",
      url: baseUrl,
      logo: `${baseUrl}/favicon.ico`,
      sameAs: [
        "https://github.com/open-analytics",
        "https://twitter.com/openanalytics",
      ],
      description:
        "Open Analytics provides privacy-first, cookieless web analytics and observability infrastructure for modern developers and enterprises.",
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Open Analytics",
      description: "Privacy-first Web Analytics, RUM, and AI Search Radar",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "Open Analytics",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      url: baseUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Lightweight, cookieless web observability platform with Real User Monitoring, Core Web Vitals (LCP, INP, CLS), behavioral rage clicks, and AI bot radar.",
      featureList: [
        "Cookieless tracking with zero cookie banner requirement",
        "Sub-3.2 KB Brotli compressed asynchronous tracking script",
        "Automated Core Web Vitals: LCP, INP, CLS tracking",
        "Behavioral UX rage click and dead click detection",
        "Autonomous AI and LLM search crawler radar (Perplexity, ChatGPT, Claude)",
        "Automated frontend crash and JavaScript exception grouping",
        "100% GDPR, CCPA, and PECR compliant with daily salt rotation",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const headerIsDashboard = headersList.get("x-is-dashboard");
  const isDashboard =
    headerIsDashboard !== null
      ? headerIsDashboard === "1"
      : isDashboardHost(host, undefined, headersList.get("x-subdomain"));

  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd data={organizationSchema} />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZDHKTDPHFX"
        />
        <Script
          id="google-analytics-gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZDHKTDPHFX');
            `,
          }}
        />
        {/* Open Analytics Self-Tracking Beacon */}
        <Script
          id="open-analytics-tracker"
          strategy="afterInteractive"
          src={process.env.NEXT_PUBLIC_TRACKER_URL || "https://api.openanalytics.org.in/open.js"}
          data-project-id="open_prj_d5f732524ada1a6a"
          data-api-key="pk_live_8481cc68ffbf81e84b34e6e0e5b447e5"
          data-endpoint={process.env.NEXT_PUBLIC_API_URL || "https://api.openanalytics.org.in"}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <PlatformProvider initialIsDashboard={isDashboard}>
          <AppShell initialIsDashboard={isDashboard}>{children}</AppShell>
        </PlatformProvider>
      </body>
    </html>
  );
}


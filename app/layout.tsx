import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PlatformProvider } from "@/components/PlatformContext";
import AppShell from "@/components/AppShell";
import JsonLd from "@/components/JsonLd";
import { isDashboardHost } from "@/lib/subdomain";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});


const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Open Analytics | Cookieless Web Observability & RUM",
    template: "%s | Open Analytics",
  },
  description:
    "Lightweight (<3.2KB) cookieless Google Analytics 4 alternative. Automated Core Web Vitals RUM, behavioral UX signals, crash triage, and autonomous AI bot radar.",
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
    canonical: "https://openanalytics.org.in",
  },
  openGraph: {
    title: "Open Analytics | Cookieless Web Observability & RUM",
    description:
      "Lightweight (<3.2KB) cookieless Google Analytics 4 alternative. Automated Core Web Vitals RUM, behavioral UX signals, crash triage, and autonomous AI bot radar.",
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
    title: "Open Analytics | Cookieless Web Observability & RUM",
    description:
      "Lightweight (<3.2KB) cookieless Google Analytics 4 alternative. Automated Core Web Vitals RUM, behavioral UX signals, crash triage, and autonomous AI bot radar.",
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
      description: "Cookieless Web Analytics, Core Web Vitals RUM, and Autonomous AI Bot Radar",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/docs?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/#software`,
      name: "Open Analytics",
      applicationCategory: "DeveloperApplication, BusinessApplication",
      operatingSystem: "Web, Cloud, Linux, macOS, Windows, iOS, Android",
      softwareVersion: "3.6.0",
      url: baseUrl,
      author: {
        "@id": `${baseUrl}/#organization`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Free Starter",
          price: "0",
          priceCurrency: "USD",
          description: "1 website, 10,000 monthly events, Core Web Vitals RUM, and 30-day retention.",
        },
        {
          "@type": "Offer",
          name: "Pro Plan",
          price: "19",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "19",
            priceCurrency: "USD",
            unitCode: "MON",
          },
          description: "10 websites, 250,000 monthly events, AI Bot Radar, rage clicks, and 365-day retention.",
        },
        {
          "@type": "Offer",
          name: "Enterprise Plan",
          price: "79",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "79",
            priceCurrency: "USD",
            unitCode: "MON",
          },
          description: "Unlimited websites, 1M+ events, dedicated private cluster, custom SLAs, and VIP support.",
        },
      ],
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
    <html lang="en" className={`dark ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
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
        <PlatformProvider initialIsDashboard={isDashboard}>
          <AppShell initialIsDashboard={isDashboard}>{children}</AppShell>
        </PlatformProvider>
      </body>
    </html>
  );
}


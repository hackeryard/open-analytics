import React from "react";
import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import DeveloperGuideLayout from "@/components/public/DeveloperGuideLayout";

export const metadata: Metadata = constructPageMetadata("/developers/nextjs-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/developers/nextjs-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Next.js Web Analytics and Core Web Vitals RUM Integration",
  description:
    "Complete integration guide for adding cookieless web analytics, Core Web Vitals RUM, and error triage to Next.js App Router and Pages Router.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function NextjsAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <DeveloperGuideLayout
        frameworkName="Next.js"
        frameworkIcon={Code2}
        badge="Next.js 13 / 14 / 15 App Router & Pages Router"
        h1="Open-source web analytics and RUM for Next.js"
        subtitle="Zero-config cookieless web analytics, p75 Core Web Vitals RUM, custom conversion events, and runtime crash monitoring designed natively for Next.js applications."
        installCommand="npm install or use universal 1-line script tag"
        quickSetupCode={{
          filename: "app/layout.tsx",
          code: `import Script from "next/script";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <Script\n          src="https://api.openanalytics.org.in/open.js"\n          data-project-id="YOUR_PROJECT_ID"\n          strategy="afterInteractive"\n        />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}`,
        }}
        featuresCovered={[
          "App Router Support",
          "Pages Router Compatible",
          "Soft Navigation Tracking",
          "Core Web Vitals RUM",
          "Custom Event Payloads",
          "Zero Cookie Banners",
        ]}
        steps={[
          {
            title: "Add Tracking Script to Root Layout",
            description: "Using Next.js `next/script` with `strategy=\"afterInteractive\"` ensures the sub-3.2KB beacon loads without delaying initial server-rendered HTML.",
            filename: "app/layout.tsx",
            code: `// app/layout.tsx (App Router)\nimport Script from "next/script";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <Script\n          src="https://api.openanalytics.org.in/open.js"\n          data-project-id="prj_your_project_id"\n          strategy="afterInteractive"\n        />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}`,
          },
          {
            title: "Alternative: Pages Router Setup",
            description: "If your project uses Next.js Pages Router, embed the script inside `pages/_app.tsx` or `pages/_document.tsx`.",
            filename: "pages/_app.tsx",
            code: `// pages/_app.tsx (Pages Router)\nimport type { AppProps } from "next/app";\nimport Script from "next/script";\n\nexport default function MyApp({ Component, pageProps }: AppProps) {\n  return (\n    <>\n      <Script\n        src="https://api.openanalytics.org.in/open.js"\n        data-project-id="prj_your_project_id"\n        strategy="afterInteractive"\n      />\n      <Component {...pageProps} />\n    </>\n  );\n}`,
          },
          {
            title: "TypeScript Declarations (Optional)",
            description: "Provide type safety when invoking custom tracking events on the global `window.OpenAnalytics` namespace.",
            filename: "types/openanalytics.d.ts",
            code: `// types/openanalytics.d.ts\ninterface Window {\n  OpenAnalytics?: {\n    track: (eventName: string, properties?: Record<string, unknown>) => void;\n    captureError: (error: Error | string, context?: Record<string, unknown>) => void;\n    page: (pathname?: string) => void;\n  };\n}`,
          },
        ]}
        customEventExample={{
          title: "Tracking Next.js Conversion Events",
          description: "Dispatch custom business conversions such as signups, upgrades, checkout completions, and downloads.",
          filename: "components/CheckoutButton.tsx",
          code: `"use client";\n\nexport function CheckoutButton() {\n  const handlePurchase = async () => {\n    // Execute checkout logic...\n    \n    // Track conversion event in Open Analytics\n    if (typeof window !== "undefined" && window.OpenAnalytics) {\n      window.OpenAnalytics.track("purchase_completed", {\n        plan: "pro_annual",\n        amount: 180,\n        currency: "USD",\n      });\n    }\n  };\n\n  return (\n    <button onClick={handlePurchase}>\n      Complete Purchase\n    </button>\n  );\n}`,
        }}
        webVitalsDetail="In Next.js, Open Analytics automatically hooks into W3C PerformanceObservers to capture p75 field LCP, INP, CLS, FCP, and TTFB. Soft client-side route transitions using `next/link` are measured separately from initial document loads."
        errorTrackingDetail="Global runtime errors and unhandled promise rejections inside Client Components are automatically captured with circular user action breadcrumbs, route paths, and component stacks without requiring custom error wrappers."
        faqs={[
          {
            question: "Does Open Analytics track Next.js client-side route transitions (`next/link`)?",
            answer:
              "Yes. The tracking beacon hooks into the browser History API (`pushState`, `replaceState`, and `popstate`), automatically recording pageview transitions when users navigate with Next.js client-side links without reloading the page.",
          },
          {
            question: "Will the script affect my Next.js Core Web Vitals or PageSpeed scores?",
            answer:
              "No. By utilizing `strategy=\"afterInteractive\"`, Next.js defers the script until after hydration. Combined with the featherweight sub-3.2KB compressed size, CPU execution takes less than 2ms, preserving perfect 100 PageSpeed scores.",
          },
          {
            question: "Can I self-host Open Analytics alongside my Next.js deployment?",
            answer:
              "Yes. You can deploy Open Analytics on Docker or Node.js with your own MongoDB instance and configure `data-endpoint=\"https://your-analytics-domain.com\"` on the script tag.",
          },
        ]}
      />
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import { Terminal } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import DeveloperGuideLayout from "@/components/public/DeveloperGuideLayout";

export const metadata: Metadata = constructPageMetadata("/developers/svelte-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/developers/svelte-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Svelte & SvelteKit Web Analytics Integration Guide",
  description:
    "Complete developer guide for integrating cookieless web analytics and Core Web Vitals RUM into Svelte 5 and SvelteKit applications.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function SvelteAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <DeveloperGuideLayout
        frameworkName="Svelte & SvelteKit"
        frameworkIcon={Terminal}
        badge="Svelte 4 / 5 & SvelteKit 1 / 2"
        h1="Open-source web analytics for Svelte and SvelteKit"
        subtitle="Minimalist, privacy-friendly telemetry built for high-performance Svelte applications. Integrates directly with SvelteKit client-side routing, Runes, and automated Core Web Vitals."
        installCommand="Insert script tag in src/app.html or root layout"
        quickSetupCode={{
          filename: "src/app.html",
          code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Open Analytics Beacon -->
    <script
      defer
      src="https://api.openanalytics.org.in/open.js"
      data-project-id="YOUR_PROJECT_ID"
    ></script>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`,
        }}
        featuresCovered={[
          "SvelteKit Client-Side Routing Support",
          "Svelte 5 Runes & Signals Compatible",
          "Single-Page & Static Prerendering",
          "Automated Core Web Vitals Telemetry",
          "Zero-Cookie GDPR & CCPA Compliance",
          "Featherweight <3.2KB Performance Footprint",
        ]}
        steps={[
          {
            title: "Inject Script into app.html",
            description: "Add the lightweight telemetry tag directly to the `<head>` of `src/app.html`. The deferred execution ensures no blocking of initial hydration.",
            filename: "src/app.html",
            code: `<!-- src/app.html -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="prj_your_project_id"\n></script>`,
          },
          {
            title: "Track Client-Side Page Transitions in SvelteKit",
            description: "Use SvelteKit's `afterNavigate` lifecycle hook in your root `+layout.svelte` to ensure route transitions are captured accurately during client-side navigation.",
            filename: "src/routes/+layout.svelte",
            code: `<script lang="ts">\n  import { afterNavigate } from '$app/navigation';\n\n  afterNavigate((navigation) => {\n    if (navigation.to && typeof window !== 'undefined' && (window as any).OpenAnalytics) {\n      (window as any).OpenAnalytics.page(navigation.to.url.pathname);\n    }\n  });\n</script>\n\n<slot />`,
          },
          {
            title: "Track Custom Events in Components",
            description: "Emit conversion events from any Svelte component or interactive UI element safely.",
            filename: "src/lib/components/SubscribeModal.svelte",
            code: `<script lang="ts">\n  function handleSubscribe(tier: string) {\n    if (typeof window !== 'undefined' && (window as any).OpenAnalytics) {\n      (window as any).OpenAnalytics.track('plan_selected', {\n        tier,\n        source: 'checkout_modal'\n      });\n    }\n  }\n</script>\n\n<button on:click={() => handleSubscribe('pro')}>\n  Select Pro Plan\n</button>`,
          },
        ]}
        customEventExample={{
          title: "Tracking Conversion Actions in Svelte 5",
          description: "Using modern Svelte 5 snippets or runes to log user interactions cleanly.",
          filename: "src/lib/analytics.ts",
          code: `export function trackUserAction(event: string, properties?: Record<string, any>) {\n  if (typeof window !== 'undefined' && (window as any).OpenAnalytics) {\n    (window as any).OpenAnalytics.track(event, properties);\n  }\n}`,
        }}
        webVitalsDetail="Svelte is celebrated for its surgical DOM updates and lightweight runtime. Open Analytics preserves your application's speed advantage with an unbundled, asynchronous tracker that records INP, LCP, and CLS without touching Svelte reactivity."
        errorTrackingDetail="Monitors unhandled runtime exceptions and promise rejections across SvelteKit client routes, grouping crashes by exact route and device context."
        faqs={[
          {
            question: "Does Open Analytics support Svelte 5 Runes?",
            answer:
              "Yes. Open Analytics attaches to the global browser window and operates completely independently of Svelte internal reactivity, making it compatible with Svelte 3, 4, and 5.",
          },
          {
            question: "How does Open Analytics handle SvelteKit client navigation?",
            answer:
              "Our script automatically observes window.history state changes. For maximum precision with SvelteKit's built-in router, calling afterNavigate provides immediate transition logging.",
          },
          {
            question: "Is Open Analytics GDPR-compliant without cookie banners in Svelte apps?",
            answer:
              "Yes. The tracker does not set cookies, local storage identifiers, or fingerprint devices. You can run it across your Svelte apps without annoying cookie consent banners.",
          },
        ]}
      />
    </>
  );
}

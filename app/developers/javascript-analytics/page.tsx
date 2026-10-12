import React from "react";
import type { Metadata } from "next";
import { Terminal } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import DeveloperGuideLayout from "@/components/public/DeveloperGuideLayout";

export const metadata: Metadata = constructPageMetadata("/developers/javascript-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/developers/javascript-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Vanilla JavaScript Analytics Beacon and API Reference",
  description:
    "Complete technical guide for the sub-3.2KB Open Analytics vanilla JavaScript beacon, configuration attributes, and browser API methods.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function JavascriptAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <DeveloperGuideLayout
        frameworkName="JavaScript"
        frameworkIcon={Terminal}
        badge="Vanilla JavaScript, HTML5 & Static Sites"
        h1="Lightweight JavaScript analytics and telemetry beacon"
        subtitle="Universal sub-3.2 KB asynchronous JavaScript tracker. Zero external dependencies, cookieless daily hashing, Core Web Vitals RUM, and automated crash capture."
        installCommand='<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>'
        quickSetupCode={{
          filename: "index.html",
          code: `<!doctype html>\n<html lang="en">\n  <head>\n    <!-- Open Analytics 1-Line Universal Beacon -->\n    <script\n      defer\n      src="https://api.openanalytics.org.in/open.js"\n      data-project-id="YOUR_PROJECT_ID"\n    ></script>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>`,
        }}
        featuresCovered={[
          "Sub-3.2KB Brotli Payload",
          "Zero External Dependencies",
          "Non-Blocking Asynchronous Load",
          "Global Window API Access",
          "navigator.sendBeacon Transport",
          "Automated Error Triage",
        ]}
        steps={[
          {
            title: "Embed Script Tag",
            description: "Place the script tag in your document `<head>`. The `defer` attribute ensures non-blocking execution while preserving initial load paint performance.",
            filename: "index.html",
            code: `<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="prj_your_project_id"\n></script>`,
          },
          {
            title: "Configuration Data Attributes",
            description: "Configure custom reporting endpoints or publishable API keys directly via script data attributes.",
            filename: "index.html",
            code: `<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="prj_your_project_id"\n  data-endpoint="https://analytics.yourcompany.com"\n  data-api-key="pk_live_optional_key"\n></script>`,
          },
          {
            title: "Global Window API Methods",
            description: "Once initialized, Open Analytics exposes a clean global namespace on `window.OpenAnalytics`.",
            filename: "main.js",
            code: `// Manual Pageview (for custom router implementations)\nwindow.OpenAnalytics.page("/virtual-page-url");\n\n// Custom Event Dispatch\nwindow.OpenAnalytics.track("signup_modal_opened", { source: "header" });\n\n// Manual Error Reporting\nwindow.OpenAnalytics.captureError(new Error("Network timeout"), { retries: 3 });`,
          },
        ]}
        customEventExample={{
          title: "Attaching Custom Event Listeners",
          description: "Track button clicks or form submissions using standard vanilla JavaScript event listeners.",
          filename: "analytics.js",
          code: `document.getElementById("cta-button")?.addEventListener("click", () => {\n  if (window.OpenAnalytics) {\n    window.OpenAnalytics.track("demo_requested", {\n      plan: "enterprise",\n      page_scroll_depth: Math.round((window.scrollY / document.body.scrollHeight) * 100),\n    });\n  }\n});`,
        }}
        webVitalsDetail="The vanilla beacon listens to W3C PerformanceObserver entries for LCP, INP, CLS, FCP, and TTFB passively in the background, flushing metrics when the visitor hides the tab or completes a session."
        errorTrackingDetail="Attaches global listeners to `window.onerror` and `window.onunhandledrejection`, automatically packaging stack traces, script origins, and action breadcrumbs for edge ingestion."
        faqs={[
          {
            question: "What is the exact payload size of open.js?",
            answer:
              "`open.js` is under 12 KB unminified and under 3.2 KB when served with standard Brotli compression. It has zero external dependencies or third-party vendor wrappers.",
          },
          {
            question: "Does the tracker use navigator.sendBeacon?",
            answer:
              "Yes. Open Analytics uses `navigator.sendBeacon` for all event and pageview dispatches whenever available, ensuring telemetry is delivered reliably even if the visitor closes the browser tab.",
          },
          {
            question: "Can I host open.js on my own CDN or server?",
            answer:
              "Yes. You can copy `public/open.js` directly to your own assets directory or reverse-proxy, ensuring 100% first-party script delivery with zero third-party domain lookups.",
          },
        ]}
      />
    </>
  );
}

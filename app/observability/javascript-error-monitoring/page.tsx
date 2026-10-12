import React from "react";
import type { Metadata } from "next";
import {
  Bug,
  AlertCircle,
  Terminal,
  Activity,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Bell,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/observability/javascript-error-monitoring");

const breadcrumbSchema = generateBreadcrumbSchema("/observability/javascript-error-monitoring");

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics JavaScript Error Monitoring",
  description:
    "Unified frontend crash monitoring and exception triage. Captures uncaught runtime errors, unhandled rejections, and user action breadcrumbs.",
  category: "SoftwareApplication",
  brand: {
    "@type": "Brand",
    name: "Open Analytics",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function JavascriptErrorMonitoringPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={productSchema} />

      <FeatureHubLayout
        badge="Frontend Observability"
        badgeIcon={Bug}
        h1="Frontend error monitoring and intelligent crash triage"
        subtitle="Analytics and frontend observability together in one platform. Automatically capture uncaught JavaScript exceptions, promise rejections, stack traces, and action breadcrumbs."
        problemTitle="Why separate error monitoring tools fragment workflows"
        problemDescription="Running independent crash monitoring services like Sentry alongside separate analytics creates disjointed stacks, multiple heavy client SDKs, and billing overhead for duplicate visitor data."
        problemPoints={[
          "Traditional error monitors inject 30KB-80KB SDKs that slow down initial page rendering",
          "Engineers can't see whether a crash affected an important marketing route or high-value conversion funnel",
          "Noise from third-party extensions and benign script errors clutters triage queues",
          "High per-error volume pricing makes comprehensive production error tracking expensive",
        ]}
        solutionTitle="Unified analytics + error observability"
        solutionDescription="Open Analytics captures runtime errors directly through our single 3.2KB beacon, correlating crashes directly with user paths and visitor analytics."
        solutionPillars={[
          {
            title: "Automated Error Clustering",
            description: "Groups repeated crashes by error signature and stack trace, tracking occurrence frequency and velocity spikes.",
            icon: Layers,
          },
          {
            title: "Circular User Breadcrumbs",
            description: "Automatically captures the last 10 user interactions (clicks, route transitions, console logs) prior to the crash.",
            icon: Activity,
          },
          {
            title: "AI-Powered Bug Triage",
            description: "Generates formatted diagnostic prompts for AI assistants (Claude, Gemini, ChatGPT) with stack traces and recommended fixes.",
            icon: Sparkles,
          },
        ]}
        technicalArchitectureTitle="Browser error interception architecture"
        technicalArchitectureDescription="Passive global listeners capture runtime exceptions without altering application execution flow."
        technicalSteps={[
          {
            step: "01. Global Handlers",
            title: "Window Error & Rejection Hooks",
            detail: "Hooks into `window.onerror` and `window.onunhandledrejection`, extracting error message, filename, line number, column, and stack trace.",
          },
          {
            step: "02. Breadcrumb Attachment",
            title: "Contextual Action Timeline",
            detail: "Attaches recent user action breadcrumbs, browser version, operating system, URL path, and device memory context.",
          },
          {
            step: "03. Ingestion & Fingerprinting",
            title: "Edge Deduplication Engine",
            detail: "The telemetry edge fingerprints the crash signature and increments milestone counters (5x, 10x, 25x, 50x+) with automated alerting.",
          },
        ]}
        useCases={[
          {
            title: "Zero-Setup Crash Detection",
            description: "Deploy without modifying your React, Vue, or Next.js components; global listeners start capturing immediately.",
            icon: Terminal,
          },
          {
            title: "High-Traffic Error Storm Alerting",
            description: "Receive instant desktop alerts and notifications when error velocity exceeds 10 errors within a 5-minute window.",
            icon: Bell,
          },
          {
            title: "Edge Noise Suppression",
            description: "Filter out noisy browser extension errors, ad-blocker interference, and known benign warnings at the API gateway.",
            icon: Shield,
          },
        ]}
        metrics={[
          {
            name: "Crash-Free Rate",
            unit: "Percentage",
            benchmark: "> 99.8% Healthy",
            description: "Proportion of visitor sessions that completed without experiencing an unhandled JavaScript runtime error.",
          },
          {
            name: "Error Occurrence Count",
            unit: "Total",
            benchmark: "Aggregated",
            description: "Cumulative count of times an identical error fingerprint has been encountered across all users.",
          },
          {
            name: "Affected Route",
            unit: "URL Path",
            benchmark: "Correlated",
            description: "Direct correlation linking runtime crashes to specific page templates and user journeys.",
          },
          {
            name: "Error Velocity",
            unit: "Errors / Min",
            benchmark: "< 2/min Normal",
            description: "Real-time rate of incoming errors to detect active production regressions immediately after deploy.",
          },
        ]}
        privacyNotes={[
          "User credentials, passwords, and authorization tokens are automatically redacted from payloads",
          "URL query parameters are stripped of common sensitive tokens (e.g. token, key, secret, code)",
          "Error stack traces contain only public JavaScript execution traces and line numbers",
          "365-day automated TTL retention cleanses legacy logs automatically",
        ]}
        codeSnippet={{
          filename: "Universal Tracker (Includes Error Triage)",
          code: `<!-- Universal script tag captures JS errors automatically -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="YOUR_PROJECT_ID"\n></script>`,
        }}
        faqs={[
          {
            question: "Do I need to install an extra SDK to enable error monitoring?",
            answer:
              "No. Error monitoring is natively integrated into the standard Open Analytics tracking script (`open.js`). There is zero extra library overhead or separate configuration needed.",
          },
          {
            question: "Can I manually capture caught exceptions?",
            answer:
              "Yes. You can invoke `window.OpenAnalytics.captureError(error, context)` anywhere in your application code or React Error Boundaries to report caught exceptions with custom context.",
          },
          {
            question: "How does Open Analytics protect against error payload flooding?",
            answer:
              "The client script incorporates intelligent debounce rate limiting and deduplication. Identical errors repeating rapidly in a single session are throttled before transmission to protect client network bandwidth.",
          },
        ]}
      />
    </>
  );
}

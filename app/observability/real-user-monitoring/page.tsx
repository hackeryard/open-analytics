import React from "react";
import type { Metadata } from "next";
import {
  Gauge,
  Zap,
  Cpu,
  Smartphone,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  Radio,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/observability/real-user-monitoring");

const breadcrumbSchema = generateBreadcrumbSchema("/observability/real-user-monitoring");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics Real User Monitoring (RUM)",
  description:
    "Production Real User Monitoring tracking Google Core Web Vitals (LCP, INP, CLS), hardware diagnostics, and network latency at the 75th percentile.",
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

export default function RealUserMonitoringPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <FeatureHubLayout
        badge="Real User Monitoring (RUM)"
        badgeIcon={Gauge}
        h1="Real User Monitoring (RUM) for production web performance"
        subtitle="Measure how real users experience your production website. Continuous field telemetry capturing p75 Core Web Vitals, device capabilities, and network conditions."
        problemTitle="Synthetic lab tests don't reflect production reality"
        problemDescription="Lighthouse and synthetic bot tests run on pristine server connections and high-end hardware, completely missing real-world slowdowns experienced by actual users."
        problemPoints={[
          "Lab tests fail to capture real interaction responsiveness (INP) across diverse devices",
          "Regional network throttles and 4G/3G cell towers degrade loading (LCP) unpredictably",
          "Dynamic web applications and user ads trigger layout instability (CLS) after initial paint",
          "Engineering teams lack route-by-route visibility into which pages are failing Google ranking thresholds",
        ]}
        solutionTitle="Continuous real user field telemetry"
        solutionDescription="Open Analytics embeds directly in real visitor browsers, measuring native W3C Performance Timeline events with zero main-thread overhead."
        solutionPillars={[
          {
            title: "75th Percentile (p75) Calibration",
            description: "Calibrated directly to Google search ranking criteria: evaluates performance based on the experience of 75% of your real visitors.",
            icon: TrendingUp,
          },
          {
            title: "Hardware & GPU Diagnostics",
            description: "Detects device memory (RAM), CPU concurrency cores, device pixel ratio, and WebGL graphics GPU vendor.",
            icon: Cpu,
          },
          {
            title: "Network & Connection Profiling",
            description: "Correlates Web Vitals with effective network type (5G, 4G, 3G, WiFi), round-trip time (RTT), and downlink speed.",
            icon: Radio,
          },
        ]}
        technicalArchitectureTitle="How browser-native RUM operates"
        technicalArchitectureDescription="Zero-overhead PerformanceObserver listeners capture Web Vitals metrics at the precise moment they occur."
        technicalSteps={[
          {
            step: "01. Observer Hooks",
            title: "W3C PerformanceObserver API",
            detail: "The script hooks into native browser observers for `largest-contentful-paint`, `layout-shift`, `event` (for INP), and `navigation` timing.",
          },
          {
            step: "02. Event Buffering",
            title: "Passive In-Memory Collation",
            detail: "Metrics are buffered without locking main-thread execution. INP calculates the worst interaction latency across all user clicks and key presses.",
          },
          {
            step: "03. Visibility Beacon",
            title: "Reliable Non-Blocking Delivery",
            detail: "When the visitor navigates away or hides the tab, telemetry dispatches atomically via `navigator.sendBeacon` or deferred fetch.",
          },
        ]}
        useCases={[
          {
            title: "SEO Core Web Vitals Protection",
            description: "Audit and verify that your pages pass Google's Page Experience ranking signals before algorithm updates hit your organic traffic.",
            icon: Zap,
          },
          {
            title: "Single Page App Route Profiling",
            description: "Compare soft navigation transitions against hard document reloads to optimize client-side data fetching and bundle splitting.",
            icon: Layers,
          },
          {
            title: "Mobile vs Desktop Diagnostics",
            description: "Isolate whether performance bottlenecks stem from mobile device CPU limitations or high-latency cellular connections.",
            icon: Smartphone,
          },
        ]}
        metrics={[
          {
            name: "LCP (Largest Contentful Paint)",
            unit: "Seconds",
            benchmark: "< 2.5s Good",
            description: "Time taken to render the largest visible image, video poster, or text block on the viewport.",
          },
          {
            name: "INP (Interaction to Next Paint)",
            unit: "Milliseconds",
            benchmark: "< 200ms Good",
            description: "Measures overall responsiveness by tracking the latency of all user clicks, taps, and key presses.",
          },
          {
            name: "CLS (Cumulative Layout Shift)",
            unit: "Unitless Score",
            benchmark: "< 0.1 Good",
            description: "Quantifies unexpected layout movements caused by unsized images, dynamic ads, or late font swaps.",
          },
          {
            name: "TTFB (Time to First Byte)",
            unit: "Milliseconds",
            benchmark: "< 800ms Good",
            description: "Time between the browser's initial HTTP request and the arrival of the first byte of server response.",
          },
        ]}
        privacyNotes={[
          "Performance timings contain purely technical device metrics with zero personal data",
          "No user keystrokes, form inputs, or screen coordinates are recorded",
          "Hardware information is strictly limited to standard browser navigator APIs",
          "Fully compliant with GDPR and enterprise security standards",
        ]}
        codeSnippet={{
          filename: "Automatic RUM Activation",
          code: `<!-- Included automatically with standard script tag -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="YOUR_PROJECT_ID"\n></script>`,
        }}
        faqs={[
          {
            question: "Does the RUM script impact my website's PageSpeed or Lighthouse score?",
            answer:
              "No. Open Analytics is under 3.2 KB Brotli compressed and executes asynchronously. It uses passive native browser observers that consume less than 2ms of total CPU time, with zero impact on your site's PageSpeed.",
          },
          {
            question: "How does Open Analytics calculate the 75th percentile (p75)?",
            answer:
              "We collect real production loads across all your visitors and rank the metric values. The 75th percentile represents the threshold that 75% of your visitors experienced better performance than, which matches Google's official CrUX evaluation methodology.",
          },
          {
            question: "Can I filter Core Web Vitals by device type or country?",
            answer:
              "Yes. In the Open Analytics dashboard, you can filter Core Web Vitals distributions by Mobile, Tablet, Desktop, specific browser, operating system, and geographic country.",
          },
        ]}
      />
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import {
  Zap,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/observability/web-vitals");

const breadcrumbSchema = generateBreadcrumbSchema("/observability/web-vitals");

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics Core Web Vitals Monitoring",
  description:
    "Automated field telemetry tracking Google Core Web Vitals (LCP, INP, CLS) across all production routes and visitor devices.",
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

export default function WebVitalsFeaturePage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={productSchema} />

      <FeatureHubLayout
        badge="Core Web Vitals Tracker"
        badgeIcon={Zap}
        h1="Continuous Core Web Vitals monitoring and optimization"
        subtitle="Monitor how real users experience your production website. Protect Google search rankings with automated field telemetry for LCP, INP, and CLS."
        problemTitle="Why Google Search penalizes poor Web Vitals"
        problemDescription="Google uses real-world Chrome User Experience Report (CrUX) metrics to rank search results. When your p75 field metrics degrade, rankings and organic traffic drop immediately."
        problemPoints={[
          "Google CrUX reports take 28 days to update, leaving you blind to recent regressions",
          "Interaction to Next Paint (INP) replaced FID, penalizing unoptimized JavaScript event handlers",
          "Single slow third-party scripts or uncompressed hero images trigger site-wide ranking drops",
          "Development teams cannot identify which exact production routes are failing thresholds",
        ]}
        solutionTitle="Real-time Web Vitals field telemetry"
        solutionDescription="Open Analytics provides instant route-level visibility into your Core Web Vitals without waiting 28 days for Google's delayed public CrUX report."
        solutionPillars={[
          {
            title: "Immediate 24-Hour Feedback",
            description: "Detect whether recent deployments improved or damaged LCP, INP, or CLS within hours instead of waiting a month.",
            icon: Clock,
          },
          {
            title: "Route-by-Route Breakdown",
            description: "Pinpoint exactly which URL paths, blog posts, or product templates have failing Web Vitals scores.",
            icon: Layers,
          },
          {
            title: "Good / Needs Improvement / Poor Splits",
            description: "Visualize the distribution of your visitors falling into Google's green, amber, and red performance tiers.",
            icon: TrendingUp,
          },
        ]}
        technicalArchitectureTitle="Web Vitals calculation methodology"
        technicalArchitectureDescription="Accurate calculation adhering to official W3C and Google Web Vitals specifications."
        technicalSteps={[
          {
            step: "01. Largest Contentful Paint",
            title: "Render Timing Detection",
            detail: "Measures when the largest image, SVG, or text block finishes rendering in the initial viewport before user input.",
          },
          {
            step: "02. Interaction to Next Paint",
            title: "Full Session Event Duration",
            detail: "Measures input delay, processing time, and presentation delay across all clicks and key presses throughout the entire user session.",
          },
          {
            step: "03. Cumulative Layout Shift",
            title: "Session Window Shifts",
            detail: "Calculates the maximum layout shift session window with a 1-second gap and 5-second maximum window duration.",
          },
        ]}
        useCases={[
          {
            title: "Post-Deployment Verification",
            description: "Validate new releases and verify that bundle size changes or new components did not regress INP or LCP.",
            icon: CheckCircle2,
          },
          {
            title: "Core Web Vitals SEO Audits",
            description: "Prepare for Google algorithm updates by systematically identifying and fixing poor-performing landing pages.",
            icon: Search,
          },
          {
            title: "Third-Party Script Impact Analysis",
            description: "Identify how third-party chat widgets, tag managers, and ad networks impact your production layout stability.",
            icon: Activity,
          },
        ]}
        metrics={[
          {
            name: "LCP (Loading Speed)",
            unit: "Seconds",
            benchmark: "<= 2.5s",
            description: "Measures visual loading speed. Passing requires 75% of page loads to render under 2.5 seconds.",
          },
          {
            name: "INP (Page Responsiveness)",
            unit: "Milliseconds",
            benchmark: "<= 200ms",
            description: "Measures interactive responsiveness. Passing requires 75% of user interactions to complete under 200ms.",
          },
          {
            name: "CLS (Visual Stability)",
            unit: "Score",
            benchmark: "<= 0.1",
            description: "Measures visual layout stability. Passing requires 75% of pageviews to have a shift score under 0.1.",
          },
          {
            name: "FCP (First Paint)",
            unit: "Seconds",
            benchmark: "<= 1.8s",
            description: "Measures the time when the browser first renders any DOM content (text, image, non-white canvas).",
          },
        ]}
        privacyNotes={[
          "Zero personal data is collected or associated with Web Vitals measurements",
          "Calculations use native browser APIs without inspecting user screen content",
          "Anonymous aggregated metrics can be shared across engineering and SEO teams safely",
          "Strict 365-day automated TTL data retention",
        ]}
        codeSnippet={{
          filename: "Zero-Config Telemetry",
          code: `<!-- Automated Core Web Vitals collection -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="YOUR_PROJECT_ID"\n></script>`,
        }}
        faqs={[
          {
            question: "Why did Google replace FID with INP?",
            answer:
              "First Input Delay (FID) only measured the delay of the very first click on a page. INP measures the latency of all interactions throughout the visitor's entire stay, making it a much more comprehensive and demanding measure of real responsiveness.",
          },
          {
            question: "How quickly do Web Vitals appear in the Open Analytics dashboard?",
            answer:
              "Metrics stream to the dashboard in real-time as visitors navigate. You can see field measurements update within seconds of users browsing your site.",
          },
          {
            question: "What is the difference between lab data and field data?",
            answer:
              "Lab data comes from simulated tests (like Lighthouse running on a single developer laptop). Field data comes from real production visitors on real devices, operating over actual cellular and broadband networks.",
          },
        ]}
      />
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import {
  MousePointerClick,
  Flame,
  Activity,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  Eye,
  Sliders,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/behavior/rage-click-detection");

const breadcrumbSchema = generateBreadcrumbSchema("/behavior/rage-click-detection");

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics Rage Click Detection",
  description:
    "Algorithmic rage click detection and behavioral UX analytics. Identifies broken UI elements, dead clicks, and user frustration without invasive session recordings.",
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

export default function RageClickDetectionPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={productSchema} />

      <FeatureHubLayout
        badge="Behavioral UX Engine"
        badgeIcon={MousePointerClick}
        h1="Algorithmic rage click detection and behavioral UX analytics"
        subtitle="Uncover user frustration, dead buttons, and broken interface components. Algorithmic rage click telemetry with zero privacy-invasive session video recordings."
        problemTitle="Why UI friction remains invisible to traditional analytics"
        problemDescription="Traditional pageview counters only see completed transitions. They have no visibility when a user repeatedly bashes a broken button, encounters a frozen modal, or abandons a form in frustration."
        problemPoints={[
          "Session recording tools (Hotjar, FullStory) introduce massive multi-megabyte payloads that stall pages",
          "Video replay tools record sensitive user keystrokes, posing major GDPR and enterprise security risks",
          "Watching hundreds of hours of session recordings to find 2 broken buttons is wildly inefficient",
          "Engineers need precise component selectors and route paths, not fuzzy video timelines",
        ]}
        solutionTitle="Algorithmic, privacy-preserving behavioral signals"
        solutionDescription="Open Analytics calculates UX friction mathematically in the browser, extracting clean interaction telemetry without recording video or sensitive inputs."
        solutionPillars={[
          {
            title: "Precision Rage Click Formula",
            description: "Triggers when >=3 clicks occur within 500ms within a 40px radius, capturing the CSS selector and parent container.",
            icon: Flame,
          },
          {
            title: "Active vs Idle Dwell Time",
            description: "Differentiates genuine user engagement from tabs left open in the background or minimized windows.",
            icon: Clock,
          },
          {
            title: "Scroll Depth Milestones",
            description: "Records vertical reading engagement thresholds at 25%, 50%, 75%, and 100% of document height.",
            icon: Eye,
          },
        ]}
        technicalArchitectureTitle="Technical rage click detection mechanics"
        technicalArchitectureDescription="The tracker uses passive DOM event listeners with spatial distance calculation and a sliding time window."
        technicalSteps={[
          {
            step: "01. Spatial Vectoring",
            title: "Euclidean Coordinate Tracking",
            detail: "On every click event, the client script computes the Euclidean distance between coordinates (dx² + dy² <= 40px²).",
          },
          {
            step: "02. Sliding Window",
            title: "500ms Timestamp Evaluation",
            detail: "A rolling FIFO ring buffer tracks click timestamps. If 3 or more clicks register within 500ms, a rage-click event is triggered.",
          },
          {
            step: "03. Target Inspection",
            title: "Component CSS Fingerprint",
            detail: "The script inspects `target.tagName`, `target.id`, `target.className`, and text snippets to report the exact component causing frustration.",
          },
        ]}
        useCases={[
          {
            title: "Broken Submit & Checkout Buttons",
            description: "Detect when payment or form submit buttons fail silently without rendering visible validation feedback.",
            icon: TrendingDown,
          },
          {
            title: "Unresponsive Mobile Navigation",
            description: "Identify hamburger menus and mobile dropdown toggles that fail to expand on touch devices.",
            icon: Sliders,
          },
          {
            title: "Misleading Visual Affordances",
            description: "Identify static text blocks, badges, or icons that users mistakenly believe are clickable links.",
            icon: MousePointerClick,
          },
        ]}
        metrics={[
          {
            name: "Rage Click Threshold",
            unit: "Condition",
            benchmark: ">=3 clicks / 500ms / 40px",
            description: "Standard algorithmic definition of user agitation and repeated rapid tapping.",
          },
          {
            name: "Affected Element",
            unit: "CSS Selector",
            benchmark: "DOM Path",
            description: "Exact HTML tag, class list, and container element where the frustration occurred.",
          },
          {
            name: "Active Dwell Time",
            unit: "Seconds",
            benchmark: "> 45s Engaged",
            description: "True user attention time with mouse movement, scroll, or focus active.",
          },
          {
            name: "Scroll Depth",
            unit: "Percentage",
            benchmark: "25% / 50% / 75% / 100%",
            description: "Max vertical reading depth achieved before leaving the route.",
          },
        ]}
        privacyNotes={[
          "Zero video recordings, DOM mutation trees, or canvas captures",
          "No text typed into inputs or form fields is ever inspected or sent",
          "Spatial coordinates are processed strictly in client RAM to compute distance and then discarded",
          "Fully compliant with GDPR, CCPA, and enterprise confidentiality agreements",
        ]}
        codeSnippet={{
          filename: "Zero-Config Behavioral Tracking",
          code: `<!-- Rage clicks and dwell times track automatically -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="YOUR_PROJECT_ID"\n></script>`,
        }}
        faqs={[
          {
            question: "How does this differ from session replay tools like Hotjar or LogRocket?",
            answer:
              "Session replay tools record the entire DOM and stream massive video-like mutation logs, which slows down websites and creates severe privacy liabilities. Open Analytics extracts just the mathematical signal (which element caused rage clicks, on what route, for how many users) with zero video overhead.",
          },
          {
            question: "Does rage click detection work on mobile and touch devices?",
            answer:
              "Yes. The tracker hooks into both pointer and touch events, tracking rapid taps on smartphones and tablets using the same spatial proximity algorithm.",
          },
          {
            question: "Can I receive alerts when rage clicks spike on a specific page?",
            answer:
              "Yes. Open Analytics includes automated alert triggers that notify you via email or desktop notifications when 3 or more rage click incidents occur on a single route.",
          },
        ]}
      />
    </>
  );
}

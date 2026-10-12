import React from "react";
import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import DeveloperGuideLayout from "@/components/public/DeveloperGuideLayout";

export const metadata: Metadata = constructPageMetadata("/developers/astro-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/developers/astro-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Astro Web Analytics and View Transitions Integration Guide",
  description:
    "Complete guide for integrating cookieless web analytics and Core Web Vitals RUM into Astro static sites and server-rendered applications.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function AstroAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <DeveloperGuideLayout
        frameworkName="Astro"
        frameworkIcon={Code2}
        badge="Astro 3 / 4 / 5, Islands & View Transitions"
        h1="Open-source web analytics and RUM for Astro"
        subtitle="High-performance, cookieless analytics tailored for Astro's content-driven architecture. Full compatibility with Astro View Transitions, zero JS bloat, and automated Core Web Vitals."
        installCommand="Add deferred script to src/layouts/Layout.astro"
        quickSetupCode={{
          filename: "src/layouts/Layout.astro",
          code: `---
interface Props { title: string; }
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <!-- Open Analytics Tracker -->
    <script
      is:inline
      defer
      src="https://api.openanalytics.org.in/open.js"
      data-project-id="YOUR_PROJECT_ID"
    ></script>
  </head>
  <body>
    <slot />
  </body>
</html>`,
        }}
        featuresCovered={[
          "Astro View Transitions Support",
          "Zero JavaScript Runtime Bloat",
          "Astro is:inline Directives",
          "Content Collections Tracking",
          "Cookieless Privacy Compliance",
          "Perfect 100 Lighthouse Scores",
        ]}
        steps={[
          {
            title: "Add Script to Base Layout Component",
            description: "Use the `is:inline` directive in your primary `Layout.astro` file to prevent Astro from bundling or renaming the external analytics script.",
            filename: "src/layouts/Layout.astro",
            code: `<!-- src/layouts/Layout.astro -->\n<script\n  is:inline\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="prj_your_project_id"\n></script>`,
          },
          {
            title: "Supporting Astro View Transitions",
            description: "If your Astro application uses `<ViewTransitions />`, listen to `astro:page-load` to ensure smooth client-side transition reporting.",
            filename: "src/components/AnalyticsWatcher.astro",
            code: `<!-- src/components/AnalyticsWatcher.astro -->\n<script>\n  document.addEventListener("astro:page-load", () => {\n    if (window.OpenAnalytics) {\n      window.OpenAnalytics.page(window.location.pathname);\n    }\n  });\n</script>`,
          },
          {
            title: "Client Island Custom Events",
            description: "Dispatch custom business conversions from within interactive React, Vue, or Svelte client islands.",
            filename: "src/components/Newsletter.tsx",
            code: `export default function Newsletter() {\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (window.OpenAnalytics) {\n      window.OpenAnalytics.track("newsletter_submitted", {\n        form_location: "blog_sidebar",\n      });\n    }\n  };\n  return <form onSubmit={handleSubmit}><button type="submit">Subscribe</button></form>;\n}`,
          },
        ]}
        customEventExample={{
          title: "Tracking Astro Content Reading & Downloads",
          description: "Capture documentation reading completions and code copy events.",
          filename: "src/scripts/contentTracker.ts",
          code: `document.querySelectorAll("[data-copy-button]").forEach((btn) => {\n  btn.addEventListener("click", () => {\n    if (window.OpenAnalytics) {\n      window.OpenAnalytics.track("code_snippet_copied", {\n        code_language: btn.getAttribute("data-lang") || "bash",\n        page: window.location.pathname,\n      });\n    }\n  });\n});`,
        }}
        webVitalsDetail="Astro websites emphasize pristine performance. Open Analytics complements Astro by executing in under 2ms with less than 3.2KB payload, helping you maintain perfect 100 Google PageSpeed scores."
        errorTrackingDetail="Captures runtime errors arising inside interactive client islands or global layout scripts, linking crashes to specific rendered markdown posts or dynamic routes."
        faqs={[
          {
            question: "Why should I use `is:inline` in Astro?",
            answer:
              "Astro automatically processes and bundles scripts by default. Adding `is:inline` tells Astro to leave the script tag untouched in the HTML output, ensuring our deferred CDN delivery works exactly as intended.",
          },
          {
            question: "Does Open Analytics work with Astro View Transitions?",
            answer:
              "Yes. Open Analytics supports browser history navigation out of the box and seamlessly records route transitions when Astro View Transitions swaps pages client-side.",
          },
          {
            question: "Does the tracker add client-side JavaScript to zero-JS Astro pages?",
            answer:
              "The script is a featherweight (<3.2KB) standalone beacon. It does not load large client frameworks or hydration libraries, keeping your zero-JS static site ultra-fast.",
          },
        ]}
      />
    </>
  );
}

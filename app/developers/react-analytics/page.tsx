import React from "react";
import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import DeveloperGuideLayout from "@/components/public/DeveloperGuideLayout";

export const metadata: Metadata = constructPageMetadata("/developers/react-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/developers/react-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "React Web Analytics and Core Web Vitals RUM Integration Guide",
  description:
    "Complete integration guide for adding cookieless web analytics, SPA route tracking, Core Web Vitals, and crash triage to React and Vite applications.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function ReactAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <DeveloperGuideLayout
        frameworkName="React"
        frameworkIcon={Code2}
        badge="React 18 / 19, Vite, CRA & React Router"
        h1="Open-source web analytics and RUM for React"
        subtitle="Lightweight, cookieless analytics SDK for React Single Page Applications. Automatic React Router transition capture, Core Web Vitals, and runtime error triage."
        installCommand="Add 1-line script tag to index.html or load dynamically in useEffect"
        quickSetupCode={{
          filename: "index.html (Vite or CRA)",
          code: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My React App</title>\n    <!-- Open Analytics Tracker -->\n    <script\n      defer\n      src="https://api.openanalytics.org.in/open.js"\n      data-project-id="YOUR_PROJECT_ID"\n    ></script>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>`,
        }}
        featuresCovered={[
          "React Router v6 / v7 Compatible",
          "Vite & CRA Support",
          "Dynamic useEffect Loading",
          "Error Boundary Hooks",
          "Zero Third-Party Cookies",
          "Sub-3.2KB Brotli Weight",
        ]}
        steps={[
          {
            title: "Option A: Embed directly in index.html (Recommended)",
            description: "Placing the deferred script in `index.html` requires zero JavaScript build tooling changes and guarantees capture of initial page paint and errors.",
            filename: "index.html",
            code: `<!-- index.html (before </head>) -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="prj_your_project_id"\n></script>`,
          },
          {
            title: "Option B: Dynamic Initialization via React Hook",
            description: "For microfrontends or applications requiring runtime project ID injection, initialize via a custom React hook.",
            filename: "src/hooks/useOpenAnalytics.ts",
            code: `// src/hooks/useOpenAnalytics.ts\nimport { useEffect } from "react";\n\nexport function useOpenAnalytics(projectId: string) {\n  useEffect(() => {\n    if (document.querySelector("script[data-open-analytics]")) return;\n    const s = document.createElement("script");\n    s.src = "https://api.openanalytics.org.in/open.js";\n    s.setAttribute("data-project-id", projectId);\n    s.setAttribute("data-open-analytics", "true");\n    s.defer = true;\n    document.head.appendChild(s);\n  }, [projectId]);\n}`,
          },
          {
            title: "React Error Boundary Hook",
            description: "Forward caught exceptions inside React Error Boundaries to the Open Analytics error triage console.",
            filename: "src/components/ErrorBoundary.tsx",
            code: `// src/components/ErrorBoundary.tsx\nimport React from "react";\n\ninterface State { hasError: boolean; }\n\nexport class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {\n  state = { hasError: false };\n\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {\n    if (window.OpenAnalytics) {\n      window.OpenAnalytics.captureError(error, {\n        componentStack: errorInfo.componentStack,\n      });\n    }\n  }\n\n  render() {\n    if (this.state.hasError) return <div>An unexpected error occurred.</div>;\n    return this.props.children;\n  }\n}`,
          },
        ]}
        customEventExample={{
          title: "Custom Event Hook in React",
          description: "Encapsulate conversion events in a clean reusable hook.",
          filename: "src/hooks/useTrackEvent.ts",
          code: `import { useCallback } from "react";\n\nexport function useTrackEvent() {\n  return useCallback((eventName: string, props?: Record<string, unknown>) => {\n    if (typeof window !== "undefined" && window.OpenAnalytics) {\n      window.OpenAnalytics.track(eventName, props);\n    }\n  }, []);\n}\n\n// Usage inside a React component:\n// const track = useTrackEvent();\n// track("newsletter_subscribed", { source: "footer_modal" });`,
        }}
        webVitalsDetail="In React Single Page Apps, Core Web Vitals automatically collect initial load paints (LCP, FCP, TTFB) as well as continuous interaction responsiveness (INP) across user state updates without manual timer instrumentation."
        errorTrackingDetail="Captures unhandled errors and async promise rejections globally, with support for forwarding caught React render exceptions and component stacks from Error Boundaries directly to error logs."
        faqs={[
          {
            question: "Does Open Analytics work with React Router (v6 and v7)?",
            answer:
              "Yes. Open Analytics observes browser History API updates (`pushState`, `replaceState`, `popstate`), automatically logging pageviews when React Router transitions routes without requiring router listener middleware.",
          },
          {
            question: "Is there an npm package or can I use the CDN script?",
            answer:
              "Both options are supported. The deferred CDN script tag is the lightest and simplest method. You can also import the OpenAnalyticsTracker React component or bundle the script locally in your Vite build.",
          },
          {
            question: "Does the tracker cause React re-renders?",
            answer:
              "No. Open Analytics operates outside of React state and the Virtual DOM, consuming zero React render cycles and preserving maximum 60fps UI performance.",
          },
        ]}
      />
    </>
  );
}

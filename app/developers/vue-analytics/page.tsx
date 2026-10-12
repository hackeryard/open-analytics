import React from "react";
import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import DeveloperGuideLayout from "@/components/public/DeveloperGuideLayout";

export const metadata: Metadata = constructPageMetadata("/developers/vue-analytics");

const breadcrumbSchema = generateBreadcrumbSchema("/developers/vue-analytics");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Vue.js & Nuxt 3 Web Analytics and RUM Integration Guide",
  description:
    "Integration guide for adding cookieless web analytics, Vue Router navigation tracking, and Core Web Vitals to Vue 3 and Nuxt applications.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function VueAnalyticsPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <DeveloperGuideLayout
        frameworkName="Vue.js & Nuxt"
        frameworkIcon={Code2}
        badge="Vue 3, Nuxt 3 & Vue Router"
        h1="Open-source web analytics for Vue.js and Nuxt"
        subtitle="Cookieless web analytics and Core Web Vitals RUM for Vue 3 and Nuxt applications. Zero-overhead SPA routing integration, custom event tracking, and runtime crash triage."
        installCommand="Inject script in nuxt.config.ts or index.html"
        quickSetupCode={{
          filename: "nuxt.config.ts (Nuxt 3)",
          code: `export default defineNuxtConfig({\n  app: {\n    head: {\n      script: [\n        {\n          src: "https://api.openanalytics.org.in/open.js",\n          "data-project-id": "YOUR_PROJECT_ID",\n          defer: true,\n        },\n      ],\n    },\n  },\n});`,
        }}
        featuresCovered={[
          "Nuxt 3 App Head Integration",
          "Vue Router Automatic Pageviews",
          "Vue Error Handler Interception",
          "Composition API Composable",
          "Sub-3.2KB Brotli Payload",
          "No Cookie Banner Requirement",
        ]}
        steps={[
          {
            title: "Nuxt 3 Setup via nuxt.config.ts",
            description: "Add the script directly to your Nuxt 3 `app.head.script` configuration array with the `defer` flag enabled.",
            filename: "nuxt.config.ts",
            code: `// nuxt.config.ts\nexport default defineNuxtConfig({\n  app: {\n    head: {\n      script: [\n        {\n          src: "https://api.openanalytics.org.in/open.js",\n          "data-project-id": "prj_your_project_id",\n          defer: true,\n        },\n      ],\n    },\n  },\n});`,
          },
          {
            title: "Vue 3 Vite SPA Setup",
            description: "For standalone Vue 3 applications built with Vite, place the script tag in the root `index.html` file.",
            filename: "index.html",
            code: `<!-- index.html (before </head>) -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="prj_your_project_id"\n></script>`,
          },
          {
            title: "Vue Global Error Handler Integration",
            description: "Connect Vue's global error handler to Open Analytics to capture component lifecycle crashes.",
            filename: "src/main.ts",
            code: `// src/main.ts\nimport { createApp } from "vue";\nimport App from "./App.vue";\n\nconst app = createApp(App);\n\napp.config.errorHandler = (err, instance, info) => {\n  console.error("Vue Error:", err, info);\n  if (window.OpenAnalytics) {\n    window.OpenAnalytics.captureError(err as Error, { vueInfo: info });\n  }\n};\n\napp.mount("#app");`,
          },
        ]}
        customEventExample={{
          title: "Custom Event Composable in Vue 3",
          description: "Create a reusable `useAnalytics` composable for Vue 3 Composition API components.",
          filename: "composables/useAnalytics.ts",
          code: `// composables/useAnalytics.ts\nexport function useAnalytics() {\n  const track = (event: string, properties?: Record<string, unknown>) => {\n    if (process.client && window.OpenAnalytics) {\n      window.OpenAnalytics.track(event, properties);\n    }\n  };\n\n  return { track };\n}\n\n// Usage inside <script setup>:\n// const { track } = useAnalytics();\n// track("download_clicked", { file: "whitepaper.pdf" });`,
        }}
        webVitalsDetail="In Nuxt and Vue applications, Open Analytics tracks continuous Core Web Vitals (LCP, INP, CLS) without requiring separate Vue plugins or interfering with Pinia/Vuex state managers."
        errorTrackingDetail="Vue component lifecycle errors captured via `app.config.errorHandler` are forwarded seamlessly along with uncaught window exceptions and unhandled promise rejections."
        faqs={[
          {
            question: "Does Open Analytics track Vue Router route changes?",
            answer:
              "Yes. Open Analytics observes browser History API updates automatically, logging pageviews as users navigate Vue Router views without needing manual navigation guard code.",
          },
          {
            question: "Can I use Open Analytics with Nuxt Server-Side Rendering (SSR)?",
            answer:
              "Yes. The script is deferred and executes in the client browser after HTML hydration, making it 100% compatible with Nuxt SSR and static site generation.",
          },
          {
            question: "Will the script trigger hydration mismatches in Nuxt?",
            answer:
              "No. Open Analytics operates outside of the Vue DOM tree, never injecting or altering template elements, ensuring zero hydration mismatch errors.",
          },
        ]}
      />
    </>
  );
}

export interface FaqCodeSnippet {
  language: string;
  code: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
  codeSnippet?: FaqCodeSnippet;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "difference-from-ga4",
    category: "General & Setup",
    question: "What is Open Analytics and how is it different from Google Analytics?",
    answer:
      "Open Analytics is a modern, privacy-first web telemetry platform designed for the AI era. Unlike Google Analytics 4 (which is 45KB+, relies on invasive 2-year tracking cookies, requires mandatory GDPR consent banners, and delays data by up to 24 hours), Open Analytics features a featherweight sub-3.2KB script, requires zero cookie banners, delivers sub-second real-time telemetry, and autonomously classifies traffic from AI answer engines like SearchGPT, Perplexity, and Claude.",
    tags: ["GA4 Alternative", "Zero Cookies", "Privacy First", "Real-Time"],
  },
  {
    id: "installation-quickstart",
    category: "General & Setup",
    question: "How do I install Open Analytics on my website?",
    answer:
      "Installation takes under 60 seconds. Paste a single asynchronous script tag into your website's <head> or <body> element. Open Analytics also provides official native guides for Next.js (App Router and Pages Router), Vite/React, Nuxt/Vue, SvelteKit, and standard single-page applications.",
    tags: ["Quickstart", "Script Tag", "Next.js", "Vite"],
    codeSnippet: {
      language: "html",
      code: '<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>',
    },
  },
  {
    id: "pagespeed-rum-performance",
    category: "General & Setup",
    question: "Will Open Analytics slow down my website's PageSpeed or Core Web Vitals?",
    answer:
      "No. Open Analytics is engineered for maximum performance. At under 3.2KB compressed (Brotli), it executes in less than 2 milliseconds on mobile devices. It loads asynchronously with zero render-blocking requests and dispatches events via navigator.sendBeacon in background microtasks, ensuring zero impact on your First Contentful Paint (FCP) or Interaction to Next Paint (INP).",
    tags: ["PageSpeed", "Brotli <3.2KB", "sendBeacon", "Zero Blocking"],
  },
  {
    id: "spa-router-tracking",
    category: "General & Setup",
    question: "How does Open Analytics handle Single Page Applications (Next.js, Remix, Vue, Svelte)?",
    answer:
      "Open Analytics features automatic single-page application (SPA) route monitoring. The client tracker hooks into window.history.pushState, window.history.replaceState, and the popstate event. It automatically deduplicates consecutive rapid transitions to the same URL and properly tracks virtual pageviews across dynamic client-side route changes without requiring manual router hooks.",
    tags: ["SPA", "Next.js App Router", "popstate", "pushState"],
  },
  {
    id: "cookie-banner-exemption",
    category: "Privacy & Legal Compliance",
    question: "Do I need a cookie consent banner when using Open Analytics?",
    answer:
      "No. Under Article 5(3) of the EU ePrivacy Directive and GDPR, cookie banners are strictly mandatory when storing or reading non-essential identifiers on the user's terminal equipment. Open Analytics writes zero cookies, zero LocalStorage keys, and does not perform persistent hardware fingerprinting. Therefore, you are legally exempt from displaying cookie banners.",
    tags: ["GDPR", "ePrivacy", "PECR", "Zero Consent Banner"],
  },
  {
    id: "cookieless-hash-rotation",
    category: "Privacy & Legal Compliance",
    question: "How does Open Analytics count unique visitors without cookies or persistent tracking?",
    answer:
      "Open Analytics computes a pseudo-anonymous daily hash using HMAC-SHA-256 combining the visitor's masked IP address (/16 for IPv4, /64 for IPv6), User-Agent string, and a cryptographic daily salt. At 00:00:00 UTC every night, this salt is permanently erased and regenerated in memory. This allows accurate daily unique visitor counting while making multi-day tracking mathematically impossible.",
    tags: ["HMAC-SHA-256", "Daily Salt", "Cryptographic Wipe", "IP Masking"],
  },
  {
    id: "eu-data-storage-privacy",
    category: "Privacy & Legal Compliance",
    question: "Where is analytics data stored and processed?",
    answer:
      "All European telemetry is processed and stored exclusively within EU-based data centers (Frankfurt and Amsterdam). We strictly comply with GDPR and the Schrems II ruling, ensuring your visitors' telemetry is never transferred to non-compliant jurisdictions or foreign intelligence authorities.",
    tags: ["Frankfurt", "Amsterdam", "EU Data Residency", "Schrems II"],
  },
  {
    id: "data-retention-ttl",
    category: "Privacy & Legal Compliance",
    question: "How does automated retention and data purging work?",
    answer:
      "Open Analytics maintains strict compliance with GDPR storage limitation requirements. Raw telemetry documents (PageView, AnalyticsEvent, ErrorLog) have an automated 365-day MongoDB TTL index that permanently purges historical log records upon expiration. Pre-aggregated performance figures and high-level trends remain accessible for year-over-year reporting.",
    tags: ["365-Day Retention", "TTL Index", "Automated Purge", "GDPR Article 5"],
  },
  {
    id: "ai-search-bot-radar",
    category: "AI & Behavioral Telemetry",
    question: "How does Open Analytics track traffic from generative AI search engines?",
    answer:
      "Our autonomous AI Search Radar maintains a continuously updated heuristic catalog of AI user-agents, bot scrapers, and referral patterns (including OpenAI SearchGPT, Perplexity AI, Google Gemini, Anthropic ClaudeBot, and ByteDance Bytespider). We automatically segment human visitor traffic from AI assistant referral clicks and training crawlers.",
    tags: ["SearchGPT", "Perplexity", "ClaudeBot", "AI Search Radar"],
  },
  {
    id: "core-web-vitals-rum",
    category: "AI & Behavioral Telemetry",
    question: "What are Core Web Vitals and does Open Analytics measure Real User Monitoring (RUM)?",
    answer:
      "Core Web Vitals are Google's standardized user experience metrics: Largest Contentful Paint (LCP for loading speed), Interaction to Next Paint (INP for responsiveness), and Cumulative Layout Shift (CLS for visual stability). Open Analytics includes native RUM that samples real visitor sessions and reports exact 75th-percentile (p75) field performance data directly within your dashboard.",
    tags: ["Core Web Vitals", "LCP", "INP", "CLS", "p75 RUM"],
  },
  {
    id: "rage-dead-clicks",
    category: "AI & Behavioral Telemetry",
    question: "What is Rage Click and Dead Click detection?",
    answer:
      "Open Analytics automatically tracks frontend friction events. A 'Rage Click' is triggered when a user rapidly clicks the same element 3+ times within 800ms, indicating a broken button or unresponsive UI. A 'Dead Click' occurs when a user clicks an interactive-looking element that produces zero DOM change or network request. Both metrics help engineering teams identify UX regressions immediately.",
    tags: ["Rage Clicks", "Dead Clicks", "UX Friction", "Frontend Diagnostics"],
  },
  {
    id: "custom-events-tracking",
    category: "AI & Behavioral Telemetry",
    question: "Can I track custom events, conversion funnels, and revenue?",
    answer:
      "Yes. You can record custom business conversions programmatically using the window.openanalytics.track() method or configure no-code custom event rules directly in the dashboard by CSS selector or URL path pattern. Custom events support custom numerical values, currencies, and metadata payloads.",
    tags: ["Custom Events", "Conversions", "Funnels", "API Tracking"],
    codeSnippet: {
      language: "javascript",
      code: `// Trigger a custom conversion event
window.openanalytics?.track("plan_purchased", {
  plan: "pro",
  value: 180,
  currency: "USD",
  billing: "annual"
});`,
    },
  },
  {
    id: "plans-and-limits",
    category: "Architecture & Integration",
    question: "What features are included in the Free Starter plan versus the Pro plan?",
    answer:
      "The Free Starter plan includes 10,000 events per month, 1 tracked website, full core traffic analytics, and 100% cookieless GDPR compliance. Advanced observability modules—Core Web Vitals RUM, GEO & AI Search Engine Radar, Behavioral UX Rage Clicks, Error Crash Triage, and Custom Proxy Routing—are unlocked on the Pro plan ($19/mo or $15/mo billed annually). Quotas are unpooled per project.",
    tags: ["Free Tier", "Pro Tier", "Quotas", "Unpooled Limits"],
  },
  {
    id: "adblocker-proxy-routing",
    category: "Architecture & Integration",
    question: "How do I bypass AdBlockers that block analytics scripts?",
    answer:
      "Open Analytics supports custom reverse-proxy routing. By proxying the telemetry endpoint through your own primary domain (e.g., yourdomain.com/open.js instead of api.openanalytics.org.in), browser adblockers and privacy extensions recognize the script as first-party application infrastructure, restoring 15% to 30% of previously lost analytics accuracy.",
    tags: ["Reverse Proxy", "AdBlock Bypass", "Next.js Rewrites", "First-Party"],
    codeSnippet: {
      language: "javascript",
      code: `// Example: next.config.mjs rewrites configuration
async rewrites() {
  return [
    {
      source: "/telemetry/script.js",
      destination: "https://api.openanalytics.org.in/open.js",
    },
    {
      source: "/telemetry/collect",
      destination: "https://api.openanalytics.org.in/v1/collect",
    },
  ];
}`,
    },
  },
  {
    id: "team-rbac-collaboration",
    category: "Architecture & Integration",
    question: "Can team members collaborate on projects without sharing credentials?",
    answer:
      "Yes. Open Analytics provides granular Role-Based Access Control (RBAC). Project owners can invite collaborators with Viewer, Editor, or Admin permissions. Collaborators automatically inherit the Project Owner's subscription tier on shared workspaces without needing their own paid plan.",
    tags: ["RBAC", "Team Sharing", "Plan Inheritance", "Multi-User"],
  },
  {
    id: "machine-readable-endpoints",
    category: "Machine-Readable Endpoints",
    question: "Where can AI coding agents and LLM crawlers find machine specifications?",
    answer:
      "We provide standardized machine-readable endpoints: /llms.txt provides an executive architectural summary, /llms-full.txt provides deep technical context and schemas, and /agents.md provides direct integration instructions for coding agents such as Claude Code, Cursor, and Copilot.",
    tags: ["/llms.txt", "/llms-full.txt", "/agents.md", "AI Crawlers"],
  },
];

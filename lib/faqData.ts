export interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "General & Setup",
    question: "What is Open Analytics and how is it different from Google Analytics?",
    answer:
      "Open Analytics is a modern, privacy-first web telemetry platform designed for the AI era. Unlike Google Analytics 4 (which is 45KB+, relies on invasive 2-year tracking cookies, requires mandatory GDPR consent banners, and delays data by up to 24 hours), Open Analytics features a featherweight sub-3.2KB script, requires zero cookie banners, delivers sub-second real-time telemetry, and autonomously classifies traffic from AI answer engines like SearchGPT, Perplexity, and Claude.",
  },
  {
    category: "General & Setup",
    question: "How do I install Open Analytics on my website?",
    answer:
      'Installation takes under 60 seconds. Simply paste a single asynchronous script tag into your website\'s <head> element: <script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>. We also provide official native guides for Next.js (App Router & Pages Router), Vite/React, Nuxt/Vue, SvelteKit, and standard single-page applications.',
  },
  {
    category: "General & Setup",
    question: "Will Open Analytics slow down my website's PageSpeed or Core Web Vitals?",
    answer:
      "No. Open Analytics is engineered for maximum performance. At under 3.2KB compressed (Brotli), it executes in less than 2 milliseconds on mobile devices. It loads asynchronously with zero render-blocking requests and dispatches events via navigator.sendBeacon in background microtasks, ensuring zero impact on your First Contentful Paint (FCP) or Interaction to Next Paint (INP).",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "Do I need a cookie consent banner when using Open Analytics?",
    answer:
      "No. Under Article 5(3) of the EU ePrivacy Directive and GDPR, cookie banners are strictly mandatory when storing or reading non-essential identifiers on the user's terminal equipment. Open Analytics writes zero cookies, zero LocalStorage keys, and does not perform persistent hardware fingerprinting. Therefore, you are legally exempt from displaying cookie banners.",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "How does Open Analytics count unique visitors without cookies or persistent tracking?",
    answer:
      "Open Analytics computes a pseudo-anonymous daily hash using HMAC-SHA-256 combining the visitor's masked IP address, User-Agent string, and a cryptographic daily salt. At 00:00:00 UTC every night, this salt is permanently erased and regenerated in memory. This allows accurate daily unique visitor counting while making multi-day tracking mathematically impossible.",
  },
  {
    category: "Privacy & Legal Compliance",
    question: "Where is analytics data stored and processed?",
    answer:
      "All European telemetry is processed and stored exclusively within EU-based data centers (Frankfurt and Amsterdam). We strictly comply with GDPR and the Schrems II ruling, ensuring your visitors' telemetry is never transferred to non-compliant jurisdictions.",
  },
  {
    category: "AI & Behavioral Telemetry",
    question: "How does Open Analytics track traffic from generative AI search engines?",
    answer:
      "Our autonomous AI Search Radar maintains a continuously updated heuristic catalog of AI user-agents, bot scrapers, and referral patterns (including OpenAI SearchGPT, Perplexity AI, Google Gemini, Anthropic ClaudeBot, and ByteDance Bytespider). We automatically segment human visitor traffic from AI assistant referral clicks and training crawlers.",
  },
  {
    category: "AI & Behavioral Telemetry",
    question: "What are Core Web Vitals and does Open Analytics measure Real User Monitoring (RUM)?",
    answer:
      "Core Web Vitals are Google's standardized user experience metrics: Largest Contentful Paint (LCP for loading speed), Interaction to Next Paint (INP for responsiveness), and Cumulative Layout Shift (CLS for visual stability). Open Analytics includes native RUM that samples real visitor sessions and reports exact 75th-percentile (p75) field performance data directly within your dashboard.",
  },
  {
    category: "AI & Behavioral Telemetry",
    question: "What is Rage Click and Dead Click detection?",
    answer:
      "Open Analytics automatically tracks frontend friction events. A 'Rage Click' is triggered when a user rapidly clicks the same element 3+ times within 800ms, indicating a broken button or unresponsive UI. A 'Dead Click' occurs when a user clicks an interactive-looking element that produces zero DOM change or network request. Both metrics help engineering teams identify UX regressions immediately.",
  },
  {
    category: "Architecture & Integration",
    question: "What features are included in the Free Starter plan versus the Pro plan?",
    answer:
      "The Free Starter plan includes 10,000 events per month, 1 tracked website, full core traffic analytics, and 100% cookieless GDPR compliance. Advanced observability modules—Core Web Vitals RUM, GEO & AI Search Engine Radar, Behavioral UX Rage Clicks, Error Crash Triage, and Custom Proxy Routing—are unlocked on the Pro plan ($19/mo or $15/mo billed annually).",
  },
  {
    category: "Architecture & Integration",
    question: "How do I bypass AdBlockers that block analytics scripts?",
    answer:
      "Open Analytics supports custom reverse-proxy routing. By proxying the telemetry endpoint through your own primary domain (e.g., yourdomain.com/open.js instead of api.openanalytics.org.in), browser adblockers and privacy extensions recognize the script as first-party application infrastructure, restoring 15% to 30% of previously lost analytics accuracy.",
  },
  {
    category: "Machine-Readable Endpoints",
    question: "Where can AI coding agents and LLM crawlers find machine specifications?",
    answer:
      "We provide standardized machine-readable endpoints: /llms.txt provides an executive architectural summary, /llms-full.txt provides deep technical context and schemas, and /agents.md provides direct integration instructions for coding agents such as Claude Code, Cursor, and Copilot.",
  },
];

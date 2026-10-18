# Open Analytics

> Open-source web analytics and observability for modern websites.

[Website](https://openanalytics.org.in) • [Documentation](https://openanalytics.org.in/docs) • [Cloud Dashboard](https://dashboard.openanalytics.org.in) • [Self-Hosting Guide](https://openanalytics.org.in/docs/installation)

---

## Why Open Analytics?

Modern web applications need more than traditional pageview counters. They require real user monitoring, behavioral UX intelligence, frontend crash detection, and visibility into AI crawlers—without compromising visitor privacy or loading hundreds of kilobytes of blocking JavaScript.

Open Analytics unifies web analytics and frontend observability into a single platform:

- **Sub-3.2 KB Featherweight Script**: 15x lighter than Google Analytics 4, executing asynchronously with zero main-thread blocking.
- **Cookieless & Privacy-First**: 100% exempt from cookie consent banners. Cryptographic HMAC-SHA-256 daily hashes with midnight UTC ephemeral salt purging.
- **Full Frontend Observability**: Continuous Core Web Vitals RUM, runtime JavaScript crash grouping, unhandled promise rejections, and AI-assisted bug triage.
- **Behavioral UX Telemetry**: Automated rage-click detection (>=3 clicks within 500ms within 40px), active dwell time, scroll depth, and exit intent.
- **Autonomous AI Radar**: Real-time identification of LLM training bots and search crawlers (OpenAI GPTBot, PerplexityBot, ClaudeBot, Applebot).
- **100% Open Source & Self-Hostable**: Own your telemetry data completely or use managed Open Analytics Cloud.

---

## Core Product Pillars

### 1. Web Analytics & Journeys
- Real-time visitor counts, live stream telemetry, and geographic world maps.
- Referral channel classification (direct, organic search, social, paid, email).
- Multi-step visual conversion funnels and route transition matrices.
- Custom event tracking with dynamic property payloads.

### 2. Real User Monitoring (RUM)
- Continuous field measurement of Google Core Web Vitals at the 75th percentile (p75):
  - **LCP** (Largest Contentful Paint)
  - **INP** (Interaction to Next Paint)
  - **CLS** (Cumulative Layout Shift)
  - **FCP** (First Contentful Paint)
  - **TTFB** (Time to First Byte)
- Device-level performance filtering (Mobile vs Tablet vs Desktop).

### 3. Behavioral UX Analytics
- **Rage Click Detection**: Automatically detects user frustration when >=3 clicks occur within 500ms within a 40px radius.
- **Dwell Time Telemetry**: Distinguishes active user engagement from background tab idle time.
- **Scroll Depth Tracking**: Measures 25%, 50%, 75%, and 100% viewport scroll thresholds.
- **Exit Intent & Outbound Links**: Detects mouse velocity departures and external link clicks.

### 4. Frontend Observability & Crash Triage
- Automatically captures uncaught runtime JavaScript exceptions and unhandled promise rejections.
- Circular user action breadcrumb capture prior to error occurrence.
- Fingerprinted error clustering with automated occurrence counters and velocity spike detection.
- One-click copyable bug diagnostic prompts formatted for AI coding assistants (Claude, Gemini, ChatGPT).

### 5. Autonomous AI Visibility (GEO & AEO)
- Identifies visits from generative AI search crawlers and LLM dataset harvesters.
- Classifies requests from OpenAI (`GPTBot`, `OAI-SearchBot`), Anthropic (`ClaudeBot`), Perplexity (`PerplexityBot`), and Apple (`Applebot`).
- Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) readiness tracking.

### 6. Google Search Console & Autonomous Growth Strategies
- **Direct GSC Integration**: Connect verified Google Search Console properties via OAuth 2.0 to sync organic keyword rankings, click-through rates, and landing page impressions.
- **Striking Distance Keyword Spotlight**: Highlights queries ranking positions 4–20 with high search impression volume for high-impact CTR gains.
- **Cross-Telemetry Improvement Engine**: Synthesizes search console rankings, Web Vitals RUM, behavioral drop-offs, device breakdowns, geo radar, and runtime exceptions into prioritized step-by-step optimization blueprints.
- **Actionable Code Blueprints**: Copyable HTML titles, Next.js asset preloading, React Error Boundaries, touch target CSS, and JSON-LD schema graphs.

---

## Quick Start: One-Line Installation

Add this single tag to your HTML `<head>`:

```html
<script 
  defer 
  src="https://api.openanalytics.org.in/open.js" 
  data-project-id="prj_your_project_id"
></script>
```

Everything—pageviews, dwell times, Core Web Vitals, rage clicks, and frontend errors—tracks automatically with zero additional configuration.

---

## Framework Integrations

### Next.js (App Router)

In `app/layout.tsx`:

```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://api.openanalytics.org.in/open.js"
          data-project-id="prj_your_project_id"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### React (Vite / CRA)

In `src/App.tsx` or `src/main.tsx`:

```tsx
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.openanalytics.org.in/open.js";
    script.setAttribute("data-project-id", "prj_your_project_id");
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return <YourApplicationRouter />;
}
```

### Nuxt 3

In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://api.openanalytics.org.in/open.js",
          "data-project-id": "prj_your_project_id",
          defer: true,
        },
      ],
    },
  },
});
```

### Direct Telemetry HTTP API

Ingest custom backend telemetry or mobile events directly via HTTP:

```bash
curl -X POST "https://api.openanalytics.org.in/v1/collect" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pageview",
    "projectId": "prj_your_project_id",
    "pathname": "/checkout",
    "title": "Completed Order",
    "country": "United States"
  }'
```

---

## Product Architecture

Open Analytics uses a 3-tier domain isolation architecture:

```text
openanalytics.org.in (Main Domain)
│
├── Marketing
├── Public Documentation
├── Comparisons (/vs-google-analytics)
└── Knowledge Base (/faq)
        │
        ↓
dashboard.openanalytics.org.in (Dashboard Subdomain)
│
├── Authentication (/login, /register)
├── Workspaces & Projects
├── Real-Time Feeds & Analytics
├── RUM & Core Web Vitals
├── Error Triage & Alerts
└── Billing & Subscriptions
        │
        ↓
api.openanalytics.org.in (Telemetry Ingestion Subdomain)
│
├── /open.js (Asynchronous tracking beacon)
├── POST /v1/collect (Pageviews, vitals, rage clicks)
├── POST /v1/error (Crash & exception triage)
└── POST /v1/identify (Visitor profile enrichment)
```

---

## Self-Hosting Guide

### Prerequisites
- Node.js >= 18.17.0
- MongoDB 6.0+ instance

### 1. Clone Repository

```bash
git clone <repository-url>
cd open-analytics
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/open_analytics
JWT_SECRET=your_super_secret_jwt_key_here
NEXT_PUBLIC_APP_URL=https://openanalytics.org.in
NEXT_PUBLIC_API_URL=https://api.openanalytics.org.in
```

### 3. Run Development Server

```bash
npm run dev
```

Server is available at `http://localhost:3005`.

---

## Developer Workflow Scripts

All repository workflows use standardized npm scripts:

| Command | Script File | Description |
| :--- | :--- | :--- |
| `npm run pull` | `scripts/pull.js` | Pull latest updates cleanly from upstream branch. |
| `npm run push [msg]` | `scripts/push.js` | Stage, commit, and push changes to upstream branch. |
| `npm run sync [msg] [--pr]` | `scripts/sync.js` | Complete sync pipeline: pull -> commit -> push -> optional PR. |
| `npm run pr [--title "..." --body "..."]` | `scripts/create-pr.js` | Dynamic GitHub PR creation & synchronization derived from git commits. |
| `npm run merge:pr [number]` | `scripts/merge-pr.js` | Programmatically merge open PRs via GitHub REST API. |
| `npm run kill:3005` | `scripts/kill-port.js` | Free port 3005 if an orphaned process is lingering. |
| `npm run test:subdomain` | `scripts/test-subdomain.js` | Automated 10-point regression test suite for subdomain routing. |
| `npm run purge:retention` | `scripts/purge-retention.js` | Enforce 365-day TTL telemetry retention purge in MongoDB. |

---

## Cloud Plans & Pricing

Open Analytics is available as both open-source self-hosted software and fully managed Cloud:

- **Community / Self-Hosted**: 100% Free and open source under Apache-2.0. Full feature access.
- **Free Cloud Starter**: 1 website, 10,000 monthly events, Core Web Vitals RUM, 30-day historical window.
- **Pro Cloud ($19/mo)**: 10 websites included, 250,000 monthly events, AI Bot Radar, rage clicks, 365-day retention.
- **Enterprise Cloud**: Custom high-volume event ingestion, private clusters, SLA, and dedicated support.

---

## Contributing

We welcome community contributions. Please review our [Contribution Guidelines](CONTRIBUTING.md) and ensure all pull requests follow the zero-emoji rule, Obsidian Dark design tokens, and subdomain isolation standards.

---

## Security & Privacy

For vulnerability reporting and details on our cryptographic salt rotation and data handling, review our [Security Policy](SECURITY.md).

---

## License

Open Analytics is open-source software licensed under the [Apache License, Version 2.0](LICENSE).

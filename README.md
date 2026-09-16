# Open Analytics & Observability Platform

> **Next-Generation Standalone Web Analytics, Real User Monitoring (RUM), Behavioral UX Signals, AI-Powered Error Triage & Multi-Tenant Project Governance.**

Open Analytics is a production-grade, multi-tenant analytics and observability platform designed to connect to any website, mobile application, or SaaS product.

It provides complete insight into user experience, performance bottlenecks, rage clicks, multi-step navigation flows, runtime crashes, and audience loyalty—**with zero custom code required on client websites**.

---

## Key Highlights

- **Zero-Code 1-Line Script Installation**: Paste a single `<script>` tag into any HTML `<head>`—everything (pageviews, dwell times, Web Vitals, hardware diagnostics, rage clicks, errors) is tracked automatically.
- **Multi-Tenant Project Governance & Ownership Transfer**: Organizations can manage multiple isolated projects. Project creators are automatically assigned as Owner and Admin, with full support for transferring project ownership to other users.
- **Audience & Loyalty Directory**: Deep customer intelligence calculating dynamic Loyalty Scores (0–100) and grouping visitors into 4 tiers: Brand Champions, Loyal Advocates, Returning Users, and New Explorers.
- **User Journeys & Route Transitions**: Visual multi-step navigation flow analysis (`Step 1 -> Step 2 -> Step 3`), direct page-to-page transition matrices, landing page bounce rates, and session depth cohorts.
- **Real User Monitoring (RUM)**: Live browser performance tracking for Core Web Vitals (LCP, INP, CLS, FCP, TTFB) with Good / Needs Improvement / Poor distributions.
- **Hardware & Network Diagnostics**: Detects WebGL GPU renderers, device RAM, CPU cores, DPR, viewport dimensions, and network speeds (5G/4G, downlink Mbps, RTT).
- **Behavioral UX Signals**: Measures active vs. idle dwell time, scroll depth milestones, rage click detection (≥3 rapid clicks in 500ms within 40px), desktop exit intent, outbound links, and text copy events.
- **Universal Error & Crash Monitoring**: Automatically captures uncaught JS runtime errors, failed resource loading, unhandled promise rejections, WebGL context loss, and fetch/API failures, attaching circular user action breadcrumbs.
- **Edge Error Suppression Rules**: Define match rules (`contains`, `exact`, `regex`, `starts_with`) on message, pathname, errorType, or stack trace to suppress known noise or benign third-party errors at ingestion.
- **AI-Powered Bug Triage**: Generates comprehensive, copyable bug diagnostic prompts formatted for AI coding assistants (Claude, Gemini, ChatGPT) with stack traces, affected routes, client environment, and step-by-step fix recommendations.
- **Live Telemetry & Real-Time Event Stream**: Live polling stream with configurable refresh intervals (2s, 5s, 10s, 30s), segment filtering, CSV/JSON export, and deep audit inspector modals.
- **Interactive SVG World Atlas**: Interactive world map with pan, zoom, country rankings, continent breakdowns, and city-level drilldown.
- **Privacy & Security by Design**: Built-in IP address anonymization (masking the last octet for GDPR compliance) and automated PII redaction (scrubbing emails, passwords, tokens from URL query parameters and error payloads).

---

## Installation & Integration Guide

Open Analytics can be integrated into any web application or CMS in under 60 seconds.

---

### 1. Universal 1-Line HTML Tag (Any Website or CMS)

Paste this tag directly before the closing `</head>` tag in your HTML template (compatible with Vanilla HTML, Webflow, WordPress, Shopify, Wix, Ghost, Squarespace):

```html
<script 
  defer 
  src="https://api.openanalytics.org.in/open.js" 
  data-project-id="prj_your_project_id"
></script>
```

#### Script Tag Configuration Attributes

| Attribute | Required | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `data-project-id` | **Yes** | Unique project identifier generated in Open Analytics | `prj_production_app` |
| `data-endpoint` | Optional | Open Analytics server origin (only needed if script is hosted on CDN/subdomain) | `https://analytics.company.com` |
| `data-api-key` | Optional | Publishable client API key | `pk_live_123456789` |

---

### 2. Next.js Integration (App Router)

In your root layout (`app/layout.tsx`), import the React Tracker component or use Next.js `<Script />`:

#### Option A: Using the React Tracker Component
```tsx
import OpenAnalyticsTracker from "@/lib/sdk/OpenAnalyticsTracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <OpenAnalyticsTracker projectId="prj_your_project_id" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Option B: Using `next/script`
```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="open-analytics"
          src="https://openanalytics.org.in/open.js"
          strategy="afterInteractive"
          data-project-id="prj_your_project_id"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### 3. Next.js Integration (Pages Router)

In your `pages/_app.tsx` or `pages/_document.tsx`:

```tsx
import Script from "next/script";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        id="open-analytics"
        src="https://openanalytics.org.in/open.js"
        strategy="afterInteractive"
        data-project-id="prj_your_project_id"
      />
      <Component {...pageProps} />
    </>
  );
}
```

---

### 4. React Single Page Applications (Vite / CRA / Remix)

In your root `index.html` (inside `<head>`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Application</title>
    <!-- Open Analytics Tracking -->
    <script 
      defer 
      src="https://openanalytics.org.in/open.js" 
      data-project-id="prj_your_project_id"
    ></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

### 5. Nuxt 3 / Vue.js Integration

In your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://openanalytics.org.in/open.js",
          defer: true,
          "data-project-id": "prj_your_project_id",
        },
      ],
    },
  },
});
```

---

### 6. SvelteKit & Astro Integration

In `src/app.html` (SvelteKit) or your base layout (Astro):

```html
<script 
  defer 
  src="https://openanalytics.org.in/open.js" 
  data-project-id="prj_your_project_id"
></script>
```

---

## JavaScript SDK & Manual Telemetry Usage

While all standard telemetry (pageviews, dwell times, Web Vitals, hardware diagnostics, rage clicks, errors) is recorded automatically, the `window.OpenAnalytics` global object provides high-level APIs for custom business logic.

### 1. Custom Business Event Tracking
Track user actions, feature adoption, funnel conversions, and revenue:

```js
// Track a basic event
window.OpenAnalytics.track("signup_modal_opened");

// Track an event with custom properties and numerical value
window.OpenAnalytics.track("plan_purchased", {
  plan: "enterprise_annual",
  seats: 25,
  billing_interval: "annual",
  currency: "USD"
}, 1200.00);
```

### 2. User & Account Identification
Associate anonymous telemetry with authenticated users without cookies:

```js
window.OpenAnalytics.identify("usr_98124_alex", {
  name: "Alex Mercer",
  email: "alex@company.io",
  company: "Acme Corp",
  tier: "enterprise"
});
```

### 3. Programmatic Exception & Error Capturing
Capture handled exceptions in `try/catch` blocks or React Error Boundaries:

```js
try {
  executeCriticalPaymentFlow();
} catch (err) {
  window.OpenAnalytics.captureError(err, {
    gateway: "stripe",
    step: "charge_authorization",
    cart_id: "cart_88219"
  });
}
```

### 4. 404 Route & Broken Link Tracking
Capture Not Found pages in custom error catchers or Next.js `not-found.tsx`:

```js
window.OpenAnalytics.track404("/products/discontinued-item", document.referrer);
```

### 5. Programmatic SPA Route Transitions
If using custom routing logic without standard HTML5 History API events:

```js
window.OpenAnalytics.page("/app/workspace/settings");
```

---

## Allowed Origins & CORS Whitelisting

By default, every new project has `allowedDomains: ["*"]`, accepting hits from all origins (production, staging, and localhost).

To restrict telemetry collection to authorized domains only:
1. Navigate to **Workspace Settings** (`/projects/[projectId]/settings`).
2. Under **Allowed Origins & CORS Domains**, enter your domains separated by commas:
   ```
   myapp.com, app.myapp.com, staging.myapp.com, localhost:3000
   ```
3. Click **Save Changes**. Requests from unapproved origins will automatically be rejected with `403 Forbidden`.

---

## What Gets Tracked Automatically

| Metric / Telemetry | Automatic Capture Mechanism |
| :--- | :--- |
| **Pageviews & SPA Transitions** | Tracks `pushState`, `replaceState`, `popstate`, and initial page load |
| **Dwell & Active Attention** | Measures continuous active focus vs. background/idle tab time |
| **Scroll Depth** | Tracks vertical scroll depth milestones (25%, 50%, 75%, 100%) |
| **Core Web Vitals** | Captures real browser LCP, INP, CLS, FCP, and TTFB via PerformanceObserver |
| **Rage Clicks** | Detects frustrational click bursts (≥3 clicks within 500ms and 40px radius) |
| **Desktop Exit Intent** | Detects cursor acceleration towards browser address bar/tab close area |
| **Client Errors & Crashes** | Intercepts `window.onerror`, unhandled promise rejections, and asset load failures |
| **Hardware & GPU** | Detects WebGL GPU renderer, device RAM, CPU cores, DPR, and viewport size |
| **Network Quality** | Measures effective network type (5G/4G/3G/2G), downlink Mbps, and round-trip time |
| **Outbound Link Clicks** | Records navigation to external domain URLs |
| **Text Copy Events** | Measures high-intent user snippet copy actions |

---

## Analytical Modules & Views

1. **Overview Dashboard** (`/`): High-level KPI ribbons, traffic timeseries, device breakdown, top pages, acquisition channels, and real-time live users.
2. **Live Telemetry** (`/live-feed`): Real-time event stream with multi-interval polling, segment filters (New, Returning, Authenticated, Bounced, Bots), CSV/JSON exports, and raw payload audit modal.
3. **Audience & Loyalty** (`/audience`, `/visitors`): Visitor intelligence directory with dynamic Loyalty Scores (0–100), 4 loyalty tiers, visit frequency cohorts, and full visitor journey inspection.
4. **User Journeys** (`/journeys`): Multi-step navigation sequences (`Step 1 -> Step 2 -> Step 3`), direct route transition matrices, and landing page bounce distribution.
5. **Top Pages & Routes** (`/pages`): High-density route performance table with traffic share distribution, dwell time, scroll depth, CSV export, and live telemetry filtering.
6. **Custom Events** (`/events`): Custom business conversion event tracking, properties inspector, and frequency analysis.
7. **Web Vitals (RUM)** (`/vitals`): Core Web Vitals (LCP, INP, CLS, FCP, TTFB) with route-level ratings and distribution gauges.
8. **Crash & Errors** (`/errors`): Universal error tracking with multi-selection batch management, AI fix prompt generator, expandable stack traces, and Edge suppression rules.
9. **Behavioral UX** (`/ux`): Rage click detection, desktop exit intent rates, outbound links, and active vs. idle dwell time analysis.
10. **Devices & Tech** (`/tech`): Browser, OS, device form factors, GPU renderers, memory, and network connection types.
11. **Audience Geography** (`/geo`): Interactive SVG World Atlas, country rankings, continent breakdowns, and city-level drilldowns.
12. **Acquisition & Sources** (`/acquisition`): Referrers, direct traffic, search engines, and UTM campaign attribution.
13. **SEO & Search Radar** (`/seo`): Search engine traffic breakdown, organic discovery, and structured data monitoring.
14. **GEO & AI Radar** (`/ai-visibility`): AI crawler detection (GPTBot, ClaudeBot, Perplexity, etc.) and AEO citation readiness.
15. **Workspace Management** (`/projects`, `/projects/[projectId]/settings`): Multi-project directory, role-based access control (Owner, Admin, Editor, Member), team invitations, and secure project ownership transfer.

---

## Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router, Server Actions, Route Handlers)
- **Database**: MongoDB with Mongoose ODM (Optimized compound indexes)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens (Dark Mode Glassmorphism)
- **Icons**: Lucide React (Strict Zero-Emoji Policy)
- **Client Script**: Vanilla JavaScript (`public/open.js`, ~12KB unminified, zero external dependencies)
- **Authentication**: JWT-based session cookies with bcrypt password hashing and Role-Based Access Control (RBAC)

---

## 3-Tier Domain Architecture

Open Analytics is structured across three segregated subdomains:

| Subdomain | Environment / Port | Purpose |
| :--- | :--- | :--- |
| **`openanalytics.org.in`** | `localhost:3005` | **Pure SEO & Marketing**: Landing pages, comparison matrix, pricing tiers, public documentation. |
| **`dashboard.openanalytics.org.in`** | `dashboard.localhost:3005` | **Analytics Workspace & Auth**: Dashboards, live feed, property settings, user login & registration. |
| **`api.openanalytics.org.in`** | `api.localhost:3005` | **Edge Ingestion & CDN**: Tracker script delivery (`/open.js`) and versioned ingestion (`/v1/collect`, `/v1/error`, `/v1/identify`, `/v1/event-rules`). |

---

## User-Level Subscription Model & Ceilings

Subscription plans belong to user accounts and are inherited by projects owned by that user:

| Tier | Price | Tracked Websites | Events / Month (Per Project) | Retention | Team Members / Project | Included Modules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Free Starter** | $0 | **1 Website** | 10,000 | 30 days | Up to 2 | Core Cookieless Web Telemetry |
| **Cloud Pro** | $19 / mo ($15/mo annual) | **10 Websites** | 250,000 | 365 days (1 yr) | Up to 10 | All 5 Power Modules (RUM, AI Radar, UX, Errors, Custom Events) |
| **Enterprise** | Custom | **10 Base (+ $10/mo per extra)** | 1,000,000+ | 365 days (1 yr) | Unlimited | All Modules + Dedicated SLA, SSO, Custom DPA |

- **Team Collaborator Inheritance**: Invited team members enjoy Pro privileges on projects owned by a Pro subscriber without cross-account leakage into their independently owned projects.
- **Unpooled Quotas**: Monthly event limits are enforced per-project, protecting high-throughput streams from starving other properties.

---

## Workflow & Developer Scripts

| Command | Script File | Description |
| :--- | :--- | :--- |
| `npm run pull` | `scripts/pull.js` | Pulls latest changes from `origin` for specified branch (default: `dev`). |
| `npm run push [msg]` | `scripts/push.js` | Stages all changes, creates a commit with the provided message, and pushes to `origin/dev`. |
| `npm run sync [msg] [--pr]` | `scripts/sync.js` | Full sync pipeline: pull -> commit -> push -> optional PR. |
| `npm run pr [--title "..." --body "..."]` | `scripts/create-pr.js` | Dynamic GitHub PR creation & synchronization derived from git commits. |
| `npm run kill:3005` | `scripts/kill-port.js` | Cross-platform process killer releasing port 3005. |
| `npm run test:subdomain` | `scripts/test-subdomain.js` | Automated 10-point regression test suite for subdomain routing and isolation. |
| `npm run purge:retention` | `scripts/purge-retention.js` | 1-year telemetry data purge utility for raw collections in MongoDB. |

---

## Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/hackeryard/open-analytics.git
cd open-analytics
yarn install # or npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and set your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/open_analytics
JWT_SECRET=your_super_secret_jwt_key_here
NEXT_PUBLIC_APP_URL=https://openanalytics.org.in
NEXT_PUBLIC_API_URL=https://api.openanalytics.org.in
```

### 3. Run Development Server

```bash
yarn dev # or npm run dev
```

Open `http://localhost:3005` in your browser.

---

## License & Terms

Copyright &copy; Open Analytics. All rights reserved. Managed and hosted at [openanalytics.org.in](https://openanalytics.org.in).

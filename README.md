# ⚡ Pulse Analytics & Observability Platform

> **Next-Generation Standalone Web Analytics, Real User Monitoring (RUM), Behavioral UX Signals & AI-Powered Error Triage.**

Pulse Analytics is a production-grade, multi-tenant analytics and observability platform designed to connect to any website, mobile application, or SaaS product. 

It provides complete insight into user experience, performance bottlenecks, rage clicks, user journeys, and runtime crashes—**with zero custom code required on client websites**.

---

## 🚀 Key Highlights

- **Zero-Code 1-Line Script Installation**: Just paste a single `<script>` tag into any HTML `<head>`—everything (pageviews, dwell times, Web Vitals, hardware diagnostics, rage clicks, errors) is tracked automatically.
- **True Multi-Tenant Isolation**: Supports multiple organizations and unlimited projects. Each project gets its own Project ID, publishable API key, secret key, allowed domain whitelist, and isolated database indexes.
- **Real User Monitoring (RUM)**: Live browser performance tracking for Core Web Vitals (LCP, INP, CLS, FCP, TTFB) with "Good / Needs Improvement / Poor" rating distributions.
- **Hardware & Network Diagnostics**: Detects unmasked WebGL GPU renderers, device RAM (GB), logical CPU cores, DPR, viewport dimensions, and network speeds (4G/3G, downlink, RTT).
- **Behavioral UX Signals**: Measures active vs. idle dwell time, scroll depth milestones (25%, 50%, 75%, 90%, 100%), rage click detection (≥3 rapid clicks in 500ms within 40px), desktop exit intent, outbound links, and text copy.
- **360° Error & Crash Monitoring**: Automatically captures uncaught JS runtime errors, failed resource loading (`<script>`, `<img>`), unhandled promise rejections, WebGL context lost, fetch/API 4xx/5xx failures, and console errors, attaching circular user action breadcrumbs.
- **AI-Powered Bug Triage**: Generates comprehensive, copyable bug diagnostic prompts formatted for AI coding assistants (Claude, Gemini, ChatGPT) with stack traces, affected routes, client environment, and step-by-step fix recommendations.
- **Interactive SVG World Atlas**: Built-in interactive world map with pan, zoom, country rankings, continents breakdown, and city-level drilldown.
- **Plug-and-Play Product Intelligence**: Keep the core analytics platform 100% product-agnostic, with dynamic domain extensions (such as the *Virtual Labs Module* for OpenLabs) that appear automatically only when domain telemetry is detected.
- **Privacy & Security by Design**: Built-in IP address anonymization (masking the last octet for GDPR compliance) and automated PII redaction (scrubbing emails, passwords, tokens from URL query parameters and payloads).

---

## 📦 1-Line Installation for Any Website

To start tracking any website, paste this single line inside your HTML `<head>`:

```html
<script defer src="https://pulse-analytics-seven.vercel.app/pulse.js" data-project-id="prj_your_project_id"></script>
```

### Optional Configuration Attributes

| Attribute | Description | Default |
| :--- | :--- | :--- |
| `data-project-id` | Your unique Project ID (e.g. `prj_production_app`) | Required |
| `data-api-key` | Optional publishable client API key (`pk_live_...`) | Optional |
| `data-endpoint` | Hosted Pulse server URL | Origin of the script |

---

## 💻 React & Next.js Integration

For modern React, Next.js, or Remix applications, you can also use the plug-and-play component:

```tsx
import PulseTracker from "@/lib/sdk/PulseTracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <PulseTracker 
          projectId="prj_production_app" 
          endpoint="https://pulse-analytics-seven.vercel.app" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🌐 JavaScript SDK (Optional Manual Tracking)

While all core events, vitals, and errors are captured automatically, the global `window.Pulse` object allows custom telemetry:

```js
// Track a custom business event
window.Pulse.track("checkout_completed", {
  plan: "pro_annual",
  value: 299.00
});

// Identify an authenticated user
window.Pulse.identify("usr_98124", {
  name: "Jane Doe",
  email: "jane@example.com",
  role: "admin"
});

// Programmatic pageview trigger (for custom SPA routers)
window.Pulse.page("/dashboard/billing");
```

---

## 📊 Analytics Dashboard Views

The standalone dashboard running on `http://localhost:3005/` provides 12+ specialized analytical tabs:

1. **Live Feed**: Real-time active paths, live user count, and a paginated, searchable pageview log with device, location, and dwell time filters.
2. **Returning Visitors**: Retention rate, visit frequency distribution (1, 2, 3–5, 6+ visits), and detailed returning user profiles.
3. **Core Web Vitals & RUM**: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Interaction to Next Paint (INP), and Time to First Byte (TTFB) gauges with route-level performance rankings.
4. **Behavioral UX**: Rage click ranking (with CSS target selectors and text samples), desktop exit intent rates, outbound links, and active dwell vs. idle dwell ratio.
5. **User Journeys**: Most common entry pages, exit pages, bounce rates, and navigation flow lengths.
6. **Top Pages & Routes**: Pageviews, unique visitor count, average dwell time, and average vertical scroll depth per route.
7. **Traffic & Campaigns**: Referrer domains (with percentage share) and UTM campaign breakdown (source, medium, campaign).
8. **Geo & Systems**: Device breakdown (Desktop, Mobile, Tablet), browser versions, operating systems, screen resolutions, GPU profiles, CPU core counts, and network types (4G/3G, downlink, RTT).
9. **Dwell & Scroll**: Engagement distribution across dwell durations (<10s, 10s–30s, 30s–1m, 1m–3m, 3m–10m, >10m) and scroll milestones (0–25%, 25–50%, 50–75%, 75–100%).
10. **Custom Events**: Real-time stream of custom business events with expandable JSON property payloads and category filters.
11. **Crash & Error Monitoring**: Deduplicated runtime errors, stack trace viewer, user diagnostic breadcrumbs, status management (`new`, `investigating`, `resolved`, `ignored`), CSV/JSON export, and one-click AI Bug Triage prompt generation.
12. **Interactive World Atlas**: Responsive SVG World Map with zoom, pan, country rankings, continent breakdowns, and city-level drilldown.
13. **Dynamic Product Intelligence Modules**: Pluggable domain modules (such as the *Virtual Labs Module* for OpenLabs) that activate automatically when domain telemetry is detected.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript, React 18)
- **Styling**: Tailwind CSS with CSS variable-backed design tokens (dark theme)
- **Database**: MongoDB with Mongoose (optimized compound indexes on `projectId + createdAt`)
- **Charting**: Chart.js & React-Chartjs-2
- **Icons**: Lucide React
- **Maps**: Custom high-resolution vector SVG World Atlas (`worldAtlas.ts`)

---

## ⚙️ Ingestion API Endpoints

All ingestion endpoints accept cross-origin requests (CORS enabled) and support both HTTP header and body-based API authentication:

- `POST /api/v1/collect`: Primary edge ingestion endpoint handling `pageview`, `heartbeat`, and `event` payloads.
- `POST /api/v1/error`: Ingests crash reports, groups stack traces, and deduplicates identical errors within a 24-hour window.
- `POST /api/v1/identify`: Associates anonymous visitor and session IDs with authenticated user accounts and traits.

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js 20+ (Node 22 LTS recommended)
- MongoDB database connection URI

### 2. Install Dependencies
```bash
cd d:pulse-analytics
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pulse_analytics?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=https://pulse-analytics-seven.vercel.app
NODE_ENV=production
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser to test locally or view the deployed version at [https://pulse-analytics-seven.vercel.app](https://pulse-analytics-seven.vercel.app).

---

## 🔄 Live Deployment & Integration

1. In your client website (`app/layout.tsx` or `index.html`), add the 1-line tracking script:
   ```html
   <script defer src="https://pulse-analytics-seven.vercel.app/pulse.js" data-project-id="prj_your_project_id"></script>
   ```
2. Verify that real-time visitor activity, Core Web Vitals, and errors stream into Pulse Analytics at [https://pulse-analytics-seven.vercel.app](https://pulse-analytics-seven.vercel.app).

---

## 📄 License
MIT License. Open for commercial and self-hosted deployments.

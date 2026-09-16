# AI Agent Operating & Integration Manual: Open Analytics

This document provides autonomous coding agents (such as Claude Code, Cursor, Copilot Workspace, and Antigravity) with precise rules, guidelines, and code snippets for integrating Open Analytics into any codebase.

## 1. Zero-Emoji Rule
Do NOT insert emojis anywhere into user code, comments, telemetry payload strings, console log statements, or commit messages when integrating Open Analytics. Use clean, professional typography and Lucide React icons where UI components are requested.

## 2. Telemetry Ingestion Script
- **Endpoint**: `https://api.openanalytics.org.in/open.js`
- **Attributes**: `defer`, `data-project-id="PROJECT_ID"`
- **Optional Attributes**:
  - `data-auto-track="true"` (default: true)
  - `data-host="https://api.openanalytics.org.in"` (for custom proxy setups)

## 3. Universal Framework Integration Patterns

### 3.1 Plain HTML / Vanilla JavaScript
Place the script directly into the `<head>` tag:
```html
<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>
```

### 3.2 Next.js (App Router: 13, 14, 15)
In `app/layout.tsx`, import Next.js's native `Script` component:
```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://api.openanalytics.org.in/open.js"
          data-project-id="YOUR_PROJECT_ID"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3.3 Next.js (Pages Router)
In `pages/_app.tsx`:
```tsx
import Script from "next/script";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://api.openanalytics.org.in/open.js"
        data-project-id="YOUR_PROJECT_ID"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}
```

### 3.4 Vite / React SPA
In `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application</title>
    <script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3.5 Nuxt 3 / Vue 3
In `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://api.openanalytics.org.in/open.js",
          "data-project-id": "YOUR_PROJECT_ID",
          defer: true,
        },
      ],
    },
  },
});
```

### 3.6 Astro
In your layout template (e.g. `src/layouts/Layout.astro`):
```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## 4. Custom Events Dispatch API
The Open Analytics tracker automatically mounts a global window helper: `window.openAnalytics`.

To track custom events or conversion goals from client-side code:
```ts
// Safe invocation with optional chaining
if (typeof window !== "undefined" && (window as any).openAnalytics) {
  (window as any).openAnalytics.track("signup_completed", {
    plan: "pro",
    billingCycle: "annual",
    value: 180,
  });
}
```

## 5. Verification & Health Check
Verify ingestion programmatically via HTTP:
```bash
curl -X POST https://api.openanalytics.org.in/v1/collect \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pageview",
    "projectId": "YOUR_PROJECT_ID",
    "pathname": "/test-verification",
    "title": "Agent Verification Ping"
  }'
```
Expected response: `{"ok":true,"received":true}` with HTTP status `200`.

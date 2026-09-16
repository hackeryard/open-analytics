import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";

  const content = `# Open Analytics
> Next-Generation Cookieless Web Observability & Performance Intelligence

## Overview
Open Analytics is a privacy-first web telemetry and observability engine engineered for modern web applications. At sub-3.2KB Brotli compressed (15x lighter than Google Analytics 4), it delivers zero cookie consent banner requirements, sub-second real-time streaming telemetry, autonomous AI search crawler radar, and native Real User Monitoring (Core Web Vitals).

- **Canonical URL**: ${baseUrl}
- **Telemetry Script Delivery**: https://api.openanalytics.org.in/open.js
- **Ingestion Endpoint**: https://api.openanalytics.org.in/v1/collect
- **License**: Enterprise & Open Source Core
- **Compliance**: 100% GDPR, CCPA, PECR, and Schrems II Compliant (Zero Cookies, 24-hour Cryptographic Rotating Salts)

## Core Capabilities
1. **Real User Monitoring (Core Web Vitals)**: Measures 75th-percentile (p75) field performance for Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) directly from real visitor devices.
2. **Autonomous AI & LLM Search Radar**: Autonomously detects, classifies, and tracks traffic and web crawler hits from generative answer engines including OpenAI SearchGPT, Perplexity AI, Claude (Anthropic), and Google Gemini.
3. **Behavioral UX Friction Intelligence**: Detects rapid user frustration events including Rage Clicks (repeated clicks on unresponsive elements) and Dead Clicks with exact DOM selector tracking.
4. **Automated Error & Exception Triage**: Collects uncaught frontend JavaScript exceptions and runtime errors with intelligent grouping and AI debug prompt generation.
5. **Universal 1-Line Embed**: Zero-dependency tracking script executes in under 2ms on mobile devices without blocking page rendering.

## Quickstart Integration
Add the following single script tag to the \`<head>\` of any HTML document:
\`\`\`html
<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="YOUR_PROJECT_ID"></script>
\`\`\`

### Next.js (App Router)
\`\`\`tsx
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
\`\`\`

## Pricing & Plans
- **Free Starter**: $0/mo. 10,000 events/month, 1 website, 100% core analytics, 30-day retention, zero cookies, community support.
- **Pro**: $19/mo ($15/mo billed annually). 250,000 events/month up to 2.5M+, 10 websites, AI Search Radar, Core Web Vitals RUM, Behavioral Rage Clicks, Error Crash Triage, 365-day (1-year) retention.
- **Enterprise**: Custom volume, dedicated isolated infrastructure, custom SLAs, unlimited team members, single sign-on (SSO).

## Key Links & Documentation
- **Features Overview**: ${baseUrl}/features
- **vs Google Analytics 4**: ${baseUrl}/vs-google-analytics
- **Pricing & Tier Calculator**: ${baseUrl}/pricing
- **Privacy Architecture & GDPR Guide**: ${baseUrl}/privacy
- **Frequently Asked Questions**: ${baseUrl}/faq
- **Developer Documentation**: ${baseUrl}/docs
- **Framework Installation Guide**: ${baseUrl}/docs/installation
- **Full LLM Context Specification**: ${baseUrl}/llms-full.txt
- **AI Agent Integration Instructions**: ${baseUrl}/agents.md
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

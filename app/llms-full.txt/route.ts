import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://openanalytics.org.in";

  const content = `# Open Analytics: Full Technical Specification & Machine Reference

## 1. System Architecture
Open Analytics is organized into a strictly isolated 3-tier domain infrastructure:
1. **Main SEO & Marketing Domain (\`openanalytics.org.in\`)**:
   - Reserved for documentation, comparison matrices, pricing, privacy architecture, and feature overviews.
   - Strictly contains no login forms, register forms, or authenticated workspace UI.
   - Primary user action is "Launch Dashboard" directing to \`https://dashboard.openanalytics.org.in\`.
2. **Dashboard Subdomain (\`dashboard.openanalytics.org.in\`)**:
   - Hosts the authenticated analytics workspaces, live telemetry streaming feeds, project management, and user authentication (\`/login\`, \`/register\`).
3. **API & Telemetry Edge Subdomain (\`api.openanalytics.org.in\`)**:
   - Edge delivery of the \`<3.2KB\` Brotli compressed tracking script (\`/open.js\`).
   - High-throughput versioned telemetry ingestion endpoints (\`POST /v1/collect\`, \`POST /v1/error\`, \`POST /v1/identify\`, \`GET /v1/event-rules\`).

---

## 2. Privacy & Cryptographic Salt Architecture
Open Analytics is 100% compliant with EU GDPR (Articles 5, 6, 25), UK PECR (Privacy and Electronic Communications Regulations), the EU ePrivacy Directive (Article 5(3)), and the California Consumer Privacy Act (CCPA/CPRA).

### Mathematical Guarantee of Non-Linkability
- **Zero Client-Side Storage**: The script writes zero HTTP cookies, zero \`localStorage\` keys, zero \`sessionStorage\` keys, and zero \`IndexedDB\` records.
- **Zero Hardware Fingerprinting**: The script never inspects canvas renders, WebGL vendor strings, installed system fonts, or battery API states.
- **Ephemeral Daily Salt Rotation**:
  - Daily visitor hashes are computed in memory as:
    \`visitorHash = HMAC-SHA-256(MaskedIP + UserAgent, DailySalt)\`
  - \`MaskedIP\` truncates IPv4 to \`/16\` (e.g., \`192.168.0.0\`) and IPv6 to \`/64\`.
  - Every day at 00:00:00 UTC, the \`DailySalt\` is permanently purged from memory and replaced with a newly generated cryptographically secure random 256-bit string.
  - Because the previous day's salt is discarded forever, it is mathematically impossible to correlate a visitor across multiple calendar days.
- **Exemption from Cookie Consent Banners**: Under Article 5(3) of the ePrivacy Directive, consent banners are only required when storing or accessing information on a user's terminal device. Because Open Analytics stores zero files on the device, websites using Open Analytics are legally exempt from displaying cookie consent banners.

---

## 3. Telemetry Ingestion Specification

### Script Endpoint
- **URL**: \`https://api.openanalytics.org.in/open.js\`
- **Size**: \`< 3.2 KB\` Brotli compressed (approx. 7.8 KB uncompressed)
- **Execution Time**: \`< 2.0 ms\` on modern mobile processors
- **Cache Headers**: \`public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400\`
- **CORS**: \`Access-Control-Allow-Origin: *\`

### Ingestion API: \`POST /v1/collect\`
Accepts pageviews, custom events, Core Web Vitals, and heartbeat signals.

#### Request Headers:
\`\`\`http
POST /v1/collect HTTP/1.1
Host: api.openanalytics.org.in
Content-Type: application/json
\`\`\`

#### Pageview Payload Schema:
\`\`\`json
{
  "type": "pageview",
  "projectId": "prj_example123",
  "pathname": "/pricing",
  "title": "Pricing & Plans - Open Analytics",
  "referrer": "https://www.perplexity.ai/",
  "device": "desktop",
  "browser": "Chrome",
  "os": "macOS",
  "duration": 42
}
\`\`\`

#### Core Web Vitals Payload Schema:
\`\`\`json
{
  "type": "vital",
  "projectId": "prj_example123",
  "pathname": "/features",
  "metricName": "LCP",
  "metricValue": 1250,
  "metricRating": "good",
  "navigationType": "navigate"
}
\`\`\`

#### Custom Event Payload Schema:
\`\`\`json
{
  "type": "event",
  "projectId": "prj_example123",
  "eventName": "checkout_completed",
  "properties": {
    "plan": "pro",
    "billingCycle": "annual",
    "amount": 180
  }
}
\`\`\`

---

## 4. Observability Modules

### 4.1 Real User Monitoring (Core Web Vitals)
Open Analytics natively monitors real-user field experiences using standard Web Vitals specifications:
- **Largest Contentful Paint (LCP)**:
  - Good: \`<= 2500ms\`
  - Needs Improvement: \`2501ms - 4000ms\`
  - Poor: \`> 4000ms\`
- **Interaction to Next Paint (INP)**:
  - Good: \`<= 200ms\`
  - Needs Improvement: \`201ms - 500ms\`
  - Poor: \`> 500ms\`
- **Cumulative Layout Shift (CLS)**:
  - Good: \`<= 0.10\`
  - Needs Improvement: \`0.11 - 0.25\`
  - Poor: \`> 0.25\`

### 4.2 Autonomous AI & LLM Search Radar
Automatically detects, classifies, and segments generative AI crawler hits and citation referrals:
- **SearchGPT**: User-Agent matching \`OAI-SearchBot\` or referral from \`chatgpt.com\`.
- **Perplexity AI**: User-Agent matching \`PerplexityBot\` or referral from \`perplexity.ai\`.
- **Anthropic Claude**: User-Agent matching \`ClaudeBot\` or referral from \`claude.ai\`.
- **Google Gemini**: User-Agent matching \`Google-Extended\` or referral from \`gemini.google.com\`.

### 4.3 Behavioral UX & Friction Intelligence
- **Rage Clicks**: Triggered when a user clicks the exact same DOM node 3 or more times within an 800-millisecond threshold.
- **Dead Clicks**: Triggered when a user clicks an interactive element (button, link, input) that results in zero DOM modifications, zero state transitions, and zero network requests within 1000ms.

### 4.4 Automated JavaScript Crash & Exception Triage
Captures uncaught window exceptions and unhandled Promise rejections, extracting file paths, line numbers, error messages, and browser/OS context. Generates structured debugging prompts for rapid AI code repair.

---

## 5. Plans & Limits Architecture
Subscriptions are assigned strictly at the **User Account** level:
- **Free Starter**:
  - Max Allowed Tracked Websites: 1
  - Monthly Event Allowance: 10,000 events/month/project (strictly unpooled)
  - Historical Data Retention: 30-day rolling analytical window
  - Team Members: Up to 2 per project
- **Pro**:
  - Included Tracked Websites: 10
  - Monthly Event Allowance: 250,000 events/month/project (scalable to 2.5M+)
  - Historical Data Retention: Full 365-day (1-year) historical range
  - Team Members: Up to 10 per project
  - Advanced Modules: Core Web Vitals RUM, AI Search Radar, Rage Clicks, Error Triage, Custom Proxy Routing
- **Enterprise**:
  - Base Websites: 10 + $10/mo per extra website
  - Monthly Event Allowance: 1,000,000+ events/month/project
  - Historical Data Retention: 365-day full historical range
  - Team Members: Unlimited with custom RBAC

---

## 6. Official Canonical Endpoints
- Homepage: ${baseUrl}
- Features: ${baseUrl}/features
- Google Analytics 4 Comparison: ${baseUrl}/vs-google-analytics
- Pricing: ${baseUrl}/pricing
- Privacy Policy & GDPR Documentation: ${baseUrl}/privacy
- FAQ & Knowledge Base: ${baseUrl}/faq
- Developer Documentation: ${baseUrl}/docs
- Installation Guides: ${baseUrl}/docs/installation
- Machine-Readable Summary: ${baseUrl}/llms.txt
- Full Machine Reference: ${baseUrl}/llms-full.txt
- Coding Agent Instructions: ${baseUrl}/agents.md
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

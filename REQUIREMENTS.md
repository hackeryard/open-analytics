# System Requirements & Technical Specifications: Open Analytics

## 1. Environment & Infrastructure Prerequisites

| Component | Minimum Requirement | Recommended |
| :--- | :--- | :--- |
| **Node.js** | v18.17.0+ | v20.x LTS |
| **Package Manager** | npm v9+ or yarn v1.22+ | yarn / pnpm |
| **Database** | MongoDB v6.0+ | MongoDB v7.0+ or MongoDB Atlas |
| **Memory (RAM)** | 1 GB for local development | 2 GB+ for production server |
| **Disk Space** | 500 MB for node_modules | SSD storage for database indexes |

---

## 2. Environment Variables Configuration

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/open_analytics` |
| `JWT_SECRET` | Yes | Secret key for signing session tokens | `32+ characters random string` |
| `NEXT_PUBLIC_APP_URL` | Yes | Root URL of hosted dashboard | `https://openanalytics.org.in` |
| `NEXT_PUBLIC_API_URL` | Optional | Dedicated API & telemetry subdomain | `https://api.openanalytics.org.in` |
| `NODE_ENV` | Optional | Runtime environment | `development` / `production` |
| `PAYMENT_PROVIDER` | Optional | Active payment gateway provider (`manual` / `razorpay`) | `manual` (default for temporary offline launch) |
| `RAZORPAY_KEY_ID` | Optional | Razorpay API Key ID (Server) | `rzp_test_...` / `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay API Key Secret (Server) | Secret token from Razorpay dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Optional | Razorpay Webhook HMAC secret | Custom secret set in Razorpay webhooks |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Public Razorpay Key ID for client checkout | `rzp_test_...` / `rzp_live_...` |

---

## 3. Data Schemas & Model Contracts

### 3.0 `User` Collection
- `name` (String): User's full name.
- `email` (String, Unique, Index): User's email address.
- `role` (String, Enum: `"super_admin" | "admin" | "editor" | "member"`): User global role.
- `plan` (String, Enum: `"free" | "pro" | "enterprise"`): Active subscription tier (default: `"free"`).
- `planExpiresAt` (Date, Nullable): Expiration date of current paid subscription.
- `billingCycle` (String, Enum: `"monthly" | "annual"`): Billing interval.
- `extraProjectsAllowed` (Number): Extra website slots beyond base limit for Enterprise/add-ons.
- `subscriptionStatus` (String, Enum: `"active" | "trialing" | "past_due" | "canceled" | "expired"`).
- `razorpayCustomerId` (String): Associated Razorpay customer reference.
- `razorpayPaymentId` (String): Latest successful payment ID (`pay_...`).
- `razorpayOrderId` (String): Latest verified Razorpay order ID (`order_...`).
- `lockedActiveProjectId` (String): Designated active tracking website locked when user is on Free plan with multiple projects.
- `activeProjectSelectedAt` (Date, Nullable): Timestamp when the active website was locked.

### 3.0.1 `SubscriptionPlan` Collection
- `planId` (String, Unique): Plan identifier (e.g. `pro-monthly`, `pro-annual`, `enterprise-monthly`, `enterprise-annual`).
- `name` (String): Display name.
- `slug` (String): Identifier slug.
- `tier` (String, Enum: `"free" | "pro" | "enterprise"`).
- `price` (Number): Price in INR.
- `currency` (String, default: `"INR"`).
- `billingInterval` (String, Enum: `"monthly" | "annual"`).
- `features` (Array of Strings): Marketing feature bullets.
- `maxProjects` / `monthlyEventsPerProject` / `maxMembersPerProject` / `retentionDays` (Numbers): Plan limits.
- `isActive` (Boolean): Plan availability status.

### 3.0.2 `SubscriptionRequest` Collection
- `userId` (ObjectId, ref: User): Requester user ID.
- `userEmail` (String): User email address.
- `planId` / `planName` / `tier` / `billingInterval`: Requested plan specifications.
- `price` / `currency`: Verified plan price snapshot at time of request.
- `status` (String, Enum: `"requested" | "contacted" | "payment_pending" | "completed" | "rejected" | "cancelled"`).
- `message` (String): Optional user notes or enterprise requirements.
- `adminNotes` (String): Internal administrator notes.
- `subscriptionId` (ObjectId, ref: Subscription, Nullable): Created subscription upon approval.
- `paymentId` (ObjectId, ref: Payment, Nullable): Associated verified payment record.

### 3.0.3 `Subscription` Collection
- `userId` (ObjectId, ref: User): Subscriber user ID.
- `planId` (String): Plan identifier.
- `planTier` (String, Enum: `"pro" | "enterprise"`).
- `billingCycle` (String, Enum: `"monthly" | "annual"`).
- `status` (String, Enum: `"active" | "past_due" | "canceled" | "expired"`).
- `startDate` (Date): Subscription start timestamp.
- `endDate` (Date): Subscription expiry timestamp.
- `paymentProvider` (String, default: `"manual"`): Payment provider identifier (`"manual" | "razorpay"`).
- `paymentId` (ObjectId, ref: Payment): Primary payment record.

### 3.0.4 `Payment` Collection
- `userId` (ObjectId, ref: User): User ID.
- `requestId` (ObjectId, ref: SubscriptionRequest): Originating request.
- `subscriptionId` (ObjectId, ref: Subscription): Granted subscription.
- `amount` / `currency`: Transaction value in INR.
- `status` (String, Enum: `"pending" | "paid" | "failed" | "refunded"`).
- `provider` (String, Enum: `"manual" | "razorpay"`).
- `providerPaymentId` (String): Reference ID or transaction receipt.
- `paidAt` (Date): Verification timestamp.
- `recordedByAdminId` (ObjectId, ref: User): Administrator who verified funds.
- `notes` (String): Verification memo.

### 3.0.5 `SubscriptionAuditLog` Collection
- `adminId` (ObjectId, Nullable): Admin who performed action.
- `action` (String): Event type (`request_created`, `request_updated`, `request_cancelled`, `subscription_activated`, `subscription_expired`).
- `affectedUserId` (ObjectId): Target subscriber ID.
- `requestId` / `subscriptionId` / `paymentId`: Related document references.
- `metadata` (Mixed): Action payload snapshot.

### 3.1 `Project` Collection
- `projectId` (String, Unique, Index): Project identifier (e.g. `prj_abc123`).
- `name` (String): Human-readable workspace name.
- `slug` (String, Lowercase): URL-safe slug.
- `ownerId` (ObjectId, ref: User): Primary project owner.
- `members` (Array of objects): List of `{ userId: ObjectId, role: "admin" | "editor" | "member" }`.
- `publishableKey` (String, Unique): Public client key (`pk_live_...`).
- `secretKey` (String): Server-side ingestion secret (`sk_live_...`).
- `settings`: Object containing:
  - `ipAnonymization`, `piiRedaction`, `dataRetentionDays`, and `errorRules`.
  - `alertSettings`: Incident alerting preferences:
    - `errorThreshold` (Number, default: 5): Occurrence count to trigger repeated error alert.
    - `errorRepeatedAlerts` (Boolean): Toggle for repeated crash spikes (5x+).
    - `errorStormAlerts` (Boolean): Toggle for velocity error storm alerts (>10/5m).
    - `seoTitleAlerts` (Boolean): Toggle for missing SEO title audits.
    - `aeoDwellAlerts` (Boolean): Toggle for AEO low-dwell retention friction audits.
    - `geoRadarAlerts` (Boolean): Toggle for GEO AI citation radar audits.
    - `webVitalsAlerts` (Boolean): Toggle for Core Web Vitals degradation alerts.
    - `rageClicksAlerts` (Boolean): Toggle for behavioral rage click hotspots.
    - `desktopAlerts` (Boolean): Desktop notification delivery preference.
    - `ignoredTypes` (Array of Strings): List of muted notification types.
    - `ignoredRules` (Array of Objects): Granular suppression rules `{ id, name, type, matchField, matchType, pattern, enabled, createdAt }`.
- `projectId` (String, Indexed): Multi-tenant isolation key.
- `pathname` (String, Indexed): Active URL route path.
- `visitorId` (String, Indexed): Persistent client UUID stored in localStorage.
- `sessionId` (String, Indexed): Ephemeral session UUID reset after 30m idle.
- `duration` / `activeDuration` / `idleDuration` (Number): Dwell telemetry in seconds.
- `scrollDepth` (Number, 0-100): Maximum vertical scroll percentage.
- `isBounce` (Boolean): True if visitor only performed a single hit in session.
- `isReturning` (Boolean): True if visitor has visited before.
- `visitCount` (Number): Cumulative visit sequence number.
- `webVitals`: Object with `lcp`, `inp`, `cls`, `fcp`, `ttfb` metrics in milliseconds.
- `hardware`: Object with `memory`, `cores`, `gpu`, `dpr`, `viewport`.
- `network`: Object with `effectiveType` (5G/4G), `downlink`, `rtt`.

### 3.3 `SystemError` Collection
- `projectId` (String, Indexed): Multi-tenant isolation key.
- `message` (String): Error message string.
- `stack` (String): Full error stack trace.
- `errorType` (String): E.g. `TypeError`, `NetworkError`, `UnhandledRejection`.
- `pathname` (String): Route where error occurred.
- `occurrences` (Number): Frequency counter.
- `status` (Enum: `"new"` | `"investigating"` | `"resolved"` | `"ignored"`).
- `breadcrumbs` (Array): Circular buffer of preceding user actions.

### 3.4 `Notification` Collection
- `projectId` (String, Index): Target project identifier.
- `userId` (String, Optional, Index): Specific user identifier.
- `title` (String): Notification headline.
- `message` (String): Detailed description of anomaly or optimization suggestion.
- `type` (Enum: `"error_repeated" | "error_storm" | "seo_unoptimized" | "aeo_unoptimized" | "geo_radar" | "web_vitals" | "rage_clicks" | "quota_warning" | "system"`).
- `severity` (Enum: `"critical" | "warning" | "info"`).
- `metadata` (Mixed): Associated errorId, pathname, occurrences, metric scores.
- `actionUrl` (String): Internal routing path to inspect or resolve the issue.
- `actionLabel` (String): CTA button text.
- `read` (Boolean, Index): Read state.
- `readAt` (Date, Nullable): Read timestamp.
- `dismissed` (Boolean, Index): Dismissed state.
- `fingerprint` (String, Index): Unique signature used for 24-hour cooldown deduplication.
- `createdAt` (Date, TTL 365 days): Document creation timestamp.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Action / Capability | Member | Editor | Admin | Owner | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Analytics & Real-Time Streams | Yes | Yes | Yes | Yes | Yes |
| View Errors & Behavioral Signals | Yes | Yes | Yes | Yes | Yes |
| Update Error Triage Status | No | Yes | Yes | Yes | Yes |
| Manage Error Suppression Rules | No | Yes | Yes | Yes | Yes |
| Modify Project Settings & Domains | No | No | Yes | Yes | Yes |
| Invite / Remove Team Members | No | No | Yes | Yes | Yes |
| Transfer Project Ownership | No | No | No | Yes | Yes |
| Permanently Delete Project | No | No | No | Yes | Yes |

---

## 5. Security & Privacy Compliance

1. **Cookieless Tracking**: The client script (`open.js`) operates without storing tracking cookies, using `localStorage` and `sessionStorage` strictly for pseudo-anonymous session coherence.
2. **GDPR/CCPA IP Anonymization**: When enabled, the last octet of IPv4 addresses is masked (`192.168.1.0`) and IPv6 addresses are truncated.
3. **Automated PII Sanitization**: URL query parameters containing tokens, password fields, or email identifiers are stripped before ingestion.
4. **CORS Origin Whitelisting**: Public endpoints validate `Origin` / `Referer` headers against `project.allowedDomains` with automatic apex and `www` subdomain equivalence matching.

---

## 6. Client Script & SDK API Contract

### 6.1 Script Tag Attributes
- `src`: Hosted script URL (e.g. `https://your-domain.com/open.js`).
- `data-project-id`: Target workspace project identifier (`prj_...`).
- `data-endpoint`: Optional server base URL if script is hosted on CDN/subdomain.
- `data-api-key`: Optional publishable API key (`pk_live_...`).

### 6.2 Global SDK Methods (`window.OpenAnalytics`)
- `track(eventName: string, properties?: object, value?: number)`: Ingests custom business/conversion events.
- `identify(userId: string, traits?: object)`: Binds persistent user identifier and traits to current visitor session.
- `captureError(err: Error | string, context?: object)`: Forwards manual errors, stack traces, and component stacks to error triage.
- `track404(pathname?: string, referrer?: string)`: Records broken link/not-found occurrences.
- `page(pathname?: string)`: Manually triggers pageview transitions for custom routing architectures.

---

## 7. Frontend Design System & Typography Specification

1. **Obsidian Dark Color Palette**:
   - Canvas Background: `#090a0f` (`--background`)
   - Card / Panel Surface: `#111218` (`--card`)
   - Secondary / Header Surface: `#0e0f15` (`--secondary`)
   - Muted Controls / Interactive Tracks / Popovers: `#181922` (`--muted`)
   - Razor-Thin Borders: `#20222c` / `rgba(255, 255, 255, 0.08)` (`--border` / `border-white/[0.08]`)
   - Accent & Primary CTA: Solid high-contrast white `#ffffff` (`bg-white text-zinc-950 hover:bg-zinc-200`)
2. **Typography**:
   - Typeface: Plus Jakarta Sans (`--font-sans`) paired with JetBrains Mono (`--font-mono`) loaded via `next/font/google`.
   - Numerical Data & Metrics: Strictly formatted with tabular numerals (`tabular-nums font-semibold text-white`).
3. **Component Architecture & Surface Rules**:
   - **Zero-Template Mandate**: Zero generic AI neon rainbow gradients, zero muddy navy blue cards, and complete eradication of legacy `bg-card` classes across all components.
   - **Tactile High-Contrast CTAs**: Primary action buttons must use `bg-white text-zinc-950 hover:bg-zinc-200 font-medium`.
   - **Non-Transparent Surfaces**: Solid opaque backgrounds for all popovers, dropdowns, dialogs, and modals (`#111218`, `#0e0f15`, `#181922`) to eliminate visual bleed-through.
   - **Decluttered Sidebar Navigation**: Badges restricted strictly to actionable notifications (unread alerts, active crash errors).
   - **Executive Cockpit (2-Tier)**: 4 Hero KPI cards (Pageviews, Visitors, Realtime, Dwell) and 3 Telemetry Health cards (Loyalty, CWV LCP, Crash-Free Rate).
   - **All 7 Cockpit Widgets**: `TopPagesWidget`, `WebVitalsRadarWidget`, `AiAndErrorWidget`, `TrafficChannelsWidget`, `LiveStreamWidget`, `GeoWidget`, and `DeviceBreakdownWidget` standardized to obsidian precision cards.
   - **All 15+ Workspace Sections**: Live Feed, Errors, Events, Web Vitals, Behavioral UX, AI Visibility, Pages, Acquisition, Audience, Tech, User Journeys, Geo Analytics, Virtual Labs, SEO, and Project Settings must use solid `#111218` cards and hairline borders.
   - **Public Domain Presentation**: Clean 5-card Bento Grid showcase on landing page, precision marketing cards on `/features`, `/pricing`, `/vs-google-analytics`, `/privacy`, `/faq`, and unified sticky sidebar layout for all `/docs/*` guides.
4. **Zero-Emoji Rule**:
   - Strictly zero emojis across all code, UI components, status badges, and documentation. Lucide React icons only.

---

## 8. SEO, GEO & AEO Specification for Main Domain Pages

1. **Title Tag Standards**:
   - Every public main domain page must render an HTML `<title>` tag strictly between **50 and 60 characters**.
   - With the root layout title template (`%s | Open Analytics`, 17 characters), child page titles must strictly be **33 to 43 characters long**.
   - No child page title may include the brand suffix `| Open Analytics` to prevent duplicate branding.
2. **Meta Description Standards**:
   - Every public page must define a `<meta name="description">` strictly between **140 and 160 characters**.
3. **Client/Server Decoupling Rule**:
   - Next.js prohibits exporting `Metadata` from Client Components (`"use client"`).
   - Any public page requiring interactive client state (search filters, copy buttons, tabs) must be decoupled into a Server Component `page.tsx` (for `Metadata` and `JsonLd` schemas) and a companion client component (e.g. `*ClientView.tsx`).
4. **Structured Schema (JSON-LD) Graph Requirements**:
   - Every page must inject contextual Schema.org data:
     - Root Layout: `WebSite` (with `potentialAction: SearchAction`) and `SoftwareApplication` (with `aggregateRating`, `softwareVersion`, and multi-tier `offers`).
     - Landing & Marketing Pages: `BreadcrumbList`, `WebPage`, `Product`, `ItemList`, and `FAQPage` (with real questions/answers for direct AI answer engine synthesis).
     - Documentation & Technical Comparison Pages: `BreadcrumbList`, `TechArticle`, and `HowTo` schemas.
5. **AI Search Crawler User-Agents Support**:
   - `robots.ts` and `sitemap.ts` must explicitly allow and catalog all primary LLM crawler agents: `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`, and `Bytespider`.


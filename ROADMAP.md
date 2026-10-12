# Product Roadmap: Open Analytics

## Product Vision
To build the most developer-friendly, high-performance, and visually stunning analytics & observability platform that provides deep behavioral insights and crash monitoring without requiring complex setups or heavy client SDKs.

---

## Completed Milestones

### Phase 1: Core Telemetry & Ingestion Engine (Completed)
- [x] Zero-dependency client tracking script (`public/open.js`, ~12KB).
- [x] Automated pageview capture, active vs. idle dwell timing, and vertical scroll tracking.
- [x] Multi-tenant database indexing with isolated project tokens.
- [x] Core Web Vitals RUM measurement (LCP, INP, CLS, FCP, TTFB).

### Phase 2: Behavioral UX & Crash Observability (Completed)
- [x] Rage click detection algorithm (≥3 rapid clicks within 500ms and 40px radius).
- [x] Desktop exit intent detection and outbound link click tracking.
- [x] Universal error tracking (uncaught runtime errors, unhandled promise rejections, resource loading failures, 4xx/5xx API failures).
- [x] Circular user action breadcrumbs.
- [x] AI-powered bug fix prompt generator for coding assistants.
- [x] Edge error suppression rules (`contains`, `exact`, `regex`, `starts_with`).

### Phase 3: Audience Intelligence & Navigation Flows (Completed)
- [x] Comprehensive Audience & Loyalty Directory (`/audience`, `/visitors`) with dynamic Loyalty Score (0–100) and 4 tiers.
- [x] Multi-step User Journeys & navigation transitions analysis (`/journeys`).
- [x] Top Routes performance hub with traffic distribution visualization and CSV export (`/pages`).
- [x] Real-time live feed telemetry stream with multi-interval polling and raw payload inspector (`/live-feed`).

### Phase 4: Project Governance & Multi-Tenancy (Completed)
- [x] Project creator automatic Admin & Owner assignment.
- [x] Secure Project Ownership Transfer API & UI (`POST /api/projects/[projectId]/transfer-ownership`).
- [x] Dedicated Project Directory & Governance Hub (`/projects`).
- [x] Granular 4-Tier Role-Based Access Control (Owner, Admin, Editor, Member, Super Admin).

### Phase 5: Global Design Standardization (Completed)
- [x] Strict Zero-Emoji standard across all views, prompts, and components.
- [x] Dark-mode glassmorphism design tokens with Lucide React iconography.

### Phase 6: Subdomain Architecture, Retention & Ingestion Engine (Completed)
- [x] 3-tier domain isolation (`openanalytics.org.in`, `dashboard.openanalytics.org.in`, `api.openanalytics.org.in`).
- [x] Dedicated edge script delivery (`https://api.openanalytics.org.in/open.js`) with global CORS.
- [x] Versioned telemetry collector (`/v1/collect`, `/v1/error`, `/v1/identify`, `/v1/event-rules`).
- [x] Permanent 365-day TTL index across MongoDB raw telemetry collections.
- [x] Plan-based query boundaries (30-day Free vs 365-day Pro & Enterprise historical windows).
- [x] 2-step Email OTP verification flow for user registration.
- [x] Cross-platform workflow scripts (`pull.js`, `push.js`, `sync.js`, `create-pr.js`, `kill-port.js`, `test-subdomain.js`, `purge-retention.js`).

### Phase 7: User-Level Subscriptions & Quota Enforcement (Completed)
- [x] Subscription model migrated from project to user (`user.plan`, `planExpiresAt`, `billingCycle`).
- [x] Strict website ceilings: 1 website for Free, 10 websites for Pro, + add-on websites for Enterprise.
- [x] Unpooled per-project event quotas (10k Free, 250k Pro, 1M Enterprise).
- [x] Project Owner plan inheritance: Team members enjoy Pro on owner's projects without cross-account leakage.
- [x] User plan management and billing APIs (`/api/user/plan`).
- [x] Dedicated Billing & Subscription Management Hub (`/billing`).
- [x] Developer Profile & Account Management Hub (`/profile`).
- [x] Quota-based project creation modal blocking and proactive `LimitReachedModal` upgrade prompt.
- [x] Expired plan multi-project active website selection with permanent lock on Free tier and live telemetry pausing (`/v1/collect`, `/v1/error`).
- [x] Team member ceiling enforcement (max 2 members on Free tier) on projects inheriting expired plans.

### Phase 8: Razorpay Payment Gateway & Checkout Pipeline (Completed)
- [x] End-to-end Razorpay Standard Checkout SDK integration on `/billing` dashboard page.
- [x] Support for UPI (Google Pay, PhonePe, Paytm, BHIM, QR code), netbanking, domestic and international cards.
- [x] Cryptographic Razorpay Order creation API (`POST /api/billing/razorpay/order`).
- [x] HMAC SHA-256 signature verification and automated plan activation (`POST /api/billing/razorpay/verify`).
- [x] Asynchronous background webhook reconciliation for `payment.captured` and `order.paid` (`POST /api/billing/razorpay/webhook`).
- [x] Interactive Monthly vs. Annual subscription cycle selector with 2-months-free discount tiering.
- [x] Automatic unlocking of project slots (10 websites included) and reactivation of paused project telemetry upon successful upgrade.

### Phase 9: Temporary Provider-Independent Subscription System (Completed)
- [x] Decoupled `PaymentProvider` abstraction layer (`ManualPaymentProvider`, `RazorpayPaymentProvider`).
- [x] Standalone subscription schema models (`SubscriptionPlan`, `SubscriptionRequest`, `Subscription`, `Payment`, `SubscriptionAuditLog`).
- [x] Dynamic plan seeding and server-side authority (`getUserActiveSubscription`, `hasActiveSubscription`).
- [x] User-side "Request Subscription" workflow with offline payment notice and live status tracker on `/billing`.
- [x] Downgrade confirmation dialog protecting against accidental plan downgrades.
- [x] Administrator review and verification hub (`/admin/subscriptions`) with audit logging.

---

## Active & Upcoming Milestones

### Phase 10: Conversion Funnels & Goal Tracking (In Progress)
- [ ] Visual multi-step conversion funnel builder with drop-off percentage calculations.
- [ ] Goal conversion tracking linked to custom business events and revenue attribution.
- [ ] A/B test variant tracking and statistical significance indicators.

### Phase 11: Automated Alerting & Notification Center (Completed)
- [x] Autonomous real-time error alert triggers on repeated crash occurrences (≥ 5x threshold with brackets at 10x, 25x, 50x, 100x+).
- [x] Error velocity and storm spike detection (> 10 errors/5m threshold).
- [x] SEO & AEO optimization audits (missing page titles, low dwell, and high bounce routes).
- [x] GEO & AI search radar readiness alerts (citation readiness score < 50%).
- [x] Core Web Vitals degradation warnings (LCP > 2.5s, CLS > 0.25).
- [x] Behavioral UX rage click hotspot warnings (≥ 3 rage clicks).
- [x] In-app top navbar Notification Center popover with live unread badge and quick filters.
- [x] Dedicated Alerts & Notification Hub (`/notifications`) with customizable alert rules & thresholds.
- [x] Native OS Desktop Notifications (Web Notification API) with synthesized Web Audio chimes and 45-second background sync.
- [x] Automated in-app Browser Notification Permission Prompt banner with 1-click allow and session snooze.
- [x] Granular Notification Ignore & Suppression System with 7 general category toggles and custom pattern rules (contains, exact, prefix, regex).
- [x] 1-Click inline mute menus (`BellOff`) on notification cards and popover items.
- [x] Zero-transparency solid UI surfaces (`bg-[#080d1a]`, `bg-[#0b1120]`) for popovers, modals, and prompts.
- [x] Mobile-first responsive navigation bar and interactive one-tap header & drawer project switcher.
- [x] 24-hour fingerprint cooldown deduplication and 365-day TTL index.
- [ ] External incident alerts via Slack, Discord, and Telegram webhooks.
- [ ] Daily/Weekly executive summary email reports.

### Phase 12: World-Class Obsidian & Precision Design System (Completed)
- [x] Full UI/UX visual overhaul from generic AI template clichés to Obsidian & Precision developer aesthetic (inspired by Linear, Vercel, Raycast).
- [x] Plus Jakarta Sans (`--font-sans`) and JetBrains Mono (`--font-mono`) typography integration via `next/font/google` with tabular numbers across all KPI metrics.
- [x] Solid obsidian dark surfaces (`#090a0f`, `#111218`, `#0e0f15`, `#181922`) with razor-thin borders (`rgba(255,255,255,0.08)`) and inset bevel highlights.
- [x] Complete eradication of legacy `bg-card` classes across 100% of codebase files.
- [x] 5-card Bento Grid Showcase on main domain landing page with telemetry simulator, CWV gauges, AI crawler radar, and crash triage.
- [x] Clutter-free sidebar navigation: stripped out 10+ noisy non-actionable badges, retaining badges strictly for actionable signals (unread alerts, active errors).
- [x] Balanced 2-tier executive overview grid (4 primary hero stats + 3 secondary health cards) replacing cramped 7-column row.
- [x] Modernized all 7 core overview cockpit widgets (`TopPagesWidget`, `WebVitalsRadarWidget`, `AiAndErrorWidget`, `TrafficChannelsWidget`, `LiveStreamWidget`, `GeoWidget`, `DeviceBreakdownWidget`).
- [x] Redesigned all dedicated workspace sections: Live Feed (all 1839 lines), Errors Triage, Custom Events, Core Web Vitals, Behavioral UX, AI Visibility, Top Pages, Acquisition Channels, Audience & Loyalty, Technology & Hardware, User Journeys, Geo Analytics, Virtual Labs, SEO Monitoring, and Script Installation.
- [x] Redesigned all public marketing and documentation pages (`/features`, `/pricing`, `/vs-google-analytics`, `/privacy`, `/faq`, `/docs`, `/docs/web-vitals`, `/docs/verification`, `/docs/seo-aeo`, `/docs/installation`, `/docs/alerts`).
- [x] Redesigned authentication & profile interfaces (`/login`, `/register`, `/profile`) with solid obsidian panels and high-contrast inputs.
- [x] High-contrast tactile white CTA buttons and clean obsidian workspace switcher popovers across desktop and mobile.

### Phase 13: Main Domain Full SEO, GEO & AEO Optimization (Completed)
- [x] Systematic optimization of all 12 main domain routes (`/`, `/features`, `/pricing`, `/vs-google-analytics`, `/privacy`, `/faq`, `/docs`, `/docs/installation`, `/docs/verification`, `/docs/web-vitals`, `/docs/seo-aeo`, `/docs/alerts`).
- [x] Rendered HTML title tags calibrated strictly between 50 and 60 characters with zero duplicate branding (`%s | Open Analytics`).
- [x] Meta description tags calibrated strictly between 140 and 160 characters.
- [x] Client/Server component decoupling across all interactive public pages (`FaqClientView`, `DocsOverviewClientView`, `InstallationClientView`, `VerificationClientView`, `AlertsDocsClientView`) enabling static server metadata rendering.
- [x] Full JSON-LD structured schemas (`WebSite`, `SoftwareApplication`, `Product`, `TechArticle`, `HowTo`, `FAQPage`, `BreadcrumbList`, `ItemList`) for AI search answer engines (SearchGPT, Perplexity, Claude, Gemini).
- [x] Updated `robots.ts` and `sitemap.ts` with explicit allow rules for major LLM bot user-agents and full docs subroute indexing.

### Phase 14: Telemetry Synchronization & Ingestion Resilience (Completed)
- [x] Unified `timeRange` and `range` query parameter handling across analytics and pageview routes.
- [x] Continuous timeline backfilling (hourly zero-fill for 1-day windows, daily zero-fill for multi-day spans).
- [x] Aligned date filter boundaries with UTC midnight for MongoDB aggregation parity.
- [x] Multi-day window shifting on preset ranges (`7d`, `30d`) in DateRangeNavigator.
- [x] Apex & WWW domain equivalence matching in project authentication to eliminate 403 errors.
- [x] Client script re-entrancy protection and safe default API endpoint fallback (`https://api.openanalytics.org.in`).
- [x] SPA router history navigation deduplication on `replaceState` and `popstate`.
- [x] Cloud serverless DNS resolver isolation preventing port 53 timeouts.
- [x] Next.js App Router `<body>` script placement for reliable SSR hydration.

### Phase 15: Developer Knowledgebase & Privacy Architecture Redesign (Completed)
- [x] Full Obsidian Precision knowledgebase transformation of `/faq`.
- [x] Responsive 2-column Bento layout with sticky category navigator, item count badges, and telemetry architecture spec sheet.
- [x] Real-time command-center search with keyboard shortcuts (`/`, `Ctrl+K`, `Escape`), active search tags, and match counter.
- [x] Deep anchor linking (`#id`) with 1-click clipboard copy indicator and auto-expansion on direct URL hash navigation.
- [x] Interactive syntax-highlighted code snippets for script installation, custom conversion tracking, and reverse-proxy configurations.
- [x] Micro architecture spec chips (`<3.2 KB`, `0 Cookies`, `100% Exempt`, `Real-Time AI Radar`) and tactile Obsidian CTA console.
- [x] Instant feedback widget ("Was this answer helpful?") with active state feedback.
- [x] Consolidated FAQ JSON-LD Schema.org graph eliminating redundant layout schemas.
- [x] Full Obsidian Precision redesign of Privacy & GDPR architecture hub (`/privacy`).
- [x] Multi-regulation compliance explorer tabs (`EU GDPR`, `ePrivacy & PECR`, `Schrems II`, `CCPA/CPRA`, `365-Day Retention`).
- [x] 3-step visual cryptographic salt pipeline (`Volatile RAM Masking`, `HMAC-SHA-256`, `00:00:00 UTC Destruction`).
- [x] Interactive customer Privacy Policy clause and DPA terms generator with 1-click clipboard copy.

### Phase 16: AI Visibility & LLM Citation Benchmark Hub (Completed)
- [x] Comprehensive AI Visibility & Citation Hub (`components/AiVisibilityModule.tsx`) with 4-tab workflow:
  - `AI Crawler Radar`: Real-time detection & scrape ranking for 12+ AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Bytespider`, `Applebot`, `Google-Extended`).
  - `LLM Citations & Referrals`: Distinct Answer Engine attribution separating human citation visits (from ChatGPT, Perplexity, Claude) from crawler hits.
  - `Robots.txt & /llms.txt AI Policy Generator`: Interactive bot access matrix with 1-click `robots.txt` configuration and `/llms.txt` machine manifest export.
  - `GEO Readiness Audit`: Diagnostic evaluation of Schema.org JSON-LD coverage, crawler accessibility, and scraper TTFB performance.
- [x] Public Features showcase upgrade (`components/public/FeaturesClientView.tsx`) with interactive preview card featuring Live Feed, AI Citations, /llms.txt validator, and Bot Matrix.
- [x] Technical developer documentation expansion (`app/docs/seo-aeo/page.tsx`) with answer engine attribution guides and machine protocol standards.

### Phase 16.1: Devices & Hardware Diagnostics Executive Matrix (Completed)
- [x] Dedicated `/devices` workspace URL migration with permanent HTTP 301/308 redirects from legacy `/tech`.
- [x] 5 Executive KPI telemetry cards (`Primary Form Factor`, `Top Web Browser`, `Dominant Platform`, `WebGL Hardware GPU`, `5G / Fast Cellular`).
- [x] Proportional segmented device distribution bar with interactive device category breakdown.
- [x] Interactive tabbed navigation (`All Diagnostics`, `Form Factors & Displays`, `Browsers & Engines`, `Operating Systems`, `Hardware & WebGL GPU`, `Network & 5G`).
- [x] Real-time search query filtering and sorting controls (Share High-to-Low, Low-to-High, Alphabetical A-Z).
- [x] WebGL GPU vendor normalization (Apple Silicon, NVIDIA, AMD, Intel, Qualcomm, ARM Mali) and screen aspect ratio detector.
- [x] 1-Click CSV telemetry export for device and hardware diagnostics.

### Phase 19: Master Plan — Phase 1 Foundation Architecture (Completed)
- [x] Finalized product positioning: "Open-source web analytics and observability for modern websites."
- [x] Formalized 5 core product pillars: Web Analytics, RUM, Behavioral UX, Frontend Observability, and AI Visibility.
- [x] Central Route Registry (`lib/seo/routes.ts`), Metadata Constructor (`lib/seo/metadata.ts`), and Schema Architecture (`lib/seo/schema.ts`).
- [x] Character-enforced rendered `<title>` (50-60 characters) and `<meta name="description">` (140-160 characters).
- [x] Homepage messaging overhaul: H1, hero copy, 3-tier CTAs, and 5-pillar bento showcase.
- [x] Dynamic sitemap engine linked to route registry (`app/sitemap.ts`).
- [x] Hardened robots.txt crawler disallow configuration (`app/robots.ts`).
- [x] Added official Apache-2.0 license (`LICENSE`).
- [x] Added open-source contributor guide (`CONTRIBUTING.md`).
- [x] Added security and responsible disclosure policy (`SECURITY.md`).
- [x] Rewrote `README.md` into an open-source conversion engine.

### Phase 20: Highest-Value Topic Hubs (Completed)
- [x] Dedicated feature architecture pages (`/analytics/web-analytics`, `/observability/real-user-monitoring`, `/observability/web-vitals`, `/observability/javascript-error-monitoring`, `/behavior/rage-click-detection`, `/ai/ai-visibility`, `/open-source`, `/self-hosting`).
- [x] Reusable Obsidian Precision Feature Hub component (`components/public/FeatureHubLayout.tsx`).
- [x] Subdomain isolation and middleware mapping for all marketing routes.
- [x] Robots.txt and dynamic sitemap integration.

### Phase 21: Developer SEO & Framework Integration Cluster (Completed)
- [x] Reusable Obsidian Precision Developer Guide component (`components/public/DeveloperGuideLayout.tsx`).
- [x] Full developer framework integration hubs:
  - Next.js App Router & Pages Router guide (`/developers/nextjs-analytics`).
  - React SPA with React Router & TanStack Router guide (`/developers/react-analytics`).
  - Vanilla JavaScript & HTML deferred beacon guide (`/developers/javascript-analytics`).
  - Vue.js 3 Composition API & Nuxt 3 guide (`/developers/vue-analytics`).
  - Astro Islands & View Transitions guide (`/developers/astro-analytics`).
  - Svelte 5 Runes & SvelteKit routing guide (`/developers/svelte-analytics`).
- [x] Linked developer guides in documentation sidebar navigation (`components/docs/DocsClientShell.tsx`).

### Phase 22: Comparison Engine & Alternatives Cluster (Completed)
- [x] Reusable Obsidian Precision 20-Point Comparison component (`components/public/ComparisonLayout.tsx`).
- [x] Central comparison directory hub (`/alternatives`).
- [x] Head-to-head technical comparison guides:
  - Google Analytics 4 deep comparison (`/alternatives/google-analytics` & `/vs-google-analytics`).
  - Plausible Analytics privacy & RUM comparison (`/alternatives/plausible`).
  - Umami Analytics open-source telemetry comparison (`/alternatives/umami`).
  - Matomo Analytics PHP migration comparison (`/alternatives/matomo`).
  - PostHog lightweight analytics comparison (`/alternatives/posthog`).
- [x] Registered all comparison routes in central SEO registry with character-counted metadata and Schema.org graphs.
- [x] Linked comparisons into documentation sidebar and global public footer.

### Phase 23: Open-Source Governance & Community Infrastructure (Completed)
- [x] Contributor Covenant Code of Conduct (`CODE_OF_CONDUCT.md`).
- [x] GitHub Bug Report issue form (`.github/ISSUE_TEMPLATE/bug_report.yml`).
- [x] GitHub Feature Request issue form (`.github/ISSUE_TEMPLATE/feature_request.yml`).
- [x] Architecture-compliant Pull Request template (`.github/pull_request_template.md`).

### Phase 24: Free Public Developer Tools Engine (Completed)
- [x] Standalone browser utilities hub (`/tools`).
- [x] Campaign URL & UTM Builder (`/tools/utm-builder`) with presets and live validation.
- [x] AI Crawler & Robots.txt Rule Tester (`/tools/ai-crawler-checker`) with `/llms.txt` generation.
- [x] Core Web Vitals Budget & Threshold Calculator (`/tools/core-web-vitals-checker`) with p75 sliders.
- [x] Cookie & Consent Audit Calculator (`/tools/cookie-audit`) with third-party cookie analysis.

### Phase 25: Dedicated Privacy Architecture & Cookieless Guides (Completed)
- [x] Privacy-First Web Telemetry Architecture guide (`/privacy-first-analytics`).
- [x] Cookieless Web Analytics & Cookie Banner Elimination Guide (`/cookieless-analytics`).
- [x] Full integration into sitemaps, robots.txt, documentation sidebar, and site footer.

### Phase 26: Developer Documentation Knowledgebase Expansion (Completed)
- [x] First Project domain binding & team inheritance guide (`/docs/first-project`).
- [x] Custom event tracking, e-commerce models & cURL guide (`/docs/first-event`).
- [x] Telemetry Ingestion REST API contract & reverse proxy recipes (`/docs/api/ingestion`).
- [x] First-party Cloudflare Worker and Next.js edge rewrite recipes to bypass adblockers.

### Phase 27: Enterprise Security Hub, Public Sandbox Demo & Regression Suite (Completed)
- [x] Enterprise Security Architecture Hub (`/security`) with RBAC, session cookie isolation, in-memory IP masking, and RFC 9116 security.txt disclosure policy.
- [x] Public Interactive Telemetry Sandbox (`/demo`) with real-time simulated event streams, Core Web Vitals RUM, AI bot radar, and behavioral UX telemetry.
- [x] Interactive Analytics Event Debugger & Schema Validator (`/tools/analytics-event-debugger`) with property typing, 16KB byte size calculation, and PII alerts.
- [x] Developer REST API Reference Hub (`/docs/api`) with full endpoint specification and server-side ingestion guides.
- [x] Web Analytics Cost & Tool Comparison Calculator (`/tools/analytics-comparison`) with real-time traffic sliders and savings analysis.
- [x] Automated SEO & Route Registry Regression Suite (`scripts/test-seo-regression.js` / `npm run test:seo`) validating 47/47 public routes (100% pass rate).




### Phase 21: Session Replay & Visual Heatmaps (Q1 2027)
- [ ] Lightweight, DOM-sanitized session recording playback engine.
- [ ] Click & scroll aggregate heatmaps on rendered pages.
- [ ] Privacy masking for sensitive user input fields during replay capture.

### Phase 22: Enterprise Private Cloud & Global Edge (Q2 2027)
- [ ] Dedicated Enterprise VPC deployments with custom SLAs.
- [ ] Cloudflare Workers / Vercel Edge middleware ingestion adapters.
- [ ] ClickHouse database driver support for ultra-high throughput event streaming (100M+ events/mo).




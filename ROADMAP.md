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

---

## Active & Upcoming Milestones

### Phase 8: Conversion Funnels & Goal Tracking (In Progress)
- [ ] Visual multi-step conversion funnel builder with drop-off percentage calculations.
- [ ] Goal conversion tracking linked to custom business events and revenue attribution.
- [ ] A/B test variant tracking and statistical significance indicators.

### Phase 7: Automated Alerting & Webhook Notifications (Q4 2026)
- [ ] Real-time incident alerts via Slack, Discord, and Telegram webhooks.
- [ ] Custom threshold triggers (e.g., Error rate spikes > 5%, Traffic drops > 30%, LCP degradation > 3.5s).
- [ ] Daily/Weekly executive summary email reports.

### Phase 8: Session Replay & Visual Heatmaps (Q1 2027)
- [ ] Lightweight, DOM-sanitized session recording playback engine.
- [ ] Click & scroll aggregate heatmaps on rendered pages.
- [ ] Privacy masking for sensitive user input fields during replay capture.

### Phase 9: Enterprise Private Cloud & Global Edge (Q2 2027)
- [ ] Dedicated Enterprise VPC deployments with custom SLAs.
- [ ] Cloudflare Workers / Vercel Edge middleware ingestion adapters.
- [ ] ClickHouse database driver support for ultra-high throughput event streaming (100M+ events/mo).

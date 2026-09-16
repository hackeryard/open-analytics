# Changelog: Open Analytics

All notable changes to the Open Analytics platform are documented in this file.

## [3.1.2] - 2026-09-16

### Added
- **Dedicated Billing & Plans Hub (`/billing`)**:
  - Implemented interactive account-level subscription and billing management page.
  - Live usage meters displaying website tracking slot utilization (`ownedProjects / maxProjects`) and unpooled event boundaries.
  - Subscription expiration date calculation, days remaining tracker, and billing cycle indicator.
  - Interactive tier switcher allowing instant upgrade or downgrade (`Free`, `Pro`, `Enterprise`) wired to `PATCH /api/user/plan`.
  - Comprehensive feature entitlement comparison matrix.
- **Developer Profile Hub (`/profile`)**:
  - Personal account management page with user avatar, name, email, and role badge.
  - Summary of all owned and shared workspaces with ownership markers.
  - Integrated navigation links from the user card in the desktop sidebar and mobile drawer.
- **Navigation Integration**:
  - Added dedicated **"Account & Plans"** group in the sidebar navigation (`Billing & Plans`, `Developer Profile`).
  - Added active plan badge (`FREE`, `PRO`, `ENTERPRISE`) directly to the sidebar billing item.
  - Added `/billing` and `/profile` to protected `DASHBOARD_PATHS` in `middleware.ts`.

---

## [3.1.1] - 2026-09-16

### Fixed
- **Project Access & Authorization with Populated Owner**:
  - Resolved 403 "Access denied: You do not have permission to view this project" regression when projects in user workspaces are populated with owner data.
  - Updated `canAccessProject`, `canEditProject`, `canManageProject`, and `isProjectOwner` in `lib/auth.ts` to safely resolve `ownerId` and `members[].userId` whether unpopulated (ObjectId string) or populated (User document object with `_id`).
- **AppShell & ExecutiveOverviewDashboard SSR Hydration Mismatch**:
  - Resolved Next.js runtime hydration errors (`Expected server HTML to contain a matching <aside> in <div>` and `Expected server HTML to contain a matching <div> in <div>`).
  - Passed `initialIsDashboard` from `RootLayout` via `headers()` (`x-is-dashboard` header and host inspection) down to both `PlatformProvider` and `AppShell`.
  - Exposed `isDashboard` via `usePlatform()` context, eliminating divergent `window` object inspections in `ExecutiveOverviewDashboard` (`app/page.tsx`).
  - Guaranteed identical DOM trees across server SSR and client browser hydration on both the marketing domain and dashboard subdomain.

---

## [3.1.0] - 2026-09-16

### Added
- **User-Level Subscription Architecture (`models/User.ts`)**:
  - Migrated plan subscription from project-level to user-level (`user.plan`, `user.planExpiresAt`, `user.billingCycle`, `user.extraProjectsAllowed`, `user.subscriptionStatus`).
  - Added centralized plan definition system (`lib/planLimits.ts`) with expiration verification (`isPlanActive`) and grace fallback to Free.
- **Website & Member Ceilings**:
  - **Free Starter Plan**: Strictly capped at **1 tracked website**, 10,000 monthly events/project, and up to 2 team members.
  - **Cloud Pro Plan**: Includes up to **10 tracked websites**, 250,000 monthly events/project, and up to 10 team members.
  - **Enterprise Plan**: 10 base websites + predictable add-on cost ($10/mo per additional website slot), 1,000,000 events/project, and unlimited collaborators.
  - Enforced project creation ceilings in `POST /api/projects` and member invitation ceilings in `POST /api/projects/[projectId]/members`.
- **Project Owner Plan Inheritance & Collaborator Isolation**:
  - Projects dynamically inherit the subscription tier of the Project Owner (`getProjectEffectivePlan`).
  - Team members invited to a Pro owner's project get full access to Pro features for that specific project.
  - Collaborator's personal projects remain isolated and retain the user's own subscription plan (no cross-account privilege bleeding).
- **User Plan Management API**:
  - `GET /api/user/plan`: Returns active plan, expiration date, days until expiry, and website slot utilization.
  - `PATCH /api/user/plan`: Allows upgrading/downgrading user subscriptions with duration calculation.

---

## [3.0.0] - 2026-09-15

### Added
- **3-Tier Domain Architecture & Subdomain Isolation**:
  - **Main Domain (`openanalytics.org.in`)**: 100% Pure SEO, landing pages, GA4 comparison matrix, pricing tiers, and public documentation. Completely eliminated login/register buttons in favor of unified "Launch Dashboard" CTA.
  - **Dashboard Subdomain (`dashboard.openanalytics.org.in`)**: Authenticated web analytics console, live streams, project settings, and user auth (`/login`, `/register`).
  - **API Telemetry Subdomain (`api.openanalytics.org.in`)**: Dedicated high-throughput edge telemetry and tracking script delivery (`/open.js`).
- **Versioned API Telemetry Endpoints**:
  - `https://api.openanalytics.org.in/open.js`: Edge-cached client tracker script with global CORS (`Access-Control-Allow-Origin: *`).
  - `POST /v1/collect`: Versioned pageviews, custom events, Web Vitals, and heartbeats ingestion.
  - `POST /v1/error`: Versioned client error and crash telemetry.
  - `POST /v1/identify`: Versioned visitor identity and user trait enrichment.
  - `GET /v1/event-rules`: Versioned no-code custom event rules synchronization.
  - `GET /`: Fast JSON API health check returning operational status and endpoints.
- **1-Year Data Retention & Query Boundaries**:
  - Enforced 365-day TTL index across MongoDB raw telemetry collections (`PageView`, `AnalyticsEvent`, `ErrorLog`).
  - Automated cron purge endpoint (`/api/cron/retention`) and `purgeExpiredData()` engine.
  - Free Starter plan strictly clamped to 30-day rolling telemetry window.
  - Cloud Pro and Enterprise plans unlock full 365-day (1-year) historical telemetry queries.
- **Pricing & Commercial Standardization**:
  - Standardized Pro tier pricing to **$19/month** (or **$15/month billed annually** at $180/yr) with 250,000 monthly events.
  - Gated power modules (Custom Events, AI Search Radar, Web Vitals RUM, Behavioral UX, Crash Diagnostics) behind Pro with clear upgrade modals (`ProFeatureGate.tsx`).
- **Email OTP Registration & Verification**:
  - Registration dispatches 6-digit email OTP; accounts start unverified.
  - Direct sign-in without OTP for verified accounts.
  - Unverified login attempts automatically trigger verification challenges.
  - Optional post-signup project creation (no forced default project).
- **Developer Workflow Automation Suite**:
  - `npm run pull` (`scripts/pull.js`): Pulls latest changes from origin.
  - `npm run push [msg]` (`scripts/push.js`): Stages, commits, and pushes changes.
  - `npm run sync [msg] [--pr]` (`scripts/sync.js`): Unified pipeline (pull -> commit -> push -> PR).
  - `npm run pr` (`scripts/create-pr.js`): Dynamic PR creation & synchronization deriving title, commit logs, and diff stats from git.
  - `npm run kill:3005` (`scripts/kill-port.js`): Cross-platform port cleaner.
  - `npm run test:subdomain` (`scripts/test-subdomain.js`): Automated subdomain routing regression test suite.
  - `npm run purge:retention` (`scripts/purge-retention.js`): 1-year data retention MongoDB purge utility.

---

## [2.5.0] - 2026-09-13

### Added
- **New `Editor` Workspace Role**:
  - Introduced a dedicated `editor` role granting edit & operational permissions without administrative governance.
  - **Permissions Granted**: Triage & resolve errors (`PATCH /api/projects/[projectId]/errors`), delete error logs, configure error filter & suppression rules (`POST/PATCH/DELETE /api/projects/[projectId]/error-rules`).
  - **Restrictions**: Cannot invite/remove members, cannot change member roles, cannot edit domain whitelists or delete projects, cannot transfer ownership.
- **Backend Authorization Updates**:
  - Updated `models/User.ts` and `models/Project.ts` enums with `"editor"`.
  - Added `canEditProject` and `verifyProjectEdit` security middleware in `lib/auth.ts`.
  - Updated `ROLE_HIERARCHY`: `{ super_admin: 4, admin: 3, editor: 2, member: 1 }`.
  - Updated `app/api/auth/me` and `app/api/projects` to dynamically return the active user's role including `editor`.
- **UI & Workspace Management Enhancements**:
  - Added Editor role option to the member invitation form and role selector dropdown in `/projects/[projectId]/settings`.
  - Updated Role Permissions Reference table to clearly display the 4-tier model (Owner, Admin, Editor, Member).
  - Added dedicated Editor badge styling (`Edit3` icon, blue badge) to `/projects` workspace directory.
- **Documentation & Multi-Framework Installation Guides**:
  - Comprehensive documentation for HTML5 tags, Next.js (App & Pages Router), React Vite/CRA, Nuxt 3/Vue.js, SvelteKit, Remix, and Astro.
  - Full API specifications for JavaScript SDK (`window.OpenAnalytics.track`, `.identify`, `.captureError`, `.track404`, `.page`) and React SDK component `<OpenAnalyticsTracker />`.
  - Clear guidelines for Allowed Origins & CORS domain whitelisting.

---

## [2.4.0] - 2026-09-13

### Added
- **Automatic Admin & Owner Assignment**:
  - When a user creates a project via `POST /api/projects`, they are automatically assigned as `ownerId` and granted `role: "admin"` in the project's member list.
  - Project listings now dynamically annotate every project with `currentUserRole` (`owner`, `admin`, `member`, `super_admin`).
- **Project Ownership Transfer API**:
  - Added `POST /api/projects/[projectId]/transfer-ownership` guarded by `verifyProjectOwner`.
  - Safely transfers project governance to another team member or registered user by email while preserving the previous owner as a project admin.
- **Project Directory & Governance Hub (`/projects`)**:
  - New dedicated workspace directory with KPI summary cards, role badges, quick workspace switching, script installation links, and ownership transfer triggers.
- **Settings Page Enhancements (`/projects/[projectId]/settings`)**:
  - Distinctive Workspace Owner badging.
  - Quick "Make Owner" action in the member table.
  - Unified Danger Zone containing both Transfer Project Ownership and Permanent Project Deletion.

---

## [2.3.0] - 2026-09-13

### Added
- **Live Feed & Real-Time Telemetry Hub Rework (`/live-feed`)**:
  - Live stream status with multi-interval polling selector (2s, 5s, 10s, 30s, or Manual).
  - Stream velocity summary gauges: Total events in window, average dwell time of stream, bounce velocity rate, and desktop/mobile/new visitor ratio.
  - Quick segment filters: `All Events`, `New Visitors`, `Returning Visitors`, `Identified Accounts`, `Guests`, `Bounced Sessions`, `Bots & Crawlers`.
  - 1-click **Export CSV** and **Export JSON** for local audit logs.
  - Deep Telemetry Event Audit Inspector Modal with hardware, network, Web Vitals, and copyable syntax-highlighted raw JSON payload.

---

## [2.2.0] - 2026-09-13

### Added
- **Top Pages & Route Performance Hub Rework (`/pages`)**:
  - KPI Gauges: Total Routes, Total Impressions, #1 Traffic Anchor with percentage share, and Average Route Dwell time.
  - Multi-segment colored traffic distribution bar for the Top 5 routes.
  - Quick segment filter pills: `All Routes`, `High Traffic Anchor`, `High Dwell (45s+)`, `Deep Scroll (60%+)`, `Quick Exit (<15s)`.
  - Interactive table with global ranks, copy URL path button, open in new tab, performance health tags, and 1-click **Export CSV**.
  - Deep Route Inspector Modal with "Filter in Live Telemetry" 1-click navigation.

---

## [2.1.0] - 2026-09-13

### Added
- **User Journeys & Navigation Transitions Hub (`/journeys`)**:
  - Aggregation engine capturing multi-step navigation sequences (`Step 1 -> Step 2 -> Step 3 -> Step 4`).
  - Direct route-to-route transition matrix (`From Route -> To Route`) with flow volume.
  - Landing page bounce rates and entry/exit drop-off ratios.
  - Session depth cohort distribution (`1 Page Bounce`, `2 Pages`, `3-5 Pages`, `6+ Pages Deep Flow`).

---

## [2.0.0] - 2026-09-13

### Added
- **Audience & Loyalty Directory (`/audience`, `/visitors`)**:
  - Completely replaced legacy `/returning-users` route with a comprehensive directory covering all visitors (newcomers, returners, and champions).
  - Calculates dynamic **Loyalty Score (0–100)** based on visit frequency, engagement dwell time, and recency.
  - 4 Loyalty Tiers: `Brand Champions` (Score 80-100), `Loyal Advocates` (60-79), `Returning Users` (35-59), `New Explorers` (0-34).
  - Multi-segment audience filter tabs, live search, multi-metric sorting, and deep visitor profile inspector.

---

## [1.9.0] - 2026-09-13

### Added
- **Universal Error & Crash Triage Hub (`/errors`)**:
  - Modern high-density table view with master checkboxes and batch action toolbar (Investigating, Resolve, Ignore, Delete).
  - Expandable row bars on click with stack trace inspection and AI Fix prompt generator.
  - Edge suppression rules engine (`contains`, `exact`, `regex`, `starts_with`) to filter out known noise or third-party extension errors at ingestion.

---

## [1.8.0] - 2026-09-13

### Changed
- **Zero-Emoji Standardization**:
  - Completely purged all emojis across the entire codebase (components, AI prompts, toasts, status dropdowns, and empty states).
  - Replaced with clean, professional Lucide React icons and dark-mode glassmorphism design tokens.

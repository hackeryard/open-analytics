# Changelog: Open Analytics

All notable changes to the Open Analytics platform are documented in this file.

## [3.7.2] - 2026-09-24

### Fixed
- **Script Ingestion Resilience & Safe Endpoint Fallback (`public/open.js`)**:
  - Defaulted telemetry collector endpoint to `https://api.openanalytics.org.in` rather than `window.location.origin`, preventing beacons from dropping with HTTP 404 when script attributes are resolved asynchronously.
  - Added singleton re-entrancy guard (`window.__OPEN_ANALYTICS_INITIALIZED__`) to prevent duplicate script initializations and duplicate interval timers.
  - Added router pathname deduplication in `history.replaceState` and `popstate` to eliminate duplicate pageviews during Next.js client-side mount.
  - Expanded script selector queries to match `data-measurement-id`, `data-project-id`, `open-analytics-tracker`, and global project variables.
- **Cloud Serverless DNS Resolver Protection (`lib/mongodb.ts`, `next.config.mjs`)**:
  - Restricted custom UDP `dns.setServers` to local Windows development only, ensuring production serverless environments (Vercel/AWS Lambda) utilize platform VPC DNS resolvers without port 53 timeouts.
- **Next.js App Router Script Placement (`app/layout.tsx`)**:
  - Moved self-tracking and analytics `<Script>` components from `<head>` into `<body>` to ensure hydration and execution across all visitors in compliance with Next.js App Router standards.

## [3.7.1] - 2026-09-22

### Fixed
- **Telemetry Time-Range Normalization & Query Synchronization (`app/api/projects/[projectId]/analytics/route.ts`, `app/api/projects/[projectId]/pageviews/route.ts`, `components/PlatformContext.tsx`)**:
  - Unified `timeRange` and `range` search parameter handling across analytics and pageview route handlers, resolving an issue where date filter selections defaulted to `"7d"`.
  - Synchronized `pvTimeRange` with `timeRangeState` in `PlatformContext.tsx` to ensure live feeds and background polling query matching windows.
- **Continuous Timeline Intervals & Zero-Filled Buckets (`lib/analyticsDb.ts`, `lib/analyticsTypes.ts`, `components/PrimaryAnalyticsChart.tsx`)**:
  - Implemented continuous gapless timeline backfilling for timeseries charts (hourly for single-day/24h spans, daily for multi-day ranges) so metrics never flatline or skip empty hours.
  - Aligned date filter boundaries (`todayStart`, `yesterday`) with UTC midnight (`setUTCHours(0,0,0,0)`), matching MongoDB aggregation timezone formats.
  - Formatted chart tooltips and x-axis labels with UTC synchronization.
- **Apex & WWW Ingestion Equivalence (`lib/projectAuth.ts`)**:
  - Normalized domain validation in `authenticateProjectRequest` by stripping `www.` prefixes, allowing visitors on both apex domains and `www` subdomains to ingest telemetry without HTTP 403 authorization rejections.
- **Date Range Window Navigation (`components/DateRangeNavigator.tsx`, `components/AppShell.tsx`)**:
  - Added multi-day window shifting on `<ChevronLeft />` and `<ChevronRight />` for preset ranges (`7d`, `30d`) with clamping at the current date.

## [3.7.0] - 2026-09-21

### Added
- **Main Domain Comprehensive SEO, GEO & AEO Overhaul**:
  - Systematic optimization of all 12 public main domain routes (`openanalytics.org.in`) for Google search indexing, Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO).
  - Decoupled client-side UI interactivity from metadata onto dedicated Server Components across `/faq`, `/docs`, `/docs/installation`, `/docs/verification`, `/docs/web-vitals`, `/docs/seo-aeo`, and `/docs/alerts`.
  - Calibrated rendered HTML `<title>` tags across all 12 pages to fall strictly within the **50–60 character** sweet spot, eliminating duplicate branding (`| Open Analytics | Open Analytics`).
  - Calibrated `<meta name="description">` strings across all 12 pages to fall strictly within the **140–160 character** standard.
  - Injected complete, machine-readable JSON-LD Schema.org graphs across all pages:
    - Root layout: Unified `WebSite` (with `SearchAction` potentialAction) and `SoftwareApplication` (version `3.7.0`, `aggregateRating` 4.9/5, multi-tier structured `offers`).
    - Home: Injected `FAQPage` schema with 6 core Q&A items for generative search engine extraction.
    - Features: Unified `BreadcrumbList`, `WebPage`, and `ItemList` of the 6 core platform capabilities.
    - Pricing: Unified `BreadcrumbList`, `WebPage`, `Product` with 3 offers (Free, Pro $19/mo, Enterprise $79/mo), and pricing `FAQPage`.
    - VS Google Analytics: Unified `BreadcrumbList`, `TechArticle`, and comparison `FAQPage`.
    - Privacy: Unified `BreadcrumbList`, `TechArticle`, and privacy compliance `FAQPage`.
    - FAQ: Decoupled into `FaqClientView.tsx` with server-rendered `BreadcrumbList`, `WebPage`, and full 12-question `FAQPage` schema.
    - Docs Overview: Decoupled into `DocsOverviewClientView.tsx` with server-rendered `BreadcrumbList`, `TechArticle`, and `ItemList` of platform modules.
    - Installation Docs: Decoupled into `InstallationClientView.tsx` with server-rendered `BreadcrumbList`, `TechArticle`, and multi-step `HowTo` schema.
    - Verification Docs: Decoupled into `VerificationClientView.tsx` with server-rendered `BreadcrumbList`, `TechArticle`, and `HowTo` schema.
    - Web Vitals Docs: Server-rendered `BreadcrumbList`, `TechArticle`, and `ItemList` of Core Web Vitals thresholds.
    - SEO & AI Crawler Radar Docs: Server-rendered `BreadcrumbList`, `TechArticle`, and `ItemList` of detected LLM search crawlers.
    - Alerts Docs: Decoupled into `AlertsDocsClientView.tsx` with server-rendered `BreadcrumbList`, `TechArticle`, and `ItemList` of 7 autonomous incident types.
  - Updated `sitemap.ts` and `robots.ts` with `/docs/alerts` and explicit allow directives for AI search user agents (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`, `Bytespider`).
  - Verified 100% compliance with zero-emoji standard and sub-domain isolation tests.

## [3.6.0] - 2026-09-20

### Changed
- **Obsidian & Precision Design System Overhaul (`app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`)**:
  - Replaced generic AI-template aesthetics (muddy navy-blue `#080c14`, blurry cards, rainbow neon gradients) with a world-class, human-crafted Obsidian & Precision dark design system inspired by Linear, Vercel, and Raycast.
  - Loaded Plus Jakarta Sans (`--font-sans`) paired with JetBrains Mono (`--font-mono`) via `next/font/google` for ultra-premium typography and precision tabular telemetry.
  - Rewrote color tokens to solid obsidian surfaces (`--background: #090a0f`, `--card: #111218`, `--border: #20222c`, `--muted: #181922`) with razor-thin borders (`rgba(255,255,255,0.08)`) and inset top bevels.
  - Completely eliminated all legacy `bg-card` classes across every `.tsx`, `.ts`, and `.css` file in the codebase.
- **Main Domain & Landing Page Redesign (`components/public/LandingHero.tsx`, `components/public/PublicNavbar.tsx`, `components/public/PublicFooter.tsx`)**:
  - Removed spammy above-the-fold "GEO & AEO Direct Answer Box".
  - Replaced generic 8-pillar repetitive cards with a rich 5-card Bento Grid Showcase highlighting Core Web Vitals gauges, sub-3.2KB payload bar vs GA4, autonomous AI crawler radar stream, incident & crash triage, and 100% cookieless privacy.
  - Refined the interactive telemetry simulator into an obsidian laboratory card with tactile segment controls.
  - Modernized `PublicNavbar` and `PublicFooter` with high-contrast tactile white CTAs, clean badge emblems, and muted zinc typography.
- **All Public Marketing & Auth Pages Redesign**:
  - **Features (`app/features/page.tsx`, `components/public/FeaturesClientView.tsx`)**: Overhauled into obsidian precision cards with category filter pills, capability specs, and zero generic gradients.
  - **Pricing (`components/public/PricingInteractive.tsx`)**: Redesigned monthly and annual plan cards with tactile white CTAs, transparent quota comparisons, and savings badges.
  - **VS Google Analytics (`app/vs-google-analytics/page.tsx`)**: Transformed into an obsidian comparison matrix contrasting payload size (3.2KB vs 45KB), GDPR compliance, and cookieless tracking.
  - **Privacy & FAQ (`app/privacy/page.tsx`, `app/faq/page.tsx`)**: Restyled with crisp obsidian reading surfaces and tactile accordion elements.
  - **Documentation Hub & All Subpages (`components/docs/DocsClientShell.tsx`, `app/docs/page.tsx`, `app/docs/web-vitals/page.tsx`, `app/docs/verification/page.tsx`, `app/docs/seo-aeo/page.tsx`, `app/docs/installation/page.tsx`, `app/docs/alerts/page.tsx`)**: Unified documentation layout with sticky sidebar navigation, code block copy bars, and precision badge metadata.
  - **Authentication Screens (`app/login/page.tsx`, `app/register/page.tsx`, `app/profile/page.tsx`)**: Restructured auth and profile cards into solid obsidian panels with high-contrast input controls.
- **Dashboard Workspace & Navigation Declutter (`components/AppShell.tsx`, `components/PlatformHeader.tsx`, `components/PrimaryAnalyticsChart.tsx`, `components/DateRangeNavigator.tsx`)**:
  - Stripped out 10+ noisy, non-actionable badges from the sidebar navigation (`% return`, `topPages.length`, `lcp`, `rage clicks`, etc.), reserving badges strictly for actionable signals (unread alerts, active crash errors).
  - Modernized sidebar active states to clean obsidian zinc highlights (`bg-white/[0.08] text-white font-medium`) and overhauled workspace switcher popovers on both desktop and mobile.
  - Refined `PrimaryAnalyticsChart` controls, metric switcher pills, and micro-KPI summary row to match the obsidian aesthetic.
  - Polished `DateRangeNavigator` with solid obsidian dropdown popovers, tactile calendar buttons, and precise hover highlights.
- **Executive Overview 2-Tier KPI Architecture & All 7 Dashboard Widgets (`app/page.tsx`, `components/dashboard/*`)**:
  - Replaced cramped 7-column stat row with an ergonomic 2-tier executive grid: 4 Hero KPI cards (Total Pageviews, Unique Visitors, Realtime Live Visitors, Avg Dwell Time) with `tabular-nums font-semibold text-white` typography and 3 Telemetry Health cards (Audience Loyalty, CWV LCP speed, Crash-Free Rate).
  - Modernized all 7 core dashboard widgets to obsidian precision styling: `TopPagesWidget`, `WebVitalsRadarWidget`, `AiAndErrorWidget`, `TrafficChannelsWidget`, `LiveStreamWidget`, `GeoWidget`, and `DeviceBreakdownWidget`.
- **All Dedicated Analytics & Observability Workspace Sections (`components/sections/*`, `components/*`)**:
  - **Live Feed (`components/sections/LiveFeedSection.tsx`)**: Fully overhauled all 1839 lines including real-time gauge monitors, segment filter ribbon, tabular event stream, NOC card view, and the 6-tab telemetry inspector modal.
  - **Errors & Crash Triage (`components/sections/ErrorsSection.tsx`)**: Solid obsidian incident cards, error velocity counters, stack trace viewers, and triage action bars.
  - **Custom Events (`components/sections/EventsSection.tsx`)**: Transformed custom events table, filter bars, and event payload viewers into precision cards.
  - **Core Web Vitals (`components/sections/WebVitalsSection.tsx`)**: Rebuilt LCP, INP, CLS, FCP, and TTFB metric distribution gauges with tabular thresholds.
  - **Behavioral UX (`components/sections/BehavioralUxSection.tsx`, `app/ux/page.tsx`)**: Redesigned rage click analysis, desktop exit intent, scroll depth milestones, and dwell ratio monitors.
  - **AI Visibility & LLM Crawlers (`components/AiVisibilityModule.tsx`)**: Redesigned AI crawler radar (GPTBot, ClaudeBot, PerplexityBot, etc.) and GEO citation readiness scoring.
  - **Pages & Routes (`components/sections/PagesSection.tsx`)**: Overhauled top route performance tables, route transition breakdown, and CSV export controls.
  - **Acquisition & UTM Channels (`components/sections/AcquisitionSection.tsx`)**: Transformed channel breakdowns, referrer domains, and campaign tables into obsidian cards.
  - **Audience & Loyalty (`components/sections/AudienceSection.tsx`)**: Rebuilt loyalty score dial, visitor tier breakdown, and cohort retention tables.
  - **Technology & Hardware (`components/sections/TechSection.tsx`)**: Upgraded GPU renderers, device RAM, CPU cores, screen DPR, and network telemetry views.
  - **User Journeys (`components/sections/UserJourneysSection.tsx`, `app/journeys/page.tsx`)**: Modernized multi-step navigation flow cards and transition matrices.
  - **Geo Analytics (`components/GeoAnalyticsModule.tsx`, `components/WorldMapAnalytics.tsx`)**: Overhauled interactive SVG World Atlas with obsidian tooltips and country drilldowns.
  - **Virtual Labs (`components/VirtualLabsModule.tsx`, `app/labs/page.tsx`)**: Redesigned experimental telemetry sandbox and simulated event generators.
  - **SEO Monitoring (`components/SeoAnalyticsModule.tsx`)**: Redesigned organic search engine crawler audits, keyword rankings, and SERP CTR metrics.
  - **Script Installation (`app/projects/[projectId]/install/page.tsx`)**: Polished code snippet displays, one-click copy buttons, and framework installation guides.


## [3.5.3] - 2026-09-20

### Added
- **Granular Notification Ignore & Suppression System (`lib/alertsEngine.ts`, `models/Project.ts`, `app/api/projects/[projectId]/alert-rules/route.ts`)**:
  - Implemented support for muting general notification types: Repeated Errors (`error_repeated`), Error Storms (`error_storm`), SEO Missing Titles (`seo_unoptimized`), AEO Low Dwell Friction (`aeo_unoptimized`), GEO AI Citation Radar (`geo_radar`), Core Web Vitals Degradation (`web_vitals`), and Behavioral Rage Clicks (`rage_clicks`).
  - Added granular ignore rules allowing users to suppress notifications matching specific route pathnames (e.g. `/test`, `/admin`), error messages, alert titles, or exact fingerprints with substring, exact, prefix, or regex matching.
  - Integrated `isNotificationIgnored` pre-checks into both real-time ingestion (`evaluateErrorAlerts`) and on-demand/background optimization scans (`runOptimizationScan`).
- **Inline Notification Mute & Ignore Menus (`app/notifications/page.tsx`, `components/NotificationCenterPopover.tsx`)**:
  - Added an interactive "Ignore / Mute" button (`BellOff`) to every notification card in both the top navbar popover and the full notifications workspace.
  - Users can immediately mute the entire notification type, ignore all alerts for the affected route, or suppress the specific alert fingerprint with one click.
- **Tabbed Alert Rules & Filters Management (`app/notifications/page.tsx`)**:
  - Structured the Alert Rules modal into three dedicated tabs: "General Types & Thresholds", "Specific Ignore Rules", and "Desktop Alerts".
  - Added active rule management with real-time enable/disable toggles, deletion, and an inline rule creation form.
- **Main Domain Documentation & Feature Showcase (`app/docs/alerts/page.tsx`, `app/docs/page.tsx`, `components/docs/DocsClientShell.tsx`, `app/features/page.tsx`, `components/public/LandingHero.tsx`)**:
  - Built a comprehensive public documentation guide for the Alerts & Incident Engine (`/docs/alerts`) covering the 7 anomaly heuristics, native desktop notifications, Web Audio chimes, and suppression rules.
  - Registered `/docs/alerts` in `DocsClientShell` navigation under "Observability Modules".
  - Enhanced `app/docs/page.tsx` with modules directory and 3-tier domain isolation architecture breakdown.
  - Added "Autonomous Anomaly Alerts & OS Desktop Notifications" module to `app/features/page.tsx` with JSON-LD schema integration.
  - Added interactive "Incident Alerts" live preview tab and 2 new pillars ("Autonomous Incident Alerts", "Mobile-First Workspace & Switcher") to `LandingHero.tsx` on the main domain.

### Fixed
- **Duplicate Header on Documentation Pages (`components/docs/DocsClientShell.tsx`, `components/public/PublicNavbar.tsx`)**:
  - Removed redundant inner `<header>` from `DocsClientShell` that previously stacked below `PublicNavbar`.
  - Positioned the desktop docs navigation sidebar to `sticky top-16 h-[calc(100vh-4rem)]` under the global navbar.
  - Added a compact mobile breadcrumb sub-bar and dedicated docs drawer toggle for mobile devices.
  - Enabled `/docs/*` subpath matching for active state indicator on desktop and mobile links in `PublicNavbar`.
- **Popover & Modal Transparency (`components/NotificationCenterPopover.tsx`, `components/BrowserNotificationPrompt.tsx`, `app/notifications/page.tsx`)**:
  - Removed `glass-card` semi-transparency from the notification center popover, permission prompt banner, and alert rules modal.
  - Applied solid dark surfaces (`bg-[#080d1a]`, `bg-[#0b1120]`) with sharp borders and deep shadows to prevent underlying charts and text from bleeding through popover dropdowns.

## [3.5.2] - 2026-09-20

### Added
- **Native Browser Desktop Notification Alerts (`lib/browserNotifications.ts`, `components/PlatformContext.tsx`)**:
  - Implemented native operating system desktop notifications using the HTML5 Web Notification API for repeated error spikes (>= 5 occurrences), error storms, and critical telemetry anomalies.
  - Synthesized dual-tone audio chime using the Web Audio API for audible alerts without external audio files.
  - Implemented 45-second background synchronization in `PlatformContext` to deliver desktop alerts even when the dashboard tab is in the background.
  - Configured notification click action to focus the browser tab and navigate directly to the incident route (`/errors`, `/seo`, `/notifications`).
- **Automated Browser Notification Prompt & Permission Banner (`components/BrowserNotificationPrompt.tsx`, `components/PlatformContext.tsx`, `components/AppShell.tsx`)**:
  - Automatically prompts dashboard users to enable native browser notifications instead of requiring manual interaction with the popover button.
  - Deploys a floating glassmorphic in-app permission banner with 1-click "Allow Notifications" and "Later" options, satisfying modern browser user-gesture requirements.
  - Attaches seamless automated permission triggers on workspace mount and on first user interaction (`pointerdown`/`keydown`).
  - Immediately dispatches a confirmation desktop alert and audio chime when permission is granted.
  - Persists session dismissal in `sessionStorage` to ensure non-intrusive dashboard UX.
- **Desktop Alert Controls (`components/NotificationCenterPopover.tsx`, `app/notifications/page.tsx`)**:
  - Added desktop alert banner in `NotificationCenterPopover` with permission prompt, active/muted status indicator, mute/unmute toggle, and instant sample test notification button.
  - Added desktop browser alerts configuration and test trigger inside the Alert Rules modal and action bar on the `/notifications` page.

## [3.5.1] - 2026-09-20

### Fixed
- **Bell Icon Click & Popover Rendering (`components/AppShell.tsx`, `components/NotificationCenterPopover.tsx`)**:
  - Removed `overflow-hidden` from the top command bar `<header>` element in `AppShell.tsx`, which previously clipped and hid the notification center dropdown and workspace switcher.
  - Added full mobile responsive positioning (`fixed inset-x-3 top-16 sm:absolute sm:right-0 sm:top-full sm:w-96`) and a backdrop overlay (`fixed inset-0 z-40`) to ensure reliable outside tap/click closure across mobile and desktop.
- **Repeated Error Alert Milestone Triggering (`lib/alertsEngine.ts`)**:
  - Fixed milestone bracket logic in `evaluateErrorAlerts` to reliably flag repeated errors across all occurrence levels (5x, 10x, 25x, 50x, 100x+), preventing errors with 6-24 occurrences from falling through.
  - Fixed stray character syntax error on line 1 of `lib/alertsEngine.ts`.
- **Automated Health & Telemetry Scans (`lib/alertsEngine.ts`, `app/api/notifications/route.ts`)**:
  - Integrated `ErrorLog` repeated error audits and 1-hour error storm velocity checks directly into `runOptimizationScan`.
  - Added automated fallback scanning on `GET /api/notifications` so that new or previously un-scanned projects automatically generate recommendations (SEO missing titles, GEO citation readiness, Web Vitals, repeated errors) upon viewing the dashboard.

## [3.5.0] - 2026-09-19

### Added
- **Automated Notification & Alerting System**:
  - Engineered an autonomous telemetry anomaly detection and alerting engine (`lib/alertsEngine.ts`).
  - **Repeated Error Alerts**: Triggers high-priority notifications when an identical error signature occurs 5 or more times (`occurrences >= 5`), with progressive bracket tracking (25x, 50x, 100x).
  - **Error Storm Detection**: Automatically monitors 1-hour error velocity and fires critical incident alerts when project errors exceed the configured velocity threshold (default: 10 errors/hr).
  - **SEO & AEO Unoptimized Page Audits**: Scans top routes for missing `<title>` tags, generic "untitled" routes, and ultra-short dwell times (< 4s) with high bounce friction.
  - **GEO & AI Search Radar Health**: Alerts site owners when Generative Engine Optimization (GEO) citation readiness scores drop below 50%, providing actionable remediation links.
  - **Core Web Vitals Degradation**: Emits warning/critical alerts when Largest Contentful Paint (LCP > 2.5s/4s) or Cumulative Layout Shift (CLS > 0.25) degrade on tracked pages.
  - **Behavioral UX Friction**: Detects repeated rage click clusters (>= 3 rage sessions) on UI elements to highlight broken or non-responsive interactions.
- **In-App Notification Center Popover (`components/NotificationCenterPopover.tsx`)**:
  - Interactive top navbar command bar bell button with glowing unread/critical count badge.
  - Glassmorphic popover dropdown with category filters (All, Unread, Errors, Optimizations), quick actions ("Mark all read", "Scan Now"), and direct deep links to `/errors`, `/seo`, `/vitals`, `/ux`.
- **Dedicated Alerts & Notification Hub (`app/notifications/page.tsx`)**:
  - Full-featured incident management workspace with search, severity filtering, type grouping, bulk actions, and custom Alert Rules & Thresholds configuration.
- **Notification Data Model & APIs (`models/Notification.ts`, `app/api/notifications/route.ts`, `app/api/notifications/scan/route.ts`, `app/api/projects/[projectId]/alert-rules/route.ts`)**:
  - Indexed schema with smart 24-hour fingerprint deduplication and 365-day TTL retention index.

## [3.4.2] - 2026-09-19

### Added
- **Mobile Project Switcher in Navbar & Drawer**:
  - Made the active project breadcrumb in the top command bar navbar interactive on mobile and desktop, enabling one-tap project switching directly from the navbar header without needing to navigate elsewhere.
  - Added a full project switcher badge and dropdown menu inside the mobile slide-out drawer (`AppShell.tsx`), allowing users to switch workspaces or create new projects seamlessly on mobile devices.

### Fixed
- **Mobile Navbar Responsiveness & Popover Positioning**:
  - Optimized top command bar flex layout to prevent clipping on mobile screens down to 320px width.
  - Clamped `DateRangeNavigator` dropdown popover width on mobile (`max-w-[calc(100vw-1.5rem)]`) and streamlined trigger spacing to eliminate horizontal scrolling.

## [3.4.1] - 2026-09-18

### Added
- **Google Site Verification**: Integrated Google Search Console verification meta tag in root layout metadata.
- **Google Tag (`gtag.js`)**: Configured Google Analytics 4 snippet in root layout `<head>`.
- **Main Domain Telemetry**: Injected native `open.js` beacon on `openanalytics.org.in` to track landing page and marketing visits directly in the analytics dashboard.

### Fixed
- **Google OAuth Localhost Redirect**: Normalized `getOAuthBaseUrl` for local development to use standard `http://localhost:port` without subdomains, preventing `redirect_uri_mismatch` errors with Google Cloud Console.
- **Google OAuth Production Redirect URI**: Updated `getOAuthBaseUrl` to dynamically respect the request host (`dashboard.openanalytics.org.in`) instead of overriding with `NEXT_PUBLIC_APP_URL`, preventing `redirect_uri_mismatch` errors in production.
- **Subscription Review Access Hardening**: Strictly restricted subscription requests, manual verification, audit trails, and the `/admin/subscriptions` portal to `super_admin` only (removing general `admin` visibility).
- **Hardcoded Sitemap Apex Domain**: Enforced `https://openanalytics.org.in` in `sitemap.ts` and `robots.ts` so subdomains never appear in the sitemap or search indexes, and added 301 redirects for any `/sitemap.xml` and `/robots.txt` requested on subdomains.
- **Canonical URLs & Main Domain SEO Hardening**:
  - Hardcoded all SEO metadata base URLs and OpenGraph URLs across the main domain strictly to `https://openanalytics.org.in`, completely decoupled from `NEXT_PUBLIC_APP_URL`.
  - Configured explicit absolute canonical tags for all marketing and documentation pages (`/`, `/features`, `/pricing`, `/privacy`, `/vs-google-analytics`, `/faq`, `/docs`, `/docs/installation`, `/docs/verification`, `/docs/web-vitals`, `/docs/seo-aeo`).
  - Synced documentation routes with `sitemap.ts` and `robots.ts`.
- **Comprehensive AEO & GEO Structured Data Optimization**:
  - Authored distinct, topic-specific metadata (titles, descriptions, targeted keywords, OpenGraph, Twitter Cards, canonicals) for every marketing and documentation route.
  - Embedded rich JSON-LD schema graphs across all pages: `Organization`, `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`, `HowTo`, `Product`, and `TechArticle` schemas for maximum Answer Engine Optimization (SearchGPT, Perplexity, Claude, Gemini) and Google Rich Results.
- **Event-Rules Error Mitigation for Free Users**:
  - Excluded all Open Analytics internal telemetry endpoints (`/collect`, `/error`, `/identify`, `/event-rules`) from `open.js`'s automatic error interceptor (`reportError`) to prevent synthetic error reporting loops and console noise on host websites.
  - Updated `/v1/event-rules` backend endpoint to always respond with HTTP 200 `{ ok: true, rules: [], proRequired: true }` (instead of 404) for missing projects or Free Starter plan projects, fully caching the response.
  - Enhanced client `open.js` script to cache empty event rules in `sessionStorage` with a 1-hour TTL when a project requires Pro or encounters non-200 responses, avoiding repeated network overhead.
- **Dashboard Homepage Mobile Responsiveness Redesign**:
  - Redesigned executive overview dashboard (`app/page.tsx`) to be fully responsive across mobile phones, tablets, and small viewports without horizontal scrolling or clipping.
  - Re-architected top KPI metrics grid with responsive card padding, text truncation, and responsive layout (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7`).
  - Enhanced `PrimaryAnalyticsChart` metric selector and peak stats bar with flexible wrap, responsive button sizes, and adaptive grid columns (`grid-cols-1 sm:grid-cols-3`).
  - Refactored `WebVitalsRadarWidget` to stack smoothly on mobile (`grid-cols-1 sm:grid-cols-3`), `DeviceBreakdownWidget` to flex-wrap form factor ratios, and `DateRangeNavigator` trigger button to dynamically fit small mobile viewports.
  - Optimized `AppShell` header command bar with responsive breadcrumbs, icon collapsing, and overflow guards.
- **Database Loading Shimmer Skeleton**:
  - Added dedicated `projectsLoading` lifecycle state in `PlatformContext` to prevent premature flash of the "Create First Project" wizard modal while user workspaces and database records are resolving.
  - Built an animated high-fidelity shimmer skeleton matching the exact dashboard layout (header, 7 KPI stat cards, primary timeseries chart, and 2-column analytics widgets), eliminating layout shift and providing a seamless loading experience.
  - Integrated dedicated shimmer loading skeleton and normalized container padding for `/journeys` to match `AppShell` margins.
- **Tracked Routes Target Website URL Resolution**:
  - Created [`lib/urlHelper.ts`](file:///c:/Users/rahul/OneDrive/Desktop/open-analytics/lib/urlHelper.ts) with `getTrackedUrl()` and `getProjectBaseUrl()` to properly resolve relative tracked pathnames (`/pricing`, `/docs`, `/blog/post`) against the active project's tracked website URL (`project.websiteUrl`), data streams (`streamUrl`), or allowed domains, rather than resolving to the dashboard domain (`dashboard.openanalytics.org.in` or `localhost:3005`).
  - Updated all outbound inspection links across Pages (`PagesSection.tsx`), Live Feed (`LiveFeedSection.tsx`), User Journeys (`UserJourneysSection.tsx`), Web Vitals (`WebVitalsSection.tsx`), Behavioral UX (`BehavioralUxSection.tsx`), Errors (`ErrorsSection.tsx`), and Audience (`AudienceSection.tsx`) to open the actual client website in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- **Custom Events Stream Purification**:
  - Purified the Custom Events section (`/events`) by completely decoupling scroll tracking (`autotrack_scroll_*`) and behavioral UX friction signals (`ux_exit_intent`, `ux_rage_click`, `category: "ux"`) from custom application events.
  - Streamlined `open.js` by retaining `scrollDepth`, `scrollMilestones`, and `exitIntent` purely as intrinsic `PageView` dwell telemetry and breadcrumbs, eliminating redundant discrete event emissions.
  - Added query-level and UI-level defensive exclusions in `lib/analyticsDb.ts` and `components/sections/EventsSection.tsx` so historical behavioral signals never pollute event counts, KPI totals, or user-defined event streams.

---

## [3.4.0] - 2026-09-17

### Added
- **Temporary Provider-Independent Subscription System**:
  - Implemented decoupled subscription system to enable production launch while payment gateway PAN / KYC updates (Minor to Major) are being processed.
  - **Decoupled Architecture**: `PaymentProvider` abstraction layer with `ManualPaymentProvider` and pluggable `RazorpayPaymentProvider` (switchable via `PAYMENT_PROVIDER=manual` with zero database or business logic changes needed later).
  - **New Domain Data Models**:
    - `SubscriptionPlan`: Seeded plan catalog (`pro-monthly`, `pro-annual`, `enterprise-monthly`, `enterprise-annual`) with INR pricing, limits, and features.
    - `SubscriptionRequest`: User-submitted intent to upgrade (`requested`, `contacted`, `payment_pending`, `completed`, `rejected`, `cancelled`).
    - `Subscription`: Paid access duration (`startDate`, `endDate`, `status`, generic `paymentProvider`).
    - `Payment`: Verified offline/manual payment record linked to request and subscription.
    - `SubscriptionAuditLog`: Immutable audit trail for all admin actions and subscription lifecycle events.
  - **User Billing & Request Experience (`/billing`)**:
    - "Request Subscription" modal with transparent notice explaining offline payment verification.
    - Live request status banner with real-time state tracking and instant user cancellation option.
    - Downgrade confirmation dialog protecting users from accidental plan downgrades.
  - **Administrator Subscription Management Hub (`/admin/subscriptions`)**:
    - Comprehensive dashboard for reviewing subscription requests, updating progress (`contacted`, `payment_pending`), and inspecting user notes.
    - Manual verification modal allowing admins to record verified payment details (amount, currency, notes, reference ID) and atomically activate user subscriptions.
    - Lazy expiration handling, automatic project unpausing, and audit logging.
  - **Strict Constraint Adherence**:
    - 100% Zero-Emoji compliant across all UI components, status pills, and audit logs.
    - 3-tier domain isolation verified.

---

## [3.3.0] - 2026-09-16

### Added
- **Razorpay Payment Gateway Integration**:
  - Implemented complete subscription billing pipeline supporting domestic Indian payment methods (UPI apps: Google Pay, PhonePe, Paytm, BHIM, QR code; netbanking, domestic debit/credit cards) as well as international cards.
  - Deployed `POST /api/billing/razorpay/order`: Authenticated endpoint generating cryptographic Razorpay orders with metadata notes (`userId`, `plan`, `billingCycle`).
  - Deployed `POST /api/billing/razorpay/verify`: Cryptographically validates HMAC SHA-256 signatures (`order_id + "|" + payment_id`) using Key Secret and instantly unlocks subscription tier, lifts Free plan locked project limits, and reactivates paused monitoring streams.
  - Deployed `POST /api/billing/razorpay/webhook`: Asynchronous webhook handler for `payment.captured` and `order.paid` with timing-safe signature verification to guarantee zero plan attribution loss if visitors exit checkout early.
  - Integrated Razorpay Standard Checkout SDK (`https://checkout.razorpay.com/v1/checkout.js`) on `/billing` dashboard page with interactive Monthly/Annual cycle selector (2 months free discount).
  - Extended `User` model with `razorpayCustomerId`, `razorpayPaymentId`, and `razorpayOrderId`.
  - Added development mode mock fallback allowing local testing and building before API keys are populated.


### Added
- **Full SEO, GEO, and AEO Optimization on Main Marketing Domain**:
  - Engineered comprehensive machine-readable and agentic discovery protocols:
    - `/llms.txt`: Standardized summary of Open Analytics architecture, capabilities, and integrations for LLM search engines.
    - `/llms-full.txt`: Deep technical specification including data schemas, cryptographic rotating salt specs, and Core Web Vitals algorithms.
    - `/agents.md`: Universal operating guide for autonomous coding agents (Claude Code, Cursor, Copilot Workspace, Antigravity) with 1-line installation snippets across Next.js, React, Nuxt, SvelteKit, Astro, and HTML.
    - `/robots.ts`: Advanced crawler directives explicitly welcoming generative AI agents (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`, `Google-Extended`, `OAI-SearchBot`, `Bytespider`).
    - `/sitemap.ts`: Canonical marketing and docs index with prioritized change frequencies and modification timestamps.
- **Complete Visual & Content Redesign Across Marketing Pages**:
  - `LandingHero.tsx`: High-impact hero, interactive multi-framework code switcher, simulated live telemetry pulse board, 6 technical core pillars, and GEO direct answer unit.
  - `app/features/page.tsx`: Immersive product tour detailing Core Web Vitals RUM (LCP/INP/CLS), AI bot crawler radar, rage/dead click detection, and automated JavaScript crash triage.
  - `app/vs-google-analytics/page.tsx`: Data-backed head-to-head comparison against GA4, mobile PageSpeed benchmark (100 vs 72), cookie banner elimination demo, and 60-second migration path.
  - `app/privacy/page.tsx`: Visual 24-hour cryptographic rotating salt pipeline, transparency matrix (What We Track vs What We Never Track), and ready-to-copy customer privacy policy clause.
  - `app/faq/page.tsx`: Real-time searchable FAQ accordion with categorized tags and updated API endpoint snippets (`api.openanalytics.org.in/open.js`).
  - `PublicNavbar.tsx` & `PublicFooter.tsx`: Elevated glassmorphism, responsive navigation drawer, real-time operational status beacon, and protocol links (`/llms.txt`, `/agents.md`).
- **Strict Project Constraint Adherence**:
  - Maintained 100% Zero-Emoji rule across all UI components, metadata, and generated machine files.
  - Enforced 3-tier domain isolation with unified "Launch Dashboard" routing.

---

## [3.1.5] - 2026-09-16

### Added
- **Expired Plan Multi-Project Handling & Active Website Locking**:
  - Implemented one-time active website selection for users whose subscriptions have expired or who own more than 1 website on the Free Starter plan.
  - Added `lockedActiveProjectId` and `activeProjectSelectedAt` fields to `User` schema.
  - Implemented `POST /api/user/active-project`: allows users to choose their 1 active tracking property, automatically locking the selection to prevent toggling between projects to circumvent Free tier limits.
  - Upgrading to Cloud Pro or Enterprise automatically lifts the lock and reactivates all paused projects.
- **Telemetry Ingestion Pausing (`/v1/collect`, `/v1/error`)**:
  - Validates project tracking status against owner subscription: rejects incoming telemetry on paused/unlocked projects on Free tier (`TRACKING_PAUSED`).
  - Preserves historical data and analytical dashboards in read-only mode with clear `Paused (Free Plan)` badges.
- **Team Collaborator Quota Enforcement**:
  - Strictly limits projects inheriting Free tier to a maximum of 2 team members.
  - Blocks invitations (`403 MEMBER_LIMIT_REACHED`) when the limit is met.
- **Interactive UI Components**:
  - Created `ActiveProjectSelectionModal` for seamless, one-click active website locking.
  - Added global top banner in `AppShell` alerting users of expired subscriptions with renewal and selection CTAs.
  - Added locked active website indicators to `/billing` and `/projects`.

---

## [3.1.4] - 2026-09-16

### Added
- **Project Limit Enforcement & Modal Interception**:
  - Prevented project creation modal (`CreateProjectModal`) from opening whenever a user reaches their subscription website limit (1 for Free Starter, 10 for Cloud Pro, base + add-ons for Enterprise).
  - Created `LimitReachedModal` component that informs users of their quota consumption (`ownedProjects / maxAllowedProjects`) and provides an immediate upgrade pathway to `/billing`.
  - Added centralized quota checks (`canCreateProject`, `ownedProjectsCount`, `maxAllowedProjects`, `openCreateProject`) inside `PlatformContext.tsx`.
  - Wrapped `setShowNewProjectModal`: if a user attempts to open the creation modal while at quota, the creation wizard is blocked and `LimitReachedModal` is presented instead.
  - Added fallback render guard inside `CreateProjectModal` (`if (!isOpen || !canCreateProject) return null;`) to ensure the wizard never renders when quota is reached.
  - Updated project switcher button, dropdown "+ Create Project" button in `AppShell.tsx`, and "+ Create Property" buttons in `app/projects/page.tsx` with limit badges and lock icons.

---

## [3.1.3] - 2026-09-16

### Fixed
- **React Hook Order Violation in CreateProjectModal**:
  - Resolved Minified React Error #310 ("Rendered more hooks than during the previous render") when opening the "+ Create Project" wizard modal.
  - Relocated premature `if (!isOpen) return null;` guard to right before the JSX `return` statement, ensuring all `useState` and `useEffect` hooks run unconditionally in every render pass.

---

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

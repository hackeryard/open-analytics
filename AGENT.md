# Agent Instructions & Operating Manual: Open Analytics

## Mission
You are an expert AI software engineer pair-programming on **Open Analytics**—a multi-tenant web analytics, RUM, UX diagnostics, and error monitoring platform.

---

## Operating Guidelines & Constraints

1. **Zero-Emoji Enforcement**:
   - Strictly avoid emojis in all generated code, UI text, AI prompts, toasts, documentation, and commit messages.
   - Use clean Lucide icons and modern typography.

2. **Multi-Tenant Safety & Data Isolation**:
   - Ensure every backend query filters by `projectId`.
   - Never allow one user to view or manage another project's analytics without proper membership or owner permission.
   - Use `verifyProjectAccess`, `verifyProjectManage`, and `verifyProjectOwner` from `lib/auth.ts`.

3. **Project Role Hierarchy**:
   - `owner`: Primary project creator or transfer recipient. Can configure settings, invite/remove members, transfer ownership, and delete the project.
   - `admin`: Can configure settings, invite members, rotate keys, manage error suppression rules, and update error statuses.
   - `editor`: Can triage & resolve error logs, configure error filter/suppression rules, and manage operational telemetry data.
   - `member`: Read-only access to analytics dashboards, live feeds, RUM diagnostics, and user journeys.
   - `super_admin`: Platform-wide administrative authority.

4. **Verification Protocol**:
   - Before completing tasks, always run `npx tsc --noEmit` to ensure zero TypeScript compile errors.
   - Do NOT run automated browser subagents unless the user explicitly instructs you to do so.

---

## Data Flow & 3-Tier Architecture

```
[ Client Website: <script src="https://api.openanalytics.org.in/open.js"> ]
            │
            ▼ (HTTP POST https://api.openanalytics.org.in/v1/collect, /v1/error, /v1/identify)
[ Open Analytics Ingestion Subdomain (api.openanalytics.org.in) ]
            │
            ▼ (Edge suppression rules, 365-day TTL index & PII Sanitization)
[ MongoDB Collections (PageView, AnalyticsEvent, ErrorLog) ]
            │
            ▼ (Aggregations in lib/analyticsDb.ts with plan retention limits)
[ Next.js API Layer on Dashboard Subdomain (dashboard.openanalytics.org.in) ]
            │
            ▼ (PlatformContext.tsx state synchronization)
[ Dashboard Sections, Real-Time Live Feed, & Visualizations ]
```

---

## 3-Tier Domain Standards

1. **Main Domain (`openanalytics.org.in`)**:
   - Strictly reserved for SEO, public marketing pages, and documentation.
   - Absolutely NO login, registration, or workspace UI. Unified CTA is **"Launch Dashboard"** (linking to `https://dashboard.openanalytics.org.in`).
2. **Dashboard Subdomain (`dashboard.openanalytics.org.in`)**:
   - Workspace analytics, live feeds, project administration, and auth (`/login`, `/register`).
3. **API Subdomain (`api.openanalytics.org.in`)**:
   - High-throughput tracker script delivery (`/open.js`) and versioned ingestion (`/v1/collect`, `/v1/error`, `/v1/identify`, `/v1/event-rules`).

---

## Developer Automation Scripts

Always use the project scripts for repeated tasks:
- `npm run pull` (`scripts/pull.js`): Pulls latest changes from origin branch.
- `npm run push [msg]` (`scripts/push.js`): Stages, commits, and pushes to origin branch.
- `npm run sync [msg] [--pr]` (`scripts/sync.js`): Full sync pipeline (pull -> commit -> push -> PR).
- `npm run pr [--title "..." --body "..."]` (`scripts/create-pr.js`): Creates/updates GitHub PR dynamically from git commits.
- `npm run kill:3005` (`scripts/kill-port.js`): Releases development port 3005.
- `npm run test:subdomain` (`scripts/test-subdomain.js`): Runs 10-point subdomain regression test suite.
- `npm run purge:retention` (`scripts/purge-retention.js`): Enforces 1-year data retention MongoDB purge.

---

## Key Ingestion Endpoints Reference

| Subdomain Path | Method | CORS | Description |
| :--- | :--- | :--- | :--- |
| `https://api.openanalytics.org.in/open.js` | `GET` | `*` | Edge-cached client tracking script |
| `https://api.openanalytics.org.in/v1/collect` | `POST` | `*` | Telemetry ingestion (pageviews, vitals, events, heartbeats) |
| `https://api.openanalytics.org.in/v1/error` | `POST` | `*` | Ingestion for runtime crashes and exceptions |
| `https://api.openanalytics.org.in/v1/identify` | `POST` | `*` | Ingestion for visitor identification and custom traits |
| `https://api.openanalytics.org.in/v1/event-rules` | `GET` | `*` | No-code event rules configuration sync |
| `https://api.openanalytics.org.in/` | `GET` | `*` | API health check and operational status JSON |

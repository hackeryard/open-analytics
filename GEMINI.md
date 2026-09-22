# Gemini / Antigravity Agent Rules: Open Analytics

## CRITICAL PROJECT CONSTRAINTS (NEVER FORGET)

### 1. Strict Zero-Emoji Constraint
- **Do NOT use emojis anywhere in the codebase**: Avoid emojis in UI components, console logs, toast messages, AI prompts, status badges, git commit messages, or documentation.
- Use clean, professional **Lucide React** icons (`<Activity />`, `<Check />`, `<Shield />`, `<Radio />`, etc.) instead.

### 1.1 World-Class Obsidian & Precision Design System
- Avoid generic AI template clichés (muddy navy-blue `#080c14`, blurry cards, rainbow neon gradients, vanity sidebar badges).
- Use the solid Obsidian Dark palette: `#090a0f` background, `#111218` solid cards, `#0e0f15` sidebar/secondary, `#181922` muted, `#20222c` / `rgba(255,255,255,0.08)` hairline borders with inset bevel highlights.
- Use Plus Jakarta Sans typography (`--font-sans`) paired with JetBrains Mono (`--font-mono`) with tabular numerals (`tabular-nums font-semibold text-white`) for analytical metrics.
- Use tactile high-contrast white CTAs (`bg-white text-zinc-950 hover:bg-zinc-200`) and decluttered navigation.

### 2. 3-Tier Domain Architecture & Subdomain Isolation
Open Analytics is strictly segregated into three domains. Never mix routes or CTAs between them:
1. **Main Domain (`openanalytics.org.in` / `localhost:3005`)**:
   - Strictly reserved for SEO, landing pages, marketing, comparison tables, pricing, and public docs.
   - **NO login, registration, or workspace UI**.
   - Primary action is unified **"Launch Dashboard"** button linking to `https://dashboard.openanalytics.org.in`.
   - Direct requests to `/login`, `/register`, or internal workspace routes (`/events`, `/vitals`, etc.) redirect to dashboard subdomain.
2. **Dashboard Subdomain (`dashboard.openanalytics.org.in` / `dashboard.localhost:3005`)**:
   - Authenticated analytics workspace, live telemetry feeds, project management, and auth (`/login`, `/register`).
   - Marketing routes (`/features`, `/pricing`, `/vs-google-analytics`, etc.) redirect back to the main domain.
3. **API Telemetry Subdomain (`api.openanalytics.org.in` / `api.localhost:3005`)**:
   - High-throughput tracking script delivery and versioned telemetry ingestion:
     - `https://api.openanalytics.org.in/open.js` (served with global CORS and CDN cache headers)
     - `POST /v1/collect`: Pageviews, custom events, Core Web Vitals, heartbeats
     - `POST /v1/error`: Runtime error and exception triage
     - `POST /v1/identify`: Visitor profile enrichment
     - `GET /v1/event-rules`: No-code custom event rules sync
     - `GET /`: Fast JSON API health check

### 3. Developer Workflow Scripts (ALWAYS USE SCRIPTS FOR REPEATED TASKS)
Never run ad-hoc raw commands for git pulls, port killing, or PRs. Always use project scripts in `scripts/`:
- `npm run pull` (`scripts/pull.js`): Pulls latest changes from `origin/<branch>` cleanly.
- `npm run push [msg]` (`scripts/push.js`): Stages, commits, and pushes to `origin/<branch>`.
- `npm run sync [msg] [--pr]` (`scripts/sync.js`): Complete pull -> stage -> commit -> push -> optional PR pipeline.
- `npm run pr [--title "..." --body "..."]` (`scripts/create-pr.js`): Dynamic GitHub PR creation/synchronization without hardcoded text.
- `npm run merge:pr [pr_number]` (`scripts/merge-pr.js`): Programmatically merges open PRs into main via GitHub REST API.
- `npm run kill:3005` (`scripts/kill-port.js`): Forcefully frees development port 3005.
- `npm run test:subdomain` (`scripts/test-subdomain.js`): Runs 10-point subdomain regression test suite.
- `npm run purge:retention` (`scripts/purge-retention.js`): Enforces 1-year data retention MongoDB purge.

### 4. 1-Year Data Retention & Plan Boundaries
- Raw telemetry collections (`PageView`, `AnalyticsEvent`, `ErrorLog`, `Notification`) have a 365-day TTL index.
- Automated purge runs via `lib/dataRetention.ts` and `/api/cron/retention`.
- Query limits:
  - Free Starter Plan: Clamped to 30-day historical window.
  - Pro & Enterprise Plans: Full 365-day (1-year) historical window.
- **User-Level Subscription Model & Website Ceilings**:
  - Subscription is assigned to **User** (`user.plan`, `user.planExpiresAt`), NOT individual projects.
  - **Free**: Strictly 1 website, 10k events/mo/project, up to 2 team members.
  - **Pro**: 10 websites included, 250k events/mo/project, up to 10 team members.
  - **Enterprise**: 10 base websites + $10/mo per extra website, 1M events/mo/project.
  - **Member Inheritance**: Projects inherit the Project Owner's plan. Members get Pro on owner's project without bleeding into their independent projects.
  - Quotas are strictly unpooled (per project).

### 5. Multi-Tenant Project Isolation & RBAC
- Every analytical database query MUST filter by `projectId`.
- Always verify project permissions using `lib/auth.ts` (`verifyProjectAccess`, `verifyProjectEdit`, `verifyProjectManage`, `verifyProjectOwner`).
- Roles: `owner`, `admin`, `editor`, `member`, `super_admin`.

### 6. Main Domain SEO, GEO & AEO Standards
- Rendered HTML `<title>` tags across all 12 public routes must strictly fall between **50 and 60 characters** (`%s | Open Analytics` root template).
- `<meta name="description">` tags must strictly fall between **140 and 160 characters**.
- Interactive client components must decouple state from `page.tsx` (`*ClientView.tsx`) to enable server-rendered static metadata.
- Every public page must inject valid, rich JSON-LD Schema.org graphs (`WebSite`, `SoftwareApplication`, `Product`, `TechArticle`, `HowTo`, `FAQPage`, `BreadcrumbList`, `ItemList`).

### 7. Project Documentation & Tracking Files Maintenance
Whenever significant architectural or functional changes are made, update:
- `CHANGELOG.md`: Log new versions and bulleted features.
- `ROADMAP.md`: Check off completed milestones.
- `README.md`: Update architecture tables, script references, and snippet examples.
- `REQUIREMENTS.md`: Keep environment variables and collection schemas current.
- `CLAUDE.md` / `GEMINI.md` / `AGENTS.md`: Keep developer rules and conventions synchronized.

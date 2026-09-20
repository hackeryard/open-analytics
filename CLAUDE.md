# Claude Developer Guide: Open Analytics

## Repository Overview
**Open Analytics** is a high-performance, multi-tenant web analytics, Real User Monitoring (RUM), behavioral signal, and error observability platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

---

## Critical Rules & Design Standards

### 1. Strict Zero-Emoji Constraint
- **Do NOT use emojis anywhere in the codebase**: Avoid emojis in UI components, AI prompts, console logs, toast messages, status dropdowns, empty states, or documentation.
- Use clean, professional **Lucide React** icons (`<Activity />`, `<Check />`, `<Shield />`, `<Crown />`, etc.) and refined typography instead.

### 2. Multi-Tenant Project Isolation & RBAC
- Every analytical collection (`PageView`, `CustomEvent`, `ErrorLogItem`, etc.) is strictly indexed and isolated by `projectId`.
- Always wrap project-specific route handlers with the appropriate auth guard from `lib/auth.ts`:
  - `verifyProjectAccess(req, projectId)`: Required for reading analytics dashboards and live telemetry.
  - `verifyProjectEdit(req, projectId)`: Required for operational modifications (error status triage, error suppression rules).
  - `verifyProjectManage(req, projectId)`: Required for administrative governance (inviting/removing members, updating project domains and settings).
  - `verifyProjectOwner(req, projectId)`: Required for transferring project ownership and deleting a project.

### 3. Automatic Admin/Owner Role Assignment & 4-Tier RBAC
- When a user creates a project (`POST /api/projects`), they are set as `ownerId: user._id` AND added to `members: [{ userId: user._id, role: "admin" }]`.
- Workspace Roles:
  - **Owner**: Full workspace control, delete project, transfer ownership.
  - **Admin**: Manage team members, project settings, API keys, error rules, triage errors.
  - **Editor**: Triage & resolve errors, configure edge error suppression rules, edit operational data.
  - **Member**: Read-only access to dashboards, live telemetry, and analytics reports.
- Ownership transfer is handled via `POST /api/projects/[projectId]/transfer-ownership`.

### 4. User-Level Subscriptions & Website Ceilings
- Subscriptions belong to **User accounts** (`user.plan`, `user.planExpiresAt`, `user.billingCycle`), NOT individual projects.
- **Website Ceilings**:
  - Free: Exactly 1 website, 10k events/mo per project, up to 2 team members.
  - Pro: 10 websites included, 250k events/mo per project, up to 10 team members.
  - Enterprise: 10 base websites + $10/mo per extra website, 1M events/mo per project.
- **Member Inheritance**: Projects inherit the Project Owner's plan (`getProjectEffectivePlan`). Collaborators enjoy Pro features on owner's projects without cross-account privilege bleeding into their own projects.
- Quotas are strictly per-project (unpooled).

---

## Project Structure & Key Directories

```
open-analytics/
├── app/                               # Next.js App Router
│   ├── (auth)/login, register         # Auth screens
│   ├── acquisition/                   # Referrer & UTM acquisition view
│   ├── ai-visibility/                 # AI crawler radar & citations view
│   ├── audience/ (and /visitors)      # Audience & Loyalty directory
│   ├── errors/                        # Universal error & crash triage hub
│   ├── events/                        # Custom business events explorer
│   ├── geo/                           # Interactive World Atlas & geo drilldown
│   ├── journeys/                      # Multi-step navigation flows & transitions
│   ├── live-feed/                     # Real-time event stream & telemetry
│   ├── notifications/                 # Incident alerts & optimization hub
│   ├── pages/                         # Top routes & page performance hub
│   ├── projects/                      # Project directory & settings
│   │   └── [projectId]/
│   │       ├── alert-rules/           # Project threshold preferences
│   │       ├── install/               # Tracking script installation snippet
│   │       └── settings/              # Settings, team RBAC, ownership transfer
│   ├── seo/                           # Organic search engine monitoring
│   ├── tech/                          # Hardware, OS, browser, GPU diagnostics
│   ├── ux/                            # Rage clicks, exit intent, dwell ratio
│   ├── vitals/                        # Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
│   └── api/                           # Backend API route handlers
│       ├── auth/                      # Login, register, logout, me
│       ├── notifications/             # Notification CRUD & on-demand scan
│       ├── projects/                  # Project CRUD & listing
│       │   └── [projectId]/
│       │       ├── alert-rules/       # Threshold settings CRUD
│       │       ├── analytics/         # Aggregated analytical metrics
│       │       ├── error-rules/       # Edge suppression rules CRUD
│       │       ├── errors/            # Error logs & status updates
│       │       ├── members/           # Team members RBAC
│       │       ├── pageviews/         # Paginated stream & search
│       │       └── transfer-ownership/# Project ownership transfer
│       └── v1/                        # Public tracking ingestion endpoints
│           ├── ingest/                # Pageviews, dwell, vitals, hardware
│           ├── event/                 # Custom conversion events
│           └── error/                 # Runtime crashes & stack traces
├── components/                        # React UI Components
│   ├── AppShell.tsx                   # Main layout shell, sidebar navigation, mobile switcher
│   ├── BrowserNotificationPrompt.tsx  # In-app desktop notification permission prompt banner
│   ├── NotificationCenterPopover.tsx  # Top navbar alert popover with inline mute menus
│   ├── PlatformContext.tsx            # Global state, 45s desktop sync, alert rule methods
│   ├── PlatformHeader.tsx             # Shared view header banner
│   └── sections/                      # Dedicated view section components
├── lib/                               # Core Utilities & Business Logic
│   ├── alertsEngine.ts                # Anomaly, repeated error detection & ignore rules engine
│   ├── analyticsDb.ts                 # High-performance MongoDB aggregations
│   ├── analyticsTypes.ts              # TypeScript interfaces & types
│   ├── auth.ts                        # JWT verification, RBAC guards
│   ├── browserNotifications.ts        # Native Web Notifications API & Web Audio chime synthesis
│   ├── countries.ts                   # Country codes & geo names mapping
│   └── mongodb.ts                     # Mongoose connection pooling
├── models/                            # Mongoose ODM Models
│   ├── AnalyticsEvent.ts              # Custom event schema
│   ├── ErrorLog.ts                    # Error logs, stack traces schema
│   ├── Notification.ts                # Incident & optimization alerts schema
│   ├── PageView.ts                    # Pageview, RUM, hardware, UX schema
│   ├── Project.ts                     # Project, settings, rules, members schema
│   └── User.ts                        # User accounts, auth schema
└── public/
    └── open.js                        # Zero-dependency vanilla JS client tracker
```

---

## Development & Build Commands

```bash
# Start Next.js development server (default port 3005)
yarn dev

# Run full TypeScript type-checking without emitting files
npx tsc --noEmit

# Production build
yarn build

# Start production server
yarn start

# Git & Workflow Automation Scripts
yarn pull            # Pull latest changes from origin branch (node scripts/pull.js)
yarn push            # Stage, commit, and push changes to origin (node scripts/push.js [message])
yarn sync            # Full sync pipeline: pull -> commit -> push (node scripts/sync.js [message] [--pr])
yarn pr              # Dynamic GitHub PR creation & sync (node scripts/create-pr.js [--title "..." --body "..."])
yarn kill            # Kill processes holding development port 3005 (node scripts/kill-port.js)
yarn test:subdomain  # Run automated subdomain routing test suite (node scripts/test-subdomain.js)
yarn purge:retention # Run 1-year data retention MongoDB purge (node scripts/purge-retention.js)
```

---

## Core Conventions

1. **Client Components**: Mark interactive UI files with `"use client";` at line 1.
2. **Data Aggregations**: Keep complex MongoDB queries inside `lib/analyticsDb.ts` to keep API route handlers clean and maintainable.
3. **Responsive Glassmorphism**: Use dark-mode themed cards (`bg-card border border-border rounded-3xl shadow-sm`).
4. **Performance**: Always limit unbounded MongoDB queries and use indexed fields (`projectId`, `createdAt`, `pathname`, `visitorId`, `sessionId`).
5. **Project Tracking & Documentation Integrity**: Whenever significant architectural, infrastructure, or operational features are introduced, update `CHANGELOG.md`, `ROADMAP.md`, `README.md`, `REQUIREMENTS.md`, and `GEMINI.md` to ensure complete documentation alignment.

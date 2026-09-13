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

## Data Flow & Architecture

```
[ Client Website (public/open.js) ]
            │
            ▼ (HTTP POST /api/v1/ingest, /api/v1/error, /api/v1/event)
[ Open Analytics Ingestion Layer ]
            │
            ▼ (Edge suppression rules & PII Sanitization)
[ MongoDB Collections (PageView, SystemError, CustomEvent) ]
            │
            ▼ (Aggregations in lib/analyticsDb.ts)
[ Next.js API Layer (/api/projects/[projectId]/...) ]
            │
            ▼ (PlatformContext.tsx state synchronization)
[ Dashboard Sections & Interactive Visualizations ]
```

---

## Key Backend Routes Reference

| Route | Method | Guard | Description |
| :--- | :--- | :--- | :--- |
| `/api/projects` | `GET` | Authenticated | List all accessible projects with `currentUserRole` |
| `/api/projects` | `POST` | Authenticated | Create project (assigns creator as Owner and Admin) |
| `/api/projects/[projectId]` | `GET` | `verifyProjectAccess` | Fetch project details |
| `/api/projects/[projectId]` | `PATCH` | `verifyProjectManage` | Update project settings & allowed domains |
| `/api/projects/[projectId]` | `DELETE` | `verifyProjectOwner` | Permanently delete project |
| `/api/projects/[projectId]/analytics` | `GET` | `verifyProjectAccess` | Aggregated metrics for active timeframe |
| `/api/projects/[projectId]/pageviews` | `GET` | `verifyProjectAccess` | Paginated live telemetry event stream |
| `/api/projects/[projectId]/members` | `GET`, `POST`, `PATCH`, `DELETE` | `verifyProjectManage` | Manage team RBAC |
| `/api/projects/[projectId]/transfer-ownership` | `POST` | `verifyProjectOwner` | Transfer primary project ownership |
| `/api/projects/[projectId]/errors` | `GET`, `PATCH`, `DELETE` | `verifyProjectAccess` / `verifyProjectEdit` | Error log listing, status triage, and resolution |
| `/api/projects/[projectId]/error-rules` | `GET`, `POST`, `PATCH`, `DELETE` | `verifyProjectAccess` / `verifyProjectEdit` | Edge error suppression rules CRUD |
| `/api/v1/ingest` | `POST` | Public / Domain Check | Ingestion for pageviews, vitals, hardware, UX |
| `/api/v1/error` | `POST` | Public / Domain Check | Ingestion for client runtime crashes |
| `/api/v1/event` | `POST` | Public / Domain Check | Ingestion for custom conversion events |

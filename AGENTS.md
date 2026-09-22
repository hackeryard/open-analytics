# Multi-Agent Operating Guidelines: Open Analytics

This document governs all autonomous and pair-programming AI agents working in this repository.

## 1. Zero-Emoji Rule
No emojis anywhere in code, comments, UI strings, documentation, or commit messages. Use Lucide icons only.

## 1.1 World-Class Obsidian & Precision Design System
- Strictly avoid generic AI template clichés (muddy navy blue, blurry semi-transparent blue cards, rainbow neon gradients, vanity sidebar badges).
- Use solid Obsidian Dark palette: `#090a0f` background, `#111218` solid cards, `#0e0f15` sidebars, `#20222c` / `rgba(255,255,255,0.08)` hairline borders with subtle bevel highlights.
- Plus Jakarta Sans typography (`--font-sans`) paired with JetBrains Mono (`--font-mono`) with tabular numbers (`tabular-nums font-semibold text-white`) for all metrics and stats.
- Tactile high-contrast white CTAs (`bg-white text-zinc-950 hover:bg-zinc-200`) and decluttered, actionable navigation.

## 1.2 Main Domain SEO, GEO & AEO Standards
- Rendered HTML `<title>` tags across all 12 public routes must strictly fall between **50 and 60 characters** (`%s | Open Analytics` root template).
- `<meta name="description">` tags must strictly fall between **140 and 160 characters**.
- Interactive client components must decouple state from `page.tsx` (`*ClientView.tsx`) to enable server-rendered static metadata.
- Every public page must inject valid, rich JSON-LD Schema.org graphs (`WebSite`, `SoftwareApplication`, `Product`, `TechArticle`, `HowTo`, `FAQPage`, `BreadcrumbList`, `ItemList`).

## 2. 3-Tier Domain Isolation
- **Main (`openanalytics.org.in`)**: Pure SEO/marketing only. No login or signup buttons. Use "Launch Dashboard".
- **Dashboard (`dashboard.openanalytics.org.in`)**: Workspaces, charts, live feed, `/login`, `/register`.
- **API (`api.openanalytics.org.in`)**: Edge `/open.js` script delivery and versioned `/v1/collect` ingestion.

## 3. Mandatory Workflow Scripts
Always execute repeated tasks via project scripts:
- `npm run pull`
- `npm run push [msg]`
- `npm run sync [msg] [--pr]`
- `npm run pr [--title "..." --body "..."]`
- `npm run merge:pr [pr_number]`
- `npm run kill:3005`
- `npm run test:subdomain`
- `npm run purge:retention`

## 4. Project Changes Tracking Protocol
Whenever major architectural, infrastructure, or operational changes are implemented, ALWAYS update:
1. `CHANGELOG.md`
2. `ROADMAP.md`
3. `README.md`
4. `REQUIREMENTS.md`
5. `CLAUDE.md`
6. `GEMINI.md` / `AGENTS.md`

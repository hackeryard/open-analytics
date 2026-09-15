# Multi-Agent Operating Guidelines: Open Analytics

This document governs all autonomous and pair-programming AI agents working in this repository.

## 1. Zero-Emoji Rule
No emojis anywhere in code, comments, UI strings, documentation, or commit messages. Use Lucide icons only.

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

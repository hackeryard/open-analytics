# Workspace Rule: Subdomain Architecture & Workflow Scripts

## Architecture Rules
1. Never place login, registration, or internal workspace UI on the main domain (`openanalytics.org.in`). Use the unified "Launch Dashboard" CTA linking to `https://dashboard.openanalytics.org.in`.
2. Tracking scripts must always be served from `https://api.openanalytics.org.in/open.js`.
3. Ingestion beacons must always be sent to `https://api.openanalytics.org.in/v1/collect`.
4. The dashboard workspace must enforce JWT session authentication on all analytical routes.

## Workflow Rules
1. Never run raw git pull commands when syncing branches. Use `npm run pull`.
2. Never run ad-hoc PR commands with hardcoded messages. Use `npm run pr` with dynamic commit log extraction or custom flags (`--title`, `--body`).
3. Always verify changes using `npx tsc --noEmit` and `npm run test:subdomain`.
4. Keep `CHANGELOG.md`, `ROADMAP.md`, `README.md`, and `REQUIREMENTS.md` synchronized whenever features are delivered.

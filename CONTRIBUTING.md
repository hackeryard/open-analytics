# Contributing to Open Analytics

Thank you for your interest in contributing to Open Analytics. Open Analytics is an open-source web analytics and observability platform engineered for speed, precision, and privacy.

This project is governed by open-source principles and our repository guidelines.

---

## 1. Code of Conduct & Core Standards

### Strict Zero-Emoji Constraint
Open Analytics enforces a strict zero-emoji policy across all code, inline comments, commit messages, UI strings, badges, toast notifications, and documentation. Use clean, professional Lucide React icons instead.

### Precision Design System
All UI components adhere strictly to the Obsidian Dark design system:
- Canvas Background: `#090a0f`
- Primary Cards / Surface: `#111218`
- Secondary / Sidebar: `#0e0f15`
- Borders: `#20222c` / `rgba(255, 255, 255, 0.08)` hairline borders
- Typography: Plus Jakarta Sans (`--font-sans`) paired with JetBrains Mono (`--font-mono`)
- Numerals: Always apply `tabular-nums font-semibold text-white` for analytics numbers and stats
- Primary CTAs: High-contrast tactile white buttons (`bg-white text-zinc-950 hover:bg-zinc-200`)

### 3-Tier Domain Isolation
Maintain strict separation between domain surfaces:
1. `openanalytics.org.in`: Public marketing, SEO pages, documentation, comparisons.
2. `dashboard.openanalytics.org.in`: Authenticated workspace, project management, auth (`/login`, `/register`).
3. `api.openanalytics.org.in`: Edge tracking script delivery (`/open.js`) and versioned ingestion (`/v1/collect`).

---

## 2. Development Setup

### Prerequisites
- Node.js >= 18.17.0
- MongoDB instance (local or MongoDB Atlas connection URI)
- Git

### Initializing the Project

```bash
git clone <repository-url>
cd open-analytics
npm install
```

### Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Populate the required environment variables:
- `MONGODB_URI`: Connection string to your MongoDB cluster
- `JWT_SECRET`: Cryptographically secure secret string
- `NEXT_PUBLIC_APP_URL`: `http://localhost:3005` (or production URL)
- `NEXT_PUBLIC_API_URL`: `http://api.localhost:3005` (or production API URL)

### Running the Development Server

```bash
npm run dev
```

The application is served at `http://localhost:3005`.

---

## 3. Workflow Scripts & Git Lifecycle

Repeated tasks must use our predefined project scripts:

| Command | Script | Purpose |
| :--- | :--- | :--- |
| `npm run pull` | `scripts/pull.js` | Pull latest updates cleanly from upstream branch. |
| `npm run push [msg]` | `scripts/push.js` | Stage, commit, and push changes to upstream branch. |
| `npm run sync [msg] [--pr]` | `scripts/sync.js` | Run complete pull, commit, push, and optional PR creation. |
| `npm run pr [--title "..." --body "..."]` | `scripts/create-pr.js` | Create or synchronize pull request via GitHub REST API. |
| `npm run merge:pr [number]` | `scripts/merge-pr.js` | Merge validated PRs into main branch. |
| `npm run kill:3005` | `scripts/kill-port.js` | Free port 3005 if an orphaned process is lingering. |
| `npm run test:subdomain` | `scripts/test-subdomain.js` | Run the 10-point subdomain isolation test suite. |
| `npm run purge:retention` | `scripts/purge-retention.js` | Enforce 365-day TTL data retention purge in MongoDB. |

---

## 4. Submitting a Pull Request

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Verify subdomain isolation and run tests:
   ```bash
   npm run test:subdomain
   npm run build
   ```
3. Ensure no emojis are included in commit messages or code.
4. Push and create your pull request:
   ```bash
   npm run pr --title "Feature: Your Feature Description" --body "Detailed explanation of changes"
   ```

---

## 5. Documentation Updates

When modifying architecture, database collections, routing, or dependencies, update the tracking documents:
- `CHANGELOG.md`
- `ROADMAP.md`
- `README.md`
- `REQUIREMENTS.md`

Thank you for helping build high-performance, privacy-first open-source analytics.

#!/usr/bin/env node

/**
 * Automates creating a GitHub Pull Request from 'dev' to 'main'
 * Uses GitHub REST API with NPM_TOKEN or GITHUB_TOKEN environment variables.
 */

const token = process.env.NPM_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repo = process.env.GITHUB_REPOSITORY || "hackeryard/open-analytics";

if (!token) {
  console.error("ERROR: No GitHub token found in NPM_TOKEN, GITHUB_TOKEN, or GH_TOKEN.");
  process.exit(1);
}

const title = "feat: Dashboard Subdomain Separation, Pure SEO Marketing Domain, 1-Year Retention, & OTP Verification";

const body = `## Summary of Changes

### 1. Dashboard Subdomain Separation & Pure SEO Main Domain
- **Subdomain Routing (\`lib/subdomain.ts\` & \`middleware.ts\`)**:
  - Segregated the application between \`dashboard.openanalytics.org.in\` (product workspace & auth) and \`openanalytics.org.in\` (public SEO/marketing).
  - Main domain strictly reserves \`/\`, \`/features\`, \`/pricing\`, \`/vs-google-analytics\`, \`/privacy\`, \`/faq\`, and \`/docs\`.
  - Main domain completely eliminates login and signup clutter:
    - Replaced "Sign In" and "Get Started Free" buttons with unified **"Launch Dashboard"** action linking to \`dashboard.\` subdomain.
    - Direct visits to \`/login\`, \`/register\`, or internal dashboard paths (\`/events\`, \`/vitals\`, \`/projects\`, etc.) automatically redirect to the dashboard subdomain.
  - Dashboard subdomain protects internal workspaces, handles authentication (\`/login\`, \`/register\`), and redirects marketing requests back to the main domain.
  - Added direct **"Main Website"** link inside the platform workspace navigation.

### 2. 1-Year Data Retention & Plan-Based Historical Window
- **Permanent 365-Day TTL & Purge**:
  - Enforced 365-day TTL index across raw collections (\`PageView\`, \`AnalyticsEvent\`, \`ErrorLog\`).
  - Added automated \`/api/cron/retention\` endpoint and \`purgeExpiredData()\` engine.
- **Tier-Based Historical Query Boundaries**:
  - Free Starter plan strictly clamped to **30-day** rolling telemetry window.
  - Cloud Pro and Enterprise plans unlock full **365-day (1-year)** historical telemetry queries.
  - \`DateRangeNavigator\` UI updated with \`PRO\` badges and custom date range limits.

### 3. Pricing Matrix & Commercial Rework
- Standardized Pro tier pricing to **$19/mo** (or **$15/mo billed annually** at $180/yr) with 250k events.
- Gated power modules (Custom Business Events, AI Search Radar, Web Vitals RUM, Behavioral UX Rage Clicks, and Crash Diagnostics) behind Pro with clear upgrade modals.
- Enhanced comparison matrix against Google Analytics 4 with instant benefit breakdown.

### 4. Registration Email OTP Verification & Instant Login
- Registration now creates unverified accounts (\`emailVerified: false\`) and dispatches a 6-digit email OTP.
- Direct sign-in without OTP for verified users.
- Unverified login attempts automatically trigger an OTP challenge to complete account activation.

### 5. Developer & Workflow Automation Scripts
- Added cross-platform port cleanup script (\`scripts/kill-port.js\`).
- Added automated subdomain regression test suite (\`scripts/test-subdomain.js\`).
- Added automated PR creation utility (\`scripts/create-pr.js\`).

---
### Verification
- \`yarn build\` and \`npx tsc --noEmit\` pass with 0 errors.
- Subdomain isolation and redirect test suite passed 100%.
- Verified visual browser presentation on desktop and mobile viewports.`;

async function createPR() {
  console.log(`[create-pr] Creating Pull Request for ${repo} (dev -> main)...`);

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "OpenAnalytics-Automation",
      },
      body: JSON.stringify({
        title,
        body,
        head: "dev",
        base: "main",
      }),
    });

    const data = await res.json();
    if (res.status >= 200 && res.status < 300) {
      console.log("SUCCESS: Pull Request Created!");
      console.log(`PR #${data.number}: ${data.title}`);
      console.log(`URL: ${data.html_url}`);
      return data;
    } else {
      // Check if PR already exists
      if (data.errors && data.errors.some((e) => e.message && e.message.includes("A pull request already exists"))) {
        console.log("Notice: An open pull request already exists from dev to main.");
        // Fetch existing PR
        const listRes = await fetch(`https://api.github.com/repos/${repo}/pulls?state=open&head=${repo.split("/")[0]}:dev`, {
          headers: {
            Authorization: `token ${token}`,
            "User-Agent": "OpenAnalytics-Automation",
          },
        });
        const listData = await listRes.json();
        if (Array.isArray(listData) && listData.length > 0) {
          console.log(`Existing PR #${listData[0].number}: ${listData[0].html_url}`);
          return listData[0];
        }
      }
      console.error(`ERROR status ${res.status}:`, JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error("Failed to create Pull Request:", err);
    process.exit(1);
  }
}

createPR();

#!/usr/bin/env node

/**
 * Automates creating or updating a GitHub Pull Request.
 * Dynamically derives PR title, commit history, and diff summary from git,
 * or accepts custom CLI arguments (--title, --body, etc.).
 */

import { execSync } from "child_process";

const token = process.env.NPM_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repo = process.env.GITHUB_REPOSITORY || "hackeryard/open-analytics";

if (!token) {
  console.error("ERROR: No GitHub token found in NPM_TOKEN, GITHUB_TOKEN, or GH_TOKEN.");
  process.exit(1);
}

// Parse CLI flags
const args = process.argv.slice(2);
let customTitle = null;
let customBody = null;
let baseBranch = "main";
let headBranch = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if ((arg === "--title" || arg === "-t") && args[i + 1]) {
    customTitle = args[i + 1];
    i++;
  } else if ((arg === "--body" || arg === "-b") && args[i + 1]) {
    customBody = args[i + 1];
    i++;
  } else if (arg === "--base" && args[i + 1]) {
    baseBranch = args[i + 1];
    i++;
  } else if (arg === "--head" && args[i + 1]) {
    headBranch = args[i + 1];
    i++;
  } else if (!arg.startsWith("-") && !customTitle) {
    customTitle = arg;
  } else if (!arg.startsWith("-") && !customBody) {
    customBody = arg;
  }
}

// Detect current git branch if not specified
if (!headBranch) {
  try {
    headBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  } catch {
    headBranch = "dev";
  }
}

// Fetch remote refs to ensure git comparison is accurate
try {
  execSync(`git fetch origin ${baseBranch} ${headBranch}`, { stdio: "ignore" });
} catch {}

// Dynamically extract commits between base and head
let commitList = "";
let latestCommitMsg = "";
try {
  commitList = execSync(`git log origin/${baseBranch}..HEAD --pretty=format:"* %h - %s (%an)"`, { encoding: "utf8" }).trim();
} catch {
  try {
    commitList = execSync(`git log -n 5 --pretty=format:"* %h - %s (%an)"`, { encoding: "utf8" }).trim();
  } catch {}
}

try {
  latestCommitMsg = execSync(`git log -n 1 --pretty=format:"%s"`, { encoding: "utf8" }).trim();
} catch {
  latestCommitMsg = `feat: Changes on ${headBranch}`;
}

// Diff summary stats
let diffStat = "";
try {
  diffStat = execSync(`git diff --stat origin/${baseBranch}...HEAD`, { encoding: "utf8" }).trim();
} catch {}

// Determine dynamic Title and Body
const title = customTitle || latestCommitMsg || `feat: Updates on ${headBranch}`;

let body = customBody;
if (!body) {
  body = `## Pull Request Summary\n\n` +
    `Automated PR from \`${headBranch}\` to \`${baseBranch}\`.\n\n` +
    `### Commits Included\n` +
    (commitList ? `${commitList}\n\n` : `* ${latestCommitMsg}\n\n`) +
    `### Changed Files & Statistics\n` +
    `\`\`\`text\n${diffStat || "No file changes detected."}\n\`\`\`\n\n` +
    `---\n*Generated automatically via project PR script.*`;
}

async function createOrUpdatePR() {
  console.log(`[create-pr] Target: ${repo} (${headBranch} -> ${baseBranch})`);
  console.log(`[create-pr] Title: "${title}"`);

  const owner = repo.split("/")[0];

  try {
    // 1. Check if an open PR already exists
    const listRes = await fetch(
      `https://api.github.com/repos/${repo}/pulls?state=open&head=${owner}:${headBranch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "OpenAnalytics-Automation",
        },
      }
    );
    const existingPRs = await listRes.json();

    if (Array.isArray(existingPRs) && existingPRs.length > 0) {
      const existing = existingPRs[0];
      console.log(`[create-pr] Found existing open PR #${existing.number}: ${existing.html_url}`);
      console.log(`[create-pr] Updating PR #${existing.number} with latest title and body...`);

      const updateRes = await fetch(`https://api.github.com/repos/${repo}/pulls/${existing.number}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "OpenAnalytics-Automation",
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });

      const updatedData = await updateRes.json();
      if (updateRes.status >= 200 && updateRes.status < 300) {
        console.log(`SUCCESS: PR #${updatedData.number} successfully updated!`);
        console.log(`Title: ${updatedData.title}`);
        console.log(`URL: ${updatedData.html_url}`);
        return updatedData;
      } else {
        console.error(`ERROR updating PR #${existing.number}:`, JSON.stringify(updatedData, null, 2));
        process.exit(1);
      }
    }

    // 2. Create new PR if none exists
    console.log(`[create-pr] Creating new Pull Request...`);
    const createRes = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "OpenAnalytics-Automation",
      },
      body: JSON.stringify({
        title,
        body,
        head: headBranch,
        base: baseBranch,
      }),
    });

    const createData = await createRes.json();
    if (createRes.status >= 200 && createRes.status < 300) {
      console.log(`SUCCESS: Pull Request #${createData.number} Created!`);
      console.log(`Title: ${createData.title}`);
      console.log(`URL: ${createData.html_url}`);
      return createData;
    } else {
      console.error(`ERROR creating PR status ${createRes.status}:`, JSON.stringify(createData, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error("[create-pr] Failed:", err.message);
    process.exit(1);
  }
}

createOrUpdatePR();

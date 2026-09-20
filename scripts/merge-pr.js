#!/usr/bin/env node

/**
 * Automates merging a GitHub Pull Request via the GitHub REST API.
 * Usage: node scripts/merge-pr.js [pr_number]
 */

import { execSync } from "child_process";

const token = process.env.NPM_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repo = process.env.GITHUB_REPOSITORY || "hackeryard/open-analytics";

if (!token) {
  console.error("ERROR: No GitHub token found in NPM_TOKEN, GITHUB_TOKEN, or GH_TOKEN.");
  process.exit(1);
}

const args = process.argv.slice(2);
let prNumber = args[0] ? parseInt(args[0], 10) : null;

async function mergePR() {
  const owner = repo.split("/")[0];

  // If no PR number is passed, find the open PR for the current branch
  if (!prNumber) {
    let headBranch = "dev";
    try {
      headBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
    } catch {}

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
      prNumber = existingPRs[0].number;
    } else {
      console.error(`ERROR: No open PR found for branch ${headBranch}.`);
      process.exit(1);
    }
  }

  console.log(`[merge-pr] Merging PR #${prNumber} on ${repo}...`);

  const mergeRes = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}/merge`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "OpenAnalytics-Automation",
    },
    body: JSON.stringify({
      commit_title: `feat: merge pull request #${prNumber} into main`,
      merge_method: "merge",
    }),
  });

  const mergeData = await mergeRes.json();

  if (mergeRes.status === 200 && mergeData.merged) {
    console.log(`SUCCESS: PR #${prNumber} has been successfully merged into main!`);
    console.log(`SHA: ${mergeData.sha}`);
    console.log(`Message: ${mergeData.message}`);
  } else {
    console.error(`ERROR: Merge failed (status ${mergeRes.status}):`, JSON.stringify(mergeData, null, 2));
    process.exit(1);
  }
}

mergePR();

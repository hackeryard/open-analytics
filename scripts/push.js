#!/usr/bin/env node

import { execSync } from "child_process";

const args = process.argv.slice(2);
let commitMsg = args.join(" ").trim();

// Get current branch
let currentBranch = "dev";
try {
  currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
} catch (e) {
  // fallback
}

if (!commitMsg) {
  commitMsg = `feat: Update application features and automation scripts on ${currentBranch}`;
}

console.log(`[git-push] Preparing to stage, commit, and push to origin/${currentBranch}...`);

try {
  // Check status
  const status = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  
  if (!status) {
    console.log("[git-push] No uncommitted changes detected in working tree.");
  } else {
    console.log("[git-push] Staging changes...");
    execSync("git add -A", { stdio: "inherit" });

    console.log(`[git-push] Committing with message: "${commitMsg}"...`);
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  }

  console.log(`[git-push] Pushing to origin ${currentBranch}...`);
  execSync(`git push origin ${currentBranch}`, { stdio: "inherit" });

  console.log(`[git-push] Successfully pushed changes to origin/${currentBranch}!`);
} catch (err) {
  console.error(`[git-push] Error during commit/push:`, err.message);
  process.exit(1);
}

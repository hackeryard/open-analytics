#!/usr/bin/env node

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rawArgs = process.argv.slice(2);
const shouldCreatePR = rawArgs.includes("--pr");
const commitArgs = rawArgs.filter((arg) => arg !== "--pr");
const commitMsg = commitArgs.join(" ").trim() || "feat: Synchronize recent improvements and updates";

let currentBranch = "dev";
try {
  currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
} catch (e) {}

console.log(`=================================================`);
console.log(` [Git Sync Pipeline] Branch: ${currentBranch}`);
console.log(`=================================================`);

// 1. Pull
console.log(`\nStep 1: Pulling latest changes from origin/${currentBranch}...`);
try {
  execSync(`node "${path.join(__dirname, "pull.js")}" ${currentBranch}`, { stdio: "inherit" });
} catch (err) {
  console.error(`Pull failed. Aborting sync.`);
  process.exit(1);
}

// 2. Commit & Push
console.log(`\nStep 2: Staging, committing, and pushing...`);
try {
  execSync(`node "${path.join(__dirname, "push.js")}" "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
} catch (err) {
  console.error(`Push failed. Aborting sync.`);
  process.exit(1);
}

// 3. Create PR if requested
if (shouldCreatePR) {
  console.log(`\nStep 3: Creating/Verifying Pull Request...`);
  try {
    execSync(`node "${path.join(__dirname, "create-pr.js")}"`, { stdio: "inherit" });
  } catch (err) {
    console.error(`PR creation encountered an issue:`, err.message);
  }
}

console.log(`\n=================================================`);
console.log(` [Git Sync Pipeline] Finished successfully!`);
console.log(`=================================================`);

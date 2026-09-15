#!/usr/bin/env node

import { execSync } from "child_process";

const branch = process.argv[2] || "dev";
console.log(`[git-pull] Pulling latest changes from origin/${branch}...`);

try {
  const output = execSync(`git pull origin ${branch}`, { encoding: "utf8" });
  console.log(output.trim());
  console.log(`[git-pull] Successfully pulled latest changes for '${branch}'.`);
} catch (err) {
  console.error(`[git-pull] Failed to pull from origin/${branch}:`, err.message);
  process.exit(1);
}

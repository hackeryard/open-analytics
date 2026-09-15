#!/usr/bin/env node

import fs from "fs";
import dns from "dns";
import mongoose from "mongoose";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

// Load environment variables from .env.local if present
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/open_analytics";

async function runPurge() {
  console.log("[purge-retention] Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("[purge-retention] Connected successfully.");

  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  console.log(`[purge-retention] Purging telemetry records created before ${oneYearAgo.toISOString()}...`);

  const db = mongoose.connection.db;

  const [pvRes, evRes, errRes] = await Promise.all([
    db.collection("pageviews").deleteMany({ createdAt: { $lt: oneYearAgo } }),
    db.collection("analyticsevents").deleteMany({ createdAt: { $lt: oneYearAgo } }),
    db.collection("errorlogs").deleteMany({ createdAt: { $lt: oneYearAgo } }),
  ]);

  const pageviews = pvRes?.deletedCount || 0;
  const events = evRes?.deletedCount || 0;
  const errors = errRes?.deletedCount || 0;
  const total = pageviews + events + errors;

  console.log(`[purge-retention] Purge complete!`);
  console.log(`  - Pageviews deleted: ${pageviews}`);
  console.log(`  - Events deleted:    ${events}`);
  console.log(`  - Errors deleted:    ${errors}`);
  console.log(`  - Total deleted:     ${total}`);

  await mongoose.disconnect();
  console.log("[purge-retention] Database disconnected.");
  process.exit(0);
}

runPurge().catch((err) => {
  console.error("[purge-retention] Error executing retention purge:", err);
  process.exit(1);
});

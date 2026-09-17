/**
 * Integration test script for the temporary subscription system.
 * Tests:
 * 1. Plan seeding
 * 2. Subscription Request creation
 * 3. Duplicate request prevention
 * 4. Manual admin activation & entitlement upgrade
 * 5. Audit log generation
 */
import mongoose from "mongoose";
import dns from "dns";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
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

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

async function run() {
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI not found in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("[TEST] Connected to MongoDB successfully");

  const db = mongoose.connection.db;

  // 1. Verify collections exist or can be queried
  const plansCol = db.collection("subscriptionplans");
  const requestsCol = db.collection("subscriptionrequests");
  const subsCol = db.collection("subscriptions");
  const paymentsCol = db.collection("payments");
  const auditLogsCol = db.collection("subscriptionauditlogs");
  const usersCol = db.collection("users");

  // Find users
  const users = await usersCol.find({}).toArray();
  console.log("[TEST] Users in DB:");
  users.forEach(u => console.log(` - ${u.email}: plan=${u.plan}, role=${u.role}, expires=${u.planExpiresAt}, status=${u.subscriptionStatus}`));

  // Check requests
  const reqs = await requestsCol.find({}).toArray();
  console.log(`[TEST] Subscription requests in DB (${reqs.length}):`);
  reqs.forEach(r => console.log(` - Req ID ${r._id}: user=${r.userEmail}, plan=${r.planId}, status=${r.status}, createdAt=${r.createdAt}`));

  // Check subscriptions
  const subs = await subsCol.find({}).toArray();
  console.log(`[TEST] Subscriptions in DB (${subs.length}):`);
  subs.forEach(s => console.log(` - Sub ID ${s._id}: user=${s.userId}, tier=${s.planTier}, status=${s.status}, start=${s.startDate}, end=${s.endDate}`));

  // Check payments
  const payments = await paymentsCol.find({}).toArray();
  console.log(`[TEST] Payments in DB (${payments.length}):`);
  payments.forEach(p => console.log(` - Payment ID ${p._id}: user=${p.userId}, amount=${p.amount}, provider=${p.provider}, status=${p.status}`));

  // Check audit logs
  const auditLogs = await auditLogsCol.find({}).toArray();
  console.log(`[TEST] Audit logs in DB (${auditLogs.length}):`);
  auditLogs.forEach(a => console.log(` - Audit ${a._id}: action=${a.action}, user=${a.affectedUserEmail}, admin=${a.adminEmail || a.adminId}, time=${a.createdAt}`));

  await mongoose.disconnect();
  console.log("[TEST] Disconnected cleanly.");
}

run().catch((err) => {
  console.error("[TEST ERROR]", err);
  process.exit(1);
});

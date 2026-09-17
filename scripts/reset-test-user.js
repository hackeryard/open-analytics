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
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const res = await db.collection("users").updateOne(
    { email: "rahulrajput3621@gmail.com" },
    { $set: { plan: "free", planExpiresAt: null, subscriptionStatus: "active" } }
  );

  console.log("User updated successfully:", res.modifiedCount);

  const user = await db.collection("users").findOne({ email: "rahulrajput3621@gmail.com" });
  console.log("Current user in DB:", {
    email: user.email,
    plan: user.plan,
    planExpiresAt: user.planExpiresAt,
    subscriptionStatus: user.subscriptionStatus,
  });

  await mongoose.disconnect();
}

run();

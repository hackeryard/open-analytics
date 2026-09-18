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

  const projects = await db.collection("projects").find({}).toArray();
  const users = await db.collection("users").find({}).toArray();
  const userMap = new Map(users.map(u => [u._id.toString(), u.email]));
  console.log("PROJECTS_DETAILED:", projects.map(p => ({
    id: p._id.toString(),
    projectId: p.projectId,
    name: p.name,
    ownerEmail: userMap.get(p.ownerId?.toString()),
    publishableKey: p.publishableKey,
    allowedDomains: p.allowedDomains
  })));

  await mongoose.disconnect();
}

run();

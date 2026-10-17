import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setDefaultResultOrder?.("ipv4first");
  if (process.env.NODE_ENV === "development" && process.platform === "win32") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
} catch (e) {}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, lastPingAt: 0 };
}

// How often to verify the connection is truly alive (ms).
// MongoDB Atlas and most providers close idle sockets after 30-60s.
// Pinging every 30s ensures we detect dead connections before they cause 500s.
const PING_INTERVAL_MS = 30_000;

/**
 * Verifies the cached MongoDB connection is genuinely alive
 * by issuing a lightweight admin ping command.
 * Returns true only if the ping succeeds within a tight timeout.
 */
async function isConnectionAlive(): Promise<boolean> {
  try {
    if (!cached.conn || cached.conn.readyState !== 1) return false;

    // Skip ping if we verified recently
    if (Date.now() - cached.lastPingAt < PING_INTERVAL_MS) return true;

    await cached.conn.db.admin().ping();
    cached.lastPingAt = Date.now();
    return true;
  } catch {
    return false;
  }
}

/**
 * Force-close a stale connection so the next call creates a fresh one.
 */
async function forceDisconnect(): Promise<void> {
  cached.conn = null;
  cached.promise = null;
  cached.lastPingAt = 0;
  try {
    await mongoose.disconnect();
  } catch {}
}

export async function connectDB() {
  // Fast path: connection is cached and recently verified alive
  if (cached.conn && cached.conn.readyState === 1) {
    if (Date.now() - cached.lastPingAt < PING_INTERVAL_MS) {
      return cached.conn;
    }

    // Verify the connection is actually alive, not just "readyState 1 with dead socket"
    const alive = await isConnectionAlive();
    if (alive) return cached.conn;

    // Connection is stale -- force reconnect
    console.warn("MongoDB connection stale (ping failed), forcing reconnect...");
    await forceDisconnect();
  }

  // If readyState is not 1 (disconnected/disconnecting), also force-clean
  if (cached.conn && cached.conn.readyState !== 1) {
    await forceDisconnect();
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 15000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((m) => m).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    const m = await cached.promise;
    cached.conn = m.connection;
    cached.lastPingAt = Date.now();
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    cached.conn = null;
    cached.lastPingAt = 0;
    console.error("MongoDB Connection Error:", error.message || error);
    throw error;
  }
}
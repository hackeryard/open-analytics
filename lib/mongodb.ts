import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setDefaultResultOrder?.("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((m) => m).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    const m = await cached.promise;
    cached.conn = m.connection;
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    console.error("MongoDB Connection Error:", error.message || error);
    throw error;
  }
}
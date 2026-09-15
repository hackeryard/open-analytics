import { NextResponse } from "next/server";
import { purgeOneYearOldData } from "@/lib/dataRetention";

export async function GET(req: Request) {
  return handlePurge(req);
}

export async function POST(req: Request) {
  return handlePurge(req);
}

async function handlePurge(req: Request) {
  try {
    // Optional secret key protection if CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      const urlSecret = new URL(req.url).searchParams.get("secret");
      if (authHeader !== `Bearer ${cronSecret}` && urlSecret !== cronSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const result = await purgeOneYearOldData();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Data retention purge error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to purge old data" },
      { status: 500 }
    );
  }
}

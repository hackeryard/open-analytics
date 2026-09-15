import { connectDB } from "@/lib/mongodb";
import PageView from "@/models/PageView";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import ErrorLog from "@/models/ErrorLog";

export interface RetentionWindow {
  maxDays: number;
  label: string;
  earliestDate: Date;
}

/**
 * Returns the maximum historical data window allowed for a project plan.
 * - Free: 30 days
 * - Pro / Enterprise: 365 days (1 year)
 */
export function getRetentionWindow(plan = "free"): RetentionWindow {
  const isPro = plan === "pro" || plan === "enterprise";
  const maxDays = isPro ? 365 : 30;
  const earliestDate = new Date(Date.now() - maxDays * 24 * 60 * 60 * 1000);

  return {
    maxDays,
    label: isPro ? "365 Days (1 Year)" : "30 Days (Free Tier Limit)",
    earliestDate,
  };
}

/**
 * Permanently purges telemetry data older than 1 year (365 days) across all projects.
 * Applied across PageView, AnalyticsEvent, and ErrorLog collections.
 */
export async function purgeOneYearOldData(): Promise<{
  success: boolean;
  cutoffDate: string;
  deleted: {
    pageviews: number;
    events: number;
    errors: number;
    total: number;
  };
}> {
  await connectDB();
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  const [pvResult, evResult, errResult] = await Promise.all([
    (PageView as any).deleteMany({ createdAt: { $lt: oneYearAgo } }),
    (AnalyticsEvent as any).deleteMany({ createdAt: { $lt: oneYearAgo } }),
    (ErrorLog as any).deleteMany({ createdAt: { $lt: oneYearAgo } }),
  ]);

  const pageviews = pvResult?.deletedCount || 0;
  const events = evResult?.deletedCount || 0;
  const errors = errResult?.deletedCount || 0;

  return {
    success: true,
    cutoffDate: oneYearAgo.toISOString(),
    deleted: {
      pageviews,
      events,
      errors,
      total: pageviews + events + errors,
    },
  };
}

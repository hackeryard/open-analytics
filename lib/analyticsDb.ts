import PageView from "@/models/PageView";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import ErrorLog from "@/models/ErrorLog";
import { getFullCountryName, getCountryIsoCode, getContinentForCountry } from "@/lib/countries";

/**
 * Calculates date match stage and range metadata from timeRange string or explicit dates
 */
export function parseDateFilter(
  projectId: string,
  timeRange = "7d",
  startDateParam?: string | null,
  endDateParam?: string | null,
  plan = "free"
): {
  matchStage: {
    projectId: string;
    createdAt: { $gte: Date; $lte?: Date };
  };
  isHourly: boolean;
  label: string;
  maxRetentionDays: number;
} {
  const now = new Date();
  const isPro = plan === "pro" || plan === "enterprise";
  const maxRetentionDays = isPro ? 365 : 30;
  const earliestAllowed = new Date(now.getTime() - maxRetentionDays * 24 * 60 * 60 * 1000);

  // 1. Explicit startDate and endDate params or "custom:YYYY-MM-DD_YYYY-MM-DD"
  if (
    (startDateParam && endDateParam) ||
    timeRange.startsWith("custom:")
  ) {
    let startStr = startDateParam;
    let endStr = endDateParam;

    if (timeRange.startsWith("custom:")) {
      const parts = timeRange.replace(/^custom:/, "").split("_");
      startStr = parts[0];
      endStr = parts[1] || parts[0];
    }

    const rawStart = new Date(`${startStr}T00:00:00.000Z`);
    const rawEnd = new Date(`${endStr}T23:59:59.999Z`);
    const start = isNaN(rawStart.getTime()) ? earliestAllowed : rawStart;
    const end = isNaN(rawEnd.getTime()) ? now : rawEnd;
    const clampedStart = new Date(Math.max(start.getTime(), earliestAllowed.getTime()));
    const isSingleDay = startStr === endStr;

    return {
      matchStage: {
        projectId,
        createdAt: {
          $gte: clampedStart,
          $lte: end,
        },
      },
      isHourly: isSingleDay,
      label: isSingleDay ? startStr || "" : `${startStr} to ${endStr}`,
      maxRetentionDays,
    };
  }

  // 2. Single specific day navigation "date:YYYY-MM-DD"
  if (timeRange.startsWith("date:")) {
    const dateStr = timeRange.replace(/^date:/, "").trim();
    const rawStart = new Date(`${dateStr}T00:00:00.000Z`);
    const rawEnd = new Date(`${dateStr}T23:59:59.999Z`);
    const start = isNaN(rawStart.getTime()) ? earliestAllowed : rawStart;
    const end = isNaN(rawEnd.getTime()) ? now : rawEnd;
    const clampedStart = new Date(Math.max(start.getTime(), earliestAllowed.getTime()));

    return {
      matchStage: {
        projectId,
        createdAt: {
          $gte: clampedStart,
          $lte: end,
        },
      },
      isHourly: true,
      label: dateStr,
      maxRetentionDays,
    };
  }

  // 3. Preset ranges
  switch (timeRange) {
    case "today": {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: todayStart, $lte: now },
        },
        isHourly: true,
        label: "Today",
        maxRetentionDays,
      };
    }
    case "yesterday": {
      const yStart = new Date();
      yStart.setDate(yStart.getDate() - 1);
      yStart.setHours(0, 0, 0, 0);

      const yEnd = new Date();
      yEnd.setDate(yEnd.getDate() - 1);
      yEnd.setHours(23, 59, 59, 999);

      return {
        matchStage: {
          projectId,
          createdAt: { $gte: yStart, $lte: yEnd },
        },
        isHourly: true,
        label: "Yesterday",
        maxRetentionDays,
      };
    }
    case "24h":
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        },
        isHourly: true,
        label: "Past 24 Hours",
        maxRetentionDays,
      };
    case "7d":
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
        },
        isHourly: false,
        label: "Past 7 Days",
        maxRetentionDays,
      };
    case "30d":
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
        },
        isHourly: false,
        label: "Past 30 Days",
        maxRetentionDays,
      };
    case "90d": {
      if (!isPro) {
        return {
          matchStage: {
            projectId,
            createdAt: { $gte: earliestAllowed },
          },
          isHourly: false,
          label: "Past 30 Days (Free Tier Limit)",
          maxRetentionDays,
        };
      }
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) },
        },
        isHourly: false,
        label: "Past 90 Days",
        maxRetentionDays,
      };
    }
    case "1y":
    case "365d": {
      if (!isPro) {
        return {
          matchStage: {
            projectId,
            createdAt: { $gte: earliestAllowed },
          },
          isHourly: false,
          label: "Past 30 Days (Free Tier Limit)",
          maxRetentionDays,
        };
      }
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: earliestAllowed },
        },
        isHourly: false,
        label: "Past 365 Days",
        maxRetentionDays,
      };
    }
    case "all":
    default: {
      return {
        matchStage: {
          projectId,
          createdAt: { $gte: earliestAllowed },
        },
        isHourly: false,
        label: isPro ? "Past 365 Days" : "Past 30 Days (Free Tier Limit)",
        maxRetentionDays,
      };
    }
  }
}

export async function getProjectAnalytics(
  projectId: string,
  timeRange = "7d",
  startDateParam?: string | null,
  endDateParam?: string | null,
  plan = "free"
) {
  const { matchStage, isHourly } = parseDateFilter(
    projectId,
    timeRange,
    startDateParam,
    endDateParam,
    plan
  );
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  // 1. High-level Overview Metrics
  const overviewPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalViews: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$visitorId" },
        uniqueSessions: { $addToSet: "$sessionId" },
        anonymousSessions: {
          $addToSet: {
            $cond: [{ $eq: ["$userId", null] }, "$sessionId", "$$REMOVE"],
          },
        },
        authenticatedSessions: {
          $addToSet: {
            $cond: [{ $ne: ["$userId", null] }, "$sessionId", "$$REMOVE"],
          },
        },
        avgDuration: { $avg: "$duration" },
        avgScrollDepth: { $avg: "$scrollDepth" },
      },
    },
  ]);

  // 2. Real-time active users (< 5m) & live paths
  const realtimePromise = (PageView as any).aggregate([
    { $match: { projectId, updatedAt: { $gte: fiveMinutesAgo } } },
    {
      $group: {
        _id: "$pathname",
        activeVisitors: { $addToSet: "$visitorId" },
        totalActive: { $sum: 1 },
      },
    },
    { $sort: { totalActive: -1 } },
    { $limit: 15 },
  ]);

  // 3. Time Series Graph
  const dateFormat = isHourly ? "%Y-%m-%d %H:00" : "%Y-%m-%d";

  const timeseriesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        returningVisitors: {
          $addToSet: {
            $cond: [
              {
                $or: [
                  { $eq: ["$isReturning", true] },
                  { $gt: ["$visitCount", 1] },
                ],
              },
              "$visitorId",
              "$$REMOVE",
            ],
          },
        },
        returningViews: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $eq: ["$isReturning", true] },
                  { $gt: ["$visitCount", 1] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 3b. Visitor Retention & Frequency Distribution (New vs. Returning)
  const retentionPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$visitorId",
        sessions: { $addToSet: "$sessionId" },
        maxVisitCount: { $max: { $ifNull: ["$visitCount", 1] } },
        hasReturningFlag: { $max: { $cond: ["$isReturning", 1, 0] } },
      },
    },
    {
      $project: {
        isReturning: {
          $or: [
            { $eq: ["$hasReturningFlag", 1] },
            { $gt: ["$maxVisitCount", 1] },
            { $gt: [{ $size: "$sessions" }, 1] },
          ],
        },
        effectiveVisits: {
          $max: ["$maxVisitCount", { $size: "$sessions" }],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalVisitors: { $sum: 1 },
        returningVisitors: { $sum: { $cond: ["$isReturning", 1, 0] } },
        newVisitors: { $sum: { $cond: ["$isReturning", 0, 1] } },
        singleVisit: { $sum: { $cond: [{ $eq: ["$effectiveVisits", 1] }, 1, 0] } },
        twoVisits: { $sum: { $cond: [{ $eq: ["$effectiveVisits", 2] }, 1, 0] } },
        threeToFiveVisits: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$effectiveVisits", 3] },
                  { $lte: ["$effectiveVisits", 5] },
                ],
              },
              1,
              0,
            ],
          },
        },
        sixPlusVisits: {
          $sum: { $cond: [{ $gte: ["$effectiveVisits", 6] }, 1, 0] },
        },
      },
    },
  ]);

  // 3c. Detailed Visitors & User Profiles Directory (All users, new, returning, loyal champions)
  const returningUsersPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$visitorId",
        userIds: { $addToSet: "$userId" },
        firstSeen: { $min: "$createdAt" },
        lastSeen: { $max: "$createdAt" },
        totalViews: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
        maxVisitCount: { $max: { $ifNull: ["$visitCount", 1] } },
        sessions: { $addToSet: "$sessionId" },
        paths: { $addToSet: "$pathname" },
        country: { $last: "$country" },
        city: { $last: "$city" },
        device: { $last: "$device" },
        browser: { $last: "$browser" },
        os: { $last: "$os" },
        hasReturningFlag: { $max: { $cond: ["$isReturning", 1, 0] } },
      },
    },
    {
      $project: {
        _id: 1,
        userId: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$userIds",
                as: "u",
                cond: { $ne: ["$$u", null] },
              },
            },
            0,
          ],
        },
        firstSeen: 1,
        lastSeen: 1,
        totalViews: 1,
        totalDuration: 1,
        visitCount: { $max: ["$maxVisitCount", { $size: "$sessions" }] },
        sessionCount: { $size: "$sessions" },
        topPaths: { $slice: ["$paths", 8] },
        country: 1,
        city: 1,
        device: 1,
        browser: 1,
        os: 1,
        hasReturningFlag: 1,
      },
    },
    { $sort: { lastSeen: -1 } },
    { $limit: 250 },
  ]);

  // 4. Top Pages / Labs
  const topPagesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$pathname",
        title: { $first: "$title" },
        labId: { $first: "$labId" },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        avgDuration: { $avg: "$duration" },
        avgScrollDepth: { $avg: "$scrollDepth" },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 100 },
  ]);

  // 5. Referrers & Acquisition (Excluding OAuth auth redirectors & internal app subdomains)
  const topReferrersPromise = (PageView as any).aggregate([
    {
      $match: {
        ...matchStage,
        referrerDomain: {
          $nin: [
            "accounts.google.com",
            "appleid.apple.com",
            "openlabs.org.in",
            "admin.openlabs.org.in",
            "localhost",
            "127.0.0.1",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$referrerDomain",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  // 6. UTM Campaigns
  const utmCampaignsPromise = (PageView as any).aggregate([
    {
      $match: {
        ...matchStage,
        $or: [
          { utmSource: { $ne: null } },
          { utmCampaign: { $ne: null } },
        ],
      },
    },
    {
      $group: {
        _id: {
          source: { $ifNull: ["$utmSource", "direct"] },
          medium: { $ifNull: ["$utmMedium", "none"] },
          campaign: { $ifNull: ["$utmCampaign", "none"] },
        },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        avgDuration: { $avg: "$duration" },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 15 },
  ]);

  // 7. Devices, OS, Browsers & Screen Sizes
  const devicesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 },
      },
    },
  ]);

  const browsersPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const osPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const screensPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, screen: { $ne: "" } } },
    {
      $group: {
        _id: "$screen",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // 8. Countries
  const countriesPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$country",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 35 },
  ]);

  // 8b. Cities Distribution
  const citiesPromise = (PageView as any).aggregate([
    {
      $match: {
        ...matchStage,
        city: { $exists: true, $ne: "" },
      },
    },
    {
      $group: {
        _id: { city: "$city", country: "$country" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 30 },
  ]);

  // 9. Duration Engagement Distribution
  const durationDistributionPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        under10s: { $sum: { $cond: [{ $lt: ["$duration", 10] }, 1, 0] } },
        under30s: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 10] }, { $lt: ["$duration", 30] }] }, 1, 0] } },
        under1m: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 30] }, { $lt: ["$duration", 60] }] }, 1, 0] } },
        under3m: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 60] }, { $lt: ["$duration", 180] }] }, 1, 0] } },
        under10m: { $sum: { $cond: [{ $and: [{ $gte: ["$duration", 180] }, { $lt: ["$duration", 600] }] }, 1, 0] } },
        over10m: { $sum: { $cond: [{ $gte: ["$duration", 600] }, 1, 0] } },
      },
    },
  ]);

  // 10. Scroll Depth Distribution
  const scrollDistributionPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        depth25: { $sum: { $cond: [{ $lt: ["$scrollDepth", 25] }, 1, 0] } },
        depth50: { $sum: { $cond: [{ $and: [{ $gte: ["$scrollDepth", 25] }, { $lt: ["$scrollDepth", 50] }] }, 1, 0] } },
        depth75: { $sum: { $cond: [{ $and: [{ $gte: ["$scrollDepth", 50] }, { $lt: ["$scrollDepth", 75] }] }, 1, 0] } },
        depth100: { $sum: { $cond: [{ $gte: ["$scrollDepth", 75] }, 1, 0] } },
      },
    },
  ]);

  // 11. Recent Live Pageviews Feed (Detailed Log)
  const recentPageViewsPromise = (PageView as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar level xp",
    })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  // 12. Custom Learning / Lab Events (Detailed Stream)
  const eventsPromise = (AnalyticsEvent as any).find(matchStage)
    .populate({
      path: "userId",
      select: "name email username avatar level xp",
    })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  // 13. Error Logs in Timeframe (matches either lastOccurredAt or createdAt within range)
  const errorMatchStage: Record<string, any> = { projectId };
  if (matchStage.createdAt) {
    errorMatchStage.$or = [
      { lastOccurredAt: matchStage.createdAt },
      { createdAt: matchStage.createdAt },
      { updatedAt: matchStage.createdAt },
    ];
  }

  const errorsPromise = (ErrorLog as any).find(errorMatchStage)
    .populate({
      path: "userId",
      select: "name email username avatar",
    })
    .sort({ lastOccurredAt: -1 })
    .limit(1000)
    .lean();

  const errorStatsPromise = (ErrorLog as any).aggregate([
    { $match: errorMatchStage },
    {
      $group: {
        _id: null,
        totalErrors: { $sum: "$occurrences" },
        uniqueIssues: { $sum: 1 },
        statusNew: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
        statusInvestigating: { $sum: { $cond: [{ $eq: ["$status", "investigating"] }, 1, 0] } },
        statusResolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
      },
    },
  ]);

  // 14. Real User Monitoring (RUM) & Core Web Vitals
  const webVitalsSummaryPromise = (PageView as any).aggregate([
    {
      $match: {
        ...matchStage,
        $or: [
          { "webVitals.lcp": { $ne: null } },
          { "webVitals.fcp": { $ne: null } },
          { "webVitals.cls": { $ne: null } },
          { "webVitals.inp": { $ne: null } },
          { "webVitals.ttfb": { $ne: null } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        totalWithVitals: { $sum: 1 },
        avgLcp: { $avg: "$webVitals.lcp" },
        avgFcp: { $avg: "$webVitals.fcp" },
        avgCls: { $avg: "$webVitals.cls" },
        avgInp: { $avg: "$webVitals.inp" },
        avgTtfb: { $avg: "$webVitals.ttfb" },
        avgDomLoad: { $avg: "$webVitals.domLoad" },
        avgWindowLoad: { $avg: "$webVitals.windowLoad" },
        goodLcp: { $sum: { $cond: [{ $and: [{ $ne: ["$webVitals.lcp", null] }, { $lte: ["$webVitals.lcp", 2500] }] }, 1, 0] } },
        needsImpLcp: { $sum: { $cond: [{ $and: [{ $gt: ["$webVitals.lcp", 2500] }, { $lte: ["$webVitals.lcp", 4000] }] }, 1, 0] } },
        poorLcp: { $sum: { $cond: [{ $gt: ["$webVitals.lcp", 4000] }, 1, 0] } },
        goodFcp: { $sum: { $cond: [{ $and: [{ $ne: ["$webVitals.fcp", null] }, { $lte: ["$webVitals.fcp", 1800] }] }, 1, 0] } },
        needsImpFcp: { $sum: { $cond: [{ $and: [{ $gt: ["$webVitals.fcp", 1800] }, { $lte: ["$webVitals.fcp", 3000] }] }, 1, 0] } },
        poorFcp: { $sum: { $cond: [{ $gt: ["$webVitals.fcp", 3000] }, 1, 0] } },
        goodCls: { $sum: { $cond: [{ $and: [{ $ne: ["$webVitals.cls", null] }, { $lte: ["$webVitals.cls", 0.1] }] }, 1, 0] } },
        needsImpCls: { $sum: { $cond: [{ $and: [{ $gt: ["$webVitals.cls", 0.1] }, { $lte: ["$webVitals.cls", 0.25] }] }, 1, 0] } },
        poorCls: { $sum: { $cond: [{ $gt: ["$webVitals.cls", 0.25] }, 1, 0] } },
        goodInp: { $sum: { $cond: [{ $and: [{ $ne: ["$webVitals.inp", null] }, { $lte: ["$webVitals.inp", 200] }] }, 1, 0] } },
        needsImpInp: { $sum: { $cond: [{ $and: [{ $gt: ["$webVitals.inp", 200] }, { $lte: ["$webVitals.inp", 500] }] }, 1, 0] } },
        poorInp: { $sum: { $cond: [{ $gt: ["$webVitals.inp", 500] }, 1, 0] } },
      },
    },
  ]);

  const webVitalsPagesPromise = (PageView as any).aggregate([
    {
      $match: {
        ...matchStage,
        "webVitals.lcp": { $ne: null },
      },
    },
    {
      $group: {
        _id: "$pathname",
        count: { $sum: 1 },
        avgLcp: { $avg: "$webVitals.lcp" },
        avgFcp: { $avg: "$webVitals.fcp" },
        avgCls: { $avg: "$webVitals.cls" },
        avgInp: { $avg: "$webVitals.inp" },
        avgTtfb: { $avg: "$webVitals.ttfb" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);

  // 15. Hardware & Network Diagnostics
  const networkTypesPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, "network.effectiveType": { $exists: true, $ne: "" } } },
    { $group: { _id: "$network.effectiveType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const hardwareGpuPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, "hardware.gpu": { $exists: true, $ne: "" } } },
    { $group: { _id: "$hardware.gpu", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const hardwareCoresPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, "hardware.cores": { $exists: true, $ne: null } } },
    { $group: { _id: "$hardware.cores", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  // 16. Lab Intelligence & Learning Funnel
  const labFunnelPromise = (AnalyticsEvent as any).aggregate([
    {
      $match: {
        ...matchStage,
        category: "lab",
      },
    },
    {
      $group: {
        _id: "$labId",
        starts: { $sum: { $cond: [{ $eq: ["$eventName", "lab_started"] }, 1, 0] } },
        completes: { $sum: { $cond: [{ $eq: ["$eventName", "lab_completed"] }, 1, 0] } },
        parameterTweaks: { $sum: { $cond: [{ $eq: ["$eventName", "lab_param_change"] }, 1, 0] } },
        stepProgressions: { $sum: { $cond: [{ $eq: ["$eventName", "lab_step_progress"] }, 1, 0] } },
        quizAttempts: { $sum: { $cond: [{ $eq: ["$eventName", "lab_quiz_attempt"] }, 1, 0] } },
        resets: { $sum: { $cond: [{ $eq: ["$eventName", "lab_reset"] }, 1, 0] } },
        uniqueStudents: { $addToSet: "$visitorId" },
      },
    },
    {
      $project: {
        _id: 1,
        starts: 1,
        completes: 1,
        parameterTweaks: 1,
        stepProgressions: 1,
        quizAttempts: 1,
        resets: 1,
        uniqueStudents: { $size: "$uniqueStudents" },
        completionRate: {
          $cond: [
            { $gt: ["$starts", 0] },
            { $round: [{ $multiply: [{ $divide: ["$completes", "$starts"] }, 100] }, 1] },
            0,
          ],
        },
      },
    },
    { $sort: { starts: -1 } },
    { $limit: 25 },
  ]);

  // 17. Behavioral UX Signals (Rage clicks, Bounce, Active vs. Idle Dwell)
  const rageClicksPromise = (AnalyticsEvent as any).aggregate([
    {
      $match: {
        ...matchStage,
        eventName: "ux_rage_click",
      },
    },
    {
      $group: {
        _id: {
          element: "$properties.element",
          pathname: "$pathname",
        },
        count: { $sum: 1 },
        sampleText: { $first: "$properties.text" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);

  const outboundClicksPromise = (AnalyticsEvent as any).aggregate([
    {
      $match: {
        ...matchStage,
        eventName: "ux_outbound_click",
      },
    },
    {
      $group: {
        _id: "$properties.href",
        count: { $sum: 1 },
        sampleText: { $first: "$properties.text" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);

  const behavioralSummaryPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSessions: { $addToSet: "$sessionId" },
        bouncedSessions: {
          $addToSet: {
            $cond: [{ $eq: ["$isBounce", true] }, "$sessionId", "$$REMOVE"],
          },
        },
        exitIntentSessions: {
          $addToSet: {
            $cond: [{ $eq: ["$exitIntent", true] }, "$sessionId", "$$REMOVE"],
          },
        },
        totalActiveDuration: { $sum: "$activeDuration" },
        totalIdleDuration: { $sum: "$idleDuration" },
        avgActiveDuration: { $avg: "$activeDuration" },
        avgIdleDuration: { $avg: "$idleDuration" },
        avgFocusCount: { $avg: "$focusCount" },
      },
    },
  ]);

  // 18. User Journeys (Entry pages, Exit pages, Multi-step Flows & Transitions)
  const sessionPathsPromise = (PageView as any).aggregate([
    { $match: matchStage },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$sessionId",
        entryPage: { $first: "$pathname" },
        exitPage: { $last: "$pathname" },
        pathSequence: { $push: "$pathname" },
        pathCount: { $sum: 1 },
      },
    },
    {
      $facet: {
        rawSessions: [
          { $limit: 300 },
        ],
        entryPages: [
          {
            $group: {
              _id: "$entryPage",
              count: { $sum: 1 },
              bouncedCount: {
                $sum: {
                  $cond: [{ $eq: ["$pathCount", 1] }, 1, 0],
                },
              },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ],
        exitPages: [
          { $group: { _id: "$exitPage", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ],
      },
    },
  ]);


  // 17. SEO & Search Engine Aggregations
  const seoEnginesPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, searchEngine: { $ne: null } } },
    {
      $group: {
        _id: "$searchEngine",
        count: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$visitorId" },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        engine: "$_id",
        count: 1,
        uniqueVisitors: { $size: "$uniqueVisitors" },
      },
    },
  ]);

  const seoLandingPagesPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, searchEngine: { $ne: null } } },
    {
      $group: {
        _id: "$pathname",
        count: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$visitorId" },
        engines: { $addToSet: "$searchEngine" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
    {
      $project: {
        pathname: "$_id",
        count: 1,
        uniqueVisitors: { $size: "$uniqueVisitors" },
        engines: 1,
      },
    },
  ]);

  const searchCrawlersPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, visitorType: "search_bot" } },
    {
      $group: {
        _id: { $ifNull: ["$botName", "Unknown Search Bot"] },
        count: { $sum: 1 },
        lastSeen: { $max: "$createdAt" },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        botName: "$_id",
        count: 1,
        lastSeen: 1,
      },
    },
  ]);

  // 18. AEO & AI Visibility Aggregations
  const aiCrawlersPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, visitorType: "ai_crawler" } },
    {
      $group: {
        _id: { $ifNull: ["$botName", "Unknown AI Crawler"] },
        category: { $first: "$botCategory" },
        count: { $sum: 1 },
        lastSeen: { $max: "$createdAt" },
        paths: { $addToSet: "$pathname" },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        botName: "$_id",
        category: 1,
        count: 1,
        lastSeen: 1,
        routesCount: { $size: "$paths" },
      },
    },
  ]);

  const aiReferrersPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, aiReferrer: { $ne: null } } },
    {
      $group: {
        _id: "$aiReferrer",
        count: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$visitorId" },
        paths: { $addToSet: "$pathname" },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        referrer: "$_id",
        count: 1,
        uniqueVisitors: { $size: "$uniqueVisitors" },
        routesCount: { $size: "$paths" },
      },
    },
  ]);

  const topCrawledRoutesPromise = (PageView as any).aggregate([
    { $match: { ...matchStage, visitorType: "ai_crawler" } },
    {
      $group: {
        _id: "$pathname",
        count: { $sum: 1 },
        bots: { $addToSet: "$botName" },
        lastCrawled: { $max: "$createdAt" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 15 },
    {
      $project: {
        pathname: "$_id",
        count: 1,
        bots: 1,
        lastCrawled: 1,
      },
    },
  ]);

  const aiReadinessPromise = (PageView as any).aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalChecked: { $sum: 1 },
        structuredDataCount: { $sum: { $cond: ["$structuredDataDetected", 1, 0] } },
        aiCrawledPages: { $sum: { $cond: [{ $eq: ["$visitorType", "ai_crawler"] }, 1, 0] } },
        avgTtfb: { $avg: "$webVitals.ttfb" },
      },
    },
  ]);

  // Execute all aggregations in parallel
  const [
    overviewRaw,
    realtimeRaw,
    timeseriesRaw,
    retentionRaw,
    returningUsersRaw,
    topPagesRaw,
    topReferrersRaw,
    utmCampaignsRaw,
    devicesRaw,
    browsersRaw,
    osRaw,
    screensRaw,
    countriesRaw,
    citiesRaw,
    durationDistRaw,
    scrollDistRaw,
    recentPageViews,
    recentEvents,
    recentErrors,
    errorStatsRaw,
    webVitalsSummaryRaw,
    webVitalsPagesRaw,
    networkTypesRaw,
    hardwareGpuRaw,
    hardwareCoresRaw,
    labFunnelRaw,
    rageClicksRaw,
    outboundClicksRaw,
    behavioralSummaryRaw,
    sessionPathsRaw,
    seoEnginesRaw,
    seoLandingPagesRaw,
    searchCrawlersRaw,
    aiCrawlersRaw,
    aiReferrersRaw,
    topCrawledRoutesRaw,
    aiReadinessRaw,
  ] = await Promise.all([
    overviewPromise,
    realtimePromise,
    timeseriesPromise,
    retentionPromise,
    returningUsersPromise,
    topPagesPromise,
    topReferrersPromise,
    utmCampaignsPromise,
    devicesPromise,
    browsersPromise,
    osPromise,
    screensPromise,
    countriesPromise,
    citiesPromise,
    durationDistributionPromise,
    scrollDistributionPromise,
    recentPageViewsPromise,
    eventsPromise,
    errorsPromise,
    errorStatsPromise,
    webVitalsSummaryPromise,
    webVitalsPagesPromise,
    networkTypesPromise,
    hardwareGpuPromise,
    hardwareCoresPromise,
    labFunnelPromise,
    rageClicksPromise,
    outboundClicksPromise,
    behavioralSummaryPromise,
    sessionPathsPromise,
    seoEnginesPromise,
    seoLandingPagesPromise,
    searchCrawlersPromise,
    aiCrawlersPromise,
    aiReferrersPromise,
    topCrawledRoutesPromise,
    aiReadinessPromise,
  ]);

  // Transform Overview
  const rawO = overviewRaw[0] || {};
  const totalViews = rawO.totalViews || 0;
  const uniqueVisitors = rawO.uniqueVisitors?.length || 0;
  const uniqueSessions = rawO.uniqueSessions?.length || 0;
  const anonymousSessions = rawO.anonymousSessions?.length || 0;
  const authenticatedSessions = rawO.authenticatedSessions?.length || 0;
  const avgDuration = rawO.avgDuration ? Math.round(rawO.avgDuration) : 0;
  const avgScrollDepth = rawO.avgScrollDepth ? Math.round(rawO.avgScrollDepth) : 0;

  // Transform Retention & Loyalty
  const rawRet = retentionRaw[0] || {};
  const retTotalVisitors = rawRet.totalVisitors || uniqueVisitors || 0;
  const retReturningVisitors = rawRet.returningVisitors || 0;
  const retNewVisitors = Math.max(0, retTotalVisitors - retReturningVisitors);
  const returnRate = retTotalVisitors > 0
    ? parseFloat(((retReturningVisitors / retTotalVisitors) * 100).toFixed(1))
    : 0;

  const retentionFrequency = [
    {
      label: "1 Visit (First-Time)",
      count: rawRet.singleVisit || retNewVisitors,
      percentage: retTotalVisitors > 0 ? parseFloat((((rawRet.singleVisit || retNewVisitors) / retTotalVisitors) * 100).toFixed(1)) : 0,
    },
    {
      label: "2 Visits (First Return)",
      count: rawRet.twoVisits || 0,
      percentage: retTotalVisitors > 0 ? parseFloat((((rawRet.twoVisits || 0) / retTotalVisitors) * 100).toFixed(1)) : 0,
    },
    {
      label: "3 – 5 Visits (Regular)",
      count: rawRet.threeToFiveVisits || 0,
      percentage: retTotalVisitors > 0 ? parseFloat((((rawRet.threeToFiveVisits || 0) / retTotalVisitors) * 100).toFixed(1)) : 0,
    },
    {
      label: "6+ Visits (Loyal Champions)",
      count: rawRet.sixPlusVisits || 0,
      percentage: retTotalVisitors > 0 ? parseFloat((((rawRet.sixPlusVisits || 0) / retTotalVisitors) * 100).toFixed(1)) : 0,
    },
  ];

  const retention = {
    totalVisitors: retTotalVisitors,
    returningVisitors: retReturningVisitors,
    newVisitors: retNewVisitors,
    returnRate,
    frequency: retentionFrequency,
  };

  // Populate Audience & Visitors Profiles with Loyalty Metrics
  const returningUsers = (returningUsersRaw || []).map((ru: any) => {
    const visitCount = ru.visitCount || 1;
    const sessionCount = ru.sessionCount || 1;
    const totalViews = ru.totalViews || 0;
    const totalDuration = ru.totalDuration ? Math.round(ru.totalDuration) : 0;

    // Calculate Loyalty Score (0-100) based on repeat visits, sessions, dwell time, and views
    const visitScore = Math.min(40, visitCount * 8);
    const sessionScore = Math.min(25, sessionCount * 5);
    const durationScore = Math.min(20, Math.round(totalDuration / 30));
    const viewsScore = Math.min(15, totalViews * 2);
    const loyaltyScore = Math.min(100, Math.max(10, visitScore + sessionScore + durationScore + viewsScore));

    let userType: "new" | "returning" | "loyal" | "champion" = "new";
    let loyaltyTier: "Newcomer" | "Returning" | "Loyal Advocate" | "Brand Champion" = "Newcomer";

    if (visitCount >= 10 || sessionCount >= 8) {
      userType = "champion";
      loyaltyTier = "Brand Champion";
    } else if (visitCount >= 4 || sessionCount >= 4) {
      userType = "loyal";
      loyaltyTier = "Loyal Advocate";
    } else if (visitCount > 1 || sessionCount > 1 || ru.hasReturningFlag) {
      userType = "returning";
      loyaltyTier = "Returning";
    } else {
      userType = "new";
      loyaltyTier = "Newcomer";
    }

    return {
      visitorId: ru._id,
      user: ru.userId && typeof ru.userId === "object" ? ru.userId : null,
      visitCount,
      sessionCount,
      totalViews,
      totalDuration,
      topPaths: (ru.topPaths || []).filter(Boolean),
      country: getFullCountryName(ru.country),
      city: ru.city || "Unknown",
      device: ru.device || "desktop",
      browser: ru.browser || "Unknown",
      os: ru.os || "Unknown",
      firstSeen: ru.firstSeen ? new Date(ru.firstSeen).toISOString() : new Date().toISOString(),
      lastSeen: ru.lastSeen ? new Date(ru.lastSeen).toISOString() : new Date().toISOString(),
      userType,
      loyaltyScore,
      loyaltyTier,
    };
  });

  // Realtime
  let totalActiveUsers = 0;
  const activePaths = realtimeRaw.map((r: any) => {
    const count = r.activeVisitors?.length || 0;
    totalActiveUsers += count;
    return {
      pathname: r._id,
      activeUsers: count,
    };
  });

  // Timeseries
  const timeseries = timeseriesRaw.map((t: any) => {
    const visitors = t.visitors?.length || 0;
    const returningVisitors = t.returningVisitors?.length || 0;
    const newVisitors = Math.max(0, visitors - returningVisitors);
    return {
      label: t._id,
      views: t.views,
      visitors,
      returningVisitors,
      newVisitors,
      returningViews: t.returningViews || 0,
    };
  });

  // Top Pages
  const topPages = topPagesRaw.map((p: any) => ({
    pathname: p._id,
    title: p.title || p._id,
    labId: p.labId || null,
    views: p.views,
    visitors: p.visitors?.length || 0,
    avgDuration: p.avgDuration ? Math.round(p.avgDuration) : 0,
    avgScrollDepth: p.avgScrollDepth ? Math.round(p.avgScrollDepth) : 0,
  }));

  // Referrers
  const topReferrers = topReferrersRaw.map((ref: any) => ({
    domain: ref._id || "Direct",
    count: ref.count,
    percentage: totalViews > 0 ? parseFloat(((ref.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // UTM Campaigns
  const utmCampaigns = utmCampaignsRaw.map((u: any) => ({
    source: u._id.source,
    medium: u._id.medium,
    campaign: u._id.campaign,
    views: u.views,
    visitors: u.visitors?.length || 0,
    avgDuration: u.avgDuration ? Math.round(u.avgDuration) : 0,
  }));

  // Device Breakdown
  const devices = devicesRaw.map((d: any) => ({
    device: d._id || "desktop",
    count: d.count,
    percentage: totalViews > 0 ? parseFloat(((d.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Browsers
  const browsers = browsersRaw.map((b: any) => ({
    browser: b._id || "Unknown",
    count: b.count,
    percentage: totalViews > 0 ? parseFloat(((b.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // OS
  const operatingSystems = osRaw.map((o: any) => ({
    os: o._id || "Unknown",
    count: o.count,
    percentage: totalViews > 0 ? parseFloat(((o.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Screens
  const screenResolutions = screensRaw.map((s: any) => ({
    screen: s._id || "Unknown",
    count: s.count,
    percentage: totalViews > 0 ? parseFloat(((s.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  // Countries - normalize all ISO codes to full names and consolidate duplicates with 2-letter ISO codes
  const countryCountsMap = new Map<string, { count: number; code: string; country: string }>();
  countriesRaw.forEach((c: any) => {
    const rawVal = c._id || "Unknown";
    const fullName = getFullCountryName(rawVal);
    const code = getCountryIsoCode(rawVal);
    const existing = countryCountsMap.get(code);
    if (existing) {
      existing.count += c.count || 0;
    } else {
      countryCountsMap.set(code, {
        code,
        country: fullName,
        count: c.count || 0,
      });
    }
  });

  const countries = Array.from(countryCountsMap.values())
    .map((item) => ({
      country: item.country,
      code: item.code,
      count: item.count,
      continent: getContinentForCountry(item.code),
      percentage: totalViews > 0 ? parseFloat(((item.count / totalViews) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 35);

  // Top Cities
  const topCities = (citiesRaw || []).map((item: any) => {
    const cityName = item._id?.city || "Unknown";
    const rawCountry = item._id?.country || "Unknown";
    const countryName = getFullCountryName(rawCountry);
    const countryCode = getCountryIsoCode(rawCountry);
    return {
      city: cityName,
      country: countryName,
      countryCode,
      count: item.count,
      percentage: totalViews > 0 ? parseFloat(((item.count / totalViews) * 100).toFixed(1)) : 0,
    };
  });

  // Continents Distribution
  const continentMap = new Map<string, number>();
  countries.forEach((c) => {
    continentMap.set(c.continent, (continentMap.get(c.continent) || 0) + c.count);
  });
  const continents = Array.from(continentMap.entries())
    .map(([continent, count]) => ({
      continent,
      count,
      percentage: totalViews > 0 ? parseFloat(((count / totalViews) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Geographic KPIs
  const nationsCount = countries.filter((c) => c.code !== "Unknown").length;
  const topCountry = countries.length > 0 ? countries[0] : null;
  const topCity = topCities.length > 0 ? topCities[0] : null;
  const domesticCount = topCountry ? topCountry.count : 0;
  const internationalCount = Math.max(0, totalViews - domesticCount);
  const internationalRatio = totalViews > 0 ? parseFloat(((internationalCount / totalViews) * 100).toFixed(1)) : 0;

  const geoKpis = {
    nationsCount,
    topCountry: topCountry ? { name: topCountry.country, code: topCountry.code, count: topCountry.count, percentage: topCountry.percentage } : null,
    topCity: topCity ? { name: topCity.city, country: topCity.country, countryCode: topCity.countryCode, count: topCity.count } : null,
    internationalRatio,
  };

  // Format recent pageviews country names
  const formattedPageViews = recentPageViews.map((pv: any) => ({
    ...pv,
    country: getFullCountryName(pv.country),
  }));

  // Duration Distribution
  const rawDur = durationDistRaw[0] || {};
  const durationDistribution = [
    { label: "< 10s", count: rawDur.under10s || 0 },
    { label: "10s – 30s", count: rawDur.under30s || 0 },
    { label: "30s – 1m", count: rawDur.under1m || 0 },
    { label: "1m – 3m", count: rawDur.under3m || 0 },
    { label: "3m – 10m", count: rawDur.under10m || 0 },
    { label: "> 10m", count: rawDur.over10m || 0 },
  ];

  // Scroll Depth Distribution
  const rawScroll = scrollDistRaw[0] || {};
  const scrollDistribution = [
    { label: "0% – 25%", count: rawScroll.depth25 || 0 },
    { label: "25% – 50%", count: rawScroll.depth50 || 0 },
    { label: "50% – 75%", count: rawScroll.depth75 || 0 },
    { label: "75% – 100%", count: rawScroll.depth100 || 0 },
  ];

  // Error Stats
  const rawErr = errorStatsRaw[0] || {};
  const errorStats = {
    totalErrors: rawErr.totalErrors || 0,
    uniqueIssues: rawErr.uniqueIssues || 0,
    statusNew: rawErr.statusNew || 0,
    statusInvestigating: rawErr.statusInvestigating || 0,
    statusResolved: rawErr.statusResolved || 0,
  };

  // Real User Monitoring (RUM) & Core Web Vitals
  const rawVitals = webVitalsSummaryRaw[0] || {};
  const webVitals = {
    totalMeasured: rawVitals.totalWithVitals || 0,
    overall: {
      lcp: rawVitals.avgLcp ? Math.round(rawVitals.avgLcp) : null,
      fcp: rawVitals.avgFcp ? Math.round(rawVitals.avgFcp) : null,
      cls: rawVitals.avgCls ? Number(rawVitals.avgCls.toFixed(3)) : null,
      inp: rawVitals.avgInp ? Math.round(rawVitals.avgInp) : null,
      ttfb: rawVitals.avgTtfb ? Math.round(rawVitals.avgTtfb) : null,
      domLoad: rawVitals.avgDomLoad ? Math.round(rawVitals.avgDomLoad) : null,
      windowLoad: rawVitals.avgWindowLoad ? Math.round(rawVitals.avgWindowLoad) : null,
    },
    distributions: {
      lcp: {
        good: rawVitals.goodLcp || 0,
        needsImprovement: rawVitals.needsImpLcp || 0,
        poor: rawVitals.poorLcp || 0,
      },
      fcp: {
        good: rawVitals.goodFcp || 0,
        needsImprovement: rawVitals.needsImpFcp || 0,
        poor: rawVitals.poorFcp || 0,
      },
      cls: {
        good: rawVitals.goodCls || 0,
        needsImprovement: rawVitals.needsImpCls || 0,
        poor: rawVitals.poorCls || 0,
      },
      inp: {
        good: rawVitals.goodInp || 0,
        needsImprovement: rawVitals.needsImpInp || 0,
        poor: rawVitals.poorInp || 0,
      },
    },
    pages: webVitalsPagesRaw.map((p: any) => ({
      pathname: p._id,
      count: p.count,
      lcp: p.avgLcp ? Math.round(p.avgLcp) : null,
      fcp: p.avgFcp ? Math.round(p.avgFcp) : null,
      cls: p.avgCls ? Number(p.avgCls.toFixed(3)) : null,
      inp: p.avgInp ? Math.round(p.avgInp) : null,
      ttfb: p.avgTtfb ? Math.round(p.avgTtfb) : null,
    })),
  };

  // Hardware & Network Diagnostics
  const networkTypes = networkTypesRaw.map((n: any) => ({
    type: n._id || "Unknown",
    count: n.count,
    percentage: totalViews > 0 ? parseFloat(((n.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  const gpus = hardwareGpuRaw.map((g: any) => ({
    gpu: g._id || "Unknown",
    count: g.count,
    percentage: totalViews > 0 ? parseFloat(((g.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  const cpuCores = hardwareCoresRaw.map((c: any) => ({
    cores: `${c._id} Cores`,
    count: c.count,
    percentage: totalViews > 0 ? parseFloat(((c.count / totalViews) * 100).toFixed(1)) : 0,
  }));

  const hardwareDiagnostics = {
    networkTypes,
    gpus,
    cpuCores,
  };

  // Lab Intelligence & Learning Funnel
  const totalLabStarts = labFunnelRaw.reduce((acc: number, l: any) => acc + (l.starts || 0), 0);
  const totalLabCompletions = labFunnelRaw.reduce((acc: number, l: any) => acc + (l.completes || 0), 0);
  const totalLabTweaks = labFunnelRaw.reduce((acc: number, l: any) => acc + (l.parameterTweaks || 0), 0);
  const totalLabQuizzes = labFunnelRaw.reduce((acc: number, l: any) => acc + (l.quizAttempts || 0), 0);
  const overallLabCompletionRate =
    totalLabStarts > 0 ? parseFloat(((totalLabCompletions / totalLabStarts) * 100).toFixed(1)) : 0;

  const labIntelligence = {
    overview: {
      totalStarts: totalLabStarts,
      totalCompletions: totalLabCompletions,
      completionRate: overallLabCompletionRate,
      totalParameterTweaks: totalLabTweaks,
      totalQuizAttempts: totalLabQuizzes,
    },
    labs: labFunnelRaw.map((l: any) => ({
      labId: l._id || "unknown",
      starts: l.starts || 0,
      completes: l.completes || 0,
      completionRate: l.completionRate || 0,
      parameterTweaks: l.parameterTweaks || 0,
      stepProgressions: l.stepProgressions || 0,
      quizAttempts: l.quizAttempts || 0,
      resets: l.resets || 0,
      uniqueStudents: l.uniqueStudents || 0,
    })),
  };

  // Behavioral UX Signals
  const rawBeh = behavioralSummaryRaw[0] || {};
  const behTotalSessions = rawBeh.totalSessions?.length || 0;
  const behBouncedSessions = rawBeh.bouncedSessions?.length || 0;
  const behExitIntentSessions = rawBeh.exitIntentSessions?.length || 0;
  const bounceRate = behTotalSessions > 0 ? parseFloat(((behBouncedSessions / behTotalSessions) * 100).toFixed(1)) : 0;
  const exitIntentRate = behTotalSessions > 0 ? parseFloat(((behExitIntentSessions / behTotalSessions) * 100).toFixed(1)) : 0;

  const totalActiveDuration = rawBeh.totalActiveDuration || 0;
  const totalIdleDuration = rawBeh.totalIdleDuration || 0;
  const totalDwellSum = totalActiveDuration + totalIdleDuration;
  const activePercentage = totalDwellSum > 0 ? parseFloat(((totalActiveDuration / totalDwellSum) * 100).toFixed(1)) : 100;

  const behavioralSignals = {
    bounceRate,
    exitIntentRate,
    activeRatio: {
      totalActiveSeconds: totalActiveDuration,
      totalIdleSeconds: totalIdleDuration,
      activePercentage,
      avgActiveSeconds: rawBeh.avgActiveDuration ? Math.round(rawBeh.avgActiveDuration) : 0,
      avgIdleSeconds: rawBeh.avgIdleDuration ? Math.round(rawBeh.avgIdleDuration) : 0,
      avgFocusCount: rawBeh.avgFocusCount ? Number(rawBeh.avgFocusCount.toFixed(1)) : 1,
    },
    rageClicks: rageClicksRaw.map((r: any) => ({
      element: r._id.element || "element",
      pathname: r._id.pathname || "/",
      count: r.count,
      sampleText: r.sampleText || "",
    })),
    outboundClicks: outboundClicksRaw.map((o: any) => ({
      href: o._id || "",
      count: o.count,
      sampleText: o.sampleText || "",
    })),
  };

  // User Journeys (Entry & Exit Paths, Multi-step Flows, Transitions)
  const sessionPathsResult = sessionPathsRaw[0] || { entryPages: [], exitPages: [], rawSessions: [] };
  const rawSessionsList = sessionPathsResult.rawSessions || [];

  // Compute Top Sequential Flows (e.g. "/" -> "/docs" -> "/install")
  const flowMap = new Map<string, { path: string[]; count: number }>();
  const transitionMap = new Map<string, { from: string; to: string; count: number }>();
  let singlePageSessionsCount = 0;
  let twoPageSessionsCount = 0;
  let threeToFiveSessionsCount = 0;
  let sixPlusSessionsCount = 0;
  let totalPathsSum = 0;

  rawSessionsList.forEach((s: any) => {
    const seq = (s.pathSequence || []).filter(Boolean);
    const len = seq.length;
    totalPathsSum += len;

    if (len === 1) singlePageSessionsCount++;
    else if (len === 2) twoPageSessionsCount++;
    else if (len <= 5) threeToFiveSessionsCount++;
    else sixPlusSessionsCount++;

    // Multi-step flow key (limit to first 4 steps)
    if (len > 0) {
      const flowSteps = seq.slice(0, 4);
      const flowKey = flowSteps.join(" -> ");
      const existing = flowMap.get(flowKey);
      if (existing) {
        existing.count++;
      } else {
        flowMap.set(flowKey, { path: flowSteps, count: 1 });
      }
    }

    // Step-by-step Transitions
    for (let i = 0; i < len - 1; i++) {
      const from = seq[i];
      const to = seq[i + 1];
      if (from && to && from !== to) {
        const transKey = `${from} -> ${to}`;
        const existingTrans = transitionMap.get(transKey);
        if (existingTrans) {
          existingTrans.count++;
        } else {
          transitionMap.set(transKey, { from, to, count: 1 });
        }
      }
    }
  });

  const totalSessionsSampled = rawSessionsList.length || uniqueSessions || 1;
  const topFlows = Array.from(flowMap.entries())
    .map(([pathString, item]) => ({
      path: item.path,
      pathString,
      count: item.count,
      percentage: parseFloat(((item.count / totalSessionsSampled) * 100).toFixed(1)),
      depth: item.path.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topTransitions = Array.from(transitionMap.values())
    .map((t) => ({
      from: t.from,
      to: t.to,
      count: t.count,
      percentage: parseFloat(((t.count / totalSessionsSampled) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const depthDistribution = [
    {
      depthLabel: "1 Page (Direct Bounce)",
      count: singlePageSessionsCount,
      percentage: parseFloat(((singlePageSessionsCount / totalSessionsSampled) * 100).toFixed(1)),
    },
    {
      depthLabel: "2 Pages",
      count: twoPageSessionsCount,
      percentage: parseFloat(((twoPageSessionsCount / totalSessionsSampled) * 100).toFixed(1)),
    },
    {
      depthLabel: "3–5 Pages",
      count: threeToFiveSessionsCount,
      percentage: parseFloat(((threeToFiveSessionsCount / totalSessionsSampled) * 100).toFixed(1)),
    },
    {
      depthLabel: "6+ Pages (Deep Flow)",
      count: sixPlusSessionsCount,
      percentage: parseFloat(((sixPlusSessionsCount / totalSessionsSampled) * 100).toFixed(1)),
    },
  ];

  const avgPathDepth = rawSessionsList.length > 0 ? parseFloat((totalPathsSum / rawSessionsList.length).toFixed(1)) : 1.0;
  const journeyBounceRate = parseFloat(((singlePageSessionsCount / totalSessionsSampled) * 100).toFixed(1));

  const userJourneys = {
    overview: {
      totalSessions: uniqueSessions,
      avgPathDepth,
      bounceRate: journeyBounceRate,
      multiPageRate: parseFloat((100 - journeyBounceRate).toFixed(1)),
    },
    entryPages: (sessionPathsResult.entryPages || []).map((p: any) => ({
      pathname: p._id || "/",
      count: p.count,
      percentage: uniqueSessions > 0 ? parseFloat(((p.count / uniqueSessions) * 100).toFixed(1)) : 0,
      bounceRate: p.count > 0 ? Math.round(((p.bouncedCount || 0) / p.count) * 100) : 0,
    })),
    exitPages: (sessionPathsResult.exitPages || []).map((p: any) => ({
      pathname: p._id || "/",
      count: p.count,
      percentage: uniqueSessions > 0 ? parseFloat(((p.count / uniqueSessions) * 100).toFixed(1)) : 0,
    })),
    topFlows,
    transitions: topTransitions,
    depthDistribution,
  };


  // Transform SEO Analytics
  const totalSearchVisits = (seoEnginesRaw || []).reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);
  const uniqueSearchVisitorsSet = new Set();
  (seoEnginesRaw || []).forEach((item: any) => {
    if (item.uniqueVisitors) uniqueSearchVisitorsSet.add(item.engine);
  });
  const searchCrawlerHits = (searchCrawlersRaw || []).reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);

  const formattedSearchEngines = (seoEnginesRaw || []).map((e: any) => ({
    engine: e.engine,
    name: e.engine ? e.engine.charAt(0).toUpperCase() + e.engine.slice(1) : "Search Engine",
    count: e.count,
    uniqueVisitors: e.uniqueVisitors,
    percentage: totalSearchVisits > 0 ? Number(((e.count / totalSearchVisits) * 100).toFixed(1)) : 0,
  }));

  const formattedLandingPages = (seoLandingPagesRaw || []).map((p: any) => ({
    pathname: p.pathname,
    count: p.count,
    uniqueVisitors: p.uniqueVisitors,
    engines: p.engines || [],
  }));

  const formattedSearchCrawlers = (searchCrawlersRaw || []).map((b: any) => ({
    botName: b.botName,
    count: b.count,
    lastSeen: b.lastSeen,
  }));

  const seoAnalytics = {
    overview: {
      totalSearchVisits,
      uniqueSearchVisitors: uniqueSearchVisitorsSet.size || totalSearchVisits,
      searchShare: totalViews > 0 ? Number(((totalSearchVisits / totalViews) * 100).toFixed(1)) : 0,
      searchCrawlerHits,
    },
    searchEngines: formattedSearchEngines,
    searchLandingPages: formattedLandingPages,
    searchCrawlers: formattedSearchCrawlers,
  };

  // Transform AEO & AI Visibility
  const totalAiCrawlerHits = (aiCrawlersRaw || []).reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);
  const activeAiBotsCount = (aiCrawlersRaw || []).length;
  const aiReferralSessions = (aiReferrersRaw || []).reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);

  const rawAiReadiness = (aiReadinessRaw && aiReadinessRaw[0]) || {};
  const checkedPages = rawAiReadiness.totalChecked || 0;
  const structuredDataCoverage = checkedPages > 0 ? Math.min(100, Math.round(((rawAiReadiness.structuredDataCount || 0) / checkedPages) * 100)) : 0;
  const avgTtfb = rawAiReadiness.avgTtfb ? Math.round(rawAiReadiness.avgTtfb) : null;

  const structuredScore = Math.round((structuredDataCoverage / 100) * 40);
  const crawlScore = totalAiCrawlerHits > 0 ? 30 : (checkedPages > 0 ? 10 : 0);
  const speedScore = avgTtfb ? (avgTtfb < 300 ? 30 : avgTtfb < 600 ? 20 : 10) : (checkedPages > 0 ? 15 : 0);
  const cleanUrlScore = checkedPages > 0 ? 100 : 0;
  const crawlerAccessibility = totalAiCrawlerHits > 0 ? 100 : (checkedPages > 0 ? 80 : 0);
  const ttfbSpeedScore = avgTtfb ? Math.round(speedScore * (100 / 30)) : (checkedPages > 0 ? 50 : 0);
  const citationReadinessScore = checkedPages > 0 ? Math.min(100, structuredScore + crawlScore + speedScore) : 0;

  const formattedAiCrawlers = (aiCrawlersRaw || []).map((b: any) => ({
    botName: b.botName,
    category: b.category,
    count: b.count,
    lastSeen: b.lastSeen,
    routesCount: b.routesCount,
  }));

  const formattedAiReferrers = (aiReferrersRaw || []).map((r: any) => ({
    referrer: r.referrer,
    name: r.referrer ? r.referrer.charAt(0).toUpperCase() + r.referrer.slice(1) : "AI Assistant",
    count: r.count,
    uniqueVisitors: r.uniqueVisitors,
    routesCount: r.routesCount,
  }));

  const formattedTopCrawledRoutes = (topCrawledRoutesRaw || []).map((r: any) => ({
    pathname: r.pathname,
    count: r.count,
    bots: r.bots || [],
    lastCrawled: r.lastCrawled,
  }));

  const aiVisibility = {
    overview: {
      totalAiCrawlerHits,
      activeAiBotsCount,
      aiReferralSessions,
      citationReadinessScore,
    },
    aiCrawlers: formattedAiCrawlers,
    aiReferrers: formattedAiReferrers,
    topCrawledRoutes: formattedTopCrawledRoutes,
    readinessFactors: {
      structuredDataCoverage,
      cleanUrlScore,
      crawlerAccessibility,
      ttfbSpeedScore,
      avgTtfb,
    },
  };

  return {
    overview: {
      totalViews,
      uniqueVisitors,
      uniqueSessions,
      anonymousSessions,
      authenticatedSessions,
      avgDuration,
      avgScrollDepth,
      activeUsers: totalActiveUsers,
      returningVisitors: retReturningVisitors,
      newVisitors: retNewVisitors,
      returnRate,
    },
    retention,
    returningUsers,
    realtime: {
      totalActiveUsers,
      activePaths,
    },
    timeseries,
    topPages,
    topReferrers,
    utmCampaigns,
    devices,
    browsers,
    operatingSystems,
    screenResolutions,
    countries,
    topCities,
    continents,
    geoKpis,
    durationDistribution,
    scrollDistribution,
    recentPageViews: formattedPageViews,
    recentEvents,
    recentErrors,
    errorStats,
    webVitals,
    hardwareDiagnostics,
    labIntelligence,
    behavioralSignals,
    userJourneys,
    seoAnalytics,
    aiVisibility,
  };
}

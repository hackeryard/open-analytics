import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import ErrorLog from "@/models/ErrorLog";
import Project from "@/models/Project";
import { getProjectAnalytics } from "@/lib/analyticsDb";

/**
 * Evaluates real-time error telemetry for repeated occurrences and error storms.
 * Called automatically from /api/v1/error on ingestion.
 */
export async function evaluateErrorAlerts(projectId: string, errorLog: any) {
  try {
    if (!projectId || !errorLog) return;
    await connectDB();

    const project = await (Project as any).findOne({ projectId }).lean();
    const alertSettings = (project as any)?.settings?.alertSettings || {};

    const repeatThreshold = Number(alertSettings.errorRepeatThreshold) || 5;
    const stormThreshold = Number(alertSettings.errorStormThreshold) || 10;

    const occurrences = Number(errorLog.occurrences) || 1;
    const message = String(errorLog.message || "Unknown error").trim();
    const pathname = String(errorLog.pathname || "/").trim();
    const errorType = String(errorLog.errorType || "runtime").trim();
    const digest = errorLog.digest || message.slice(0, 50);

    // 1. REPEATED ERROR CHECK (occurrences >= repeatThreshold)
    if (occurrences >= repeatThreshold) {
      // Bracket calculation milestones (e.g. at 5, 10, 25, 50, 100...)
      let bracket = repeatThreshold;
      if (occurrences >= 100) {
        bracket = Math.floor(occurrences / 50) * 50;
      } else if (occurrences >= 50) {
        bracket = 50;
      } else if (occurrences >= 25) {
        bracket = 25;
      } else if (occurrences >= 10) {
        bracket = 10;
      } else {
        bracket = repeatThreshold;
      }

      if (bracket >= repeatThreshold) {
        const fingerprint = `err_rep:${projectId}:${pathname}:${digest}:${bracket}`;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const existingNotification = await (Notification as any).findOne({
          projectId,
          fingerprint,
          createdAt: { $gte: twentyFourHoursAgo },
        });

        if (!existingNotification) {
          const isCritical =
            errorType === "boundary" ||
            errorType === "http_5xx" ||
            errorType === "unhandledrejection";

          await (Notification as any).create({
            projectId,
            title: `Repeated Error (${occurrences}x): ${errorType.toUpperCase()}`,
            message: `Error "${message.slice(0, 100)}" has occurred ${occurrences} times on route "${pathname}".`,
            type: "error_repeated",
            severity: isCritical ? "critical" : "warning",
            metadata: {
              errorId: errorLog._id?.toString(),
              pathname,
              message,
              occurrences,
              errorType,
              bracket,
            },
            actionUrl: `/errors?search=${encodeURIComponent(message.slice(0, 40))}`,
            actionLabel: "Inspect Error",
            fingerprint,
          });
        }
      }
    }

    // 2. ERROR STORM DETECTION (high volume in past 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentErrorsCount = await (ErrorLog as any).countDocuments({
      projectId,
      lastOccurredAt: { $gte: oneHourAgo },
    });

    if (recentErrorsCount >= stormThreshold) {
      const hourKey = new Date().toISOString().slice(0, 13); // e.g. "2026-09-19T20"
      const stormFingerprint = `err_storm:${projectId}:${hourKey}`;

      const existingStormAlert = await (Notification as any).findOne({
        projectId,
        fingerprint: stormFingerprint,
        createdAt: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      });

      if (!existingStormAlert) {
        await (Notification as any).create({
          projectId,
          title: "High Error Velocity Detected",
          message: `Detected ${recentErrorsCount} error occurrences across your website in the past hour. Investigate recent code deployments or API availability.`,
          type: "error_storm",
          severity: "critical",
          metadata: {
            errorCount: recentErrorsCount,
            timeWindow: "1h",
            threshold: stormThreshold,
          },
          actionUrl: "/errors",
          actionLabel: "View Error Telemetry",
          fingerprint: stormFingerprint,
        });
      }
    }
  } catch (err) {
    console.error("Error evaluating error alerts:", err);
  }
}

/**
 * Runs a comprehensive health and optimization scan for SEO, AEO, GEO, Web Vitals, and UX.
 * Can be triggered on-demand via API or periodic background job.
 */
export async function runOptimizationScan(projectId: string): Promise<{ createdCount: number }> {
  try {
    if (!projectId) return { createdCount: 0 };
    await connectDB();

    const project = await (Project as any).findOne({ projectId }).lean();
    if (!project) return { createdCount: 0 };

    const plan = (project as any).plan || "pro";
    const data = await getProjectAnalytics(projectId, "7d", null, null, plan);

    let createdCount = 0;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 0. REPEATED ERRORS TELEMETRY SCAN
    const alertSettings = (project as any)?.settings?.alertSettings || {};
    const repeatThreshold = Number(alertSettings.errorRepeatThreshold) || 5;
    const repeatedErrors = await (ErrorLog as any)
      .find({
        projectId,
        occurrences: { $gte: repeatThreshold },
        lastOccurredAt: { $gte: twentyFourHoursAgo },
      })
      .sort({ occurrences: -1 })
      .limit(10)
      .lean();

    for (const err of repeatedErrors) {
      const occurrences = Number(err.occurrences) || repeatThreshold;
      const message = String(err.message || "Unknown error").trim();
      const pathname = String(err.pathname || "/").trim();
      const errorType = String(err.errorType || "runtime").trim();
      const digest = err.digest || message.slice(0, 50);

      let bracket = repeatThreshold;
      if (occurrences >= 100) bracket = Math.floor(occurrences / 50) * 50;
      else if (occurrences >= 50) bracket = 50;
      else if (occurrences >= 25) bracket = 25;
      else if (occurrences >= 10) bracket = 10;
      else bracket = repeatThreshold;

      const fingerprint = `err_rep:${projectId}:${pathname}:${digest}:${bracket}`;
      const existing = await (Notification as any).findOne({
        projectId,
        fingerprint,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      if (!existing) {
        const isCritical =
          errorType === "boundary" ||
          errorType === "http_5xx" ||
          errorType === "unhandledrejection";

        await (Notification as any).create({
          projectId,
          title: `Repeated Error (${occurrences}x): ${errorType.toUpperCase()}`,
          message: `Error "${message.slice(0, 100)}" has occurred ${occurrences} times on route "${pathname}".`,
          type: "error_repeated",
          severity: isCritical ? "critical" : "warning",
          metadata: {
            errorId: err._id?.toString(),
            pathname,
            message,
            occurrences,
            errorType,
            bracket,
          },
          actionUrl: `/errors?search=${encodeURIComponent(message.slice(0, 40))}`,
          actionLabel: "Inspect Error",
          fingerprint,
        });
        createdCount++;
      }
    }

    // 0b. ERROR STORM CHECK
    const stormThreshold = Number(alertSettings.errorStormThreshold) || 10;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentErrorsCount = await (ErrorLog as any).countDocuments({
      projectId,
      lastOccurredAt: { $gte: oneHourAgo },
    });
    if (recentErrorsCount >= stormThreshold) {
      const hourKey = new Date().toISOString().slice(0, 13);
      const stormFingerprint = `err_storm:${projectId}:${hourKey}`;
      const existingStormAlert = await (Notification as any).findOne({
        projectId,
        fingerprint: stormFingerprint,
        createdAt: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      });

      if (!existingStormAlert) {
        await (Notification as any).create({
          projectId,
          title: "High Error Velocity Detected",
          message: `Detected ${recentErrorsCount} error occurrences across your website in the past hour. Investigate recent code deployments or API availability.`,
          type: "error_storm",
          severity: "critical",
          metadata: {
            errorCount: recentErrorsCount,
            timeWindow: "1h",
            threshold: stormThreshold,
          },
          actionUrl: "/errors",
          actionLabel: "View Error Telemetry",
          fingerprint: stormFingerprint,
        });
        createdCount++;
      }
    }

    // 1. SEO & AEO: UNOPTIMIZED PAGE TITLES
    const topPages = data?.topPages || [];
    for (const page of topPages) {
      const views = page.views || 0;
      const title = (page.title || "").trim();
      const pathname = (page.pathname || "").trim();

      const isTitleMissing =
        !title ||
        title === pathname ||
        title === "/" ||
        title.toLowerCase() === "untitled" ||
        title.length < 3;

      if (views >= 1 && isTitleMissing) {
        const fingerprint = `seo_title:${projectId}:${pathname}`;
        const existing = await (Notification as any).findOne({
          projectId,
          fingerprint,
          createdAt: { $gte: twentyFourHoursAgo },
        });

        if (!existing) {
          await (Notification as any).create({
            projectId,
            title: `Unoptimized SEO: Missing Title on "${pathname}"`,
            message: `Route "${pathname}" has received ${views} pageviews but lacks a descriptive HTML <title> tag. Search engines and AI assistants require informative titles for indexing.`,
            type: "seo_unoptimized",
            severity: "warning",
            metadata: { pathname, views, currentTitle: title },
            actionUrl: "/seo",
            actionLabel: "Review SEO & Search",
            fingerprint,
          });
          createdCount++;
        }
      }
    }

    // 2. SEO & ENGAGEMENT: HIGH BOUNCE & ULTRA-SHORT DWELL TIME
    for (const page of topPages) {
      const views = page.views || 0;
      const avgDuration = page.avgDuration || 0;
      const pathname = page.pathname || "/";

      if (views >= 5 && avgDuration > 0 && avgDuration < 4) {
        const fingerprint = `seo_dwell:${projectId}:${pathname}`;
        const existing = await (Notification as any).findOne({
          projectId,
          fingerprint,
          createdAt: { $gte: twentyFourHoursAgo },
        });

        if (!existing) {
          await (Notification as any).create({
            projectId,
            title: `High Friction & Low Dwell: "${pathname}"`,
            message: `Visitors spend an average of only ${avgDuration}s on "${pathname}". The page content may load slowly, lack answer engine takeaways, or cause immediate exits.`,
            type: "aeo_unoptimized",
            severity: "info",
            metadata: { pathname, avgDuration, views },
            actionUrl: "/pages",
            actionLabel: "Inspect Route",
            fingerprint,
          });
          createdCount++;
        }
      }
    }

    // 3. GEO & AI SEARCH RADAR: LOW CITATION READINESS SCORE
    const aiOverview = data?.aiVisibility?.overview;
    if (aiOverview?.citationReadinessScore !== undefined && aiOverview.citationReadinessScore < 50) {
      const dayKey = new Date().toISOString().slice(0, 10);
      const fingerprint = `geo_score:${projectId}:${dayKey}`;
      const existing = await (Notification as any).findOne({
        projectId,
        fingerprint,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      if (!existing) {
        await (Notification as any).create({
          projectId,
          title: "GEO Radar: Low AI Citation Readiness",
          message: `Generative Engine Optimization (GEO) score is currently ${aiOverview.citationReadinessScore}%. AI answer engines (ChatGPT, Perplexity, Claude) may struggle to extract authoritative citations from your content.`,
          type: "geo_radar",
          severity: "info",
          metadata: { score: aiOverview.citationReadinessScore },
          actionUrl: "/ai-visibility",
          actionLabel: "Open GEO Radar",
          fingerprint,
        });
        createdCount++;
      }
    }

    // 4. WEB VITALS DEGRADATION (POOR LCP OR POOR CLS)
    const overallVitals = data?.webVitals?.overall;
    if (overallVitals?.lcp && overallVitals.lcp > 2500) {
      const dayKey = new Date().toISOString().slice(0, 10);
      const fingerprint = `vitals_lcp:${projectId}:${dayKey}`;
      const existing = await (Notification as any).findOne({
        projectId,
        fingerprint,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      if (!existing) {
        const isPoor = overallVitals.lcp > 4000;
        await (Notification as any).create({
          projectId,
          title: `Web Vitals Degradation: LCP ${(overallVitals.lcp / 1000).toFixed(2)}s`,
          message: `Largest Contentful Paint across your website is ${(overallVitals.lcp / 1000).toFixed(2)}s (Google recommends < 2.5s). Large images or uncompressed assets are degrading user experience.`,
          type: "web_vitals",
          severity: isPoor ? "critical" : "warning",
          metadata: { lcp: overallVitals.lcp },
          actionUrl: "/vitals",
          actionLabel: "View Web Vitals",
          fingerprint,
        });
        createdCount++;
      }
    }

    if (overallVitals?.cls && overallVitals.cls > 0.25) {
      const dayKey = new Date().toISOString().slice(0, 10);
      const fingerprint = `vitals_cls:${projectId}:${dayKey}`;
      const existing = await (Notification as any).findOne({
        projectId,
        fingerprint,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      if (!existing) {
        await (Notification as any).create({
          projectId,
          title: `Web Vitals: High Cumulative Layout Shift (${overallVitals.cls.toFixed(2)})`,
          message: `Cumulative Layout Shift is ${overallVitals.cls.toFixed(2)} (target < 0.1). Elements on the page are shifting unexpectedly during load, causing accidental clicks.`,
          type: "web_vitals",
          severity: "warning",
          metadata: { cls: overallVitals.cls },
          actionUrl: "/vitals",
          actionLabel: "Inspect CLS",
          fingerprint,
        });
        createdCount++;
      }
    }

    // 5. BEHAVIORAL UX: RAGE CLICK HOTSPOTS
    const rageClicks = data?.behavioralSignals?.rageClicks || [];
    for (const rc of rageClicks) {
      if (rc.count >= 3) {
        const elementKey = (rc.element || "element").slice(0, 30);
        const fingerprint = `rage_click:${projectId}:${rc.pathname}:${elementKey}`;
        const existing = await (Notification as any).findOne({
          projectId,
          fingerprint,
          createdAt: { $gte: twentyFourHoursAgo },
        });

        if (!existing) {
          await (Notification as any).create({
            projectId,
            title: `UX Frustration: ${rc.count} Rage Clicks on "${rc.pathname}"`,
            message: `Visitors repeatedly clicked element "${rc.element}" ${rc.count} times in rapid succession. The element may look interactive without having an active event handler.`,
            type: "rage_clicks",
            severity: "warning",
            metadata: { pathname: rc.pathname, element: rc.element, count: rc.count },
            actionUrl: "/ux",
            actionLabel: "View Behavioral UX",
            fingerprint,
          });
          createdCount++;
        }
      }
    }

    return { createdCount };
  } catch (err) {
    console.error("Error running optimization scan:", err);
    return { createdCount: 0 };
  }
}

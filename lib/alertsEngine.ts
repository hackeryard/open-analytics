import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import ErrorLog from "@/models/ErrorLog";
import Project from "@/models/Project";
import { getProjectAnalytics } from "@/lib/analyticsDb";

/**
 * Checks whether a notification should be suppressed based on general type toggles
 * or specific ignore rules configured for the project.
 */
export function isNotificationIgnored(
  alertSettings: any,
  data: {
    type: string;
    title?: string;
    message?: string;
    pathname?: string;
    fingerprint?: string;
  }
): boolean {
  if (!alertSettings) return false;

  // 1. General notification type toggles
  if (data.type === "error_repeated" && alertSettings.errorRepeatedAlerts === false) return true;
  if (data.type === "error_storm" && alertSettings.errorStormAlerts === false) return true;
  if (data.type === "seo_unoptimized" && alertSettings.seoOptimizationAlerts === false) return true;
  if (data.type === "aeo_unoptimized" && (alertSettings.aeoOptimizationAlerts === false || alertSettings.seoOptimizationAlerts === false)) return true;
  if (data.type === "geo_radar" && alertSettings.geoRadarAlerts === false) return true;
  if (data.type === "web_vitals" && alertSettings.webVitalsAlerts === false) return true;
  if (data.type === "rage_clicks" && alertSettings.rageClicksAlerts === false) return true;

  // 2. Ignored types list
  const ignoredTypes: string[] = Array.isArray(alertSettings.ignoredTypes)
    ? alertSettings.ignoredTypes
    : [];
  if (ignoredTypes.includes(data.type)) return true;

  // 3. Specific ignore rules & patterns
  const ignoredRules = Array.isArray(alertSettings.ignoredRules) ? alertSettings.ignoredRules : [];
  for (const rule of ignoredRules) {
    if (!rule || rule.enabled === false) continue;
    if (rule.type && rule.type !== "all" && rule.type !== data.type) continue;

    let target = "";
    if (rule.matchField === "pathname") target = data.pathname || "";
    else if (rule.matchField === "message") target = data.message || "";
    else if (rule.matchField === "title") target = data.title || "";
    else if (rule.matchField === "fingerprint") target = data.fingerprint || "";
    else if (rule.matchField === "type") target = data.type || "";

    if (!target) continue;
    const pattern = String(rule.pattern || "").trim();
    if (!pattern) continue;

    const targetLower = target.toLowerCase();
    const patternLower = pattern.toLowerCase();

    if (rule.matchType === "exact") {
      if (targetLower === patternLower) return true;
    } else if (rule.matchType === "starts_with") {
      if (targetLower.startsWith(patternLower)) return true;
    } else if (rule.matchType === "regex") {
      try {
        const regex = new RegExp(pattern, "i");
        if (regex.test(target)) return true;
      } catch {
        if (targetLower.includes(patternLower)) return true;
      }
    } else {
      // contains
      if (targetLower.includes(patternLower)) return true;
    }
  }

  return false;
}

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

        if (
          isNotificationIgnored(alertSettings, {
            type: "error_repeated",
            pathname,
            message,
            fingerprint,
            title: `Repeated Error (${occurrences}x): ${errorType.toUpperCase()}`,
          })
        ) {
          // Suppressed by ignore rule or general toggle
          return;
        }

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
      const hourKey = new Date().toISOString().slice(0, 13);
      const stormFingerprint = `err_storm:${projectId}:${hourKey}`;

      if (
        isNotificationIgnored(alertSettings, {
          type: "error_storm",
          fingerprint: stormFingerprint,
          title: "High Error Velocity Detected",
        })
      ) {
        return;
      }

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
 * Honors general notification toggles and custom ignore rules.
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
    const alertSettings = (project as any)?.settings?.alertSettings || {};

    // 0. REPEATED ERRORS TELEMETRY SCAN
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

      if (
        isNotificationIgnored(alertSettings, {
          type: "error_repeated",
          pathname,
          message,
          fingerprint,
          title: `Repeated Error (${occurrences}x): ${errorType.toUpperCase()}`,
        })
      ) {
        continue;
      }

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

      if (
        !isNotificationIgnored(alertSettings, {
          type: "error_storm",
          fingerprint: stormFingerprint,
          title: "High Error Velocity Detected",
        })
      ) {
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

        if (
          isNotificationIgnored(alertSettings, {
            type: "seo_unoptimized",
            pathname,
            title,
            fingerprint,
          })
        ) {
          continue;
        }

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

        if (
          isNotificationIgnored(alertSettings, {
            type: "aeo_unoptimized",
            pathname,
            fingerprint,
          })
        ) {
          continue;
        }

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

      if (
        !isNotificationIgnored(alertSettings, {
          type: "geo_radar",
          fingerprint,
        })
      ) {
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
    }

    // 4. WEB VITALS DEGRADATION (POOR LCP OR POOR CLS)
    const overallVitals = data?.webVitals?.overall;
    if (overallVitals?.lcp && overallVitals.lcp > 2500) {
      const dayKey = new Date().toISOString().slice(0, 10);
      const fingerprint = `vitals_lcp:${projectId}:${dayKey}`;

      if (
        !isNotificationIgnored(alertSettings, {
          type: "web_vitals",
          fingerprint,
        })
      ) {
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
    }

    if (overallVitals?.cls && overallVitals.cls > 0.25) {
      const dayKey = new Date().toISOString().slice(0, 10);
      const fingerprint = `vitals_cls:${projectId}:${dayKey}`;

      if (
        !isNotificationIgnored(alertSettings, {
          type: "web_vitals",
          fingerprint,
        })
      ) {
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
    }

    // 5. BEHAVIORAL UX: RAGE CLICK HOTSPOTS
    const rageClicks = data?.behavioralSignals?.rageClicks || [];
    for (const rc of rageClicks) {
      if (rc.count >= 3) {
        const elementKey = (rc.element || "element").slice(0, 30);
        const fingerprint = `rage_click:${projectId}:${rc.pathname}:${elementKey}`;

        if (
          isNotificationIgnored(alertSettings, {
            type: "rage_clicks",
            pathname: rc.pathname,
            message: rc.element,
            fingerprint,
          })
        ) {
          continue;
        }

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

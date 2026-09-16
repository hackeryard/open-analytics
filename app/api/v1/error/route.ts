import { connectDB } from "@/lib/mongodb";
import ErrorLog from "@/models/ErrorLog";
import { authenticateProjectRequest } from "@/lib/projectAuth";
import { corsJsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      const rawText = await req.text();
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = {};
    }
    const auth = await authenticateProjectRequest(req, body);
    if (!auth.authorized || !auth.project) {
      return corsJsonResponse({ ok: false, error: auth.error || "Unauthorized" }, { status: auth.status }, req);
    }

    const { projectId, ownerId } = auth.project;

    // CHECK PLAN EXPIRED / PAUSED PROJECT STATUS
    const { isProjectIngestionAllowed } = await import("@/lib/planLimits");
    const ingestionCheck = isProjectIngestionAllowed(auth.project, ownerId);
    if (!ingestionCheck.allowed) {
      return corsJsonResponse({
        ok: false,
        error: ingestionCheck.reason || "Project tracking paused on Free plan. Upgrade subscription to resume.",
        code: "TRACKING_PAUSED",
      }, { status: 403 }, req);
    }

    const { message, stack, digest, componentStack, errorType, pathname, visitorId, sessionId, userId } = body;

    const resolvedMessage = (
      message ||
      body.error?.message ||
      body.error ||
      body.msg ||
      (stack ? String(stack).split("\n")[0] : "Uncaught Runtime Exception")
    ).toString().trim();

    let resolvedPathname = pathname;
    if (!resolvedPathname) {
      try {
        const referer = req.headers.get("referer");
        if (referer) {
          resolvedPathname = new URL(referer).pathname;
        }
      } catch (e) {}
    }
    if (!resolvedPathname) {
      resolvedPathname = "/";
    }

    const validErrorTypes = [
      "runtime",
      "unhandledrejection",
      "boundary",
      "network",
      "api",
      "resource",
      "webgl",
      "console",
      "hydration",
      "not_found",
      "http_4xx",
      "http_5xx",
      "csp",
    ];
    const resolvedErrorType = validErrorTypes.includes(errorType) ? errorType : "runtime";

    // 1. Evaluate Project-level Error Block / Ignore Rules
    const errorRules = Array.isArray(auth.project.settings?.errorRules)
      ? auth.project.settings.errorRules
      : [];

    const isRuleMatch = (fieldValue: string, matchType: string, pattern: string): boolean => {
      if (!fieldValue || !pattern) return false;
      const target = fieldValue.trim();
      const pat = pattern.trim();
      if (matchType === "exact") {
        return target.toLowerCase() === pat.toLowerCase();
      }
      if (matchType === "starts_with") {
        return target.toLowerCase().startsWith(pat.toLowerCase());
      }
      if (matchType === "regex") {
        try {
          const regex = new RegExp(pat, "i");
          return regex.test(target);
        } catch {
          return false;
        }
      }
      // default: "contains"
      return target.toLowerCase().includes(pat.toLowerCase());
    };

    const matchingRule = errorRules.find((rule: any) => {
      if (!rule.enabled || !rule.pattern) return false;
      let valToTest = "";
      if (rule.matchField === "pathname") valToTest = resolvedPathname;
      else if (rule.matchField === "errorType") valToTest = resolvedErrorType;
      else if (rule.matchField === "stack") valToTest = stack ? String(stack) : "";
      else valToTest = resolvedMessage;

      return isRuleMatch(valToTest, rule.matchType || "contains", rule.pattern);
    });

    if (matchingRule) {
      return corsJsonResponse(
        {
          ok: true,
          ignored: true,
          ruleId: matchingRule.id,
          ruleName: matchingRule.name,
          message: `Error matching ignore rule '${matchingRule.name}' was suppressed.`,
        },
        { status: 200 },
        req
      );
    }

    await connectDB();

    const ua = req.headers.get("user-agent") || "";
    const isMobile = /mobile|android|iphone/i.test(ua);
    const device = isMobile ? "mobile" : "desktop";

    let browser = "Browser";
    if (/chrome/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";

    let os = "OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad/i.test(ua)) os = "iOS";

    // Deduplicate within 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await (ErrorLog as any).findOne({
      projectId,
      message: resolvedMessage,
      pathname: resolvedPathname,
      lastOccurredAt: { $gte: twentyFourHoursAgo },
    });

    if (existing) {
      existing.occurrences = (existing.occurrences || 1) + 1;
      existing.lastOccurredAt = new Date();
      if (userId && !existing.userId) existing.userId = userId;
      if (digest && !existing.digest) existing.digest = digest;
      if (stack && !existing.stack) existing.stack = stack;
      await existing.save();

      return corsJsonResponse({ ok: true, deduplicated: true, errorId: existing._id }, { status: 200 }, req);
    }

    const errorLog = await (ErrorLog as any).create({
      projectId,
      message: resolvedMessage.slice(0, 1000),
      stack: stack ? String(stack).slice(0, 5000) : "",
      digest: digest || null,
      componentStack: componentStack ? String(componentStack).slice(0, 3000) : null,
      errorType: resolvedErrorType,
      pathname: resolvedPathname,
      visitorId: visitorId || null,
      sessionId: sessionId || null,
      userId: userId || null,
      device,
      browser,
      os,
      userAgent: ua.slice(0, 300),
      status: "new",
      occurrences: 1,
      lastOccurredAt: new Date(),
    });

    return corsJsonResponse({ ok: true, errorId: errorLog._id }, { status: 200 }, req);
  } catch (err: any) {
    console.error("Open Analytics error ingestion error:", err);
    return corsJsonResponse({ ok: false, error: err.message }, { status: 500 }, req);
  }
}

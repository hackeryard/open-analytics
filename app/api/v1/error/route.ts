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
      body = await req.json();
    } catch {
      try {
        const text = await req.text();
        body = text ? JSON.parse(text) : {};
      } catch {
        body = {};
      }
    }
    const auth = await authenticateProjectRequest(req, body);
    if (!auth.authorized || !auth.project) {
      return corsJsonResponse({ ok: false, error: auth.error || "Unauthorized" }, { status: auth.status }, req);
    }

    const { projectId } = auth.project;
    const { message, stack, digest, componentStack, errorType, pathname, visitorId, sessionId, userId } = body;

    if (!message || !pathname) {
      return corsJsonResponse({ ok: false, error: "message and pathname required" }, { status: 400 }, req);
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
      message: message.trim(),
      pathname,
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
      message: message.trim().slice(0, 1000),
      stack: stack ? String(stack).slice(0, 5000) : "",
      digest: digest || null,
      componentStack: componentStack ? String(componentStack).slice(0, 3000) : null,
      errorType: errorType || "runtime",
      pathname,
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
    console.error("Pulse error ingestion error:", err);
    return corsJsonResponse({ ok: false, error: err.message }, { status: 500 }, req);
  }
}

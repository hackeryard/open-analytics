import { connectDB } from "@/lib/mongodb";
import PageView from "@/models/PageView";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { authenticateProjectRequest } from "@/lib/projectAuth";
import { extractGeoLocation } from "@/lib/geolocation";
import { anonymizeIp, redactPii } from "@/lib/privacy";
import { detectBotAndReferrer } from "@/lib/botDetector";
import { corsJsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

function extractDomain(ref?: string): string {
  if (!ref || ref.trim() === "") return "Direct";
  try {
    const url = new URL(ref.startsWith("http") ? ref : `https://${ref}`);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (
      host === "accounts.google.com" ||
      (host.endsWith(".google.com") && (url.pathname.includes("/oauth") || url.pathname.includes("/signin"))) ||
      host === "appleid.apple.com" ||
      host === "localhost" ||
      host === "127.0.0.1"
    ) {
      return "Direct";
    }
    return host;
  } catch {
    return "Direct";
  }
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

    const { projectId, settings } = auth.project;
    const { type, visitorId, sessionId, pathname } = body;

    if (!visitorId || !sessionId || !pathname) {
      return corsJsonResponse({ ok: false, error: "Missing visitorId, sessionId, or pathname" }, { status: 400 }, req);
    }

    await connectDB();
    const geo = extractGeoLocation(req);
    const effectiveIp = settings?.ipAnonymization ? anonymizeIp(geo.ip) : geo.ip;

    const userAgent = req.headers.get("user-agent") || body.userAgent || "";
    const detection = detectBotAndReferrer({
      userAgent,
      referrer: body.referrer || "",
    });

    // A. Pageview Ingestion
    if (type === "pageview") {
      let referrerDomain = extractDomain(body.referrer);
      if (referrerDomain === "Direct" && detection.referrerDomain && detection.referrerDomain !== "Direct") {
        referrerDomain = detection.referrerDomain;
      }

      let isReturning = Boolean(body.isReturning);
      let visitCount = Math.max(1, Number(body.visitCount) || 1);

      if (!isReturning && detection.visitorType === "human") {
        const prior = await (PageView as any).findOne({
          projectId,
          visitorId,
          sessionId: { $ne: sessionId },
        }).select("_id").lean();
        if (prior) {
          isReturning = true;
          visitCount = Math.max(2, visitCount);
        }
      }

      await (PageView as any).create({
        projectId,
        pathname,
        title: body.title || "",
        labId: body.labId || null,
        visitorId,
        sessionId,
        userId: body.userId || null,
        referrer: body.referrer || "",
        referrerDomain,
        // SEO & AEO Detection
        searchEngine: detection.searchEngine || body.searchEngine || null,
        aiReferrer: detection.aiReferrer || body.aiReferrer || null,
        visitorType: detection.visitorType,
        botCategory: detection.botCategory,
        botName: detection.botName,
        structuredDataDetected: Boolean(body.structuredDataDetected),
        utmSource: body.utmSource || null,
        utmMedium: body.utmMedium || null,
        utmCampaign: body.utmCampaign || null,
        device: detection.isBot ? "desktop" : (body.device || "desktop"),
        browser: detection.isBot && detection.botName ? detection.botName : (body.browser || "Unknown"),
        os: body.os || "Unknown",
        screen: body.screen || "",
        language: body.language || "en",
        timezone: body.timezone || geo.timezone || "",
        country: geo.country,
        region: geo.region,
        city: geo.city,
        ip: effectiveIp,
        duration: 1,
        activeDuration: 0,
        idleDuration: 0,
        focusCount: 1,
        scrollDepth: 0,
        scrollMilestones: [],
        webVitals: {
          fcp: null,
          lcp: null,
          cls: null,
          inp: null,
          ttfb: null,
          domLoad: null,
          windowLoad: null,
        },
        hardware: body.hardware || {},
        network: body.network || {},
        isBounce: false,
        exitIntent: false,
        isReturning,
        visitCount,
      });

      return corsJsonResponse({ ok: true, projectId }, { status: 200 }, req);
    }

    // B. Heartbeat Dwell & Vitals Update
    if (type === "heartbeat") {
      const updateSet: Record<string, any> = {
        duration: Number(body.duration) || 1,
        activeDuration: Math.max(0, Number(body.activeDuration) || 0),
        idleDuration: Math.max(0, Number(body.idleDuration) || 0),
        focusCount: Math.max(1, Number(body.focusCount) || 1),
        scrollDepth: Math.min(100, Math.max(0, Number(body.scrollDepth) || 0)),
        isBounce: Boolean(body.isBounce),
        exitIntent: Boolean(body.exitIntent),
      };

      if (body.structuredDataDetected !== undefined) {
        updateSet.structuredDataDetected = Boolean(body.structuredDataDetected);
      }

      if (Array.isArray(body.scrollMilestones) && body.scrollMilestones.length > 0) {
        updateSet.scrollMilestones = body.scrollMilestones;
      }

      if (body.webVitals && typeof body.webVitals === "object") {
        for (const [k, v] of Object.entries(body.webVitals)) {
          if (v !== null && v !== undefined) {
            updateSet[`webVitals.${k}`] = v;
          }
        }
      }

      await (PageView as any).findOneAndUpdate(
        { projectId, sessionId, pathname },
        { $set: updateSet },
        { sort: { createdAt: -1 } }
      );

      return corsJsonResponse({ ok: true }, { status: 200 }, req);
    }

    // C. Custom Event Ingestion
    if (type === "event") {
      const { eventName, category, labId, properties, value } = body;
      if (!eventName) {
        return corsJsonResponse({ ok: false, error: "eventName is required" }, { status: 400 }, req);
      }

      const cleanProps = settings?.piiRedaction ? redactPii(properties || {}) : (properties || {});

      await (AnalyticsEvent as any).create({
        projectId,
        eventName,
        category: category || "general",
        labId: labId || null,
        visitorId,
        sessionId,
        userId: body.userId || null,
        pathname,
        properties: cleanProps,
        value: typeof value === "number" ? value : null,
      });

      return corsJsonResponse({ ok: true }, { status: 200 }, req);
    }

    return corsJsonResponse({ ok: true }, { status: 200 }, req);
  } catch (err: any) {
    console.error("Pulse collect error:", err);
    return corsJsonResponse({ ok: false, error: err.message }, { status: 500 }, req);
  }
}
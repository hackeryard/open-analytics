import { connectDB } from "@/lib/mongodb";
import PageView from "@/models/PageView";
import AnalyticsEvent from "@/models/AnalyticsEvent";
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

    const { projectId } = auth.project;
    const { userId, visitorId, sessionId, traits } = body;

    if (!userId || !visitorId) {
      return corsJsonResponse({ ok: false, error: "userId and visitorId required" }, { status: 400 }, req);
    }

    await connectDB();

    // Link user ID to recent session pageviews
    await (PageView as any).updateMany(
      { projectId, visitorId, userId: null },
      { $set: { userId } }
    );

    // Record user identified event
    await (AnalyticsEvent as any).create({
      projectId,
      eventName: "user_identified",
      category: "identity",
      visitorId,
      sessionId: sessionId || "s_ident",
      userId,
      properties: traits || {},
    });

    return corsJsonResponse({ ok: true }, { status: 200 }, req);
  } catch (err: any) {
    return corsJsonResponse({ ok: false, error: err.message }, { status: 500 }, req);
  }
}

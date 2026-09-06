import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PageView from "@/models/PageView";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { authenticateProjectRequest } from "@/lib/projectAuth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const auth = await authenticateProjectRequest(req, body);
    if (!auth.authorized || !auth.project) {
      return NextResponse.json({ ok: false, error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const { projectId } = auth.project;
    const { userId, visitorId, sessionId, traits } = body;

    if (!userId || !visitorId) {
      return NextResponse.json({ ok: false, error: "userId and visitorId required" }, { status: 400 });
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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

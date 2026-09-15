import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PageView from "@/models/PageView";
import { parseDateFilter } from "@/lib/analyticsDb";
import { verifyProjectAccess } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(200, Math.max(5, parseInt(searchParams.get("limit") || "50", 10)));
    const timeRange = searchParams.get("timeRange") || "all";
    const startDateParam = searchParams.get("startDate") || null;
    const endDateParam = searchParams.get("endDate") || null;
    const userType = searchParams.get("userType") || "all";
    const query = searchParams.get("query")?.trim() || "";
    const device = searchParams.get("device") || "";
    const vitals = searchParams.get("vitals") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    const projectPlan = auth.project?.plan || "free";
    const { matchStage } = parseDateFilter(params.projectId, timeRange, startDateParam, endDateParam, projectPlan);
    const andConditions: any[] = [{ projectId: params.projectId, createdAt: matchStage.createdAt }];

    if (device && device !== "all") andConditions.push({ device });

    if (vitals === "good") {
      andConditions.push({ "webVitals.lcp": { $lte: 2500, $gt: 0 } });
    } else if (vitals === "needs_improvement") {
      andConditions.push({ "webVitals.lcp": { $gt: 2500, $lte: 4000 } });
    } else if (vitals === "poor") {
      andConditions.push({ "webVitals.lcp": { $gt: 4000 } });
    }

    if (userType === "anonymous") {
      andConditions.push({ userId: null });
    } else if (userType === "authenticated") {
      andConditions.push({ userId: { $ne: null } });
    } else if (userType === "new") {
      andConditions.push({ isReturning: false });
    } else if (userType === "returning") {
      andConditions.push({ isReturning: true });
    } else if (userType === "bounced") {
      andConditions.push({ isBounce: true });
    } else if (userType === "bots") {
      andConditions.push({ visitorType: { $in: ["search_bot", "ai_crawler"] } });
    } else if (userType === "humans") {
      andConditions.push({ visitorType: "human" });
    }

    if (query) {
      const regex = new RegExp(query, "i");
      andConditions.push({
        $or: [
          { pathname: regex },
          { title: regex },
          { labId: regex },
          { country: regex },
          { city: regex },
          { browser: regex },
          { os: regex },
          { visitorId: regex },
          { sessionId: regex },
          { referrerDomain: regex },
          { utmSource: regex },
          { utmCampaign: regex },
          { botName: regex },
          { searchEngine: regex },
          { aiReferrer: regex },
          { ip: regex },
        ],
      });
    }

    const filter = andConditions.length === 1 ? andConditions[0] : { $and: andConditions };

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === "duration_desc") sortObj = { duration: -1, createdAt: -1 };
    else if (sortBy === "active_desc") sortObj = { activeDuration: -1, createdAt: -1 };
    else if (sortBy === "scroll_desc") sortObj = { scrollDepth: -1, createdAt: -1 };
    else if (sortBy === "createdAt_asc") sortObj = { createdAt: 1 };
    else if (sortBy === "lcp_desc") sortObj = { "webVitals.lcp": -1, createdAt: -1 };

    const total = await (PageView as any).countDocuments(filter);
    const pageviews = await (PageView as any).find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      pageviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
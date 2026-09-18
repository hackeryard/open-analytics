import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { corsJsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || searchParams.get("pid");

    if (!projectId) {
      return corsJsonResponse({ ok: false, error: "Missing projectId parameter" }, { status: 400 }, req);
    }

    await connectDB();
    const project = await (Project as any).findOne(
      { projectId: projectId.trim() },
      { "settings.customEventRules": 1, allowedDomains: 1, plan: 1 }
    ).lean();

    if (!project) {
      return corsJsonResponse(
        {
          ok: true,
          projectId,
          rules: [],
          timestamp: Date.now(),
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
          },
        },
        req
      );
    }

    // Only deliver automated event rules if project is Pro or Enterprise
    if (project.plan !== "pro" && project.plan !== "enterprise") {
      return corsJsonResponse(
        {
          ok: true,
          projectId,
          rules: [],
          proRequired: true,
          timestamp: Date.now(),
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
          },
        },
        req
      );
    }

    const allRules = Array.isArray(project.settings?.customEventRules)
      ? project.settings.customEventRules
      : [];

    // Return only active rules to the client tracker
    const activeRules = allRules.filter((r: any) => r.enabled !== false);

    return corsJsonResponse(
      {
        ok: true,
        projectId,
        rules: activeRules,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300",
        },
      },
      req
    );
  } catch (err: any) {
    return corsJsonResponse({ ok: false, error: err.message }, { status: 500 }, req);
  }
}

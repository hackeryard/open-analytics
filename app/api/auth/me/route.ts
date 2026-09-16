import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth";
import { ensureDefaultProject } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await ensureDefaultProject();

    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        projects: [],
      });
    }

    let projectsQuery: any = {};
    if (user.role !== "super_admin") {
      // STRICT ISOLATION: Only projects owned by or shared with this user
      projectsQuery = {
        $or: [
          { ownerId: user._id },
          { "members.userId": user._id },
        ],
      };
    }

    const projects = await (Project as any)
      .find(projectsQuery)
      .populate("ownerId", "name email plan planExpiresAt subscriptionStatus role extraProjectsAllowed lockedActiveProjectId")
      .select("-secretKey")
      .sort({ createdAt: -1 })
      .lean();

    const { getProjectEffectivePlan } = await import("@/lib/planLimits");

    return NextResponse.json({
      authenticated: true,
      user,
      projects: projects.map((p: any) => {
        const isOwner = p.ownerId ? (p.ownerId._id ? p.ownerId._id.toString() : p.ownerId.toString()) === user._id.toString() : false;
        const effectivePlan = getProjectEffectivePlan(p, p.ownerId);

        return {
          id: p._id.toString(),
          projectId: p.projectId,
          name: p.name,
          slug: p.slug,
          publishableKey: p.publishableKey,
          plan: effectivePlan,
          effectivePlan,
          monitoringStatus: p.monitoringStatus || "active",
          timezone: p.timezone,
          currency: p.currency,
          industryCategory: p.industryCategory,
          businessSize: p.businessSize,
          websiteUrl: p.websiteUrl,
          dataStreams: p.dataStreams || [],
          measurementId: p.measurementId,
          ownerEmail: p.ownerId?.email || "",
          isOwner,
          role: (() => {
            if (user.role === "super_admin") return "super_admin";
            if (isOwner) return "owner";
            if (Array.isArray(p.members)) {
              const member = p.members.find((m: any) => (m.userId?.toString() || m.userId) === user._id.toString());
              if (member?.role) return member.role;
            }
            return "member";
          })(),
          settings: p.settings,
          createdAt: p.createdAt,
        };
      }),
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return NextResponse.json({ error: err.message || "Failed to resolve session" }, { status: 500 });
  }
}
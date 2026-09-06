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
      .select("-secretKey")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      authenticated: true,
      user,
      projects: projects.map((p: any) => ({
        id: p._id.toString(),
        projectId: p.projectId,
        name: p.name,
        slug: p.slug,
        publishableKey: p.publishableKey,
        isOwner: p.ownerId ? p.ownerId.toString() === user._id.toString() : false,
        role: user.role === "super_admin" ? "super_admin" : (p.ownerId?.toString() === user._id.toString() ? "owner" : "member"),
        settings: p.settings,
        createdAt: p.createdAt,
      })),
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return NextResponse.json({ error: err.message || "Failed to resolve session" }, { status: 500 });
  }
}
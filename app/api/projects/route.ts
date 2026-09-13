import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { ensureDefaultProject } from "@/lib/seed";
import { getCurrentUser, generateProjectId, generateApiKey } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await ensureDefaultProject();

    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    let query: any = {};
    if (user.role !== "super_admin") {
      // STRICT ISOLATION: Only projects owned by the user or where user is an invited member
      query = {
        $or: [
          { ownerId: user._id },
          { "members.userId": user._id },
        ],
      };
    }

    const projectsRaw = await (Project as any)
      .find(query)
      .select("-secretKey")
      .sort({ createdAt: -1 })
      .lean();

    const userIdStr = user._id.toString();

    const projects = projectsRaw.map((p: any) => {
      let currentUserRole = "member";
      if (user.role === "super_admin") {
        currentUserRole = "super_admin";
      } else if (p.ownerId && p.ownerId.toString() === userIdStr) {
        currentUserRole = "owner";
      } else if (Array.isArray(p.members)) {
        const member = p.members.find((m: any) => (m.userId?.toString() || m.userId) === userIdStr);
        if (member && member.role) {
          currentUserRole = member.role;
        }
      }
      return {
        ...p,
        currentUserRole,
      };
    });

    return NextResponse.json({ projects, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to create projects. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, slug, allowedDomains, settings } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");

    const projectId = generateProjectId("prj_");
    const publishableKey = generateApiKey("pk");
    const secretKey = generateApiKey("sk");

    const project = await (Project as any).create({
      projectId,
      name: name.trim(),
      slug: cleanSlug || "web-project",
      ownerId: user._id,
      members: [
        {
          userId: user._id,
          role: "admin",
        },
      ],
      publishableKey,
      secretKey,
      allowedDomains: Array.isArray(allowedDomains) && allowedDomains.length > 0 ? allowedDomains : ["*"],
      settings: {
        ipAnonymization: settings?.ipAnonymization ?? true,
        piiRedaction: settings?.piiRedaction ?? true,
        seoTracking: settings?.seoTracking ?? true,
        aiTracking: settings?.aiTracking ?? true,
        dataRetentionDays: settings?.dataRetentionDays ?? 365,
        enabledModules: settings?.enabledModules ?? [
          "core",
          "rum",
          "behavioral",
          "errors",
          "seo",
          "ai_aeo",
        ],
      },
    });

    return NextResponse.json({
      project: {
        ...project.toObject(),
        currentUserRole: "owner",
      },
    }, { status: 201 });
  } catch (err: any) {
    console.error("Create project error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
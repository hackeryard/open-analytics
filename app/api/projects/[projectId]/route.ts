import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyProjectAccess, verifyProjectManage, verifyProjectOwner } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const userIdStr = auth.user._id.toString();
    let currentUserRole = "member";
    if (auth.user.role === "super_admin") {
      currentUserRole = "super_admin";
    } else if (auth.project.ownerId && auth.project.ownerId.toString() === userIdStr) {
      currentUserRole = "owner";
    } else if (Array.isArray(auth.project.members)) {
      const member = auth.project.members.find((m: any) => (m.userId?.toString() || m.userId) === userIdStr);
      if (member && member.role) {
        currentUserRole = member.role;
      }
    }

    return NextResponse.json({ project: auth.project, currentUserRole });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.timezone !== undefined) updateData.timezone = body.timezone;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.industryCategory !== undefined) updateData.industryCategory = body.industryCategory;
    if (body.businessSize !== undefined) updateData.businessSize = body.businessSize;
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl;
    if (body.dataStreams !== undefined) updateData.dataStreams = body.dataStreams;
    if (body.allowedDomains !== undefined) updateData.allowedDomains = body.allowedDomains;
    if (body.settings !== undefined) updateData.settings = body.settings;
    if (body.plan !== undefined && ["free", "pro", "enterprise"].includes(body.plan)) {
      updateData.plan = body.plan;
    }

    const project = await (Project as any).findOneAndUpdate(
      { projectId: params.projectId },
      { $set: updateData },
      { new: true }
    ).lean();

    return NextResponse.json({ project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectOwner(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    await (Project as any).deleteOne({ projectId: params.projectId });
    return NextResponse.json({ success: true, deletedProjectId: params.projectId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
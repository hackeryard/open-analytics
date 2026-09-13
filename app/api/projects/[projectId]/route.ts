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

    return NextResponse.json({ project: auth.project, currentUserRole: auth.user.role });
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
    if (body.name) updateData.name = body.name;
    if (body.allowedDomains) updateData.allowedDomains = body.allowedDomains;
    if (body.settings) updateData.settings = body.settings;

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
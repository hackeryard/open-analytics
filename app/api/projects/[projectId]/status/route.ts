import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import PageView from "@/models/PageView";
import { verifyProjectAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const project = auth.project;
    const totalHits = await (PageView as any).countDocuments({ projectId: project.projectId });

    return NextResponse.json({
      projectId: project.projectId,
      measurementId: project.measurementId,
      monitoringStatus: project.monitoringStatus || (totalHits > 0 ? "active" : "pending_verification"),
      verifiedAt: project.verifiedAt || (totalHits > 0 ? project.createdAt : null),
      totalHits,
      dataStreams: project.dataStreams || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

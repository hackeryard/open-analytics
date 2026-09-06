import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ErrorLog from "@/models/ErrorLog";
import { verifyProjectManage } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { projectId: string; id: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { status } = await req.json();
    if (!status || !["new", "investigating", "resolved", "ignored"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await (ErrorLog as any).findOneAndUpdate(
      { _id: params.id, projectId: params.projectId },
      { $set: { status } },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Error not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string; id: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const deleted = await (ErrorLog as any).findOneAndDelete({
      _id: params.id,
      projectId: params.projectId,
    });
    if (!deleted) return NextResponse.json({ error: "Error not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
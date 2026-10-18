import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectEdit } from "@/lib/auth";
import GrowthStrategy from "@/models/GrowthStrategy";

export const dynamic = "force-dynamic";

/**
 * PATCH: Updates a growth strategy status or implementation notes
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string; strategyId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { status, notes } = await req.json();

    const updateFields: any = {
      statusUpdatedAt: new Date(),
    };

    if (status && ["recommended", "in_progress", "implemented", "dismissed"].includes(status)) {
      updateFields.status = status;
    }

    if (typeof notes === "string") {
      updateFields.notes = notes;
    }

    const updated = await (GrowthStrategy as any).findOneAndUpdate(
      {
        projectId: params.projectId,
        $or: [{ strategyId: params.strategyId }, { slug: params.strategyId }],
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      strategy: updated,
    });
  } catch (err: any) {
    console.error("Strategy update error:", err);
    return NextResponse.json({ error: "Failed to update strategy", details: err.message }, { status: 500 });
  }
}

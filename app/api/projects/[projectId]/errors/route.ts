import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ErrorLog from "@/models/ErrorLog";
import { verifyProjectAccess, verifyProjectEdit } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const errorType = searchParams.get("errorType");
    const limit = Math.min(parseInt(searchParams.get("limit") || "500", 10), 1000);

    const filter: Record<string, any> = { projectId: params.projectId };
    if (status && status !== "all") filter.status = status;
    if (errorType && errorType !== "all") filter.errorType = errorType;

    const errors = await (ErrorLog as any)
      .find(filter)
      .sort({ lastOccurredAt: -1, occurrences: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ errors, total: errors.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { errorIds, status, filterStatus } = await req.json();
    if (!status || !["new", "investigating", "resolved", "ignored"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const query: Record<string, any> = { projectId: params.projectId };
    if (Array.isArray(errorIds) && errorIds.length > 0) {
      query._id = { $in: errorIds };
    } else if (filterStatus && filterStatus !== "all") {
      query.status = filterStatus;
    }

    const result = await (ErrorLog as any).updateMany(query, { $set: { status } });
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    let errorIds: string[] = [];
    try {
      const body = await req.json();
      if (Array.isArray(body.errorIds)) {
        errorIds = body.errorIds;
      }
    } catch {}

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const purge = searchParams.get("purge");
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      errorIds = idsParam.split(",").filter(Boolean);
    }

    const query: Record<string, any> = { projectId: params.projectId };
    if (errorIds.length > 0) {
      query._id = { $in: errorIds };
    } else if (purge === "resolved") {
      query.status = "resolved";
    } else if (purge === "ignored") {
      query.status = "ignored";
    } else if (purge === "all") {
      // delete all for this project
    } else if (status && status !== "all") {
      query.status = status;
    }

    const result = await (ErrorLog as any).deleteMany(query);
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
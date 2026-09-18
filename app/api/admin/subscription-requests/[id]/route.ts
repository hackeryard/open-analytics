import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import SubscriptionAuditLog from "@/models/SubscriptionAuditLog";

/**
 * PATCH /api/admin/subscription-requests/[id]
 * Administrator updates request status (e.g. contacted, payment_pending, rejected) or attaches internal adminNotes.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Super Administrator authorization required" }, { status: 403 });
    }

    const requestId = params.id;
    const body = await req.json();
    const { status, adminNotes } = body;

    const request = await (SubscriptionRequest as any).findById(requestId);
    if (!request) {
      return NextResponse.json({ error: "Subscription request not found" }, { status: 404 });
    }

    const previousStatus = request.status;
    if (status) {
      request.status = status;
    }
    if (adminNotes !== undefined) {
      request.adminNotes = adminNotes;
    }

    await request.save();

    await (SubscriptionAuditLog as any).create({
      adminId: user._id,
      adminEmail: user.email,
      action: "request_updated",
      affectedUserId: request.userId,
      affectedUserEmail: request.userEmail,
      requestId: request._id,
      metadata: {
        fromStatus: previousStatus,
        toStatus: request.status,
        adminNotes: adminNotes || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription request updated successfully.",
      request,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update request" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import SubscriptionAuditLog from "@/models/SubscriptionAuditLog";

/**
 * POST /api/subscription/requests/[id]/cancel
 * Allows a user to cancel their pending subscription request.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const requestId = params.id;
    const request = await (SubscriptionRequest as any).findById(requestId);

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Ensure the request belongs to this user (unless admin)
    if (request.userId.toString() !== user._id.toString() && user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized access to request" }, { status: 403 });
    }

    if (request.status === "completed") {
      return NextResponse.json({ error: "Cannot cancel a completed subscription request" }, { status: 400 });
    }

    request.status = "cancelled";
    await request.save();

    await (SubscriptionAuditLog as any).create({
      action: "request_cancelled",
      affectedUserId: request.userId,
      affectedUserEmail: request.userEmail,
      requestId: request._id,
      metadata: { cancelledBy: user.email },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription request has been cancelled.",
      request,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to cancel request" }, { status: 500 });
  }
}

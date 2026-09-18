import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import SubscriptionRequest from "@/models/SubscriptionRequest";

/**
 * GET /api/admin/subscription-requests
 * Restricted to administrators. Lists subscription requests with filtering, pagination, and search.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Super Administrator authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { planName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await (SubscriptionRequest as any).countDocuments(query);
    const requests = await (SubscriptionRequest as any).find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("subscriptionId")
      .populate("paymentId")
      .lean();

    // Summary counts
    const requestedCount = await (SubscriptionRequest as any).countDocuments({ status: "requested" });
    const paymentPendingCount = await (SubscriptionRequest as any).countDocuments({ status: "payment_pending" });
    const completedCount = await (SubscriptionRequest as any).countDocuments({ status: "completed" });

    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      counts: {
        requested: requestedCount,
        paymentPending: paymentPendingCount,
        completed: completedCount,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch requests" }, { status: 500 });
  }
}

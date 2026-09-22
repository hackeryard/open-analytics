import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { getRazorpayInstance, getRazorpayKeys, RAZORPAY_PLAN_PRICES } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/razorpay/order
 * Creates a Razorpay Order for a subscription plan upgrade.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { plan = "pro", billingCycle = "monthly" } = body;

    if (!["pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid target subscription plan" }, { status: 400 });
    }

    if (!["monthly", "annual"].includes(billingCycle)) {
      return NextResponse.json({ error: "Invalid billing cycle" }, { status: 400 });
    }

    const planConfig = RAZORPAY_PLAN_PRICES[plan]?.[billingCycle as "monthly" | "annual"];
    if (!planConfig) {
      return NextResponse.json({ error: "Plan configuration not found" }, { status: 400 });
    }

    const { key_id: keyId } = getRazorpayKeys();
    const razorpay = getRazorpayInstance();

    // In dev mode when Razorpay credentials have not yet been provided, return mock order
    if (!razorpay || !keyId) {
      const mockOrderId = `order_mock_${Date.now()}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: planConfig.amount,
        currency: planConfig.currency,
        keyId: keyId || "rzp_test_placeholder",
        isMock: true,
        plan,
        billingCycle,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    }

    const receipt = `rcpt_${user._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`;

    const order = await razorpay.orders.create({
      amount: planConfig.amount,
      currency: planConfig.currency,
      receipt,
      notes: {
        userId: user._id.toString(),
        userEmail: user.email,
        plan,
        billingCycle,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      isMock: false,
      plan,
      billingCycle,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error("Failed to create Razorpay order:", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}

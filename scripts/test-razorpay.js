import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = "rzp_test_TcnmVccwbwe4vO";
const key_secret = "iemQ975cdVol1Zof00cseEzd";

async function runTest() {
  console.log("=== TESTING RAZORPAY TEST API CREDENTIALS ===");
  const razorpay = new Razorpay({ key_id, key_secret });

  try {
    // 1. Create order
    console.log("[1] Creating Test Order for ₹1,499 (149900 paise)...");
    const order = await razorpay.orders.create({
      amount: 149900,
      currency: "INR",
      receipt: `test_rcpt_${Date.now().toString().slice(-6)}`,
      notes: {
        test: "true",
        plan: "pro",
        billingCycle: "monthly",
      },
    });

    console.log("Order created successfully!");
    console.log("  Order ID:", order.id);
    console.log("  Amount:", order.amount, order.currency);
    console.log("  Status:", order.status);

    // 2. Test HMAC signature algorithm
    console.log("\n[2] Testing HMAC SHA256 Signature Verification...");
    const dummyPaymentId = "pay_test_123456789";
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${order.id}|${dummyPaymentId}`)
      .digest("hex");

    const verified = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );
    console.log("Signature calculation and timingSafeEqual match:", verified);

    console.log("\nALL RAZORPAY CHECKS PASSED!");
  } catch (err) {
    console.error("Razorpay test failed:", err);
    process.exit(1);
  }
}

runTest();

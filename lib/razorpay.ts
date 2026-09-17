import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Razorpay client instance initialized with environment variables.
 * Safe fallback in case credentials have not been configured yet in dev.
 */
export function getRazorpayKeys() {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
  return { key_id, key_secret, isConfigured: Boolean(key_id && key_secret) };
}

export function getRazorpayInstance(): Razorpay | null {
  const { key_id, key_secret, isConfigured } = getRazorpayKeys();
  if (!isConfigured) return null;
  return new Razorpay({ key_id, key_secret });
}

// Backward-compatible exports
export const isRazorpayConfigured = Boolean(
  (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) &&
    process.env.RAZORPAY_KEY_SECRET
);
export const razorpayInstance = getRazorpayInstance();

/**
 * Plan Pricing in INR (in paise: 1 INR = 100 paise)
 * Pro Monthly: ₹1,499 = 149900 paise
 * Pro Annual: ₹14,999 = 1499900 paise (approx ₹1,249/mo, 2 months free)
 * Enterprise Monthly: ₹7,999 = 799900 paise
 * Enterprise Annual: ₹79,990 = 7999000 paise
 */
export const RAZORPAY_PLAN_PRICES: Record<
  string,
  Record<"monthly" | "annual", { amount: number; currency: string; label: string }>
> = {
  pro: {
    monthly: {
      amount: 149900,
      currency: "INR",
      label: "Open Analytics Cloud Pro - Monthly (₹1,499)",
    },
    annual: {
      amount: 1499900,
      currency: "INR",
      label: "Open Analytics Cloud Pro - Annual (₹14,999)",
    },
  },
  enterprise: {
    monthly: {
      amount: 799900,
      currency: "INR",
      label: "Open Analytics Enterprise - Monthly (₹7,999)",
    },
    annual: {
      amount: 7999000,
      currency: "INR",
      label: "Open Analytics Enterprise - Annual (₹79,990)",
    },
  },
};

/**
 * Validates Razorpay Payment Signature for client-side checkout verification.
 * Expected signature is HMAC SHA256 of `order_id + "|" + payment_id` using Key Secret.
 */
export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const { key_secret } = getRazorpayKeys();
  if (!key_secret) return false;
  try {
    const generated = crypto
      .createHmac("sha256", key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(generated, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (err) {
    console.error("Razorpay signature verification error:", err);
    return false;
  }
}

/**
 * Validates Razorpay Webhook Signature using Webhook Secret.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const { key_secret } = getRazorpayKeys();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || key_secret;
  if (!webhookSecret) return false;
  try {
    const generated = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(generated, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (err) {
    console.error("Razorpay webhook signature verification error:", err);
    return false;
  }
}


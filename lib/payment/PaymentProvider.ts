/**
 * Payment Provider Abstraction Layer
 * Allows switching between manual payment recording and future gateways (Razorpay, Cashfree, PayU)
 * without redesigning the subscription architecture.
 */

export interface CreateOrderParams {
  amount: number; // in smallest currency unit (e.g. paise) or major units
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  isManual?: boolean;
  error?: string;
}

export interface VerifyPaymentParams {
  orderId?: string;
  paymentId?: string;
  signature?: string;
  rawPayload?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

export interface PaymentProvider {
  name: string;
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
}

/**
 * ManualPaymentProvider
 * Active in the temporary launch period.
 * Does not create automated online orders; instead flags requests for manual administrator review.
 */
export class ManualPaymentProvider implements PaymentProvider {
  name = "manual";

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    return {
      success: true,
      orderId: `manual_ord_${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
      isManual: true,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    if (!params.paymentId) {
      return { success: false, error: "Missing manual payment reference" };
    }
    return { success: true, paymentId: params.paymentId };
  }
}

/**
 * RazorpayPaymentProvider
 * Pre-engineered for seamless plug-in once PAN and KYC verification is finalized.
 */
export class RazorpayPaymentProvider implements PaymentProvider {
  name = "razorpay";

  private async getClient() {
    const { getRazorpayInstance } = await import("@/lib/razorpay");
    const instance = getRazorpayInstance();
    if (!instance) {
      throw new Error("Razorpay credentials are not configured in environment");
    }
    return instance;
  }

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    try {
      const razorpay = await this.getClient();
      const order = await razorpay.orders.create({
        amount: params.amount,
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes,
      });
      return {
        success: true,
        orderId: order.id,
        amount: order.amount as number,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      };
    } catch (err: any) {
      return { success: false, orderId: "", amount: params.amount, currency: params.currency, error: err.message };
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const { verifyRazorpayPaymentSignature } = await import("@/lib/razorpay");
    if (!params.orderId || !params.paymentId || !params.signature) {
      return { success: false, error: "Missing required Razorpay payment signature parameters" };
    }
    const isValid = verifyRazorpayPaymentSignature(params.orderId, params.paymentId, params.signature);
    if (!isValid) {
      return { success: false, error: "Invalid Razorpay cryptographic signature" };
    }
    return { success: true, paymentId: params.paymentId, orderId: params.orderId };
  }
}

/**
 * Factory resolving the active PaymentProvider.
 * Defaults to "manual" when automated checkout is disabled.
 */
export function getActivePaymentProvider(): PaymentProvider {
  const providerType = (process.env.PAYMENT_PROVIDER || "manual").toLowerCase();
  if (providerType === "razorpay") {
    return new RazorpayPaymentProvider();
  }
  return new ManualPaymentProvider();
}

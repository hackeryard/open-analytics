import mongoose, { Schema, Document } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  requestId?: mongoose.Types.ObjectId;
  planId: string;
  amount: number; // In main currency units, e.g. 1499
  currency: string;
  status: PaymentStatus;
  provider: "manual" | "razorpay" | "cashfree" | "payu" | string;
  providerPaymentId?: string;
  providerOrderId?: string;
  paidAt?: Date | null;
  recordedByAdminId?: mongoose.Types.ObjectId;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
      index: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionRequest",
      default: null,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true,
    },
    provider: {
      type: String,
      default: "manual",
      trim: true,
    },
    providerPaymentId: {
      type: String,
      default: "",
      trim: true,
    },
    providerOrderId: {
      type: String,
      default: "",
      trim: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    recordedByAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Payment as mongoose.Model<any>) ||
  mongoose.model("Payment", PaymentSchema);


import mongoose, { Schema, Document } from "mongoose";

export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: string;
  planTier: "free" | "pro" | "enterprise";
  billingCycle: "monthly" | "annual";
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentId?: mongoose.Types.ObjectId;
  paymentProvider: "manual" | "razorpay" | "cashfree" | "payu" | string;
  autoRenew: boolean;
  cancelledAt?: Date | null;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      trim: true,
    },
    planTier: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      required: true,
      default: "pro",
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      required: true,
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending",
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    paymentProvider: {
      type: String,
      default: "manual",
      trim: true,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find user's active subscriptions
SubscriptionSchema.index({ userId: 1, status: 1, endDate: -1 });

export default (mongoose.models.Subscription as mongoose.Model<any>) ||
  mongoose.model("Subscription", SubscriptionSchema);


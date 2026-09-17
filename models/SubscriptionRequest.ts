import mongoose, { Schema, Document } from "mongoose";

export type SubscriptionRequestStatus =
  | "requested"
  | "contacted"
  | "payment_pending"
  | "completed"
  | "rejected"
  | "cancelled";

export interface ISubscriptionRequest extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  tier: "pro" | "enterprise";
  billingInterval: "monthly" | "annual";
  price: number;
  currency: string;
  status: SubscriptionRequestStatus;
  message?: string;
  adminNotes?: string;
  subscriptionId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionRequestSchema = new Schema<ISubscriptionRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    planId: {
      type: String,
      required: true,
      trim: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    tier: {
      type: String,
      enum: ["pro", "enterprise"],
      required: true,
      default: "pro",
    },
    billingInterval: {
      type: String,
      enum: ["monthly", "annual"],
      required: true,
      default: "monthly",
    },
    price: {
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
      enum: [
        "requested",
        "contacted",
        "payment_pending",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "requested",
      index: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user's active requests
SubscriptionRequestSchema.index({ userId: 1, status: 1 });

export default (mongoose.models.SubscriptionRequest as mongoose.Model<any>) ||
  mongoose.model("SubscriptionRequest", SubscriptionRequestSchema);


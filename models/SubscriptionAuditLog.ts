import mongoose, { Schema, Document } from "mongoose";

export type AuditAction =
  | "request_created"
  | "request_updated"
  | "request_cancelled"
  | "request_rejected"
  | "payment_recorded"
  | "subscription_activated"
  | "subscription_cancelled"
  | "subscription_expired";

export interface ISubscriptionAuditLog extends Document {
  adminId?: mongoose.Types.ObjectId | null;
  adminEmail?: string;
  action: AuditAction;
  affectedUserId: mongoose.Types.ObjectId;
  affectedUserEmail: string;
  requestId?: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const SubscriptionAuditLogSchema = new Schema<ISubscriptionAuditLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    adminEmail: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    affectedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    affectedUserEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionRequest",
      default: null,
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
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default (mongoose.models.SubscriptionAuditLog as mongoose.Model<any>) ||
  mongoose.model("SubscriptionAuditLog", SubscriptionAuditLogSchema);


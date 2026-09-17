import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  planId: string;
  name: string;
  slug: string;
  tier: "free" | "pro" | "enterprise";
  description: string;
  price: number; // in INR
  currency: string;
  billingInterval: "monthly" | "annual";
  features: string[];
  maxProjects: number;
  monthlyEventsPerProject: number;
  maxMembersPerProject: number;
  retentionDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    tier: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      required: true,
      default: "pro",
    },
    description: {
      type: String,
      default: "",
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
    billingInterval: {
      type: String,
      enum: ["monthly", "annual"],
      required: true,
      default: "monthly",
    },
    features: {
      type: [String],
      default: [],
    },
    maxProjects: {
      type: Number,
      default: 1,
    },
    monthlyEventsPerProject: {
      type: Number,
      default: 10000,
    },
    maxMembersPerProject: {
      type: Number,
      default: 2,
    },
    retentionDays: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.SubscriptionPlan as mongoose.Model<any>) ||
  mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);


import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
      index: true,
    },
    authProviderId: {
      type: String,
      default: "",
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "editor", "member"],
      default: "admin",
      index: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
      index: true,
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    extraProjectsAllowed: {
      type: Number,
      default: 0,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trialing", "past_due", "canceled", "expired"],
      default: "active",
    },
    stripeCustomerId: {
      type: String,
      default: "",
    },
    stripeSubscriptionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ authProvider: 1, authProviderId: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
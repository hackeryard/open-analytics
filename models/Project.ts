import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
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
      lowercase: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    publishableKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
    allowedDomains: {
      type: [String],
      default: ["*"],
    },
    settings: {
      ipAnonymization: { type: Boolean, default: true },
      piiRedaction: { type: Boolean, default: true },
      seoTracking: { type: Boolean, default: true },
      aiTracking: { type: Boolean, default: true },
      dataRetentionDays: { type: Number, default: 365 },
      enabledModules: {
        type: [String],
        default: ["core", "rum", "behavioral", "errors", "virtual_labs", "seo", "ai_aeo"],
      },
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ ownerId: 1, createdAt: -1 });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
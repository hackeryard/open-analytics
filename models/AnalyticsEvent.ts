import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: "general",
      index: true,
    },
    labId: {
      type: String,
      default: null,
      index: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    pathname: {
      type: String,
      default: "",
    },
    properties: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    value: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

AnalyticsEventSchema.index({ projectId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ projectId: 1, eventName: 1, createdAt: -1 });
AnalyticsEventSchema.index({ projectId: 1, category: 1, createdAt: -1 });
AnalyticsEventSchema.index({ projectId: 1, labId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60, name: "retention_1yr_ttl" });

export default mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
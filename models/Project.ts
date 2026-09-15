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
          enum: ["admin", "editor", "member"],
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
    timezone: {
      type: String,
      default: "UTC",
    },
    currency: {
      type: String,
      default: "USD",
    },
    industryCategory: {
      type: String,
      default: "Technology",
    },
    businessSize: {
      type: String,
      default: "Medium",
    },
    websiteUrl: {
      type: String,
      default: "",
    },
    measurementId: {
      type: String,
      default: "",
    },
    monitoringStatus: {
      type: String,
      enum: ["pending_verification", "active", "paused"],
      default: "pending_verification",
    },
    verifiedAt: {
      type: Date,
      default: null,
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
    dataStreams: [
      {
        streamId: { type: String, required: true },
        streamType: { type: String, enum: ["web", "ios", "android"], default: "web" },
        streamName: { type: String, required: true },
        streamUrl: { type: String, default: "" },
        appId: { type: String, default: "" },
        measurementId: { type: String, default: "" },
        status: { type: String, enum: ["pending_verification", "active", "inactive"], default: "pending_verification" },
        active: { type: Boolean, default: false },
        lastPingAt: { type: Date, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    settings: {
      ipAnonymization: { type: Boolean, default: true },
      piiRedaction: { type: Boolean, default: true },
      seoTracking: { type: Boolean, default: true },
      aiTracking: { type: Boolean, default: true },
      enhancedMeasurement: {
        scrollTracking: { type: Boolean, default: true },
        outboundClicks: { type: Boolean, default: true },
        siteSearch: { type: Boolean, default: true },
        fileDownloads: { type: Boolean, default: true },
        videoEngagement: { type: Boolean, default: true },
        formInteractions: { type: Boolean, default: true },
      },
      dataRetentionDays: { type: Number, default: 365 },
      enabledModules: {
        type: [String],
        default: ["core", "rum", "behavioral", "errors", "virtual_labs", "seo", "ai_aeo"],
      },
      errorRules: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          matchField: {
            type: String,
            enum: ["message", "pathname", "errorType", "stack"],
            default: "message",
          },
          matchType: {
            type: String,
            enum: ["contains", "exact", "regex", "starts_with"],
            default: "contains",
          },
          pattern: { type: String, required: true },
          enabled: { type: Boolean, default: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      customEventRules: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          triggerType: {
            type: String,
            enum: ["click", "form_submit", "pageview", "scroll_depth", "file_download", "outbound_link"],
            default: "click",
          },
          selector: { type: String, default: "" },
          textMatch: { type: String, default: "" },
          textMatchType: {
            type: String,
            enum: ["contains", "exact", "starts_with"],
            default: "contains",
          },
          pathPattern: { type: String, default: "*" },
          pathMatchType: {
            type: String,
            enum: ["exact", "contains", "starts_with", "any"],
            default: "any",
          },
          value: { type: Number, default: 0 },
          properties: { type: mongoose.Schema.Types.Mixed, default: {} },
          enabled: { type: Boolean, default: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

ProjectSchema.index({ ownerId: 1, createdAt: -1 });

if (process.env.NODE_ENV === "development" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
import mongoose from "mongoose";

export interface INotification {
  _id?: string;
  projectId: string;
  userId?: string | null;
  title: string;
  message: string;
  type:
    | "error_repeated"
    | "error_storm"
    | "seo_unoptimized"
    | "aeo_unoptimized"
    | "geo_radar"
    | "web_vitals"
    | "rage_clicks"
    | "quota_warning"
    | "system";
  severity: "critical" | "warning" | "info";
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  readAt?: Date | null;
  dismissed: boolean;
  fingerprint: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "error_repeated",
        "error_storm",
        "seo_unoptimized",
        "aeo_unoptimized",
        "geo_radar",
        "web_vitals",
        "rage_clicks",
        "quota_warning",
        "system",
      ],
      default: "system",
      index: true,
    },
    severity: {
      type: String,
      enum: ["critical", "warning", "info"],
      default: "info",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actionUrl: {
      type: String,
      default: "",
    },
    actionLabel: {
      type: String,
      default: "View Details",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    dismissed: {
      type: Boolean,
      default: false,
      index: true,
    },
    fingerprint: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ projectId: 1, dismissed: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ projectId: 1, fingerprint: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60, name: "notification_1yr_ttl" });

if (process.env.NODE_ENV === "development" && mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

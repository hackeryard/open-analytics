import mongoose from "mongoose";

const ErrorLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    stack: {
      type: String,
      default: "",
    },
    digest: {
      type: String,
      default: null,
      index: true,
    },
    componentStack: {
      type: String,
      default: null,
    },
    errorType: {
      type: String,
      enum: [
        "runtime",
        "unhandledrejection",
        "boundary",
        "network",
        "api",
        "resource",
        "webgl",
        "console",
        "hydration",
        "not_found",
        "http_4xx",
        "http_5xx",
        "csp",
      ],
      default: "runtime",
      index: true,
    },
    pathname: {
      type: String,
      required: true,
      index: true,
    },
    visitorId: {
      type: String,
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    device: {
      type: String,
      default: "desktop",
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    userAgent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["new", "investigating", "resolved", "ignored"],
      default: "new",
      index: true,
    },
    occurrences: {
      type: Number,
      default: 1,
    },
    firstOccurredAt: {
      type: Date,
      default: Date.now,
    },
    lastOccurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

ErrorLogSchema.index({ projectId: 1, lastOccurredAt: -1 });
ErrorLogSchema.index({ projectId: 1, status: 1, lastOccurredAt: -1 });
ErrorLogSchema.index({ projectId: 1, message: 1, pathname: 1 });
ErrorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60, name: "retention_1yr_ttl" });

if (process.env.NODE_ENV === "development" && mongoose.models.ErrorLog) {
  delete mongoose.models.ErrorLog;
}

export default mongoose.models.ErrorLog || mongoose.model("ErrorLog", ErrorLogSchema);
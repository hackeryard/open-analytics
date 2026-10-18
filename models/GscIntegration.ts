import mongoose, { Schema } from "mongoose";

export interface IGscQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface IGscPageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface IGscDeviceRow {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface IGscCountryRow {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface IGscHistoryRow {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface IGscIntegration {
  projectId: string;
  siteUrl: string;
  connectedBy?: mongoose.Types.ObjectId | null;
  authMethod: "oauth" | "service_account" | "manual_api";
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date | null;
  status: "connected" | "disconnected" | "token_expired" | "error";
  lastSyncAt?: Date | null;
  lastError?: string | null;
  metrics: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    dateRangeLabel: string;
  };
  topQueries: IGscQueryRow[];
  topPages: IGscPageRow[];
  devices: IGscDeviceRow[];
  countries: IGscCountryRow[];
  history: IGscHistoryRow[];
  createdAt: Date;
  updatedAt: Date;
}

const GscIntegrationSchema = new Schema<IGscIntegration>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    siteUrl: {
      type: String,
      default: "",
      trim: true,
    },
    connectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authMethod: {
      type: String,
      enum: ["oauth", "service_account", "manual_api"],
      default: "oauth",
    },
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["connected", "disconnected", "token_expired", "error"],
      default: "disconnected",
    },
    lastSyncAt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
    metrics: {
      clicks: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      position: { type: Number, default: 0 },
      dateRangeLabel: { type: String, default: "Past 28 Days" },
    },
    topQueries: [
      {
        query: { type: String, required: true },
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 },
        position: { type: Number, default: 0 },
      },
    ],
    topPages: [
      {
        page: { type: String, required: true },
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 },
        position: { type: Number, default: 0 },
      },
    ],
    devices: [
      {
        device: { type: String, required: true },
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 },
        position: { type: Number, default: 0 },
      },
    ],
    countries: [
      {
        country: { type: String, required: true },
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 },
        position: { type: Number, default: 0 },
      },
    ],
    history: [
      {
        date: { type: String, required: true },
        clicks: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        ctr: { type: Number, default: 0 },
        position: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

GscIntegrationSchema.index({ projectId: 1, status: 1 });

if (process.env.NODE_ENV === "development" && mongoose.models.GscIntegration) {
  delete mongoose.models.GscIntegration;
}

export default mongoose.models.GscIntegration ||
  mongoose.model<IGscIntegration>("GscIntegration", GscIntegrationSchema);

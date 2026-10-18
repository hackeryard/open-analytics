import mongoose, { Schema } from "mongoose";

export interface IStrategyActionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface IStrategyEvidence {
  metric: string;
  currentValue: string | number;
  targetValue: string | number;
  source: "gsc" | "rum_vitals" | "behavioral_ux" | "geo_radar" | "error_tracking" | "cross_synthesis";
  affectedUrls?: string[];
  affectedSegments?: string[];
}

export interface IGrowthStrategy {
  projectId: string;
  strategyId: string;
  title: string;
  slug: string;
  category: "seo_search" | "cro_ux" | "web_vitals" | "technical_errors" | "geo_expansion";
  priority: "critical" | "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  isQuickWin: boolean;
  score: number;
  headline: string;
  problem: string;
  expectedOutcome: string;
  telemetryEvidence: IStrategyEvidence[];
  actionSteps: IStrategyActionStep[];
  status: "recommended" | "in_progress" | "implemented" | "dismissed";
  notes?: string;
  statusUpdatedAt?: Date;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GrowthStrategySchema = new Schema<IGrowthStrategy>(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    strategyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["seo_search", "cro_ux", "web_vitals", "technical_errors", "geo_expansion"],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
      index: true,
    },
    impact: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    effort: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isQuickWin: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 75,
    },
    headline: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    expectedOutcome: {
      type: String,
      required: true,
    },
    telemetryEvidence: [
      {
        metric: { type: String, required: true },
        currentValue: { type: Schema.Types.Mixed, required: true },
        targetValue: { type: Schema.Types.Mixed, required: true },
        source: {
          type: String,
          enum: ["gsc", "rum_vitals", "behavioral_ux", "geo_radar", "error_tracking", "cross_synthesis"],
          default: "cross_synthesis",
        },
        affectedUrls: { type: [String], default: [] },
        affectedSegments: { type: [String], default: [] },
      },
    ],
    actionSteps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        instruction: { type: String, required: true },
        codeSnippet: { type: String, default: "" },
        codeLanguage: { type: String, default: "html" },
      },
    ],
    status: {
      type: String,
      enum: ["recommended", "in_progress", "implemented", "dismissed"],
      default: "recommended",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

GrowthStrategySchema.index({ projectId: 1, category: 1, status: 1 });
GrowthStrategySchema.index({ projectId: 1, priority: 1, isQuickWin: 1 });

if (process.env.NODE_ENV === "development" && mongoose.models.GrowthStrategy) {
  delete mongoose.models.GrowthStrategy;
}

export default mongoose.models.GrowthStrategy ||
  mongoose.model<IGrowthStrategy>("GrowthStrategy", GrowthStrategySchema);

import mongoose from "mongoose";

const PageViewSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    pathname: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
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
    referrer: {
      type: String,
      default: "",
    },
    referrerDomain: {
      type: String,
      default: "Direct",
      index: true,
    },
    // SEO & Search Engine Attribution
    searchEngine: {
      type: String,
      default: null,
      index: true,
    },
    // AEO & AI Referral Attribution
    aiReferrer: {
      type: String,
      default: null,
      index: true,
    },
    // Bot & Crawler Detection (SEO & AEO)
    visitorType: {
      type: String,
      enum: ["human", "search_bot", "ai_crawler"],
      default: "human",
      index: true,
    },
    botCategory: {
      type: String,
      default: "none",
      index: true,
    },
    botName: {
      type: String,
      default: "",
    },
    // AEO Citation Readiness Flag
    structuredDataDetected: {
      type: Boolean,
      default: false,
    },
    utmSource: {
      type: String,
      default: null,
      index: true,
    },
    utmMedium: {
      type: String,
      default: null,
    },
    utmCampaign: {
      type: String,
      default: null,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "desktop",
      index: true,
    },
    browser: {
      type: String,
      default: "Unknown",
      index: true,
    },
    os: {
      type: String,
      default: "Unknown",
      index: true,
    },
    screen: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "en",
    },
    timezone: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "Unknown",
      index: true,
    },
    region: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    ip: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
    idleDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
    focusCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    scrollDepth: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    scrollMilestones: {
      type: [Number],
      default: [],
    },
    webVitals: {
      fcp: { type: Number, default: null },
      lcp: { type: Number, default: null },
      cls: { type: Number, default: null },
      inp: { type: Number, default: null },
      ttfb: { type: Number, default: null },
      domLoad: { type: Number, default: null },
      windowLoad: { type: Number, default: null },
    },
    hardware: {
      memory: { type: Number, default: null },
      cores: { type: Number, default: null },
      gpu: { type: String, default: "" },
      dpr: { type: Number, default: 1 },
      viewport: { type: String, default: "" },
      touchPoints: { type: Number, default: 0 },
    },
    network: {
      effectiveType: { type: String, default: "" },
      rawEffectiveType: { type: String, default: "" },
      type: { type: String, default: "" },
      downlink: { type: Number, default: null },
      rtt: { type: Number, default: null },
      saveData: { type: Boolean, default: false },
      is5G: { type: Boolean, default: false },
    },
    isBounce: {
      type: Boolean,
      default: false,
      index: true,
    },
    exitIntent: {
      type: Boolean,
      default: false,
    },
    isReturning: {
      type: Boolean,
      default: false,
      index: true,
    },
    visitCount: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

PageViewSchema.index({ projectId: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, visitorType: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, botCategory: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, searchEngine: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, aiReferrer: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, pathname: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, sessionId: 1, createdAt: -1 });
PageViewSchema.index({ projectId: 1, visitorId: 1, createdAt: -1 });
PageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60, name: "retention_1yr_ttl" });

export default mongoose.models.PageView || mongoose.model("PageView", PageViewSchema);
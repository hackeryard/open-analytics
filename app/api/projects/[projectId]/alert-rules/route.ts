import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Notification from "@/models/Notification";
import { verifyProjectAccess, verifyProjectEdit } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const project = auth.project || (await (Project as any).findOne({ projectId: params.projectId }).lean());
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const defaultAlertSettings = {
      errorRepeatThreshold: 5,
      errorStormThreshold: 10,
      errorRepeatedAlerts: true,
      errorStormAlerts: true,
      seoOptimizationAlerts: true,
      aeoOptimizationAlerts: true,
      geoRadarAlerts: true,
      webVitalsAlerts: true,
      rageClicksAlerts: true,
      ignoredTypes: [],
      ignoredRules: [],
    };

    const alertSettings = {
      ...defaultAlertSettings,
      ...((project as any).settings?.alertSettings || {}),
    };

    return NextResponse.json({ success: true, alertSettings });
  } catch (err: any) {
    console.error("Alert settings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch alert settings", details: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const body = await req.json();
    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.settings) {
      project.settings = {} as any;
    }
    if (!project.settings.alertSettings) {
      project.settings.alertSettings = {
        errorRepeatThreshold: 5,
        errorStormThreshold: 10,
        errorRepeatedAlerts: true,
        errorStormAlerts: true,
        seoOptimizationAlerts: true,
        aeoOptimizationAlerts: true,
        geoRadarAlerts: true,
        webVitalsAlerts: true,
        rageClicksAlerts: true,
        ignoredTypes: [],
        ignoredRules: [],
      };
    }

    const currentAlerts = project.settings.alertSettings;
    const action = body.action;

    // Action 1: Ignore general notification type
    if (action === "ignore_type") {
      const typeToIgnore = String(body.type || "").trim();
      if (!typeToIgnore) {
        return NextResponse.json({ error: "Notification type is required" }, { status: 400 });
      }

      const existingTypes: string[] = Array.isArray(currentAlerts.ignoredTypes) ? currentAlerts.ignoredTypes : [];
      if (!existingTypes.includes(typeToIgnore)) {
        existingTypes.push(typeToIgnore);
        currentAlerts.ignoredTypes = existingTypes;
      }

      // Also set corresponding boolean if matching
      if (typeToIgnore === "error_repeated") currentAlerts.errorRepeatedAlerts = false;
      if (typeToIgnore === "error_storm") currentAlerts.errorStormAlerts = false;
      if (typeToIgnore === "seo_unoptimized") currentAlerts.seoOptimizationAlerts = false;
      if (typeToIgnore === "aeo_unoptimized") currentAlerts.aeoOptimizationAlerts = false;
      if (typeToIgnore === "geo_radar") currentAlerts.geoRadarAlerts = false;
      if (typeToIgnore === "web_vitals") currentAlerts.webVitalsAlerts = false;
      if (typeToIgnore === "rage_clicks") currentAlerts.rageClicksAlerts = false;

      // Optionally purge existing unread notifications of this type
      if (body.purgeExisting !== false) {
        await (Notification as any).deleteMany({ projectId: params.projectId, type: typeToIgnore, read: false });
      }

      project.markModified("settings");
      await project.save();

      return NextResponse.json({
        success: true,
        message: `Notification type "${typeToIgnore}" is now ignored.`,
        alertSettings: currentAlerts,
      });
    }

    // Action 2: Unignore general notification type
    if (action === "unignore_type") {
      const typeToRestore = String(body.type || "").trim();
      const existingTypes: string[] = Array.isArray(currentAlerts.ignoredTypes) ? currentAlerts.ignoredTypes : [];
      currentAlerts.ignoredTypes = existingTypes.filter((t: string) => t !== typeToRestore);

      if (typeToRestore === "error_repeated") currentAlerts.errorRepeatedAlerts = true;
      if (typeToRestore === "error_storm") currentAlerts.errorStormAlerts = true;
      if (typeToRestore === "seo_unoptimized") currentAlerts.seoOptimizationAlerts = true;
      if (typeToRestore === "aeo_unoptimized") currentAlerts.aeoOptimizationAlerts = true;
      if (typeToRestore === "geo_radar") currentAlerts.geoRadarAlerts = true;
      if (typeToRestore === "web_vitals") currentAlerts.webVitalsAlerts = true;
      if (typeToRestore === "rage_clicks") currentAlerts.rageClicksAlerts = true;

      project.markModified("settings");
      await project.save();

      return NextResponse.json({
        success: true,
        message: `Notification type "${typeToRestore}" has been re-enabled.`,
        alertSettings: currentAlerts,
      });
    }

    // Action 3: Add specific ignore rule
    if (action === "add_rule") {
      const { pattern, matchField, matchType, type, name } = body;
      if (!pattern || !String(pattern).trim()) {
        return NextResponse.json({ error: "Rule pattern is required" }, { status: 400 });
      }

      const newRule = {
        id: "ign_" + crypto.randomBytes(6).toString("hex"),
        name: (name && String(name).trim()) || `Ignore ${matchField || "pathname"}: ${String(pattern).slice(0, 30)}`,
        type: type || "all",
        matchField: ["pathname", "message", "title", "fingerprint", "type"].includes(matchField)
          ? matchField
          : "pathname",
        matchType: ["contains", "exact", "starts_with", "regex"].includes(matchType)
          ? matchType
          : "contains",
        pattern: String(pattern).trim(),
        enabled: true,
        createdAt: new Date(),
      };

      if (!Array.isArray(currentAlerts.ignoredRules)) {
        currentAlerts.ignoredRules = [];
      }
      currentAlerts.ignoredRules.unshift(newRule);

      // Purge matching unread notifications
      if (body.purgeExisting !== false) {
        if (newRule.matchField === "pathname") {
          await (Notification as any).deleteMany({
            projectId: params.projectId,
            "metadata.pathname": { $regex: newRule.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
            read: false,
          });
        }
      }

      project.markModified("settings");
      await project.save();

      return NextResponse.json({
        success: true,
        message: "Ignore rule created successfully.",
        rule: newRule,
        alertSettings: currentAlerts,
      });
    }

    // Action 4: Delete specific ignore rule
    if (action === "delete_rule") {
      const ruleId = String(body.ruleId || "");
      if (!ruleId) {
        return NextResponse.json({ error: "ruleId is required" }, { status: 400 });
      }

      const existingRules = Array.isArray(currentAlerts.ignoredRules) ? currentAlerts.ignoredRules : [];
      currentAlerts.ignoredRules = existingRules.filter((r: any) => r.id !== ruleId);

      project.markModified("settings");
      await project.save();

      return NextResponse.json({
        success: true,
        message: "Ignore rule deleted.",
        alertSettings: currentAlerts,
      });
    }

    // Action 5: Toggle rule enabled state
    if (action === "toggle_rule") {
      const ruleId = String(body.ruleId || "");
      const enabled = Boolean(body.enabled);
      const existingRules = Array.isArray(currentAlerts.ignoredRules) ? currentAlerts.ignoredRules : [];
      const targetRule = existingRules.find((r: any) => r.id === ruleId);
      if (targetRule) {
        targetRule.enabled = enabled;
      }

      project.markModified("settings");
      await project.save();

      return NextResponse.json({
        success: true,
        alertSettings: currentAlerts,
      });
    }

    // Standard save: update thresholds, toggles, ignoredTypes, and ignoredRules
    const {
      errorRepeatThreshold,
      errorStormThreshold,
      errorRepeatedAlerts,
      errorStormAlerts,
      seoOptimizationAlerts,
      aeoOptimizationAlerts,
      geoRadarAlerts,
      webVitalsAlerts,
      rageClicksAlerts,
      ignoredTypes,
      ignoredRules,
    } = body;

    project.settings.alertSettings = {
      errorRepeatThreshold: Math.max(1, Number(errorRepeatThreshold) || 5),
      errorStormThreshold: Math.max(2, Number(errorStormThreshold) || 10),
      errorRepeatedAlerts: errorRepeatedAlerts !== false,
      errorStormAlerts: errorStormAlerts !== false,
      seoOptimizationAlerts: seoOptimizationAlerts !== false,
      aeoOptimizationAlerts: aeoOptimizationAlerts !== false,
      geoRadarAlerts: geoRadarAlerts !== false,
      webVitalsAlerts: webVitalsAlerts !== false,
      rageClicksAlerts: rageClicksAlerts !== false,
      ignoredTypes: Array.isArray(ignoredTypes) ? ignoredTypes : (currentAlerts.ignoredTypes || []),
      ignoredRules: Array.isArray(ignoredRules) ? ignoredRules : (currentAlerts.ignoredRules || []),
    };

    project.markModified("settings");
    await project.save();

    return NextResponse.json({
      success: true,
      message: "Alert settings updated successfully.",
      alertSettings: project.settings.alertSettings,
    });
  } catch (err: any) {
    console.error("Alert settings POST error:", err);
    return NextResponse.json({ error: "Failed to update alert settings", details: err.message }, { status: 500 });
  }
}

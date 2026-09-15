import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyProjectAccess, verifyProjectEdit } from "@/lib/auth";
import crypto from "crypto";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok || !auth.project) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: auth.status || 403 });
    }

    const eventRules = Array.isArray(auth.project.settings?.customEventRules)
      ? auth.project.settings.customEventRules
      : [];

    return NextResponse.json({ ok: true, eventRules });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok || !auth.project) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: auth.status || 403 });
    }

    if (auth.project.plan !== "pro" && auth.project.plan !== "enterprise") {
      return NextResponse.json(
        { error: "Custom event rules and conversion automation require an active Pro subscription." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      triggerType,
      selector,
      textMatch,
      textMatchType,
      pathPattern,
      pathMatchType,
      value,
      properties,
      enabled,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 });
    }

    const validTriggers = ["click", "form_submit", "pageview", "scroll_depth", "file_download", "outbound_link"];
    const trigger = validTriggers.includes(triggerType) ? triggerType : "click";

    const newRule = {
      id: "evrule_" + crypto.randomBytes(6).toString("hex"),
      name: name.trim().toLowerCase().replace(/\s+/g, "_"),
      triggerType: trigger,
      selector: selector ? String(selector).trim() : "",
      textMatch: textMatch ? String(textMatch).trim() : "",
      textMatchType: ["contains", "exact", "starts_with"].includes(textMatchType) ? textMatchType : "contains",
      pathPattern: pathPattern ? String(pathPattern).trim() : "*",
      pathMatchType: ["exact", "contains", "starts_with", "any"].includes(pathMatchType) ? pathMatchType : "any",
      value: typeof value === "number" && !isNaN(value) ? value : 0,
      properties: properties && typeof properties === "object" ? properties : {},
      enabled: enabled !== undefined ? Boolean(enabled) : true,
      createdAt: new Date(),
    };

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.settings) {
      project.settings = {};
    }
    if (!Array.isArray(project.settings.customEventRules)) {
      project.settings.customEventRules = [];
    }

    project.settings.customEventRules.unshift(newRule);
    project.markModified("settings");
    await project.save();
    await (Project as any).updateOne(
      { projectId: params.projectId },
      { $set: { "settings.customEventRules": project.settings.customEventRules } }
    );

    return NextResponse.json({
      ok: true,
      rule: newRule,
      eventRules: project.settings.customEventRules,
      message: `No-code event rule '${newRule.name}' created successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok || !auth.project) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: auth.status || 403 });
    }

    if (auth.project.plan !== "pro" && auth.project.plan !== "enterprise") {
      return NextResponse.json(
        { error: "Custom event rules and conversion automation require an active Pro subscription." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      ruleId,
      enabled,
      name,
      triggerType,
      selector,
      textMatch,
      textMatchType,
      pathPattern,
      pathMatchType,
      value,
      properties,
    } = body;

    if (!ruleId) {
      return NextResponse.json({ error: "ruleId is required" }, { status: 400 });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.settings || !Array.isArray(project.settings.customEventRules)) {
      return NextResponse.json({ error: "No event rules found" }, { status: 404 });
    }

    const ruleIndex = project.settings.customEventRules.findIndex((r: any) => r.id === ruleId);
    if (ruleIndex === -1) {
      return NextResponse.json({ error: "Event rule not found" }, { status: 404 });
    }

    const currentRule = project.settings.customEventRules[ruleIndex];
    if (enabled !== undefined) currentRule.enabled = Boolean(enabled);
    if (name !== undefined && String(name).trim()) currentRule.name = String(name).trim().toLowerCase().replace(/\s+/g, "_");
    if (triggerType !== undefined && ["click", "form_submit", "pageview", "scroll_depth", "file_download", "outbound_link"].includes(triggerType)) {
      currentRule.triggerType = triggerType;
    }
    if (selector !== undefined) currentRule.selector = String(selector).trim();
    if (textMatch !== undefined) currentRule.textMatch = String(textMatch).trim();
    if (textMatchType !== undefined && ["contains", "exact", "starts_with"].includes(textMatchType)) {
      currentRule.textMatchType = textMatchType;
    }
    if (pathPattern !== undefined) currentRule.pathPattern = String(pathPattern).trim();
    if (pathMatchType !== undefined && ["exact", "contains", "starts_with", "any"].includes(pathMatchType)) {
      currentRule.pathMatchType = pathMatchType;
    }
    if (value !== undefined) currentRule.value = typeof value === "number" && !isNaN(value) ? value : 0;
    if (properties !== undefined && typeof properties === "object") currentRule.properties = properties;

    project.settings.customEventRules[ruleIndex] = currentRule;
    project.markModified("settings");
    await project.save();
    await (Project as any).updateOne(
      { projectId: params.projectId },
      { $set: { "settings.customEventRules": project.settings.customEventRules } }
    );

    return NextResponse.json({
      ok: true,
      rule: currentRule,
      eventRules: project.settings.customEventRules,
      message: `Event rule '${currentRule.name}' updated successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectEdit(req, params.projectId);
    if (!auth.ok || !auth.project) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: auth.status || 403 });
    }

    if (auth.project.plan !== "pro" && auth.project.plan !== "enterprise") {
      return NextResponse.json(
        { error: "Custom event rules and conversion automation require an active Pro subscription." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    let ruleId = searchParams.get("ruleId");
    if (!ruleId) {
      try {
        const body = await req.json();
        ruleId = body.ruleId;
      } catch {}
    }

    if (!ruleId) {
      return NextResponse.json({ error: "ruleId is required" }, { status: 400 });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.settings || !Array.isArray(project.settings.customEventRules)) {
      return NextResponse.json({ error: "No event rules found" }, { status: 404 });
    }

    const beforeCount = project.settings.customEventRules.length;
    project.settings.customEventRules = project.settings.customEventRules.filter((r: any) => r.id !== ruleId);

    if (project.settings.customEventRules.length === beforeCount) {
      return NextResponse.json({ error: "Event rule not found" }, { status: 404 });
    }

    project.markModified("settings");
    await project.save();
    await (Project as any).updateOne(
      { projectId: params.projectId },
      { $set: { "settings.customEventRules": project.settings.customEventRules } }
    );

    return NextResponse.json({
      ok: true,
      eventRules: project.settings.customEventRules,
      message: "No-code event rule deleted successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

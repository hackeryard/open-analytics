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

    const errorRules = Array.isArray(auth.project.settings?.errorRules)
      ? auth.project.settings.errorRules
      : [];

    return NextResponse.json({ ok: true, errorRules });
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

    const body = await req.json();
    const { name, matchField, matchType, pattern, enabled } = body;

    if (!pattern || typeof pattern !== "string" || !pattern.trim()) {
      return NextResponse.json({ error: "Rule pattern is required" }, { status: 400 });
    }

    const newRule = {
      id: "rule_" + crypto.randomBytes(6).toString("hex"),
      name: (name && String(name).trim()) || `Ignore ${matchField || "message"}: ${pattern.slice(0, 30)}`,
      matchField: ["message", "pathname", "errorType", "stack"].includes(matchField) ? matchField : "message",
      matchType: ["contains", "exact", "regex", "starts_with"].includes(matchType) ? matchType : "contains",
      pattern: pattern.trim(),
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
    if (!Array.isArray(project.settings.errorRules)) {
      project.settings.errorRules = [];
    }

    project.settings.errorRules.unshift(newRule);
    project.markModified("settings");
    await project.save();
    await (Project as any).updateOne(
      { projectId: params.projectId },
      { $set: { "settings.errorRules": project.settings.errorRules } }
    );

    return NextResponse.json({
      ok: true,
      rule: newRule,
      errorRules: project.settings.errorRules,
      message: "Error filter rule created successfully.",
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

    const body = await req.json();
    const { ruleId, enabled, name, matchField, matchType, pattern } = body;

    if (!ruleId) {
      return NextResponse.json({ error: "ruleId is required" }, { status: 400 });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.settings || !Array.isArray(project.settings.errorRules)) {
      return NextResponse.json({ error: "No rules found" }, { status: 404 });
    }

    const ruleIndex = project.settings.errorRules.findIndex((r: any) => r.id === ruleId);
    if (ruleIndex === -1) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    const currentRule = project.settings.errorRules[ruleIndex];
    if (enabled !== undefined) currentRule.enabled = Boolean(enabled);
    if (name !== undefined) currentRule.name = String(name).trim();
    if (matchField !== undefined && ["message", "pathname", "errorType", "stack"].includes(matchField)) {
      currentRule.matchField = matchField;
    }
    if (matchType !== undefined && ["contains", "exact", "regex", "starts_with"].includes(matchType)) {
      currentRule.matchType = matchType;
    }
    if (pattern !== undefined && String(pattern).trim()) {
      currentRule.pattern = String(pattern).trim();
    }

    project.settings.errorRules[ruleIndex] = currentRule;
    project.markModified("settings");
    await project.save();
    await (Project as any).updateOne(
      { projectId: params.projectId },
      { $set: { "settings.errorRules": project.settings.errorRules } }
    );

    return NextResponse.json({
      ok: true,
      rule: currentRule,
      errorRules: project.settings.errorRules,
      message: `Rule '${currentRule.name}' updated successfully.`,
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

    if (!project.settings || !Array.isArray(project.settings.errorRules)) {
      return NextResponse.json({ error: "No rules found" }, { status: 404 });
    }

    const beforeCount = project.settings.errorRules.length;
    project.settings.errorRules = project.settings.errorRules.filter((r: any) => r.id !== ruleId);

    if (project.settings.errorRules.length === beforeCount) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    project.markModified("settings");
    await project.save();
    await (Project as any).updateOne(
      { projectId: params.projectId },
      { $set: { "settings.errorRules": project.settings.errorRules } }
    );

    return NextResponse.json({
      ok: true,
      errorRules: project.settings.errorRules,
      message: "Rule deleted successfully. Error tracking resumed.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

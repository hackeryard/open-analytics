import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyProjectAccess, verifyProjectEdit } from "@/lib/auth";

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
      seoOptimizationAlerts: true,
      webVitalsAlerts: true,
      rageClicksAlerts: true,
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
    const {
      errorRepeatThreshold,
      errorStormThreshold,
      seoOptimizationAlerts,
      webVitalsAlerts,
      rageClicksAlerts,
    } = body;

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.settings) {
      project.settings = {} as any;
    }

    project.settings.alertSettings = {
      errorRepeatThreshold: Math.max(1, Number(errorRepeatThreshold) || 5),
      errorStormThreshold: Math.max(2, Number(errorStormThreshold) || 10),
      seoOptimizationAlerts: seoOptimizationAlerts !== false,
      webVitalsAlerts: webVitalsAlerts !== false,
      rageClicksAlerts: rageClicksAlerts !== false,
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

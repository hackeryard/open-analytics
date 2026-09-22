import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth";
import { isPlanActive } from "@/lib/planLimits";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/active-project
 * Allows a user whose plan expired (or Free user with multiple projects) to choose
 * which 1 project stays active for live telemetry ingestion.
 * 
 * STRICT RULE: Once chosen, the active project is LOCKED until the user upgrades to Pro/Enterprise.
 * They cannot switch projects back and forth to bypass limits on the Free plan.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId } = body;

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const dbUser = await (User as any).findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user owns the requested project
    const targetProject = await (Project as any).findOne({
      projectId,
      ownerId: user._id,
    });

    if (!targetProject) {
      return NextResponse.json(
        { error: "Project not found or you are not the owner of this project." },
        { status: 404 }
      );
    }

    const isProOrEnterpriseActive =
      isPlanActive(dbUser) &&
      (dbUser.plan === "pro" || dbUser.plan === "enterprise");

    // If already locked on a project and NOT an active paid subscriber, prevent switching
    if (
      !isProOrEnterpriseActive &&
      dbUser.role !== "super_admin" &&
      dbUser.lockedActiveProjectId &&
      dbUser.lockedActiveProjectId !== projectId
    ) {
      return NextResponse.json(
        {
          error:
            "Your 1 active tracking website is already locked on the Free tier. You cannot switch tracking websites until you upgrade to Cloud Pro.",
          code: "ACTIVE_PROJECT_LOCKED",
          lockedActiveProjectId: dbUser.lockedActiveProjectId,
        },
        { status: 403 }
      );
    }

    // Lock this project as the 1 active website
    dbUser.lockedActiveProjectId = projectId;
    dbUser.activeProjectSelectedAt = new Date();
    await dbUser.save();

    // Mark the selected project as active
    await (Project as any).updateOne(
      { projectId },
      { $set: { monitoringStatus: "active" } }
    );

    // If user is on Free/Expired plan, pause all other owned projects
    if (!isProOrEnterpriseActive && dbUser.role !== "super_admin") {
      await (Project as any).updateMany(
        { ownerId: user._id, projectId: { $ne: projectId } },
        { $set: { monitoringStatus: "paused" } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Project '${targetProject.name}' is now your designated active tracking website.`,
      lockedActiveProjectId: projectId,
    });
  } catch (err: any) {
    console.error("Set active project error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

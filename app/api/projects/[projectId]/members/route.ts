import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { verifyProjectAccess, verifyProjectManage, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectAccess(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId }).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Populate owner
    let owner = null;
    if (project.ownerId) {
      owner = await (User as any).findById(project.ownerId).select("name email role avatar").lean();
    }

    // Populate members
    const memberIds = (project.members || []).map((m: any) => m.userId);
    const users = await (User as any).find({ _id: { $in: memberIds } }).select("name email role avatar").lean();
    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    const populatedMembers = (project.members || [])
      .filter((m: any) => {
        // Exclude the owner from the standard members array so they are cleanly separated
        return !project.ownerId || m.userId?.toString() !== project.ownerId.toString();
      })
      .map((m: any) => {
        const u: any = userMap.get(m.userId?.toString());
        return {
          userId: m.userId?.toString(),
          name: u?.name || "Invited User",
          email: u?.email || "",
          avatar: u?.avatar || "",
          role: m.role || "member",
        };
      });

    const userIdStr = auth.user._id.toString();
    const isCurrentUserOwner =
      auth.user.role === "super_admin" ||
      (project.ownerId && project.ownerId.toString() === userIdStr);

    return NextResponse.json({
      owner: owner
        ? {
            userId: owner._id.toString(),
            name: owner.name,
            email: owner.email,
            avatar: owner.avatar,
            role: "owner",
          }
        : null,
      members: populatedMembers,
      isCurrentUserOwner,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { email, role = "member", name } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let targetUser = await (User as any).findOne({ email: normalizedEmail });

    // If user doesn't exist yet, create an invited user account with temporary password
    if (!targetUser) {
      const defaultPassword = await hashPassword("OpenAnalyticsWelcome2026!");
      targetUser = await (User as any).create({
        name: name?.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        passwordHash: defaultPassword,
        role: "member",
      });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const targetUserIdStr = targetUser._id.toString();

    // Check if target is already owner
    if (project.ownerId && project.ownerId.toString() === targetUserIdStr) {
      return NextResponse.json({ error: "This user is already the workspace owner" }, { status: 400 });
    }

    // Check if target is already a member
    const existingIndex = (project.members || []).findIndex(
      (m: any) => (m.userId?.toString() || m.userId) === targetUserIdStr
    );

    // If adding a new member (not updating an existing member), enforce plan member limit
    if (existingIndex < 0 && auth.user.role !== "super_admin") {
      const ownerUser = project.ownerId ? await (User as any).findById(project.ownerId).lean() : null;
      const { getUserEffectivePlan, PLAN_LIMITS } = await import("@/lib/planLimits");
      const effectivePlan = getUserEffectivePlan(ownerUser);
      const limitConfig = PLAN_LIMITS[effectivePlan];
      const currentMemberCount = (project.members || []).filter(
        (m: any) => !project.ownerId || m.userId?.toString() !== project.ownerId.toString()
      ).length;

      if (currentMemberCount >= limitConfig.maxMembersPerProject) {
        return NextResponse.json(
          {
            error: `Team member limit reached (${limitConfig.maxMembersPerProject} members on ${limitConfig.name}). Upgrade the project owner's subscription to invite more collaborators.`,
            code: "MEMBER_LIMIT_REACHED",
            limit: limitConfig.maxMembersPerProject,
            currentCount: currentMemberCount,
          },
          { status: 403 }
        );
      }
    }

    const validRole = ["admin", "editor", "member"].includes(role) ? role : "member";

    if (existingIndex >= 0) {
      // Update role
      project.members[existingIndex].role = validRole;
    } else {
      // Add member
      if (!Array.isArray(project.members)) project.members = [];
      project.members.push({
        userId: targetUser._id,
        role: validRole,
      });
    }

    await project.save();

    return NextResponse.json({
      success: true,
      member: {
        userId: targetUser._id.toString(),
        name: targetUser.name,
        email: targetUser.email,
        role: validRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { userId, role } = await req.json();
    if (!userId || !["admin", "editor", "member"].includes(role)) {
      return NextResponse.json({ error: "Invalid userId or role" }, { status: 400 });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Prevent changing the role of the owner here (owner transfer must use transfer-ownership)
    if (project.ownerId && project.ownerId.toString() === userId) {
      return NextResponse.json(
        { error: "Cannot change the workspace owner's role directly. Please use Transfer Ownership." },
        { status: 400 }
      );
    }

    const member = (project.members || []).find((m: any) => (m.userId?.toString() || m.userId) === userId);
    if (!member) {
      return NextResponse.json({ error: "Member not found in this project" }, { status: 404 });
    }

    member.role = role;
    await project.save();

    return NextResponse.json({ success: true, userId, role });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId query parameter required" }, { status: 400 });
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId && project.ownerId.toString() === userId) {
      return NextResponse.json(
        { error: "Cannot remove the workspace owner from the project. Please transfer ownership first." },
        { status: 400 }
      );
    }

    project.members = (project.members || []).filter((m: any) => (m.userId?.toString() || m.userId) !== userId);
    await project.save();

    return NextResponse.json({ success: true, removedUserId: userId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

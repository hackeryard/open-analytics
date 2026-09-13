import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { verifyProjectOwner } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectDB();
    const auth = await verifyProjectOwner(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const body = await req.json();
    const { targetUserId, targetEmail } = body;

    if (!targetUserId && !targetEmail) {
      return NextResponse.json(
        { error: "Target user ID or email is required to transfer ownership" },
        { status: 400 }
      );
    }

    let targetUser: any = null;
    if (targetUserId) {
      targetUser = await (User as any).findById(targetUserId);
    } else if (targetEmail) {
      targetUser = await (User as any).findOne({ email: targetEmail.toLowerCase().trim() });
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user could not be found. Please ensure they are a registered user." },
        { status: 404 }
      );
    }

    const project = await (Project as any).findOne({ projectId: params.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const currentOwnerIdStr = auth.user._id.toString();
    const targetUserIdStr = targetUser._id.toString();

    if (currentOwnerIdStr === targetUserIdStr) {
      return NextResponse.json(
        { error: "You are already the owner of this workspace project" },
        { status: 400 }
      );
    }

    // 1. Update project ownerId to target user
    project.ownerId = targetUser._id;

    if (!Array.isArray(project.members)) {
      project.members = [];
    }

    // 2. Ensure new owner has admin role in members
    const targetMemberIdx = project.members.findIndex(
      (m: any) => (m.userId?.toString() || m.userId) === targetUserIdStr
    );
    if (targetMemberIdx >= 0) {
      project.members[targetMemberIdx].role = "admin";
    } else {
      project.members.push({
        userId: targetUser._id,
        role: "admin",
      });
    }

    // 3. Ensure previous owner remains as an admin member
    const prevOwnerMemberIdx = project.members.findIndex(
      (m: any) => (m.userId?.toString() || m.userId) === currentOwnerIdStr
    );
    if (prevOwnerMemberIdx >= 0) {
      project.members[prevOwnerMemberIdx].role = "admin";
    } else {
      project.members.push({
        userId: auth.user._id,
        role: "admin",
      });
    }

    await project.save();

    return NextResponse.json({
      success: true,
      message: `Project ownership successfully transferred to ${targetUser.name || targetUser.email}`,
      newOwner: {
        userId: targetUser._id.toString(),
        name: targetUser.name,
        email: targetUser.email,
        role: "owner",
      },
      previousOwner: {
        userId: auth.user._id.toString(),
        name: auth.user.name,
        email: auth.user.email,
        role: "admin",
      },
    });
  } catch (err: any) {
    console.error("Transfer ownership error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

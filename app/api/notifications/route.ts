import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { verifyProjectAccess } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const auth = await verifyProjectAccess(req, projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const statusFilter = searchParams.get("status") || "active"; // "unread", "active", "all", "dismissed"
    const severity = searchParams.get("severity");
    const type = searchParams.get("type");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const query: Record<string, any> = { projectId };

    if (statusFilter === "unread") {
      query.read = false;
      query.dismissed = false;
    } else if (statusFilter === "active") {
      query.dismissed = false;
    } else if (statusFilter === "dismissed") {
      query.dismissed = true;
    }

    if (severity && ["critical", "warning", "info"].includes(severity)) {
      query.severity = severity;
    }

    if (type) {
      query.type = type;
    }

    const [notifications, unreadCount, criticalCount] = await Promise.all([
      (Notification as any)
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      (Notification as any).countDocuments({
        projectId,
        read: false,
        dismissed: false,
      }),
      (Notification as any).countDocuments({
        projectId,
        severity: "critical",
        dismissed: false,
      }),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      criticalCount,
    });
  } catch (err: any) {
    console.error("Notifications GET error:", err);
    return NextResponse.json({ error: "Failed to fetch notifications", details: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, notificationId, projectId } = body;

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 });
    }

    // 1. Mark a single notification as read
    if (action === "markAsRead") {
      if (!notificationId) {
        return NextResponse.json({ error: "notificationId is required" }, { status: 400 });
      }

      const notif = await (Notification as any).findById(notificationId);
      if (!notif) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }

      const auth = await verifyProjectAccess(req, notif.projectId);
      if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
      }

      notif.read = true;
      notif.readAt = new Date();
      await notif.save();

      return NextResponse.json({ success: true, notification: notif });
    }

    // 2. Mark all notifications for a project as read
    if (action === "markAllAsRead") {
      if (!projectId) {
        return NextResponse.json({ error: "projectId is required" }, { status: 400 });
      }

      const auth = await verifyProjectAccess(req, projectId);
      if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
      }

      await (Notification as any).updateMany(
        { projectId, read: false },
        { $set: { read: true, readAt: new Date() } }
      );

      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    // 3. Dismiss a single notification
    if (action === "dismiss") {
      if (!notificationId) {
        return NextResponse.json({ error: "notificationId is required" }, { status: 400 });
      }

      const notif = await (Notification as any).findById(notificationId);
      if (!notif) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }

      const auth = await verifyProjectAccess(req, notif.projectId);
      if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
      }

      notif.dismissed = true;
      await notif.save();

      return NextResponse.json({ success: true, notification: notif });
    }

    // 4. Dismiss all notifications for a project
    if (action === "dismissAll") {
      if (!projectId) {
        return NextResponse.json({ error: "projectId is required" }, { status: 400 });
      }

      const auth = await verifyProjectAccess(req, projectId);
      if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
      }

      await (Notification as any).updateMany(
        { projectId, dismissed: false },
        { $set: { dismissed: true } }
      );

      return NextResponse.json({ success: true, message: "All notifications dismissed." });
    }

    return NextResponse.json({ error: `Unknown action '${action}'` }, { status: 400 });
  } catch (err: any) {
    console.error("Notifications PATCH error:", err);
    return NextResponse.json({ error: "Failed to update notification", details: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id");
    const projectId = searchParams.get("projectId");
    const action = searchParams.get("action");

    if (notificationId) {
      const notif = await (Notification as any).findById(notificationId);
      if (!notif) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }

      const auth = await verifyProjectAccess(req, notif.projectId);
      if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
      }

      await (Notification as any).deleteOne({ _id: notificationId });
      return NextResponse.json({ success: true, message: "Notification deleted." });
    }

    if (projectId && action === "clearRead") {
      const auth = await verifyProjectAccess(req, projectId);
      if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
      }

      await (Notification as any).deleteMany({ projectId, read: true });
      return NextResponse.json({ success: true, message: "Read notifications cleared." });
    }

    return NextResponse.json({ error: "id or projectId+action is required" }, { status: 400 });
  } catch (err: any) {
    console.error("Notifications DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete notification", details: err.message }, { status: 500 });
  }
}

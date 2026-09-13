import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import User from "@/models/User";
import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";

export const SESSION_COOKIE_NAME = "open_session";
const JWT_SECRET = process.env.JWT_SECRET || "open_analytics_super_secret_jwt_key_2026_x89!";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "super_admin" | "admin" | "member";
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

import crypto from "crypto";

export function generateProjectId(prefix = "prj_"): string {
  const rand = crypto.randomBytes(8).toString("hex");
  return `${prefix}${rand}`;
}

export function generateApiKey(type: "pk" | "sk" = "pk"): string {
  const rand = crypto.randomBytes(16).toString("hex");
  return `${type}_live_${rand}`;
}

export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 3,
  admin: 2,
  member: 1,
};

export function hasRole(userRole: string, minRole: "super_admin" | "admin" | "member"): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const minLevel = ROLE_HIERARCHY[minRole] || 0;
  return userLevel >= minLevel;
}

/**
 * Checks if a user has permission to read a project's data.
 * STRICT ENFORCEMENT:
 * - super_admin can view all projects
 * - user who is the ownerId can view
 * - user who is listed in members can view
 * - Any other user is DENIED (no seeing other account data!)
 */
export function canAccessProject(user: any, project: any): boolean {
  if (!user || !project) return false;
  if (user.role === "super_admin") return true;

  const userIdStr = user._id?.toString() || user.userId || user.id;
  if (project.ownerId && project.ownerId.toString() === userIdStr) {
    return true;
  }
  if (Array.isArray(project.members)) {
    const isMember = project.members.some(
      (m: any) => (m.userId?.toString() || m.userId) === userIdStr
    );
    if (isMember) return true;
  }
  return false;
}

/**
 * Checks if a user has permission to manage/edit a project.
 */
export function canManageProject(user: any, project: any): boolean {
  if (!user || !project) return false;
  if (user.role === "super_admin") return true;

  const userIdStr = user._id?.toString() || user.userId || user.id;
  if (project.ownerId && project.ownerId.toString() === userIdStr) {
    return true;
  }
  if (Array.isArray(project.members)) {
    const memberObj = project.members.find(
      (m: any) => (m.userId?.toString() || m.userId) === userIdStr
    );
    if (memberObj && memberObj.role === "admin") return true;
  }
  return false;
}

export async function getCurrentUser(req?: Request): Promise<any | null> {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    // 2. Check Request Cookie header
    if (!token && req) {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp("(?:^|; )" + SESSION_COOKIE_NAME + "=([^;]*)"));
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    // 3. Check Next.js cookies() API
    if (!token) {
      try {
        const cookieStore = cookies();
        token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      } catch (e) {
        // Outside of server action or route handler context
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    await connectDB();
    const user = await (User as any).findById(payload.userId).select("-passwordHash").lean();
    if (!user) return null;

    return {
      _id: user._id.toString(),
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
    };
  } catch (err) {
    console.error("Error resolving current user:", err);
    return null;
  }
}

/**
 * Route authorization guard: verifies user is authenticated and has permission for projectId.
 */
export async function verifyProjectAccess(req: Request, projectId: string): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
  user?: any;
  project?: any;
}> {
  await connectDB();
  const user = await getCurrentUser(req);
  if (!user) {
    return { ok: false, status: 401, error: "Authentication required. Please log in." };
  }

  const project = await (Project as any).findOne({ projectId }).lean();
  if (!project) {
    return { ok: false, status: 404, error: "Project not found" };
  }

  if (!canAccessProject(user, project)) {
    return {
      ok: false,
      status: 403,
      error: "Access denied: You do not have permission to view this project's analytics data.",
    };
  }

  return { ok: true, user, project };
}

/**
 * Route authorization guard: verifies user is authenticated and has manage permission for projectId.
 */
export async function verifyProjectManage(req: Request, projectId: string): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
  user?: any;
  project?: any;
}> {
  await connectDB();
  const user = await getCurrentUser(req);
  if (!user) {
    return { ok: false, status: 401, error: "Authentication required. Please log in." };
  }

  const project = await (Project as any).findOne({ projectId }).lean();
  if (!project) {
    return { ok: false, status: 404, error: "Project not found" };
  }

  if (!canManageProject(user, project)) {
    return {
      ok: false,
      status: 403,
      error: "Access denied: You do not have administrative permission to modify this project.",
    };
  }

  return { ok: true, user, project };
}
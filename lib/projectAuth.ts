import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";

export interface AuthResult {
  authorized: boolean;
  project?: any;
  error?: string;
  status: number;
}

export async function authenticateProjectRequest(req: Request, body?: any): Promise<AuthResult> {
  await connectDB();

  const apiKeyHeader = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const apiKey = apiKeyHeader || body?.apiKey;
  const projectId = body?.projectId || req.headers.get("x-project-id");

  if (!apiKey && !projectId) {
    return { authorized: false, error: "Missing API Key or Project ID", status: 401 };
  }

  let project = null;
  if (apiKey) {
    project = await (Project as any).findOne({
      $or: [{ publishableKey: apiKey }, { secretKey: apiKey }],
    }).populate("ownerId", "plan planExpiresAt subscriptionStatus role lockedActiveProjectId").lean();
  } else if (projectId) {
    const rawId = String(projectId).trim();
    project = await (Project as any).findOne({
      $or: [
        { projectId: rawId },
        { measurementId: rawId },
        { measurementId: rawId.toUpperCase() },
        { projectId: rawId.toLowerCase() },
        { projectId: `open_prj_${rawId.replace(/^open_prj_|^prj_|^oa-|^OA-/i, "").toLowerCase()}` },
        { measurementId: `OA-${rawId.replace(/^open_prj_|^prj_|^oa-|^OA-/i, "").toUpperCase()}` },
      ],
    }).populate("ownerId", "plan planExpiresAt subscriptionStatus role lockedActiveProjectId").lean();
  }

  if (!project) {
    // If no project exists yet and this is OpenLabs default, auto-seed
    if (projectId === "prj_openlabs" || apiKey === "pk_live_openlabs") {
      project = await (Project as any).create({
        projectId: "prj_openlabs",
        name: "OpenLabs Virtual Labs",
        slug: "openlabs",
        publishableKey: "pk_live_openlabs",
        secretKey: "sk_live_openlabs_secret_9941",
        allowedDomains: ["*"],
        settings: {
          ipAnonymization: true,
          piiRedaction: true,
          dataRetentionDays: 365,
          enabledModules: ["core", "rum", "behavioral", "errors", "virtual_labs"],
        },
      });
    } else {
      return { authorized: false, error: "Invalid Project Credentials", status: 403 };
    }
  }

  // Domain check
  const originHeader = req.headers.get("origin") || req.headers.get("referer") || "";
  if (originHeader && Array.isArray(project.allowedDomains) && project.allowedDomains.length > 0 && !project.allowedDomains.includes("*")) {
    try {
      const url = new URL(originHeader.startsWith("http") ? originHeader : `https://${originHeader}`);
      const hostname = url.hostname.toLowerCase();
      const hostWithPort = url.host.toLowerCase();

      const isAllowed = project.allowedDomains.some((d: string) => {
        if (!d) return false;
        const raw = d.trim().toLowerCase();
        if (raw === "*") return true;

        const cleanNoProto = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        const cleanNoPort = cleanNoProto.replace(/:\d+$/, "");

        const baseHost = hostname.replace(/^www\./, "");
        const baseAllowed = cleanNoPort.replace(/^www\./, "");

        // Match exact hostname, www/apex equivalent, subdomain, or host:port
        return (
          hostname === cleanNoPort ||
          baseHost === baseAllowed ||
          hostname.endsWith(`.${cleanNoPort}`) ||
          baseHost.endsWith(`.${baseAllowed}`) ||
          hostWithPort === cleanNoProto
        );
      });

      if (!isAllowed) {
        return {
          authorized: false,
          error: `Domain '${hostname}' is not authorized for project '${project.projectId}'. Please add it to Allowed Domains in project settings.`,
          status: 403,
        };
      }
    } catch {}
  }

  return { authorized: true, project, status: 200 };
}
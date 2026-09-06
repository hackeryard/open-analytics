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
    }).lean();
  } else if (projectId) {
    project = await (Project as any).findOne({ projectId }).lean();
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
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  if (origin && Array.isArray(project.allowedDomains) && !project.allowedDomains.includes("*")) {
    try {
      const url = new URL(origin);
      const host = url.hostname.toLowerCase();
      const isAllowed = project.allowedDomains.some((d: string) => {
        const clean = d.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        return host === clean || host.endsWith(`.${clean}`);
      });
      if (!isAllowed) {
        return { authorized: false, error: `Domain '${host}' is not authorized for this project`, status: 403 };
      }
    } catch {}
  }

  return { authorized: true, project, status: 200 };
}
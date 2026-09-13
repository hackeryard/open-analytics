import Project from "@/models/Project";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function ensureDefaultProject() {
  await connectDB();

  // 1. Ensure Super Admin user exists
  let superAdmin = await (User as any).findOne({
    email: "admin@openanalytics.io"
  });
  if (!superAdmin) {
    const defaultCount = await (User as any).countDocuments();
    const passwordHash = await bcrypt.hash("admin123", 10);
    superAdmin = await (User as any).create({
      name: "Open Analytics Super Admin",
      email: "admin@openanalytics.io",
      passwordHash,
      role: defaultCount === 0 ? "super_admin" : "admin",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=openanalytics",
    });
    console.log("Seeded Super Admin user:", superAdmin.email);
  }

  // 2. Ensure commercial default project exists
  const defaultCommercial = await (Project as any).findOne({ projectId: "prj_production_app" }).lean();
  if (!defaultCommercial) {
    await (Project as any).create({
      projectId: "prj_production_app",
      name: "Acme Web Application",
      slug: "acme-web-app",
      ownerId: superAdmin._id,
      publishableKey: "pk_live_open_prod_8821",
      secretKey: "sk_live_open_secret_prod_9921",
      allowedDomains: ["*"],
      settings: {
        ipAnonymization: true,
        piiRedaction: true,
        seoTracking: true,
        aiTracking: true,
        dataRetentionDays: 365,
        enabledModules: ["core", "rum", "behavioral", "errors", "seo", "ai_aeo"],
      },
    });
  }

  // 3. Ensure OpenLabs exists as a supported project
  const openlabs = await (Project as any).findOne({ projectId: "prj_openlabs" }).lean();
  if (!openlabs) {
    await (Project as any).create({
      projectId: "prj_openlabs",
      name: "OpenLabs Virtual Labs",
      slug: "openlabs",
      ownerId: superAdmin._id,
      publishableKey: "pk_live_openlabs",
      secretKey: "sk_live_openlabs_secret_9941",
      allowedDomains: ["*"],
      settings: {
        ipAnonymization: true,
        piiRedaction: true,
        seoTracking: true,
        aiTracking: true,
        dataRetentionDays: 365,
        enabledModules: ["core", "rum", "behavioral", "errors", "virtual_labs", "seo", "ai_aeo"],
      },
    });
  }

  // 4. Ensure an open_prj_* formatted project exists
  const uniqueProject = await (Project as any).findOne({
    projectId: "open_prj_enterprise_suite"
  }).lean();
  if (!uniqueProject) {
    await (Project as any).create({
      projectId: "open_prj_enterprise_suite",
      name: "Global Cloud Platform",
      slug: "global-cloud-platform",
      ownerId: superAdmin._id,
      publishableKey: "pk_live_open_enterprise_9022",
      secretKey: "sk_live_open_enterprise_sec_103",
      allowedDomains: ["*"],
      settings: {
        ipAnonymization: true,
        piiRedaction: true,
        seoTracking: true,
        aiTracking: true,
        dataRetentionDays: 365,
        enabledModules: ["core", "rum", "behavioral", "errors", "seo", "ai_aeo"],
      },
    });
  }
}
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { verifyProjectManage, getOAuthBaseUrl } from "@/lib/auth";
import { getUserEffectivePlan } from "@/lib/planLimits";

export const dynamic = "force-dynamic";

/**
 * POST: Initiates Google OAuth consent for GSC (Search Console read-only scope).
 * Checks project manage permissions and Pro plan requirement.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const auth = await verifyProjectManage(req, params.projectId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 403 });
    }

    const userPlan = getUserEffectivePlan(auth.user);
    const projectPlan = auth.project?.effectivePlan || auth.project?.plan || "free";
    const isPro =
      userPlan === "pro" ||
      userPlan === "enterprise" ||
      projectPlan === "pro" ||
      projectPlan === "enterprise" ||
      auth.user?.role === "super_admin";

    if (!isPro) {
      return NextResponse.json(
        {
          error: "Google Search Console integration requires a Cloud Pro or Enterprise plan.",
          code: "PRO_REQUIRED",
        },
        { status: 403 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = getOAuthBaseUrl(req);
    const redirectUri = process.env.GOOGLE_GSC_REDIRECT_URI || `${baseUrl}/api/auth/oauth/google/callback`;

    if (!clientId) {
      return NextResponse.json(
        {
          error: "Google OAuth credentials are not configured on the server. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env.local file to connect Google Search Console.",
          code: "OAUTH_NOT_CONFIGURED",
        },
        { status: 400 }
      );
    }

    // Generate state with project ID and cryptographic nonce
    const nonce = crypto.randomBytes(16).toString("hex");
    const statePayload = Buffer.from(
      JSON.stringify({
        projectId: params.projectId,
        userId: auth.user?._id?.toString(),
        nonce,
      })
    ).toString("base64url");

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/webmasters.readonly openid email profile"
    );
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent select_account");
    authUrl.searchParams.set("state", statePayload);

    const res = NextResponse.json({
      ok: true,
      authUrl: authUrl.toString(),
    });

    const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

    res.cookies.set({
      name: "open_gsc_state",
      value: nonce,
      httpOnly: true,
      secure: !isLocal && process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("GSC OAuth initiate error:", err);
    return NextResponse.json({ error: "Failed to initiate GSC OAuth", details: err.message }, { status: 500 });
  }
}

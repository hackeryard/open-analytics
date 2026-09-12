import { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "pulse_session";

// Paths that NEVER require authentication
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/oauth",
  "/pulse.js",
  "/favicon.ico",
  "/docs",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow Next.js internals, static files, and chunks
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // image, font, css, js files
  ) {
    return NextResponse.next();
  }

  // 2. Allow Edge Telemetry Ingestion (Client scripts authenticate via X-API-Key / projectId)
  if (pathname.startsWith("/api/v1/")) {
    const origin = req.headers.get("origin") || "*";
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key, X-Project-ID, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        },
      });
    }

    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key, X-Project-ID, Authorization"
    );
    res.headers.set("Access-Control-Max-Age", "86400");
    res.headers.set("Vary", "Origin");
    return res;
  }

  // 3. Allow public auth and assets
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // 4. Check for JWT session token in cookies or Bearer Authorization
  let token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 5. If unauthenticated, block immediately
  if (!token) {
    // If requesting an API route, return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // If requesting a dashboard or management page, redirect to /login
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 6. Verify token format and expiration (JWT: header.payload.signature)
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Malformed token");
    }

    // Decode base64url payload
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);

    // Check expiration timestamp
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    if (!parsed.userId) {
      throw new Error("Missing user id");
    }

    // Token is valid; proceed to destination
    return NextResponse.next();
  } catch (err) {
    // Clear corrupted / expired token
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));

    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
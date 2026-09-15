import { NextRequest, NextResponse } from "next/server";
import { isDashboardHost, getDashboardUrl, getMainDomainUrl } from "@/lib/subdomain";

export const SESSION_COOKIE_NAME = "open_session";

// Marketing & SEO paths that belong exclusively on the Main Domain
const MARKETING_PATHS = [
  "/features",
  "/vs-google-analytics",
  "/pricing",
  "/privacy",
  "/faq",
];

// Internal platform workspace paths that belong exclusively on the Dashboard Subdomain
const DASHBOARD_PATHS = [
  "/live-feed",
  "/audience",
  "/journeys",
  "/pages",
  "/events",
  "/labs",
  "/vitals",
  "/errors",
  "/ux",
  "/tech",
  "/geo",
  "/acquisition",
  "/seo",
  "/ai-visibility",
  "/ai-aeo",
  "/projects",
  "/settings",
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isDashboard = isDashboardHost(
    host,
    req.nextUrl.searchParams,
    req.headers.get("x-subdomain")
  );

  // 1. Allow Next.js internals, static assets, chunks, and public metadata
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/open.js" ||
    pathname.includes(".") // fonts, images, css, static files
  ) {
    return NextResponse.next();
  }

  // 2. Allow Edge Telemetry Ingestion (Client scripts send telemetry to /api/v1/collect)
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

  // =========================================================================
  // BRANCH A: MAIN MARKETING & SEO DOMAIN (!isDashboard)
  // =========================================================================
  if (!isDashboard) {
    // 1. If visitor navigates to /login or /register on main domain, redirect to dashboard subdomain
    if (pathname === "/login" || pathname === "/register") {
      const targetUrl = getDashboardUrl(`${pathname}${search}`, host);
      return new NextResponse(null, {
        status: 307,
        headers: {
          Location: targetUrl,
        },
      });
    }

    // 2. If visitor navigates to an internal dashboard workspace route, redirect to dashboard subdomain
    if (DASHBOARD_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      const targetUrl = getDashboardUrl(`${pathname}${search}`, host);
      return new NextResponse(null, {
        status: 307,
        headers: {
          Location: targetUrl,
        },
      });
    }

    // 3. Marketing & SEO routes (/features, /pricing, /vs-google-analytics, /privacy, /faq, /docs, /)
    // Always render cleanly without dashboard chrome or auth friction
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-is-dashboard", "0");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // =========================================================================
  // BRANCH B: DASHBOARD SUBDOMAIN (isDashboard)
  // =========================================================================

  // 1. If visitor navigates to marketing-only routes on dashboard subdomain, redirect to main domain
  if (MARKETING_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const targetUrl = getMainDomainUrl(`${pathname}${search}`, host);
    return new NextResponse(null, {
      status: 307,
      headers: {
        Location: targetUrl,
      },
    });
  }

  // Helper to extract session token
  let token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // Check if token is valid
  let isValidSession = false;
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const parsed = JSON.parse(jsonPayload);
        if (parsed.exp && parsed.exp * 1000 >= Date.now() && parsed.userId) {
          isValidSession = true;
        }
      }
    } catch {
      isValidSession = false;
    }
  }

  // 2. Public auth routes on dashboard subdomain (/login, /register, OAuth, cron)
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/cron");

  if (isAuthPath) {
    // If user is ALREADY authenticated and visits /login or /register, redirect to dashboard overview
    if (isValidSession && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-is-dashboard", "1");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 3. Developer documentation is accessible
  if (pathname === "/docs" || pathname.startsWith("/docs/")) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-is-dashboard", "1");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 4. Protect all dashboard platform workspaces & root overview (/)
  if (!isValidSession) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }

  // Token is valid; proceed to dashboard destination
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-is-dashboard", "1");
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
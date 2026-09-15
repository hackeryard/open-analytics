/**
 * Subdomain detection and cross-domain URL resolution utilities.
 * Segregates Open Analytics between:
 * 1. Main Domain (openanalytics.org.in / localhost:3005): Strictly dedicated to SEO, marketing, and public documentation.
 * 2. Dashboard Subdomain (dashboard.openanalytics.org.in / dashboard.localhost:3005): Analytics platform workspace & auth.
 */

export function isDashboardHost(
  host?: string | null,
  searchParams?: URLSearchParams | null,
  headerSubdomain?: string | null
): boolean {
  // Query param or header overrides (useful in testing and local simulation)
  if (searchParams?.get("subdomain") === "dashboard" || searchParams?.get("__subdomain") === "dashboard") {
    return true;
  }
  if (headerSubdomain === "dashboard") {
    return true;
  }

  if (!host) return false;

  const rawHost = host.toLowerCase().split(":")[0];
  return rawHost.startsWith("dashboard.");
}

/**
 * Synchronous client-side check to determine if the active browser window is on the dashboard subdomain.
 */
export function isDashboardClient(): boolean {
  if (typeof window === "undefined") return false;

  const host = window.location.host.toLowerCase().split(":")[0];
  if (host.startsWith("dashboard.")) {
    return true;
  }

  // Local development simulation fallback via query param or cookie
  const params = new URLSearchParams(window.location.search);
  if (params.get("subdomain") === "dashboard") {
    return true;
  }

  if (document.cookie.includes("open_subdomain=dashboard")) {
    return true;
  }

  return false;
}

/**
 * Returns the fully qualified URL to the Dashboard Subdomain.
 * E.g. in dev: "http://dashboard.localhost:3005/events"
 * E.g. in prod: "https://dashboard.openanalytics.org.in/events"
 */
export function getDashboardUrl(path = "/", currentHost?: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window !== "undefined") {
    const host = window.location.host;
    const proto = window.location.protocol;
    const rawHost = host.replace(/:\d+$/, "");
    const portMatch = host.match(/:\d+$/);
    const port = portMatch ? portMatch[0] : "";

    if (rawHost.toLowerCase().startsWith("dashboard.")) {
      return `${proto}//${host}${normalizedPath === "/" ? "" : normalizedPath}`;
    }

    const isLocal = rawHost.includes("localhost") || rawHost.includes("127.0.0.1");
    const targetHost = isLocal
      ? `dashboard.localhost${port}`
      : `dashboard.${rawHost.replace(/^www\./, "")}${port}`;

    return `${proto}//${targetHost}${normalizedPath === "/" ? "" : normalizedPath}`;
  }

  if (currentHost) {
    const rawHost = currentHost.replace(/:\d+$/, "");
    const portMatch = currentHost.match(/:\d+$/);
    const port = portMatch ? portMatch[0] : "";
    const isLocal = rawHost.includes("localhost") || rawHost.includes("127.0.0.1");
    const proto = isLocal ? "http" : "https";

    if (rawHost.toLowerCase().startsWith("dashboard.")) {
      return `${proto}://${currentHost}${normalizedPath === "/" ? "" : normalizedPath}`;
    }

    const targetHost = isLocal
      ? `dashboard.localhost${port}`
      : `dashboard.${rawHost.replace(/^www\./, "")}${port}`;

    return `${proto}://${targetHost}${normalizedPath === "/" ? "" : normalizedPath}`;
  }

  // Environment fallback
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";
  try {
    const url = new URL(base);
    if (!url.hostname.toLowerCase().startsWith("dashboard.")) {
      url.hostname = `dashboard.${url.hostname.replace(/^www\./, "")}`;
    }
    return `${url.origin}${normalizedPath === "/" ? "" : normalizedPath}`;
  } catch {
    return `https://dashboard.openanalytics.org.in${normalizedPath === "/" ? "" : normalizedPath}`;
  }
}

/**
 * Returns the fully qualified URL to the Main Domain.
 * E.g. in dev: "http://localhost:3005"
 * E.g. in prod: "https://openanalytics.org.in"
 */
export function getMainDomainUrl(path = "/", currentHost?: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window !== "undefined") {
    const host = window.location.host;
    const proto = window.location.protocol;
    const portMatch = host.match(/:\d+$/);
    const port = portMatch ? portMatch[0] : "";
    const rawHost = host.replace(/:\d+$/, "");

    const cleanHost = rawHost.replace(/^dashboard\./i, "");
    return `${proto}//${cleanHost}${port}${normalizedPath === "/" ? "" : normalizedPath}`;
  }

  if (currentHost) {
    const rawHost = currentHost.replace(/:\d+$/, "");
    const portMatch = currentHost.match(/:\d+$/);
    const port = portMatch ? portMatch[0] : "";
    const isLocal = rawHost.includes("localhost") || rawHost.includes("127.0.0.1");
    const proto = isLocal ? "http" : "https";

    const cleanHost = rawHost.replace(/^dashboard\./i, "");
    return `${proto}://${cleanHost}${port}${normalizedPath === "/" ? "" : normalizedPath}`;
  }

  // Environment fallback
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://openanalytics.org.in";
  try {
    const url = new URL(base);
    url.hostname = url.hostname.replace(/^dashboard\./i, "");
    return `${url.origin}${normalizedPath === "/" ? "" : normalizedPath}`;
  } catch {
    return `https://openanalytics.org.in${normalizedPath === "/" ? "" : normalizedPath}`;
  }
}

/**
 * Utility to resolve relative tracked routes (e.g. "/pricing", "/checkout")
 * to the tracked website's absolute URL rather than resolving against the dashboard's domain.
 */

export interface TrackedProjectTarget {
  websiteUrl?: string | null;
  allowedDomains?: string[] | null;
  dataStreams?: Array<{
    streamUrl?: string | null;
    streamType?: string | null;
  }> | null;
}

/**
 * Derives the base URL (origin) of the tracked property from project metadata.
 */
export function getProjectBaseUrl(project?: TrackedProjectTarget | null): string {
  if (!project) return "";

  // 1. Check direct websiteUrl
  if (project.websiteUrl && typeof project.websiteUrl === "string" && project.websiteUrl.trim().length > 0) {
    let url = project.websiteUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, "");
  }

  // 2. Check dataStreams (e.g. web data streams)
  if (Array.isArray(project.dataStreams) && project.dataStreams.length > 0) {
    const webStream = project.dataStreams.find(s => s?.streamUrl && s.streamUrl.trim().length > 0);
    if (webStream?.streamUrl) {
      let url = webStream.streamUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      return url.replace(/\/+$/, "");
    }
  }

  // 3. Check allowedDomains (ignoring wildcards and empty strings)
  if (Array.isArray(project.allowedDomains) && project.allowedDomains.length > 0) {
    const validDomain = project.allowedDomains.find(
      d => typeof d === "string" && d.trim().length > 0 && d.trim() !== "*" && !d.includes("*")
    );
    if (validDomain) {
      let domain = validDomain.trim();
      if (!domain.startsWith("http://") && !domain.startsWith("https://")) {
        domain = `https://${domain}`;
      }
      return domain.replace(/\/+$/, "");
    }
  }

  return "";
}

/**
 * Returns a fully qualified outbound URL for a tracked path or route.
 * If the path is already an absolute HTTP/HTTPS URL, it is returned as is.
 * Otherwise, it prepends the project's tracked base URL.
 * If no project base URL can be derived, it returns the pathname as-is.
 */
export function getTrackedUrl(
  pathname: string | undefined | null,
  project?: TrackedProjectTarget | null
): string {
  if (!pathname || typeof pathname !== "string") {
    return "#";
  }

  const trimmed = pathname.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
    return trimmed;
  }

  const base = getProjectBaseUrl(project);
  if (!base) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${cleanPath}`;
}

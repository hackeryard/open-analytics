import { getFullCountryName } from "@/lib/countries";

export interface GeoLocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Extracts client IP address from standard proxy and CDN headers.
 */
export function getClientIp(req: Request | Headers): string {
  const headers = req instanceof Headers ? req : req.headers;
  
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

// Common timezone to country/city mappings for localhost & local development fallback
const TIMEZONE_GEO_FALLBACK: Record<string, { countryCode: string; country: string; city: string; region: string }> = {
  "Asia/Kolkata": { countryCode: "IN", country: "India", city: "Kolkata", region: "WB" },
  "Asia/Calcutta": { countryCode: "IN", country: "India", city: "Kolkata", region: "WB" },
  "Asia/Delhi": { countryCode: "IN", country: "India", city: "New Delhi", region: "DL" },
  "Asia/Mumbai": { countryCode: "IN", country: "India", city: "Mumbai", region: "MH" },
  "America/New_York": { countryCode: "US", country: "United States", city: "New York", region: "NY" },
  "America/Los_Angeles": { countryCode: "US", country: "United States", city: "Los Angeles", region: "CA" },
  "America/Chicago": { countryCode: "US", country: "United States", city: "Chicago", region: "IL" },
  "America/Denver": { countryCode: "US", country: "United States", city: "Denver", region: "CO" },
  "America/Phoenix": { countryCode: "US", country: "United States", city: "Phoenix", region: "AZ" },
  "America/Detroit": { countryCode: "US", country: "United States", city: "Detroit", region: "MI" },
  "America/Toronto": { countryCode: "CA", country: "Canada", city: "Toronto", region: "ON" },
  "America/Vancouver": { countryCode: "CA", country: "Canada", city: "Vancouver", region: "BC" },
  "America/Montreal": { countryCode: "CA", country: "Canada", city: "Montreal", region: "QC" },
  "Europe/London": { countryCode: "GB", country: "United Kingdom", city: "London", region: "ENG" },
  "Europe/Paris": { countryCode: "FR", country: "France", city: "Paris", region: "IDF" },
  "Europe/Berlin": { countryCode: "DE", country: "Germany", city: "Berlin", region: "BE" },
  "Europe/Amsterdam": { countryCode: "NL", country: "Netherlands", city: "Amsterdam", region: "NH" },
  "Europe/Madrid": { countryCode: "ES", country: "Spain", city: "Madrid", region: "MD" },
  "Europe/Rome": { countryCode: "IT", country: "Italy", city: "Rome", region: "LAZ" },
  "Europe/Zurich": { countryCode: "CH", country: "Switzerland", city: "Zurich", region: "ZH" },
  "Europe/Dublin": { countryCode: "IE", country: "Ireland", city: "Dublin", region: "L" },
  "Europe/Stockholm": { countryCode: "SE", country: "Sweden", city: "Stockholm", region: "AB" },
  "Europe/Warsaw": { countryCode: "PL", country: "Poland", city: "Warsaw", region: "MZ" },
  "Asia/Tokyo": { countryCode: "JP", country: "Japan", city: "Tokyo", region: "13" },
  "Asia/Singapore": { countryCode: "SG", country: "Singapore", city: "Singapore", region: "SG" },
  "Asia/Dubai": { countryCode: "AE", country: "United Arab Emirates", city: "Dubai", region: "DU" },
  "Asia/Hong_Kong": { countryCode: "HK", country: "Hong Kong", city: "Hong Kong", region: "HK" },
  "Asia/Seoul": { countryCode: "KR", country: "South Korea", city: "Seoul", region: "11" },
  "Asia/Bangkok": { countryCode: "TH", country: "Thailand", city: "Bangkok", region: "10" },
  "Asia/Jakarta": { countryCode: "ID", country: "Indonesia", city: "Jakarta", region: "JK" },
  "Asia/Taipei": { countryCode: "TW", country: "Taiwan", city: "Taipei", region: "TPE" },
  "Asia/Karachi": { countryCode: "PK", country: "Pakistan", city: "Karachi", region: "SD" },
  "Australia/Sydney": { countryCode: "AU", country: "Australia", city: "Sydney", region: "NSW" },
  "Australia/Melbourne": { countryCode: "AU", country: "Australia", city: "Melbourne", region: "VIC" },
  "Australia/Brisbane": { countryCode: "AU", country: "Australia", city: "Brisbane", region: "QLD" },
  "America/Sao_Paulo": { countryCode: "BR", country: "Brazil", city: "São Paulo", region: "SP" },
  "America/Mexico_City": { countryCode: "MX", country: "Mexico", city: "Mexico City", region: "CMX" },
  "Africa/Johannesburg": { countryCode: "ZA", country: "South Africa", city: "Johannesburg", region: "GP" },
  "Africa/Cairo": { countryCode: "EG", country: "Egypt", city: "Cairo", region: "C" },
};

/**
 * Automatically resolves geolocation (Country, State/Region, City, Timezone)
 * from Edge/CDN headers (Vercel, Cloudflare).
 * If on localhost or headers are absent, intelligently falls back to client timezone.
 */
export function extractGeoLocation(
  req: Request | Headers,
  fallback?: { timezone?: string; language?: string }
): GeoLocationData {
  const headers = req instanceof Headers ? req : req.headers;
  const ip = getClientIp(headers);

  // Country Code (e.g., 'US', 'IN', 'GB')
  const rawCountryCode =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "";

  let countryCode = rawCountryCode ? rawCountryCode.trim().toUpperCase() : "";
  let country = countryCode ? getFullCountryName(countryCode) : "";

  // Region / State (e.g., 'CA', 'MH', 'NY')
  let region =
    headers.get("x-vercel-ip-country-region") ||
    headers.get("cf-region") ||
    headers.get("x-region-code") ||
    "";

  // City (e.g., 'San Francisco', 'Mumbai' - Vercel URL-encodes city names)
  const rawCity =
    headers.get("x-vercel-ip-city") ||
    headers.get("cf-ipcity") ||
    headers.get("x-city") ||
    "";

  let city = "";
  try {
    city = rawCity ? decodeURIComponent(rawCity).trim() : "";
  } catch {
    city = rawCity.trim();
  }

  // Timezone (e.g., 'America/Los_Angeles', 'Asia/Kolkata')
  let timezone =
    headers.get("x-vercel-ip-timezone") ||
    headers.get("cf-timezone") ||
    headers.get("x-timezone") ||
    "";

  // Localhost / Local Dev Fallback: When running on localhost without CDN headers,
  // infer location from client's browser timezone so charts & logs populate accurately.
  const isLocal = ip === "127.0.0.1" || ip === "::1" || ip === "localhost" || !countryCode || countryCode === "UNKNOWN";
  const clientTz = (timezone || fallback?.timezone || "").trim();

  if (isLocal && clientTz) {
    timezone = clientTz;
    if (TIMEZONE_GEO_FALLBACK[clientTz]) {
      const fb = TIMEZONE_GEO_FALLBACK[clientTz];
      if (!countryCode || countryCode === "UNKNOWN") {
        countryCode = fb.countryCode;
        country = fb.country;
      }
      if (!city) city = fb.city;
      if (!region) region = fb.region;
    } else if (clientTz.includes("/")) {
      // Parse city from IANA timezone string: "Continent/City" -> "City"
      const parts = clientTz.split("/");
      const inferredCity = parts[parts.length - 1].replace(/_/g, " ");
      if (!city) city = inferredCity;
      if (!countryCode || countryCode === "UNKNOWN") {
        country = "Local (" + parts[0] + ")";
        countryCode = "LOC";
      }
    }
  }

  if (!country) country = "Unknown";

  // Coordinates
  const rawLat = headers.get("x-vercel-ip-latitude") || headers.get("cf-iplatitude");
  const rawLon = headers.get("x-vercel-ip-longitude") || headers.get("cf-iplongitude");
  const latitude = rawLat ? parseFloat(rawLat) : null;
  const longitude = rawLon ? parseFloat(rawLon) : null;

  return {
    ip,
    country,
    countryCode: countryCode && countryCode !== "UNKNOWN" ? countryCode : "",
    region: region.trim(),
    city,
    timezone: timezone.trim(),
    latitude: !isNaN(Number(latitude)) ? latitude : null,
    longitude: !isNaN(Number(longitude)) ? longitude : null,
  };
}

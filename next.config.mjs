import dns from "dns";
try {
  if (process.env.NODE_ENV === "development" && process.platform === "win32") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
} catch (e) {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: "/tech",
        destination: "/devices",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Global production security headers for all application routes
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Telemetry Ingestion CORS headers for cross-domain SDK / Beacon / Fetch tracking
        source: "/api/v1/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key, X-Project-ID, Authorization",
          },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
      {
        // Client Tracker SDK caching policy & cross-origin script access
        source: "/open.js",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Terminal,
  Code2,
  Server,
  Shield,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/docs/api/ingestion");

const breadcrumbSchema = generateBreadcrumbSchema("/docs/api/ingestion");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Edge Telemetry Ingestion REST API Reference & Reverse Proxy Recipes",
  description:
    "Comprehensive REST API contract for edge telemetry ingestion. Learn how to ingest pageviews, errors, and custom events directly, and configure first-party Cloudflare Worker proxies.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function ApiIngestionDocPage() {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Title */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-4">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Developer Reference • Telemetry API</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-sans tracking-tight">
            Edge Telemetry Ingestion REST API
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed font-sans">
            Technical specification for our versioned ingestion API. Transmit telemetry directly from server environments, mobile applications, and first-party reverse proxies.
          </p>
        </div>

        {/* Global Architecture */}
        <section className="mb-12 p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-3 font-sans text-xs">
          <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            API Ingestion Endpoint
          </div>
          <div className="p-3 rounded bg-[#090a0f] border border-white/[0.06] font-mono text-xs text-emerald-400">
            https://api.openanalytics.org.in
          </div>
          <p className="text-zinc-400 leading-relaxed">
            All ingestion endpoints are served with global CORS headers (<code>Access-Control-Allow-Origin: *</code>) and execute statelessly with sub-15ms edge processing latency.
          </p>
        </section>

        {/* Endpoints */}
        <div className="space-y-12">
          {/* Endpoint 1: POST /v1/collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                POST
              </span>
              <h2 className="text-lg font-bold text-white font-mono">/v1/collect</h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Primary telemetry ingestion endpoint. Receives pageviews, heartbeats, Core Web Vitals RUM metrics, and custom conversion events.
            </p>

            <div className="space-y-3">
              <div className="text-xs font-mono text-zinc-400">Request Payload (Pageview Example):</div>
              <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">{`{
  "type": "pageview",
  "projectId": "prj_your_project_id",
  "pathname": "/pricing",
  "title": "Pricing & Plans",
  "referrer": "https://twitter.com",
  "screenWidth": 1920,
  "screenHeight": 1080
}`}</pre>

              <div className="text-xs font-mono text-zinc-400 pt-2">Request Payload (Web Vitals RUM Example):</div>
              <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">{`{
  "type": "vitals",
  "projectId": "prj_your_project_id",
  "pathname": "/",
  "lcp": 1850,
  "inp": 120,
  "cls": 0.02,
  "ttfb": 340
}`}</pre>

              <div className="text-xs font-mono text-zinc-400 pt-2">Response:</div>
              <pre className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] font-mono text-xs text-emerald-400">{`{ "ok": true }`}</pre>
            </div>
          </section>

          {/* Endpoint 2: POST /v1/error */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                POST
              </span>
              <h2 className="text-lg font-bold text-white font-mono">/v1/error</h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Logs uncaught frontend JavaScript exceptions, runtime crashes, and unhandled promise rejections with stack traces.
            </p>

            <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">{`{
  "projectId": "prj_your_project_id",
  "message": "TypeError: Cannot read property 'map' of undefined",
  "stack": "TypeError: Cannot read property 'map'... at UserList.tsx:42:15",
  "url": "https://example.com/dashboard",
  "lineNumber": 42,
  "columnNumber": 15
}`}</pre>
          </section>

          {/* Reverse Proxy Recipes (Phase 7 Requirement) */}
          <section className="pt-8 border-t border-white/[0.08] space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                <Shield className="w-4 h-4 text-white" />
                <span>Adblocker-Resistant Integration</span>
              </div>
              <h2 className="text-xl font-bold text-white font-sans">
                First-Party Reverse Proxy Recipes
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                To prevent adblockers from blocking external script domains on technical websites, proxy the tracking script through your own domain.
              </p>
            </div>

            {/* Cloudflare Worker */}
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">Cloudflare Worker Proxy (15 Lines)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">worker.js</span>
              </div>
              <pre className="p-4 rounded-lg bg-[#090a0f] border border-white/[0.06] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">{`export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/analytics.js") {
      return fetch("https://api.openanalytics.org.in/open.js");
    }
    if (url.pathname === "/api/collect") {
      return fetch("https://api.openanalytics.org.in/v1/collect", {
        method: "POST",
        headers: request.headers,
        body: request.body,
      });
    }
    return new Response("Not found", { status: 404 });
  },
};`}</pre>
            </div>

            {/* Next.js Rewrites */}
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">Next.js Edge Rewrites</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">next.config.mjs</span>
              </div>
              <pre className="p-4 rounded-lg bg-[#090a0f] border border-white/[0.06] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">{`/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/open.js",
        destination: "https://api.openanalytics.org.in/open.js",
      },
      {
        source: "/api/collect",
        destination: "https://api.openanalytics.org.in/v1/collect",
      },
    ];
  },
};
export default nextConfig;`}</pre>
            </div>
          </section>
        </div>

        {/* Next Steps CTA */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/docs/verification"
            className="px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 font-sans"
          >
            <span>Next: Verification &amp; Testing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={dashboardUrl}
            className="text-xs text-zinc-400 hover:text-white transition-colors font-sans"
          >
            Open Analytics Console &rarr;
          </a>
        </div>
      </div>
    </>
  );
}

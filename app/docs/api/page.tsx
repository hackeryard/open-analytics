import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Terminal,
  Code2,
  Server,
  Shield,
  ArrowRight,
  Check,
  Layers,
  Zap,
  Globe,
  Lock,
  Activity,
  Cpu,
  FileCode2,
  Database,
  Download,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/docs/api");

const breadcrumbSchema = generateBreadcrumbSchema("/docs/api");

const apiArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Open Analytics REST API & Edge Architecture Reference",
  description:
    "Comprehensive REST API contract for edge telemetry ingestion, error reporting, visitor identification, and programmatic analytical data export.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
    url: "https://openanalytics.org.in",
  },
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/v1/collect",
    purpose: "Ingest pageviews, session heartbeats, custom events, and Core Web Vitals",
    auth: "x-project-id header or query param",
    body: "JSON payload or navigator.sendBeacon",
    link: "/docs/api/ingestion",
  },
  {
    method: "POST",
    path: "/v1/error",
    purpose: "Report runtime JavaScript exceptions, unhandled rejections, and breadcrumbs",
    auth: "x-project-id header",
    body: "Error message, stack trace, URL, line/col, breadcrumbs",
    link: "/docs/api/ingestion#errors",
  },
  {
    method: "POST",
    path: "/v1/identify",
    purpose: "Enrich anonymous visitor sessions with optional customer traits",
    auth: "x-project-id header + SHA-256 API Key",
    body: "visitorId, traits object (plan, role, accountId)",
    link: "/docs/api/ingestion#identify",
  },
  {
    method: "GET",
    path: "/v1/event-rules",
    purpose: "Fetch project-level no-code custom event interception rules",
    auth: "x-project-id header",
    body: "None (Returns array of selector & event trigger rules)",
    link: "/docs/api/ingestion#rules",
  },
  {
    method: "GET",
    path: "/",
    purpose: "Fast JSON health check and edge availability verification",
    auth: "Public",
    body: "None (Returns { status: 'healthy', version: 'v1' })",
    link: "/docs/api/ingestion#health",
  },
];

export default function ApiOverviewDocPage() {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={apiArticleSchema} />

      <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
        {/* Title */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-4">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Developer Reference • API Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            REST API &amp; Edge Ingestion Reference
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            The Open Analytics API enables high-throughput telemetry collection,
            server-side event streaming, frontend error ingestion, and programmatic
            analytics export with sub-millisecond edge latency.
          </p>
        </div>

        {/* Global Architecture */}
        <section className="mb-12 p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-4 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Edge Infrastructure &amp; Base URL</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Telemetry endpoints are globally distributed across Cloudflare and AWS edge
            points-of-presence. Ingestion traffic routes to our dedicated telemetry
            subdomain to keep your marketing and application domains clean.
          </p>
          <div className="p-3 bg-[#090a0f] border border-white/[0.08] rounded-lg font-mono text-xs text-zinc-300 flex items-center justify-between">
            <span>Base Telemetry URL:</span>
            <span className="text-emerald-400 font-bold">https://api.openanalytics.org.in</span>
          </div>
        </section>

        {/* Endpoints Table */}
        <section className="mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Ingestion &amp; Telemetry Endpoints
            </h2>
            <span className="text-xs font-mono text-zinc-500">Version 1.0</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#111218]">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 font-mono text-[11px] bg-[#141620]">
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Endpoint</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Authentication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {ENDPOINTS.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/[0.08] text-white font-bold text-[10px]">
                        {ep.method}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-white font-medium">
                      <Link
                        href={ep.link}
                        className="hover:text-emerald-400 transition-colors underline decoration-white/[0.2]"
                      >
                        {ep.path}
                      </Link>
                    </td>
                    <td className="p-3.5 text-zinc-300 leading-relaxed">{ep.purpose}</td>
                    <td className="p-3.5 font-mono text-zinc-400 text-[11px]">{ep.auth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Authentication & Security */}
        <section className="mb-12 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Authentication &amp; Secret Isolation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Client Tracking (Public Ingestion)</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Client telemetry uses public Project IDs passed via the{" "}
                <code className="text-zinc-200 font-mono">x-project-id</code> header.
                These tokens only allow write-only telemetry commits; they cannot read or
                query analytical reports.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Server &amp; Admin APIs (Secret Keys)</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Management, visitor profile enrichment, and data export APIs require
                high-entropy API keys (<code className="text-zinc-200 font-mono">oa_live_...</code>).
                Stored as SHA-256 digests in MongoDB with constant-time verification.
              </p>
            </div>
          </div>
        </section>

        {/* Server-Side Ingestion Example */}
        <section className="mb-12 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Server-Side Telemetry Dispatch
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Record server-side events, webhooks, or background worker jobs directly
            via HTTP POST without requiring client browser execution.
          </p>

          <div className="p-4 bg-[#090a0f] border border-white/[0.08] rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto space-y-2">
            <div className="text-[11px] text-zinc-500 pb-2 border-b border-white/[0.06]">
              Node.js / TypeScript Server Event Dispatch
            </div>
            <pre className="leading-relaxed">
              <code>{`import fetch from "node-fetch";

export async function trackServerEvent(eventName: string, properties: Record<string, any>) {
  await fetch("https://api.openanalytics.org.in/v1/collect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-project-id": process.env.OPEN_ANALYTICS_PROJECT_ID!,
    },
    body: JSON.stringify({
      type: "custom_event",
      name: eventName,
      props: properties,
      url: "https://myservice.internal/jobs/billing",
      timestamp: Date.now(),
    }),
  });
}`}</code>
            </pre>
          </div>
        </section>

        {/* Next Steps */}
        <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              Ready to explore detailed ingestion payloads?
            </h3>
            <p className="text-xs text-zinc-400">
              Read the complete payload schemas, beacon contracts, and reverse proxy guides.
            </p>
          </div>

          <Link
            href="/docs/api/ingestion"
            className="px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Ingestion API Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

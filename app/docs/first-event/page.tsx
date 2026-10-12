import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/docs/first-event");

const breadcrumbSchema = generateBreadcrumbSchema("/docs/first-event");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Tracking Custom Events & Conversions Developer Guide",
  description:
    "Complete developer guide to tracking custom conversion events, button clicks, and ecommerce transactions using the Open Analytics JavaScript SDK and HTTP API.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function FirstEventDocPage() {
  const dashboardUrl = getDashboardUrl("/events");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Title */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-4">
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span>Developer Reference • Custom Events</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-sans tracking-tight">
            Tracking Custom Events &amp; Business Conversions
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed font-sans">
            Learn how to record conversions, modal opens, ecommerce transactions, and button interactions using our lightweight browser API or direct server-to-server HTTP calls.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1: Browser JavaScript API */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <Code2 className="w-5 h-5 text-white" />
              <span>1. Client-Side Browser API (`window.OpenAnalytics.track`)</span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Once the <code>open.js</code> tracker is embedded on your page, it registers the global <code>window.OpenAnalytics</code> object. You can dispatch custom events with arbitrary JSON metadata properties.
            </p>
            <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] font-mono text-xs text-zinc-300 space-y-2 overflow-x-auto">
              <div className="text-zinc-500">// Basic event dispatch</div>
              <div>window.OpenAnalytics.track(&quot;newsletter_subscribed&quot;);</div>
              <div className="text-zinc-500 pt-2">// Event with custom metadata payload</div>
              <div>
                window.OpenAnalytics.track(&quot;plan_selected&quot;, &#123;
                <div className="pl-4">plan: &quot;pro&quot;,</div>
                <div className="pl-4">billing: &quot;annual&quot;,</div>
                <div className="pl-4">source: &quot;pricing_table&quot;</div>
                &#125;);
              </div>
            </div>
          </section>

          {/* Section 2: TypeScript Safe Wrapper */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <Terminal className="w-5 h-5 text-white" />
              <span>2. TypeScript Safe Utility Wrapper</span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Because the tracker loads asynchronously (deferred), we recommend defining a typed helper function to prevent <code>undefined</code> errors during server-side rendering or before the tracker executes.
            </p>
            <div className="p-4 rounded-xl bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <pre>{`// lib/analytics.ts
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && (window as any).OpenAnalytics) {
    (window as any).OpenAnalytics.track(name, props);
  }
}`}</pre>
            </div>
          </section>

          {/* Section 3: E-commerce & SaaS Examples */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span>3. E-commerce &amp; SaaS Conversion Patterns</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2">
                <div className="text-xs font-mono font-bold text-white">E-commerce Purchase</div>
                <pre className="font-mono text-[11px] text-zinc-400 overflow-x-auto leading-relaxed">{`trackEvent("checkout_completed", {
  order_id: "ord_91823",
  currency: "USD",
  revenue: 129.00,
  items_count: 2
});`}</pre>
              </div>

              <div className="p-5 rounded-xl bg-[#111218] border border-white/[0.08] space-y-2">
                <div className="text-xs font-mono font-bold text-white">SaaS Trial Signup</div>
                <pre className="font-mono text-[11px] text-zinc-400 overflow-x-auto leading-relaxed">{`trackEvent("trial_started", {
  tier: "enterprise",
  seats_requested: 5,
  invite_code: "LAUNCH2026"
});`}</pre>
              </div>
            </div>
          </section>

          {/* Section 4: Backend Ingestion API */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <Layers className="w-5 h-5 text-white" />
              <span>4. Server-Side HTTP Ingestion</span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              To record events from Stripe webhooks, mobile apps, or backend workers where client-side JavaScript is unavailable, send a POST request directly to our edge telemetry endpoint:
            </p>
            <div className="p-4 rounded-xl bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <pre>{`curl -X POST "https://api.openanalytics.org.in/v1/collect" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "custom",
    "projectId": "prj_your_project_id",
    "name": "subscription_renewed",
    "props": {
      "plan": "pro_annual",
      "amount": 180.00
    }
  }'`}</pre>
            </div>
          </section>

          {/* Section 5: Real-Time Verification */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <Activity className="w-5 h-5 text-white" />
              <span>5. Verifying Your Events in Real Time</span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Once an event is triggered, it appears within <strong>sub-2-seconds</strong> on your dashboard. Open your Live Telemetry Feed (`/live-feed`) to inspect the incoming payload and ensure custom properties are formatted properly.
            </p>
          </section>
        </div>

        {/* Next Steps CTA */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/docs/api/ingestion"
            className="px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 font-sans"
          >
            <span>Next: Ingestion REST API</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={dashboardUrl}
            className="text-xs text-zinc-400 hover:text-white transition-colors font-sans"
          >
            Inspect Events in Console &rarr;
          </a>
        </div>
      </div>
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  Users,
  Shield,
  ArrowRight,
  Bell,
  Code2,
  Copy,
  Terminal,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import { getDashboardUrl } from "@/lib/subdomain";

export const metadata: Metadata = constructPageMetadata("/docs/first-project");

const breadcrumbSchema = generateBreadcrumbSchema("/docs/first-project");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Creating & Configuring Your First Project Guide",
  description:
    "Complete walkthrough for creating your first website project in Open Analytics, configuring apex domain equivalence, and managing team member inheritance.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function FirstProjectDocPage() {
  const dashboardUrl = getDashboardUrl("/projects");

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Title */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-4">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Getting Started • Step 01</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-sans tracking-tight">
            Creating &amp; Configuring Your First Project
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed font-sans">
            A comprehensive guide to registering your website domain, understanding apex domain matching, retrieving your project tracking ID, and inviting team collaborators.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {/* Step 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono text-xs font-bold text-white">
                1
              </div>
              <h2 className="text-xl font-bold text-white font-sans">
                Create a New Project in the Console
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Navigate to the Projects directory on your dashboard. Click the <strong>&ldquo;New Project&rdquo;</strong> button to open the project configuration modal.
            </p>
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-3 font-sans text-xs">
              <div className="font-semibold text-white">Required Fields:</div>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-white">Project Name:</span>
                  <span>A human-readable label (e.g., &ldquo;Acme Marketing Site&rdquo; or &ldquo;Production SaaS&rdquo;).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-white">Target Domain:</span>
                  <span>Your primary production domain (e.g., <code>example.com</code> or <code>app.example.com</code>).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono text-xs font-bold text-white">
                2
              </div>
              <h2 className="text-xl font-bold text-white font-sans">
                Apex &amp; Subdomain Equivalence
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Open Analytics features intelligent domain normalization. If you register <code>example.com</code>, our telemetry edge collector automatically accepts requests originating from:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>https://example.com</span>
              </div>
              <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>https://www.example.com</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              For dedicated multi-tenant subdomains (e.g. <code>dashboard.example.com</code> or <code>blog.example.com</code>), you can either track them under the apex project or create separate isolated projects to keep conversion funnels segregated.
            </p>
          </section>

          {/* Step 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono text-xs font-bold text-white">
                3
              </div>
              <h2 className="text-xl font-bold text-white font-sans">
                Retrieving Your Tracking Snippet
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Every project generates an immutable, unique <code>projectId</code> string (e.g. <code>prj_66f12ab...</code>). This ID is public and safe to include in client-side HTML.
            </p>
            <div className="p-4 rounded-lg bg-[#090a0f] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto">
              <code>&lt;script defer src=&quot;https://api.openanalytics.org.in/open.js&quot; data-project-id=&quot;prj_your_project_id&quot;&gt;&lt;/script&gt;</code>
            </div>
          </section>

          {/* Step 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono text-xs font-bold text-white">
                4
              </div>
              <h2 className="text-xl font-bold text-white font-sans">
                Team Member Access &amp; Plan Inheritance
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Open Analytics uses an owner-inheritance subscription architecture. When a project owner with an active <strong>Pro Plan</strong> invites team members (Admins, Editors, or Viewers):
            </p>
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-3 font-sans text-xs">
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Full Pro Capabilities:</strong> Invited members receive real-time AI Radar, 365-day retention windows, and rage-click telemetry on that project.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Cross-Account Leakage:</strong> Members keep their independent personal account tiers on their own private projects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Granular RBAC:</strong> Owners can assign <code>admin</code>, <code>editor</code>, or <code>member</code> roles to protect project settings and deletion rights.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Next Steps CTA */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/docs/installation"
            className="px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 font-sans"
          >
            <span>Next: Installation Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={dashboardUrl}
            className="text-xs text-zinc-400 hover:text-white transition-colors font-sans"
          >
            Create project in Console &rarr;
          </a>
        </div>
      </div>
    </>
  );
}

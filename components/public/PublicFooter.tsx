import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Heart, Github, Twitter } from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function PublicFooter() {
  const dashboardUrl = getDashboardUrl("/");
  return (
    <footer className="w-full bg-[#090a0f] border-t border-white/[0.08] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#14161f] border border-white/[0.1] flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-base text-white tracking-tight">Open Analytics</span>
            </Link>

            <p className="text-zinc-400 leading-relaxed text-xs max-w-sm">
              The modern, privacy-first web observability platform. Real User Monitoring, Core Web Vitals, behavioral rage clicks, and autonomous AI search crawler radar with zero cookie banners.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • 100% GDPR Compliant</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">Features Overview</Link>
              </li>
              <li>
                <Link href="/features#rum" className="hover:text-white transition-colors">Core Web Vitals (RUM)</Link>
              </li>
              <li>
                <Link href="/features#ai-radar" className="hover:text-white transition-colors">AI &amp; LLM Bot Radar</Link>
              </li>
              <li>
                <Link href="/features#ux" className="hover:text-white transition-colors">Behavioral Rage Clicks</Link>
              </li>
              <li>
                <Link href="/features#errors" className="hover:text-white transition-colors">Error Crash Triage</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Comparisons */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Comparisons</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/vs-google-analytics" className="hover:text-white transition-colors">vs Google Analytics 4</Link>
              </li>
              <li>
                <Link href="/vs-google-analytics#privacy" className="hover:text-white transition-colors">Cookieless vs Cookies</Link>
              </li>
              <li>
                <Link href="/vs-google-analytics#speed" className="hover:text-white transition-colors">Script Size Comparison</Link>
              </li>
              <li>
                <Link href="/vs-google-analytics#pricing" className="hover:text-white transition-colors">GA4 Migration Guide</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Trust &amp; Docs</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/docs/installation" className="hover:text-white transition-colors">Framework Integration</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy &amp; GDPR Details</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <a href={dashboardUrl} className="hover:text-white transition-colors font-medium">Platform Console</a>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Machine Discovery & Compliance Badges */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} Open Analytics. Built for the privacy-first web.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-zinc-400">Zero Cookies • Zero IP Storage</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link href="/llms.txt" className="text-zinc-400 hover:text-white transition-colors">llms.txt</Link>
            <Link href="/llms-full.txt" className="text-zinc-400 hover:text-white transition-colors">llms-full.txt</Link>
            <Link href="/agents.md" className="text-zinc-400 hover:text-white transition-colors">agents.md</Link>
            <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Architecture</Link>
            <Link href="/sitemap.xml" className="text-zinc-400 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

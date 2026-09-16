import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Heart, Github, Twitter } from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function PublicFooter() {
  const dashboardUrl = getDashboardUrl("/");
  return (
    <footer className="w-full bg-[#040711] border-t border-white/[0.08] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px]">
                <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">Open Analytics</span>
            </Link>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              The modern, privacy-first web observability platform. Real User Monitoring, Core Web Vitals, behavioral rage clicks, and autonomous AI search crawler radar with zero cookie banners.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-glow" />
              <span>All Systems Operational • 100% GDPR Compliant</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/features" className="hover:text-cyan-400 transition">Features Overview</Link>
              </li>
              <li>
                <Link href="/features#rum" className="hover:text-cyan-400 transition">Core Web Vitals (RUM)</Link>
              </li>
              <li>
                <Link href="/features#ai-radar" className="hover:text-cyan-400 transition">AI &amp; LLM Bot Radar</Link>
              </li>
              <li>
                <Link href="/features#ux" className="hover:text-cyan-400 transition">Behavioral Rage Clicks</Link>
              </li>
              <li>
                <Link href="/features#errors" className="hover:text-cyan-400 transition">Error Crash Triage</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Comparisons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Comparisons</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/vs-google-analytics" className="hover:text-cyan-400 transition">vs Google Analytics 4</Link>
              </li>
              <li>
                <Link href="/vs-google-analytics#privacy" className="hover:text-cyan-400 transition">Cookieless vs Cookies</Link>
              </li>
              <li>
                <Link href="/vs-google-analytics#speed" className="hover:text-cyan-400 transition">Script Size Comparison</Link>
              </li>
              <li>
                <Link href="/vs-google-analytics#pricing" className="hover:text-cyan-400 transition">GA4 Migration Guide</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust &amp; Docs</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/docs" className="hover:text-cyan-400 transition">Documentation</Link>
              </li>
              <li>
                <Link href="/docs/installation" className="hover:text-cyan-400 transition">Framework Integration</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400 transition">Pricing Plans</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition">Privacy &amp; GDPR Details</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition">Frequently Asked Questions</Link>
              </li>
              <li>
                <a href={dashboardUrl} className="hover:text-cyan-400 transition font-medium">Platform Console</a>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Machine Discovery & Compliance Badges */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} Open Analytics. Built for the privacy-first web.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-slate-400">Zero Cookies • Zero IP Storage</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link href="/llms.txt" className="text-slate-400 hover:text-cyan-400 transition">llms.txt</Link>
            <Link href="/llms-full.txt" className="text-slate-400 hover:text-cyan-400 transition">llms-full.txt</Link>
            <Link href="/agents.md" className="text-slate-400 hover:text-cyan-400 transition">agents.md</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-cyan-400 transition">Privacy Architecture</Link>
            <Link href="/sitemap.xml" className="text-slate-400 hover:text-cyan-400 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

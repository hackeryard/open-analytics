import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Heart, Github, Twitter } from "lucide-react";

export default function PublicFooter() {
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
                <Link href="/pricing" className="hover:text-cyan-400 transition">Pricing Plans</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition">Privacy &amp; GDPR Details</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition">Create Free Account</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Open Analytics. Built for the privacy-first web.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Architecture</Link>
            <Link href="/faq" className="hover:text-slate-300 transition">AEO Knowledge Base</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

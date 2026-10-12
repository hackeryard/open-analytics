"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Code2,
  Terminal,
  ShieldCheck,
  Bell,
  Bot,
  ChevronRight,
  Menu,
  X,
  Layers,
} from "lucide-react";

export default function DocsClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileDocsDrawerOpen, setMobileDocsDrawerOpen] = useState(false);

  // Close mobile docs drawer on route navigation
  useEffect(() => {
    setMobileDocsDrawerOpen(false);
  }, [pathname]);

  const navSections = [
    {
      title: "Getting Started",
      links: [
        { href: "/docs", label: "Overview & Architecture", icon: BookOpen },
        { href: "/docs/first-project", label: "First Project Setup", icon: BookOpen },
        { href: "/docs/installation", label: "Installation Guides", icon: Code2, badge: "Popular" },
        { href: "/docs/first-event", label: "Custom Event Tracking", icon: Code2 },
        { href: "/docs/verification", label: "Testing & Verification", icon: Terminal },
      ],
    },
    {
      title: "Framework Integrations",
      links: [
        { href: "/developers/nextjs-analytics", label: "Next.js", icon: Code2 },
        { href: "/developers/react-analytics", label: "React", icon: Code2 },
        { href: "/developers/javascript-analytics", label: "Vanilla JS", icon: Code2 },
        { href: "/developers/vue-analytics", label: "Vue.js", icon: Code2 },
        { href: "/developers/astro-analytics", label: "Astro", icon: Code2 },
        { href: "/developers/svelte-analytics", label: "Svelte & SvelteKit", icon: Code2 },
      ],
    },
    {
      title: "Observability Modules",
      links: [
        { href: "/docs/web-vitals", label: "Core Web Vitals & RUM", icon: Activity },
        { href: "/docs/seo-aeo", label: "SEO & AI Crawler Radar", icon: Bot },
        { href: "/docs/alerts", label: "Alerts & Incident Engine", icon: Bell, badge: "New" },
      ],
    },
    {
      title: "API & Infrastructure",
      links: [
        { href: "/docs/api/ingestion", label: "Edge Telemetry Ingestion", icon: Terminal },
        { href: "/self-hosting", label: "Self-Hosting Guide", icon: Code2 },
      ],
    },
    {
      title: "Comparisons & Alternatives",
      links: [
        { href: "/vs-google-analytics", label: "vs Google Analytics", icon: Layers },
        { href: "/alternatives/plausible", label: "vs Plausible", icon: BookOpen },
        { href: "/alternatives/umami", label: "vs Umami", icon: Terminal },
        { href: "/alternatives/matomo", label: "vs Matomo", icon: Layers },
        { href: "/alternatives/posthog", label: "vs PostHog", icon: Activity },
      ],
    },
    {
      title: "Free Developer Tools",
      links: [
        { href: "/tools/utm-builder", label: "UTM Campaign Builder", icon: Code2 },
        { href: "/tools/ai-crawler-checker", label: "AI Crawler Tester", icon: Bot },
        { href: "/tools/core-web-vitals-checker", label: "Web Vitals Calculator", icon: Activity },
      ],
    },
  ];

  // Find active doc label for mobile breadcrumb
  const currentDocLink = navSections
    .flatMap((s) => s.links)
    .find((l) => l.href === pathname);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#090a0f] text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* Mobile Docs Sub-Navigation Bar */}
      <div className="md:hidden sticky top-16 z-30 bg-[#090a0f]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/docs" className="font-semibold text-zinc-400 hover:text-white transition">
            Docs
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-mono font-medium truncate max-w-[200px]">
            {currentDocLink?.label || "Overview"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileDocsDrawerOpen(!mobileDocsDrawerOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
          aria-label="Toggle docs navigation"
        >
          {mobileDocsDrawerOpen ? <X size={14} /> : <Menu size={14} />}
          <span>{mobileDocsDrawerOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Docs Navigation Drawer */}
      {mobileDocsDrawerOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0c0d14] px-4 py-4 space-y-4 animate-fadeIn">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 px-2">
                {section.title}
              </span>
              <nav className="space-y-1">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileDocsDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? "bg-white/[0.1] text-white shadow-xs font-semibold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sticky Desktop Sidebar Navigation */}
        <aside className="w-64 shrink-0 border-r border-white/[0.08] p-6 hidden md:flex flex-col justify-between space-y-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                  {section.title}
                </span>
                <nav className="space-y-1">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                          isActive
                            ? "bg-white/[0.1] text-white shadow-xs font-semibold"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <div className="p-3.5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-1.5">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Zero-Cookie Policy
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Open Analytics operates without persistent tracking cookies. Fully compliant with GDPR, CCPA, and PECR.
              </p>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Code2,
  Cpu,
  FileCode2,
  FileText,
  Globe,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
  ArrowLeft,
  Bot,
  Flame,
  Bug,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function DocsClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeProjectId } = usePlatform();

  const navSections = [
    {
      title: "Getting Started",
      links: [
        { href: "/docs", label: "Overview & Architecture", icon: BookOpen },
        { href: "/docs/installation", label: "Installation Guides", icon: Code2, badge: "Popular" },
        { href: "/docs/verification", label: "Testing & Verification", icon: Terminal },
      ],
    },
    {
      title: "Observability Modules",
      links: [
        { href: "/docs/web-vitals", label: "Core Web Vitals & RUM", icon: Activity },
        { href: "/docs/seo-aeo", label: "SEO & AI Crawler Radar", icon: Bot, badge: "New" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Docs Top Bar */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold text-base tracking-tight text-foreground">
              Open Analytics <span className="text-cyan-400 font-mono text-xs ml-1 font-semibold">Docs</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <span>/</span>
            <span className="font-mono">v1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/docs/installation"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/20 transition"
          >
            <Code2 size={13} />
            <span>Quickstart</span>
          </Link>
          <a
            href="https://dashboard.openanalytics.org.in"
            className="px-3.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5"
          >
            <span>Launch Dashboard</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sticky Sidebar Navigation */}
        <aside className="w-64 shrink-0 border-r border-border p-6 hidden md:flex flex-col justify-between space-y-8 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-mono">
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
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          <div className="pt-4 border-t border-border space-y-3">
            <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Zero-Cookie Policy
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
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

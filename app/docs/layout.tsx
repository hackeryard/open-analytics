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

export default function DocsLayout({ children }: { children: React.ReactNode }) {
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
            <div>
              <span className="font-extrabold text-base tracking-tight text-foreground">Pulse</span>
              <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold uppercase">
                Docs
              </span>
            </div>
          </Link>

          <span className="text-xs text-muted-foreground font-mono hidden md:inline px-2 py-0.5 rounded bg-muted border border-border">
            v1.0.4 Enterprise
          </span>
        </div>

        <div className="flex items-center gap-3">
          {activeProjectId && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border text-xs font-mono text-muted-foreground">
              <span>Active Project:</span>
              <span className="text-cyan-400 font-bold">{activeProjectId}</span>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted/50 hover:bg-muted border border-border text-xs font-bold text-foreground transition"
          >
            <ArrowLeft size={13} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/docs/installation"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-sm"
          >
            <Zap size={13} />
            <span>Install Tracker</span>
          </Link>
        </div>
      </header>

      {/* Docs Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 border-r border-border p-4 sm:p-6 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground px-3">
                {section.title}
              </h4>
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
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={14} className={isActive ? "text-white" : "text-cyan-400"} />
                        <span className="truncate">{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
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
                Pulse operates without persistent tracking cookies. Fully compliant with GDPR, CCPA, and PECR.
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

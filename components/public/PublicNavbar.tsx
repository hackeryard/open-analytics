"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dashboardUrl = getDashboardUrl("/");

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/vs-google-analytics", label: "vs Google Analytics", badge: "Compare" },
    { href: "/pricing", label: "Pricing" },
    { href: "/privacy", label: "Privacy & GDPR" },
    { href: "/faq", label: "FAQ" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050811]/90 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400 animate-glow" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition">
              Open
            </span>
            <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase font-bold tracking-wider">
              Analytics
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/docs" && pathname.startsWith("/docs"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions (Launch Dashboard CTA & Status Indicator) */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow" />
            <span>Telemetry Operational</span>
          </div>
          <a
            href={dashboardUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:via-sky-300 hover:to-indigo-300 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <LayoutDashboard size={14} />
            <span>Launch Dashboard</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#070b16] px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/docs" && pathname.startsWith("/docs"));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                  isActive ? "text-cyan-300 bg-white/[0.08]" : "text-slate-200 hover:bg-white/[0.05]"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <a
              href={dashboardUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 shadow-md shadow-cyan-500/20"
            >
              <LayoutDashboard size={14} />
              <span>Launch Dashboard</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

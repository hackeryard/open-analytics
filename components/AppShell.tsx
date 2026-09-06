"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Radio,
  UserCheck,
  Search,
  Globe,
  Bot,
  Flame,
  Share2,
  Layers,
  Compass,
  Sliders,
  Zap,
  Bug,
  BookOpen,
  FileText,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  LogOut,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Code2,
  Laptop,
  Smartphone,
  Menu,
  X,
  Copy,
  Check,
  ChevronLeft,
  SlidersHorizontal,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Terminal,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import DateRangeNavigator from "@/components/DateRangeNavigator";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currentUser,
    projects,
    activeProjectId,
    setActiveProjectId,
    timeRange,
    setTimeRange,
    data,
    loading,
    pvLoading,
    fetchData,
    demoMode,
    setDemoMode,
    liveVisitorCount,
    showNewProjectModal,
    setShowNewProjectModal,
    handleCreateProject,
    handleLogout,
  } = usePlatform();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [copiedProjectId, setCopiedProjectId] = useState(false);

  // New project modal state
  const [newPrjName, setNewPrjName] = useState("");
  const [newPrjDomains, setNewPrjDomains] = useState("*");
  const [creatingPrj, setCreatingPrj] = useState(false);

  // Quick Install Code Modal state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [installTab, setInstallTab] = useState<"html" | "nextjs" | "react" | "curl">("html");
  const [testingPing, setTestingPing] = useState(false);
  const [testPingResult, setTestPingResult] = useState<null | { ok: boolean; message: string }>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const activeProject = projects.find((p) => p.projectId === activeProjectId);

  const copyProjectId = () => {
    if (!activeProjectId) return;
    navigator.clipboard.writeText(activeProjectId);
    setCopiedProjectId(true);
    setTimeout(() => setCopiedProjectId(false), 2000);
  };

  const copyInstallSnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const hostUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3005";
  const prjKey = activeProjectId || "prj_openlabs";

  const sendTestPing = async () => {
    setTestingPing(true);
    setTestPingResult(null);
    try {
      const res = await fetch(`${hostUrl}/api/v1/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pageview",
          projectId: prjKey,
          pathname: "/quick-install-verification",
          title: "Quick Install Verification Ping",
          visitorId: "v_verify_" + Date.now(),
          sessionId: "s_verify_" + Date.now(),
          device: "desktop",
          browser: "Verification Inspector",
          os: "Windows",
          country: "Localhost",
        }),
      });
      const result = await res.json();
      if (res.ok && result.success !== false) {
        setTestPingResult({ ok: true, message: "Telemetry ping received (200 OK)! Integration verified." });
        fetchData();
      } else {
        setTestPingResult({ ok: false, message: result.error || "Failed to record verification ping." });
      }
    } catch (err: any) {
      setTestPingResult({ ok: false, message: err.message || "Network error sending test event." });
    } finally {
      setTestingPing(false);
    }
  };

  const onSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrjName.trim()) return;
    setCreatingPrj(true);
    const success = await handleCreateProject(newPrjName, newPrjDomains);
    setCreatingPrj(false);
    if (success) {
      setNewPrjName("");
      setNewPrjDomains("*");
      setShowNewProjectModal(false);
    }
  };

  const navGroups = [
    {
      group: "Analytics",
      items: [
        { href: "/", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/live-feed", label: "Live Telemetry", icon: Radio, pulse: true, badge: data?.overview?.totalViews ? `${data.overview.totalViews.toLocaleString()}` : undefined },
      ],
    },
    {
      group: "Product & Audience",
      items: [
        { href: "/returning-users", label: "Retention & Cohorts", icon: UserCheck, badge: `${data?.retention?.returnRate ?? data?.overview?.returnRate ?? 42}%` },
        { href: "/journeys", label: "User Journeys", icon: Share2 },
        { href: "/pages", label: "Top Pages & Routes", icon: Layers, badge: data?.topPages?.length ? `${data.topPages.length}` : undefined },
        { href: "/events", label: "Custom Events", icon: Zap, badge: data?.recentEvents?.length ? `${data.recentEvents.length}` : undefined },
        ...(data?.labIntelligence?.overview?.totalStarts || data?.labIntelligence?.overview?.totalCompletions
          ? [{ href: "/labs", label: "Virtual Labs", icon: BookOpen }]
          : []),
      ],
    },
    {
      group: "Performance & Quality",
      items: [
        { href: "/vitals", label: "Web Vitals (RUM)", icon: Activity, badge: data?.webVitals?.overall?.lcp ? `${(data.webVitals.overall.lcp / 1000).toFixed(2)}s` : "Optimal" },
        { href: "/errors", label: "Crash & Errors", icon: Bug, badge: data?.errorStats?.totalErrors ? `${data.errorStats.totalErrors}` : "0", alert: (data?.errorStats?.totalErrors || 0) > 0 },
        { href: "/ux", label: "Behavioral UX", icon: Flame, badge: data?.behavioralSignals?.rageClicks?.length ? `${data.behavioralSignals.rageClicks.length} rage` : undefined },
        { href: "/tech", label: "Devices & Tech", icon: Laptop },
      ],
    },
    {
      group: "Growth & Radar",
      items: [
        { href: "/geo", label: "GEO World Atlas", icon: Globe, badge: data?.countries?.length ? `${data.countries.length}` : undefined },
        { href: "/acquisition", label: "Acquisition & Sources", icon: Compass },
        { href: "/seo", label: "SEO & Search", icon: Search },
        { href: "/ai-aeo", label: "AI & AEO Radar", icon: Bot, badge: data?.aiVisibility?.overview?.totalAiCrawlerHits ? `${data.aiVisibility.overview.totalAiCrawlerHits}` : undefined },
      ],
    },
    {
      group: "Setup & Integration",
      items: [
        ...(activeProjectId
          ? [
              { href: `/projects/${activeProjectId}/install`, label: "Install Tracking Script", icon: Code2 },
              { href: `/projects/${activeProjectId}/settings`, label: "Workspace Settings", icon: Settings },
              { href: `/projects/${activeProjectId}/settings#team`, label: "Team & Permissions", icon: Users },
            ]
          : []),
        { href: "/docs", label: "Developer Docs & API", icon: FileText },
      ],
    },
  ];

  // Don't wrap login/register in app shell
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    return <>{children}</>;
  }

  const snippets: Record<string, { title: string; targetFile: string; badge: string; description: string; code: string }> = {
    html: {
      title: "HTML / CDN Script",
      targetFile: "index.html",
      badge: "Fastest • Zero-Config",
      description: "Paste into the <head> or right before the closing </body> tag of your website.",
      code: `<script defer src="${hostUrl}/pulse.js" data-project-id="${prjKey}"></script>`,
    },
    nextjs: {
      title: "Next.js (App Router)",
      targetFile: "app/layout.tsx",
      badge: "Next.js Native",
      description: "Embed inside your RootLayout using Next.js's native Script component.",
      code: `import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="${hostUrl}/pulse.js"
          data-project-id="${prjKey}"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`,
    },
    react: {
      title: "React / Vite / SPA",
      targetFile: "src/App.tsx",
      badge: "Single Page App",
      description: "Asynchronously loads the tracking beacon when the client application mounts.",
      code: `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const script = document.createElement("script");
    script.src = "${hostUrl}/pulse.js";
    script.setAttribute("data-project-id", "${prjKey}");
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return <YourAppRouter />;
}`,
    },
    curl: {
      title: "cURL / REST API",
      targetFile: "Terminal / CI Pipeline",
      badge: "HTTP Ingestion",
      description: "Transmit custom telemetry payloads directly via HTTP POST into Pulse.",
      code: `curl -X POST "${hostUrl}/api/v1/collect" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "pageview",
    "projectId": "${prjKey}",
    "pathname": "/api-demo",
    "title": "API Ping Test",
    "country": "US"
  }'`,
    },
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ============================================================ */}
      {/* DESKTOP COLLAPSIBLE SIDEBAR                                  */}
      {/* ============================================================ */}
      <aside
        className={`hidden lg:flex flex-col glass-sidebar fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.07] shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 shrink-0 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-400 transition">Pulse</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase font-bold tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground truncate">Web Observability</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Project Switcher Badge */}
        {!sidebarCollapsed ? (
          <div className="p-3 border-b border-white/[0.07]">
            <div className="relative">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-black shrink-0">
                    {activeProject?.name ? activeProject.name[0].toUpperCase() : "P"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition">
                      {activeProject?.name || activeProjectId || "Select Project"}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">
                      {activeProjectId || "no project"}
                    </div>
                  </div>
                </div>
                <ChevronDown size={14} className="text-muted-foreground shrink-0 group-hover:text-white transition" />
              </button>

              {/* Project Dropdown */}
              {showProjectDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProjectDropdown(false)} />
                  <div className="absolute left-0 top-full mt-1.5 w-64 glass-card rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-fadeIn border border-white/[0.12]">
                    <div className="px-2.5 py-1.5 border-b border-white/[0.08] text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>Workspaces</span>
                      <span className="text-cyan-400 font-mono">{projects.length} total</span>
                    </div>

                    <div className="max-h-52 overflow-y-auto space-y-0.5">
                      {projects.map((p) => {
                        const isSelected = p.projectId === activeProjectId;
                        return (
                          <button
                            key={p._id || p.projectId}
                            onClick={() => {
                              setActiveProjectId(p.projectId);
                              setShowProjectDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                              isSelected ? "bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30" : "text-slate-300 hover:bg-white/[0.05]"
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 border-t border-white/[0.08]">
                      <button
                        onClick={() => {
                          setShowProjectDropdown(false);
                          setShowNewProjectModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Create Project</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2.5 flex justify-center border-b border-white/[0.07]">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-black transition"
              title={activeProject?.name || activeProjectId}
            >
              {activeProject?.name ? activeProject.name[0].toUpperCase() : "P"}
            </button>
          </div>
        )}

        {/* Grouped Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
                  {group.group}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all group relative ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <div className="relative shrink-0">
                        <Icon size={16} className={isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"} />
                        {item.pulse && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>

                      {!sidebarCollapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full truncate ml-1 font-bold ${
                                item.alert
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : isActive
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "bg-white/[0.05] text-slate-400 group-hover:text-slate-200"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Account & Logout Footer */}
        <div className="p-3 border-t border-white/[0.07] shrink-0 bg-white/[0.01]">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-muted-foreground capitalize flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                      {currentUser.role.replace("_", " ")}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/25 transition"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE DRAWER OVERLAY                                        */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] glass-sidebar p-4 flex flex-col h-full z-10 animate-fadeInLeft">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Activity size={18} />
                </div>
                <span className="font-black text-white text-base">Pulse Analytics</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                          isActive ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-300 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/[0.06] text-slate-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.07]">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA & TOP COMMAND BAR                          */}
      {/* ============================================================ */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        {/* Top Command Bar */}
        <header className="sticky top-0 z-30 h-14 glass-header px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle, Breadcrumb & Live Visitor Beacon */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs font-bold min-w-0">
              <span className="text-white truncate max-w-[140px]">
                {activeProject?.name || activeProjectId || "Pulse"}
              </span>
              <span className="text-slate-600 font-normal">/</span>
              <span className="text-cyan-400 capitalize truncate">
                {pathname === "/" ? "Overview" : pathname.replace("/", "").replace(/-/g, " ")}
              </span>
            </div>

            {/* Live Telemetry Pulse Beacon */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold shadow-xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{liveVisitorCount} Live</span>
            </div>
          </div>

          {/* Right: Date Picker, Demo Toggle Pill, Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Date Range Navigator */}
            <DateRangeNavigator value={timeRange} onChange={setTimeRange} />

            {/* Compact Demo / Live Mode Switch */}
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                demoMode
                  ? "bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25 shadow-xs shadow-violet-500/20"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
              }`}
              title={demoMode ? "Demo Mode Active (28.4k simulated events). Click to switch to live DB." : "Live Database Mode. Click for Demo Telemetry."}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${demoMode ? "bg-violet-400 animate-pulse" : "bg-slate-500"}`} />
              <span>{demoMode ? "Demo Data" : "Live DB"}</span>
            </button>

            {/* Quick Install Snippet Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-cyan-400 transition cursor-pointer"
              title="View Tracking Script Snippet"
            >
              <Code2 size={14} />
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchData()}
              disabled={loading || pvLoading}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-cyan-400 transition cursor-pointer disabled:opacity-50"
              title="Refresh Telemetry"
            >
              <RefreshCw size={13} className={loading || pvLoading ? "animate-spin text-cyan-400" : ""} />
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>

      {/* ============================================================ */}
      {/* QUICK INSTALL MODAL (ENTERPRISE REDESIGN)                     */}
      {/* ============================================================ */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop with strong blur and tint */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fadeIn"
            onClick={() => setShowInstallModal(false)}
          />

          {/* Modal Container */}
          <div className="relative max-w-2xl w-full bg-[#080d1a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_60px_rgba(6,182,212,0.15)] space-y-5 z-10 animate-fadeIn overflow-hidden">
            {/* Ambient decorative gradient top-bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Title, Specs & Close */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20 shrink-0">
                  <Code2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Connect Website Telemetry</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase tracking-wider">
                      SDK v2.4
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Collect Core Web Vitals, visitor journeys, and UX signals with 1 line of code.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Quick Copy Project ID Pill */}
                <button
                  onClick={copyProjectId}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                  title="Copy Project ID"
                >
                  <span className="text-slate-500">ID:</span>
                  <span className="font-bold text-white truncate max-w-[100px]">{prjKey}</span>
                  {copiedProjectId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>

                <button
                  onClick={() => setShowInstallModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Framework Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-x-auto">
              {[
                { id: "html", label: "HTML / CDN", icon: Globe },
                { id: "nextjs", label: "Next.js", icon: Sparkles },
                { id: "react", label: "React / SPA", icon: Code2 },
                { id: "curl", label: "cURL / API", icon: Terminal },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = installTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setInstallTab(tab.id as any);
                      setCopiedSnippet(false);
                    }}
                    className={`flex-1 min-w-[105px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Code Block Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-medium text-slate-300 text-[11px] sm:text-xs">{snippets[installTab].description}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-cyan-400 font-semibold shrink-0 ml-2">
                  {snippets[installTab].badge}
                </span>
              </div>

              {/* Terminal / Code Editor Window */}
              <div className="relative rounded-2xl bg-[#040711] border border-white/[0.12] shadow-inner overflow-hidden group">
                {/* Window Header */}
                <div className="h-9 px-3.5 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      {snippets[installTab].targetFile}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">&lt; 3.2 KB brotli</span>
                    <button
                      onClick={() => copyInstallSnippet(snippets[installTab].code)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-cyan-500/20 border border-white/[0.1] text-[11px] font-bold text-slate-200 hover:text-cyan-300 transition cursor-pointer"
                    >
                      {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedSnippet ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto selection:bg-cyan-500/30 selection:text-white leading-relaxed max-h-[170px]">
                  {snippets[installTab].code}
                </pre>
              </div>
            </div>

            {/* Live Ingestion Verification Bar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div>
                  <span className="font-bold text-white">Live Inbound Ingestion: </span>
                  <span className="text-muted-foreground">Ready for telemetry beacons</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {testPingResult && (
                  <span className={`text-xs font-semibold flex items-center gap-1 ${testPingResult.ok ? "text-emerald-400" : "text-rose-400"}`}>
                    {testPingResult.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {testPingResult.ok ? "Ping Verified!" : "Failed"}
                  </span>
                )}
                <button
                  onClick={sendTestPing}
                  disabled={testingPing}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {testingPing ? (
                    <RefreshCw size={12} className="animate-spin text-cyan-400" />
                  ) : (
                    <Zap size={12} className="text-cyan-400" />
                  )}
                  <span>{testingPing ? "Pinging..." : "Send Test Ping"}</span>
                </button>
              </div>
            </div>

            {/* 3-Col Architectural Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">Zero Cookies</div>
                  <div className="text-[10px] text-muted-foreground">100% GDPR & CCPA compliant</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
                <Zap size={16} className="text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">0ms Main Thread</div>
                  <div className="text-[10px] text-muted-foreground">Async defer non-blocking</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
                <Activity size={16} className="text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">Full Telemetry</div>
                  <div className="text-[10px] text-muted-foreground">Vitals, rage clicks & journeys</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.07]">
              <Link
                href="/docs"
                onClick={() => setShowInstallModal(false)}
                className="text-xs text-muted-foreground hover:text-cyan-400 font-semibold flex items-center gap-1 transition"
              >
                Developer API Docs &rarr;
              </Link>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={`/projects/${prjKey}/install`}
                  onClick={() => setShowInstallModal(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
                >
                  <span>Full Setup Guide</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NEW PROJECT MODAL                                            */}
      {/* ============================================================ */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setShowNewProjectModal(false)} />
          <div className="relative max-w-md w-full glass-card border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Create New Workspace</h3>
              <button onClick={() => setShowNewProjectModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmitCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Project / Application Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Web App"
                  value={newPrjName}
                  onChange={(e) => setNewPrjName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/60 placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Allowed Domains</label>
                <input
                  type="text"
                  placeholder="e.g. acme.com, localhost:3000 or *"
                  value={newPrjDomains}
                  onChange={(e) => setNewPrjDomains(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/60 placeholder:text-muted-foreground"
                />
                <p className="text-[10px] text-muted-foreground">Comma-separated or * for all domains</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPrj}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {creatingPrj ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

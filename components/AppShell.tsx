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
  FolderGit2,
  CreditCard,
  User,
  Lock,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import DateRangeNavigator from "@/components/DateRangeNavigator";
import NotificationCenterPopover from "@/components/NotificationCenterPopover";
import CreateProjectModal from "@/components/CreateProjectModal";
import LimitReachedModal from "@/components/LimitReachedModal";
import ActiveProjectSelectionModal from "@/components/ActiveProjectSelectionModal";
import BrowserNotificationPrompt from "@/components/BrowserNotificationPrompt";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { isDashboardClient, getMainDomainUrl } from "@/lib/subdomain";

export default function AppShell({
  children,
  initialIsDashboard = false,
}: {
  children: React.ReactNode;
  initialIsDashboard?: boolean;
}) {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(initialIsDashboard);

  useEffect(() => {
    setIsDashboard(isDashboardClient());
  }, []);
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
    checkAuth,
    liveVisitorCount,
    showNewProjectModal,
    setShowNewProjectModal,
    showLimitModal,
    setShowLimitModal,
    canCreateProject,
    openCreateProject,
    ownedProjectsCount,
    maxAllowedProjects,
    showActiveProjectModal,
    setShowActiveProjectModal,
    isPlanExpired,
    requiresActiveProjectSelection,
    handleCreateProject,
    handleLogout,
    unreadNotificationsCount,
    criticalNotificationsCount,
  } = usePlatform();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showHeaderProjectDropdown, setShowHeaderProjectDropdown] = useState(false);
  const [showMobileDrawerProjectDropdown, setShowMobileDrawerProjectDropdown] = useState(false);
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
  const isPro = activeProject?.plan === "pro" || activeProject?.plan === "enterprise";

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

  const hostUrl = typeof window !== "undefined" && !window.location.host.includes("localhost") && !window.location.host.includes("127.0.0.1") ? window.location.origin : "https://openanalytics.org.in";
  const prjKey = activeProjectId || "prj_openlabs";

  const sendTestPing = async () => {
    setTestingPing(true);
    setTestPingResult(null);
    try {
      const res = await fetch("/api/v1/collect", {
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
          country: "United States",
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
        { href: "/live-feed", label: "Live Telemetry", icon: Radio, live: true },
        { href: "/notifications", label: "Alerts & Incidents", icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined, alert: criticalNotificationsCount > 0 },
      ],
    },
    {
      group: "Product & Audience",
      items: [
        { href: "/audience", label: "Audience & Loyalty", icon: Users },
        { href: "/journeys", label: "User Journeys", icon: Share2 },
        { href: "/pages", label: "Top Pages & Routes", icon: Layers },
        { href: "/events", label: "Custom Events", icon: Zap, pro: true },
        ...(data?.labIntelligence?.overview?.totalStarts || data?.labIntelligence?.overview?.totalCompletions
          ? [{ href: "/labs", label: "Virtual Labs", icon: BookOpen }]
          : []),
      ],
    },
    {
      group: "Performance & Quality",
      items: [
        { href: "/vitals", label: "Web Vitals (RUM)", icon: Activity, pro: true },
        { href: "/errors", label: "Crash & Errors", icon: Bug, pro: true, badge: (data?.errorStats?.totalErrors || 0) > 0 ? `${data?.errorStats?.totalErrors}` : undefined, alert: (data?.errorStats?.totalErrors || 0) > 0 },
        { href: "/ux", label: "Behavioral UX", icon: Flame, pro: true },
        { href: "/devices", label: "Devices & Tech", icon: Laptop },
      ],
    },
    {
      group: "Growth & Radar",
      items: [
        { href: "/geo", label: "Audience Geography", icon: Globe },
        { href: "/acquisition", label: "Acquisition & Sources", icon: Compass },
        { href: "/seo", label: "SEO & Search", icon: Search },
        { href: "/ai-visibility", label: "GEO & AI Radar", icon: Bot, pro: true },
      ],
    },
    {
      group: "Account & Plans",
      items: [
        {
          href: "/billing",
          label: "Billing & Plans",
          icon: CreditCard,
          badge: currentUser?.plan ? currentUser.plan.toUpperCase() : "FREE",
        },
        {
          href: "/profile",
          label: "Developer Profile",
          icon: User,
        },
        ...(currentUser?.role === "super_admin"
          ? [
              {
                href: "/admin/subscriptions",
                label: "Subscription Requests",
                icon: ShieldAlert,
                badge: "Super Admin",
              },
            ]
          : []),
      ],
    },
    {
      group: "Setup & Integration",
      items: [
        { href: "/projects", label: "Manage Projects", icon: FolderGit2 },
        ...(activeProjectId
          ? [
              { href: `/projects/${activeProjectId}/install`, label: "Install Tracking Script", icon: Code2 },
              { href: `/projects/${activeProjectId}/settings`, label: "Workspace Settings", icon: Settings },
              { href: `/projects/${activeProjectId}/settings#team`, label: "Team & Permissions", icon: Users },
            ]
          : []),
        { href: "/docs", label: "Developer Docs & API", icon: FileText },
        { href: getMainDomainUrl("/"), label: "Main Website", icon: Globe, external: true },
      ],
    },
  ];

  // Don't wrap login/register in app shell
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    return <>{children}</>;
  }

  // On the main domain, ALWAYS render the marketing shell (PublicNavbar + content + PublicFooter)
  // On the dashboard subdomain, render the analytics platform workspace
  if (!isDashboard) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 selection:bg-white/[0.15] selection:text-white">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    );
  }

  const snippets: Record<string, { title: string; targetFile: string; badge: string; description: string; code: string }> = {
    html: {
      title: "HTML / CDN Script",
      targetFile: "index.html",
      badge: "Fastest • Zero-Config",
      description: "Paste into the <head> or right before the closing </body> tag of your website.",
      code: `<script defer src="${hostUrl}/open.js" data-project-id="${prjKey}"></script>`,
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
          src="${hostUrl}/open.js"
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
    script.src = "${hostUrl}/open.js";
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
      description: "Transmit custom telemetry payloads directly via HTTP POST into Open Analytics.",
      code: `curl -X POST "${hostUrl}/api/v1/collect" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "pageview",
    "projectId": "${prjKey}",
    "pathname": "/",
    "title": "Production Landing",
    "country": "US"
  }'`,
    },
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* DESKTOP COLLAPSIBLE SIDEBAR                                  */}
      {/* ============================================================ */}
      <aside
        className={`hidden lg:flex flex-col glass-sidebar fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.08] shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-8 h-8 rounded-lg bg-[#14161f] border border-white/[0.1] flex items-center justify-center shrink-0 group-hover:border-white/[0.2] transition">
              <Activity className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-white group-hover:text-zinc-200 transition">Open Analytics</span>
                  {isPro && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] border border-white/[0.1] text-zinc-300 uppercase font-medium tracking-wider">
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 truncate">Web Observability</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Project Switcher Badge */}
        {!sidebarCollapsed ? (
          <div className="p-3 border-b border-white/[0.08]">
            <div className="relative">
              <button
                onClick={() => {
                  if (projects.length === 0) {
                    openCreateProject();
                  } else {
                    setShowProjectDropdown(!showProjectDropdown);
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-300 text-xs font-semibold shrink-0">
                    {activeProject?.name ? activeProject.name[0].toUpperCase() : "+"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition">
                      {activeProject?.name || (projects.length === 0 ? "Create First Project" : "Select Project")}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate">
                      {activeProjectId || (projects.length === 0 ? "Click to setup" : "no project")}
                    </div>
                  </div>
                </div>
                <ChevronDown size={14} className="text-zinc-500 shrink-0 group-hover:text-zinc-300 transition" />
              </button>

              {/* Project Dropdown */}
              {showProjectDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProjectDropdown(false)} />
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#111218] rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-fadeIn border border-white/[0.08]">
                    <div className="px-2.5 py-1.5 border-b border-white/[0.08] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Workspaces</span>
                      <span className="text-zinc-300 font-mono">{projects.length} total</span>
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
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                              isSelected ? "bg-white/[0.08] text-white font-medium border border-white/[0.08]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 border-t border-white/[0.08]">
                      {canCreateProject ? (
                        <button
                          onClick={() => {
                            setShowProjectDropdown(false);
                            openCreateProject();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Create Project</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowProjectDropdown(false);
                            setShowLimitModal(true);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-amber-400/90 hover:bg-amber-500/10 transition cursor-pointer"
                          title={`Limit reached (${ownedProjectsCount}/${maxAllowedProjects})`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Lock size={12} className="text-amber-400" />
                            <span>Create Project</span>
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                            Limit ({ownedProjectsCount}/{maxAllowedProjects})
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2.5 flex justify-center border-b border-white/[0.08]">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-[#181922] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-300 text-xs font-semibold transition"
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
                <div className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {group.group}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  if ((item as any).external) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group relative text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <div className="relative shrink-0">
                          <Icon size={15} className="text-zinc-400 group-hover:text-zinc-200" />
                        </div>
                        {!sidebarCollapsed && (
                          <div className="flex items-center justify-between w-full min-w-0">
                            <span className="truncate">{item.label}</span>
                            <ExternalLink size={12} className="text-zinc-500 group-hover:text-zinc-400 shrink-0 ml-1" />
                          </div>
                        )}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group relative ${
                        isActive
                          ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-xs"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent"
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <div className="relative shrink-0">
                        <Icon size={15} className={isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"} />
                        {item.live && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>

                      {!sidebarCollapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="truncate">{item.label}</span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {item.pro && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300 tracking-wider uppercase">
                                PRO
                              </span>
                            )}
                            {item.badge && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                  item.alert
                                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/25"
                                    : isActive
                                    ? "bg-white/[0.1] text-white"
                                    : "bg-white/[0.04] text-zinc-400 group-hover:text-zinc-200"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
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
        <div className="p-3 border-t border-white/[0.08] shrink-0 bg-[#0d0e14]">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition group"
                title="View Profile & Account"
              >
                <div className="w-8 h-8 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-200 text-xs font-semibold shrink-0">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 capitalize flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span>{currentUser.role.replace("_", " ")}</span>
                      {currentUser.plan && currentUser.plan !== "free" && (
                        <span className="text-[9px] uppercase font-semibold text-zinc-400 font-mono">
                          • {currentUser.plan}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-xs font-medium hover:bg-white/[0.1] transition"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[#0e0f15] border-r border-white/[0.08] p-4 flex flex-col h-full z-10 animate-fadeInLeft">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#14161f] border border-white/[0.1] flex items-center justify-center text-white">
                  <Activity size={16} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white text-sm tracking-tight">Open Analytics</span>
                  {isPro && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] border border-white/[0.1] text-zinc-300 uppercase font-medium tracking-wider">
                      PRO
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Mobile Drawer Project Switcher */}
            <div className="py-3 border-b border-white/[0.08]">
              <div className="relative">
                <button
                  onClick={() => {
                    if (projects.length === 0) {
                      setMobileMenuOpen(false);
                      openCreateProject();
                    } else {
                      setShowMobileDrawerProjectDropdown(!showMobileDrawerProjectDropdown);
                    }
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-300 text-xs font-semibold shrink-0">
                      {activeProject?.name ? activeProject.name[0].toUpperCase() : "+"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition">
                        {activeProject?.name || (projects.length === 0 ? "Create First Project" : "Select Project")}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono truncate">
                        {activeProjectId || (projects.length === 0 ? "Click to setup" : "no project")}
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={14} className={`text-zinc-500 shrink-0 group-hover:text-zinc-300 transition-transform ${showMobileDrawerProjectDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Mobile Drawer Project List */}
                {showMobileDrawerProjectDropdown && (
                  <div className="mt-2 w-full bg-[#111218] rounded-xl shadow-2xl p-2 space-y-1 animate-fadeIn border border-white/[0.08]">
                    <div className="px-2.5 py-1.5 border-b border-white/[0.08] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Workspaces</span>
                      <span className="text-zinc-300 font-mono">{projects.length} total</span>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {projects.map((p) => {
                        const isSelected = p.projectId === activeProjectId;
                        return (
                          <button
                            key={p._id || p.projectId}
                            onClick={() => {
                              setActiveProjectId(p.projectId);
                              setShowMobileDrawerProjectDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                              isSelected ? "bg-white/[0.08] text-white font-medium border border-white/[0.08]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 border-t border-white/[0.08]">
                      {canCreateProject ? (
                        <button
                          onClick={() => {
                            setShowMobileDrawerProjectDropdown(false);
                            setMobileMenuOpen(false);
                            openCreateProject();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Create Project</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowMobileDrawerProjectDropdown(false);
                            setMobileMenuOpen(false);
                            setShowLimitModal(true);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-amber-400/90 hover:bg-amber-500/10 transition cursor-pointer"
                          title={`Limit reached (${ownedProjectsCount}/${maxAllowedProjects})`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Lock size={12} className="text-amber-400" />
                            <span>Create Project</span>
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                            {ownedProjectsCount}/{maxAllowedProjects}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

                    if ((item as any).external) {
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={15} />
                            <span>{item.label}</span>
                          </div>
                          <ExternalLink size={13} className="text-zinc-500" />
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                          isActive ? "bg-white/[0.08] text-white border border-white/[0.08]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.pro && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300 tracking-wider uppercase">
                              PRO
                            </span>
                          )}
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-300 font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08]">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium hover:bg-rose-500/15 transition">
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
        <header className="sticky top-0 z-30 h-14 bg-[#090a0f]/80 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Toggle, Breadcrumb & Live Visitor Beacon */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>

            {/* Project Switcher Trigger & Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium min-w-0">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHeaderProjectDropdown(!showHeaderProjectDropdown)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 -ml-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-200 hover:text-white transition max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] cursor-pointer group"
                  title="Switch Project"
                >
                  <span className="truncate">
                    {activeProject?.name || activeProjectId || "Open Analytics"}
                  </span>
                  <ChevronDown size={12} className={`text-zinc-500 shrink-0 group-hover:text-zinc-300 transition-transform ${showHeaderProjectDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Header Project Dropdown Popover */}
                {showHeaderProjectDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowHeaderProjectDropdown(false)} />
                    <div className="absolute left-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] bg-[#111218] rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-fadeIn border border-white/[0.08]">
                      <div className="px-2.5 py-1.5 border-b border-white/[0.08] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Switch Workspace</span>
                        <span className="text-zinc-300 font-mono">{projects.length} total</span>
                      </div>

                      <div className="max-h-52 overflow-y-auto space-y-0.5">
                        {projects.map((p) => {
                          const isSelected = p.projectId === activeProjectId;
                          return (
                            <button
                              key={p._id || p.projectId}
                              onClick={() => {
                                setActiveProjectId(p.projectId);
                                setShowHeaderProjectDropdown(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                                isSelected ? "bg-white/[0.08] text-white font-medium border border-white/[0.08]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                              }`}
                            >
                              <span className="truncate">{p.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1.5 border-t border-white/[0.08]">
                        {canCreateProject ? (
                          <button
                            onClick={() => {
                              setShowHeaderProjectDropdown(false);
                              openCreateProject();
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>Create Project</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setShowHeaderProjectDropdown(false);
                              setShowLimitModal(true);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-amber-400/90 hover:bg-amber-500/10 transition cursor-pointer"
                            title={`Limit reached (${ownedProjectsCount}/${maxAllowedProjects})`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Lock size={12} className="text-amber-400" />
                              <span>Create Project</span>
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                              {ownedProjectsCount}/{maxAllowedProjects}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <span className="text-zinc-600 font-normal hidden xs:inline">/</span>
              <span className="text-zinc-300 font-medium capitalize truncate hidden xs:inline max-w-[80px] sm:max-w-none">
                {pathname === "/" ? "Overview" : pathname.replace("/", "").replace(/-/g, " ")}
              </span>
            </div>

            {/* Live Telemetry Beacon */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium shadow-xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{liveVisitorCount} Live</span>
            </div>
          </div>

          {/* Right: Date Picker & Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Compact Date Range Navigator */}
            <DateRangeNavigator
              value={timeRange}
              onChange={setTimeRange}
              plan={activeProject?.effectivePlan || activeProject?.plan || currentUser?.effectivePlan || currentUser?.plan}
            />

            {/* Notification Center Popover */}
            <NotificationCenterPopover />

            {/* Quick Install Snippet Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="hidden xs:flex p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition cursor-pointer"
              title="View Tracking Script Snippet"
            >
              <Code2 size={14} />
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchData()}
              disabled={loading || pvLoading}
              className="p-1.5 sm:p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50"
              title="Refresh Telemetry"
            >
              <RefreshCw size={13} className={loading || pvLoading ? "animate-spin text-zinc-200" : ""} />
            </button>
          </div>
        </header>

        {/* Plan Expired / Paused Warning Banner */}
        {isPlanExpired && ownedProjectsCount > 1 && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-200">
            <div className="flex items-center gap-2 min-w-0">
              <Lock size={15} className="text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-white">Subscription Expired:</span>{" "}
                {currentUser?.lockedActiveProjectId ? (
                  <span>
                    Only your locked active website is collecting live telemetry. Tracking on other properties is paused.
                  </span>
                ) : (
                  <span>
                    Your plan allows 1 active tracking website on the Free tier. Please select which website will remain active.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!currentUser?.lockedActiveProjectId && (
                <button
                  onClick={() => setShowActiveProjectModal(true)}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-[11px] transition cursor-pointer"
                >
                  Choose Active Website
                </button>
              )}
              <Link
                href="/billing"
                className="px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium text-[11px] transition"
              >
                Renew Subscription
              </Link>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>

      {/* ============================================================ */}
      {/* QUICK INSTALL MODAL (OBSIDIAN PRECISION)                      */}
      {/* ============================================================ */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop with subtle blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setShowInstallModal(false)}
          />

          {/* Modal Container */}
          <div className="relative max-w-2xl w-full bg-[#0e0f16] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 z-10 animate-fadeIn overflow-hidden">
            {/* Header: Title, Specs & Close */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#14161f] border border-white/[0.1] flex items-center justify-center text-zinc-200 shrink-0">
                  <Code2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Connect Website Telemetry</h3>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300 uppercase tracking-wider">
                      SDK v2.4
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Collect Core Web Vitals, visitor journeys, and UX signals with 1 line of code.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Quick Copy Project ID Pill */}
                <button
                  onClick={copyProjectId}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Copy Project ID"
                >
                  <span className="text-zinc-500">ID:</span>
                  <span className="font-medium text-zinc-200 truncate max-w-[100px]">{prjKey}</span>
                  {copiedProjectId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>

                <button
                  onClick={() => setShowInstallModal(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Framework Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14161f] border border-white/[0.06] overflow-x-auto">
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
                    className={`flex-1 min-w-[105px] flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? "bg-white/[0.1] text-white shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
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
                <span className="font-normal text-zinc-400 text-[11px] sm:text-xs">{snippets[installTab].description}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-300 font-medium shrink-0 ml-2">
                  {snippets[installTab].badge}
                </span>
              </div>

              {/* Terminal / Code Editor Window */}
              <div className="relative rounded-xl bg-[#08090d] border border-white/[0.08] shadow-inner overflow-hidden group">
                {/* Window Header */}
                <div className="h-9 px-3.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 ml-2">
                      {snippets[installTab].targetFile}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">&lt; 3.2 KB brotli</span>
                    <button
                      onClick={() => copyInstallSnippet(snippets[installTab].code)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.08] hover:bg-white/[0.14] text-[11px] font-medium text-zinc-200 hover:text-white transition cursor-pointer"
                    >
                      {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedSnippet ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto selection:bg-white/[0.15] selection:text-white leading-relaxed max-h-[170px]">
                  {snippets[installTab].code}
                </pre>
              </div>
            </div>

            {/* Live Ingestion Verification Bar */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div>
                  <span className="font-medium text-white">Live Inbound Ingestion: </span>
                  <span className="text-zinc-400">Ready for telemetry beacons</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {testPingResult && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${testPingResult.ok ? "text-emerald-400" : "text-rose-400"}`}>
                    {testPingResult.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {testPingResult.ok ? "Ping Verified!" : "Failed"}
                  </span>
                )}
                <button
                  onClick={sendTestPing}
                  disabled={testingPing}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                >
                  {testingPing ? (
                    <RefreshCw size={12} className="animate-spin text-zinc-300" />
                  ) : (
                    <Zap size={12} className="text-zinc-300" />
                  )}
                  <span>{testingPing ? "Pinging..." : "Send Test Ping"}</span>
                </button>
              </div>
            </div>

            {/* 3-Col Architectural Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#111218] border border-white/[0.06] flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-white text-[11px]">Zero Cookies</div>
                  <div className="text-[10px] text-zinc-500">GDPR & CCPA compliant</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#111218] border border-white/[0.06] flex items-center gap-2.5">
                <Zap size={16} className="text-amber-400 shrink-0" />
                <div>
                  <div className="font-medium text-white text-[11px]">0ms Main Thread</div>
                  <div className="text-[10px] text-zinc-500">Async non-blocking</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#111218] border border-white/[0.06] flex items-center gap-2.5">
                <Activity size={16} className="text-zinc-300 shrink-0" />
                <div>
                  <div className="font-medium text-white text-[11px]">Full Telemetry</div>
                  <div className="text-[10px] text-zinc-500">Vitals & UX journeys</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <Link
                href="/docs"
                onClick={() => setShowInstallModal(false)}
                className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition"
              >
                Developer API Docs &rarr;
              </Link>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={`/projects/${prjKey}/install`}
                  onClick={() => setShowInstallModal(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium transition cursor-pointer"
                >
                  <span>Full Setup Guide</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property & Stream Creation Wizard */}
      <CreateProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={() => {
          checkAuth();
          fetchData();
        }}
      />

      {/* Plan Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />

      {/* Active Project Selection Modal for Expired Multi-Project Users */}
      <ActiveProjectSelectionModal
        isOpen={showActiveProjectModal}
        onClose={() => setShowActiveProjectModal(false)}
      />

      {/* Browser Notification Permission Floating Banner */}
      {isDashboard && <BrowserNotificationPrompt />}
    </div>
  );
}


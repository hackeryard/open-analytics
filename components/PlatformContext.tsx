"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { AnalyticsData, PageViewItem } from "@/lib/analyticsTypes";
import { isDashboardClient } from "@/lib/subdomain";
import { getMaxAllowedProjects, getUserEffectivePlan, isUserPlanExpired, isPlanActive } from "@/lib/planLimits";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "member";
  avatar?: string;
  plan?: "free" | "pro" | "enterprise";
  effectivePlan?: "free" | "pro" | "enterprise";
  planExpiresAt?: string | Date | null;
  billingCycle?: "monthly" | "annual";
  extraProjectsAllowed?: number;
  isPlanActive?: boolean;
  lockedActiveProjectId?: string;
  activeProjectSelectedAt?: string | Date | null;
}

interface Project {
  _id: string;
  projectId: string;
  name: string;
  allowedDomains: string[];
  ownerId?: string;
  ownerEmail?: string;
  isOwner?: boolean;
  members?: any[];
  role?: string;
  currentUserRole?: string;
  measurementId?: string;
  monitoringStatus?: "pending_verification" | "active" | "paused";
  verifiedAt?: string | Date;
  timezone?: string;
  currency?: string;
  industryCategory?: string;
  businessSize?: string;
  websiteUrl?: string;
  dataStreams?: any[];
  publishableKey?: string;
  slug?: string;
  settings?: any;
  plan?: "free" | "pro" | "enterprise";
  effectivePlan?: "free" | "pro" | "enterprise";
  planExpiresAt?: string | Date | null;
  createdAt?: string | Date;
}


interface PlatformContextType {
  currentUser: User | null;
  authChecked: boolean;
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  activeProject: Project | undefined;
  timeRange: string;
  setTimeRange: (range: string) => void;
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  fetchData: (range?: string, projectId?: string) => Promise<void>;
  liveVisitorCount: number;

  // Live Page Views pagination
  paginatedPageviews: PageViewItem[];
  pvPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  pvLoading: boolean;
  pvPage: number;
  setPvPage: (p: number) => void;
  pvLimit: number;
  setPvLimit: (l: number) => void;
  pvQuery: string;
  setPvQuery: (q: string) => void;
  pvUserType: string;
  setPvUserType: (u: string) => void;
  pvDevice: string;
  setPvDevice: (d: string) => void;
  pvVitals: string;
  setPvVitals: (v: string) => void;
  pvSort: string;
  setPvSort: (s: string) => void;
  pvTimeRange: string;
  setPvTimeRange: (t: string) => void;
  liveStreamActive: boolean;
  setLiveStreamActive: React.Dispatch<React.SetStateAction<boolean>>;
  jumpPageInput: string;
  setJumpPageInput: (j: string) => void;
  fetchPaginatedPageviews: (
    page?: number,
    limit?: number,
    filter?: string,
    search?: string,
    sort?: string,
    range?: string,
    projectId?: string
  ) => Promise<void>;

  // New Project Modal & Auth
  checkAuth: () => Promise<boolean>;
  showNewProjectModal: boolean;
  setShowNewProjectModal: (s: boolean) => void;
  showLimitModal: boolean;
  setShowLimitModal: (s: boolean) => void;
  canCreateProject: boolean;
  ownedProjectsCount: number;
  maxAllowedProjects: number;
  openCreateProject: () => void;
  // Active Project Selection & Expiration
  showActiveProjectModal: boolean;
  setShowActiveProjectModal: (s: boolean) => void;
  dismissActiveProjectModal: () => void;
  isPlanExpired: boolean;
  requiresActiveProjectSelection: boolean;
  selectActiveProject: (projectId: string) => Promise<{ success: boolean; error?: string }>;

  handleCreateProject: (name: string, domains: string) => Promise<{ success: boolean; error?: string }>;
  updateProjectPlan: (projectId: string, plan: "free" | "pro" | "enterprise") => Promise<boolean>;
  updateUserPlan: (plan: "free" | "pro" | "enterprise", billingCycle?: "monthly" | "annual", extraProjects?: number) => Promise<boolean>;
  handleLogout: () => Promise<void>;
  isDashboard: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({
  children,
  initialIsDashboard = false,
}: {
  children: React.ReactNode;
  initialIsDashboard?: boolean;
}) {
  const [isDashboard, setIsDashboard] = useState<boolean>(initialIsDashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setIsDashboard(isDashboardClient());
  }, []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectIdState] = useState<string>("");
  const [timeRange, setTimeRangeState] = useState<string>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveVisitorCount, setLiveVisitorCount] = useState<number>(0);

  // Live stream & pagination
  const [paginatedPageviews, setPaginatedPageviews] = useState<PageViewItem[]>([]);
  const [pvPagination, setPvPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [pvLoading, setPvLoading] = useState(false);
  const [pvPage, setPvPage] = useState(1);
  const [pvLimit, setPvLimit] = useState(50);
  const [pvQuery, setPvQuery] = useState("");
  const [pvUserType, setPvUserType] = useState("all");
  const [pvDevice, setPvDevice] = useState("all");
  const [pvVitals, setPvVitals] = useState("all");
  const [pvSort, setPvSort] = useState("createdAt_desc");
  const [pvTimeRange, setPvTimeRange] = useState("7d");
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [jumpPageInput, setJumpPageInput] = useState("");

  const [showNewProjectModal, setShowNewProjectModalState] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showActiveProjectModal, setShowActiveProjectModal] = useState(false);

  // Compute owned projects and user quota
  const ownedProjectsCount = useMemo(() => {
    if (!currentUser) return 0;
    return projects.filter(
      (p) => p.isOwner || p.currentUserRole === "owner" || p.role === "owner"
    ).length;
  }, [projects, currentUser]);

  const maxAllowedProjects = useMemo(() => {
    if (!currentUser) return 1;
    return getMaxAllowedProjects(currentUser);
  }, [currentUser]);

  const canCreateProject = useMemo(() => {
    if (!currentUser) return true;
    if (currentUser.role === "super_admin") return true;
    return ownedProjectsCount < maxAllowedProjects;
  }, [currentUser, ownedProjectsCount, maxAllowedProjects]);

  // Plan expiration check: user was on Pro/Enterprise, but it is now expired
  const isPlanExpired = useMemo(() => {
    if (!currentUser) return false;
    return isUserPlanExpired(currentUser);
  }, [currentUser]);

  // Requires active project selection: user is on Free / Expired plan, owns > 1 project, and has not locked an active project yet
  const requiresActiveProjectSelection = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return false;
    const paidActive = isPlanActive(currentUser) && (currentUser.plan === "pro" || currentUser.plan === "enterprise");
    if (paidActive) return false;
    return ownedProjectsCount > 1 && !currentUser.lockedActiveProjectId;
  }, [currentUser, ownedProjectsCount]);

  // Track whether the user has dismissed the active project modal in this session
  const [modalDismissedThisSession, setModalDismissedThisSession] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("open_active_project_modal_dismissed") === "true";
    }
    return false;
  });

  // Auto-prompt selection if required and has not been dismissed in this session
  useEffect(() => {
    if (authChecked && requiresActiveProjectSelection && !modalDismissedThisSession) {
      setShowActiveProjectModal(true);
    }
  }, [authChecked, requiresActiveProjectSelection, modalDismissedThisSession]);

  // Provide a dismissal method that persists across page navigations within the session
  const dismissActiveProjectModal = useCallback(() => {
    setShowActiveProjectModal(false);
    setModalDismissedThisSession(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("open_active_project_modal_dismissed", "true");
    }
  }, []);



  // Intercept modal open: if quota is exceeded, do NOT open create project modal
  const setShowNewProjectModal = useCallback(
    (open: boolean) => {
      if (open) {
        if (!canCreateProject) {
          setShowLimitModal(true);
          setShowNewProjectModalState(false);
          return;
        }
      }
      setShowNewProjectModalState(open);
    },
    [canCreateProject]
  );

  const openCreateProject = useCallback(() => {
    if (!canCreateProject) {
      setShowLimitModal(true);
      return;
    }
    setShowNewProjectModalState(true);
  }, [canCreateProject]);

  // Set active project & persist
  const setActiveProjectId = useCallback((id: string) => {
    setActiveProjectIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("open_active_project", id);
    }
  }, []);

  // Set time range & persist
  const setTimeRange = useCallback((range: string) => {
    setTimeRangeState(range);
    if (typeof window !== "undefined") {
      localStorage.setItem("open_time_range", range);
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("open_active_project");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Auth & Project Resolution
  const checkAuth = useCallback(async (): Promise<boolean> => {
    const isDashboard = typeof window !== "undefined" ? isDashboardClient() : false;

    // On the main marketing domain, auth is not used and redirects to login must never occur
    if (!isDashboard) {
      setAuthChecked(true);
      setCurrentUser(null);
      return false;
    }

    const isPublicAuthPath = typeof window !== "undefined" && (
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/register") ||
      window.location.pathname.startsWith("/docs")
    );

    try {
      const r = await fetch("/api/auth/me");
      const d = await r.json();
      setAuthChecked(true);

      if (d.authenticated && d.user) {
        setCurrentUser(d.user);
        if (Array.isArray(d.projects) && d.projects.length > 0) {
          setProjects(d.projects);

          // Determine initial active project
          let selectedId = d.projects[0].projectId;
          if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const urlPrj = urlParams.get("project");
            const savedPrj = localStorage.getItem("open_active_project");
            if (urlPrj && d.projects.some((p: Project) => p.projectId === urlPrj)) {
              selectedId = urlPrj;
            } else if (savedPrj && d.projects.some((p: Project) => p.projectId === savedPrj)) {
              selectedId = savedPrj;
            }
          }
          setActiveProjectIdState(selectedId);
        } else {
          setProjects([]);
          setActiveProjectIdState("");
          setData(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("open_active_project");
          }
        }
        return true;
      } else {
        setCurrentUser(null);
        setProjects([]);
        if (!isPublicAuthPath && typeof window !== "undefined") {
          const redirect = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?redirect=${redirect}`;
        }
        return false;
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setAuthChecked(true);
      setCurrentUser(null);
      setProjects([]);
      if (!isPublicAuthPath && typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return false;
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Restore saved time range if exists
    if (typeof window !== "undefined") {
      const savedRange = localStorage.getItem("open_time_range");
      if (savedRange) setTimeRangeState(savedRange);
    }
  }, [checkAuth]);

  // Select Active Project handler
  const selectActiveProject = useCallback(
    async (projectId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/user/active-project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCurrentUser((prev) =>
            prev ? { ...prev, lockedActiveProjectId: projectId } : null
          );
          setShowActiveProjectModal(false);
          setActiveProjectIdState(projectId);
          await checkAuth();
          return { success: true };
        }
        return { success: false, error: data.error || "Failed to select active project" };
      } catch (err: any) {
        console.error("Select active project error:", err);
        return { success: false, error: err.message || "Network error" };
      }
    },
    [checkAuth]
  );

  // Fetch project analytics
  const fetchData = useCallback(
    async (range?: string, projectId?: string) => {
      const prj = projectId || activeProjectId;
      const r = range || timeRange;

      if (!prj) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${prj}/analytics?range=${r}`);
        if (!res.ok) {
          if (res.status === 403) {
            setError("Access denied: You do not have permission to view this project.");
          } else {
            setError(`Failed to fetch analytics (Status ${res.status})`);
          }
          return;
        }
        const json = await res.json();
        setData(json);
        setLiveVisitorCount(json.overview?.activeUsers || 0);
      } catch (err: any) {
        console.error("Analytics fetch error:", err);
        setError(err.message || "Network error fetching analytics");
      } finally {
        setLoading(false);
      }
    },
    [activeProjectId, timeRange]
  );

  // Fetch paginated pageviews
  const fetchPaginatedPageviews = useCallback(
    async (
      page = pvPage,
      limit = pvLimit,
      filter = pvUserType,
      search = pvQuery,
      sort = pvSort,
      range = pvTimeRange,
      projectId = activeProjectId
    ) => {
      if (!projectId) return;
      setPvLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          userType: filter,
          query: search,
          sortBy: sort,
          timeRange: range,
        });
        if (pvDevice !== "all") params.set("device", pvDevice);
        if (pvVitals !== "all") params.set("vitals", pvVitals);

        const res = await fetch(`/api/projects/${projectId}/pageviews?${params.toString()}`);
        if (!res.ok) return;
        const json = await res.json();
        setPaginatedPageviews(json.pageviews || []);
        setPvPagination(
          json.pagination || {
            total: 0,
            page: 1,
            limit: 50,
            totalPages: 1,
            hasPrevPage: false,
            hasNextPage: false,
          }
        );
      } catch (err) {
        console.error("Pageviews fetch error:", err);
      } finally {
        setPvLoading(false);
      }
    },
    [activeProjectId, pvPage, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange, pvDevice, pvVitals]
  );

  // Auto-fetch on project or time range change
  useEffect(() => {
    fetchData(timeRange, activeProjectId);
    fetchPaginatedPageviews(1, pvLimit, pvUserType, pvQuery, pvSort, timeRange, activeProjectId);
  }, [activeProjectId, timeRange, fetchData, fetchPaginatedPageviews, pvLimit, pvUserType, pvQuery, pvSort, pvVitals]);

  // Project creation
  const handleCreateProject = async (name: string, domains: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) return { success: false, error: "Project name is required" };
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          allowedDomains: domains.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const resData = await res.json();
      if (res.ok && resData.project) {
        setProjects((prev) => [...prev, resData.project]);
        setActiveProjectId(resData.project.projectId);
        setShowNewProjectModal(false);
        return { success: true };
      }
      return { success: false, error: resData.error || "Failed to create project" };
    } catch (err: any) {
      console.error("Create project error:", err);
      return { success: false, error: err.message || "Network error" };
    }
  };

  const activeProject = useMemo(() => {
    return projects.find((p) => p.projectId === activeProjectId);
  }, [projects, activeProjectId]);

  const updateProjectPlan = useCallback(async (projectId: string, plan: "free" | "pro" | "enterprise"): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.projectId === projectId ? { ...p, plan, effectivePlan: plan } : p))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update project plan:", err);
      return false;
    }
  }, []);

  const updateUserPlan = useCallback(async (
    plan: "free" | "pro" | "enterprise",
    billingCycle: "monthly" | "annual" = "monthly",
    extraProjects: number = 0
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/user/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle, extraProjects }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.user) {
          setCurrentUser((prev) => prev ? { ...prev, ...d.user } : null);
        }
        // Refresh project list so effectivePlans update
        checkAuth();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update user plan:", err);
      return false;
    }
  }, [checkAuth]);

  return (
    <PlatformContext.Provider
      value={{
        currentUser,
        authChecked,
        projects,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        updateProjectPlan,
        timeRange,
        setTimeRange,
        data,
        loading,
        error,
        fetchData,
        liveVisitorCount,
        paginatedPageviews,
        pvPagination,
        pvLoading,
        pvPage,
        setPvPage,
        pvLimit,
        setPvLimit,
        pvQuery,
        setPvQuery,
        pvUserType,
        setPvUserType,
        pvDevice,
        setPvDevice,
        pvVitals,
        setPvVitals,
        pvSort,
        setPvSort,
        pvTimeRange,
        setPvTimeRange,
        liveStreamActive,
        setLiveStreamActive,
        jumpPageInput,
        setJumpPageInput,
        fetchPaginatedPageviews,
        checkAuth,
        showNewProjectModal,
        setShowNewProjectModal,
        showLimitModal,
        setShowLimitModal,
        canCreateProject,
        ownedProjectsCount,
        maxAllowedProjects,
        openCreateProject,
        showActiveProjectModal,
        setShowActiveProjectModal,
        dismissActiveProjectModal,
        isPlanExpired,
        requiresActiveProjectSelection,
        selectActiveProject,
        handleCreateProject,
        updateUserPlan,
        handleLogout,
        isDashboard,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return ctx;
}

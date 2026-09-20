"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AnalyticsData, PageViewItem } from "@/lib/analyticsTypes";
import { isDashboardClient } from "@/lib/subdomain";
import { getMaxAllowedProjects, getUserEffectivePlan, isUserPlanExpired, isPlanActive } from "@/lib/planLimits";
import {
  BrowserNotificationPermission,
  isBrowserNotificationSupported,
  getBrowserNotificationPermission,
  isBrowserNotificationEnabled,
  setBrowserNotificationEnabled,
  requestBrowserNotificationPermission,
  sendBrowserNotification,
} from "@/lib/browserNotifications";

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

export interface NotificationItem {
  _id: string;
  projectId: string;
  userId?: string | null;
  title: string;
  message: string;
  type:
    | "error_repeated"
    | "error_storm"
    | "seo_unoptimized"
    | "aeo_unoptimized"
    | "geo_radar"
    | "web_vitals"
    | "rage_clicks"
    | "quota_warning"
    | "system";
  severity: "critical" | "warning" | "info";
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  readAt?: string | null;
  dismissed: boolean;
  fingerprint?: string | null;
  createdAt: string;
}

interface PlatformContextType {
  currentUser: User | null;
  authChecked: boolean;
  projects: Project[];
  projectsLoading: boolean;
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

  // Notification & Alert Center
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  criticalNotificationsCount: number;
  notificationsLoading: boolean;
  fetchNotifications: (projectId?: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  markAllNotificationsAsRead: (projectId?: string) => Promise<boolean>;
  dismissNotification: (notificationId: string) => Promise<boolean>;
  triggerOptimizationScan: (projectId?: string) => Promise<{ success: boolean; newAlertsCount?: number; message?: string }>;
  ignoreNotificationType: (type: string, projectId?: string) => Promise<boolean>;
  unignoreNotificationType: (type: string, projectId?: string) => Promise<boolean>;
  addNotificationIgnoreRule: (rule: { name?: string; type?: string; matchField: string; matchType: string; pattern: string }, projectId?: string) => Promise<boolean>;
  deleteNotificationIgnoreRule: (ruleId: string, projectId?: string) => Promise<boolean>;
  toggleNotificationIgnoreRule: (ruleId: string, enabled: boolean, projectId?: string) => Promise<boolean>;

  // Native Browser Desktop Notifications
  browserNotificationsSupported: boolean;
  browserNotificationsPermission: BrowserNotificationPermission;
  browserNotificationsEnabled: boolean;
  requestBrowserNotificationPermission: (sendConfirmation?: boolean) => Promise<BrowserNotificationPermission>;
  toggleBrowserNotifications: () => void;
  sendTestBrowserNotification: () => boolean;
  showBrowserPermissionPrompt: boolean;
  dismissBrowserPermissionPrompt: () => void;
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
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [activeProjectId, setActiveProjectIdState] = useState<string>("");
  const [timeRange, setTimeRangeState] = useState<string>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveVisitorCount, setLiveVisitorCount] = useState<number>(0);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [criticalNotificationsCount, setCriticalNotificationsCount] = useState<number>(0);
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(false);

  // Native Browser Desktop Notification State
  const [browserNotificationsSupported, setBrowserNotificationsSupported] = useState<boolean>(false);
  const [browserNotificationsPermission, setBrowserNotificationsPermission] = useState<BrowserNotificationPermission>("default");
  const [browserNotificationsEnabled, setBrowserNotificationsEnabledState] = useState<boolean>(false);
  const [showBrowserPermissionPrompt, setShowBrowserPermissionPrompt] = useState<boolean>(false);
  const knownNotificationIds = useRef<Set<string>>(new Set());
  const initialNotificationFetchDone = useRef<boolean>(false);

  useEffect(() => {
    if (isBrowserNotificationSupported()) {
      setBrowserNotificationsSupported(true);
      setBrowserNotificationsPermission(getBrowserNotificationPermission());
      setBrowserNotificationsEnabledState(isBrowserNotificationEnabled());
    }
  }, []);

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
    } finally {
      setProjectsLoading(false);
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

  // Notifications API handlers
  const fetchNotifications = useCallback(async (projectId?: string) => {
    const prj = projectId || activeProjectId;
    if (!prj) return;
    setNotificationsLoading(true);
    try {
      const res = await fetch(`/api/notifications?projectId=${prj}&status=active`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const items: NotificationItem[] = json.notifications || [];
          setNotifications(items);
          setUnreadNotificationsCount(json.unreadCount || 0);
          setCriticalNotificationsCount(json.criticalCount || 0);

          // Dispatch native browser desktop notifications for new unread alerts
          if (!initialNotificationFetchDone.current) {
            initialNotificationFetchDone.current = true;
            knownNotificationIds.current = new Set(items.map((n) => n._id));
          } else {
            for (const n of items) {
              if (!n.read && !knownNotificationIds.current.has(n._id)) {
                knownNotificationIds.current.add(n._id);
                sendBrowserNotification({
                  title: `Open Analytics: ${n.title}`,
                  body: n.message,
                  tag: n.fingerprint || n._id,
                  actionUrl: n.actionUrl || "/notifications",
                  playSound: true,
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("fetchNotifications error:", err);
    } finally {
      setNotificationsLoading(false);
    }
  }, [activeProjectId]);

  const markNotificationAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));

      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsRead", notificationId }),
      });
      return res.ok;
    } catch (err) {
      console.error("markNotificationAsRead error:", err);
      return false;
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async (projectId?: string): Promise<boolean> => {
    const prj = projectId || activeProjectId;
    if (!prj) return false;
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotificationsCount(0);

      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllAsRead", projectId: prj }),
      });
      return res.ok;
    } catch (err) {
      console.error("markAllNotificationsAsRead error:", err);
      return false;
    }
  }, [activeProjectId]);

  const dismissNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const target = notifications.find((n) => n._id === notificationId);
      if (target && !target.read) {
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      }
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss", notificationId }),
      });
      return res.ok;
    } catch (err) {
      console.error("dismissNotification error:", err);
      return false;
    }
  }, [notifications]);

  const triggerOptimizationScan = useCallback(
    async (projectId?: string): Promise<{ success: boolean; newAlertsCount?: number; message?: string }> => {
      const prj = projectId || activeProjectId;
      if (!prj) return { success: false, message: "No active project" };
      try {
        const res = await fetch("/api/notifications/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: prj }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          await fetchNotifications(prj);
          return { success: true, newAlertsCount: json.newAlertsCount, message: json.message };
        }
        return { success: false, message: json.error || "Scan failed" };
      } catch (err: any) {
        console.error("triggerOptimizationScan error:", err);
        return { success: false, message: err.message || "Network error" };
      }
    },
    [activeProjectId, fetchNotifications]
  );

  const ignoreNotificationType = useCallback(
    async (type: string, projectId?: string): Promise<boolean> => {
      const prj = projectId || activeProjectId;
      if (!prj || !type) return false;
      try {
        const res = await fetch(`/api/projects/${prj}/alert-rules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ignore_type", type }),
        });
        if (res.ok) {
          await fetchNotifications(prj);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [activeProjectId, fetchNotifications]
  );

  const unignoreNotificationType = useCallback(
    async (type: string, projectId?: string): Promise<boolean> => {
      const prj = projectId || activeProjectId;
      if (!prj || !type) return false;
      try {
        const res = await fetch(`/api/projects/${prj}/alert-rules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "unignore_type", type }),
        });
        if (res.ok) {
          await fetchNotifications(prj);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [activeProjectId, fetchNotifications]
  );

  const addNotificationIgnoreRule = useCallback(
    async (
      rule: { name?: string; type?: string; matchField: string; matchType: string; pattern: string },
      projectId?: string
    ): Promise<boolean> => {
      const prj = projectId || activeProjectId;
      if (!prj || !rule.pattern) return false;
      try {
        const res = await fetch(`/api/projects/${prj}/alert-rules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add_rule", ...rule }),
        });
        if (res.ok) {
          await fetchNotifications(prj);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [activeProjectId, fetchNotifications]
  );

  const deleteNotificationIgnoreRule = useCallback(
    async (ruleId: string, projectId?: string): Promise<boolean> => {
      const prj = projectId || activeProjectId;
      if (!prj || !ruleId) return false;
      try {
        const res = await fetch(`/api/projects/${prj}/alert-rules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete_rule", ruleId }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    [activeProjectId]
  );

  const toggleNotificationIgnoreRule = useCallback(
    async (ruleId: string, enabled: boolean, projectId?: string): Promise<boolean> => {
      const prj = projectId || activeProjectId;
      if (!prj || !ruleId) return false;
      try {
        const res = await fetch(`/api/projects/${prj}/alert-rules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "toggle_rule", ruleId, enabled }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    [activeProjectId]
  );

  // Native Browser Desktop Notification Actions
  const handleRequestBrowserPermission = useCallback(
    async (sendConfirmation: boolean = true): Promise<BrowserNotificationPermission> => {
      const res = await requestBrowserNotificationPermission();
      setBrowserNotificationsPermission(res);
      setBrowserNotificationsEnabledState(isBrowserNotificationEnabled());

      if (res === "granted") {
        setShowBrowserPermissionPrompt(false);
        if (sendConfirmation) {
          sendBrowserNotification({
            title: "Desktop Alerts Enabled",
            body: "You will now receive real-time alerts for repeated errors, crashes, and performance issues.",
            actionUrl: "/notifications",
            playSound: true,
          });
        }
      } else if (res === "denied") {
        setShowBrowserPermissionPrompt(false);
      }
      return res;
    },
    []
  );

  const dismissBrowserPermissionPrompt = useCallback(() => {
    setShowBrowserPermissionPrompt(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("open_browser_perm_dismissed", "true");
    }
  }, []);

  // Auto-prompt user for browser notification permission on dashboard load & first user interaction
  useEffect(() => {
    if (!isDashboard || !isBrowserNotificationSupported()) return;

    const currentPerm = getBrowserNotificationPermission();
    if (currentPerm !== "default") return;

    const isDismissed =
      typeof window !== "undefined" &&
      sessionStorage.getItem("open_browser_perm_dismissed") === "true";
    if (isDismissed) return;

    // Show prominent in-app prompt card
    setShowBrowserPermissionPrompt(true);

    // 1. Direct native prompt attempt after brief mount delay
    const timer = setTimeout(() => {
      if (getBrowserNotificationPermission() === "default") {
        handleRequestBrowserPermission(true).catch(() => {});
      }
    }, 1200);

    // 2. User gesture trigger: on first interaction anywhere on dashboard, immediately prompt
    const onUserInteraction = () => {
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
      if (getBrowserNotificationPermission() === "default") {
        handleRequestBrowserPermission(true).catch(() => {});
      }
    };

    window.addEventListener("pointerdown", onUserInteraction, { once: true });
    window.addEventListener("keydown", onUserInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
    };
  }, [isDashboard, handleRequestBrowserPermission]);

  const toggleBrowserNotifications = useCallback(() => {
    const current = isBrowserNotificationEnabled();
    const next = !current;
    setBrowserNotificationEnabled(next);
    setBrowserNotificationsEnabledState(next);
  }, []);

  const sendTestBrowserNotification = useCallback((): boolean => {
    return sendBrowserNotification({
      title: "Open Analytics Alert Test",
      body: "Desktop browser notifications are active. You will be alerted when repeated errors or storms are detected.",
      actionUrl: "/notifications",
      playSound: true,
    });
  }, []);

  // Background alert polling every 45s so desktop notifications trigger even on background tabs
  useEffect(() => {
    if (!activeProjectId) return;
    const interval = setInterval(() => {
      fetchNotifications(activeProjectId);
    }, 45000);
    return () => clearInterval(interval);
  }, [activeProjectId, fetchNotifications]);

  useEffect(() => {
    if (activeProjectId) {
      initialNotificationFetchDone.current = false;
      knownNotificationIds.current.clear();
      fetchNotifications(activeProjectId);
    }
  }, [activeProjectId, fetchNotifications]);

  return (
    <PlatformContext.Provider
      value={{
        currentUser,
        authChecked,
        projects,
        projectsLoading,
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
        notifications,
        unreadNotificationsCount,
        criticalNotificationsCount,
        notificationsLoading,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        triggerOptimizationScan,
        ignoreNotificationType,
        unignoreNotificationType,
        addNotificationIgnoreRule,
        deleteNotificationIgnoreRule,
        toggleNotificationIgnoreRule,
        browserNotificationsSupported,
        browserNotificationsPermission,
        browserNotificationsEnabled,
        requestBrowserNotificationPermission: handleRequestBrowserPermission,
        toggleBrowserNotifications,
        sendTestBrowserNotification,
        showBrowserPermissionPrompt,
        dismissBrowserPermissionPrompt,
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

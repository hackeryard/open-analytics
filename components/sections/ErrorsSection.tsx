"use client";

import React, { useState, useEffect } from "react";
import {
  Bug,
  AlertCircle,
  Search,
  Download,
  Trash2,
  Copy,
  Check,
  Clock,
  ExternalLink,
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  RefreshCw,
  FileText,
  FileJson,
  FileSpreadsheet,
  SlidersHorizontal,
  CheckCheck,
  Wrench,
  Code2,
  ChevronsLeft,
  ChevronsRight,
  Ban,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  ToggleLeft,
  ToggleRight,
  CheckSquare2,
  Square,
  MinusSquare,
  Flame,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import {
  ErrorLogItem,
  ErrorRule,
  AnalyticsData,
  timeAgo,
  formatExactTime,
  formatExactDate,
} from "@/lib/analyticsTypes";
import { getTrackedUrl } from "@/lib/urlHelper";

export default function ErrorsSection({ data: propData }: { data?: AnalyticsData }) {
  const { activeProjectId, activeProject, data: platformData } = usePlatform();
  const [dataState, setDataState] = useState<AnalyticsData | null>(propData || platformData);

  useEffect(() => {
    if (propData || platformData) setDataState(propData || platformData);
  }, [propData, platformData]);

  const data = dataState;

  // ── Filters & Search State ──
  const [errorStatusFilter, setErrorStatusFilter] = useState<string>("all");
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>("all");
  const [errorSearchQuery, setErrorSearchQuery] = useState<string>("");
  const [copiedErrorId, setCopiedErrorId] = useState<string | null>(null);
  const [copiedAllErrors, setCopiedAllErrors] = useState<boolean>(false);
  const [copiedSelectionPrompt, setCopiedSelectionPrompt] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // ── Dropdowns & Navigation State ──
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  const [showBulkActionDropdown, setShowBulkActionDropdown] = useState<boolean>(false);
  const [showSelectionExportDropdown, setShowSelectionExportDropdown] = useState<boolean>(false);
  const [errorBulkLoading, setErrorBulkLoading] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<number>(1);
  const [errorPageSize, setErrorPageSize] = useState<number>(15);
  const [errorJumpPageInput, setErrorJumpPageInput] = useState<string>("");
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  // ── Multi-Selection State ──
  const [selectedErrorIds, setSelectedErrorIds] = useState<string[]>([]);

  // ── Blocked & Ignored Error Rules State ──
  const [rulesList, setRulesList] = useState<ErrorRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [muteMenuErrorId, setMuteMenuErrorId] = useState<string | null>(null);
  const [ruleToast, setRuleToast] = useState<string | null>(null);
  const [newRuleForm, setNewRuleForm] = useState<{
    name: string;
    matchField: "message" | "pathname" | "errorType" | "stack";
    matchType: "contains" | "exact" | "regex" | "starts_with";
    pattern: string;
    enabled: boolean;
  }>({
    name: "",
    matchField: "message",
    matchType: "contains",
    pattern: "",
    enabled: true,
  });

  const showRuleNotification = (msg: string) => {
    setRuleToast(msg);
    setTimeout(() => setRuleToast(null), 3500);
  };

  const fetchRules = async () => {
    if (!activeProjectId) return;
    setRulesLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/error-rules`);
      const json = await res.json();
      if (json.ok && Array.isArray(json.errorRules)) {
        setRulesList(json.errorRules);
      }
    } catch (err) {
      console.error("Failed to fetch error rules:", err);
    } finally {
      setRulesLoading(false);
    }
  };

  useEffect(() => {
    if (activeProjectId) {
      fetchRules();
    }
  }, [activeProjectId]);

  const handleToggleRule = async (ruleId: string, currentStatus: boolean) => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/error-rules`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId, enabled: !currentStatus }),
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.errorRules)) {
        setRulesList(json.errorRules);
        showRuleNotification(
          !currentStatus
            ? "Suppression rule activated! Matching errors will be muted."
            : "Suppression rule paused. Tracking resumed."
        );
      }
    } catch (err) {
      console.error("Failed to toggle rule:", err);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/error-rules?ruleId=${ruleId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.errorRules)) {
        setRulesList(json.errorRules);
        showRuleNotification("Suppression rule deleted.");
      }
    } catch (err) {
      console.error("Failed to delete rule:", err);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId || !newRuleForm.pattern.trim()) return;

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/error-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRuleForm),
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.errorRules)) {
        setRulesList(json.errorRules);
        setNewRuleForm({
          name: "",
          matchField: "message",
          matchType: "contains",
          pattern: "",
          enabled: true,
        });
        showRuleNotification("New suppression rule created successfully!");
      }
    } catch (err) {
      console.error("Failed to create rule:", err);
    }
  };

  const handleQuickMute = async (
    err: ErrorLogItem,
    field: "message" | "pathname" | "errorType"
  ) => {
    if (!activeProjectId) return;
    let pattern = "";
    let name = "";
    let matchType: "contains" | "exact" = "contains";

    if (field === "message") {
      pattern = err.message;
      name = `Ignore: ${err.message.slice(0, 30)}...`;
      matchType = "exact";
    } else if (field === "pathname") {
      pattern = err.pathname;
      name = `Ignore Route: ${err.pathname}`;
      matchType = "exact";
    } else if (field === "errorType") {
      pattern = err.errorType || "runtime";
      name = `Ignore Type: ${err.errorType || "runtime"}`;
      matchType = "exact";
    }

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/error-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          matchField: field,
          matchType,
          pattern,
          enabled: true,
        }),
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.errorRules)) {
        setRulesList(json.errorRules);
        setMuteMenuErrorId(null);
        showRuleNotification(`Suppressed future errors matching ${field} "${pattern}"!`);
      }
    } catch (error) {
      console.error("Failed to quick mute:", error);
    }
  };

  const generateAiFixPrompt = (err: ErrorLogItem) => {
    return `### Fix Prompt for Frontend Exception
**Error Message:** \`${err.message}\`
**Route / Path:** \`${err.pathname}\`
**Category:** \`${err.errorType || "runtime"}\`
**Occurrences:** ${err.occurrences}x
**Client Environment:** ${err.os || "Unknown OS"} | ${err.browser || "Unknown Browser"} (${err.device || "desktop"})
**Timestamp:** ${new Date(err.lastOccurredAt).toLocaleString()}
${err.digest ? `**Digest:** \`${err.digest}\`\n` : ""}
${
  err.stack
    ? `**Stack Trace:**
\`\`\`
${err.stack}
\`\`\`
`
    : ""
}
**Instructions for AI Assistant:**
1. Pinpoint the root cause of this error based on the message and stack trace.
2. Provide a concrete, line-by-line code fix or safe fallback to prevent this crash.
3. If this is a 404 route error, check for broken link references, redirect maps, or missing dynamic route segments.`;
  };

  const handleCopyAiPrompt = async (err: ErrorLogItem) => {
    const prompt = generateAiFixPrompt(err);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedErrorId(err._id);
      setTimeout(() => setCopiedErrorId(null), 2500);
      showRuleNotification("Copied AI Fix Prompt to clipboard.");
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleCopyMessage = async (err: ErrorLogItem) => {
    try {
      await navigator.clipboard.writeText(err.message || "");
      setCopiedMessageId(err._id);
      setTimeout(() => setCopiedMessageId(null), 2000);
      showRuleNotification("Error message copied.");
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleCopyAllAiPrompts = async (errorsList: ErrorLogItem[]) => {
    if (errorsList.length === 0) return;
    const header = `# Bulk Open Analytics Crash Diagnostic & Triage Report\n\nTotal Issues: ${errorsList.length}\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
    const promptBody = errorsList
      .map((err, idx) => `## Issue #${idx + 1}\n` + generateAiFixPrompt(err))
      .join("\n\n---\n\n");

    try {
      await navigator.clipboard.writeText(header + promptBody);
      setCopiedAllErrors(true);
      setTimeout(() => setCopiedAllErrors(false), 2500);
      showRuleNotification(`Copied AI Fix Prompts for all ${errorsList.length} issues.`);
    } catch (e) {
      console.error("Failed to copy all prompts:", e);
    }
  };

  const handleCopySelectedAiPrompts = async () => {
    const selected = allErrors.filter((e) => selectedErrorIds.includes(e._id));
    if (selected.length === 0) return;
    const header = `# Open Analytics Multi-Issue AI Debug Report\n\nSelected Issues: ${selected.length}\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
    const promptBody = selected
      .map((err, idx) => `## Selected Issue #${idx + 1}\n` + generateAiFixPrompt(err))
      .join("\n\n---\n\n");

    try {
      await navigator.clipboard.writeText(header + promptBody);
      setCopiedSelectionPrompt(true);
      setTimeout(() => setCopiedSelectionPrompt(false), 2500);
      showRuleNotification(`Copied AI Fix Prompts for ${selected.length} selected issues.`);
    } catch (e) {
      console.error("Failed to copy selected prompts:", e);
    }
  };

  const handleExportErrors = (
    format: "markdown" | "json" | "csv",
    errorsToExport: ErrorLogItem[]
  ) => {
    if (errorsToExport.length === 0) return;
    setShowExportDropdown(false);
    setShowSelectionExportDropdown(false);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let content = "";
    let mimeType = "text/plain";
    let filename = `open_analytics_errors_${timestamp}`;

    if (format === "markdown") {
      filename += ".md";
      mimeType = "text/markdown";
      const header = `# Open Analytics Error Diagnostics & AI Fix Report
- **Export Date:** ${new Date().toLocaleString()}
- **Total Filtered Errors:** ${errorsToExport.length}
- **Active Errors:** ${errorsToExport.filter((e) => e.status === "new" || e.status === "investigating").length}
- **Resolved Errors:** ${errorsToExport.filter((e) => e.status === "resolved").length}

---

`;
      const body = errorsToExport
        .map(
          (err, idx) =>
            `## #${idx + 1} - \`${err.errorType}\` on [${err.pathname}](${String(
              err.pathname
            )})\n` + generateAiFixPrompt(err)
        )
        .join("\n\n---\n\n");
      content = header + body;
    } else if (format === "json") {
      filename += ".json";
      mimeType = "application/json";
      content = JSON.stringify(errorsToExport, null, 2);
    } else if (format === "csv") {
      filename += ".csv";
      mimeType = "text/csv;charset=utf-8;";
      const headers = [
        "ID",
        "Type",
        "Status",
        "Occurrences",
        "Pathname",
        "Message",
        "Digest",
        "Browser",
        "OS",
        "Device",
        "LastOccurredAt",
      ];
      const rows = errorsToExport.map((err) => [
        `"${err._id}"`,
        `"${err.errorType}"`,
        `"${err.status}"`,
        err.occurrences,
        `"${(err.pathname || "").replace(/"/g, '""')}"`,
        `"${(err.message || "").replace(/"/g, '""')}"`,
        `"${(err.digest || "").replace(/"/g, '""')}"`,
        `"${(err.browser || "").replace(/"/g, '""')}"`,
        `"${(err.os || "").replace(/"/g, '""')}"`,
        `"${(err.device || "").replace(/"/g, '""')}"`,
        `"${err.lastOccurredAt}"`,
      ]);
      content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showRuleNotification(`Exported ${errorsToExport.length} errors as .${format}!`);
  };

  const handleBulkUpdateErrors = async (newStatus: string, errorIds: string[]) => {
    if (errorIds.length === 0) return;
    setErrorBulkLoading(true);
    setShowBulkActionDropdown(false);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/errors`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ errorIds, status: newStatus }),
      });
      if (res.ok) {
        setDataState((prev) => {
          if (!prev) return prev;
          const idSet = new Set(errorIds);
          return {
            ...prev,
            recentErrors: prev.recentErrors.map((err) =>
              idSet.has(err._id) ? { ...err, status: newStatus as any } : err
            ),
          };
        });
        showRuleNotification(`Updated ${errorIds.length} errors to "${newStatus}".`);
      }
    } catch (err) {
      console.error("Bulk update errors error:", err);
    } finally {
      setErrorBulkLoading(false);
    }
  };

  const handleBulkDeleteSelected = async (errorIds: string[]) => {
    if (errorIds.length === 0) return;
    if (
      !window.confirm(
        `Permanently delete ${errorIds.length} selected error record${errorIds.length === 1 ? "" : "s"}?`
      )
    )
      return;

    setErrorBulkLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/errors`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorIds }),
      });
      if (res.ok) {
        const idSet = new Set(errorIds);
        setDataState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentErrors: prev.recentErrors.filter((e) => !idSet.has(e._id)),
          };
        });
        setSelectedErrorIds((prev) => prev.filter((id) => !idSet.has(id)));
        showRuleNotification(`Deleted ${errorIds.length} error record${errorIds.length === 1 ? "" : "s"}.`);
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
    } finally {
      setErrorBulkLoading(false);
    }
  };

  const handleBulkPurgeErrors = async (purgeMode: "resolved" | "all" | "ignored") => {
    const label =
      purgeMode === "all"
        ? "ALL error records"
        : purgeMode === "resolved"
          ? "all RESOLVED error records"
          : "all IGNORED error records";
    if (!window.confirm(`Are you sure you want to permanently delete ${label}?`)) return;

    setErrorBulkLoading(true);
    setShowBulkActionDropdown(false);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/errors?purge=${purgeMode}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDataState((prev) => {
          if (!prev) return prev;
          let remaining = prev.recentErrors;
          if (purgeMode === "all") remaining = [];
          else if (purgeMode === "resolved") remaining = remaining.filter((e) => e.status !== "resolved");
          else if (purgeMode === "ignored") remaining = remaining.filter((e) => e.status !== "ignored");
          return { ...prev, recentErrors: remaining };
        });
        setSelectedErrorIds([]);
        showRuleNotification(`Purged ${label}.`);
      }
    } catch (err) {
      console.error("Purge errors error:", err);
    } finally {
      setErrorBulkLoading(false);
    }
  };

  const handleUpdateErrorStatus = async (errorId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/errors/${errorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setDataState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentErrors: prev.recentErrors.map((err) =>
              err._id === errorId ? { ...err, status: newStatus as any } : err
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteError = async (errorId: string) => {
    if (!window.confirm("Permanently delete this error record?")) return;

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/errors/${errorId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDataState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentErrors: prev.recentErrors.filter((err) => err._id !== errorId),
          };
        });
        setSelectedErrorIds((prev) => prev.filter((id) => id !== errorId));
        showRuleNotification("Error record deleted.");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const allErrors = data?.recentErrors || [];
  const totalOccurrences = allErrors.reduce((sum, e) => sum + (e.occurrences || 1), 0);
  const activeCount = allErrors.filter((e) => e.status === "new" || e.status === "investigating").length;
  const newCount = allErrors.filter((e) => e.status === "new").length;
  const investigatingCount = allErrors.filter((e) => e.status === "investigating").length;
  const resolvedCount = allErrors.filter((e) => e.status === "resolved").length;
  const ignoredCount = allErrors.filter((e) => e.status === "ignored").length;
  const notFoundCount = allErrors.filter((e) => e.errorType === "not_found").length;
  const resolvedRate = allErrors.length > 0 ? Math.round((resolvedCount / allErrors.length) * 100) : 100;

  const errorCounts = {
    all: allErrors.length,
    total: allErrors.length,
    active: activeCount,
    new: newCount,
    investigating: investigatingCount,
    resolved: resolvedCount,
    ignored: ignoredCount,
  };

  const filteredErrors = allErrors.filter((err) => {
    if (errorStatusFilter === "active") {
      if (err.status !== "new" && err.status !== "investigating") return false;
    } else if (errorStatusFilter !== "all" && err.status !== errorStatusFilter) {
      return false;
    }
    if (errorTypeFilter !== "all" && err.errorType !== errorTypeFilter) return false;
    const q = errorSearchQuery.toLowerCase().trim();
    if (q) {
      const matchMsg = (err.message || "").toLowerCase().includes(q);
      const matchPath = (err.pathname || "").toLowerCase().includes(q);
      const matchDigest = (err.digest || "").toLowerCase().includes(q);
      const matchType = (err.errorType || "").toLowerCase().includes(q);
      if (!matchMsg && !matchPath && !matchDigest && !matchType) return false;
    }
    return true;
  });

  const totalErrorPages = Math.max(1, Math.ceil(filteredErrors.length / errorPageSize));
  const paginatedErrors = filteredErrors.slice(
    (errorPage - 1) * errorPageSize,
    errorPage * errorPageSize
  );

  // ── Multi-Selection Controls ──
  const isAllPageSelected =
    paginatedErrors.length > 0 &&
    paginatedErrors.every((e) => selectedErrorIds.includes(e._id));
  const isSomePageSelected =
    paginatedErrors.some((e) => selectedErrorIds.includes(e._id)) && !isAllPageSelected;

  const handleToggleSelectError = (id: string) => {
    setSelectedErrorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedErrors.map((e) => e._id));
      setSelectedErrorIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedErrors.map((e) => e._id);
      setSelectedErrorIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectAllFiltered = () => {
    setSelectedErrorIds(filteredErrors.map((e) => e._id));
    showRuleNotification(`Selected all ${filteredErrors.length} filtered errors.`);
  };

  const handleClearSelection = () => {
    setSelectedErrorIds([]);
  };

  const selectedErrorsList = allErrors.filter((e) => selectedErrorIds.includes(e._id));

  const getErrorPageNumbers = () => {
    const total = totalErrorPages;
    const current = errorPage;
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift("...");
    range.unshift(1);
    if (current + delta < total - 1) range.push("...");
    if (total > 1) range.push(total);
    return range;
  };

  const handleJumpErrorPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(errorJumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalErrorPages) {
      setErrorPage(target);
      setErrorJumpPageInput("");
    }
  };

  const getCategoryBadgeClass = (type?: string) => {
    switch (type) {
      case "not_found":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "http_4xx":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "http_5xx":
      case "boundary":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "api":
        return "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20";
      case "resource":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "webgl":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "hydration":
      case "console":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "unhandledrejection":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "network":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      default:
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  const getCategoryLabel = (type?: string) => {
    switch (type) {
      case "not_found":
        return "404 Not Found";
      case "http_4xx":
        return "HTTP 4xx";
      case "http_5xx":
        return "Server 5xx";
      case "boundary":
        return "React Crash";
      case "hydration":
        return "SSR Hydration";
      case "api":
        return "API Failure";
      case "console":
        return "Console Error";
      case "unhandledrejection":
        return "Unhandled Promise";
      case "network":
        return "Network Failure";
      case "resource":
        return "Resource Load";
      case "webgl":
        return "WebGL / Shader";
      default:
        return type || "Runtime Error";
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-6 pb-24 relative">
      {/* ── Top Sleek KPI Gauges Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Exceptions */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Issues
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 tabular-nums">
              {allErrors.length} Unique
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold font-mono text-white tabular-nums">
              {allErrors.length}
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5 tabular-nums">
              {totalOccurrences.toLocaleString()} total crash occurrences
            </span>
          </div>
        </div>

        {/* 2. Active / Unresolved Issues */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Active &amp; Investigating
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 tabular-nums">
              {newCount} New
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold font-mono text-amber-400 tabular-nums">
              {activeCount}
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5 tabular-nums">
              {investigatingCount} currently marked investigating
            </span>
          </div>
        </div>

        {/* 3. 404 Route Anomalies */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              404 Broken Routes
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 tabular-nums">
              {allErrors.length > 0 ? Math.round((notFoundCount / allErrors.length) * 100) : 0}% of Total
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold font-mono text-orange-400 tabular-nums">
              {notFoundCount}
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5">
              Unmatched URLs &amp; missing pages
            </span>
          </div>
        </div>

        {/* 4. Resolved Rate & Active Block Rules */}
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Resolution Rate
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tabular-nums">
              {resolvedCount} Solved
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold font-mono text-emerald-400 tabular-nums">
              {resolvedRate}%
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5 tabular-nums">
              {rulesList.filter((r) => r.enabled).length} active edge suppression rules
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Unified Analytics Card ── */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden space-y-0">
        {/* Top Header & Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0e0f15] space-y-3.5">
          {/* Status Tab Pills + Quick Counter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {[
                { id: "all", label: "All Issues", count: errorCounts.total },
                { id: "active", label: "Active", count: errorCounts.active, color: "text-rose-400" },
                { id: "investigating", label: "Investigating", count: errorCounts.investigating, color: "text-amber-400" },
                { id: "resolved", label: "Resolved", count: errorCounts.resolved, color: "text-emerald-400" },
                { id: "ignored", label: "Ignored", count: errorCounts.ignored, color: "text-zinc-500" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setErrorStatusFilter(tab.id);
                    setErrorPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    errorStatusFilter === tab.id
                      ? "bg-white text-zinc-950"
                      : "bg-[#111218] hover:bg-[#181922] text-zinc-400 hover:text-white border border-white/[0.08]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                      errorStatusFilter === tab.id
                        ? "bg-zinc-200 text-zinc-950 font-semibold"
                        : "bg-white/[0.06] text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Top Right Action Tools */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              {/* Blocked Rules Button */}
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white transition cursor-pointer"
                title="Manage blocked & ignored error rules"
              >
                <ShieldAlert size={13} className="text-amber-400" />
                <span>Blocked Rules</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-mono tabular-nums font-semibold">
                  {rulesList.filter((r) => r.enabled).length}
                </span>
              </button>

              {/* Copy AI Prompts for Filtered */}
              <button
                type="button"
                onClick={() => handleCopyAllAiPrompts(filteredErrors)}
                disabled={filteredErrors.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                  copiedAllErrors
                    ? "bg-emerald-600 text-white"
                    : "bg-white hover:bg-zinc-200 text-zinc-950"
                }`}
                title="Copy AI fix prompts for all filtered errors"
              >
                {copiedAllErrors ? <Check size={13} /> : <Bot size={13} />}
                <span>{copiedAllErrors ? "Copied!" : `Copy AI Prompts (${filteredErrors.length})`}</span>
              </button>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportDropdown(!showExportDropdown);
                    setShowBulkActionDropdown(false);
                  }}
                  disabled={filteredErrors.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer disabled:opacity-50"
                  title="Export error diagnostics"
                >
                  <Download size={13} />
                  <span>Export</span>
                  <ChevronDown
                    size={11}
                    className={showExportDropdown ? "rotate-180 transition" : "transition"}
                  />
                </button>

                {showExportDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 p-1.5 bg-[#111218] border border-white/[0.08] rounded-xl shadow-2xl w-56 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/[0.08] mb-1">
                        Export Filtered ({filteredErrors.length})
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExportErrors("markdown", filteredErrors)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                      >
                        <FileText size={13} className="text-zinc-400" />
                        <span>AI Debug Report (.md)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportErrors("json", filteredErrors)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                      >
                        <FileJson size={13} className="text-amber-400" />
                        <span>Raw JSON Dump (.json)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportErrors("csv", filteredErrors)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                      >
                        <FileSpreadsheet size={13} className="text-emerald-400" />
                        <span>Spreadsheet (.csv)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Bulk Mass Tools */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkActionDropdown(!showBulkActionDropdown);
                    setShowExportDropdown(false);
                  }}
                  disabled={errorBulkLoading}
                  className="p-2 rounded-lg bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50"
                  title="Mass status & purge tools"
                >
                  <SlidersHorizontal size={13} />
                </button>

                {showBulkActionDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowBulkActionDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 p-1.5 bg-[#111218] border border-white/[0.08] rounded-xl shadow-2xl w-60 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/[0.08] mb-1">
                        Mass Status Update
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleBulkUpdateErrors(
                            "resolved",
                            filteredErrors.map((e) => e._id)
                          )
                        }
                        disabled={filteredErrors.length === 0}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer disabled:opacity-50"
                      >
                        <CheckCheck size={13} className="text-emerald-400" />
                        <span>Mark Filtered ({filteredErrors.length}) Resolved</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleBulkUpdateErrors(
                            "investigating",
                            filteredErrors.map((e) => e._id)
                          )
                        }
                        disabled={filteredErrors.length === 0}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer disabled:opacity-50"
                      >
                        <Wrench size={13} className="text-amber-400" />
                        <span>Mark Filtered Investigating</span>
                      </button>

                      <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-rose-400 border-t border-white/[0.08] mt-1 pt-1">
                        Purge Tools
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBulkPurgeErrors("resolved")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition text-left cursor-pointer"
                      >
                        <Trash2 size={13} className="shrink-0" />
                        <span>Purge Resolved ({resolvedCount})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkPurgeErrors("ignored")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition text-left cursor-pointer"
                      >
                        <Trash2 size={13} className="shrink-0" />
                        <span>Purge Ignored ({ignoredCount})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkPurgeErrors("all")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition text-left cursor-pointer"
                      >
                        <Trash2 size={13} className="shrink-0" />
                        <span>Purge All ({allErrors.length}) Records</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Search Input & Category Dropdown Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={errorSearchQuery}
                onChange={(e) => {
                  setErrorSearchQuery(e.target.value);
                  setErrorPage(1);
                }}
                placeholder="Search error message, URL path, digest, or type..."
                className="w-full pl-9 pr-8 py-2 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition"
              />
              {errorSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorSearchQuery("");
                    setErrorPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="sm:col-span-4">
              <select
                value={errorTypeFilter}
                onChange={(e) => {
                  setErrorTypeFilter(e.target.value);
                  setErrorPage(1);
                }}
                aria-label="Filter error logs by type"
                className="w-full px-3 py-2 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white transition"
              >
                <option value="all">All Error Categories</option>
                <option value="not_found">404 Not Found (Missing Routes)</option>
                <option value="runtime">Runtime Exceptions</option>
                <option value="boundary">React Boundary Crashes</option>
                <option value="hydration">SSR Hydration Mismatches</option>
                <option value="http_5xx">Server 5xx Responses</option>
                <option value="http_4xx">Client 4xx Responses</option>
                <option value="api">API Endpoint Failures</option>
                <option value="console">Console Errors</option>
                <option value="unhandledrejection">Unhandled Promise Rejections</option>
                <option value="network">Network Failures</option>
                <option value="resource">Resource Load Failures</option>
                <option value="webgl">WebGL Context Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Master Multi-Selection Info Bar ── */}
        {selectedErrorIds.length > 0 && (
          <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/[0.08] flex items-center justify-between gap-3 text-xs font-medium">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <CheckSquare2 size={15} className="text-white" />
                <span className="tabular-nums">{selectedErrorIds.length} errors selected</span>
              </span>
              {selectedErrorIds.length < filteredErrors.length && (
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-white hover:underline font-medium cursor-pointer"
                >
                  Select all {filteredErrors.length} matching
                </button>
              )}
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-zinc-400 hover:text-white ml-1 cursor-pointer transition"
              >
                Clear selection
              </button>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Use floating action dock at bottom to execute mass actions
            </span>
          </div>
        )}

        {/* ── High-Density Exception Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e0f15] border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-wider text-zinc-400 select-none">
              <tr>
                {/* Select All Checkbox */}
                <th className="p-3.5 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAllPage}
                    className="text-zinc-500 hover:text-white transition cursor-pointer"
                    title={isAllPageSelected ? "Deselect Page" : "Select All On Page"}
                  >
                    {isAllPageSelected ? (
                      <CheckSquare2 size={16} className="text-white" />
                    ) : isSomePageSelected ? (
                      <MinusSquare size={16} className="text-white" />
                    ) : (
                      <Square size={16} className="text-zinc-600" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Error &amp; Affected Route</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Events</th>
                <th className="p-3.5">Last Seen</th>
                <th className="p-3.5 text-right">Actions &amp; AI Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredErrors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-zinc-400">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                      <CheckCircle2 size={22} />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Zero Exceptions Found</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      {errorSearchQuery || errorStatusFilter !== "all" || errorTypeFilter !== "all"
                        ? "No error traces matched your filter criteria."
                        : "Your application is running smoothly with no tracked errors!"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedErrors.map((err) => {
                  const isSelected = selectedErrorIds.includes(err._id);
                  const isExpanded = expandedErrorId === err._id;

                  return (
                    <React.Fragment key={err._id}>
                      <tr
                        onClick={() => setExpandedErrorId(isExpanded ? null : err._id)}
                        className={`transition group cursor-pointer ${
                          isSelected
                            ? "bg-white/[0.06]"
                            : isExpanded
                              ? "bg-white/[0.03]"
                              : "hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* 1. Selection Checkbox */}
                        <td
                          className="p-3.5 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleSelectError(err._id)}
                            className="text-zinc-500 hover:text-white transition cursor-pointer"
                            title={isSelected ? "Deselect" : "Select"}
                          >
                            {isSelected ? (
                              <CheckSquare2 size={16} className="text-white" />
                            ) : (
                              <Square size={16} className="text-zinc-600" />
                            )}
                          </button>
                        </td>

                        {/* 2. Status Badge / Switcher */}
                        <td
                          className="p-3.5 whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={err.status}
                            onChange={(e) => handleUpdateErrorStatus(err._id, e.target.value)}
                            aria-label="Change error status"
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition cursor-pointer focus:outline-none ${
                              err.status === "new"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : err.status === "investigating"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : err.status === "resolved"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-white/[0.04] text-zinc-400 border-white/[0.08]"
                            } [&>option]:bg-[#111218] [&>option]:text-white`}
                          >
                            <option value="new">New</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="ignored">Ignored</option>
                          </select>
                        </td>

                        {/* 3. Error Description & Route Link */}
                        <td className="p-3.5 max-w-md">
                          <div className="space-y-1">
                            {/* Message Header with Quick Copy */}
                            <div className="flex items-start gap-1.5">
                              <span
                                className="font-medium text-white font-mono text-xs leading-snug line-clamp-2 hover:line-clamp-none transition"
                                title="Click row to expand details & stack trace"
                              >
                                {err.message}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyMessage(err);
                                }}
                                className="p-0.5 text-zinc-500 hover:text-white transition shrink-0 opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Copy error message"
                              >
                                {copiedMessageId === err._id ? (
                                  <Check size={11} className="text-emerald-400" />
                                ) : (
                                  <Copy size={11} />
                                )}
                              </button>
                            </div>

                            {/* Pathname Link */}
                            <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-zinc-400">
                              <a
                                href={getTrackedUrl(String(err.pathname), activeProject)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-white flex items-center gap-1 transition max-w-xs truncate"
                                title={`Open ${err.pathname}`}
                              >
                                <span className="truncate">{err.pathname}</span>
                                <ExternalLink size={10} className="shrink-0 text-zinc-500" />
                              </a>
                              {err.digest && (
                                <span className="bg-white/[0.04] border border-white/[0.06] text-zinc-400 px-1.5 py-0.2 rounded text-[10px]">
                                  digest: {err.digest}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 4. Category Badge */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-medium font-mono text-[10px] uppercase border inline-flex items-center gap-1 ${getCategoryBadgeClass(
                              err.errorType
                            )}`}
                          >
                            <span>{getCategoryLabel(err.errorType)}</span>
                          </span>
                        </td>

                        {/* 5. Occurrences count */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-md font-mono text-xs font-semibold text-white tabular-nums">
                            <Flame size={11} className="text-amber-400 shrink-0" />
                            <span>{err.occurrences}x</span>
                          </span>
                        </td>

                        {/* 6. Last Seen Timestamp & Device */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-mono text-xs text-white font-medium flex items-center gap-1 tabular-nums">
                            <Clock size={11} className="text-zinc-400 shrink-0" />
                            <span>{timeAgo(err.lastOccurredAt)}</span>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                            <span>
                              {err.browser || "Unknown"} &bull; {err.os || "Desktop"}
                            </span>
                          </div>
                        </td>

                        {/* 7. Action Tools: AI Fix Prompt, Mute, Delete */}
                        <td
                          className="p-3.5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* AI Fix Prompt */}
                            <button
                              type="button"
                              onClick={() => handleCopyAiPrompt(err)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                                copiedErrorId === err._id
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-[#0e0f15] hover:bg-[#181922] border-white/[0.08] text-zinc-300 hover:text-white"
                              }`}
                              title="Copy AI fix prompt for this crash"
                            >
                              {copiedErrorId === err._id ? (
                                <Check size={12} />
                              ) : (
                                <Bot size={12} className="text-zinc-400" />
                              )}
                              <span>
                                {copiedErrorId === err._id ? "Copied!" : "AI Fix"}
                              </span>
                            </button>

                            {/* Mute Rule Menu */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setMuteMenuErrorId(
                                    muteMenuErrorId === err._id ? null : err._id
                                  )
                                }
                                className="p-1.5 rounded-lg bg-[#0e0f15] hover:bg-[#181922] border border-white/[0.08] text-zinc-400 hover:text-white transition cursor-pointer"
                                title="Mute future occurrences"
                              >
                                <Ban size={12} className="text-amber-400" />
                              </button>

                              {muteMenuErrorId === err._id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setMuteMenuErrorId(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-2 z-50 p-1.5 bg-[#111218] border border-white/[0.08] rounded-xl shadow-2xl w-60 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-150">
                                    <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/[0.08] mb-1">
                                      Mute Future Tracking
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickMute(err, "message")}
                                      className="w-full flex items-start gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                                    >
                                      <ShieldOff size={13} className="text-rose-400 shrink-0 mt-0.5" />
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium truncate">Mute Exact Message</div>
                                        <div className="text-[10px] text-zinc-500 font-normal truncate">
                                          {err.message}
                                        </div>
                                      </div>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickMute(err, "pathname")}
                                      className="w-full flex items-start gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                                    >
                                      <ShieldOff size={13} className="text-amber-400 shrink-0 mt-0.5" />
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium truncate">Mute Route</div>
                                        <div className="text-[10px] text-zinc-500 font-normal truncate">
                                          {err.pathname}
                                        </div>
                                      </div>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickMute(err, "errorType")}
                                      className="w-full flex items-start gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                                    >
                                      <ShieldOff size={13} className="text-sky-400 shrink-0 mt-0.5" />
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium truncate">
                                          Mute Category: {(err.errorType || "runtime").toUpperCase()}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-normal">
                                          Ignore this category
                                        </div>
                                      </div>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteError(err._id)}
                              className="p-1.5 rounded-lg bg-[#0e0f15] hover:bg-rose-500/10 hover:text-rose-400 border border-white/[0.08] text-zinc-500 transition cursor-pointer"
                              title="Delete error record"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Accordion Row (Stack Trace & AI Fix) */}
                      {isExpanded && (
                        <tr className="bg-[#090a0f] border-b border-white/[0.08]">
                          <td colSpan={7} className="p-4 sm:p-5 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                              {/* Left: Stack Trace Code Box */}
                              <div className="lg:col-span-8 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <Code2 size={13} className="text-rose-400" />
                                    <span>Diagnostic Stack Trace</span>
                                  </span>
                                  {err.stack && (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          await navigator.clipboard.writeText(err.stack || "");
                                          showRuleNotification("Stack trace copied to clipboard.");
                                        } catch {}
                                      }}
                                      className="px-2.5 py-1 bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white rounded-md text-[11px] font-medium font-mono transition cursor-pointer"
                                    >
                                      Copy Trace
                                    </button>
                                  )}
                                </div>
                                <pre className="p-3.5 bg-[#0e0f15] text-rose-300 font-mono text-[11px] rounded-xl overflow-x-auto border border-white/[0.08] leading-relaxed whitespace-pre-wrap max-h-72">
                                  {err.stack || "No JavaScript stack trace captured for this error event."}
                                </pre>
                              </div>

                              {/* Right: AI Fix Prompt Snippet & Environment Info */}
                              <div className="lg:col-span-4 space-y-3">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                      <Bot size={13} className="text-zinc-400" />
                                      <span>AI Prompt Preview</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyAiPrompt(err)}
                                      className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-zinc-950 rounded-md text-[11px] font-medium transition cursor-pointer"
                                    >
                                      Copy Prompt
                                    </button>
                                  </div>
                                  <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl text-[11px] font-mono text-zinc-400 space-y-1.5 leading-snug">
                                    <div>
                                      <strong className="text-zinc-200 font-medium">Route:</strong>{" "}
                                      {err.pathname}
                                    </div>
                                    <div>
                                      <strong className="text-zinc-200 font-medium">Type:</strong>{" "}
                                      {err.errorType || "runtime"}
                                    </div>
                                    <div>
                                      <strong className="text-zinc-200 font-medium">Client:</strong>{" "}
                                      {err.browser || "Unknown"} on {err.os || "Desktop"} ({err.device || "desktop"})
                                    </div>
                                    <div>
                                      <strong className="text-zinc-200 font-medium">Exact Time:</strong>{" "}
                                      {formatExactTime(err.lastOccurredAt)} ({formatExactDate(err.lastOccurredAt)})
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateErrorStatus(err._id, "resolved")}
                                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition text-center cursor-pointer"
                                  >
                                    Mark Resolved
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickMute(err, "message")}
                                    className="px-3 py-1.5 bg-[#0e0f15] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer"
                                  >
                                    Mute Rule
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer Navigation & Pagination ── */}
        {filteredErrors.length > 0 && (
          <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap text-xs text-zinc-400">
              <span className="font-mono">
                Showing{" "}
                <strong className="text-white font-medium">
                  {(errorPage - 1) * errorPageSize + 1}–
                  {Math.min(errorPage * errorPageSize, filteredErrors.length)}
                </strong>{" "}
                of <strong className="text-white font-medium">{filteredErrors.length}</strong>{" "}
                errors
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08]">
                <span className="text-[11px]">Per page:</span>
                <select
                  value={errorPageSize}
                  onChange={(e) => {
                    setErrorPageSize(Number(e.target.value));
                    setErrorPage(1);
                  }}
                  aria-label="Errors per page"
                  className="px-2 py-1 bg-[#111218] border border-white/[0.08] rounded-md text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setErrorPage(1)}
                disabled={errorPage <= 1}
                className="p-1 rounded-md bg-[#111218] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft size={13} />
              </button>

              <button
                type="button"
                onClick={() => setErrorPage((p) => Math.max(1, p - 1))}
                disabled={errorPage <= 1}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#111218] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>

              {/* Page Number Pills */}
              <div className="hidden sm:flex items-center gap-1">
                {getErrorPageNumbers().map((num, idx) =>
                  typeof num === "number" ? (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setErrorPage(num)}
                      className={`w-6 h-6 rounded-md text-xs font-medium transition cursor-pointer ${
                        errorPage === num
                          ? "bg-white text-zinc-950"
                          : "bg-[#111218] border border-white/[0.08] hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-zinc-600 text-xs">
                      {num}
                    </span>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => setErrorPage((p) => Math.min(totalErrorPages, p + 1))}
                disabled={errorPage >= totalErrorPages}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#111218] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>

              <button
                type="button"
                onClick={() => setErrorPage(totalErrorPages)}
                disabled={errorPage >= totalErrorPages}
                className="p-1 rounded-md bg-[#111218] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight size={13} />
              </button>

              {totalErrorPages > 1 && (
                <form
                  onSubmit={handleJumpErrorPage}
                  className="hidden md:flex items-center gap-1 pl-2 border-l border-white/[0.08]"
                >
                  <input
                    type="number"
                    min={1}
                    max={totalErrorPages}
                    value={errorJumpPageInput}
                    onChange={(e) => setErrorJumpPageInput(e.target.value)}
                    placeholder="#"
                    className="w-10 px-1.5 py-1 bg-[#111218] border border-white/[0.08] rounded-md text-xs text-center font-mono text-white focus:outline-none focus:border-white/20"
                  />
                  <button
                    type="submit"
                    disabled={!errorJumpPageInput}
                    className="px-2 py-1 bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-zinc-300 rounded-md text-xs font-medium disabled:opacity-30 transition cursor-pointer"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Interactive Floating Multi-Selection Dock (HUD) ── */}
      {selectedErrorIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 bg-[#111218]/95 text-white backdrop-blur-md rounded-xl shadow-2xl border border-white/[0.1] animate-in slide-in-from-bottom-5 fade-in duration-200 max-w-[95vw] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.06] rounded-lg text-xs font-medium font-mono tabular-nums">
            <CheckSquare2 size={14} className="text-white" />
            <span>{selectedErrorIds.length} Selected</span>
          </div>

          <div className="h-4 w-px bg-white/[0.1]" />

          {/* Quick Mark Resolved */}
          <button
            type="button"
            onClick={() => handleBulkUpdateErrors("resolved", selectedErrorIds)}
            disabled={errorBulkLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Mark all selected errors as Resolved"
          >
            <CheckCheck size={12} />
            <span className="hidden sm:inline">Resolve</span>
          </button>

          {/* Quick Mark Investigating */}
          <button
            type="button"
            onClick={() => handleBulkUpdateErrors("investigating", selectedErrorIds)}
            disabled={errorBulkLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Mark all selected errors as Investigating"
          >
            <Wrench size={12} />
            <span className="hidden sm:inline">Investigate</span>
          </button>

          {/* Quick Mark Ignored */}
          <button
            type="button"
            onClick={() => handleBulkUpdateErrors("ignored", selectedErrorIds)}
            disabled={errorBulkLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#181922] hover:bg-[#20222c] text-zinc-300 rounded-lg text-xs font-medium transition border border-white/[0.08] cursor-pointer disabled:opacity-50"
            title="Mark all selected errors as Ignored"
          >
            <Ban size={12} />
            <span className="hidden sm:inline">Ignore</span>
          </button>

          {/* Quick Mark New */}
          <button
            type="button"
            onClick={() => handleBulkUpdateErrors("new", selectedErrorIds)}
            disabled={errorBulkLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Re-open all selected errors as New"
          >
            <AlertCircle size={12} />
            <span className="hidden sm:inline">Mark New</span>
          </button>

          {/* Copy AI Fix Prompt for Selected */}
          <button
            type="button"
            onClick={handleCopySelectedAiPrompts}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              copiedSelectionPrompt
                ? "bg-emerald-600 text-white"
                : "bg-white/[0.06] hover:bg-white/[0.1] text-white"
            }`}
            title="Copy bundled AI diagnostics for selected errors"
          >
            {copiedSelectionPrompt ? <Check size={12} /> : <Bot size={12} className="text-zinc-400" />}
            <span className="hidden md:inline">
              {copiedSelectionPrompt ? "Copied!" : "AI Prompt"}
            </span>
          </button>

          {/* Export Selected Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSelectionExportDropdown(!showSelectionExportDropdown)}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-lg text-xs font-medium transition cursor-pointer"
              title="Export selected errors"
            >
              <Download size={12} />
              <span className="hidden md:inline">Export</span>
              <ChevronDown size={10} />
            </button>

            {showSelectionExportDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSelectionExportDropdown(false)}
                />
                <div className="absolute right-0 bottom-full mb-2 z-50 p-1.5 bg-[#111218] border border-white/[0.08] text-white rounded-xl shadow-2xl w-48 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[9px] font-semibold uppercase text-zinc-400 border-b border-white/[0.08]">
                    Export {selectedErrorIds.length} Selected
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportErrors("markdown", selectedErrorsList)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                  >
                    <FileText size={13} className="text-zinc-400" />
                    <span>Markdown Report (.md)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportErrors("json", selectedErrorsList)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                  >
                    <FileJson size={13} className="text-amber-400" />
                    <span>JSON Dump (.json)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportErrors("csv", selectedErrorsList)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium hover:bg-white/[0.04] rounded-lg transition text-left cursor-pointer"
                  >
                    <FileSpreadsheet size={13} className="text-emerald-400" />
                    <span>CSV Table (.csv)</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Delete Selected */}
          <button
            type="button"
            onClick={() => handleBulkDeleteSelected(selectedErrorIds)}
            disabled={errorBulkLoading}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
            title="Permanently delete selected errors"
          >
            <Trash2 size={13} />
          </button>

          {/* Deselect / Close */}
          <button
            type="button"
            onClick={handleClearSelection}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
            title="Deselect all"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Toast Notification Banner ── */}
      {ruleToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#111218] text-white rounded-xl shadow-2xl border border-white/[0.08] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{ruleToast}</span>
          <button
            type="button"
            onClick={() => setRuleToast(null)}
            className="ml-2 text-zinc-400 hover:text-white text-xs cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Blocked Error Rules Manager Modal ── */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowRulesModal(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#111218] border border-white/[0.08] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#0e0f15]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Blocked &amp; Ignored Error Rules
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Errors matching active rules are automatically suppressed at ingestion.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Create New Block Rule Form */}
              <form
                onSubmit={handleCreateRule}
                className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Plus size={14} className="text-white" />
                    <span>Add New Suppression Rule</span>
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Applies immediately
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-medium uppercase text-zinc-400 block mb-1">
                      Rule Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newRuleForm.name}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                      placeholder="e.g. Ignore ResizeObserver"
                      className="w-full px-3 py-1.5 bg-[#111218] border border-white/[0.08] rounded-lg text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-medium uppercase text-zinc-400 block mb-1">
                      Match Field
                    </label>
                    <select
                      value={newRuleForm.matchField}
                      onChange={(e) =>
                        setNewRuleForm({ ...newRuleForm, matchField: e.target.value as any })
                      }
                      aria-label="Match Target Field"
                      className="w-full px-3 py-1.5 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white transition"
                    >
                      <option value="message">Error Message</option>
                      <option value="pathname">Route / Pathname</option>
                      <option value="errorType">Error Type / Category</option>
                      <option value="stack">Stack Trace Content</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium uppercase text-zinc-400 block mb-1">
                      Operator
                    </label>
                    <select
                      value={newRuleForm.matchType}
                      onChange={(e) =>
                        setNewRuleForm({ ...newRuleForm, matchType: e.target.value as any })
                      }
                      aria-label="Match Operator"
                      className="w-full px-3 py-1.5 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-white/20 cursor-pointer [&>option]:bg-[#111218] [&>option]:text-white transition"
                    >
                      <option value="contains">Contains Substring</option>
                      <option value="exact">Exact Match</option>
                      <option value="starts_with">Starts With</option>
                      <option value="regex">Regular Expression</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-medium uppercase text-zinc-400 block mb-1">
                      Pattern to Match
                    </label>
                    <input
                      type="text"
                      required
                      value={newRuleForm.pattern}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, pattern: e.target.value })}
                      placeholder="e.g. ResizeObserver loop limit exceeded"
                      className="w-full px-3 py-1.5 bg-[#111218] border border-white/[0.08] rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition"
                    />
                  </div>
                  <div className="self-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs rounded-lg transition cursor-pointer"
                    >
                      Save Rule
                    </button>
                  </div>
                </div>
              </form>

              {/* Existing Rules List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Configured Rules ({rulesList.length})
                  </span>
                  {rulesLoading && (
                    <RefreshCw size={13} className="animate-spin text-white" />
                  )}
                </div>

                {rulesList.length === 0 ? (
                  <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl">
                    <ShieldCheck size={28} className="text-emerald-400 mx-auto mb-1.5" />
                    <h5 className="text-xs font-semibold text-white">No Active Block Rules</h5>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      All runtime exceptions and HTTP errors will be ingested. Use the form above to mute specific errors.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rulesList.map((rule) => (
                      <div
                        key={rule.id}
                        className={`p-3.5 border rounded-xl flex items-center justify-between gap-3 transition ${
                          rule.enabled
                            ? "bg-[#0e0f15] border-white/[0.08]"
                            : "bg-[#0e0f15]/40 border-white/[0.04] opacity-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase font-mono border ${
                                rule.enabled
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-white/[0.04] text-zinc-500 border-white/[0.06]"
                              }`}
                            >
                              {rule.enabled ? "Active / Suppressed" : "Paused"}
                            </span>
                            <span className="text-xs font-medium text-white truncate">
                              {rule.name || rule.pattern}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 flex-wrap">
                            <span>Field: <strong className="text-white font-medium">{rule.matchField}</strong></span>
                            <span>&bull;</span>
                            <span>Op: <strong className="text-white font-medium">{rule.matchType}</strong></span>
                            <span>&bull;</span>
                            <span className="truncate max-w-xs">
                              Pattern: <strong className="text-white font-medium">&ldquo;{rule.pattern}&rdquo;</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleRule(rule.id, rule.enabled)}
                            className="p-1 text-zinc-500 hover:text-white transition cursor-pointer"
                            title={rule.enabled ? "Pause this rule" : "Activate this rule"}
                          >
                            {rule.enabled ? (
                              <ToggleRight size={24} className="text-emerald-400" />
                            ) : (
                              <ToggleLeft size={24} className="text-zinc-600" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex justify-end">
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 bg-[#111218] hover:bg-[#181922] border border-white/[0.08] text-white rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

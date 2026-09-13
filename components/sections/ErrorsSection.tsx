"use client";

import React, { useState, useEffect } from "react";
import {
  Bug,
  AlertCircle,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  ExternalLink,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { ErrorLogItem, AnalyticsData, timeAgo, formatExactTime, formatExactDate } from "@/lib/analyticsTypes";

export default function ErrorsSection({ data: propData }: { data?: AnalyticsData }) {
  const { activeProjectId, data: platformData, timeRange, fetchData } = usePlatform();
  const [dataState, setDataState] = useState<AnalyticsData | null>(propData || platformData);

  useEffect(() => {
    if (propData || platformData) setDataState(propData || platformData);
  }, [propData, platformData]);

  const data = dataState;

  const [errorStatusFilter, setErrorStatusFilter] = useState<string>("all");
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>("all");
  const [errorSearchQuery, setErrorSearchQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedErrorId, setCopiedErrorId] = useState<string | null>(null);
  const [copiedAllErrors, setCopiedAllErrors] = useState<boolean>(false);
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  const [showBulkActionDropdown, setShowBulkActionDropdown] = useState<boolean>(false);
  const [errorBulkLoading, setErrorBulkLoading] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<number>(1);
  const [errorPageSize, setErrorPageSize] = useState<number>(20);
  const [errorJumpPageInput, setErrorJumpPageInput] = useState<string>("");
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  useEffect(() => {
    setErrorPage(1);
  }, [errorStatusFilter, errorTypeFilter, errorSearchQuery, timeRange]);

  const generateAiFixPrompt = (err: ErrorLogItem) => {
    return `# 🐛 Bug Diagnostic & Fix Report
**Route / Pathname:** \`${err.pathname}\`
**Error Type:** \`${err.errorType || "runtime"}\`
**Occurrences:** ${err.occurrences}
**Environment:** ${err.browser || "Unknown"} on ${err.os || "Unknown"} (${err.device || "Desktop"})
**Digest / Error Code:** ${err.digest || "None"}
**Last Seen:** ${new Date(err.lastOccurredAt).toLocaleString()}
**Error ID:** \`${err._id}\`

### 🚨 Error Message
\`\`\`
${err.message}
\`\`\`

### 📜 Stack Trace
\`\`\`
${err.stack || "No client stack trace available"}
\`\`\`

---
### 🛠️ AI Fix Instructions
1. Inspect the route component or API handler at \`${err.pathname}\`.
2. Locate the function throwing: \`${err.message}\`.
3. Check for undefined/null property access, missing SSR guards (\`typeof window !== "undefined"\`), invalid JSON parsing, or missing API responses.
4. Implement safe fallbacks or boundary checks to completely eliminate this error.`;
  };

  const handleCopyAiPrompt = async (err: ErrorLogItem) => {
    const promptText = generateAiFixPrompt(err);
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedErrorId(err._id);
      setTimeout(() => setCopiedErrorId(null), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const handleCopyAllAiPrompts = async (errorsToCopy: ErrorLogItem[]) => {
    if (errorsToCopy.length === 0) return;
    const header = `# 🛠️ Open Analytics Automated Error Triage Report
Generated on: ${new Date().toLocaleString()}
Total Tracked Errors: ${errorsToCopy.length}

---
`;
    const body = errorsToCopy
      .map(
        (err, idx) =>
          `## Bug #${idx + 1}: [${(err.errorType || "runtime").toUpperCase()}] on ${err.pathname}\n${generateAiFixPrompt(
            err
          )}`
      )
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(header + body);
      setCopiedAllErrors(true);
      setTimeout(() => setCopiedAllErrors(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const handleExportErrors = (format: "markdown" | "json" | "csv", errorsToExport: ErrorLogItem[]) => {
    if (errorsToExport.length === 0) return;
    setShowExportDropdown(false);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let content = "";
    let mimeType = "text/plain";
    let filename = `open_analytics_errors_${timestamp}`;

    if (format === "markdown") {
      filename += ".md";
      mimeType = "text/markdown";
      const header = `# 📋 Open Analytics Error Diagnostics & AI Fix Report
- **Export Date:** ${new Date().toLocaleString()}
- **Total Filtered Errors:** ${errorsToExport.length}
- **Active Errors:** ${errorsToExport.filter((e) => e.status === "new" || e.status === "investigating").length
        }
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
          "x-admin-secret": '',
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
      }
    } catch (err) {
      console.error("Bulk update errors error:", err);
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
      const res = await fetch(`/api/admin/analytics/errors/${errorId}`, {
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
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };


  const allErrors = data?.recentErrors || [];
  const errorCounts = {
    all: allErrors.length,
    total: allErrors.length,
    active: allErrors.filter((e) => e.status === "new" || e.status === "investigating").length,
    new: allErrors.filter((e) => e.status === "new").length,
    investigating: allErrors.filter((e) => e.status === "investigating").length,
    resolved: allErrors.filter((e) => e.status === "resolved").length,
    ignored: allErrors.filter((e) => e.status === "ignored").length,
  };

  const filteredErrors = allErrors.filter((err) => {
    if (errorStatusFilter !== "all" && err.status !== errorStatusFilter) return false;
    if (errorTypeFilter !== "all" && err.errorType !== errorTypeFilter) return false;
    const q = (errorSearchQuery || searchQuery).toLowerCase().trim();
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

  if (!data) return null;

  return (
        <div className="space-y-5">
          {/* Header Strip & Export Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  <Bug className="text-rose-500" size={20} />
                  <span>Error Diagnostics & AI Triage Engine</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold">
                  {errorCounts.active} Active / {errorCounts.total} Total
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Export error traces, copy AI fix prompts with stack traces, and triage anomalies across all lab routes.
              </p>
            </div>

            {/* Action Buttons: Copy All, Export Menu, Bulk Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy All AI Prompts Button */}
              <button
                type="button"
                onClick={() => handleCopyAllAiPrompts(filteredErrors)}
                disabled={filteredErrors.length === 0}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 ${copiedAllErrors
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                title="Copy all currently filtered errors as an actionable prompt for AI agents (Antigravity, Cursor, Claude Code)"
              >
                {copiedAllErrors ? <Check size={14} /> : <Bot size={14} />}
                <span>{copiedAllErrors ? "Copied All AI Prompts! 📋" : `Copy AI Fix Prompts (${filteredErrors.length})`}</span>
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
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-xs cursor-pointer disabled:opacity-50"
                  title="Export error diagnostics"
                >
                  <Download size={14} />
                  <span>Export ({filteredErrors.length})</span>
                  <ChevronDown size={12} className={showExportDropdown ? "rotate-180 transition" : "transition"} />
                </button>

                {showExportDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExportDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 p-2 bg-card border border-border rounded-2xl shadow-2xl w-64 max-w-[calc(100vw-2rem)] space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
                        Choose Export Format
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExportErrors("markdown", filteredErrors)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer"
                      >
                        <FileText size={14} className="text-primary shrink-0" />
                        <div>
                          <div className="font-black">AI Debug Report (.md)</div>
                          <div className="text-[10px] text-muted-foreground font-normal">Formatted markdown with AI fix prompts</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportErrors("json", filteredErrors)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer"
                      >
                        <FileJson size={14} className="text-amber-500 shrink-0" />
                        <div>
                          <div className="font-black">Raw JSON Dump (.json)</div>
                          <div className="text-[10px] text-muted-foreground font-normal">Complete telemetry dataset</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportErrors("csv", filteredErrors)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer"
                      >
                        <FileSpreadsheet size={14} className="text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-black">Spreadsheet Table (.csv)</div>
                          <div className="text-[10px] text-muted-foreground font-normal">Excel and Google Sheets compatible</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Bulk Actions Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkActionDropdown(!showBulkActionDropdown);
                    setShowExportDropdown(false);
                  }}
                  disabled={errorBulkLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-xs cursor-pointer disabled:opacity-50"
                  title="Bulk error actions"
                >
                  <SlidersHorizontal size={14} />
                  <span>Bulk Actions</span>
                  <ChevronDown size={12} className={showBulkActionDropdown ? "rotate-180 transition" : "transition"} />
                </button>

                {showBulkActionDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowBulkActionDropdown(false)}
                    />
                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 p-2 bg-card border border-border rounded-2xl shadow-2xl w-60 max-w-[calc(100vw-2rem)] space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
                        Status Management
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
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer disabled:opacity-50"
                      >
                        <CheckCheck size={14} className="text-emerald-500 shrink-0" />
                        <span>Mark Filtered ({filteredErrors.length}) as Resolved</span>
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
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-xl transition text-left cursor-pointer disabled:opacity-50"
                      >
                        <Wrench size={14} className="text-amber-500 shrink-0" />
                        <span>Mark Filtered as Investigating</span>
                      </button>

                      {true && (
                        <>
                          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-rose-500 border-t border-border mt-1 pt-1.5">
                            Admin Purge Tools
                          </div>

                          <button
                            type="button"
                            onClick={() => handleBulkPurgeErrors("resolved")}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10 rounded-xl transition text-left cursor-pointer"
                          >
                            <Trash2 size={14} className="shrink-0" />
                            <span>Purge Resolved ({errorCounts.resolved})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleBulkPurgeErrors("all")}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10 rounded-xl transition text-left cursor-pointer"
                          >
                            <Trash2 size={14} className="shrink-0" />
                            <span>Purge All ({errorCounts.total}) Records</span>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* Filter Bar: Status Pills, Type Select & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card/60 border border-border/80 rounded-2xl p-3.5 shadow-2xs">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {[
                { id: "all", label: "All", count: errorCounts.total },
                { id: "active", label: "Active", count: errorCounts.active },
                { id: "new", label: "New", count: errorCounts.new },
                { id: "investigating", label: "Investigating", count: errorCounts.investigating },
                { id: "resolved", label: "Resolved", count: errorCounts.resolved },
                { id: "ignored", label: "Ignored", count: errorCounts.ignored },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setErrorStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${errorStatusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${errorStatusFilter === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-card text-muted-foreground"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Error Type Selector & Search Input */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Type Select */}
              <select
                value={errorTypeFilter}
                onChange={(e) => setErrorTypeFilter(e.target.value)}
                aria-label="Filter error logs by type"
                className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none focus:border-primary shadow-2xs cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
              >
                <option value="all">All Error Types</option>
                <option value="not_found">404 Not Found</option>
                <option value="runtime">Runtime Exception</option>
                <option value="boundary">React Boundary</option>
                <option value="http_5xx">Server 5xx</option>
                <option value="http_4xx">Client 4xx</option>
                <option value="api">API Endpoint</option>
                <option value="hydration">Hydration Mismatch</option>
                <option value="console">Console Error</option>
                <option value="unhandledrejection">Unhandled Promise</option>
                <option value="network">Network Failure</option>
                <option value="resource">Resource Load</option>
                <option value="webgl">WebGL / Shader</option>
              </select>

              {/* Search Box */}
              <div className="relative flex-grow sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={errorSearchQuery}
                  onChange={(e) => setErrorSearchQuery(e.target.value)}
                  placeholder="Search error, path, stack..."
                  className="w-full pl-8 pr-8 py-1.5 bg-card border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs"
                />
                {errorSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setErrorSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List of Error Cards */}
          <div className="space-y-3.5">
            {filteredErrors.length === 0 ? (
              <div className="p-12 text-center bg-card border border-border rounded-3xl space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                  🎉
                </div>
                <h4 className="text-sm font-bold text-foreground">No Runtime Errors Found</h4>
                <p className="text-xs text-muted-foreground">
                  {errorSearchQuery || errorStatusFilter !== "all" || errorTypeFilter !== "all"
                    ? "No error traces matched your current filter criteria."
                    : "Your application is running smoothly with zero tracked exceptions!"}
                </p>
              </div>
            ) : (
              paginatedErrors.map((err) => (
                <div
                  key={err._id}
                  className={`p-4 sm:p-5 bg-card border rounded-3xl space-y-3.5 shadow-sm transition-all ${err.status === "new"
                    ? "border-rose-500/40 bg-rose-500/[0.02]"
                    : err.status === "investigating"
                      ? "border-amber-500/30 bg-amber-500/[0.01]"
                      : "border-border"
                    }`}
                >
                  {/* Top: Error Message & Action Buttons */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 border-b border-border pb-3.5">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded font-black font-mono text-[10px] uppercase border ${err.errorType === "not_found"
                            ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20"
                            : err.errorType === "http_4xx"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : err.errorType === "http_5xx" || err.errorType === "boundary"
                                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                : err.errorType === "api"
                                  ? "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20"
                                  : err.errorType === "resource"
                                    ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                                    : err.errorType === "webgl"
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : err.errorType === "hydration" || err.errorType === "console"
                                        ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                                        : err.errorType === "unhandledrejection"
                                          ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                                          : err.errorType === "network"
                                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20"
                                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            }`}
                        >
                          {err.errorType === "not_found"
                            ? "404 Not Found"
                            : err.errorType === "http_4xx"
                              ? "HTTP 4xx (Client)"
                              : err.errorType === "http_5xx"
                                ? "HTTP 5xx (Server)"
                                : err.errorType || "runtime"}
                        </span>

                        <span className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground font-bold">
                          {err.occurrences} {err.occurrences === 1 ? "occurrence" : "occurrences"}
                        </span>

                        <a
                          href={String(err.pathname)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition"
                        >
                          <span>{err.pathname}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>

                      <h4 className="font-bold text-foreground text-sm leading-snug font-mono break-words">
                        {err.message}
                      </h4>
                    </div>

                    {/* Action Tools: Copy AI Fix Prompt & Status Switcher */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* One-Click Copy AI Fix Prompt */}
                      <button
                        type="button"
                        onClick={() => handleCopyAiPrompt(err)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-2xs cursor-pointer ${copiedErrorId === err._id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-card border-border hover:border-primary text-foreground hover:bg-muted"
                          }`}
                        title="Copy diagnostic prompt to fix this error with AI"
                      >
                        {copiedErrorId === err._id ? <Check size={13} /> : <Bot size={13} className="text-primary" />}
                        <span>{copiedErrorId === err._id ? "Copied Prompt! 📋" : "Copy AI Fix Prompt"}</span>
                      </button>

                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "new")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "new"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          New
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "investigating")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "investigating"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          Investigating
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "resolved")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "resolved"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          Resolved
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateErrorStatus(err._id, "ignored")}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${err.status === "ignored"
                            ? "bg-slate-700 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          Ignore
                        </button>
                      </div>

                      {true && (
                        <button
                          type="button"
                          onClick={() => handleDeleteError(err._id)}
                          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Error Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device, Environment & Timestamp Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>
                        {err.os || "Unknown OS"} &bull; {err.browser || "Unknown Browser"} ({err.device || "desktop"})
                      </span>
                      {err.digest && (
                        <span className="bg-muted px-1.5 py-0.2 rounded text-[10px]">
                          Digest: {err.digest}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-rose-500" />
                      <span>{formatExactTime(err.lastOccurredAt)}</span>
                      <span>({timeAgo(err.lastOccurredAt)})</span>
                      <span>&bull;</span>
                      <span>{formatExactDate(err.lastOccurredAt)}</span>
                    </div>
                  </div>

                  {/* Stack Trace Collapsible View */}
                  {err.stack && (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedErrorId(expandedErrorId === err._id ? null : err._id)
                        }
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Code2 size={12} />
                        <span>
                          {expandedErrorId === err._id ? "Hide Stack Trace" : "View Full Stack Trace"}
                        </span>
                        {expandedErrorId === err._id ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>

                      {expandedErrorId === err._id && (
                        <div className="relative">
                          <pre className="p-3.5 bg-black/95 text-rose-400 text-[10px] font-mono rounded-2xl overflow-x-auto border border-rose-500/20 leading-relaxed whitespace-pre-wrap">
                            {err.stack}
                          </pre>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(err.stack || "");
                              } catch { }
                            }}
                            className="absolute top-2.5 right-2.5 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[9px] font-bold font-mono transition"
                            title="Copy stack trace only"
                          >
                            Copy Trace
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ── Error Diagnostics Pagination Navigation Bar ── */}
          {filteredErrors.length > 0 && (
            <div className="p-4 bg-card border border-border rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                <span>
                  Showing <strong className="text-foreground">{Math.min((errorPage - 1) * errorPageSize + 1, filteredErrors.length)}</strong>–<strong className="text-foreground">{Math.min(errorPage * errorPageSize, filteredErrors.length)}</strong> of <strong className="text-foreground">{filteredErrors.length}</strong> {filteredErrors.length === 1 ? "error" : "errors"} (Page <strong className="text-foreground">{errorPage}</strong> of <strong className="text-foreground">{totalErrorPages}</strong>)
                </span>

                <div className="flex items-center gap-1.5 pl-2 border-l border-border">
                  <span className="text-[11px]">Per page:</span>
                  <select
                    value={errorPageSize}
                    onChange={(e) => {
                      setErrorPageSize(Number(e.target.value));
                      setErrorPage(1);
                    }}
                    aria-label="Errors per page"
                    className="px-2 py-1 bg-muted border border-border rounded-lg text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage(1)}
                  disabled={errorPage <= 1}
                  className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>

                {/* Prev Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage((p) => Math.max(1, p - 1))}
                  disabled={errorPage <= 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                {/* Numbered Pills */}
                <div className="hidden sm:flex items-center gap-1">
                  {getErrorPageNumbers().map((num, idx) =>
                    typeof num === "number" ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setErrorPage(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${errorPage === num
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-card border border-border hover:bg-muted text-foreground"
                          }`}
                      >
                        {num}
                      </button>
                    ) : (
                      <span key={idx} className="px-1 text-muted-foreground text-xs">
                        {num}
                      </span>
                    )
                  )}
                </div>

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage((p) => Math.min(totalErrorPages, p + 1))}
                  disabled={errorPage >= totalErrorPages}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setErrorPage(totalErrorPages)}
                  disabled={errorPage >= totalErrorPages}
                  className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>

                {/* Jump to Page form */}
                {totalErrorPages > 1 && (
                  <form onSubmit={handleJumpErrorPage} className="hidden md:flex items-center gap-1 pl-2 border-l border-border">
                    <input
                      type="number"
                      min={1}
                      max={totalErrorPages}
                      value={errorJumpPageInput}
                      onChange={(e) => setErrorJumpPageInput(e.target.value)}
                      placeholder="#"
                      className="w-12 px-2 py-1 bg-card border border-border rounded-lg text-xs text-center font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={!errorJumpPageInput}
                      className="px-2 py-1 bg-muted hover:bg-accent border border-border text-foreground rounded-lg text-xs font-bold disabled:opacity-40 transition cursor-pointer"
                    >
                      Go
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

  );
}

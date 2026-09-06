"use client";

import DateRangeNavigator from "@/components/DateRangeNavigator";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Play,
  Pause,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Download,
  Laptop,
  Smartphone,
  Tablet,
  Activity,
  Clock,
  Globe,
  FileJson,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ExternalLink,
  Check,
  Copy,
  ChevronDown,
  Calendar,
  Users,
  Repeat,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { PageViewItem, timeAgo, formatDuration, formatExactTime, formatExactDate } from "@/lib/analyticsTypes";
import { getFullCountryName, getCountryFlag } from "@/lib/countries";

export default function LiveFeedSection() {
  const {
    activeProjectId,
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
    pvSort,
    setPvSort,
    pvTimeRange,
    setPvTimeRange,
    liveStreamActive,
    setLiveStreamActive,
    fetchPaginatedPageviews,
    jumpPageInput,
    setJumpPageInput,
  } = usePlatform();

  const [selectedPv, setSelectedPv] = useState<PageViewItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= pvPagination.totalPages) {
      setPvPage(target);
      fetchPaginatedPageviews(target, pvLimit, pvUserType, pvQuery, pvSort, pvTimeRange);
      setJumpPageInput("");
    }
  };

  const getPageNumbers = () => {
    const total = pvPagination.totalPages;
    const current = pvPage;
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

  useEffect(() => {
    if (!liveStreamActive) return;
    const streamInterval = setInterval(() => {
      fetchPaginatedPageviews();
    }, 5000);
    return () => clearInterval(streamInterval);
  }, [liveStreamActive, fetchPaginatedPageviews]);

  return (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${liveStreamActive ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" : "bg-muted-foreground"}`} />
                <h3 className="text-sm font-black tracking-tight text-foreground">All Pageview Events &amp; Live Stream</h3>
              </div>
              <button onClick={() => setLiveStreamActive((v) => !v)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${liveStreamActive ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground border-border hover:text-foreground"}`}>
                {liveStreamActive ? (<><Pause size={10} /> <span>Live (5s)</span></>) : (<><Play size={10} /> <span>Stream Paused</span></>)}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-muted-foreground font-mono">Showing <strong className="text-foreground font-bold">{pvPagination.total === 0 ? 0 : (pvPage - 1) * pvLimit + 1}–{Math.min(pvPage * pvLimit, pvPagination.total)}</strong> of <strong className="text-foreground font-bold">{pvPagination.total.toLocaleString()}</strong> events</span>
            </div>
          </div>

          <div className="p-4 border-b border-border/70 space-y-3 bg-muted/10">

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input value={pvQuery} onChange={(e) => { setPvQuery(e.target.value); setPvPage(1); }} placeholder="Search path, visitor, country…" className="w-full bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground" />
              </div>

              {/* User Type Filter */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Users size={14} className="text-muted-foreground shrink-0" />
                <select value={pvUserType} onChange={(e) => { setPvUserType(e.target.value); setPvPage(1); }} className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100">
                  <option value="all">All Visitors</option>
                  <option value="new">New Visitors Only (Visit #1)</option>
                  <option value="returning">Returning Visitors Only</option>
                  <option value="anonymous">Guests / Anonymous Only</option>
                  <option value="authenticated">Logged-In Users Only</option>
                </select>
              </div>

              {/* Device Filter */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Smartphone size={14} className="text-muted-foreground shrink-0" />
                <select value={pvDevice} onChange={(e) => { setPvDevice(e.target.value); setPvPage(1); }} className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100">
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop Only</option>
                  <option value="mobile">Mobile Only</option>
                  <option value="tablet">Tablet Only</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
                <select value={pvSort} onChange={(e) => { setPvSort(e.target.value); setPvPage(1); }} className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100">
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="duration_desc">Longest Dwell</option>
                  <option value="scroll_desc">Deepest Scroll</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5">Exact Event Time</th>
                  <th className="p-3.5">Path &amp; Lab</th>
                  <th className="p-3.5">User / Visitor ID</th>
                  <th className="p-3.5">Dwell Time</th>
                  <th className="p-3.5">Scroll</th>
                  <th className="p-3.5">Referrer / UTM</th>
                  <th className="p-3.5">Device &amp; Geo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pvLoading && paginatedPageviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground text-xs">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-primary" />
                        <span>Loading pageview stream...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPageviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground text-xs">
                      No pageviews recorded matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedPageviews.map((pv) => (
                    <tr key={pv._id} className="hover:bg-muted/30 transition group">
                      {/* Exact Event Time */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-foreground flex items-center gap-1.5">
                          <Clock size={12} className="text-primary" />
                          <span>{formatExactTime(pv.createdAt)}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          <span>{timeAgo(pv.createdAt)}</span>
                          <span>&bull;</span>
                          <span>{formatExactDate(pv.createdAt)}</span>
                        </div>
                      </td>

                      {/* Path & Title */}
                      <td className="p-3.5 max-w-xs">
                        <a
                          href={pv.pathname}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{pv.pathname}</span>
                          <ExternalLink size={10} className="shrink-0 text-muted-foreground group-hover:text-primary" />
                        </a>
                        {pv.title && pv.title !== pv.pathname && (
                          <span className="text-[10px] text-muted-foreground truncate block">
                            {pv.title}
                          </span>
                        )}
                        {pv.labId && (
                          <span className="inline-block px-1.5 py-0.2 mt-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-mono font-bold">
                            {pv.labId}
                          </span>
                        )}
                      </td>

                      {/* User / Visitor */}
                      <td className="p-3.5">
                        {pv.userId ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-foreground block truncate max-w-[150px]">
                                {pv.userId.name || pv.userId.email}
                              </span>
                              {pv.isReturning || (pv.visitCount && pv.visitCount > 1) ? (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-sans font-bold text-[9px] border border-blue-500/20 inline-flex items-center gap-1" title={`Returning visitor (${pv.visitCount || 2} total visits)`}>
                                  <Repeat size={8} />
                                  <span>Return #{pv.visitCount || 2}</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans font-bold text-[9px] border border-emerald-500/20 inline-flex items-center gap-1" title="First-time new visitor">
                                  <Sparkles size={8} />
                                  <span>New</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                              {pv.userId.username && <span>@{pv.userId.username}</span>}
                              {pv.userId.level && (
                                <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1 rounded text-[9px] font-bold">
                                  Lvl {pv.userId.level}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-[10px] text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground font-sans font-bold text-[9px] uppercase tracking-wide border border-border/50">
                                Guest
                              </span>
                              {pv.isReturning || (pv.visitCount && pv.visitCount > 1) ? (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-sans font-bold text-[9px] border border-blue-500/20 inline-flex items-center gap-1" title={`Returning guest (${pv.visitCount || 2} total visits)`}>
                                  <Repeat size={8} />
                                  <span>Return #{pv.visitCount || 2}</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans font-bold text-[9px] border border-emerald-500/20 inline-flex items-center gap-1" title="First-time new guest">
                                  <Sparkles size={8} />
                                  <span>New</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <button
                                onClick={() => handleCopy(pv._id + "_vid", pv.visitorId)}
                                className="hover:text-foreground inline-flex items-center gap-1 text-muted-foreground"
                                title="Visitor ID (click to copy)"
                              >
                                <span className="truncate max-w-[90px]">vid:{pv.visitorId.slice(0, 8)}…</span>
                                {copiedId === pv._id + "_vid" ? (
                                  <Check size={9} className="text-emerald-500" />
                                ) : (
                                  <Copy size={9} className="opacity-60" />
                                )}
                              </button>
                              {pv.sessionId && (
                                <button
                                  onClick={() => handleCopy(pv._id + "_sid", pv.sessionId)}
                                  className="hover:text-foreground inline-flex items-center gap-1 text-muted-foreground/70"
                                  title="Session ID (click to copy)"
                                >
                                  <span className="truncate max-w-[70px]">sid:{pv.sessionId.slice(0, 6)}…</span>
                                  {copiedId === pv._id + "_sid" ? (
                                    <Check size={9} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={9} className="opacity-50" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Dwell Time & Active vs. Idle Ratio */}
                      <td className="p-3.5 font-mono whitespace-nowrap">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatDuration(pv.duration)}
                        </div>
                        {pv.activeDuration !== undefined && (
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono mt-0.5">
                            <span className="text-emerald-500 font-bold">{pv.activeDuration}s act</span>
                            {pv.idleDuration ? <span>&bull; {pv.idleDuration}s idl</span> : null}
                          </div>
                        )}
                        {pv.isBounce && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[9px] font-bold border border-rose-500/20">
                            Bounced
                          </span>
                        )}
                      </td>

                      {/* Scroll */}
                      <td className="p-3.5 font-mono text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{pv.scrollDepth}%</span>
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, pv.scrollDepth)}%` }}
                            />
                          </div>
                        </div>
                        {pv.exitIntent && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-bold border border-amber-500/20">
                            Exit Intent
                          </span>
                        )}
                      </td>

                      {/* Referrer & UTM */}
                      <td className="p-3.5 max-w-xs">
                        <span className="font-mono text-[11px] font-bold text-foreground block truncate">
                          {pv.referrerDomain || "Direct"}
                        </span>
                        {pv.utmSource && (
                          <span className="text-[10px] text-indigo-500 font-mono block truncate">
                            utm: {pv.utmSource}
                            {pv.utmCampaign ? ` / ${pv.utmCampaign}` : ""}
                          </span>
                        )}
                        {pv.webVitals?.lcp && (
                          <div className="mt-1 flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${pv.webVitals.lcp <= 2500
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : pv.webVitals.lcp <= 4000
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                }`}
                            >
                              LCP: {pv.webVitals.lcp}ms
                            </span>
                            {pv.webVitals.inp && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                                INP: {pv.webVitals.inp}ms
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Device & Geo */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-foreground font-bold">
                          {pv.device === "mobile" ? (
                            <Smartphone size={12} className="text-amber-500" />
                          ) : pv.device === "tablet" ? (
                            <Tablet size={12} className="text-blue-500" />
                          ) : (
                            <Laptop size={12} className="text-emerald-500" />
                          )}
                          <span>{pv.browser}</span>
                          <span>&bull;</span>
                          <span>{pv.os}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <Globe size={10} className="text-primary" />
                          <span>{getFullCountryName(pv.country)}</span>
                          {pv.city && <span>({pv.city})</span>}
                        </div>
                        {pv.network?.effectiveType && (
                          <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground mt-0.5">
                            <span className="px-1 py-0.2 rounded bg-muted text-foreground uppercase font-bold border border-border/60">
                              {pv.network.effectiveType}
                            </span>
                            {pv.hardware?.gpu && (
                              <span className="truncate max-w-[120px] text-[9px]" title={pv.hardware.gpu}>
                                &bull; {pv.hardware.gpu}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Dynamic Pagination Navigation Bar ── */}
          <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              Page <strong className="text-foreground">{pvPage}</strong> of{" "}
              <strong className="text-foreground">{pvPagination.totalPages}</strong> (
              {pvPagination.total.toLocaleString()} total events)
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* First Page */}
              <button
                onClick={() => setPvPage(1)}
                disabled={pvPage <= 1 || pvLoading}
                className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
                title="First Page"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => setPvPage(Math.max(1, pvPage - 1))}
                disabled={!pvPagination.hasPrevPage || pvLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              {/* Numbered Pills */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((num, idx) =>
                  typeof num === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setPvPage(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition ${pvPage === num
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-card border border-border hover:bg-muted text-foreground"
                        }`}
                    >
                      {num}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-muted-foreground text-xs font-bold">
                      …
                    </span>
                  )
                )}
              </div>

              {/* Next Page */}
              <button
                onClick={() => setPvPage(Math.min(pvPagination.totalPages, pvPage + 1))}
                disabled={!pvPagination.hasNextPage || pvLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setPvPage(pvPagination.totalPages)}
                disabled={pvPage >= pvPagination.totalPages || pvLoading}
                className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition"
                title="Last Page"
              >
                <ChevronsRight size={14} />
              </button>

              {/* Jump to Page Form */}
              <form onSubmit={handleJumpPage} className="flex items-center gap-1 ml-2">
                <input
                  type="number"
                  min={1}
                  max={pvPagination.totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder="Go to"
                  className="w-14 px-2 py-1 bg-card border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-muted hover:bg-accent border border-border rounded-lg text-[11px] font-bold text-foreground"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

  );
}

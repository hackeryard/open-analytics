"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  Eye,
  Clock,
  BarChart3,
  ExternalLink,
  Users,
  SlidersHorizontal,
  TrendingUp,
  X,
  Radio,
  Sparkles,
  ArrowUpRight,
  Activity,
  Compass,
  Download,
  Copy,
  Check,
  Filter,
  Flame,
  MousePointerClick,
  FileText,
  ChevronRight,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";

interface TopPageItem {
  pathname: string;
  title: string;
  labId: string | null;
  views: number;
  visitors: number;
  avgDuration: number;
  avgScrollDepth: number;
}

type FilterCategory = "all" | "high_traffic" | "high_dwell" | "deep_scroll" | "quick_exit";

export default function PagesSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, setPvQuery } = usePlatform();
  const data = propData || platformData;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [sortOrder, setSortOrder] = useState<
    "views_desc" | "visitors_desc" | "duration_desc" | "scroll_desc" | "pathname_asc"
  >("views_desc");
  const [selectedPage, setSelectedPage] = useState<TopPageItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  if (!data) return null;

  const allPages: TopPageItem[] = data.topPages || [];
  const totalViews = data.overview?.totalViews || allPages.reduce((acc, p) => acc + (p.views || 0), 0) || 1;
  const topPage = allPages[0] || null;
  const topPageShare = topPage ? Math.round((topPage.views / totalViews) * 100) : 0;
  const avgDwellTime = data.overview?.avgDuration || 0;

  const handleCopy = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["Rank", "Pathname", "Title", "Lab ID", "Pageviews", "Unique Visitors", "Avg Dwell (s)", "Scroll Depth (%)"];
    const rows = sortedPages.map((p, idx) => [
      idx + 1,
      `"${p.pathname.replace(/"/g, '""')}"`,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      p.labId || "",
      p.views,
      p.visitors,
      p.avgDuration,
      p.avgScrollDepth,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `routes-performance-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter by category + search
  const filteredPages = useMemo(() => {
    return allPages.filter((page) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchPath = (page.pathname || "").toLowerCase().includes(q);
        const matchTitle = (page.title || "").toLowerCase().includes(q);
        const matchLab = (page.labId || "").toLowerCase().includes(q);
        if (!matchPath && !matchTitle && !matchLab) return false;
      }

      // Category
      if (activeCategory === "high_traffic") {
        return (page.views / totalViews) >= 0.05 || page.views >= 20;
      }
      if (activeCategory === "high_dwell") {
        return page.avgDuration >= 45;
      }
      if (activeCategory === "deep_scroll") {
        return page.avgScrollDepth >= 60;
      }
      if (activeCategory === "quick_exit") {
        return page.avgDuration > 0 && page.avgDuration < 15;
      }

      return true;
    });
  }, [allPages, searchQuery, activeCategory, totalViews]);

  // Sort
  const sortedPages = useMemo(() => {
    return [...filteredPages].sort((a, b) => {
      if (sortOrder === "views_desc") return b.views - a.views;
      if (sortOrder === "visitors_desc") return b.visitors - a.visitors;
      if (sortOrder === "duration_desc") return b.avgDuration - a.avgDuration;
      if (sortOrder === "scroll_desc") return b.avgScrollDepth - a.avgScrollDepth;
      return a.pathname.localeCompare(b.pathname);
    });
  }, [filteredPages, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedPages.length / pageSize));
  const paginatedPages = sortedPages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Top 5 traffic distribution
  const top5Pages = allPages.slice(0, 5);
  const top5TotalViews = top5Pages.reduce((sum, p) => sum + p.views, 0);
  const top5Share = Math.round((top5TotalViews / totalViews) * 100);

  const colors = ["bg-primary", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-sky-500"];

  // Helper for performance badge
  const getPerformanceBadge = (page: TopPageItem) => {
    if (page.avgDuration >= 60 && page.avgScrollDepth >= 70) {
      return { label: "High Retention", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
    }
    if ((page.views / totalViews) >= 0.15) {
      return { label: "Core Anchor", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" };
    }
    if (page.avgDuration > 0 && page.avgDuration < 12) {
      return { label: "Quick Bounce", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
    }
    if (page.avgScrollDepth >= 75) {
      return { label: "Deep Reader", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" };
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Sleek KPI Gauges Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Tracked Routes */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Routes
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
              Active URLs
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-foreground">
              {allPages.length}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Unique application pathways tracked
            </span>
          </div>
        </div>

        {/* 2. Total Pageviews Volume */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Pageviews
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Impressions
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-emerald-500">
              {data.overview?.totalViews?.toLocaleString() || allPages.reduce((s, p) => s + p.views, 0).toLocaleString()}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Cumulative content interactions
            </span>
          </div>
        </div>

        {/* 3. Top Traffic Driver Route */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              #1 Traffic Anchor
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {topPageShare}% Share
            </span>
          </div>
          <div>
            <span className="text-sm font-bold font-mono text-foreground truncate block" title={topPage?.pathname || "/"}>
              {topPage?.pathname || "/"}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5 font-mono">
              {topPage?.views.toLocaleString() || 0} views ({topPage?.visitors.toLocaleString() || 0} visitors)
            </span>
          </div>
        </div>

        {/* 4. Average Reading Dwell Time */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Avg Route Dwell
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Engagement
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-blue-500">
              {formatDuration(avgDwellTime)}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Average dwell duration across all pages
            </span>
          </div>
        </div>
      </div>

      {/* ── Top 5 Routes Traffic Distribution Strip ── */}
      {top5Pages.length > 0 && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart3 size={14} className="text-primary" />
                <span>Top Traffic Distribution (Top 5 Routes Account for {top5Share}% of Traffic)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Relative traffic consumption across your top landing and feature pages
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground font-bold">
              {top5TotalViews.toLocaleString()} / {totalViews.toLocaleString()} views
            </span>
          </div>

          {/* Multi-Segment Colored Bar */}
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
            {top5Pages.map((p, idx) => {
              const pct = totalViews > 0 ? (p.views / totalViews) * 100 : 0;
              return (
                <div
                  key={idx}
                  style={{ width: `${Math.max(2, pct)}%` }}
                  className={`${colors[idx % colors.length]} transition-all`}
                  title={`${p.pathname}: ${p.views.toLocaleString()} views (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Legend Items */}
          <div className="flex items-center gap-3 flex-wrap pt-1 text-xs font-mono">
            {top5Pages.map((p, idx) => {
              const pct = totalViews > 0 ? ((p.views / totalViews) * 100).toFixed(1) : "0";
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                  <span className="text-foreground font-bold truncate max-w-[140px]" title={p.pathname}>
                    {p.pathname}
                  </span>
                  <span className="text-muted-foreground text-[11px]">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Unified Routes Table Card ── */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-0">
        {/* Header Search & Sort Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/10 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black tracking-tight text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                <span>All Tracked Routes &amp; Page Performance</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect views, unique audience reach, dwell time, and scroll depth for every route
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background hover:bg-muted border border-border text-foreground text-xs font-bold transition cursor-pointer shadow-2xs"
                title="Export current route list as CSV"
              >
                <Download size={13} className="text-muted-foreground" />
                <span>Export CSV</span>
              </button>
              <div className="text-xs font-mono text-muted-foreground pl-2 border-l border-border">
                Showing <strong className="text-foreground font-bold">{sortedPages.length}</strong> routes
              </div>
            </div>
          </div>

          {/* Quick Segment Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter size={11} /> Filter:
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Routes ({allPages.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("high_traffic");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategory === "high_traffic"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              High Traffic Anchor
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("high_dwell");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategory === "high_dwell"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              High Dwell (45s+)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("deep_scroll");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategory === "deep_scroll"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Deep Scroll (60%+)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("quick_exit");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategory === "quick_exit"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Quick Exit (&lt;15s)
            </button>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search route pathname, page title, or lab ID..."
                className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="sm:col-span-4">
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as any);
                  setCurrentPage(1);
                }}
                aria-label="Sort pages by metric"
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none focus:border-primary shadow-2xs cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
              >
                <option value="views_desc">Most Pageviews</option>
                <option value="visitors_desc">Most Unique Visitors</option>
                <option value="duration_desc">Longest Dwell Time</option>
                <option value="scroll_desc">Deepest Scroll Depth</option>
                <option value="pathname_asc">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── High-Density Interactive Routes Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                <th className="p-3.5 w-12 text-center">Rank</th>
                <th className="p-3.5">Route / Page Title</th>
                <th className="p-3.5 text-right">Pageviews</th>
                <th className="p-3.5 text-right">Traffic Share</th>
                <th className="p-3.5 text-right">Unique Visitors</th>
                <th className="p-3.5 text-right">Engagement</th>
                <th className="p-3.5 text-right">Avg Dwell</th>
                <th className="p-3.5 text-right">Avg Scroll</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-muted-foreground">
                    <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-2">
                      <Layers size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">No Routes Found</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      No tracked pages matched your search or category filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedPages.map((page, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  const sharePct = totalViews > 0 ? parseFloat(((page.views / totalViews) * 100).toFixed(1)) : 0;
                  const viewsPerVisitor = page.visitors > 0 ? (page.views / page.visitors).toFixed(1) : "1.0";
                  const perfBadge = getPerformanceBadge(page);

                  return (
                    <tr
                      key={page.pathname}
                      onClick={() => setSelectedPage(page)}
                      className="hover:bg-muted/20 transition cursor-pointer group"
                    >
                      {/* 1. Rank */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="w-6 h-6 rounded-lg bg-muted text-foreground flex items-center justify-center font-mono font-bold text-[11px] mx-auto">
                          #{globalIdx}
                        </span>
                      </td>

                      {/* 2. Route & Title */}
                      <td className="p-3.5 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="font-bold font-mono text-foreground group-hover:text-primary transition text-xs truncate max-w-sm"
                              title={page.pathname}
                            >
                              {page.pathname}
                            </span>
                            
                            <button
                              type="button"
                              onClick={(e) => handleCopy(page.pathname, e)}
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                              title="Copy URL path"
                            >
                              {copiedPath === page.pathname ? (
                                <Check size={11} className="text-emerald-500" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>

                            <a
                              href={String(page.pathname)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                              title="Open in new tab"
                            >
                              <ExternalLink size={11} />
                            </a>

                            {page.labId && (
                              <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-mono font-bold">
                                {page.labId}
                              </span>
                            )}

                            {perfBadge && (
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${perfBadge.color}`}>
                                {perfBadge.label}
                              </span>
                            )}
                          </div>

                          {page.title && page.title !== page.pathname && (
                            <span className="text-[11px] text-muted-foreground block truncate max-w-md">
                              {page.title}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Pageviews */}
                      <td className="p-3.5 text-right font-black font-mono text-foreground whitespace-nowrap">
                        {page.views.toLocaleString()}
                      </td>

                      {/* 4. Traffic Share Progress Bar */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div
                              style={{ width: `${Math.max(4, sharePct)}%` }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-primary">
                            {sharePct}%
                          </span>
                        </div>
                      </td>

                      {/* 5. Unique Visitors */}
                      <td className="p-3.5 text-right font-mono text-muted-foreground whitespace-nowrap">
                        {page.visitors.toLocaleString()}
                      </td>

                      {/* 6. Views / Visitor Ratio */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-muted rounded-md font-mono text-[11px] font-bold text-foreground">
                          {viewsPerVisitor}x / user
                        </span>
                      </td>

                      {/* 7. Avg Dwell Time */}
                      <td className="p-3.5 text-right whitespace-nowrap font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <div className="flex items-center justify-end gap-1">
                          <Clock size={11} className="text-emerald-500" />
                          <span>{formatDuration(page.avgDuration)}</span>
                        </div>
                      </td>

                      {/* 8. Avg Scroll Depth */}
                      <td className="p-3.5 text-right whitespace-nowrap font-mono text-xs font-bold text-muted-foreground">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] ${
                            page.avgScrollDepth >= 70
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : page.avgScrollDepth >= 40
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {page.avgScrollDepth}%
                        </span>
                      </td>

                      {/* 9. Inspect Action */}
                      <td
                        className="p-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedPage(page)}
                          className="px-2.5 py-1 rounded-lg bg-background hover:bg-muted border border-border text-foreground font-bold text-xs transition cursor-pointer shadow-2xs inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer Navigation & Pagination ── */}
        {sortedPages.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="font-mono">
                Showing{" "}
                <strong className="text-foreground font-bold">
                  {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, sortedPages.length)}
                </strong>{" "}
                of <strong className="text-foreground font-bold">{sortedPages.length}</strong> routes
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-border">
                <span className="text-[11px]">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Routes per page"
                  className="px-2 py-0.8 bg-background border border-border rounded-lg text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2 font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Deep Route Inspector Slide-Over / Modal ── */}
      {selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setSelectedPage(null)} />
          <div className="relative z-10 w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <Layers size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black font-mono text-foreground truncate">
                    {selectedPage.pathname}
                  </h3>
                  {selectedPage.title && selectedPage.title !== selectedPage.pathname && (
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedPage.title}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPage(null)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Pageviews
                  </span>
                  <span className="text-lg font-black font-mono text-foreground">
                    {selectedPage.views.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Unique Visitors
                  </span>
                  <span className="text-lg font-black font-mono text-foreground">
                    {selectedPage.visitors.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Avg Dwell Time
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {formatDuration(selectedPage.avgDuration)}
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Scroll Depth
                  </span>
                  <span className="text-lg font-black font-mono text-primary">
                    {selectedPage.avgScrollDepth}%
                  </span>
                </div>
              </div>

              {/* Traffic Share Breakdown */}
              <div className="p-4 bg-muted/30 border border-border rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-foreground">Traffic Share vs. Platform Total</span>
                  <span className="font-black text-primary">
                    {totalViews > 0 ? ((selectedPage.views / totalViews) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${totalViews > 0 ? Math.max(4, (selectedPage.views / totalViews) * 100) : 0}%`,
                    }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{selectedPage.views.toLocaleString()} views on this route</span>
                  <span>{totalViews.toLocaleString()} total platform views</span>
                </div>
              </div>

              {/* Engagement Depth & Views Per Visitor */}
              <div className="p-4 bg-muted/20 border border-border rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    Re-visit &amp; Engagement Density
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Average views generated per unique visitor arriving at this URL
                  </p>
                </div>
                <span className="px-3 py-1.5 bg-background border border-border rounded-xl font-mono text-sm font-black text-foreground shadow-2xs">
                  {selectedPage.visitors > 0 ? (selectedPage.views / selectedPage.visitors).toFixed(1) : "1.0"}x
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
              <Link
                href="/live-feed"
                onClick={() => {
                  setPvQuery(selectedPage.pathname);
                  setSelectedPage(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer"
              >
                <Radio size={12} />
                <span>Filter in Live Telemetry</span>
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href={selectedPage.pathname}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-background hover:bg-muted border border-border text-foreground rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Open URL</span>
                  <ExternalLink size={11} />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedPage(null)}
                  className="px-4 py-1.5 bg-muted hover:bg-accent text-foreground rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

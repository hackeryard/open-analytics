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
import { getTrackedUrl } from "@/lib/urlHelper";

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
  const { data: platformData, setPvQuery, activeProject } = usePlatform();
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

  const colors = ["bg-white", "bg-emerald-400", "bg-zinc-300", "bg-amber-400", "bg-zinc-500"];

  // Helper for performance badge
  const getPerformanceBadge = (page: TopPageItem) => {
    if (page.avgDuration >= 60 && page.avgScrollDepth >= 70) {
      return { label: "High Retention", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    }
    if ((page.views / totalViews) >= 0.15) {
      return { label: "Core Anchor", color: "bg-white/[0.06] text-zinc-300 border-white/[0.08]" };
    }
    if (page.avgDuration > 0 && page.avgDuration < 12) {
      return { label: "Quick Bounce", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    }
    if (page.avgScrollDepth >= 75) {
      return { label: "Deep Reader", color: "bg-white/[0.04] text-zinc-300 border-white/[0.08]" };
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Sleek KPI Gauges Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Tracked Routes */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Total Routes
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              Active URLs
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {allPages.length}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Unique application pathways tracked
            </span>
          </div>
        </div>

        {/* 2. Total Pageviews Volume */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Total Pageviews
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Impressions
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {data.overview?.totalViews?.toLocaleString() || allPages.reduce((s, p) => s + p.views, 0).toLocaleString()}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Cumulative content interactions
            </span>
          </div>
        </div>

        {/* 3. Top Traffic Driver Route */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              #1 Traffic Anchor
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {topPageShare}% Share
            </span>
          </div>
          <div>
            <span className="text-sm font-medium font-mono text-white truncate block" title={topPage?.pathname || "/"}>
              {topPage?.pathname || "/"}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1 font-mono">
              {topPage?.views.toLocaleString() || 0} views ({topPage?.visitors.toLocaleString() || 0} visitors)
            </span>
          </div>
        </div>

        {/* 4. Average Reading Dwell Time */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Avg Route Dwell
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              Engagement
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {formatDuration(avgDwellTime)}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Average dwell duration across all pages
            </span>
          </div>
        </div>
      </div>

      {/* ── Top 5 Routes Traffic Distribution Strip ── */}
      {top5Pages.length > 0 && (
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-zinc-300" />
                <span>Top Traffic Distribution (Top 5 Routes Account for {top5Share}% of Traffic)</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Relative traffic consumption across your top landing and feature pages
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              {top5TotalViews.toLocaleString()} / {totalViews.toLocaleString()} views
            </span>
          </div>

          {/* Multi-Segment Colored Bar */}
          <div className="h-2 w-full bg-[#181922] rounded-full overflow-hidden flex">
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
          <div className="flex items-center gap-4 flex-wrap pt-1 text-xs font-mono">
            {top5Pages.map((p, idx) => {
              const pct = totalViews > 0 ? ((p.views / totalViews) * 100).toFixed(1) : "0";
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                  <span className="text-zinc-200 font-medium truncate max-w-[140px]" title={p.pathname}>
                    {p.pathname}
                  </span>
                  <span className="text-zinc-500 text-[11px] tabular-nums">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Unified Routes Table Card ── */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden space-y-0">
        {/* Header Search & Sort Toolbar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0e0f15] space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Layers size={15} className="text-zinc-300" />
                <span>All Tracked Routes &amp; Page Performance</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect views, unique audience reach, dwell time, and scroll depth for every route
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer"
                title="Export current route list as CSV"
              >
                <Download size={13} className="text-zinc-400" />
                <span>Export CSV</span>
              </button>
              <div className="text-xs font-mono text-zinc-500 pl-2 border-l border-white/[0.08] tabular-nums">
                Showing <strong className="text-zinc-300 font-medium">{sortedPages.length}</strong> routes
              </div>
            </div>
          </div>

          {/* Quick Segment Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-medium text-zinc-500 mr-1 flex items-center gap-1">
              <Filter size={11} /> Filter:
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeCategory === "all"
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeCategory === "high_traffic"
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeCategory === "high_dwell"
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeCategory === "deep_scroll"
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeCategory === "quick_exit"
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search route pathname, page title, or lab ID..."
                className="w-full pl-9 pr-8 py-2 bg-[#111218] border border-white/[0.08] focus:border-white/20 rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs p-1 cursor-pointer"
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
                className="w-full px-3 py-2 bg-[#111218] border border-white/[0.08] focus:border-white/20 rounded-lg text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
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
            <thead className="bg-[#0e0f15] border-b border-white/[0.08] text-[11px] font-medium text-zinc-400 select-none">
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
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedPages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-zinc-500">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 flex items-center justify-center mx-auto mb-2">
                      <Layers size={22} />
                    </div>
                    <h4 className="text-sm font-medium text-white">No Routes Found</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
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
                      className="hover:bg-white/[0.02] transition cursor-pointer group"
                    >
                      {/* 1. Rank */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-400 flex items-center justify-center font-mono text-[11px] mx-auto tabular-nums">
                          #{globalIdx}
                        </span>
                      </td>

                      {/* 2. Route & Title */}
                      <td className="p-3.5 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="font-mono text-zinc-200 group-hover:text-white transition text-xs truncate max-w-sm"
                              title={page.pathname}
                            >
                              {page.pathname}
                            </span>
                            
                            <button
                              type="button"
                              onClick={(e) => handleCopy(page.pathname, e)}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition"
                              title="Copy URL path"
                            >
                              {copiedPath === page.pathname ? (
                                <Check size={11} className="text-emerald-400" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>

                            <a
                              href={getTrackedUrl(page.pathname, activeProject)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition"
                              title="Open in new tab"
                            >
                              <ExternalLink size={11} />
                            </a>

                            {page.labId && (
                              <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[9px] font-mono">
                                {page.labId}
                              </span>
                            )}

                            {perfBadge && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${perfBadge.color}`}>
                                {perfBadge.label}
                              </span>
                            )}
                          </div>

                          {page.title && page.title !== page.pathname && (
                            <span className="text-[11px] text-zinc-500 block truncate max-w-md">
                              {page.title}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Pageviews */}
                      <td className="p-3.5 text-right font-medium font-mono text-white tabular-nums whitespace-nowrap">
                        {page.views.toLocaleString()}
                      </td>

                      {/* 4. Traffic Share Progress Bar */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 bg-[#181922] rounded-full overflow-hidden hidden sm:block">
                            <div
                              style={{ width: `${Math.max(4, sharePct)}%` }}
                              className="h-full bg-white rounded-full"
                            />
                          </div>
                          <span className="font-mono text-xs font-medium text-zinc-300 tabular-nums">
                            {sharePct}%
                          </span>
                        </div>
                      </td>

                      {/* 5. Unique Visitors */}
                      <td className="p-3.5 text-right font-mono text-zinc-400 tabular-nums whitespace-nowrap">
                        {page.visitors.toLocaleString()}
                      </td>

                      {/* 6. Views / Visitor Ratio */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded font-mono text-[11px] text-zinc-300 tabular-nums">
                          {viewsPerVisitor}x / user
                        </span>
                      </td>

                      {/* 7. Avg Dwell Time */}
                      <td className="p-3.5 text-right whitespace-nowrap font-mono text-xs font-medium text-emerald-400 tabular-nums">
                        <div className="flex items-center justify-end gap-1">
                          <Clock size={11} className="text-emerald-400" />
                          <span>{formatDuration(page.avgDuration)}</span>
                        </div>
                      </td>

                      {/* 8. Avg Scroll Depth */}
                      <td className="p-3.5 text-right whitespace-nowrap font-mono text-xs font-medium tabular-nums">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            page.avgScrollDepth >= 70
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : page.avgScrollDepth >= 40
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
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
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white font-medium text-xs transition cursor-pointer inline-flex items-center gap-1"
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
          <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="font-mono">
                Showing{" "}
                <strong className="text-white font-medium tabular-nums">
                  {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, sortedPages.length)}
                </strong>{" "}
                of <strong className="text-white font-medium tabular-nums">{sortedPages.length}</strong> routes
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08]">
                <span className="text-[11px] text-zinc-500">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Routes per page"
                  className="px-2 py-0.5 bg-[#111218] border border-white/[0.08] rounded-md text-xs font-medium text-zinc-300 focus:outline-none cursor-pointer"
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
              <div className="flex items-center gap-1 font-mono">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2 tabular-nums">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setSelectedPage(null)} />
          <div className="relative z-10 w-full max-w-xl bg-[#111218] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#0e0f15]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-zinc-300 border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Layers size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold font-mono text-white truncate">
                    {selectedPage.pathname}
                  </h3>
                  {selectedPage.title && selectedPage.title !== selectedPage.pathname && (
                    <p className="text-xs text-zinc-400 truncate">
                      {selectedPage.title}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPage(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium text-zinc-400 block">
                    Pageviews
                  </span>
                  <span className="text-lg font-semibold font-mono text-white tabular-nums">
                    {selectedPage.views.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium text-zinc-400 block">
                    Unique Visitors
                  </span>
                  <span className="text-lg font-semibold font-mono text-white tabular-nums">
                    {selectedPage.visitors.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium text-zinc-400 block">
                    Avg Dwell Time
                  </span>
                  <span className="text-lg font-semibold font-mono text-emerald-400 tabular-nums">
                    {formatDuration(selectedPage.avgDuration)}
                  </span>
                </div>
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium text-zinc-400 block">
                    Scroll Depth
                  </span>
                  <span className="text-lg font-semibold font-mono text-white tabular-nums">
                    {selectedPage.avgScrollDepth}%
                  </span>
                </div>
              </div>

              {/* Traffic Share Breakdown */}
              <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">Traffic Share vs. Platform Total</span>
                  <span className="font-medium text-white tabular-nums">
                    {totalViews > 0 ? ((selectedPage.views / totalViews) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[#181922] rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${totalViews > 0 ? Math.max(4, (selectedPage.views / totalViews) * 100) : 0}%`,
                    }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 tabular-nums">
                  <span>{selectedPage.views.toLocaleString()} views on this route</span>
                  <span>{totalViews.toLocaleString()} total platform views</span>
                </div>
              </div>

              {/* Engagement Depth & Views Per Visitor */}
              <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-white block">
                    Re-visit &amp; Engagement Density
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Average views generated per unique visitor arriving at this URL
                  </p>
                </div>
                <span className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg font-mono text-sm font-semibold text-white tabular-nums">
                  {selectedPage.visitors > 0 ? (selectedPage.views / selectedPage.visitors).toFixed(1) : "1.0"}x
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex items-center justify-between gap-2">
              <Link
                href="/live-feed"
                onClick={() => {
                  setPvQuery(selectedPage.pathname);
                  setSelectedPage(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-medium hover:bg-zinc-200 transition cursor-pointer"
              >
                <Radio size={12} />
                <span>Filter in Live Telemetry</span>
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href={getTrackedUrl(selectedPage.pathname, activeProject)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
                >
                  <span>Open URL</span>
                  <ExternalLink size={11} />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedPage(null)}
                  className="px-4 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-lg text-xs font-medium transition cursor-pointer"
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

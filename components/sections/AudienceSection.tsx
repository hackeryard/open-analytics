"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Flame,
  Search,
  Clock,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  X,
  Radio,
  SlidersHorizontal,
  Eye,
  Award,
  Sparkles,
  TrendingUp,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import {
  AnalyticsData,
  AudienceUserItem,
  timeAgo,
  formatDuration,
  formatExactTime,
  formatExactDate,
} from "@/lib/analyticsTypes";
import { getFullCountryName, getCountryFlag } from "@/lib/countries";
import { usePlatform } from "@/components/PlatformContext";
import { getTrackedUrl } from "@/lib/urlHelper";

export default function AudienceSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, setPvQuery, setPvUserType, activeProject } = usePlatform();
  const data = propData || platformData;

  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<
    "all" | "new" | "returning" | "loyal" | "registered" | "guests"
  >("all");
  const [sortOrder, setSortOrder] = useState<
    "loyalty_desc" | "visits_desc" | "recent_desc" | "views_desc" | "duration_desc" | "first_seen_desc"
  >("loyalty_desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AudienceUserItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!data) return null;

  const allUsers: AudienceUserItem[] = data.returningUsers || [];

  const totalVisitorsCount = data.retention?.totalVisitors ?? data.overview?.uniqueVisitors ?? allUsers.length;
  const returningCount = data.retention?.returningVisitors ?? data.overview?.returningVisitors ?? allUsers.filter((u) => u.visitCount > 1 || u.userType === "returning" || u.userType === "loyal" || u.userType === "champion").length;
  const newCount = data.retention?.newVisitors ?? data.overview?.newVisitors ?? Math.max(0, totalVisitorsCount - returningCount);
  const returnRate = data.retention?.returnRate ?? data.overview?.returnRate ?? (totalVisitorsCount > 0 ? Math.round((returningCount / totalVisitorsCount) * 100) : 0);

  const championsCount = allUsers.filter((u) => u.userType === "champion").length;
  const loyalAdvocatesCount = allUsers.filter((u) => u.userType === "loyal").length;
  const returningStandardCount = allUsers.filter((u) => u.userType === "returning").length;
  const newExplorersCount = allUsers.filter((u) => u.userType === "new" || u.visitCount <= 1).length;
  const registeredCount = allUsers.filter((u) => u.user).length;
  const guestsCount = allUsers.filter((u) => !u.user).length;

  const avgLoyaltyScore = allUsers.length > 0
    ? Math.round(allUsers.reduce((sum, u) => sum + (u.loyaltyScore || 10), 0) / allUsers.length)
    : 0;

  // Filter Users
  const filteredUsers = allUsers.filter((u) => {
    // Segment Filter
    if (segmentFilter === "new") {
      if (u.userType !== "new" && u.visitCount > 1) return false;
    } else if (segmentFilter === "returning") {
      if (u.userType !== "returning" && u.userType !== "loyal" && u.userType !== "champion" && u.visitCount <= 1) return false;
    } else if (segmentFilter === "loyal") {
      if (u.userType !== "loyal" && u.userType !== "champion" && u.visitCount < 4) return false;
    } else if (segmentFilter === "registered") {
      if (!u.user) return false;
    } else if (segmentFilter === "guests") {
      if (u.user) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (u.user?.name || "").toLowerCase().includes(q);
      const matchEmail = (u.user?.email || "").toLowerCase().includes(q);
      const matchUsername = (u.user?.username || "").toLowerCase().includes(q);
      const matchVid = (u.visitorId || "").toLowerCase().includes(q);
      const matchCountry = (u.country || "").toLowerCase().includes(q);
      const matchCity = (u.city || "").toLowerCase().includes(q);
      const matchPath = (u.topPaths || []).some((p) => p.toLowerCase().includes(q));

      if (!matchName && !matchEmail && !matchUsername && !matchVid && !matchCountry && !matchCity && !matchPath) {
        return false;
      }
    }

    return true;
  });

  // Sort Users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === "loyalty_desc") {
      return (b.loyaltyScore || 0) - (a.loyaltyScore || 0);
    }
    if (sortOrder === "visits_desc") {
      return (b.visitCount || 1) - (a.visitCount || 1);
    }
    if (sortOrder === "views_desc") {
      return (b.totalViews || 0) - (a.totalViews || 0);
    }
    if (sortOrder === "duration_desc") {
      return (b.totalDuration || 0) - (a.totalDuration || 0);
    }
    if (sortOrder === "first_seen_desc") {
      return new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime();
    }
    // Default: recent_desc
    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getLoyaltyBadgeClass = (tier?: string) => {
    switch (tier) {
      case "Brand Champion":
        return "bg-white/[0.08] text-white border-white/[0.16]";
      case "Loyal Advocate":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Returning":
        return "bg-white/[0.04] text-zinc-300 border-white/[0.08]";
      default:
        return "bg-white/[0.03] text-zinc-400 border-white/[0.06]";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Sleek KPI Gauges Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Audience */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Total Visitors
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {allUsers.length} Profiles
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {totalVisitorsCount.toLocaleString()}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              {registeredCount} identified accounts &bull; {guestsCount} guests
            </span>
          </div>
        </div>

        {/* 2. New Explorers */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              New Visitors (Visit #1)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {totalVisitorsCount > 0 ? Math.round((newCount / totalVisitorsCount) * 100) : 0}% of Total
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {newCount.toLocaleString()}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              First-time discovery visitors
            </span>
          </div>
        </div>

        {/* 3. Returning & Retention */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Returning Audience
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {returnRate}% Return Rate
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {returningCount.toLocaleString()}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Repeat visitors with multiple visits
            </span>
          </div>
        </div>

        {/* 4. Loyalty Index & Champions */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Loyalty Index
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {championsCount + loyalAdvocatesCount} Champions
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {avgLoyaltyScore}/100
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Average audience engagement score
            </span>
          </div>
        </div>
      </div>

      {/* ── Audience Loyalty & Frequency Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 4 Loyalty Tiers */}
        <div className="lg:col-span-7 bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Award size={15} className="text-zinc-300" />
              <span>Audience Loyalty Tiers</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              {allUsers.length} Analyzed Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Brand Champions */}
            <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-lg space-y-1.5 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-white/[0.08] text-white border border-white/[0.16] rounded-md font-mono text-[10px] font-medium uppercase">
                  Brand Champions
                </span>
                <span className="text-xs font-mono font-medium text-white tabular-nums">
                  {championsCount} users
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Superfans with 10+ visits and deepest recurring dwell times.
              </p>
            </div>

            {/* Loyal Advocates */}
            <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-lg space-y-1.5 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-mono text-[10px] font-medium uppercase">
                  Loyal Advocates
                </span>
                <span className="text-xs font-mono font-medium text-white tabular-nums">
                  {loyalAdvocatesCount} users
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Consistent returnees with 4–9 visits exploring multiple features.
              </p>
            </div>

            {/* Returning Users */}
            <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-lg space-y-1.5 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-white/[0.04] text-zinc-300 border border-white/[0.08] rounded-md font-mono text-[10px] font-medium uppercase">
                  Returning Users
                </span>
                <span className="text-xs font-mono font-medium text-white tabular-nums">
                  {returningStandardCount} users
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Users validating your product with 2–3 repeat visits.
              </p>
            </div>

            {/* New Explorers */}
            <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-lg space-y-1.5 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-white/[0.04] text-zinc-400 border border-white/[0.08] rounded-md font-mono text-[10px] font-medium uppercase">
                  New Explorers
                </span>
                <span className="text-xs font-mono font-medium text-white tabular-nums">
                  {newExplorersCount} users
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                First-time visitors evaluating your product.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Frequency Cohort Distribution */}
        <div className="lg:col-span-5 bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Activity size={15} className="text-zinc-300" />
              <span>Visit Frequency Distribution</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">
              {data.retention?.frequency?.length || 0} Cohorts
            </span>
          </div>

          <div className="space-y-3">
            {(data.retention?.frequency || [
              { label: "1 visit", count: newCount, percentage: totalVisitorsCount > 0 ? Math.round((newCount / totalVisitorsCount) * 100) : 100 },
              { label: "2-3 visits", count: returningStandardCount, percentage: totalVisitorsCount > 0 ? Math.round((returningStandardCount / totalVisitorsCount) * 100) : 0 },
              { label: "4-7 visits", count: loyalAdvocatesCount, percentage: totalVisitorsCount > 0 ? Math.round((loyalAdvocatesCount / totalVisitorsCount) * 100) : 0 },
              { label: "8+ visits", count: championsCount, percentage: totalVisitorsCount > 0 ? Math.round((championsCount / totalVisitorsCount) * 100) : 0 },
            ]).map((freq, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300">{freq.label}</span>
                  <span className="text-zinc-500 tabular-nums">
                    <strong className="text-white font-medium">{freq.count}</strong> visitors ({freq.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(4, freq.percentage)}%` }}
                    className={`h-full rounded-full transition-all ${
                      idx === 0
                        ? "bg-zinc-400"
                        : idx === 1
                          ? "bg-zinc-200"
                          : idx === 2
                            ? "bg-emerald-400"
                            : "bg-white"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500">
            <span>Overall Repeat Rate:</span>
            <span className="font-mono font-medium text-white tabular-nums">{returnRate}%</span>
          </div>
        </div>
      </div>

      {/* ── All Visitors Directory Table Container ── */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden space-y-0">
        {/* Header Filters */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0e0f15] space-y-3.5">
          {/* Top Row: Segment Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {[
                { id: "all", label: "All Visitors", count: allUsers.length },
                { id: "new", label: "Newcomers", count: newExplorersCount },
                { id: "returning", label: "Returning", count: returningStandardCount },
                { id: "loyal", label: "Champions & Loyal", count: championsCount + loyalAdvocatesCount },
                { id: "registered", label: "Identified Accounts", count: registeredCount },
                { id: "guests", label: "Anonymous Guests", count: guestsCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSegmentFilter(tab.id as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    segmentFilter === tab.id
                      ? "bg-white text-zinc-950"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                      segmentFilter === tab.id
                        ? "bg-zinc-200 text-zinc-950 font-semibold"
                        : "bg-white/[0.06] text-zinc-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-mono">
                Showing <strong className="text-white font-medium tabular-nums">{sortedUsers.length}</strong> profiles
              </span>
            </div>
          </div>

          {/* Search Input & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
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
                placeholder="Search visitor ID, name, email, country, city, or visited URL..."
                className="w-full pl-9 pr-8 py-2 bg-[#111218] border border-white/[0.08] focus:border-white/20 rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs p-1"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Order Select */}
            <div className="sm:col-span-4">
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as any);
                  setCurrentPage(1);
                }}
                aria-label="Sort visitor profiles"
                className="w-full px-3 py-2 bg-[#111218] border border-white/[0.08] focus:border-white/20 rounded-lg text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="loyalty_desc">Highest Loyalty Score</option>
                <option value="visits_desc">Most Visits</option>
                <option value="views_desc">Most Pageviews</option>
                <option value="duration_desc">Longest Dwell Time</option>
                <option value="recent_desc">Most Recently Active</option>
                <option value="first_seen_desc">First Seen Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── High-Density Visitor Directory Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e0f15] border-b border-white/[0.08] text-[11px] font-medium text-zinc-400 select-none">
              <tr>
                <th className="p-3.5">Visitor / User Account</th>
                <th className="p-3.5">Loyalty Tier &amp; Score</th>
                <th className="p-3.5 text-center">Visits</th>
                <th className="p-3.5 text-center">Sessions</th>
                <th className="p-3.5 text-center">Views</th>
                <th className="p-3.5">Total Dwell</th>
                <th className="p-3.5">Geo &amp; Tech</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-zinc-500">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 flex items-center justify-center mx-auto mb-2">
                      <Users size={22} />
                    </div>
                    <h4 className="text-sm font-medium text-white">No Visitor Profiles Found</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      No visitors matched your search query or segment filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const isRegistered = !!u.user;
                  const initial = u.user?.name
                    ? u.user.name.charAt(0).toUpperCase()
                    : u.user?.email
                      ? u.user.email.charAt(0).toUpperCase()
                      : "V";

                  return (
                    <tr
                      key={u.visitorId}
                      onClick={() => setSelectedUser(u)}
                      className="hover:bg-white/[0.02] transition cursor-pointer group"
                    >
                      {/* 1. Profile Avatar & User Info */}
                      <td className="p-3.5 max-w-xs">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-xs shrink-0 ${
                              isRegistered
                                ? "bg-white/[0.08] text-white border border-white/[0.16]"
                                : "bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                            }`}
                          >
                            {initial}
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            {isRegistered ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-white truncate text-xs">
                                  {u.user?.name || u.user?.email}
                                </span>
                                {u.user?.level && (
                                  <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[9px] font-mono">
                                    Lvl {u.user.level}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-zinc-200 text-xs truncate">
                                  Guest {u.visitorId.slice(-6)}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06] text-[9px] font-mono">
                                  Anonymous
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                              <span className="truncate max-w-[120px]" title={u.visitorId}>
                                ID: {u.visitorId.slice(0, 10)}...
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(u.visitorId, u.visitorId);
                                }}
                                className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition p-0.5"
                                title="Copy Full Visitor ID"
                              >
                                {copiedId === u.visitorId ? (
                                  <Check size={10} className="text-emerald-400" />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Loyalty Tier & Score Meter */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md font-medium font-mono text-[10px] uppercase border inline-flex items-center gap-1 ${getLoyaltyBadgeClass(
                                u.loyaltyTier
                              )}`}
                            >
                              <span>{u.loyaltyTier || "Newcomer"}</span>
                            </span>
                            <span className="text-[11px] font-mono font-medium text-zinc-300 tabular-nums">
                              {u.loyaltyScore || 10}/100
                            </span>
                          </div>
                          <div className="h-1.5 w-24 bg-[#181922] rounded-full overflow-hidden">
                            <div
                              style={{ width: `${u.loyaltyScore || 10}%` }}
                              className={`h-full rounded-full ${
                                (u.loyaltyScore || 10) >= 80
                                  ? "bg-white"
                                  : (u.loyaltyScore || 10) >= 50
                                    ? "bg-emerald-400"
                                    : (u.loyaltyScore || 10) >= 30
                                      ? "bg-zinc-400"
                                      : "bg-zinc-600"
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 3. Visits */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md font-mono text-xs font-medium text-zinc-200 tabular-nums">
                          {u.visitCount > 1 && <Flame size={11} className="text-amber-400 shrink-0" />}
                          <span>{u.visitCount || 1}x</span>
                        </span>
                      </td>

                      {/* 4. Sessions */}
                      <td className="p-3.5 text-center whitespace-nowrap font-mono text-xs font-medium text-zinc-300 tabular-nums">
                        {u.sessionCount || 1}
                      </td>

                      {/* 5. Views */}
                      <td className="p-3.5 text-center whitespace-nowrap font-mono text-xs font-medium text-white tabular-nums">
                        {u.totalViews || 0}
                      </td>

                      {/* 6. Total Dwell Time */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-xs font-medium text-zinc-300 tabular-nums">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-zinc-400 shrink-0" />
                          <span>{formatDuration(u.totalDuration)}</span>
                        </div>
                      </td>

                      {/* 7. Geo & Tech */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="space-y-0.5 text-[11px] font-mono text-zinc-400">
                          <div className="flex items-center gap-1 text-zinc-200 font-medium">
                            <Globe size={11} className="text-zinc-500 shrink-0" />
                            <span className="truncate max-w-[120px]">{u.country}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {u.browser} &bull; {u.os}
                          </div>
                        </div>
                      </td>

                      {/* 8. Last Active */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs text-zinc-200 font-medium">
                          {timeAgo(u.lastSeen)}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                          {formatExactDate(u.lastSeen)}
                        </div>
                      </td>

                      {/* 9. Inspect Action */}
                      <td
                        className="p-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white font-medium text-xs transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
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
        {sortedUsers.length > 0 && (
          <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
            <span className="font-mono">
              Showing{" "}
              <strong className="text-white font-medium tabular-nums">
                {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, sortedUsers.length)}
              </strong>{" "}
              of <strong className="text-white font-medium tabular-nums">{sortedUsers.length}</strong> profiles
            </span>

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

      {/* ── Deep Visitor Profile Slide-Over / Modal (Inspector) ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setSelectedUser(null)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#111218] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#0e0f15]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm shrink-0 ${
                    selectedUser.user
                      ? "bg-white/[0.08] text-white border border-white/[0.16]"
                      : "bg-white/[0.04] text-zinc-400 border border-white/[0.08]"
                  }`}
                >
                  {selectedUser.user?.name
                    ? selectedUser.user.name.charAt(0).toUpperCase()
                    : selectedUser.user?.email
                      ? selectedUser.user.email.charAt(0).toUpperCase()
                      : "V"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      {selectedUser.user?.name || selectedUser.user?.email || `Visitor ${selectedUser.visitorId.slice(-6)}`}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md font-medium font-mono text-[9px] uppercase border ${getLoyaltyBadgeClass(
                        selectedUser.loyaltyTier
                      )}`}
                    >
                      {selectedUser.loyaltyTier || "Newcomer"}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-500 mt-0.5">
                    VID: {selectedUser.visitorId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Engagement Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium uppercase text-zinc-400 block">
                    Total Visits
                  </span>
                  <span className="text-lg font-semibold font-mono text-white flex items-center gap-1 tabular-nums">
                    {selectedUser.visitCount > 1 && <Flame size={14} className="text-amber-400" />}
                    {selectedUser.visitCount || 1}
                  </span>
                </div>
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium uppercase text-zinc-400 block">
                    Sessions
                  </span>
                  <span className="text-lg font-semibold font-mono text-white tabular-nums">
                    {selectedUser.sessionCount || 1}
                  </span>
                </div>
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium uppercase text-zinc-400 block">
                    Total Views
                  </span>
                  <span className="text-lg font-semibold font-mono text-white tabular-nums">
                    {selectedUser.totalViews || 0}
                  </span>
                </div>
                <div className="p-3 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-1">
                  <span className="text-[10px] font-medium uppercase text-zinc-400 block">
                    Total Dwell
                  </span>
                  <span className="text-lg font-semibold font-mono text-white tabular-nums">
                    {formatDuration(selectedUser.totalDuration)}
                  </span>
                </div>
              </div>

              {/* Loyalty Score Card */}
              <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Award size={14} className="text-zinc-400" />
                    <span>Loyalty &amp; Retention Profile</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-white tabular-nums">
                    {selectedUser.loyaltyScore || 10}/100 Score
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedUser.loyaltyScore || 10}%` }}
                    className="h-full bg-white rounded-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="block text-[10px] uppercase font-medium text-zinc-500">First Seen</span>
                    <strong className="text-zinc-200 font-medium">{formatExactDate(selectedUser.firstSeen)}</strong> ({timeAgo(selectedUser.firstSeen)})
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-medium text-zinc-500">Last Active</span>
                    <strong className="text-zinc-200 font-medium">{formatExactDate(selectedUser.lastSeen)}</strong> ({timeAgo(selectedUser.lastSeen)})
                  </div>
                </div>
              </div>

              {/* Geo & Environment Details */}
              <div className="p-4 bg-[#0e0f15] border border-white/[0.08] rounded-xl space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-300 block">
                  Environment &amp; Geolocation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="text-[10px] block uppercase font-medium text-zinc-500">Country &amp; City</span>
                    <strong className="text-zinc-200 font-medium">{selectedUser.country} ({selectedUser.city})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block uppercase font-medium text-zinc-500">Device Type</span>
                    <strong className="text-zinc-200 font-medium">{selectedUser.device}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block uppercase font-medium text-zinc-500">OS &amp; Browser</span>
                    <strong className="text-zinc-200 font-medium">{selectedUser.os} / {selectedUser.browser}</strong>
                  </div>
                </div>
              </div>

              {/* Top Visited Routes */}
              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400 block">
                  Top Visited Pages &amp; Routes ({selectedUser.topPaths?.length || 0})
                </span>
                <div className="space-y-1.5">
                  {(selectedUser.topPaths || []).map((path, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#111218] border border-white/[0.06] rounded-lg flex items-center justify-between gap-2 text-xs font-mono"
                    >
                      <span className="text-zinc-300 font-medium truncate">{path}</span>
                      <a
                        href={getTrackedUrl(path, activeProject)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white shrink-0"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0e0f15] flex items-center justify-between gap-2">
              <Link
                href="/live-feed"
                onClick={() => {
                  setPvQuery(selectedUser.visitorId);
                  setSelectedUser(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-medium hover:bg-zinc-200 transition cursor-pointer"
              >
                <Radio size={12} />
                <span>Filter in Live Telemetry</span>
              </Link>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

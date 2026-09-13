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

export default function AudienceSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, setPvQuery, setPvUserType } = usePlatform();
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
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Loyal Advocate":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Returning":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Sleek KPI Gauges Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Audience */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Visitors
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
              {allUsers.length} Profiles
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-foreground">
              {totalVisitorsCount.toLocaleString()}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              {registeredCount} identified accounts &bull; {guestsCount} guests
            </span>
          </div>
        </div>

        {/* 2. New Explorers */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              New Visitors (Visit #1)
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              {totalVisitorsCount > 0 ? Math.round((newCount / totalVisitorsCount) * 100) : 0}% of Total
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-sky-500">
              {newCount.toLocaleString()}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              First-time discovery visitors
            </span>
          </div>
        </div>

        {/* 3. Returning & Retention */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Returning Audience
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {returnRate}% Return Rate
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-blue-500">
              {returningCount.toLocaleString()}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Repeat visitors with multiple visits
            </span>
          </div>
        </div>

        {/* 4. Loyalty Index & Champions */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Loyalty Index
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {championsCount + loyalAdvocatesCount} Champions
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-purple-500">
              {avgLoyaltyScore}/100
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Average audience engagement score
            </span>
          </div>
        </div>
      </div>

      {/* ── Audience Loyalty & Frequency Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 4 Loyalty Tiers */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Award size={15} className="text-purple-500" />
              <span>Audience Loyalty Tiers</span>
            </h3>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {allUsers.length} Analyzed Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Brand Champions */}
            <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-1.5 hover:border-purple-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-md font-mono text-[10px] font-black uppercase">
                  Brand Champions
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {championsCount} users
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Superfans with 10+ visits and deepest recurring dwell times.
              </p>
            </div>

            {/* Loyal Advocates */}
            <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-1.5 hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md font-mono text-[10px] font-black uppercase">
                  Loyal Advocates
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {loyalAdvocatesCount} users
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Consistent returnees with 4–9 visits exploring multiple features.
              </p>
            </div>

            {/* Returning Users */}
            <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-1.5 hover:border-blue-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md font-mono text-[10px] font-black uppercase">
                  Returning Users
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {returningStandardCount} users
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Users validating your product with 2–3 repeat visits.
              </p>
            </div>

            {/* New Explorers */}
            <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-1.5 hover:border-sky-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 rounded-md font-mono text-[10px] font-black uppercase">
                  New Explorers
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {newExplorersCount} users
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                First-time visitors evaluating your product.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Frequency Cohort Distribution */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity size={15} className="text-blue-500" />
              <span>Visit Frequency Distribution</span>
            </h3>
            <span className="text-xs font-mono text-muted-foreground font-bold">
              {data.retention?.frequency?.length || 0} Cohorts
            </span>
          </div>

          <div className="space-y-2.5">
            {(data.retention?.frequency || [
              { label: "1 visit", count: newCount, percentage: totalVisitorsCount > 0 ? Math.round((newCount / totalVisitorsCount) * 100) : 100 },
              { label: "2-3 visits", count: returningStandardCount, percentage: totalVisitorsCount > 0 ? Math.round((returningStandardCount / totalVisitorsCount) * 100) : 0 },
              { label: "4-7 visits", count: loyalAdvocatesCount, percentage: totalVisitorsCount > 0 ? Math.round((loyalAdvocatesCount / totalVisitorsCount) * 100) : 0 },
              { label: "8+ visits", count: championsCount, percentage: totalVisitorsCount > 0 ? Math.round((championsCount / totalVisitorsCount) * 100) : 0 },
            ]).map((freq, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-foreground">{freq.label}</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{freq.count}</strong> visitors ({freq.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(4, freq.percentage)}%` }}
                    className={`h-full rounded-full transition-all ${
                      idx === 0
                        ? "bg-sky-500"
                        : idx === 1
                          ? "bg-blue-500"
                          : idx === 2
                            ? "bg-emerald-500"
                            : "bg-purple-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Overall Repeat Rate:</span>
            <span className="font-mono font-bold text-foreground">{returnRate}%</span>
          </div>
        </div>
      </div>

      {/* ── All Visitors Directory Table Container ── */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-0">
        {/* Header Filters */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/10 space-y-3.5">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    segmentFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      segmentFilter === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">
                Showing <strong className="text-foreground">{sortedUsers.length}</strong> matching profiles
              </span>
            </div>
          </div>

          {/* Search Input & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
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
                placeholder="Search visitor ID, name, email, country, city, or visited URL..."
                className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1"
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
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none focus:border-primary shadow-2xs cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
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
            <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">
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
            <tbody className="divide-y divide-border">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-muted-foreground">
                    <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-2">
                      <Users size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">No Visitor Profiles Found</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
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
                      className="hover:bg-muted/20 transition cursor-pointer group"
                    >
                      {/* 1. Profile Avatar & User Info */}
                      <td className="p-3.5 max-w-xs">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isRegistered
                                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            {initial}
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            {isRegistered ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-foreground truncate text-xs">
                                  {u.user?.name || u.user?.email}
                                </span>
                                {u.user?.level && (
                                  <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-mono font-bold">
                                    Lvl {u.user.level}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold font-mono text-foreground text-xs truncate">
                                  Guest {u.visitorId.slice(-6)}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-muted text-muted-foreground text-[9px] font-mono">
                                  Anonymous
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                              <span className="truncate max-w-[120px]" title={u.visitorId}>
                                ID: {u.visitorId.slice(0, 10)}...
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(u.visitorId, u.visitorId);
                                }}
                                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition p-0.5"
                                title="Copy Full Visitor ID"
                              >
                                {copiedId === u.visitorId ? (
                                  <Check size={10} className="text-emerald-500" />
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
                              className={`px-2 py-0.5 rounded-md font-bold font-mono text-[10px] uppercase border inline-flex items-center gap-1 ${getLoyaltyBadgeClass(
                                u.loyaltyTier
                              )}`}
                            >
                              <span>{u.loyaltyTier || "Newcomer"}</span>
                            </span>
                            <span className="text-[11px] font-mono font-bold text-foreground">
                              {u.loyaltyScore || 10}/100
                            </span>
                          </div>
                          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                            <div
                              style={{ width: `${u.loyaltyScore || 10}%` }}
                              className={`h-full rounded-full ${
                                (u.loyaltyScore || 10) >= 80
                                  ? "bg-purple-500"
                                  : (u.loyaltyScore || 10) >= 50
                                    ? "bg-emerald-500"
                                    : (u.loyaltyScore || 10) >= 30
                                      ? "bg-blue-500"
                                      : "bg-muted-foreground"
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 3. Visits */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/80 rounded-md font-mono text-xs font-bold text-foreground">
                          {u.visitCount > 1 && <Flame size={11} className="text-amber-500 shrink-0" />}
                          <span>{u.visitCount || 1}x</span>
                        </span>
                      </td>

                      {/* 4. Sessions */}
                      <td className="p-3.5 text-center whitespace-nowrap font-mono text-xs font-bold text-foreground">
                        {u.sessionCount || 1}
                      </td>

                      {/* 5. Views */}
                      <td className="p-3.5 text-center whitespace-nowrap font-mono text-xs font-bold text-foreground">
                        {u.totalViews || 0}
                      </td>

                      {/* 6. Total Dwell Time */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-xs font-bold text-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-primary shrink-0" />
                          <span>{formatDuration(u.totalDuration)}</span>
                        </div>
                      </td>

                      {/* 7. Geo & Tech */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="space-y-0.5 text-[11px] font-mono text-muted-foreground">
                          <div className="flex items-center gap-1 text-foreground font-bold">
                            <Globe size={11} className="text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[120px]">{u.country}</span>
                          </div>
                          <div className="text-[10px]">
                            {u.browser} &bull; {u.os}
                          </div>
                        </div>
                      </td>

                      {/* 8. Last Active */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs text-foreground font-bold">
                          {timeAgo(u.lastSeen)}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
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
                          className="px-2.5 py-1 rounded-lg bg-background hover:bg-muted border border-border text-foreground font-bold text-xs transition cursor-pointer shadow-2xs inline-flex items-center gap-1"
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
          <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="font-mono">
              Showing{" "}
              <strong className="text-foreground font-bold">
                {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, sortedUsers.length)}
              </strong>{" "}
              of <strong className="text-foreground font-bold">{sortedUsers.length}</strong> profiles
            </span>

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

      {/* ── Deep Visitor Profile Slide-Over / Modal (Inspector) ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setSelectedUser(null)} />
          <div className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                    selectedUser.user
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                      : "bg-muted text-muted-foreground border border-border"
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
                    <h3 className="text-base font-black text-foreground">
                      {selectedUser.user?.name || selectedUser.user?.email || `Visitor ${selectedUser.visitorId.slice(-6)}`}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold font-mono text-[9px] uppercase border ${getLoyaltyBadgeClass(
                        selectedUser.loyaltyTier
                      )}`}
                    >
                      {selectedUser.loyaltyTier || "Newcomer"}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    VID: {selectedUser.visitorId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Engagement Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Total Visits
                  </span>
                  <span className="text-lg font-black font-mono text-foreground flex items-center gap-1">
                    {selectedUser.visitCount > 1 && <Flame size={14} className="text-amber-500" />}
                    {selectedUser.visitCount || 1}
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Sessions
                  </span>
                  <span className="text-lg font-black font-mono text-foreground">
                    {selectedUser.sessionCount || 1}
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Total Views
                  </span>
                  <span className="text-lg font-black font-mono text-foreground">
                    {selectedUser.totalViews || 0}
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Total Dwell
                  </span>
                  <span className="text-lg font-black font-mono text-primary">
                    {formatDuration(selectedUser.totalDuration)}
                  </span>
                </div>
              </div>

              {/* Loyalty Score Card */}
              <div className="p-4 bg-muted/30 border border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Award size={14} className="text-purple-500" />
                    <span>Loyalty &amp; Retention Profile</span>
                  </span>
                  <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400">
                    {selectedUser.loyaltyScore || 10}/100 Score
                  </span>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedUser.loyaltyScore || 10}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-muted-foreground">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">First Seen</span>
                    <strong className="text-foreground">{formatExactDate(selectedUser.firstSeen)}</strong> ({timeAgo(selectedUser.firstSeen)})
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Last Active</span>
                    <strong className="text-foreground">{formatExactDate(selectedUser.lastSeen)}</strong> ({timeAgo(selectedUser.lastSeen)})
                  </div>
                </div>
              </div>

              {/* Geo & Environment Details */}
              <div className="p-4 bg-muted/20 border border-border rounded-2xl space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-foreground block">
                  Environment &amp; Geolocation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-muted-foreground">
                  <div>
                    <span className="text-[10px] block uppercase font-bold">Country &amp; City</span>
                    <strong className="text-foreground">{selectedUser.country} ({selectedUser.city})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block uppercase font-bold">Device Type</span>
                    <strong className="text-foreground">{selectedUser.device}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block uppercase font-bold">OS &amp; Browser</span>
                    <strong className="text-foreground">{selectedUser.os} / {selectedUser.browser}</strong>
                  </div>
                </div>
              </div>

              {/* Top Visited Routes */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                  Top Visited Pages &amp; Routes ({selectedUser.topPaths?.length || 0})
                </span>
                <div className="space-y-1.5">
                  {(selectedUser.topPaths || []).map((path, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-background border border-border rounded-xl flex items-center justify-between gap-2 text-xs font-mono"
                    >
                      <span className="text-foreground font-bold truncate">{path}</span>
                      <a
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary shrink-0"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
              <Link
                href="/live-feed"
                onClick={() => {
                  setPvQuery(selectedUser.visitorId);
                  setSelectedUser(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer"
              >
                <Radio size={12} />
                <span>Filter in Live Telemetry</span>
              </Link>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 bg-muted hover:bg-accent text-foreground rounded-xl text-xs font-bold transition cursor-pointer"
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

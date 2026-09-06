"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Flame,
  Search,
  Filter,
  Clock,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Tag,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Users,
  Repeat,
  Radio,
  Sliders,
  ShieldCheck,
  X,
  Plus,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { AnalyticsData, ReturningUserItem, timeAgo, formatDuration, formatExactTime, formatExactDate } from "@/lib/analyticsTypes";
import { getFullCountryName, getCountryFlag } from "@/lib/countries";
import { usePlatform } from "@/components/PlatformContext";

export default function ReturningUsersSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, setPvQuery, setPvUserType } = usePlatform();
  const data = propData || platformData;

  const [retUserSearch, setRetUserSearch] = useState("");
  const [retUserSegment, setRetUserSegment] = useState<"all" | "registered" | "guests">("all");
  const [retUserSort, setRetUserSort] = useState<"visits_desc" | "recent_desc" | "views_desc" | "duration_desc">("visits_desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ReturningUserItem | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!data) return null;

  return (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-4">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <UserCheck size={18} />
                </div>
                <h3 className="text-sm font-black tracking-tight text-foreground">
                  Returning Users Directory &amp; Visitor Profiles
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Profiles of registered accounts and persistent visitors returning to your application
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 font-mono">
                {data.retention?.returnRate ?? data.overview.returnRate ?? 0}% Return Rate
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-background text-foreground font-bold border border-border font-mono">
                {data.returningUsers?.length || 0} Profiles Identified
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 sm:px-5">
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Total Returnees</span>
              <span className="text-lg font-black text-foreground">
                {data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0}
              </span>
            </div>
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Registered Members</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                {(data.returningUsers || []).filter((u) => u.user).length}
              </span>
            </div>
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Guest Returnees</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                {(data.returningUsers || []).filter((u) => !u.user).length}
              </span>
            </div>
            <div className="p-3 bg-muted/15 border border-border rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Max Visits Recorded</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <Flame size={14} className="text-amber-500" />
                {(data.returningUsers && data.returningUsers.length > 0)
                  ? Math.max(...data.returningUsers.map((u) => u.visitCount || 1))
                  : 1}{" "}
                visits
              </span>
            </div>
          </div>

          {/* Search, Filter & Segment Controls */}
          <div className="px-4 sm:px-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search Box */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  value={retUserSearch}
                  onChange={(e) => setRetUserSearch(e.target.value)}
                  placeholder="Search name, email, vid, country, lab…"
                  className="w-full bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Segment Selector */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <Users size={14} className="text-muted-foreground shrink-0" />
                <select
                  value={retUserSegment}
                  onChange={(e) => setRetUserSegment(e.target.value as any)}
                  className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                >
                  <option value="all">All Returning Visitors ({data.returningUsers?.length || 0})</option>
                  <option value="registered">Registered Members Only ({(data.returningUsers || []).filter((u) => u.user).length})</option>
                  <option value="guests">Guest Returnees ({(data.returningUsers || []).filter((u) => !u.user).length})</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-xs">
                <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
                <select
                  value={retUserSort}
                  onChange={(e) => setRetUserSort(e.target.value as any)}
                  className="w-full bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100"
                >
                  <option value="visits_desc">Highest Lifetime Visits (Most Loyal)</option>
                  <option value="recent_desc">Most Recently Active</option>
                  <option value="views_desc">Most Pageviews</option>
                  <option value="duration_desc">Longest Total Dwell Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Returning Visitors Table */}
          <div className="overflow-x-auto border-t border-border">
            {(() => {
              const query = retUserSearch.toLowerCase().trim();
              const filtered = (data.returningUsers || [])
                .filter((item) => {
                  if (retUserSegment === "registered" && !item.user) return false;
                  if (retUserSegment === "guests" && item.user) return false;
                  if (!query) return true;
                  const nameMatch = item.user?.name?.toLowerCase().includes(query);
                  const emailMatch = item.user?.email?.toLowerCase().includes(query);
                  const usernameMatch = item.user?.username?.toLowerCase().includes(query);
                  const vidMatch = item.visitorId?.toLowerCase().includes(query);
                  const countryMatch = item.country?.toLowerCase().includes(query);
                  const cityMatch = item.city?.toLowerCase().includes(query);
                  const pathMatch = item.topPaths?.some((p) => p.toLowerCase().includes(query));
                  return Boolean(nameMatch || emailMatch || usernameMatch || vidMatch || countryMatch || cityMatch || pathMatch);
                })
                .sort((a, b) => {
                  if (retUserSort === "recent_desc") {
                    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
                  }
                  if (retUserSort === "views_desc") {
                    return b.totalViews - a.totalViews;
                  }
                  if (retUserSort === "duration_desc") {
                    return b.totalDuration - a.totalDuration;
                  }
                  return (b.visitCount || 1) - (a.visitCount || 1);
                });

              if (filtered.length === 0) {
                return (
                  <div className="p-12 text-center space-y-2">
                    <p className="text-sm font-bold text-foreground">No returning users match your search criteria</p>
                    <p className="text-xs text-muted-foreground">Try clearing search terms or selecting another timeframe.</p>
                  </div>
                );
              }

              return (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      <th className="p-3.5">User / Visitor Identity</th>
                      <th className="p-3.5">Loyalty &amp; Visits</th>
                      <th className="p-3.5">Engagement</th>
                      <th className="p-3.5">Top Explored Labs &amp; Pages</th>
                      <th className="p-3.5">Location &amp; Tech</th>
                      <th className="p-3.5">Activity Timeline</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((item, idx) => (
                      <tr key={item.visitorId || idx} className="hover:bg-muted/30 transition-colors">
                        {/* Identity */}
                        <td className="p-3.5">
                          {item.user ? (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0 overflow-hidden">
                                {item.user.avatar ? (
                                  <img src={item.user.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (item.user.name || item.user.email || "U").slice(0, 1).toUpperCase()
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-foreground block">
                                    {item.user.name || item.user.email}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[9px] font-extrabold border border-purple-500/30">
                                    Registered
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                                  {item.user.email && <span>{item.user.email}</span>}
                                  {item.user.username && <span>@{item.user.username}</span>}
                                  {item.user.level && (
                                    <span className="text-amber-600 dark:text-amber-400 font-bold">Lvl {item.user.level}</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleCopy(item.visitorId + "_ret_vid", item.visitorId)}
                                  className="text-[9px] font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                  title="Visitor ID (click to copy)"
                                >
                                  <span>vid:{item.visitorId.slice(0, 10)}…</span>
                                  {copiedId === item.visitorId + "_ret_vid" ? <Check size={8} className="text-emerald-500" /> : <Copy size={8} className="opacity-50" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                <Users size={16} />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground">Anonymous Guest</span>
                                  <span className="px-1.5 py-0.2 rounded bg-muted text-muted-foreground text-[9px] font-extrabold border border-border">
                                    Guest
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                                  <button
                                    onClick={() => handleCopy(item.visitorId + "_ret_vid", item.visitorId)}
                                    className="hover:text-foreground inline-flex items-center gap-1"
                                    title="Visitor ID (click to copy)"
                                  >
                                    <span>vid:{item.visitorId.slice(0, 12)}…</span>
                                    {copiedId === item.visitorId + "_ret_vid" ? <Check size={8} className="text-emerald-500" /> : <Copy size={8} className="opacity-50" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Loyalty & Visits */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              <Flame size={12} className="text-amber-500" />
                              <span>{item.visitCount} Visits</span>
                            </span>
                            <span className="block text-[10px] font-mono text-muted-foreground">
                              {item.sessionCount} sessions in period
                            </span>
                          </div>
                        </td>

                        {/* Engagement Volume */}
                        <td className="p-3.5 font-mono">
                          <div className="space-y-0.5">
                            <span className="font-black text-foreground block">{item.totalViews} views</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              {formatDuration(item.totalDuration)} dwell
                            </span>
                          </div>
                        </td>

                        {/* Explored Labs */}
                        <td className="p-3.5 max-w-[260px]">
                          <div className="flex flex-wrap gap-1">
                            {item.topPaths.slice(0, 3).map((path, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground truncate max-w-[160px] inline-block"
                                title={path}
                              >
                                {path}
                              </span>
                            ))}
                            {item.topPaths.length > 3 && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                +{item.topPaths.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Location & Tech */}
                        <td className="p-3.5">
                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-1 font-bold text-foreground">
                              <Globe size={11} className="text-primary shrink-0" />
                              <span className="truncate max-w-[120px]">{item.country}</span>
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground">
                              <span>{item.city} &bull; {item.os} ({item.browser})</span>
                            </div>
                          </div>
                        </td>

                        {/* Timeline */}
                        <td className="p-3.5 font-mono text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block">
                              {timeAgo(item.lastSeen)}
                            </span>
                            <span className="text-[10px] text-muted-foreground block" title={`First: ${item.firstSeen}`}>
                              First: {new Date(item.firstSeen).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setPvQuery(item.visitorId);
                              setPvUserType("all");
                              if (typeof window !== "undefined") window.location.href = "/live-feed";
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground border border-border text-[11px] font-bold transition shadow-xs whitespace-nowrap cursor-pointer"
                            title="Filter live stream pageviews for this visitor"
                          >
                            <Eye size={12} />
                            <span>Timeline</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>

  );
}

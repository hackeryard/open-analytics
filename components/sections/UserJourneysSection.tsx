"use client";

import React, { useState } from "react";
import {
  Share2,
  Compass,
  Layers,
  ArrowRight,
  TrendingUp,
  LogOut,
  ExternalLink,
  Search,
  Activity,
  ArrowDownRight,
  GitCommit,
  Clock,
  Sparkles,
  GitBranch,
  X,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData } from "@/lib/analyticsTypes";
import { getTrackedUrl } from "@/lib/urlHelper";

export default function UserJourneysSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, activeProject } = usePlatform();
  const data = propData || platformData;

  const [flowSearchQuery, setFlowSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"flows" | "transitions" | "entry_exit">("flows");

  if (!data) return null;

  const journeys = data.userJourneys || {
    overview: {
      totalSessions: data.overview?.uniqueSessions || 0,
      avgPathDepth: 1.0,
      bounceRate: 0,
      multiPageRate: 100,
    },
    entryPages: [],
    exitPages: [],
    topFlows: [],
    transitions: [],
    depthDistribution: [],
  };

  const overview = journeys.overview || {
    totalSessions: data.overview?.uniqueSessions || 0,
    avgPathDepth: 1.0,
    bounceRate: 0,
    multiPageRate: 100,
  };

  const topFlows = journeys.topFlows || [];
  const transitions = journeys.transitions || [];
  const entryPages = journeys.entryPages || [];
  const exitPages = journeys.exitPages || [];
  const depthDistribution = journeys.depthDistribution || [];

  // Filtered flows
  const filteredFlows = topFlows.filter((f) =>
    !flowSearchQuery.trim()
      ? true
      : f.pathString.toLowerCase().includes(flowSearchQuery.toLowerCase().trim()) ||
        f.path.some((p) => p.toLowerCase().includes(flowSearchQuery.toLowerCase().trim()))
  );

  // Filtered transitions
  const filteredTransitions = transitions.filter((t) =>
    !flowSearchQuery.trim()
      ? true
      : t.from.toLowerCase().includes(flowSearchQuery.toLowerCase().trim()) ||
        t.to.toLowerCase().includes(flowSearchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Sleek KPI Gauges Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Average Path Depth */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Average Journey Depth
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              Pages / Session
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {overview.avgPathDepth}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Average routes explored per visitor session
            </span>
          </div>
        </div>

        {/* 2. Multi-Page Exploration Rate */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Multi-Step Flow Rate
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {overview.multiPageRate}% Active
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {overview.multiPageRate}%
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Sessions that navigate beyond the landing page
            </span>
          </div>
        </div>

        {/* 3. Direct Bounce Rate */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Single-Page Bounces
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {overview.bounceRate}%
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {overview.bounceRate}%
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Sessions ending on the first pageview
            </span>
          </div>
        </div>

        {/* 4. Total Mapped Sequences */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Mapped Pathways
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {topFlows.length} Sequences
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
              {transitions.length}
            </span>
            <span className="block text-[11px] text-zinc-500 mt-1">
              Distinct page-to-page route transitions
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Unified Journeys Card Container ── */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden space-y-0">
        {/* Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0e0f15] space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: "flows", label: "Multi-Step Sequences", count: topFlows.length },
                { id: "transitions", label: "Route Transitions", count: transitions.length },
                { id: "entry_exit", label: "Entry & Exit Drop-offs", count: entryPages.length + exitPages.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-white text-zinc-950"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                      activeTab === tab.id
                        ? "bg-zinc-200 text-zinc-950 font-semibold"
                        : "bg-white/[0.06] text-zinc-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative sm:w-64">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={flowSearchQuery}
                onChange={(e) => setFlowSearchQuery(e.target.value)}
                placeholder="Filter routes or paths..."
                className="w-full pl-9 pr-8 py-1.5 bg-[#111218] border border-white/[0.08] focus:border-white/20 rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none transition"
              />
              {flowSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFlowSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── View 1: Multi-Step Sequences ── */}
        {activeTab === "flows" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <GitBranch size={14} className="text-zinc-300" />
                  <span>Sequential Navigation Pathways (Step 1 &rarr; Step 2 &rarr; Step 3)</span>
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Most common chronological page sequences navigated by users in a single session
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">
                {filteredFlows.length} Pathways
              </span>
            </div>

            {filteredFlows.length === 0 ? (
              <div className="p-12 text-center bg-[#0e0f15] border border-white/[0.04] rounded-xl text-xs text-zinc-500">
                No multi-step pathways recorded matching filter criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFlows.map((flow, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-xl space-y-3 transition group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-400 flex items-center justify-center font-mono text-[10px] tabular-nums">
                          #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 bg-white/[0.04] text-zinc-300 border border-white/[0.08] rounded font-mono text-[10px]">
                          {flow.depth} Steps
                        </span>
                        <span className="text-xs font-mono text-zinc-400 tabular-nums">
                          {flow.count.toLocaleString()} sessions
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-[#181922] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.max(5, flow.percentage)}%` }}
                            className="h-full bg-white rounded-full transition-all"
                          />
                        </div>
                        <span className="text-xs font-mono font-medium text-white tabular-nums">
                          {flow.percentage}% share
                        </span>
                      </div>
                    </div>

                    {/* Step Sequence Flow Nodes */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {flow.path.map((step, sIdx) => {
                        const isFirst = sIdx === 0;
                        const isLast = sIdx === flow.path.length - 1;

                        return (
                          <React.Fragment key={sIdx}>
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs whitespace-nowrap ${
                                isFirst
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : isLast
                                    ? "bg-white/[0.06] text-zinc-200 border-white/[0.1]"
                                    : "bg-[#111218] text-zinc-300 border-white/[0.08]"
                              }`}
                            >
                              <span className="text-[10px] text-zinc-500">
                                {sIdx + 1}.
                              </span>
                              <span>{step}</span>
                              <a
                                href={getTrackedUrl(step, activeProject)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-white transition"
                              >
                                <ExternalLink size={10} />
                              </a>
                            </div>

                            {!isLast && (
                              <ArrowRight size={13} className="text-zinc-600 shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── View 2: Route Transitions (From -> To) ── */}
        {activeTab === "transitions" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Share2 size={14} className="text-zinc-300" />
                  <span>Direct Page-to-Page Hops (From &rarr; To)</span>
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Immediate navigation links clicked by visitors when transitioning between pages
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">
                {filteredTransitions.length} Transitions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0e0f15] border-b border-white/[0.08] text-[11px] font-medium text-zinc-400 select-none">
                  <tr>
                    <th className="p-3.5">Origin Page</th>
                    <th className="p-3.5 text-center w-8"></th>
                    <th className="p-3.5">Destination Page</th>
                    <th className="p-3.5 text-right">Transition Hops</th>
                    <th className="p-3.5 text-right">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredTransitions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-zinc-500 font-sans">
                        No route transitions recorded matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransitions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition">
                        <td className="p-3.5 font-medium text-zinc-200 max-w-xs truncate">
                          <a
                            href={getTrackedUrl(t.from, activeProject)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white flex items-center gap-1"
                          >
                            <span className="truncate">{t.from}</span>
                            <ExternalLink size={10} className="shrink-0 text-zinc-500" />
                          </a>
                        </td>
                        <td className="p-3.5 text-center text-zinc-600">
                          <ArrowRight size={13} className="text-zinc-500 mx-auto" />
                        </td>
                        <td className="p-3.5 font-medium text-zinc-200 max-w-xs truncate">
                          <a
                            href={getTrackedUrl(t.to, activeProject)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white flex items-center gap-1"
                          >
                            <span className="truncate">{t.to}</span>
                            <ExternalLink size={10} className="shrink-0 text-zinc-500" />
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-medium text-white tabular-nums">
                          {t.count.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[10px] tabular-nums">
                            {t.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── View 3: Entry & Exit Drop-offs ── */}
        {activeTab === "entry_exit" && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Entry Pages */}
            <div className="bg-[#0e0f15] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-3.5 border-b border-white/[0.08] bg-[#111218] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Top Entry Pages (Session Starters)
                  </h5>
                </div>
                <span className="text-xs font-mono text-zinc-500 tabular-nums">
                  {entryPages.length} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0e0f15] border-b border-white/[0.06] text-[10px] font-medium text-zinc-500 uppercase select-none">
                    <tr>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right">Sessions</th>
                      <th className="p-3 text-right">Bounce Rate</th>
                      <th className="p-3 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {entryPages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-zinc-500 font-sans">
                          No entry path data available.
                        </td>
                      </tr>
                    ) : (
                      entryPages.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition">
                          <td className="p-3 font-medium text-zinc-200 truncate max-w-[150px]">
                            <a
                              href={getTrackedUrl(entry.pathname, activeProject)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white flex items-center gap-1"
                            >
                              <span className="truncate">{entry.pathname}</span>
                              <ExternalLink size={9} className="shrink-0 text-zinc-500" />
                            </a>
                          </td>
                          <td className="p-3 text-right font-medium text-white tabular-nums">
                            {entry.count.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                                (entry.bounceRate || 0) > 60
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              {entry.bounceRate || 0}%
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[10px] tabular-nums">
                              {entry.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Exit Pages */}
            <div className="bg-[#0e0f15] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-3.5 border-b border-white/[0.08] bg-[#111218] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Top Exit Pages (Drop-off Culprits)
                  </h5>
                </div>
                <span className="text-xs font-mono text-zinc-500 tabular-nums">
                  {exitPages.length} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0e0f15] border-b border-white/[0.06] text-[10px] font-medium text-zinc-500 uppercase select-none">
                    <tr>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right">Exits</th>
                      <th className="p-3 text-right">Exit Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {exitPages.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-zinc-500 font-sans">
                          No exit drop-off data available.
                        </td>
                      </tr>
                    ) : (
                      exitPages.map((exit, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition">
                          <td className="p-3 font-medium text-zinc-200 truncate max-w-[180px]">
                            <a
                              href={getTrackedUrl(exit.pathname, activeProject)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white flex items-center gap-1"
                            >
                              <span className="truncate">{exit.pathname}</span>
                              <ExternalLink size={9} className="shrink-0 text-zinc-500" />
                            </a>
                          </td>
                          <td className="p-3 text-right font-medium text-white tabular-nums">
                            {exit.count.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[10px] tabular-nums">
                              {exit.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Session Depth Cohort Distribution ── */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers size={14} className="text-zinc-300" />
              <span>Session Depth &amp; Navigation Intensity</span>
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Distribution of session lengths by number of pageviews traversed before ending
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 tabular-nums">
            {overview.totalSessions.toLocaleString()} Total Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {depthDistribution.map((depth, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-xl space-y-2 transition"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-200 font-medium">{depth.depthLabel}</span>
                <span className="font-medium text-white tabular-nums">{depth.percentage}%</span>
              </div>

              <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.max(4, depth.percentage)}%` }}
                  className={`h-full rounded-full transition-all ${
                    idx === 0
                      ? "bg-zinc-500"
                      : idx === 1
                        ? "bg-zinc-300"
                        : idx === 2
                          ? "bg-emerald-400"
                          : "bg-white"
                  }`}
                />
              </div>

              <div className="text-[10px] font-mono text-zinc-500 flex justify-between tabular-nums">
                <span>{depth.count.toLocaleString()} sessions</span>
                <span>{idx === 0 ? "Bounce point" : "Engaged path"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

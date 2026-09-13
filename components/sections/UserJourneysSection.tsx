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
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData } from "@/lib/analyticsTypes";

export default function UserJourneysSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Average Path Depth */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Average Journey Depth
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
              Pages / Session
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-foreground">
              {overview.avgPathDepth}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Average routes explored per visitor session
            </span>
          </div>
        </div>

        {/* 2. Multi-Page Exploration Rate */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Multi-Step Flow Rate
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {overview.multiPageRate}% Active
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-emerald-500">
              {overview.multiPageRate}%
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Sessions that navigate beyond the landing page
            </span>
          </div>
        </div>

        {/* 3. Direct Bounce Rate */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Single-Page Bounces
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {overview.bounceRate}%
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-rose-500">
              {overview.bounceRate}%
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Sessions ending on the first pageview
            </span>
          </div>
        </div>

        {/* 4. Total Mapped Sequences */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Mapped Pathways
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {topFlows.length} Sequences
            </span>
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-blue-500">
              {transitions.length}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Distinct page-to-page route transitions
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Unified Journeys Card Container ── */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden space-y-0">
        {/* Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/10 space-y-3.5">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-foreground"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={flowSearchQuery}
                onChange={(e) => setFlowSearchQuery(e.target.value)}
                placeholder="Filter routes or paths..."
                className="w-full pl-9 pr-8 py-1.5 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-2xs transition"
              />
              {flowSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFlowSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
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
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GitBranch size={14} className="text-primary" />
                  <span>Sequential Navigation Pathways (Step 1 &rarr; Step 2 &rarr; Step 3)</span>
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Most common chronological page sequences navigated by users in a single session
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground font-bold">
                {filteredFlows.length} Pathways
              </span>
            </div>

            {filteredFlows.length === 0 ? (
              <div className="p-12 text-center bg-muted/20 border border-border rounded-2xl text-xs text-muted-foreground">
                No multi-step pathways recorded matching filter criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFlows.map((flow, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-muted/20 border border-border hover:border-primary/40 rounded-2xl space-y-3 transition group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded-md bg-muted text-foreground flex items-center justify-center font-mono font-bold text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md font-mono text-[10px] font-bold">
                          {flow.depth} Steps
                        </span>
                        <span className="text-xs font-mono font-bold text-foreground">
                          {flow.count} sessions
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.max(5, flow.percentage)}%` }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-primary">
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
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold whitespace-nowrap shadow-2xs ${
                                isFirst
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : isLast
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                    : "bg-background text-foreground border-border"
                              }`}
                            >
                              <span className="text-[10px] text-muted-foreground opacity-70">
                                {sIdx + 1}.
                              </span>
                              <span>{step}</span>
                              <a
                                href={step}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition"
                              >
                                <ExternalLink size={10} />
                              </a>
                            </div>

                            {!isLast && (
                              <ArrowRight size={14} className="text-muted-foreground shrink-0" />
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
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Share2 size={14} className="text-blue-500" />
                  <span>Direct Page-to-Page Hops (From &rarr; To)</span>
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Immediate navigation links clicked by visitors when transitioning between pages
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground font-bold">
                {filteredTransitions.length} Transitions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Origin Page</th>
                    <th className="p-3.5 text-center w-8"></th>
                    <th className="p-3.5">Destination Page</th>
                    <th className="p-3.5 text-right">Transition Hops</th>
                    <th className="p-3.5 text-right">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTransitions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-muted-foreground font-sans">
                        No route transitions recorded matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransitions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-foreground max-w-xs truncate">
                          <a
                            href={t.from}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary flex items-center gap-1"
                          >
                            <span className="truncate">{t.from}</span>
                            <ExternalLink size={10} className="shrink-0 text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-center text-muted-foreground">
                          <ArrowRight size={13} className="text-primary mx-auto" />
                        </td>
                        <td className="p-3.5 font-bold text-foreground max-w-xs truncate">
                          <a
                            href={t.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary flex items-center gap-1"
                          >
                            <span className="truncate">{t.to}</span>
                            <ExternalLink size={10} className="shrink-0 text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-black text-foreground">
                          {t.count}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
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
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h5 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Top Entry Pages (Session Starters)
                  </h5>
                </div>
                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {entryPages.length} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right">Sessions</th>
                      <th className="p-3 text-right">Bounce Rate</th>
                      <th className="p-3 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entryPages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-muted-foreground font-sans">
                          No entry path data available.
                        </td>
                      </tr>
                    ) : (
                      entryPages.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition">
                          <td className="p-3 font-bold text-foreground truncate max-w-[150px]">
                            <a
                              href={entry.pathname}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary flex items-center gap-1"
                            >
                              <span className="truncate">{entry.pathname}</span>
                              <ExternalLink size={9} className="shrink-0 text-muted-foreground" />
                            </a>
                          </td>
                          <td className="p-3 text-right font-black text-foreground">
                            {entry.count}
                          </td>
                          <td className="p-3 text-right">
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                (entry.bounceRate || 0) > 60
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              {entry.bounceRate || 0}%
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
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
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h5 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Top Exit Pages (Drop-off Points)
                  </h5>
                </div>
                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {exitPages.length} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right">Drop-offs</th>
                      <th className="p-3 text-right">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {exitPages.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-muted-foreground font-sans">
                          No exit drop-off data available.
                        </td>
                      </tr>
                    ) : (
                      exitPages.map((exit, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition">
                          <td className="p-3 font-bold text-foreground truncate max-w-[180px]">
                            <a
                              href={exit.pathname}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary flex items-center gap-1"
                            >
                              <span className="truncate">{exit.pathname}</span>
                              <ExternalLink size={9} className="shrink-0 text-muted-foreground" />
                            </a>
                          </td>
                          <td className="p-3 text-right font-black text-rose-600 dark:text-rose-400">
                            {exit.count}
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
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
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers size={14} className="text-primary" />
              <span>Session Depth &amp; Navigation Intensity</span>
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Distribution of session lengths by number of pageviews traversed before ending
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground font-bold">
            {overview.totalSessions} Total Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {depthDistribution.map((depth, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-2 hover:border-primary/40 transition"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">{depth.depthLabel}</span>
                <span className="font-black text-primary">{depth.percentage}%</span>
              </div>

              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.max(4, depth.percentage)}%` }}
                  className={`h-full rounded-full ${
                    idx === 0
                      ? "bg-rose-500"
                      : idx === 1
                        ? "bg-amber-500"
                        : idx === 2
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                  }`}
                />
              </div>

              <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                <span>{depth.count} sessions</span>
                <span>{idx === 0 ? "Bounce point" : "Engaged path"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

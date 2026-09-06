"use client";

import React from "react";
import {
  Share2,
  Compass,
  Layers,
  BarChart3,
  LogOut,
  ExternalLink,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData } from "@/lib/analyticsTypes";

export default function UserJourneysSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  return (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Share2 size={18} className="text-blue-500" />
                  <span>User Journeys &amp; Path Flows</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Analyze where student journeys begin (Entry Landing Pages) and where they abandon or conclude (Exit Drop-off Pages)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Entry Pages */}
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Top Entry Pages (Session Starters)
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {data.userJourneys?.entryPages?.length ?? 0} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5">Entry Route</th>
                      <th className="p-3.5 text-right">Sessions</th>
                      <th className="p-3.5 text-right">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(!data.userJourneys?.entryPages || data.userJourneys.entryPages.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-muted-foreground font-sans text-xs">
                          No entry path data available.
                        </td>
                      </tr>
                    ) : (
                      data.userJourneys.entryPages.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition">
                          <td className="p-3.5 font-bold text-foreground">
                            <a href={String(entry.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              {entry.pathname}
                            </a>
                          </td>
                          <td className="p-3.5 text-right font-black text-foreground">{entry.count}</td>
                          <td className="p-3.5 text-right">
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
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Top Exit Pages (Drop-off Points)
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {data.userJourneys?.exitPages?.length ?? 0} Paths
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5">Exit Route</th>
                      <th className="p-3.5 text-right">Drop-offs</th>
                      <th className="p-3.5 text-right">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(!data.userJourneys?.exitPages || data.userJourneys.exitPages.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-muted-foreground font-sans text-xs">
                          No exit path data available.
                        </td>
                      </tr>
                    ) : (
                      data.userJourneys.exitPages.map((exit, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition">
                          <td className="p-3.5 font-bold text-foreground">
                            <a href={String(exit.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              {exit.pathname}
                            </a>
                          </td>
                          <td className="p-3.5 text-right font-black text-rose-600 dark:text-rose-400">{exit.count}</td>
                          <td className="p-3.5 text-right">
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
        </div>

  );
}

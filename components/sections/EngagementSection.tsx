"use client";

import React from "react";
import {
  Sliders,
  Clock,
  Activity,
  Flame,
  Layers,
  Eye,
  BarChart3,
  Sparkles,
  Repeat,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";

export default function EngagementSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Visitor Loyalty & Visit Frequency */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Visitor Retention &amp; Loyalty
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  {data.retention?.returnRate ?? data.overview.returnRate ?? 0}% Return Rate
                </span>
              </div>

              {/* New vs Returning Split Bar */}
              <div className="p-3 bg-muted/20 border border-border rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Sparkles size={12} /> New ({data.retention?.newVisitors ?? data.overview.newVisitors ?? 0})
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Repeat size={12} /> Returning ({data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(data.retention?.totalVisitors || 1) > 0
                        ? Math.round(
                          ((data.retention?.newVisitors ?? data.overview.newVisitors ?? 0) /
                            ((data.retention?.totalVisitors ?? data.overview.uniqueVisitors) || 1)) *
                          100
                        )
                        : 50
                        }%`,
                    }}
                    className="h-full bg-emerald-500"
                    title="New visitors"
                  />
                  <div
                    style={{
                      width: `${(data.retention?.totalVisitors || 1) > 0
                        ? Math.round(
                          ((data.retention?.returningVisitors ?? data.overview.returningVisitors ?? 0) /
                            ((data.retention?.totalVisitors ?? data.overview.uniqueVisitors) || 1)) *
                          100
                        )
                        : 50
                        }%`,
                    }}
                    className="h-full bg-blue-500"
                    title="Returning visitors"
                  />
                </div>
              </div>

              {/* Frequency Milestones */}
              <div className="space-y-3 pt-1">
                {(data.retention?.frequency || []).map((tier, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-foreground">{tier.label}</span>
                      <span className="text-muted-foreground font-mono">
                        {tier.count} visitors ({tier.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tier.percentage}%` }}
                        className={`h-full rounded-full ${idx === 0
                          ? "bg-emerald-500"
                          : idx === 1
                            ? "bg-blue-500"
                            : idx === 2
                              ? "bg-indigo-500"
                              : "bg-purple-500"
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dwell Time Distribution */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Time on Page (Dwell Time)
              </h3>
              <div className="space-y-3">
                {data.durationDistribution.map((dur, idx) => {
                  const total = data.overview.totalViews || 1;
                  const pct = Math.round((dur.count / total) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="font-mono text-foreground">{dur.label}</span>
                        <span className="text-muted-foreground font-mono">
                          {dur.count} views ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-teal-500 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scroll Depth Distribution */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Reading Scroll Depth Milestones
              </h3>
              <div className="space-y-3">
                {data.scrollDistribution.map((scr, idx) => {
                  const total = data.overview.totalViews || 1;
                  const pct = Math.round((scr.count / total) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="font-mono text-foreground">{scr.label}</span>
                        <span className="text-muted-foreground font-mono">
                          {scr.count} views ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-indigo-500 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

  );
}

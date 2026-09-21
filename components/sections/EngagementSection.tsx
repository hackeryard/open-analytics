"use client";

import React from "react";
import {
  Clock,
  Activity,
  Flame,
  Layers,
  Eye,
  BarChart3,
  Repeat,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";

export default function EngagementSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  const totalViews = data.overview?.totalViews || 1;
  const avgDwell = data.overview?.avgDuration || 0;
  const returnRate = data.retention?.returnRate ?? data.overview?.returnRate ?? 0;
  const newVisitors = data.retention?.newVisitors ?? data.overview?.newVisitors ?? 0;
  const returningVisitors = data.retention?.returningVisitors ?? data.overview?.returningVisitors ?? 0;
  const totalVisitors = (data.retention?.totalVisitors ?? data.overview?.uniqueVisitors) || 1;

  // Deep scroll rate (75%+)
  const deepScrollCount = data.scrollDistribution?.find((s) => s.label.includes("75") || s.label.includes("100"))?.count || 0;
  const deepScrollPct = Math.round((deepScrollCount / totalViews) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* ── Top Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Average Dwell</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Clock size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {formatDuration(avgDwell)}
          </div>
          <div className="text-[11px] text-zinc-500">
            Active reading time per session
          </div>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Audience Loyalty</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Repeat size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {returnRate}%
          </div>
          <div className="text-[11px] text-zinc-500 tabular-nums">
            {returningVisitors.toLocaleString()} returning visitors
          </div>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Deep Readers</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <ArrowDown size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {deepScrollPct}%
          </div>
          <div className="text-[11px] text-zinc-500 tabular-nums">
            {deepScrollCount.toLocaleString()} reached 75%+ scroll
          </div>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Interactions</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Eye size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500">
            Pageview reading events analyzed
          </div>
        </div>
      </div>

      {/* ── 3-Column Engagement Intelligence Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Visitor Retention & Frequency */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Retention &amp; Return Rate
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-zinc-300 border border-white/[0.08] tabular-nums">
              {returnRate}% Return
            </span>
          </div>

          {/* New vs Returning Split Bar */}
          <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] rounded-lg space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                New ({newVisitors.toLocaleString()})
              </span>
              <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                Returning ({returningVisitors.toLocaleString()})
              </span>
            </div>
            <div className="w-full h-2 bg-[#181922] rounded-full overflow-hidden flex">
              <div
                style={{
                  width: `${Math.round((newVisitors / totalVisitors) * 100)}%`,
                }}
                className="h-full bg-zinc-400 transition-all"
                title="New visitors"
              />
              <div
                style={{
                  width: `${Math.round((returningVisitors / totalVisitors) * 100)}%`,
                }}
                className="h-full bg-white transition-all"
                title="Returning visitors"
              />
            </div>
          </div>

          {/* Frequency Milestones */}
          <div className="space-y-3 pt-1">
            {(data.retention?.frequency || []).map((tier, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-300">{tier.label}</span>
                  <span className="text-zinc-500 font-mono text-[11px] tabular-nums">
                    {tier.count.toLocaleString()} visitors ({tier.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(3, tier.percentage)}%` }}
                    className="h-full bg-white rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Dwell Time Distribution */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Dwell Time on Page
            </h3>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">
              {data.durationDistribution?.length || 0} buckets
            </span>
          </div>

          <div className="space-y-3">
            {(data.durationDistribution || []).map((dur, idx) => {
              const pct = Math.round((dur.count / totalViews) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300">{dur.label}</span>
                    <span className="text-zinc-500 font-mono text-[11px] tabular-nums">
                      {dur.count.toLocaleString()} views ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(3, pct)}%` }}
                      className="h-full bg-emerald-400 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Scroll Depth Distribution */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Scroll Depth Milestones
            </h3>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">
              {data.scrollDistribution?.length || 0} milestones
            </span>
          </div>

          <div className="space-y-3">
            {(data.scrollDistribution || []).map((scr, idx) => {
              const pct = Math.round((scr.count / totalViews) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300">{scr.label}</span>
                    <span className="text-zinc-500 font-mono text-[11px] tabular-nums">
                      {scr.count.toLocaleString()} views ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(3, pct)}%` }}
                      className="h-full bg-white rounded-full transition-all"
                    />
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

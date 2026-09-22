"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { formatDuration } from "@/lib/analyticsTypes";

interface PageItem {
  pathname: string;
  title?: string;
  labId?: string | null;
  views: number;
  visitors?: number;
  avgDuration: number;
  avgScrollDepth?: number;
}

export default function TopPagesWidget({
  pages,
  totalViews,
}: {
  pages?: PageItem[];
  totalViews: number;
}) {
  const safePages = pages || [];
  const maxViews = safePages.length > 0 ? Math.max(...safePages.map((p) => p.views)) : 1;

  const avgDwell =
    safePages.length > 0
      ? Math.round(safePages.reduce((acc, p) => acc + (p.avgDuration || 0), 0) / safePages.length)
      : 0;

  return (
    <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Layers size={15} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Top Performing Routes</h3>
          </div>
          <Link
            href="/pages"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
          >
            <span>All Routes</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-xs text-zinc-400">Most visited endpoints ranked by traffic volume</p>
      </div>

      <div className="space-y-2.5 flex-1 pt-1">
        {safePages.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono">
            No route telemetry logged yet
          </div>
        ) : (
          safePages.slice(0, 5).map((page, idx) => {
            const pct = Math.max(4, Math.round((page.views / maxViews) * 100));
            const shareOfTotal = totalViews > 0 ? Math.round((page.views / totalViews) * 100) : 0;

            return (
              <div key={page.pathname || idx} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-[10px] font-mono text-zinc-500 w-3.5 shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="font-mono font-medium text-zinc-200 truncate group-hover:text-white transition" title={page.pathname}>
                      {page.pathname}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="text-zinc-500 hidden sm:inline">
                      {formatDuration(page.avgDuration)}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {page.views.toLocaleString()}
                    </span>
                    <span className="text-zinc-500 text-[10px] w-8 text-right tabular-nums">
                      {shareOfTotal}%
                    </span>
                  </div>
                </div>

                {/* Relative visual bar */}
                <div className="h-1.5 w-full bg-[#181922] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-white/80 rounded-full group-hover:bg-white transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span>{safePages.length} active routes</span>
        <span>Avg dwell: {avgDwell > 0 ? formatDuration(avgDwell) : "—"}</span>
      </div>
    </div>
  );
}

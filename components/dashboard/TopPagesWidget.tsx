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

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers size={15} />
            </div>
            <h3 className="text-sm font-black text-white">Top Performing Routes</h3>
          </div>
          <Link
            href="/pages"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>All Routes</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">Most visited endpoints ranked by total traffic volume</p>
      </div>

      <div className="space-y-2.5 flex-1 pt-1">
        {safePages.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
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
                    <span className="text-[10px] font-mono text-muted-foreground w-3.5 shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="font-mono font-bold text-slate-200 truncate group-hover:text-cyan-400 transition" title={page.pathname}>
                      {page.pathname}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="text-muted-foreground hidden sm:inline">
                      {formatDuration(page.avgDuration)}
                    </span>
                    <span className="font-bold text-white">
                      {page.views.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-[10px] w-8 text-right">
                      {shareOfTotal}%
                    </span>
                  </div>
                </div>

                {/* Relative visual bar */}
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full group-hover:from-cyan-400 group-hover:to-blue-500 transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>{safePages.length} active routes tracked</span>
        <span>Average dwell: ~2m 14s</span>
      </div>
    </div>
  );
}

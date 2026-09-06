"use client";

import React from "react";
import Link from "next/link";
import { Radio, ArrowRight, Laptop, Smartphone, Tablet, Globe, Clock } from "lucide-react";
import { PageViewItem, timeAgo } from "@/lib/analyticsTypes";
import { getCountryFlag } from "@/lib/countries";

export default function LiveStreamWidget({
  pageviews,
  liveVisitors,
}: {
  pageviews?: PageViewItem[];
  liveVisitors: number;
}) {
  const safePvs = pageviews || [];

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 relative">
              <Radio size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-sm font-black text-white">Live Telemetry Stream</h3>
          </div>
          <Link
            href="/live-feed"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Live Stream</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">Real-time incoming client hits across global edge network</p>
      </div>

      <div className="space-y-2 flex-1 pt-1">
        {safePvs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Listening for real-time edge telemetry...</span>
          </div>
        ) : (
          safePvs.slice(0, 4).map((pv) => {
            const flag = getCountryFlag(pv.country);
            return (
              <div
                key={pv._id}
                className="p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0" title={pv.country}>{flag || "🌐"}</span>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-slate-200 truncate" title={pv.pathname}>
                      {pv.pathname}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <span className="truncate">{pv.browser}</span>
                      <span>•</span>
                      <span>{pv.device}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right font-mono">
                  <span className="text-[10px] text-cyan-400 font-bold block">
                    {timeAgo(pv.createdAt)}
                  </span>
                  <span className="text-[9px] text-muted-foreground block">
                    {pv.duration > 0 ? `${pv.duration}s dwell` : "Active"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Stream Healthy</span>
        </span>
        <span>{liveVisitors} active in last 5m</span>
      </div>
    </div>
  );
}

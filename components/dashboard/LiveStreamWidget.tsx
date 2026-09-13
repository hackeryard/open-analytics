"use client";

import React from "react";
import Link from "next/link";
import { Radio, ArrowRight, Laptop, Smartphone, Tablet, Globe, Clock, Activity } from "lucide-react";
import { PageViewItem, timeAgo } from "@/lib/analyticsTypes";
import { getFullCountryName } from "@/lib/countries";

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
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-glow" />
            </div>
            <h3 className="text-sm font-black text-white">Live Telemetry Stream</h3>
          </div>
          <Link
            href="/live-feed"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Live Feed</span>
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
            const isMobile = pv.device === "mobile";
            const isTablet = pv.device === "tablet";

            return (
              <div
                key={pv._id}
                className="p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition flex items-center justify-between gap-3 text-xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Globe size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-slate-200 truncate group-hover:text-cyan-400 transition" title={pv.pathname}>
                      {pv.pathname}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono">
                      <span>{getFullCountryName(pv.country)}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{pv.browser}</span>
                      <span>&bull;</span>
                      <span className="capitalize flex items-center gap-1">
                        {isMobile ? <Smartphone size={10} /> : isTablet ? <Tablet size={10} /> : <Laptop size={10} />}
                        {pv.device}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right font-mono" suppressHydrationWarning>
                  <span className="text-[10px] text-cyan-400 font-bold block" suppressHydrationWarning>
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
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow" />
          <span>Stream Ingestion Active</span>
        </span>
        <span>{liveVisitors} concurrent live visitors</span>
      </div>
    </div>
  );
}

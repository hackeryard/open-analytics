"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowRight, Globe2, Share2, Search, Link as LinkIcon } from "lucide-react";

interface ReferrerItem {
  domain: string;
  count: number;
  percentage: number;
}

export default function TrafficChannelsWidget({
  referrers,
  totalViews,
}: {
  referrers?: ReferrerItem[];
  totalViews: number;
}) {
  const safeReferrers = referrers || [];
  const maxCount = safeReferrers.length > 0 ? Math.max(...safeReferrers.map((r) => r.count)) : 1;

  const getDomainIcon = (domain: string) => {
    const d = domain.toLowerCase();
    if (d.includes("google") || d.includes("bing") || d.includes("duckduckgo")) {
      return <Search size={13} className="text-amber-400" />;
    }
    if (d.includes("twitter") || d.includes("x.com") || d.includes("linkedin") || d.includes("reddit") || d.includes("ycombinator")) {
      return <Share2 size={13} className="text-blue-400" />;
    }
    if (d.includes("direct")) {
      return <Globe2 size={13} className="text-emerald-400" />;
    }
    return <LinkIcon size={13} className="text-cyan-400" />;
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Compass size={15} />
            </div>
            <h3 className="text-sm font-black text-white">Traffic Acquisition</h3>
          </div>
          <Link
            href="/acquisition"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>All Sources</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">Inbound referral domains, search engines, and direct traffic</p>
      </div>

      <div className="space-y-2.5 flex-1 pt-1">
        {safeReferrers.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No referrer attribution detected yet
          </div>
        ) : (
          safeReferrers.slice(0, 5).map((ref, idx) => {
            const pct = Math.max(4, Math.round((ref.count / maxCount) * 100));

            return (
              <div key={ref.domain || idx} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="shrink-0">{getDomainIcon(ref.domain)}</span>
                    <span className="font-mono font-bold text-slate-200 truncate group-hover:text-blue-400 transition" title={ref.domain}>
                      {ref.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="font-bold text-white">
                      {ref.count.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-[10px] w-8 text-right">
                      {ref.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full group-hover:from-blue-400 group-hover:to-indigo-500 transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>Attribution models active</span>
        <span>UTM Tracking Ready</span>
      </div>
    </div>
  );
}

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
      return <Share2 size={13} className="text-sky-400" />;
    }
    if (d.includes("direct")) {
      return <Globe2 size={13} className="text-emerald-400" />;
    }
    return <LinkIcon size={13} className="text-zinc-400" />;
  };

  return (
    <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Compass size={15} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Traffic Acquisition</h3>
          </div>
          <Link
            href="/acquisition"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
          >
            <span>All Sources</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-xs text-zinc-400">Inbound referral domains, search engines, and direct traffic</p>
      </div>

      <div className="space-y-2.5 flex-1 pt-1">
        {safeReferrers.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono">
            No referrer attribution detected yet
          </div>
        ) : (
          safeReferrers.slice(0, 5).map((ref, idx) => {
            const pct = Math.max(4, Math.round((ref.count / maxCount) * 100));

            return (
              <div key={ref.domain || idx} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="shrink-0">{getDomainIcon(ref.domain)}</span>
                    <span className="font-mono font-medium text-zinc-200 truncate group-hover:text-white transition" title={ref.domain}>
                      {ref.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="font-semibold text-white tabular-nums">
                      {ref.count.toLocaleString()}
                    </span>
                    <span className="text-zinc-500 text-[10px] w-8 text-right tabular-nums">
                      {ref.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-zinc-400 group-hover:bg-white rounded-full transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span>Attribution models active</span>
        <span>UTM Tracking Ready</span>
      </div>
    </div>
  );
}

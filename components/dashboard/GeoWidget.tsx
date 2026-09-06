"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { getCountryFlag } from "@/lib/countries";

interface CountryItem {
  country: string;
  isoCode?: string;
  count: number;
  percentage: number;
}

export default function GeoWidget({
  countries,
  uniqueVisitors,
}: {
  countries?: CountryItem[];
  uniqueVisitors: number;
}) {
  const safeCountries = countries || [];
  const maxCount = safeCountries.length > 0 ? Math.max(...safeCountries.map((c) => c.count)) : 1;

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Globe size={15} />
            </div>
            <h3 className="text-sm font-black text-white">Geographic Distribution</h3>
          </div>
          <Link
            href="/geo"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>World Map</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">Global audience distribution across nations and territories</p>
      </div>

      <div className="space-y-2.5 flex-1 pt-1">
        {safeCountries.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No geo IP headers resolved yet
          </div>
        ) : (
          safeCountries.slice(0, 5).map((c, idx) => {
            const flag = getCountryFlag(c.country);
            const pct = Math.max(4, Math.round((c.count / maxCount) * 100));

            return (
              <div key={c.country || idx} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-sm shrink-0">{flag || "🌐"}</span>
                    <span className="font-bold text-slate-200 truncate group-hover:text-purple-400 transition">
                      {c.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="font-bold text-white">
                      {c.count.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-[10px] w-8 text-right">
                      {c.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full group-hover:from-purple-400 group-hover:to-indigo-500 transition-all"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>{safeCountries.length} countries recorded</span>
        <span>Low-latency Edge DNS</span>
      </div>
    </div>
  );
}

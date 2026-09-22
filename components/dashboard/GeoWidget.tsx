"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { getFullCountryName } from "@/lib/countries";

interface CountryItem {
  country: string;
  code?: string;
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
    <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Globe size={15} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Geographic Distribution</h3>
          </div>
          <Link
            href="/geo"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
          >
            <span>World Map</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-xs text-zinc-400">Global audience distribution across nations and territories</p>
      </div>

      <div className="space-y-2.5 flex-1 pt-1">
        {safeCountries.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono">
            No geo IP headers resolved yet
          </div>
        ) : (
          safeCountries.slice(0, 5).map((c, idx) => {
            const countryName = getFullCountryName(c.country);
            const pct = Math.max(4, Math.round((c.count / maxCount) * 100));

            return (
              <div key={c.country || idx} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-md bg-[#181922] text-zinc-400 border border-white/[0.08] text-[10px] font-semibold font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-zinc-200 truncate group-hover:text-white transition" title={countryName}>
                      {countryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="font-semibold text-white tabular-nums">
                      {c.count.toLocaleString()}
                    </span>
                    <span className="text-zinc-500 text-[10px] w-8 text-right tabular-nums">
                      {c.percentage}%
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
        <span className="tabular-nums">{safeCountries.length} countries recorded</span>
        <span>Low-latency Edge DNS</span>
      </div>
    </div>
  );
}

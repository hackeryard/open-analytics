"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function WebVitalsDocsPage() {
  const metrics = [
    {
      abbr: "LCP",
      name: "Largest Contentful Paint",
      desc: "Measures perceived loading speed by recording when the main content of a page is rendered.",
      good: "≤ 2.5 s",
      needs: "2.5 s - 4.0 s",
      poor: "> 4.0 s",
    },
    {
      abbr: "INP",
      name: "Interaction to Next Paint",
      desc: "Assesses overall page responsiveness by measuring the latency of every user click, tap, and keypress.",
      good: "≤ 200 ms",
      needs: "200 ms - 500 ms",
      poor: "> 500 ms",
    },
    {
      abbr: "CLS",
      name: "Cumulative Layout Shift",
      desc: "Quantifies visual stability by measuring unexpected layout shifts of visible elements.",
      good: "≤ 0.1",
      needs: "0.1 - 0.25",
      poor: "> 0.25",
    },
    {
      abbr: "FCP",
      name: "First Contentful Paint",
      desc: "Marks the time at which the browser renders the first bit of content from the DOM.",
      good: "≤ 1.8 s",
      needs: "1.8 s - 3.0 s",
      poor: "> 3.0 s",
    },
    {
      abbr: "TTFB",
      name: "Time to First Byte",
      desc: "Measures the time between the request for a resource and when the first byte of a response arrives.",
      good: "≤ 800 ms",
      needs: "800 ms - 1800 ms",
      poor: "> 1800 ms",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-semibold">
          <Activity size={13} />
          <span>Real User Monitoring (RUM) Standards</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Core Web Vitals &amp; Diagnostics
        </h1>
        <p className="text-sm text-zinc-400">
          Open Analytics automatically instruments Google Core Web Vitals using the native PerformanceObserver API without slowing down your user experience.
        </p>
      </div>

      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.abbr} className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white font-mono font-semibold text-xs">
                  {m.abbr}
                </span>
                <h3 className="text-sm font-semibold text-white">{m.name}</h3>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{m.desc}</p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
                <span>Good</span>
                <span className="font-semibold tabular-nums">{m.good}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-between">
                <span>Needs Imp.</span>
                <span className="font-semibold tabular-nums">{m.needs}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-between">
                <span>Poor</span>
                <span className="font-semibold tabular-nums">{m.poor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

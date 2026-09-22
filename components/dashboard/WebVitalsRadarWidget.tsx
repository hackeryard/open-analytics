"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";

export default function WebVitalsRadarWidget({
  webVitals,
}: {
  webVitals?: any;
}) {
  const overall = webVitals?.overall || {};
  const lcp = overall.lcp;
  const inp = overall.inp;
  const cls = overall.cls;
  const ttfb = overall.ttfb;

  const getLcpStatus = (val?: number) => {
    if (!val) return { label: "N/A", color: "text-zinc-500 bg-zinc-800/60 border-zinc-700/60" };
    if (val <= 2500) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 4000) return { label: "Needs Imp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const getInpStatus = (val?: number) => {
    if (!val) return { label: "N/A", color: "text-zinc-500 bg-zinc-800/60 border-zinc-700/60" };
    if (val <= 200) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 500) return { label: "Needs Imp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const getClsStatus = (val?: number) => {
    if (val === undefined || val === null) return { label: "N/A", color: "text-zinc-500 bg-zinc-800/60 border-zinc-700/60" };
    if (val <= 0.1) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 0.25) return { label: "Needs Imp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const lcpStatus = getLcpStatus(lcp);
  const inpStatus = getInpStatus(inp);
  const clsStatus = getClsStatus(cls);

  return (
    <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Activity size={15} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Core Web Vitals (RUM)</h3>
          </div>
          <Link
            href="/vitals"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
          >
            <span>Full RUM Audit</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-xs text-zinc-400">Google Core Web Vitals measured from real end-user sessions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 pt-1">
        {/* LCP Gauge */}
        <div className="p-3.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">LCP</span>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${lcpStatus.color}`}>
              {lcpStatus.label}
            </span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {lcp ? `${(lcp / 1000).toFixed(2)}s` : "—"}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Largest Contentful</div>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">Target: &le; 2.50s</div>
        </div>

        {/* INP Gauge */}
        <div className="p-3.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">INP</span>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${inpStatus.color}`}>
              {inpStatus.label}
            </span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {inp ? `${inp}ms` : "—"}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Next Paint Latency</div>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">Target: &le; 200ms</div>
        </div>

        {/* CLS Gauge */}
        <div className="p-3.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">CLS</span>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${clsStatus.color}`}>
              {clsStatus.label}
            </span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {cls !== undefined && cls !== null ? cls : "—"}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Layout Shift</div>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">Target: &le; 0.10</div>
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
          <ShieldCheck size={13} />
          <span>Real User Monitoring Active</span>
        </span>
        <span className="tabular-nums">TTFB: {ttfb ? `${ttfb}ms` : "—"}</span>
      </div>
    </div>
  );
}

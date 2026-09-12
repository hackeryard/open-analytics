"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, Zap } from "lucide-react";

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
    if (!val) return { label: "N/A", color: "text-muted-foreground bg-muted/20 border-white/[0.08]" };
    if (val <= 2500) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 4000) return { label: "Needs Imp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const getInpStatus = (val?: number) => {
    if (!val) return { label: "N/A", color: "text-muted-foreground bg-muted/20 border-white/[0.08]" };
    if (val <= 200) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 500) return { label: "Needs Imp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const getClsStatus = (val?: number) => {
    if (val === undefined || val === null) return { label: "N/A", color: "text-muted-foreground bg-muted/20 border-white/[0.08]" };
    if (val <= 0.1) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (val <= 0.25) return { label: "Needs Imp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const lcpStatus = getLcpStatus(lcp);
  const inpStatus = getInpStatus(inp);
  const clsStatus = getClsStatus(cls);

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity size={15} />
            </div>
            <h3 className="text-sm font-black text-white">Core Web Vitals (RUM)</h3>
          </div>
          <Link
            href="/vitals"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Full RUM Audit</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">Google Core Web Vitals measured from real end-user sessions</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 flex-1 pt-1">
        {/* LCP Gauge */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground">LCP</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${lcpStatus.color}`}>
              {lcpStatus.label}
            </span>
          </div>
          <div>
            <div className="text-lg font-black font-mono text-white">
              {lcp ? `${(lcp / 1000).toFixed(2)}s` : "—"}
            </div>
            <div className="text-[10px] text-muted-foreground">Largest Contentful</div>
          </div>
          <div className="text-[9px] text-emerald-400 font-mono">Threshold: &le; 2.5s</div>
        </div>

        {/* INP Gauge */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground">INP</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${inpStatus.color}`}>
              {inpStatus.label}
            </span>
          </div>
          <div>
            <div className="text-lg font-black font-mono text-white">
              {inp ? `${inp}ms` : "—"}
            </div>
            <div className="text-[10px] text-muted-foreground">Next Paint Responsiveness</div>
          </div>
          <div className="text-[9px] text-emerald-400 font-mono">Threshold: &le; 200ms</div>
        </div>

        {/* CLS Gauge */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground">CLS</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${clsStatus.color}`}>
              {clsStatus.label}
            </span>
          </div>
          <div>
            <div className="text-lg font-black font-mono text-white">
              {cls !== undefined && cls !== null ? cls : "—"}
            </div>
            <div className="text-[10px] text-muted-foreground">Layout Shift Stability</div>
          </div>
          <div className="text-[9px] text-emerald-400 font-mono">Threshold: &le; 0.10</div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck size={13} />
          <span>RUM Telemetry Engine</span>
        </span>
        <span>TTFB: {ttfb ? `${ttfb}ms` : "—"}</span>
      </div>
    </div>
  );
}

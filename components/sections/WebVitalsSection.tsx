"use client";

import React from "react";
import {
  Activity,
  BarChart3,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Laptop,
  Smartphone,
  Tablet,
  ExternalLink,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";
import { getTrackedUrl } from "@/lib/urlHelper";

export default function WebVitalsSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, activeProject } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Top Bar */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-5 md:p-6 shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                <Activity size={16} />
              </div>
              <span>Real User Monitoring (RUM) &amp; Core Web Vitals</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Real-world browser performance observed across Google Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20 w-fit tabular-nums">
            {data.webVitals?.totalMeasured ?? 0} Measured Sessions
          </span>
        </div>
      </div>

      {/* 5 Primary Vital Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. LCP */}
        {(() => {
          const lcp = data.webVitals?.overall.lcp;
          const dist = data.webVitals?.distributions.lcp || { good: 0, needsImprovement: 0, poor: 0 };
          const total = dist.good + dist.needsImprovement + dist.poor || 1;
          const goodPct = Math.round((dist.good / total) * 100);
          const needsPct = Math.round((dist.needsImprovement / total) * 100);
          const poorPct = Math.round((dist.poor / total) * 100);
          const rating = !lcp ? "none" : lcp <= 2500 ? "good" : lcp <= 4000 ? "needs" : "poor";

          return (
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">LCP (Load Speed)</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${rating === "good" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  rating === "needs" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    rating === "poor" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>
                  {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {lcp ? `${(lcp / 1000).toFixed(2)}s` : "—"}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">Largest Contentful Paint</span>
              </div>
              {/* Distribution Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" title={`Good: ${goodPct}%`} />
                  <div style={{ width: `${needsPct}%` }} className="h-full bg-amber-500" title={`Needs Imp: ${needsPct}%`} />
                  <div style={{ width: `${poorPct}%` }} className="h-full bg-rose-500" title={`Poor: ${poorPct}%`} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span className="text-emerald-400 font-semibold">{goodPct}% Good</span>
                  <span>Target: &le; 2.50s</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 2. INP */}
        {(() => {
          const inp = data.webVitals?.overall.inp;
          const dist = data.webVitals?.distributions.inp || { good: 0, needsImprovement: 0, poor: 0 };
          const total = dist.good + dist.needsImprovement + dist.poor || 1;
          const goodPct = Math.round((dist.good / total) * 100);
          const rating = !inp ? "none" : inp <= 200 ? "good" : inp <= 500 ? "needs" : "poor";

          return (
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">INP (Interactivity)</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${rating === "good" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  rating === "needs" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    rating === "poor" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>
                  {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {inp ? `${inp}ms` : "—"}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">Interaction to Next Paint</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                  <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span className="text-emerald-400 font-semibold">{goodPct}% Good</span>
                  <span>Target: &le; 200ms</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 3. CLS */}
        {(() => {
          const cls = data.webVitals?.overall.cls;
          const dist = data.webVitals?.distributions.cls || { good: 0, needsImprovement: 0, poor: 0 };
          const total = dist.good + dist.needsImprovement + dist.poor || 1;
          const goodPct = Math.round((dist.good / total) * 100);
          const rating = cls === null || cls === undefined ? "none" : cls <= 0.1 ? "good" : cls <= 0.25 ? "needs" : "poor";

          return (
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">CLS (Stability)</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${rating === "good" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  rating === "needs" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    rating === "poor" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>
                  {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {cls !== null && cls !== undefined ? cls.toFixed(3) : "—"}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">Cumulative Layout Shift</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                  <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-rose-500" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span className="text-emerald-400 font-semibold">{goodPct}% Good</span>
                  <span>Target: &le; 0.10</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 4. FCP */}
        {(() => {
          const fcp = data.webVitals?.overall.fcp;
          const dist = data.webVitals?.distributions.fcp || { good: 0, needsImprovement: 0, poor: 0 };
          const total = dist.good + dist.needsImprovement + dist.poor || 1;
          const goodPct = Math.round((dist.good / total) * 100);
          const rating = !fcp ? "none" : fcp <= 1800 ? "good" : fcp <= 3000 ? "needs" : "poor";

          return (
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">FCP (First Paint)</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${rating === "good" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  rating === "needs" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    rating === "poor" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>
                  {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {fcp ? `${(fcp / 1000).toFixed(2)}s` : "—"}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">First Contentful Paint</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                  <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span className="text-emerald-400 font-semibold">{goodPct}% Good</span>
                  <span>Target: &le; 1.80s</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 5. TTFB */}
        {(() => {
          const ttfb = data.webVitals?.overall.ttfb;
          const rating = !ttfb ? "none" : ttfb <= 800 ? "good" : ttfb <= 1800 ? "needs" : "poor";

          return (
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">TTFB (Server Speed)</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${rating === "good" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  rating === "needs" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    rating === "poor" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>
                  {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {ttfb ? `${ttfb}ms` : "—"}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">Time to First Byte</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div style={{ width: `${rating === "good" ? 90 : 50}%` }} className={`h-full ${rating === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span className="text-emerald-400 font-semibold">Server Edge</span>
                  <span>Target: &le; 800ms</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Web Vitals by Page Matrix Table */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] bg-[#0e0f15] flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
            Route-by-Route Core Web Vitals Matrix
          </h3>
          <span className="text-xs font-mono text-zinc-500 tabular-nums">
            {data.webVitals?.pages?.length ?? 0} Analyzed Routes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0e0f15] border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="p-3.5">Route Path</th>
                <th className="p-3.5 text-right">Samples</th>
                <th className="p-3.5 text-right">LCP</th>
                <th className="p-3.5 text-right">INP</th>
                <th className="p-3.5 text-right">CLS</th>
                <th className="p-3.5 text-right">FCP</th>
                <th className="p-3.5 text-right">TTFB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {(!data.webVitals?.pages || data.webVitals.pages.length === 0) ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 font-sans text-xs">
                    No Core Web Vitals records available for the selected time range.
                  </td>
                </tr>
              ) : (
                data.webVitals.pages.map((p, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-3.5 font-medium text-white">
                      <a href={getTrackedUrl(p.pathname, activeProject)} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                        <span>{p.pathname}</span>
                        <ExternalLink size={10} className="text-zinc-500" />
                      </a>
                    </td>
                    <td className="p-3.5 text-right font-semibold text-zinc-400 tabular-nums">{p.count}</td>
                    <td className="p-3.5 text-right tabular-nums">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${!p.lcp ? "text-zinc-500 border-transparent" :
                        p.lcp <= 2500 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          p.lcp <= 4000 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                        {p.lcp ? `${(p.lcp / 1000).toFixed(2)}s` : "—"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right tabular-nums">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${!p.inp ? "text-zinc-500 border-transparent" :
                        p.inp <= 200 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          p.inp <= 500 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                        {p.inp ? `${p.inp}ms` : "—"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right tabular-nums">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${p.cls === null || p.cls === undefined ? "text-zinc-500 border-transparent" :
                        p.cls <= 0.1 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          p.cls <= 0.25 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                        {p.cls !== null && p.cls !== undefined ? p.cls.toFixed(3) : "—"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-medium text-zinc-400 tabular-nums">
                      {p.fcp ? `${(p.fcp / 1000).toFixed(2)}s` : "—"}
                    </td>
                    <td className="p-3.5 text-right font-medium text-zinc-400 tabular-nums">
                      {p.ttfb ? `${p.ttfb}ms` : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware & Network Diagnostics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Network Speeds */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">
            Network Connection Speeds
          </span>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.networkTypes || data.hardwareDiagnostics.networkTypes.length === 0) ? (
              <p className="text-xs text-zinc-500">No network data recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.networkTypes.map((net, idx) => {
                const is5G = net.type?.toLowerCase() === "5g";
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold uppercase flex items-center gap-1.5 text-zinc-200">
                      {is5G && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[9px] font-semibold border border-zinc-700">
                          5G NR
                        </span>
                      )}
                      <span>{net.type}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 tabular-nums">{net.count}</span>
                      <span className="text-white font-semibold tabular-nums">{net.percentage}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* GPU Renderers */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">
            Unmasked WebGL GPUs
          </span>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.gpus || data.hardwareDiagnostics.gpus.length === 0) ? (
              <p className="text-xs text-zinc-500">No GPU profiles recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.gpus.map((gpu, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <span className="font-medium text-zinc-200 truncate max-w-[170px]" title={gpu.gpu}>{gpu.gpu}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 tabular-nums">{gpu.count}</span>
                    <span className="text-white font-semibold tabular-nums">{gpu.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CPU Cores */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">
            CPU Core Architecture
          </span>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.cpuCores || data.hardwareDiagnostics.cpuCores.length === 0) ? (
              <p className="text-xs text-zinc-500">No CPU cores recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.cpuCores.map((cpu, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <span className="font-medium text-zinc-200">{cpu.cores}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 tabular-nums">{cpu.count}</span>
                    <span className="text-white font-semibold tabular-nums">{cpu.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

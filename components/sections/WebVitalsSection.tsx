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
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  <span>Real User Monitoring (RUM) &amp; Core Web Vitals</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-world browser performance observed across Google Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 w-fit">
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
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">LCP (Load Speed)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                        rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                      }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {lcp ? `${(lcp / 1000).toFixed(2)}s` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Largest Contentful Paint</span>
                  </div>
                  {/* Distribution Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" title={`Good: ${goodPct}%`} />
                      <div style={{ width: `${needsPct}%` }} className="h-full bg-amber-500" title={`Needs Imp: ${needsPct}%`} />
                      <div style={{ width: `${poorPct}%` }} className="h-full bg-rose-500" title={`Poor: ${poorPct}%`} />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
                      <span>Target: &le; 2.5s</span>
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
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">INP (Interactivity)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                        rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                      }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {inp ? `${inp}ms` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Interaction to Next Paint</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
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
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">CLS (Visual Shift)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                        rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                      }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {cls !== null && cls !== undefined ? cls.toFixed(3) : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Cumulative Layout Shift</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
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
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">FCP (First Paint)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                        rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                      }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {fcp ? `${(fcp / 1000).toFixed(2)}s` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">First Contentful Paint</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${goodPct}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${100 - goodPct}%` }} className="h-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">{goodPct}% Good</span>
                      <span>Target: &le; 1.8s</span>
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
                <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">TTFB (Server Speed)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${rating === "good" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      rating === "needs" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                        rating === "poor" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground"
                      }`}>
                      {rating === "good" ? "Good" : rating === "needs" ? "Needs Imp" : rating === "poor" ? "Poor" : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-foreground">
                      {ttfb ? `${ttfb}ms` : "—"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">Time to First Byte</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div style={{ width: `${rating === "good" ? 90 : 50}%` }} className={`h-full ${rating === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span className="text-emerald-600 dark:text-emerald-400">Server Edge</span>
                      <span>Target: &le; 800ms</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Web Vitals by Page Matrix Table */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Route-by-Route Core Web Vitals Matrix
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {data.webVitals?.pages?.length ?? 0} Analyzed Routes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
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
                <tbody className="divide-y divide-border">
                  {(!data.webVitals?.pages || data.webVitals.pages.length === 0) ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        No Core Web Vitals records available for the selected time range.
                      </td>
                    </tr>
                  ) : (
                    data.webVitals.pages.map((p, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-foreground">
                          <a href={getTrackedUrl(p.pathname, activeProject)} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1.5">
                            <span>{p.pathname}</span>
                            <ExternalLink size={10} className="text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-bold text-muted-foreground">{p.count}</td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${!p.lcp ? "text-muted-foreground" :
                            p.lcp <= 2500 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                              p.lcp <= 4000 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}>
                            {p.lcp ? `${(p.lcp / 1000).toFixed(2)}s` : "—"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${!p.inp ? "text-muted-foreground" :
                            p.inp <= 200 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                              p.inp <= 500 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}>
                            {p.inp ? `${p.inp}ms` : "—"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.cls === null || p.cls === undefined ? "text-muted-foreground" :
                            p.cls <= 0.1 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                              p.cls <= 0.25 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}>
                            {p.cls !== null && p.cls !== undefined ? p.cls.toFixed(3) : "—"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-muted-foreground">
                          {p.fcp ? `${(p.fcp / 1000).toFixed(2)}s` : "—"}
                        </td>
                        <td className="p-3.5 text-right font-bold text-muted-foreground">
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
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Network Connection Speeds
              </span>
              <div className="space-y-2">
                {(!data.hardwareDiagnostics?.networkTypes || data.hardwareDiagnostics.networkTypes.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No network data recorded yet.</p>
                ) : (
                  data.hardwareDiagnostics.networkTypes.map((net, idx) => {
                    const is5G = net.type?.toLowerCase() === "5g";
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono">
                        <span className={`font-bold uppercase flex items-center gap-1.5 ${is5G ? "text-cyan-400" : "text-foreground"}`}>
                          {is5G && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-black border border-cyan-500/30">
                              5G NR
                            </span>
                          )}
                          <span>{net.type}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{net.count}</span>
                          <span className={`${is5G ? "text-cyan-400" : "text-primary"} font-bold`}>{net.percentage}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* GPU Renderers */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Unmasked WebGL GPUs
              </span>
              <div className="space-y-2">
                {(!data.hardwareDiagnostics?.gpus || data.hardwareDiagnostics.gpus.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No GPU profiles recorded yet.</p>
                ) : (
                  data.hardwareDiagnostics.gpus.map((gpu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground truncate max-w-[170px]" title={gpu.gpu}>{gpu.gpu}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{gpu.count}</span>
                        <span className="text-primary font-bold">{gpu.percentage}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CPU Cores */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                CPU Core Architecture
              </span>
              <div className="space-y-2">
                {(!data.hardwareDiagnostics?.cpuCores || data.hardwareDiagnostics.cpuCores.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No CPU cores recorded yet.</p>
                ) : (
                  data.hardwareDiagnostics.cpuCores.map((cpu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground">{cpu.cores}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{cpu.count}</span>
                        <span className="text-primary font-bold">{cpu.percentage}%</span>
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

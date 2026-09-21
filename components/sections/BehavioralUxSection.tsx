"use client";

import React from "react";
import {
  Flame,
  LogOut,
  ExternalLink,
  BarChart3,
  Sliders,
  Layers,
  Activity,
  AlertCircle,
  Eye,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";
import { getTrackedUrl } from "@/lib/urlHelper";

export default function BehavioralUxSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, activeProject } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-5 md:p-6 shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-amber-400">
                <Flame size={16} />
              </div>
              <span>Behavioral UX Signals &amp; Frustration Radar</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Automated detection of user frustration, rage clicks, bounce rate, and active vs. idle tab dwell times
            </p>
          </div>
        </div>
      </div>

      {/* 4 Key UX Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">Bounce Rate</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">{data.behavioralSignals?.bounceRate ?? 0}%</span>
          <span className="text-[11px] text-zinc-400 font-mono block">Sessions &lt; 10s with 0 scroll</span>
        </div>
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">Exit Intent Rate</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{data.behavioralSignals?.exitIntentRate ?? 0}%</span>
          <span className="text-[11px] text-zinc-400 font-mono block">Desktop cursor exited top</span>
        </div>
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">Active Learning Ratio</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {data.behavioralSignals?.activeRatio.activePercentage ?? 100}%
          </span>
          <span className="text-[11px] text-zinc-400 font-mono block">Genuine tab interaction time</span>
        </div>
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">Avg Focus Switches</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {data.behavioralSignals?.activeRatio.avgFocusCount ?? 1}
          </span>
          <span className="text-[11px] text-zinc-400 font-mono block">Tab blur / focus cycles</span>
        </div>
      </div>

      {/* Rage Clicks Radar Table */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] bg-[#0e0f15] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Rage Click Radar (Rapid Frustrated Clicks on Elements)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500 tabular-nums">
            {data.behavioralSignals?.rageClicks?.length ?? 0} Flagged Targets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0e0f15] border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="p-3.5">Element Selector</th>
                <th className="p-3.5">Affected Page</th>
                <th className="p-3.5 text-right">Frustration Count</th>
                <th className="p-3.5">Element Text Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {(!data.behavioralSignals?.rageClicks || data.behavioralSignals.rageClicks.length === 0) ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500 font-sans text-xs">
                    Zero rage clicks detected. Users are navigating and interacting without UI frustration.
                  </td>
                </tr>
              ) : (
                data.behavioralSignals.rageClicks.map((r, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-3.5 font-semibold text-rose-400">
                      <code>{r.element}</code>
                    </td>
                    <td className="p-3.5">
                      <a href={getTrackedUrl(String(r.pathname), activeProject)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-white">
                        {r.pathname}
                      </a>
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-400 tabular-nums">{r.count} &times;</td>
                    <td className="p-3.5 text-zinc-400 font-sans truncate max-w-xs">{r.sampleText || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outbound External Links */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] bg-[#0e0f15] flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
            Top Outbound External Resource Clicks
          </h3>
          <span className="text-xs font-mono text-zinc-500 tabular-nums">
            {data.behavioralSignals?.outboundClicks?.length ?? 0} External Links
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0e0f15] border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="p-3.5">Target External URL</th>
                <th className="p-3.5">Label Preview</th>
                <th className="p-3.5 text-right">Click Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {(!data.behavioralSignals?.outboundClicks || data.behavioralSignals.outboundClicks.length === 0) ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-zinc-500 font-sans text-xs">
                    No external outbound clicks recorded in this timeframe.
                  </td>
                </tr>
              ) : (
                data.behavioralSignals.outboundClicks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-3.5 font-medium text-white">
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                        <span className="truncate max-w-md">{link.href}</span>
                        <ExternalLink size={10} className="text-zinc-500" />
                      </a>
                    </td>
                    <td className="p-3.5 text-zinc-400 font-sans truncate max-w-xs">{link.sampleText || "—"}</td>
                    <td className="p-3.5 text-right font-bold text-white tabular-nums">{link.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

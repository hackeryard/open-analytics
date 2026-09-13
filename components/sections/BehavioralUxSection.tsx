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

export default function BehavioralUxSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  return (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Flame size={18} className="text-amber-500" />
                  <span>Behavioral UX Signals &amp; Frustration Radar</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automated detection of user frustration, rage clicks, bounce rate, and active vs. idle tab dwell times
                </p>
              </div>
            </div>
          </div>

          {/* 4 Key UX Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Bounce Rate</span>
              <span className="text-2xl font-black text-foreground">{data.behavioralSignals?.bounceRate ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Sessions &lt; 10s with 0 scroll</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Exit Intent Rate</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{data.behavioralSignals?.exitIntentRate ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground font-mono block">Desktop cursor exited top</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Active Learning Ratio</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {data.behavioralSignals?.activeRatio.activePercentage ?? 100}%
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">Genuine tab interaction time</span>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Avg Focus Switches</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {data.behavioralSignals?.activeRatio.avgFocusCount ?? 1}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">Tab blur / focus cycles</span>
            </div>
          </div>

          {/* Rage Clicks Radar Table */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-glow" />
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Rage Click Radar (Rapid Frustrated Clicks on Frozen / Confusing Elements)
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground font-bold">
                {data.behavioralSignals?.rageClicks?.length ?? 0} Flagged Targets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Element Selector</th>
                    <th className="p-3.5">Affected Page</th>
                    <th className="p-3.5 text-right">Frustration Count</th>
                    <th className="p-3.5">Element Text Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(!data.behavioralSignals?.rageClicks || data.behavioralSignals.rageClicks.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        Zero rage clicks detected. Users are navigating and interacting without UI frustration.
                      </td>
                    </tr>
                  ) : (
                    data.behavioralSignals.rageClicks.map((r, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">
                          <code>{r.element}</code>
                        </td>
                        <td className="p-3.5">
                          <a href={String(r.pathname)} target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold text-foreground">
                            {r.pathname}
                          </a>
                        </td>
                        <td className="p-3.5 text-right font-black text-rose-600 dark:text-rose-400">{r.count} &times;</td>
                        <td className="p-3.5 text-muted-foreground font-sans truncate max-w-xs">{r.sampleText || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbound External Links */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Top Outbound External Resource Clicks
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {data.behavioralSignals?.outboundClicks?.length ?? 0} External Links
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Target External URL</th>
                    <th className="p-3.5">Label Preview</th>
                    <th className="p-3.5 text-right">Click Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(!data.behavioralSignals?.outboundClicks || data.behavioralSignals.outboundClicks.length === 0) ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground font-sans text-xs">
                        No external outbound clicks recorded in this timeframe.
                      </td>
                    </tr>
                  ) : (
                    data.behavioralSignals.outboundClicks.map((link, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        <td className="p-3.5 font-bold text-foreground">
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1.5">
                            <span className="truncate max-w-md">{link.href}</span>
                            <ExternalLink size={10} className="text-muted-foreground" />
                          </a>
                        </td>
                        <td className="p-3.5 text-muted-foreground font-sans truncate max-w-xs">{link.sampleText || "—"}</td>
                        <td className="p-3.5 text-right font-black text-foreground">{link.count}</td>
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

"use client";

import React from "react";
import {
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  Monitor,
  Wifi,
  Radio,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData } from "@/lib/analyticsTypes";

export default function TechSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  const totalViews = data.overview?.totalViews || 1;
  const topDevice = data.devices?.[0];
  const topBrowser = data.browsers?.[0];
  const topOs = data.operatingSystems?.[0];

  const fiveGNetwork = data.hardwareDiagnostics?.networkTypes?.find(
    (n) => n.type?.toLowerCase() === "5g"
  );

  return (
    <div className="space-y-6">
      {/* KPI Overview Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Primary Form Factor */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              Primary Device
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              {topDevice?.device === "mobile" ? (
                <Smartphone size={16} />
              ) : topDevice?.device === "tablet" ? (
                <Tablet size={16} />
              ) : (
                <Laptop size={16} />
              )}
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-foreground capitalize truncate">
            {topDevice?.device || "Desktop"}
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            {topDevice ? `${topDevice.percentage}% of traffic (${topDevice.count.toLocaleString()})` : "—"}
          </p>
        </div>

        {/* Top Web Browser */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              Dominant Browser
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Monitor size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-foreground truncate">
            {topBrowser?.browser || "Chrome"}
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            {topBrowser ? `${topBrowser.count.toLocaleString()} views (${topBrowser.percentage}%)` : "—"}
          </p>
        </div>

        {/* Leading Operating System */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              Primary OS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-foreground truncate">
            {topOs?.os || "Windows"}
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            {topOs ? `${topOs.count.toLocaleString()} views (${topOs.percentage}%)` : "—"}
          </p>
        </div>

        {/* 5G & High-Speed Network */}
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              5G &amp; Cellular
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Radio size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 flex items-center gap-1.5 truncate">
            <span>{fiveGNetwork ? `${fiveGNetwork.percentage}%` : "Active"}</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">
              5G NR
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            {fiveGNetwork ? `${fiveGNetwork.count.toLocaleString()} 5G hits recorded` : "High-speed telemetry ready"}
          </p>
        </div>
      </div>

      {/* Main Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Device Form Factor Breakdown */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Laptop size={14} className="text-primary" /> Device Types
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {data.devices?.length || 0} categories
            </span>
          </div>
          <div className="space-y-3">
            {(!data.devices || data.devices.length === 0) ? (
              <p className="text-xs text-muted-foreground">No device data recorded yet.</p>
            ) : (
              data.devices.map((d, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="capitalize text-foreground flex items-center gap-1.5">
                      {d.device === "mobile" ? (
                        <Smartphone size={14} className="text-amber-400" />
                      ) : d.device === "tablet" ? (
                        <Tablet size={14} className="text-blue-400" />
                      ) : (
                        <Laptop size={14} className="text-emerald-400" />
                      )}
                      <span>{d.device}</span>
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {d.count} ({d.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${d.percentage}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Web Browsers */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Monitor size={14} className="text-blue-400" /> Top Browsers
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {data.browsers?.length || 0} detected
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(!data.browsers || data.browsers.length === 0) ? (
              <p className="text-xs text-muted-foreground">No browser data recorded yet.</p>
            ) : (
              data.browsers.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                >
                  <span className="text-foreground truncate">{b.browser}</span>
                  <span className="font-mono text-muted-foreground shrink-0 text-[11px]">
                    {b.count} ({b.percentage}%)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Operating Systems */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers size={14} className="text-purple-400" /> Operating Systems
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {data.operatingSystems?.length || 0} platforms
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(!data.operatingSystems || data.operatingSystems.length === 0) ? (
              <p className="text-xs text-muted-foreground">No OS data recorded yet.</p>
            ) : (
              data.operatingSystems.map((o, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                >
                  <span className="text-foreground truncate">{o.os}</span>
                  <span className="font-mono text-muted-foreground shrink-0 text-[11px]">
                    {o.count} ({o.percentage}%)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Screen Resolutions */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> Screen Resolutions
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {data.screenResolutions?.length || 0} displays
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(!data.screenResolutions || data.screenResolutions.length === 0) ? (
              <p className="text-xs text-muted-foreground">No screen data recorded yet.</p>
            ) : (
              data.screenResolutions.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold font-mono"
                >
                  <span className="text-foreground">{s.screen || "Unknown"}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    {s.count} ({s.percentage}%)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Advanced Hardware Architecture & Connection Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Network Connection Speeds (5G, 4G, WiFi) */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wifi size={14} className="text-cyan-400" /> Network Speeds
            </h3>
          </div>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.networkTypes || data.hardwareDiagnostics.networkTypes.length === 0) ? (
              <p className="text-xs text-muted-foreground">No network telemetry captured yet.</p>
            ) : (
              data.hardwareDiagnostics.networkTypes.map((net, idx) => {
                const is5G = net.type?.toLowerCase() === "5g";
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono ${is5G
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : "bg-muted/30 border-border text-foreground"
                      }`}
                  >
                    <span className="font-bold uppercase flex items-center gap-1.5">
                      {is5G && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-black border border-cyan-500/30">
                          ⚡ 5G NR
                        </span>
                      )}
                      <span>{net.type}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{net.count}</span>
                      <span className={is5G ? "text-cyan-400 font-bold" : "text-primary font-bold"}>
                        {net.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Unmasked WebGL GPUs */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Cpu size={14} className="text-emerald-400" /> Unmasked WebGL GPUs
            </h3>
          </div>
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {(!data.hardwareDiagnostics?.gpus || data.hardwareDiagnostics.gpus.length === 0) ? (
              <p className="text-xs text-muted-foreground">No GPU profiles recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.gpus.map((gpu, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-mono"
                >
                  <span className="font-bold text-foreground truncate max-w-[190px]" title={gpu.gpu}>
                    {gpu.gpu}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground">{gpu.count}</span>
                    <span className="text-primary font-bold">{gpu.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CPU Core Architecture */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Cpu size={14} className="text-purple-400" /> CPU Core Architecture
            </h3>
          </div>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.cpuCores || data.hardwareDiagnostics.cpuCores.length === 0) ? (
              <p className="text-xs text-muted-foreground">No CPU core profiles recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.cpuCores.map((cpu, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-mono"
                >
                  <span className="font-bold text-foreground">
                    {cpu.cores} Physical / Logical Cores
                  </span>
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

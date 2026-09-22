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
    <div className="space-y-6 pb-16">
      {/* KPI Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Primary Form Factor */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Primary Device
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              {topDevice?.device === "mobile" ? (
                <Smartphone size={14} />
              ) : topDevice?.device === "tablet" ? (
                <Tablet size={14} />
              ) : (
                <Laptop size={14} />
              )}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight capitalize truncate">
            {topDevice?.device || "Desktop"}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {topDevice ? `${topDevice.percentage}% share (${topDevice.count.toLocaleString()} views)` : "—"}
          </p>
        </div>

        {/* Top Web Browser */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Dominant Browser
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Monitor size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight truncate">
            {topBrowser?.browser || "Chrome"}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {topBrowser ? `${topBrowser.count.toLocaleString()} views (${topBrowser.percentage}%)` : "—"}
          </p>
        </div>

        {/* Leading Operating System */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Primary OS
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Layers size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight truncate">
            {topOs?.os || "Windows"}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {topOs ? `${topOs.count.toLocaleString()} views (${topOs.percentage}%)` : "—"}
          </p>
        </div>

        {/* 5G & High-Speed Network */}
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              5G Cellular / Fast Net
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Radio size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight flex items-center gap-2 truncate tabular-nums">
            <span>{fiveGNetwork ? `${fiveGNetwork.percentage}%` : "Ready"}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 text-[10px] font-mono border border-white/[0.08]">
              5G NR
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {fiveGNetwork ? `${fiveGNetwork.count.toLocaleString()} 5G hits recorded` : "High-speed telemetry active"}
          </p>
        </div>
      </div>

      {/* Main Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Device Form Factor Breakdown */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Laptop size={14} className="text-zinc-300" />
              <span>Device Types</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              {data.devices?.length || 0} categories
            </span>
          </div>
          <div className="space-y-3">
            {(!data.devices || data.devices.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No device data recorded yet.</p>
            ) : (
              data.devices.map((d, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="capitalize text-zinc-200 flex items-center gap-1.5">
                      {d.device === "mobile" ? (
                        <Smartphone size={13} className="text-zinc-400" />
                      ) : d.device === "tablet" ? (
                        <Tablet size={13} className="text-zinc-400" />
                      ) : (
                        <Laptop size={13} className="text-zinc-400" />
                      )}
                      <span>{d.device}</span>
                    </span>
                    <span className="font-mono text-zinc-400 text-[11px] tabular-nums">
                      {d.count.toLocaleString()} ({d.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${d.percentage}%` }}
                      className="h-full bg-white rounded-full transition-all"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Web Browsers */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Monitor size={14} className="text-zinc-300" />
              <span>Top Browsers</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              {data.browsers?.length || 0} detected
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(!data.browsers || data.browsers.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No browser data recorded yet.</p>
            ) : (
              data.browsers.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs"
                >
                  <span className="text-zinc-200 truncate">{b.browser}</span>
                  <span className="font-mono text-zinc-400 shrink-0 text-[11px] tabular-nums">
                    {b.count.toLocaleString()} ({b.percentage}%)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Operating Systems */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers size={14} className="text-zinc-300" />
              <span>Operating Systems</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              {data.operatingSystems?.length || 0} platforms
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(!data.operatingSystems || data.operatingSystems.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No OS data recorded yet.</p>
            ) : (
              data.operatingSystems.map((o, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs"
                >
                  <span className="text-zinc-200 truncate">{o.os}</span>
                  <span className="font-mono text-zinc-400 shrink-0 text-[11px] tabular-nums">
                    {o.count.toLocaleString()} ({o.percentage}%)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Screen Resolutions */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Zap size={14} className="text-zinc-300" />
              <span>Resolutions</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              {data.screenResolutions?.length || 0} displays
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(!data.screenResolutions || data.screenResolutions.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No screen data recorded yet.</p>
            ) : (
              data.screenResolutions.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs font-mono"
                >
                  <span className="text-zinc-200">{s.screen || "Unknown"}</span>
                  <span className="text-zinc-400 text-[11px] shrink-0 tabular-nums">
                    {s.count.toLocaleString()} ({s.percentage}%)
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
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Wifi size={14} className="text-zinc-300" />
              <span>Network Speeds</span>
            </h3>
          </div>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.networkTypes || data.hardwareDiagnostics.networkTypes.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No network telemetry captured yet.</p>
            ) : (
              data.hardwareDiagnostics.networkTypes.map((net, idx) => {
                const is5G = net.type?.toLowerCase() === "5g";
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-[#0e0f15] text-xs font-mono"
                  >
                    <span className="font-medium uppercase flex items-center gap-1.5 text-zinc-200">
                      {is5G && (
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white text-[9px] font-medium border border-white/[0.1]">
                          5G NR
                        </span>
                      )}
                      <span>{net.type}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 tabular-nums">{net.count.toLocaleString()}</span>
                      <span className="text-white font-medium tabular-nums">
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
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu size={14} className="text-zinc-300" />
              <span>Unmasked WebGL GPUs</span>
            </h3>
          </div>
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {(!data.hardwareDiagnostics?.gpus || data.hardwareDiagnostics.gpus.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No GPU profiles recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.gpus.map((gpu, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs font-mono"
                >
                  <span className="font-medium text-zinc-300 truncate max-w-[190px]" title={gpu.gpu}>
                    {gpu.gpu}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-zinc-500 tabular-nums">{gpu.count.toLocaleString()}</span>
                    <span className="text-white font-medium tabular-nums">{gpu.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CPU Core Architecture */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu size={14} className="text-zinc-300" />
              <span>CPU Core Architecture</span>
            </h3>
          </div>
          <div className="space-y-2">
            {(!data.hardwareDiagnostics?.cpuCores || data.hardwareDiagnostics.cpuCores.length === 0) ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No CPU core profiles recorded yet.</p>
            ) : (
              data.hardwareDiagnostics.cpuCores.map((cpu, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs font-mono"
                >
                  <span className="font-medium text-zinc-300">
                    {cpu.cores} Physical / Logical Cores
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 tabular-nums">{cpu.count.toLocaleString()}</span>
                    <span className="text-white font-medium tabular-nums">{cpu.percentage}%</span>
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

"use client";

import React from "react";
import Link from "next/link";
import { Laptop, Smartphone, Tablet, ArrowRight } from "lucide-react";

export default function DeviceBreakdownWidget({
  devices,
  browsers,
}: {
  devices?: { device: string; count: number; percentage: number }[];
  browsers?: { browser: string; count: number; percentage: number }[];
}) {
  const safeDevices = devices || [];
  const safeBrowsers = browsers || [];

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mobile":
        return <Smartphone size={14} className="text-zinc-300" />;
      case "tablet":
        return <Tablet size={14} className="text-zinc-300" />;
      default:
        return <Laptop size={14} className="text-zinc-300" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Laptop size={15} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Devices &amp; Browsers</h3>
          </div>
          <Link
            href="/devices"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
          >
            <span>Hardware Details</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-xs text-zinc-400">Form factor ratios, browser rendering engines, and OS distribution</p>
      </div>

      {/* Segmented Device Ratio Bar */}
      <div className="space-y-2 flex-1 pt-1">
        {safeDevices.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono">
            No client device telemetry recorded yet
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs text-zinc-400">
              <span className="font-medium text-zinc-300">Platform Form Factors</span>
              <span className="font-mono text-white text-[11px] truncate tabular-nums">
                {safeDevices.map((d) => `${d.percentage}% ${d.device}`).join(" • ")}
              </span>
            </div>

            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
              {safeDevices.map((d, i) => {
                const bg = i === 0 ? "bg-white" : i === 1 ? "bg-zinc-400" : "bg-zinc-600";
                return (
                  <div
                    key={d.device}
                    style={{ width: `${d.percentage}%` }}
                    className={`h-full ${bg} transition-all`}
                    title={`${d.device}: ${d.percentage}%`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Top Browsers list */}
        {safeBrowsers.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="text-[10px] font-mono font-semibold uppercase text-zinc-500 tracking-wider">
              Top Client Browsers
            </div>
            <div className="grid grid-cols-2 gap-2">
              {safeBrowsers.slice(0, 4).map((b) => (
                <div
                  key={b.browser}
                  className="p-2.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-zinc-200 truncate">{b.browser}</span>
                  <span className="font-mono font-semibold text-white text-[11px] tabular-nums">{b.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span>Hardware Engine Analysis</span>
        <span>High-DPI Retina Ready</span>
      </div>
    </div>
  );
}

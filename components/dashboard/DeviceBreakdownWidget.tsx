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
        return <Smartphone size={14} className="text-cyan-400" />;
      case "tablet":
        return <Tablet size={14} className="text-purple-400" />;
      default:
        return <Laptop size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Laptop size={15} />
            </div>
            <h3 className="text-sm font-black text-white">Devices &amp; Browsers</h3>
          </div>
          <Link
            href="/tech"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Hardware Details</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">Form factor ratios, browser rendering engines, and OS distribution</p>
      </div>

      {/* Segmented Device Ratio Bar */}
      <div className="space-y-2 flex-1 pt-1">
        {safeDevices.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No client device fingerprints recorded yet
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Platform Form Factors</span>
              <span className="font-mono text-white text-[11px]">
                {safeDevices.map((d) => `${d.percentage}% ${d.device}`).join(" • ")}
              </span>
            </div>

            <div className="h-2.5 w-full bg-white/[0.05] rounded-full overflow-hidden flex">
              {safeDevices.map((d) => {
                const bg =
                  d.device === "mobile"
                    ? "bg-cyan-500"
                    : d.device === "tablet"
                    ? "bg-purple-500"
                    : "bg-blue-600";
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
            <div className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">
              Top Client Browsers
            </div>
            <div className="grid grid-cols-2 gap-2">
              {safeBrowsers.slice(0, 4).map((b) => (
                <div
                  key={b.browser}
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-300 truncate">{b.browser}</span>
                  <span className="font-mono font-bold text-cyan-400 text-[11px]">{b.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>WebGL Unmasked Detection</span>
        <span>High-DPI Retina Support</span>
      </div>
    </div>
  );
}

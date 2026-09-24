"use client";

import React, { useState, useMemo } from "react";
import {
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  Monitor,
  Wifi,
  Radio,
  Layers,
  Search,
  SlidersHorizontal,
  Download,
  X,
  Sparkles,
  Zap,
  Gauge,
  CheckCircle2,
  HardDrive,
  ScreenShare,
  Maximize2,
  ArrowUpDown,
  Compass,
  Activity,
  Globe,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData } from "@/lib/analyticsTypes";

type TabId = "all" | "devices" | "browsers" | "os" | "hardware" | "network";
type SortOption = "share_desc" | "share_asc" | "name_asc";

// Clean vendor and GPU name from unmasked ANGLE/WebGL strings
function cleanGpuName(rawGpu: string): { name: string; vendor: string } {
  if (!rawGpu) return { name: "Generic GPU", vendor: "Standard" };

  let clean = rawGpu
    .replace(/^ANGLE \(/i, "")
    .replace(/\)$/, "")
    .replace(/Direct3D\d+.*$/i, "")
    .replace(/OpenGL.*$/i, "")
    .replace(/vs_\d+_\d+.*$/i, "")
    .replace(/ps_\d+_\d+.*$/i, "")
    .replace(/D3D11.*$/i, "")
    .trim();

  // Remove comma prefixes if any
  const parts = clean.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    clean = parts[1] || parts[0];
  }

  let vendor = "Other";
  const lower = rawGpu.toLowerCase();
  if (lower.includes("apple") || lower.includes("m1") || lower.includes("m2") || lower.includes("m3") || lower.includes("m4")) {
    vendor = "Apple Silicon";
  } else if (lower.includes("nvidia") || lower.includes("geforce") || lower.includes("quadro") || lower.includes("rtx") || lower.includes("gtx")) {
    vendor = "NVIDIA";
  } else if (lower.includes("amd") || lower.includes("radeon")) {
    vendor = "AMD";
  } else if (lower.includes("intel") || lower.includes("iris") || lower.includes("uhd") || lower.includes("arc")) {
    vendor = "Intel";
  } else if (lower.includes("qualcomm") || lower.includes("adreno")) {
    vendor = "Qualcomm";
  } else if (lower.includes("mali")) {
    vendor = "ARM Mali";
  } else if (lower.includes("swiftshader") || lower.includes("llvmpipe") || lower.includes("software")) {
    vendor = "Software Render";
  }

  return { name: clean || rawGpu, vendor };
}

// Infer aspect ratio & display format from resolution string (e.g. 1920x1080)
function getResolutionDetails(resStr: string): { ratio: string; category: string } {
  const parts = resStr.split("x").map((n) => parseInt(n.trim(), 10));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return { ratio: "Standard", category: "Display" };
  }

  const [w, h] = parts;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(w, h);
  let aspectW = Math.round(w / divisor);
  let aspectH = Math.round(h / divisor);

  // Common aspect ratio approximations
  const ratioVal = w / h;
  let ratio = `${aspectW}:${aspectH}`;
  if (Math.abs(ratioVal - 16 / 9) < 0.05) ratio = "16:9";
  else if (Math.abs(ratioVal - 16 / 10) < 0.05) ratio = "16:10";
  else if (Math.abs(ratioVal - 4 / 3) < 0.05) ratio = "4:3";
  else if (Math.abs(ratioVal - 21 / 9) < 0.1) ratio = "21:9";
  else if (Math.abs(ratioVal - 19.5 / 9) < 0.08) ratio = "19.5:9";
  else if (Math.abs(ratioVal - 9 / 16) < 0.05) ratio = "9:16";

  let category = "Desktop HD";
  if (w >= 3840 || h >= 2160) {
    category = "4K Ultra HD";
  } else if (w >= 2560 || h >= 1440) {
    category = "QHD / 2K";
  } else if (w <= 500) {
    category = "Mobile Screen";
  } else if (w < 1200 && h < 1200) {
    category = "Tablet / Fold";
  }

  return { ratio, category };
}

// Infer rendering engine from browser name
function getBrowserEngine(browserName: string): string {
  const lower = browserName.toLowerCase();
  if (
    lower.includes("chrome") ||
    lower.includes("edge") ||
    lower.includes("brave") ||
    lower.includes("opera") ||
    lower.includes("samsung") ||
    lower.includes("chromium")
  ) {
    return "Blink Engine";
  }
  if (lower.includes("safari") || lower.includes("ios") || lower.includes("webkit")) {
    return "WebKit Engine";
  }
  if (lower.includes("firefox") || lower.includes("gecko")) {
    return "Gecko Engine";
  }
  return "Standard Engine";
}

// Infer OS ecosystem
function getOsEcosystem(osName: string): string {
  const lower = osName.toLowerCase();
  if (lower.includes("ios") || lower.includes("android")) {
    return "Mobile OS";
  }
  if (lower.includes("windows") || lower.includes("mac") || lower.includes("chrome")) {
    return "Desktop OS";
  }
  if (lower.includes("linux") || lower.includes("ubuntu") || lower.includes("fedora")) {
    return "Linux / Unix";
  }
  return "Client Platform";
}

export default function DevicesSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("share_desc");

  if (!data) return null;

  const totalViews = data.overview?.totalViews || 1;
  const safeDevices = data.devices || [];
  const safeBrowsers = data.browsers || [];
  const safeOs = data.operatingSystems || [];
  const safeScreens = data.screenResolutions || [];
  const safeNetworks = data.hardwareDiagnostics?.networkTypes || [];
  const safeGpus = data.hardwareDiagnostics?.gpus || [];
  const safeCores = data.hardwareDiagnostics?.cpuCores || [];

  // KPI computations
  const topDevice = safeDevices[0];
  const topBrowser = safeBrowsers[0];
  const topOs = safeOs[0];
  const topGpuRaw = safeGpus[0];
  const topGpu = topGpuRaw ? cleanGpuName(topGpuRaw.gpu) : null;
  const fiveGNetwork = safeNetworks.find(
    (n) => n.type?.toLowerCase() === "5g" || n.type?.toLowerCase().includes("5g")
  );

  // Sorting helper
  const sortList = <T extends { count: number; percentage: number }>(
    list: T[],
    getName: (item: T) => string
  ): T[] => {
    return [...list].sort((a, b) => {
      if (sortOption === "share_desc") return b.count - a.count;
      if (sortOption === "share_asc") return a.count - b.count;
      if (sortOption === "name_asc") {
        return getName(a).localeCompare(getName(b));
      }
      return 0;
    });
  };

  // Filtered lists based on search
  const q = searchQuery.trim().toLowerCase();

  const filteredDevices = useMemo(() => {
    const list = safeDevices.filter((d) => !q || d.device.toLowerCase().includes(q));
    return sortList(list, (i) => i.device);
  }, [safeDevices, q, sortOption]);

  const filteredBrowsers = useMemo(() => {
    const list = safeBrowsers.filter(
      (b) =>
        !q ||
        b.browser.toLowerCase().includes(q) ||
        getBrowserEngine(b.browser).toLowerCase().includes(q)
    );
    return sortList(list, (i) => i.browser);
  }, [safeBrowsers, q, sortOption]);

  const filteredOs = useMemo(() => {
    const list = safeOs.filter(
      (o) =>
        !q ||
        o.os.toLowerCase().includes(q) ||
        getOsEcosystem(o.os).toLowerCase().includes(q)
    );
    return sortList(list, (i) => i.os);
  }, [safeOs, q, sortOption]);

  const filteredScreens = useMemo(() => {
    const list = safeScreens.filter((s) => {
      if (!q) return true;
      const details = getResolutionDetails(s.screen);
      return (
        s.screen.toLowerCase().includes(q) ||
        details.ratio.toLowerCase().includes(q) ||
        details.category.toLowerCase().includes(q)
      );
    });
    return sortList(list, (i) => i.screen);
  }, [safeScreens, q, sortOption]);

  const filteredGpus = useMemo(() => {
    const list = safeGpus.filter((g) => {
      if (!q) return true;
      const cleaned = cleanGpuName(g.gpu);
      return (
        g.gpu.toLowerCase().includes(q) ||
        cleaned.name.toLowerCase().includes(q) ||
        cleaned.vendor.toLowerCase().includes(q)
      );
    });
    return sortList(list, (i) => i.gpu);
  }, [safeGpus, q, sortOption]);

  const filteredCores = useMemo(() => {
    const list = safeCores.filter((c) => !q || c.cores.toLowerCase().includes(q));
    return sortList(list, (i) => i.cores);
  }, [safeCores, q, sortOption]);

  const filteredNetworks = useMemo(() => {
    const list = safeNetworks.filter((n) => !q || n.type.toLowerCase().includes(q));
    return sortList(list, (i) => i.type);
  }, [safeNetworks, q, sortOption]);

  // Total matching records for search badge
  const totalMatches =
    filteredDevices.length +
    filteredBrowsers.length +
    filteredOs.length +
    filteredScreens.length +
    filteredGpus.length +
    filteredCores.length +
    filteredNetworks.length;

  const handleExportCSV = () => {
    const rows: string[][] = [
      ["Category", "Identifier", "Telemetry Count", "Share Percentage", "Extra Metadata"],
    ];

    safeDevices.forEach((d) =>
      rows.push(["Device Form Factor", d.device, String(d.count), `${d.percentage}%`, ""])
    );
    safeBrowsers.forEach((b) =>
      rows.push(["Browser", b.browser, String(b.count), `${b.percentage}%`, getBrowserEngine(b.browser)])
    );
    safeOs.forEach((o) =>
      rows.push(["Operating System", o.os, String(o.count), `${o.percentage}%`, getOsEcosystem(o.os)])
    );
    safeScreens.forEach((s) => {
      const det = getResolutionDetails(s.screen);
      rows.push(["Screen Resolution", s.screen, String(s.count), `${s.percentage}%`, `${det.ratio} (${det.category})`]);
    });
    safeGpus.forEach((g) => {
      const gpuInfo = cleanGpuName(g.gpu);
      rows.push(["WebGL GPU", gpuInfo.name, String(g.count), `${g.percentage}%`, gpuInfo.vendor]);
    });
    safeCores.forEach((c) =>
      rows.push(["CPU Architecture", c.cores, String(c.count), `${c.percentage}%`, "Physical/Logical"])
    );
    safeNetworks.forEach((n) =>
      rows.push(["Network Bandwidth", n.type, String(n.count), `${n.percentage}%`, "Connection Speed"])
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `devices-hardware-telemetry-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeviceIcon = (deviceStr: string, size = 15) => {
    switch (deviceStr?.toLowerCase()) {
      case "mobile":
        return <Smartphone size={size} />;
      case "tablet":
        return <Tablet size={size} />;
      default:
        return <Laptop size={size} />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Executive Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Dominant Form Factor */}
        <div className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2.5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Primary Form Factor</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-300">
              {getDeviceIcon(topDevice?.device || "desktop", 14)}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight capitalize truncate">
            {topDevice?.device || "Desktop"}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 tabular-nums">
            <span>{topDevice ? `${topDevice.percentage}% share` : "0%"}</span>
            <span className="text-zinc-500">{topDevice ? `${topDevice.count.toLocaleString()} views` : "—"}</span>
          </div>
          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
            <div
              style={{ width: `${topDevice?.percentage || 0}%` }}
              className="h-full bg-white rounded-full transition-all"
            />
          </div>
        </div>

        {/* Dominant Web Browser */}
        <div className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2.5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Top Web Browser</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-300">
              <Monitor size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight truncate">
            {topBrowser?.browser || "Chrome"}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 tabular-nums">
            <span className="truncate max-w-[120px] text-zinc-400">
              {topBrowser ? getBrowserEngine(topBrowser.browser) : "Engine"}
            </span>
            <span className="text-zinc-500">{topBrowser ? `${topBrowser.percentage}%` : "—"}</span>
          </div>
          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
            <div
              style={{ width: `${topBrowser?.percentage || 0}%` }}
              className="h-full bg-zinc-300 rounded-full transition-all"
            />
          </div>
        </div>

        {/* Dominant Operating System */}
        <div className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2.5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Dominant Platform</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-300">
              <Layers size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight truncate">
            {topOs?.os || "Windows"}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 tabular-nums">
            <span className="truncate max-w-[120px] text-zinc-400">
              {topOs ? getOsEcosystem(topOs.os) : "Platform"}
            </span>
            <span className="text-zinc-500">{topOs ? `${topOs.percentage}%` : "—"}</span>
          </div>
          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
            <div
              style={{ width: `${topOs?.percentage || 0}%` }}
              className="h-full bg-zinc-400 rounded-full transition-all"
            />
          </div>
        </div>

        {/* Unmasked WebGL GPU */}
        <div className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2.5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">WebGL Hardware GPU</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-300">
              <Cpu size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight truncate" title={topGpu?.name || "Standard GPU"}>
            {topGpu?.name || "Active GPU"}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 tabular-nums">
            <span className="truncate max-w-[120px] text-zinc-300">
              {topGpu?.vendor || "Hardware"}
            </span>
            <span className="text-zinc-500">{topGpuRaw ? `${topGpuRaw.percentage}%` : "—"}</span>
          </div>
          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
            <div
              style={{ width: `${topGpuRaw?.percentage || 0}%` }}
              className="h-full bg-white rounded-full transition-all"
            />
          </div>
        </div>

        {/* 5G & High-Speed Network */}
        <div className="p-4 sm:p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2.5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">5G / Fast Cellular</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-300">
              <Radio size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight flex items-center gap-2 truncate tabular-nums">
            <span>{fiveGNetwork ? `${fiveGNetwork.percentage}%` : "Active"}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white text-[10px] font-mono border border-white/[0.1]">
              5G NR
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 tabular-nums">
            <span className="text-zinc-400">High-Bandwidth</span>
            <span className="text-zinc-500">{fiveGNetwork ? `${fiveGNetwork.count.toLocaleString()} hits` : "Monitoring"}</span>
          </div>
          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
            <div
              style={{ width: `${fiveGNetwork?.percentage || 0}%` }}
              className="h-full bg-zinc-200 rounded-full transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. Device Proportional Breakdown Bar & Quick Metric Cards */}
      <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <ScreenShare size={14} className="text-zinc-400" />
              <span>Form Factor Traffic Distribution</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Proportional client hardware breakdown across mobile viewports, desktop screens, and tablets
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400 tabular-nums">
            {totalViews.toLocaleString()} total pageviews evaluated
          </div>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#181922] rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-white/[0.04]">
            {safeDevices.map((d, idx) => {
              const bgClass =
                d.device === "desktop"
                  ? "bg-white"
                  : d.device === "mobile"
                  ? "bg-zinc-400"
                  : d.device === "tablet"
                  ? "bg-zinc-600"
                  : "bg-zinc-700";
              return (
                <div
                  key={idx}
                  style={{ width: `${Math.max(d.percentage, 2)}%` }}
                  title={`${d.device}: ${d.percentage}% (${d.count.toLocaleString()} views)`}
                  className={`h-full ${bgClass} rounded-sm transition-all`}
                />
              );
            })}
          </div>

          {/* Device Category Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {safeDevices.map((d, idx) => {
              const dotClass =
                d.device === "desktop"
                  ? "bg-white"
                  : d.device === "mobile"
                  ? "bg-zinc-400"
                  : d.device === "tablet"
                  ? "bg-zinc-600"
                  : "bg-zinc-700";
              return (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                    <div className="truncate">
                      <p className="text-xs font-medium text-zinc-200 capitalize flex items-center gap-1.5 truncate">
                        {getDeviceIcon(d.device, 13)}
                        <span>{d.device}</span>
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 tabular-nums">
                        {d.count.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-white font-mono tabular-nums shrink-0">
                    {d.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Obsidian Executive Control Bar (Filter Tabs, Search, Sort & Export) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-[#111218] border border-white/[0.08] rounded-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
          {[
            { id: "all", label: "All Diagnostics", icon: SlidersHorizontal },
            { id: "devices", label: "Form Factors & Displays", icon: Laptop },
            { id: "browsers", label: "Browsers & Engines", icon: Monitor },
            { id: "os", label: "Operating Systems", icon: Layers },
            { id: "hardware", label: "Hardware & WebGL GPU", icon: Cpu },
            { id: "network", label: "Network & 5G", icon: Wifi },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort & Export */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices, GPUs, OS, displays..."
              className="w-full bg-[#0e0f15] border border-white/[0.08] rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-[#0e0f15] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-zinc-400 shrink-0">
            <ArrowUpDown size={12} className="text-zinc-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-zinc-300 font-medium text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="share_desc" className="bg-[#111218] text-white">
                Share (High to Low)
              </option>
              <option value="share_asc" className="bg-[#111218] text-white">
                Share (Low to High)
              </option>
              <option value="name_asc" className="bg-[#111218] text-white">
                Name (A to Z)
              </option>
            </select>
          </div>

          {/* Export CSV CTA */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition shrink-0"
            title="Export full device and hardware telemetry as CSV"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Active Search Notification */}
      {searchQuery && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0e0f15] border border-white/[0.06] rounded-lg text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Search size={13} className="text-zinc-400" />
            <span>
              Showing results for <span className="text-white font-medium">"{searchQuery}"</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white text-[10px] font-mono">
              {totalMatches} matches found
            </span>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="text-zinc-400 hover:text-white underline text-[11px]"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* 4. Detailed Telemetry Sections Grid */}
      <div className="space-y-6">
        {/* TAB 1: FORM FACTORS & SCREEN RESOLUTIONS */}
        {(activeTab === "all" || activeTab === "devices") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Device Form Factors */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Laptop size={14} className="text-zinc-400" />
                    <span>Client Device Types</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">Hardware categories and screen form-factors</p>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                  {filteredDevices.length} categories
                </span>
              </div>

              <div className="space-y-2.5">
                {filteredDevices.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                    No device types match current filter.
                  </div>
                ) : (
                  filteredDevices.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="capitalize text-zinc-200 font-medium flex items-center gap-2">
                          <span className="text-zinc-400">{getDeviceIcon(d.device, 14)}</span>
                          <span>{d.device}</span>
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                          <span className="text-zinc-400">{d.count.toLocaleString()} views</span>
                          <span className="text-white font-semibold">{d.percentage}%</span>
                        </div>
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

            {/* Screen Resolutions */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Maximize2 size={14} className="text-zinc-400" />
                    <span>Display Screen Resolutions</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">Viewport pixel bounds &amp; detected aspect ratios</p>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                  {filteredScreens.length} displays
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredScreens.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                    No screen resolution telemetry matching query.
                  </div>
                ) : (
                  filteredScreens.map((s, idx) => {
                    const details = getResolutionDetails(s.screen);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-zinc-200 font-medium truncate">
                              {s.screen || "Unknown"}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-[10px] font-mono border border-white/[0.06] shrink-0">
                              {details.ratio}
                            </span>
                            <span className="text-[10px] text-zinc-500 hidden sm:inline truncate">
                              {details.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums shrink-0">
                            <span className="text-zinc-400">{s.count.toLocaleString()}</span>
                            <span className="text-white font-semibold">{s.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${s.percentage}%` }}
                            className="h-full bg-zinc-300 rounded-full transition-all"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BROWSERS & OPERATING SYSTEMS */}
        {(activeTab === "all" || activeTab === "browsers" || activeTab === "os") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Web Browsers */}
            {(activeTab === "all" || activeTab === "browsers") && (
              <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                      <Monitor size={14} className="text-zinc-400" />
                      <span>Web Browsers &amp; Rendering Engines</span>
                    </h3>
                    <p className="text-[11px] text-zinc-500">Blink, WebKit, and Gecko client engines</p>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                    {filteredBrowsers.length} detected
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredBrowsers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                      No web browser data matching query.
                    </div>
                  ) : (
                    filteredBrowsers.map((b, idx) => {
                      const engine = getBrowserEngine(b.browser);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-zinc-200 font-medium truncate">{b.browser}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-[10px] font-mono border border-white/[0.06] shrink-0">
                                {engine}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums shrink-0">
                              <span className="text-zinc-400">{b.count.toLocaleString()}</span>
                              <span className="text-white font-semibold">{b.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
                            <div
                              style={{ width: `${b.percentage}%` }}
                              className="h-full bg-white rounded-full transition-all"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Operating Systems */}
            {(activeTab === "all" || activeTab === "os") && (
              <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                      <Layers size={14} className="text-zinc-400" />
                      <span>Operating Systems &amp; Platforms</span>
                    </h3>
                    <p className="text-[11px] text-zinc-500">Desktop, mobile, and Unix kernel platforms</p>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                    {filteredOs.length} platforms
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredOs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                      No operating system data matching query.
                    </div>
                  ) : (
                    filteredOs.map((o, idx) => {
                      const eco = getOsEcosystem(o.os);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-zinc-200 font-medium truncate">{o.os}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-[10px] font-mono border border-white/[0.06] shrink-0">
                                {eco}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums shrink-0">
                              <span className="text-zinc-400">{o.count.toLocaleString()}</span>
                              <span className="text-white font-semibold">{o.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
                            <div
                              style={{ width: `${o.percentage}%` }}
                              className="h-full bg-zinc-300 rounded-full transition-all"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HARDWARE ARCHITECTURE & WEBGL GPU */}
        {(activeTab === "all" || activeTab === "hardware") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Unmasked WebGL GPUs */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Cpu size={14} className="text-zinc-400" />
                    <span>Unmasked WebGL Graphics Processors (GPU)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Real hardware rendering chipsets extracted via WebGL context
                  </p>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                  {filteredGpus.length} GPUs
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredGpus.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                    No GPU telemetry recorded yet.
                  </div>
                ) : (
                  filteredGpus.map((gpu, idx) => {
                    const info = cleanGpuName(gpu.gpu);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-zinc-200 font-medium truncate" title={gpu.gpu}>
                              {info.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-[10px] font-mono border border-white/[0.06] shrink-0">
                              {info.vendor}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums shrink-0">
                            <span className="text-zinc-400">{gpu.count.toLocaleString()}</span>
                            <span className="text-white font-semibold">{gpu.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${gpu.percentage}%` }}
                            className="h-full bg-white rounded-full transition-all"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* CPU Architecture & Cores */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Cpu size={14} className="text-zinc-400" />
                    <span>CPU Core Architecture</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Concurrency threads and physical/logical cores reported by navigator
                  </p>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                  {filteredCores.length} configurations
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredCores.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                    No CPU core profiles recorded yet.
                  </div>
                ) : (
                  filteredCores.map((cpu, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-zinc-200 font-medium flex items-center gap-2">
                          <Cpu size={13} className="text-zinc-400" />
                          <span>{cpu.cores}</span>
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                          <span className="text-zinc-400">{cpu.count.toLocaleString()}</span>
                          <span className="text-white font-semibold">{cpu.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cpu.percentage}%` }}
                          className="h-full bg-zinc-300 rounded-full transition-all"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NETWORK SPEEDS & 5G TELEMETRY */}
        {(activeTab === "all" || activeTab === "network") && (
          <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Wifi size={14} className="text-zinc-400" />
                  <span>Network Connection Speeds &amp; Bandwidth Diagnostics</span>
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Client effective connection types (5G, 4G, WiFi, Broadband) via Network Information API
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                {filteredNetworks.length} connection types
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNetworks.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-zinc-500 font-mono">
                  No network telemetry captured yet.
                </div>
              ) : (
                filteredNetworks.map((net, idx) => {
                  const is5G = net.type?.toLowerCase().includes("5g");
                  const is4G = net.type?.toLowerCase().includes("4g");
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-white/[0.06] bg-[#0e0f15] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-medium uppercase flex items-center gap-2 text-zinc-200">
                          {is5G ? (
                            <Radio size={14} className="text-white" />
                          ) : (
                            <Wifi size={14} className="text-zinc-400" />
                          )}
                          <span>{net.type}</span>
                          {is5G && (
                            <span className="px-1.5 py-0.5 rounded bg-white text-zinc-950 text-[9px] font-bold">
                              5G NR
                            </span>
                          )}
                          {is4G && (
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300 text-[9px] font-medium border border-white/[0.08]">
                              High Speed
                            </span>
                          )}
                        </span>
                        <span className="text-white font-semibold font-mono text-xs tabular-nums">
                          {net.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 tabular-nums">
                        <span>{net.count.toLocaleString()} hits</span>
                        <span>{is5G ? "Sub-6GHz / mmWave" : is4G ? "LTE / Broadband" : "Mobile Net"}</span>
                      </div>
                      <div className="w-full h-1 bg-[#181922] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${net.percentage}%` }}
                          className={`h-full rounded-full transition-all ${
                            is5G ? "bg-white" : "bg-zinc-400"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

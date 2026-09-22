"use client";

import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeseriesItem {
  label: string;
  views: number;
  visitors: number;
  returningViews?: number;
}

export default function PrimaryAnalyticsChart({
  timeseries,
  timeRange,
}: {
  timeseries: TimeseriesItem[];
  timeRange: string;
}) {
  const [selectedMetric, setSelectedMetric] = useState<"views" | "visitors" | "returning">("views");
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  // Format labels & datasets
  const chartData = useMemo(() => {
    if (!timeseries || timeseries.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = timeseries.map((t) => {
      if (t.label.includes(" ")) {
        return t.label.split(" ")[1];
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(t.label)) {
        const [y, m, d] = t.label.split("-").map(Number);
        const dt = new Date(Date.UTC(y, m - 1, d));
        return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
      }
      return t.label;
    });

    const values = timeseries.map((t) => {
      if (selectedMetric === "visitors") return t.visitors || 0;
      if (selectedMetric === "returning") return t.returningViews || 0;
      return t.views || 0;
    });

    const metricConfig = {
      views: {
        label: "Total Pageviews",
        borderColor: "#10b981", // Emerald
        gradientStart: "rgba(16, 185, 129, 0.20)",
        gradientEnd: "rgba(16, 185, 129, 0.0)",
        barColor: "rgba(16, 185, 129, 0.75)",
      },
      visitors: {
        label: "Unique Visitors",
        borderColor: "#ffffff", // Pure White
        gradientStart: "rgba(255, 255, 255, 0.16)",
        gradientEnd: "rgba(255, 255, 255, 0.0)",
        barColor: "rgba(255, 255, 255, 0.8)",
      },
      returning: {
        label: "Returning Visitors",
        borderColor: "#a1a1aa", // Zinc
        gradientStart: "rgba(161, 161, 170, 0.16)",
        gradientEnd: "rgba(161, 161, 170, 0.0)",
        barColor: "rgba(161, 161, 170, 0.75)",
      },
    }[selectedMetric];

    return {
      labels,
      datasets: [
        {
          label: metricConfig.label,
          data: values,
          borderColor: metricConfig.borderColor,
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return metricConfig.gradientStart;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, metricConfig.gradientStart);
            gradient.addColorStop(1, metricConfig.gradientEnd);
            return gradient;
          },
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: metricConfig.borderColor,
          pointBorderColor: "#090a0f",
          pointBorderWidth: 2,
          pointRadius: timeseries.length > 20 ? 1 : 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: metricConfig.borderColor,
          pointHoverBorderWidth: 2.5,
        },
      ],
    };
  }, [timeseries, selectedMetric]);

  const options: any = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(14, 20, 36, 0.95)",
          titleColor: "#f8fafc",
          bodyColor: "#06b6d4",
          borderColor: "rgba(255, 255, 255, 0.12)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 13, weight: "900", family: "monospace" },
          displayColors: false,
          callbacks: {
            title: (items: any) => {
              if (!items || items.length === 0) return "";
              const idx = items[0].dataIndex;
              const rawLabel = timeseries[idx]?.label || "";
              if (rawLabel.includes(" ")) {
                const [d, time] = rawLabel.split(" ");
                const [y, m, day] = d.split("-").map(Number);
                const dt = new Date(Date.UTC(y, m - 1, day));
                const dateStr = dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
                return `${dateStr} at ${time}`;
              }
              if (/^\d{4}-\d{2}-\d{2}$/.test(rawLabel)) {
                const [y, m, d] = rawLabel.split("-").map(Number);
                const dt = new Date(Date.UTC(y, m - 1, d));
                return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
              }
              return rawLabel;
            },
            label: (item: any) => `${item.dataset.label}: ${item.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: "rgba(255, 255, 255, 0.04)",
          },
          ticks: {
            color: "#71717a",
            font: { size: 10, family: "monospace" },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          grid: {
            display: true,
            color: "rgba(255, 255, 255, 0.04)",
          },
          ticks: {
            color: "#71717a",
            font: { size: 10, family: "monospace" },
            callback: (val: any) => {
              if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
              return val;
            },
          },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  // Peak & Summary stats
  const totalInPeriod = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return 0;
    return timeseries.reduce((acc, t) => {
      if (selectedMetric === "visitors") return acc + (t.visitors || 0);
      if (selectedMetric === "returning") return acc + (t.returningViews || 0);
      return acc + (t.views || 0);
    }, 0);
  }, [timeseries, selectedMetric]);

  const peakPoint = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return { label: "N/A", value: 0 };
    return timeseries.reduce(
      (peak, t) => {
        const val = selectedMetric === "visitors" ? t.visitors : selectedMetric === "returning" ? t.returningViews || 0 : t.views;
        return val > peak.value ? { label: t.label, value: val } : peak;
      },
      { label: "", value: 0 }
    );
  }, [timeseries, selectedMetric]);

  return (
    <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              Traffic Volume &amp; Audience Trajectory
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time telemetry stream with multi-metric comparative curves
          </p>
        </div>

        {/* Metric Selector Pills & Chart Type */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <div className="flex items-center bg-[#14161f] p-1 rounded-lg border border-white/[0.06] text-xs font-medium flex-wrap">
            <button
              onClick={() => setSelectedMetric("views")}
              className={`px-3 py-1 rounded-md transition cursor-pointer text-xs ${
                selectedMetric === "views"
                  ? "bg-white/[0.1] text-white shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Pageviews
            </button>
            <button
              onClick={() => setSelectedMetric("visitors")}
              className={`px-3 py-1 rounded-md transition cursor-pointer text-xs ${
                selectedMetric === "visitors"
                  ? "bg-white/[0.1] text-white shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Visitors
            </button>
            <button
              onClick={() => setSelectedMetric("returning")}
              className={`px-3 py-1 rounded-md transition cursor-pointer text-xs ${
                selectedMetric === "returning"
                  ? "bg-white/[0.1] text-white shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Returning
            </button>
          </div>

          <div className="flex items-center bg-[#14161f] p-1 rounded-lg border border-white/[0.06] text-xs shrink-0">
            <button
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                chartType === "area" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
              }`}
              title="Area Line Chart"
            >
              Curve
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                chartType === "bar" ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white"
              }`}
              title="Bar Chart"
            >
              Bars
            </button>
          </div>
        </div>
      </div>

      {/* Peak and Volume Micro-KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#14161f] border border-white/[0.06] text-xs">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider block">
            Total in Range
          </span>
          <span className="text-base font-semibold font-mono text-white mt-0.5 block truncate tabular-nums">
            {totalInPeriod.toLocaleString()}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider block truncate">
            Peak Interval ({peakPoint.label})
          </span>
          <span className="text-base font-semibold font-mono text-zinc-200 mt-0.5 block truncate tabular-nums">
            {peakPoint.value.toLocaleString()}
          </span>
        </div>
        <div className="min-w-0 sm:col-span-1">
          <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider block">
            Average per Bucket
          </span>
          <span className="text-base font-semibold font-mono text-zinc-400 mt-0.5 block truncate tabular-nums">
            {timeseries.length > 0 ? Math.round(totalInPeriod / timeseries.length).toLocaleString() : "0"}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        {timeseries.length > 0 ? (
          chartType === "area" ? (
            <Line data={chartData as any} options={options} />
          ) : (
            <Bar data={chartData as any} options={options} />
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs space-y-2">
            <BarChart2 size={28} className="text-zinc-600" />
            <span>No telemetry recorded for this timeframe yet</span>
          </div>
        )}
      </div>
    </div>
  );
}

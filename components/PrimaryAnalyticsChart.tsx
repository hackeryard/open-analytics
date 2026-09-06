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

    const labels = timeseries.map((t) => t.label);

    const values = timeseries.map((t) => {
      if (selectedMetric === "visitors") return t.visitors || 0;
      if (selectedMetric === "returning") return t.returningViews || 0;
      return t.views || 0;
    });

    const metricConfig = {
      views: {
        label: "Total Pageviews",
        borderColor: "#06b6d4", // Cyan
        gradientStart: "rgba(6, 182, 212, 0.35)",
        gradientEnd: "rgba(6, 182, 212, 0.0)",
        barColor: "rgba(6, 182, 212, 0.8)",
      },
      visitors: {
        label: "Unique Visitors",
        borderColor: "#3b82f6", // Blue
        gradientStart: "rgba(59, 130, 246, 0.35)",
        gradientEnd: "rgba(59, 130, 246, 0.0)",
        barColor: "rgba(59, 130, 246, 0.8)",
      },
      returning: {
        label: "Returning Visitors",
        borderColor: "#8b5cf6", // Purple
        gradientStart: "rgba(139, 92, 246, 0.35)",
        gradientEnd: "rgba(139, 92, 246, 0.0)",
        barColor: "rgba(139, 92, 246, 0.8)",
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
          borderWidth: 2.5,
          tension: 0.38,
          fill: true,
          pointBackgroundColor: metricConfig.borderColor,
          pointBorderColor: "#080c14",
          pointBorderWidth: 2,
          pointRadius: timeseries.length > 20 ? 1 : 3.5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: metricConfig.borderColor,
          pointHoverBorderWidth: 3,
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
            color: "#64748b",
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
            color: "#64748b",
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
    <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h2 className="text-base font-black text-white tracking-tight">
              Traffic Volume &amp; Audience Trajectory
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time telemetry stream with multi-metric comparative curves
          </p>
        </div>

        {/* Metric Selector Pills & Chart Type */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs font-bold">
            <button
              onClick={() => setSelectedMetric("views")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedMetric === "views"
                  ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pageviews
            </button>
            <button
              onClick={() => setSelectedMetric("visitors")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedMetric === "visitors"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Unique Visitors
            </button>
            <button
              onClick={() => setSelectedMetric("returning")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedMetric === "returning"
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Returning
            </button>
          </div>

          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartType === "area" ? "bg-white/[0.1] text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Area Line Chart"
            >
              Curve
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartType === "bar" ? "bg-white/[0.1] text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Bar Chart"
            >
              Bars
            </button>
          </div>
        </div>
      </div>

      {/* Peak and Volume Micro-KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block">
            Total in Range
          </span>
          <span className="text-base font-black font-mono text-white mt-0.5 block">
            {totalInPeriod.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block">
            Peak Interval ({peakPoint.label})
          </span>
          <span className="text-base font-black font-mono text-cyan-400 mt-0.5 block">
            {peakPoint.value.toLocaleString()}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block">
            Average per Bucket
          </span>
          <span className="text-base font-black font-mono text-slate-300 mt-0.5 block">
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
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2">
            <BarChart2 size={28} className="text-slate-600" />
            <span>No telemetry recorded for this timeframe yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
